import React, { useState } from 'react'
import { MenuBar } from './MenuBar'
import { DocumentHeader } from './DocumentHeader'
import { FileText, Printer, Clock } from 'lucide-react'
import { ExportDialog } from '../../export/components/ExportDialog'
import { Button } from '../../../design-system/components/Button'
import { HistoryDrawer } from '../../history/components/HistoryDrawer'

export const AppHeader: React.FC = () => {
  const [historyOpen, setHistoryOpen] = useState(false)

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
      
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => setHistoryOpen(true)} className="gap-2 text-muted-foreground hover:text-foreground">
          <Clock className="h-4 w-4" />
          History
        </Button>
        <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2 text-muted-foreground hover:text-foreground">
          <Printer className="h-4 w-4" />
          Print
        </Button>
        <ExportDialog />
        <div className="h-8 w-8 rounded-full bg-muted border flex items-center justify-center text-xs font-medium cursor-pointer hover:bg-accent transition-colors">
          U
        </div>
      </div>
      <HistoryDrawer isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
    </header>
  )
}
