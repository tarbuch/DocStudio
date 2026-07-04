import type { DocumentMetadata, DocumentContent, AppPreferences, FolderMetadata } from '../../types/document'

export interface DocumentStorageProvider {
  loadLibrary(): Promise<DocumentMetadata[]>
  saveLibrary(library: DocumentMetadata[]): Promise<void>
  loadFolders(): Promise<FolderMetadata[]>
  saveFolders(folders: FolderMetadata[]): Promise<void>
  loadContent(id: string): Promise<DocumentContent | null>
  saveContent(id: string, content: DocumentContent): Promise<void>
  deleteContent(id: string): Promise<void>
  loadPreferences(): Promise<AppPreferences>
  savePreferences(preferences: AppPreferences): Promise<void>
}
