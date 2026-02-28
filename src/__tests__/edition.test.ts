import { parseTorrentTitle } from '../index';

describe('Edition Detection Tests', () => {
  test('Extended Edition', () => {
    const result = parseTorrentTitle(
      'Have I Got News For You S53E02 EXTENDED 720p HDTV x264-QPEL'
    );
    expect(result.editions).toEqual(['Extended Edition']);
  });

  test('Anniversary Edition', () => {
    const result = parseTorrentTitle(
      'Mary.Poppins.1964.50th.ANNIVERSARY.EDITION.REMUX.1080p.Bluray.AVC.DTS-HD.MA.5.1-LEGi0N'
    );
    expect(result.editions).toEqual(['Anniversary Edition']);
  });

  test('Extended Edition LOTR', () => {
    const result = parseTorrentTitle(
      'The.Lord.of.the.Rings.The.Fellowship.of.the.Ring.2001.EXTENDED.2160p.UHD.BluRay.x265.10bit.HDR.TrueHD.7.1.Atmos-BOREDOR'
    );
    expect(result.editions).toEqual(['Extended Edition']);
  });

  test('Extended Editions Trilogy', () => {
    const result = parseTorrentTitle(
      'The.Lord.of.the.Rings.The.Motion.Picture.Trilogy.Extended.Editions.2001-2003.1080p.BluRay.x264.DTS-WiKi'
    );
    expect(result.editions).toEqual(['Extended Edition']);
  });

  test('No edition for CONVERT', () => {
    const result = parseTorrentTitle(
      'Better.Call.Saul.S03E04.CONVERT.720p.WEB.h264-TBS'
    );
    expect(result.editions).toBeUndefined();
  });

  test('Remastered Fifth Element', () => {
    const result = parseTorrentTitle(
      'The Fifth Element 1997 REMASTERED MULTi 1080p BluRay HDLight AC3 x264 Zone80'
    );
    expect(result.editions).toEqual(['Remastered']);
  });

  test('Remaster Predator', () => {
    const result = parseTorrentTitle(
      'Predator 1987 REMASTER MULTi 1080p BluRay x264 FiDELiO'
    );
    expect(result.editions).toEqual(['Remastered']);
  });

  test('No edition for Uncut Gems', () => {
    const result = parseTorrentTitle(
      'Uncut.Gems.2019.1080p.NF.WEB-DL.DDP5.1.x264-NTG'
    );
    expect(result.editions).toBeUndefined();
  });

  test("Director's Cut", () => {
    const result = parseTorrentTitle(
      'Basic.Instinct.1992.Unrated.Directors.Cut.Bluray.1080p.DTS-HD-HR-6.1.x264-Grym@BTNET'
    );
    expect(result.editions).toEqual(["Director's Cut"]);
  });

  test('Color Corrected CC', () => {
    const result = parseTorrentTitle(
      'Dragon.Ball.001.DBOX.CC.480p.x264-SoM.mkv'
    );
    expect(result.editions).toEqual(['Dragon Box', 'Color Corrected']);
  });

  test('Color Corrected spelled out', () => {
    const result = parseTorrentTitle(
      'Some.Movie.2020.Colour.Corrected.1080p.BluRay.x264'
    );
    expect(result.editions).toEqual(['Color Corrected']);
  });

  test('Regraded', () => {
    const result = parseTorrentTitle(
      'Dragon.Ball.Z.013.480p.DBox.DVD.REGRADE.Dual-Audio.FLAC2.0.x264-SoM.mkv'
    );
    expect(result.regraded).toBe(true);
    expect(result.upscaled).toBeUndefined();
    expect(result.editions).toEqual(['Dragon Box']);
  });

  test('Multiple editions', () => {
    const result = parseTorrentTitle(
      'Some.Movie.2020.IMAX.REMASTERED.1080p.BluRay.x264'
    );
    expect(result.editions).toEqual(['IMAX', 'Remastered']);
  });
});
