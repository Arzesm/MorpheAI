'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function RhythmicBreathingPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'empty'>('inhale')
  const [timer, setTimer] = useState(0)
  const [cycle, setCycle] = useState(0)
  
  // Ритм 4-8-3-3 (тибетская йога)
  const rhythm = {
    inhale: 4,
    hold: 8,
    exhale: 3,
    empty: 3
  }

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ru-RU'
      utterance.rate = 0.9
      utterance.pitch = 1
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    }
  }

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setTimer(prev => {
        const newTimer = prev + 1
        const currentPhaseDuration = rhythm[phase]
        
        if (newTimer >= currentPhaseDuration) {
          let nextPhase: typeof phase
          
          if (phase === 'inhale') {
            nextPhase = 'hold'
            speak('Задержка')
          } else if (phase === 'hold') {
            nextPhase = 'exhale'
            speak('Выдох')
          } else if (phase === 'exhale') {
            nextPhase = 'empty'
            speak('Пусто')
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
  }, [isPlaying, phase])

  const togglePlay = () => {
    if (!isPlaying) {
      speak('Вдох')
      setPhase('inhale')
      setTimer(0)
    }
    setIsPlaying(!isPlaying)
  }

  const reset = () => {
    setIsPlaying(false)
    setPhase('inhale')
    setTimer(0)
    setCycle(0)
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
    const progress = timer / rhythm[phase]
    if (phase === 'inhale') return 0.5 + progress * 0.5
    if (phase === 'exhale') return 1 - progress * 0.5
    return phase === 'hold' ? 1 : 0.5
  }

  const getPhaseColor = () => {
    switch(phase) {
      case 'inhale': return 'from-morphe-blue/40 to-light-ai-blue/40'
      case 'hold': return 'from-amethyst-spirit/40 to-morphe-blue/40'
      case 'exhale': return 'from-light-ai-blue/40 to-morphe-blue/40'
      case 'empty': return 'from-morphe-blue/20 to-amethyst-spirit/20'
    }
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
          onClick={reset}
          className="p-2 rounded-xl bg-mythic-ivory/10 hover:bg-mythic-ivory/20 transition-all"
        >
          <RotateCcw size={24} className="text-mythic-ivory" />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-6 space-y-8 mt-4">
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
          <h1 className="text-2xl font-bold text-mythic-ivory mb-2">Ритмическое дыхание</h1>
          <p className="text-mythic-ivory/60 text-sm">Дыхание из тибетской йоги</p>
        </div>

        {/* Breathing Circle */}
        <div className="relative w-72 h-72 flex items-center justify-center">
          <div 
            className={`absolute w-full h-full rounded-full bg-gradient-to-br ${getPhaseColor()} backdrop-blur-sm transition-all duration-1000 ease-in-out shadow-2xl`}
            style={{ transform: `scale(${getCircleScale()})` }}
          />
          <div className="relative z-10 text-center">
            <div className="text-6xl font-bold text-white mb-3 drop-shadow-lg">
              {rhythm[phase] - timer}
            </div>
            <div className="text-xl text-white/90 font-medium drop-shadow">
              {getPhaseText()}
            </div>
          </div>
        </div>

        {/* Rhythm Display */}
        <div className="flex items-center justify-center space-x-6">
          {(['inhale', 'hold', 'exhale', 'empty'] as const).map((key, index) => (
            <div key={key} className={`flex flex-col items-center ${phase === key ? 'scale-110' : 'opacity-50'} transition-all`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                phase === key ? 'bg-gradient-to-br from-morphe-blue to-amethyst-spirit' : 'bg-mythic-ivory/20'
              }`}>
                {rhythm[key]}
              </div>
              <div className="text-xs text-mythic-ivory/60 mt-1">
                {key === 'inhale' ? 'Вдох' : key === 'hold' ? 'Задержка' : key === 'exhale' ? 'Выдох' : 'Пусто'}
              </div>
            </div>
          ))}
        </div>

        {/* Cycle Counter */}
        <div className="text-mythic-ivory text-base font-medium">
          Цикл: {cycle}
        </div>

        {/* Play/Pause Button */}
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
        <div className="card p-6 max-w-md">
          <h3 className="text-mythic-ivory font-semibold mb-3">Инструкция:</h3>
          <ul className="text-mythic-ivory/70 text-sm space-y-2">
            <li>• Сядьте в удобную позу с прямой спиной</li>
            <li>• Вдох (4 сек) - медленно вдыхайте через нос</li>
            <li>• Задержка (8 сек) - держите дыхание</li>
            <li>• Выдох (3 сек) - выдыхайте через рот</li>
            <li>• Пусто (3 сек) - пауза перед новым вдохом</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

