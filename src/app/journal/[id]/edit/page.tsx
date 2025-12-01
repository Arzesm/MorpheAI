'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, X } from 'lucide-react'
import Header from '@/components/Header'
import RichTextEditor from '@/components/journal/RichTextEditor'
import { dreamService } from '@/lib/supabase'

interface PageProps {
  params: { id: string }
}

export default function EditDreamPage({ params }: PageProps) {
  const { id } = params
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [originalDream, setOriginalDream] = useState<any>(null)
  const [dream, setDream] = useState({
    title: '',
    content: '',
    emotion: '',
    dreamType: 'normal',
    tags: [] as string[],
    tagInput: ''
  })

  const emotions = [
    { name: 'Радость', emoji: '😄' },
    { name: 'Спокойствие', emoji: '😊' },
    { name: 'Тревога', emoji: '😟' },
    { name: 'Страх', emoji: '😨' },
    { name: 'Грусть', emoji: '😢' },
    { name: 'Удивление', emoji: '😲' },
    { name: 'Ностальгия', emoji: '🥺' }
  ]
  
  const dreamTypes = [
    { name: 'normal', label: 'Обычный', emoji: '💭', color: 'bg-morphe-blue' },
    { name: 'lucid', label: 'Осознанный', emoji: '✨', color: 'bg-amethyst-spirit' },
    { name: 'nightmare', label: 'Кошмар', emoji: '😱', color: 'bg-red-500' },
    { name: 'epic', label: 'Эпический', emoji: '⭐', color: 'bg-yellow-500' }
  ]

  useEffect(() => {
    loadDream()
  }, [id])

  async function loadDream() {
    try {
      setIsLoading(true)
      const data = await dreamService.getById(id)
      
      if (data) {
        setOriginalDream(data)
        setDream({
          title: data.title,
          content: data.content,
          emotion: data.emotion,
          dreamType: data.dream_type,
          tags: data.tags || [],
          tagInput: ''
        })
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки сна:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTag = () => {
    if (dream.tagInput.trim() && !dream.tags.includes(dream.tagInput.trim())) {
      setDream(prev => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: ''
      }))
    }
  }

  const handleRemoveTag = (tag: string) => {
    setDream(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleSave = async () => {
    if (!dream.title.trim() || !dream.content.trim()) {
      alert('Пожалуйста, заполните название и описание сна')
      return
    }

    try {
      setIsSaving(true)
      
      const emotionEntry = emotions.find(e => e.name === dream.emotion)
      
      const updatedDream = {
        ...originalDream,
        title: dream.title.trim(),
        content: dream.content.trim(),
        emotion: dream.emotion || originalDream.emotion,
        emotion_emoji: emotionEntry?.emoji || originalDream.emotion_emoji,
        tags: dream.tags,
        dream_type: dream.dreamType as 'normal' | 'lucid' | 'nightmare' | 'epic',
        updated_at: new Date().toISOString()
      }

      await dreamService.update(id, updatedDream)
      console.log('✅ Сон обновлен')
      
      router.push(`/journal/${id}`)
    } catch (error: any) {
      console.error('❌ Ошибка сохранения:', error)
      alert('Произошла ошибка при сохранении изменений')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-morphe-blue" />
      </div>
    )
  }

  if (!originalDream) {
    return (
      <div className="space-y-6 pb-6">
        <Header showBackButton backTo={`/journal/${id}`} />
        <div className="text-center py-12">
          <p className="text-mythic-ivory/70">Сон не найден</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-6 animate-fade-in">
      <Header
        showBackButton
        backTo={`/journal/${id}`}
        rightElement={
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="text-morphe-blue font-semibold hover:text-light-ai-blue transition-colors disabled:opacity-50 flex items-center space-x-1"
          >
            {isSaving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Save size={18} />
                <span>Сохранить</span>
              </>
            )}
          </button>
        }
      />

      <div>
        <h1 className="text-2xl font-bold text-mythic-ivory mb-1">Редактирование сна</h1>
        <p className="text-mythic-ivory/50 text-sm">Изменить информацию о сне</p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-mythic-ivory mb-2">
            Название сна
          </label>
          <input
            type="text"
            value={dream.title}
            onChange={(e) => setDream(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Дайте сну название..."
            className="input-field"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-mythic-ivory mb-2">
            Описание сна
          </label>
          <RichTextEditor
            value={dream.content}
            onChange={(value) => setDream(prev => ({ ...prev, content: value }))}
            placeholder="Что вы видели во сне..."
          />
        </div>

        {/* Dream Type */}
        <div>
          <label className="block text-sm font-medium text-mythic-ivory mb-2">
            Тип сна
          </label>
          <div className="flex flex-wrap gap-2">
            {dreamTypes.map((type) => (
              <button
                key={type.name}
                onClick={() => setDream(prev => ({ ...prev, dreamType: type.name }))}
                className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center space-x-2 ${
                  dream.dreamType === type.name
                    ? `${type.color} text-mythic-ivory shadow-lg`
                    : 'bg-mythic-ivory/10 text-mythic-ivory/60'
                }`}
              >
                <span className="text-3xl">{type.emoji}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Emotions */}
        <div>
          <label className="block text-sm font-medium text-mythic-ivory mb-2">
            Эмоции
          </label>
          <div className="flex flex-wrap gap-2">
            {emotions.map((emotion) => (
              <button
                key={emotion.name}
                onClick={() => setDream(prev => ({ ...prev, emotion: emotion.name }))}
                className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center space-x-2 ${
                  dream.emotion === emotion.name
                    ? 'bg-morphe-blue text-mythic-ivory'
                    : 'bg-mythic-ivory/10 text-mythic-ivory/60'
                }`}
              >
                <span className="text-3xl">{emotion.emoji}</span>
                <span>{emotion.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-mythic-ivory mb-2">
            Теги
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={dream.tagInput}
              onChange={(e) => setDream(prev => ({ ...prev, tagInput: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Добавить тег..."
              className="input-field flex-1"
            />
            <button
              onClick={handleAddTag}
              className="btn-primary px-4"
            >
              Добавить
            </button>
          </div>
          
          {dream.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {dream.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-morphe-blue/20 text-light-ai-blue text-sm rounded-full flex items-center space-x-2"
                >
                  <span>#{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-mythic-ivory transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Info about interpretation */}
        <div className="card p-4 bg-mythic-ivory/5">
          <p className="text-mythic-ivory/70 text-sm">
            ℹ️ AI интерпретация сна не может быть изменена при редактировании
          </p>
        </div>
      </div>
    </div>
  )
}

