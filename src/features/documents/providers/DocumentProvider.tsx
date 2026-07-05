import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useEditorContext } from '../../editor/providers/EditorProvider'
import { storageProvider } from '../services/documentStorage'
import { createDocument, migrateLegacyStorage, recordDocumentOpened, saveSnapshot } from '../services/documentManager'
import { useAutosave } from '../../autosave/hooks/useAutosave'
import { initializeSearchIndex } from '../../search/services/searchIndex'
import type { DocumentMetadata, AppPreferences } from '../types/document'
import { DOCUMENT_CONSTANTS } from '../constants/documents'

interface DocumentContextType {
  activeDocumentId: string | null
  preferences: AppPreferences
  switchDocument: (id: string, isInitial?: boolean) => Promise<void>
  updatePreferences: (updates: Partial<AppPreferences>) => void
  activeDocumentMeta: DocumentMetadata | null
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined)

export const DocumentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { editor } = useEditorContext()
  const [preferences, setPreferences] = useState<AppPreferences | null>(null)
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null)
  const [activeDocumentMeta, setActiveDocumentMeta] = useState<DocumentMetadata | null>(null)
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { saveState: _saveState, flushAutosave } = useAutosave(
    activeDocumentId ? editor : null,
    activeDocumentId || 'temp',
    activeDocumentMeta?.title || DOCUMENT_CONSTANTS.DEFAULT_DOCUMENT_TITLE
  )

  const updatePreferences = async (updates: Partial<AppPreferences>) => {
    if (!preferences) return
    const next = { ...preferences, ...updates }
    setPreferences(next)
    await storageProvider.savePreferences(next)
  }

  const switchDocument = async (targetId: string, isInitial = false) => {
    if (!editor) return
    if (targetId === activeDocumentId) return

    const previousDocumentId = activeDocumentId

    // 1. Flush pending autosave if not initial load
    if (activeDocumentId && !isInitial) {
      await flushAutosave()
      // Create a snapshot when switching documents
      await saveSnapshot(activeDocumentId, editor.getJSON())
    }

    // 2. Optimistically switch state
    setActiveDocumentId(targetId)
    // We intentionally don't set activeDocumentMeta yet, letting it load, or we can load it from library immediately.
    try {
      const library = await storageProvider.loadLibrary()
      const meta = library.find(doc => doc.id === targetId) || null
      setActiveDocumentMeta(meta)

      // 3. Load target content
      const targetContent = await storageProvider.loadContent(targetId)
      if (targetContent) {
        
        // 4. Record open
        await recordDocumentOpened(targetId)

        if (preferences) {
          updatePreferences({ lastOpened: targetId })
        }

        // 5. Restore content
        editor.commands.setContent(targetContent.content)
        
        // 6. Restore selection
        if (targetContent.lastSelection) {
          try {
            editor.commands.setTextSelection(targetContent.lastSelection)
          } catch (err) {
            // If selection is out of bounds due to corrupted data, ignore it
            console.warn('Failed to restore cursor selection', err)
            editor.commands.focus()
          }
        } else {
          editor.commands.focus()
        }
      } else {
        throw new Error('Document content not found')
      }
    } catch (err) {
      console.error('Failed to switch document', err)
      // Rollback
      if (previousDocumentId) {
        setActiveDocumentId(previousDocumentId)
      }
      alert('Failed to load document')
    }
  }

  useEffect(() => {
    const boot = async () => {
      await migrateLegacyStorage()
      
      const prefs = await storageProvider.loadPreferences()
      setPreferences(prefs)

      // Initialize search index asynchronously after storage is ready
      void initializeSearchIndex()

      const library = await storageProvider.loadLibrary()
      let initialDocId = prefs.lastOpened
      
      if (!initialDocId || !library.find(doc => doc.id === initialDocId && !doc.deleted)) {
        // Find most recent LRU
        const activeDocs = library.filter(d => !d.deleted).sort((a, b) => b.lastOpenedAt - a.lastOpenedAt)
        if (activeDocs.length > 0) {
          initialDocId = activeDocs[0].id
        } else {
          const newDoc = await createDocument()
          initialDocId = newDoc.id
        }
      }
      
      if (initialDocId) {
        await switchDocument(initialDocId, true)
      }
    }
    
    boot()
  // This effect should only run once on boot
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!preferences) return null // Wait for boot

  return (
    <DocumentContext.Provider value={{
      activeDocumentId,
      preferences,
      switchDocument,
      updatePreferences,
      activeDocumentMeta
    }}>
      {children}
    </DocumentContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDocumentContext = () => {
  const context = useContext(DocumentContext)
  if (!context) {
    throw new Error('useDocumentContext must be used within a DocumentProvider')
  }
  return context
}
