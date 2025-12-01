'use client'

import { TrendingUp, Moon, AlertCircle, Smile, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useDreamsLight } from '@/hooks/useDreams'
import { Dream } from '@/lib/supabase'

export default function MonthlyStats() {
  const { dreams: allDreams, isLoading } = useDreamsLight()
  
  // Вычисляем статистику из загруженных снов
  const { currentStats, prevStats } = (() => {
    if (!allDreams || allDreams.length === 0) {
      return {
        currentStats: {
          totalDreams: 0,
          lucidDreams: 0,
          anxiousDreams: 0,
          emotionIndex: 0
        },
        prevStats: {
          totalDreams: 0,
          lucidDreams: 0,
          anxiousDreams: 0,
          emotionIndex: 0
        }
      }
    }

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // Предыдущий месяц
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear

    // Фильтруем сны текущего месяца
    const currentMonthDreams = allDreams.filter((dream) => {
      const dreamDate = new Date(dream.date)
      return (
        dreamDate.getMonth() === currentMonth &&
        dreamDate.getFullYear() === currentYear
      )
    })

    // Фильтруем сны предыдущего месяца
    const prevMonthDreams = allDreams.filter((dream) => {
      const dreamDate = new Date(dream.date)
      return (
        dreamDate.getMonth() === prevMonth &&
        dreamDate.getFullYear() === prevYear
      )
    })

    const emotionScores: Record<string, number> = {
      'Радость': 10,
      'Спокойствие': 9,
      'Удивление': 7,
      'Ностальгия': 6,
      'Грусть': 4,
      'Тревога': 3,
      'Страх': 2
    }

    // Функция для расчета статистики
    const calculateStats = (dreams: Dream[]) => {
      const totalDreams = dreams.length
      const lucidDreams = dreams.filter((d) => d.dream_type === 'lucid').length
      const anxiousDreams = dreams.filter((d) => 
        d.emotion === 'Тревога' || d.emotion === 'Страх' || d.dream_type === 'nightmare'
      ).length

      const totalScore = dreams.reduce((sum, dream) => {
        return sum + (emotionScores[dream.emotion] || 5)
      }, 0)
      
      const emotionIndex = totalDreams > 0 ? parseFloat((totalScore / totalDreams).toFixed(1)) : 0

      return { totalDreams, lucidDreams, anxiousDreams, emotionIndex }
    }

    const currentStats = calculateStats(currentMonthDreams)
    const previousStats = calculateStats(prevMonthDreams)

    return { currentStats, prevStats: previousStats }
  })()

  const getChange = (current: number, previous: number) => {
    const diff = current - previous
    if (diff === 0) return null
    return {
      value: diff,
      isPositive: diff > 0,
      text: diff > 0 ? `+${diff}` : `${diff}`
    }
  }

  const statsData = [
    {
      icon: Moon,
      label: 'Снов записано',
      value: currentStats.totalDreams.toString(),
      change: getChange(currentStats.totalDreams, prevStats.totalDreams),
      color: 'text-morphe-blue',
      gradient: 'from-morphe-blue/20 to-morphe-blue/5',
      link: '/journal'
    },
    {
      icon: Sparkles,
      label: 'Осознанных',
      value: currentStats.lucidDreams.toString(),
      change: getChange(currentStats.lucidDreams, prevStats.lucidDreams),
      color: 'text-amethyst-spirit',
      gradient: 'from-amethyst-spirit/20 to-amethyst-spirit/5',
      link: '/journal?type=lucid'
    },
    {
      icon: AlertCircle,
      label: 'Тревожных',
      value: currentStats.anxiousDreams.toString(),
      change: getChange(currentStats.anxiousDreams, prevStats.anxiousDreams),
      color: 'text-light-ai-blue',
      gradient: 'from-light-ai-blue/20 to-light-ai-blue/5',
      link: '/journal?anxious=true',
      invertColor: true // Для тревожных снов меньше = лучше
    },
    {
      icon: Smile,
      label: 'Индекс эмоций',
      value: currentStats.emotionIndex.toFixed(1),
      change: getChange(currentStats.emotionIndex, prevStats.emotionIndex),
      color: 'text-mythic-ivory',
      gradient: 'from-mythic-ivory/10 to-mythic-ivory/5',
      link: null
    }
  ]

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-header flex items-center">
            <TrendingUp size={22} className="mr-2 text-morphe-blue" />
            Статистика месяца
          </h2>
        </div>
        {/* Skeleton для статистики */}
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-mythic-ivory/10 rounded-xl" />
                <div className="w-12 h-6 bg-mythic-ivory/10 rounded-lg" />
              </div>
              <div className="w-16 h-4 bg-mythic-ivory/10 rounded mb-2" />
              <div className="w-12 h-8 bg-mythic-ivory/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-header flex items-center">
          <TrendingUp size={22} className="mr-2 text-morphe-blue" />
          Статистика месяца
        </h2>
        <Link href="/stats">
          <button className="text-morphe-blue text-sm font-semibold hover:text-light-ai-blue transition-colors flex items-center space-x-1">
            <span>Подробнее</span>
            <span>→</span>
          </button>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {statsData.map((stat, index) => {
          const content = (
            <div className={`card p-4 group ${stat.link ? 'hover:scale-[1.02] cursor-pointer' : ''} transition-transform`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-mythic-ivory/5 backdrop-blur-sm">
                    <stat.icon size={20} className={stat.color} />
                  </div>
                  {stat.change && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                      stat.invertColor
                        ? (stat.change.isPositive ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400')
                        : (stat.change.isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400')
                    }`}>
                      {stat.change.text}
                    </span>
                  )}
                </div>
                <p className="text-mythic-ivory/60 text-xs font-medium mb-2">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color} tracking-tight`}>{stat.value}</p>
              </div>
            </div>
          )
          
          return stat.link ? (
            <Link key={index} href={stat.link}>
              {content}
            </Link>
          ) : (
            <div key={index}>
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Sparkles({ size, className }: { size: number; className: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3L14 10L21 12L14 14L12 21L10 14L3 12L10 10L12 3Z" />
    </svg>
  )
}

