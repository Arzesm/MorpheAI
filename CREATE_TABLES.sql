-- SQL скрипт для создания таблиц в Supabase
-- Скопируйте и выполните в SQL Editor на supabase.com

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
create index if not exists dreams_created_at_idx on public.dreams(created_at desc);

-- Включение Row Level Security (RLS)
alter table public.dreams enable row level security;

-- Политики доступа
-- ВАЖНО: Временно разрешаем доступ всем для тестирования
-- После добавления аутентификации нужно будет изменить на auth.uid()

create policy "Enable read access for all users"
  on public.dreams for select
  using (true);

create policy "Enable insert for all users"
  on public.dreams for insert
  with check (true);

create policy "Enable update for all users"
  on public.dreams for update
  using (true);

create policy "Enable delete for all users"
  on public.dreams for delete
  using (true);

-- Функция для автообновления updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Триггер для автообновления updated_at
drop trigger if exists on_dreams_updated on public.dreams;
create trigger on_dreams_updated
  before update on public.dreams
  for each row
  execute procedure public.handle_updated_at();

-- Вставка тестовых данных
insert into public.dreams (title, content, date, emotion, emotion_emoji, tags, archetype, dream_type, has_interpretation)
values 
  (
    'Полёт над городом',
    'Я летел над ночным городом. Огни внизу сливались в яркие полосы, образуя причудливые узоры. Ветер свободно обдувал лицо, и я чувствовал невероятную лёгкость. Постепенно я начал осознавать, что сплю. Это осознание придало мне ещё больше сил, и я взмыл выше, к облакам.',
    current_date,
    'Радость',
    '😊',
    array['полёт', 'город', 'свобода'],
    'Искатель',
    'lucid',
    true
  ),
  (
    'Встреча в старом доме',
    'Вернулся в дом детства, там были все, кого я давно не видел. Атмосфера была тёплой и уютной, хотя дом выглядел немного иначе, чем я помнил.',
    current_date - interval '2 days',
    'Ностальгия',
    '🥺',
    array['дом', 'прошлое', 'семья'],
    'Мудрец',
    'normal',
    true
  ),
  (
    'Путешествие через лес',
    'Шёл по лесной тропе, солнце пробивалось сквозь листву. Птицы пели, и было очень спокойно. Тропа вела куда-то вверх, к горам.',
    current_date - interval '5 days',
    'Спокойствие',
    '😌',
    array['лес', 'природа', 'путь'],
    'Странник',
    'normal',
    false
  ),
  (
    'Преследование в темноте',
    'Бежал по тёмным улицам, кто-то преследовал меня. Сердце билось очень быстро. Пытался спрятаться, но преследователь всегда находил меня.',
    current_date - interval '10 days',
    'Тревога',
    '😰',
    array['темнота', 'страх', 'бег'],
    'Герой',
    'nightmare',
    true
  );

-- Проверка: выводим все сны
select * from public.dreams order by date desc;

