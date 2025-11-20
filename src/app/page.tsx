'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Немедленный редирект на главную страницу
    router.replace('/portal')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-night-deep-blue">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-morphe-blue mx-auto mb-4"></div>
        <p className="text-mythic-ivory text-lg font-semibold">MorpheAI</p>
        <p className="text-mythic-ivory/60 text-sm mt-2">Загрузка...</p>
      </div>
    </div>
  )
}

