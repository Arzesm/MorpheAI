# 📂 Структура проекта MorpheAI

## 🌳 Дерево файлов

```
MorpheAI/
│
├── 📄 README.md                    # Основная документация проекта
├── 📄 QUICKSTART.md                # Быстрый старт (3 шага)
├── 📄 SETUP.md                     # Детальная инструкция по настройке
├── 📄 FEATURES.md                  # Обзор всех функций
├── 📄 ICONS-GUIDE.md               # Гайд по созданию иконок
├── 📄 PROJECT-STRUCTURE.md         # Этот файл
│
├── 📦 package.json                 # Зависимости проекта
├── 📦 tsconfig.json                # Конфигурация TypeScript
├── 📦 next.config.js               # Конфигурация Next.js
├── 📦 tailwind.config.js           # Конфигурация Tailwind CSS
├── 📦 postcss.config.js            # Конфигурация PostCSS
│
├── 📁 public/                      # Статические файлы
│   ├── 📄 manifest.json           # PWA манифест
│   ├── 📄 sw.js                   # Service Worker
│   ├── 🖼️ icon-192.png            # Иконка 192x192 (placeholder)
│   └── 🖼️ icon-512.png            # Иконка 512x512 (placeholder)
│
└── 📁 src/                         # Исходный код
    │
    ├── 📁 app/                     # Next.js App Router
    │   │
    │   ├── 📄 page.tsx            # Redirect на /portal
    │   ├── 📄 layout.tsx          # Главный layout с навигацией
    │   ├── 📄 globals.css         # Глобальные стили
    │   ├── 📄 register-sw.tsx     # Регистрация Service Worker
    │   │
    │   ├── 📁 portal/             # 🏠 Главная страница
    │   │   └── 📄 page.tsx
    │   │
    │   ├── 📁 journal/            # 📖 Дневник снов
    │   │   ├── 📄 page.tsx        # Список снов
    │   │   ├── 📁 new/
    │   │   │   └── 📄 page.tsx    # Запись нового сна
    │   │   └── 📁 [id]/
    │   │       └── 📄 page.tsx    # Детали сна
    │   │
    │   ├── 📁 meditate/           # 🧘 Медитации
    │   │   ├── 📄 page.tsx        # Список медитаций
    │   │   └── 📁 [id]/
    │   │       └── 📄 page.tsx    # Плеер медитации
    │   │
    │   ├── 📁 knowledge/          # 📚 База знаний
    │   │   ├── 📄 page.tsx        # Список статей
    │   │   └── 📁 [id]/
    │   │       └── 📄 page.tsx    # Просмотр статьи
    │   │
    │   └── 📁 chat/               # 💬 Чат с AI
    │       └── 📄 page.tsx
    │
    ├── 📁 components/              # React компоненты
    │   │
    │   ├── 📄 BottomNav.tsx       # Нижняя навигация (5 вкладок)
    │   │
    │   ├── 📁 portal/             # Компоненты главной страницы
    │   │   ├── 📄 MoonPhase.tsx
    │   │   ├── 📄 ArchetypeOfDay.tsx
    │   │   ├── 📄 MonthlyStats.tsx
    │   │   ├── 📄 DreamCalendar.tsx
    │   │   ├── 📄 RecentDreams.tsx
    │   │   ├── 📄 RecommendedArticles.tsx
    │   │   └── 📄 SleepTips.tsx
    │   │
    │   ├── 📁 journal/            # Компоненты дневника
    │   │   ├── 📄 DreamCard.tsx
    │   │   └── 📄 FilterModal.tsx
    │   │
    │   ├── 📁 meditate/           # Компоненты медитаций
    │   │   ├── 📄 MeditationCard.tsx
    │   │   ├── 📄 SoundCard.tsx
    │   │   └── 📄 TimerModal.tsx
    │   │
    │   ├── 📁 knowledge/          # Компоненты базы знаний
    │   │   └── 📄 ArticleCard.tsx
    │   │
    │   └── 📁 chat/               # Компоненты чата
    │       ├── 📄 ChatMessage.tsx
    │       └── 📄 QuickActionButton.tsx
    │
    └── 📁 lib/                     # Утилиты и константы
        ├── 📄 utils.ts            # Функции-помощники
        └── 📄 constants.ts        # Константы приложения
```

---

## 📊 Статистика

### Файлы по типам:

- **Страницы** (pages): 10 файлов
- **Компоненты** (components): 21 файл
- **Утилиты** (lib): 2 файла
- **Конфигурации**: 5 файлов
- **Документация**: 6 файлов
- **PWA файлы**: 3 файла

**Всего**: ~47 файлов

### Строки кода:

- TypeScript/TSX: ~3000+ строк
- CSS: ~200 строк
- Конфигурации: ~100 строк

**Всего**: ~3300+ строк

---

## 🗺️ Маршруты приложения

### Основные маршруты:

```
/                    → Redirect на /portal
/portal              → 🏠 Главная страница
/journal             → 📖 Список снов
/journal/new         → ✍️ Запись нового сна
/journal/[id]        → 📄 Детали сна
/meditate            → 🧘 Список медитаций
/meditate/[id]       → ▶️ Плеер медитации
/knowledge           → 📚 База знаний
/knowledge/[id]      → 📖 Статья
/chat                → 💬 Чат с MorpheAI
```

