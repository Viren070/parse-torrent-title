import { parseTorrentTitle } from '../index';

describe('Hardcoded Detection Tests', () => {
  test('is hardcoded', () => {
    const result = parseTorrentTitle('Ghost In The Shell 2017 1080p HC HDRip X264 AC3-EVO');
    expect(result.hardcoded).toBe(true);
  });

  test('not hardcoded', () => {
    const result = parseTorrentTitle('Have I Got News For You S53E02 EXTENDED 720p HDTV x264-QPEL');
    expect(result.hardcoded).toBeUndefined();
  });
});
