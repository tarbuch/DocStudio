import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Editor } from '@tiptap/core'
import type { Transaction } from '@tiptap/pm/state'
import type { StepMap } from '@tiptap/pm/transform'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import type { OutlineNode } from '../types/outline'
import { parseDocumentOutline } from '../services/outlineParser'
import { filterOutlineTree } from '../services/outlineSearch'
import { navigateToHeading } from '../services/outlineNavigator'
import { OUTLINE_CONSTANTS } from '../constants/outline'

export function useOutline(editor: Editor | null) {
  const [outline, setOutline] = useState<OutlineNode[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null)

  // 1. Parse Outline & Subscribe to changes
  useEffect(() => {
    if (!editor) return

    // Initial parse
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOutline(parseDocumentOutline(editor.state.doc))

    let timeoutId: NodeJS.Timeout

    const handleTransaction = ({ transaction }: { transaction: Transaction }) => {
      if (!transaction.docChanged) return

      let headingChanged = false

      // Check if any heading nodes were added, removed, or modified
      transaction.mapping.maps.forEach((stepMap) => {
        const typedStepMap = stepMap as StepMap
        typedStepMap.forEach((oldStart: number, oldEnd: number, newStart: number, newEnd: number) => {
          if (headingChanged) return

          // Check new document range
          editor.state.doc.nodesBetween(newStart, newEnd, (node: ProseMirrorNode) => {
            if (node.type.name === 'heading') {
              headingChanged = true
              return false // Stop traversal for this range
            }
          })

          // Check old document range (in case a heading was deleted)
          if (!headingChanged && transaction.before) {
            transaction.before.nodesBetween(oldStart, oldEnd, (node: ProseMirrorNode) => {
              if (node.type.name === 'heading') {
                headingChanged = true
                return false
              }
            })
          }
        })
      })

      if (headingChanged) {
        // Debounce the parse to avoid rapid rebuilds during fast typing
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          setOutline(parseDocumentOutline(editor.state.doc))
        }, OUTLINE_CONSTANTS.PARSE_DEBOUNCE_MS)
      }
    }

    editor.on('transaction', handleTransaction)

    return () => {
      editor.off('transaction', handleTransaction)
      clearTimeout(timeoutId)
    }
  }, [editor])

  // 2. Active Heading Tracking via IntersectionObserver
  useEffect(() => {
    if (!editor || outline.length === 0) return

    // We will observe all heading elements in the editor
    const headingElements = Array.from(editor.view.dom.querySelectorAll('h1, h2, h3, h4, h5, h6'))
    
    // Map DOM elements back to our outline IDs (we assume order matches DOM order)
    // ProseMirror keeps DOM nodes in the same order as document structure.
    const idMap = new Map<Element, string>()
    const flatOutline: OutlineNode[] = []
    
    const flatten = (nodes: OutlineNode[]) => {
      nodes.forEach(n => {
        flatOutline.push(n)
        flatten(n.children)
      })
    }
    flatten(outline)

    headingElements.forEach((el, index) => {
      if (flatOutline[index]) {
        idMap.set(el, flatOutline[index].id)
      }
    })

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the visible headings
        const visibleEntries = entries.filter(e => e.isIntersecting)
        
        if (visibleEntries.length > 0) {
          // If multiple are visible, pick the topmost one
          visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          const activeId = idMap.get(visibleEntries[0].target)
          if (activeId) {
            setActiveHeadingId(activeId)
          }
        }
      },
      {
        root: null, // Viewport
        rootMargin: '0px 0px -60% 0px', // Bias towards top of screen
        threshold: 0.1,
      }
    )

    headingElements.forEach(el => observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }, [editor, outline])

  // 3. Search and Navigation
  const searchResults = useMemo(() => {
    return filterOutlineTree(outline, searchQuery)
  }, [outline, searchQuery])

  const handleNavigate = useCallback(
    (position: number) => {
      if (editor) {
        navigateToHeading(editor, position)
      }
    },
    [editor]
  )

  return {
    outline,
    activeHeadingId,
    searchResults,
    searchQuery,
    setSearchQuery,
    navigateToHeading: handleNavigate,
  }
}
