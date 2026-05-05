// pages/Home.jsx
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'

export function Home() {
  const { t } = useLang()
  const features = [
    { icon: '💬', title: t.feat1Title, desc: t.feat1Desc, to: '/chat' },
    { icon: '📝', title: t.feat2Title, desc: t.feat2Desc, to: '/summary' },
    { icon: '🧠', title: t.feat3Title, desc: t.feat3Desc, to: '/quiz' },
    { icon: '🧭', title: t.feat4Title, desc: t.feat4Desc, to: '/orientation' },
  ]
  return (
    <main className="home-page">
      <section className="hero">
        <span className="hero-badge">{t.badge}</span>
        <h1 className="hero-title">{t.heroTitle} <span>{t.heroTitleBold}</span></h1>
        <p className="hero-desc">{t.heroDesc}</p>
        <Link to="/register" className="hero-cta">{t.startBtn} →</Link>
      </section>
      <div className="features-grid">
        {features.map((f, i) => (
          <Link to="/register" key={i} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}

export default Home