### API маршруты (для будущей интеграции):

```
/api/chat            → GPT чат
/api/analyze-dream   → Анализ снов
/api/generate-image  → DALL-E генерация
/api/transcribe      → Whisper распознавание
```

---

## 📦 Зависимости

### Production:

```json
{
  "next": "^14.0.4",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "lucide-react": "^0.294.0"
}
```

### Development:

```json
{
  "@types/node": "^20.10.5",
  "@types/react": "^18.2.45",
  "@types/react-dom": "^18.2.18",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.32",
  "tailwindcss": "^3.4.0",
  "typescript": "^5.3.3"
}
```

---

## 🎨 Стили и дизайн

### Глобальные стили:

- `src/app/globals.css` - основные стили
  - Цветовые переменные
  - Анимации (fade-in, slide-up)
  - Кастомный scrollbar
  - Классы card, btn-primary, input-field

### Tailwind конфигурация:

- Расширенная цветовая палитра (5 фирменных цветов)
- Кастомные шрифты
- Настройки для mobile-first

---

## 🔧 Конфигурации

### Next.js (`next.config.js`):

```javascript
reactStrictMode: true
swcMinify: true
```

### TypeScript (`tsconfig.json`):

```json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Tailwind (`tailwind.config.js`):

- Сканирует: `src/**/*.{js,ts,jsx,tsx}`
- Расширенные цвета
- Кастомные шрифты

---

## 📱 PWA файлы

### Manifest (`public/manifest.json`):

- Название: MorpheAI
- Иконки: 8 размеров
- Display: standalone
- Theme color: #0A1120

### Service Worker (`public/sw.js`):

- Стратегия: Cache-First
- Кэширует все основные маршруты
- Обновление кэша при активации

### Регистрация SW (`src/app/register-sw.tsx`):

- Автоматическая регистрация при загрузке
- Client component

---

## 🎯 Компоненты по функционалу

### Навигация:

- `BottomNav.tsx` - нижняя панель с 5 вкладками

### Главная страница (7 компонентов):

1. `MoonPhase.tsx` - фаза луны
2. `ArchetypeOfDay.tsx` - архетип дня
3. `MonthlyStats.tsx` - статистика месяца
4. `DreamCalendar.tsx` - календарь снов
5. `RecentDreams.tsx` - последние сны
6. `RecommendedArticles.tsx` - рекомендации
7. `SleepTips.tsx` - советы по сну

### Дневник снов (2 компонента):

1. `DreamCard.tsx` - карточка сна
2. `FilterModal.tsx` - фильтры

### Медитации (3 компонента):

1. `MeditationCard.tsx` - карточка медитации
2. `SoundCard.tsx` - звук природы
3. `TimerModal.tsx` - таймер

### База знаний (1 компонент):

1. `ArticleCard.tsx` - карточка статьи

### Чат (2 компонента):

1. `ChatMessage.tsx` - сообщение
2. `QuickActionButton.tsx` - быстрая кнопка

---

## 🛠 Утилиты

### `src/lib/utils.ts`:

Функции:
- `formatDate()` - форматирование даты
- `formatTime()` - форматирование времени
- `getMoonPhase()` - расчет фазы луны
- `getZodiacSign()` - знак зодиака
- `getRandomArchetype()` - случайный архетип
- `calculateSleepQuality()` - качество сна
- `classifyDreamType()` - тип сна

### `src/lib/constants.ts`:

Константы:
- `COLORS` - цветовая палитра
- `EMOTIONS` - список эмоций
- `ARCHETYPES` - 12 архетипов
- `DREAM_TYPES` - типы снов
- `MEDITATION_CATEGORIES` - категории медитаций
- `KNOWLEDGE_CATEGORIES` - категории знаний
- `NATURE_SOUNDS` - звуки природы
- `APP_CONFIG` - конфигурация приложения

---

## 📖 Документация

### Для разработчиков:

1. **README.md** - полное описание проекта
2. **SETUP.md** - детальная инструкция по настройке
3. **FEATURES.md** - обзор всех функций
4. **PROJECT-STRUCTURE.md** - структура проекта (этот файл)

### Для быстрого старта:

5. **QUICKSTART.md** - запуск за 3 шага
6. **ICONS-GUIDE.md** - создание иконок

---

## 🔐 Безопасность

### Файлы игнорируются (.gitignore):

- `node_modules/`
- `.next/`
- `.env*.local`
- `*.tsbuildinfo`

### Рекомендации:

- Не коммитьте `.env.local` с API ключами
- Используйте переменные окружения для секретов
- В продакшене используйте HTTPS

---

## 🚀 Деплой

### Рекомендуемые платформы:

1. **Vercel** (рекомендуется)
   - Оптимизировано для Next.js
   - Автоматический CI/CD
   - Бесплатный SSL

2. **Netlify**
   - Хороший для статики
   - PWA поддержка

3. **Railway/Render**
   - Для full-stack с БД

### Переменные окружения:

Не забудьте добавить в settings:
- `OPENAI_API_KEY`
- `DATABASE_URL`
- `NEXTAUTH_SECRET`

---

✅ **Проект полностью структурирован и готов к разработке!**

