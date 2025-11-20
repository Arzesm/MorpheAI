'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Moon, 
  Sparkles, 
  AlertCircle, 
  Smile,
  Calendar,
  Loader2,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import { dreamService, Dream } from '@/lib/supabase'

export default function StatsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentStats, setCurrentStats] = useState<any>(null)
  const [prevStats, setPrevStats] = useState<any>(null)
  const [currentMonthName, setCurrentMonthName] = useState('')
  const [prevMonthName, setPrevMonthName] = useState('')

  useEffect(() => {
    loadDetailedStats()
  }, [])

  const loadDetailedStats = async () => {
    setIsLoading(true)
    try {
      const allDreams = await dreamService.getAll()
      if (allDreams) {
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear

        // Названия месяцев
        setCurrentMonthName(now.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }))
        const prevDate = new Date(prevYear, prevMonth, 1)
        setPrevMonthName(prevDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }))

        // Фильтруем сны
        const currentMonthDreams = allDreams.filter((dream) => {
          const dreamDate = new Date(dream.date)
          return dreamDate.getMonth() === currentMonth && dreamDate.getFullYear() === currentYear
        })

        const prevMonthDreams = allDreams.filter((dream) => {
          const dreamDate = new Date(dream.date)
          return dreamDate.getMonth() === prevMonth && dreamDate.getFullYear() === prevYear
        })

        // Расчет детальной статистики
        const calculateDetailedStats = (dreams: Dream[]) => {
          const emotionScores: Record<string, number> = {
            'Радость': 10,
            'Спокойствие': 9,
            'Удивление': 7,
            'Ностальгия': 6,
            'Грусть': 4,
            'Тревога': 3,
            'Страх': 2
          }

          const totalDreams = dreams.length
          const lucidDreams = dreams.filter(d => d.dream_type === 'lucid').length
          const nightmares = dreams.filter(d => d.dream_type === 'nightmare').length
          const epicDreams = dreams.filter(d => d.dream_type === 'epic').length
          const normalDreams = dreams.filter(d => d.dream_type === 'normal').length
          
          const anxiousDreams = dreams.filter(d => 
            d.emotion === 'Тревога' || d.emotion === 'Страх' || d.dream_type === 'nightmare'
          ).length

          const withInterpretation = dreams.filter(d => d.has_interpretation).length

          // Эмоции
          const emotionCounts: Record<string, number> = {}
          dreams.forEach(d => {
            emotionCounts[d.emotion] = (emotionCounts[d.emotion] || 0) + 1
          })

          const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]

          // Индекс эмоций
          const totalScore = dreams.reduce((sum, dream) => {
            return sum + (emotionScores[dream.emotion] || 5)
          }, 0)
          const emotionIndex = totalDreams > 0 ? parseFloat((totalScore / totalDreams).toFixed(1)) : 0

          // Средняя длина сна
          const avgLength = totalDreams > 0 
            ? Math.round(dreams.reduce((sum, d) => sum + d.content.length, 0) / totalDreams)
            : 0

          // Самые частые теги
          const tagCounts: Record<string, number> = {}
          dreams.forEach(d => {
            d.tags.forEach(tag => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1
            })
          })
          const topTags = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)

          return {
            totalDreams,
            lucidDreams,
            nightmares,
            epicDreams,
            normalDreams,
            anxiousDreams,
            withInterpretation,
            emotionIndex,
            topEmotion: topEmotion ? { name: topEmotion[0], count: topEmotion[1] } : null,
            avgLength,
            topTags,
            emotionCounts
          }
        }

        setCurrentStats(calculateDetailedStats(currentMonthDreams))
        setPrevStats(calculateDetailedStats(prevMonthDreams))
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки статистики:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getChangeInfo = (current: number, previous: number, invertColor = false) => {
    const diff = current - previous
    if (diff === 0) return { icon: Minus, color: 'text-mythic-ivory/40', text: 'без изменений' }
    
    const isPositive = invertColor ? diff < 0 : diff > 0
    return {
      icon: diff > 0 ? ArrowUp : ArrowDown,
      color: isPositive ? 'text-green-400' : 'text-red-400',
      text: `${diff > 0 ? '+' : ''}${diff} ${Math.abs(diff) === 1 ? 'сон' : 'снов'}`
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-morphe-blue" />
      </div>
    )
  }

  if (!currentStats || !prevStats) {
    return (
      <div className="space-y-6 pb-6 animate-fade-in">
        <Header showBackButton backTo="/portal" />
        <div className="text-center py-12">
          <p className="text-mythic-ivory/70">Недостаточно данных для статистики</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      <Header showBackButton backTo="/portal" />

      <div>
        <h1 className="text-3xl font-bold text-mythic-ivory mb-2">Детальная статистика</h1>
        <p className="text-mythic-ivory/60 text-sm">Сравнение месяцев</p>
      </div>

      {/* Month Comparison */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <p className="text-mythic-ivory/60 text-sm mb-1">{prevMonthName}</p>
            <p className="text-2xl font-bold text-mythic-ivory/50">{prevStats.totalDreams}</p>
          </div>
          <div className="px-4">
            <TrendingUp size={24} className="text-morphe-blue" />
          </div>
          <div className="text-center flex-1">
            <p className="text-morphe-blue text-sm mb-1 capitalize">{currentMonthName}</p>
            <p className="text-2xl font-bold text-morphe-blue">{currentStats.totalDreams}</p>
          </div>
        </div>
      </div>

      {/* Dream Types Breakdown */}
      <div>
        <h2 className="text-xl font-semibold text-mythic-ivory mb-4 flex items-center">
          <Moon size={22} className="mr-2 text-morphe-blue" />
          Типы снов
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Lucid Dreams */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Sparkles size={18} className="text-amethyst-spirit" />
                <span className="text-mythic-ivory text-sm font-medium">Осознанные</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-amethyst-spirit mb-2">{currentStats.lucidDreams}</p>
            {(() => {
              const change = getChangeInfo(currentStats.lucidDreams, prevStats.lucidDreams)
              return (
                <div className={`flex items-center space-x-1 text-xs ${change.color}`}>
                  <change.icon size={14} />
                  <span>{change.text}</span>
                </div>
              )
            })()}
          </div>

          {/* Nightmares */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-red-400 text-lg">😱</span>
                <span className="text-mythic-ivory text-sm font-medium">Кошмары</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-red-400 mb-2">{currentStats.nightmares}</p>
            {(() => {
              const change = getChangeInfo(currentStats.nightmares, prevStats.nightmares, true)
              return (
                <div className={`flex items-center space-x-1 text-xs ${change.color}`}>
                  <change.icon size={14} />
                  <span>{change.text}</span>
                </div>
              )
            })()}
          </div>

          {/* Epic Dreams */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400 text-lg">🌟</span>
                <span className="text-mythic-ivory text-sm font-medium">Эпические</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-yellow-400 mb-2">{currentStats.epicDreams}</p>
            {(() => {
              const change = getChangeInfo(currentStats.epicDreams, prevStats.epicDreams)
              return (
                <div className={`flex items-center space-x-1 text-xs ${change.color}`}>
                  <change.icon size={14} />
                  <span>{change.text}</span>
                </div>
              )
            })()}
          </div>

          {/* Normal Dreams */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-morphe-blue text-lg">💭</span>
                <span className="text-mythic-ivory text-sm font-medium">Обычные</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-morphe-blue mb-2">{currentStats.normalDreams}</p>
            {(() => {
              const change = getChangeInfo(currentStats.normalDreams, prevStats.normalDreams)
              return (
                <div className={`flex items-center space-x-1 text-xs ${change.color}`}>
                  <change.icon size={14} />
                  <span>{change.text}</span>
                </div>
              )
            })()}
          </div>
        </div>
      </div>

      {/* Emotional Stats */}
      <div>
        <h2 className="text-xl font-semibold text-mythic-ivory mb-4 flex items-center">
          <Smile size={22} className="mr-2 text-morphe-blue" />
          Эмоциональная статистика
        </h2>

        <div className="space-y-3">
          {/* Anxious Dreams */}
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-mythic-ivory/60 text-sm mb-1">Тревожных снов</p>
                <p className="text-2xl font-bold text-light-ai-blue">{currentStats.anxiousDreams}</p>
              </div>
              {(() => {
                const change = getChangeInfo(currentStats.anxiousDreams, prevStats.anxiousDreams, true)
                return (
                  <div className={`flex flex-col items-end ${change.color}`}>
                    <change.icon size={20} />
                    <span className="text-xs mt-1">{change.text}</span>
                  </div>
                )
              })()}
            </div>
          </div>

          {/* Emotion Index */}
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-mythic-ivory/60 text-sm mb-1">Индекс эмоций</p>
                <p className="text-2xl font-bold text-mythic-ivory">{currentStats.emotionIndex}</p>
              </div>
              {(() => {
                const diff = currentStats.emotionIndex - prevStats.emotionIndex
                const change = {
                  icon: diff === 0 ? Minus : diff > 0 ? ArrowUp : ArrowDown,
                  color: diff === 0 ? 'text-mythic-ivory/40' : diff > 0 ? 'text-green-400' : 'text-red-400',
                  text: diff === 0 ? 'без изменений' : `${diff > 0 ? '+' : ''}${diff.toFixed(1)}`
                }
                return (
                  <div className={`flex flex-col items-end ${change.color}`}>
                    <change.icon size={20} />
                    <span className="text-xs mt-1">{change.text}</span>
                  </div>
                )
              })()}
            </div>
          </div>

          {/* Top Emotion */}
          {currentStats.topEmotion && (
            <div className="card p-4">
              <p className="text-mythic-ivory/60 text-sm mb-2">Главная эмоция месяца</p>
              <div className="flex items-center space-x-3">
                <div className="text-3xl">
                  {currentStats.topEmotion.name === 'Радость' && '😊'}
                  {currentStats.topEmotion.name === 'Спокойствие' && '😌'}
                  {currentStats.topEmotion.name === 'Тревога' && '😰'}
                  {currentStats.topEmotion.name === 'Страх' && '😨'}
                  {currentStats.topEmotion.name === 'Грусть' && '😢'}
                  {currentStats.topEmotion.name === 'Удивление' && '😲'}
                  {currentStats.topEmotion.name === 'Ностальгия' && '🥺'}
                </div>
                <div>
                  <p className="text-lg font-bold text-mythic-ivory">{currentStats.topEmotion.name}</p>
                  <p className="text-sm text-mythic-ivory/60">{currentStats.topEmotion.count} {currentStats.topEmotion.count === 1 ? 'сон' : 'снов'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Stats */}
      <div>
        <h2 className="text-xl font-semibold text-mythic-ivory mb-4">Дополнительно</h2>
        
        <div className="space-y-3">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <p className="text-mythic-ivory/60 text-sm">С AI интерпретацией</p>
              <p className="text-xl font-bold text-morphe-blue">{currentStats.withInterpretation} / {currentStats.totalDreams}</p>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between">
              <p className="text-mythic-ivory/60 text-sm">Средняя длина записи</p>
              <p className="text-xl font-bold text-mythic-ivory">{currentStats.avgLength} символов</p>
            </div>
          </div>

          {/* Top Tags */}
          {currentStats.topTags.length > 0 && (
            <div className="card p-4">
              <p className="text-mythic-ivory/60 text-sm mb-3">Популярные теги</p>
              <div className="flex flex-wrap gap-2">
                {currentStats.topTags.map(([tag, count]: [string, number]) => (
                  <span key={tag} className="px-3 py-1 bg-light-ai-blue/20 text-light-ai-blue text-xs rounded-full">
                    #{tag} ({count})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

