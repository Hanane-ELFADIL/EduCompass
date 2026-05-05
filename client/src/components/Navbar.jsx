import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { useTheme } from '../context/ThemeContext'

function Navbar() {
  const { user, logout } = useAuth()
  const { lang, setLang, t } = useLang()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <Link to={user ? '/dashboard' : '/'} className="navbar-brand">
        <div className="navbar-logo">🎓</div>
        <span className="navbar-title">طالب AI</span>
      </Link>

      <div className="navbar-right">
        <button className={`lang-btn ${lang==='fr'?'active':''}`} onClick={()=>setLang('fr')}>FR</button>
        <button className={`lang-btn ${lang==='ar'?'active':''}`} onClick={()=>setLang('ar')}>عر</button>
        <button className="theme-btn" onClick={toggle} title="Toggle dark mode">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">{t.dashboard}</Link>
            <Link to="/profile" className="nav-link">👤</Link>
            <button className="btn-logout" onClick={()=>{logout();navigate('/')}}>
              {t.logout}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">{t.login}</Link>
            <Link to="/register" className="btn-nav">{t.register}</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
