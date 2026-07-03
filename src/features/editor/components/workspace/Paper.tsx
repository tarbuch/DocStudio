import React from 'react'

interface PaperProps {
  children: React.ReactNode
}

export const Paper: React.FC<PaperProps> = ({ children }) => {
  return (
    <div className="w-full max-w-[816px] mx-auto bg-background shadow-sm border border-border/40 sm:rounded-sm min-h-[1056px] my-8 transition-all duration-200">
      <div className="py-12 sm:py-24 px-8 sm:px-24 h-full flex flex-col">
        {children}
      </div>
    </div>
  )
}
