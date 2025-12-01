'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Calendar, Image, Sparkles, Trash2 } from 'lucide-react'
import { dreamService } from '@/lib/supabase'

interface DreamCardProps {
  dream: {
    id: string
    title: string
    date: string
    emotion: string
    emotion_emoji: string
    tags: string[]
    archetype: string
    content: string
    has_interpretation: boolean
    has_image: boolean
    dream_type: string
    image_url?: string
  }
  onDelete?: () => void
}

export default function DreamCard({ dream, onDelete }: DreamCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const getDreamTypeBadge = (type: string) => {
    switch (type) {
      case 'lucid':
        return (
          <span className="px-2 py-1 bg-amethyst-spirit/30 text-amethyst-spirit text-xs rounded-full flex items-center space-x-1">
            <Sparkles size={12} />
            <span>Осознанный</span>
          </span>
        )
      case 'nightmare':
        return (
          <span className="px-2 py-1 bg-red-500/30 text-red-400 text-xs rounded-full">
            Кошмар
          </span>
        )
      case 'epic':
        return (
          <span className="px-2 py-1 bg-yellow-500/30 text-yellow-400 text-xs rounded-full flex items-center space-x-1">
            <span>🌟</span>
            <span>Эпический</span>
          </span>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const getEmojiForDream = () => {
    // Сначала проверяем теги
    if (dream.tags && dream.tags.length > 0) {
      const emojiFromTags = getEmojiFromTags(dream.tags)
      if (emojiFromTags) return emojiFromTags
    }
    
    // Если теги не подошли, используем контент
    return getEmojiFromContent(dream.content)
  }

  // Извлекаем чистый текст из HTML для preview
  const cleanText = dream.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const preview = cleanText.substring(0, 80) + (cleanText.length > 80 ? '...' : '')

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (window.confirm(`Удалить сон "${dream.title}"?\n\nЭто действие нельзя отменить.`)) {
      setIsDeleting(true)
      try {
        console.log('🗑️ Удаление сна:', dream.id)
        await dreamService.delete(dream.id)
        console.log('✅ Сон удален')
        
        // Вызываем callback для обновления списка
        if (onDelete) {
          onDelete()
        }
      } catch (error) {
        console.error('❌ Ошибка удаления:', error)
        alert('Ошибка при удалении сна. Попробуйте еще раз.')
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="relative group">
      <Link href={`/journal/${dream.id}`}>
        <div className="card p-5 hover:scale-[1.01] hover:shadow-2xl transition-all cursor-pointer">
          <div className="flex items-start space-x-4 gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-morphe-blue/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative text-4xl p-2 bg-gradient-to-br from-mythic-ivory/10 to-mythic-ivory/20 rounded-2xl backdrop-blur-sm transform transition-transform group-hover:scale-110" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>
                {getEmojiForDream()}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-mythic-ivory font-bold text-base truncate flex-1 tracking-tight">
                  {dream.title}
                </h3>
                {getDreamTypeBadge(dream.dream_type)}
              </div>
              
              <p className="text-mythic-ivory/70 text-sm line-clamp-2 mb-3">
                {preview}
              </p>
              
              <div className="flex items-center space-x-3 gap-3 text-xs text-mythic-ivory/60 mb-3">
                <span className="flex items-center">
                  <Calendar size={12} className="mr-1" />
                  {formatDate(dream.date)}
                </span>
                <span className="flex items-center">
                  {dream.emotion_emoji} {dream.emotion}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2.5 mb-3">
                {dream.tags.map((tag: string) => (
                  <a
                    key={tag}
                    href={`/journal?tag=${encodeURIComponent(tag)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="badge badge-primary hover:scale-105 hover:bg-light-ai-blue/30 transition-all cursor-pointer"
                  >
                    #{tag}
                  </a>
                ))}
                <span className="badge badge-purple">
                  {dream.archetype}
                </span>
              </div>

              <div className="flex items-center space-x-2 gap-2">
                {dream.has_interpretation && (
                  <span className="flex items-center text-xs text-morphe-blue">
                    <Sparkles size={12} className="mr-1" />
                    Есть интерпретация
                  </span>
                )}
                {dream.has_image && (
                  <span className="flex items-center text-xs text-light-ai-blue">
                    <Image size={12} className="mr-1" />
                    Изображение
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Delete Button - появляется при наведении */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute top-3 right-3 p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50 z-10"
        title="Удалить сон"
      >
        {isDeleting ? (
          <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Trash2 size={18} />
        )}
      </button>
    </div>
  )
}

