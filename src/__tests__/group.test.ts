import { parseTorrentTitle } from '../index';

describe('Group Detection Tests', () => {
  test('HD2', () => {
    const result = parseTorrentTitle('Nocturnal Animals 2016 VFF 1080p BluRay DTS HEVC-HD2');
    expect(result.group).toBe('HD2');
  });

  test('HDH', () => {
    const result = parseTorrentTitle('Gold 2016 1080p BluRay DTS-HD MA 5 1 x264-HDH');
    expect(result.group).toBe('HDH');
  });

  test('YIFY', () => {
    const result = parseTorrentTitle('Hercules (2014) 1080p BrRip H264 - YIFY');
    expect(result.group).toBe('YIFY');
  });

  test('before container file type', () => {
    const result = parseTorrentTitle('The.Expanse.S05E02.720p.WEB.x264-Worldmkv.mkv');
    expect(result.group).toBe('Worldmkv');
  });

  test('with site source tag', () => {
    const result = parseTorrentTitle('The.Expanse.S05E02.PROPER.720p.WEB.h264-KOGi[rartv]');
    expect(result.group).toBe('KOGi');
  });

  test('with site source tag before container file type', () => {
    const result = parseTorrentTitle('The.Expanse.S05E02.1080p.AMZN.WEB.DDP5.1.x264-NTb[eztv.re].mp4');
    expect(result.group).toBe('NTb');
  });

  test('no group', () => {
    const result = parseTorrentTitle("Western - L'homme qui n'a pas d'étoile-1955.Multi.DVD9");
    expect(result.group).toBeUndefined();
  });

  test('no group with hyphen separator', () => {
    const result = parseTorrentTitle('Power (2014) - S02E03.mp4');
    expect(result.group).toBeUndefined();
  });

  test('no group with hyphen separator and no container', () => {
    const result = parseTorrentTitle('Power (2014) - S02E03');
    expect(result.group).toBeUndefined();
  });

  test('no group when it is episode', () => {
    const result = parseTorrentTitle('3-Nen D-Gumi Glass no Kamen - 13');
    expect(result.group).toBeUndefined();
  });

  test('no group when it is ep symbol', () => {
    const result = parseTorrentTitle('3-Nen D-Gumi Glass no Kamen - Ep13');
    expect(result.group).toBeUndefined();
  });

  test('anime group in brackets', () => {
    const result = parseTorrentTitle('[AnimeRG] One Punch Man - 09 [720p].mkv');
    expect(result.group).toBe('AnimeRG');
  });

  test('anime group in brackets with underscores', () => {
    const result = parseTorrentTitle('[Mazui]_Hyouka_-_03_[DF5E813A].mkv');
    expect(result.group).toBe('Mazui');
  });

  test('anime group in brackets with numbers', () => {
    const result = parseTorrentTitle('[H3] Hunter x Hunter - 38 [1280x720] [x264]');
    expect(result.group).toBe('H3');
  });

  test('anime group in brackets with spaces', () => {
    const result = parseTorrentTitle('[KNK E MMS Fansubs] Nisekoi - 20 Final [PT-BR].mkv');
    expect(result.group).toBe('KNK E MMS Fansubs');
  });

  test('anime group in brackets when bracket part exist at the end', () => {
    const result = parseTorrentTitle('[ToonsHub] JUJUTSU KAISEN - S02E01 (Japanese 2160p x264 AAC) [Multi-Subs].mkv');
    expect(result.group).toBe('ToonsHub');
  });

  test('anime group in brackets with a link', () => {
    const result = parseTorrentTitle('[HD-ELITE.NET] -  The.Art.Of.The.Steal.2014.DVDRip.XviD.Dual.Aud');
    expect(result.group).toBeUndefined();
  });

  test('not detect brackets group when group is detected at the end of title', () => {
    const result = parseTorrentTitle('[Russ]Lords.Of.London.2014.XviD.H264.AC3-BladeBDP');
    expect(result.group).toBe('BladeBDP');
  });

  test('group in parenthesis', () => {
    const result = parseTorrentTitle('Jujutsu Kaisen S02E01 2160p WEB H.265 AAC -Tsundere-Raws (B-Global).mkv');
    expect(result.group).toBe('B-Global');
  });

  test('not detect brackets group when it contains other parsed parameters', () => {
    const result = parseTorrentTitle('[DVD-RIP] Kaavalan (2011) Sruthi XVID [700Mb] [TCHellRaiser]');
    expect(result.group).toBeUndefined();
  });

  test('not detect brackets group when it contains other parsed parameters for series', () => {
    const result = parseTorrentTitle('[DvdMux - XviD - Ita Mp3 Eng Ac3 - Sub Ita Eng] Sanctuary S01e01');
    expect(result.group).toBeUndefined();
  });

  test('not detect group from episode', () => {
    const result = parseTorrentTitle('the-x-files-502.mkv');
    expect(result.group).toBeUndefined();
  });

  test('EXTREME group', () => {
    const result = parseTorrentTitle('[ Torrent9.cz ] The.InBetween.S01E10.FiNAL.HDTV.XviD-EXTREME.avi');
    expect(result.group).toBe('EXTREME');
  });
});
