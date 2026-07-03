/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useEditorConfig } from '../hooks/useEditorConfig'
import { createEditorCommands } from '../commands/editorCommands'
import { useAutosave } from '../../autosave/hooks/useAutosave'
import type { EditorContextType, EditorConfigProps } from '../types'

const EditorContext = createContext<EditorContextType | undefined>(undefined)

interface EditorProviderProps extends EditorConfigProps {
  children: ReactNode
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children, initialContent, onUpdate }) => {
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const editor = useEditorConfig({
    initialContent,
    onUpdate,
  })

  useEffect(() => {
    try {
      // If editor successfully mounts and processes, it's no longer loading
      if (editor) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoading(false)
      }
    } catch (e) {
      console.error('Failed to initialize Tiptap editor', e)
      setIsError(true)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false)
    }
  }, [editor])

  const commands = createEditorCommands(editor)
  
  // Phase 6.2 Autosave Engine Integration
  // For now, hardcode ID and Title. Real integration happens when we add multi-doc support.
  const { saveState } = useAutosave(editor, 'default-doc-id', 'Untitled Document')

  return (
    <EditorContext.Provider value={{ editor, isLoading, isError, commands, saveState }}>
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
