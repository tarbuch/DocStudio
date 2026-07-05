import { storageProvider } from '../../documents/services/documentStorage'

export interface SearchResult {
  id: string
  type: 'document' | 'folder'
  title: string
  subtitle?: string
  snippet?: string
}

interface IndexEntry {
  id: string
  type: 'document' | 'folder'
  title: string
  textContent: string
}

let searchIndex: IndexEntry[] = []
let isInitialized = false

const extractText = (contentRaw: unknown): string => {
  if (!contentRaw) return ''
  if (typeof contentRaw === 'string') return contentRaw
  
  const content = contentRaw as Record<string, unknown>
  if (content.type === 'text' && typeof content.text === 'string') return content.text
  
  if (Array.isArray(contentRaw)) {
    return contentRaw.map(extractText).join(' ')
  }
  
  if (content.content) {
    return extractText(content.content)
  }
  
  return ''
}

export const initializeSearchIndex = async () => {
  const library = await storageProvider.loadLibrary()
  const folders = await storageProvider.loadFolders()
  
  const entries: IndexEntry[] = []
  
  // Index folders
  for (const folder of folders) {
    if (!folder.deleted) {
      entries.push({
        id: folder.id,
        type: 'folder',
        title: folder.name,
        textContent: '',
      })
    }
  }

  // Index documents
  for (const doc of library) {
    if (!doc.deleted) {
      const content = await storageProvider.loadContent(doc.id)
      const text = content ? extractText(content.content) : ''
      entries.push({
        id: doc.id,
        type: 'document',
        title: doc.title,
        textContent: text.toLowerCase(),
      })
    }
  }

  searchIndex = entries
  isInitialized = true
}

export const reindexDocument = async (id: string) => {
  if (!isInitialized) return
  
  searchIndex = searchIndex.filter(e => e.id !== id)
  
  const library = await storageProvider.loadLibrary()
  const doc = library.find(d => d.id === id)
  
  if (doc && !doc.deleted) {
    const content = await storageProvider.loadContent(doc.id)
    const text = content ? extractText(content.content) : ''
    searchIndex.push({
      id: doc.id,
      type: 'document',
      title: doc.title,
      textContent: text.toLowerCase(),
    })
  }
}

export const reindexFolder = async (id: string) => {
  if (!isInitialized) return
  
  searchIndex = searchIndex.filter(e => e.id !== id)
  
  const folders = await storageProvider.loadFolders()
  const folder = folders.find(f => f.id === id)
  
  if (folder && !folder.deleted) {
    searchIndex.push({
      id: folder.id,
      type: 'folder',
      title: folder.name,
      textContent: '',
    })
  }
}

export const search = (query: string): SearchResult[] => {
  if (!query || query.trim().length === 0) return []
  const lowerQuery = query.toLowerCase()
  
  const results: SearchResult[] = []
  
  for (const entry of searchIndex) {
    let match = false
    let snippet = ''

    if (entry.title.toLowerCase().includes(lowerQuery)) {
      match = true
    } else if (entry.textContent.includes(lowerQuery)) {
      match = true
      // Extract snippet
      const index = entry.textContent.indexOf(lowerQuery)
      const start = Math.max(0, index - 20)
      const end = Math.min(entry.textContent.length, index + lowerQuery.length + 20)
      snippet = `...${entry.textContent.substring(start, end)}...`
    }

    if (match) {
      results.push({
        id: entry.id,
        type: entry.type,
        title: entry.title,
        snippet,
        subtitle: entry.type === 'folder' ? 'Folder' : 'Document',
      })
    }
    
    // Cap results
    if (results.length > 20) break
  }
  
  return results
}
