'use client'

import { useState } from 'react'
import { Play, Pause, Volume2, Clock } from 'lucide-react'
import Header from '@/components/Header'
import MeditationCard from '@/components/meditate/MeditationCard'
import SoundCard from '@/components/meditate/SoundCard'
import TimerModal from '@/components/meditate/TimerModal'

export default function MeditatePage() {
  const [showTimer, setShowTimer] = useState(false)

  const meditations = [
    {
      id: 1,
      title: 'Путешествие в мир снов',
      duration: '15 мин',
      description: 'Медитация для подготовки к осознанным сновидениям',
      icon: '🌙',
      color: 'from-morphe-blue to-amethyst-spirit'
    },
    {
      id: 2,
      title: 'Расслабление перед сном',
      duration: '10 мин',
      description: 'Глубокое расслабление для качественного сна',
      icon: '😌',
      color: 'from-amethyst-spirit to-morphe-blue'
    },
    {
      id: 3,
      title: 'Работа с архетипами',
      duration: '20 мин',
      description: 'Встреча с вашими внутренними архетипами',
      icon: '🔮',
      color: 'from-light-ai-blue to-morphe-blue'
    },
    {
      id: 4,
      title: 'Утренняя медитация',
      duration: '8 мин',
      description: 'Интеграция опыта сновидений в реальность',
      icon: '☀️',
      color: 'from-morphe-blue to-light-ai-blue'
    }
  ]

  const sounds = [
    {
      id: 1,
      name: 'Дождь',
      icon: '🌧️',
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
      icon: '🌲',
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
      icon: '⚪',
      audio: '/sounds/white-noise.mp3'
    }
  ]

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      <Header />
      
      <div>
        <h1 className="text-3xl font-bold text-mythic-ivory tracking-tight">Медитации</h1>
        <p className="text-mythic-ivory/60 text-sm mt-1 font-medium">
          Практики для работы со сновидениями
        </p>
      </div>

      {/* Guided Meditations */}
      <section>
        <h2 className="text-lg font-semibold text-mythic-ivory mb-3">
          Управляемые медитации
        </h2>
        <div className="space-y-3">
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

