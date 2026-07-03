import React from 'react'
import { EditorContent } from '@tiptap/react'
import { useEditorContext } from '../providers/EditorProvider'
import { EditorSkeleton } from './EditorSkeleton'
import { EditorBubbleMenu } from './toolbar/EditorBubbleMenu'
import { TableContextMenu } from '../extensions/tables/TableContextMenu'

export const EditorCanvas: React.FC = () => {
  const { editor, isLoading, isError } = useEditorContext()

  if (isError) {
    return (
      <div className="w-full h-full text-destructive flex items-center justify-center p-8">
        <p>Failed to load the editor instance.</p>
      </div>
    )
  }

  if (isLoading || !editor) {
    return <EditorSkeleton />
  }

  return (
    <>
      <EditorBubbleMenu />
      <TableContextMenu />
      <EditorContent editor={editor} className="flex-1 outline-none prose prose-slate dark:prose-invert max-w-none w-full" />
    </>
  )
}


