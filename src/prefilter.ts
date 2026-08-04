/**
 * Answers "could this pattern match this title?" with a few bit tests, so the
 * parser can skip regexes that cannot match. Around 2% of handler patterns
 * match any given title.
 *
 * The filter is one-sided: it may pass a pattern that cannot match, but it must
 * never reject one that could. Every approximation here is chosen to fail in
 * that direction.
 *
 * Presence is approximate. The title's 2- and 3-grams are hashed into a bitset
 * and a literal counts as present when all of its grams are, so a literal that
 * really is in the title always passes and an absent one rarely does.
 */

import { Handler } from './types.js';

/**
 * Bit layout of the presence set:
 *   0                     a non-ASCII character
 *   1 .. 128              folded ASCII character c
 *   256 .. 256+8191       a 2- or 3-gram
 *   8448 .. 8448+4095     a 2- or 3-gram with digits folded together
 */
const BIT_NON_ASCII = 0;
const BIT_CHAR_BASE = 1;
const GRAM_BASE = 256;
const GRAM_BITS = 8192;
const GRAM_MASK = GRAM_BITS - 1;
/**
 * Season and episode patterns are shapes rather than words: `s\d{2}` has no
 * literal to test, but does require the folded trigram "s##".
 */
const SHAPE_BASE = GRAM_BASE + GRAM_BITS;
const SHAPE_BITS = 4096;
const SHAPE_MASK = SHAPE_BITS - 1;
const WORDS = (SHAPE_BASE + SHAPE_BITS) / 32;

/** Folded stand-in for any digit, in both titles and derived literals. */
const DIGIT_CODE = 1;
const DIGIT_SYMBOL = String.fromCharCode(DIGIT_CODE);
/** Bounded repeats are unrolled up to this many copies. */
const MAX_REPEAT_EXPANSION = 4;

/** Cap on ANDed groups per pattern. */
const MAX_GROUPS = 4;
/** Alternations wider than this cost more to test than they save. */
const MAX_ALTERNATIVES = 16;
/** Character classes wider than this are treated as unknowable. */
const MAX_CLASS_SIZE = 12;
/** Digit classes wider than this fold to the shape stand-in instead. */
const MAX_DIGIT_CLASS_ENUMERATION = 4;
/** Grams checked per literal. Three puts the false-positive rate near zero. */
const MAX_GRAMS_PER_LITERAL = 3;
/** Unconditional grams checked inline before the general gate. */
const FAST_SLOTS = 3;

// --------------------------------------------------------------------------
// Gram hashing
// --------------------------------------------------------------------------

/**
 * Folds a UTF-16 unit into the 0..127 gram alphabet. Collapsing every non-ASCII
 * unit onto one sentinel is safe because derived literals are ASCII-only, so
 * their grams never contain it.
 */
function foldChar(code: number): number {
  if (code >= 65 && code <= 90) return code + 32; // ASCII upper -> lower
  return code < 128 ? code : 127;
}

function triHash(a: number, b: number, c: number): number {
  return (
    GRAM_BASE +
    ((Math.imul((a << 14) | (b << 7) | c, 0x9e3779b1) >>> 18) & GRAM_MASK)
  );
}

function biHash(a: number, b: number): number {
  return (
    GRAM_BASE +
    ((Math.imul((1 << 21) | (a << 7) | b, 0x9e3779b1) >>> 18) & GRAM_MASK)
  );
}

function shapeTriHash(a: number, b: number, c: number): number {
  return (
    SHAPE_BASE +
    ((Math.imul((a << 14) | (b << 7) | c, 0x9e3779b1) >>> 18) & SHAPE_MASK)
  );
}

function shapeBiHash(a: number, b: number): number {
  return (
    SHAPE_BASE +
    ((Math.imul((1 << 21) | (a << 7) | b, 0x9e3779b1) >>> 18) & SHAPE_MASK)
  );
}

function foldShape(folded: number): number {
  return folded >= 48 && folded <= 57 ? DIGIT_CODE : folded;
}

/**
 * Gram set over the working title. Between resets bits are only ever added, so
 * the set stays a superset of the current title's grams as the parser removes
 * matched text from it.
 */
export class GramSet {
  readonly bits = new Uint32Array(WORDS);
  nonAscii = false;

