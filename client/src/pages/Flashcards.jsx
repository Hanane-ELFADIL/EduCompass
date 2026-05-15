import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { useHistory } from '../context/HistoryContext'
import { generateFlashcards } from '../services/api'
import { BsCardText, BsQuestionCircle, BsLightbulb, BsArrowRepeat, BsHourglass } from 'react-icons/bs'
import GuestBanner from '../components/GuestBanner'
import FileUpload from '../components/FileUpload'

function Flashcards() {
  const { t, lang } = useLang()
  const { guestMode } = useAuth()
  const navigate = useNavigate()
  const { addEntry } = useHistory()
  const [courseText, setCourseText] = useState('')
  const [cards, setCards] = useState([])
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState('input')

  const handleExtracted = (text) => {
    setCourseText(text)
  }

  const handleGenerate = async () => {
    if (!courseText.trim()) return
    setLoading(true)
    try {
      const fc = await generateFlashcards(courseText, lang)
      setCards(fc)
      setCurrent(0)
      setFlipped(false)
      setPhase('cards')
      addEntry('flashcard', courseText.slice(0, 50) + '...')
    } catch {
      alert('Erreur lors de la génération des flashcards')
    } finally {
      setLoading(false)
    }
  }

  const next = () => { setCurrent(c => Math.min(c + 1, cards.length - 1)); setFlipped(false) }
  const prev = () => { setCurrent(c => Math.max(c - 1, 0)); setFlipped(false) }

  if (phase === 'cards' && cards.length > 0) {
    const card = cards[current]
    return (
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="tool-page-icon"><BsCardText /></div>
          <div>
            <h1 className="tool-page-title">{t.flashTitle}</h1>
            <p className="tool-page-sub">{current + 1} / {cards.length} — {t.flashClickHint}</p>
          </div>
        </div>

        <div className="quiz-progress">
          {cards.map((_, i) => (
            <div key={i} className={`quiz-dot ${i < current ? 'done' : i === current ? 'current' : ''}`} />
          ))}
        </div>

        <div className="flashcard-container" onClick={() => setFlipped(f => !f)}>
          <div className={`flashcard ${flipped ? 'flipped' : ''}`}>
            <div className="flashcard-face flashcard-front">
              <div>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}><BsQuestionCircle /></div>
                <p style={{ fontFamily: 'Playfair Display,serif', fontSize: '1.1rem', color: 'var(--text)' }}>{card.question}</p>
                <p className="flashcard-hint">{t.flashClickHint}</p>
              </div>
            </div>
            <div className="flashcard-face flashcard-back">
              <div>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}><BsLightbulb /></div>
                <p style={{ fontSize: '1rem' }}>{card.answer}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flashcard-nav">
          <button className="fc-btn" onClick={prev} disabled={current === 0}>← {t.prev}</button>
          <button className="fc-btn" onClick={() => setFlipped(f => !f)}><BsArrowRepeat /> {t.flip}</button>
          <button className="fc-btn" onClick={next} disabled={current === cards.length - 1}>{t.next} →</button>
        </div>

        <button className="btn-action" style={{ alignSelf: 'center', marginTop: 8 }}
          onClick={() => { setPhase('input'); setCards([]) }}>
          {t.newDeck}
        </button>
      </div>
    )
  }

  return (
    <div className="tool-page">
      {guestMode && (
        <GuestBanner onLogin={() => navigate('/login')} onRegister={() => navigate('/register')} />
      )}
      <div className="tool-page-header">
        <div className="tool-page-icon"><BsCardText /></div>
        <div>
          <h1 className="tool-page-title">{t.flashTitle}</h1>
          <p className="tool-page-sub">{t.flashSub}</p>
        </div>
      </div>

      <div className="input-area">
        {/* PDF/Image upload */}
        <FileUpload onExtracted={handleExtracted} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.78rem' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          ou collez le texte
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <textarea
          className="textarea-input"
          value={courseText}
          onChange={e => setCourseText(e.target.value)}
          placeholder={t.flashPlaceholder}
          style={{ minHeight: 120 }}
        />

        <button className="btn-action" onClick={handleGenerate} disabled={loading || !courseText.trim()}>
          {loading ? <><BsHourglass /> Génération...</> : t.flashBtn}
        </button>
      </div>
    </div>
  )
}

export default Flashcards
