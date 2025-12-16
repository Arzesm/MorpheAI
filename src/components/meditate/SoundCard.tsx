'use client'

import { useState } from 'react'
import { Play, Pause } from 'lucide-react'

interface SoundCardProps {
  sound: {
    id: number
    name: string
    icon: string
    audio: string
  }
}

export default function SoundCard({ sound }: SoundCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    // В реальном приложении здесь будет логика воспроизведения аудио
    setIsPlaying(!isPlaying)
  }

  return (
    <button
      onClick={togglePlay}
      className={`card p-4 hover:bg-morphe-blue/15 transition-all ${
        isPlaying ? 'ring-2 ring-morphe-blue' : ''
      }`}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="text-3xl">{sound.icon}</div>
        <h3 className="text-mythic-ivory font-medium text-sm">{sound.name}</h3>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          isPlaying
            ? 'bg-morphe-blue text-mythic-ivory'
            : 'bg-morphe-blue/20 text-morphe-blue'
        }`}>
          {isPlaying ? (
            <Pause size={18} fill="currentColor" />
          ) : (
            <Play size={18} fill="currentColor" className="ml-1" />
          )}
        </div>
      </div>
    </button>
  )
}

