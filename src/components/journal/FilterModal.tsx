'use client'

import { X, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { dreamService } from '@/lib/supabase'

interface FilterModalProps {
  onClose: () => void
}

export default function FilterModal({ onClose }: FilterModalProps) {
  const [filters, setFilters] = useState({
    emotions: [] as string[],
    types: [] as string[],
    tags: [] as string[],
    hasInterpretation: false,
    hasImage: false
  })
  const [availableTags, setAvailableTags] = useState<Array<{ tag: string; count: number }>>([])
  const [isLoadingTags, setIsLoadingTags] = useState(true)

  const emotions = ['Радость', 'Спокойствие', 'Тревога', 'Страх', 'Грусть', 'Удивление', 'Ностальгия']
  const types = ['Обычный', 'Осознанный', 'Кошмар', 'Вещий']
  
  // Загружаем все теги из снов
  useEffect(() => {
    const loadTags = async () => {
      setIsLoadingTags(true)
      try {
        const allDreams = await dreamService.getAll()
        if (allDreams) {
          // Подсчитываем частоту каждого тега
          const tagCount: Record<string, number> = {}
          allDreams.forEach((dream) => {
            dream.tags.forEach((tag) => {
              const lowerTag = tag.toLowerCase()
              tagCount[lowerTag] = (tagCount[lowerTag] || 0) + 1
            })
          })
          
          // Преобразуем в массив и сортируем по частоте
          const sortedTags = Object.entries(tagCount)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
          
          setAvailableTags(sortedTags)
          console.log('🏷️ Загружено тегов:', sortedTags.length)
          console.log('🏷️ Самые популярные теги:', sortedTags.slice(0, 5))
        }
      } catch (error) {
        console.error('❌ Ошибка загрузки тегов:', error)
      } finally {
        setIsLoadingTags(false)
      }
    }
    
    loadTags()
  }, [])
  
  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-mythic-ivory">Фильтры</h3>
        <button onClick={onClose} className="text-mythic-ivory/60 hover:text-mythic-ivory">
          <X size={20} />
        </button>
      </div>

      {/* Emotions */}
      <div>
        <h4 className="text-sm font-medium text-mythic-ivory mb-2">Эмоции</h4>
        <div className="flex flex-wrap gap-2">
          {emotions.map((emotion) => (
            <button
              key={emotion}
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                filters.emotions.includes(emotion)
                  ? 'bg-morphe-blue text-mythic-ivory'
                  : 'bg-mythic-ivory/10 text-mythic-ivory/60'
              }`}
              onClick={() => {
                setFilters(prev => ({
                  ...prev,
                  emotions: prev.emotions.includes(emotion)
                    ? prev.emotions.filter(e => e !== emotion)
                    : [...prev.emotions, emotion]
                }))
              }}
            >
              {emotion}
            </button>
          ))}
        </div>
      </div>

      {/* Dream Types */}
      <div>
        <h4 className="text-sm font-medium text-mythic-ivory mb-2">Тип сна</h4>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type}
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                filters.types.includes(type)
                  ? 'bg-amethyst-spirit text-mythic-ivory'
                  : 'bg-mythic-ivory/10 text-mythic-ivory/60'
              }`}
              onClick={() => {
                setFilters(prev => ({
                  ...prev,
                  types: prev.types.includes(type)
                    ? prev.types.filter(t => t !== type)
                    : [...prev.types, type]
                }))
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h4 className="text-sm font-medium text-mythic-ivory mb-2">Теги</h4>
        {isLoadingTags ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-morphe-blue" />
          </div>
        ) : availableTags.length === 0 ? (
          <p className="text-mythic-ivory/50 text-xs text-center py-4">
            Пока нет тегов в снах
          </p>
        ) : (
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {availableTags.map(({ tag, count }) => (
              <button
                key={tag}
                className={`px-3 py-1.5 rounded-full text-xs transition-all flex items-center space-x-1.5 ${
                  filters.tags.includes(tag)
                    ? 'bg-light-ai-blue text-mythic-ivory shadow-lg'
                    : 'bg-mythic-ivory/10 text-mythic-ivory/60 hover:bg-mythic-ivory/15'
                }`}
                onClick={() => toggleTag(tag)}
              >
                <span>#{tag}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  filters.tags.includes(tag)
                    ? 'bg-white/20'
                    : 'bg-mythic-ivory/20'
                }`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Additional Filters */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.hasInterpretation}
            onChange={(e) => setFilters(prev => ({ ...prev, hasInterpretation: e.target.checked }))}
            className="w-4 h-4 rounded border-morphe-blue/50 bg-mythic-ivory/10 text-morphe-blue focus:ring-morphe-blue"
          />
          <span className="text-sm text-mythic-ivory">С интерпретацией</span>
        </label>
        
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.hasImage}
            onChange={(e) => setFilters(prev => ({ ...prev, hasImage: e.target.checked }))}
            className="w-4 h-4 rounded border-morphe-blue/50 bg-mythic-ivory/10 text-morphe-blue focus:ring-morphe-blue"
          />
          <span className="text-sm text-mythic-ivory">С изображением</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex space-x-2 pt-2">
        <button
          onClick={() => {
            setFilters({
              emotions: [],
              types: [],
              tags: [],
              hasInterpretation: false,
              hasImage: false
            })
          }}
          className="flex-1 px-4 py-2 border border-morphe-blue/50 text-morphe-blue rounded-lg hover:bg-morphe-blue/10 transition-all"
        >
          Сбросить
        </button>
        <button
          onClick={onClose}
          className="flex-1 btn-primary"
        >
          Применить
        </button>
      </div>
    </div>
  )
}

