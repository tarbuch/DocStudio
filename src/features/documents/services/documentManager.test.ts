import { describe, it, expect, beforeEach } from 'vitest'
import { createDocument, deleteDocument, duplicateDocument, moveDocument } from './documentManager'
import { storageProvider } from './documentStorage'
import { createFolder } from './folderManager'

describe('documentManager', () => {
  beforeEach(async () => {
    await storageProvider.saveLibrary([])
    await storageProvider.saveFolders([])
  })

  it('creates a new document in root', async () => {
    const doc = await createDocument('Test Doc')
    expect(doc.title).toBe('Test Doc')
    expect(doc.folderId).toBeNull()
    expect(doc.status).toBe('idle')
  })

  it('creates a document in a folder', async () => {
    const folder = await createFolder('My Folder')
    const doc = await createDocument('Nested Doc', folder.id)
    
    expect(doc.folderId).toBe(folder.id)
  })

  it('soft deletes a document', async () => {
    const doc = await createDocument('To Delete')
    await deleteDocument(doc.id)
    
    const docs = await storageProvider.loadLibrary()
    const deletedDoc = docs.find(d => d.id === doc.id)
    expect(deletedDoc).toBeDefined()
    expect(deletedDoc?.deleted).toBe(true)
  })

  it('duplicates a document', async () => {
    const doc = await createDocument('Original')
    await storageProvider.saveContent(doc.id, { type: 'doc', content: [] })
    
    const duplicate = await duplicateDocument(doc.id)
    expect(duplicate).toBeDefined()
    expect(duplicate?.title).toBe('Original (Copy)')
    
    const duplicateContent = await storageProvider.loadContent(duplicate!.id)
    expect(duplicateContent).toBeDefined()
  })

  it('moves a document to a folder', async () => {
    const doc = await createDocument('Move Me')
    const folder = await createFolder('Target')
    
    await moveDocument(doc.id, folder.id)
    
    const library = await storageProvider.loadLibrary()
    const movedDoc = library.find(d => d.id === doc.id)
    expect(movedDoc?.folderId).toBe(folder.id)
  })
})
