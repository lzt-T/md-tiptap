import type { CommandItem } from '../extensions/SlashCommands'
import './CommandMenu.css'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface CommandMenuProps {
  items: CommandItem[]
  command: (item: CommandItem) => void
  selectedIndex: number
  position: { top: number; left: number }
}

const CommandMenu = ({ items, command, selectedIndex, position }: CommandMenuProps) => {
  const selectedRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [menuHeight, setMenuHeight] = useState(0)

  // 自动滚动选中项
  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      })
    }
  }, [selectedIndex])

  // 获取菜单高度用于位置计算
  useLayoutEffect(() => {
    if (menuRef.current) {
      setMenuHeight(menuRef.current.getBoundingClientRect().height)
    }
  }, [items.length]) // 只在菜单项数量变化时重新计算

  // 计算调整后的位置（在渲染时计算，不使用 effect）
  const getAdjustedPosition = () => {
    const viewportHeight = window.innerHeight
    
    let newTop = position.top

    // 检查是否超出底部
    if (menuHeight > 0 && position.top + menuHeight > viewportHeight) {
      // 显示在光标上方，增加间距到 24px
      newTop = position.top - menuHeight - 32
      
      // 如果上方也放不下，则固定在视口底部
      if (newTop < 16) {
        newTop = Math.max(16, viewportHeight - menuHeight - 16)
      }
    }

    return { top: newTop, left: position.left }
  }

  const adjustedPosition = getAdjustedPosition()

  if (items.length === 0) {
    return null
  }

  // 使用 Portal 将菜单渲染到 body 下，避免被父容器裁剪
  return createPortal(
    <div 
      ref={menuRef}
      className="command-menu"
      style={{
        top: `${adjustedPosition.top}px`,
        left: `${adjustedPosition.left}px`,
      }}
    >
      <div className="command-menu-header">基础块</div>
      {items.map((item, index) => (
        <button
          key={item.title}
          ref={index === selectedIndex ? selectedRef : null}
          className={`command-menu-item ${index === selectedIndex ? 'is-selected' : ''}`}
          onClick={() => command(item)}
        >
          <div className="command-menu-icon">{item.icon}</div>
          <div className="command-menu-content">
            <div className="command-menu-title">{item.title}</div>
            {item.description && (
              <div className="command-menu-description">{item.description}</div>
            )}
          </div>
        </button>
      ))}
    </div>,
    document.body
  )
}

export default CommandMenu
