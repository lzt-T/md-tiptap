import { Editor } from '@tiptap/react'
import { useEffect, useState } from 'react'
import './TableMenu.css'

interface TableMenuProps {
  editor: Editor
}

const TableMenu = ({ editor }: TableMenuProps) => {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)

  useEffect(() => {
    const updatePosition = () => {
      if (!editor.isActive('table')) {
        setPosition(null)
        return
      }

      // 获取当前选中的单元格
      const { view } = editor
      const { from } = view.state.selection
      const domAtPos = view.domAtPos(from)
      const tableElement = (domAtPos.node as Element).closest('table')

      if (tableElement) {
        const tableRect = tableElement.getBoundingClientRect()
        
        setPosition({
          top: tableRect.top - 40, // 工具栏显示在表格上方
          left: tableRect.left,
        })
      }
    }

    updatePosition()

    // 监听编辑器更新
    editor.on('selectionUpdate', updatePosition)
    editor.on('update', updatePosition)

    // 监听滚动事件
    const editorWrapper = document.querySelector('.editor-wrapper')
    if (editorWrapper) {
      editorWrapper.addEventListener('scroll', updatePosition)
    }

    return () => {
      editor.off('selectionUpdate', updatePosition)
      editor.off('update', updatePosition)
      if (editorWrapper) {
        editorWrapper.removeEventListener('scroll', updatePosition)
      }
    }
  }, [editor])

  if (!editor.isActive('table') || !position) {
    return null
  }

  return (
    <div 
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
