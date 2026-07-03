import React from 'react'
import type { SlashCommandItem } from '../../../extensions/slash/slashCommandSuggestion'
import { cn } from '@/utils'

interface SlashMenuItemProps {
  item: SlashCommandItem
  isSelected: boolean
  onClick: () => void
  onMouseEnter: () => void
}

export const SlashMenuItem: React.FC<SlashMenuItemProps> = ({ item, isSelected, onClick, onMouseEnter }) => {
  const Icon = item.icon

  return (
    <button
      className={cn(
        'flex w-full items-center gap-3 rounded-sm px-2 py-1.5 text-left text-sm transition-colors',
        isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex flex-col">
        <span className="font-medium">{item.title}</span>
        <span className="text-xs text-muted-foreground">{item.description}</span>
      </div>
    </button>
  )
}
