# ⚡ ПРОСТАЯ ИНСТРУКЦИЯ - Развертывание генерации изображений

## 🎯 Что нужно сделать

Функция генерации изображений **НЕ РАЗВЕРНУТА**. Нужно развернуть её через Supabase Dashboard.

---

## 📋 ПОШАГОВАЯ ИНСТРУКЦИЯ

### ✅ Шаг 1: Откройте Supabase Functions

**Скопируйте эту ссылку и откройте в браузере:**

```
https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/functions
```

### ✅ Шаг 2: Нажмите "New Function"

На открывшейся странице найдите и нажмите зелёную кнопку **"New Function"** (обычно справа сверху)

### ✅ Шаг 3: Создайте функцию

В появившемся окне:
1. **Function name**: введите `generate-dream-image`
2. Нажмите **"Create function"** или **"Continue"**

### ✅ Шаг 4: Скопируйте код

**ВАЖНО: Откройте этот файл в проекте:**
```
C:\Users\Max\Desktop\MorpheAI\supabase\functions\generate-dream-image\index.ts
```

**ИЛИ** скопируйте весь код из раздела ниже ⬇️

<details>
<summary>📄 КОД ДЛЯ КОПИРОВАНИЯ (нажмите чтобы развернуть)</summary>

```typescript
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

    // Создаем промпт для DALL-E 3
    const imagePrompt = `Create a photorealistic image based on this dream. DO NOT include any text or words in the image. Make it look like a real photograph.

Dream title: ${title}

Dream description: ${cleanContent.substring(0, 1000)}

Style: Photorealistic, dreamlike atmosphere, cinematic lighting, high detail, no text overlay.`

    console.log('📝 Промпт для генерации:', imagePrompt.substring(0, 200) + '...')

    // Используем DALL-E 3 - самую последнюю модель
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
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
```

</details>

### ✅ Шаг 5: Вставьте код в редактор

1. В Dashboard откроется **редактор кода**
2. **Удалите весь существующий код** (обычно там шаблон)
3. **Вставьте скопированный код**
4. Убедитесь, что код вставился полностью (должно быть ~93 строки)

### ✅ Шаг 6: Deploy функции

1. Найдите кнопку **"Deploy"** (обычно синяя, справа сверху)
2. Нажмите **"Deploy"**
3. Подождите 10-30 секунд пока функция развернётся
4. Должно появиться уведомление **"Function deployed successfully"**

### ✅ Шаг 7: Проверка работы

1. Вернитесь в приложение: `http://localhost:3000`
2. Откройте любой сон
3. Нажмите **"Сгенерировать"** в секции "Визуализация сна"
4. Если всё правильно - через 10-30 секунд появится изображение! 🎨

---

## ❓ ЧТО ДЕЛАТЬ ЕСЛИ НЕ РАБОТАЕТ

### 🔴 Ошибка "Function not found"

**Решение:**
- Убедитесь, что функция называется точно `generate-dream-image` (без опечаток)
- Проверьте, что функция развернута (зелёный статус в списке)

### 🔴 Ошибка "OPENAI_API_KEY is not set"

**Решение:**
1. В Dashboard перейдите: **Settings** → **Edge Functions** → **Secrets**
2. Найдите секрет `OPENAI_API_KEY`
3. Если его нет - добавьте:
   - Name: `OPENAI_API_KEY`
   - Value: (ваш ключ OpenAI, тот же что для интерпретации)

### 🔴 Всё ещё CORS ошибка

**Решение:**
- Убедитесь, что код вставлен **полностью**
- Обратите внимание на строки 8-11 (corsHeaders должны быть)
- Пересоздайте функцию заново

### 🔴 "Insufficient quota" или "billing"

**Решение:**
- Пополните баланс OpenAI: https://platform.openai.com/account/billing
- Стоимость: $0.04 (~2.5₽) за изображение

---

## 🎬 СКРИНШОТЫ (как должно выглядеть)

### В списке функций:
```
✅ interpret-dream (deployed)
✅ generate-dream-image (deployed) ← должна появиться
```

### В редакторе функции:
```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts'

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  ...
```

---

## 📞 НУЖНА ПОМОЩЬ?

Если что-то не получается:

1. **Сделайте скриншот** того что видите в Dashboard
2. **Скопируйте ошибку** из консоли браузера (F12)
3. **Напишите** мне и я помогу

---

## ⚡ БЫСТРАЯ ПРОВЕРКА

После развертывания проверьте что функция появилась:

```
https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/functions
```

Должно быть **2 функции**:
- ✅ `interpret-dream`
- ✅ `generate-dream-image` ← новая

---

**🎉 После развертывания всё заработает!**

