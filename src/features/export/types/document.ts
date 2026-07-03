import type { AnyExportNode, UnsupportedNode } from './nodes'

export interface ExportMetrics {
  paragraphs: number
  headings: number
  lists: number
  tables: number
  unsupportedNodes: number
}

export interface DocumentAST {
  type: 'document'
  content: AnyExportNode[]
  unsupportedNodes: UnsupportedNode[]
  metrics: ExportMetrics
}
