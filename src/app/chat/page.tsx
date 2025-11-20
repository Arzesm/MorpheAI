'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, BookOpen, Lightbulb, Search } from 'lucide-react'
import Header from '@/components/Header'
import ChatMessage from '@/components/chat/ChatMessage'
import QuickActionButton from '@/components/chat/QuickActionButton'

interface Message {
  id: number
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: 'Здравствуйте! Я MorpheAI, ваш помощник в мире сновидений. Чем могу помочь?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickActions = [
    {
      icon: BookOpen,
      label: 'Разобрать последний сон',
      action: 'analyze_last_dream'
    },
    {
      icon: Search,
      label: 'Объяснить символ',
      action: 'explain_symbol'
    },
    {
      icon: Lightbulb,
      label: 'Дать совет',
      action: 'give_advice'
    },
    {
      icon: Sparkles,
      label: 'Анализ архетипа',
      action: 'analyze_archetype'
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue('')
    setIsTyping(true)

    try {
      // Запрос к реальному AI через Edge Function
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Переменные окружения Supabase не настроены. Добавьте NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в настройках Vercel.')
      }

      // Формируем историю сообщений для контекста
      const messageHistory = [
        ...messages.map(msg => ({
          type: msg.type,
          content: msg.content
        })),
        {
          type: 'user',
          content: currentInput
        }
      ]

      const edgeFunctionUrl = `${supabaseUrl}/functions/v1/chat-morpheai`
      
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          messages: messageHistory
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Ошибка при получении ответа')
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: data.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error: any) {
      console.error('❌ Ошибка чата:', error)
      
      const errorMessage: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: `Извините, произошла ошибка: ${error.message}. Пожалуйста, попробуйте ещё раз.`,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickAction = (action: string) => {
    let prompt = ''
    switch (action) {
      case 'analyze_last_dream':
        prompt = 'Разбери, пожалуйста, мой последний сон'
        break
      case 'explain_symbol':
        prompt = 'Объясни мне значение символа в моём сне'
        break
      case 'give_advice':
        prompt = 'Дай мне совет по улучшению осознанности во снах'
        break
      case 'analyze_archetype':
        prompt = 'Расскажи про мой текущий архетип'
        break
    }
    setInputValue(prompt)
  }


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] pb-6 animate-fade-in">
      <Header />
      
      <div className="text-center mb-4">
        <p className="text-mythic-ivory/60 text-sm font-medium">
          Ваш проводник в мире сновидений
        </p>
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="mb-4">
          <p className="text-mythic-ivory/60 text-sm mb-3">Быстрые действия:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <QuickActionButton
                key={index}
                icon={action.icon}
                label={action.label}
                onClick={() => handleQuickAction(action.action)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 -mx-4 px-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-morphe-blue to-amethyst-spirit flex items-center justify-center flex-shrink-0">
              <Sparkles size={20} className="text-mythic-ivory" />
            </div>
            <div className="card p-3 max-w-[80%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-morphe-blue animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-morphe-blue animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-morphe-blue animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex space-x-2">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Напишите сообщение..."
          className="input-field flex-1 resize-none min-h-[50px] max-h-[120px]"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim()}
          className="btn-primary px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}

