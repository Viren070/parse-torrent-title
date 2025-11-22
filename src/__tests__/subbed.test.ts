import { parseTorrentTitle } from '../index';

describe('parseTorrentTitle - subbed', () => {
  test('SUBFRENCH', () => {
    const result = parseTorrentTitle(
      'Have I Got News For You S53E02 EXTENDED 720p HDTV x264-QPEL SUBFRENCH'
    );
    expect(result.subbed).toBe(true);
  });

  test('ESubs', () => {
    const result = parseTorrentTitle(
      '18.11 - A Code Of Secrecy (2014) x264 1080p-AAC-ESUB [Parth].mkv'
    );
    expect(result.subbed).toBe(true);
  });

  test('ESUB', () => {
    const result = parseTorrentTitle(
      'The.Stranger.2020.S01.1080p.NF.WEB-DL.DDP.5.1.x264.ESUB-DDR'
    );
    expect(result.subbed).toBe(true);
  });

  test('PLSUB', () => {
    const result = parseTorrentTitle(
      'Have I Got News For You S53E02 EXTENDED 720p HDTV x264-QPEL PLSUB'
    );
    expect(result.subbed).toBe(true);
  });

  test('SweSub', () => {
    const result = parseTorrentTitle('Bron - S4 - 720P - SweSub.mp4');
    expect(result.subbed).toBe(true);
  });

  test('SLOSUBS', () => {
    const result = parseTorrentTitle(
      'Have I Got News For You S53E02 EXTENDED 720p HDTV x264-QPEL SLOSUBS'
    );
    expect(result.subbed).toBe(true);
  });

  test('no subbed flag', () => {
    const result = parseTorrentTitle(
      'Have I Got News For You S53E02 EXTENDED 720p HDTV x264-QPEL'
    );
    expect(result.subbed).toBeUndefined();
  });

  test('not subbed when uncensored', () => {
    const result = parseTorrentTitle(
      'Charlie.les.filles.lui.disent.merci.2007.UNCENSORED.TRUEFRENCH.DVDRiP.AC3.Libe'
    );
    expect(result.subbed).toBeUndefined();
  });
});
