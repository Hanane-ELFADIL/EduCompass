import { NavLink, Outlet } from 'react-router-dom'
import {
  BsChatDots,
  BsFileEarmarkText,
  BsLightbulb,
  BsCompass,
  BsCardText,
  BsStopwatch,
} from 'react-icons/bs'
import { useLang } from '../context/LangContext'

const TOOLS = [
  { to: '/chat',        icon: <BsChatDots />,        labelKey: 'chatTitle' },
  { to: '/summary',     icon: <BsFileEarmarkText />,  labelKey: 'summaryTitle' },
  { to: '/quiz',        icon: <BsLightbulb />,        labelKey: 'quizTitle' },
  { to: '/orientation', icon: <BsCompass />,          labelKey: 'orientTitle' },
  { to: '/flashcards',  icon: <BsCardText />,         labelKey: 'flashTitle' },
  { to: '/exam',        icon: <BsStopwatch />,        labelKey: 'examTitle' },
]

function MainLayout() {
  const { t } = useLang()

  return (
    <div className="main-layout">
      {/* Tool sidebar */}
      <aside className="tool-sidebar">
        {TOOLS.map(({ to, icon, labelKey }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-tool-btn${isActive ? ' active' : ''}`
            }
            title={t[labelKey]}
          >
            <span className="sidebar-tool-icon">{icon}</span>
            <span className="sidebar-tool-label">{t[labelKey]}</span>
          </NavLink>
        ))}
      </aside>

      {/* Main content area */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
