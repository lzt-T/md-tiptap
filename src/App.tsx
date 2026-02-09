import TiptapEditor from './components/TiptapEditor'
import './App.css'

function App() {
  return (
    <div className="app">
      <h1>Tiptap Markdown Editor</h1>
      <div style={{ height: 'calc(100vh - 200px)' }}>
        <TiptapEditor />
      </div>
    </div>
  )
}

export default App
