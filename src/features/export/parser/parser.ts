import type { JSONContent } from '@tiptap/core'
import type {
  DocumentAST,
  AnyExportNode,
  TextNode,
  TextMark,
  UnsupportedNode,
  ListItemNode,
  ExportMetrics,
  TableRowNode,
  TableHeaderNode,
  TableCellNode,
} from '../types'

/**
 * Transforms TipTap JSONContent into our intermediate DocumentAST
 */
export const parseTipTapToAST = (content: JSONContent): DocumentAST => {
  const metrics: ExportMetrics = {
    paragraphs: 0,
    headings: 0,
    lists: 0,
    tables: 0,
    unsupportedNodes: 0,
  }
  const unsupportedNodes: UnsupportedNode[] = []

  if (content.type !== 'doc' || !content.content) {
    return { type: 'document', content: [], unsupportedNodes, metrics }
  }

  const nodes = content.content.map((node) => parseNode(node, metrics, unsupportedNodes)).filter(Boolean) as AnyExportNode[]

  return {
    type: 'document',
    content: nodes,
    unsupportedNodes,
    metrics,
  }
}

const parseNode = (
  node: JSONContent, 
  metrics: ExportMetrics, 
  unsupportedNodes: UnsupportedNode[],
  inTable: boolean = false
): AnyExportNode | null => {
  if (!node.type) return null

  switch (node.type) {
    case 'paragraph':
      metrics.paragraphs++
      return {
        type: 'paragraph',
        content: node.content ? (node.content.map(n => parseNode(n, metrics, unsupportedNodes, inTable)).filter(Boolean) as (TextNode | UnsupportedNode)[]) : [],
      }

    case 'heading':
      metrics.headings++
      return {
        type: 'heading',
        level: node.attrs?.level || 1,
        content: node.content ? (node.content.map(n => parseNode(n, metrics, unsupportedNodes, inTable)).filter(Boolean) as (TextNode | UnsupportedNode)[]) : [],
      }

    case 'text':
      return {
        type: 'text',
        text: node.text || '',
        marks: node.marks ? (node.marks as unknown as TextMark[]) : undefined,
      }

    case 'bulletList':
    case 'orderedList':
      metrics.lists++
      return {
        type: node.type,
        content: node.content ? (node.content.map(n => parseNode(n, metrics, unsupportedNodes, inTable)).filter(Boolean) as ListItemNode[]) : [],
      }

    case 'listItem':
      return {
        type: 'listItem',
        content: node.content ? (node.content.map(n => parseNode(n, metrics, unsupportedNodes, inTable)).filter(Boolean) as AnyExportNode[]) : [],
      } as ListItemNode

    case 'table':
      if (inTable) {
        metrics.unsupportedNodes++
        const unsupported: UnsupportedNode = {
          type: 'unsupported',
          originalType: 'nestedTable',
        }
        unsupportedNodes.push(unsupported)
        return unsupported
      }
      metrics.tables++
      return {
        type: 'table',
        content: node.content ? (node.content.map(n => parseNode(n, metrics, unsupportedNodes, true)).filter(Boolean) as TableRowNode[]) : [],
      }

    case 'tableRow':
      return {
        type: 'tableRow',
        content: node.content ? (node.content.map(n => parseNode(n, metrics, unsupportedNodes, true)).filter(Boolean) as (TableHeaderNode | TableCellNode)[]) : [],
      }

    case 'tableHeader':
      return {
        type: 'tableHeader',
        content: node.content ? (node.content.map(n => parseNode(n, metrics, unsupportedNodes, true)).filter(Boolean) as AnyExportNode[]) : [],
      }

    case 'tableCell':
      return {
        type: 'tableCell',
        content: node.content ? (node.content.map(n => parseNode(n, metrics, unsupportedNodes, true)).filter(Boolean) as AnyExportNode[]) : [],
      }

    // Ignore unsupported nodes like tables, images, etc. for Phase 7.1
    default: {
      metrics.unsupportedNodes++
      const unsupported: UnsupportedNode = {
        type: 'unsupported',
        originalType: node.type,
      }
      unsupportedNodes.push(unsupported)
      return unsupported
    }
  }
}
