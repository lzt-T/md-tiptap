import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import type { SuggestionProps } from '@tiptap/suggestion'
import type { Editor } from '@tiptap/react'

export interface CommandItem {
  title: string
  description?: string
  icon?: string
  command: ({ editor }: { editor: Editor }) => void
}

export interface SlashCommandsOptions {
  onStart: () => void
  onUpdate: (query: string) => void
  onIndexChange: (index: number) => void
  onExit: () => void
  onClientRect: (rect: DOMRect | null) => void
}

export const defaultCommands: CommandItem[] = [
  {
    title: '标题 1',
    description: '大标题',
    icon: 'H1',
    command: ({ editor }) => {
      editor.chain().focus().setNode('heading', { level: 1 }).run()
    },
  },
  {
    title: '标题 2',
    description: '中等标题',
    icon: 'H2',
    command: ({ editor }) => {
      editor.chain().focus().setNode('heading', { level: 2 }).run()
    },
  },
  {
    title: '标题 3',
    description: '小标题',
    icon: 'H3',
    command: ({ editor }) => {
      editor.chain().focus().setNode('heading', { level: 3 }).run()
    },
  },
  {
    title: '无序列表',
    description: '项目符号列表',
    icon: '•',
    command: ({ editor }) => {
      editor.chain().focus().toggleBulletList().run()
    },
  },
  {
    title: '有序列表',
    description: '编号列表',
    icon: '1.',
    command: ({ editor }) => {
      editor.chain().focus().toggleOrderedList().run()
    },
  },
  {
    title: '行内代码',
    description: '代码标记',
    icon: '`',
    command: ({ editor }) => {
      editor.chain().focus().toggleCode().run()
    },
  },
  // {
  //   title: '代码块',
  //   description: '代码片段',
  //   icon: '</>',
  //   command: ({ editor }) => {
  //     editor.chain().focus().toggleCodeBlock().run()
  //   },
  // },
  {
    title: '表格',
    description: '添加表格',
    icon: '▦',
    command: ({ editor }) => {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    },
  },
]

export const SlashCommands = Extension.create<SlashCommandsOptions>({
  name: 'slashCommands',
  addOptions() {
    return {
      onStart: () => {},
      onUpdate: () => {},
      onIndexChange: () => {},
      onExit: () => {},
      onClientRect: () => {},
    }
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '/',
        items: ({ query }: { query: string }) => {
          return defaultCommands.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
          )
        },
        command: ({ editor, range, props }: { editor: Editor; range: { from: number; to: number }; props: CommandItem }) => {
          editor.chain().focus().deleteRange(range).run()
          props.command({ editor })
        },
        render: () => {
          let currentIndex = 0
          let items: CommandItem[] = defaultCommands
          let currentEditor: Editor = this.editor
          let currentRange: { from: number; to: number } = { from: 0, to: 0 }

          return {
            onStart: (props: SuggestionProps<CommandItem>) => {
              currentIndex = 0
              items = props.items
              currentEditor = props.editor
              currentRange = props.range
              this.options.onStart()
              this.options.onUpdate(props.query)
              this.options.onIndexChange(0)
              if (props.clientRect) {
                const rect = props.clientRect()
                this.options.onClientRect(rect)
              }
            },
            onUpdate: (props: SuggestionProps<CommandItem>) => {
              items = props.items
              currentEditor = props.editor
              currentRange = props.range
              currentIndex = 0
              this.options.onUpdate(props.query)
              this.options.onIndexChange(0)
              if (props.clientRect) {
                const rect = props.clientRect()
                this.options.onClientRect(rect)
              }
            },
            onKeyDown: (props: { event: KeyboardEvent }) => {
              const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter', 'Escape']
              if (!navigationKeys.includes(props.event.key)) {
                return false
              }

              props.event.preventDefault()
              props.event.stopPropagation()

              switch (props.event.key) {
                case 'ArrowUp':
                  currentIndex = (currentIndex + items.length - 1) % items.length
                  this.options.onIndexChange(currentIndex)
                  return true
                case 'ArrowDown':
                  currentIndex = (currentIndex + 1) % items.length
                  this.options.onIndexChange(currentIndex)
                  return true
                case 'Enter':
                  if (items[currentIndex]) {
                    currentEditor.chain().focus().deleteRange(currentRange).run()
                    items[currentIndex].command({ editor: currentEditor })
                  }
                  return true
                case 'Escape':
                  this.options.onExit()
                  return true
              }

              return false
            },
            onExit: () => {
              this.options.onExit()
            },
          }
        },
      }),
    ]
  },
})

export default SlashCommands
