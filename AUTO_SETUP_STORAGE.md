# 🚀 АВТОМАТИЧЕСКАЯ НАСТРОЙКА STORAGE

## ⚡ Быстрый старт

### Шаг 1: Получите Service Role Key

1. Откройте Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/settings/api
   ```

2. Найдите раздел **"Project API keys"**

3. Скопируйте **"service_role" key** (НЕ anon key!)

### Шаг 2: Запустите PowerShell скрипт

```powershell
# Установите переменные
$env:NEXT_PUBLIC_SUPABASE_URL = "https://uhmedcjhbgqewmaaxgan.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY = "ваш-service-role-key-здесь"

# Запустите скрипт
.\setup-storage.ps1
```

### Шаг 3: Выполните SQL скрипт

1. Откройте SQL Editor:
   ```
   https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/sql/new
   ```

2. Откройте файл `setup-storage.sql` в проекте

3. Скопируйте весь код и вставьте в SQL Editor

4. Нажмите **Run** (F5)

### Шаг 4: Добавьте секрет в Edge Functions

1. Откройте Edge Functions:
   ```
   https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/functions
   ```

2. Нажмите **Settings** (шестеренка)

3. Прокрутите до **"Secrets"**

4. Нажмите **"Add new secret"**

5. Заполните:
   - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: вставьте service_role key из Шага 1

6. Нажмите **"Save"**

### Шаг 5: Перезапустите Edge Function

1. Откройте функцию `generate-dream-image`:
   ```
   https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/functions/generate-dream-image
   ```

2. Нажмите **"Redeploy"** (или просто сохраните изменения)

---

## ✅ Проверка

После выполнения всех шагов:

1. Сгенерируйте новое изображение для сна
2. Проверьте в консоли браузера (F12):
   - Должен появиться лог: `✅ Изображение сохранено в Storage: ...`
3. Проверьте в Supabase Storage:
   - Откройте: https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/storage/buckets/dream-images
   - Должны появиться файлы с именами типа `dream-images/1234567890-название-сна.png`

---

## 🐛 Решение проблем

### Ошибка: "Bucket already exists"
✅ Это нормально, bucket уже создан. Продолжайте с Шага 3.

### Ошибка: "Permission denied"
✅ Убедитесь, что используете **service_role key**, а не anon key.

### Ошибка: "Storage bucket not found"
✅ Выполните SQL скрипт вручную (Шаг 3).

### Изображения все еще не загружаются
✅ Проверьте:
1. Bucket создан и публичен
2. `SUPABASE_SERVICE_ROLE_KEY` добавлен в секреты Edge Functions
3. Edge Function перезапущен
4. Сгенерируйте изображение заново

---

## 📝 Файлы

- `setup-storage.ps1` - PowerShell скрипт для автоматической настройки
- `setup-storage.sql` - SQL скрипт для создания bucket и политик
- `AUTO_SETUP_STORAGE.md` - эта инструкция


