import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react/menus'
import type { Editor } from '@tiptap/react'
import { useState, useEffect, useRef } from 'react'
import ColorPicker from '../ColorPicker'
import './BubbleMenu.css'

interface BubbleMenuProps {
  editor: Editor
}

const BubbleMenu = ({ editor }: BubbleMenuProps) => {
  const [showColorPicker, setShowColorPicker] = useState<'text' | 'highlight' | null>(null)
  const [colorPickerPosition, setColorPickerPosition] = useState<{ top: number; left: number } | null>(null)
  const bubbleMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (showColorPicker && bubbleMenuRef.current) {
      const rect = bubbleMenuRef.current.getBoundingClientRect()
      setColorPickerPosition({
        top: rect.bottom + 8, // 在 BubbleMenu 下方 8px
        left: rect.left,
      })
    } else {
      setColorPickerPosition(null)
    }
  }, [showColorPicker])

  if (!editor) {
    return null
  }

  const handleFormat = (formatAction: () => void) => {
    const { to } = editor.state.selection
    formatAction()
    // 取消选中,将光标移到选中区域末尾
    editor.commands.setTextSelection(to)
  }

  const handleTextColorSelect = (color: string) => {
    handleFormat(() => editor.chain().focus().setColor(color).run())
    setShowColorPicker(null)
  }

  const handleHighlightColorSelect = (color: string) => {
    handleFormat(() => editor.chain().focus().setHighlight({ color }).run())
    setShowColorPicker(null)
  }

  return (
    <>
      <TiptapBubbleMenu editor={editor} className="bubble-menu">
        <div ref={bubbleMenuRef} style={{ display: 'contents' }}>
          <button
            onClick={() => handleFormat(() => editor.chain().focus().toggleBold().run())}
            className={editor.isActive('bold') ? 'is-active' : ''}
            title="粗体 (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => handleFormat(() => editor.chain().focus().toggleItalic().run())}
            className={editor.isActive('italic') ? 'is-active' : ''}
            title="斜体 (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => handleFormat(() => editor.chain().focus().toggleUnderline().run())}
            className={editor.isActive('underline') ? 'is-active' : ''}
            title="下划线 (Ctrl+U)"
          >
            <u>U</u>
          </button>
          <button
            onClick={() => handleFormat(() => editor.chain().focus().toggleStrike().run())}
            className={editor.isActive('strike') ? 'is-active' : ''}
            title="删除线"
          >
            <s>S</s>
          </button>
          <span className="separator">|</span>
          <button
            onClick={() => handleFormat(() => editor.chain().focus().toggleCode().run())}
            className={editor.isActive('code') ? 'is-active' : ''}
            title="行内代码"
          >
            {'</>'}
          </button>
          <span className="separator">|</span>
          {/* 官方是免费的 */}
          <button
            onClick={() => setShowColorPicker(showColorPicker === 'highlight' ? null : 'highlight')}
            className={editor.isActive('highlight') ? 'is-active' : ''}
            title="高亮颜色"
          >
            🖍️
          </button>
          {/* 官方的需要钱 */}
          <button
            onClick={() => setShowColorPicker(showColorPicker === 'text' ? null : 'text')}
            title="文字颜色"
          >
            🎨
          </button>
        </div>
      </TiptapBubbleMenu>

      {showColorPicker && colorPickerPosition && (
        <>
          <div className="color-picker-overlay" onClick={() => setShowColorPicker(null)} />
          <div
            className="color-picker-container"
            style={{
              top: `${colorPickerPosition.top}px`,
              left: `${colorPickerPosition.left}px`,
            }}
          >
            <ColorPicker
              type={showColorPicker}
              onColorSelect={
                showColorPicker === 'text' ? handleTextColorSelect : handleHighlightColorSelect
              }
            />
          </div>
        </>
      )}
    </>
  )
}

export default BubbleMenu
