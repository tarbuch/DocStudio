import React from 'react'
import { OUTLINE_CONSTANTS } from '../constants/outline'

export const OutlineEmpty: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center h-full text-muted-foreground">
      <div className="w-12 h-12 mb-4 text-muted-foreground/30">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
        </svg>
      </div>
      <p className="text-sm whitespace-pre-wrap">{OUTLINE_CONSTANTS.EMPTY_STATE_MESSAGE}</p>
    </div>
  )
}
