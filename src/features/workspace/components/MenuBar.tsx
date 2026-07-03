import React from 'react'
import { cn } from '@/utils'

export const MenuBar: React.FC = () => {
  const menuItems = ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Help']

  return (
    <nav className="flex items-center gap-1 -ml-2 mt-0.5">
      {menuItems.map((item) => (
        <button
          key={item}
          className={cn(
            'px-2 py-0.5 text-xs font-medium text-muted-foreground rounded-md',
            'hover:bg-accent hover:text-accent-foreground transition-colors',
            'focus:outline-none focus:ring-1 focus:ring-ring'
          )}
        >
          {item}
        </button>
      ))}
    </nav>
  )
}
