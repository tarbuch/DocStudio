import type { JSONContent } from '@tiptap/core'

export interface DocumentSelection {
  from: number
  to: number
}

export interface FolderMetadata {
  id: string
  parentId: string | null
  name: string
  color?: string
  icon?: string
  createdAt: number
  updatedAt: number
  deleted: boolean
  deletedAt?: number
  order: number
  shared?: boolean
  locked?: boolean
  ownerId?: string
}

export interface DocumentMetadata {
  id: string
  title: string
  folderId: string | null
  createdAt: number
  updatedAt: number
  lastOpenedAt: number
  favorite: boolean
  deleted: boolean
  deletedAt?: number
  tags: string[]
  revision: number
  documentVersion: number
  status: 'idle' | 'loading' | 'saving' | 'error' | 'locked'
}

export interface DocumentContent {
  content: JSONContent
  lastSelection?: DocumentSelection
}

export interface AppPreferences {
  activeDocumentId: string | null
  documentsSidebarCollapsed: boolean
  outlineSidebarCollapsed: boolean
  lastOpened: string | null
  expandedFolders: string[]
}