  reset(title: string): void {
    this.bits.fill(0);
    this.nonAscii = false;
    this.addRange(title, 0, title.length);
  }

  /**
   * Re-adds the grams around `at` after a slice was removed there. Only the
   * seam is new; every other gram of the shortened title was already a gram of
   * the longer one.
   */
  spliced(title: string, at: number): void {
    this.addRange(title, at - 2, Math.min(at + 2, title.length));
  }

  private addRange(title: string, from: number, to: number): void {
    const len = title.length;
    let start = from < 0 ? 0 : from;
    if (start >= len) return;

    // A gram starting at `start - 2` still reaches into the range.
    let prev2 = -1;
    let prev1 = -1;
    if (start >= 2) prev2 = foldChar(title.charCodeAt(start - 2));
    if (start >= 1) prev1 = foldChar(title.charCodeAt(start - 1));
    let shape2 = prev2 < 0 ? -1 : foldShape(prev2);
    let shape1 = prev1 < 0 ? -1 : foldShape(prev1);

    const bits = this.bits;
    let nonAscii = this.nonAscii;
    const end = to > len ? len : to;
    for (let i = start; i < end; i++) {
      const code = title.charCodeAt(i);
      if (code >= 128) nonAscii = true;
      const c = foldChar(code);
      const s = foldShape(c);
      const ch = BIT_CHAR_BASE + c;
      bits[ch >>> 5] |= 1 << (ch & 31);
      if (prev1 >= 0) {
        const b = biHash(prev1, c);
        bits[b >>> 5] |= 1 << (b & 31);
        const sb = shapeBiHash(shape1, s);
        bits[sb >>> 5] |= 1 << (sb & 31);
        if (prev2 >= 0) {
          const t = triHash(prev2, prev1, c);
          bits[t >>> 5] |= 1 << (t & 31);
          const st = shapeTriHash(shape2, shape1, s);
          bits[st >>> 5] |= 1 << (st & 31);
        }
      }
      prev2 = prev1;
      prev1 = c;
      shape2 = shape1;
      shape1 = s;
    }
    if (nonAscii) bits[BIT_NON_ASCII >>> 5] |= 1 << (BIT_NON_ASCII & 31);
    this.nonAscii = nonAscii;
  }
}

/** Bits a literal requires, at most {@link MAX_GRAMS_PER_LITERAL} of them. */
function literalGrams(literal: string): number[] {
  // Claiming only "some non-ASCII character" avoids having to model /i case
  // folding outside ASCII, where a wrong answer would be unsound.
  for (let i = 0; i < literal.length; i++) {
    if (literal.charCodeAt(i) >= 128) return [BIT_NON_ASCII];
  }

  const lower = literal.toLowerCase();
  const n = lower.length;
  const codes = new Array<number>(n);
  // A literal carrying the digit stand-in describes a shape, so it is tested
  // against the folded region, with its own digits folded to match.
  let shaped = false;
  for (let i = 0; i < n; i++) {
    codes[i] = foldChar(lower.charCodeAt(i));
    if (codes[i] === DIGIT_CODE) shaped = true;
  }

  if (n === 0) return [];
  if (!shaped) {
    if (n === 1) return [BIT_CHAR_BASE + codes[0]];
    if (n === 2) return [biHash(codes[0], codes[1])];
  } else {
    for (let i = 0; i < n; i++) codes[i] = foldShape(codes[i]);
    // One folded character says nothing beyond "a digit is present".
    if (n === 1) return [];
    if (n === 2) return [shapeBiHash(codes[0], codes[1])];
  }

  const positions = n - 2;
  const take = Math.min(MAX_GRAMS_PER_LITERAL, positions);
  const grams: number[] = [];
  // Spaced samples beat consecutive ones: neighbouring trigrams overlap, so
  // their presence is correlated.
  for (let k = 0; k < take; k++) {
    const p = take === 1 ? 0 : Math.round((k * (positions - 1)) / (take - 1));
    const h = shaped
      ? shapeTriHash(codes[p], codes[p + 1], codes[p + 2])
      : triHash(codes[p], codes[p + 1], codes[p + 2]);
    if (!grams.includes(h)) grams.push(h);
  }
  return grams;
}

