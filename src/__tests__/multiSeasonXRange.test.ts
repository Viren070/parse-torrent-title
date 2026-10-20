import { parseTorrentTitle } from '../index';

function intRange(start: number, end: number): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}

// Rutor writes a multi-season pack as "[01-04x01-75 из 87]": seasons 1-4,
// episodes 1-75 counted through the seasons.
describe('parseTorrentTitle - "[A-BxC-D]" multi-season packs', () => {
  test('Атака титанов / Вторжение титанов / Shingeki no Kyojin [01-04x01-75 из 87] (2013-2021) WEBRip 720p | StudioBand', () => {
    const result = parseTorrentTitle(
      'Атака титанов / Вторжение титанов / Shingeki no Kyojin [01-04x01-75 из 87] (2013-2021) WEBRip 720p | StudioBand'
    );
    expect(result.seasons).toEqual([1, 2, 3, 4]);
    expect(result.episodes).toEqual(intRange(1, 75));
  });

  test("Друзья ангелов / Angel's Friends [S01-02x01-78 из 104] (2009-2010) DVDRip от New-Team | D, P", () => {
    const result = parseTorrentTitle(
      "Друзья ангелов / Angel's Friends [S01-02x01-78 из 104] (2009-2010) DVDRip от New-Team | D, P"
    );
    expect(result.seasons).toEqual([1, 2]);
    expect(result.episodes).toEqual(intRange(1, 78));
  });

  test('Универ [03-05x101-225] (2009-2010) SATRip от iolegv-RuUu & ANDROZZZ (BigFANGroup)', () => {
    const result = parseTorrentTitle(
      'Универ [03-05x101-225] (2009-2010) SATRip от iolegv-RuUu & ANDROZZZ (BigFANGroup)'
    );
    expect(result.seasons).toEqual([3, 4, 5]);
    expect(result.episodes).toEqual(intRange(101, 225));
  });

  test('Пацаны / The Boys [01-04x01-26 из 32] (2019-2024) WEB-DLRip | Кубик в кубе', () => {
    const result = parseTorrentTitle(
      'Пацаны / The Boys [01-04x01-26 из 32] (2019-2024) WEB-DLRip | Кубик в кубе'
    );
    expect(result.seasons).toEqual([1, 2, 3, 4]);
    expect(result.title).toBe('The Boys');
  });

  test('a single season stays single', () => {
    const result = parseTorrentTitle(
      'Игра престолов [01x01-10 из 10] (2011) BDRip 1080p'
    );
    expect(result.seasons).toEqual([1]);
    expect(result.episodes).toEqual(intRange(1, 10));
  });
});
