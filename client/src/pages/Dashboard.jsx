import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'

function Dashboard() {
  const { user } = useAuth()
  const { t } = useLang()

  const tools = [
    { icon: '💬', cls: 'chat',    title: t.chatTitle,    desc: t.chatDesc,    to: '/chat' },
    { icon: '📝', cls: 'summary', title: t.summaryTitle, desc: t.summaryDesc, to: '/summary' },
    { icon: '🧠', cls: 'quiz',    title: t.quizTitle,    desc: t.quizDesc,    to: '/quiz' },
    { icon: '🧭', cls: 'orient',  title: t.orientTitle,  desc: t.orientDesc,  to: '/orientation' },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <p className="dashboard-greeting">{t.welcomeBack}</p>
        <h1 className="dashboard-title">{user?.name} <span>👋</span></h1>
        <p style={{color:'var(--gray)', marginTop:8, fontSize:'0.9rem'}}>{t.chooseFeature}</p>
      </div>
      <div className="tools-grid">
        {tools.map((tool, i) => (
          <Link to={tool.to} key={i} className="tool-card">
            <div className={`tool-icon ${tool.cls}`}>{tool.icon}</div>
            <div className="tool-title">{tool.title}</div>
            <div className="tool-desc">{tool.desc}</div>
            <div className="tool-arrow">→</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
