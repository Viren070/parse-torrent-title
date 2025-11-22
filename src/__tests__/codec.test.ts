/**
 * Codec detection tests
 * Ported from codec_test.go
 */

import { parseTorrentTitle } from '../index';

describe('Codec Detection', () => {
  test('hevc', () => {
    const result = parseTorrentTitle(
      'Nocturnal Animals 2016 VFF 1080p BluRay DTS HEVC-HD2'
    );
    expect(result.codec).toBe('hevc');
  });

  test('x264', () => {
    const result = parseTorrentTitle(
      'doctor_who_2005.8x12.death_in_heaven.720p_hdtv_x264-fov'
    );
    expect(result.codec).toBe('x264');
  });

  test('web-dl', () => {
    const result = parseTorrentTitle(
      'The Vet Life S02E01 Dunk-A-Doctor 1080p ANPL WEB-DL AAC2 0 H 264-RTN'
    );
    expect(result.codec).toBe('h264');
  });

  test('xvid', () => {
    const result = parseTorrentTitle('Gotham S03E17 XviD-AFG');
    expect(result.codec).toBe('xvid');
  });

  test('mpeg2', () => {
    const result = parseTorrentTitle(
      'Jimmy Kimmel 2017 05 03 720p HDTV DD5 1 MPEG2-CTL'
    );
    expect(result.codec).toBe('mpeg2');
  });

  test('hvec10bit', () => {
    const result = parseTorrentTitle(
      '[Anime Time] Re Zero kara Hajimeru Isekai Seikatsu (Season 2 Part 1) [1080p][HEVC10bit x265][Multi Sub]'
    );
    expect(result.codec).toBe('hevc');
    expect(result.bitDepth).toBe('10bit');
  });

  test('hevc10', () => {
    const result = parseTorrentTitle(
      '[naiyas] Fate Stay Night - Unlimited Blade Works Movie [BD 1080P HEVC10 QAACx2 Dual Audio]'
    );
    expect(result.codec).toBe('hevc');
    expect(result.bitDepth).toBe('10bit');
  });

  test('skip 264 from episode number', () => {
    const result = parseTorrentTitle('[DB]_Bleach_264_[012073FE].avi');
    expect(result.codec).toBeUndefined();
  });

  test('skip 265 from episode number', () => {
    const result = parseTorrentTitle('[DB]_Bleach_265_[B4A04EC9].avi');
    expect(result.codec).toBeUndefined();
  });

  // PY tests
  test('x265 with 10bit', () => {
    const result = parseTorrentTitle(
      'Mad.Max.Fury.Road.2015.1080p.BluRay.DDP5.1.x265.10bit-GalaxyRG265[TGx]'
    );
    expect(result.codec).toBe('x265');
    expect(result.bitDepth).toBe('10bit');
  });
});
