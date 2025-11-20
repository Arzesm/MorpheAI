# 🚀 Инструкция по запуску MorpheAI

## Системные требования

- Node.js 18.x или выше
- npm или yarn
- Современный браузер (Chrome, Safari, Firefox, Edge)

## Шаги установки

### 1. Установка зависимостей

\`\`\`bash
npm install
\`\`\`

или если используете yarn:

\`\`\`bash
yarn install
\`\`\`

### 2. Настройка переменных окружения (опционально)

Создайте файл \`.env.local\` в корне проекта:

\`\`\`env
# OpenAI API (для будущей интеграции)
OPENAI_API_KEY=your_api_key_here
\`\`\`

### 3. Запуск в режиме разработки

\`\`\`bash
npm run dev
\`\`\`

Приложение будет доступно по адресу: [http://localhost:3000](http://localhost:3000)

### 4. Сборка для продакшена

\`\`\`bash
npm run build
npm start
\`\`\`

## Тестирование PWA

### На компьютере (Chrome)

1. Запустите приложение в режиме продакшена
2. Откройте DevTools (F12)
3. Перейдите на вкладку "Application"
4. Проверьте Service Worker и Manifest

### На мобильном устройстве

#### iOS (Safari)

1. Откройте приложение в Safari
2. Нажмите кнопку "Поделиться"
3. Выберите "На экран «Домой»"
4. Приложение установится как PWA

#### Android (Chrome)

1. Откройте приложение в Chrome
2. Нажмите на меню (три точки)
3. Выберите "Установить приложение"
4. Подтвердите установку

## Структура проекта

\`\`\`
MorpheAI/
├── public/              # Статические файлы
│   ├── manifest.json   # PWA манифест
│   ├── sw.js           # Service Worker
│   └── icon-*.png      # Иконки приложения
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── portal/     # Главная страница
│   │   ├── journal/    # Дневник снов
│   │   ├── meditate/   # Медитации
│   │   ├── knowledge/  # База знаний
│   │   └── chat/       # Чат с AI
│   ├── components/     # React компоненты
│   └── lib/            # Утилиты и константы
└── ...
\`\`\`

## Основные маршруты

- `/portal` - Главная страница с обзором
- `/journal` - Список всех снов
- `/journal/new` - Запись нового сна
- `/journal/[id]` - Детали сна
- `/meditate` - Список медитаций
- `/meditate/[id]` - Плеер медитации
- `/knowledge` - База знаний
- `/knowledge/[id]` - Статья
- `/chat` - Чат с MorpheAI

## Фирменные цвета

Используйте классы Tailwind:

- \`bg-night-deep-blue\` - #0A1120 (фон)
- \`text-mythic-ivory\` - #F2EDE3 (текст)
- \`text-morphe-blue\` - #1E90FF (акценты)
- \`text-light-ai-blue\` - #9CD1F5 (вспомогательные)
- \`text-amethyst-spirit\` - #6A5ACD (мистика)

## Компоненты UI

### Карточки

\`\`\`tsx
<div className="card">
  // Контент
</div>

<div className="card-glass">
  // Стеклянный эффект
</div>
\`\`\`

### Кнопки

\`\`\`tsx
<button className="btn-primary">
  Нажми меня
</button>
\`\`\`

### Поля ввода

\`\`\`tsx
<input className="input-field" placeholder="Введите текст..." />
<textarea className="input-field" placeholder="Текст..." />
\`\`\`

## Проблемы и решения

### Приложение не устанавливается как PWA

1. Проверьте наличие файла \`manifest.json\` в \`public/\`
2. Убедитесь, что Service Worker зарегистрирован
3. Проверьте консоль на наличие ошибок
4. Используйте HTTPS (или localhost)

### Стили не применяются

1. Убедитесь, что Tailwind CSS настроен правильно
2. Проверьте \`tailwind.config.js\`
3. Перезапустите dev сервер

### Иконки не отображаются

1. Установите \`lucide-react\`: \`npm install lucide-react\`
2. Импортируйте иконки: \`import { Icon } from 'lucide-react'\`

## Дальнейшая разработка

### Интеграция OpenAI

1. Получите API ключ на [platform.openai.com](https://platform.openai.com)
2. Добавьте ключ в \`.env.local\`
3. Создайте API роуты в \`src/app/api/\`
4. Реализуйте функции анализа и генерации

### Добавление базы данных

Рекомендуемые решения:
- **Supabase** - PostgreSQL с реалтайм подпиской
- **Firebase** - NoSQL с простой интеграцией
- **PlanetScale** - MySQL serverless

### Аутентификация

Используйте:
- **NextAuth.js** - для различных провайдеров
- **Clerk** - готовое решение с UI
- **Auth0** - enterprise решение

## Полезные команды

\`\`\`bash
# Разработка
npm run dev

# Сборка
npm run build

# Запуск продакшен версии
npm start

# Проверка типов
npx tsc --noEmit

# Форматирование кода
npx prettier --write .
\`\`\`

## Поддержка

Если возникли вопросы:
1. Проверьте документацию в README.md
2. Изучите код примеров в компонентах
3. Обратитесь к команде разработки

---

🌙 **Удачи в разработке!**

