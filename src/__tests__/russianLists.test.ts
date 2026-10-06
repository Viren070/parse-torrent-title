import { parseTorrentTitle } from '../index';

function intRange(start: number, end: number): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}

// Russian trackers list the episodes or seasons a release has, with gaps:
// "серии 1-4, 6-10" is episodes 1-4 and 6-10.
describe('parseTorrentTitle - Russian episode and season lists', () => {
  test('Игра престолов / Game of Thrones (2016) HDTV [H.264/1080p] (сезон 6, серии 1-4, 6-10 из 10) BaibaKo (обновляемая)', () => {
    const result = parseTorrentTitle(
      'Игра престолов / Game of Thrones (2016) HDTV [H.264/1080p] (сезон 6, серии 1-4, 6-10 из 10) BaibaKo (обновляемая)'
    );
    expect(result.seasons).toEqual([6]);
    expect(result.episodes).toEqual([...intRange(1, 4), ...intRange(6, 10)]);
  });

  test('Новые пацаны / New kids / New kids on the block / Сезон: 3 / Серии: 1-3,5,8-10,12-13,16,18 из 19 (Стеффен Хаарс / Steffen Haars)', () => {
    const result = parseTorrentTitle(
      'Новые пацаны / New kids / New kids on the block / Сезон: 3 / Серии: 1-3,5,8-10,12-13,16,18 из 19 (Стеффен Хаарс / Steffen Haars)'
    );
    expect(result.seasons).toEqual([3]);
    expect(result.episodes).toEqual([1, 2, 3, 5, 8, 9, 10, 12, 13, 16, 18]);
  });

  test('Гриффины / Family Guy [15x01-13, 15-17, 19, 20 из 20] (2016-2017) HDTVRip-AVC | Filiza', () => {
    const result = parseTorrentTitle(
      'Гриффины / Family Guy [15x01-13, 15-17, 19, 20 из 20] (2016-2017) HDTVRip-AVC | Filiza'
    );
    expect(result.seasons).toEqual([15]);
    expect(result.episodes).toEqual([...intRange(1, 13), 15, 16, 17, 19, 20]);
  });

  test('Династии / Dynasties / Сезон 2 / Серии 1,3-6 из 6 (Лидия Бэйнс, Саймон Блэкни) [2020, Документальный, HDTVRip 1080p]', () => {
    const result = parseTorrentTitle(
      'Династии / Dynasties / Сезон 2 / Серии 1,3-6 из 6 (Лидия Бэйнс, Саймон Блэкни) [2020, Документальный, HDTVRip 1080p]'
    );
    expect(result.seasons).toEqual([2]);
    expect(result.episodes).toEqual([1, 3, 4, 5, 6]);
  });

  test('a list does not run into the resolution', () => {
    const result = parseTorrentTitle('Сериал (сезон 1, серии 1-12, 1080p)');
    expect(result.episodes).toEqual(intRange(1, 12));
  });

  test('Игра престолов (1-2, 4-7 сезоны: 1-57 серии из 57) / Game of Thrones / 2011-2017 / ПМ (FOX) / HDTVRip', () => {
    const result = parseTorrentTitle(
      'Игра престолов (1-2, 4-7 сезоны: 1-57 серии из 57) / Game of Thrones / 2011-2017 / ПМ (FOX) / HDTVRip'
    );
    expect(result.seasons).toEqual([1, 2, 4, 5, 6, 7]);
    expect(result.episodes).toEqual(intRange(1, 57));
    expect(result.title).toBe('Игра престолов');
  });

  test('Южный парк / South Park / 9,10,11,12 сезоны / WEB-DLRip/BDRip / Озвучка MTV', () => {
    const result = parseTorrentTitle(
      'Южный парк / South Park / 9,10,11,12 сезоны / WEB-DLRip/BDRip / Озвучка MTV'
    );
    expect(result.seasons).toEqual([9, 10, 11, 12]);
  });

  test('Компьютершики (Сезоны 1 и 2) / The IT Crowd (Graham Linehan) [2006-2007, Великобритания, Комедия, DVD5 (сжатый)]', () => {
    const result = parseTorrentTitle(
      'Компьютершики (Сезоны 1 и 2) / The IT Crowd (Graham Linehan) [2006-2007, Великобритания, Комедия, DVD5 (сжатый)]'
    );
    expect(result.seasons).toEqual([1, 2]);
    expect(result.title).toBe('The IT Crowd');
  });

  test('Компьютершики / The IT Crowd Series 1 & 2 & 3 Complete (Graham Linehan) [2006, Великобритания, Комедия, DVDRip]', () => {
    const result = parseTorrentTitle(
      'Компьютершики / The IT Crowd Series 1 & 2 & 3 Complete (Graham Linehan) [2006, Великобритания, Комедия, DVDRip]'
    );
    expect(result.seasons).toEqual([1, 2, 3]);
  });

  test('Клан Сопрано (Семья Сопрано) / The Sopranos (Все 6 Сезонов, Озвучка) (1999-2007) DVDRip', () => {
    const result = parseTorrentTitle(
      'Клан Сопрано (Семья Сопрано) / The Sopranos (Все 6 Сезонов, Озвучка) (1999-2007) DVDRip'
    );
    expect(result.seasons).toEqual(intRange(1, 6));
  });
  test('Игра Престолов / Game of Thrones (2013) BDRemux [1080p] [Сезон 3, 10 серий из 10]', () => {
    const result = parseTorrentTitle(
      'Игра Престолов / Game of Thrones (2013) BDRemux [1080p] [Сезон 3, 10 серий из 10]'
    );
    expect(result.seasons).toEqual([3]);
  });

  test('Приключения Шерлока Холмса / The Adventures of Sherlock Holmes (Сезон 1, 6 серия) (John Hawkesworth) [1984, Великобритания, детектив, DVDRip]', () => {
    const result = parseTorrentTitle(
      'Приключения Шерлока Холмса / The Adventures of Sherlock Holmes (Сезон 1, 6 серия) (John Hawkesworth) [1984, Великобритания, детектив, DVDRip]'
    );
    expect(result.seasons).toEqual([1]);
    expect(result.episodes).toEqual([6]);
  });
});
