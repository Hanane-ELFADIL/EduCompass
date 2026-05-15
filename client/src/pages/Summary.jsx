import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { useHistory } from '../context/HistoryContext'
import { generateSummary, extractFromFile } from '../services/api'
import { BsFileEarmarkText, BsHourglass, BsPaperclip, BsFileEarmark, BsXCircle } from 'react-icons/bs'
import GuestBanner from '../components/GuestBanner'
import ReactMarkdown from 'react-markdown'

function Summary() {
  const { t, lang } = useLang()
  const { guestMode } = useAuth()
  const navigate = useNavigate()
  const { addEntry } = useHistory()
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [extracting, setExtracting] = useState(false)
  const [dragover, setDragover] = useState(false)
  const fileRef = useRef()

  const handleFile = async (f) => {
    if (!f) return
    setFile(f)
    setExtracting(true)
    try {
      const extracted = await extractFromFile(f)
      setText(extracted)
    } catch {
      setText('')
      // Error shown inline, no alert needed
    } finally {
      setExtracting(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragover(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleGenerate = async () => {
    if (!text.trim() || loading) return
    setLoading(true)
    setResult('')
    try {
      const summary = await generateSummary(text, lang)
      setResult(summary)
      addEntry('summary', text.slice(0,60) + '...')
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
        <div className="tool-page-icon"><BsFileEarmarkText /></div>
        <div>
          <h1 className="tool-page-title">{t.summaryPageTitle}</h1>
          <p className="tool-page-sub">{t.summaryPageSub}</p>
        </div>
      </div>

      {/* Upload zone */}
      <div
        className={`upload-zone ${dragover ? 'dragover' : ''}`}
        onDragOver={e=>{e.preventDefault();setDragover(true)}}
        onDragLeave={()=>setDragover(false)}
        onDrop={handleDrop}
        onClick={()=>fileRef.current.click()}
      >
        <div className="upload-icon">{extracting ? <BsHourglass /> : <BsPaperclip />}</div>
        {file ? (
          <div className="file-badge" onClick={e=>e.stopPropagation()}>
            <BsFileEarmark /> {file.name}
            <button onClick={()=>{setFile(null);setText('')}}>×</button>
          </div>
        ) : (
          <>
            <p className="upload-text">
              {extracting ? 'Extraction en cours...' : <><strong>{t.uploadClick}</strong> {t.uploadDrag}</>}
            </p>
            <p style={{fontSize:'0.75rem',color:'var(--text-muted)',marginTop:6}}>PDF, Image (JPG, PNG)</p>
          </>
        )}
        <input
          ref={fileRef} type="file" hidden
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={e=>handleFile(e.target.files[0])}
        />
      </div>

      <div className="input-area">
        <textarea
          className="textarea-input"
          value={text}
          onChange={e=>setText(e.target.value)}
          placeholder={t.summaryPlaceholder}
        />
        <button className="btn-action" onClick={handleGenerate} disabled={loading || !text.trim()}>
          {loading ? <><BsHourglass /> ...</> : t.summaryBtn}
        </button>
      </div>

      {!result && !loading && (
        <div className="empty-state-text">
          <BsFileEarmarkText size={48} style={{color:'var(--brown-light)',opacity:0.4}} />
          <p style={{color:'var(--text-muted)',fontSize:'0.85rem',marginTop:8}}>
            Collez votre cours ou importez un fichier pour générer un résumé structuré
          </p>
        </div>
      )}
      {result && (
        <div className="result-box markdown-result fade-in">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}

export default Summary
