import { describe, it, expect, beforeEach } from 'vitest'
import { createFolder, renameFolder, moveFolder, deleteFolder, updateFolderMetadata } from './folderManager'
import { storageProvider } from './documentStorage'

describe('folderManager', () => {
  beforeEach(async () => {
    // Clear storage before each test
    await storageProvider.saveFolders([])
    await storageProvider.saveLibrary([])
  })

  it('creates a new folder', async () => {
    const folder = await createFolder('Test Folder')
    expect(folder.name).toBe('Test Folder')
    expect(folder.id).toBeDefined()
    expect(folder.parentId).toBeNull()
    expect(folder.deleted).toBe(false)
  })

  it('renames a folder', async () => {
    const folder = await createFolder('Old Name')
    await renameFolder(folder.id, 'New Name')
    
    const folders = await storageProvider.loadFolders()
    expect(folders.find(f => f.id === folder.id)?.name).toBe('New Name')
  })

  it('moves a folder into another folder', async () => {
    const parent = await createFolder('Parent')
    const child = await createFolder('Child')
    
    await moveFolder(child.id, parent.id)
    
    const folders = await storageProvider.loadFolders()
    expect(folders.find(f => f.id === child.id)?.parentId).toBe(parent.id)
  })

  it('updates folder metadata', async () => {
    const folder = await createFolder('Colored')
    await updateFolderMetadata(folder.id, { color: 'red', icon: 'default' })
    
    const folders = await storageProvider.loadFolders()
    const updated = folders.find(f => f.id === folder.id)
    expect(updated?.color).toBe('red')
    expect(updated?.icon).toBe('default')
  })

  it('cascading soft deletes folders', async () => {
    const parent = await createFolder('Parent')
    const child = await createFolder('Child')
    await moveFolder(child.id, parent.id)
    
    await deleteFolder(parent.id)
    
    const folders = (await storageProvider.loadFolders()).filter(f => !f.deleted) // loadFolders by default excludes deleted
    expect(folders.length).toBe(0)
  })
})
