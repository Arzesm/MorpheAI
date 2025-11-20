'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, BookOpen, Sparkles, Library, MessageCircle } from 'lucide-react'

const navItems = [
  {
    name: 'Главная',
    path: '/portal',
    icon: Home,
  },
  {
    name: 'Дневник',
    path: '/journal',
    icon: BookOpen,
  },
  {
    name: 'Медитация',
    path: '/meditate',
    icon: Sparkles,
  },
  {
    name: 'База знаний',
    path: '/knowledge',
    icon: Library,
  },
  {
    name: 'Чат',
    path: '/chat',
    icon: MessageCircle,
  },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* iOS-style blur backdrop */}
      <div className="absolute inset-0 bg-gradient-to-t from-night-deep-blue via-night-deep-blue/95 to-night-deep-blue/80 backdrop-blur-2xl" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-morphe-blue/30 to-transparent" />
      
      <div className="relative max-w-md mx-auto flex justify-around items-center h-20 px-4 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          const Icon = item.icon
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full group"
            >
              <div className="relative">
                {/* Active background glow */}
                {isActive && (
                  <div className="absolute inset-0 bg-morphe-blue/20 rounded-2xl blur-xl scale-150" />
                )}
                
                {/* Icon container */}
                <div className={`
                  relative p-2.5 rounded-2xl transition-all duration-300
                  ${isActive 
                    ? 'bg-morphe-blue/15 scale-110' 
                    : 'bg-transparent group-hover:bg-mythic-ivory/5 group-active:scale-95'
                  }
                `}>
                  <Icon 
                    size={22} 
                    className={`transition-colors duration-300 ${
                      isActive 
                        ? 'text-morphe-blue drop-shadow-[0_0_12px_rgba(30,144,255,0.8)]' 
                        : 'text-mythic-ivory/60 group-hover:text-mythic-ivory/80'
                    }`}
                  />
                </div>
                
                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-morphe-blue shadow-[0_0_8px_rgba(30,144,255,0.8)]" />
                )}
              </div>
              
              <span className={`
                text-[11px] mt-1.5 font-semibold tracking-tight transition-all duration-300
                ${isActive 
                  ? 'text-morphe-blue' 
                  : 'text-mythic-ivory/50 group-hover:text-mythic-ivory/70'
                }
              `}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

