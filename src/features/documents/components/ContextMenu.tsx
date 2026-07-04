import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'

export interface ContextMenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  onClick: () => void
  disabled?: boolean
  danger?: boolean
  divider?: boolean
}

interface ContextMenuProps {
  x: number
  y: number
  items: ContextMenuItem[]
  onClose: () => void
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const focusedIndex = useRef<number>(-1)
  const [position, setPosition] = useState({ top: y, left: x })

  useLayoutEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect()
      let newX = x
      let newY = y

      if (x + rect.width > window.innerWidth) {
        newX = window.innerWidth - rect.width - 8
      }
      if (y + rect.height > window.innerHeight) {
        newY = window.innerHeight - rect.height - 8
      }

      setPosition({ left: newX, top: newY })
    }
  }, [x, y])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    
    // Use capture phase to ensure it runs before other click handlers
    document.addEventListener('mousedown', handleClickOutside, true)
    return () => document.removeEventListener('mousedown', handleClickOutside, true)
  }, [onClose])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        moveFocus(1)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        moveFocus(-1)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const activeItem = items[focusedIndex.current]
        if (activeItem && !activeItem.disabled && !activeItem.divider) {
          activeItem.onClick()
          onClose()
        }
      }
    }

    const moveFocus = (dir: 1 | -1) => {
      if (!menuRef.current) return
      const buttons = Array.from(menuRef.current.querySelectorAll('button:not(:disabled)')) as HTMLButtonElement[]
      if (buttons.length === 0) return

      let newIndex = focusedIndex.current + dir
      if (newIndex >= buttons.length) newIndex = 0
      if (newIndex < 0) newIndex = buttons.length - 1
      
      focusedIndex.current = newIndex
      buttons[newIndex].focus()
    }

    document.addEventListener('keydown', handleKeyDown, true)
    
    // Focus the menu wrapper initially
    if (menuRef.current) {
      menuRef.current.focus()
    }

    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [items, onClose])

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-50 min-w-48 bg-card border border-border shadow-md rounded-md py-1 animate-in fade-in zoom-in-95 duration-100 outline-none"
      style={{ top: position.top, left: position.left }}
      tabIndex={-1}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      {items.map((item) => {
        if (item.divider) {
          return <div key={item.id} className="h-px bg-border/50 my-1 mx-2" />
        }
        
        return (
          <button
            key={item.id}
            onClick={(e) => {
              e.stopPropagation()
              if (!item.disabled) {
                item.onClick()
                onClose()
              }
            }}
            disabled={item.disabled}
            className={`w-full text-left px-3 py-1.5 text-sm flex items-center space-x-2 outline-none transition-colors
              ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted focus:bg-muted'}
              ${item.danger ? 'text-destructive hover:bg-destructive/10 focus:bg-destructive/10' : 'text-foreground'}
            `}
          >
            {item.icon && <span className="w-4 h-4 flex items-center justify-center shrink-0">{item.icon}</span>}
            <span className="flex-1 truncate">{item.label}</span>
          </button>
        )
      })}
    </div>,
    document.body
  )
}
