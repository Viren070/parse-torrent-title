import { parseTorrentTitle } from '../index';

// "2x2" is a Russian TV channel and dubbing studio, listed with the voice-overs
// of a release. It is not season 2 episode 2.
describe('parseTorrentTitle - "2x2" dubbing studio', () => {
  test('Наруто: Ураганные хроники (1-500 серии из 500) / Naruto Shippuuden / 2007-2017 / ПМ (2x2) / IPTVRip (720p)', () => {
    const result = parseTorrentTitle(
      'Наруто: Ураганные хроники (1-500 серии из 500) / Naruto Shippuuden / 2007-2017 / ПМ (2x2) / IPTVRip (720p)'
    );
    expect(result.seasons).toBeUndefined();
    expect(result.episodes?.length).toBe(500);
  });

  test('Симпсоны / The Simpsons [S27] (2015-2016) WEBRip-HEVC 1080p | 2x2', () => {
    const result = parseTorrentTitle(
      'Симпсоны / The Simpsons [S27] (2015-2016) WEBRip-HEVC 1080p | 2x2'
    );
    expect(result.seasons).toEqual([27]);
    expect(result.episodes).toBeUndefined();
  });

  test('Американский папаша / American Dad! [S01-16] (2005-2020) WEB-DL-HEVC 1080p | 2x2, Filiza, Jaskier, TVShows', () => {
    const result = parseTorrentTitle(
      'Американский папаша / American Dad! [S01-16] (2005-2020) WEB-DL-HEVC 1080p | 2x2, Filiza, Jaskier, TVShows'
    );
    expect(result.seasons?.length).toBe(16);
    expect(result.episodes).toBeUndefined();
  });

  test('Симпсоны / The Simpsons [S18] (2006) WEBRip-HEVC 720p | 2х2', () => {
    const result = parseTorrentTitle(
      'Симпсоны / The Simpsons [S18] (2006) WEBRip-HEVC 720p | 2х2'
    );
    expect(result.seasons).toEqual([18]);
    expect(result.episodes).toBeUndefined();
  });

  test('padded "2x02" is still season 2 episode 2', () => {
    const result = parseTorrentTitle('Show.Name.2x02.HDTV.XviD');
    expect(result.seasons).toEqual([2]);
    expect(result.episodes).toEqual([2]);
  });
  test('Seinfeld 2x2 The Pony Remark.avi: without Cyrillic "2x2" is season 2 episode 2', () => {
    const result = parseTorrentTitle('Seinfeld 2x2 The Pony Remark.avi');
    expect(result.seasons).toEqual([2]);
    expect(result.episodes).toEqual([2]);
  });

  test('Lost.2x2.HDTV.XviD', () => {
    const result = parseTorrentTitle('Lost.2x2.HDTV.XviD');
    expect(result.seasons).toEqual([2]);
    expect(result.episodes).toEqual([2]);
  });
});
