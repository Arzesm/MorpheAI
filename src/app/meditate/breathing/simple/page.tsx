'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function SimpleBreathingPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale')
  const [timer, setTimer] = useState(0)
  const [sessionTime, setSessionTime] = useState(5) // минуты
  const [totalTime, setTotalTime] = useState(0) // секунды
  const [cycle, setCycle] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  
  // Простое дыхание: 4 сек вдох, 4 сек выдох
  const breathDuration = 4

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
      setTotalTime(prev => prev + 1)
      
      setTimer(prev => {
        const newTimer = prev + 1
        
        if (newTimer >= breathDuration) {
          const nextPhase = phase === 'inhale' ? 'exhale' : 'inhale'
          
          if (nextPhase === 'exhale') {
            speak('Выдох')
          } else {
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

  // Проверка окончания сессии
  useEffect(() => {
    if (totalTime >= sessionTime * 60 && isPlaying) {
      setIsPlaying(false)
      speak('Сессия завершена. Отличная работа!')
    }
  }, [totalTime, sessionTime, isPlaying])

  const togglePlay = () => {
    if (!isPlaying) {
      speak('Начинаем. Вдох')
      setPhase('inhale')
      setTimer(0)
    }
    setIsPlaying(!isPlaying)
  }

  const reset = () => {
    setIsPlaying(false)
    setPhase('inhale')
    setTimer(0)
    setTotalTime(0)
    setCycle(0)
  }

  const getCircleScale = () => {
    const progress = timer / breathDuration
    if (phase === 'inhale') return 0.5 + progress * 0.5
    return 1 - progress * 0.5
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const remainingTime = sessionTime * 60 - totalTime

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
      <div className="flex flex-col items-center justify-center px-6 space-y-6 mt-4">
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
          <h1 className="text-2xl font-bold text-mythic-ivory mb-2">Простое дыхание</h1>
          <p className="text-mythic-ivory/60 text-sm">Спокойствие и гармония эмоций</p>
        </div>

        {/* Session Time */}
        <div className="text-center">
          <div className="text-mythic-ivory/60 text-sm mb-2">Время сессии</div>
          <div className="text-3xl font-bold text-mythic-ivory">
            {formatTime(remainingTime)}
          </div>
        </div>

        {/* Breathing Circle */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div 
            className={`absolute w-full h-full rounded-full bg-gradient-to-br ${
              phase === 'inhale' 
                ? 'from-light-ai-blue/40 to-morphe-blue/40' 
                : 'from-morphe-blue/40 to-amethyst-spirit/40'
            } backdrop-blur-sm transition-all duration-1000 ease-in-out shadow-2xl`}
            style={{ transform: `scale(${getCircleScale()})` }}
          />
          <div className="relative z-10 text-center">
            <div className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
              {breathDuration - timer}
            </div>
            <div className="text-lg text-white/90 drop-shadow">
              {phase === 'inhale' ? 'Вдох' : 'Выдох'}
            </div>
          </div>
        </div>

        {/* Cycle Counter */}
        <div className="text-mythic-ivory/60 text-sm">
          Цикл: {cycle}
        </div>

        {/* Time Settings Slider */}
        {!isPlaying && (
          <div className="w-full max-w-md card p-6">
            <h3 className="text-mythic-ivory font-semibold mb-4 text-center">Настройте время тренировки</h3>
            <div className="flex items-center justify-between mb-4">
              {[1, 3, 5, 7, 10, 15].map((time) => (
                <button
                  key={time}
                  onClick={() => setSessionTime(time)}
                  className={`flex-1 mx-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    sessionTime === time
                      ? 'bg-morphe-blue text-white'
                      : 'bg-mythic-ivory/10 text-mythic-ivory/60 hover:bg-mythic-ivory/20'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            <div className="text-center text-mythic-ivory/60 text-sm">минут</div>
          </div>
        )}

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
            <li>• Найдите тихое спокойное место</li>
            <li>• Сядьте или лягте в удобной позе</li>
            <li>• Дышите медленно и глубоко</li>
            <li>• Вдох 4 секунды - наполняйте легкие</li>
            <li>• Выдох 4 секунды - полностью освобождайте</li>
            <li>• Концентрируйтесь только на дыхании</li>
            <li>• Отпускайте все мысли и напряжение</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

