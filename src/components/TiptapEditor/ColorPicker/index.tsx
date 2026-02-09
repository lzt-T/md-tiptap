import { useState } from 'react'
import './ColorPicker.css'

interface ColorPickerProps {
  onColorSelect: (color: string) => void
  type: 'text' | 'highlight'
}

const TEXT_COLORS = [
  { name: '默认', value: '#000000' },
  { name: '灰色', value: '#6B7280' },
  { name: '棕色', value: '#92400E' },
  { name: '橙色', value: '#EA580C' },
  { name: '黄色', value: '#CA8A04' },
  { name: '绿色', value: '#16A34A' },
  { name: '蓝色', value: '#2563EB' },
  { name: '紫色', value: '#9333EA' },
  { name: '粉色', value: '#DB2777' },
  { name: '红色', value: '#DC2626' },
]

const HIGHLIGHT_COLORS = [
  { name: '默认', value: '#FEF08A' },
  { name: '灰色', value: '#E5E7EB' },
  { name: '棕色', value: '#FED7AA' },
  { name: '橙色', value: '#FED7AA' },
  { name: '黄色', value: '#FEF08A' },
  { name: '绿色', value: '#BBF7D0' },
  { name: '蓝色', value: '#BFDBFE' },
  { name: '紫色', value: '#E9D5FF' },
  { name: '粉色', value: '#FBCFE8' },
  { name: '红色', value: '#FECACA' },
]

const ColorPicker = ({ onColorSelect, type }: ColorPickerProps) => {
  const colors = type === 'text' ? TEXT_COLORS : HIGHLIGHT_COLORS
  const [showCustomInput, setShowCustomInput] = useState(false)

  return (
    <div className="color-picker">
      <div className="color-picker-title">
        {type === 'text' ? '文字颜色' : '高亮颜色'}
      </div>
      <div className="color-picker-grid">
        {colors.map((color) => (
          <button
            key={color.value}
            className="color-picker-swatch"
            style={{ backgroundColor: color.value }}
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
