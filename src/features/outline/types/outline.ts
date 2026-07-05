export interface OutlineNode {
  id: string
  level: 1 | 2 | 3 | 4 | 5 | 6
  text: string
  position: number
  children: OutlineNode[]
  parentId?: string
  collapsed?: boolean
  index?: number
}
