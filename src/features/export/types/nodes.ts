export type ExportNodeType = 
  | 'document'
  | 'paragraph'
  | 'heading'
  | 'text'
  | 'bulletList'
  | 'orderedList'
  | 'listItem'
  | 'table'
  | 'tableRow'
  | 'tableHeader'
  | 'tableCell'
  | 'image'
  | 'unsupported'

export interface BaseExportNode {
  type: ExportNodeType
}

export interface TextMark {
  type: 'bold' | 'italic' | 'underline' | 'strike' | 'link'
  attrs?: Record<string, unknown>
}

export interface TextNode extends BaseExportNode {
  type: 'text'
  text: string
  marks?: TextMark[]
}

export interface ParagraphNode extends BaseExportNode {
  type: 'paragraph'
  content?: (TextNode | ImageNode)[]
  alignment?: 'left' | 'center' | 'right' | 'justify'
  keepTogether?: boolean
  pageBreakBefore?: boolean
}

export interface HeadingNode extends BaseExportNode {
  type: 'heading'
  level: number
  content?: (TextNode | UnsupportedNode)[]
  alignment?: 'left' | 'center' | 'right' | 'justify'
  pageBreakBefore?: boolean
}

export interface BulletListNode extends BaseExportNode {
  type: 'bulletList'
  content?: ListItemNode[]
}

export interface OrderedListNode extends BaseExportNode {
  type: 'orderedList'
  content?: ListItemNode[]
}

export interface ListItemNode extends BaseExportNode {
  type: 'listItem'
  content?: AnyExportNode[]
}

export interface TableNode extends BaseExportNode {
  type: 'table'
  content?: TableRowNode[]
}

export interface TableRowNode extends BaseExportNode {
  type: 'tableRow'
  content?: (TableHeaderNode | TableCellNode)[]
}

export interface TableHeaderNode extends BaseExportNode {
  type: 'tableHeader'
  content?: AnyExportNode[]
}

export interface TableCellNode extends BaseExportNode {
  type: 'tableCell'
  content?: AnyExportNode[]
}

export interface ImageNode extends BaseExportNode {
  type: 'image'
  src: string
  alt?: string
  title?: string
  width?: number
  height?: number
  alignment?: 'left' | 'center' | 'right'
}

export interface UnsupportedNode extends BaseExportNode {
  type: 'unsupported'
  originalType: string
}

export type AnyExportNode = 
  | ParagraphNode 
  | HeadingNode 
  | TextNode 
  | BulletListNode 
  | OrderedListNode 
  | ListItemNode 
  | TableNode
  | TableRowNode
  | TableHeaderNode
  | TableCellNode
  | ImageNode
  | UnsupportedNode
