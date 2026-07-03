import React from 'react'
import { useEditorContext } from '../../providers/EditorProvider'
import { Check, Globe, ZoomIn } from 'lucide-react'

export const StatusBar: React.FC = () => {
  const { commands, isLoading } = useEditorContext()

  if (isLoading) {
    return <div className="h-8 w-full border-t bg-background mt-auto"></div>
  }

  const words = commands.getWordCount()
  const chars = commands.getCharacterCount()
  const readingTime = Math.max(1, Math.ceil(words / 200))

  return (
    <div className="flex h-8 w-full items-center justify-between border-t bg-background px-4 text-xs text-muted-foreground shrink-0 z-50">
      <div className="flex items-center gap-4">
        <span>{words} words</span>
        <span>{chars} characters</span>
        <span>{readingTime} min read</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5 hidden sm:flex">
          <Check className="h-3.5 w-3.5" />
          <span>Saved to local</span>
        </div>
        <div className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors">
          <Globe className="h-3.5 w-3.5" />
          <span>English (US)</span>
        </div>
        <div className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors">
          <ZoomIn className="h-3.5 w-3.5" />
          <span>100%</span>
        </div>
      </div>
    </div>
  )
}
