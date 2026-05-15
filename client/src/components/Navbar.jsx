import { Link, useNavigate } from 'react-router-dom'
import { BsMoon, BsSun, BsPersonCircle } from 'react-icons/bs'
import logo from '../images/educompass_logo.svg'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { useTheme } from '../context/ThemeContext'

function Navbar() {
  const { user, logout } = useAuth()
  const { t } = useLang()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <Link to={user ? '/dashboard' : '/chat'} className="navbar-brand">
        <img src={logo} alt="EduCompass" className="navbar-logo-img navbar-logo-large" />
      </Link>

      <div className="navbar-right">
        <button className="theme-btn" onClick={toggle} title="Toggle dark mode">
          {theme === 'light' ? <BsMoon /> : <BsSun />}
        </button>

        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">{t.dashboard}</Link>
            <Link to="/profile" className="nav-link">
              <BsPersonCircle size={20} />
            </Link>
            <button className="btn-logout" onClick={() => { logout(); navigate('/chat') }}>
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
