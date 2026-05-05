import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { useHistory } from '../context/HistoryContext'

function Profile() {
  const { user } = useAuth()
  const { t } = useLang()
  const { getStats, history } = useHistory()
  const stats = getStats()

  const levels = [
    { label: 'Lycée', value: 'Lycée / ثانوي' },
    { label: 'Université', value: 'Université / جامعة' },
  ]

  const progressData = [
    { label: t.chatTitle,    value: Math.min(stats.chats * 10, 100),     color: 'var(--brown)' },
    { label: t.summaryTitle, value: Math.min(stats.summaries * 15, 100), color: 'var(--brown-light)' },
    { label: t.quizTitle,    value: Math.min(stats.quizzes * 12, 100),   color: 'var(--brown-dark)' },
    { label: t.examTitle,    value: Math.min(stats.exams * 20, 100),     color: '#C49A6C' },
  ]

  // Activity by type (last 30 days)
  const activityMap = {}
  history.forEach(h => {
    activityMap[h.type] = (activityMap[h.type] || 0) + 1
  })

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {user?.name?.charAt(0)?.toUpperCase() || '👤'}
        </div>
        <div>
          <h1 className="profile-name">{user?.name}</h1>
          <p className="profile-email">{user?.email}</p>
          <span className="level-badge" style={{marginTop:8}}>🎓 Étudiant</span>
        </div>
      </div>

      {/* Stats */}
      <div className="profile-section">
        <h3>{t.statTotal} — {stats.total} sessions</h3>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:12,marginTop:8}}>
          {[
            {icon:'💬', n:stats.chats,     l:t.chatTitle},
            {icon:'📝', n:stats.summaries, l:t.summaryTitle},
            {icon:'🧠', n:stats.quizzes,   l:t.quizTitle},
            {icon:'⏱️', n:stats.exams,     l:t.examTitle},
          ].map((s,i) => (
            <div key={i} className="stat-card">
              <div style={{fontSize:'1.5rem'}}>{s.icon}</div>
              <div className="stat-number" style={{fontSize:'1.5rem'}}>{s.n}</div>
              <div className="stat-label">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="profile-section">
        <h3>{t.progressTitle}</h3>
        <div className="progress-bar-container" style={{marginTop:16}}>
          {progressData.map((p,i) => (
            <div className="progress-item" key={i}>
              <div className="progress-label">
                <span>{p.label}</span>
                <span>{p.value}%</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{width:`${p.value}%`, background:p.color}}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent history */}
      {history.length > 0 && (
        <div className="profile-section">
          <h3>{t.recentActivity}</h3>
          <div className="history-list" style={{marginTop:12}}>
            {history.slice(0,8).map((h,i) => (
              <div className="history-item" key={h.id} style={{animationDelay:`${i*0.05}s`}}>
                <span className="history-icon">
                  {h.type==='chat'?'💬':h.type==='summary'?'📝':h.type==='quiz'?'🧠':h.type==='exam'?'⏱️':h.type==='flashcard'?'🃏':'🧭'}
                </span>
                <div className="history-text">
                  <div className="history-title">{h.title}</div>
                  <div className="history-date">{new Date(h.date).toLocaleDateString()}</div>
                </div>
                <span className="history-badge">{h.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
