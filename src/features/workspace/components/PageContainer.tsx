import React from 'react'

interface PageContainerProps {
  children: React.ReactNode
}

export const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <main className="flex-1 overflow-y-auto relative custom-scrollbar pb-32 print:pb-0 print:overflow-visible print:bg-transparent">
      <div className="flex justify-center px-4 sm:px-8 pt-12 pb-32 print:p-0 print:block">
        <div className="w-full max-w-[816px] min-h-[1056px] bg-background border border-border/40 shadow-sm shadow-black/5 rounded-sm shrink-0 transition-shadow focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 print:max-w-none print:min-h-0 print:border-none print:shadow-none print:rounded-none">
          <div className="p-16 sm:p-20 lg:p-[96px] h-full selection:bg-primary/20 selection:text-primary print:p-0">
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}
