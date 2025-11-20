'use client'

import { Clock, Bookmark, Eye } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface ArticleCardProps {
  article: {
    id: number | string
    title: string
    category: string
    categoryName: string
    description: string
    readTime: string
    icon: string
    isFavorite: boolean
    views: number
    publishedDate: string
    url?: string // Ссылка на оригинальную статью
    source?: string // Название источника
    content?: string
    sources?: string[]
  }
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const [isFavorite, setIsFavorite] = useState(article.isFavorite)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsFavorite(!isFavorite)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
  }

  // Если есть URL - открываем оригинальную статью, иначе внутреннюю
  const articleUrl = article.url || `/knowledge/${article.id}`
  const isExternal = !!article.url

  return (
    <Link 
      href={articleUrl}
      target={isExternal ? "_blank" : "_self"}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      <div className="card p-5 hover:scale-[1.01] transition-all cursor-pointer group">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <div className="absolute inset-0 bg-light-ai-blue/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative text-4xl p-2 bg-gradient-to-br from-mythic-ivory/5 to-mythic-ivory/10 rounded-2xl backdrop-blur-sm">
              {article.icon}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-mythic-ivory font-bold text-base flex-1 pr-2 tracking-tight">
                {article.title}
              </h3>
              <button
                onClick={toggleFavorite}
                className="flex-shrink-0 p-2 rounded-xl hover:bg-mythic-ivory/5 transition-all"
              >
                <Bookmark
                  size={18}
                  className={`transition-all ${
                    isFavorite
                      ? 'text-amethyst-spirit fill-amethyst-spirit scale-110'
                      : 'text-mythic-ivory/50 hover:text-mythic-ivory/70'
                  }`}
                />
              </button>
            </div>
            
            <p className="text-mythic-ivory/70 text-sm line-clamp-2 mb-3">
              {article.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="badge badge-primary">
                  {article.categoryName}
                </span>
                <span className="flex items-center text-xs text-mythic-ivory/60">
                  <Clock size={12} className="mr-1" />
                  {article.readTime}
                </span>
              </div>
              
              <div className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-mythic-ivory/5">
                <Eye size={12} className="text-mythic-ivory/50" />
                <span className="text-xs text-mythic-ivory/60 font-medium">{article.views}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <p className="text-mythic-ivory/50 text-xs">
                {formatDate(article.publishedDate)}
              </p>
              {article.url && (
                <div className="flex items-center space-x-1 text-xs text-morphe-blue">
                  <span>🔗</span>
                  <span className="font-medium">{article.source || 'Источник'}</span>
                  <span className="text-mythic-ivory/40">↗</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

