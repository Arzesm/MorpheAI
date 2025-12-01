'use client'

import { Library, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function RecommendedArticles() {
  const articles = [
    {
      id: 1,
      title: 'Осознанные сновидения: техника WILD',
      category: 'Практика',
      readTime: '5 мин',
      icon: '🌙'
    },
    {
      id: 2,
      title: 'Фазы сна и их влияние на память',
      category: 'Наука',
      readTime: '7 мин',
      icon: '🧠'
    },
    {
      id: 3,
      title: 'Символы в снах: архетипический подход',
      category: 'Психология',
      readTime: '6 мин',
      icon: '🔮'
    }
  ]

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

      <div className="space-y-4">
        {articles.map((article) => (
          <Link key={article.id} href={`/knowledge/${article.id}`}>
            <div className="card-glass p-4 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-between group">
              <div className="flex items-center space-x-3 gap-3 flex-1">
                <div className="text-3xl p-2 bg-gradient-to-br from-mythic-ivory/5 to-mythic-ivory/10 rounded-xl backdrop-blur-sm">
                  {article.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-mythic-ivory font-semibold text-sm truncate mb-1">
                    {article.title}
                  </h3>
                  <div className="flex items-center space-x-2 gap-2 text-xs">
                    <span className="badge badge-primary">{article.category}</span>
                    <span className="text-mythic-ivory/60">{article.readTime}</span>
                  </div>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-morphe-blue/10 group-hover:bg-morphe-blue/20 transition-all">
                <ArrowRight size={18} className="text-morphe-blue" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

