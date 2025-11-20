# ⚡ БЫСТРОЕ РЕШЕНИЕ CORS ОШИБКИ

## 🎯 Проблема
```
Access to fetch at '...generate-dream-image' has been blocked by CORS policy
```

## ✅ Решение

### Функция НЕ развернута! Нужно развернуть через Dashboard.

---

## 📋 3 ПРОСТЫХ ШАГА

### 1️⃣ Откройте Dashboard
```
https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/functions
```

### 2️⃣ Создайте функцию
- Нажмите **"New Function"**
- Имя: `generate-dream-image`
- Скопируйте код из: `supabase/functions/generate-dream-image/index.ts`
- Вставьте и нажмите **"Deploy"**

### 3️⃣ Проверьте
Откройте файл: `CHECK_FUNCTION_STATUS.html`
Или попробуйте сгенерировать изображение в приложении.

---

## 🔗 Полезные ссылки

- **Dashboard Functions**: https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/functions
- **Подробная инструкция**: `SIMPLE_DEPLOY_STEPS.md`
- **Проверка статуса**: Откройте `CHECK_FUNCTION_STATUS.html` в браузере

---

## 💡 Что проверить

✅ Функция называется точно `generate-dream-image`
✅ Код скопирован полностью (93 строки)
✅ Есть секрет `OPENAI_API_KEY` в Settings → Edge Functions
✅ Функция развернута (зелёный статус)

---

## 🎨 После развертывания

1. Обновите страницу: `http://localhost:3000`
2. Откройте любой сон
3. Нажмите **"Сгенерировать"**
4. Подождите 10-30 секунд
5. **Готово!** 🖼️

---

**🚀 Это займёт всего 2-3 минуты!**

