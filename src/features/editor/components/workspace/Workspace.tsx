import React from 'react'
import { EditorProvider } from '../../providers/EditorProvider'
import { Toolbar } from '../toolbar/Toolbar'
import { Paper } from './Paper'
import { StatusBar } from './StatusBar'
import { EditorCanvas } from '../EditorCanvas'

export const Workspace: React.FC = () => {
  return (
    <EditorProvider initialContent="<h2>DocStudio Workspace</h2><p>Begin crafting your document here...</p>">
      <div className="flex flex-col h-screen w-full bg-[#F9F9FA] overflow-hidden">
        {/* Header / Top Navigation placeholder (for future) */}
        <header className="h-14 w-full bg-background border-b flex items-center px-4 shrink-0 z-10">
          <h1 className="text-sm font-semibold tracking-tight">DocStudio</h1>
        </header>

        {/* Scrollable Workspace Area */}
        <div className="flex-1 overflow-y-auto relative custom-scrollbar">
          <div className="sticky top-0 z-50 w-full flex justify-center py-4 bg-gradient-to-b from-[#F9F9FA] to-transparent pointer-events-none">
            <div className="pointer-events-auto">
              <Toolbar />
            </div>
          </div>
          
          <main className="flex justify-center px-4 sm:px-8 pb-32">
            <Paper>
              <EditorCanvas />
            </Paper>
          </main>
        </div>

        {/* Footer Status Bar */}
        <StatusBar />
      </div>
    </EditorProvider>
  )
}
