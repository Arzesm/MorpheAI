# 🚀 БЫСТРЫЙ ЗАПУСК AI ИНТЕРПРЕТАЦИИ

## ✨ Теперь работает БЕЗ VPN через Supabase!

---

## 📋 ВЫПОЛНИТЕ ЭТИ 5 КОМАНД:

Откройте PowerShell в папке проекта и выполните:

### 1️⃣ Установите Supabase CLI

```powershell
# Через Scoop (рекомендуется)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Или скачайте:** https://github.com/supabase/cli/releases

---

### 2️⃣ Войдите в Supabase

```bash
supabase login
```

Откроется браузер → авторизуйтесь

---

### 3️⃣ Свяжите проект

```bash
supabase link --project-ref uhmedcjhbgqewmaaxgan
```

Введите пароль БД при запросе

---

### 4️⃣ Добавьте OpenAI ключ

```bash
supabase secrets set OPENAI_API_KEY=your-openai-api-key-here
```

---

### 5️⃣ Деплой Edge Function

```bash
supabase functions deploy interpret-dream
```

Дождитесь:
```
✅ Deployed Function interpret-dream
```

---

## ✅ ГОТОВО!

Теперь перезапустите приложение:

```bash
npm run dev
```

---

## 🎯 КАК ИСПОЛЬЗОВАТЬ:

1. Откройте **http://localhost:3000**
2. **Дневник снов** → **"+"**
3. Заполните сон
4. **Включите переключатель "AI интерпретация"**
5. Нажмите **"Сохранить"**
6. ✅ **Работает БЕЗ VPN!** (через серверы Supabase)

---

## 💡 Что изменилось:

### **Раньше:**
```
Браузер → OpenAI API
         ❌ Блокировка 403
```

### **Теперь:**
```
Браузер → Supabase Edge Function → OpenAI API
                                   ✅ Работает!
```

---

## 📊 Преимущества:

✅ **Работает в любом регионе** (запросы с серверов Supabase)
✅ **Не нужен VPN**
✅ **API ключ в безопасности** (на сервере, не в коде)
✅ **Быстрее** (серверы ближе к OpenAI)

---

## 🐛 Если что-то не работает:

### "supabase: command not found"
```bash
# Перезапустите PowerShell после установки
```

### "Failed to deploy"
```bash
# Попробуйте еще раз
supabase functions deploy interpret-dream --no-verify-jwt
```

### "Secret not found"
```bash
# Проверьте секреты
supabase secrets list

# Должен быть OPENAI_API_KEY
```

---

## 📖 Подробная документация:

См. файл `SUPABASE_EDGE_FUNCTION_SETUP.md`

---

## 🎉 ВСЁ ГОТОВО!

Теперь AI интерпретация работает через Supabase и обходит региональные блокировки!

**🌙 MorpheAI - Работает везде!**

