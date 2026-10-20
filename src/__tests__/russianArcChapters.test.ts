import { parseTorrentTitle } from '../index';

// Filler-free cuts of long anime count story arcs ("главы"), not episodes or
// seasons: such a pack holds every episode of its arcs.
describe('parseTorrentTitle - Russian "N глав из M" arc counts', () => {
  test('Наруто (Без филлеров) (25 глав из 25) / Naruto / 2002-2007 / ЛО (TimaMan) / DVDRip (AVC)', () => {
    const result = parseTorrentTitle(
      'Наруто (Без филлеров) (25 глав из 25) / Naruto / 2002-2007 / ЛО (TimaMan) / DVDRip (AVC)'
    );
    expect(result.seasons).toBeUndefined();
    expect(result.episodes).toBeUndefined();
    expect(result.title).toBe('Naruto');
  });

  test('Наруто: Ураганные хроники (Без филлеров) (1-18 глав из 45) / Naruto Shippuuden / 2007-2017 / ЛМ (AkariGroup) / WEBRip (720p)', () => {
    const result = parseTorrentTitle(
      'Наруто: Ураганные хроники (Без филлеров) (1-18 глав из 45) / Naruto Shippuuden / 2007-2017 / ЛМ (AkariGroup) / WEBRip (720p)'
    );
    expect(result.seasons).toBeUndefined();
    expect(result.episodes).toBeUndefined();
    expect(result.title).toBe('Naruto Shippuuden');
  });

  test('Наруто: Ураганные хроники (2 главы из 11) (Без филлеров) / Naruto: Shippuuden / 2007-2008 / HEVC / BDRip (1080p)', () => {
    const result = parseTorrentTitle(
      'Наруто: Ураганные хроники (2 главы из 11) (Без филлеров) / Naruto: Shippuuden / 2007-2008 / HEVC / BDRip (1080p)'
    );
    expect(result.seasons).toBeUndefined();
    expect(result.episodes).toBeUndefined();
    expect(result.title).toBe('Naruto: Shippuuden');
  });

  test('a chapter in a name is kept: Пламенная бригада пожарных: Вторая глава (ТВ-2)', () => {
    const result = parseTorrentTitle(
      'Пламенная бригада пожарных: Вторая глава (ТВ-2) / Enen no Shouboutai: Ni no Shou / Fire Force 2nd Season [TV] [24 из 24]'
    );
    expect(result.seasons).toEqual([2]);
  });
});
