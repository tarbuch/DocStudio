import React, { useMemo } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown, Type, Heading1, Heading2, Heading3 } from 'lucide-react'
import { useEditorContext } from '../../providers/EditorProvider'

export const BlockFormatDropdown: React.FC = () => {
  const { commands } = useEditorContext()

  // Subscribe to selection updates to re-render the active block format
  const currentFormat = useMemo(() => {
    if (commands.isHeading(1)) return { label: 'Heading 1', icon: Heading1 }
    if (commands.isHeading(2)) return { label: 'Heading 2', icon: Heading2 }
    if (commands.isHeading(3)) return { label: 'Heading 3', icon: Heading3 }
    return { label: 'Text', icon: Type }
  }, [commands]) // Recompute on every command update (which triggers on selection change)

  const Icon = currentFormat.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="ghost" size="sm" className="h-9 gap-2 px-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="w-20 text-left truncate">{currentFormat.label}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      } />
      <DropdownMenuContent align="start" className="w-[180px]">
        <DropdownMenuItem onClick={commands.setParagraph} className="gap-2">
          <Type className="h-4 w-4" /> Text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => commands.toggleHeading(1)} className="gap-2">
          <Heading1 className="h-4 w-4" /> Heading 1
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => commands.toggleHeading(2)} className="gap-2">
          <Heading2 className="h-4 w-4" /> Heading 2
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => commands.toggleHeading(3)} className="gap-2">
          <Heading3 className="h-4 w-4" /> Heading 3
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
