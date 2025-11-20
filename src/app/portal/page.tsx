import Image from 'next/image'
import Link from 'next/link'
import DreamCalendar from '@/components/portal/DreamCalendar'
import MoonPhase from '@/components/portal/MoonPhase'
import MonthlyStats from '@/components/portal/MonthlyStats'
import RecentDreams from '@/components/portal/RecentDreams'
import RecommendedArticles from '@/components/portal/RecommendedArticles'
import SleepTips from '@/components/portal/SleepTips'

export default function PortalPage() {
  return (
    <div className="space-y-5 pb-6 animate-fade-in">
      {/* Modern Hero Header */}
      <header className="text-center py-6 relative">
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

