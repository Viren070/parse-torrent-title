import { parseTorrentTitle } from '../index';

function intRange(start: number, end: number): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}

// The season number can be written as an ordinal word: "(второй сезон)".
describe('parseTorrentTitle - Russian ordinal season words', () => {
  test('Code Geass: Lelouch of the Rebellion R2 / Код Гиас: Восставший Лелуш (второй сезон) (25 из 25) Complete [720p]', () => {
    const result = parseTorrentTitle(
      'Code Geass: Lelouch of the Rebellion R2 / Код Гиас: Восставший Лелуш (второй сезон) (25 из 25) Complete [720p]'
    );
    expect(result.seasons).toEqual([2]);
    expect(result.episodes).toEqual(intRange(1, 25));
  });

  test('Ginga Eiyuu Densetsu: Die Neue These - Gekitotsu / Легенда о героях Галактики (третий сезон) (12 из 12) Complete [1080p]', () => {
    const result = parseTorrentTitle(
      'Ginga Eiyuu Densetsu: Die Neue These - Gekitotsu / Легенда о героях Галактики (третий сезон) (12 из 12) Complete [1080p]'
    );
    expect(result.seasons).toEqual([3]);
  });

  test('Драконий жемчуг Зет (Второй Сезон) / Dragon Ball Z [TV] [001-125 из 291] [RUS(int),JAP] [1989]', () => {
    const result = parseTorrentTitle(
      'Драконий жемчуг Зет (Второй Сезон) / Dragon Ball Z [TV] [001-125 из 291] [RUS(int),JAP] [1989]'
    );
    expect(result.seasons).toEqual([2]);
    expect(result.title).toBe('Dragon Ball Z');
  });

  test('Code Geass Hangyaku no Lelouch | Code Geass - Lelouch of the Rebellion | Код Гиас: Восставший Лелуш (первый, второй сезоны) [2006, TV, 50 эп.] BDRip 1080p', () => {
    const result = parseTorrentTitle(
      'Code Geass Hangyaku no Lelouch | Code Geass - Lelouch of the Rebellion | Код Гиас: Восставший Лелуш (первый, второй сезоны) [2006, TV, 50 эп.] BDRip 1080p'
    );
    expect(result.seasons).toEqual([1, 2]);
  });

  test('"ТВ-N, первый сезон" keeps the TV season', () => {
    const result = parseTorrentTitle(
      'Tensei Shitara Slime Datta Ken (2021) / О моем перерождении в слизь [ТВ-2, первый сезон] (12 из 12) Complete [1080p]'
    );
    expect(result.seasons).toEqual([2]);
  });
});
