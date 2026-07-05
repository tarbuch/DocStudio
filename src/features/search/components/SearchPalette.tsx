import React, { useState, useEffect, useRef } from 'react'
import { Search, FileText, Folder } from 'lucide-react'
import { search, type SearchResult } from '../services/searchIndex'
import { useDocumentContext } from '../../documents/providers/DocumentProvider'

export const SearchPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const { switchDocument } = useDocumentContext()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10)
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    const debounce = setTimeout(() => {
      setResults(search(query))
    }, 150)
    return () => clearTimeout(debounce)
  }, [query])

  if (!isOpen) return null

  const handleSelect = (result: SearchResult) => {
    if (result.type === 'document') {
      void switchDocument(result.id)
    }
    setIsOpen(false)
  }

  return (
    <>
      <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 transition-opacity print:hidden" onClick={() => setIsOpen(false)} />
      <div className="fixed inset-x-0 top-[10%] mx-auto max-w-xl bg-background rounded-xl shadow-2xl border flex flex-col z-50 print:hidden overflow-hidden">
        <div className="flex items-center px-4 py-3 border-b">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <input 
            ref={inputRef}
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-lg"
            placeholder="Search documents, folders, or content..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="text-xs text-muted-foreground border px-1.5 py-0.5 rounded ml-2">ESC</div>
        </div>
        
        {query && results.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No results found for "{query}"
          </div>
        )}
        
        {results.length > 0 && (
          <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
            {results.map(result => (
              <div 
                key={result.id} 
                className="flex items-start p-3 hover:bg-accent rounded-lg cursor-pointer transition-colors"
                onClick={() => handleSelect(result)}
              >
                <div className="mt-1 mr-4 text-muted-foreground flex-shrink-0">
                  {result.type === 'document' ? <FileText className="h-5 w-5" /> : <Folder className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-0.5">
                    <span className="font-medium text-foreground truncate">{result.title}</span>
                    {result.subtitle && <span className="text-xs text-muted-foreground ml-2">{result.subtitle}</span>}
                  </div>
                  {result.snippet && (
                    <div className="text-sm text-muted-foreground line-clamp-1 opacity-80">
                      {result.snippet}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
