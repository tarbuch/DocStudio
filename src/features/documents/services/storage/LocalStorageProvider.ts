import { DOCUMENT_CONSTANTS } from '../../constants/documents'
import type { DocumentMetadata, DocumentContent, AppPreferences, FolderMetadata } from '../../types/document'
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
}
