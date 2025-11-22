import { parseTorrentTitle } from '../index';

describe('Retail Detection Tests', () => {
  test('release is retail', () => {
    const result = parseTorrentTitle(
      'MONSTER HIGH: ELECTRIFIED (2017) Retail PAL DVD9 [EAGLE]'
    );
    expect(result.retail).toBe(true);
  });

  test('not retail', () => {
    const result = parseTorrentTitle(
      'Have I Got News For You S53E02 EXTENDED 720pjHDTV x264-QPEL'
    );
    expect(result.retail).toBeUndefined();
  });
});
