import { parseTorrentTitle } from '../index';

function intRange(start: number, end: number): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}

// Russian trackers often give the number of episodes in a pack instead of a
// range: "24 серии из 24" is episodes 1-24, not episode 24.
describe('parseTorrentTitle - Russian episode counts', () => {
  test('Остаться в живых (2 сезон: 24 серии из 24) / Lost / 2005-2006 / ДБ (Первый канал), СТ / BDRip', () => {
    const result = parseTorrentTitle(
      'Остаться в живых (2 сезон: 24 серии из 24) / Lost / 2005-2006 / ДБ (Первый канал), СТ / BDRip'
    );
    expect(result.seasons).toEqual([2]);
    expect(result.episodes).toEqual(intRange(1, 24));
  });

  test('Компьютершики (1-3 сезоны: 18 серий из 18) / The IT Crowd / 2006-2008 / ПО / DVDRip', () => {
    const result = parseTorrentTitle(
      'Компьютершики (1-3 сезоны: 18 серий из 18) / The IT Crowd / 2006-2008 / ПО / DVDRip'
    );
    expect(result.seasons).toEqual([1, 2, 3]);
    expect(result.episodes).toEqual(intRange(1, 18));
  });

  test('BBC: Планета Земля / Planet Earth (2006) BDRip [H.264/1080p] (11 серий из 11)', () => {
    const result = parseTorrentTitle(
      'BBC: Планета Земля / Planet Earth (2006) BDRip [H.264/1080p] (11 серий из 11)'
    );
    expect(result.episodes).toEqual(intRange(1, 11));
  });

  test('Реинкарнация безработного (1 сезон. Часть 2: 12 серий + Бонус) / Mushoku Tensei: Isekai Ittara Honki Dasu / 2021', () => {
    const result = parseTorrentTitle(
      'Реинкарнация безработного (1 сезон. Часть 2: 12 серий + Бонус) / Mushoku Tensei: Isekai Ittara Honki Dasu / 2021'
    );
    expect(result.seasons).toEqual([1]);
    expect(result.episodes).toEqual(intRange(1, 12));
  });

  test('Секретные материалы (8 выпусков из 8) [2022, военный, исторический, спецслужбы, SATRip]', () => {
    const result = parseTorrentTitle(
      'Секретные материалы (8 выпусков из 8) [2022, военный, исторический, спецслужбы, SATRip]'
    );
    expect(result.episodes).toEqual(intRange(1, 8));
  });

  test('Игра престолов / Game of Thrones (Сезон 2 полный (10)) (2012) WEB-DL 720p (LostFilm)', () => {
    const result = parseTorrentTitle(
      'Игра престолов / Game of Thrones (Сезон 2 полный (10)) (2012) WEB-DL 720p (LostFilm)'
    );
    expect(result.seasons).toEqual([2]);
    expect(result.episodes).toEqual(intRange(1, 10));
  });

  test('Декстер / Dexter (2013) HDTVRip (Сезон 8 полный (12 серий)) (LostFilm)', () => {
    const result = parseTorrentTitle(
      'Декстер / Dexter (2013) HDTVRip (Сезон 8 полный (12 серий)) (LostFilm)'
    );
    expect(result.seasons).toEqual([8]);
    expect(result.episodes).toEqual(intRange(1, 12));
  });

  test('Доктор Хаус / House M.D. / Сезон: 7 / Полный (23) [2010, США, драма, комедия, WEB-DLRip] (Домашний)', () => {
    const result = parseTorrentTitle(
      'Доктор Хаус / House M.D. / Сезон: 7 / Полный (23) [2010, США, драма, комедия, WEB-DLRip] (Домашний)'
    );
    expect(result.seasons).toEqual([7]);
    expect(result.episodes).toEqual(intRange(1, 23));
  });

  test('Грэвити Фоллс / Gravity Falls / Сезон: 2 / Серии: 14 из ? (Джон Аошима, Джо Питт, Аарон Спринджер) [2014, США, Мультсериал]', () => {
    const result = parseTorrentTitle(
      'Грэвити Фоллс / Gravity Falls / Сезон: 2 / Серии: 14 из ? (Джон Аошима, Джо Питт, Аарон Спринджер) [2014, США, Мультсериал]'
    );
    expect(result.seasons).toEqual([2]);
    expect(result.episodes).toEqual(intRange(1, 14));
  });

  test('Потомки солнца / Descendants Of The Sun [16/16] [2016]', () => {
    const result = parseTorrentTitle(
      'Потомки солнца / Descendants Of The Sun [16/16] [2016]'
    );
    expect(result.episodes).toEqual(intRange(1, 16));
  });

  test('an unequal "[3/9]" is not a full count', () => {
    const result = parseTorrentTitle('Show S01 [3/9]');
    expect(result.episodes).toEqual([3]);
  });

  test('Чужестранка / Outlander [08х02 из 10] (2026) WEB-DL 1080p | ColdFilm', () => {
    const result = parseTorrentTitle(
      'Чужестранка / Outlander [08х02 из 10] (2026) WEB-DL 1080p | ColdFilm'
    );
    expect(result.seasons).toEqual([8]);
    expect(result.episodes).toEqual([2]);
  });

  test('Мистер Бин (Диск 3 из 6) / Mr. Bean (Питер Беннет Джонс) [2003, Комедийный сериал, DVD5]', () => {
    const result = parseTorrentTitle(
      'Мистер Бин (Диск 3 из 6) / Mr. Bean (Питер Беннет Джонс) [2003, Комедийный сериал, DVD5]'
    );
    expect(result.episodes).toBeUndefined();
  });

  test('a range before the count stays a range', () => {
    const result = parseTorrentTitle(
      'Игра престолов (1 сезон: 5-10 серии из 10) / Game of Thrones'
    );
    expect(result.episodes).toEqual(intRange(5, 10));
  });

  test('episode 0 of a season is kept', () => {
    const result = parseTorrentTitle(
      'Андор (1 сезон: 0 серии из 12) / Andor / 2022 / ПМ (HDRezka Studio) / WEB-DL (1080p)'
    );
    expect(result.episodes).toEqual([0]);
  });
  test('a count after "из" is the total, not the episodes: "серия 5 из 16 серий"', () => {
    const result = parseTorrentTitle(
      'Сериал / Show (1 сезон: серия 5 из 16 серий) [2020]'
    );
    expect(result.episodes).not.toEqual(intRange(1, 16));
  });

  test('a count does not start an episode title', () => {
    const result = parseTorrentTitle(
      'Друзья / Friends [4/4] [2002, Дои Нобухиро / Doi Nobuhiro, Хан Чхоль Су / Han Chul Soo, романтика, HDTVRip] [RAW] [720p]'
    );
    expect(result.episodes).toEqual(intRange(1, 4));
    expect(result.episodeTitle).toBeUndefined();
  });
});
