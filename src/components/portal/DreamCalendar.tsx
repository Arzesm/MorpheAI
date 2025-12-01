'use client'

import { Calendar, Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDreamsLight } from '@/hooks/useDreams'
import { Dream } from '@/lib/supabase'

export default function DreamCalendar() {
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const { dreams: allDreams, isLoading } = useDreamsLight()
  const [selectedDayDreams, setSelectedDayDreams] = useState<Dream[] | null>(null)
  const [showModal, setShowModal] = useState(false)
  
  // Группируем сны по дням текущего месяца (мемоизация)
  const dreamsByDate = useMemo(() => {
    if (!allDreams || allDreams.length === 0) return {}
    
    const dreamsByDay: Record<number, Dream[]> = {}
    allDreams.forEach((dream) => {
      const dreamDate = new Date(dream.date)
      if (
        dreamDate.getMonth() === currentMonth.getMonth() &&
        dreamDate.getFullYear() === currentMonth.getFullYear()
      ) {
        const day = dreamDate.getDate()
        if (!dreamsByDay[day]) {
          dreamsByDay[day] = []
        }
        dreamsByDay[day].push(dream)
      }
    })
    return dreamsByDay
  }, [allDreams, currentMonth])
  
  // Навигация по месяцам
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() - 1)
      return newDate
    })
  }
  
  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + 1)
      return newDate
    })
  }
  
  const goToCurrentMonth = () => {
    setCurrentMonth(new Date())
  }
  
  const isCurrentMonth = () => {
    const now = new Date()
    return currentMonth.getMonth() === now.getMonth() && 
           currentMonth.getFullYear() === now.getFullYear()
  }
  
  // Генерируем дни месяца
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate()
  
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay()

  const getDayColor = (dreams: Dream[]) => {
    if (!dreams || dreams.length === 0) return ''
    
    // Определяем цвет по типу первого сна (если их несколько в один день)
    const firstDream = dreams[0]
    switch (firstDream.dream_type) {
      case 'lucid':
        return 'bg-amethyst-spirit'
      case 'nightmare':
        return 'bg-red-500'
      case 'epic':
        return 'bg-yellow-500'
      case 'normal':
      default:
        return 'bg-morphe-blue'
    }
  }
  
  const handleDayClick = (day: number) => {
    const dreamsOnDay = dreamsByDate[day]
    if (dreamsOnDay && dreamsOnDay.length > 0) {
      if (dreamsOnDay.length === 1) {
        // Если один сон - переходим сразу
        router.push(`/journal/${dreamsOnDay[0].id}`)
      } else {
        // Если несколько - показываем модальное окно
        setSelectedDayDreams(dreamsOnDay)
        setShowModal(true)
      }
    }
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
  }
  
  const getDreamTypeEmoji = (type: string) => {
    switch (type) {
      case 'lucid': return '✨'
      case 'nightmare': return '😱'
      case 'epic': return '⭐'
      default: return '💭'
    }
  }

  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-header flex items-center">
          <Calendar size={22} className="mr-2 text-morphe-blue" />
          Календарь снов
        </h2>
      </div>
      
      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg bg-mythic-ivory/5 hover:bg-mythic-ivory/10 text-mythic-ivory transition-all"
            aria-label="Предыдущий месяц"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex flex-col items-center">
            <h3 className="text-mythic-ivory font-bold text-lg tracking-tight capitalize">
              {currentMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
            </h3>
            {!isCurrentMonth() && (
              <button
                onClick={goToCurrentMonth}
                className="text-morphe-blue text-xs font-medium hover:text-light-ai-blue transition-colors mt-1"
              >
                Текущий месяц
              </button>
            )}
          </div>
          
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg bg-mythic-ivory/5 hover:bg-mythic-ivory/10 text-mythic-ivory transition-all"
            aria-label="Следующий месяц"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1.5 mb-4">
          {days.map((day) => (
            <div key={day} className="text-center text-mythic-ivory/50 text-xs font-semibold tracking-wide py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        {isLoading ? (
          <div className="grid grid-cols-7 gap-1.5 animate-pulse">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="aspect-square bg-mythic-ivory/10 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            
            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dreamsOnDay = dreamsByDate[day]
              const hasDreams = dreamsOnDay && dreamsOnDay.length > 0
              
              return (
                <div
                  key={day}
                  onClick={() => hasDreams && handleDayClick(day)}
                  className={`aspect-square flex items-center justify-center rounded-xl text-sm font-semibold transition-all relative ${
                    hasDreams
                      ? `${getDayColor(dreamsOnDay)} text-mythic-ivory shadow-xl ring-1 ring-white/10 hover:scale-110 cursor-pointer`
                      : 'bg-mythic-ivory/[0.03] text-mythic-ivory/40 hover:bg-mythic-ivory/[0.06] cursor-default'
                  }`}
                  title={hasDreams ? `${dreamsOnDay.length} ${dreamsOnDay.length === 1 ? 'сон' : 'снов'}` : ''}
                >
                  {day}
                  {hasDreams && dreamsOnDay.length > 1 && (
                    <span className="absolute top-0.5 right-0.5 text-[9px] bg-white/20 rounded-full w-3.5 h-3.5 flex items-center justify-center">
                      {dreamsOnDay.length}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Legend */}
        <div className="divider my-5" />
        <div className="flex flex-wrap gap-3 gap-y-2.5 text-xs">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-morphe-blue/10 backdrop-blur-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-morphe-blue shadow-lg shadow-morphe-blue/50" />
            <span className="text-mythic-ivory/80 font-medium">Обычный</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amethyst-spirit/10 backdrop-blur-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-amethyst-spirit shadow-lg shadow-amethyst-spirit/50" />
            <span className="text-mythic-ivory/80 font-medium">Осознанный</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-red-500/10 backdrop-blur-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
            <span className="text-mythic-ivory/80 font-medium">Кошмар</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 backdrop-blur-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50" />
            <span className="text-mythic-ivory/80 font-medium">Эпический</span>
          </div>
        </div>
      </div>
      
      {/* Modal for multiple dreams */}
      {showModal && selectedDayDreams && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-night-deep-blue border border-morphe-blue/30 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-night-deep-blue border-b border-morphe-blue/20 p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-mythic-ivory">
                Сны за {formatDate(selectedDayDreams[0].date)}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg bg-mythic-ivory/5 hover:bg-mythic-ivory/10 text-mythic-ivory transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-3">
              {selectedDayDreams.map((dream) => {
                // Извлекаем чистый текст из HTML для preview
                const cleanText = dream.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
                const preview = cleanText.substring(0, 60) + (cleanText.length > 60 ? '...' : '')
                
                return (
                  <Link
                    key={dream.id}
                    href={`/journal/${dream.id}`}
                    onClick={() => setShowModal(false)}
                  >
                    <div className="card p-4 hover:scale-[1.02] transition-all cursor-pointer group">
                      <div className="flex items-start space-x-3">
                        <div className="text-3xl transform transition-transform group-hover:scale-110" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>
                          <span className="text-3xl">{getDreamTypeEmoji(dream.dream_type)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-mythic-ivory font-semibold text-sm mb-1 truncate">
                            {dream.title}
                          </h4>
                          <p className="text-mythic-ivory/60 text-xs line-clamp-2 mb-2">
                            {preview}
                          </p>
                          <div className="flex items-center space-x-2 text-xs">
                            <span className="text-mythic-ivory/50 flex items-center">
                              <span className="text-3xl">{dream.emotion_emoji}</span> <span className="ml-1">{dream.emotion}</span>
                            </span>
                            {dream.tags.length > 0 && (
                              <span className="text-light-ai-blue">
                                #{dream.tags[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

