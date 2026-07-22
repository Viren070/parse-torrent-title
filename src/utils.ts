/**
 * Utility regex patterns and helper functions
 * Matching ptt.go patterns
 */

// Unicode property escapes aren't fully supported in JS regex
// We'll use XRegExp or create character ranges for non-English chars
export const NON_ENGLISH_CHARS =
  '\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FFF\\u0400-\\u04FF';

// Main regex patterns from ptt.go
export const russianCastRegex = new RegExp(
  `(\\([^)]*[${NON_ENGLISH_CHARS}][^)]*\\))$|(?:\\/.*?)(\\(.*\\))$`,
  'u'
);
export const altTitlesRegex = new RegExp(
  `[^/|(]*[${NON_ENGLISH_CHARS}][^/|]*[/|]|[/|][^/|(]*[${NON_ENGLISH_CHARS}][^/|]*`,
  'gu'
);
export const notOnlyNonEnglishRegex = new RegExp(
  `(?:[a-zA-Z][^${NON_ENGLISH_CHARS}]+)([${NON_ENGLISH_CHARS}].*[${NON_ENGLISH_CHARS}])|([${NON_ENGLISH_CHARS}].*[${NON_ENGLISH_CHARS}])(?:[^${NON_ENGLISH_CHARS}]+[a-zA-Z])`,
  'u'
);
export const notAllowedSymbolsAtStartAndEndRegex = new RegExp(
  `^[^\\w${NON_ENGLISH_CHARS}#[【★]+|[ \\-:/\\\\[|{(#$&^]+$`,
  'gu'
);
export const remainingNotAllowedSymbolsAtStartAndEndRegex = new RegExp(
  `^[^\\w${NON_ENGLISH_CHARS}#]+|[\\[\\]({} ]+$`,
  'gu'
);

export const movieIndicatorRegex = /[[(]movie[)\]]/gi;
export const releaseGroupMarkingAtStartRegex = /^[[【★].*[\]】★][ .]?(.+)/;
export const releaseGroupMarkingAtEndRegex = /(.+)[ .]?[[【★].*[\]】★]$/;

export const beforeTitleRegex = /^\[([^[\]]+)]/;
export const nonDigitRegex = /\D/;
export const nonDigitsRegex = /\D+/g;
export const nonAlphasRegex = /\W+/g;
export const underscoresRegex = /_+/g;
export const whitespacesRegex = /\s+/g;

export const redundantSymbolsAtEnd = /[ \-:./\\]+$/;
export const trailingEpisodePattern = /[ .]+-[ .]*\d{1,4}[ .]*$/;

export const curlyBrackets = ['{', '}'];
export const squareBrackets = ['[', ']'];
export const parentheses = ['(', ')'];
export const brackets = [curlyBrackets, squareBrackets, parentheses];

/**
 * Clean title matching Go clean_title function
 */
export function cleanTitle(rawTitle: string): string {
  let title = rawTitle.trim();

  title = title.replace(/_/g, ' ');
  title = title.replace(movieIndicatorRegex, ''); // clear movie indication flag
  title = title.replace(notAllowedSymbolsAtStartAndEndRegex, '');

  // clear russian cast information
  const russianMatches = title.match(russianCastRegex);
  if (russianMatches) {
    for (let i = 1; i < russianMatches.length; i++) {
      if (russianMatches[i]) {
        title = title.replace(russianMatches[i], '');
      }
    }
  }

  title = title.replace(releaseGroupMarkingAtStartRegex, '$1'); // remove release group markings sections from the start
  title = title.replace(releaseGroupMarkingAtEndRegex, '$1'); // remove unneeded markings section at the end if present
  title = title.replace(altTitlesRegex, ''); // remove alt language titles

  // remove non english chars if they are not the only ones left
  const notOnlyNonEnglishMatch = title.match(notOnlyNonEnglishRegex);
  if (notOnlyNonEnglishMatch) {
    for (let i = 1; i < notOnlyNonEnglishMatch.length; i++) {
      if (notOnlyNonEnglishMatch[i]) {
        title = title.replace(notOnlyNonEnglishMatch[i], '');
        break;
      }
    }
  }

  title = title.replace(remainingNotAllowedSymbolsAtStartAndEndRegex, '');

  if (!title.includes(' ') && title.includes('.')) {
    title = title.replace(/(?<!\d)\.|\.(?!\d)/g, ' ');
  }

  for (const [open, close] of brackets) {
    const openCount = (title.match(new RegExp('\\' + open, 'g')) || []).length;
    const closeCount = (title.match(new RegExp('\\' + close, 'g')) || [])
      .length;
    if (openCount !== closeCount) {
      title = title
        .replace(new RegExp('\\' + open, 'g'), '')
        .replace(new RegExp('\\' + close, 'g'), '');
    }
  }

  title = title.replace(redundantSymbolsAtEnd, '');
  title = title.replace(whitespacesRegex, ' ');

  return title.trim();
}

