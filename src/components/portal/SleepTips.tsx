'use client'

import { Lightbulb } from 'lucide-react'
import { useState, useEffect } from 'react'

const ALL_TIPS = [
  { title: 'Регулярный режим', description: 'Ложитесь и вставайте в одно и то же время', icon: '🕐' },
  { title: 'Тёмная комната', description: 'Используйте плотные шторы или маску', icon: '🌃' },
  { title: 'Без телефонов', description: 'Уберите гаджеты за 1 час до сна', icon: '📱' },
  { title: 'Прохладная температура', description: 'Оптимально 18–20°C в спальне', icon: '❄️' },
  { title: 'Чистое пространство', description: 'Уберите лишнее со спальни', icon: '🛋️' },
  { title: 'Дыхание 4-7-8', description: 'Замедляет пульс и успокаивает', icon: '🧘‍♀️' },
  { title: 'Тёплый душ', description: 'Расслабляет и готовит тело ко сну', icon: '🚿' },
  { title: 'Мягкий свет вечером', description: 'Используйте тёплый свет 2700К', icon: '🕯️' },
  { title: 'Травяной чай', description: 'Ромашка или мята перед сном', icon: '🫖' },
  { title: 'Без кофеина после 15:00', description: 'Иначе он мешает уснуть', icon: '☕' },
  { title: 'Чтение перед сном', description: 'На бумаге, не на телефоне', icon: '📖' },
  { title: 'Бинауральные ритмы', description: 'Помогают успокоить мозг', icon: '🎵' },
  { title: 'Тишина', description: 'Используйте беруши, если шумно', icon: '🔇' },
  { title: 'Ароматы', description: 'Лаванда снижает тревожность', icon: '🌺' },
  { title: 'Спальня только для сна', description: 'Не работайте в кровати', icon: '🛏️' },
  { title: 'Тёплые носки', description: 'Согревают и ускоряют засыпание', icon: '🧦' },
  { title: 'Тёплое молоко', description: 'Содержит аминокислоту для расслабления', icon: '🥛' },
  { title: 'Проветривание', description: 'Свежий воздух улучшает качество сна', icon: '💨' },
  { title: 'Умеренная прогулка', description: '15–20 минут вечером', icon: '🚶‍♀️' },
  { title: 'Лёгкий ужин', description: 'Не ешьте тяжёлое за 2–3 часа до сна', icon: '🥗' },
  { title: 'Меньше соли вечером', description: 'Она задерживает воду и мешает отдыху', icon: '🧂' },
  { title: 'Не пейте много воды перед сном', description: 'Чтобы не просыпаться ночью', icon: '💧' },
  { title: 'Короткая медитация', description: '3–5 минут достаточно', icon: '🧘‍♂️' },
  { title: 'Дневник мыслей', description: 'Выпишите всё лишнее перед сном', icon: '📝' },
  { title: 'Спокойная музыка', description: 'Медленные ритмы снижают тревожность', icon: '🎼' },
  { title: 'Режим «Не беспокоить»', description: 'Отключайте уведомления', icon: '🔕' },
  { title: 'Ритуал сна', description: 'Повторяйте те же действия каждый вечер', icon: '🧩' },
  { title: 'Комфортное бельё', description: 'Натуральные ткани улучшают терморегуляцию', icon: '👕' },
  { title: 'Правильная подушка', description: 'Выбирайте по высоте и положению тела', icon: '🛌' },
  { title: 'Без сериалов в кровати', description: 'Они возбуждают нервную систему', icon: '📺' },
  { title: 'Минимум визуального шума', description: 'Спальня — спокойное место', icon: '✨' },
  { title: 'Меньше алкоголя вечером', description: 'Он ухудшает фазы сна', icon: '🍷' },
  { title: 'Физическая активность', description: 'Но не за 2 часа до сна', icon: '🏃‍♀️' },
  { title: 'Дышите глубже', description: 'Активирует парасимпатическую систему', icon: '🌬️' },
  { title: 'Дневной свет утром', description: 'Помогает стабилизировать биоритмы', icon: '☀️' },
  { title: 'Не спите днём долго', description: 'Максимум 20–30 минут', icon: '⏰' },
  { title: 'Ментальное «отпускание» дня', description: 'Закрывайте день как файл — и спать', icon: '🗂️' },
  { title: 'Не лежите долго без сна', description: 'Если не спится — встаньте, пройдитесь', icon: '🚶‍♂️' },
  { title: 'Не работайте в спальне', description: 'Мозг должен ассоциировать её со сном', icon: '💼' },
  { title: 'Перекус без сахара', description: 'Банан или йогурт — ок', icon: '🍌' },
  { title: 'Магний вечером', description: 'Помогает расслаблению (если подходит)', icon: '🌿' },
  { title: 'Шум дождя', description: 'Монотонные звуки успокаивают', icon: '🌧️' },
  { title: 'Уменьшите стресс днём', description: 'Здоровый сон начинается днём', icon: '🌅' },
  { title: 'Ванна с солью', description: '20 минут расслабляют мышцы', icon: '🛁' },
  { title: 'Холодное лицо', description: 'Ополосните лицо прохладной водой', icon: '🧊' },
  { title: 'Чистая спальня', description: 'Порядок снижает тревожность', icon: '🧹' },
  { title: 'Позитивная установка', description: '«Я спокойно засыпаю» — работает', icon: '😊' },
  { title: 'Уберите рабочие мысли', description: 'Планируйте завтра заранее', icon: '📋' },
  { title: 'Не гоните сон', description: 'Позвольте телу естественно расслабиться', icon: '😴' }
]

export default function SleepTips() {
  const [currentTips, setCurrentTips] = useState<typeof ALL_TIPS>([])
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Функция для получения случайных 3 советов
  const getRandomTips = () => {
    const shuffled = [...ALL_TIPS].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3)
  }

  // Инициализация и ротация советов
  useEffect(() => {
    // Устанавливаем первые 3 совета
    setCurrentTips(getRandomTips())

    // Ротация каждые 2 минуты (120000 мс)
    const interval = setInterval(() => {
      setIsTransitioning(true)
      
      // Плавное исчезновение
      setTimeout(() => {
        setCurrentTips(getRandomTips())
        setIsTransitioning(false)
      }, 300) // Половина времени анимации
    }, 120000) // 2 минуты

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mb-6">
      <h2 className="section-header flex items-center mb-4">
        <Lightbulb size={22} className="mr-2 text-morphe-blue" />
        Советы по улучшению сна
      </h2>

      <div className="grid gap-3">
        {currentTips.map((tip, index) => (
          <div 
            key={`${tip.title}-${index}`}
            className={`card-glass p-4 flex items-start space-x-3 gap-3 hover:scale-[1.01] transition-all group ${
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
            style={{
              transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out'
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-light-ai-blue/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative text-4xl p-3 bg-gradient-to-br from-mythic-ivory/10 to-mythic-ivory/20 rounded-xl backdrop-blur-sm transform transition-transform group-hover:scale-110" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>
                {tip.icon}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-mythic-ivory font-semibold text-sm mb-1.5 tracking-tight">
                {tip.title}
              </h3>
              <p className="text-mythic-ivory/70 text-xs leading-relaxed">
                {tip.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

