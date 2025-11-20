'use client'

import { useState } from 'react'
import { X, Clock } from 'lucide-react'

interface TimerModalProps {
  onClose: () => void
}

export default function TimerModal({ onClose }: TimerModalProps) {
  const [duration, setDuration] = useState(30)

  const presetTimes = [5, 10, 15, 30, 45, 60]

  const handleSetTimer = () => {
    // В реальном приложении здесь будет логика установки таймера
    console.log('Timer set for', duration, 'minutes')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-night-deep-blue/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card max-w-sm w-full p-6 space-y-4 animate-slide-up">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-mythic-ivory flex items-center">
            <Clock size={20} className="mr-2 text-morphe-blue" />
            Таймер выключения
          </h3>
          <button onClick={onClose} className="text-mythic-ivory/60 hover:text-mythic-ivory">
            <X size={20} />
          </button>
        </div>

        <div>
          <p className="text-mythic-ivory/70 text-sm mb-3">
            Звук автоматически остановится через:
          </p>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            {presetTimes.map((time) => (
              <button
                key={time}
                onClick={() => setDuration(time)}
                className={`py-3 rounded-lg text-sm font-medium transition-all ${
                  duration === time
                    ? 'bg-morphe-blue text-mythic-ivory'
                    : 'bg-mythic-ivory/10 text-mythic-ivory/60'
                }`}
              >
                {time} мин
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="flex-1 h-2 bg-mythic-ivory/20 rounded-lg appearance-none cursor-pointer accent-morphe-blue"
            />
            <span className="text-mythic-ivory font-semibold min-w-[60px] text-right">
              {duration} мин
            </span>
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-morphe-blue/50 text-morphe-blue rounded-lg hover:bg-morphe-blue/10 transition-all"
          >
            Отмена
          </button>
          <button
            onClick={handleSetTimer}
            className="flex-1 btn-primary"
          >
            Установить
          </button>
        </div>
      </div>
    </div>
  )
}

