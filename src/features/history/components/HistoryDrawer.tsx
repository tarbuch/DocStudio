import React, { useEffect, useState, useCallback } from 'react'
import { X, Clock, RotateCcw, Trash2 } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { useDocumentContext } from '../../documents/providers/DocumentProvider'
import { loadSnapshots, deleteSnapshot, saveSnapshot } from '../../documents/services/documentManager'
import type { DocumentSnapshot } from '../../documents/types/document'
import { useEditorContext } from '../../editor/providers/EditorProvider'

interface HistoryDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose }) => {
  const { activeDocumentId } = useDocumentContext()
  const { editor } = useEditorContext()
  const [snapshots, setSnapshots] = useState<DocumentSnapshot[]>([])
  const [loading, setLoading] = useState(false)

  const fetchSnapshots = useCallback(async () => {
    if (!activeDocumentId) return
    setLoading(true)
    const data = await loadSnapshots(activeDocumentId)
    setSnapshots(data.sort((a, b) => b.timestamp - a.timestamp))
    setLoading(false)
  }, [activeDocumentId])

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void fetchSnapshots()
    }
  }, [isOpen, fetchSnapshots])

  const handleRestore = async (snapshot: DocumentSnapshot) => {
    if (!editor || !activeDocumentId) return
    if (confirm('Are you sure you want to restore this version? Your current unsaved changes will be lost.')) {
      // Create a snapshot of current state before restoring
      await saveSnapshot(activeDocumentId, { content: editor.getJSON() })
      
      editor.commands.setContent(snapshot.content.content)
      fetchSnapshots()
      alert('Version restored. A snapshot of your previous state was saved.')
    }
  }

  const handleDelete = async (snapshotId: string) => {
    if (!activeDocumentId) return
    if (confirm('Delete this version?')) {
      await deleteSnapshot(activeDocumentId, snapshotId)
      await fetchSnapshots()
    }
  }

  const handleManualSnapshot = async () => {
    if (!activeDocumentId || !editor) return
    await saveSnapshot(activeDocumentId, { content: editor.getJSON() })
    await fetchSnapshots()
  }

  if (!isOpen) return null

  const categorizeSnapshots = () => {
    const today: DocumentSnapshot[] = []
    const yesterday: DocumentSnapshot[] = []
    const lastWeek: DocumentSnapshot[] = [] // older

    const now = new Date()
    
    const isToday = (ts: number) => {
      const d = new Date(ts)
      return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }

    const isYesterday = (ts: number) => {
      const d = new Date(ts)
      const y = new Date(now)
      y.setDate(y.getDate() - 1)
      return d.getDate() === y.getDate() && d.getMonth() === y.getMonth() && d.getFullYear() === y.getFullYear()
    }

    snapshots.forEach(s => {
      if (isToday(s.timestamp)) today.push(s)
      else if (isYesterday(s.timestamp)) yesterday.push(s)
      else lastWeek.push(s)
    })

    return { today, yesterday, lastWeek }
  }

  const grouped = categorizeSnapshots()

  const renderGroup = (title: string, items: DocumentSnapshot[]) => {
    if (items.length === 0) return null
    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">{title}</h3>
        <div className="space-y-3">
          {items.map(s => (
            <div key={s.id} className="p-3 bg-muted/40 border rounded-md group hover:bg-muted/80 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(s.timestamp)}
                </span>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="sm" className="h-7 text-xs flex-1" onClick={() => handleRestore(s)}>
                  <RotateCcw className="h-3 w-3 mr-1" /> Restore
                </Button>
                <Button variant="outline" size="sm" className="h-7 px-2 text-destructive" onClick={() => handleDelete(s.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-80 bg-background border-l shadow-xl z-50 flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2 font-semibold">
            <Clock className="h-5 w-5" />
            Version History
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4 border-b">
          <Button className="w-full" onClick={handleManualSnapshot}>
            Save Snapshot Now
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
            <div className="text-center text-muted-foreground text-sm py-8">Loading...</div>
          ) : snapshots.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              No version history yet.
            </div>
          ) : (
            <>
              {renderGroup('Today', grouped.today)}
              {renderGroup('Yesterday', grouped.yesterday)}
              {renderGroup('Older', grouped.lastWeek)}
            </>
          )}
        </div>
      </div>
    </>
  )
}
