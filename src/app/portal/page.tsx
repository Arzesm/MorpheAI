import Image from 'next/image'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import DreamCalendar from '@/components/portal/DreamCalendar'
import MoonPhase from '@/components/portal/MoonPhase'
import MonthlyStats from '@/components/portal/MonthlyStats'
import RecentDreams from '@/components/portal/RecentDreams'
import RecommendedArticles from '@/components/portal/RecommendedArticles'
import SleepTips from '@/components/portal/SleepTips'

export default function PortalPage() {
  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      {/* Modern Hero Header */}
      <header className="text-center pt-6 pb-2 relative mb-2">
        <div className="absolute inset-0 bg-gradient-to-b from-morphe-blue/10 to-transparent blur-3xl" />
        <div className="relative z-10 flex flex-col items-center">
          <Link href="/portal" className="relative w-48 h-16 mb-3 cursor-pointer group">
            <Image
              src="https://i.postimg.cc/nznsrDSf/cbb6618b-6539-4097-a39c-81dc01fe57d4.png"
              alt="MorpheAI Logo"
              fill
              className="object-contain drop-shadow-[0_0_20px_rgba(30,144,255,0.3)] transition-all group-hover:drop-shadow-[0_0_30px_rgba(30,144,255,0.5)] group-hover:scale-105"
              priority
            />
          </Link>
          <p className="text-mythic-ivory/60 text-sm font-medium tracking-wide">Портал в мир снов</p>
        </div>
      </header>

      {/* Moon Phase */}
      <MoonPhase />

      {/* Quick Action - Write Dream */}
      <Link href="/journal/new" className="block">
        <button className="group relative w-full px-6 py-5 bg-gradient-to-r from-morphe-blue via-light-ai-blue to-amethyst-spirit rounded-2xl font-bold shadow-2xl shadow-morphe-blue/50 hover:shadow-morphe-blue/70 transition-all duration-300 hover:scale-[1.02] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          <div className="relative flex items-center justify-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center backdrop-blur-sm group-hover:rotate-90 transition-transform duration-300 shadow-lg">
              <Plus size={28} strokeWidth={3} className="text-white" />
            </div>
            <div className="text-left">
              <div className="text-lg font-bold tracking-wide text-white drop-shadow-lg">Записать сон</div>
              <div className="text-sm text-white/90 font-normal drop-shadow">Сохрани своё сновидение прямо сейчас</div>
            </div>
          </div>
        </button>
      </Link>

      {/* Monthly Statistics */}
      <MonthlyStats />

      {/* Dream Calendar */}
      <DreamCalendar />

      {/* Recent Dreams */}
      <RecentDreams />

      {/* Recommended Articles */}
      <RecommendedArticles />

      {/* Sleep Tips */}
      <SleepTips />
    </div>
  )
}

