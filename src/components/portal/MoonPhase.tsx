'use client'

import { Moon, Sparkles, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'

// Функция расчета фазы луны
function getMoonPhaseData(date: Date = new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  let c = 0
  let e = 0
  let jd = 0
  let b = 0

  if (month < 3) {
    const yearMod = year - 1
    const monthMod = month + 12
    c = Math.floor(yearMod / 100)
    e = 2 - c + Math.floor(c / 4)
    jd = Math.floor(365.25 * (yearMod + 4716)) + Math.floor(30.6001 * (monthMod + 1)) + day + e - 1524.5
  } else {
    c = Math.floor(year / 100)
    e = 2 - c + Math.floor(c / 4)
    jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + e - 1524.5
  }

  b = jd - 2451550.1
  b /= 29.530588853
  b -= Math.floor(b)

  // Правильный расчет освещенности луны
  // От 0 до 0.5 (растущая луна): освещенность от 0% до 100%
  // От 0.5 до 1 (убывающая луна): освещенность от 100% до 0%
  let illumination: number
  if (b < 0.5) {
    // Растущая луна: 0% -> 100%
    illumination = Math.round(b * 2 * 100)
  } else {
    // Убывающая луна: 100% -> 0%
    illumination = Math.round((1 - b) * 2 * 100)
  }
  
  // Альтернативный метод (более точный, используя косинус):
  // illumination = Math.round((1 - Math.cos(b * 2 * Math.PI)) / 2 * 100)
  
  let phase = ''
  let emoji = ''
  
  if (b < 0.0625 || b >= 0.9375) {
    phase = 'Новолуние'
    emoji = '🌑'
  } else if (b < 0.1875) {
    phase = 'Растущий серп'
    emoji = '🌒'
  } else if (b < 0.3125) {
    phase = 'Первая четверть'
    emoji = '🌓'
  } else if (b < 0.4375) {
    phase = 'Растущая луна'
    emoji = '🌔'
  } else if (b < 0.5625) {
    phase = 'Полнолуние'
    emoji = '🌕'
  } else if (b < 0.6875) {
    phase = 'Убывающая луна'
    emoji = '🌖'
  } else if (b < 0.8125) {
    phase = 'Последняя четверть'
    emoji = '🌗'
  } else {
    phase = 'Убывающий серп'
    emoji = '🌘'
  }

  return { phase, illumination, emoji }
}

// Функция определения знака зодиака
function getZodiacSignData(date: Date = new Date()) {
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  const signs = [
    { sign: 'Козерог ♑', start: [12, 22], end: [1, 19] },
    { sign: 'Водолей ♒', start: [1, 20], end: [2, 18] },
    { sign: 'Рыбы ♓', start: [2, 19], end: [3, 20] },
    { sign: 'Овен ♈', start: [3, 21], end: [4, 19] },
    { sign: 'Телец ♉', start: [4, 20], end: [5, 20] },
    { sign: 'Близнецы ♊', start: [5, 21], end: [6, 20] },
    { sign: 'Рак ♋', start: [6, 21], end: [7, 22] },
    { sign: 'Лев ♌', start: [7, 23], end: [8, 22] },
    { sign: 'Дева ♍', start: [8, 23], end: [9, 22] },
    { sign: 'Весы ♎', start: [9, 23], end: [10, 22] },
    { sign: 'Скорпион ♏', start: [10, 23], end: [11, 21] },
    { sign: 'Стрелец ♐', start: [11, 22], end: [12, 21] }
  ]
  
  for (const { sign, start, end } of signs) {
    const [startMonth, startDay] = start
    const [endMonth, endDay] = end
    
    if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay)
    ) {
      return sign
    }
  }
  
  return 'Козерог ♑'
}

export default function MoonPhase() {
  const [moonData, setMoonData] = useState({
    phase: 'Загрузка...',
    illumination: 0,
    zodiacSign: '',
    emoji: '🌙'
  })
  const [location, setLocation] = useState<string>('Москва')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Получаем актуальную фазу луны
    const currentDate = new Date()
    const moonInfo = getMoonPhaseData(currentDate)
    const zodiac = getZodiacSignData(currentDate)
    
    setMoonData({
      phase: moonInfo.phase,
      illumination: moonInfo.illumination,
      zodiacSign: zodiac,
      emoji: moonInfo.emoji
    })
    setIsLoading(false)

    // Получаем геолокацию пользователя
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Используем Nominatim API для определения города
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&accept-language=ru`,
              { cache: 'force-cache' }
            )
            const data = await response.json()
            const city = data.address.city || data.address.town || data.address.village || 'Ваше местоположение'
            setLocation(city)
          } catch (error) {
            console.error('Ошибка определения местоположения:', error)
            setLocation('Москва')
          }
        },
        (error) => {
          console.log('Геолокация не разрешена:', error)
          setLocation('Москва')
        },
        { timeout: 10000 }
      )
    }
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
        
        <div className="flex items-center space-x-2 text-xs text-mythic-ivory/50 mt-3">
          <MapPin size={12} />
          <span>{location}</span>
        </div>
      </div>
    </div>
  )
}

