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
      {/* Premium blur backdrop with gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-dream-deep via-night-deep-blue/98 to-night-deep-blue/85 backdrop-blur-3xl" />
      
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px">
        <div className="h-full bg-gradient-to-r from-transparent via-morphe-blue/50 to-transparent" />
      </div>
      
      {/* Floating active indicator background */}
      <div className="relative max-w-md mx-auto flex justify-around items-center h-20 px-3 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          const Icon = item.icon
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className="relative flex flex-col items-center justify-center flex-1 h-full group"
            >
              {/* Background glow effect */}
              {isActive && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-morphe-blue/20 via-morphe-blue/10 to-transparent rounded-3xl blur-2xl scale-110 animate-pulse" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-morphe-blue to-transparent rounded-full shadow-[0_0_20px_rgba(30,144,255,0.6)]" />
                </>
              )}
              
              <div className="relative flex flex-col items-center">
                {/* Icon container with glassmorphism */}
                <div className={`
                  relative p-3 rounded-2xl transition-all duration-500 ease-out
                  ${isActive 
                    ? 'bg-gradient-to-br from-morphe-blue/25 to-amethyst-spirit/20 scale-110 shadow-xl shadow-morphe-blue/30' 
                    : 'bg-transparent group-hover:bg-mythic-ivory/5 group-hover:scale-105 group-active:scale-95'
                  }
                `}>
                  <Icon 
                    size={24} 
                    className={`transition-all duration-500 ${
                      isActive 
                        ? 'text-morphe-blue drop-shadow-[0_0_16px_rgba(30,144,255,1)]' 
                        : 'text-mythic-ivory/50 group-hover:text-mythic-ivory/80 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  
                  {/* Shimmer effect on active */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl animate-shimmer" 
                         style={{ backgroundSize: '200% 100%' }} 
                    />
                  )}
                </div>
                
                {/* Label with gradient on active */}
                <span className={`
                  text-[10px] mt-1 font-bold tracking-wide transition-all duration-500
                  ${isActive 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-morphe-blue via-light-ai-blue to-morphe-blue' 
                    : 'text-mythic-ivory/40 group-hover:text-mythic-ivory/70'
                  }
                `}>
                  {item.name}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
      
      {/* Bottom safe area gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-dream-deep to-transparent pointer-events-none" />
    </nav>
  )
}

