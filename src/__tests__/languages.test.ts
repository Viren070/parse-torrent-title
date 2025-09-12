import { parseTorrentTitle } from '../index';

describe('Language Detection Tests', () => {
  // Basic language tests
  test('rus 1', () => {
    const result = parseTorrentTitle('The Expanse.s01e01.1080p.rus.eng.mkv');
    expect(result.languages).toEqual(['en', 'ru']);
  });

  test('rus 2', () => {
    const result = parseTorrentTitle('El Cuarteto de Nos [09] La Madre del Cordero [1990-2012][mp3][320Kbps][+Bonus][BuenTema.Org] [H33t] [eBooks by Kupikupono]');
    expect(result.languages).toBeUndefined();
  });

  test('ukr 1', () => {
    const result = parseTorrentTitle('Игра престолов / Game of Thrones [08х01-06 из 06] (2019) WEBRip 1080p | Ukr');
    expect(result.languages).toEqual(['uk', 'ru']);
  });

  test('ukr 2', () => {
    const result = parseTorrentTitle('Назад в будущее 2 / Back to the Future Part II (1989) UHD BDRemux 2160p | 4K | HDR | Ukr/Eng | Sub Ukr/Eng');
    expect(result.languages).toEqual(['en', 'uk', 'ru']);
  });

  test('nld 1', () => {
    const result = parseTorrentTitle('Brave.2012.R5.DVDRip.XViD.LiNE-UNiQUE');
    expect(result.languages).toBeUndefined();
  });

  test('nld 2', () => {
    const result = parseTorrentTitle('Monsters University (2013) MULTiSUBS PAL DVDR-VELVETFOG');
    expect(result.languages).toEqual(['multi subs']);
  });

  test('fra 1', () => {
    const result = parseTorrentTitle('La famille bélier (2014) FRENCH 720p BluRay x264-ROUGH[PRiME]');
    expect(result.languages).toEqual(['fr']);
  });

  test('fra 2', () => {
    const result = parseTorrentTitle('The Raid 2 (2014) FANSUB VOSTFR 720p BluRay x264-ROUGH[PRiME]');
    expect(result.languages).toEqual(['fr']);
  });

  test('fra 3', () => {
    const result = parseTorrentTitle('Maman J Ai Raté L Avion 1990 1080p FR EN x264 AAC-mHDgz');
    expect(result.languages).toEqual(['en', 'fr']);
  });

  test('ita 1', () => {
    const result = parseTorrentTitle('Constantine (2014) S01e01-03 ITA DLMux x264-NovaRip');
    expect(result.languages).toEqual(['it']);
  });

  test('ita 2', () => {
    const result = parseTorrentTitle('Game Of Thrones 4x01 Due Spade Sub-ITA-ENG 1080p HDiTunes');
    expect(result.languages).toEqual(['en', 'it']);
  });

  test('eng 1', () => {
    const result = parseTorrentTitle('Into.the.Night.S01E03.Mathieu.1080p.NF.WEB-DL.DDP5.1.x264-NTG_track3_[eng].srt');
    expect(result.languages).toEqual(['en']);
  });

  test('eng 2', () => {
    const result = parseTorrentTitle('Into.the.Night.S01E03.Mathieu.1080p.NF.WEB-DL.DDP5.1.x264-NTG_track3_[eng].srt');
    expect(result.languages).toEqual(['en']);
  });

  test('eng 3', () => {
    const result = parseTorrentTitle('2_English.srt');
    expect(result.languages).toEqual(['en']);
  });

  test('spa 1', () => {
    const result = parseTorrentTitle('The Martian (2015) 720p HDRip SPANISH AUDIO(LATINO) (ENG SUBS) - RARBG');
    expect(result.languages).toEqual(['en', 'es-419']);
  });

  test('spa 2', () => {
    const result = parseTorrentTitle('A Haunted House 2 2014 EXTENDED Spanish HC HDRiP AAC XViD-MAJESTIC');
    expect(result.languages).toEqual(['es']);
  });

  test('spa 3', () => {
    const result = parseTorrentTitle('The.Godfather.Part.I.1972.Bluray.1080p.3Audio.Eng.Ita.Spa.x264-SAHI');
    expect(result.languages).toEqual(['en', 'es', 'it']);
  });

  test('por 1', () => {
    const result = parseTorrentTitle('Supernatural S10E18 – Dual Áudio + Legenda WEB-DL 720p');
    expect(result.languages).toEqual(['dual audio', 'pt']);
  });

  test('por 2', () => {
    const result = parseTorrentTitle('Sobrenatural - S10 Ep.22');
    expect(result.languages).toBeUndefined();
  });

  test('por 3', () => {
    const result = parseTorrentTitle('The.Americans.2013.S03E01.720p.WEB-DL.DD5.1.H.264-Coo7_track29_[por].srt');
    expect(result.languages).toEqual(['pt']);
  });

  test('deu 1', () => {
    const result = parseTorrentTitle('A Cure for Wellness 2016 German DTS DL 1080p BluRay x264');
    expect(result.languages).toEqual(['de']);
  });

  test('deu 2', () => {
    const result = parseTorrentTitle('Subs/3_German.srt');
    expect(result.languages).toEqual(['de']);
  });

  test('jpn 1', () => {
    const result = parseTorrentTitle('Shinjuku Swan 2015 JAP 1080p BluRay x264 DTS-JYK');
    expect(result.languages).toEqual(['ja']);
  });

  test('jpn 2', () => {
    const result = parseTorrentTitle('Wet.Woman.in.the.Wind.2016.JAPANESE.1080p.BluRay.x264-iKiW');
    expect(result.languages).toEqual(['ja']);
  });

  test('kor 1', () => {
    const result = parseTorrentTitle('All.Love.E146.KOR.HDTV.XViD-DeBTV');
    expect(result.languages).toEqual(['ko']);
  });

  test('kor 2', () => {
    const result = parseTorrentTitle('The.Nun.2018.KORSUB.HDRip.XviD.MP3-STUTTERSHIT');
    expect(result.languages).toEqual(['ko']);
  });

  test('kor 3', () => {
    const result = parseTorrentTitle('Burning.2018.KOREAN.720p.BluRay.H264.AAC-VXT');
    expect(result.languages).toEqual(['ko']);
  });

  test('kor 4', () => {
    const result = parseTorrentTitle('Atonement.2017.KOREAN.ENSUBBED.1080p.WEBRip.x264-VXT');
    expect(result.languages).toEqual(['en', 'ko']);
  });

  // Multi-language and multi-audio tests
  test('multi lang 1', () => {
    const result = parseTorrentTitle('Inuyasha_TV+Finale+OVA+Film+CD+Manga+Other; dub jpn,chn,eng sub chs (2019-09-21)');
    expect(result.languages).toEqual(['en', 'ja', 'zh']);
  });

  test('multi lang 2', () => {
    const result = parseTorrentTitle('Initial D Live Action 2005 ENG/CHI');
    expect(result.languages).toEqual(['en', 'zh']);
  });

  test('mandarin', () => {
    const result = parseTorrentTitle('Wolf.Warrior.2015.720p.BluRay.x264.Mandarin.AAC-ETRG');
    expect(result.languages).toEqual(['zh']);
  });

  test('chinese simplified 1', () => {
    const result = parseTorrentTitle('9_zh-Hans.srt');
    expect(result.languages).toEqual(['zh']);
  });

  test('chinese traditional 1', () => {
    const result = parseTorrentTitle('Traditional Chinese.chi.srt');
    expect(result.languages).toEqual(['zh-tw']);
  });

  test('chinese traditional 2', () => {
    const result = parseTorrentTitle('Subs/Promare - Chinese (Traditional).ass');
    expect(result.languages).toEqual(['zh-tw']);
  });

  test('chinese traditional 3', () => {
    const result = parseTorrentTitle('10_zh-Hant.srt');
    expect(result.languages).toEqual(['zh-tw']);
  });

  test('dual audio 1', () => {
    const result = parseTorrentTitle('Berserk 01-25 [dual audio JP,EN] MKV');
    expect(result.languages).toEqual(['dual audio', 'en', 'ja']);
  });

  test('dual audio 2', () => {
    const result = parseTorrentTitle('FLCL S05.1080p HMAX WEB-DL DD2.0 H 264-VARYG (FLCL: Shoegaze Dual-Audio Multi-Subs)');
    expect(result.languages).toEqual(['multi subs', 'dual audio']);
  });

  test('brazilian portuguese', () => {
    const result = parseTorrentTitle('A Freira (2018) Dublado HD-TS 720p');
    expect(result.languages).toEqual(['pt']);
  });

  test('brazilian portuguese 2', () => {
    const result = parseTorrentTitle('Escobar El Patron Del Mal Capitulo 91 SD (2012-10-10) [SiRaDuDe]');
    expect(result.languages).toEqual(['pt']);
  });

  test('brazilian portuguese 3', () => {
    const result = parseTorrentTitle('Bleach - 215 ao 220 - [DB-BR]');
    expect(result.languages).toEqual(['pt']);
  });

  test('multi audio partial', () => {
    const result = parseTorrentTitle('Joker.2019.MULTi.Bluray.1080p.Atmos.7.1.En.Fr.Sp.Pt-DDR[EtHD]');
    expect(result.languages).toEqual(['multi audio', 'en', 'fr']);
  });

  test('english subs', () => {
    const result = parseTorrentTitle('Dilbert complete series + en subs');
    expect(result.languages).toEqual(['en']);
  });

  test('multi lang 3', () => {
    const result = parseTorrentTitle('The Next Karate Kid (1994) NTSC WS -Eng/Fre/Spa/Por- [ctang]');
    expect(result.languages).toEqual(['en', 'fr', 'es', 'pt']);
  });

  test('multi lang 4', () => {
    const result = parseTorrentTitle('Un.Homme.Et.Une.Femme.1966.DVDRip.XviD.AR [PT ENG ESP]');
    expect(result.languages).toEqual(['en', 'es', 'pt']);
  });

  test('multi lang 5', () => {
    const result = parseTorrentTitle('Geminis.2005.Argentina.ESP.ENG.PT.SUBS');
    expect(result.languages).toEqual(['en', 'es', 'pt']);
  });

  test('greek 1', () => {
    const result = parseTorrentTitle('1917 2019 1080p Bluray x264-Sexmeup [Greek Subs] [Braveheart]');
    expect(result.languages).toEqual(['el']);
  });

  test('greek 2', () => {
    const result = parseTorrentTitle('The Lion King 1,2,3 Greek Language');
    expect(result.languages).toEqual(['el']);
  });

  test('greek 3', () => {
    const result = parseTorrentTitle('The Adams Family (1991) (Greek Subs integratet)');
    expect(result.languages).toEqual(['el']);
  });

  test('greek 4', () => {
    const result = parseTorrentTitle('6_Greek.srt');
    expect(result.languages).toEqual(['el']);
  });

  test('arabic 1', () => {
    const result = parseTorrentTitle('The Insult (2017) [BluRay] [720p] Arabic');
    expect(result.languages).toEqual(['ar']);
  });

  test('arabic 2', () => {
    const result = parseTorrentTitle('The.Mexican.2001 - Arabic Subs Hardcoded');
    expect(result.languages).toEqual(['ar']);
  });

  test('arabic 3', () => {
    const result = parseTorrentTitle('Much Loved (2015) - DVDRip x265 HEVC - ARAB-ITA-FRE AUDIO (ENG S');
    expect(result.languages).toEqual(['en', 'fr', 'it', 'ar']);
  });

  test('arabic 4', () => {
    const result = parseTorrentTitle('42.2013.720p.BluRay.x264.HD4Ar Arab subtitle');
    expect(result.languages).toEqual(['ar']);
  });

  test('hebrew 1', () => {
    const result = parseTorrentTitle('Fauda.S01.HEBREW.1080p.NF.WEBRip.DD5.1.x264-TrollHD[rartv]');
    expect(result.languages).toEqual(['he']);
  });

  test('hebrew 2', () => {
    const result = parseTorrentTitle('madagascar 720p hebrew dubbed.mkv');
    expect(result.languages).toEqual(['he']);
  });

  test('hebrew 3', () => {
    const result = parseTorrentTitle('Into.the.Night.S01E04.Ayaz.1080p.NF.WEB-DL.DDP5.1.x264-NTG_track17_[heb].srt');
    expect(result.languages).toEqual(['he']);
  });

  test('turkish 1', () => {
    const result = parseTorrentTitle('The.Protector.2018.S03.TURKISH.WEBRip.x264-ION10');
    expect(result.languages).toEqual(['tr']);
  });

  test('turkish 2', () => {
    const result = parseTorrentTitle('Recep Ivedik 6 (2020) NETFLIX 720p WEBDL (Turkish) - ExtremlymTorrents');
    expect(result.languages).toEqual(['tr']);
  });

  test('turkish 3', () => {
    const result = parseTorrentTitle('The Insider*1999*[DVD5][PAL][ENG, POL, sub. ROM, TUR]');
    expect(result.languages).toEqual(['en', 'pl', 'ro', 'tr']);
  });

  test('turkish 4', () => {
    const result = parseTorrentTitle('Divorzio allitaliana [XviD - Ita Mp3 - Sub Eng Esp Tur]');
    expect(result.languages).toEqual(['en', 'es', 'it', 'tr']);
  });

  test('turkish 5', () => {
    const result = parseTorrentTitle('2007 Saturno Contro [Saturn In Opposition] (ITA-FRA-TUR) [EngSub');
    expect(result.languages).toEqual(['en', 'fr', 'it', 'tr']);
  });

  test('french vostfr', () => {
    const result = parseTorrentTitle('Cowboy Bebop - 1080p BDrip Audio+sub MULTI (VF / VOSTFR)');
    expect(result.languages).toEqual(['multi audio', 'fr']);
  });

  test('multi subs multi audio 1', () => {
    const result = parseTorrentTitle('Casablanca 1942 BDRip 1080p [multi language,multi subs].mkv');
    expect(result.languages).toEqual(['multi subs', 'multi audio']);
  });

  test('multi subs 1', () => {
    const result = parseTorrentTitle('Avengers.Endgame.2019.4K.UHD.ITUNES.DL.H265.Dolby.ATMOS.MSUBS-Deflate.Telly');
    expect(result.languages).toEqual(['multi subs']);
  });

  test('multi subs 2', () => {
    const result = parseTorrentTitle('Dawn of the Planet of the Apes (2014) 720p BluRay x264 - MULTI S');
    expect(result.languages).toEqual(['multi subs']);
  });

  test('multi subs 3', () => {
    const result = parseTorrentTitle('Pirates of the Caribbean On Stranger Tides (2011) DVD5 (Multi Su');
    expect(result.languages).toEqual(['multi subs']);
  });

  test('dual audio 3', () => {
    const result = parseTorrentTitle('Jumanji The Next Level (2019) 720p HDCAM Ads Blurred x264 Dual A');
    expect(result.languages).toEqual(['dual audio']);
  });

  test('dual audio 4', () => {
    const result = parseTorrentTitle('Men in Black International (2019) 720p Korsub HDRip x264 ESub [Dual Line Audio] [Hindi English]');
    expect(result.languages).toEqual(['dual audio', 'en', 'ko', 'hi']);
  });

  test('dual audio 5', () => {
    const result = parseTorrentTitle('Fame (1980) [DVDRip][Dual][Ac3][Eng-Spa]');
    expect(result.languages).toEqual(['dual audio', 'en', 'es']);
  });

  test('dual audio 6', () => {
    const result = parseTorrentTitle('O Rei do Show 2018 Dual Áudio 4K UtraHD By.Luan.Harper');
    expect(result.languages).toEqual(['dual audio']);
  });

  test('tri audio', () => {
    const result = parseTorrentTitle('Cowboy Bebop The Movie (2001) BD 1080p.x265.Tri-Audio.Ita.Eng.Jap [Rady]');
    expect(result.languages).toEqual(['multi audio', 'en', 'ja', 'it']);
  });

  test('multi dub multi sub', () => {
    const result = parseTorrentTitle('[IceBlue] Naruto (Season 01) - [Multi-Dub][Multi-Sub][Dublado][HEVC 10Bits] 800p BD');
    expect(result.languages).toEqual(['multi subs', 'multi audio', 'pt']);
  });

  test('triple audio', () => {
    const result = parseTorrentTitle('Blue Seed - 01 (BDRip 720x480p x265 HEVC FLAC, AC3x2 2.0x3)(Triple Audio)[sxales].mkv');
    expect(result.languages).toEqual(['multi audio']);
  });

  test('slovak 1', () => {
    const result = parseTorrentTitle('Ministri S01E02 SLOVAK 480p x264-mSD');
    expect(result.languages).toEqual(['sk']);
  });

  test('slovak 2', () => {
    const result = parseTorrentTitle('Subs/35_slo.srt');
    expect(result.languages).toEqual(['sk']);
  });

  test('slovak 3', () => {
    const result = parseTorrentTitle('Seinfeld.COMPLETE.SLOSUBS.DVDRip.XviD');
    expect(result.languages).toEqual(['sk']);
  });

  test('slovenian', () => {
    const result = parseTorrentTitle('Subs/36_Slovenian.srt');
    expect(result.languages).toEqual(['sl']);
  });

  test('russian ukrainian 1', () => {
    const result = parseTorrentTitle('The House Bunny (2008) BDRemux 1080p MediaClub [RUS, UKR, ENG]');
    expect(result.languages).toEqual(['en', 'ru', 'uk']);
  });

  test('russian ukrainian 2', () => {
    const result = parseTorrentTitle('L\'immortel (2010) DVDRip AVC (Russian,Ukrainian)');
    expect(result.languages).toEqual(['ru', 'uk']);
  });

  test('vietnamese 1', () => {
    const result = parseTorrentTitle('Into.the.Night.S01E03.Mathieu.1080p.NF.WEB-DL.DDP5.1.x264-NTG_track33_[vie].srt');
    expect(result.languages).toEqual(['vi']);
  });

  test('vietnamese 2', () => {
    const result = parseTorrentTitle('Subs/vie.srt');
    expect(result.languages).toEqual(['vi']);
  });

  test('vietnamese 3', () => {
    const result = parseTorrentTitle('Subs/Vietnamese.srt');
    expect(result.languages).toEqual(['vi']);
  });

  test('malay', () => {
    const result = parseTorrentTitle('Subs/Dear.S01E05.WEBRip.x265-ION265/25_may.srt');
    expect(result.languages).toEqual(['ms']);
  });

  test('indonesian', () => {
    const result = parseTorrentTitle('Midnight.Diner.Tokyo.Stories.S02E10.WEBRip.x264-ION10/14_Indonesian.srt');
    expect(result.languages).toEqual(['id']);
  });

  test('comprehensive multi lang', () => {
    const result = parseTorrentTitle('Inglês,Português,Italiano,Francês,Polonês,Russo,Norueguês,Dinamarquês,Alemão,Espanhol,Chinês,Japonês,Coreano,Persa,Hebraico,Sueco,Árabe,Holandês,Tâmil,Tailandês');
    expect(result.languages).toEqual(['en', 'ja', 'ko', 'zh', 'fr', 'es', 'pt', 'it', 'de', 'ru', 'ta', 'pl', 'nl', 'da', 'sv', 'no', 'th', 'he', 'fa']);
  });

  test('simple multi lang', () => {
    const result = parseTorrentTitle('russian,english,ukrainian');
    expect(result.languages).toEqual(['en', 'ru', 'uk']);
  });

  test('thai 1', () => {
    const result = parseTorrentTitle('Subs/Thai.srt');
    expect(result.languages).toEqual(['th']);
  });

  test('thai 2', () => {
    const result = parseTorrentTitle('Food Choices (2016) WEB.1080p.H264_tha.srt');
    expect(result.languages).toEqual(['th']);
  });

  test('no language tha in title', () => {
    const result = parseTorrentTitle('Ekk Deewana Tha (2012) DVDRip 720p x264 AAC TaRa.mkv');
    expect(result.languages).toBeUndefined();
  });

  test('no language greek in title 1', () => {
    const result = parseTorrentTitle('My Big Fat Greek Wedding (2002) 720p BrRip x264 - YIFY');
    expect(result.languages).toBeUndefined();
  });

  test('no language greek in title 2', () => {
    const result = parseTorrentTitle('Get Him to the Greek 2010 720p BluRay');
    expect(result.languages).toBeUndefined();
  });

  test('no language dual subs in filename', () => {
    const result = parseTorrentTitle('[Hakata Ramen] Hoshiai No Sora (Stars Align) 01 [1080p][HEVC][x265][10bit][Dual-Subs] HR-DR');
    expect(result.languages).toBeUndefined();
  });

  // Negative tests - should not detect language
  test('not detect LT language from yts domain name', () => {
    const result = parseTorrentTitle('Do.Or.Die.1991.1080p.BluRay.x264-[YTS.LT].mp4');
    expect(result.languages).toBeUndefined();
  });

  test('not detect PT language from temporada season naming', () => {
    const result = parseTorrentTitle('Castlevania 2017 1º temporada completa 1080p');
    expect(result.languages).toEqual(['es']);
  });

  test('not detect PT language with cap. episode title', () => {
    const result = parseTorrentTitle('City on a Hill - Temporada 1 [HDTV][Cap.110].avi');
    expect(result.languages).toEqual(['es']);
  });

  test('not detect NL language from website', () => {
    const result = parseTorrentTitle('La inocencia [720][wWw.EliteTorrent.NL].mkv');
    expect(result.languages).toBeUndefined();
  });

  test('not detect FI language from website', () => {
    const result = parseTorrentTitle('Reasonable Doubt - Temporada 1 [HDTV][Cap.101][www.AtomoHD.FI]');
    expect(result.languages).toEqual(['es']);
  });

  test('not detect FI language from website v2', () => {
    const result = parseTorrentTitle('1883 - Temporada 1 [HDTV 720p][Cap.103][AC3 5.1][www.AtomoHD.fi]');
    expect(result.languages).toEqual(['es']);
  });

  test('not detect TW language from website', () => {
    const result = parseTorrentTitle('Los Winchester - Temporada 1 [HDTV][Cap.103][www.atomoHD.tw]');
    expect(result.languages).toEqual(['es']);
  });

  test('not detect CH language from website', () => {
    const result = parseTorrentTitle('El Inmortal- Temporada 1 [HDTV 720p][Cap.104][AC3 5.1][www.AtomoHD.ch]]');
    expect(result.languages).toEqual(['es']);
  });

  test('not detect TEL language from website', () => {
    const result = parseTorrentTitle('Black Friday (2021) [BluRay Rip][AC3 5.1][www.atomixHQ.TEL]');
    expect(result.languages).toBeUndefined();
  });

  test('not detect SE language from website', () => {
    const result = parseTorrentTitle('Deep Blue Sea 3 [HDR][wWw.EliteTorrent.SE]');
    expect(result.languages).toBeUndefined();
  });

  test('not detect language from title before year', () => {
    const result = parseTorrentTitle('The.Italian.Job.1969.1080p.BluRay.x265-RARBG.mp4');
    expect(result.languages).toBeUndefined();
  });

  test('not detect language from title before year v2', () => {
    const result = parseTorrentTitle('Chinese Zodiac (2012) 1080p BrRip x264 - YIFY');
    expect(result.languages).toBeUndefined();
  });

  test('not detect language from title before year v3', () => {
    const result = parseTorrentTitle('The German Doctor 2013 1080p WEBRip');
    expect(result.languages).toBeUndefined();
  });

  test('not detect language from title before year v4', () => {
    const result = parseTorrentTitle('Johnny English 2003 1080p BluRay');
    expect(result.languages).toBeUndefined();
  });

  test('not detect language from title before year v5', () => {
    const result = parseTorrentTitle('Polish Wedding (1998) 1080p (moviesbyrizzo upl).mp4');
    expect(result.languages).toBeUndefined();
  });

  test('not detect language from title before year v6', () => {
    const result = parseTorrentTitle('Russian.Doll.S02E02.2160p.NF.WEB-DL.DDP5.1.HDR.DV.HEVC-PEXA.mkv');
    expect(result.languages).toBeUndefined();
  });

  test('not detect language from title before year v7', () => {
    const result = parseTorrentTitle('The.Spanish.Prisoner.1997.1080p.BluRay.x265-RARBG');
    expect(result.languages).toBeUndefined();
  });

  test('not detect language from title before year v8', () => {
    const result = parseTorrentTitle('Japanese.Story.2003.1080p.WEBRip.x264-RARBG');
    expect(result.languages).toBeUndefined();
  });

  test('not detect language from title before year v9', () => {
    const result = parseTorrentTitle('[ Torrent9.cz ] The.InBetween.S01E10.FiNAL.HDTV.XviD-EXTREME.avi');
    expect(result.languages).toBeUndefined();
  });

  test('not detect language from title before year v10', () => {
    const result = parseTorrentTitle('Thai Massage (2022) 720p PDVDRip x264 AAC.mkv');
    expect(result.languages).toBeUndefined();
  });

  test('not detect dan language', () => {
    const result = parseTorrentTitle('Carson Daly 2017 09 13 Dan Harmon 720p HDTV x264-CROOKS');
    expect(result.languages).toBeUndefined();
  });

  test('not detect dan language v2', () => {
    const result = parseTorrentTitle('Dan Browns The Lost Symbol S01E03 1080p WEB H264-GLHF');
    expect(result.languages).toBeUndefined();
  });

  test('not detect ara language', () => {
    const result = parseTorrentTitle('Ben.Ara.2015.1080p.WEBRip.x265-RARBG.mp4');
    expect(result.languages).toBeUndefined();
  });

  test('not detect ara language v2', () => {
    const result = parseTorrentTitle('Ara.(A.Break).2008.DVDRip');
    expect(result.languages).toBeUndefined();
  });

  test('not remove english from title', () => {
    const result = parseTorrentTitle('The English Patient (1996) 720p BrRip x264 - YIFY');
    expect(result.languages).toBeUndefined();
    expect(result.title).toBe('The English Patient');
  });

  // Tamil and other Indian languages
  test('tamil and telugu', () => {
    const result = parseTorrentTitle('www.1TamilMV.cz - Mirzapur (2020) S02 EP (01-10) - HQ HDRip - [Tam+ Tel] - x264 - AAC - 1GB - ESub');
    expect(result.languages).toEqual(['en', 'te', 'ta']);
  });

  test('tamil and malayalam', () => {
    const result = parseTorrentTitle('www.1TamilMV.cz - The Game of Chathurangam (2023) WEB-DL - 1080p - AVC - (AAC 2.0) [Tamil + Malayalam] - 1.2GB.mkv');
    expect(result.languages).toEqual(['ta', 'ml']);
  });

  test('malayalam with esub', () => {
    const result = parseTorrentTitle('www.1TamilMV.yt - Anchakkallakokkan (2024) Malayalam HQ HDRip - 720p - HEVC - (DD+5.1 - 192Kbps & AAC) - 750MB - ESub.mkv');
    expect(result.languages).toEqual(['en', 'ml']);
  });

  test('spanish castellano', () => {
    const result = parseTorrentTitle('Anatomia De Grey - Temporada 19 [HDTV][Cap.1905][Castellano][www.AtomoHD.nu].avi');
    expect(result.languages).toEqual(['es']);
  });

  test('latino spanish multi lang', () => {
    const result = parseTorrentTitle('Godzilla.x.Kong.The.New.Empire.2024.2160p.BluRay.REMUX.DV.P7.HDR.ENG.LATINO.GER.ITA.FRE.HINDI.CHINESE.TrueHD.Atmos.7.1.H265-BEN.THE.MEN');
    expect(result.languages).toEqual(['en', 'zh', 'fr', 'es-419', 'it', 'de', 'hi']);
  });

  test('bengali', () => {
    const result = parseTorrentTitle('Sampurna.2023.Bengali.S02.1080p.AMZN.WEB-DL.DD+2.0.H.265-TheBiscuitMan');
    expect(result.languages).toEqual(['bn']);
  });

  test('latin hindi multi', () => {
    const result = parseTorrentTitle('Kingdom.of.the.Planet.of.the.Apes.2024.HDRIP.1080P.[xDark [SaveHD] Latin + English + Hindi.mp4');
    expect(result.languages).toEqual(['en', 'es-419', 'hi']);
  });

  test('dual audio turkish', () => {
    const result = parseTorrentTitle('The Karate Kid Part III 1989 1080p DUAL TİVİBU WEB-DL x264 AAC - HdT');
    expect(result.languages).toEqual(['dual audio', 'tr']);
  });

  test('not detect french from title', () => {
    const result = parseTorrentTitle('The French Connection 1971 Remastered BluRay 1080p REMUX AVC DTS-HD MA 5 1-LEGi0N');
    expect(result.languages).toBeUndefined();
  });

  test('polish plsub', () => {
    const result = parseTorrentTitle('The.Gorge.2025.PLSUB.1080p.ATVP.WEB-DL.DDP5.1.Atmos.H.264-APEX.mkv');
    expect(result.languages).toEqual(['pl']);
  });

  // Polish dubbing tests
  test('polish pldub', () => {
    const result = parseTorrentTitle('[Ex-torrenty.org]iCarly.S04.PLDUB.1080p.AMZN.WEB-DL.DDP2.0.H264-Ralf');
    expect(result.languages).toEqual(['pl']);
  });

  test('polish dubpl', () => {
    const result = parseTorrentTitle('BLACK PANTHER - Wakanda Forever (2022) 10bit.m1080p.BRRip.H265.MKV.AC3-5.1 DUBPL-ENG-NapisyPL [StarLord]');
    expect(result.languages).toEqual(['en', 'pl']);
  });

  test('polish dubbingpl', () => {
    const result = parseTorrentTitle('Shrek_Forever_After_(2010)__3D_HSBS_(DubbingPL).mkv');
    expect(result.languages).toEqual(['pl']);
  });

  test('polish lekpl', () => {
    const result = parseTorrentTitle('Star Trek [2009] [RmvB] [LekPL].rmvb');
    expect(result.languages).toEqual(['pl']);
  });

  test('polish lektorpl', () => {
    const result = parseTorrentTitle('[FileTracker] Breaking Bad S02E08 [lektorPL][480p.WEB-DL.XviD][avi]');
    expect(result.languages).toEqual(['pl']);
  });

  test('polish lektor pl', () => {
    const result = parseTorrentTitle('Game of Thrones - Sezon 4 Odcinek 10 [480p.720p.WEB-DL.H264-NitroTeam] [Lektor PL].mkv');
    expect(result.languages).toEqual(['pl']);
  });

  // French VFQ tests
  test('french vfq 1', () => {
    const result = parseTorrentTitle('Everest.2015.FRENCH.VFQ.BDRiP.x264-CNF30');
    expect(result.languages).toEqual(['fr']);
  });

  test('french vfq 2', () => {
    const result = parseTorrentTitle('Showdown.In.Little.Tokyo.1991.MULTI.VFQ.VFF.DTSHD-MASTER.1080p.BluRay.x264-ZombiE');
    expect(result.languages).toEqual(['multi audio', 'fr']);
  });

  test('french vfq 3', () => {
    const result = parseTorrentTitle('Nocturnal Animals (2016) MULTi VFQ [1080p] BluRay x264-PopHD');
    expect(result.languages).toEqual(['multi audio', 'fr']);
  });

  test('french vfq 4', () => {
    const result = parseTorrentTitle('Nocturnal Animals 2016 VFQ 1080p BluRay DTS x265-HDHEVC');
    expect(result.languages).toEqual(['fr']);
  });
});
