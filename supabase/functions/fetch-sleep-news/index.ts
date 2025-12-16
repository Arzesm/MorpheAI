// Edge Function для получения новостей о снах через Google Gemini API
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// API ключ Gemini из секретов Supabase
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent'

// Fallback статьи на случай ошибки Gemini API (только реальные ссылки)
function getFallbackArticles(category: string = 'all') {
  const allArticles = [
    {
      title: "Осознанные сновидения: что это и как их достичь",
      description: "Осознанные сновидения позволяют контролировать свои сны и понимать, что вы спите. Исследования показывают, что эта практика может улучшить креативность, помочь справиться с кошмарами и даже способствовать решению проблем. Существует несколько техник для входа в осознанные сновидения, включая метод MILD, WILD и WBTB. Регулярная практика и ведение дневника снов значительно увеличивают шансы на успех.",
      url: "https://www.sleepfoundation.org/dreams/lucid-dreams",
      source: "Sleep Foundation",
      category: "practice",
      categoryName: "Практика",
      publishedDate: new Date().toISOString().split('T')[0],
      readTime: "7 мин"
    },
    {
      title: "Почему мы видим сны: научное объяснение",
      description: "Ученые продолжают исследовать причины и функции сновидений. Современные теории предполагают, что сны помогают обрабатывать эмоции, консолидировать память и репетировать возможные сценарии. Исследования показывают, что сновидения происходят преимущественно в фазе REM-сна, когда мозг активен почти как при бодрствовании. Сны могут также играть роль в обучении и творческом решении проблем.",
      url: "https://www.healthline.com/health/why-do-we-dream",
      source: "Healthline",
      category: "science",
      categoryName: "Наука",
      publishedDate: new Date().toISOString().split('T')[0],
      readTime: "6 мин"
    },
    {
      title: "Психология сновидений: что означают наши сны",
      description: "Психологический анализ сновидений раскрывает глубокие связи между содержанием снов и нашим подсознанием. Сны могут отражать наши страхи, желания, нерешенные конфликты и эмоциональное состояние. Различные психологические школы предлагают свои подходы к интерпретации снов, от фрейдистского анализа до юнгианской архетипической теории. Понимание символики снов может помочь в самопознании и психотерапии.",
      url: "https://www.psychologytoday.com/us/basics/dreams",
      source: "Psychology Today",
      category: "psychology",
      categoryName: "Психология",
      publishedDate: new Date().toISOString().split('T')[0],
      readTime: "5 мин"
    },
    {
      title: "Распространенные сны и их значение",
      description: "Многие люди видят похожие сны, что указывает на общие психологические паттерны. Сны о падении, полете, преследовании или потере зубов встречаются особенно часто. Психологи интерпретируют эти сны как отражение наших базовых страхов, стремлений и жизненных ситуаций. Понимание значения таких снов может помочь лучше понять себя и свои эмоциональные потребности.",
      url: "https://www.webmd.com/sleep-disorders/features/dream-interpretation-what-do-dreams-mean",
      source: "WebMD",
      category: "symbols",
      categoryName: "Символы",
      publishedDate: new Date().toISOString().split('T')[0],
      readTime: "6 мин"
    },
    {
      title: "Сон и память: как сон влияет на запоминание",
      description: "Исследования показывают тесную связь между сном и консолидацией памяти. Во время сна мозг обрабатывает и сохраняет информацию, полученную в течение дня. Фаза REM-сна особенно важна для эмоциональной памяти и творческих процессов. Недостаток сна может серьезно нарушить способность к обучению и запоминанию новой информации.",
      url: "https://www.sleepfoundation.org/how-sleep-works/how-sleep-affects-memory",
      source: "Sleep Foundation",
      category: "science",
      categoryName: "Наука",
      publishedDate: new Date().toISOString().split('T')[0],
      readTime: "5 мин"
    },
    {
      title: "Как запоминать сны: практические техники",
      description: "Многие люди хотели бы лучше помнить свои сны, но не знают, как это сделать. Существует несколько эффективных техник: ведение дневника снов сразу после пробуждения, правильное время пробуждения и намерение запомнить сон перед засыпанием. Регулярная практика этих методов значительно улучшает способность запоминать сновидения и может открыть путь к осознанным сновидениям.",
      url: "https://www.sleepfoundation.org/dreams/how-to-remember-dreams",
      source: "Sleep Foundation",
      category: "practice",
      categoryName: "Практика",
      publishedDate: new Date().toISOString().split('T')[0],
      readTime: "4 мин"
    },
    {
      title: "Кошмары: причины и методы лечения",
      description: "Кошмары могут серьезно нарушать качество сна и общее самочувствие. Причины кошмаров разнообразны: стресс, травматические переживания, определенные лекарства или нарушения сна. Существуют эффективные методы лечения, включая терапию повторяющихся образов, когнитивно-поведенческую терапию и техники релаксации. Понимание причин кошмаров - первый шаг к их преодолению.",
      url: "https://www.sleepfoundation.org/nightmares",
      source: "Sleep Foundation",
      category: "psychology",
      categoryName: "Психология",
      publishedDate: new Date().toISOString().split('T')[0],
      readTime: "6 мин"
    },
    {
      title: "Толкование снов: что означают ваши сновидения",
      description: "Толкование снов - древняя практика, которая продолжает интересовать людей и сегодня. Различные культуры и психологические школы предлагают свои подходы к интерпретации символов снов. Хотя универсального словаря символов не существует, понимание личного контекста и эмоций может помочь раскрыть значение сновидений. Современная психология рассматривает сны как отражение нашего внутреннего мира.",
      url: "https://www.medicalnewstoday.com/articles/284378",
      source: "Medical News Today",
      category: "symbols",
      categoryName: "Символы",
      publishedDate: new Date().toISOString().split('T')[0],
      readTime: "7 мин"
    },
    {
      title: "REM-сон: что это и почему он важен",
      description: "Фаза быстрого движения глаз (REM) - одна из самых важных стадий сна. Во время REM-сна мозг активен, происходят яркие сновидения, и происходит консолидация памяти. Исследования показывают, что недостаток REM-сна может негативно влиять на обучение, эмоциональное здоровье и творческие способности. Понимание важности REM-сна помогает осознать необходимость полноценного ночного отдыха.",
      url: "https://www.sleepfoundation.org/stages-of-sleep/rem-sleep",
      source: "Sleep Foundation",
      category: "science",
      categoryName: "Наука",
      publishedDate: new Date().toISOString().split('T')[0],
      readTime: "5 мин"
    },
    {
      title: "Расстройства сна и их влияние на сновидения",
      description: "Различные нарушения сна могут значительно изменять характер и содержание сновидений. Апноэ сна, бессонница, нарколепсия и другие расстройства могут вызывать необычные или тревожные сны. Лечение этих расстройств часто приводит к улучшению качества снов и общего самочувствия. Понимание связи между расстройствами сна и сновидениями важно для комплексного подхода к лечению.",
      url: "https://www.webmd.com/sleep-disorders/guide/dreams-overview",
      source: "WebMD",
      category: "science",
      categoryName: "Наука",
      publishedDate: new Date().toISOString().split('T')[0],
      readTime: "5 мин"
    }
  ]

  // Берем первые 10 для категории 'all', иначе фильтруем
  if (category === 'all') {
    return allArticles.slice(0, 10)
  }

  const filtered = allArticles.filter(article => article.category === category)
  return filtered.slice(0, 10)
}

