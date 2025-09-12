import { parseTorrentTitle } from '../index';

describe('Region Detection Tests', () => {
  test('the R5 region', () => {
    const result = parseTorrentTitle('Welcome to New York 2014 R5 XviD AC3-SUPERFAST');
    expect(result.region).toBe('R5');
  });

  test('not region in the title', () => {
    const result = parseTorrentTitle('[Coalgirls]_Code_Geass_R2_06_(1920x1080_Blu-ray_FLAC)_[F8C7FE25].mkv');
    expect(result.region).toBeUndefined();
  });

  test('R2J region', () => {
    const result = parseTorrentTitle('[JySzE] Naruto [v2] [R2J] [VFR] [Dual Audio] [Complete] [Extras] [x264]');
    expect(result.region).toBe('R2J');
  });
});
