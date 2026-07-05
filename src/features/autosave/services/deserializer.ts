import type { JSONContent } from '@tiptap/core'
import type { DocumentData } from '../types'

/**
 * Safely deserializes a DocumentData payload back into a format TipTap can inject.
 * 
 * @param document - The saved DocumentData model
 * @returns The raw JSONContent or null if the payload is missing/corrupted
 */
export const deserializeDocument = (document: DocumentData | null | undefined): JSONContent | null => {
  if (!document) {
    return null
  }

  // Basic guard check to ensure content structure exists
  if (!document.content || typeof document.content !== 'object') {
    return null
  }

  return document.content
}
