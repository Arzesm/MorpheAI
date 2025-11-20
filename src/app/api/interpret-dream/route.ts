import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json()

    if (!title || !content) {
      console.error('❌ Отсутствуют обязательные поля:', { title, content })
      return NextResponse.json(
        { error: 'Название и содержание сна обязательны' },
        { status: 400 }
      )
    }

    console.log('🤖 Запрос интерпретации сна:', title)
    console.log('🔑 OpenAI Key доступен:', !!process.env.OPENAI_API_KEY)

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview", // Используем проверенную модель GPT-4 Turbo
      messages: [
        {
          role: "system",
          content: `Ты - профессиональный толкователь снов и психолог, специализирующийся на анализе сновидений с точки зрения психологии Юнга и современной онейрологии. 

Твоя задача - проанализировать сон и предоставить:
1. Краткое резюме (2-3 предложения)
2. Список ключевых символов с их значениями (3-5 символов)
3. Практические рекомендации (3-4 совета)

Отвечай на русском языке, используй мягкий, понимающий тон. Фокусируйся на позитивных интерпретациях и возможностях для роста.`
        },
        {
          role: "user",
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
      response_format: { type: "json_object" }
    })

    const responseText = completion.choices[0].message.content
    console.log('✅ Интерпретация получена')

    if (!responseText) {
      throw new Error('Пустой ответ от OpenAI')
    }

    const interpretation = JSON.parse(responseText)

    return NextResponse.json({
      success: true,
      interpretation
    })

  } catch (error: any) {
    console.error('❌ Ошибка OpenAI API:', error)
    console.error('Тип ошибки:', error.constructor.name)
    console.error('Сообщение:', error.message)
    if (error.response) {
      console.error('Response status:', error.response.status)
      console.error('Response data:', error.response.data)
    }
    
    let errorMessage = 'Ошибка при интерпретации сна'
    let errorDetails = error.message
    
    // Специфичные сообщения для разных типов ошибок
    if (error.message?.includes('API key')) {
      errorMessage = 'Ошибка API ключа OpenAI'
      errorDetails = 'Проверьте корректность OPENAI_API_KEY в .env.local'
    } else if (error.message?.includes('model')) {
      errorMessage = 'Ошибка модели'
      errorDetails = 'Модель недоступна или неправильно указана'
    } else if (error.message?.includes('quota') || error.message?.includes('billing')) {
      errorMessage = 'Превышен лимит API'
      errorDetails = 'Проверьте баланс аккаунта OpenAI'
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
        fullError: error.message
      },
      { status: 500 }
    )
  }
}

