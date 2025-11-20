// Supabase Edge Function для интерпретации снов через OpenAI
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
    const { title, content } = await req.json()

    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: 'Название и содержание сна обязательны' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log('🤖 Запрос интерпретации сна:', title)

    // Получаем OpenAI ключ из секретов Supabase
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY не настроен в Supabase секретах')
    }

    // Запрос к OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `Ты — профессиональный психолог и толкователь символов.

Твоя задача: дать человеку понятную, завершённую и логичную интерпретацию сна.

Требования:

• Используй язык, понятный обычному человеку — без сложных терминов.
• Интерпретируй не буквально, а через смысловые символы, эмоции, внутренние конфликты и намерения.
• Всегда делай выводы и завершай текст — никаких обрывков и незаконченных мыслей.

Учитывай:
• состояние человека во сне;
• действия и символы;
• возможные страхи, желания, напряжения, этапы развития.

Интерпретация должна быть бережной, психологичной и прикладной — с намёками на реальные шаги или послания сна.

Формат ответа в JSON:
{
  "summary": "Короткое объяснение ключевых символов и психологический смысл сна в 2-3 предложениях",
  "symbols": [
    {
      "name": "название символа",
      "meaning": "что он означает для внутреннего состояния человека"
    }
  ],
  "recommendations": [
    "мягкий вывод или рекомендация для реальной жизни"
  ],
  "tags": [
    "ключевой тег 1",
    "ключевой тег 2",
    "ключевой тег 3"
  ]
}

ВАЖНО про теги:
• Извлеки 3-5 самых ключевых символов/образов из сна
• Теги должны быть конкретными: "пауки", "полёт", "вода", "дом", "преследование"
• Используй существительные в единственном числе или глаголы
• Теги на русском языке
• Максимум 5 тегов

Отвечай на русском языке, используй тёплый, понимающий тон.`
          },
          {
            role: 'user',
            content: `Название сна: "${title}"

Описание сна:
${content}

Пожалуйста, проанализируй этот сон и предоставь интерпретацию в следующем JSON формате:
{
  "summary": "краткое резюме интерпретации",
  "symbols": [
    {
      "name": "название символа",
      "meaning": "значение символа"
    }
  ],
  "recommendations": [
    "рекомендация 1",
    "рекомендация 2",
    "рекомендация 3"
  ]
}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      })
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      console.error('❌ Ошибка OpenAI API:', errorData)
      throw new Error(errorData.error?.message || 'Ошибка OpenAI API')
    }

    const data = await openaiResponse.json()
    const interpretationText = data.choices[0].message.content

    if (!interpretationText) {
      throw new Error('Пустой ответ от OpenAI')
    }

    const interpretation = JSON.parse(interpretationText)

    console.log('✅ Интерпретация получена')

    return new Response(
      JSON.stringify({
        success: true,
        interpretation
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
        error: 'Ошибка при интерпретации сна',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

