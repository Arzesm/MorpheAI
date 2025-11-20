// Utility functions for MorpheAI

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

/**
 * Format time to readable string
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Calculate moon phase based on date
 */
export function getMoonPhase(date: Date = new Date()): {
  phase: string
  illumination: number
  emoji: string
} {
  // Simplified moon phase calculation
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

  const illumination = Math.round(b * 100)
  
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

/**
 * Get zodiac sign for current date
 */
export function getZodiacSign(date: Date = new Date()): string {
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

/**
 * Generate random archetype
 */
export function getRandomArchetype(): {
  name: string
  icon: string
  color: string
} {
  const archetypes = [
    { name: 'Искатель', icon: '🔮', color: 'from-morphe-blue to-amethyst-spirit' },
    { name: 'Мудрец', icon: '📚', color: 'from-amethyst-spirit to-morphe-blue' },
    { name: 'Странник', icon: '🌍', color: 'from-light-ai-blue to-morphe-blue' },
    { name: 'Герой', icon: '⚔️', color: 'from-morphe-blue to-light-ai-blue' },
    { name: 'Творец', icon: '🎨', color: 'from-amethyst-spirit to-light-ai-blue' },
    { name: 'Правитель', icon: '👑', color: 'from-morphe-blue to-amethyst-spirit' }
  ]
  
  return archetypes[Math.floor(Math.random() * archetypes.length)]
}

/**
 * Sleep quality score (0-10)
 */
export function calculateSleepQuality(data: {
  duration: number // hours
  interruptions: number
  deepSleepPercentage: number
}): number {
  const durationScore = Math.min(data.duration / 8, 1) * 4
  const interruptionScore = Math.max(0, 3 - data.interruptions * 0.5)
  const deepSleepScore = (data.deepSleepPercentage / 100) * 3
  
  return Math.round((durationScore + interruptionScore + deepSleepScore) * 10) / 10
}

/**
 * Classify dream type based on content
 */
export function classifyDreamType(content: string): 'normal' | 'lucid' | 'nightmare' | 'recurring' {
  const lower = content.toLowerCase()
  
  if (lower.includes('осознал') || lower.includes('понял что сплю')) {
    return 'lucid'
  } else if (lower.includes('страх') || lower.includes('кошмар') || lower.includes('ужас')) {
    return 'nightmare'
  } else if (lower.includes('опять') || lower.includes('снова') || lower.includes('повтор')) {
    return 'recurring'
  }
  
  return 'normal'
}

