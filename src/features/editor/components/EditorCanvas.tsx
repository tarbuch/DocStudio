import React from 'react'
import { EditorContent } from '@tiptap/react'
import { useEditorContext } from '../providers/EditorProvider'
import { EditorSkeleton } from './EditorSkeleton'
import { EditorBubbleMenu } from './toolbar/EditorBubbleMenu'
import { TableContextMenu } from '../extensions/tables/TableContextMenu'
import { EmptyState } from '../../document/EmptyState'
import { ImageDropzone } from '../extensions/images/ImageDropzone'
import { ImageToolbar } from '../extensions/images/ImageToolbar'

export const EditorCanvas: React.FC = () => {
  const { editor, isLoading, isError } = useEditorContext()

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center text-destructive">
        <p>Failed to load the editor workspace.</p>
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
      <ImageToolbar editor={editor} />
      <ImageDropzone />
      <div className="relative w-full h-full flex flex-col">
        <EmptyState />
        <EditorContent editor={editor} className="flex-1 outline-none prose prose-slate dark:prose-invert max-w-none w-full" />
      </div>
    </>
  )
}


