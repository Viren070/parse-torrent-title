/**
 * Parse Torrent Title - TypeScript Port
 * 
 * A 1:1 port of the Go torrent title parser
 */

import { ParsedResult, Handler } from './types.js';
import { parse } from './parser.js';
import { handlers } from './handlers.js';

/**
 * Parse a torrent title and extract metadata
 * @param title - The torrent title to parse
 * @returns Parsed result with extracted metadata
 */
export function parseTorrentTitle(title: string): ParsedResult {
  return parse(title, handlers);
}

/**
 * Create a partial parser with only specific fields
 * @param fieldNames - Array of field names to parse
 * @returns A parser function that only extracts the specified fields
 */
export function getPartialParser(fieldNames: string[]): (title: string) => ParsedResult {
  const selectedFieldMap = new Set(fieldNames);
  
  const selectedHandlers = handlers.filter(h => selectedFieldMap.has(h.field));
  
  return (title: string) => parse(title, selectedHandlers);
}

// Export types for consumers
export { ParsedResult } from './types.js';
export { handlers };

