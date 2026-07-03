import React from 'react'

interface PageContainerProps {
  children: React.ReactNode
}

export const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <main className="flex-1 overflow-y-auto relative custom-scrollbar pb-32">
      <div className="flex justify-center px-4 sm:px-8 pt-8">
        <div className="w-full max-w-[816px] min-h-[1056px] bg-background border border-border shadow-sm rounded-sm shrink-0">
          <div className="p-12 sm:p-16 lg:p-24 h-full">
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}
