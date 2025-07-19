import React from 'react'

interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  className?: string
}

export function Avatar({ src, alt, fallback, className = '' }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false)
  
  return (
    <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
          <span className="text-sm font-medium text-muted-foreground">
            {fallback || (alt ? alt.charAt(0).toUpperCase() : '?')}
          </span>
        </div>
      )}
    </div>
  )
}