import { useState } from 'react'
import { useLang } from '../context/LangContext'
import { getOrientation } from '../services/api'

function Orientation() {
  const { t } = useLang()
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!text.trim() || loading) return
    setLoading(true)
    setResult('')
    try {
      const advice = await getOrientation(text)
      setResult(advice)
    } catch {
      setResult('❌ Erreur technique. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tool-page">
      <div className="tool-page-header">
        <div className="tool-page-icon">🧭</div>
        <div>
          <h1 className="tool-page-title">{t.orientPageTitle}</h1>
          <p className="tool-page-sub">{t.orientPageSub}</p>
        </div>
      </div>

      <div className="input-area">
        <textarea
          className="textarea-input"
          style={{minHeight: 200}}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={t.orientPlaceholder}
        />
        <button className="btn-action" onClick={handleGenerate} disabled={loading || !text.trim()}>
          {loading ? '⏳ ...' : t.orientBtn}
        </button>
      </div>

      {result && <div className="result-box">{result}</div>}
    </div>
  )
}

export default Orientation
