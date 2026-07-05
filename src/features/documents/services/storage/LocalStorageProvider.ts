import { DOCUMENT_CONSTANTS } from '../../constants/documents'
import type { DocumentMetadata, DocumentContent, AppPreferences, FolderMetadata, DocumentSnapshot } from '../../types/document'
import type { DocumentStorageProvider } from './types'

const DEFAULT_PREFERENCES: AppPreferences = {
  activeDocumentId: null,
  documentsSidebarCollapsed: false,
  outlineSidebarCollapsed: false,
  lastOpened: null,
  expandedFolders: [],
}

export class LocalStorageProvider implements DocumentStorageProvider {
  async loadLibrary(): Promise<DocumentMetadata[]> {
    return new Promise((resolve) => {
      try {
        const data = localStorage.getItem(DOCUMENT_CONSTANTS.STORAGE_KEY_LIBRARY)
        resolve(data ? JSON.parse(data) : [])
      } catch (e) {
        console.error('Failed to load library', e)
        resolve([])
      }
    })
  }

  async saveLibrary(library: DocumentMetadata[]): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(DOCUMENT_CONSTANTS.STORAGE_KEY_LIBRARY, JSON.stringify(library))
        resolve()
      } catch (e) {
        console.error('Failed to save library', e)
        reject(e)
      }
    })
  }

  async loadFolders(): Promise<FolderMetadata[]> {
    return new Promise((resolve) => {
      try {
        const data = localStorage.getItem(DOCUMENT_CONSTANTS.STORAGE_KEY_FOLDER_LIBRARY)
        resolve(data ? JSON.parse(data) : [])
      } catch (e) {
        console.error('Failed to load folders', e)
        resolve([])
      }
    })
  }

  async saveFolders(folders: FolderMetadata[]): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(DOCUMENT_CONSTANTS.STORAGE_KEY_FOLDER_LIBRARY, JSON.stringify(folders))
        resolve()
      } catch (e) {
        console.error('Failed to save folders', e)
        reject(e)
      }
    })
  }

  async loadContent(id: string): Promise<DocumentContent | null> {
    return new Promise((resolve) => {
      try {
        const data = localStorage.getItem(`${DOCUMENT_CONSTANTS.STORAGE_KEY_DOCUMENT_PREFIX}${id}`)
        resolve(data ? JSON.parse(data) : null)
      } catch (e) {
        console.error(`Failed to load document content ${id}`, e)
        resolve(null)
      }
    })
  }

  async saveContent(id: string, content: DocumentContent): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(`${DOCUMENT_CONSTANTS.STORAGE_KEY_DOCUMENT_PREFIX}${id}`, JSON.stringify(content))
        resolve()
      } catch (e) {
        console.error(`Failed to save document content ${id}`, e)
        reject(e)
      }
    })
  }

  async deleteContent(id: string): Promise<void> {
    return new Promise((resolve) => {
      try {
        localStorage.removeItem(`${DOCUMENT_CONSTANTS.STORAGE_KEY_DOCUMENT_PREFIX}${id}`)
        resolve()
      } catch (e) {
        console.error(`Failed to delete document content ${id}`, e)
        resolve()
      }
    })
  }

  async loadPreferences(): Promise<AppPreferences> {
    return new Promise((resolve) => {
      try {
        const data = localStorage.getItem(DOCUMENT_CONSTANTS.STORAGE_KEY_PREFERENCES)
        if (data) {
          resolve({ ...DEFAULT_PREFERENCES, ...JSON.parse(data) })
        } else {
          resolve(DEFAULT_PREFERENCES)
        }
      } catch (e) {
        console.error('Failed to load preferences', e)
        resolve(DEFAULT_PREFERENCES)
      }
    })
  }

  async savePreferences(preferences: AppPreferences): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(DOCUMENT_CONSTANTS.STORAGE_KEY_PREFERENCES, JSON.stringify(preferences))
        resolve()
      } catch (e) {
        console.error('Failed to save preferences', e)
        reject(e)
      }
    })
  }

  async loadSnapshots(documentId: string): Promise<DocumentSnapshot[]> {
    return new Promise((resolve) => {
      try {
        const data = localStorage.getItem(`${DOCUMENT_CONSTANTS.STORAGE_KEY_SNAPSHOT_PREFIX}${documentId}`)
        resolve(data ? JSON.parse(data) : [])
      } catch (e) {
        console.error(`Failed to load snapshots for ${documentId}`, e)
        resolve([])
      }
    })
  }

  async saveSnapshot(snapshot: DocumentSnapshot): Promise<void> {
    try {
      const snapshots = await this.loadSnapshots(snapshot.documentId)
      snapshots.unshift(snapshot) // Add to front
      
      // Cap to max length
      if (snapshots.length > DOCUMENT_CONSTANTS.MAX_SNAPSHOTS_PER_DOCUMENT) {
        snapshots.splice(DOCUMENT_CONSTANTS.MAX_SNAPSHOTS_PER_DOCUMENT)
      }
      
      localStorage.setItem(
        `${DOCUMENT_CONSTANTS.STORAGE_KEY_SNAPSHOT_PREFIX}${snapshot.documentId}`,
        JSON.stringify(snapshots)
      )
    } catch (e) {
      console.error(`Failed to save snapshot for ${snapshot.documentId}`, e)
      throw e
    }
  }

  async deleteSnapshot(documentId: string, snapshotId: string): Promise<void> {
    try {
      let snapshots = await this.loadSnapshots(documentId)
      snapshots = snapshots.filter(s => s.id !== snapshotId)
      
      localStorage.setItem(
        `${DOCUMENT_CONSTANTS.STORAGE_KEY_SNAPSHOT_PREFIX}${documentId}`,
        JSON.stringify(snapshots)
      )
    } catch (e) {
      console.error(`Failed to delete snapshot ${snapshotId}`, e)
      throw e
    }
  }
}
