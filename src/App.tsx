import { useState, useEffect } from 'react'
import TiptapEditor from './components/TiptapEditor'
import './App.css'

function App() {
  const [content, setContent] = useState('')

  const handleEditorChange = (html: string) => {
    setContent(html)
    console.log('✏️ onChange 被触发 - 用户编辑:', html)
  }


  useEffect(() => {
    console.log('📡 准备从接口加载数据...')
    setTimeout(() => {
      console.log('📥 接口数据返回，设置 content（此操作不应触发 onChange）')
      setContent('<p>欢迎使用 Tiptap 编辑器！asd</p><p></p><div data-latex="\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}" data-type="block-math"></div><p></p>')
    }, 2000)
  }, [])

  return (
    <div className="app">
      <h1>Tiptap Markdown Editor</h1>
      <div style={{ height: 'calc(100vh - 200px)' }}>
        <TiptapEditor value={content} onChange={handleEditorChange} />
      </div>
    </div>
  )
}

export default App
