import React from 'react'
import { AppHeader } from './AppHeader'
import { PageContainer } from './PageContainer'
import { StatusBar } from './StatusBar'
import { Toolbar } from '../../editor/components/toolbar/Toolbar'
import { EditorCanvas } from '../../editor/components/EditorCanvas'
import { DocumentSidebar } from '../../documents/components/DocumentSidebar'
import { ErrorBoundary } from '../../../components/ErrorBoundary'
import { OutlineSidebar } from '../../outline/components/OutlineSidebar'
import { SearchPalette } from '../../search/components/SearchPalette'

export const WorkspaceLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden text-foreground print:h-auto print:overflow-visible print:block">
      <div className="print:hidden">
        <AppHeader />
      </div>
      
      <div className="flex w-full justify-center border-b bg-muted/30 py-1.5 px-4 shadow-sm z-40 print:hidden">
        <div className="w-full max-w-4xl">
          <Toolbar />
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative flex flex-row bg-muted/20 print:overflow-visible print:block print:bg-transparent">
        <div className="print:hidden h-full">
          <DocumentSidebar />
        </div>
        <div className="print:hidden h-full">
          <OutlineSidebar />
        </div>
        <PageContainer>
          <ErrorBoundary>
            <EditorCanvas />
          </ErrorBoundary>
        </PageContainer>
      </div>

      <div className="print:hidden">
        <StatusBar />
      </div>
      <SearchPalette />
    </div>
  )
}
