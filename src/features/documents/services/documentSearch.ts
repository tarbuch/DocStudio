import type { DocumentMetadata } from '../types/document'

export const filterDocuments = (
  documents: DocumentMetadata[],
  searchQuery: string,
  filterFavorites: boolean
): DocumentMetadata[] => {
  let filtered = documents.filter(doc => !doc.deleted)
  
  if (filterFavorites) {
    filtered = filtered.filter(doc => doc.favorite)
  }
  
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    filtered = filtered.filter(doc => 
      doc.title.toLowerCase().includes(query) || 
      doc.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  return filtered
}

export const sortDocuments = (
  documents: DocumentMetadata[],
  sortBy: 'updatedAt' | 'createdAt' | 'title' | 'lastOpenedAt' = 'updatedAt',
  order: 'asc' | 'desc' = 'desc'
): DocumentMetadata[] => {
  return [...documents].sort((a, b) => {
    let comparison: number
    if (sortBy === 'title') {
      comparison = a.title.localeCompare(b.title)
    } else {
      comparison = a[sortBy] - b[sortBy]
    }
    return order === 'asc' ? comparison : -comparison
  })
}
