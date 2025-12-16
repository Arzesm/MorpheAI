'use client'

import { useState } from 'react'
import { Play, Pause, Volume2, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import MeditationCard from '@/components/meditate/MeditationCard'
import SoundCard from '@/components/meditate/SoundCard'
import TimerModal from '@/components/meditate/TimerModal'

export default function MeditatePage() {
  const [showTimer, setShowTimer] = useState(false)

  const meditations = [
    {
      id: 'own-rhythm',
      title: 'Свой ритм',
      duration: 'Настраиваемый',
      description: 'Настрой свой личный ритм дыхания',
      icon: '🎯',
      color: 'from-morphe-blue to-amethyst-spirit',
      link: '/meditate/breathing/own-rhythm'
    },
    {
      id: 'rhythmic',
      title: 'Ритмическое дыхание',
      duration: '4-8-3-3',
      description: 'Дыхание из тибетской йоги',
      icon: '🧘',
      color: 'from-amethyst-spirit to-morphe-blue',
      link: '/meditate/breathing/rhythmic'
    },
    {
      id: 'simple',
      title: 'Простое дыхание',
      duration: '5-15 мин',
      description: 'Спокойствие и гармония эмоций',
      icon: '🌸',
      color: 'from-light-ai-blue to-morphe-blue',
      link: '/meditate/breathing/simple'
    }
  ]

  const sounds = [
    {
      id: 1,
      name: 'Дождь',
      icon: '💧',
      audio: '/sounds/rain.mp3'
    },
    {
      id: 2,
      name: 'Море',
      icon: '🌊',
      audio: '/sounds/ocean.mp3'
    },
    {
      id: 3,
      name: 'Лес',
      icon: '🌳',
      audio: '/sounds/forest.mp3'
    },
    {
      id: 4,
      name: 'Ветер',
      icon: '🍃',
      audio: '/sounds/wind.mp3'
    },
    {
      id: 5,
      name: 'Белый шум',
      icon: '🎵',
      audio: '/sounds/white-noise.mp3'
    }
  ]

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      {/* Beautiful Header with Logo */}
      <header className="text-center py-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-amethyst-spirit/10 to-transparent blur-3xl" />
        <div className="relative z-10 flex flex-col items-center space-y-2">
          <Link href="/portal" className="relative w-48 h-16 cursor-pointer group">
            <Image
              src="https://i.postimg.cc/nznsrDSf/cbb6618b-6539-4097-a39c-81dc01fe57d4.png"
              alt="MorpheAI Logo"
              fill
              className="object-contain drop-shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all group-hover:drop-shadow-[0_0_30px_rgba(147,51,234,0.5)] group-hover:scale-105"
              priority
            />
          </Link>
          <p className="text-mythic-ivory/60 text-sm font-medium tracking-wide">
            Практики для работы со сновидениями
          </p>
        </div>
      </header>

      {/* Guided Meditations */}
      <section>
        <h2 className="text-lg font-semibold text-mythic-ivory mb-3">
          Управляемые медитации
        </h2>
        <div className="space-y-6">
          {meditations.map((meditation) => (
            <MeditationCard key={meditation.id} meditation={meditation} />
          ))}
        </div>
      </section>

      {/* Nature Sounds */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-mythic-ivory flex items-center">
            <Volume2 size={20} className="mr-2 text-morphe-blue" />
            Звуки природы
          </h2>
          <button
            onClick={() => setShowTimer(true)}
            className="flex items-center space-x-1 text-sm text-morphe-blue hover:text-light-ai-blue transition-colors"
          >
            <Clock size={16} />
            <span>Таймер</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {sounds.map((sound) => (
            <SoundCard key={sound.id} sound={sound} />
          ))}
        </div>
      </section>

      {/* Timer Modal */}
      {showTimer && <TimerModal onClose={() => setShowTimer(false)} />}
    </div>
  )
}