const episodeTitleLetterRegex = new RegExp(`[a-zA-Z${NON_ENGLISH_CHARS}]`);
const episodeTitleTokenRegex = /[^ .[\]() {}/\\|]+/y;
const extensionTokenRegex =
  /^(3g2|3gp|avi|flv|mkv|mk3d|mov|mp2|mp4|m4v|mpe|mpeg|mpg|mpv|webm|wmv|ogm|divx|ts|m2ts|iso|vob|sub|idx|ttxt|txt|smi|srt|ssa|ass|vtt|nfo|html)$/i;
// Scene, subtitle and dub markers that are never part of an episode title.
// Native-language spellings matter: release names carry them untranslated
// ("legendado", "dublado").
const episodeTitleHardStopRegex = new RegExp(
  '^(?:' +
    [
      // release/scene markers
      'complete[sd]?',
      'completas?',
      'incomplete',
      'final',
      'multi',
      'dual',
      'integrale?',
      'nordic',
      'true?french',
      // subtitle/dub markers
      'subs?',
      'subbed',
      'subtitles?',
      'legendas?',
      'legendad[oa]',
      'subtitulad[oa]',
      'vostfr',
      'vosta',
      'dubbed',
      'dublado',
      'doblado'
    ].join('|') +
    ')$',
  'i'
);
// Language names (English and native spellings). Ambiguous on their own:
// "French" after an episode marker is a language tag, but "Chinese Grand
// Prix Sprint" is an episode title. A leading language word only condemns
// short captures or ones whose next word is also a marker.
const episodeTitleLanguageWordRegex = new RegExp(
  '^(?:' +
    [
      'french',
      'fran(?:c|ç)ais',
      'german',
      'deutsch',
      'spanish',
      'espa(?:n|ñ)ol',
      'castellano',
      'latino',
      'italian',
      'italiano',
      'portuguese',
      'portugu(?:e|ê)s',
      'brazilian',
      'dutch',
      'nederlands',
      'english',
      'ingles',
      'swedish',
      'svenska?',
      'norwegian',
      'norska?',
      'danish',
      'danska?',
      'finnish',
      'finska?',
      'suomi',
      'greek',
      'polish',
      'polski',
      'czech',
      'russian',
      'japanese',
      'korean',
      'chinese',
      'hindi',
      'tamil',
      'telugu',
      'arabic',
      'hebrew',
      'turkish',
      'thai'
    ].join('|') +
    ')$',
  'i'
);

// Release metadata a handler left behind
const episodeTitleTrailingTagRegex = new RegExp(
  '^(?:' + ['\\d{3,4}[pi]', '[48]k', 'u?hd', 'dl', 'synced'].join('|') + ')$',
  'i'
);
// Three-letter language tags as releases spell them.
const episodeTitleLanguageCodeRegex = new RegExp(
  '^(?:' +
    [
      'ENG',
      'ITA',
      'GER',
      'DEU',
      'FRE',
      'FRA',
      'SPA',
      'ESP',
      'POR',
      'RUS',
      'JPN',
      'JAP',
      'KOR',
      'CHI',
      'DUT',
      'NLD',
      'SWE',
      'NOR',
      'DAN',
      'FIN',
      'POL',
      'CZE',
      'GRE',
      'TUR',
      'ARA',
      'HEB',
      'HIN',
      'TAM',
      'TEL',
      'THA',
      'VIE',
      'HUN',
      'UKR',
      'BUL',
      'HRV',
      'SRP',
      'SLO',
      'RON',
      'EST',
      'LAV',
      'LIT'
    ].join('|') +
    ')$'
);

function isStopWord(token: string): boolean {
  const word = token.replace(surroundingPunctuationRegex, '');
  return (
    episodeTitleHardStopRegex.test(word) ||
    episodeTitleLanguageWordRegex.test(word)
  );
}

// Junk only ever trimmed from the trailing edge, where a leftover tag cannot
// be mistaken for the start of a real title.
function isTrailingTag(token: string): boolean {
  const word = token.replace(surroundingPunctuationRegex, '');
  return (
    episodeTitleTrailingTagRegex.test(word) ||
    episodeTitleLanguageCodeRegex.test(word)
  );
}
const surroundingPunctuationRegex = /^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu;
export const wordCharRegex = /[\p{L}\p{N}]/u;

function isSep(c: string | undefined): boolean {
  return c === ' ' || c === '.';
}

function isTightDash(w: string, p: number): boolean {
  return (
    w[p] === '-' &&
    p > 0 &&
    !isSep(w[p - 1]) &&
    p + 1 < w.length &&
    !isSep(w[p + 1])
  );
}

/**
 * Extract the episode title from the parser's final working string.
 *
 * `start` is the index just past the episode marker (or where the removed
 * marker used to be). The episode title is the run of tokens connected by
 * SINGLE separators; runs of 2+ separators ("scars" left where marker text
 * was removed), brackets and slashes end it. A capture terminated by a
 * closing bracket means we were inside a bracket group, i.e. not a title.
 */
