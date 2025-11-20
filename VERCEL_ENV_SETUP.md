# 🔐 Настройка переменных окружения в Vercel

## ⚠️ ВАЖНО: Без этих переменных приложение не будет работать!

---

## 📋 Шаги настройки

### 1️⃣ Откройте настройки проекта в Vercel

1. Перейдите на [vercel.com](https://vercel.com)
2. Войдите в свой аккаунт
3. Откройте проект **MorpheAI**
4. Перейдите в **Settings** → **Environment Variables**

### 2️⃣ Добавьте переменные окружения

Добавьте следующие переменные:

#### **NEXT_PUBLIC_SUPABASE_URL**
```
https://uhmedcjhbgqewmaaxgan.supabase.co
```

#### **NEXT_PUBLIC_SUPABASE_ANON_KEY**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVobWVkY2poYmdxZXdtYWF4Z2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MDUxNDcsImV4cCI6MjA3OTE4MTE0N30._BR61VHIYhXFd6TTiWCgU6Qm26QWUd3AUnseL_IQO9g
```

#### **OPENAI_API_KEY** (для AI функций)
```
your-openai-api-key-here
```

### 3️⃣ Настройте окружения

Для каждой переменной выберите окружения:
- ✅ **Production**
- ✅ **Preview** 
- ✅ **Development** (опционально)

### 4️⃣ Перезапустите деплой

После добавления переменных:
1. Перейдите в **Deployments**
2. Найдите последний деплой
3. Нажмите **"..."** → **"Redeploy"**
4. Или создайте новый коммит и запушьте в репозиторий

---

## ✅ Проверка

После перезапуска деплоя проверьте:

1. **Дневник снов** - должны загружаться сны из Supabase
2. **Чат** - должен работать AI
3. **База знаний** - должны загружаться новости
4. **Создание сна** - должен работать AI интерпретация

---

## 🚨 Если что-то не работает

### Проверьте:
1. ✅ Все переменные добавлены
2. ✅ Выбраны правильные окружения (Production, Preview)
3. ✅ Деплой перезапущен после добавления переменных
4. ✅ Значения переменных скопированы полностью (без пробелов)

### Где найти ключи Supabase:
1. Откройте [Supabase Dashboard](https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan)
2. Перейдите в **Settings** → **API**
3. Скопируйте:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📝 Пример настройки в Vercel

```
Environment Variables:
┌─────────────────────────────┬──────────────────────────────────────────────┐
│ Name                        │ Value                                        │
├─────────────────────────────┼──────────────────────────────────────────────┤
│ NEXT_PUBLIC_SUPABASE_URL    │ https://uhmedcjhbgqewmaaxgan.supabase.co    │
│ NEXT_PUBLIC_SUPABASE_ANON_  │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...     │
│ KEY                         │                                              │
│ OPENAI_API_KEY              │ sk-proj-...                                  │
└─────────────────────────────┴──────────────────────────────────────────────┘
```

---

**🎉 После настройки все функции приложения будут работать!**

