# parse-torrent-title

A TypeScript library for parsing torrent titles. This is mostly a port of [go-ptt](https://github.com/MunifTanjim/go-ptt), which in turn is inspired by [TheBeastLT/parse-torrent-title](https://github.com/TheBeastLT/parse-torrent-title) and [dreulavelle/PTT](https://github.com/dreulavelle/PTT).

## Installation

**npm:**
```bash
npm install @viren070/parse-torrent-title
```

**pnpm:**
```bash
pnpm add @viren070/parse-torrent-title
```

**yarn:**
```bash
yarn add @viren070/parse-torrent-title
```

## Demo

Try out the parser in your browser with our [demo](https://viren070.github.io/parse-torrent-title/)! Enter any torrent filename and see the parsed results in real-time.

## Quick Start

```typescript
import { parseTorrentTitle } from '@viren070/parse-torrent-title';

const result = parseTorrentTitle('The.Matrix.1999.1080p.BluRay.x264.DTS-HD.MA.5.1');

console.log(result);
// {
//   "resolution": "1080p",
//   "year": "1999",
//   "quality": "BluRay",
//   "codec": "x264",
//   "channels": [
//     "5.1"
//   ],
//   "audio": [
//     "DTS Lossless"
//   ],
//   "title": "The Matrix"
// }
```

## Output Types

The parser returns a `ParsedResult` object with the following optional fields:

```typescript
interface ParsedResult {
  // Basic Information
  title?: string;           // Movie or series title
  year?: string;            // Release year
  date?: string;            // Release date
  
  // Video Quality
  resolution?: string;      // e.g., '1080p', '720p', '4K', '2160p'
  quality?: string;         // e.g., 'BluRay', 'WEB-DL', 'HDTV', 'DVDRip'
  codec?: string;           // e.g., 'x264', 'x265', 'hevc', 'xvid'
  bitDepth?: string;        // e.g., '10bit', '8bit'
  hdr?: string[];           // e.g., ['HDR10', 'HDR', 'Dolby Vision']
  threeD?: string;          // e.g., '3D SBS', '3D HOU'
  
  // Audio
  audio?: string[];         // e.g., ['DTS', 'AC3', 'AAC', 'MP3']
  channels?: string[];      // e.g., ['5.1', '7.1', '2.0']
  
  // Episode/Season Information
  seasons?: number[];       // Season numbers, e.g., [1, 2, 3]
  episodes?: number[];      // Episode numbers, e.g., [1, 2, 3]
  episodeCode?: string;     // e.g., '5E46AC39'
  complete?: boolean;       // Complete season/series indicator
  volumes?: number[];       // Volume numbers
  
  // Languages and Subtitles
  languages?: string[];     // e.g., ['English', 'Japanese', 'Multi']
  dubbed?: boolean;         // Whether content is dubbed
  subbed?: boolean;         // Whether subtitles are included
  hardcoded?: boolean;      // Hardcoded subtitles
  
  // Release Information
  group?: string;           // Release group name
  site?: string;            // Source site
  network?: string;         // Broadcasting network (e.g., 'Netflix', 'HBO', 'Amazon')
  edition?: string;         // e.g., 'Extended', 'Theatrical', "Director's Cut"
  releaseTypes?: string[];  // Release type tags
  
  // Release Flags
  repack?: boolean;         // Repack indicator
  proper?: boolean;         // Proper release indicator
  retail?: boolean;         // Retail release
  remastered?: boolean;     // Remastered release
  unrated?: boolean;        // Unrated version
  uncensored?: boolean;     // Uncensored version
  extended?: boolean;       // Extended version
  convert?: boolean;        // Converted release
  documentary?: boolean;    // Documentary flag
  commentary?: boolean;     // Commentary track included
  upscaled?: boolean;       // Upscaled content indicator
  
  // Technical Details
  container?: string;       // File container, e.g., 'mkv', 'mp4', 'avi'
  extension?: string;       // File extension
  region?: string;          // Regional encoding
  size?: string;            // File size
}
```

## Advanced Usage

### Using the Parser Class

For more control, you can use the `Parser` class:

```typescript
import { Parser } from '@viren070/parse-torrent-title';

// Create a parser with only specific fields
const parser = new Parser()
  .addDefaultHandlers('title', 'year', 'resolution', 'quality');

const result = parser.parse('The.Matrix.1999.1080p.BluRay.x264');
// Only extracts: title, year, resolution, quality
```

### Adding Custom Handlers

You can create custom handlers to extract additional information:

```typescript
import { Parser, Handler, toIntArray } from '@viren070/parse-torrent-title';

const customHandler: Handler = {
  field: 'customId',
  pattern: /custom-(\d+)/i,
  transform: toIntArray()
};

const parser = new Parser()
  .addDefaultHandlers() // Add all default handlers
  .addHandler(customHandler); // Add your custom handler

// Option 1: Without type parameter (custom fields are typed as 'any')
const result = parser.parse('Movie.2024.custom-123.1080p');
console.log(result.customId); // [123]

// Option 2: With type parameter for type-safe custom fields
type CustomFields = { customId: number[] };
const typedResult = parser.parse<CustomFields>('Movie.2024.custom-123.1080p');
console.log(typedResult.customId); // [123] - fully type-safe!
```

### Available Transformers

Transformers modify the captured value before it's stored in the result. All transformers are functions that return a `HandlerTransformer`.

**Value Transformers:**
- `toValue(value: string)` - Set a fixed value instead of the captured text
- `toBoolean()` - Set the value to `true` (useful for flags)
- `toIntArray()` - Convert captured text to an array with a single integer
- `toIntRange()` - Convert range like "1-8" to `[1,2,3,4,5,6,7,8]`

**String Transformers:**
- `toLowercase()` - Convert to lowercase
- `toUppercase()` - Convert to uppercase
- `toTrimmed()` - Trim whitespace from the value
- `toWithSuffix(suffix: string)` - Append a suffix to the value

**Date/Time Transformers:**
- `toDate(format: string)` - Parse and format date strings (supports formats like "2006 01 02", "20060102")
- `toYear()` - Extract and format year (handles year ranges like "2020-2024")
- `toCleanDate()` - Remove ordinal suffixes (1st → 1, 2nd → 2, etc.)
- `toCleanMonth()` - Normalize month names to 3-letter abbreviations

**Advanced Transformers:**
- `toValueSet(value: any)` - Add value to a ValueSet (for multi-value fields)
- `toValueSetWithTransform(fn: (v: string) => any)` - Transform and add to ValueSet
- `toValueSetMultiWithTransform(fn: (v: string) => any[])` - Transform to multiple values and add to ValueSet

**Processor:**
- `removeFromValue(regex: RegExp)` - Remove matching patterns from the captured value

### Available Validators

Validators determine whether a match should be accepted. They're used with the `validateMatch` property.

- `validateMatch(regex: RegExp)` - Accept only if the captured text matches the regex
- `validateNotMatch(regex: RegExp)` - Reject if the captured text matches the regex
- `validateNotAtStart()` - Reject matches at the start of the title
- `validateNotAtEnd()` - Reject matches at the end of the title
- `validateMatchedGroupsAreSame(...indices: number[])` - Accept only if specified capture groups have the same value
- `validateAnd(...validators: HandlerMatchValidator[])` - Combine multiple validators (all must pass)

Example with validators:

```typescript
import { Parser, Handler, validateNotMatch, toIntArray } from '@viren070/parse-torrent-title';

const handler: Handler = {
  field: 'episodes',
  pattern: /episode[.\s]*(\d+)/i,
  validateMatch: validateNotMatch(/season/i), // Don't match if "season" is present
  transform: toIntArray()
};
```

## Examples

### TV Series

```typescript
parseTorrentTitle('[Erai-raws] Attack on Titan - S04E01 [1080p][Multiple Subtitle].mkv');
// {
//   "resolution": "1080p",
//   "container": "mkv",
//   "seasons": [4],
//   "episodes": [1],
//   "languages": ["multi subs"],
//   "subbed": true,
//   "group": "Erai-raws",
//   "extension": "mkv",
//   "title": "Attack on Titan"
// }
```

### Season Packs

```typescript
parseTorrentTitle('Breaking.Bad.Season.1-5.Complete.1080p.BluRay.x265.HEVC.10bit');
// {
//   "resolution": "1080p",
//   "quality": "BluRay",
//   "bitDepth": "10bit",
//   "codec": "hevc",
//   "complete": true,
//   "seasons": [1, 2, 3, 4, 5],
//   "title": "Breaking Bad"
// }
```

### Movies with HDR

```typescript
parseTorrentTitle('Dune.2021.2160p.UHD.BluRay.HDR10.DV.x265.DTS-HD.MA.5.1');
// {
//   "resolution": "4k",
//   "year": "2021",
//   "quality": "BluRay",
//   "bitDepth": "10bit",
//   "hdr": [
//     "DV",
//     "HDR"
//   ],
//   "codec": "x265",
//   "channels": [
//     "5.1"
//   ],
//   "audio": [
//     "DTS Lossless"
//   ],
//   "title": "Dune"
// }
```

## TypeScript Support

This library is written in TypeScript and includes full type definitions. All types are exported for your use:

```typescript
import { ParsedResult, Handler } from '@viren070/parse-torrent-title';
```

## License

MIT

## Credits

- [MunifTanjim/go-ptt](https://github.com/MunifTanjim/go-ptt)
- [TheBeastLT/parse-torrent-title](https://github.com/TheBeastLT/parse-torrent-title)
- [dreulavelle/PTT](https://github.com/dreulavelle/PTT)
