'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { use } from 'react'

export default function MeditationPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  // Мок-данные медитации
  const meditation = {
    id: parseInt(id),
    title: 'Путешествие в мир снов',
    duration: 900, // seconds
    description: 'Медитация для подготовки к осознанным сновидениям',
    icon: '🌙',
    guide: 'София Морфей',
    stages: [
      { time: 0, name: 'Расслабление тела', duration: 180 },
      { time: 180, name: 'Успокоение ума', duration: 240 },
      { time: 420, name: 'Визуализация', duration: 300 },
      { time: 720, name: 'Возвращение', duration: 180 }
    ]
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getCurrentStage = () => {
    return meditation.stages.findIndex(
      (stage, index) => {
        const nextStage = meditation.stages[index + 1]
        return currentTime >= stage.time && (!nextStage || currentTime < nextStage.time)
      }
    )
  }

  // Симуляция воспроизведения
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && currentTime < meditation.duration) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 1
          setProgress((newTime / meditation.duration) * 100)
          return newTime
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentTime, meditation.duration])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const reset = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    setProgress(0)
  }

  const currentStageIndex = getCurrentStage()

  return (
    <div className="space-y-6 pb-6 animate-fade-in min-h-screen flex flex-col">
      <header className="flex items-center justify-between">
        <Link href="/meditate" className="text-mythic-ivory hover:text-morphe-blue transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <button onClick={reset} className="text-mythic-ivory/60 hover:text-mythic-ivory transition-colors">
          <RotateCcw size={20} />
        </button>
      </header>

      <div className="flex-1 flex flex-col justify-center space-y-8">
        {/* Meditation Icon */}
        <div className="text-center">
          <div className="text-8xl mb-4">{meditation.icon}</div>
          <h1 className="text-2xl font-bold text-mythic-ivory mb-2">{meditation.title}</h1>
          <p className="text-mythic-ivory/60 text-sm">Ведущий: {meditation.guide}</p>
        </div>

        {/* Current Stage */}
        {currentStageIndex >= 0 && (
          <div className="text-center">
            <p className="text-light-ai-blue text-sm mb-1">Текущий этап</p>
            <h2 className="text-xl font-semibold text-mythic-ivory">
              {meditation.stages[currentStageIndex].name}
            </h2>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-2 bg-mythic-ivory/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-morphe-blue to-amethyst-spirit transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-mythic-ivory/60">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(meditation.duration)}</span>
          </div>
        </div>

        {/* Play/Pause Button */}
        <div className="flex justify-center">
          <button
            onClick={togglePlay}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-morphe-blue to-amethyst-spirit flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            {isPlaying ? (
              <Pause size={32} className="text-mythic-ivory" fill="currentColor" />
            ) : (
              <Play size={32} className="text-mythic-ivory ml-1" fill="currentColor" />
            )}
          </button>
        </div>

        {/* Stages */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-mythic-ivory mb-3">Этапы медитации</h3>
          <div className="space-y-2">
            {meditation.stages.map((stage, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg transition-all ${
                  index === currentStageIndex
                    ? 'bg-morphe-blue/20 border border-morphe-blue/30'
                    : index < currentStageIndex
                    ? 'bg-mythic-ivory/5 opacity-50'
                    : 'bg-mythic-ivory/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-mythic-ivory text-sm font-medium">{stage.name}</span>
                  <span className="text-mythic-ivory/60 text-xs">
                    {formatTime(stage.duration)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

