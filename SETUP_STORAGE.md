# 📦 Настройка Supabase Storage для изображений снов

## 🎯 Проблема

URL изображений от DALL-E 3 могут истекать через некоторое время, что приводит к ошибке "Не удалось загрузить изображение". 

## ✅ Решение

Сохраняем изображения в Supabase Storage для постоянного хранения.

---

## 🚀 Автоматическая настройка (РЕКОМЕНДУЕТСЯ)

### Вариант 1: PowerShell скрипт (Windows)

1. Установите переменные окружения:
   ```powershell
   $env:NEXT_PUBLIC_SUPABASE_URL = "https://uhmedcjhbgqewmaaxgan.supabase.co"
   $env:SUPABASE_SERVICE_ROLE_KEY = "ваш-service-role-key"
   ```

2. Запустите скрипт:
   ```powershell
   .\setup-storage.ps1
   ```

### Вариант 2: SQL скрипт (универсальный)

1. Откройте SQL Editor в Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/sql/new
   ```

2. Скопируйте содержимое файла `setup-storage.sql`

3. Вставьте в SQL Editor и нажмите **Run** (F5)

---

## 📋 Ручная настройка (если автоматическая не сработала)

### Шаг 1: Создайте Storage Bucket

1. Откройте Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/storage/buckets
   ```

2. Нажмите **"New bucket"**

3. Заполните форму:
   - **Name**: `dream-images`
   - **Public bucket**: ✅ **Включите** (чтобы изображения были доступны публично)
   - Нажмите **"Create bucket"**

### Шаг 2: Настройте политики доступа

1. После создания bucket, нажмите на него
2. Перейдите на вкладку **"Policies"**
3. Нажмите **"New Policy"**
4. Выберите **"Create a policy from scratch"**
5. Заполните:
   - **Policy name**: `Allow public read access`
   - **Allowed operation**: `SELECT` (чтение)
   - **Policy definition**: 
     ```sql
     true
     ```
   - Нажмите **"Review"** и затем **"Save policy"**

6. Создайте еще одну политику для записи:
   - **Policy name**: `Allow service role upload`
   - **Allowed operation**: `INSERT` (запись)
   - **Policy definition**:
     ```sql
     true
     ```
   - Нажмите **"Review"** и затем **"Save policy"**

### Шаг 3: Добавьте переменную окружения в Supabase

1. Откройте **Edge Functions** → **Settings**:
   ```
   https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/functions
   ```

2. Прокрутите вниз до **"Secrets"**

3. Убедитесь, что есть:
   - `OPENAI_API_KEY` ✅
   - `SUPABASE_SERVICE_ROLE_KEY` ✅ (если нет, добавьте из Settings → API)

4. Если `SUPABASE_SERVICE_ROLE_KEY` нет:
   - Перейдите в **Settings** → **API**
   - Скопируйте **"service_role" key** (НЕ anon key!)
   - Вернитесь в Edge Functions → Settings → Secrets
   - Добавьте новый секрет:
     - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
     - **Value**: вставьте скопированный service_role key

### Шаг 4: Перезапустите Edge Function

1. Откройте функцию `generate-dream-image`:
   ```
   https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/functions/generate-dream-image
   ```

2. Нажмите **"Redeploy"** (или просто сохраните изменения)

---

## ✅ Проверка

После настройки:

1. Сгенерируйте новое изображение для сна
2. Проверьте в консоли браузера (F12):
   - Должен появиться лог: `✅ Изображение сохранено в Storage: ...`
3. Проверьте в Supabase Storage:
   - Откройте bucket `dream-images`
   - Должны появиться файлы с именами типа `dream-images/1234567890-название-сна.png`

---

## 🔧 Если изображения все еще не загружаются

### Вариант 1: Проверьте URL в базе данных

1. Откройте Supabase → Table Editor → `dreams`
2. Найдите сон с проблемным изображением
3. Проверьте поле `image_url`:
   - Если URL начинается с `https://oaidalleapiprodscus...` - это временный URL от OpenAI (может истечь)
   - Если URL начинается с `https://uhmedcjhbgqewmaaxgan.supabase.co/storage/...` - это постоянный URL из Storage ✅

### Вариант 2: Сгенерируйте изображение заново

1. Откройте сон с проблемным изображением
2. Нажмите **"Сгенерировать"** еще раз
3. Новое изображение будет сохранено в Storage

### Вариант 3: Проверьте логи Edge Function

1. Откройте функцию `generate-dream-image` в Supabase Dashboard
2. Перейдите на вкладку **"Logs"**
3. Проверьте, есть ли ошибки при сохранении в Storage

---

## 📝 Примечания

- **Временные URL от OpenAI** истекают через несколько часов/дней
- **Постоянные URL из Supabase Storage** работают всегда
- После настройки Storage все новые изображения будут сохраняться постоянно
- Старые изображения с временными URL нужно будет сгенерировать заново

---

## 🆘 Поддержка

Если проблема не решена:
1. Проверьте логи Edge Function в Supabase Dashboard
2. Убедитесь, что bucket `dream-images` создан и публичен
3. Убедитесь, что `SUPABASE_SERVICE_ROLE_KEY` добавлен в секреты Edge Function

