import { useState, useMemo, useCallback, useEffect } from 'react'
import { storageProvider } from '../services/documentStorage'
import { filterDocuments, sortDocuments } from '../services/documentSearch'
import { buildFolderTree } from '../services/folderManager'
import type { DocumentMetadata, FolderMetadata } from '../types/document'

export function useDocuments() {
  const [library, setLibrary] = useState<DocumentMetadata[]>([])
  const [folders, setFolders] = useState<FolderMetadata[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const refreshLibrary = useCallback(async () => {
    const docsData = await storageProvider.loadLibrary()
    const foldersData = await storageProvider.loadFolders()
    setLibrary(docsData)
    setFolders(foldersData)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshLibrary()
  }, [refreshLibrary])

  const { recentDocuments, favoriteDocuments, searchResults, folderTree } = useMemo(() => {
    const activeDocs = library.filter(doc => !doc.deleted)
    
    // Sort all by lastOpenedAt desc for LRU
    const sorted = sortDocuments(activeDocs, 'lastOpenedAt', 'desc')
    
    const favorites = sorted.filter(doc => doc.favorite)
    const recents = sorted.slice(0, 10)
    
    const searched = filterDocuments(sorted, searchQuery, false)
    
    const tree = buildFolderTree(folders)

    return {
      recentDocuments: recents,
      favoriteDocuments: favorites,
      searchResults: searched,
      folderTree: tree
    }
  }, [library, folders, searchQuery])

  return {
    library,
    folders,
    folderTree,
    searchQuery,
    setSearchQuery,
    recentDocuments,
    favoriteDocuments,
    searchResults,
    refreshLibrary
  }
}
