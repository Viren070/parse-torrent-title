/**
 * Builds strings that a given regex matches, by walking its source and
 * emitting one satisfying choice per construct.
 */

const CLASS_ESCAPES: Record<string, string> = {
  d: '5',
  w: 'a',
  s: ' ',
  D: 'a',
  W: ' ',
  S: 'a'
};
const CONTROLS: Record<string, string> = {
  n: '\n',
  t: '\t',
  r: '\r',
  f: '\f',
  v: '\v',
  '0': '0'
};

/** Marks text from a lookaround, which overlaps rather than follows. */
const LOOKAROUND = '\u0000';

type Chooser = (options: number) => number;

function emit(src: string, choose: Chooser): string {
  let i = 0;

  const parseAlternation = (): string => {
    const branches = [parseSequence()];
    while (src[i] === '|') {
      i++;
      branches.push(parseSequence());
    }
    return branches[choose(branches.length)];
  };

  const parseSequence = (): string => {
    let out = '';
    while (i < src.length && src[i] !== '|' && src[i] !== ')')
      out += parseTerm();
    return out;
  };

  const parseTerm = (): string => {
    const atom = parseAtom();
    const quant = parseQuantifier();
    if (quant === null) return atom;
    const count =
      quant.min > 0 ? quant.min : choose(2) === 0 ? 0 : Math.min(1, quant.max);
    return atom.repeat(count);
  };

  const parseQuantifier = (): { min: number; max: number } | null => {
    const ch = src[i];
    let min: number;
    let max: number;
    if (ch === '*') {
      min = 0;
      max = 3;
      i++;
    } else if (ch === '+') {
      min = 1;
      max = 3;
      i++;
    } else if (ch === '?') {
      min = 0;
      max = 1;
      i++;
    } else if (ch === '{') {
      const close = src.indexOf('}', i);
      const body = close === -1 ? null : src.slice(i + 1, close);
      const m = body && /^(\d+)(?:,(\d*))?$/.exec(body);
      if (!m) return null;
      min = parseInt(m[1], 10);
      max =
        m[2] === undefined ? min : m[2] === '' ? min + 2 : parseInt(m[2], 10);
      i = close + 1;
    } else {
      return null;
    }
    if (src[i] === '?') i++;
    return { min, max };
  };

  const parseAtom = (): string => {
    const ch = src[i];
    if (ch === '(') return parseGroup();
    if (ch === '[') return parseClass();
    if (ch === '.') return (i++, ' a.-'[choose(4)]);
    if (ch === '^' || ch === '$') return (i++, '');
    if (ch === '\\') return parseEscape();
    i++;
    return ch;
  };

  const parseGroup = (): string => {
    i++;
    let negative = false;
    if (src[i] === '?') {
      const three = src.slice(i, i + 3);
      const two = src.slice(i, i + 2);
      if (three === '?<=' || three === '?<!') {
        negative = three === '?<!';
        i += 3;
      } else if (two === '?=' || two === '?!') {
        negative = two === '?!';
        i += 2;
      } else if (two === '?:') {
        i += 2;
      } else if (src[i + 1] === '<') {
        i = src.indexOf('>', i) + 1;
      } else {
        const close = src.indexOf(')', i);
        i = close === -1 ? src.length : close + 1;
        return '';
      }
    }
    const body = parseAlternation();
    if (src[i] === ')') i++;
    return negative || body === '' ? '' : LOOKAROUND + body;
  };

  const parseClass = (): string => {
    i++;
    const negated = src[i] === '^';
    if (negated) i++;
    const members: string[] = [];
    let first = true;
    while (i < src.length && (src[i] !== ']' || first)) {
      first = false;
      const low = parseClassChar();
      if (low === null) continue;
      if (src[i] === '-' && i + 1 < src.length && src[i + 1] !== ']') {
        i++;
        const high = parseClassChar();
        if (high !== null) {
          for (let c = low.charCodeAt(0); c <= high.charCodeAt(0); c++) {
            members.push(String.fromCharCode(c));
          }
          continue;
        }
      }
      members.push(low);
    }
    if (src[i] === ']') i++;
    if (negated) {
      for (const candidate of 'abcdefgh123. -') {
        if (!members.includes(candidate)) return candidate;
      }
      return 'z';
    }
    return members.length > 0 ? members[choose(members.length)] : '';
  };

  const parseClassChar = (): string | null => {
    if (src[i] !== '\\') return src[i++];
    const next = src[i + 1];
    if (next === undefined) return (i++, null);
    if (next in CLASS_ESCAPES) return ((i += 2), CLASS_ESCAPES[next]);
    if (next === 'x' || next === 'u') return parseHex();
    i += 2;
    return CONTROLS[next] ?? next;
  };

  const parseEscape = (): string => {
    const next = src[i + 1];
    if (next === undefined) return (i++, '');
    if (next === 'b' || next === 'B') return ((i += 2), '');
    if (next in CLASS_ESCAPES) return ((i += 2), CLASS_ESCAPES[next]);
    if (next === 'x' || next === 'u') return parseHex() ?? '';
    if (/[1-9]/.test(next)) return ((i += 2), '');
    if (next === 'p' || next === 'P') {
      i += 2;
      if (src[i] === '{') i = src.indexOf('}', i) + 1;
      return 'a';
    }
    i += 2;
    return CONTROLS[next] ?? next;
  };

  const parseHex = (): string | null => {
    const m = /^\\(?:x([0-9a-fA-F]{2})|u\{?([0-9a-fA-F]{1,6})\}?)/.exec(
      src.slice(i)
    );
    if (!m) return ((i += 2), null);
    i += m[0].length;
    return String.fromCodePoint(parseInt(m[1] ?? m[2], 16));
  };

  return parseAlternation();
}

/** Up to `limit` distinct strings that `pattern` matches. */
export function samplesMatching(
  pattern: RegExp,
  limit = 3,
  attempts = 200
): string[] {
  const found: string[] = [];
  for (let a = 0; a < attempts; a++) {
    // Each attempt walks a different combination of the available choices.
    let state = a;
    const choose: Chooser = (options) => {
      const value = state % options;
      state = Math.floor(state / options);
      return value;
    };

    let produced: string;
    try {
      produced = emit(pattern.source, choose);
    } catch {
      continue;
    }

    const inlined = produced.split(LOOKAROUND).join('');
    const removed = produced.replace(
      new RegExp(`${LOOKAROUND}[^${LOOKAROUND}]*`, 'g'),
      ''
    );
    // A word boundary at the edge of a pattern needs a neighbour to bind to.
    for (const candidate of [
      inlined,
      removed,
      `x${inlined}x`,
      `Movie.${inlined}.1080p`,
      `x${removed}x`
    ]) {
      if (!candidate || found.includes(candidate)) continue;
      pattern.lastIndex = 0;
      if (!pattern.test(candidate)) continue;
      found.push(candidate);
      if (found.length >= limit) return found;
    }
  }
  return found;
}
