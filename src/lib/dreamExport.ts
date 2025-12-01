import { Dream } from './supabase'

/**
 * Экспорт снов в JSON формат
 */
export function exportDreamsToJSON(dreams: Dream[]): string {
  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    totalDreams: dreams.length,
    dreams: dreams.map(dream => ({
      title: dream.title,
      content: dream.content.replace(/<[^>]*>/g, ''), // Убираем HTML теги
      date: dream.date,
      emotion: dream.emotion,
      emotion_emoji: dream.emotion_emoji,
      dream_type: dream.dream_type,
      tags: dream.tags || [],
      archetype: dream.archetype,
      interpretation: dream.interpretation,
      created_at: dream.created_at
    }))
  }
  
  return JSON.stringify(exportData, null, 2)
}

/**
 * Экспорт снов в читаемый текстовый формат
 */
export function exportDreamsToText(dreams: Dream[]): string {
  let text = `ЭКСПОРТ СНОВ - MorpheAI\n`
  text += `Дата экспорта: ${new Date().toLocaleDateString('ru-RU')}\n`
  text += `Всего снов: ${dreams.length}\n`
  text += `\n${'='.repeat(60)}\n\n`
  
  dreams.forEach((dream, index) => {
    const cleanContent = dream.content.replace(/<[^>]*>/g, '').trim()
    
    text += `СОН #${index + 1}\n`
    text += `-`.repeat(60) + `\n`
    text += `Заголовок: ${dream.title}\n`
    text += `Дата: ${new Date(dream.date).toLocaleDateString('ru-RU')}\n`
    text += `Эмоция: ${dream.emotion_emoji} ${dream.emotion}\n`
    text += `Тип: ${dream.dream_type}\n`
    
    if (dream.tags && dream.tags.length > 0) {
      text += `Теги: ${dream.tags.map(t => `#${t}`).join(', ')}\n`
    }
    
    if (dream.archetype && dream.archetype !== 'Не определен') {
      text += `Архетип: ${dream.archetype}\n`
    }
    
    text += `\nСодержание:\n${cleanContent}\n`
    
    if (dream.interpretation) {
      text += `\nИнтерпретация:\n`
      if (dream.interpretation.summary) {
        text += `Краткое описание: ${dream.interpretation.summary}\n`
      }
      if (dream.interpretation.symbols && dream.interpretation.symbols.length > 0) {
        text += `Символы:\n`
        dream.interpretation.symbols.forEach(symbol => {
          text += `  - ${symbol.name}: ${symbol.meaning}\n`
        })
      }
      if (dream.interpretation.recommendations && dream.interpretation.recommendations.length > 0) {
        text += `Рекомендации:\n`
        dream.interpretation.recommendations.forEach(rec => {
          text += `  - ${rec}\n`
        })
      }
    }
    
    text += `\n${'='.repeat(60)}\n\n`
  })
  
  return text
}

/**
 * Экспорт снов в CSV формат
 */
export function exportDreamsToCSV(dreams: Dream[]): string {
  const headers = [
    'Заголовок',
    'Дата',
    'Содержание',
    'Эмоция',
    'Тип',
    'Теги',
    'Архетип',
    'Интерпретация'
  ]
  
  const rows = dreams.map(dream => {
    const cleanContent = dream.content.replace(/<[^>]*>/g, '').replace(/"/g, '""')
    const tags = (dream.tags || []).join('; ')
    const interpretation = dream.interpretation 
      ? dream.interpretation.summary || ''
      : ''
    
    return [
      `"${dream.title.replace(/"/g, '""')}"`,
      dream.date,
      `"${cleanContent}"`,
      dream.emotion,
      dream.dream_type,
      `"${tags}"`,
      dream.archetype || '',
      `"${interpretation.replace(/"/g, '""')}"`
    ].join(',')
  })
  
  return [headers.join(','), ...rows].join('\n')
}

/**
 * Загрузка файла
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

