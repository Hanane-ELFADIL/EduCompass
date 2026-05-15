import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { getOrientation } from '../services/api'
import { BsCompass, BsHourglass, BsXCircle } from 'react-icons/bs'
import GuestBanner from '../components/GuestBanner'
import ReactMarkdown from 'react-markdown'
import FileUpload from '../components/FileUpload'

function Orientation() {
  const { t, lang } = useLang()
  const { guestMode } = useAuth()
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!text.trim() || loading) return
    setLoading(true)
    setResult('')
    try {
      const advice = await getOrientation(text, lang)
      setResult(advice)
    } catch {
      setResult(<><BsXCircle /> Erreur technique. Réessayez.</>)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tool-page">
      {guestMode && (
        <GuestBanner
          onLogin={() => navigate('/login')}
          onRegister={() => navigate('/register')}
        />
      )}
      <div className="tool-page-header">
        <div className="tool-page-icon"><BsCompass /></div>
        <div>
          <h1 className="tool-page-title">{t.orientPageTitle}</h1>
          <p className="tool-page-sub">{t.orientPageSub}</p>
        </div>
      </div>

      <div className="input-area">
        {/* Optional: upload a CV or transcript */}
        <FileUpload onExtracted={(extracted) => setText(prev => prev ? prev + '\n\n' + extracted : extracted)} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.78rem' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          ou décrivez votre profil
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <textarea
          className="textarea-input"
          style={{ minHeight: 160 }}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={t.orientPlaceholder}
        />
        <button className="btn-action" onClick={handleGenerate} disabled={loading || !text.trim()}>
          {loading ? <><BsHourglass /> ...</> : t.orientBtn}
        </button>
      </div>

      {!result && !loading && (
        <div className="empty-state-text">
          <BsCompass size={48} style={{color:'var(--brown-light)',opacity:0.4}} />
          <p style={{color:'var(--text-muted)',fontSize:'0.85rem',marginTop:8}}>
            Décrivez votre profil (notes, matières préférées, objectifs) pour obtenir des recommandations personnalisées
          </p>
        </div>
      )}
      {result && (
        <div className="result-box markdown-result">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}

export default Orientation
