import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { useHistory } from '../context/HistoryContext'
import {
  BsChatDots,
  BsFileEarmarkText,
  BsLightbulb,
  BsCompass,
  BsCardText,
  BsStopwatch,
  BsPersonRaisedHand,
  BsPinAngle,
} from 'react-icons/bs'

const ICONS = {
  chat: BsChatDots,
  summary: BsFileEarmarkText,
  quiz: BsLightbulb,
  orientation: BsCompass,
  flashcard: BsCardText,
  exam: BsStopwatch,
}

function Dashboard() {
  const { user } = useAuth()
  const { t } = useLang()
  const { getStats, history } = useHistory()
  const stats = getStats()

  const tools = [
    { icon: <BsChatDots />,        cls:'chat',    title:t.chatTitle,    desc:t.chatDesc,    to:'/chat' },
    { icon: <BsFileEarmarkText />, cls:'summary', title:t.summaryTitle, desc:t.summaryDesc, to:'/summary' },
    { icon: <BsLightbulb />,       cls:'quiz',    title:t.quizTitle,    desc:t.quizDesc,    to:'/quiz' },
    { icon: <BsCompass />,         cls:'orient',  title:t.orientTitle,  desc:t.orientDesc,  to:'/orientation' },
    { icon: <BsCardText />,        cls:'flash',   title:t.flashTitle,   desc:t.flashDesc,   to:'/flashcards' },
    { icon: <BsStopwatch />,       cls:'exam',    title:t.examTitle,    desc:t.examDesc,    to:'/exam' },
  ]

  const recentHistory = history.slice(0, 5)

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <p className="dashboard-greeting">{t.welcomeBack}</p>
        <h1 className="dashboard-title">{user?.name} <span><BsPersonRaisedHand /></span></h1>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { n: stats.total,     l: t.statTotal },
          { n: stats.chats,     l: t.statChats },
          { n: stats.summaries, l: t.statSummaries },
          { n: stats.quizzes,   l: t.statQuizzes },
        ].map((s,i) => (
          <div className="stat-card" key={i} style={{animationDelay:`${i*0.1}s`}}>
            <div className="stat-number">{s.n}</div>
            <div className="stat-label">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Tools */}
      <h2 style={{fontFamily:'Playfair Display,serif', marginBottom:16, color:'var(--text)', fontSize:'1.2rem'}}>
        {t.chooseFeature}
      </h2>
      <div className="tools-grid" style={{marginBottom:32}}>
        {tools.map((tool,i) => (
          <Link to={tool.to} key={i} className="tool-card" style={{animationDelay:`${i*0.08}s`}}>
            <div className={`tool-icon ${tool.cls}`}>{tool.icon}</div>
            <div className="tool-title">{tool.title}</div>
            <div className="tool-desc">{tool.desc}</div>
            <div className="tool-arrow">→</div>
          </Link>
        ))}
      </div>

      {/* Recent history */}
      {recentHistory.length > 0 && (
        <>
          <h2 style={{fontFamily:'Playfair Display,serif', marginBottom:14, color:'var(--text)', fontSize:'1.1rem'}}>
            {t.recentActivity}
          </h2>
          <div className="history-list">
            {recentHistory.map((h,i) => (
              <div className="history-item" key={h.id} style={{animationDelay:`${i*0.07}s`}}>
                <span className="history-icon">
                  {(() => { const Icon = ICONS[h.type] || BsPinAngle; return <Icon /> })()}
                </span>
                <div className="history-text">
                  <div className="history-title">{h.title}</div>
                  <div className="history-date">{new Date(h.date).toLocaleDateString()}</div>
                </div>
                <span className="history-badge">{h.type}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
