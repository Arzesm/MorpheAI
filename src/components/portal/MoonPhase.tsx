'use client'

import { Moon, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'

// Точная функция расчета фазы луны
function getMoonPhaseData(date: Date = new Date()) {
  // Получаем текущую дату и время в UTC
  const utcDate = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  )
  
  // Известное новолуние: 1 января 2000 года, 18:14 UTC
  const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14, 0)
  
  // Количество миллисекунд с известного новолуния
  const msSinceNewMoon = utcDate - knownNewMoon
  
  // Лунный цикл в миллисекундах (29.530588853 дней)
  const lunarCycleMs = 29.530588853 * 24 * 60 * 60 * 1000
  
  // Текущая фаза луны (от 0 до 1)
  let phase = (msSinceNewMoon / lunarCycleMs) % 1
  if (phase < 0) phase += 1
  
  // Расчет освещенности (0% - новолуние, 100% - полнолуние)
  const illumination = Math.round((1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100)
  
  // Определение фазы
  let phaseName = ''
  let emoji = ''
  
  if (phase < 0.03 || phase >= 0.97) {
    phaseName = 'Новолуние'
    emoji = '🌑'
  } else if (phase < 0.22) {
    phaseName = 'Растущий серп'
    emoji = '🌒'
  } else if (phase < 0.28) {
    phaseName = 'Первая четверть'
    emoji = '🌓'
  } else if (phase < 0.47) {
    phaseName = 'Растущая луна'
    emoji = '🌔'
  } else if (phase < 0.53) {
    phaseName = 'Полнолуние'
    emoji = '🌕'
  } else if (phase < 0.72) {
    phaseName = 'Убывающая луна'
    emoji = '🌖'
  } else if (phase < 0.78) {
    phaseName = 'Последняя четверть'
    emoji = '🌗'
  } else {
    phaseName = 'Убывающий серп'
    emoji = '🌘'
  }

  return { phase: phaseName, illumination, emoji }
}

// Функция определения знака зодиака Луны (не солнца!)
function getMoonZodiacSign(date: Date = new Date()) {
  // Луна проходит через зодиак за ~27.3 дня (по ~2.3 дня в каждом знаке)
  // Известная позиция: 16 декабря 2025, Луна в Скорпионе
  const knownMoonPosition = Date.UTC(2025, 11, 16, 0, 0, 0) // 16 декабря 2025, Луна в Скорпионе
  const utcDate = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes()
  )
  
  // Количество дней с известной позиции
  const daysSince = (utcDate - knownMoonPosition) / (1000 * 60 * 60 * 24)
  
  // Лунный зодиакальный цикл ~27.32 дня
  const zodiacCycle = 27.32
  const daysPerSign = zodiacCycle / 12 // ~2.28 дня на знак
  
  // Определяем позицию в цикле (начинаем со Скорпиона = индекс 7)
  let position = (7 + (daysSince / daysPerSign)) % 12
  if (position < 0) position += 12
  
  const signs = [
    'Овен ♈',      // 0
    'Телец ♉',     // 1
    'Близнецы ♊',  // 2
    'Рак ♋',       // 3
    'Лев ♌',       // 4
    'Дева ♍',      // 5
    'Весы ♎',      // 6
    'Скорпион ♏',  // 7
    'Стрелец ♐',   // 8
    'Козерог ♑',   // 9
    'Водолей ♒',   // 10
    'Рыбы ♓'       // 11
  ]
  
  const signIndex = Math.floor(position)
  return signs[signIndex] || 'Скорпион ♏'
}

export default function MoonPhase() {
  const [moonData, setMoonData] = useState({
    phase: 'Загрузка...',
    illumination: 0,
    zodiacSign: '',
    emoji: '🌙'
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMoonData = async () => {
      // Получаем актуальную текущую дату
      const currentDate = new Date()
      console.log('📅 Текущая дата:', currentDate.toLocaleDateString('ru-RU'))
      
      // Рассчитываем фазу луны
      const moonInfo = getMoonPhaseData(currentDate)
      const zodiac = getMoonZodiacSign(currentDate)
      
      console.log('🌙 Фаза луны:', moonInfo.phase, 'Освещенность:', moonInfo.illumination + '%')
      console.log('♏ Луна в знаке:', zodiac)
      
      setMoonData({
        phase: moonInfo.phase,
        illumination: moonInfo.illumination,
        zodiacSign: zodiac,
        emoji: moonInfo.emoji
      })
      setIsLoading(false)
    }
    
    loadMoonData()
  }, [])

  if (isLoading) {
    return (
      <div className="card-premium p-6 relative overflow-hidden">
        <div className="animate-pulse">
          <div className="h-20 bg-mythic-ivory/5 rounded-lg mb-4"></div>
          <div className="h-4 bg-mythic-ivory/5 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card-premium p-6 relative overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-morphe-blue/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-amethyst-spirit/20 rounded-full blur-3xl" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-morphe-blue/30 rounded-full blur-xl animate-pulse" />
              <div className="relative text-6xl animate-float">{moonData.emoji}</div>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-2xl font-bold text-mythic-ivory tracking-tight">{moonData.phase}</h3>
                <Sparkles size={18} className="text-light-ai-blue" />
              </div>
              <p className="text-light-ai-blue text-sm font-semibold">{moonData.illumination}% освещенности</p>
              <p className="text-amethyst-spirit text-sm font-medium mt-1">{moonData.zodiacSign}</p>
            </div>
          </div>
          <div className="p-2 rounded-full bg-morphe-blue/10 backdrop-blur-sm">
            <Moon className="text-morphe-blue" size={24} />
          </div>
        </div>
        
        <div className="divider my-4" />
        
        {/* Шкала освещенности луны */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-mythic-ivory/60">Освещенность</span>
            <span className="text-xs font-bold text-light-ai-blue">{moonData.illumination}%</span>
          </div>
          <div className="relative h-2 w-full rounded-full bg-mythic-ivory/5 overflow-hidden">
            <div 
              className={`absolute inset-0 bg-gradient-to-r ${
                moonData.illumination < 50 
                  ? 'from-amethyst-spirit via-morphe-blue to-light-ai-blue' 
                  : 'from-morphe-blue via-light-ai-blue to-amethyst-spirit'
              } rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${moonData.illumination}%` }} 
            />
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" 
              style={{ backgroundSize: '200% 100%' }} 
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-mythic-ivory/70 text-sm leading-relaxed flex-1">
            {moonData.phase === 'Полнолуние' && 'Полнолуние усиливает интенсивность снов и может способствовать более ярким образам.'}
            {moonData.phase === 'Новолуние' && 'Новолуние — время для новых начинаний и работы с намерениями во снах.'}
            {(moonData.phase === 'Растущий серп' || moonData.phase === 'Первая четверть' || moonData.phase === 'Растущая луна') && 'Растущая луна благоприятна для практики осознанных сновидений.'}
            {(moonData.phase === 'Убывающая луна' || moonData.phase === 'Последняя четверть' || moonData.phase === 'Убывающий серп') && 'Убывающая луна помогает отпустить старое и проработать страхи во снах.'}
          </p>
        </div>
      </div>
    </div>
  )
}

