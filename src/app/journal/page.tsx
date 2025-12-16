'use client'

import { useState, useEffect, Suspense } from 'react'
import { Plus, Search, Filter, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import DreamCard from '@/components/journal/DreamCard'
import FilterModal from '@/components/journal/FilterModal'
import { dreamService } from '@/lib/supabase'

function JournalContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tagFromUrl = searchParams.get('tag')
  const typeFromUrl = searchParams.get('type')
  const anxiousFromUrl = searchParams.get('anxious')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [dreams, setDreams] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [activeType, setActiveType] = useState<string | null>(null)
  const [showAnxious, setShowAnxious] = useState(false)

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
      const data = await dreamService.getAll()
      
      console.log('📚 Загружено снов из Supabase:', data?.length || 0)
      
      if (data) {
        // Сортируем сны: новые сверху (по created_at в порядке убывания)
        const sortedDreams = [...data].sort((a, b) => {
          const dateA = new Date(a.created_at || a.date || 0).getTime()
          const dateB = new Date(b.created_at || b.date || 0).getTime()
          return dateB - dateA // Убывание: новые первыми
        })
        
        setDreams(sortedDreams)
        console.log('✅ Сны отсортированы: новые сверху')
      } else {
        setDreams([])
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки снов из Supabase:', error)
      
      // Показываем ошибку пользователю
      if (error instanceof Error && error.message.includes('does not exist')) {
        alert('⚠️ Таблица снов не создана в Supabase!\n\nВыполните SQL из файла CREATE_TABLES.sql:\n1. Откройте Supabase Dashboard\n2. SQL Editor → New query\n3. Вставьте код из CREATE_TABLES.sql\n4. Нажмите Run')
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
    <div className="space-y-4 pb-6 animate-fade-in">
      {/* Beautiful Header with Logo */}
      <header className="text-center pt-6 relative mb-1">
        <div className="absolute inset-0 bg-gradient-to-b from-morphe-blue/10 to-transparent blur-3xl" />
        <div className="relative z-10 flex flex-col items-center space-y-3">
          <Link href="/portal" className="relative w-48 h-16 cursor-pointer group">
            <Image
              src="https://i.postimg.cc/nznsrDSf/cbb6618b-6539-4097-a39c-81dc01fe57d4.png"
              alt="MorpheAI Logo"
              fill
              className="object-contain drop-shadow-[0_0_20px_rgba(30,144,255,0.3)] transition-all group-hover:drop-shadow-[0_0_30px_rgba(30,144,255,0.5)] group-hover:scale-105"
              priority
            />
          </Link>
          
          {/* Stylish Write Button */}
          <Link href="/journal/new" className="w-full px-4">
            <button className="group relative w-full px-6 py-5 bg-gradient-to-r from-morphe-blue via-light-ai-blue to-amethyst-spirit rounded-2xl font-bold shadow-2xl shadow-morphe-blue/50 hover:shadow-morphe-blue/70 transition-all duration-300 hover:scale-[1.02] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <div className="relative flex items-center justify-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center backdrop-blur-sm group-hover:rotate-90 transition-transform duration-300 shadow-lg">
                  <Plus size={28} strokeWidth={3} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold tracking-wide text-white drop-shadow-lg">Записать сон</div>
                  <div className="text-sm text-white/90 font-normal drop-shadow">Сохрани своё сновидение</div>
                </div>
              </div>
            </button>
          </Link>
        </div>
      </header>

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
        <div className="space-y-6">
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

      {/* Dreams List */}
      {!isLoading && filteredDreams.length > 0 && (
        <div className="space-y-6">
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
      <div className="space-y-4 pb-6 animate-fade-in">
        {/* Beautiful Header with Logo - Loading State */}
        <header className="text-center pt-6 relative mb-1">
          <div className="absolute inset-0 bg-gradient-to-b from-morphe-blue/10 to-transparent blur-3xl" />
          <div className="relative z-10 flex flex-col items-center space-y-3">
            <div className="relative w-48 h-16 opacity-50">
              <Image
                src="https://i.postimg.cc/nznsrDSf/cbb6618b-6539-4097-a39c-81dc01fe57d4.png"
                alt="MorpheAI Logo"
                fill
                className="object-contain drop-shadow-[0_0_20px_rgba(30,144,255,0.3)]"
                priority
              />
            </div>
            <div className="w-full px-4">
              <div className="w-full h-16 bg-mythic-ivory/10 rounded-2xl animate-pulse" />
            </div>
          </div>
        </header>
        
        <div className="space-y-6">
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

