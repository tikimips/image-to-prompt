import React from 'react'

interface DropdownMenuProps {
  children: React.ReactNode
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  className?: string
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  
  return (
    <div className="relative">
      {React.Children.map(children, child => 
        React.isValidElement(child) 
          ? React.cloneElement(child as any, { isOpen, setIsOpen })
          : child
      )}
    </div>
  )
}

export function DropdownMenuTrigger({ children, asChild }: DropdownMenuTriggerProps & { isOpen?: boolean; setIsOpen?: (open: boolean) => void }) {
  return (
    <div onClick={(e) => {
      e.stopPropagation()
      // setIsOpen?.(!isOpen)
    }}>
      {children}
    </div>
  )
}

export function DropdownMenuContent({ children, className = '' }: DropdownMenuContentProps & { isOpen?: boolean }) {
  return (
    <div className={`absolute right-0 top-full mt-2 w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-md z-50 ${className}`}>
      {children}
    </div>
  )
}

export function DropdownMenuItem({ children, onClick, className = '' }: DropdownMenuItemProps) {
  return (
    <div
      onClick={onClick}
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${className}`}
    >
      {children}
    </div>
  )
}