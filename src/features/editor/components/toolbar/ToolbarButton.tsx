import { memo } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils'

interface ToolbarButtonProps {
  icon: LucideIcon
  label: string
  shortcut?: string
  isActive?: boolean
  isDisabled?: boolean
  onClick: () => void
}

export const ToolbarButton = memo(({
  icon: Icon,
  label,
  shortcut,
  isActive = false,
  isDisabled = false,
  onClick
}: ToolbarButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger render={
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-9 w-9 p-0 transition-colors duration-150 ease-out focus-visible:ring-1 focus-visible:ring-ring',
            isActive && 'bg-accent text-accent-foreground'
          )}
          onClick={onClick}
          disabled={isDisabled}
          aria-label={label}
          aria-pressed={isActive}
        >
          <Icon className="h-4 w-4" />
        </Button>
      } />
      <TooltipContent sideOffset={6} className="flex items-center gap-2">
        <span className="text-xs font-medium">{label}</span>
        {shortcut && (
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            {shortcut}
          </kbd>
        )}
      </TooltipContent>
    </Tooltip>
  )
})

ToolbarButton.displayName = 'ToolbarButton'