// --------------------------------------------------------------------------
// Regex source -> required literals
// --------------------------------------------------------------------------

/**
 * `lit` holds a set of alternatives, so `s[1-9]-` derives {s1-, ... s9-} rather
 * than the useless single character "s".
 *
 * `exact` marks a literal whose set covers every string it can match. Only an
 * exact literal may have text appended: `\d{1,3}` matches up to three digits
 * while its set names one, so what follows it is not adjacent to the set.
 */
type Node =
  | { t: 'lit'; set: string[]; exact: boolean }
  | { t: 'opaque' }
  | { t: 'seq'; items: Node[] }
  | { t: 'alt'; options: Node[] }
  | { t: 'rep'; min: number; node: Node }
  | { t: 'look'; positive: boolean; node: Node };

const OPAQUE: Node = { t: 'opaque' };

/** Stands for "some non-ASCII character"; resolves to the BIT_NON_ASCII bit. */
const NON_ASCII_MARKER = '\u0080';

function hasNonAscii(text: string): boolean {
  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) >= 128) return true;
  }
  return false;
}

/** Concatenation of two literal sets, or null when it would grow too wide. */
function crossProduct(left: string[], right: string[]): string[] | null {
  if (left.length * right.length > MAX_ALTERNATIVES) return null;
  // Mixing scripts would collapse a usable ASCII literal into the single
  // non-ASCII bit, so those stay separate.
  const leftNonAscii = left.some(hasNonAscii);
  if (leftNonAscii !== right.some(hasNonAscii)) return null;
  const out: string[] = [];
  for (const a of left) {
    for (const b of right) out.push(a + b);
  }
  return out;
}

/**
 * Parses just enough regex syntax to find guaranteed-present literals.
 * Anything not understood becomes `opaque`, which contributes no literals and
 * therefore only ever weakens the filter.
 */
class SourceParser {
  private i = 0;

  constructor(private readonly src: string) {}

  parse(): Node {
    const node = this.parseAlternation();
    return this.i < this.src.length ? OPAQUE : node;
  }

  private parseAlternation(): Node {
    const options: Node[] = [this.parseSequence()];
    while (this.src[this.i] === '|') {
      this.i++;
      options.push(this.parseSequence());
    }
    if (options.length === 1) return options[0];

    // A choice between exact literals is itself an exact literal, so
    // `(?:e|ep)` can still join the text around it.
    const merged: string[] = [];
    let exact = true;
    for (const option of options) {
      if (option.t !== 'lit' || !option.exact) {
        exact = false;
        break;
      }
      for (const literal of option.set) {
        if (!merged.includes(literal)) merged.push(literal);
      }
    }
    if (exact && merged.length > 0 && merged.length <= MAX_ALTERNATIVES) {
      return { t: 'lit', set: merged, exact: true };
    }
    return { t: 'alt', options };
  }

  /**
   * Concatenates adjacent literals into one longer, more selective literal.
   * `open` tracks whether the run may still be extended.
   */
  private parseSequence(): Node {
    const items: Node[] = [];
    let open = false;

    const append = (set: string[], keepOpen: boolean): void => {
      const last = items[items.length - 1];
      const merged =
        open && last !== undefined && last.t === 'lit'
          ? crossProduct(last.set, set)
          : null;
      if (merged !== null && last !== undefined && last.t === 'lit') {
        last.set = merged;
        last.exact = keepOpen;
      } else {
        items.push({ t: 'lit', set, exact: keepOpen });
      }
      open = keepOpen;
    };

    while (this.i < this.src.length) {
      const ch = this.src[this.i];
      if (ch === '|' || ch === ')') break;
      const atom = this.parseAtom();
      const quant = this.parseQuantifier();

      if (atom.t !== 'lit') {
        if (quant === null || quant.min > 0) {
          items.push(quant === null ? atom : { t: 'rep', min: 1, node: atom });
        } else {
          items.push(OPAQUE);
        }
        open = false;
        continue;
      }

      if (quant === null) {
        append(atom.set, atom.exact);
      } else if (quant.min === 0) {
        items.push(OPAQUE);
        open = false;
      } else if (atom.set.length === 1 && atom.exact) {
        const copies = Math.min(quant.min, MAX_REPEAT_EXPANSION);
        append(
          [atom.set[0].repeat(copies)],
          quant.max === quant.min && quant.min <= MAX_REPEAT_EXPANSION
        );
      } else {
        // Only the first repetition is pinned to the preceding text.
        append(atom.set, false);
      }
    }
    if (items.length === 0) return OPAQUE;
    return items.length === 1 ? items[0] : { t: 'seq', items };
  }

