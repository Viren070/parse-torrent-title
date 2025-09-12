import { parseTorrentTitle } from '../index';

describe('Proper Detection Tests', () => {
  test('release is proper', () => {
    const result = parseTorrentTitle('Into the Badlands S02E07 PROPER 720p HDTV x264-W4F');
    expect(result.proper).toBe(true);
  });

  test('release is real proper', () => {
    const result = parseTorrentTitle('Bossi-Reality-REAL PROPER-CDM-FLAC-1999-MAHOU');
    expect(result.proper).toBe(true);
  });

  test('not proper', () => {
    const result = parseTorrentTitle('Have I Got News For You S53E02 EXTENDED 720p HDTV x264-QPEL');
    expect(result.proper).toBeUndefined();
  });
});
