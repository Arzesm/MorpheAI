'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { Plus, Search, Filter, X, Download, Upload } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import DreamCard from '@/components/journal/DreamCard'
import FilterModal from '@/components/journal/FilterModal'
import { dreamService, Dream } from '@/lib/supabase'
import { invalidateDreamsCache } from '@/hooks/useDreams'
import { exportDreamsToJSON, exportDreamsToText, exportDreamsToCSV, downloadFile } from '@/lib/dreamExport'
import { importDreams, convertImportedDreams } from '@/lib/dreamImport'

function JournalContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tagFromUrl = searchParams.get('tag')
  const typeFromUrl = searchParams.get('type')
  const anxiousFromUrl = searchParams.get('anxious')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [dreams, setDreams] = useState<Dream[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [activeType, setActiveType] = useState<string | null>(null)
  const [showAnxious, setShowAnxious] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Загрузка снов из Supabase при монтировании
  useEffect(() => {
    loadDreams()
  }, [])
  
  // Устанавливаем фильтры из URL
  useEffect(() => {
    if (tagFromUrl) {
      setActiveTag(tagFromUrl)
      console.log('🏷️ Фильтр по тегу:', tagFromUrl)
    }
    if (typeFromUrl) {
      setActiveType(typeFromUrl)
      console.log('🎯 Фильтр по типу:', typeFromUrl)
    }
    if (anxiousFromUrl === 'true') {
      setShowAnxious(true)
      console.log('😰 Фильтр: тревожные сны')
    }
  }, [tagFromUrl, typeFromUrl, anxiousFromUrl])

  async function loadDreams() {
    try {
      setIsLoading(true)
      console.log('🔄 Загрузка снов из Supabase...')
      
      const data = await dreamService.getAll()
      
      console.log('📚 Загружено снов из Supabase:', data?.length || 0)
      console.log('📚 Данные:', data)
      
      if (data && data.length > 0) {
        // Сортируем сны: новые сверху (по created_at в порядке убывания)
        const sortedDreams = [...data].sort((a, b) => {
          const dateA = new Date(a.created_at || a.date || 0).getTime()
          const dateB = new Date(b.created_at || b.date || 0).getTime()
          return dateB - dateA // Убывание: новые первыми
        })
        
        setDreams(sortedDreams)
        console.log('✅ Сны отсортированы: новые сверху', sortedDreams.length)
      } else {
        console.log('⚠️ Сны не найдены в базе данных')
        setDreams([])
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки снов из Supabase:', error)
      console.error('Детали ошибки:', error)
      
      // Показываем ошибку пользователю
      if (error instanceof Error) {
        if (error.message.includes('does not exist')) {
          alert('⚠️ Таблица снов не создана в Supabase!\n\nВыполните SQL из файла CREATE_TABLES.sql:\n1. Откройте Supabase Dashboard\n2. SQL Editor → New query\n3. Вставьте код из CREATE_TABLES.sql\n4. Нажмите Run')
        } else {
          alert(`⚠️ Ошибка загрузки снов: ${error.message}\n\nПроверьте консоль браузера (F12) для деталей.`)
        }
      }
      
      setDreams([])
    } finally {
      setIsLoading(false)
    }
  }
  
  const clearAllFilters = () => {
    setActiveTag(null)
    setActiveType(null)
    setShowAnxious(false)
    router.push('/journal')
  }

  const handleExport = async (format: 'json' | 'text' | 'csv') => {
    if (dreams.length === 0) {
      alert('Нет снов для экспорта')
      return
    }

    setIsExporting(true)
    try {
      let content = ''
      let filename = ''
      let mimeType = ''

      switch (format) {
        case 'json':
          content = exportDreamsToJSON(dreams)
          filename = `dreams-export-${new Date().toISOString().split('T')[0]}.json`
          mimeType = 'application/json'
          break
        case 'text':
          content = exportDreamsToText(dreams)
          filename = `dreams-export-${new Date().toISOString().split('T')[0]}.txt`
          mimeType = 'text/plain'
          break
        case 'csv':
          content = exportDreamsToCSV(dreams)
          filename = `dreams-export-${new Date().toISOString().split('T')[0]}.csv`
          mimeType = 'text/csv'
          break
      }

      downloadFile(content, filename, mimeType)
    } catch (error) {
      console.error('Ошибка экспорта:', error)
      alert('Ошибка при экспорте снов')
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const text = await file.text()
      const importedDreams = importDreams(text, file.name)
      
      if (importedDreams.length === 0) {
        alert('Не удалось распознать сны в файле. Проверьте формат файла.')
        setIsImporting(false)
        return
      }

      const confirmMessage = `Найдено снов: ${importedDreams.length}\n\nПродолжить импорт?`
      if (!confirm(confirmMessage)) {
        setIsImporting(false)
        return
      }

      const dreamsToSave = convertImportedDreams(importedDreams)
      
      // Сохраняем сны по одному
      let successCount = 0
      let errorCount = 0

      for (const dream of dreamsToSave) {
        try {
          await dreamService.create(dream)
          successCount++
        } catch (error) {
          console.error('Ошибка сохранения сна:', error)
          errorCount++
        }
      }

      // Очищаем кэш и перезагружаем
      invalidateDreamsCache()
      await loadDreams()

      alert(`Импорт завершен!\nУспешно: ${successCount}\nОшибок: ${errorCount}`)
    } catch (error) {
      console.error('Ошибка импорта:', error)
      alert(`Ошибка при импорте: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
    } finally {
      setIsImporting(false)
      // Сбрасываем input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }
  
  // Фильтрация снов
  const filteredDreams = dreams.filter((dream) => {
    // Фильтр по поисковому запросу
    const matchesSearch = 
      dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    // Фильтр по активному тегу
    const matchesTag = !activeTag || dream.tags.some((tag: string) => 
      tag.toLowerCase() === activeTag.toLowerCase()
    )
    
    // Фильтр по типу сна
    const matchesType = !activeType || dream.dream_type === activeType
    
    // Фильтр по тревожным снам
    const matchesAnxious = !showAnxious || 
      dream.emotion === 'Тревога' || 
      dream.emotion === 'Страх' || 
      dream.dream_type === 'nightmare'
    
    return matchesSearch && matchesTag && matchesType && matchesAnxious
  })
  
  const hasActiveFilters = activeTag || activeType || showAnxious

  return (
    <div className="space-y-5 pb-6 animate-fade-in">
      <Header 
        rightElement={
          <div className="flex items-center space-x-2 gap-2">
            {/* Export/Import buttons */}
            <div className="relative group">
              <button
                onClick={() => handleExport('json')}
                disabled={isExporting || dreams.length === 0}
                className="btn-secondary flex items-center space-x-1 px-3 py-2 text-sm"
                title="Экспорт"
              >
                <Download size={16} />
                {isExporting ? '...' : ''}
              </button>
              
              {/* Export dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-night-deep-blue border border-mythic-ivory/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => handleExport('json')}
                    className="w-full text-left px-3 py-2 rounded hover:bg-mythic-ivory/10 text-sm"
                  >
                    📄 JSON
                  </button>
                  <button
                    onClick={() => handleExport('text')}
                    className="w-full text-left px-3 py-2 rounded hover:bg-mythic-ivory/10 text-sm"
                  >
                    📝 Текст
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full text-left px-3 py-2 rounded hover:bg-mythic-ivory/10 text-sm"
                  >
                    📊 CSV
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="btn-secondary flex items-center space-x-1 px-3 py-2 text-sm"
              title="Импорт"
            >
              <Upload size={16} />
              {isImporting ? '...' : ''}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.txt,.csv,text/*"
              onChange={handleImport}
              className="hidden"
            />

            <Link href="/journal/new">
              <button className="btn-primary flex items-center space-x-2 shadow-xl">
                <Plus size={20} />
                <span className="hidden sm:inline">Записать</span>
              </button>
            </Link>
          </div>
        }
      />

      <div>
        <h1 className="text-3xl font-bold text-mythic-ivory tracking-tight">Дневник снов</h1>
        <p className="text-mythic-ivory/50 text-sm mt-1">Записи ваших сновидений</p>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-mythic-ivory/40" size={19} />
          <input
            type="text"
            placeholder="Поиск по снам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-5 rounded-2xl flex items-center transition-all ${
            showFilters 
              ? 'btn-primary' 
              : 'btn-secondary'
          }`}
        >
          <Filter size={19} />
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && <FilterModal onClose={() => setShowFilters(false)} />}
      
      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between p-4 bg-light-ai-blue/10 border border-light-ai-blue/30 rounded-2xl">
          <div className="flex items-center flex-wrap gap-2">
            <Filter size={16} className="text-light-ai-blue" />
            <span className="text-mythic-ivory text-sm">Фильтры:</span>
            {activeTag && (
              <span className="px-2 py-1 bg-light-ai-blue/20 text-light-ai-blue text-xs rounded-full">
                #{activeTag}
              </span>
            )}
            {activeType && (
              <span className="px-2 py-1 bg-amethyst-spirit/20 text-amethyst-spirit text-xs rounded-full">
                {activeType === 'lucid' ? 'Осознанный' : activeType}
              </span>
            )}
            {showAnxious && (
              <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                Тревожные
              </span>
            )}
          </div>
          <button
            onClick={clearAllFilters}
            className="p-1.5 rounded-lg bg-mythic-ivory/10 hover:bg-mythic-ivory/20 text-mythic-ivory transition-all"
            aria-label="Очистить фильтры"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-mythic-ivory/10 rounded-2xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-mythic-ivory/10 rounded w-3/4" />
                  <div className="h-3 bg-mythic-ivory/10 rounded w-full" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-mythic-ivory/10 rounded-full w-16" />
                    <div className="h-6 bg-mythic-ivory/10 rounded-full w-16" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Debug info (development only) */}
      {process.env.NODE_ENV === 'development' && !isLoading && (
        <div className="mb-4 p-3 bg-mythic-ivory/5 rounded-lg text-xs text-mythic-ivory/60 space-y-1">
          <p>🔍 Debug: Всего снов в базе: <strong>{dreams.length}</strong></p>
          <p>🔍 Debug: Отфильтровано: <strong>{filteredDreams.length}</strong></p>
          <button 
            onClick={() => {
              console.log('🔄 Принудительная перезагрузка снов...')
              loadDreams()
            }}
            className="mt-2 text-morphe-blue hover:text-light-ai-blue underline"
          >
            🔄 Перезагрузить сны
          </button>
        </div>
      )}

      {/* Dreams List */}
      {!isLoading && filteredDreams.length > 0 && (
        <div className="space-y-4">
          {filteredDreams.map((dream) => (
            <DreamCard 
              key={dream.id} 
              dream={dream} 
              onDelete={() => loadDreams()} 
            />
          ))}
        </div>
      )}

      {!isLoading && filteredDreams.length === 0 && dreams.length > 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-mythic-ivory/70 mb-4">
            Ничего не найдено по выбранным фильтрам
          </p>
          <button onClick={clearAllFilters} className="btn-primary">
            Очистить фильтры
          </button>
        </div>
      )}

      {!isLoading && dreams.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌙</div>
          <p className="text-mythic-ivory/70">Пока нет записанных снов</p>
          <Link href="/journal/new">
            <button className="btn-primary mt-4">
              Записать первый сон
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default function JournalPage() {
  return (
    <Suspense fallback={
      <div className="space-y-5 pb-6 animate-fade-in">
        <Header />
        <div>
          <h1 className="text-3xl font-bold text-mythic-ivory tracking-tight">Дневник снов</h1>
          <p className="text-mythic-ivory/50 text-sm mt-1">Записи ваших сновидений</p>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-mythic-ivory/10 rounded-2xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-mythic-ivory/10 rounded w-3/4" />
                  <div className="h-3 bg-mythic-ivory/10 rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    }>
      <JournalContent />
    </Suspense>
  )
}

