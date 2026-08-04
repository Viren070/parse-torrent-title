import { Handler, ParsedResult, ParseMeta, ValueSet } from './types.js';
import {
  cleanTitle,
  beforeTitleRegex,
  whitespacesRegex,
  underscoresRegex,
  matchIndices,
  trailingEpisodePattern,
  extractEpisodeTitle,
  wordCharRegex
} from './utils.js';
import {
  GramSet,
  gateAllows,
  openPrefilter,
  prefilterFor
} from './prefilter.js';

/** Shared scratch: parse() is synchronous and never re-entered by a handler. */
const grams = new GramSet();

/** Whitespace that `\s+` -> " " would actually change: a run, or a non-space. */
const needsWhitespaceCollapse = /\s\s|[^\S ]/;

const OPEN_SQUARE_BRACKET = 91;

/**
 * Fields that use value sets
 */
const VALUE_SET_FIELDS = new Set([
  'audio',
  'channels',
  'editions',
  'hdr',
  'languages',
  'releaseTypes'
]);

function hasValueSet(field: string): boolean {
  return VALUE_SET_FIELDS.has(field);
}

const letterRegex = /\p{L}/u;

/**
 * Main parse function matching Go parse() function
 */
export function parse(
  title: string,
  handlers: Handler[],
  usePrefilter = true
): ParsedResult {
  const result = new Map<string, ParseMeta>();

  // The replace rewrites the whole string even when every run is already a
  // single space, which is the usual case.
  if (needsWhitespaceCollapse.test(title)) {
    title = title.replace(whitespacesRegex, ' ');
  }
  if (title.indexOf('_') !== -1) {
    title = title.replace(underscoresRegex, ' ');
  }

  let endOfTitle = title.length;
  // Index just past the episode marker in the (mutating) working string;
  // the episode title, when present, starts here.
  let episodeTitleStart = -1;
  let episodeMarkerSeen = false;

  const prefilter = usePrefilter
    ? prefilterFor(handlers)
    : openPrefilter(handlers.length);
  const { gram0, gram1, gram2, gateOff, gates, unicodeSensitive } = prefilter;
  grams.reset(title);
  const bits = grams.bits;
  const nonAscii = grams.nonAscii;

  for (let hi = 0; hi < handlers.length; hi++) {
    // A handler whose pattern fails to match continues without reading or
    // writing `result`, so proving that here is equivalent and much cheaper.
    // Handlers with no pattern are never gated.
    if (!(nonAscii && unicodeSensitive[hi] === 1)) {
      let gram = gram0[hi];
      if (gram >= 0) {
        if ((bits[gram >>> 5] & (1 << (gram & 31))) === 0) continue;
        gram = gram1[hi];
        if (gram >= 0) {
          if ((bits[gram >>> 5] & (1 << (gram & 31))) === 0) continue;
          gram = gram2[hi];
          if (gram >= 0 && (bits[gram >>> 5] & (1 << (gram & 31))) === 0) {
            continue;
          }
        }
      }
      const off = gateOff[hi];
      if (off >= 0 && !gateAllows(gates, off, bits)) continue;
    }

    const handler = handlers[hi];
    const field = handler.field;
    let skipFromTitle = handler.skipFromTitle ?? false;

    let m = result.get(field);
    const mFound = m !== undefined;

    if (handler.pattern) {
      if (mFound && !handler.keepMatching) {
        continue;
      }

      const match = handler.pattern.exec(title);
      if (match === null) {
        continue;
      }

      // Locating the capture groups costs a scan each, and only validators and
      // matchGroup read them.
      const matchStart = match.index;
      let idxs: number[] | null = null;
      if (handler.validateMatch) {
        idxs = matchIndices(match, title);
        if (!handler.validateMatch(title, idxs)) {
          continue;
        }
      }

      let shouldSkip = false;
      if (handler.skipIfFirst) {
        let hasOther = false;
        let hasBefore = false;
        for (const [f, fm] of result) {
          if (f !== field && fm.mValue) {
            hasOther = true;
            if (matchStart >= fm.mIndex) {
              hasBefore = true;
              break;
            }
          }
        }
        shouldSkip = hasOther && !hasBefore;
      }

      if (shouldSkip) {
        continue;
      }

      if (handler.skipIfBefore && handler.skipIfBefore.length > 0) {
        for (const skipField of handler.skipIfBefore) {
          const fm = result.get(skipField);
          if (fm && matchStart < fm.mIndex) {
            shouldSkip = true;
            break;
          }
        }
        if (shouldSkip) {
          continue;
        }
      }

      const rawMatchedPart = match[0];
      let matchedPart = rawMatchedPart;

      if (match.length > 1) {
        // Default to capture group 1 if valueGroup is not specified
        if (handler.valueGroup === undefined || handler.valueGroup === 0) {
          matchedPart = match[1] ?? '';
        } else if (match.length > handler.valueGroup) {
          matchedPart = match[handler.valueGroup] ?? '';
        }
      }

      // beforeTitleRegex is anchored on an opening bracket.
      if (title.charCodeAt(0) === OPEN_SQUARE_BRACKET) {
        const beforeTitleMatch = beforeTitleRegex.exec(title);
        if (beforeTitleMatch && beforeTitleMatch[0].includes(rawMatchedPart)) {
          skipFromTitle = true;
        }
      }

      if (!mFound) {
        m = {
          mIndex: 0,
          mValue: '',
          value: hasValueSet(field) ? new ValueSet<any>() : null,
          remove: false,
          processed: false
        };
        result.set(field, m);
      }

      if (m) {
        m.mIndex = matchStart;
        m.mValue = rawMatchedPart;
        if (!hasValueSet(field)) {
          m.value = matchedPart;
        }

        if (handler.matchGroup) {
          if (idxs === null) idxs = matchIndices(match, title);
          m.mIndex = idxs[handler.matchGroup * 2];
          m.mValue = match[handler.matchGroup] ?? '';
        }
      }
    }

    if (handler.process) {
      if (mFound && m) {
        m = handler.process(title, m, result);
      } else {
        const emptyMeta: ParseMeta = {
          mIndex: 0,
          mValue: '',
          value: null,
          remove: false,
          processed: false
        };
        m = handler.process(title, emptyMeta, result);
        if (m.value !== null) {
          result.set(field, m);
        }
      }
    }

    if (!m) {
      continue;
    }

    if (m.value !== null && handler.transform) {
      handler.transform(title, m, result);
    }

    if (m.value === null) {
      result.delete(field);
      continue;
    }

    if (
      !result.has(field) ||
      (m.processed && !handler.keepMatching && !hasValueSet(field))
    ) {
      continue;
    }

    // Only the first episode marker can anchor an episode title, and only if
    // it stands on its own
    const isFirstEpisodeMarker =
      field === 'episodes' && !episodeMarkerSeen && m.mValue !== '';
    let markerAnchorsTitle = false;
    if (isFirstEpisodeMarker) {
      const leadingBracket =
        title.charCodeAt(0) === OPEN_SQUARE_BRACKET
          ? beforeTitleRegex.exec(title)
          : null;
      // A marker whose text begins inside a word is a mis-parse
      // A digit before it is normal
      const startsMidWord =
        m.mIndex > 0 &&
        letterRegex.test(title[m.mIndex - 1]) &&
        wordCharRegex.test(m.mValue[0]);
      const insideLeadingBracket =
        leadingBracket !== null && m.mIndex < leadingBracket[0].length;
      markerAnchorsTitle = !startsMidWord && !insideLeadingBracket;
    }

    const removed = handler.remove || m.remove;
    if (removed) {
      m.remove = true;
      // keep the episode-title anchor aligned with the mutating string
      if (episodeTitleStart >= 0 && m.mIndex < episodeTitleStart) {
        episodeTitleStart =
          m.mIndex + m.mValue.length <= episodeTitleStart
            ? episodeTitleStart - m.mValue.length
            : m.mIndex;
      }
      title =
        title.substring(0, m.mIndex) +
        title.substring(m.mIndex + m.mValue.length);
      grams.spliced(title, m.mIndex);
    }

    if (isFirstEpisodeMarker) {
      episodeMarkerSeen = true;
      if (markerAnchorsTitle) {
        episodeTitleStart = removed ? m.mIndex : m.mIndex + m.mValue.length;
      }
    }

    if (!skipFromTitle && m.mIndex !== 0 && m.mIndex < endOfTitle) {
      endOfTitle = m.mIndex;
    }

    if (
      m.remove &&
      (skipFromTitle || m.mIndex === 0) &&
      m.mIndex < endOfTitle
    ) {
      // adjust title index in case part of it should be removed and skipped
      endOfTitle -= m.mValue.length;
    }

    m.remove = false;
    m.processed = true;
  }

  // Build final result object
  const finalResult: Partial<ParsedResult> = {};

  for (const [field, fieldMeta] of result) {
    const v = fieldMeta.value;

    // Every field is copied under its own name; value sets publish their array.
    if (v instanceof ValueSet) {
      const values = v.values as string[];
      if (field === 'languages' && values.includes('es-419')) {
        // Latin American Spanish supersedes the generic tag.
        (finalResult as Record<string, unknown>)[field] = values.filter(
          (lang) => lang !== 'es'
        );
      } else {
        (finalResult as Record<string, unknown>)[field] = values;
      }
    } else {
      (finalResult as Record<string, unknown>)[field] = v;
    }
  }

  const titleEnd = Math.max(Math.min(endOfTitle, title.length), 0);
  let rawTitle = title.substring(0, titleEnd);

  if (finalResult.episodes && finalResult.episodes.length > 0) {
    rawTitle = rawTitle.replace(trailingEpisodePattern, '');
  }

  finalResult.title = cleanTitle(rawTitle);

  // A bare-number episode marker gives no confidence
  // that adjacent words are an episode title, so require a marker with
  // structure: any non-digit char.
  // A marker ending in a letter means its pattern bit into the following
  // word, so what follows is mangled and unusable.
  const episodesMeta = result.get('episodes');
  if (
    finalResult.episodes &&
    finalResult.episodes.length > 0 &&
    episodesMeta !== undefined &&
    /\D/.test(episodesMeta.mValue) &&
    !/\p{L}$/u.test(episodesMeta.mValue) &&
    episodeTitleStart > 0 &&
    episodeTitleStart < title.length
  ) {
    const episodeTitle = extractEpisodeTitle(
      title,
      episodeTitleStart,
      finalResult.group
    );
    if (episodeTitle) {
      finalResult.episodeTitle = episodeTitle;
    }
  }

  return finalResult as ParsedResult;
}
