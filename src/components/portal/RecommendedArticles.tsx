'use client'

import { Library, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function RecommendedArticles() {
  const [articles, setArticles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Иконки для категорий
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'science': '🧪',
      'practice': '🌙',
      'psychology': '🧠',
      'symbols': '🔮',
      'all': '📚'
    }
    return icons[category] || '📚'
  }

  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true)
      try {
        // Сначала пытаемся загрузить из кеша
        const cached = localStorage.getItem('cached_articles')
        if (cached) {
          const parsedArticles = JSON.parse(cached)
          setArticles(parsedArticles.slice(0, 3)) // Берем первые 3
          setIsLoading(false)
          return
        }

        // Если кеша нет, загружаем с сервера
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseKey) {
          console.error('⚠️ Переменные окружения не настроены')
          setIsLoading(false)
          return
        }

        const response = await fetch(`${supabaseUrl}/functions/v1/fetch-sleep-news`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ category: 'all' })
        })

        const data = await response.json()

        if (data.articles && data.articles.length > 0) {
          const formattedArticles = data.articles.slice(0, 3).map((article: any, index: number) => ({
            id: `article-${Date.now()}-${index}`,
            title: article.title,
            category: article.categoryName || 'Все',
            readTime: article.readTime || '5 мин',
            icon: getCategoryIcon(article.category || 'all'),
            url: article.url
          }))
          
          setArticles(formattedArticles)
        }
      } catch (error) {
        console.error('❌ Ошибка загрузки статей:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadArticles()
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-header flex items-center">
          <Library size={22} className="mr-2 text-morphe-blue" />
          Рекомендованные статьи
        </h2>
        <Link href="/knowledge" className="text-morphe-blue text-sm font-semibold hover:text-light-ai-blue transition-colors flex items-center space-x-1">
          <span>Все</span>
          <span>→</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-glass p-4 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-mythic-ivory/10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-mythic-ivory/10 rounded w-3/4" />
                  <div className="h-3 bg-mythic-ivory/10 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="space-y-4">
          {articles.map((article) => (
            <Link 
              key={article.id} 
              href={article.url || `/knowledge/${article.id}`}
              target={article.url ? "_blank" : "_self"}
              rel={article.url ? "noopener noreferrer" : undefined}
              className="block mb-4 last:mb-0"
            >
              <div className="card-glass p-4 hover:scale-[1.01] transition-all cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl p-2 bg-gradient-to-br from-mythic-ivory/5 to-mythic-ivory/10 rounded-xl backdrop-blur-sm flex-shrink-0">
                    {article.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-mythic-ivory font-semibold text-sm mb-1 pr-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="badge badge-primary">{article.category}</span>
                      <span className="text-mythic-ivory/60">{article.readTime}</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-morphe-blue/10 group-hover:bg-morphe-blue/20 transition-all flex-shrink-0">
                    <ArrowRight size={18} className="text-morphe-blue" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card-glass p-6 text-center">
          <p className="text-mythic-ivory/60 text-sm">Нет доступных статей</p>
        </div>
      )}
    </div>
  )
}