export function extractEpisodeTitle(
  w: string,
  start: number,
  group?: string
): string | null {
  // Junction check: in the original filename the episode title is adjacent
  // to the marker with exactly one separator. 2+ separators is a scar left
  // by removed marker text; 0 means the marker match bit into a word.
  let sepsBefore = 0;
  for (let i = start - 1; i >= 0 && isSep(w[i]); i--) sepsBefore++;
  // A tight hyphen delimiter leaves the title directly
  // behind the removed marker with no space or dot to mark the junction.
  if (sepsBefore === 0 && start > 0 && isTightDash(w, start - 1)) sepsBefore = 1;
  let sepsAfter = 0;
  let i = start;
  while (i < w.length && isSep(w[i])) {
    sepsAfter++;
    i++;
  }
  if (Math.min(sepsBefore, 1) + sepsAfter !== 1 || i >= w.length) return null;

  const tokens: string[] = [];
  let terminator = '';
  while (i < w.length) {
    episodeTitleTokenRegex.lastIndex = i;
    const tm = episodeTitleTokenRegex.exec(w);
    if (!tm || tm.index !== i) {
      terminator = w[i];
      break;
    }
    const token = tm[0];
    // Punctuation-only tokens ("-", "--", "+", "–") are list separators:
    // skip leading ones (marker debris), stop the capture on inner ones.
    // "&" is a real conjunction inside titles.
    if (token !== '&' && !wordCharRegex.test(token)) {
      if (tokens.length > 0) break;
    } else {
      tokens.push(token);
    }
    i += token.length;
    if (isSep(w[i])) {
      if (isSep(w[i + 1])) break; // scar
      i++;
    }
  }

  if (terminator === ')' || terminator === ']' || terminator === '}') {
    return null;
  }

  // Strip release-group / extension / version debris from the edges
  if (tokens.length > 0) {
    tokens[0] = tokens[0].replace(/^-+/, '');
    if (tokens[0] === '') tokens.shift();
  }
  while (tokens.length > 0) {
    let last = tokens[tokens.length - 1];
    if (group && last.toLowerCase().endsWith('-' + group.toLowerCase())) {
      last = last.slice(0, last.length - group.length - 1);
      tokens[tokens.length - 1] = last;
    }
    if (
      last === '' ||
      extensionTokenRegex.test(last) ||
      /^(?:v\d{1,2}|rs\d{1,2})$/i.test(last) ||
      (group !== undefined && last.toLowerCase() === group.toLowerCase()) ||
      isStopWord(last) ||
      isTrailingTag(last)
    ) {
      tokens.pop();
      continue;
    }
    break;
  }
  // A tight-dash scheme can glue the last title word to a since-removed tag
  // ("Relations-1080p" -> "Relations-"); the hyphen is never title text.
  if (tokens.length > 0) {
    tokens[tokens.length - 1] = tokens[tokens.length - 1].replace(/-+$/, '');
    if (tokens[tokens.length - 1] === '') tokens.pop();
  }

  if (tokens.length === 0 || tokens.length > 12) return null;

  // Tokens carry their punctuation ("svensk,"), so compare on the bare word
  const firstWord = tokens[0].replace(surroundingPunctuationRegex, '');

  // A scene/subtitle marker word is never the start of an episode title
  if (episodeTitleHardStopRegex.test(firstWord)) return null;
  // A leading language name is a language tag unless it clearly opens a
  // longer title: the next word must
  // be a real title word, i.e. neither a marker nor shouty tag debris
  if (
    episodeTitleLanguageWordRegex.test(firstWord) &&
    (tokens.length <= 2 || isStopWord(tokens[1]) || !/\p{Ll}/u.test(tokens[1]))
  ) {
    return null;
  }
  // A resolution-ish first token means leftover media info, not a title
  if (/^(?:\d{3,4}[pi]|[48]k)$/i.test(firstWord)) return null;

  // Single-word titles are held to a higher standard, since single leftover
  // junk tokens are the most common false positive
  if (tokens.length === 1) {
    if (firstWord.length < 3) return null;
    if (!/\p{Ll}/u.test(firstWord)) return null;
  }

  const episodeTitle = tokens.join(' ');
  if (!episodeTitleLetterRegex.test(episodeTitle)) return null;
  // "of 10" / "из 10" remnants of an "X of Y" episode-count marker
  if (/^(?:of|из|iz) \d+$/i.test(episodeTitle)) return null;
  // "Ep 129" style remnants of a second, unconsumed episode marker
  if (/^ep(?:isode)?s?[ .]*\d{1,4}$/i.test(episodeTitle)) return null;

  return episodeTitle;
}

/**
 * Helper to get all regex match indices (like Go FindStringSubmatchIndex)
 */
export function getMatchIndices(regex: RegExp, str: string): number[] {
  const match = regex.exec(str);
  if (!match) return [];

  const indices: number[] = [];
  indices.push(match.index, match.index + match[0].length);

  for (let i = 1; i < match.length; i++) {
    if (match[i] !== undefined) {
      const captureIndex = str.indexOf(match[i], match.index);
      indices.push(captureIndex, captureIndex + match[i].length);
    } else {
      indices.push(-1, -1);
    }
  }

  return indices;
}
