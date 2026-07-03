import type { JSONContent } from '@tiptap/core'
import type {
  DocumentAST,
  AnyExportNode,
  TextNode,
  TextMark,
  UnsupportedNode,
  ListItemNode,
} from '../types'

/**
 * Transforms TipTap JSONContent into our intermediate DocumentAST
 */
export const parseTipTapToAST = (content: JSONContent): DocumentAST => {
  if (content.type !== 'doc' || !content.content) {
    return { type: 'document', content: [] }
  }

  const nodes = content.content.map(parseNode).filter(Boolean) as AnyExportNode[]

  return {
    type: 'document',
    content: nodes,
  }
}

const parseNode = (node: JSONContent): AnyExportNode | null => {
  if (!node.type) return null

  switch (node.type) {
    case 'paragraph':
      return {
        type: 'paragraph',
        content: node.content ? (node.content.map(parseNode).filter(Boolean) as (TextNode | UnsupportedNode)[]) : [],
      }

    case 'heading':
      return {
        type: 'heading',
        level: node.attrs?.level || 1,
        content: node.content ? (node.content.map(parseNode).filter(Boolean) as (TextNode | UnsupportedNode)[]) : [],
      }

    case 'text':
      return {
        type: 'text',
        text: node.text || '',
        marks: node.marks ? (node.marks as unknown as TextMark[]) : undefined,
      }

    case 'bulletList':
      return {
        type: 'bulletList',
        content: node.content ? (node.content.map(parseNode).filter(Boolean) as ListItemNode[]) : [],
      }

    case 'orderedList':
      return {
        type: 'orderedList',
        content: node.content ? (node.content.map(parseNode).filter(Boolean) as ListItemNode[]) : [],
      }

    case 'listItem':
      return {
        type: 'listItem',
        content: node.content ? (node.content.map(parseNode).filter(Boolean) as AnyExportNode[]) : [],
      } as ListItemNode

    // Ignore unsupported nodes like tables, images, etc. for Phase 7.1
    default:
      return {
        type: 'unsupported',
        originalType: node.type,
      }
  }
}
