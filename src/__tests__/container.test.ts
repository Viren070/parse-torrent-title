import { parseTorrentTitle } from '../index';

describe('Container Detection Tests', () => {
  test('mkv', () => {
    const result = parseTorrentTitle('Kevin Hart What Now (2016) 1080p BluRay x265 6ch -Dtech mkv');
    expect(result.container).toBe('mkv');
  });

  test('mp4', () => {
    const result = parseTorrentTitle('The Gorburger Show S01E05 AAC MP4-Mobile');
    expect(result.container).toBe('mp4');
  });

  test('avi', () => {
    const result = parseTorrentTitle('[req]Night of the Lepus (1972) DVDRip XviD avi');
    expect(result.container).toBe('avi');
  });
});
