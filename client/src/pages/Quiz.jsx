import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { generateQuiz } from '../services/api'
import { BsLightbulb, BsHourglass, BsStars, BsCheckCircleFill, BsXCircle } from 'react-icons/bs'
import GuestBanner from '../components/GuestBanner'
import FileUpload from '../components/FileUpload'

function Quiz() {
  const { t, lang } = useLang()
  const { guestMode } = useAuth()
  const navigate = useNavigate()
  const [courseText, setCourseText] = useState('')
  const [subject, setSubject] = useState('')
  const [numQ, setNumQ] = useState(5)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState('input')

  const handleExtracted = (text) => {
    setCourseText(text)
  }

  const handleGenerate = async () => {
    if (!courseText.trim() && !subject.trim()) return
    setLoading(true)
    try {
      const qs = await generateQuiz(courseText, subject, numQ, lang)
      setQuestions(qs)
      setCurrent(0)
      setScore(0)
      setSelected(null)
      setPhase('quiz')
    } catch {
      alert('Erreur lors de la génération du quiz')
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (idx) => {
    if (selected !== null) return
    setSelected(idx)
    if (idx === questions[current].correct) setScore(s => s + 1)
  }

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setPhase('score')
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
    }
  }

  const handleRestart = () => {
    setPhase('input')
    setQuestions([])
    setCourseText('')
    setSubject('')
  }

  if (phase === 'score') {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="tool-page">
        <div className="quiz-score">
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>
            {pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚'}
          </div>
          <div className="quiz-score-number">{score}/{questions.length}</div>
          <div style={{ fontSize: '1.5rem', color: 'var(--brown)', marginBottom: 8 }}>{pct}%</div>
          <p className="quiz-score-label">{t.quizScore} <BsStars /></p>
          <div style={{ textAlign: 'left', marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {questions.map((q, i) => {
              const isCorrect = i < current + 1 && questions[i]
              return (
                <div key={i} style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px'
                }}>
                  <p style={{ fontWeight: 500, fontSize: '0.85rem', marginBottom: 4 }}>{i + 1}. {q.question}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--success)' }}>
                    <BsCheckCircleFill /> {q.options[q.correct]}
                  </p>
                </div>
              )
            })}
          </div>
          <button className="btn-action" style={{ alignSelf: 'center', marginTop: 16 }} onClick={handleRestart}>
            {t.quizRestart}
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'quiz' && questions.length > 0) {
    const q = questions[current]
    return (
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="tool-page-icon"><BsLightbulb /></div>
          <div>
            <h1 className="tool-page-title">{t.quizPageTitle}</h1>
            <p className="tool-page-sub">{current + 1} / {questions.length} — Score: {score}</p>
          </div>
        </div>

        <div className="quiz-progress">
          {questions.map((_, i) => (
            <div key={i} className={`quiz-dot ${i < current ? 'done' : i === current ? 'current' : ''}`} />
          ))}
        </div>

        <div className="result-box" style={{ fontWeight: 500, fontSize: '0.95rem' }}>{q.question}</div>

        <div className="quiz-options">
          {q.options.map((opt, i) => (
            <button
              key={i}
              className={`quiz-option ${selected !== null ? (i === q.correct ? 'correct' : i === selected ? 'wrong' : '') : ''}`}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
            >
              {selected !== null && i === q.correct && <BsCheckCircleFill style={{ marginRight: 6, color: 'var(--success)' }} />}
              {selected !== null && i === selected && i !== q.correct && <BsXCircle style={{ marginRight: 6, color: 'var(--error)' }} />}
              {opt}
            </button>
          ))}
        </div>

        {selected !== null && (
          <button className="btn-action" onClick={handleNext}>
            {current + 1 >= questions.length ? t.quizFinish : t.quizNext}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="tool-page">
      {guestMode && (
        <GuestBanner onLogin={() => navigate('/login')} onRegister={() => navigate('/register')} />
      )}
      <div className="tool-page-header">
        <div className="tool-page-icon"><BsLightbulb /></div>
        <div>
          <h1 className="tool-page-title">{t.quizPageTitle}</h1>
          <p className="tool-page-sub">{t.quizPageSub}</p>
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
          placeholder={t.quizCoursePlaceholder}
          style={{ minHeight: 100 }}
        />

        <input
          className="form-input"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder={t.quizSubjectPlaceholder}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label className="form-label" style={{ whiteSpace: 'nowrap' }}>Nombre de questions :</label>
          <select className="form-input" value={numQ} onChange={e => setNumQ(+e.target.value)} style={{ width: 'auto' }}>
            {[5, 10, 15, 20].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <button
          className="btn-action"
          onClick={handleGenerate}
          disabled={loading || (!courseText.trim() && !subject.trim())}
        >
          {loading ? <><BsHourglass /> Génération...</> : t.quizBtn}
        </button>
      </div>
    </div>
  )
}

export default Quiz
