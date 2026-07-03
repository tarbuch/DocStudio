
import type { JSONContent } from '@tiptap/core'

/**
 * Represents the unified application-level document model.
 * All persistence, network, and storage logic must deal with this model
 * rather than raw TipTap structures directly.
 */
export interface DocumentData {
  /**
   * Unique identifier for the document.
   */
  id: string

  /**
   * The human-readable title of the document.
   */
  title: string

  /**
   * The internal content structure (TipTap JSON).
   */
  content: JSONContent

  /**
   * ISO string representation of the last update time.
   */
  updatedAt: string

  /**
   * Application document version for migration/tracking purposes.
   */
  version: number
}
