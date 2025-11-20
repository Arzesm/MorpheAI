# 🗄️ Настройка Supabase для MorpheAI

## 📋 Шаги настройки

### 1. Создайте проект на Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите "Start your project"
3. Создайте новый проект:
   - **Name**: MorpheAI
   - **Database Password**: (сохраните пароль!)
   - **Region**: выберите ближайший (Europe West для РФ)

### 2. Получите API ключи

После создания проекта:
1. Перейдите в **Settings** → **API**
2. Скопируйте:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Создайте `.env.local`

Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 🗃️ Создание таблиц в базе данных

### Перейдите в SQL Editor

1. Откройте ваш проект на Supabase
2. Перейдите в **SQL Editor**
3. Нажмите **New query**
4. Вставьте следующий SQL код:

```sql
-- Создание таблицы пользователей (если нужна аутентификация)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Создание таблицы снов
create table if not exists public.dreams (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  title text not null,
  content text not null,
  date date not null default current_date,
  emotion text,
  emotion_emoji text,
  tags text[] default '{}',
  archetype text,
  dream_type text default 'normal',
  has_interpretation boolean default false,
  interpretation jsonb,
  has_image boolean default false,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Создание индексов для быстрого поиска
create index if not exists dreams_user_id_idx on public.dreams(user_id);
create index if not exists dreams_date_idx on public.dreams(date desc);
create index if not exists dreams_tags_idx on public.dreams using gin(tags);

-- Включение Row Level Security (RLS)
alter table public.dreams enable row level security;

-- Политики доступа (пользователи видят только свои сны)
create policy "Users can view their own dreams"
  on public.dreams for select
  using (auth.uid() = user_id);

create policy "Users can insert their own dreams"
  on public.dreams for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own dreams"
  on public.dreams for update
  using (auth.uid() = user_id);

create policy "Users can delete their own dreams"
  on public.dreams for delete
  using (auth.uid() = user_id);

-- Функция для автообновления updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Триггер для автообновления updated_at
create trigger on_dreams_updated
  before update on public.dreams
  for each row
  execute procedure public.handle_updated_at();

-- Создание таблицы медитаций (опционально)
create table if not exists public.meditation_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  meditation_id integer not null,
  duration integer not null, -- в секундах
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Создание таблицы статистики (опционально)
create table if not exists public.user_stats (
  user_id uuid references auth.users on delete cascade primary key,
  total_dreams integer default 0,
  lucid_dreams integer default 0,
  nightmares integer default 0,
  emotional_index numeric(3,1) default 5.0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

5. Нажмите **Run** для выполнения

---

## 📦 Установка зависимостей

```bash
npm install @supabase/supabase-js
```

---

## 🔐 Настройка аутентификации (опционально)

Если хотите добавить регистрацию/вход:

1. Перейдите в **Authentication** → **Providers**
2. Включите нужные провайдеры:
   - Email (по умолчанию)
   - Google
   - GitHub
   - и др.

---

## 🧪 Тестовые данные

Можете добавить тестовые сны в SQL Editor:

```sql
-- Временно отключаем RLS для вставки тестовых данных
alter table public.dreams disable row level security;

insert into public.dreams (title, content, date, emotion, emotion_emoji, tags, archetype, dream_type, has_interpretation)
values 
  ('Полёт над городом', 'Я летел над ночным городом, огни внизу сливались в яркие полосы...', current_date, 'Радость', '😊', array['полёт', 'город', 'свобода'], 'Искатель', 'lucid', true),
  ('Встреча в старом доме', 'Вернулся в дом детства, там были все, кого я давно не видел...', current_date - 2, 'Ностальгия', '🥺', array['дом', 'прошлое', 'семья'], 'Мудрец', 'normal', true),
  ('Путешествие через лес', 'Шёл по лесной тропе, солнце пробивалось сквозь листву...', current_date - 5, 'Спокойствие', '😌', array['лес', 'природа', 'путь'], 'Странник', 'normal', false);

-- Включаем RLS обратно
alter table public.dreams enable row level security;
```

---

## 🔍 Проверка

После выполнения SQL:

1. Перейдите в **Table Editor**
2. Выберите таблицу `dreams`
3. Убедитесь, что таблица создана с нужными колонками

---

## 📝 Структура таблицы `dreams`

| Колонка | Тип | Описание |
|---------|-----|----------|
| id | uuid | Уникальный ID сна |
| user_id | uuid | ID пользователя |
| title | text | Название сна |
| content | text | Полное описание |
| date | date | Дата сна |
| emotion | text | Эмоция (текст) |
| emotion_emoji | text | Эмодзи эмоции |
| tags | text[] | Массив тегов |
| archetype | text | Архетип сна |
| dream_type | text | Тип (normal/lucid/nightmare) |
| has_interpretation | boolean | Есть ли интерпретация |
| interpretation | jsonb | JSON с интерпретацией |
| has_image | boolean | Есть ли изображение |
| image_url | text | URL изображения |
| created_at | timestamp | Дата создания |
| updated_at | timestamp | Дата обновления |

---

## 🚀 Готово!

После настройки Supabase приложение будет:
- ✅ Сохранять сны в базу данных
- ✅ Загружать сны пользователя
- ✅ Обновлять и удалять сны
- ✅ Работать оффлайн (кэш)

---

## 📚 Полезные ссылки

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

