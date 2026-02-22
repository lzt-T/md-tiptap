import { Editor } from '@tiptap/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './TableMenu.css'

interface TableMenuProps {
  editor: Editor
  editorWrapperRef: React.RefObject<HTMLDivElement | null>
}

const TableMenu = ({ editor, editorWrapperRef }: TableMenuProps) => {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updatePosition = () => {
      const wrapper = editorWrapperRef.current
      if (!editor.isActive('table') || !wrapper) {
        setPosition(null)
        return
      }

      const { view } = editor
      const { from } = view.state.selection
      const domAtPos = view.domAtPos(from)
      const tableElement = (domAtPos.node as Element).closest('table')

      if (tableElement) {
        const tableRect = tableElement.getBoundingClientRect()
        const wrapperRect = wrapper.getBoundingClientRect()

        // 与 CommandMenu 一样：坐标转换为相对 wrapper 的绝对定位，加上滚动偏移
        const tableTopInWrapper = tableRect.top - wrapperRect.top + wrapper.scrollTop
        const tableLeftInWrapper = tableRect.left - wrapperRect.left

        // 默认显示在表格上方 40px，空间不足时翻到下方
        const MENU_HEIGHT = 40
        const top =
          tableTopInWrapper - MENU_HEIGHT >= 0
            ? tableTopInWrapper - MENU_HEIGHT
            : tableTopInWrapper + tableRect.height + 4

        setPosition({ top, left: tableLeftInWrapper })
      }
    }

    updatePosition()

    editor.on('selectionUpdate', updatePosition)
    editor.on('update', updatePosition)

    const wrapper = editorWrapperRef.current
    wrapper?.addEventListener('scroll', updatePosition)

    return () => {
      editor.off('selectionUpdate', updatePosition)
      editor.off('update', updatePosition)
      wrapper?.removeEventListener('scroll', updatePosition)
    }
  }, [editor, editorWrapperRef])

  // 渲染后修正水平溢出，确保不超出 wrapper 右边界
  useLayoutEffect(() => {
    const wrapper = editorWrapperRef.current
    if (!menuRef.current || !position || !wrapper) return

    const menuWidth = menuRef.current.offsetWidth
    const wrapperWidth = wrapper.clientWidth
    const maxLeft = wrapperWidth - menuWidth - 8

    if (position.left > maxLeft) {
      setPosition(prev => prev ? { ...prev, left: Math.max(0, maxLeft) } : prev)
    }
  }, [position, editorWrapperRef])

  if (!editor.isActive('table') || !position) {
    return null
  }

  return (
    <div
      ref={menuRef}
      className="table-menu"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <button
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        title="在左侧插入列"
      >
        ⬅️ 列
      </button>
      <button
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        title="在右侧插入列"
      >
        列 ➡️
      </button>
      <button
        onClick={() => editor.chain().focus().deleteColumn().run()}
        title="删除当前列"
        disabled={!editor.can().deleteColumn()}
      >
        🗑️ 列
      </button>
      <span className="separator">|</span>
      <button
        onClick={() => editor.chain().focus().addRowBefore().run()}
        title="在上方插入行"
      >
        ⬆️ 行
      </button>
      <button
        onClick={() => editor.chain().focus().addRowAfter().run()}
        title="在下方插入行"
      >
        行 ⬇️
      </button>
      <button
        onClick={() => editor.chain().focus().deleteRow().run()}
        title="删除当前行"
        disabled={!editor.can().deleteRow()}
      >
        🗑️ 行
      </button>
      <span className="separator">|</span>
      <button
        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
        title="切换表头行"
      >
        📋
      </button>
      <button
        onClick={() => editor.chain().focus().deleteTable().run()}
        title="删除整个表格"
      >
        🗑️
      </button>
    </div>
  )
}

export default TableMenu
