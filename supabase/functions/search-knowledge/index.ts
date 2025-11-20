// Supabase Edge Function для поиска информации о снах через OpenAI
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, category, autoLoad } = await req.json()

    // Если autoLoad = true, загружаем актуальные статьи без запроса
    const searchQuery = autoLoad 
      ? 'актуальные новости и исследования о снах, сновидениях, осознанных сновидениях, фазах сна, психологии сна'
      : query

    if (!searchQuery || searchQuery.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Поисковый запрос обязателен' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log('🔍 Поиск информации о снах:', searchQuery)
    console.log('📂 Категория:', category || 'all')
    console.log('🔄 Автозагрузка:', autoLoad || false)

    // Получаем OpenAI ключ из секретов Supabase
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY не настроен в Supabase секретах')
    }

    // Определяем категорию и формируем промпт
    const categoryPrompts: Record<string, string> = {
      'science': 'Найди последние научные исследования, новости и открытия в области сна, нейронауки, медицины сна. Включи ссылки на исследования, если возможно.',
      'practice': 'Найди практические техники, методы и руководства по работе со снами: осознанные сновидения, техники запоминания снов, практики улучшения сна.',
      'psychology': 'Найди информацию о психологии сна, толковании снов, работе с кошмарами, психотерапевтических подходах к сновидениям.',
      'symbols': 'Найди информацию о символах в снах, архетипах, толковании символов, различных системах интерпретации сновидений.',
      'all': 'Найди актуальную информацию о снах: новости, исследования, практики, психологические подходы, символы. Включи всё, что связано со сном.'
    }

    const categoryPrompt = categoryPrompts[category || 'all'] || categoryPrompts['all']

    // Запрос к OpenAI API с моделью gpt-4o-search-preview
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-search-preview',
        messages: [
          {
            role: 'system',
            content: `Ты — эксперт по снам и сновидениям. Твоя задача — найти и предоставить актуальную информацию о снах ТОЛЬКО из проверенных и авторитетных источников.

${categoryPrompt}

СТРОГИЕ ТРЕБОВАНИЯ К ИСТОЧНИКАМ:
Используй ТОЛЬКО следующие типы источников:

НАУЧНЫЕ И МЕДИЦИНСКИЕ:
• Научные журналы: Nature, Science, Cell, The Lancet, JAMA, Sleep Medicine, Journal of Sleep Research
• Медицинские порталы: PubMed, WebMD, Mayo Clinic, Healthline, Medical News Today
• Университетские исследования: Harvard, Stanford, MIT, Oxford и другие ведущие университеты
• Медицинские организации: WHO, CDC, NIH, American Academy of Sleep Medicine

СПЕЦИАЛИЗИРОВАННЫЕ ПОРТАЛЫ О СНЕ:
• Sleep Foundation (sleepfoundation.org)
• National Sleep Foundation
• Sleep.org
• Sleep Research Society
• International Association for the Study of Dreams

ПСИХОЛОГИЧЕСКИЕ И ПРОФЕССИОНАЛЬНЫЕ:
• Psychology Today
• American Psychological Association (APA)
• British Psychological Society
• Scientific American
• New Scientist

ЗАПРЕЩЕНО использовать:
• Блоги и личные сайты
• Непроверенные новостные порталы
• Социальные сети
• Википедия (только как последний вариант)
• Сомнительные или коммерческие сайты без научной основы

Формат ответа в JSON:
{
  "articles": [
    {
      "title": "Заголовок статьи/новости/исследования",
      "description": "Краткое описание (2-3 предложения) - превью статьи",
      "category": "science|practice|psychology|symbols",
      "categoryName": "Наука|Практика|Психология|Символы",
      "url": "https://ссылка-на-оригинальную-статью.com/article",
      "publishedDate": "2025-11-20",
      "readTime": "5 мин",
      "source": "Название источника (например, Nature, Sleep Foundation, PubMed)"
    }
  ]
}

КРИТИЧЕСКИ ВАЖНО:
• ОБЯЗАТЕЛЬНО включай поле "url" с реальной ссылкой на оригинальную статью
• URL должен быть валидным и вести на оригинальный источник из списка разрешённых
• Используй актуальную информацию (последние новости, исследования за последние месяцы)
• Пиши на русском языке
• Максимум 8 статей для актуальных новостей
• Каждая статья должна быть из проверенного источника
• Если не можешь найти информацию в проверенных источниках — лучше верни меньше статей, но только из авторитетных источников

ВАЖНО: Верни ТОЛЬКО валидный JSON без дополнительного текста, markdown разметки или комментариев. Начни ответ сразу с { и закончи }`
          },
          {
            role: 'user',
            content: autoLoad
              ? `Найди самые актуальные новости, исследования и статьи о снах за последние месяцы ТОЛЬКО из проверенных источников: научных журналов (Nature, Science, PubMed), медицинских порталов (WebMD, Mayo Clinic, Healthline), специализированных порталов о сне (Sleep Foundation, Sleep.org), психологических ресурсов (Psychology Today, APA). Включи реальные ссылки на оригинальные источники. Верни результаты в JSON формате с массивом статей, каждая статья должна иметь поле "url" с ссылкой на оригинальный источник из списка разрешённых.`
              : `Найди информацию по запросу: "${searchQuery}" ТОЛЬКО из проверенных источников: научных журналов, медицинских порталов, специализированных порталов о сне, психологических ресурсов.

Верни результаты в JSON формате с массивом статей. Каждая статья должна иметь поле "url" с ссылкой на оригинальный источник из списка разрешённых.`
          }
        ],
        max_tokens: 4000
      })
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      console.error('❌ Ошибка OpenAI API:', errorData)
      throw new Error(errorData.error?.message || 'Ошибка OpenAI API')
    }

    const data = await openaiResponse.json()
    const responseText = data.choices[0].message.content

    if (!responseText) {
      throw new Error('Пустой ответ от OpenAI')
    }

    // Парсим JSON, удаляя markdown код блоки если есть
    let jsonText = responseText.trim()
    
    // Удаляем markdown код блоки если они есть
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }
    
    jsonText = jsonText.trim()

    let searchResults
    try {
      searchResults = JSON.parse(jsonText)
    } catch (parseError) {
      console.error('❌ Ошибка парсинга JSON:', parseError)
      console.error('Текст ответа:', jsonText.substring(0, 500))
      throw new Error('Не удалось распарсить ответ от AI как JSON')
    }

    console.log('✅ Результаты поиска получены:', searchResults.articles?.length || 0, 'статей')

    return new Response(
      JSON.stringify({
        success: true,
        query,
        category: category || 'all',
        articles: searchResults.articles || []
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Ошибка в Edge Function:', error)

    return new Response(
      JSON.stringify({
        error: 'Ошибка при поиске информации',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

