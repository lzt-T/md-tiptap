import type { CommandItem } from '../extensions/SlashCommands'
import './CommandMenu.css'
import { useEffect, useRef } from 'react'

interface CommandMenuProps {
  items: CommandItem[]
  command: (item: CommandItem) => void
  selectedIndex: number
  position: { top: number; left: number }
}

const CommandMenu = ({ items, command, selectedIndex, position }: CommandMenuProps) => {
  const selectedRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      })
    }
  }, [selectedIndex])

  if (items.length === 0) {
    return null
  }

  return (
    <div 
      className="command-menu"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
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
    </div>
  )
}

export default CommandMenu
