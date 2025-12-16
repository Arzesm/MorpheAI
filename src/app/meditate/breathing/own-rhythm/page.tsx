'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Settings, Play, Pause } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function OwnRhythmPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'empty'>('inhale')
  const [timer, setTimer] = useState(0)
  const [cycle, setCycle] = useState(0)
  
  // Настройки ритма (в секундах)
  const [settings, setSettings] = useState({
    inhale: 3,
    hold: 0,
    exhale: 4,
    empty: 2
  })
  
  const [showSettings, setShowSettings] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Голосовые инструкции
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ru-RU'
      utterance.rate = 0.9
      utterance.pitch = 1
      window.speechSynthesis.cancel() // Отменяем предыдущие
      window.speechSynthesis.speak(utterance)
    }
  }

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setTimer(prev => {
        const newTimer = prev + 1
        const currentPhaseDuration = settings[phase]
        
        if (newTimer >= currentPhaseDuration) {
          // Переход к следующей фазе
          let nextPhase: typeof phase
          
          if (phase === 'inhale') {
            nextPhase = settings.hold > 0 ? 'hold' : 'exhale'
            if (nextPhase === 'hold') speak('Задержка')
            else speak('Выдох')
          } else if (phase === 'hold') {
            nextPhase = 'exhale'
            speak('Выдох')
          } else if (phase === 'exhale') {
            nextPhase = settings.empty > 0 ? 'empty' : 'inhale'
            if (nextPhase === 'empty') speak('Пусто')
            else {
              speak('Вдох')
              setCycle(prev => prev + 1)
            }
          } else {
            nextPhase = 'inhale'
            speak('Вдох')
            setCycle(prev => prev + 1)
          }
          
          setPhase(nextPhase)
          return 0
        }
        
        return newTimer
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying, phase, settings])

  const togglePlay = () => {
    if (!isPlaying) {
      speak('Вдох')
      setPhase('inhale')
      setTimer(0)
    }
    setIsPlaying(!isPlaying)
  }

  const getPhaseText = () => {
    switch(phase) {
      case 'inhale': return 'Вдох'
      case 'hold': return 'Задержка'
      case 'exhale': return 'Выдох'
      case 'empty': return 'Пусто'
    }
  }

  const getCircleScale = () => {
    const progress = timer / settings[phase]
    if (phase === 'inhale') return 0.5 + progress * 0.5 // Растет от 0.5 до 1
    if (phase === 'exhale') return 1 - progress * 0.5 // Уменьшается от 1 до 0.5
    return phase === 'hold' ? 1 : 0.5
  }

  return (
    <div className="min-h-screen bg-dream-deep pb-6 animate-fade-in">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <Link href="/meditate">
          <button className="p-2 rounded-xl bg-mythic-ivory/10 hover:bg-mythic-ivory/20 transition-all">
            <ArrowLeft size={24} className="text-mythic-ivory" />
          </button>
        </Link>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-xl bg-mythic-ivory/10 hover:bg-mythic-ivory/20 transition-all"
        >
          <Settings size={24} className="text-mythic-ivory" />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-6 space-y-8 mt-8">
        {/* Logo */}
        <div className="relative w-32 h-12">
          <Image
            src="https://i.postimg.cc/nznsrDSf/cbb6618b-6539-4097-a39c-81dc01fe57d4.png"
            alt="MorpheAI"
            fill
            className="object-contain drop-shadow-[0_0_20px_rgba(147,51,234,0.3)]"
            priority
          />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-mythic-ivory mb-2">Свой ритм</h1>
          <p className="text-mythic-ivory/60 text-sm">Настрой свой ритм дыхания</p>
        </div>

        {/* Breathing Circle */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div 
            className="absolute w-full h-full rounded-full bg-gradient-to-br from-morphe-blue/30 to-amethyst-spirit/30 backdrop-blur-sm transition-transform duration-1000 ease-in-out"
            style={{ transform: `scale(${getCircleScale()})` }}
          />
          <div className="relative z-10 text-center">
            <div className="text-5xl font-bold text-mythic-ivory mb-2">
              {settings[phase] - timer}
            </div>
            <div className="text-lg text-mythic-ivory/80">
              {getPhaseText()}
            </div>
          </div>
        </div>

        {/* Cycle Counter */}
        <div className="text-mythic-ivory/60 text-sm">
          Цикл: {cycle}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="w-full max-w-md card p-6 space-y-4">
            <h3 className="text-mythic-ivory font-semibold mb-4">Настройки ритма</h3>
            
            {(['inhale', 'hold', 'exhale', 'empty'] as const).map((key) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-mythic-ivory/80 capitalize">
                  {key === 'inhale' ? 'Вдох' : key === 'hold' ? 'Задержка' : key === 'exhale' ? 'Выдох' : 'Пусто'}
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, [key]: Math.max(0, prev[key] - 1) }))}
                    className="w-8 h-8 rounded-lg bg-morphe-blue/20 hover:bg-morphe-blue/30 text-mythic-ivory transition-all"
                  >
                    -
                  </button>
                  <span className="text-mythic-ivory font-semibold w-12 text-center">
                    {settings[key]}с
                  </span>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, [key]: Math.min(20, prev[key] + 1) }))}
                    className="w-8 h-8 rounded-lg bg-morphe-blue/20 hover:bg-morphe-blue/30 text-mythic-ivory transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Play Button */}
        <button
          onClick={togglePlay}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-morphe-blue to-amethyst-spirit hover:scale-110 transition-all shadow-2xl shadow-morphe-blue/50 flex items-center justify-center"
        >
          {isPlaying ? (
            <Pause size={32} className="text-white" fill="white" />
          ) : (
            <Play size={32} className="text-white ml-1" fill="white" />
          )}
        </button>

        {/* Instructions */}
        <div className="text-center text-mythic-ivory/60 text-sm max-w-md">
          <p>Найдите удобное положение. Дышите естественно, следуя ритму.</p>
          <p className="mt-2">Настройте свой комфортный ритм дыхания.</p>
        </div>
      </div>
    </div>
  )
}

