import { v4 as uuidv4 } from 'uuid'
import type { FolderMetadata } from '../types/document'
import { storageProvider } from './documentStorage'

export interface FolderTreeNode extends FolderMetadata {
  children: FolderTreeNode[]
}

export const createFolder = async (name: string, parentId: string | null = null): Promise<FolderMetadata> => {
  const folders = await storageProvider.loadFolders()
  const now = Date.now()

  // Determine order (append to end)
  const siblings = folders.filter(f => f.parentId === parentId && !f.deleted)
  const maxOrder = siblings.reduce((max, f) => Math.max(max, f.order), -1)

  const newFolder: FolderMetadata = {
    id: uuidv4(),
    parentId,
    name,
    createdAt: now,
    updatedAt: now,
    deleted: false,
    order: maxOrder + 1
  }

  folders.push(newFolder)
  await storageProvider.saveFolders(folders)
  return newFolder
}

export const updateFolderMetadata = async (id: string, updates: Partial<FolderMetadata>): Promise<FolderMetadata | null> => {
  const folders = await storageProvider.loadFolders()
  const folder = folders.find(f => f.id === id)
  if (!folder) return null

  Object.assign(folder, updates, { updatedAt: Date.now() })
  await storageProvider.saveFolders(folders)
  return folder
}

export const renameFolder = async (id: string, newName: string): Promise<FolderMetadata | null> => {
  return updateFolderMetadata(id, { name: newName })
}

export const moveFolder = async (id: string, newParentId: string | null): Promise<FolderMetadata | null> => {
  const folders = await storageProvider.loadFolders()
  const folder = folders.find(f => f.id === id)
  if (!folder) return null

  // Prevent circular references
  let currentParent = newParentId
  while (currentParent) {
    if (currentParent === id) return null // Cannot move folder into itself or its descendants
    const parentFolder = folders.find(f => f.id === currentParent)
    currentParent = parentFolder ? parentFolder.parentId : null
  }

  // Determine order in new parent
  const siblings = folders.filter(f => f.parentId === newParentId && !f.deleted)
  const maxOrder = siblings.reduce((max, f) => Math.max(max, f.order), -1)

  folder.parentId = newParentId
  folder.order = maxOrder + 1
  folder.updatedAt = Date.now()
  await storageProvider.saveFolders(folders)
  return folder
}

export const findChildren = (folderId: string, folders: FolderMetadata[]): FolderMetadata[] => {
  const children = folders.filter(f => f.parentId === folderId)
  let allChildren = [...children]
  children.forEach(child => {
    allChildren = allChildren.concat(findChildren(child.id, folders))
  })
  return allChildren
}

export const deleteFolder = async (id: string): Promise<void> => {
  const folders = await storageProvider.loadFolders()
  const folder = folders.find(f => f.id === id)
  if (!folder) return

  const now = Date.now()
  const toDelete = [folder, ...findChildren(id, folders)]
  const folderIds = toDelete.map(f => f.id)
  
  toDelete.forEach(f => {
    f.deleted = true
    f.deletedAt = now
    f.updatedAt = now
  })

  await storageProvider.saveFolders(folders)

  // Cascade delete documents
  const library = await storageProvider.loadLibrary()
  let libraryChanged = false
  library.forEach(doc => {
    if (doc.folderId && folderIds.includes(doc.folderId) && !doc.deleted) {
      doc.deleted = true
      doc.deletedAt = now
      doc.updatedAt = now
      libraryChanged = true
    }
  })
  if (libraryChanged) await storageProvider.saveLibrary(library)
}

export const restoreFolder = async (id: string): Promise<void> => {
  const folders = await storageProvider.loadFolders()
  const folder = folders.find(f => f.id === id)
  if (!folder) return

  const now = Date.now()
  const toRestore = [folder, ...findChildren(id, folders)]
  const folderIds = toRestore.map(f => f.id)
  
  toRestore.forEach(f => {
    f.deleted = false
    f.deletedAt = undefined
    f.updatedAt = now
  })

  // If the parent is still deleted, move this folder to root
  if (folder.parentId) {
    const parent = folders.find(f => f.id === folder.parentId)
    if (!parent || parent.deleted) {
      folder.parentId = null
    }
  }

  await storageProvider.saveFolders(folders)

  // Cascade restore documents
  const library = await storageProvider.loadLibrary()
  let libraryChanged = false
  library.forEach(doc => {
    if (doc.folderId && folderIds.includes(doc.folderId) && doc.deleted) {
      doc.deleted = false
      doc.deletedAt = undefined
      doc.updatedAt = now
      libraryChanged = true
    }
  })
  if (libraryChanged) await storageProvider.saveLibrary(library)
}

export const buildFolderTree = (folders: FolderMetadata[]): FolderTreeNode[] => {
  const activeFolders = folders.filter(f => !f.deleted)
  const map = new Map<string, FolderTreeNode>()
  const roots: FolderTreeNode[] = []

  // Create nodes
  activeFolders.forEach(f => {
    map.set(f.id, { ...f, children: [] })
  })

  // Build tree
  activeFolders.forEach(f => {
    const node = map.get(f.id)!
    if (f.parentId && map.has(f.parentId)) {
      map.get(f.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  })

  // Sort children by order
  const sortNodes = (nodes: FolderTreeNode[]) => {
    nodes.sort((a, b) => a.order - b.order)
    nodes.forEach(n => sortNodes(n.children))
  }
  
  sortNodes(roots)
  return roots
}

export const flattenTree = (tree: FolderTreeNode[]): FolderMetadata[] => {
  let flat: FolderMetadata[] = []
  tree.forEach(node => {
    const { children, ...metadata } = node
    flat.push(metadata)
    flat = flat.concat(flattenTree(children))
  })
  return flat
}
