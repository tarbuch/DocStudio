import React, { useState } from 'react'
import { Download, FileText, Code, FileCode2, X, Loader2 } from 'lucide-react'
import { useExport } from '../hooks/useExport'

export const ExportDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { exportState, exportToDocx, isExporting, error } = useExport()

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
      >
        <Download className="w-4 h-4" />
        Export
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-lg border shadow-lg overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">Export Document</h2>
              <button
                onClick={() => !isExporting && setIsOpen(false)}
                className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                disabled={isExporting}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-3">
              {error && (
                <div className="p-2.5 text-xs bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30 rounded-md">
                  {error}
                </div>
              )}

              <button
                onClick={exportToDocx}
                disabled={isExporting}
                className="flex items-center gap-3 p-3 rounded-md border hover:border-primary hover:bg-accent/50 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 flex flex-col">
                  <span className="font-medium text-sm">Microsoft Word (.docx)</span>
                  <span className="text-xs text-muted-foreground">Standard format for sharing and printing</span>
                </div>
                {exportState === 'exporting' && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                {exportState === 'success' && <span className="text-xs font-medium text-green-600">Done</span>}
              </button>

              <button
                disabled
                className="flex items-center gap-3 p-3 rounded-md border bg-muted/30 opacity-60 cursor-not-allowed text-left"
              >
                <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded text-orange-600 dark:text-orange-400">
                  <FileCode2 className="w-5 h-5" />
                </div>
                <div className="flex-1 flex flex-col">
                  <span className="font-medium text-sm">HTML (Coming Soon)</span>
                  <span className="text-xs text-muted-foreground">Web-ready semantic markup</span>
                </div>
              </button>

              <button
                disabled
                className="flex items-center gap-3 p-3 rounded-md border bg-muted/30 opacity-60 cursor-not-allowed text-left"
              >
                <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-slate-600 dark:text-slate-400">
                  <Code className="w-5 h-5" />
                </div>
                <div className="flex-1 flex flex-col">
                  <span className="font-medium text-sm">Markdown (Coming Soon)</span>
                  <span className="text-xs text-muted-foreground">Plain text formatting</span>
                </div>
              </button>
            </div>
            
            <div className="px-4 py-3 bg-muted/50 border-t flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isExporting}
                className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
