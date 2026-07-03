/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useEditorConfig } from '../hooks/useEditorConfig'
import { createEditorCommands } from '../commands/editorCommands'
import { useAutosave } from '../../autosave/hooks/useAutosave'
import { loadDocument, removeDocument } from '../../autosave/services/storage'
import { deserializeDocument } from '../../autosave/services/deserializer'
import type { EditorContextType, EditorConfigProps } from '../types'

const EditorContext = createContext<EditorContextType | undefined>(undefined)

interface EditorProviderProps extends EditorConfigProps {
  children: ReactNode
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children, initialContent, onUpdate }) => {
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [documentTitle, setDocumentTitle] = useState(() => {
    const stored = loadDocument()
    return stored?.title || 'Untitled Document'
  })
  const [hasHydrated, setHasHydrated] = useState(false)

  const editor = useEditorConfig({
    initialContent,
    onUpdate,
  })

  useEffect(() => {
    try {
      if (editor) {
        if (!hasHydrated) {
          const storedDoc = loadDocument()
          if (storedDoc) {
            const deserialized = deserializeDocument(storedDoc)
            if (deserialized) {
              editor.commands.setContent(deserialized)
            } else {
              removeDocument()
            }
          }
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setHasHydrated(true)
        }
        setIsLoading(false)
      }
    } catch (e) {
      console.error('Failed to initialize Tiptap editor', e)
      setIsError(true)
      setIsLoading(false)
    }
  }, [editor, hasHydrated])

  const commands = createEditorCommands(editor)
  
  // Phase 6.2 Autosave Engine Integration
  // Real integration uses the hydrated title
  const { saveState } = useAutosave(
    hasHydrated ? editor : null, 
    'default-doc-id', 
    documentTitle
  )

  return (
    <EditorContext.Provider value={{ 
      editor, 
      isLoading, 
      isError, 
      commands, 
      saveState, 
      documentTitle, 
      setDocumentTitle 
    }}>
      {children}
    </EditorContext.Provider>
  )
}

export const useEditorContext = () => {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditorContext must be used within an EditorProvider')
  }
  return context
}
