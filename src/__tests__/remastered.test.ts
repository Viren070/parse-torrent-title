import { parseTorrentTitle } from '../index';

describe('Remastered Detection Tests', () => {
  test('remastered', () => {
    const result = parseTorrentTitle('The Fifth Element 1997 REMASTERED MULTi 1080p BluRay HDLight AC3 x264 Zone80');
    expect(result.remastered).toBe(true);
  });

  test('remaster (without \'ed\')', () => {
    const result = parseTorrentTitle('Predator 1987 REMASTER MULTi 1080p BluRay x264 FiDELiO');
    expect(result.remastered).toBe(true);
  });

  test('polish rekonstrukcija', () => {
    const result = parseTorrentTitle('Gra 1968 [REKONSTRUKCJA] [1080p.WEB-DL.H264.AC3-FT] [Napisy PL] [Film Polski]');
    expect(result.remastered).toBe(true);
  });

  test('not remastered', () => {
    const result = parseTorrentTitle('Have I Got News For You S53E02 EXTENDED 720p HDTV x264-QPEL');
    expect(result.remastered).toBeUndefined();
  });
});
