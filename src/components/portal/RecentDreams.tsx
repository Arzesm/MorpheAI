'use client'

import { BookOpen, Calendar, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
import { useDreams } from '@/hooks/useDreams'

export default function RecentDreams() {
  const { dreams: allDreams, isLoading, error } = useDreams()
  
  // Сортируем по дате (новые сверху) и берём последние 3
  const recentDreams = useMemo(() => {
    if (!allDreams || allDreams.length === 0) return []
    const sorted = [...allDreams].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    return sorted.slice(0, 3)
  }, [allDreams])

  const getEmojiForContent = (content: string) => {
    const lowerContent = content.toLowerCase()
    if (lowerContent.includes('полёт') || lowerContent.includes('лет')) return '✨'
    if (lowerContent.includes('дом')) return '🏠'
    if (lowerContent.includes('лес')) return '🌲'
    if (lowerContent.includes('вода') || lowerContent.includes('море')) return '🌊'
    if (lowerContent.includes('город')) return '🏙️'
    return '💭'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-header flex items-center">
          <BookOpen size={22} className="mr-2 text-morphe-blue" />
          Последние сны
        </h2>
        <Link href="/journal" className="text-morphe-blue text-sm font-semibold hover:text-light-ai-blue transition-colors flex items-center space-x-1">
          <span>Все</span>
          <span>→</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-mythic-ivory/10 rounded-2xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-mythic-ivory/10 rounded w-3/4" />
                  <div className="h-3 bg-mythic-ivory/10 rounded w-full" />
                  <div className="h-3 bg-mythic-ivory/10 rounded w-2/3" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-mythic-ivory/10 rounded-full w-16" />
                    <div className="h-6 bg-mythic-ivory/10 rounded-full w-16" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="card p-8 text-center">
          <div className="text-5xl mb-3">⚠️</div>
          <p className="text-mythic-ivory/60 mb-4">Ошибка загрузки снов</p>
          <p className="text-mythic-ivory/40 text-xs mb-4">{error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Перезагрузить страницу
          </button>
        </div>
      ) : recentDreams.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-5xl mb-3">🌙</div>
          <p className="text-mythic-ivory/60 mb-4">Пока нет записанных снов</p>
          <Link href="/journal/new">
            <button className="btn-primary">
              Записать первый сон
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {recentDreams.map((dream) => {
            // Извлекаем чистый текст из HTML для preview
            const cleanText = dream.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
            const preview = cleanText.substring(0, 80) + (cleanText.length > 80 ? '...' : '')
            return (
              <Link key={dream.id} href={`/journal/${dream.id}`}>
                <div className="card p-5 hover:scale-[1.01] transition-all cursor-pointer group">
                  <div className="flex items-start space-x-4 gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-morphe-blue/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative text-4xl p-2 bg-gradient-to-br from-mythic-ivory/10 to-mythic-ivory/20 rounded-2xl backdrop-blur-sm transform transition-transform group-hover:scale-110" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>
                        {getEmojiForContent(dream.content)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-mythic-ivory font-bold text-base mb-2 truncate tracking-tight">
                        {dream.title}
                      </h3>
                      
                      <p className="text-mythic-ivory/70 text-sm line-clamp-2 mb-3 leading-relaxed">
                        {preview}
                      </p>
                      
                      <div className="flex items-center space-x-3 gap-3 text-xs text-mythic-ivory/60 mb-3">
                        <span className="flex items-center px-2 py-1 rounded-lg bg-mythic-ivory/5">
                          <Calendar size={12} className="mr-1" />
                          {formatDate(dream.date)}
                        </span>
                        <span className="flex items-center">
                          {dream.emotion_emoji} <span className="ml-1">{dream.emotion}</span>
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2.5">
                        {dream.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="badge badge-primary">
                            #{tag}
                          </span>
                        ))}
                        {dream.tags.length > 3 && (
                          <span className="badge badge-primary opacity-60">
                            +{dream.tags.length - 3}
                          </span>
                        )}
                        {dream.archetype && dream.archetype !== 'Не определен' && (
                          <span className="badge badge-purple">
                            {dream.archetype}
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
      )}
    </div>
  )
}