  private parseQuantifier(): { min: number; max: number } | null {
    const ch = this.src[this.i];
    let min: number;
    let max: number;
    if (ch === '*') {
      min = 0;
      max = Infinity;
      this.i++;
    } else if (ch === '+') {
      min = 1;
      max = Infinity;
      this.i++;
    } else if (ch === '?') {
      min = 0;
      max = 1;
      this.i++;
    } else if (ch === '{') {
      const close = this.src.indexOf('}', this.i);
      if (close === -1) return null;
      const body = this.src.slice(this.i + 1, close);
      const m = /^(\d+)(?:,(\d*))?$/.exec(body);
      if (!m) return null; // a literal "{...}", not a quantifier
      min = parseInt(m[1], 10);
      max =
        m[2] === undefined ? min : m[2] === '' ? Infinity : parseInt(m[2], 10);
      this.i = close + 1;
    } else {
      return null;
    }
    if (this.src[this.i] === '?') this.i++; // lazy marker, same bounds
    return { min, max };
  }

  private parseAtom(): Node {
    const src = this.src;
    const ch = src[this.i];

    if (ch === '(') return this.parseGroup();
    if (ch === '[') return this.parseCharClass();
    if (ch === '.' || ch === '^' || ch === '$') {
      this.i++;
      return OPAQUE;
    }
    if (ch === '\\') return this.parseEscape();
    this.i++;
    return { t: 'lit', set: [ch], exact: true };
  }

  private parseGroup(): Node {
    const src = this.src;
    this.i++; // '('
    let positive: boolean | null = null;
    if (src[this.i] === '?') {
      const two = src.slice(this.i, this.i + 2);
      const three = src.slice(this.i, this.i + 3);
      if (three === '?<=') {
        positive = true;
        this.i += 3;
      } else if (three === '?<!') {
        positive = false;
        this.i += 3;
      } else if (two === '?=') {
        positive = true;
        this.i += 2;
      } else if (two === '?!') {
        positive = false;
        this.i += 2;
      } else if (two === '?:') {
        this.i += 2;
      } else if (src[this.i + 1] === '<') {
        // named capture (?<name>...)
        const close = src.indexOf('>', this.i);
        if (close === -1) {
          this.i = src.length;
          return OPAQUE;
        }
        this.i = close + 1;
      } else {
        // inline flags or anything else unrecognised
        const close = src.indexOf(')', this.i);
        this.i = close === -1 ? src.length : close + 1;
        return OPAQUE;
      }
    }

    const body = this.parseAlternation();
    if (src[this.i] !== ')') {
      this.i = src.length;
      return OPAQUE;
    }
    this.i++;

    if (positive === null) return body;
    return { t: 'look', positive, node: body };
  }

  /** Expands a small positive class into its alternatives. */
  private parseCharClass(): Node {
    const src = this.src;
    const start = this.i;
    this.i++; // '['
    const negated = src[this.i] === '^';
    if (negated) this.i++;

    const ranges: [number, number][] = [];
    let understood = !negated;
    let first = true;

    while (this.i < src.length && (src[this.i] !== ']' || first)) {
      first = false;
      const low = this.readClassChar();
      if (low === null) {
        understood = false;
        break;
      }
      let high = low;
      if (
        src[this.i] === '-' &&
        this.i + 1 < src.length &&
        src[this.i + 1] !== ']'
      ) {
        this.i++;
        const upper = this.readClassChar();
        if (upper === null) {
          understood = false;
          break;
        }
        high = upper;
      }
      ranges.push([low, high]);
    }

    // Resynchronise on the closing bracket regardless of what was understood.
    this.i = start + 1;
    if (src[this.i] === '^') this.i++;
    if (src[this.i] === ']') this.i++;
    while (this.i < src.length && src[this.i] !== ']') {
      this.i += src[this.i] === '\\' ? 2 : 1;
    }
    this.i++;

    if (!understood || ranges.length === 0) return OPAQUE;

    // Either every alternative is accounted for or the class is given up on.
    // A class wholly outside ASCII needs no enumeration.
    if (ranges.every(([low]) => low >= 128)) {
      return { t: 'lit', set: [NON_ASCII_MARKER], exact: false };
    }
    let size = 0;
    for (const [low, high] of ranges) size += high - low + 1;

    // A narrow digit class is worth spelling out; a wide one is better as the
    // shape stand-in, which stays a single alternative when concatenated.
    if (
      size > MAX_DIGIT_CLASS_ENUMERATION &&
      ranges.every(([low, high]) => low >= 48 && high <= 57)
    ) {
      return { t: 'lit', set: [DIGIT_SYMBOL], exact: true };
    }
    if (size > MAX_CLASS_SIZE) return OPAQUE;

    const members: string[] = [];
    for (const [low, high] of ranges) {
      for (let c = low; c <= high; c++) members.push(String.fromCharCode(c));
    }
    return { t: 'lit', set: members, exact: true };
  }

