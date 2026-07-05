import React, { useState, useCallback, useEffect } from 'react'
import { useEditorContext } from '../../editor/providers/EditorProvider'
import { useOutline } from '../hooks/useOutline'
import { OutlineTree } from './OutlineTree'
import { OutlineToolbar } from './OutlineToolbar'
import { OutlineEmpty } from './OutlineEmpty'
import { OUTLINE_CONSTANTS } from '../constants/outline'
import type { OutlineNode } from '../types/outline'

export const OutlineSidebar: React.FC = () => {
  const { editor } = useEditorContext()
  const { 
    outline, 
    activeHeadingId, 
    searchResults, 
    searchQuery, 
    setSearchQuery, 
    navigateToHeading 
  } = useOutline(editor)

  // Local UI state for expanding/collapsing nodes, persisted in localStorage
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('docstudio-outline-collapsed')
      if (saved) return new Set(JSON.parse(saved))
    } catch {
      // Ignore
    }
    return new Set()
  })

  useEffect(() => {
    localStorage.setItem('docstudio-outline-collapsed', JSON.stringify(Array.from(collapsedIds)))
  }, [collapsedIds])

  const toggleCollapse = useCallback((id: string) => {
    setCollapsedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const expandAll = useCallback(() => {
    setCollapsedIds(new Set())
  }, [])

  const collapseAll = useCallback(() => {
    const allIds = new Set<string>()
    const collectIds = (nodes: OutlineNode[]) => {
      nodes.forEach(node => {
        allIds.add(node.id)
        collectIds(node.children)
      })
    }
    collectIds(outline)
    setCollapsedIds(allIds)
  }, [outline])

  // Apply collapsed state to the rendered tree
  const applyCollapsedState = (nodes: OutlineNode[]): OutlineNode[] => {
    return nodes.map(node => ({
      ...node,
      collapsed: collapsedIds.has(node.id),
      children: applyCollapsedState(node.children)
    }))
  }

  // Debounce search input
  const [searchInput, setSearchInput] = useState(searchQuery)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
    }, 200)
    return () => clearTimeout(timer)
  }, [searchInput, setSearchQuery])

  const renderedTree = applyCollapsedState(searchQuery ? searchResults : outline)
  
  // Mobile drawer state (simplified for this phase, can be extended)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden absolute top-4 left-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-background border border-border rounded-md shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Sidebar Container */}
      <div className={`
        flex flex-col h-full bg-background border-r border-border/40 shrink-0
        transition-all duration-300 ease-in-out z-40
        fixed lg:relative
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${OUTLINE_CONSTANTS.SIDEBAR_WIDTH_DESKTOP}
      `}>
        <OutlineToolbar onExpandAll={expandAll} onCollapseAll={collapseAll} />
        
        <div className="p-3 border-b border-border/40">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground/50">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
            </svg>
            <input 
              type="text" 
              placeholder="Filter headings..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-muted/30 border border-border/50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {renderedTree.length > 0 ? (
            <OutlineTree 
              nodes={renderedTree} 
              activeHeadingId={activeHeadingId} 
              onNavigate={(pos) => {
                navigateToHeading(pos)
                if (window.innerWidth < 1024) setIsOpen(false) // Close drawer on mobile after nav
              }} 
              onToggleCollapse={toggleCollapse} 
            />
          ) : (
            <OutlineEmpty />
          )}
        </div>
      </div>
      
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
