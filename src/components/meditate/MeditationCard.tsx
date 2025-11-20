'use client'

import { Play, Clock } from 'lucide-react'
import Link from 'next/link'

interface MeditationCardProps {
  meditation: {
    id: number
    title: string
    duration: string
    description: string
    icon: string
    color: string
  }
}

export default function MeditationCard({ meditation }: MeditationCardProps) {
  return (
    <Link href={`/meditate/${meditation.id}`}>
      <div className="card p-5 hover:scale-[1.01] transition-all cursor-pointer relative overflow-hidden group">
        <div className={`absolute inset-0 bg-gradient-to-br ${meditation.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
        
        <div className="relative z-10 flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-0 bg-morphe-blue/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative text-5xl p-2 bg-gradient-to-br from-mythic-ivory/5 to-mythic-ivory/10 rounded-2xl backdrop-blur-sm">
              {meditation.icon}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-mythic-ivory font-bold text-base mb-1 tracking-tight">
              {meditation.title}
            </h3>
            <p className="text-mythic-ivory/70 text-sm mb-2 line-clamp-2 leading-relaxed">
              {meditation.description}
            </p>
            <div className="flex items-center space-x-2">
              <div className="px-2 py-1 rounded-lg bg-morphe-blue/10 backdrop-blur-sm">
                <span className="flex items-center text-xs text-light-ai-blue font-semibold">
                  <Clock size={12} className="mr-1" />
                  {meditation.duration}
                </span>
              </div>
            </div>
          </div>
          
          <button className="w-14 h-14 rounded-2xl bg-gradient-to-br from-morphe-blue to-amethyst-spirit hover:scale-110 flex items-center justify-center transition-all shadow-xl shadow-morphe-blue/30">
            <Play size={22} className="text-mythic-ivory ml-1" fill="currentColor" />
          </button>
        </div>
      </div>
    </Link>
  )
}

