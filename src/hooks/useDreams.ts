import { useState, useEffect } from 'react'
import { dreamService, Dream } from '@/lib/supabase'

// Глобальный кэш для снов (в памяти)
let dreamsCache: Dream[] | null = null
let dreamsLightCache: Dream[] | null = null
let dreamsCachePromise: Promise<Dream[]> | null = null
let dreamsLightCachePromise: Promise<Dream[]> | null = null
let cacheTimestamp: number = 0
let lightCacheTimestamp: number = 0
const CACHE_DURATION = 60000 // 60 секунд

// Функция для инвалидации кэша
export function invalidateDreamsCache() {
  dreamsCache = null
  dreamsLightCache = null
  cacheTimestamp = 0
  lightCacheTimestamp = 0
  dreamsCachePromise = null
  dreamsLightCachePromise = null
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
      // Если есть свежий кэш, используем его
      const now = Date.now()
      if (dreamsLightCache && (now - lightCacheTimestamp) < CACHE_DURATION) {
        setDreams(dreamsLightCache)
        setIsLoading(false)
        return
      }

      // Если уже идет загрузка, ждем её
      if (dreamsLightCachePromise) {
        try {
          const cachedDreams = await dreamsLightCachePromise
          setDreams(cachedDreams)
          setIsLoading(false)
          return
        } catch (err) {
          // Если загрузка провалилась, продолжаем с новой
        }
      }

      // Загружаем сны (только легкие поля, без content)
      setIsLoading(true)
      
      dreamsLightCachePromise = dreamService.getAllLight()
      
      try {
        const allDreams = await dreamsLightCachePromise
        
        if (allDreams) {
          dreamsLightCache = allDreams
          lightCacheTimestamp = now
          setDreams(allDreams)
        } else {
          dreamsLightCache = []
          setDreams([])
        }
      } catch (error) {
        console.error('❌ Ошибка загрузки снов:', error)
        setDreams([])
      } finally {
        setIsLoading(false)
        dreamsLightCachePromise = null
      }
    }

    loadDreams()
  }, [])

  return { dreams, isLoading }
}

