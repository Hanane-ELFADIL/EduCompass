// pages/Home.jsx
import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { BsChatDots, BsFileEarmarkText, BsLightbulb, BsCompass, BsCardText, BsStopwatch } from 'react-icons/bs'
import heroIllustration from '../images/hero_study.svg'

export function Home() {
  const { t } = useLang()
  const features = [
    { icon: <BsChatDots />,        title: t.feat1Title, desc: t.feat1Desc, to: '/chat' },
    { icon: <BsFileEarmarkText />, title: t.feat2Title, desc: t.feat2Desc, to: '/summary' },
    { icon: <BsLightbulb />,       title: t.feat3Title, desc: t.feat3Desc, to: '/quiz' },
    { icon: <BsCompass />,         title: t.feat4Title, desc: t.feat4Desc, to: '/orientation' },
    { icon: <BsCardText />,        title: t.feat5Title, desc: t.feat5Desc, to: '/flashcards' },
    { icon: <BsStopwatch />,       title: t.feat6Title, desc: t.feat6Desc, to: '/exam' },
  ]
  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">{t.badge}</span>
          <h1 className="hero-title">{t.heroTitle} <span>{t.heroTitleBold}</span></h1>
          <p className="hero-desc">{t.heroDesc}</p>
          <Link to="/register" className="hero-cta">{t.startBtn} →</Link>
        </div>
        <div className="hero-illustration">
          <img
            src={heroIllustration}
            alt="Étudiant marocain utilisant EduCompass sur un ordinateur portable avec des livres"
            className="hero-img"
          />
        </div>
      </section>
      <div className="features-grid">
        {features.map((f, i) => (
          <Link to={f.to} key={i} className="feature-card">
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
