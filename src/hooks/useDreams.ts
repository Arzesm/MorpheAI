import { useState, useEffect } from 'react'
import { dreamService, Dream, supabase } from '@/lib/supabase'

// Глобальный кэш для снов (в памяти)
let dreamsCache: Dream[] | null = null
let dreamsCachePromise: Promise<Dream[]> | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 60000 // 60 секунд

// Функция для инвалидации кэша
export function invalidateDreamsCache() {
  dreamsCache = null
  cacheTimestamp = 0
  dreamsCachePromise = null
}

// Хук для получения всех снов с кэшированием
export function useDreams() {
  const [dreams, setDreams] = useState<Dream[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadDreams = async () => {
      // Если есть свежий кэш, используем его
      const now = Date.now()
      if (dreamsCache && (now - cacheTimestamp) < CACHE_DURATION) {
        setDreams(dreamsCache)
        setIsLoading(false)
        return
      }

      // Если уже идет загрузка, ждем её
      if (dreamsCachePromise) {
        try {
          const cachedDreams = await dreamsCachePromise
          setDreams(cachedDreams)
          setIsLoading(false)
          return
        } catch (err) {
          // Если загрузка провалилась, продолжаем с новой
        }
      }

      // Загружаем сны
      setIsLoading(true)
      setError(null)
      
      dreamsCachePromise = dreamService.getAll()
      
      try {
        const allDreams = await dreamsCachePromise
        
        if (allDreams) {
          dreamsCache = allDreams
          cacheTimestamp = now
          setDreams(allDreams)
        } else {
          dreamsCache = []
          setDreams([])
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Ошибка загрузки снов')
        setError(error)
        console.error('❌ Ошибка загрузки снов:', error)
        setDreams([])
      } finally {
        setIsLoading(false)
        dreamsCachePromise = null
      }
    }

    loadDreams()
  }, [])

  return { dreams, isLoading, error }
}

// Хук для получения только нужных полей (быстрее для статистики и календаря)
export function useDreamsLight() {
  const [dreams, setDreams] = useState<Dream[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDreams = async () => {
      setIsLoading(true)
      try {
        // Загружаем только нужные поля для статистики и календаря (без content)
        const { data, error } = await supabase
          .from('dreams')
          .select('id, title, date, emotion, emotion_emoji, dream_type, tags, archetype, created_at')
          .order('date', { ascending: false })
        
        if (error) throw error
        
        if (data) {
          setDreams(data as Dream[])
        } else {
          setDreams([])
        }
      } catch (error) {
        console.error('❌ Ошибка загрузки снов:', error)
        setDreams([])
      } finally {
        setIsLoading(false)
      }
    }

    loadDreams()
  }, [])

  return { dreams, isLoading }
}

