/**
 * Processors
 */

import { HandlerProcessor, ParseMeta } from './types';

export function removeFromValue(re: RegExp): HandlerProcessor {
  return (title: string, m: ParseMeta): ParseMeta => {
    if (typeof m.value === 'string' && m.value !== '') {
      m.value = m.value.replace(re, '');
    }
    return m;
  };
}
