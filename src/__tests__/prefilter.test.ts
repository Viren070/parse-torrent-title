/**
 * The prefilter is only allowed to fail in one direction: it may let a
 * non-matching pattern through, but it must never reject a pattern that could
 * match. These tests check that property directly against every default
 * handler, since a false negative drops a field rather than throwing.
 */
import { handlers } from '../handlers';
import { Parser } from '../index';
import {
  GramSet,
  buildPrefilter,
  deriveLiteralGroups,
  gateAllows
} from '../prefilter';

// Every title the suite parses anywhere, so soundness is checked against the
// full range of real inputs rather than a sample.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildCorpus } = require('../../bench/corpus.cjs');
const corpus: string[] = buildCorpus();

const prefilter = buildPrefilter(handlers);
const grams = new GramSet();

function gateRejects(index: number, title: string): boolean {
  grams.reset(title);
  if (grams.nonAscii && prefilter.unicodeSensitive[index] === 1) return false;
  for (const dense of [prefilter.gram0, prefilter.gram1, prefilter.gram2]) {
    const gram = dense[index];
    if (gram < 0) break;
    if ((grams.bits[gram >>> 5] & (1 << (gram & 31))) === 0) return true;
  }
  const off = prefilter.gateOff[index];
  if (off >= 0 && !gateAllows(prefilter.gates, off, grams.bits)) return true;
  return false;
}

describe('prefilter literal derivation', () => {
  // Digits collapse to one stand-in character, so a derived literal for a
  // pattern like `s\d{2}` is a shape rather than text.
  const DIGIT = String.fromCharCode(1);

  test('derives the literals a pattern cannot match without', () => {
    expect(deriveLiteralGroups(/\bBlu[ .-]*Ray\b/i)).toEqual([
      ['blu'],
      ['ray']
    ]);
    expect(deriveLiteralGroups(/\b(?:WEBRip|BluRay)\b/i)).toEqual([
      ['bluray', 'webrip']
    ]);
    // A positive lookahead's text must also be present.
    expect(deriveLiteralGroups(/\bremux\b(?=.*bluray)/i)).toContainEqual([
      'bluray'
    ]);
    // A small class folds into its neighbours instead of being given up on.
    expect(deriveLiteralGroups(/x26[45]/i)).toEqual([['x264', 'x265']]);
    // An exact repeat is unrolled so it can carry the text beside it.
    expect(deriveLiteralGroups(/\bS\d{2}E/i)).toEqual([[`s${DIGIT}${DIGIT}e`]]);
    // A variable repeat is not: only its first character is pinned in place,
    // so the trailing "E" becomes a group of its own.
    expect(deriveLiteralGroups(/\bS\d{1,2}E/i)).toEqual([[`s${DIGIT}`], ['e']]);
  });

  test('derives nothing usable from patterns with no required literal', () => {
    expect(deriveLiteralGroups(/[a-z]+/i)).toEqual([]);
    // A negative lookahead proves nothing about what IS present.
    expect(deriveLiteralGroups(/(?!nope)\d+/)).toEqual([[DIGIT]]);
    // An alternation is only usable when every branch contributes.
    expect(deriveLiteralGroups(/(?:bluray|[a-z]+)/i)).toEqual([]);
    // A lone digit says nothing beyond "a digit is present", so it gates
    // nothing once compiled.
    const compiled = buildPrefilter([{ field: 'x', pattern: /\d{1,4}/ }]);
    expect(compiled.gatedCount).toBe(0);
  });

  test('gates a large majority of the default handlers', () => {
    const withPattern = handlers.filter((h) => h.pattern).length;
    expect(prefilter.gatedCount).toBeGreaterThan(withPattern * 0.7);
  });
});

describe('prefilter cache', () => {
  test('picks up handlers added after a first parse', () => {
    const parser = new Parser().addDefaultHandlers();
    expect(parser.parse('Movie.2024.1080p').year).toBe('2024');

    parser.addHandler({
      field: 'customTag',
      pattern: /\bZZTOP\b/i,
      transform: (_input, m) => {
        m.value = 'yes';
      }
    });
    expect(
      parser.parse<{ customTag: string }>('Movie.ZZTOP.2024').customTag
    ).toBe('yes');
  });
});

describe('prefilter soundness', () => {
  const patternHandlers = handlers
    .map((handler, index) => ({ handler, index }))
    .filter((entry) => entry.handler.pattern);

  test('never rejects a pattern that matches a corpus title', () => {
    const violations: string[] = [];
    for (const title of corpus) {
      // parse() normalises before matching; mirror that here.
      const normalised = title.replace(/\s+/g, ' ').replace(/_+/g, ' ');
      for (const { handler, index } of patternHandlers) {
        handler.pattern!.lastIndex = 0;
        if (!handler.pattern!.test(normalised)) continue;
        if (gateRejects(index, normalised)) {
          violations.push(`${handler.pattern} rejected for "${normalised}"`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  test('never rejects a pattern that matches a synthetic string', () => {
    // Random strings drawn from the alphabet real release names use, to reach
    // matches the curated corpus never produces.
    const alphabet =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJ0123456789 .-_[]()+&/x';
    let seed = 0x2545f491;
    const random = () => {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return (seed >>> 0) / 0x100000000;
    };

    const violations: string[] = [];
    for (let n = 0; n < 4000; n++) {
      const length = 4 + Math.floor(random() * 60);
      let subject = '';
      for (let c = 0; c < length; c++) {
        subject += alphabet[Math.floor(random() * alphabet.length)];
      }
      for (const { handler, index } of patternHandlers) {
        handler.pattern!.lastIndex = 0;
        if (!handler.pattern!.test(subject)) continue;
        if (gateRejects(index, subject)) {
          violations.push(`${handler.pattern} rejected for "${subject}"`);
        }
      }
    }
    expect(violations).toEqual([]);
  });
});
