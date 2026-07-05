import { v4 as uuidv4 } from 'uuid'
import type { JSONContent } from '@tiptap/core'
import type { DocumentMetadata, DocumentContent, DocumentSnapshot } from '../types/document'
import { storageProvider } from './documentStorage'
import { DOCUMENT_CONSTANTS } from '../constants/documents'
import { reindexDocument } from '../../search/services/searchIndex'

const createEmptyContent = (): JSONContent => ({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
    },
  ],
})

export const migrateLegacyStorage = async (): Promise<boolean> => {
  try {
    const legacyData = localStorage.getItem('docstudio.current-document')
    if (!legacyData) return false

    const parsed = JSON.parse(legacyData)
    if (!parsed || !parsed.id || !parsed.content) return false

    const library = await storageProvider.loadLibrary()
    // Idempotency check
    if (library.some(doc => doc.id === parsed.id)) {
      return false
    }

    const now = Date.now()
    const newDoc: DocumentMetadata = {
      id: parsed.id,
      title: parsed.title || DOCUMENT_CONSTANTS.DEFAULT_DOCUMENT_TITLE,
      createdAt: parsed.lastModified || now,
      updatedAt: parsed.lastModified || now,
      lastOpenedAt: now,
      favorite: false,
      deleted: false,
      tags: [],
      folderId: null,
      revision: parsed.version || 1,
      documentVersion: 1,
      status: 'idle',
    }

    library.push(newDoc)
    await storageProvider.saveLibrary(library)
    await storageProvider.saveContent(newDoc.id, { content: parsed.content })
    
    // Clean up legacy storage
    localStorage.removeItem('docstudio.current-document')
    return true
  } catch (e) {
    console.error('Migration failed', e)
    return false
  }
}

export const createDocument = async (
  title: string = DOCUMENT_CONSTANTS.DEFAULT_DOCUMENT_TITLE,
  folderId: string | null = null
): Promise<DocumentMetadata> => {
  const library = await storageProvider.loadLibrary()
  const id = uuidv4()
  const now = Date.now()

  const newDoc: DocumentMetadata = {
    id,
    title,
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now,
    favorite: false,
    deleted: false,
    tags: [],
    folderId,
    revision: 1,
    documentVersion: 1,
    status: 'idle',
  }

  library.push(newDoc)
  await storageProvider.saveLibrary(library)
  await storageProvider.saveContent(id, { content: createEmptyContent() })
  
  void reindexDocument(id)

  return newDoc
}

export const duplicateDocument = async (id: string): Promise<DocumentMetadata | null> => {
  const library = await storageProvider.loadLibrary()
  const source = library.find(doc => doc.id === id)
  if (!source) return null

  const sourceContent = await storageProvider.loadContent(id)
  if (!sourceContent) return null

  const newId = uuidv4()
  const now = Date.now()
  const newDoc: DocumentMetadata = {
    ...source,
    id: newId,
    title: `${source.title} (Copy)`,
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now,
    revision: 1,
    documentVersion: 1,
    status: 'idle',
  }

  library.push(newDoc)
  await storageProvider.saveLibrary(library)
  
  // Deep copy content
  await storageProvider.saveContent(newId, JSON.parse(JSON.stringify(sourceContent)))
  
  void reindexDocument(newId)

  return newDoc
}

export const updateDocumentMetadata = async (id: string, updates: Partial<DocumentMetadata>): Promise<DocumentMetadata | null> => {
  const library = await storageProvider.loadLibrary()
  const index = library.findIndex(doc => doc.id === id)
  if (index === -1) return null

  library[index] = { ...library[index], ...updates, updatedAt: Date.now() }
  await storageProvider.saveLibrary(library)
  
  void reindexDocument(id)
  
  return library[index]
}

export const renameDocument = async (id: string, newTitle: string): Promise<DocumentMetadata | null> => {
  return updateDocumentMetadata(id, { title: newTitle })
}

export const toggleFavoriteDocument = async (id: string, favorite: boolean): Promise<DocumentMetadata | null> => {
  return updateDocumentMetadata(id, { favorite })
}

export const deleteDocument = async (id: string): Promise<DocumentMetadata | null> => {
  // Soft delete
  return updateDocumentMetadata(id, { deleted: true, deletedAt: Date.now() })
}

export const restoreDocument = async (id: string): Promise<DocumentMetadata | null> => {
  return updateDocumentMetadata(id, { deleted: false, deletedAt: undefined })
}

export const incrementDocumentRevision = async (id: string): Promise<DocumentMetadata | null> => {
  const library = await storageProvider.loadLibrary()
  const index = library.findIndex(doc => doc.id === id)
  if (index === -1) return null

  library[index] = { 
    ...library[index], 
    revision: library[index].revision + 1,
    updatedAt: Date.now() 
  }
  await storageProvider.saveLibrary(library)
  return library[index]
}

export const recordDocumentOpened = async (id: string): Promise<DocumentMetadata | null> => {
  return updateDocumentMetadata(id, { lastOpenedAt: Date.now() })
}

export const moveDocument = async (id: string, folderId: string | null): Promise<DocumentMetadata | null> => {
  return updateDocumentMetadata(id, { folderId })
}

export const loadSnapshots = async (documentId: string): Promise<DocumentSnapshot[]> => {
  return storageProvider.loadSnapshots(documentId)
}

export const saveSnapshot = async (documentId: string, content: DocumentContent): Promise<DocumentSnapshot> => {
  const snapshot: DocumentSnapshot = {
    id: uuidv4(),
    documentId,
    timestamp: Date.now(),
    content
  }
  await storageProvider.saveSnapshot(snapshot)
  return snapshot
}

export const deleteSnapshot = async (documentId: string, snapshotId: string): Promise<void> => {
  return storageProvider.deleteSnapshot(documentId, snapshotId)
}
