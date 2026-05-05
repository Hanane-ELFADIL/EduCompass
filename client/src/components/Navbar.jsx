import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'

function Navbar() {
  const { user, logout } = useAuth()
  const { lang, setLang, t } = useLang()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <Link to={user ? '/dashboard' : '/'} className="navbar-brand">
        <div className="navbar-logo">🎓</div>
        <span className="navbar-title">طالب AI</span>
      </Link>

      <div className="navbar-right">
        {/* Boutons langue FR / AR */}
        <button
          className={`lang-btn ${lang === 'fr' ? 'active' : ''}`}
          onClick={() => setLang('fr')}
        >FR</button>
        <button
          className={`lang-btn ${lang === 'ar' ? 'active' : ''}`}
          onClick={() => setLang('ar')}
        >عر</button>

        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">{t.dashboard}</Link>
            <button className="btn-logout" onClick={handleLogout}>{t.logout}</button>
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
