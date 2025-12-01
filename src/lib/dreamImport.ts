import { Dream } from './supabase'

interface ImportedDream {
  title: string
  content: string
  date: string
  emotion?: string
  emotion_emoji?: string
  dream_type?: 'normal' | 'lucid' | 'nightmare' | 'epic'
  tags?: string[]
  archetype?: string
  interpretation?: {
    summary?: string
    symbols?: Array<{ name: string; meaning: string }>
    recommendations?: string[]
  }
}

/**
 * Парсинг JSON формата
 */
function parseJSON(content: string): ImportedDream[] {
  try {
    const data = JSON.parse(content)
    
    // Поддержка разных форматов JSON
    let dreams: any[] = []
    
    if (Array.isArray(data)) {
      dreams = data
    } else if (data.dreams && Array.isArray(data.dreams)) {
      dreams = data.dreams
    } else if (data.dream && Array.isArray(data.dream)) {
      dreams = data.dream
    } else {
      throw new Error('Неверный формат JSON')
    }
    
    return dreams.map(dream => ({
      title: dream.title || 'Без названия',
      content: dream.content || dream.text || dream.description || '',
      date: dream.date || dream.created_at || new Date().toISOString().split('T')[0],
      emotion: dream.emotion,
      emotion_emoji: dream.emotion_emoji,
      dream_type: dream.dream_type || dream.type || 'normal',
      tags: Array.isArray(dream.tags) ? dream.tags : (dream.tags ? [dream.tags] : []),
      archetype: dream.archetype,
      interpretation: dream.interpretation
    }))
  } catch (error) {
    throw new Error(`Ошибка парсинга JSON: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
  }
}

/**
 * Парсинг текстового формата
 */
function parseText(content: string): ImportedDream[] {
  const dreams: ImportedDream[] = []
  
  // Разделяем по разделителям
  const sections = content.split(/(?:={60,}|-{60,}|\n\n\n+)/)
  
  let currentDream: Partial<ImportedDream> | null = null
  
  for (const section of sections) {
    const lines = section.trim().split('\n')
    if (lines.length < 2) continue
    
    // Проверяем, начинается ли секция с "СОН" или содержит заголовок
    const isDreamStart = /СОН\s*#?\d+|Заголовок:|Title:/i.test(section)
    
    if (isDreamStart || (!currentDream && lines.length > 3)) {
      // Сохраняем предыдущий сон
      if (currentDream && currentDream.title && currentDream.content) {
        dreams.push({
          title: currentDream.title,
          content: currentDream.content,
          date: currentDream.date || new Date().toISOString().split('T')[0],
          emotion: currentDream.emotion,
          emotion_emoji: currentDream.emotion_emoji,
          dream_type: currentDream.dream_type || 'normal',
          tags: currentDream.tags || [],
          archetype: currentDream.archetype
        })
      }
      
      // Начинаем новый сон
      currentDream = {}
    }
    
    // Парсим поля
    for (const line of lines) {
      const trimmed = line.trim()
      
      if (/Заголовок:|Title:/i.test(trimmed)) {
        currentDream!.title = trimmed.replace(/Заголовок:|Title:/i, '').trim()
      } else if (/Дата:|Date:/i.test(trimmed)) {
        const dateMatch = trimmed.match(/(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/)
        if (dateMatch) {
          currentDream!.date = normalizeDate(dateMatch[1])
        }
      } else if (/Эмоция:|Emotion:/i.test(trimmed)) {
        const emotionMatch = trimmed.match(/Эмоция:|Emotion:\s*(.+)/i)
        if (emotionMatch) {
          const emotionText = emotionMatch[1].trim()
          const emojiMatch = emotionText.match(/^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])\s*(.+)/u)
          if (emojiMatch) {
            currentDream!.emotion_emoji = emojiMatch[1]
            currentDream!.emotion = emojiMatch[2].trim()
          } else {
            currentDream!.emotion = emotionText
          }
        }
      } else if (/Тип:|Type:/i.test(trimmed)) {
        const typeMatch = trimmed.match(/Тип:|Type:\s*(.+)/i)
        if (typeMatch) {
          const type = typeMatch[1].trim().toLowerCase()
          if (['осознанный', 'lucid'].includes(type)) {
            currentDream!.dream_type = 'lucid'
          } else if (['кошмар', 'nightmare'].includes(type)) {
            currentDream!.dream_type = 'nightmare'
          } else if (['эпический', 'epic'].includes(type)) {
            currentDream!.dream_type = 'epic'
          } else {
            currentDream!.dream_type = 'normal'
          }
        }
      } else if (/Теги:|Tags:/i.test(trimmed)) {
        const tagsMatch = trimmed.match(/Теги:|Tags:\s*(.+)/i)
        if (tagsMatch) {
          const tagsText = tagsMatch[1]
          currentDream!.tags = tagsText.split(/[,#;]/).map(t => t.trim().replace(/^#/, '')).filter(Boolean)
        }
      } else if (/Содержание:|Content:|Текст:|Text:/i.test(trimmed)) {
        // Следующие строки - это содержание
        const contentIndex = lines.indexOf(line)
        currentDream!.content = lines.slice(contentIndex + 1).join('\n').trim()
      } else if (trimmed && !currentDream!.content && trimmed.length > 10) {
        // Если нет явного заголовка "Содержание", но есть длинный текст - это содержание
        if (!currentDream!.title) {
          currentDream!.title = trimmed.substring(0, 50)
          currentDream!.content = trimmed
        } else {
          currentDream!.content = (currentDream!.content || '') + '\n' + trimmed
        }
      }
    }
  }
  
  // Добавляем последний сон
  if (currentDream && currentDream.title && currentDream.content) {
    dreams.push({
      title: currentDream.title,
      content: currentDream.content,
      date: currentDream.date || new Date().toISOString().split('T')[0],
      emotion: currentDream.emotion,
      emotion_emoji: currentDream.emotion_emoji,
      dream_type: currentDream.dream_type || 'normal',
      tags: currentDream.tags || [],
      archetype: currentDream.archetype
    })
  }
  
  // Если не удалось распарсить структурированно, пробуем разделить по пустым строкам
  if (dreams.length === 0) {
    const blocks = content.split(/\n\n\n+|\n{3,}/)
    for (const block of blocks) {
      const lines = block.trim().split('\n').filter(l => l.trim().length > 0)
      if (lines.length >= 2) {
        const title = lines[0].substring(0, 100)
        const content = lines.slice(1).join('\n')
        if (content.length > 10) {
          dreams.push({
            title,
            content,
            date: new Date().toISOString().split('T')[0],
            dream_type: 'normal'
          })
        }
      }
    }
  }
  
  return dreams
}

/**
 * Парсинг CSV формата
 */
function parseCSV(content: string): ImportedDream[] {
  const lines = content.split('\n').filter(l => l.trim())
  if (lines.length < 2) return []
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  const dreams: ImportedDream[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length < headers.length) continue
    
    const dream: Partial<ImportedDream> = {}
    
    headers.forEach((header, index) => {
      const value = values[index]?.replace(/^"|"$/g, '') || ''
      const lowerHeader = header.toLowerCase()
      
      if (lowerHeader.includes('заголовок') || lowerHeader.includes('title')) {
        dream.title = value
      } else if (lowerHeader.includes('дата') || lowerHeader.includes('date')) {
        dream.date = normalizeDate(value)
      } else if (lowerHeader.includes('содержание') || lowerHeader.includes('content') || lowerHeader.includes('текст')) {
        dream.content = value
      } else if (lowerHeader.includes('эмоция') || lowerHeader.includes('emotion')) {
        dream.emotion = value
      } else if (lowerHeader.includes('тип') || lowerHeader.includes('type')) {
        dream.dream_type = value.toLowerCase() as any || 'normal'
      } else if (lowerHeader.includes('тег') || lowerHeader.includes('tag')) {
        dream.tags = value.split(/[;,#]/).map(t => t.trim()).filter(Boolean)
      } else if (lowerHeader.includes('архетип') || lowerHeader.includes('archetype')) {
        dream.archetype = value
      }
    })
    
    if (dream.title && dream.content) {
      dreams.push({
        title: dream.title,
        content: dream.content,
        date: dream.date || new Date().toISOString().split('T')[0],
        emotion: dream.emotion,
        dream_type: dream.dream_type || 'normal',
        tags: dream.tags || [],
        archetype: dream.archetype
      })
    }
  }
  
  return dreams
}

/**
 * Парсинг одной строки CSV с учетом кавычек
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current)
      current = ''
    } else {
      current += char
    }
  }
  
  values.push(current)
  return values
}

/**
 * Нормализация даты в формат YYYY-MM-DD
 */
function normalizeDate(dateStr: string): string {
  // Пробуем разные форматы
  const formats = [
    /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
    /(\d{2})[./-](\d{2})[./-](\d{4})/, // DD.MM.YYYY
    /(\d{2})[./-](\d{2})[./-](\d{2})/, // DD.MM.YY
  ]
  
  for (const format of formats) {
    const match = dateStr.match(format)
    if (match) {
      if (format === formats[0]) {
        return match[0]
      } else if (format === formats[1]) {
        return `${match[3]}-${match[2]}-${match[1]}`
      } else if (format === formats[2]) {
        const year = parseInt(match[3]) < 50 ? `20${match[3]}` : `19${match[3]}`
        return `${year}-${match[2]}-${match[1]}`
      }
    }
  }
  
  return new Date().toISOString().split('T')[0]
}

/**
 * Определение формата файла и парсинг
 */
export function importDreams(fileContent: string, filename: string): ImportedDream[] {
  const lowerFilename = filename.toLowerCase()
  
  try {
    // JSON формат
    if (lowerFilename.endsWith('.json') || fileContent.trim().startsWith('{') || fileContent.trim().startsWith('[')) {
      return parseJSON(fileContent)
    }
    
    // CSV формат
    if (lowerFilename.endsWith('.csv') || fileContent.includes(',') && fileContent.split('\n').length > 1) {
      return parseCSV(fileContent)
    }
    
    // Текстовый формат (по умолчанию)
    return parseText(fileContent)
  } catch (error) {
    throw new Error(`Ошибка импорта: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
  }
}

/**
 * Преобразование импортированных снов в формат для сохранения
 */
export function convertImportedDreams(importedDreams: ImportedDream[]): Omit<Dream, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'has_interpretation' | 'has_image' | 'image_url'>[] {
  return importedDreams.map(dream => ({
    title: dream.title || 'Без названия',
    content: dream.content || '',
    date: dream.date || new Date().toISOString().split('T')[0],
    emotion: dream.emotion || 'Нейтральная',
    emotion_emoji: dream.emotion_emoji || '😐',
    dream_type: dream.dream_type || 'normal',
    tags: dream.tags || [],
    archetype: dream.archetype || 'Не определен',
    interpretation: dream.interpretation || undefined,
    has_interpretation: !!dream.interpretation
  }))
}

