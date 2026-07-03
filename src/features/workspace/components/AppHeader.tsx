import React from 'react'
import { MenuBar } from './MenuBar'
import { DocumentHeader } from './DocumentHeader'
import { FileText } from 'lucide-react'

export const AppHeader: React.FC = () => {
  return (
    <header className="flex h-14 w-full shrink-0 items-center justify-between border-b bg-background px-4 z-50">
      <div className="flex items-center gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <FileText className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <DocumentHeader />
          <MenuBar />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-muted border flex items-center justify-center text-xs font-medium cursor-pointer hover:bg-accent transition-colors">
          U
        </div>
      </div>
    </header>
  )
}
