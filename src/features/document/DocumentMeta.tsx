import React from 'react'
import { Cloud, CloudOff, CloudDrizzle } from 'lucide-react'

interface DocumentMetaProps {
  status?: 'saved' | 'saving' | 'error'
  lastEdited?: string
}

export const DocumentMeta: React.FC<DocumentMetaProps> = ({ 
  status = 'saved', 
  lastEdited = 'just now' 
}) => {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground ml-2">
      <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-default">
        {status === 'saved' && (
          <>
            <Cloud className="h-3.5 w-3.5" />
            <span className="hidden sm:inline-block">Saved to cloud</span>
          </>
        )}
        {status === 'saving' && (
          <>
            <CloudDrizzle className="h-3.5 w-3.5 animate-pulse" />
            <span className="hidden sm:inline-block">Saving...</span>
          </>
        )}
        {status === 'error' && (
          <>
            <CloudOff className="h-3.5 w-3.5 text-destructive" />
            <span className="hidden sm:inline-block text-destructive">Offline</span>
          </>
        )}
      </div>
      <span className="hidden md:inline-block opacity-60">
        Last edited {lastEdited}
      </span>
    </div>
  )
}
