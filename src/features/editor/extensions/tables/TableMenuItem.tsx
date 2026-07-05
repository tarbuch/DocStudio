import React from 'react'
import { cn } from '@/utils'

interface TableMenuItemProps {
  icon: React.ElementType
  label: string
  onClick: () => void
  destructive?: boolean
}

export const TableMenuItem: React.FC<TableMenuItemProps> = ({ icon: Icon, label, onClick, destructive }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none',
        destructive && 'text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive'
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </button>
  )
}
