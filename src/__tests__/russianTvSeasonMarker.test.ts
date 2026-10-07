import { parseTorrentTitle } from '../index';

// "ТВ-N" numbers an anime's TV season. It comes without brackets, with a space,
// or in Latin letters; "ДБ (ТВ-3)" is the TV-3 channel credited for a dub.
describe('parseTorrentTitle - Russian "ТВ-N" season marker forms', () => {
  test('Fullmetal Alchemist: Brotherhood / Стальной Алхимик ТВ-2 (64 из 64) Complete [720p]', () => {
    const result = parseTorrentTitle(
      'Fullmetal Alchemist: Brotherhood / Стальной Алхимик ТВ-2 (64 из 64) Complete [720p]'
    );
    expect(result.seasons).toEqual([2]);
  });

  test('Гинтама / Gintama TV-1 [01-201] (2006) BDRip-HEVC 720p | L1', () => {
    const result = parseTorrentTitle(
      'Гинтама / Gintama TV-1 [01-201] (2006) BDRip-HEVC 720p | L1'
    );
    expect(result.seasons).toEqual([1]);
    expect(result.title).toBe('Gintama TV-1');
  });

  test('Shingeki no Kyojin / Attack on Titan / Атака титанов / Вторжение титанов [TV-1] [2013, TV, 25 эп.] BDRip 720p raw+rus x 8', () => {
    const result = parseTorrentTitle(
      'Shingeki no Kyojin / Attack on Titan / Атака титанов / Вторжение титанов [TV-1] [2013, TV, 25 эп.] BDRip 720p raw+rus x 8'
    );
    expect(result.seasons).toEqual([1]);
  });

  test('Mushoku Tensei II: Isekai Ittara Honki Dasu | Реинкарнация Безработного: История о Приключениях в Другом Мире (ТВ 2, часть 2) [2023, TV, 12 из 12 эп.] BDRemux 1080p', () => {
    const result = parseTorrentTitle(
      'Mushoku Tensei II: Isekai Ittara Honki Dasu | Реинкарнация Безработного: История о Приключениях в Другом Мире (ТВ 2, часть 2) [2023, TV, 12 из 12 эп.] BDRemux 1080p'
    );
    expect(result.seasons).toEqual([2]);
  });

  test('Гоблин (Бессмертный Демон) (1-16 серии из 16) / Dokkaebi (Goblin: The Lonely and Great God) / 2016-2017 / ДБ (ТВ-3), ПМ, СТ / WEB-DL (1080p)', () => {
    const result = parseTorrentTitle(
      'Гоблин (Бессмертный Демон) (1-16 серии из 16) / Dokkaebi (Goblin: The Lonely and Great God) / 2016-2017 / ДБ (ТВ-3), ПМ, СТ / WEB-DL (1080p)'
    );
    expect(result.seasons).toBeUndefined();
  });

  test('Терминатор 2: Судный день / Terminator 2: Judgment Day (Джеймс Кэмерон / James Cameron) [1991, США, Фантастика, Боевик, BDRip] (Режиссерская версия) MVO (ТВ-6), MVO (ОРТ) + Eng', () => {
    const result = parseTorrentTitle(
      'Терминатор 2: Судный день / Terminator 2: Judgment Day (Джеймс Кэмерон / James Cameron) [1991, США, Фантастика, Боевик, BDRip] (Режиссерская версия) MVO (ТВ-6), MVO (ОРТ) + Eng'
    );
    expect(result.seasons).toBeUndefined();
  });

  test('a channel in a list of dubs is not a season', () => {
    const result = parseTorrentTitle(
      'Терминатор 2: Судный день / Terminator 2: Judgment Day (Джеймс Кэмерон / James Cameron) [1991, США, Франция, фантастика, боевик, триллер, BDRip] [Режиссерская версия / Directors cut] 4x MVO (Киномания, ОРТ, ТВ-6, CP Digital)'
    );
    expect(result.seasons).toBeUndefined();
  });

  test('a TV rating is not a season', () => {
    const result = parseTorrentTitle('Show Name TV-14 [1080p]');
    expect(result.seasons).toBeUndefined();
  });

  test('HDTV is not a TV marker', () => {
    const result = parseTorrentTitle('Сериал (2010) HDTV 1080p');
    expect(result.seasons).toBeUndefined();
  });
  test('a dub tag is matched as a whole word: Тёмное дело (ТВ-2) / Dark Case [1080p]', () => {
    const result = parseTorrentTitle('Тёмное дело (ТВ-2) / Dark Case [1080p]');
    expect(result.seasons).toEqual([2]);
  });

  test('Крыло (ТВ-1) / Wing (12 из 12)', () => {
    const result = parseTorrentTitle('Крыло (ТВ-1) / Wing (12 из 12)');
    expect(result.seasons).toEqual([1]);
  });

  test('the title stays as before: Магическая битва ТВ-2 / Jujutsu Kaisen TV-2 [23 из 23]', () => {
    const result = parseTorrentTitle(
      'Магическая битва ТВ-2 / Jujutsu Kaisen TV-2 [23 из 23]'
    );
    expect(result.seasons).toEqual([2]);
    expect(result.title).toBe('Jujutsu Kaisen TV-2');
  });
});
