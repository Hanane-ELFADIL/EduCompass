import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { useHistory } from '../context/HistoryContext'
import { generateExam } from '../services/api'
import { BsStopwatch, BsTrophy, BsHandThumbsUp, BsBook, BsCheckCircleFill, BsXCircle, BsHourglass } from 'react-icons/bs'
import GuestBanner from '../components/GuestBanner'
import FileUpload from '../components/FileUpload'

function Exam() {
  const { t, lang } = useLang()
  const { guestMode } = useAuth()
  const navigate = useNavigate()
  const { addEntry } = useHistory()
  const [subject, setSubject] = useState('')
  const [courseText, setCourseText] = useState('')
  const [numQ, setNumQ] = useState(10)
  const [duration, setDuration] = useState(15) // minutes
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState('setup') // setup | exam | results
  const timerRef = useRef()

  // Timer countdown
  useEffect(() => {
    if (phase !== 'exam') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setPhase('results'); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
  const timerClass = timeLeft < 60 ? 'danger' : timeLeft < 180 ? 'warning' : ''

  const handleStart = async () => {
    if (!subject.trim() && !courseText.trim()) return
    setLoading(true)
    try {
      const qs = await generateExam(subject || 'General', numQ, lang, courseText)
      setQuestions(qs)
      setAnswers({})
      setTimeLeft(duration * 60)
      setPhase('exam')
    } catch {
      alert('Erreur lors de la génération de l\'examen')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (qIdx, optIdx) => {
    if (answers[qIdx] !== undefined) return
    setAnswers(prev => ({...prev, [qIdx]: optIdx}))
  }

  const handleFinish = () => {
    clearInterval(timerRef.current)
    setPhase('results')
  }

  const getScore = () => questions.filter((q,i) => answers[i] === q.correct).length

  if (phase === 'results') {
    const score = getScore()
    const pct = Math.round((score/questions.length)*100)
    addEntry('exam', `${subject} — ${score}/${questions.length}`)
    return (
      <div className="tool-page">
        <div className="quiz-score">
          <div style={{fontSize:'3rem',marginBottom:8}}>
            {pct >= 80 ? <BsTrophy /> : pct >= 60 ? <BsHandThumbsUp /> : <BsBook />}
          </div>
          <div className="quiz-score-number">{score}/{questions.length}</div>
          <div style={{fontSize:'2rem',color:'var(--brown)',marginBottom:8}}>{pct}%</div>
          <p className="quiz-score-label">
            {pct >= 80 ? t.examExcellent : pct >= 60 ? t.examGood : t.examKeepGoing}
          </p>

          {/* Detailed results */}
          <div style={{textAlign:'left',marginTop:24,display:'flex',flexDirection:'column',gap:12}}>
            {questions.map((q,i) => {
              const isCorrect = answers[i] === q.correct
              return (
                <div key={i} style={{
                  background: isCorrect ? 'var(--bg)' : '#FFEBEE',
                  border: `1px solid ${isCorrect ? 'var(--border)' : 'var(--error)'}`,
                  borderRadius:'var(--radius-sm)', padding:'12px 16px'
                }}>
                  <p style={{fontWeight:500,marginBottom:6,color:'var(--text)'}}>{i+1}. {q.question}</p>
                  <p style={{fontSize:'0.85rem',color: isCorrect ? 'var(--success)' : 'var(--error)'}}>
                    {isCorrect ? <BsCheckCircleFill /> : <BsXCircle />} {q.options[q.correct]}
                  </p>
                  {!isCorrect && answers[i] !== undefined && (
                    <p style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>
                      Ta réponse : {q.options[answers[i]]}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          <button className="btn-action" style={{alignSelf:'center',marginTop:20}} onClick={()=>setPhase('setup')}>
            {t.newExam}
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'exam') {
    const answered = Object.keys(answers).length
    return (
      <div className="tool-page">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}>
          <div className="tool-page-header" style={{margin:0}}>
            <div className="tool-page-icon"><BsStopwatch /></div>
            <div>
              <h1 className="tool-page-title">{subject}</h1>
              <p className="tool-page-sub">{answered}/{questions.length} {t.examAnswered}</p>
            </div>
          </div>
          <div className={`exam-timer ${timerClass}`}>
            <BsStopwatch /> {formatTime(timeLeft)}
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          {questions.map((q,i) => (
            <div key={i} className="input-area" style={{gap:10}}>
              <p style={{fontWeight:500,color:'var(--text)',fontSize:'0.95rem'}}>{i+1}. {q.question}</p>
              <div className="quiz-options">
                {q.options.map((opt,j) => (
                  <button
                    key={j}
                    className={`quiz-option ${answers[i]===j ? (j===q.correct?'correct':'wrong') : ''}`}
                    onClick={()=>handleAnswer(i,j)}
                    disabled={answers[i]!==undefined}
                  >{opt}</button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button className="btn-action" style={{alignSelf:'center'}} onClick={handleFinish}>
          {t.submitExam} ({answered}/{questions.length})
        </button>
      </div>
    )
  }

  // Setup phase
  return (
    <div className="tool-page">
      {guestMode && (
        <GuestBanner
          onLogin={() => navigate('/login')}
          onRegister={() => navigate('/register')}
        />
      )}
      <div className="tool-page-header">
        <div className="tool-page-icon"><BsStopwatch /></div>
        <div>
          <h1 className="tool-page-title">{t.examTitle}</h1>
          <p className="tool-page-sub">{t.examSub}</p>
        </div>
      </div>

      <div className="input-area">
        {/* PDF/Image upload for course-based exam */}
        <FileUpload onExtracted={(text) => setCourseText(text)} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.78rem' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          ou entrez la matière
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <div className="form-group">
          <label className="form-label">{t.examSubject}</label>
          <input className="form-input" value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Ex: Mathématiques Bac, Physique..." />
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div className="form-group">
            <label className="form-label">{t.examNumQ}</label>
            <select className="form-input" value={numQ} onChange={e=>setNumQ(+e.target.value)}>
              {[5,10,15,20].map(n=><option key={n} value={n}>{n} questions</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t.examDuration}</label>
            <select className="form-input" value={duration} onChange={e=>setDuration(+e.target.value)}>
              {[10,15,20,30,45,60].map(n=><option key={n} value={n}>{n} min</option>)}
            </select>
          </div>
        </div>
        <button className="btn-action" onClick={handleStart} disabled={loading || (!subject.trim() && !courseText.trim())}>
          {loading ? <><BsHourglass /> Génération...</> : t.startExam}
        </button>
      </div>
    </div>
  )
}

export default Exam
