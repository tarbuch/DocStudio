import React from 'react'

export const DocumentHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <h1 className="text-sm font-semibold tracking-tight cursor-text hover:bg-accent hover:text-accent-foreground px-1.5 -ml-1.5 rounded transition-colors">
        Untitled Document
      </h1>
      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm flex items-center">
        Draft
      </span>
    </div>
  )
}
