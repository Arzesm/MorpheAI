'use client'

interface Emoji3DProps {
  emoji: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function Emoji3D({ emoji, size = 'md', className = '' }: Emoji3DProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  }

  return (
    <span 
      className={`${sizeClasses[size]} ${className} inline-block transform transition-transform hover:scale-110`}
      style={{ 
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
        textRendering: 'optimizeLegibility'
      }}
    >
      {emoji}
    </span>
  )
}

