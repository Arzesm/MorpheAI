// Простая Edge Function для получения новостей о снах из проверенных RSS фидов
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Проверенные RSS фиды (только самые надежные)
const RSS_FEEDS = [
  // Иностранные научные источники
  {
    name: 'PubMed Sleep',
    url: 'https://pubmed.ncbi.nlm.nih.gov/rss/search/1?term=sleep&sort=pubdate&size=20',
    category: 'science',
    categoryName: 'Наука'
  },
  {
    name: 'Science Daily',
    url: 'https://www.sciencedaily.com/rss/matter_energy/sleep.xml',
    category: 'science',
    categoryName: 'Наука'
  },
  {
    name: 'Medical News Today',
    url: 'https://www.medicalnewstoday.com/rss/sleep',
    category: 'science',
    categoryName: 'Наука'
  },
  {
    name: 'WebMD Sleep',
    url: 'https://www.webmd.com/rss/sleep-disorders/rss.aspx',
    category: 'science',
    categoryName: 'Наука'
  },
  {
    name: 'Healthline Sleep',
    url: 'https://www.healthline.com/health/sleep/rss',
    category: 'science',
    categoryName: 'Наука'
  },
  {
    name: 'Psychology Today',
    url: 'https://www.psychologytoday.com/us/rss/topics/sleep',
    category: 'psychology',
    categoryName: 'Психология'
  }
]

// Простой и надежный парсер RSS
async function parseRSS(feedUrl: string, sourceName: string, category: string, categoryName: string) {
  try {
    console.log(`📡 ${sourceName}...`)
    
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      console.warn(`⚠️ ${sourceName}: ${response.status}`)
      return []
    }

    const text = await response.text()
    if (!text || text.length < 100) return []
    
    const items: any[] = []
    const itemPattern = /<item[^>]*>([\s\S]*?)<\/item>/gi
    let match
    
    while ((match = itemPattern.exec(text)) !== null) {
      const item = match[1]
      
      // Заголовок
      const titleMatch = item.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
      if (!titleMatch) continue
      
      let title = titleMatch[1]
        .replace(/<!\[CDATA\[/g, '')
        .replace(/\]\]>/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim()
      
      if (!title) continue
      
      // Описание
      const descMatch = item.match(/<(?:description|content:encoded)[^>]*>([\s\S]*?)<\/(?:description|content:encoded)>/i)
      let description = ''
      if (descMatch) {
        description = descMatch[1]
          .replace(/<!\[CDATA\[/g, '')
          .replace(/\]\]>/g, '')
          .replace(/<[^>]+>/g, '')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/\s+/g, ' ')
          .trim()
      }
      
      if (description.length > 200) {
        description = description.substring(0, 200) + '...'
      }
      if (!description) {
        description = 'Читайте статью на оригинальном источнике.'
      }
      
      // URL
      let url = ''
      const linkMatch = item.match(/<link[^>]*>([\s\S]*?)<\/link>/i)
      if (linkMatch) {
        url = linkMatch[1].replace(/<[^>]+>/g, '').trim()
      }
      if (!url) {
        const guidMatch = item.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i)
        if (guidMatch) {
          url = guidMatch[1].replace(/<[^>]+>/g, '').trim()
        }
      }
      
      if (!url) continue
      url = url.replace(/&amp;/g, '&')
      
      // Дата
      const dateMatch = item.match(/<(?:pubDate|dc:date)[^>]*>([\s\S]*?)<\/(?:pubDate|dc:date)>/i)
      let date = new Date().toISOString().split('T')[0]
      if (dateMatch) {
        try {
          const d = new Date(dateMatch[1].trim().replace(/<[^>]+>/g, ''))
          if (!isNaN(d.getTime())) {
            date = d.toISOString().split('T')[0]
          }
        } catch (e) {}
      }
      
      items.push({
        title,
        description,
        url,
        source: sourceName,
        category,
        categoryName,
        publishedDate: date,
        readTime: '5 мин'
      })
    }
    
    console.log(`✅ ${sourceName}: ${items.length} статей`)
    return items
    
  } catch (error) {
    console.error(`❌ ${sourceName}:`, error.message)
    return []
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { category } = await req.json() || {}

    console.log('📰 Загрузка новостей о снах...')

    // Загружаем все фиды параллельно
    const results = await Promise.all(
      RSS_FEEDS.map(feed => parseRSS(feed.url, feed.name, feed.category, feed.categoryName))
    )
    
    let articles = results.flat()
    
    // Фильтруем по категории
    if (category && category !== 'all') {
      articles = articles.filter(a => a.category === category)
    }
    
    // Удаляем дубликаты
    const unique: any[] = []
    const seen = new Set()
    for (const article of articles) {
      const key = article.url.toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        unique.push(article)
      }
    }
    articles = unique
    
    // Сортируем по дате
    articles.sort((a, b) => {
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    })
    
    // Берем первые 15
    articles = articles.slice(0, 15)

    console.log(`✅ Всего: ${articles.length} статей`)

    return new Response(
      JSON.stringify({
        success: true,
        articles,
        total: articles.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Ошибка:', error.message)

    return new Response(
      JSON.stringify({
        error: 'Ошибка при загрузке новостей',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