  /** One class member, or null for a class escape such as \d or \w. */
  private readClassChar(): number | null {
    const src = this.src;
    const ch = src[this.i];
    if (ch !== '\\') {
      this.i++;
      return ch.charCodeAt(0);
    }
    const next = src[this.i + 1];
    if (next === undefined || /[dDwWsSpPbB0-9]/.test(next)) return null;
    if (next === 'x' || next === 'u') {
      const hex =
        next === 'x'
          ? /^\\x([0-9a-fA-F]{2})/.exec(src.slice(this.i))
          : /^\\u\{?([0-9a-fA-F]{1,6})\}?/.exec(src.slice(this.i));
      if (!hex) return null;
      this.i += hex[0].length;
      return parseInt(hex[1], 16);
    }
    const controls: Record<string, string> = {
      n: '\n',
      t: '\t',
      r: '\r',
      f: '\f',
      v: '\v'
    };
    this.i += 2;
    return (controls[next] ?? next).charCodeAt(0);
  }

  private parseEscape(): Node {
    const src = this.src;
    const ch = src[this.i + 1];
    if (ch === undefined) {
      this.i++;
      return OPAQUE;
    }

    if (ch === 'd') {
      this.i += 2;
      return { t: 'lit', set: [DIGIT_SYMBOL], exact: true };
    }
    // Class escapes, anchors, backreferences and property escapes: unknowable.
    // \p and \P stay opaque under both flag modes, since with /u they are
    // property classes and without it the letter p or P.
    if (/[bBDwWsSpP1-9kK]/.test(ch)) {
      this.i += 2;
      return OPAQUE;
    }
    if (ch === 'x' || ch === 'u') {
      const hex =
        ch === 'x'
          ? /^\\x([0-9a-fA-F]{2})/.exec(src.slice(this.i))
          : /^\\u\{?([0-9a-fA-F]{1,6})\}?/.exec(src.slice(this.i));
      if (!hex) {
        this.i += 2;
        return OPAQUE;
      }
      this.i += hex[0].length;
      const code = parseInt(hex[1], 16);
      return {
        t: 'lit',
        set: [code < 128 ? String.fromCharCode(code) : NON_ASCII_MARKER],
        exact: code < 128
      };
    }

    const controls: Record<string, string> = {
      n: '\n',
      t: '\t',
      r: '\r',
      f: '\f',
      v: '\v',
      '0': '\0'
    };
    this.i += 2;
    if (ch in controls) return { t: 'lit', set: [controls[ch]], exact: true };
    return { t: 'lit', set: [ch], exact: true }; // identity escape: \. \- \/ ...
  }
}

function usableGroup(group: string[] | null): group is string[] {
  return (
    group !== null &&
    group.length > 0 &&
    group.length <= MAX_ALTERNATIVES &&
    group.every((literal) => literal.length > 0)
  );
}

