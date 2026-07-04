import React from 'react'

interface OutlineToolbarProps {
  onExpandAll: () => void
  onCollapseAll: () => void
}

export const OutlineToolbar: React.FC<OutlineToolbarProps> = ({
  onExpandAll,
  onCollapseAll
}) => {
  return (
    <div className="flex items-center justify-between p-2 border-b border-border/40 bg-muted/10 shrink-0">
      <div className="text-xs font-semibold uppercase text-muted-foreground/70 tracking-wider px-2">
        Outline
      </div>
      <div className="flex items-center space-x-1">
        <button 
          onClick={onExpandAll}
          className="p-1.5 text-muted-foreground hover:bg-muted rounded-md transition-colors"
          title="Expand All"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v5.5h5.5a.75.75 0 0 1 0 1.5h-5.5v5.5a.75.75 0 0 1-1.5 0v-5.5h-5.5a.75.75 0 0 1 0-1.5h5.5v-5.5A.75.75 0 0 1 10 3Z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          onClick={onCollapseAll}
          className="p-1.5 text-muted-foreground hover:bg-muted rounded-md transition-colors"
          title="Collapse All"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}
