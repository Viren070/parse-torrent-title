import { parseTorrentTitle } from '../index';

function intRange(start: number, end: number): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}

// Ultradox names an updated season pack after its latest episode: "[+8 серия]"
// is a pack that now holds episodes 1-8, not episode 8 alone.
describe('parseTorrentTitle - Russian "[+N серия]" updated packs', () => {
  test('Фоллаут (1 сезон) [+8 серия] [Ultradox] [1080p]', () => {
    const result = parseTorrentTitle(
      'Фоллаут (1 сезон) [+8 серия] [Ultradox] [1080p]'
    );
    expect(result.seasons).toEqual([1]);
    expect(result.episodes).toEqual(intRange(1, 8));
    expect(result.title).toBe('Фоллаут');
  });

  test('Больница Питт (2 сезон) [+15 серия] [Ultradox] [400p]', () => {
    const result = parseTorrentTitle(
      'Больница Питт (2 сезон) [+15 серия] [Ultradox] [400p]'
    );
    expect(result.seasons).toEqual([2]);
    expect(result.episodes).toEqual(intRange(1, 15));
  });

  test('Лучше звоните Солу (5 сезон) [+10 серия] [Оригинал] [720p]', () => {
    const result = parseTorrentTitle(
      'Лучше звоните Солу (5 сезон) [+10 серия] [Оригинал] [720p]'
    );
    expect(result.seasons).toEqual([5]);
    expect(result.episodes).toEqual(intRange(1, 10));
  });

  test('a plain episode number is still one episode', () => {
    const result = parseTorrentTitle(
      'Ведьмак / The Witcher / 1 сезон 8 серия [2019, 1080p]'
    );
    expect(result.seasons).toEqual([1]);
    expect(result.episodes).toEqual([8]);
  });
});
