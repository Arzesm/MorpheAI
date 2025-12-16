// Constants for MorpheAI application

export const COLORS = {
  nightDeepBlue: '#0A1120',
  mythicIvory: '#F2EDE3',
  morpheBlue: '#1E90FF',
  lightAIBlue: '#9CD1F5',
  amethystSpirit: '#6A5ACD'
} as const

export const EMOTIONS = [
  { name: 'Радость', emoji: '😊', color: 'text-light-ai-blue' },
  { name: 'Спокойствие', emoji: '😌', color: 'text-morphe-blue' },
  { name: 'Тревога', emoji: '😰', color: 'text-amethyst-spirit' },
  { name: 'Страх', emoji: '😨', color: 'text-red-500' },
  { name: 'Грусть', emoji: '😢', color: 'text-blue-400' },
  { name: 'Удивление', emoji: '😲', color: 'text-light-ai-blue' },
  { name: 'Ностальгия', emoji: '🥺', color: 'text-amethyst-spirit' },
  { name: 'Экстаз', emoji: '😍', color: 'text-morphe-blue' }
] as const

export const ARCHETYPES = [
  { name: 'Искатель', icon: '🔮', description: 'Стремление к познанию и истине' },
  { name: 'Мудрец', icon: '📚', description: 'Накопление знаний и опыта' },
  { name: 'Странник', icon: '🌍', description: 'Путешествие и исследование' },
  { name: 'Герой', icon: '⚔️', description: 'Преодоление препятствий' },
  { name: 'Творец', icon: '🎨', description: 'Создание и самовыражение' },
  { name: 'Правитель', icon: '👑', description: 'Контроль и порядок' },
  { name: 'Маг', icon: '🪄', description: 'Трансформация реальности' },
  { name: 'Любовник', icon: '❤️', description: 'Страсть и связи' },
  { name: 'Бунтарь', icon: '⚡', description: 'Революция и перемены' },
  { name: 'Заботливый', icon: '🤗', description: 'Помощь и поддержка' },
  { name: 'Шут', icon: '🃏', description: 'Радость и спонтанность' },
  { name: 'Невинный', icon: '🌟', description: 'Чистота и простота' }
] as const

export const DREAM_TYPES = [
  { id: 'normal', name: 'Обычный', color: 'bg-morphe-blue' },
  { id: 'lucid', name: 'Осознанный', color: 'bg-amethyst-spirit' },
  { id: 'nightmare', name: 'Кошмар', color: 'bg-red-500' },
  { id: 'recurring', name: 'Повторяющийся', color: 'bg-light-ai-blue' },
  { id: 'prophetic', name: 'Вещий', color: 'bg-purple-500' }
] as const

export const MEDITATION_CATEGORIES = [
  { id: 'sleep', name: 'Для сна', icon: '🌙' },
  { id: 'lucid', name: 'Осознанные сны', icon: '✨' },
  { id: 'relaxation', name: 'Расслабление', icon: '😌' },
  { id: 'visualization', name: 'Визуализация', icon: '🎨' },
  { id: 'breathwork', name: 'Дыхание', icon: '💨' }
] as const

export const KNOWLEDGE_CATEGORIES = [
  { id: 'science', name: 'Наука', icon: '🧪' },
  { id: 'practice', name: 'Практика', icon: '🌙' },
  { id: 'psychology', name: 'Психология', icon: '🧠' },
  { id: 'symbols', name: 'Символы', icon: '🔮' },
  { id: 'mythology', name: 'Мифология', icon: '🏛️' }
] as const

export const NATURE_SOUNDS = [
  { id: 'rain', name: 'Дождь', icon: '🌧️' },
  { id: 'ocean', name: 'Море', icon: '🌊' },
  { id: 'forest', name: 'Лес', icon: '🌲' },
  { id: 'wind', name: 'Ветер', icon: '🍃' },
  { id: 'fire', name: 'Огонь', icon: '🔥' },
  { id: 'birds', name: 'Птицы', icon: '🐦' },
  { id: 'whitenoise', name: 'Белый шум', icon: '⚪' },
  { id: 'thunder', name: 'Гроза', icon: '⚡' }
] as const

export const APP_CONFIG = {
  name: 'MorpheAI',
  version: '1.0.0',
  description: 'Dream Journal & Meditation App',
  author: 'MorpheAI Team',
  social: {
    twitter: '@morpheai',
    instagram: '@morpheai',
    website: 'https://morpheai.com'
  }
} as const

