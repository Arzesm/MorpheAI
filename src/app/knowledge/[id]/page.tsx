'use client'

import { ArrowLeft, Clock, Bookmark, Share2, Eye } from 'lucide-react'
import Link from 'next/link'
import { use, useState } from 'react'

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [isFavorite, setIsFavorite] = useState(false)

  // Мок-данные статьи
  const article = {
    id: parseInt(id),
    title: 'Осознанные сновидения: техника WILD',
    category: 'Практика',
    icon: '🌙',
    readTime: '5 мин',
    publishedDate: '15 ноября 2025',
    author: 'Д-р София Морфей',
    views: 1234,
    content: `
# Что такое техника WILD?

WILD (Wake-Initiated Lucid Dream) — это метод входа в осознанное сновидение напрямую из состояния бодрствования, минуя обычную фазу неосознанного сна.

## Подготовка к практике

### 1. Выберите правильное время
Лучшее время для практики WILD — раннее утро, после 4-6 часов сна. В это время фазы REM более продолжительные, что увеличивает шансы на успех.

### 2. Создайте комфортные условия
- Убедитесь, что температура в комнате комфортная
- Используйте удобную постель
- Минимизируйте шум и свет

## Пошаговая инструкция

### Шаг 1: Расслабление
Лягте на спину в удобном положении. Начните с глубокого дыхания: вдох на 4 счёта, задержка на 7, выдох на 8. Повторите 5-10 раз.

### Шаг 2: Фокус внимания
Сосредоточьтесь на физических ощущениях:
- Тяжесть тела
- Дыхание
- Биение сердца

### Шаг 3: Переход в гипнагогию
Вы начнёте замечать:
- Яркие визуальные образы
- Странные звуки
- Ощущение вибрации или покалывания

**Важно:** Не реагируйте эмоционально на эти ощущения. Наблюдайте их с любопытством, но оставайтесь расслабленными.

### Шаг 4: Вход в сон
Когда образы станут более яркими и устойчивыми, попробуйте "войти" в них. Представьте, что вы физически перемещаетесь в визуализируемое пространство.

## Распространённые ошибки

1. **Слишком много движений** — Любое физическое движение прервёт процесс
2. **Эмоциональные реакции** — Возбуждение или страх вернут вас в бодрствование
3. **Засыпание** — Важно балансировать между сонливостью и осознанностью

## Советы для успеха

- Практикуйте регулярно, но не зацикливайтесь на результате
- Ведите дневник снов для улучшения осознанности
- Используйте техники проверки реальности в течение дня
- Комбинируйте WILD с другими техниками (MILD, WBTB)

## Заключение

Техника WILD требует практики и терпения. Большинство практикующих достигают первых результатов через 2-4 недели регулярных попыток. Не отчаивайтесь при неудачах — каждая попытка приближает вас к успеху.
`,
    relatedArticles: [
      { id: 5, title: 'Техника проверки реальности', icon: '✋' },
      { id: 2, title: 'Фазы сна и их влияние на память', icon: '🧠' },
      { id: 3, title: 'Символы в снах: архетипический подход', icon: '🔮' }
    ]
  }

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      <header className="flex items-center justify-between">
        <Link href="/knowledge" className="text-mythic-ivory hover:text-morphe-blue transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="text-mythic-ivory/60 hover:text-mythic-ivory transition-colors"
          >
            <Bookmark
              size={22}
              className={isFavorite ? 'fill-amethyst-spirit text-amethyst-spirit' : ''}
            />
          </button>
          <button className="text-mythic-ivory/60 hover:text-mythic-ivory transition-colors">
            <Share2 size={22} />
          </button>
        </div>
      </header>

      {/* Article Header */}
      <div>
        <div className="text-5xl mb-4">{article.icon}</div>
        <h1 className="text-2xl font-bold text-mythic-ivory mb-3">{article.title}</h1>
        
        <div className="flex items-center space-x-4 text-sm text-mythic-ivory/60 mb-3">
          <span className="px-2 py-1 bg-morphe-blue/20 text-light-ai-blue rounded-full">
            {article.category}
          </span>
          <span className="flex items-center">
            <Clock size={14} className="mr-1" />
            {article.readTime}
          </span>
          <span className="flex items-center">
            <Eye size={14} className="mr-1" />
            {article.views}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-mythic-ivory/60">
          <span>{article.author}</span>
          <span>•</span>
          <span>{article.publishedDate}</span>
        </div>
      </div>

      {/* Article Content */}
      <div className="card p-6 prose prose-invert max-w-none">
        <div className="text-mythic-ivory/80 leading-relaxed space-y-4">
          {article.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('# ')) {
              return (
                <h1 key={index} className="text-2xl font-bold text-mythic-ivory mt-6 mb-3">
                  {paragraph.replace('# ', '')}
                </h1>
              )
            } else if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="text-xl font-bold text-mythic-ivory mt-5 mb-2">
                  {paragraph.replace('## ', '')}
                </h2>
              )
            } else if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-lg font-semibold text-light-ai-blue mt-4 mb-2">
                  {paragraph.replace('### ', '')}
                </h3>
              )
            } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              return (
                <p key={index} className="font-semibold text-morphe-blue">
                  {paragraph.replace(/\*\*/g, '')}
                </p>
              )
            } else if (paragraph.startsWith('- ')) {
              const items = paragraph.split('\n')
              return (
                <ul key={index} className="list-disc list-inside space-y-1 ml-4">
                  {items.map((item, i) => (
                    <li key={i} className="text-mythic-ivory/80">
                      {item.replace('- ', '')}
                    </li>
                  ))}
                </ul>
              )
            } else if (paragraph.match(/^\d+\./)) {
              const items = paragraph.split('\n')
              return (
                <ol key={index} className="list-decimal list-inside space-y-1 ml-4">
                  {items.map((item, i) => (
                    <li key={i} className="text-mythic-ivory/80">
                      {item.replace(/^\d+\.\s/, '')}
                    </li>
                  ))}
                </ol>
              )
            } else if (paragraph.trim()) {
              return (
                <p key={index} className="text-mythic-ivory/80 leading-relaxed">
                  {paragraph.split('**').map((part, i) => 
                    i % 2 === 1 ? <strong key={i} className="text-mythic-ivory font-semibold">{part}</strong> : part
                  )}
                </p>
              )
            }
            return null
          })}
        </div>
      </div>

      {/* Related Articles */}
      <div className="card p-4">
        <h2 className="text-lg font-semibold text-mythic-ivory mb-3">Похожие статьи</h2>
        <div className="space-y-2">
          {article.relatedArticles.map((related) => (
            <Link key={related.id} href={`/knowledge/${related.id}`}>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-morphe-blue/10 transition-all">
                <span className="text-2xl">{related.icon}</span>
                <span className="text-mythic-ivory text-sm font-medium flex-1">
                  {related.title}
                </span>
                <span className="text-morphe-blue">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

