import type { JSONContent } from '@tiptap/core'
import type { DocumentData } from '../types'

/**
 * Serializes the raw TipTap JSON representation into a standardized Application DocumentData model.
 * 
 * @param id - The unique identifier for the document
 * @param title - The title of the document
 * @param content - The raw JSONContent from the editor
 * @returns A structured DocumentData object ready for storage or network transport
 */
export const serializeDocument = (
  id: string,
  title: string,
  content: JSONContent
): DocumentData => {
  return {
    id,
    title,
    content,
    updatedAt: new Date().toISOString(),
    version: 1,
  }
}
