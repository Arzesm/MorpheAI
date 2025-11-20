import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts'

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { title, content } = await req.json()

    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: 'Название и содержание сна обязательны' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('🎨 Генерация изображения для сна:', title)
    console.log('🔑 OpenAI Key доступен:', !!Deno.env.get('OPENAI_API_KEY'))

    // Извлекаем чистый текст из HTML
    const cleanContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

    console.log('🌐 Создание безопасного промпта через GPT-4...')
    
    // Используем указанный системный промпт на русском
    const systemPrompt = `Создай фотореалистичное изображение, основанное строго на описании сна ниже.

Передай атмосферу, эмоции, детали и символы сна максимально точно.

Не добавляй никакого текста на изображение.

Используй художественный стиль "реалистичная кинематографическая визуализация".

Сцена должна быть глубокой, объёмной, с правильным светом, тенями и фактурой.

Все объекты должны соответствовать описанию сна, без домыслов, не добавляй ничего лишнего.`

    // GPT-4 создаёт безопасный английский промпт, следуя русским инструкциям
    const promptCreationResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an image prompt generator for DALL-E 3. Follow these instructions strictly (translated from Russian):

${systemPrompt}

Create a safe, detailed English prompt for DALL-E 3 that follows all these requirements. Focus on visual elements, atmosphere, emotions, details, symbols. Use realistic cinematic visualization style. Deep, volumetric scene with proper lighting, shadows, texture. Match the dream description exactly, no assumptions or additions. No text in image.`
        },
        {
          role: "user",
          content: `Описание сна:
Название: ${title}

Содержание: ${cleanContent.substring(0, 1000)}`
        }
      ],
      max_tokens: 300,
      temperature: 0.5
    })

    const imagePrompt = promptCreationResponse.choices[0].message.content || 
      "A photorealistic, cinematic dream scene with volumetric lighting, deep shadows, detailed textures, realistic visualization style"

    console.log('✅ Промпт создан по русским инструкциям:', imagePrompt.substring(0, 150) + '...')

    // Используем DALL-E 3 - самую последнюю модель
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard", // можно "hd" для лучшего качества
      style: "natural" // natural или vivid
    })

    const imageUrl = response.data[0].url
    const revisedPrompt = response.data[0].revised_prompt

    console.log('✅ Изображение сгенерировано')
    console.log('🔗 URL:', imageUrl)

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl,
        revisedPrompt
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error: any) {
    console.error('❌ Ошибка генерации изображения:', error)

    return new Response(
      JSON.stringify({
        error: 'Ошибка при генерации изображения',
        details: error.message,
        fullError: error.toString()
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  }
})

