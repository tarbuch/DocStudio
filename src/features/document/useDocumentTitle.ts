import { useState, useEffect } from 'react'
import { useDocumentContext } from '../documents/providers/DocumentProvider'
import { renameDocument } from '../documents/services/documentManager'

export const useDocumentTitle = () => {
  const { activeDocumentId, activeDocumentMeta } = useDocumentContext()
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(activeDocumentMeta?.title || 'Untitled Document')

  useEffect(() => {
    if (!isEditing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDraftTitle(activeDocumentMeta?.title || 'Untitled Document')
    }
  }, [activeDocumentMeta?.title, isEditing])

  const startEditing = () => {
    setDraftTitle(activeDocumentMeta?.title || 'Untitled Document')
    setIsEditing(true)
  }

  const commitEditing = () => {
    const trimmed = draftTitle.trim()
    const newTitle = trimmed === '' ? 'Untitled Document' : trimmed
    if (activeDocumentId) {
      renameDocument(activeDocumentId, newTitle)
      // Since we don't have a global state for activeDocumentMeta that updates proactively here (unless refreshLibrary is called in Sidebar), we might need to rely on the sidebar polling or we can just update it locally.
      // But the sidebar refreshes on its own.
    }
    setIsEditing(false)
  }

  const cancelEditing = () => {
    setDraftTitle(activeDocumentMeta?.title || 'Untitled Document')
    setIsEditing(false)
  }

  return {
    title: activeDocumentMeta?.title || 'Untitled Document',
    draftTitle,
    isEditing,
    setDraftTitle,
    startEditing,
    commitEditing,
    cancelEditing,
  }
}

