import { parseTorrentTitle } from '../index';

function intRange(start: number, end: number): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}

// AnimeLayer writes episode ranges with an em dash: "(1—5)".
describe('parseTorrentTitle - em dash episode ranges', () => {
  test('Jujutsu Kaisen: Shimetsu Kaiyuu - Zenpen / Магическая битва [ТВ-3] (1—5) [1080p]', () => {
    const result = parseTorrentTitle(
      'Jujutsu Kaisen: Shimetsu Kaiyuu - Zenpen / Магическая битва [ТВ-3] (1—5) [1080p]'
    );
    expect(result.seasons).toEqual([3]);
    expect(result.episodes).toEqual(intRange(1, 5));
  });

  test('One Piece (1—1160) [720p]', () => {
    const result = parseTorrentTitle('One Piece (1—1160) [720p]');
    expect(result.episodes).toEqual(intRange(1, 1160));
  });

  test('specials after the episode count do not replace it', () => {
    const result = parseTorrentTitle(
      'Fullmetal Alchemist: Brotherhood / Стальной Алхимик ТВ-2 (64 из 64) + Specials (1—4) Complete'
    );
    expect(result.episodes).toEqual(intRange(1, 64));
  });

  test('a year range is not an episode range', () => {
    const result = parseTorrentTitle('Сериал / Show (2005—2006) [1080p]');
    expect(result.episodes).toBeUndefined();
  });
});
