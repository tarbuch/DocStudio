import React from 'react'

export const EditorSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto min-h-[500px] border border-border/50 rounded-lg bg-card/50 shadow-sm mt-8 p-8 animate-pulse">
      <div className="h-6 bg-muted rounded w-1/3 mb-6"></div>
      <div className="h-4 bg-muted rounded w-full mb-3"></div>
      <div className="h-4 bg-muted rounded w-5/6 mb-3"></div>
      <div className="h-4 bg-muted rounded w-4/6 mb-3"></div>
    </div>
  )
}
