import { parseTorrentTitle } from '../index';

describe('Episode Title Detection Tests', () => {
  // Positive cases: the episode title directly follows the episode marker
  test('dotted scene release with episode title', () => {
    const result = parseTorrentTitle(
      'One.Piece.S01E1116.Lets.Go.Get.It!.Buggys.Big.Declaration.2160p.B-Global.WEB-DL.JPN.AAC2.0.H.264.MSubs-ToonsHub.mkv'
    );
    expect(result.episodeTitle).toBe('Lets Go Get It! Buggys Big Declaration');
    expect(result.title).toBe('One Piece');
  });

  test('episode title containing digits', () => {
    const result = parseTorrentTitle(
      'Futurama.S08E03.How.the.West.Was.1010001.1080p.HULU.WEB-DL.DDP5.1.H.264-FLUX.mkv'
    );
    expect(result.episodeTitle).toBe('How the West Was 1010001');
  });

  test('short episode title', () => {
    const result = parseTorrentTitle(
      'Fallout.S01E03.The.Head.2160p.DV.HDR10Plus.Ai-Enhanced.H265.DDP.5.1.MULTI.RIFE.4.15v2-60fps-DirtyHippie.mkv'
    );
    expect(result.episodeTitle).toBe('The Head');
  });

  test('space separated release with episode title', () => {
    const result = parseTorrentTitle(
      '1923 S02E01 The Killing Season 1080p AMZN WEB-DL DDP5 1 H 264-FLUX[TGx]'
    );
    expect(result.episodeTitle).toBe('The Killing Season');
  });

  test('episode title that looks like media markers', () => {
    const result = parseTorrentTitle(
      'Georgie and Mandys First Marriage S01E18 TV Money 720p AMZN WEB DL DDP5 1 H 264 FLUX EZTV'
    );
    expect(result.episodeTitle).toBe('TV Money');
  });

  test('sports event episode title', () => {
    const result = parseTorrentTitle(
      'Formula1.S2025E86.Italy.Grand.Prix.1080i.HDTV.MPA2.0.H.264-playTV'
    );
    expect(result.episodeTitle).toBe('Italy Grand Prix');
  });

  test('episode word marker with episode title', () => {
    const result = parseTorrentTitle(
      '[bonkai77].RahXephon.Episode.08.Bitterly.Cold.Holy.Night.[BD.1080p.Dual.Audio.x265.HEVC.10bit].mkv'
    );
    expect(result.episodeTitle).toBe('Bitterly Cold Holy Night');
  });

  test('episode title with apostrophe', () => {
    const result = parseTorrentTitle(
      "Friends.S07E20.The.One.With.Rachel's.Big.Kiss.720p.BluRay.2CH.x265.HEVC-PSA.mkv"
    );
    expect(result.episodeTitle).toBe("The One With Rachel's Big Kiss");
  });

  test('bracketed season x episode marker with episode title', () => {
    const result = parseTorrentTitle(
      'Friends - [8x18] - The One In Massapequa.mkv'
    );
    expect(result.episodeTitle).toBe('The One In Massapequa');
  });

  test('single word episode title', () => {
    const result = parseTorrentTitle(
      'The.100.S01E01.Pilot.1080p.AVC.DTS-HD.MA.5.1.REMUX-FraMeSToR.mkv'
    );
    expect(result.episodeTitle).toBe('Pilot');
  });

  test('single word episode title with dashed show name', () => {
    const result = parseTorrentTitle(
      '9-1-1.S01E01.Pilot.1080p.AMZN.WEB-DL.DDP5.1.H.264-NTb.mkv'
    );
    expect(result.episodeTitle).toBe('Pilot');
  });

  test('dash separated episode title before bracket groups', () => {
    const result = parseTorrentTitle(
      'Game of Thrones - S02E07 - A Man Without Honor [2160p] [HDR] [5.1, 7.1, 5.1] [ger, eng, eng] [Vio].mkv'
    );
    expect(result.episodeTitle).toBe('A Man Without Honor');
  });

  test('anime dash episode format with episode title', () => {
    const result = parseTorrentTitle(
      '[ACX]El_Cazador_de_la_Bruja_-_19_-_A_Man_Who_Protects_[SSJ_Saiyan_Elite]_[9E199846].mkv'
    );
    expect(result.episodeTitle).toBe('A Man Who Protects');
  });

  test('anime underscore format strips version debris', () => {
    const result = parseTorrentTitle(
      '[a-s]_fairy_tail_-_003_-_infiltrate_the_everlue_mansion__rs2_[1080p_bd-rip][4CB16872].mkv'
    );
    expect(result.episodeTitle).toBe('infiltrate the everlue mansion');
  });

  test('cyrillic episode title', () => {
    const result = parseTorrentTitle(
      'Леди Баг и Супер-Кот – Сезон 3, Эпизод 21 – Кукловод 2 [1080p].mkv'
    );
    expect(result.episodeTitle).toBe('Кукловод 2');
  });

  test('episode title with comma and ampersand', () => {
    const result = parseTorrentTitle(
      '611-612 - Desperate Measures, Means & Ends.mp4'
    );
    expect(result.episodeTitle).toBe('Desperate Measures, Means & Ends');
  });

  test('lowercase underscore separated episode title', () => {
    const result = parseTorrentTitle(
      'doctor_who_2005.8x12.death_in_heaven.720p_hdtv_x264-fov'
    );
    expect(result.episodeTitle).toBe('death in heaven');
  });

  test('x of y episode marker with episode title', () => {
    const result = parseTorrentTitle(
      'BBC Indian Ocean with Simon Reeve 5of6 Sri Lanka to Bangladesh.avi'
    );
    expect(result.episodeTitle).toBe('Sri Lanka to Bangladesh');
  });

  test('episode title before removed repack marker', () => {
    const result = parseTorrentTitle(
      'Expedition Unknown S03E14 Corsicas Nazi Treasure RERIP 720p HDTV x264-W4F'
    );
    expect(result.episodeTitle).toBe('Corsicas Nazi Treasure');
  });

  test('multi episode release with shared episode title', () => {
    const result = parseTorrentTitle(
      'The Office S07E25+E26 Search Committee.mp4'
    );
    expect(result.episodeTitle).toBe('Search Committee');
  });

  test('episode title after multi episode marker with season digit context', () => {
    const result = parseTorrentTitle(
      "Marvel's.Agents.of.S.H.I.E.L.D.S02E01-03.Shadows.1080p.WEB-DL.DD5.1"
    );
    expect(result.episodeTitle).toBe('Shadows');
  });

  test('episode title in subtitle file name', () => {
    const result = parseTorrentTitle(
      'Into.the.Night.S01E03.Mathieu.1080p.NF.WEB-DL.DDP5.1.x264-NTG_track33_[vie].srt'
    );
    expect(result.episodeTitle).toBe('Mathieu');
  });

  test('ep word marker with dash separated episode title', () => {
    const result = parseTorrentTitle(
      'Naruto Shippuden Ep 107 - Strange Bedfellows.mkv'
    );
    expect(result.episodeTitle).toBe('Strange Bedfellows');
  });

  test('episode title truncated at inner punctuation separator', () => {
    const result = parseTorrentTitle(
      "Friends - [7x23-24] - The One with Monica and Chandler's Wedding + Audio Commentary.mkv"
    );
    expect(result.episodeTitle).toBe(
      "The One with Monica and Chandler's Wedding"
    );
  });

  test('trailing language tag stripped from episode title', () => {
    const result = parseTorrentTitle(
      'Dark.S01E01.Geheimnisse.German.1080p.NF.WEB-DL.DD5.1.x264-4SF.mkv'
    );
    expect(result.episodeTitle).toBe('Geheimnisse');
  });

  test('episode title starting with a language word', () => {
    const result = parseTorrentTitle(
      'Formula.1.2024x05.Chinese.Grand.Prix.Sprint.1080p.F1TV.WEB-DL.AAC2.0.H.264-F1'
    );
    expect(result.episodeTitle).toBe('Chinese Grand Prix Sprint');
  });

  test('long episode title starting with a language word', () => {
    const result = parseTorrentTitle(
      'Community.S01E25.English.as.a.Second.Language.720p.WEB-DL.DD5.1.H.264-CtrlHD'
    );
    expect(result.episodeTitle).toBe('English as a Second Language');
  });
  
  test('episode title after a year preceding the episode marker', () => {
    const result = parseTorrentTitle(
      'Series.Title.2012.S01E01.Episode.Title.2160p.BluRay.HEVC.DV.TrueHD.Atmos.7.1.iTA.ENG-GROUP.mkv'
    );
    expect(result.episodeTitle).toBe('Episode Title');
    expect(result.title).toBe('Series Title');
    expect(result.year).toBe('2012');
  });

  test('multi word episode title after a year preceding the marker', () => {
    const result = parseTorrentTitle(
      'The.Wire.2002.S01E02.The.Detail.1080p.BluRay.x264-GRP'
    );
    expect(result.episodeTitle).toBe('The Detail');
    expect(result.title).toBe('The Wire');
  });

  test('year before an x style marker still yields the episode title', () => {
    const result = parseTorrentTitle(
      'Show.Name.2012.1x01.Episode.Title.1080p.BluRay-GRP'
    );
    expect(result.episodeTitle).toBe('Episode Title');
  });

  // Negative cases: no episode title present, or unreliable context.

  test('no episode title when a year precedes a marker with no title', () => {
    const result = parseTorrentTitle('Show.Name.2012.S01E01.1080p.BluRay-GRP');
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title when tag debris follows a year and marker', () => {
    const result = parseTorrentTitle(
      'Show.Name.2012.S01E01.German.1080p.WEB-DL-GRP'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title from mixed-case scene region tag', () => {
    const result = parseTorrentTitle(
      'Borgen.S04E01.NORDiC.1080p.WEB-DL.H.264.DD5.1-TWA'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title from language word followed by tag debris', () => {
    const result = parseTorrentTitle(
      'Taboo.S01E04.German.DD51.DL.720p.WebHD.x264-TVS'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title in plain scene release', () => {
    const result = parseTorrentTitle(
      'sons.of.anarchy.s05e10.480p.BluRay.x264-GAnGSteR'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title with unmatched group word after markers', () => {
    const result = parseTorrentTitle(
      'The Simpsons S01E01 1080p BluRay x265 HEVC 10bit AAC 5.1 Tigole'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title when network follows removed resolution', () => {
    const result = parseTorrentTitle(
      'Hard Knocks 2001 S23E01 1080p MAX WEB-DL DDP2 0 x264-NTb[EZTVx.to].mkv'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title in web release', () => {
    const result = parseTorrentTitle(
      'The.Last.of.Us.S01E08.1080p.WEB.H264-CAKES[TGx]'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title from foreign episode word', () => {
    const result = parseTorrentTitle(
      'The.White.Lotus.2.Sezon.7.Bölüm.2021.1080p.BLUTV.WEB-DL.AAC2.0.H.264-TURG.mkv'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title from version suffix on bare episode number', () => {
    const result = parseTorrentTitle(
      '[MTBB] Mushoku Tensei - 05v3 [30C35CEC].mkv'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title after bare anime episode number', () => {
    const result = parseTorrentTitle(
      '[SubsPlease] One Piece - 1111 (480p) [2E05E658].mkv'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title from release group', () => {
    const result = parseTorrentTitle('Gotham S03E17 XviD-AFG');
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title from language marker', () => {
    const result = parseTorrentTitle(
      'Dragon Ball Super S01 E23 French 1080p HDTV H264-Kesni'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title from russian episode count remnant', () => {
    const result = parseTorrentTitle(
      'Game of Thrones / Сезон: 1-8 / Серии: 1-73 из 73 [2011-2019, США, BDRip 1080p] MVO (LostFilm)'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title from unmatched resolution token', () => {
    const result = parseTorrentTitle(
      'The.Mandalorian.S01E06.4K.HDR.2160p 4.42GB'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title from resolution conversion note', () => {
    const result = parseTorrentTitle(
      'The Boys S04E01 E02 E03 4k to 1080p AMZN WEBrip x265 DDP5 1 D0c'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title from collection descriptor', () => {
    const result = parseTorrentTitle(
      'The Exorcist 1, 2, 3, 4, 5 - Complete Horror Anthology 1973-2005'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title from second episode marker', () => {
    const result = parseTorrentTitle('Dragon Ball Super S05E53 - Ep.129.mkv');
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title when marker bites into next word', () => {
    const result = parseTorrentTitle(
      'Those.About.to.DieS01E06.MULTi.720p.AMZN.WEB-DL.H264.DDP5.1-K83.mkv'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title when marker eats leading letter of title', () => {
    const result = parseTorrentTitle(
      'Desperate_housewives_S03E02Le malheur aime la compagnie.mkv'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title when episode marker starts the release name', () => {
    const result = parseTorrentTitle(
      'S01E01-The Storm Dragon, Veldora [47C8F23B].mkv'
    );
    expect(result.episodeTitle).toBeUndefined();
    expect(result.title).toBe('The Storm Dragon, Veldora');
  });

  test('no episode title inside episode range bracket', () => {
    const result = parseTorrentTitle(
      'BoJack Horseman [06x01-08 of 16] (2019-2020) WEB-DLRip 720p'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title in anime release with bracket groups', () => {
    const result = parseTorrentTitle(
      '[Golumpa] Fairy Tail - 214 [FuniDub 720p x264 AAC] [5E46AC39]'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title from portuguese season pack descriptor', () => {
    const result = parseTorrentTitle(
      'The Walking Dead [Temporadas 1 & 2 Completas Em HDTV E Legena'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title in spanish cap range', () => {
    const result = parseTorrentTitle(
      'Heidi Audio Latino DVDRip [cap. 3 Al 18]'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title when marker sits in a leading bracket', () => {
    const result = parseTorrentTitle(
      '[S0.E04] Gambit królowej - Gra środkowa.Spanish Latin America.srt'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title when marker matches mid-word', () => {
    const result = parseTorrentTitle('COMPASS2.0 ANIMATION PROJECT');
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title from subtitle language leftovers', () => {
    const result = parseTorrentTitle('Angel.S05E19.legendado.br.rmvb');
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title from native language list', () => {
    const result = parseTorrentTitle(
      'House S 1 CD 1-6 svensk, danska, norsk, finsk sub'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title from language name', () => {
    const result = parseTorrentTitle('The Lion King 1,2,3 Greek Language');
    expect(result.episodeTitle).toBeUndefined();
  });

  test('no episode title for season pack without episodes', () => {
    const result = parseTorrentTitle(
      '[Anime Time] One Punch Man [S1+S2+OVA&ODA][Dual Audio][1080p BD][HEVC 10bit x265][AAC][Eng Subs]'
    );
    expect(result.episodeTitle).toBeUndefined();
  });

  // Trailing release metadata that no handler consumed
  test('trailing three letter language tags are not part of the title', () => {
    const result = parseTorrentTitle(
      'Silo.S01E04.Verita.ITA.ENG.1080p.ATVP.WEB-DL.DDP5.1.H.264-MeM.GP'
    );
    expect(result.episodeTitle).toBe('Verita');
    expect(result.languages).toEqual(['en', 'it']);
  });

  test('trailing language name and dual-language tag are stripped', () => {
    const result = parseTorrentTitle(
      'Silo.S01E04.Wahrheit.German.DL.Webrip.x264-TVARCHiV'
    );
    expect(result.episodeTitle).toBe('Wahrheit');
    expect(result.languages).toEqual(['de']);
  });

  test('trailing UHD tag is not part of the title', () => {
    const result = parseTorrentTitle(
      'House.of.the.Dragon.S01E03.Second.of.His.Name.UHD.BluRay.2160p.TrueHD.Atmos.7.1.DV.HEVC.REMUX-FraMeSToR'
    );
    expect(result.episodeTitle).toBe('Second of His Name');
  });

  test('resolution left over by a glued resolution pair is stripped', () => {
    const result = parseTorrentTitle(
      'Silo.S01E04.Truth.2160p1080p.WEBRip.HDR10.10Bit.DDP5.1.Atmos.H265-d3g'
    );
    expect(result.episodeTitle).toBe('Truth');
    expect(result.resolution).toBe('4k');
  });

  test('scene audio tags without separators are consumed as audio', () => {
    const ac3d = parseTorrentTitle(
      'House.of.the.Dragon.S01E03.Der.zweite.seines.Namens.German.AC3D.DL.DV.HDR.2160p.WEB.h265-JaJunge'
    );
    expect(ac3d.episodeTitle).toBe('Der zweite seines Namens');
    expect(ac3d.audio).toEqual(['AC3']);

    const dd51 = parseTorrentTitle(
      'House.of.the.Dragon.S01E03.Der.Zweite.seines.Namens.German.DD51.Synced.DL.2160p.HBOMaxUHD.DV.HDR.HEVC-TVS'
    );
    expect(dd51.episodeTitle).toBe('Der Zweite seines Namens');
    expect(dd51.audio).toEqual(['DD']);
    expect(dd51.channels).toEqual(['5.1']);
  });

  test('accessibility variants are release types, not episode title text', () => {
    const asl = parseTorrentTitle(
      'House.of.the.Dragon.S01E03.Second.of.His.Name.with.ASL.1080p.AMZN.WEB-DL.DDP5.1.H.264-Kitsune'
    );
    expect(asl.episodeTitle).toBe('Second of His Name');
    expect(asl.releaseTypes).toEqual(['ASL']);

    const ad = parseTorrentTitle(
      'Silo.S01E04.Truth.with.Audio.Description.1080p.ATVP.WEB-DL.DDP5.1.Atmos.H.264-Kitsune'
    );
    expect(ad.episodeTitle).toBe('Truth');
    expect(ad.releaseTypes).toEqual(['Audio Description']);
  });

  test('preair is a release tag, not episode title text', () => {
    const styled = parseTorrentTitle(
      'The.Office.IL.S01E01.PREAiR.HDTV.XviD-MaxHD'
    );
    expect(styled.episodeTitle).toBeUndefined();
    expect(styled.title).toBe('The Office IL');
    expect(styled.quality).toBe('HDTV');

    const hyphenated = parseTorrentTitle(
      'Some.Show.S01E01.Real.Title.PRE-AIR.720p.WEB-DL-GRP'
    );
    expect(hyphenated.episodeTitle).toBe('Real Title');
  });

  test('no episode title from a language-prefixed sub tag', () => {
    const result = parseTorrentTitle('One.Piece.S01E01.HebSub.XviD');
    expect(result.episodeTitle).toBeUndefined();
    expect(result.subbed).toBe(true);
  });

  test('uncommon resolution does not splice the following tag onto the title', () => {
    const result = parseTorrentTitle(
      'From.S01E07.All.Good.Things.540p.PMTP.WEB-DL.AAC2.0.H.264-lll'
    );
    expect(result.episodeTitle).toBe('All Good Things');
    expect(result.resolution).toBe('540p');
    expect(result.network).toBe('Paramount');
  });
});
