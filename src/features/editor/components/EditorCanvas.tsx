import React from 'react'
import { EditorContent } from '@tiptap/react'
import { useEditorContext } from '../providers/EditorProvider'
import { EditorSkeleton } from './EditorSkeleton'

export const EditorCanvas: React.FC = () => {
  const { editor, isLoading, isError } = useEditorContext()

  if (isError) {
    return (
      <div className="w-full max-w-4xl mx-auto min-h-[500px] border border-destructive/50 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center mt-8 p-8">
        <p>Failed to load the editor instance.</p>
      </div>
    )
  }

  if (isLoading || !editor) {
    return <EditorSkeleton />
  }

  return (
    <div className="w-full max-w-4xl mx-auto min-h-[500px] border border-border rounded-lg bg-card shadow-sm mt-8 overflow-hidden transition-all duration-200 focus-within:shadow-md focus-within:border-accent">
      <div className="h-full p-8 sm:p-12">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

