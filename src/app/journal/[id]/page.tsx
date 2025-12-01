'use client'

import { Calendar, Heart, Tag, Sparkles, Image as ImageIcon, MessageCircle, Trash2, Edit } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { dreamService, type Dream } from '@/lib/supabase'

interface PageProps {
  params: { id: string }
}

export default function DreamDetailPage({ params }: PageProps) {
  const { id } = params
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [dream, setDream] = useState<Dream | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  
  // Загрузка сна из Supabase
  useEffect(() => {
    loadDream()
  }, [id])

  async function loadDream() {
    try {
      setIsLoading(true)
      console.log('🔍 Загрузка сна с ID:', id)
      
      const data = await dreamService.getById(id)
      
      if (data) {
        console.log('✅ Сон загружен:', data.title)
        setDream(data)
      } else {
        console.warn('⚠️ Сон с ID', id, 'не найден в базе')
        setDream(null)
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки сна:', error)
      setDream(null)
    } finally {
      setIsLoading(false)
    }
  }

  async function generateImage() {
    if (!dream) return

    setIsGeneratingImage(true)
    try {
      console.log('🎨 Генерация изображения для сна:', dream.title)

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      const edgeFunctionUrl = `${supabaseUrl}/functions/v1/generate-dream-image`
      
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          title: dream.title,
          content: dream.content
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('❌ Ошибка генерации:', data)
        throw new Error(data.details || data.error || 'Ошибка генерации изображения')
      }

      console.log('✅ Изображение сгенерировано:', data.imageUrl)

      // Обновляем сон в базе данных
      const updatedDream = {
        ...dream,
        has_image: true,
        image_url: data.imageUrl
      }

      await dreamService.update(id, updatedDream)
      
      // Обновляем локальное состояние
      setDream(updatedDream)
      
      alert('✅ Изображение успешно сгенерировано!')
    } catch (error: any) {
      console.error('❌ Ошибка генерации изображения:', error)
      alert(`Не удалось сгенерировать изображение: ${error.message}`)
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6 pb-6 animate-fade-in">
        <Header showBackButton backTo="/journal" />
        
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-mythic-ivory/10 rounded w-3/4" />
          <div className="h-4 bg-mythic-ivory/10 rounded w-1/2" />
          <div className="card p-6">
            <div className="space-y-3">
              <div className="h-4 bg-mythic-ivory/10 rounded w-full" />
              <div className="h-4 bg-mythic-ivory/10 rounded w-full" />
              <div className="h-4 bg-mythic-ivory/10 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!dream) {
    return (
      <div className="space-y-6 pb-6 animate-fade-in">
        <Header showBackButton backTo="/journal" />
        
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😴</div>
          <h2 className="text-xl font-bold text-mythic-ivory mb-2">Сон не найден</h2>
          <p className="text-mythic-ivory/60 mb-4">Этот сон был удален или не существует</p>
          <Link href="/journal">
            <button className="btn-primary">Вернуться к списку</button>
          </Link>
        </div>
      </div>
    )
  }

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      <Header 
        showBackButton 
        backTo="/journal"
        rightElement={
          <span className="text-mythic-ivory/60 text-sm">
            {dream.dream_type === 'lucid' && '✨ Осознанный'}
            {dream.dream_type === 'nightmare' && '😱 Кошмар'}
            {dream.dream_type === 'epic' && '🌟 Эпический'}
          </span>
        }
      />

      {/* Dream Header */}
      <div>
        <h1 className="text-2xl font-bold text-mythic-ivory mb-2">{dream.title}</h1>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-3 text-sm text-mythic-ivory/60">
            <span className="flex items-center">
              <Calendar size={14} className="mr-1" />
              Создан: {new Date(dream.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center">
              <span className="text-3xl">{dream.emotion_emoji}</span> <span className="ml-1">{dream.emotion}</span>
            </span>
          </div>
          {dream.updated_at && new Date(dream.updated_at).getTime() > new Date(dream.created_at).getTime() + 1000 && (
            <div className="text-xs text-mythic-ivory/50">
              Отредактирован: {new Date(dream.updated_at).toLocaleDateString('ru-RU', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tags and Archetype */}
      <div className="flex flex-wrap gap-2">
        {(dream.tags || []).map((tag: string) => (
          <Link
            key={tag}
            href={`/journal?tag=${encodeURIComponent(tag)}`}
            className="px-3 py-1 bg-morphe-blue/20 text-light-ai-blue text-sm rounded-full hover:bg-morphe-blue/30 hover:scale-105 transition-all cursor-pointer"
          >
            #{tag}
          </Link>
        ))}
        <span className="px-3 py-1 bg-amethyst-spirit/20 text-amethyst-spirit text-sm rounded-full">
          {dream.archetype}
        </span>
      </div>

      {/* Dream Content */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-mythic-ivory mb-3">Описание сна</h2>
        <div 
          className="text-mythic-ivory/80 leading-relaxed prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: dream.content }}
          style={{
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
          }}
        />
      </div>
      
      <style jsx global>{`
        .prose :global(ul),
        .prose :global(ol) {
          padding-left: 2rem !important;
          margin: 0.75rem 0 !important;
          list-style-position: outside !important;
        }
        
        .prose :global(ul) {
          list-style-type: disc !important;
        }
        
        .prose :global(ol) {
          list-style-type: decimal !important;
        }
        
        .prose :global(li) {
          margin: 0.25rem 0 !important;
          display: list-item !important;
          color: rgba(226, 232, 240, 0.8);
        }
        
        .prose :global(strong),
        .prose :global(b) {
          font-weight: 700;
          color: rgba(226, 232, 240, 0.95);
        }
        
        .prose :global(em),
        .prose :global(i) {
          font-style: italic;
        }
        
        .prose :global(u) {
          text-decoration: underline;
        }
        
        .prose :global(p) {
          margin: 0.5rem 0;
        }
        
        .prose :global(div) {
          margin: 0;
        }
      `}</style>

      {/* AI Interpretation */}
      {dream.has_interpretation && dream.interpretation && (
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-mythic-ivory flex items-center">
            <Sparkles size={20} className="mr-2 text-morphe-blue" />
            Интерпретация ИИ
          </h2>
          
          <div className="p-4 bg-morphe-blue/10 rounded-lg">
            <p className="text-mythic-ivory/80 leading-relaxed">
              {dream.interpretation.summary}
            </p>
          </div>

          {/* Symbols */}
          {dream.interpretation.symbols && dream.interpretation.symbols.length > 0 && (
            <div>
              <h3 className="text-md font-semibold text-mythic-ivory mb-2">Символы в вашем сне</h3>
              <div className="space-y-3">
                {dream.interpretation.symbols.map((symbol: { name: string; meaning: string }) => (
                  <div key={symbol.name} className="p-3 bg-mythic-ivory/5 rounded-lg">
                    <h4 className="text-light-ai-blue font-medium text-sm mb-1">{symbol.name}</h4>
                    <p className="text-mythic-ivory/70 text-sm">{symbol.meaning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {dream.interpretation.recommendations && dream.interpretation.recommendations.length > 0 && (
            <div>
              <h3 className="text-md font-semibold text-mythic-ivory mb-2">Рекомендации</h3>
              <ul className="space-y-2">
                {dream.interpretation.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2 text-mythic-ivory/70 text-sm">
                    <span className="text-morphe-blue mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Generated Image */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-mythic-ivory flex items-center">
            <ImageIcon size={20} className="mr-2 text-amethyst-spirit" />
            Визуализация сна
          </h2>
          {!dream.has_image && !isGeneratingImage && (
            <button
              onClick={generateImage}
              className="px-4 py-2 bg-amethyst-spirit/20 text-amethyst-spirit rounded-lg hover:bg-amethyst-spirit/30 transition-all text-sm font-medium flex items-center space-x-2"
            >
              <Sparkles size={16} />
              <span>Сгенерировать</span>
            </button>
          )}
        </div>
        
        {isGeneratingImage ? (
          <div className="aspect-video bg-gradient-to-br from-morphe-blue/20 to-amethyst-spirit/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin text-6xl mb-4">🎨</div>
              <p className="text-mythic-ivory/80 text-sm font-medium mb-2">AI создаёт изображение вашего сна...</p>
              <p className="text-mythic-ivory/60 text-xs">Это может занять 10-30 секунд</p>
            </div>
          </div>
        ) : dream.has_image && dream.image_url ? (
          (() => {
            // Валидация URL изображения
            const imageUrl = dream.image_url.trim()
            const isValidUrl = imageUrl.startsWith('http://') || imageUrl.startsWith('https://')
            const isImageUrl = imageUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || imageUrl.includes('oaidalleapiprodscus') || imageUrl.includes('dalle')
            
            if (!isValidUrl || !isImageUrl) {
              console.error('❌ Неверный URL изображения:', imageUrl)
              return (
                <div className="aspect-video bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-lg flex items-center justify-center border-2 border-dashed border-red-500/30">
                  <div className="text-center p-6">
                    <div className="text-6xl mb-4">⚠️</div>
                    <p className="text-mythic-ivory/80 text-sm mb-2 font-medium">Неверный URL изображения</p>
                    <p className="text-mythic-ivory/60 text-xs mb-4">URL не указывает на изображение</p>
                    <button
                      onClick={() => {
                        // Удаляем неправильный URL
                        dreamService.update(id, { has_image: false, image_url: undefined }).then(() => {
                          loadDream()
                        })
                      }}
                      className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-sm"
                    >
                      Сбросить и сгенерировать заново
                    </button>
                  </div>
                </div>
              )
            }

            return (
              <div className="relative rounded-lg overflow-hidden bg-night-deep-blue/50">
                <div className="relative w-full" style={{ minHeight: '400px', maxHeight: '600px' }}>
                  <img 
                    src={imageUrl} 
                    alt={`Визуализация сна: ${dream.title}`}
                    className="w-full h-full object-contain rounded-lg"
                    style={{ display: 'block' }}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={async (e) => {
                      console.error('❌ Ошибка загрузки изображения')
                      console.error('URL:', imageUrl)
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        // Пробуем загрузить изображение через прокси
                        try {
                          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
                          const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                          
                          if (supabaseUrl && supabaseKey) {
                            // Пробуем загрузить через Edge Function прокси
                            const proxyResponse = await fetch(`${supabaseUrl}/functions/v1/generate-dream-image`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${supabaseKey}`,
                              },
                              body: JSON.stringify({
                                action: 'proxy-image',
                                imageUrl: imageUrl
                              })
                            })
                            
                            if (proxyResponse.ok) {
                              const blob = await proxyResponse.blob()
                              const blobUrl = URL.createObjectURL(blob)
                              target.src = blobUrl
                              target.style.display = 'block'
                              return
                            }
                          }
                        } catch (proxyError) {
                          console.error('❌ Ошибка прокси:', proxyError)
                        }
                        
                        // Если прокси не сработал, показываем ошибку
                        parent.innerHTML = `
                          <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 2rem; background: rgba(10, 17, 32, 0.5); border-radius: 0.5rem;">
                            <div style="text-align: center;">
                              <div style="font-size: 3rem; margin-bottom: 1rem;">🖼️</div>
                              <p style="color: rgba(242, 237, 227, 0.6); font-size: 0.875rem; margin-bottom: 0.5rem;">Не удалось загрузить изображение</p>
                              <p style="color: rgba(242, 237, 227, 0.4); font-size: 0.75rem; margin-bottom: 1rem;">URL изображения мог истечь. Попробуйте сгенерировать изображение заново.</p>
                              <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: rgba(30, 144, 255, 0.2); color: rgba(242, 237, 227, 0.8); border: none; border-radius: 0.5rem; cursor: pointer; margin-right: 0.5rem;">Обновить</button>
                              <button onclick="if (window.generateImage) window.generateImage()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: rgba(139, 92, 246, 0.2); color: rgba(242, 237, 227, 0.8); border: none; border-radius: 0.5rem; cursor: pointer;">Сгенерировать заново</button>
                            </div>
                          </div>
                        `
                      }
                    }}
                    onLoad={() => {
                      console.log('✅ Изображение успешно загружено')
                      console.log('URL:', imageUrl)
                    }}
                  />
                </div>
                <div className="mt-2 p-3 bg-night-deep-blue/30 rounded-lg">
                  <p className="text-mythic-ivory/60 text-xs">Сгенерировано с помощью DALL-E 3</p>
                </div>
              </div>
            )
          })()
        ) : (
          <div className="aspect-video bg-gradient-to-br from-morphe-blue/20 to-amethyst-spirit/20 rounded-lg flex items-center justify-center border-2 border-dashed border-mythic-ivory/10">
            <div className="text-center p-6">
              <div className="text-6xl mb-4">🌌</div>
              <p className="text-mythic-ivory/60 text-sm mb-3">Изображение ещё не создано</p>
              <p className="text-mythic-ivory/40 text-xs">Нажмите "Сгенерировать" чтобы создать визуализацию</p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Link href={`/chat?dream=${dream.id}`}>
          <button className="w-full btn-primary flex items-center justify-center space-x-2">
            <MessageCircle size={18} />
            <span>Обсудить сон с MorpheAI</span>
          </button>
        </Link>
        
        <div className="grid grid-cols-2 gap-3">
          <Link href={`/journal/${dream.id}/edit`}>
            <button className="w-full px-4 py-3 border border-morphe-blue/50 text-morphe-blue rounded-lg hover:bg-morphe-blue/10 transition-all flex items-center justify-center space-x-2">
              <Edit size={18} />
              <span>Редактировать</span>
            </button>
          </Link>
          
          <button 
            onClick={async () => {
              if (confirm('Вы уверены, что хотите удалить этот сон?')) {
                setIsDeleting(true)
                try {
                  console.log('Начинаем удаление сна с ID:', id)
                  
                  // Удаление из Supabase
                  await dreamService.delete(id)
                  
                  console.log('Сон успешно удален, переходим к списку')
                  
                  // Небольшая задержка для UX
                  await new Promise(resolve => setTimeout(resolve, 300))
                  
                  // Переход на список снов
                  router.push('/journal')
                } catch (error: any) {
                  console.error('❌ Ошибка удаления сна:', error)
                  
                  let errorMessage = 'Произошла ошибка при удалении сна.'
                  
                  if (error.message) {
                    errorMessage += '\n\n' + error.message
                  }
                  
                  if (error.message?.includes('does not exist') || error.message?.includes('relation')) {
                    errorMessage += '\n\n💡 Таблица "dreams" не существует в Supabase!\nВыполните SQL из файла CREATE_TABLES.sql'
                  }
                  
                  // Открываем консоль браузера для деталей
                  console.error('Откройте консоль браузера (F12) для подробностей')
                  
                  alert(errorMessage)
                  setIsDeleting(false)
                }
              }
            }}
            disabled={isDeleting}
            className="w-full px-4 py-3 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Trash2 size={18} />
            <span>{isDeleting ? 'Удаление...' : 'Удалить'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

