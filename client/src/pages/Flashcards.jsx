import { useState } from 'react'
import { useLang } from '../context/LangContext'
import { useHistory } from '../context/HistoryContext'
import { generateFlashcards } from '../services/api'

function Flashcards() {
  const { t } = useLang()
  const { addEntry } = useHistory()
  const [courseText, setCourseText] = useState('')
  const [cards, setCards] = useState([])
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState('input')

  const handleGenerate = async () => {
    if (!courseText.trim()) return
    setLoading(true)
    try {
      const fc = await generateFlashcards(courseText)
      setCards(fc)
      setCurrent(0)
      setFlipped(false)
      setPhase('cards')
      addEntry('flashcard', courseText.slice(0,50)+'...')
    } catch {
      alert('Erreur lors de la génération des flashcards')
    } finally {
      setLoading(false)
    }
  }

  const next = () => { setCurrent(c => Math.min(c+1, cards.length-1)); setFlipped(false) }
  const prev = () => { setCurrent(c => Math.max(c-1, 0)); setFlipped(false) }

  if (phase === 'cards' && cards.length > 0) {
    const card = cards[current]
    return (
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="tool-page-icon">🃏</div>
          <div>
            <h1 className="tool-page-title">{t.flashTitle}</h1>
            <p className="tool-page-sub">{current+1} / {cards.length}</p>
          </div>
        </div>

        <div className="quiz-progress">
          {cards.map((_,i) => (
            <div key={i} className={`quiz-dot ${i<current?'done':i===current?'current':''}`}/>
          ))}
        </div>

        <div className="flashcard-container" onClick={()=>setFlipped(f=>!f)}>
          <div className={`flashcard ${flipped?'flipped':''}`}>
            <div className="flashcard-face flashcard-front">
              <div>
                <div style={{fontSize:'2rem',marginBottom:12}}>❓</div>
                <p style={{fontFamily:'Playfair Display,serif',fontSize:'1.15rem',color:'var(--text)'}}>{card.question}</p>
                <p className="flashcard-hint">{t.flashClickHint}</p>
              </div>
            </div>
            <div className="flashcard-face flashcard-back">
              <div>
                <div style={{fontSize:'2rem',marginBottom:12}}>💡</div>
                <p style={{fontSize:'1.05rem'}}>{card.answer}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flashcard-nav">
          <button className="fc-btn" onClick={prev} disabled={current===0}>← {t.prev}</button>
          <button className="fc-btn" onClick={()=>setFlipped(f=>!f)}>🔄 {t.flip}</button>
          <button className="fc-btn" onClick={next} disabled={current===cards.length-1}>{t.next} →</button>
        </div>

        <button className="btn-action" style={{alignSelf:'center',marginTop:8}} onClick={()=>{setPhase('input');setCards([])}}>
          {t.newDeck}
        </button>
      </div>
    )
  }

  return (
    <div className="tool-page">
      <div className="tool-page-header">
        <div className="tool-page-icon">🃏</div>
        <div>
          <h1 className="tool-page-title">{t.flashTitle}</h1>
          <p className="tool-page-sub">{t.flashSub}</p>
        </div>
      </div>
      <div className="input-area">
        <textarea
          className="textarea-input"
          value={courseText}
          onChange={e=>setCourseText(e.target.value)}
          placeholder={t.flashPlaceholder}
        />
        <button className="btn-action" onClick={handleGenerate} disabled={loading || !courseText.trim()}>
          {loading ? '⏳ ...' : t.flashBtn}
        </button>
      </div>
    </div>
  )
}

export default Flashcards
