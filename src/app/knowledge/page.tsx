'use client'

import { useState, useEffect } from 'react'
import { Search, Bookmark, TrendingUp, Clock, Star, Loader2, Sparkles } from 'lucide-react'
import Header from '@/components/Header'
import ArticleCard from '@/components/knowledge/ArticleCard'

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [articles, setArticles] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const categories = [
    { id: 'all', name: 'Все', icon: '📚' },
    { id: 'science', name: 'Наука', icon: '🧪' },
    { id: 'practice', name: 'Практика', icon: '🌙' },
    { id: 'psychology', name: 'Психология', icon: '🧠' },
    { id: 'symbols', name: 'Символы', icon: '🔮' }
  ]

  // Получить иконку для категории
  const getIconForCategory = (category: string) => {
    const icons: Record<string, string> = {
      'science': '🧪',
      'practice': '🌙',
      'psychology': '🧠',
      'symbols': '🔮',
      'all': '📚'
    }
    return icons[category] || '📚'
  }

  // Автоматическая загрузка актуальных статей при открытии страницы
  useEffect(() => {
    const loadLatestArticles = async () => {
      setIsSearching(true)
      setHasSearched(true)

      try {
        console.log('🔄 Загрузка актуальных статей о снах из RSS фидов...')

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseKey) {
          console.error('⚠️ Переменные окружения Supabase не настроены')
          setArticles([])
          setHasSearched(true)
          return
        }
        
        // Используем новую функцию для получения новостей из RSS фидов (без OpenAI API)
        const edgeFunctionUrl = `${supabaseUrl}/functions/v1/fetch-sleep-news`
        
        const response = await fetch(edgeFunctionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            category: 'all'
          })
        })

        const data = await response.json()

        if (!response.ok) {
          console.error('❌ API вернул ошибку:', data)
          setArticles([])
          setHasSearched(true)
          return
        }

        console.log('✅ Актуальные обсуждения загружены:', data.articles?.length || 0)

        if (data.articles && data.articles.length > 0) {
          const formattedArticles = data.articles.map((article: any, index: number) => ({
            id: `reddit-${Date.now()}-${index}`,
            title: article.title,
            category: article.category || 'all',
            categoryName: article.categoryName || 'Все',
            description: article.description,
            readTime: article.readTime || '3 мин',
            icon: getIconForCategory(article.category || 'all'),
            isFavorite: false,
            views: Math.floor(Math.random() * 5000) + 100,
            publishedDate: article.publishedDate || new Date().toISOString().split('T')[0],
            url: article.url, // Ссылка на Reddit
            source: article.source || 'Reddit'
          }))

          setArticles(formattedArticles)
          console.log(`✅ Отображено ${formattedArticles.length} актуальных обсуждений`)
        } else {
          console.warn('⚠️ Не удалось загрузить обсуждения')
          setArticles([])
          setHasSearched(true)
        }

      } catch (error: any) {
        console.error('❌ Ошибка загрузки актуальных обсуждений:', error)
        setArticles([])
        setHasSearched(true)
      } finally {
        setIsSearching(false)
      }
    }

    loadLatestArticles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Локальный поиск по уже загруженным обсуждениям
  const searchKnowledge = async (query: string, category: string = 'all') => {
    if (!query.trim()) {
      // Если запрос пустой, перезагружаем актуальные обсуждения
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      try {
        setIsSearching(true)
        const edgeFunctionUrl = `${supabaseUrl}/functions/v1/fetch-sleep-news`
        const response = await fetch(edgeFunctionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ category: category })
        })
        
        const data = await response.json()
        if (data.articles && data.articles.length > 0) {
          const formattedArticles = data.articles.map((article: any, index: number) => ({
            id: `reddit-${Date.now()}-${index}`,
            title: article.title,
            category: article.category || 'all',
            categoryName: article.categoryName || 'Все',
            description: article.description,
            readTime: article.readTime || '3 мин',
            icon: getIconForCategory(article.category || 'all'),
            isFavorite: false,
            views: Math.floor(Math.random() * 5000) + 100,
            publishedDate: article.publishedDate || new Date().toISOString().split('T')[0],
            url: article.url,
            source: article.source || 'Reddit'
          }))
          setArticles(formattedArticles)
          setHasSearched(true)
        } else {
          setArticles([])
          setHasSearched(true)
        }
      } catch (error) {
        console.error('Ошибка загрузки:', error)
        setArticles([])
        setHasSearched(true)
      } finally {
        setIsSearching(false)
      }
      return
    }

    setIsSearching(true)
    setHasSearched(true)

    try {
      console.log('🔍 Поиск по загруженным обсуждениям:', query)

      // Загружаем свежие обсуждения
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('⚠️ Переменные окружения Supabase не настроены')
        setArticles([])
        return
      }
      
      const edgeFunctionUrl = `${supabaseUrl}/functions/v1/fetch-sleep-news`
      
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          category: category
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('❌ Ошибка загрузки:', data)
        throw new Error(data.details || data.error || 'Ошибка загрузки')
      }

      if (data.articles && data.articles.length > 0) {
        // Локальный поиск по загруженным обсуждениям
        const searchLower = query.toLowerCase()
        const filtered = data.articles.filter((article: any) => {
          const matchesSearch = 
            article.title.toLowerCase().includes(searchLower) ||
            article.description.toLowerCase().includes(searchLower) ||
            article.source.toLowerCase().includes(searchLower)
          
          const matchesCategory = category === 'all' || article.category === category
          
          return matchesSearch && matchesCategory
        })

        console.log(`✅ Найдено ${filtered.length} обсуждений по запросу "${query}"`)

        const formattedArticles = filtered.map((article: any, index: number) => ({
          id: `reddit-search-${Date.now()}-${index}`,
          title: article.title,
          category: article.category || 'all',
          categoryName: article.categoryName || 'Все',
          description: article.description,
          readTime: article.readTime || '3 мин',
          icon: getIconForCategory(article.category || 'all'),
          isFavorite: false,
          views: Math.floor(Math.random() * 5000) + 100,
          publishedDate: article.publishedDate || new Date().toISOString().split('T')[0],
          url: article.url,
          source: article.source || 'Reddit'
        }))

        setArticles(formattedArticles)
      } else {
        setArticles([])
      }

    } catch (error: any) {
      console.error('❌ Ошибка поиска:', error)
      setArticles([])
    } finally {
      setIsSearching(false)
    }
  }

  // Обработка поиска с задержкой (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchKnowledge(searchQuery, activeTab)
      } else if (hasSearched) {
        // Перезагружаем актуальные обсуждения
        searchKnowledge('', activeTab)
      }
    }, 800) // Задержка 800мс

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, activeTab])

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeTab === 'all' || article.category === activeTab
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-4 pb-6 animate-fade-in">
      <Header />
      
      <div>
        <h1 className="text-3xl font-bold text-mythic-ivory tracking-tight">База знаний</h1>
        <p className="text-mythic-ivory/60 text-sm mt-1 font-medium">
          Актуальные новости и исследования о снах из проверенных научных источников
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mythic-ivory/50" size={18} />
        <input
          type="text"
          placeholder="Поиск новостей и исследований о снах..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-10 pr-10"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-5 w-5 animate-spin text-morphe-blue" />
          </div>
        )}
        {!isSearching && searchQuery && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Sparkles className="h-5 w-5 text-amethyst-spirit" />
          </div>
        )}
      </div>

        {isSearching && (
          <div className="card p-4 bg-morphe-blue/10 animate-pulse">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="h-5 w-5 animate-spin text-morphe-blue" />
              <p className="text-mythic-ivory text-sm">
                📰 Загрузка актуальных новостей из проверенных источников...
              </p>
            </div>
          </div>
        )}

      {/* Categories */}
      <div className="flex overflow-x-auto space-x-2 pb-2 -mx-4 px-4 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveTab(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              activeTab === category.id
                ? 'bg-morphe-blue text-mythic-ivory'
                : 'bg-mythic-ivory/10 text-mythic-ivory/60'
            }`}
          >
            <span>{category.icon}</span>
            <span className="text-sm font-medium">{category.name}</span>
          </button>
        ))}
      </div>


      {/* Articles List */}
      <section>
        <h2 className="text-lg font-semibold text-mythic-ivory mb-3 flex items-center">
          {hasSearched && searchQuery ? (
            <>
              <Sparkles size={18} className="mr-2 text-amethyst-spirit" />
              Результаты поиска: "{searchQuery}"
            </>
          ) : hasSearched && !searchQuery ? (
            <>
              <Sparkles size={18} className="mr-2 text-amethyst-spirit" />
              Актуальные новости о снах
            </>
          ) : (
            activeTab === 'all' ? 'Все новости' : categories.find(c => c.id === activeTab)?.name
          )}
        </h2>
        
        {filteredArticles.length > 0 ? (
          <div className="space-y-3">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : !isSearching ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-mythic-ivory/70 mb-2">
              {hasSearched ? 'Ничего не найдено' : 'Новости не найдены'}
            </p>
            {hasSearched && (
              <p className="text-mythic-ivory/50 text-sm">
                Попробуйте изменить запрос или выбрать другую категорию
              </p>
            )}
          </div>
        ) : null}
      </section>
    </div>
  )
}

