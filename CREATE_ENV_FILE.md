# 🔐 Создайте файл .env.local

## ⚠️ ВАЖНО: Сделайте это вручную

Файл `.env.local` нужно создать вручную в корне проекта.

---

## 📝 Шаги:

### 1. Создайте файл `.env.local`

В корне проекта (рядом с `package.json`) создайте новый файл с именем:
```
.env.local
```

### 2. Скопируйте в него этот текст:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://uhmedcjhbgqewmaaxgan.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

### 3. Сохраните файл

---

## 💻 Как создать файл в VS Code:

1. Кликните правой кнопкой в Explorer (слева)
2. Выберите "New File"
3. Введите имя: `.env.local`
4. Вставьте текст выше
5. Сохраните (Ctrl+S / Cmd+S)

---

## ✅ Проверка:

Структура проекта должна выглядеть так:

```
MorpheAI/
├── .env.local          ← ВОТ ЭТОТ ФАЙЛ
├── package.json
├── next.config.js
├── CREATE_TABLES.sql
└── ...
```

---

## 🚀 После создания файла:

Выполните команды:

```bash
# 1. Установите Supabase
npm install @supabase/supabase-js

# 2. Запустите приложение
npm run dev
```

---

✨ **Файл `.env.local` не будет закоммичен в Git (это правильно для безопасности)!**

