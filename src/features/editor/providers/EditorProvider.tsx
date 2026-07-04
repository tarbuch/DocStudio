/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useEditorConfig } from '../hooks/useEditorConfig'
import { createEditorCommands } from '../commands/editorCommands'
import type { EditorContextType, EditorConfigProps } from '../types'

const EditorContext = createContext<EditorContextType | undefined>(undefined)

interface EditorProviderProps extends EditorConfigProps {
  children: ReactNode
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children, initialContent, onUpdate }) => {
  const [isError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const editor = useEditorConfig({
    initialContent,
    onUpdate,
  })

  useEffect(() => {
    if (editor) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false)
    }
  }, [editor])

  const commands = editor ? createEditorCommands(editor) : {}

  return (
    <EditorContext.Provider value={{ 
      editor, 
      isLoading, 
      isError, 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      commands: commands as any
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
