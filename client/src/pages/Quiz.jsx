import { useState } from 'react'
import { useLang } from '../context/LangContext'
import { generateQuiz } from '../services/api'

function Quiz() {
  const { t } = useLang()
  const [courseText, setCourseText] = useState('')
  const [subject, setSubject] = useState('')
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState('input') // 'input' | 'quiz' | 'score'

  const handleGenerate = async () => {
    if (!courseText.trim() && !subject.trim()) return
    setLoading(true)
    try {
      const qs = await generateQuiz(courseText, subject)
      setQuestions(qs)
      setCurrent(0)
      setScore(0)
      setSelected(null)
      setFinished(false)
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
    return (
      <div className="tool-page">
        <div className="quiz-score">
          <div className="quiz-score-number">{score}/{questions.length}</div>
          <p className="quiz-score-label">{t.quizScore} 🎉</p>
          <button className="btn-action" onClick={handleRestart}>{t.quizRestart}</button>
        </div>
      </div>
    )
  }

  if (phase === 'quiz' && questions.length > 0) {
    const q = questions[current]
    return (
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="tool-page-icon">🧠</div>
          <div>
            <h1 className="tool-page-title">{t.quizPageTitle}</h1>
            <p className="tool-page-sub">{current + 1} / {questions.length}</p>
          </div>
        </div>

        <div className="quiz-progress">
          {questions.map((_, i) => (
            <div key={i} className={`quiz-dot ${i < current ? 'done' : i === current ? 'current' : ''}`}/>
          ))}
        </div>

        <div className="result-box" style={{fontWeight:500, fontSize:'1rem'}}>{q.question}</div>

        <div className="quiz-options">
          {q.options.map((opt, i) => (
            <button
              key={i}
              className={`quiz-option ${selected !== null ? (i === q.correct ? 'correct' : i === selected ? 'wrong' : '') : ''}`}
              onClick={() => handleSelect(i)}
            >{opt}</button>
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
      <div className="tool-page-header">
        <div className="tool-page-icon">🧠</div>
        <div>
          <h1 className="tool-page-title">{t.quizPageTitle}</h1>
          <p className="tool-page-sub">{t.quizPageSub}</p>
        </div>
      </div>

      <div className="input-area">
        <textarea
          className="textarea-input"
          value={courseText}
          onChange={e => setCourseText(e.target.value)}
          placeholder={t.quizCoursePlaceholder}
        />
        <input
          className="form-input"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder={t.quizSubjectPlaceholder}
        />
        <button
          className="btn-action"
          onClick={handleGenerate}
          disabled={loading || (!courseText.trim() && !subject.trim())}
        >
          {loading ? '⏳ ...' : t.quizBtn}
        </button>
      </div>
    </div>
  )
}

export default Quiz
