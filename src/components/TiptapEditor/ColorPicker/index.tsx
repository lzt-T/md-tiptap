import { useState } from 'react'
import { config } from '@/config'
import './ColorPicker.css'

interface ColorPickerProps {
  onColorSelect: (color: string) => void
  type: 'text' | 'highlight'
  style?: React.CSSProperties
  className?: string
}

const ColorPicker = ({ onColorSelect, type, style }: ColorPickerProps) => {
  const colors = type === 'text' ? config.TEXT_COLORS : config.HIGHLIGHT_COLORS
  const [showCustomInput, setShowCustomInput] = useState(false)

  return (
    <div className="color-picker" style={style}>
      <div className="color-picker-grid">
        {colors.map((color) => (
          <button
            key={color.value || 'transparent'}
            className={`color-picker-swatch${color.value === '' ? ' color-picker-swatch--transparent' : ''}`}
            style={color.value ? { backgroundColor: color.value } : undefined}
            onClick={() => onColorSelect(color.value)}
            title={color.name}
          />
        ))}
      </div>
      {!showCustomInput && (
        <button 
          className="color-picker-custom-btn"
          onClick={() => setShowCustomInput(true)}
        >
          + 自定义颜色
        </button>
      )}
      {showCustomInput && (
        <div className="color-picker-custom">
          <input
            type="color"
            onChange={(e) => onColorSelect(e.target.value)}
            className="color-picker-input"
          />
          <button
            className="color-picker-close-btn"
            onClick={() => setShowCustomInput(false)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

export default ColorPicker
