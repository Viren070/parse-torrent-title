import { parseTorrentTitle } from '../index';

describe('Network Detection Tests', () => {
  test('no network 1', () => {
    const result = parseTorrentTitle(
      'Nocturnal Animals 2016 VFF 1080p BluRay DTS HEVC-HD2'
    );
    expect(result.network).toBeUndefined();
    expect(result.title).toBe('Nocturnal Animals');
  });

  test('no network 2', () => {
    const result = parseTorrentTitle(
      'doctor_who_2005.8x12.death_in_heaven.720p_hdtv_x264-fov'
    );
    expect(result.network).toBeUndefined();
    expect(result.title).toBe('doctor who');
  });

  test('Animal Planet', () => {
    const result = parseTorrentTitle(
      'The Vet Life S02E01 Dunk-A-Doctor 1080p ANPL WEB-DL AAC2 0 H 264-RTN'
    );
    expect(result.network).toBe('Animal Planet');
    expect(result.title).toBe('The Vet Life');
  });

  test('no network 3', () => {
    const result = parseTorrentTitle('Gotham S03E17 XviD-AFG');
    expect(result.network).toBeUndefined();
    expect(result.title).toBe('Gotham');
  });

  test('no network 4', () => {
    const result = parseTorrentTitle(
      'Jimmy Kimmel 2017 05 03 720p HDTV DD5 1 MPEG2-CTL'
    );
    expect(result.network).toBeUndefined();
    expect(result.title).toBe('Jimmy Kimmel');
  });

  test('no network 5', () => {
    const result = parseTorrentTitle(
      '[Anime Time] Re Zero kara Hajimeru Isekai Seikatsu (Season 2 Part 1) [1080p][HEVC10bit x265][Multi Sub]'
    );
    expect(result.network).toBeUndefined();
    expect(result.title).toBe('Re Zero kara Hajimeru Isekai Seikatsu');
  });

  test('no network 6', () => {
    const result = parseTorrentTitle(
      '[naiyas] Fate Stay Night - Unlimited Blade Works Movie [BD 1080P HEVC10 QAACx2 Dual Audio]'
    );
    expect(result.network).toBeUndefined();
    expect(result.title).toBe('Fate Stay Night - Unlimited Blade Works Movie');
  });

  test('Netflix 1', () => {
    const result = parseTorrentTitle(
      'Extraction.2020.720p.NF.WEB-DL.Dual.Atmos.5.1.x264-BonsaiHD'
    );
    expect(result.network).toBe('Netflix');
    expect(result.title).toBe('Extraction');
  });

  test('Netflix 2', () => {
    const result = parseTorrentTitle(
      'Guilty (2020) NF Original 720p WEBRip [Hindi + English] AAC DD-5.1 ESub x264 - Shadow.mkv'
    );
    expect(result.network).toBe('Netflix');
    expect(result.title).toBe('Guilty');
  });

  test('Hulu 1', () => {
    const result = parseTorrentTitle(
      'The.Bear.S03.COMPLETE.1080p.HULU.WEB.H264-SuccessfulCrab[TGx]'
    );
    expect(result.network).toBe('Hulu');
    expect(result.title).toBe('The Bear');
  });

  test('Hulu 2', () => {
    const result = parseTorrentTitle(
      'Futurama.S08E03.How.the.West.Was.1010001.1080p.HULU.WEB-DL.DDP5.1.H.264-FLUX.mkv'
    );
    expect(result.network).toBe('Hulu');
    expect(result.title).toBe('Futurama');
  });

  test('Prime Video 1', () => {
    const result = parseTorrentTitle(
      'Amazon.Queen.2021.720p.AMZN.WEBRip.800MB.x264-GalaxyRG'
    );
    expect(result.network).toBe('Prime Video');
    expect(result.title).toBe('Amazon Queen');
  });

  test('Prime Video 2', () => {
    const result = parseTorrentTitle(
      'The.Mummy.2017.1080p.AMZN.WEBRip.DD5.1.H.264-GalaxyRG'
    );
    expect(result.network).toBe('Prime Video');
    expect(result.title).toBe('The Mummy');
  });

  test('Prime Video 3', () => {
    const result = parseTorrentTitle(
      'Primal Survivor Escape The Amazon S06E05 720p HDTV x264-CBFM EZTV'
    );
    expect(result.network).toBeUndefined();
    expect(result.title).toBe('Primal Survivor Escape The Amazon');
  });

  test('Prime Video 4', () => {
    const result = parseTorrentTitle(
      'Law and Order S05E20 Bad Faith 720p Amazon WEB-DL DD 2 0 H 264-TrollHD[TGx]'
    );
    expect(result.network).toBe('Prime Video');
    expect(result.title).toBe('Law and Order');
  });

  test('iTunes 1', () => {
    const result = parseTorrentTitle(
      'Tron.Ares.2025.2160p.iTunes.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-BYNDR.mkv'
    );
    expect(result.network).toBe('iTunes');
    expect(result.title).toBe('Tron Ares');
  });

  test('iTunes 2', () => {
    const result = parseTorrentTitle(
      'Tron.Ares.2025.2160p.iT.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-BYNDR.mkv'
    );
    expect(result.network).toBe('iTunes');
    expect(result.title).toBe('Tron Ares');
  });

  test('Crunchyroll', () => {
    const result = parseTorrentTitle(
      '[Yameii] SPY x FAMILY - S03E11 [English Dub] [CR WEB-DL 1080p] [195797EF] (SPY x FAMILY Season 3 | S3)'
    );
    expect(result.network).toBe('Crunchyroll');
    expect(result.title).toBe('SPY x FAMILY');
  });

  test('not nickelodeon', () => {
    const result = parseTorrentTitle(
      'Mike.And.Nick.And.Nick.And.Alice.2026.2160p.DSNP.WEB.DL.DDP5.1.Atmos.DV.HDR.H.265.FLUX.mkv'
    );
    expect(result.network).toBe('Disney+');
    expect(result.title).toBe('Mike And Nick And Nick And Alice');
  });

  test('Not Disney+', () => {
    const result = parseTorrentTitle(
      'Family.Guy.S18E04.Disney\'s.The.Reboot.1080p.HULU.WEB-DL.DD+5.1.H.264-CtrlHD'
    );
    expect(result.network).toBe('Hulu');
    expect(result.title).toBe('Family Guy');
  });

  test('Paramount+', () => {
    const result = parseTorrentTitle(
      'From.S01E07.All.Good.Things.540p.PMTP.WEB-DL.AAC2.0.H.264-lll'
    );
    expect(result.network).toBe('Paramount+');
    expect(result.title).toBe('From');
  });

  test('Paramount+', () => {
    const result = parseTorrentTitle(
      'The.Neighborhood.S04.1080p.Paramount+.WEB-DL.DDP.5.1.H.264-CHDWEB'
    );
    expect(result.network).toBe('Paramount+');
    expect(result.title).toBe('The Neighborhood');
  });

  test('Peacock', () => {
    const result = parseTorrentTitle(
      'Poker.Face.S01E01.1080p.PCOK.WEB-DL.DDP5.1.H.264-NTb'
    );
    expect(result.network).toBe('Peacock');
    expect(result.title).toBe('Poker Face');
  });

  test('Peacock', () => {
    const result = parseTorrentTitle(
      'The.Bay.S01.1080p.Peacock.WEB-DL.AAC.2.0.H.264-CHDWEB'
    );
    expect(result.network).toBe('Peacock');
    expect(result.title).toBe('The Bay');
  });

  test('Not Peacock', () => {
    const result = parseTorrentTitle(
      'Peacock.2024.1080p.BluRay.x264-KNiVES'
    );
    expect(result.network).toBeUndefined();
    expect(result.title).toBe('Peacock');
  });

  test('Crave', () => {
    const result = parseTorrentTitle(
      'Some.Show.S01E01.1080p.CRAV.WEB-DL.DDP5.1.H.264-NTb'
    );
    expect(result.network).toBe('Crave');
    expect(result.title).toBe('Some Show');
  });

  test('Not Crave', () => {
    const result = parseTorrentTitle(
      'Crave.2012.1080p.BluRay.x264-SADPANDA'
    );
    expect(result.network).toBeUndefined();
    expect(result.title).toBe('Crave');
  });

  test('Sony Pictures Core', () => {
    const result = parseTorrentTitle(
      'Late.Night.with.the.Devil.2023.1080p.BCORE.WEB-DL.DDP5.1-NTb'
    );
    expect(result.network).toBe('Sony Pictures Core');
    expect(result.title).toBe('Late Night with the Devil');
  });
  
  test('Not Sony Pictures Core', () => {
    const result = parseTorrentTitle(
      'Deadliest.Catch.S22E06.Rocked.to.the.Core.1080p.WEB-DL.DDP2.0.H.264-Kitsune'
    );
    expect(result.network).toBeUndefined();
    expect(result.title).toBe('Deadliest Catch');
  });

  test('Max is HBO', () => {
    const result = parseTorrentTitle(
      'Hard Knocks 2001 S23E01 1080p MAX WEB-DL DDP2 0 x264-NTb[EZTVx.to].mkv'
    );
    expect(result.network).toBe('HBO Max');
    expect(result.title).toBe('Hard Knocks');
  });

  test('Stan', () => {
    const result = parseTorrentTitle(
      'The.Rookie.S06E01.1080p.STAN.WEB-DL.DDP5.1.H.264-NTb'
    );
    expect(result.network).toBe('Stan');
    expect(result.title).toBe('The Rookie');
  });

  test('Google Play', () => {
    const result = parseTorrentTitle(
      'The.Invite.2026.2160p.PLAY.WEB-DL.DDP5.1.H.265-SCOPE'
    );
    expect(result.network).toBe('Google Play');
    expect(result.title).toBe('The Invite');
  });

  test('Movies Anywhere', () => {
    const result = parseTorrentTitle(
      'Supergirl.2026.2160p.MA.WEB-DL.DDP5.1.Atmos.H.265-HONE'
    );
    expect(result.network).toBe('Movies Anywhere');
    expect(result.title).toBe('Supergirl');
  });

  test('Paramount+ with Showtime', () => {
    const result = parseTorrentTitle(
      'Ghosts.of.Beirut.2023.S01.(2160p.SHO.WEB-DL.H265.SDR.DDP.5.1.English.-.HONE)'
    );
    expect(result.network).toBe('Paramount+');
    expect(result.title).toBe('Ghosts of Beirut');
  });

  test('SkyShowtime 1', () => {
    const result = parseTorrentTitle(
      'Let.the.Right.One.In.S01.1080p.Skyshowtime.WEB-DL.AAC2.0.H.264-CHDWEB'
    );
    expect(result.network).toBe('SkyShowtime');
    expect(result.title).toBe('Let the Right One In');
  });

  test('SkyShowtime 2', () => {
    const result = parseTorrentTitle(
      'Mission.Impossible.III.2006.2160p.SKST.WEB-DL.DD+5.1.HDR.H.265'
    );
    expect(result.network).toBe('SkyShowtime');
    expect(result.title).toBe('Mission Impossible III');
  });

  // Ambiguous tags must never eat a title word. Each of these is a real
  // release name whose title contains the tag.
  test('title words are not mistaken for network tags', () => {
    for (const [title, expected] of [
      ['Mad Max Fury Road', 'Mad Max Fury Road'],
      [
        'Mad.Max.Fury.Road.2015.1080p.BluRay.DDP5.1.x265.10bit-GalaxyRG265[TGx]',
        'Mad Max Fury Road'
      ],
      ['Max.Payne.2008.1080p.BluRay.x264-MEDiAxSHOCK', 'Max Payne'],
      ['Big.Stan.2007.1080p.BluRay.Remux.DTS-HD.HR.5.1', 'Big Stan'],
      [
        'Stan.Against.Evil.S01E01.1080p.WEB-DL.DD5.1.H.264-NTb',
        'Stan Against Evil'
      ],
      ['Crave.2012.1080p.BluRay.x264-SADPANDA', 'Crave'],
    ]) {
      const result = parseTorrentTitle(title);
      expect(result.network).toBeUndefined();
      expect(result.title).toBe(expected);
    }
  });
});
