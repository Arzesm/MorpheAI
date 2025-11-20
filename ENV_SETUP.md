# 🔐 Настройка переменных окружения

## Создайте файл `.env.local`

В корне проекта создайте файл `.env.local` и добавьте следующие переменные:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

---

## 📝 Где получить ключи Supabase

### 1. Создайте проект
- Перейдите на [supabase.com](https://supabase.com)
- Создайте новый проект

### 2. Получите ключи
1. Откройте ваш проект
2. Перейдите в **Settings** → **API**
3. Скопируйте:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Добавьте в `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

---

## 🗄️ Создание таблиц

После получения ключей:

1. Откройте **SQL Editor** в Supabase
2. Выполните SQL из файла `SUPABASE-SETUP.md`
3. Это создаст все необходимые таблицы

---

## ✅ Проверка

Запустите приложение:

```bash
npm install
npm run dev
```

Если все настроено правильно:
- ✅ Приложение запустится без ошибок
- ✅ Сны можно будет создавать, редактировать и удалять
- ✅ Данные будут сохраняться в Supabase

---

## 🚨 Частые ошибки

### Ошибка: "Invalid API key"
- Проверьте, что ключи скопированы полностью
- Убедитесь, что используете `anon public` ключ, а не `service_role`

### Ошибка: "Table doesn't exist"
- Выполните SQL из `SUPABASE-SETUP.md`
- Проверьте в Table Editor, что таблица `dreams` создана

### Приложение не видит переменные окружения
- Перезапустите dev сервер после создания `.env.local`
- Убедитесь, что файл называется именно `.env.local`

---

## 🔒 Безопасность

⚠️ **НИКОГДА не коммитьте `.env.local` в Git!**

Файл `.env.local` уже добавлен в `.gitignore`, но убедитесь:

```bash
# .gitignore
.env*.local
.env
```

