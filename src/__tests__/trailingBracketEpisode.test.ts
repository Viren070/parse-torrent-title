import { parseTorrentTitle } from '../index';

function intRange(start: number, end: number): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}

// AniLiberty names end with the episodes in the last bracket group.
describe('parseTorrentTitle - trailing bracket episodes', () => {
  test('Ледяная стена / Koori no Jouheki / 2026 / [WEB-DL 1080p][AVC][1]', () => {
    const result = parseTorrentTitle(
      'Ледяная стена / Koori no Jouheki / 2026 / [WEB-DL 1080p][AVC][1]'
    );
    expect(result.episodes).toEqual([1]);
    expect(result.resolution).toBe('1080p');
  });

  test('Блич / Bleach / 2004 / [BDRip 1080p][HEVC][347]', () => {
    const result = parseTorrentTitle(
      'Блич / Bleach / 2004 / [BDRip 1080p][HEVC][347]'
    );
    expect(result.episodes).toEqual([347]);
  });

  test('Магическая битва 2 / JUJUTSU KAISEN Season 2 / 2023 / [WEBRip 1080p][AVC][1-23]', () => {
    const result = parseTorrentTitle(
      'Магическая битва 2 / JUJUTSU KAISEN Season 2 / 2023 / [WEBRip 1080p][AVC][1-23]'
    );
    expect(result.seasons).toEqual([2]);
    expect(result.episodes).toEqual(intRange(1, 23));
  });
  test('a year in the last bracket is not an episode', () => {
    const result = parseTorrentTitle('Сериал / Show [WEB-DL 1080p][2023]');
    expect(result.episodes).toBeUndefined();
    expect(result.year).toBe('2023');
  });

  test('a bit depth group at the end is not an episode', () => {
    const result = parseTorrentTitle('Show Name [1080p][x265][10bit]');
    expect(result.episodes).toBeUndefined();
  });
});
