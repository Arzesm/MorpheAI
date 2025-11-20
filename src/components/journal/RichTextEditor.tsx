'use client'

import { useRef, useEffect, useState } from 'react'
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Palette,
  Type
} from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const colors = [
    '#E2E8F0', // Светло-серый (по умолчанию)
    '#60A5FA', // Синий
    '#A78BFA', // Фиолетовый
    '#F472B6', // Розовый
    '#FB923C', // Оранжевый
    '#FBBF24', // Желтый
    '#34D399', // Зеленый
    '#F87171', // Красный
  ]

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = value
    }
  }, [])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }

  const handleColorChange = (color: string) => {
    execCommand('foreColor', color)
    setShowColorPicker(false)
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Toolbar */}
      <div className={`flex flex-wrap gap-1 p-2 rounded-lg border transition-colors ${
        isFocused 
          ? 'bg-mythic-ivory/5 border-morphe-blue/50' 
          : 'bg-mythic-ivory/[0.02] border-mythic-ivory/10'
      }`}>
        {/* Text formatting */}
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-2 rounded hover:bg-morphe-blue/20 text-mythic-ivory/70 hover:text-mythic-ivory transition-colors"
          title="Жирный (Ctrl+B)"
        >
          <Bold size={18} />
        </button>
        
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-2 rounded hover:bg-morphe-blue/20 text-mythic-ivory/70 hover:text-mythic-ivory transition-colors"
          title="Курсив (Ctrl+I)"
        >
          <Italic size={18} />
        </button>
        
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="p-2 rounded hover:bg-morphe-blue/20 text-mythic-ivory/70 hover:text-mythic-ivory transition-colors"
          title="Подчеркнутый (Ctrl+U)"
        >
          <Underline size={18} />
        </button>

        <div className="w-px h-8 bg-mythic-ivory/10 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-2 rounded hover:bg-morphe-blue/20 text-mythic-ivory/70 hover:text-mythic-ivory transition-colors"
          title="Маркированный список"
        >
          <List size={18} />
        </button>
        
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="p-2 rounded hover:bg-morphe-blue/20 text-mythic-ivory/70 hover:text-mythic-ivory transition-colors"
          title="Нумерованный список"
        >
          <ListOrdered size={18} />
        </button>

        <div className="w-px h-8 bg-mythic-ivory/10 mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => execCommand('justifyLeft')}
          className="p-2 rounded hover:bg-morphe-blue/20 text-mythic-ivory/70 hover:text-mythic-ivory transition-colors"
          title="Выровнять по левому краю"
        >
          <AlignLeft size={18} />
        </button>
        
        <button
          type="button"
          onClick={() => execCommand('justifyCenter')}
          className="p-2 rounded hover:bg-morphe-blue/20 text-mythic-ivory/70 hover:text-mythic-ivory transition-colors"
          title="Выровнять по центру"
        >
          <AlignCenter size={18} />
        </button>
        
        <button
          type="button"
          onClick={() => execCommand('justifyRight')}
          className="p-2 rounded hover:bg-morphe-blue/20 text-mythic-ivory/70 hover:text-mythic-ivory transition-colors"
          title="Выровнять по правому краю"
        >
          <AlignRight size={18} />
        </button>

        <div className="w-px h-8 bg-mythic-ivory/10 mx-1" />

        {/* Font size */}
        <button
          type="button"
          onClick={() => execCommand('fontSize', '4')}
          className="p-2 rounded hover:bg-morphe-blue/20 text-mythic-ivory/70 hover:text-mythic-ivory transition-colors text-sm font-medium"
          title="Увеличить размер"
        >
          <Type size={20} />
        </button>

        <button
          type="button"
          onClick={() => execCommand('fontSize', '2')}
          className="p-2 rounded hover:bg-morphe-blue/20 text-mythic-ivory/70 hover:text-mythic-ivory transition-colors text-xs"
          title="Уменьшить размер"
        >
          <Type size={16} />
        </button>

        <div className="w-px h-8 bg-mythic-ivory/10 mx-1" />

        {/* Color picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded hover:bg-morphe-blue/20 text-mythic-ivory/70 hover:text-mythic-ivory transition-colors"
            title="Цвет текста"
          >
            <Palette size={18} />
          </button>

          {showColorPicker && (
            <div className="absolute top-full mt-2 left-0 z-50 p-2 bg-night-deep-blue border border-morphe-blue/30 rounded-lg shadow-xl">
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorChange(color)}
                    className="w-8 h-8 rounded border-2 border-mythic-ivory/20 hover:border-morphe-blue transition-colors"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`min-h-[200px] p-4 rounded-lg border bg-mythic-ivory/[0.02] text-mythic-ivory transition-colors ${
          isFocused 
            ? 'border-morphe-blue/50 bg-mythic-ivory/[0.03]' 
            : 'border-mythic-ivory/10'
        } focus:outline-none`}
        data-placeholder={placeholder}
        style={{
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        }}
      />

      <style jsx global>{`
        [contentEditable]:empty:before {
          content: attr(data-placeholder);
          color: rgba(226, 232, 240, 0.4);
          pointer-events: none;
          display: block;
        }
        
        [contentEditable] * {
          color: inherit;
        }
        
        [contentEditable] ul,
        [contentEditable] ol {
          padding-left: 2rem !important;
          margin: 0.75rem 0 !important;
          list-style-position: outside !important;
        }
        
        [contentEditable] ul {
          list-style-type: disc !important;
        }
        
        [contentEditable] ol {
          list-style-type: decimal !important;
        }
        
        [contentEditable] li {
          margin: 0.25rem 0 !important;
          display: list-item !important;
          color: rgba(226, 232, 240, 0.8);
        }
        
        [contentEditable] strong,
        [contentEditable] b {
          font-weight: 700;
        }
        
        [contentEditable] em,
        [contentEditable] i {
          font-style: italic;
        }
        
        [contentEditable] u {
          text-decoration: underline;
        }
        
        [contentEditable] div {
          margin: 0;
        }
      `}</style>
    </div>
  )
}

