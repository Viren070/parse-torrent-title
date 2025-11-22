import { parseTorrentTitle } from '../index';

describe('PPV Detection Tests', () => {
  test('PPV 1', () => {
    const result = parseTorrentTitle('UFC.178.Jones.vs.Cormier.PPVHD.x264-KYR');
    expect(result.ppv).toBe(true);
  });
  test('PPV 2', () => {
    const result = parseTorrentTitle('WWE.RAW.2015.03.16.PPV.HDTV.x264-RUDOS');
    expect(result.ppv).toBe(true);
  });
});
