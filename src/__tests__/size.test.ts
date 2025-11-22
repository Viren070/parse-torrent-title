import { parseTorrentTitle } from '../index';

describe('parseTorrentTitle - size', () => {
  test('size in GB', () => {
    const result = parseTorrentTitle(
      'The Stranger 2020 S01 1080p NF WEB-DL DDP 5.1 x264 3.4GB'
    );
    expect(result.size).toBe('3.4GB');
  });

  test('size in MB', () => {
    const result = parseTorrentTitle(
      'Have I Got News For You S53E02 EXTENDED 720p HDTV x264-QPEL 400MB'
    );
    expect(result.size).toBe('400MB');
  });

  test('size in GB with decimal', () => {
    const result = parseTorrentTitle(
      'www.Torrenting.com   -    Anatomy Of A Fall (2023) Aka Anatomie dune chute.1080p.BluRay.x264.DTS.8.4GB.mkv'
    );
    expect(result.size).toBe('8.4GB');
  });

  test('no size', () => {
    const result = parseTorrentTitle(
      'Have I Got News For You S53E02 EXTENDED 720p HDTV x264-QPEL'
    );
    expect(result.size).toBeUndefined();
  });
});