/** How selective one literal's bits are: longer is sharper, capped at 3 grams. */
function literalStrength(literal: string): number {
  let digits = 0;
  for (let i = 0; i < literal.length; i++) {
    const code = literal.charCodeAt(i);
    // A non-ASCII literal collapses to a single bit that most titles lack, so
    // it filters about as well as a solid trigram.
    if (code >= 128) return 4;
    if (code === DIGIT_CODE) digits++;
  }
  // Folding every digit together costs roughly half a character of precision.
  return Math.min(literal.length - digits * 0.5, MAX_GRAMS_PER_LITERAL + 2);
}

/**
 * Ranks groups by discriminating power: a long required literal beats a short
 * one, and a narrow alternation beats a wide one.
 */
function groupStrength(group: string[]): number {
  const weakest = group.reduce((a, l) => Math.min(a, literalStrength(l)), 99);
  return weakest * 100 - group.length;
}

/** Literals that must appear if `node` participates in a match, or null. */
function requiredLiterals(node: Node): string[] | null {
  switch (node.t) {
    case 'lit':
      return node.set;
    case 'rep':
      return node.min > 0 ? requiredLiterals(node.node) : null;
    case 'look':
      // A satisfied positive lookaround proves its text is in the subject.
      return node.positive ? requiredLiterals(node.node) : null;
    case 'seq': {
      let best: string[] | null = null;
      let bestScore = -Infinity;
      for (const item of node.items) {
        const group = requiredLiterals(item);
        if (!usableGroup(group)) continue;
        const score = groupStrength(group);
        if (score > bestScore) {
          bestScore = score;
          best = group;
        }
      }
      return best;
    }
    case 'alt': {
      // Every branch must contribute, otherwise one branch could match with
      // none of the collected literals present.
      const all: string[] = [];
      for (const option of node.options) {
        const group = requiredLiterals(option);
        if (group === null) return null;
        all.push(...group);
        if (all.length > MAX_ALTERNATIVES) return null;
      }
      const unique = [...new Set(all)];
      return unique.length > 0 ? unique : null;
    }
    default:
      return null;
  }
}

/**
 * Collects every group a match must satisfy. Concatenation, a positive
 * lookaround and a repeat of at least one all pass their contents through, so
 * nesting is flattened: a date pattern requires both a year and a month name,
 * and keeping only the stronger of the two halves the filter.
 */
function collectGroups(node: Node, out: (string[] | null)[]): void {
  switch (node.t) {
    case 'seq':
      for (const item of node.items) collectGroups(item, out);
      break;
    case 'rep':
      if (node.min > 0) collectGroups(node.node, out);
      break;
    case 'look':
      if (node.positive) collectGroups(node.node, out);
      break;
    default:
      out.push(requiredLiterals(node));
  }
}

/** Groups of literals that must ALL be satisfied for `pattern` to match. */
export function deriveLiteralGroups(pattern: RegExp): string[][] {
  const root = new SourceParser(pattern.source).parse();
  const raw: (string[] | null)[] = [];
  collectGroups(root, raw);

  const groups: string[][] = [];
  const seen = new Set<string>();
  for (const group of raw) {
    if (!usableGroup(group)) continue;
    const normalised = [...new Set(group.map((l) => l.toLowerCase()))].sort();
    const key = normalised.join('');
    if (seen.has(key)) continue;
    seen.add(key);
    groups.push(normalised);
  }
  groups.sort((a, b) => groupStrength(b) - groupStrength(a));
  return groups.slice(0, MAX_GROUPS);
}

// --------------------------------------------------------------------------
// Compiled gate table
// --------------------------------------------------------------------------

export interface Prefilter {
  /** Up to three unconditionally required grams per handler, -1 where absent. */
  readonly gram0: Int32Array;
  readonly gram1: Int32Array;
  readonly gram2: Int32Array;
  /** Offset into `gates` for handlers needing the general test, else -1. */
  readonly gateOff: Int32Array;
  readonly gates: Int32Array;
  /** Handlers that must always run when the title has non-ASCII text. */
  readonly unicodeSensitive: Uint8Array;
  readonly gatedCount: number;
}

/**
 * Under /u plus /i, simple case folding maps KELVIN SIGN and LONG S onto ASCII
 * k and s, so such a pattern can match text whose ASCII form never appears.
 * Its gate is disabled for titles containing non-ASCII characters.
 */
function isUnicodeSensitive(pattern: RegExp): boolean {
  return pattern.flags.includes('u') && pattern.flags.includes('i');
}

