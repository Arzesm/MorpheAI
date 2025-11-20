import { Sparkles, User } from 'lucide-react'

interface ChatMessageProps {
  message: {
    id: number
    type: 'user' | 'ai'
    content: string
    timestamp: Date
  }
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAI = message.type === 'ai'

  return (
    <div className={`flex items-start space-x-3 ${!isAI ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isAI
            ? 'bg-gradient-to-r from-morphe-blue to-amethyst-spirit'
            : 'bg-mythic-ivory/20'
        }`}
      >
        {isAI ? (
          <Sparkles size={20} className="text-mythic-ivory" />
        ) : (
          <User size={20} className="text-mythic-ivory" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col ${!isAI ? 'items-end' : ''}`}>
        <div
          className={`card p-3 max-w-[80%] ${
            isAI
              ? 'bg-morphe-blue/10'
              : 'bg-amethyst-spirit/20'
          }`}
        >
          <p className="text-mythic-ivory text-sm leading-relaxed whitespace-pre-line">
            {message.content}
          </p>
        </div>
        <span className="text-mythic-ivory/40 text-xs mt-1">
          {message.timestamp.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    </div>
  )
}

