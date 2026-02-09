import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Underline from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { SlashCommands, defaultCommands } from './extensions/SlashCommands'
import CommandMenu from './CommandMenu'
import TableMenu from './TableMenu'
import BubbleMenu from './BubbleMenu/index'
import './TiptapEditor.css'
import { useState, useCallback } from 'react'

const TiptapEditor = () => {
  const [showCommandMenu, setShowCommandMenu] = useState(false)
  const [commandQuery, setCommandQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null)

  const handleStart = useCallback(() => {
    setShowCommandMenu(true)
    setCommandQuery('')
  }, [])

  const handleUpdate = useCallback((query: string) => {
    setCommandQuery(query)
  }, [])

  const handleIndexChange = useCallback((index: number) => {
    setSelectedIndex(index)
  }, [])

  const handleClientRect = useCallback((rect: DOMRect | null) => {
    if (rect) {
      // rect 是相对于视口的，使用 fixed 定位直接使用视口坐标
      setMenuPosition({
        top: rect.bottom + 4, // 添加4px间距
        left: rect.left,
      })
    }
  }, [])

  const handleExit = useCallback(() => {
    setShowCommandMenu(false)
    setMenuPosition(null)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Underline,
      Subscript,
      Superscript,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: "输入 '/' 查看命令...",
      }),
      SlashCommands.configure({
        onStart: handleStart,
        onUpdate: handleUpdate,
        onIndexChange: handleIndexChange,
        onClientRect: handleClientRect,
        onExit: handleExit,
      }),
    ],
    content: '<p></p>',
  })

  const filteredCommands = defaultCommands.filter((item) =>
    item.title.toLowerCase().includes(commandQuery.toLowerCase())
  )

  const handleCommand = useCallback(
    (item: (typeof defaultCommands)[0]) => {
      if (editor) {
        // 删除 / 和查询文本
        const { from } = editor.state.selection
        const textBefore = editor.state.doc.textBetween(Math.max(0, from - 50), from, '\n')
        const slashIndex = textBefore.lastIndexOf('/')
        
        if (slashIndex !== -1) {
          const deleteFrom = from - (textBefore.length - slashIndex)
          editor.chain().focus().deleteRange({ from: deleteFrom, to: from }).run()
        }
        
        item.command({ editor })
        setShowCommandMenu(false)
      }
    },
    [editor]
  )

  return (
    <div className="editor-container">
      <div className="editor-wrapper notion-editor">
        {editor && <TableMenu editor={editor} />}
        <EditorContent editor={editor} />
        {editor && <BubbleMenu editor={editor} />}
        {showCommandMenu && editor && menuPosition && (
          <CommandMenu
            items={filteredCommands}
            command={handleCommand}
            selectedIndex={selectedIndex}
            position={menuPosition}
          />
        )}
      </div>
    </div>
  )
}

export default TiptapEditor