export function buildPrefilter(handlers: Handler[]): Prefilter {
  const n = handlers.length;
  const gram0 = new Int32Array(n).fill(-1);
  const gram1 = new Int32Array(n).fill(-1);
  const gram2 = new Int32Array(n).fill(-1);
  const dense = [gram0, gram1, gram2];
  const gateOff = new Int32Array(n).fill(-1);
  const unicodeSensitive = new Uint8Array(n);
  const gates: number[] = [];
  let gatedCount = 0;

  for (let i = 0; i < n; i++) {
    const handler = handlers[i];
    if (!handler.pattern) continue;
    if (isUnicodeSensitive(handler.pattern)) unicodeSensitive[i] = 1;

    // An alternative with no grams is vacuously satisfied, which makes its
    // whole group unable to reject anything.
    const groups = deriveLiteralGroups(handler.pattern).filter((group) =>
      group.every((literal) => literalGrams(literal).length > 0)
    );
    if (groups.length === 0) continue;

    // Single-literal groups are unconditional, so their grams go in the dense
    // arrays the parse loop tests inline.
    const inline: number[] = [];
    const remaining: string[][] = [];
    for (const group of groups) {
      if (group.length === 1 && inline.length < FAST_SLOTS) {
        for (const gram of literalGrams(group[0])) {
          if (inline.length < FAST_SLOTS && !inline.includes(gram)) {
            inline.push(gram);
          }
        }
      } else {
        remaining.push(group);
      }
    }

    if (inline.length === 0 && remaining.length === 0) continue;
    gatedCount++;
    for (let k = 0; k < inline.length; k++) dense[k][i] = inline[k];

    if (remaining.length === 0) continue;

    gateOff[i] = gates.length;
    gates.push(remaining.length);
    for (const group of remaining) {
      const groupStart = gates.length;
      gates.push(0, group.length); // skip placeholder, alternative count
      for (const literal of group) {
        const grams = literalGrams(literal);
        gates.push(grams.length, ...grams);
      }
      gates[groupStart] = gates.length - groupStart;
    }
  }

  return {
    gram0,
    gram1,
    gram2,
    gateOff,
    gates: Int32Array.from(gates),
    unicodeSensitive,
    gatedCount
  };
}

/** General gate: AND over groups, OR over a group's alternatives. */
export function gateAllows(
  gates: Int32Array,
  offset: number,
  bits: Uint32Array
): boolean {
  let p = offset;
  const groupCount = gates[p++];
  for (let g = 0; g < groupCount; g++) {
    const groupStart = p;
    const skip = gates[p];
    const altCount = gates[p + 1];
    let q = p + 2;
    let satisfied = false;
    for (let a = 0; a < altCount; a++) {
      const gramCount = gates[q++];
      let all = true;
      for (let k = 0; k < gramCount; k++) {
        const h = gates[q + k];
        if ((bits[h >>> 5] & (1 << (h & 31))) === 0) {
          all = false;
          break;
        }
      }
      q += gramCount;
      if (all) {
        satisfied = true;
        break;
      }
    }
    if (!satisfied) return false;
    p = groupStart + skip;
  }
  return true;
}

const openCache = new Map<number, Prefilter>();

/** A gate table that rejects nothing, so every pattern runs. */
export function openPrefilter(size: number): Prefilter {
  let built = openCache.get(size);
  if (built === undefined) {
    const empty = new Int32Array(size).fill(-1);
    built = {
      gram0: empty,
      gram1: empty,
      gram2: empty,
      gateOff: empty,
      gates: new Int32Array(0),
      unicodeSensitive: new Uint8Array(size),
      gatedCount: 0
    };
    openCache.set(size, built);
  }
  return built;
}

const cache = new WeakMap<Handler[], Prefilter>();

/**
 * Prefilter for a handler list, built once per list. Parser.addHandler appends
 * to a list that may already have been compiled, so the cached entry is only
 * reused while the length still matches.
 */
export function prefilterFor(handlers: Handler[]): Prefilter {
  const built = cache.get(handlers);
  if (built !== undefined && built.gram0.length === handlers.length) {
    return built;
  }
  const fresh = buildPrefilter(handlers);
  cache.set(handlers, fresh);
  return fresh;
}
