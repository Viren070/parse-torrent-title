import { parseTorrentTitle } from '../index';

function intRange(start: number, end: number): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}

// "[TV+Special] [25+9 из 25+9]" counts the series' episodes plus its specials.
// Only the first term numbers episodes of the season.
describe('parseTorrentTitle - Russian "A+B из C+D" episode sums', () => {
  test('Атака Титанов (ТВ-1) / Shingeki no Kyojin / Attack on Titan [TV+Special] [25+9 из 25+9] [JAP+Sub] & [25+0 из 25+9] [RUS(ext)] [2013, приключения, триллер, фантастика, BDRemux] [1080p]', () => {
    const result = parseTorrentTitle(
      'Атака Титанов (ТВ-1) / Shingeki no Kyojin / Attack on Titan [TV+Special] [25+9 из 25+9] [JAP+Sub] & [25+0 из 25+9] [RUS(ext)] [2013, приключения, триллер, фантастика, BDRemux] [1080p]'
    );
    expect(result.seasons).toEqual([1]);
    expect(result.episodes).toEqual(intRange(1, 25));
  });

  test('Военная хроника маленькой девочки / Youjo Senki / Saga of Tanya the Evil (Уэмура Ютака) [TV+Special] [12+13 из 12+14] [JAP+Sub] [2017]', () => {
    const result = parseTorrentTitle(
      'Военная хроника маленькой девочки / Youjo Senki / Saga of Tanya the Evil (Уэмура Ютака) [TV+Special] [12+13 из 12+14] [JAP+Sub] [2017]'
    );
    expect(result.episodes).toEqual(intRange(1, 12));
  });

  test('Стальной алхимик: Братство (ТВ-2) / Hagane No Renkinjutsushi / Fullmetal Alchemist: Brotherhood [TV+Special] [64+4 из 64+4] [RUS(int)] [2009]', () => {
    const result = parseTorrentTitle(
      'Стальной алхимик: Братство (ТВ-2) / Hagane No Renkinjutsushi / Fullmetal Alchemist: Brotherhood [TV+Special] [64+4 из 64+4] [RUS(int)] [2009]'
    );
    expect(result.seasons).toEqual([2]);
    expect(result.episodes).toEqual(intRange(1, 64));
  });

  test('Mushoku Tensei II: Isekai Ittara Honki Dasu | Реинкарнация Безработного: История о Приключениях в Другом Мире (ТВ 2, часть 1) [2023, TV+Special, 12+1 из 12+1 эп.] BDRemux 1080p raw+eng+rus', () => {
    const result = parseTorrentTitle(
      'Mushoku Tensei II: Isekai Ittara Honki Dasu | Реинкарнация Безработного: История о Приключениях в Другом Мире (ТВ 2, часть 1) [2023, TV+Special, 12+1 из 12+1 эп.] BDRemux 1080p raw+eng+rus'
    );
    expect(result.episodes).toEqual(intRange(1, 12));
  });

  test('Хеллсинг (ОВА) / Hellsing Ultimate [OVA+Special] [01-10+3 из 10+3] (2006-2012) BDRip 720p', () => {
    const result = parseTorrentTitle(
      'Хеллсинг (ОВА) / Hellsing Ultimate [OVA+Special] [01-10+3 из 10+3] (2006-2012) BDRip 720p'
    );
    expect(result.episodes).toEqual(intRange(1, 10));
  });

  test('Компьютершики / The IT Crowd (1-й сезон. 6+1 доп) (Graham Linehan) [2006, Великобритания, Комедия, DVDRip]', () => {
    const result = parseTorrentTitle(
      'Компьютершики / The IT Crowd (1-й сезон. 6+1 доп) (Graham Linehan) [2006, Великобритания, Комедия, DVDRip]'
    );
    expect(result.seasons).toEqual([1]);
    expect(result.episodes).toEqual(intRange(1, 6));
  });
  test('Черный клевер / Black Clover [TV] [1-90+0 из >115+1] [Без хардсаба] [JAP+Sub] [2017, приключения, фэнтези, комедия]', () => {
    const result = parseTorrentTitle(
      'Черный клевер / Black Clover [TV] [1-90+0 из >115+1] [Без хардсаба] [JAP+Sub] [2017, приключения, фэнтези, комедия]'
    );
    expect(result.episodes).toEqual(intRange(1, 90));
  });
});
