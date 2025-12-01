'use client'

import { Lightbulb } from 'lucide-react'

export default function SleepTips() {
  const tips = [
    {
      title: 'Регулярный режим',
      description: 'Ложитесь спать и просыпайтесь в одно и то же время',
      icon: '⏰'
    },
    {
      title: 'Тёмная комната',
      description: 'Используйте плотные шторы или маску для сна',
      icon: '🌙'
    },
    {
      title: 'Температура',
      description: 'Оптимальная температура для сна — 18-20°C',
      icon: '🌡️'
    }
  ]

  return (
    <div>
      <h2 className="section-header flex items-center mb-4">
        <Lightbulb size={22} className="mr-2 text-morphe-blue" />
        Советы по улучшению сна
      </h2>

      <div className="grid gap-3">
        {tips.map((tip, index) => (
          <div key={index} className="card-glass p-4 flex items-start space-x-3 gap-3 hover:scale-[1.01] transition-all group">
            <div className="relative">
              <div className="absolute inset-0 bg-light-ai-blue/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative text-3xl p-2 bg-gradient-to-br from-mythic-ivory/5 to-mythic-ivory/10 rounded-xl backdrop-blur-sm">
                {tip.icon}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-mythic-ivory font-semibold text-sm mb-1.5 tracking-tight">
                {tip.title}
              </h3>
              <p className="text-mythic-ivory/70 text-xs leading-relaxed">
                {tip.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