// Функция для поиска статей через Gemini API
async function searchArticlesWithGemini(category: string = 'all') {
  try {
    if (!GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY не настроен в секретах Supabase')
      throw new Error('GEMINI_API_KEY не настроен')
    }
    
    console.log('🔍 Поиск статей о снах через Gemini API...')
    
    const categoryPrompts: Record<string, string> = {
      'science': 'Найди последние научные новости и исследования о снах, сновидениях, фазах сна, нейронауке сна. Ищи в научных журналах, медицинских порталах, университетских исследованиях.',
      'practice': 'Найди практические статьи и руководства о работе со снами: осознанные сновидения, техники запоминания снов, практики улучшения сна, методы работы со сновидениями.',
      'psychology': 'Найди статьи о психологии сна, толковании снов, работе с кошмарами, психотерапевтических подходах к сновидениям, связи снов и психического здоровья.',
      'symbols': 'Найди статьи о символах в снах, архетипах, толковании символов, различных системах интерпретации сновидений, культурных аспектах снов.',
      'all': 'Найди актуальные новости и статьи о снах: научные исследования, практические техники, психологические подходы, символы сновидений. Включи всё, что связано со сном и сновидениями.'
    }

    const categoryPrompt = categoryPrompts[category] || categoryPrompts['all']

    const prompt = `Ты эксперт по снам и сновидениям. Найди 10 РЕАЛЬНЫХ, СУЩЕСТВУЮЩИХ статей о снах.

ВАЖНО: Приоритет для НОВЫХ исследований и открытий за последнюю неделю/месяц!
- Ищи самые свежие научные публикации и новости
- Новые исследования и открытия в области сна и сновидений
- Актуальные статьи 2024-2025 года

${categoryPrompt}

КРИТИЧЕСКИ ВАЖНО - используй ТОЛЬКО РЕАЛЬНЫЕ статьи с РЕАЛЬНЫМИ URL:
• Используй ТОЛЬКО статьи, которые ТЫ ТОЧНО ЗНАЕШЬ из своей базы знаний
• URL должны быть РЕАЛЬНЫМИ и СУЩЕСТВУЮЩИМИ - не выдумывай!
• Приоритет НОВЫМ статьям (2024-2025 год)
• Используй только известные тебе реальные URL из этих источников:
  - Sleep Foundation: sleepfoundation.org/dreams/... или sleepfoundation.org/how-sleep-works/...
  - WebMD: webmd.com/sleep-disorders/...
  - Healthline: healthline.com/health/... или healthline.com/health/sleep/...
  - Psychology Today: psychologytoday.com/us/basics/dreams или psychologytoday.com/us/topics/dreams
  - Medical News Today: medicalnewstoday.com/articles/...
  - PubMed: pubmed.ncbi.nlm.nih.gov/...

Для каждой РЕАЛЬНОЙ статьи укажи:
- Заголовок статьи НА РУССКОМ ЯЗЫКЕ (переведи оригинальный заголовок на русский или создай русский заголовок, отражающий содержание статьи)
- Полное описание (4-6 предложений) - тезисно про что статья, полное начало статьи, НЕ ОБРЫВАЙ на полуслове, заверши мысль полностью
- Реальное название источника
- РЕАЛЬНЫЙ URL существующей статьи (используй только URL, которые ты точно знаешь!)
- Категорию: science, practice, psychology, symbols
- Дату публикации (ПРИОРИТЕТ новым статьям 2024-2025, если известна точная дата - используй её)

Формат ответа ТОЛЬКО JSON (без markdown, без комментариев):
{
  "articles": [
    {
      "title": "Заголовок статьи на русском языке",
      "description": "Полное описание 4-6 предложений, тезисно про что статья, полное начало, завершенная мысль",
      "url": "https://реальный-существующий-url.com/путь-к-статье",
      "source": "Название источника",
      "category": "science",
      "categoryName": "Наука",
      "publishedDate": "2024-12-15",
      "readTime": "5 мин"
    }
  ]
}

КРИТИЧЕСКИ ВАЖНО:
• Заголовок ВСЕГДА на русском языке - переведи оригинальный заголовок или создай русский
• Описание должно быть ПОЛНЫМ (4-6 предложений), НЕ ОБРЫВАЙ на полуслове, заверши мысль
• Используй ТОЛЬКО реальные, существующие статьи
• URL должны быть валидными и вести на реальные страницы
• Верни ТОЛЬКО JSON, начни с { и закончи }
• Максимум 10 статей`

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4000,
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('❌ Ошибка Gemini API:', errorData)
      console.error('Статус:', response.status)
      // Возвращаем fallback данные вместо ошибки
      return getFallbackArticles(category)
    }

    const data = await response.json()
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('❌ Пустой ответ от Gemini API')
      return getFallbackArticles(category)
    }

    const responseText = data.candidates[0].content.parts[0].text

    if (!responseText) {
      console.error('❌ Пустой текст в ответе от Gemini')
      return getFallbackArticles(category)
    }

    // Парсим JSON, удаляя markdown код блоки если есть
    let jsonText = responseText.trim()
    
    // Удаляем markdown код блоки если они есть
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }
    
    // Ищем JSON объект в тексте
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonText = jsonMatch[0]
    }
    
    jsonText = jsonText.trim()

    let searchResults
    try {
      searchResults = JSON.parse(jsonText)
    } catch (parseError) {
      console.error('❌ Ошибка парсинга JSON:', parseError)
      console.error('Текст ответа (первые 1000 символов):', jsonText.substring(0, 1000))
      // Возвращаем fallback данные
      return getFallbackArticles(category)
    }

    if (!searchResults.articles || !Array.isArray(searchResults.articles) || searchResults.articles.length === 0) {
      console.warn('⚠️ Gemini вернул пустой массив статей')
      return getFallbackArticles(category)
    }

    console.log('✅ Результаты поиска получены:', searchResults.articles.length, 'статей')
    return searchResults.articles

  } catch (error) {
    console.error('❌ Ошибка поиска через Gemini:', error.message)
    return []
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { category } = await req.json() || {}

    console.log('📰 Загрузка новостей о снах через Gemini API...')
    console.log('📂 Категория:', category || 'all')

    // Ищем статьи через Gemini API
    let articles = await searchArticlesWithGemini(category || 'all')
    
    // Фильтруем по категории (на случай если Gemini вернул не ту категорию)
    if (category && category !== 'all') {
      articles = articles.filter(a => a.category === category)
    }
    
    // Удаляем дубликаты по URL
    const unique: any[] = []
    const seen = new Set()
    for (const article of articles) {
      const key = (article.url || article.title).toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        unique.push(article)
      }
    }
    articles = unique
    
    // Сортируем по дате (новые сначала)
    articles.sort((a, b) => {
      const dateA = new Date(a.publishedDate || '2000-01-01').getTime()
      const dateB = new Date(b.publishedDate || '2000-01-01').getTime()
      return dateB - dateA
    })
    
    // Берем первые 10
    articles = articles.slice(0, 10)

    // Убеждаемся, что у всех статей есть необходимые поля
    articles = articles.map(article => ({
      title: article.title || 'Без названия',
      description: article.description || 'Читайте статью на оригинальном источнике.',
      url: article.url || '',
      source: article.source || 'Неизвестный источник',
      category: article.category || 'all',
      categoryName: article.categoryName || 'Все',
      publishedDate: article.publishedDate || new Date().toISOString().split('T')[0],
      readTime: article.readTime || '5 мин'
    }))

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
