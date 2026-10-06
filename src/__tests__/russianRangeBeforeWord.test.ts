import { parseTorrentTitle } from '../index';

function intRange(start: number, end: number): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}

// A range followed by "серии" is a range of episodes, even when the generic
// range handler gives up on it.
describe('parseTorrentTitle - Russian "A-B серии" ranges', () => {
  test('Discovery. Разрушители легенд (Все сезоны: 1-250 серии из 250 + 19 спецвыпусков) / Mythbusters / 2003-2016 / ПМ, ПО / TVRip, SATRip', () => {
    const result = parseTorrentTitle(
      'Discovery. Разрушители легенд (Все сезоны: 1-250 серии из 250 + 19 спецвыпусков) / Mythbusters / 2003-2016 / ПМ, ПО / TVRip, SATRip'
    );
    expect(result.episodes).toEqual(intRange(1, 250));
    expect(result.title).toBe('Discovery');
  });

  test('Бруклин 9-9 (7 сезон: 1-13 серии из 13) / Brooklyn Nine-Nine / 2020 / ЛД (KerobTV) / WEBRip', () => {
    const result = parseTorrentTitle(
      'Бруклин 9-9 (7 сезон: 1-13 серии из 13) / Brooklyn Nine-Nine / 2020 / ЛД (KerobTV) / WEBRip'
    );
    expect(result.seasons).toEqual([7]);
    expect(result.episodes).toEqual(intRange(1, 13));
  });

  test('Бруклин 9-9 (1-7 сезоны: 1-143 серии из 143) / Brooklyn Nine-Nine / 2013-2020 / ПМ (NewStudio) / WEB-DLRip | NewStudio', () => {
    const result = parseTorrentTitle(
      'Бруклин 9-9 (1-7 сезоны: 1-143 серии из 143) / Brooklyn Nine-Nine / 2013-2020 / ПМ (NewStudio) / WEB-DLRip | NewStudio'
    );
    expect(result.seasons).toEqual(intRange(1, 7));
    expect(result.episodes).toEqual(intRange(1, 143));
  });
  test('the last range of a list is not taken alone', () => {
    const result = parseTorrentTitle(
      'Великолепный век (4 сезон: 7, 9-15, 19-20, 22, 25-28, 31-32 серии) / Muhtesem Yuzyil'
    );
    expect(result.episodes).not.toEqual([31, 32]);
  });

  test('the second range after "и" is not taken alone', () => {
    const result = parseTorrentTitle(
      'Семнадцать мгновений весны (1973-2009) DVB (1-2 и 4-12 серии из 12)'
    );
    expect(result.episodes).not.toEqual(intRange(4, 12));
  });
});
