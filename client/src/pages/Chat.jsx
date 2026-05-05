import { useState, useRef, useEffect } from 'react'
import { useLang } from '../context/LangContext'
import { sendMessage } from '../services/api'

function Chat() {
  const { t } = useLang()
  const [messages, setMessages] = useState([
    { role: 'assistant', content: t.chatWelcome }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef()

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const quickQuestions = [t.quickQ1, t.quickQ2, t.quickQ3, t.quickQ4]

  const handleSend = async (text) => {
    const msg = text || input
    if (!msg.trim() || loading) return
    setInput('')

    const updated = [...messages, { role: 'user', content: msg }]
    setMessages(updated)
    setLoading(true)

    try {
      const reply = await sendMessage(updated)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Erreur technique. Réessayez.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="chat-header-icon">💬</div>
        <div>
          <div className="chat-header-title">{t.chatTitle}</div>
          <div className="chat-header-sub">طالب AI</div>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((m, i) => (
          <div key={i} className={`message-wrapper ${m.role === 'user' ? 'user-wrapper' : 'assistant-wrapper'}`}>
            {m.role === 'assistant' && <div className="avatar assistant-avatar">🤖</div>}
            <div className={`message-bubble ${m.role === 'user' ? 'user-bubble' : 'assistant-bubble'}`}>
              {m.content.split('\n').map((line, j) => <p key={j}>{line}</p>)}
            </div>
            {m.role === 'user' && <div className="avatar user-avatar">👤</div>}
          </div>
        ))}
        {loading && (
          <div className="typing-indicator">
            <span/><span/><span/>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      {messages.length <= 1 && (
        <div className="quick-questions">
          <p className="quick-title">Questions rapides / أسئلة سريعة</p>
          <div className="quick-grid">
            {quickQuestions.map((q, i) => (
              <button key={i} className="quick-btn" onClick={() => handleSend(q)}>{q}</button>
            ))}
          </div>
        </div>
      )}

      <div className="chat-input-container">
        <textarea
          className="chat-input"
          rows={2}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }}}
          placeholder={t.chatPlaceholder}
          disabled={loading}
        />
        <button className="send-btn" onClick={() => handleSend()} disabled={loading || !input.trim()}>
          {loading ? '⏳' : '➤'}
        </button>
      </div>
    </div>
  )
}

export default Chat
