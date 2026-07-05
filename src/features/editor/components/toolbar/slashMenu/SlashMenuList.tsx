import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlashMenuItem } from './SlashMenuItem'
import type { SlashCommandItem } from '../../../extensions/slash/slashCommandSuggestion'

interface SlashMenuListProps {
  items: SlashCommandItem[]
  command: (item: SlashCommandItem) => void
}

export const SlashMenuList = forwardRef((props: SlashMenuListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    setSelectedIndex(0)
  }, [props.items])

  const selectItem = (index: number) => {
    const item = props.items[index]
    if (item) {
      props.command(item)
    }
  }

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
        return true
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setSelectedIndex((selectedIndex + 1) % props.items.length)
        return true
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        selectItem(selectedIndex)
        return true
      }

      return false
    },
  }))

  if (!props.items.length) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -5 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="z-50 flex w-72 flex-col gap-1 overflow-y-auto rounded-lg border border-border/60 bg-background/95 p-2 shadow-lg backdrop-blur custom-scrollbar max-h-80"
      >
        <div className="px-2 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Basic Blocks
        </div>
        {props.items.map((item, index) => (
          <SlashMenuItem
            key={index}
            item={item}
            isSelected={index === selectedIndex}
            onClick={() => selectItem(index)}
            onMouseEnter={() => setSelectedIndex(index)}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  )
})

SlashMenuList.displayName = 'SlashMenuList'
