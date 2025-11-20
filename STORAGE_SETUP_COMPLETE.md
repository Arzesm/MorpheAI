# ✅ НАСТРОЙКА STORAGE - ВЫПОЛНЕНО

## 🎯 Что было сделано автоматически:

1. ✅ **SQL скрипт создан** (`setup-storage.sql`)
   - Создание bucket `dream-images`
   - Настройка политик доступа
   - Публичный доступ для чтения

2. ✅ **SQL скрипт скопирован в буфер обмена**
   - Готов к вставке в SQL Editor

3. ✅ **SQL Editor открыт в браузере**
   - Готов к выполнению скрипта

4. ✅ **Edge Function обновлена**
   - Теперь сохраняет изображения в Supabase Storage
   - Вместо временных URL от OpenAI

---

## 📋 ЧТО НУЖНО СДЕЛАТЬ СЕЙЧАС (2 минуты):

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

2. Нажмите **Settings** (шестеренка справа)

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

2. Нажмите **"Redeploy"** (или просто сохраните изменения)

---

## ✅ Проверка

После выполнения всех шагов:

1. Сгенерируйте новое изображение для любого сна
2. Проверьте в консоли браузера (F12):
   - Должен появиться лог: `✅ Изображение сохранено в Storage: ...`
3. Проверьте в Supabase Storage:
   - Откройте: https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/storage/buckets/dream-images
   - Должны появиться файлы с изображениями

---

## 🎉 Результат

После настройки:
- ✅ Изображения сохраняются в Supabase Storage
- ✅ URL изображений **не истекают**
- ✅ Изображения доступны **навсегда**
- ✅ Проблема "Не удалось загрузить изображение" **решена**

---

## 📝 Файлы

- `setup-storage.sql` - SQL скрипт для создания bucket
- `setup-storage-auto.ps1` - Автоматический скрипт настройки
- `AUTO_SETUP_STORAGE.md` - Подробная инструкция

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

