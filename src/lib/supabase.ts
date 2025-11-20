import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Ленивая инициализация Supabase клиента
let supabaseInstance: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Для статической генерации создаем клиент с placeholder значениями
  // В реальном запросе переменные окружения будут доступны
  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window === 'undefined') {
      // Серверная сторона (SSR/SSG) - создаем клиент с placeholder
      supabaseInstance = createClient(
        'https://placeholder.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
      )
      return supabaseInstance
    }
    // Клиентская сторона - создаем клиент с placeholder, но операции будут возвращать ошибки
    // Это лучше, чем выбрасывать ошибку при инициализации
    console.warn('⚠️ Supabase URL и ключ не найдены. Установите NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в переменных окружения Vercel.')
    supabaseInstance = createClient(
      'https://placeholder.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
    )
    return supabaseInstance
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}

// Создаем Proxy для ленивой инициализации
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient()
    const value = client[prop as keyof SupabaseClient]
    return typeof value === 'function' ? value.bind(client) : value
  }
})

// Типы данных
export interface Dream {
  id: string
  user_id?: string
  title: string
  content: string
  date: string
  emotion: string
  emotion_emoji: string
  tags: string[]
  archetype: string
  dream_type: 'normal' | 'lucid' | 'nightmare' | 'epic'
  has_interpretation: boolean
  interpretation?: {
    summary: string
    symbols: Array<{ name: string; meaning: string }>
    recommendations: string[]
  }
  has_image: boolean
  image_url?: string
  created_at: string
  updated_at: string
}

// CRUD операции для снов
export const dreamService = {
  // Получить все сны пользователя
  async getAll() {
    const { data, error } = await supabase
      .from('dreams')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) {
      console.error('Error fetching dreams:', error)
      return []
    }
    
    return data as Dream[]
  },

  // Получить сон по ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('dreams')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching dream:', error)
      return null
    }
    
    return data as Dream
  },

  // Создать новый сон
  async create(dream: Omit<Dream, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
    console.log('📝 Создание сна в Supabase...', dream.title)
    
    const { data, error } = await supabase
      .from('dreams')
      .insert([dream])
      .select()
      .single()
    
    if (error) {
      console.error('❌ Ошибка создания сна в Supabase:', error)
      console.error('Детали ошибки:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw new Error(`Ошибка Supabase: ${error.message}`)
    }
    
    console.log('✅ Сон создан в Supabase:', data.id)
    return data as Dream
  },

  // Обновить сон
  async update(id: string, dream: Partial<Dream>) {
    const { data, error } = await supabase
      .from('dreams')
      .update(dream)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating dream:', error)
      throw error
    }
    
    return data as Dream
  },

  // Удалить сон
  async delete(id: string) {
    console.log('🗑️ Попытка удалить сон с ID:', id)
    
    const { error, data } = await supabase
      .from('dreams')
      .delete()
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('❌ Ошибка удаления сна:', error)
      console.error('Детали ошибки:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw new Error(`Ошибка удаления: ${error.message}`)
    }
    
    console.log('✅ Сон успешно удален:', data)
    return true
  },

  // Поиск снов
  async search(query: string) {
    const { data, error } = await supabase
      .from('dreams')
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('date', { ascending: false })
    
    if (error) {
      console.error('Error searching dreams:', error)
      return []
    }
    
    return data as Dream[]
  },

  // Фильтрация снов
  async filter(filters: {
    emotions?: string[]
    types?: string[]
    archetypes?: string[]
    hasInterpretation?: boolean
    hasImage?: boolean
  }) {
    let query = supabase
      .from('dreams')
      .select('*')
    
    if (filters.emotions && filters.emotions.length > 0) {
      query = query.in('emotion', filters.emotions)
    }
    
    if (filters.types && filters.types.length > 0) {
      query = query.in('dream_type', filters.types)
    }
    
    if (filters.archetypes && filters.archetypes.length > 0) {
      query = query.in('archetype', filters.archetypes)
    }
    
    if (filters.hasInterpretation !== undefined) {
      query = query.eq('has_interpretation', filters.hasInterpretation)
    }
    
    if (filters.hasImage !== undefined) {
      query = query.eq('has_image', filters.hasImage)
    }
    
    const { data, error } = await query.order('date', { ascending: false })
    
    if (error) {
      console.error('Error filtering dreams:', error)
      return []
    }
    
    return data as Dream[]
  }
}

