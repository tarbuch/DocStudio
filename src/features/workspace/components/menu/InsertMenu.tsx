import React, { useRef } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Image as ImageIcon, Table, Minus } from 'lucide-react'
import { useEditorContext } from '../../../editor/providers/EditorProvider'

export const InsertMenu: React.FC = () => {
  const { editor, commands } = useEditorContext()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      commands?.insertImage(file)
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <DropdownMenu>
        <DropdownMenuTrigger className="px-2 py-0.5 text-xs font-medium text-muted-foreground rounded-md hover:bg-accent hover:text-accent-foreground transition-colors outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
          Insert
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={handleImageClick} disabled={!editor}>
            <ImageIcon className="mr-2 h-4 w-4" />
            <span>Image</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => commands?.insertTable()} disabled={!commands?.canInsertTable()}>
            <Table className="mr-2 h-4 w-4" />
            <span>Table</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => commands?.insertHorizontalRule()} disabled={!editor}>
            <Minus className="mr-2 h-4 w-4" />
            <span>Horizontal Rule</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
