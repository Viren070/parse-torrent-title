import { parseTorrentTitle } from '../index';

describe('Repack Detection Tests', () => {
  test('release is repack', () => {
    const result = parseTorrentTitle(
      'Silicon Valley S04E03 REPACK HDTV x264-SVA'
    );
    expect(result.repack).toBe(true);
  });

  test('release is rerip', () => {
    const result = parseTorrentTitle(
      'Expedition Unknown S03E14 Corsicas Nazi Treasure RERIP 720p HDTV x264-W4F'
    );
    expect(result.repack).toBe(true);
  });

  test('Repack Iteration', () => {
    const result = parseTorrentTitle(
      'Backrooms.2026.REPACK2.1080p.BluRay.DDP7.1.x264-ZoroSenpai'
    );
    expect(result.repack).toBe(true);
  });

  test('not repack', () => {
    const result = parseTorrentTitle(
      'Have I Got News For You S53E02 EXTENDED 720p HDTV x264-QPEL'
    );
    expect(result.repack).toBeUndefined();
  });
});
