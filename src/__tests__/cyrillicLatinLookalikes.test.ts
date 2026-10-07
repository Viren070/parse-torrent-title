import { parseTorrentTitle } from '../index';

// Uploaders mix Latin and Cyrillic look-alikes: "Cезон" starts with a Latin C,
// "720р" ends with a Cyrillic р.
describe('parseTorrentTitle - Cyrillic and Latin look-alike letters', () => {
  test('Королевство / Kingdeom [1 cезон] (2019) WEBRip 1080p | IdeaFilm', () => {
    const result = parseTorrentTitle(
      'Королевство / Kingdeom [1 cезон] (2019) WEBRip 1080p | IdeaFilm'
    );
    expect(result.seasons).toEqual([1]);
    expect(result.episodes).toBeUndefined();
  });

  test('Как я встретил вашу маму / How I Met Your Mother [Cезон 1-7, Серия 1-160 из 160] (2005-2011) DVDRip', () => {
    const result = parseTorrentTitle(
      'Как я встретил вашу маму / How I Met Your Mother [Cезон 1-7, Серия 1-160 из 160] (2005-2011) DVDRip'
    );
    expect(result.seasons).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(result.title).toBe('How I Met Your Mother');
  });

  test('Ходячие мертвецы / The Walking Dead [7 сезон] (2016) HDTVRip 720р | Sunshine Studio', () => {
    const result = parseTorrentTitle(
      'Ходячие мертвецы / The Walking Dead [7 сезон] (2016) HDTVRip 720р | Sunshine Studio'
    );
    expect(result.seasons).toEqual([7]);
    expect(result.episodes).toBeUndefined();
    expect(result.resolution).toBe('720p');
  });

  test('Бруклин 9-9 / Brooklyn Nine-Nine [4 сезон] (2016-2017) WEB-DL 1080р | NewStudio', () => {
    const result = parseTorrentTitle(
      'Бруклин 9-9 / Brooklyn Nine-Nine [4 сезон] (2016-2017) WEB-DL 1080р | NewStudio'
    );
    expect(result.seasons).toEqual([4]);
    expect(result.episodes).toBeUndefined();
    expect(result.resolution).toBe('1080p');
  });
  test('a price in roubles is not a resolution', () => {
    const result = parseTorrentTitle('Фильм (2020) цена 500р');
    expect(result.resolution).toBeUndefined();
  });
});
