import { useState } from 'react'
import { useLang } from '../context/LangContext'
import { generateSummary } from '../services/api'

function Summary() {
  const { t } = useLang()
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!text.trim() || loading) return
    setLoading(true)
    setResult('')
    try {
      const summary = await generateSummary(text)
      setResult(summary)
    } catch {
      setResult('❌ Erreur technique. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tool-page">
      <div className="tool-page-header">
        <div className="tool-page-icon">📝</div>
        <div>
          <h1 className="tool-page-title">{t.summaryPageTitle}</h1>
          <p className="tool-page-sub">{t.summaryPageSub}</p>
        </div>
      </div>

      <div className="input-area">
        <textarea
          className="textarea-input"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={t.summaryPlaceholder}
        />
        <button className="btn-action" onClick={handleGenerate} disabled={loading || !text.trim()}>
          {loading ? '⏳ ...' : t.summaryBtn}
        </button>
      </div>

      {result && (
        <div className="result-box">{result}</div>
      )}
    </div>
  )
}

export default Summary
