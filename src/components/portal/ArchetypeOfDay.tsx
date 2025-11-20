'use client'

import { Sparkles, TrendingUp } from 'lucide-react'

export default function ArchetypeOfDay() {
  // В реальном приложении это будет определяться ИИ по последнему сну
  const archetype = {
    name: 'Искатель',
    description: 'Вы находитесь в поиске новых знаний и смыслов',
    color: 'from-amethyst-spirit via-morphe-blue to-light-ai-blue',
    icon: '🔮'
  }

  return (
    <div className="card-glass p-6 relative overflow-hidden group">
      {/* Animated sparkles background */}
      <div className="absolute top-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity">
        <Sparkles size={140} className="text-morphe-blue" />
      </div>
      <div className="absolute -bottom-10 -left-10 opacity-5">
        <TrendingUp size={100} className="text-amethyst-spirit rotate-12" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-amethyst-spirit/30 rounded-2xl blur-lg" />
              <div className="relative text-5xl p-2 bg-gradient-to-br from-amethyst-spirit/20 to-morphe-blue/20 rounded-2xl backdrop-blur-sm border border-amethyst-spirit/20">
                {archetype.icon}
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <p className="text-light-ai-blue text-xs font-semibold uppercase tracking-wider">Архетип дня</p>
                <Sparkles size={14} className="text-light-ai-blue" />
              </div>
              <h3 className="text-2xl font-bold text-mythic-ivory tracking-tight">{archetype.name}</h3>
            </div>
          </div>
        </div>
        
        <p className="text-mythic-ivory/80 text-[15px] leading-relaxed mb-4">
          {archetype.description}
        </p>
        
        <div className="relative h-2 w-full rounded-full bg-mythic-ivory/5 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-r ${archetype.color} rounded-full`} 
               style={{ width: '75%' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" 
               style={{ backgroundSize: '200% 100%' }} />
        </div>
      </div>
    </div>
  )
}

