'use client'

import { useState } from 'react'
import { Mic, Sparkles, Image as ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import RichTextEditor from '@/components/journal/RichTextEditor'
import { dreamService } from '@/lib/supabase'

export default function NewDreamPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [enableAI, setEnableAI] = useState(true) // Включено по умолчанию - работает через Supabase!
  const [dream, setDream] = useState({
    title: '',
    content: '',
    emotion: '',
    dreamType: 'normal',
    tags: [] as string[],
    tagInput: '',
    date: new Date().toISOString().split('T')[0] // Текущая дата по умолчанию
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

  const getAIInterpretation = async () => {
    try {
      console.log('🤖 Запрос AI интерпретации через Supabase Edge Function...')

      // Извлекаем чистый текст из HTML для AI
      const cleanText = dream.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

      // Используем Supabase Edge Function вместо локального API
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      const edgeFunctionUrl = `${supabaseUrl}/functions/v1/interpret-dream`
      
      console.log('📡 Отправка в Edge Function:', edgeFunctionUrl)

      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          title: dream.title.trim(),
          content: cleanText
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('❌ API вернул ошибку:', data)
        throw new Error(data.details || data.error || 'Ошибка интерпретации')
      }

      console.log('✅ Интерпретация получена от API')
      console.log('Данные:', data.interpretation)
      
      // Создаем чистую копию интерпретации
      const cleanInterpretation: {
        summary: string
        symbols: Array<{ name: string; meaning: string }>
        recommendations: string[]
      } = {
        summary: data.interpretation?.summary || '',
        symbols: Array.isArray(data.interpretation?.symbols) 
          ? data.interpretation.symbols.map((s: any) => ({
              name: s.name || '',
              meaning: s.meaning || ''
            }))
          : [],
        recommendations: Array.isArray(data.interpretation?.recommendations)
          ? data.interpretation.recommendations.map((r: any) => String(r))
          : []
      }
      
      // Извлекаем теги из AI ответа
      const aiTags = Array.isArray(data.interpretation?.tags)
        ? data.interpretation.tags.map((t: any) => String(t)).filter(Boolean).slice(0, 5)
        : []
      
      console.log('✅ Интерпретация обработана:', cleanInterpretation)
      console.log('🏷️ AI теги:', aiTags)
      
      return { interpretation: cleanInterpretation, tags: aiTags }

    } catch (error: any) {
      console.error('⚠️ Ошибка AI интерпретации:', error.message)
      console.warn('⚠️ Сон будет сохранен без интерпретации')
      
      // Показываем уведомление пользователю
      if (error.message.includes('API key') || error.message.includes('billing') || error.message.includes('quota')) {
        console.error('💡 Проверьте настройки OpenAI API')
      }
      
      return null
    }
  }

  const handleSave = async () => {
    if (!dream.title.trim() || !dream.content.trim()) {
      alert('Пожалуйста, заполните название и описание сна')
      return
    }

    try {
      setIsSaving(true)
      
      console.log('💾 Начинаем сохранение сна:', dream.title)
      
      // Получаем AI интерпретацию только если включено
      let interpretation = null
      let aiTags: string[] = []
      
      if (enableAI) {
        console.log('🤖 Получение AI интерпретации и тегов...')
        const aiResult = await getAIInterpretation()
        
        if (aiResult) {
          interpretation = aiResult.interpretation
          aiTags = aiResult.tags || []
          console.log('✅ Интерпретация получена успешно')
          console.log('🏷️ AI сгенерировал теги:', aiTags)
        } else {
          console.log('⚠️ Сон будет сохранен без интерпретации')
        }
      } else {
        console.log('ℹ️ AI интерпретация отключена пользователем')
      }
      
      // Объединяем ручные теги и AI теги (AI теги имеют приоритет)
      const finalTags = enableAI && aiTags.length > 0 
        ? [...new Set([...aiTags, ...dream.tags])] // AI теги + ручные (без дубликатов)
        : dream.tags // Только ручные, если AI выключен
      
      console.log('🏷️ Финальные теги:', finalTags)
      
      // Создаем объект сна для Supabase
      const newDream = {
        title: dream.title.trim(),
        content: dream.content.trim(),
        date: dream.date, // Используем выбранную дату
        emotion: dream.emotion || 'Нейтральная',
        emotion_emoji: dream.emotion ? emotions.find(e => e.name === dream.emotion)?.emoji || '😐' : '😐',
        tags: finalTags.slice(0, 10), // Максимум 10 тегов
        archetype: 'Не определен',
        dream_type: dream.dreamType as 'normal' | 'lucid' | 'nightmare' | 'epic',
        has_interpretation: !!interpretation,
        interpretation: interpretation || undefined,
        has_image: false,
        image_url: undefined
      }

      console.log('📤 Сохранение в Supabase...')

      // Сохраняем в Supabase
      const result = await dreamService.create(newDream)
      
      console.log('✅ Сон успешно сохранен с ID:', result?.id)
      
      // Переходим к просмотру сохранённого сна
      if (result?.id) {
        router.push(`/journal/${result.id}`)
      } else {
        // Fallback на список, если ID не получен
        router.push('/journal')
      }
    } catch (error: any) {
      console.error('❌ Ошибка сохранения сна:', error)
      
      let errorMessage = 'Произошла ошибка при сохранении сна.'
      
      if (error.message) {
        errorMessage += '\n\n' + error.message
      }
      
      if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        errorMessage += '\n\nТаблица "dreams" не существует в Supabase! Выполните SQL из CREATE_TABLES.sql'
      }
      
      if (error.message?.includes('circular')) {
        errorMessage += '\n\nПроблема с форматом данных.'
      }
      
      console.error('Откройте консоль браузера (F12) для деталей')
      
      alert(errorMessage)
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4 pb-6 animate-fade-in">
      <Header 
        showBackButton 
        backTo="/journal"
        title="Новый сон"
        rightElement={
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="text-morphe-blue font-semibold hover:text-light-ai-blue transition-colors disabled:opacity-50"
        >
          {isSaving 
            ? (enableAI ? 'Анализ и сохранение...' : 'Сохранение...') 
            : 'Сохранить'
          }
        </button>
        }
      />

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

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-mythic-ivory mb-2">
            Дата сна
          </label>
          <input
            type="date"
            value={dream.date}
            onChange={(e) => setDream(prev => ({ ...prev, date: e.target.value }))}
            max={new Date().toISOString().split('T')[0]} // Нельзя выбрать будущую дату
            className="input-field"
          />
          <p className="text-xs text-mythic-ivory/50 mt-1">
            Выберите дату, когда вам приснился этот сон
          </p>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-mythic-ivory mb-2">
            Опишите ваш сон
          </label>
          <RichTextEditor
            value={dream.content}
            onChange={(value) => setDream(prev => ({ ...prev, content: value }))}
            placeholder="Что вы видели во сне? Используйте панель инструментов для форматирования текста..."
          />

          {/* Voice Recording Button */}
          <button type="button" className="mt-2 flex items-center space-x-2 text-morphe-blue hover:text-light-ai-blue transition-colors">
            <Mic size={18} />
            <span className="text-sm">Записать голосом</span>
          </button>
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
                <span>{type.emoji}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Emotions */}
        <div>
          <label className="block text-sm font-medium text-mythic-ivory mb-2">
            Какие эмоции вы испытывали?
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
                <span>{emotion.emoji}</span>
                <span>{emotion.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tags - Optional manual tags */}
        <div>
          <label className="block text-sm font-medium text-mythic-ivory mb-1">
            Дополнительные теги (опционально)
          </label>
          <p className="text-xs text-mythic-ivory/60 mb-2">
            {enableAI 
              ? '✨ AI автоматически сгенерирует ключевые теги при сохранении' 
              : 'Добавьте теги вручную'}
          </p>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={dream.tagInput}
              onChange={(e) => setDream(prev => ({ ...prev, tagInput: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Дополнительный тег..."
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

        {/* AI Toggle and Info */}
        <div className="space-y-3">
          {/* Toggle Switch */}
          <div className="card p-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-3">
                <Sparkles className="text-morphe-blue" size={20} />
                <div>
                  <h3 className="text-sm font-semibold text-mythic-ivory">
                    AI интерпретация GPT-4
                  </h3>
                  <p className="text-xs text-mythic-ivory/60">
                    {enableAI ? '✅ Включено (через Supabase)' : 'Отключено'}
                  </p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={enableAI}
                  onChange={(e) => setEnableAI(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-mythic-ivory/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-morphe-blue"></div>
              </div>
            </label>
          </div>

          {/* Info when AI is enabled */}
          {enableAI && (
            <div className="card p-4 bg-gradient-to-br from-morphe-blue/10 to-amethyst-spirit/10">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">✨</div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-mythic-ivory mb-1">
                    Анализ через Supabase Edge Function
                  </h3>
                  <p className="text-xs text-mythic-ivory/70 leading-relaxed mb-2">
                    Запросы к GPT-4 идут через серверы Supabase, что работает в любом регионе. Анализ займет 10-30 секунд.
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-green-400">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span>Работает без VPN</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {isSaving && enableAI && (
          <div className="card p-4 bg-morphe-blue/10 animate-pulse">
            <div className="flex items-center justify-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-morphe-blue animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-morphe-blue animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-morphe-blue animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-mythic-ivory text-sm">
                ✨ MorpheAI анализирует ваш сон...
              </p>
            </div>
          </div>
        )}
        
        {isSaving && !enableAI && (
          <div className="card p-4 bg-mythic-ivory/5">
            <p className="text-mythic-ivory/70 text-sm text-center">
              💾 Сохранение сна...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

