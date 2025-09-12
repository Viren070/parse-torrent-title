import { parseTorrentTitle } from '../index';

describe('parseTorrentTitle - uncensored', () => {
  test('Identity.Thief.2013.Vostfr.UNRATED.BluRay.720p.DTS.x264-Nenuko', () => {
    const result = parseTorrentTitle('Identity.Thief.2013.Vostfr.UNRATED.BluRay.720p.DTS.x264-Nenuko');
    expect(result.uncensored).toBeUndefined();
  });

  test('Charlie.les.filles.lui.disent.merci.2007.UNCENSORED.TRUEFRENCH.DVDRiP.AC3.Libe', () => {
    const result = parseTorrentTitle('Charlie.les.filles.lui.disent.merci.2007.UNCENSORED.TRUEFRENCH.DVDRiP.AC3.Libe');
    expect(result.uncensored).toBe(true);
  });

  test('Have I Got News For You S53E02 EXTENDED 720p HDTV x264-QPEL', () => {
    const result = parseTorrentTitle('Have I Got News For You S53E02 EXTENDED 720p HDTV x264-QPEL');
    expect(result.uncensored).toBeUndefined();
  });
});
