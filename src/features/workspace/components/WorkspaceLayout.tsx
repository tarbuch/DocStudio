import React from 'react'
import { AppHeader } from './AppHeader'
import { PageContainer } from './PageContainer'
import { StatusBar } from './StatusBar'
import { Toolbar } from '../../editor/components/toolbar/Toolbar'
import { EditorCanvas } from '../../editor/components/EditorCanvas'

export const WorkspaceLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden text-foreground">
      <AppHeader />
      
      <div className="flex w-full justify-center border-b bg-muted/30 py-1.5 px-4 shadow-sm z-40">
        <div className="w-full max-w-4xl">
          <Toolbar />
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative flex flex-col bg-muted/20">
        <PageContainer>
          <EditorCanvas />
        </PageContainer>
      </div>

      <StatusBar />
    </div>
  )
}
