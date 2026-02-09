import { useState, useEffect, useRef } from 'react'
import katex from 'katex'
import './MathDialog.css'

interface MathDialogProps {
  isOpen: boolean
  initialValue?: string
  type: 'inline' | 'block'
  onConfirm: (latex: string) => void
  onCancel: () => void
}

const MathDialog = ({ isOpen, initialValue = '', type, onConfirm, onCancel }: MathDialogProps) => {
  const [latex, setLatex] = useState('')
  const [previewError, setPreviewError] = useState<string | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  // Reset latex when dialog opens with new initial value
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isOpen) {
      setLatex(initialValue)
    }
  }, [isOpen, initialValue])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isOpen])

  // Update preview when latex changes
  useEffect(() => {
    if (previewRef.current && latex) {
      try {
        katex.render(latex, previewRef.current, {
          displayMode: type === 'block',
          throwOnError: false,
          errorColor: '#dc2626',
        })
        setPreviewError(null)
      } catch (error) {
        setPreviewError((error as Error).message)
      }
    } else if (previewRef.current) {
      previewRef.current.innerHTML = ''
      setPreviewError(null)
    }
  }, [latex, type])

  const handleConfirm = () => {
    onConfirm(latex)
    setLatex('')
  }

  const handleCancel = () => {
    onCancel()
    setLatex('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleConfirm()
    }
    // 移除了 Escape 键关闭功能
  }

  if (!isOpen) return null

  return (
    <div className="math-dialog-overlay">
      <div className="math-dialog">
        <div className="math-dialog-header">
          <h3>{type === 'inline' ? '插入行内公式' : '插入块级公式'}</h3>
        </div>
        <div className="math-dialog-body">
          <label htmlFor="latex-input">LaTeX 公式:</label>
          <textarea
            ref={inputRef}
            id="latex-input"
            className="math-dialog-input"
            value={latex}
            onChange={(e) => setLatex(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={type === 'inline' ? 'E = mc^2' : '\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}'}
            rows={type === 'inline' ? 3 : 5}
          />
          <div className="math-dialog-preview-section">
            <label>预览:</label>
            <div className="math-dialog-preview">
              <div ref={previewRef} className="math-dialog-preview-content"></div>
              {!latex && <div className="math-dialog-preview-placeholder">输入公式后将显示预览...</div>}
              {previewError && <div className="math-dialog-preview-error">预览错误: {previewError}</div>}
            </div>
          </div>
          
          <div className="math-dialog-hint">
            <p>提示: Ctrl/Cmd + Enter 快速确认</p>
            <p>常用语法:</p>
            <ul>
              <li>分数: <code>\frac{'{a}'}{'{b}'}</code></li>
              <li>上标: <code>x^2</code></li>
              <li>下标: <code>x_i</code></li>
              <li>根号: <code>\sqrt{'{x}'}</code></li>
              <li>积分: <code>\int_{'{下限}'}^{'{上限}'}</code></li>
              <li>求和: <code>\sum_{'{i=1}'}^{'{n}'}</code></li>
            </ul>
          </div>
        </div>
        <div className="math-dialog-footer">
          <button className="math-dialog-button math-dialog-button-cancel" onClick={handleCancel}>
            取消
          </button>
          <button className="math-dialog-button math-dialog-button-confirm" onClick={handleConfirm}>
            确定
          </button>
        </div>
      </div>
    </div>
  )
}

export default MathDialog
