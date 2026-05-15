import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BsChatDots, BsRobot, BsPersonCircle, BsHourglass, BsSend, BsXCircle } from 'react-icons/bs'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import GuestBanner from '../components/GuestBanner'
import { sendMessage } from '../services/api'
import emptyChatIllustration from '../images/empty_chat.svg'

// Show a soft login nudge after this many user messages in guest mode
const GUEST_NUDGE_AFTER = 5

function Chat() {
  const { t, lang } = useLang()
  const { guestMode } = useAuth()
  const navigate = useNavigate()

  const [messages, setMessages] = useState([
    { role: 'assistant', content: t.chatWelcome }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showNudge, setShowNudge] = useState(false)
  const endRef = useRef()

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  // Count user messages and show nudge after threshold
  const userMessageCount = messages.filter(m => m.role === 'user').length
  useEffect(() => {
    if (guestMode && userMessageCount >= GUEST_NUDGE_AFTER) {
      setShowNudge(true)
    }
  }, [guestMode, userMessageCount])

  const quickQuestions = [t.quickQ1, t.quickQ2, t.quickQ3, t.quickQ4]

  const handleSend = async (text) => {
    const msg = text || input
    if (!msg.trim() || loading) return
    setInput('')

    const updated = [...messages, { role: 'user', content: msg }]
    setMessages(updated)
    setLoading(true)

    try {
      const reply = await sendMessage(updated, lang)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erreur technique. Réessayez.', isError: true }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-page">
      {/* Guest banner — shown when unauthenticated */}
      {guestMode && (
        <GuestBanner
          onLogin={() => navigate('/login')}
          onRegister={() => navigate('/register')}
        />
      )}

      <div className="chat-header">
        <div className="chat-header-icon"><BsChatDots /></div>
        <div>
          <div className="chat-header-title">{t.chatTitle}</div>
          <div className="chat-header-sub">EduCompass</div>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((m, i) => (
          <div key={i} className={`message-wrapper ${m.role === 'user' ? 'user-wrapper' : 'assistant-wrapper'}`}>
            {m.role === 'assistant' && <div className="avatar assistant-avatar"><BsRobot /></div>}
            <div className={`message-bubble ${m.role === 'user' ? 'user-bubble' : 'assistant-bubble'}`}>
              {m.isError
                ? <p><BsXCircle style={{ verticalAlign: 'middle', marginRight: '0.3em' }} />{m.content}</p>
                : m.content.split('\n').map((line, j) => <p key={j}>{line}</p>)
              }
            </div>
            {m.role === 'user' && <div className="avatar user-avatar"><BsPersonCircle /></div>}
          </div>
        ))}

        {/* Soft login nudge — non-blocking, shown after N messages in guest mode */}
        {showNudge && (
          <div className="guest-nudge">
            <p>{t.guestBannerMsg}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <button className="btn-banner-login" onClick={() => navigate('/login')}>{t.login}</button>
              <button className="btn-banner-register" onClick={() => navigate('/register')}>{t.register}</button>
              <button className="btn-banner-dismiss" onClick={() => setShowNudge(false)}>{t.guestBannerDismiss}</button>
            </div>
          </div>
        )}

        {loading && (
          <div className="typing-indicator">
            <span/><span/><span/>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      {messages.length <= 1 && (
        <div className="quick-questions">
          <div className="empty-state">
            <img
              src={emptyChatIllustration}
              alt="Démarrez une conversation avec votre assistant IA"
              className="empty-state-img"
            />
          </div>
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
          {loading ? <BsHourglass /> : <BsSend />}
        </button>
      </div>
    </div>
  )
}

export default Chat
