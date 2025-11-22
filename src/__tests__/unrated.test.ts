import { parseTorrentTitle } from '../index';

describe('parseTorrentTitle - unrated', () => {
  test('unrated', () => {
    const result = parseTorrentTitle(
      'Identity.Thief.2013.Vostfr.UNRATED.BluRay.720p.DTS.x264-Nenuko'
    );
    expect(result.unrated).toBe(true);
  });

  test('uncensored', () => {
    const result = parseTorrentTitle(
      'Charlie.les.filles.lui.disent.merci.2007.UNCENSORED.TRUEFRENCH.DVDRiP.AC3.Libe'
    );
    expect(result.unrated).toBeUndefined();
  });

  test('not unrated', () => {
    const result = parseTorrentTitle(
      'Have I Got News For You S53E02 EXTENDED 720p HDTV x264-QPEL'
    );
    expect(result.unrated).toBeUndefined();
  });
});
