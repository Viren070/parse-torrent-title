import { parseTorrentTitle } from '../index';

describe('Resolution Detection Tests', () => {
  test('1080P', () => {
    const result = parseTorrentTitle(
      'Annabelle.2014.1080p.PROPER.HC.WEBRip.x264.AAC.2.0-RARBG'
    );
    expect(result.resolution).toBe('1080p');
  });

  test('720P', () => {
    const result = parseTorrentTitle(
      'doctor_who_2005.8x12.death_in_heaven.720p_hdtv_x264-fov'
    );
    expect(result.resolution).toBe('720p');
  });

  test('720P with uppercase', () => {
    const result = parseTorrentTitle('UFC 187 PPV 720P HDTV X264-KYR');
    expect(result.resolution).toBe('720p');
  });

  test('4K', () => {
    const result = parseTorrentTitle(
      'The Smurfs 2 2013 COMPLETE FULL BLURAY UHD (4K) - IPT EXCLUSIVE'
    );
    expect(result.resolution).toBe('4k');
  });

  test('2060P as 4K', () => {
    const result = parseTorrentTitle(
      'Joker.2019.2160p.4K.BluRay.x265.10bit.HDR.AAC5.1'
    );
    expect(result.resolution).toBe('4k');
  });

  test('Custom Aspect Ratio for 4K', () => {
    const result = parseTorrentTitle(
      '[Beatrice-Raws] Evangelion 3.333 You Can (Not) Redo [BDRip 3840x1632 HEVC TrueHD]'
    );
    expect(result.resolution).toBe('4k');
  });

  test('Custom Aspect Ratio for 1080P', () => {
    const result = parseTorrentTitle(
      '[Erai-raws] Evangelion 3.0 You Can (Not) Redo - Movie [1920x960][Multiple Subtitle].mkv'
    );
    expect(result.resolution).toBe('1080p');
  });

  test('Custom Aspect Ratio for 720P', () => {
    const result = parseTorrentTitle(
      '[JacobSwaggedUp] Kizumonogatari I: Tekketsu-hen (BD 1280x544) [MP4 Movie]'
    );
    expect(result.resolution).toBe('720p');
  });

  test('720i as 720P', () => {
    const result = parseTorrentTitle('UFC 187 PPV 720i HDTV X264-KYR');
    expect(result.resolution).toBe('720p');
  });

  test('Typo in 720P', () => {
    const result = parseTorrentTitle(
      'IT Chapter Two.2019.7200p.AMZN WEB-DL.H264.[Eng Hin Tam Tel]DDP 5.1.MSubs.D0T.Telly'
    );
    expect(result.resolution).toBe('720p');
  });

  test('Typo in 1080P', () => {
    const result = parseTorrentTitle('Dumbo (1941) BRRip XvidHD 10800p-NPW');
    expect(result.resolution).toBe('1080p');
  });

  test('1080 without spaces and M prefix', () => {
    const result = parseTorrentTitle('BluesBrothers2M1080.www.newpct.com.mkv');
    expect(result.resolution).toBe('1080p');
  });

  test('1080 without spaces and BD prefix', () => {
    const result = parseTorrentTitle('BenHurParte2BD1080.www.newpct.com.mkv');
    expect(result.resolution).toBe('1080p');
  });

  test('720 without spaces title prefix', () => {
    const result = parseTorrentTitle('1993720p_101_WWW.NEWPCT1.COM.mkvv');
    expect(result.resolution).toBe('720p');
  });

  test('4k to 1080p priority', () => {
    const result = parseTorrentTitle(
      'The Boys S04E01 E02 E03 4k to 1080p AMZN WEBrip x265 DDP5 1 D0c'
    );
    expect(result.resolution).toBe('1080p');
  });

  test('4K remastered 1080p priority', () => {
    const result = parseTorrentTitle(
      'Batman Returns 1992 4K Remastered BluRay 1080p DTS AC3 x264-MgB'
    );
    expect(result.resolution).toBe('1080p');
  });

  test('multiple resolutions priority', () => {
    const result = parseTorrentTitle(
      'Life After People (2008) [1080P.BLURAY] [720p] [BluRay] [YTS.MX]'
    );
    expect(result.resolution).toBe('720p');
  });
});
