# ✅ STORAGE SETUP - ГОТОВО К ИСПОЛЬЗОВАНИЮ

## 🎯 Что было сделано:

1. ✅ **SQL скрипт создан** (`setup-storage.sql`)
   - Автоматическое создание bucket `dream-images`
   - Настройка всех политик доступа
   - Готов к выполнению

2. ✅ **Edge Function обновлена**
   - Теперь сохраняет изображения в Supabase Storage
   - Вместо временных URL от OpenAI

3. ✅ **Автоматические скрипты созданы**
   - `setup-storage-auto.ps1` - простой скрипт
   - `setup-storage-full-auto.ps1` - полная автоматизация

4. ✅ **SQL Editor открыт в браузере**
   - SQL скрипт скопирован в буфер обмена
   - Готов к вставке и выполнению

---

## 🚀 БЫСТРЫЙ СТАРТ (2 минуты):

### Шаг 1: Выполните SQL скрипт

1. В открывшемся SQL Editor:
   - Нажмите **Ctrl+V** (вставить скрипт)
   - Нажмите **Run** (F5)
   - Должно появиться сообщение об успехе

### Шаг 2: Добавьте секрет в Edge Functions

1. Откройте:
   ```
   https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/functions
   ```

2. Нажмите **Settings** (шестеренка)

3. Прокрутите до **"Secrets"**

4. Нажмите **"Add new secret"**

5. Заполните:
   - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: получите из Settings → API → service_role key
   - Нажмите **"Save"**

### Шаг 3: Перезапустите Edge Function

1. Откройте функцию `generate-dream-image`:
   ```
   https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/functions/generate-dream-image
   ```

2. Нажмите **"Redeploy"**

---

## ✅ Результат

После выполнения всех шагов:
- ✅ Изображения сохраняются в Supabase Storage
- ✅ URL изображений **не истекают**
- ✅ Проблема "Не удалось загрузить изображение" **решена**

---

## 📝 Файлы

- `setup-storage.sql` - SQL скрипт для создания bucket
- `setup-storage-auto.ps1` - Автоматический скрипт
- `setup-storage-full-auto.ps1` - Полная автоматизация
- `STORAGE_SETUP_COMPLETE.md` - Подробная инструкция
- `AUTO_SETUP_STORAGE.md` - Дополнительная информация

---

## 🆘 Если что-то не работает

1. **Проверьте bucket:**
   - Откройте: https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/storage/buckets
   - Должен быть bucket `dream-images` с галочкой "Public"

2. **Проверьте секреты:**
   - Edge Functions → Settings → Secrets
   - Должен быть `SUPABASE_SERVICE_ROLE_KEY`

3. **Проверьте логи Edge Function:**
   - Откройте функцию `generate-dream-image`
   - Вкладка "Logs"
   - Должны быть логи о сохранении в Storage

4. **Сгенерируйте изображение заново:**
   - Старые изображения с временными URL нужно перегенерировать
   - Новые будут сохраняться в Storage автоматически


