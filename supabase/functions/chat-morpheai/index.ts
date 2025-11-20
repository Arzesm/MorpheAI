// Supabase Edge Function для чата с MorpheAI через OpenAI
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Получение статистики и контекста снов из Supabase
async function getUserDreamContext() {
  try {
    // Получаем URL из переменных окружения или используем известный URL
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://uhmedcjhbgqewmaaxgan.supabase.co'
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    
    // Используем service role key если есть, иначе anon key
    const apiKey = supabaseServiceKey || supabaseAnonKey
    
    if (!apiKey) {
      console.warn('⚠️ Supabase ключ не найден, работаем без контекста')
      return null
    }

    // Используем REST API напрямую
    const response = await fetch(
      `${supabaseUrl}/rest/v1/dreams?select=*&order=created_at.desc`,
      {
        headers: {
          'apikey': apiKey,
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      console.error('❌ Ошибка загрузки снов:', response.status, response.statusText)
      return null
    }

    const dreams = await response.json()

    if (!dreams || dreams.length === 0) {
      return {
        totalDreams: 0,
        lastDream: null,
        statistics: {
          total: 0,
          nightmares: 0,
          lucid: 0,
          normal: 0,
          epic: 0,
          withInterpretation: 0,
          withImage: 0
        }
      }
    }

    // Вычисляем статистику
    const statistics = {
      total: dreams.length,
      nightmares: dreams.filter(d => d.dream_type === 'nightmare').length,
      lucid: dreams.filter(d => d.dream_type === 'lucid').length,
      normal: dreams.filter(d => d.dream_type === 'normal').length,
      epic: dreams.filter(d => d.dream_type === 'epic').length,
      withInterpretation: dreams.filter(d => d.has_interpretation).length,
      withImage: dreams.filter(d => d.has_image).length
    }

    // Последний сон
    const lastDream = dreams[0] || null

    return {
      totalDreams: dreams.length,
      lastDream: lastDream ? {
        id: lastDream.id,
        title: lastDream.title,
        content: lastDream.content,
        date: lastDream.date,
        emotion: lastDream.emotion,
        dream_type: lastDream.dream_type,
        archetype: lastDream.archetype,
        has_interpretation: lastDream.has_interpretation,
        interpretation: lastDream.interpretation
      } : null,
      statistics
    }
  } catch (error) {
    console.error('❌ Ошибка получения контекста:', error)
    return null
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Сообщения обязательны' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log('💬 Запрос к MorpheAI чату')

    // Получаем контекст снов пользователя
    const dreamContext = await getUserDreamContext()
    console.log('📊 Контекст снов загружен:', dreamContext ? `Всего снов: ${dreamContext.totalDreams}` : 'нет данных')

    // Получаем OpenAI ключ из секретов Supabase
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY не настроен в Supabase секретах')
    }

    // Формируем контекстную информацию для системного промпта
    let contextInfo = ''
    
    if (dreamContext) {
      const stats = dreamContext.statistics
      contextInfo = `\n\nКОНТЕКСТ ПОЛЬЗОВАТЕЛЯ:\n`
      contextInfo += `• Всего снов в дневнике: ${stats.total}\n`
      contextInfo += `• Тревожных снов (кошмаров): ${stats.nightmares}\n`
      contextInfo += `• Осознанных снов: ${stats.lucid}\n`
      contextInfo += `• Обычных снов: ${stats.normal}\n`
      contextInfo += `• Эпических снов: ${stats.epic}\n`
      contextInfo += `• С интерпретацией: ${stats.withInterpretation}\n`
      contextInfo += `• С изображениями: ${stats.withImage}\n`
      
      if (dreamContext.lastDream) {
        const last = dreamContext.lastDream
        contextInfo += `\nПОСЛЕДНИЙ СОН:\n`
        contextInfo += `• Название: "${last.title}"\n`
        contextInfo += `• Дата: ${last.date}\n`
        contextInfo += `• Тип: ${last.dream_type}\n`
        if (last.emotion) contextInfo += `• Эмоция: ${last.emotion}\n`
        if (last.archetype) contextInfo += `• Архетип: ${last.archetype}\n`
        contextInfo += `• Содержание: ${last.content.substring(0, 500)}${last.content.length > 500 ? '...' : ''}\n`
        if (last.has_interpretation && last.interpretation) {
          contextInfo += `• Уже есть интерпретация: да\n`
        }
      }
      
      contextInfo += `\nВАЖНО: Если пользователь просит интерпретировать "последний сон" или "мой последний сон", используй информацию о последнем сне из контекста выше.`
    } else {
      contextInfo = `\n\nКОНТЕКСТ: У пользователя пока нет сохранённых снов в дневнике.`
    }

    // Формируем системный промпт для MorpheAI
    const systemPrompt = `Ты — MorpheAI, мудрый и эмпатичный помощник в мире сновидений. Твоя задача — помогать людям понимать свои сны, развивать осознанность во сновидениях и работать с подсознанием.

Твой стиль общения:
• Тёплый, понимающий, но профессиональный
• Используй простой язык, избегай сложных терминов без объяснений
• Будь конкретным и практичным в советах
• Показывай эмпатию и понимание
• Используй примеры и метафоры для лучшего понимания

Твои знания:
• Психология сновидений (Юнг, Фрейд, современные подходы)
• Осознанные сновидения и техники их развития
• Символы и архетипы в снах
• Работа с кошмарами и тревожными снами
• Связь снов с реальной жизнью

${contextInfo}

Отвечай на русском языке, будь полезным и поддерживающим. Используй контекст о снах пользователя для более персонализированных ответов.`

    // Преобразуем сообщения в формат OpenAI
    const openaiMessages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...messages.map((msg: any) => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    ]

    // Запрос к OpenAI API с последней моделью
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Самая последняя модель ChatGPT
        messages: openaiMessages,
        temperature: 0.7,
        max_tokens: 1500
      })
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      console.error('❌ Ошибка OpenAI API:', errorData)
      throw new Error(errorData.error?.message || 'Ошибка OpenAI API')
    }

    const data = await openaiResponse.json()
    const aiMessage = data.choices[0].message.content

    if (!aiMessage) {
      throw new Error('Пустой ответ от OpenAI')
    }

    console.log('✅ Ответ от MorpheAI получен')

    return new Response(
      JSON.stringify({
        success: true,
        message: aiMessage
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
        error: 'Ошибка при обработке сообщения',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
