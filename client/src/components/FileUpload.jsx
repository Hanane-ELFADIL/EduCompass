import { useRef, useState } from 'react'
import { BsPaperclip, BsFileEarmark, BsFileEarmarkImage, BsXCircle, BsHourglass } from 'react-icons/bs'
import { extractFromFile } from '../services/api'

/**
 * Reusable file upload component.
 * Accepts PDF or image, extracts text via /api/ai/extract, calls onExtracted(text).
 */
function FileUpload({ onExtracted, compact = false }) {
  const fileRef = useRef()
  const [file, setFile] = useState(null)
  const [extracting, setExtracting] = useState(false)
  const [error, setError] = useState('')
  const [dragover, setDragover] = useState(false)

  const handleFile = async (f) => {
    if (!f) return
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp']
    if (!allowed.includes(f.type)) {
      setError('Format non supporté. Utilisez PDF, JPG ou PNG.')
      return
    }
    setFile(f)
    setError('')
    setExtracting(true)
    try {
      const text = await extractFromFile(f)
      if (text && text.startsWith('Erreur')) {
        setError(text)
        onExtracted('', '')
      } else {
        onExtracted(text, f.name)
      }
    } catch {
      setError('Le serveur est inaccessible. Vérifiez que le serveur est démarré (npm run dev).')
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

  const handleRemove = (e) => {
    e.stopPropagation()
    setFile(null)
    setError('')
    onExtracted('', '')
    fileRef.current.value = ''
  }

  if (compact && file) {
    return (
      <div className="file-badge">
        {file.type === 'application/pdf' ? <BsFileEarmark /> : <BsFileEarmarkImage />}
        <span>{file.name}</span>
        {extracting
          ? <BsHourglass style={{ color: 'var(--brown)' }} />
          : <button onClick={handleRemove} title="Supprimer"><BsXCircle /></button>
        }
      </div>
    )
  }

  return (
    <div>
      <div
        className={`upload-zone${dragover ? ' dragover' : ''}${compact ? ' upload-zone-compact' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragover(true) }}
        onDragLeave={() => setDragover(false)}
        onDrop={handleDrop}
        onClick={() => !extracting && fileRef.current.click()}
        style={{ cursor: extracting ? 'wait' : 'pointer' }}
      >
        {extracting ? (
          <>
            <div className="upload-icon"><BsHourglass /></div>
            <p className="upload-text">Extraction en cours...</p>
          </>
        ) : file ? (
          <div className="file-badge" onClick={e => e.stopPropagation()}>
            {file.type === 'application/pdf' ? <BsFileEarmark /> : <BsFileEarmarkImage />}
            <span>{file.name}</span>
            <button onClick={handleRemove} title="Supprimer"><BsXCircle /></button>
          </div>
        ) : (
          <>
            <div className="upload-icon"><BsPaperclip /></div>
            <p className="upload-text">
              <strong>Cliquez</strong> ou glissez un <strong>PDF / image</strong> ici
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
              PDF, JPG, PNG — max 10 MB
            </p>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          hidden
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={e => handleFile(e.target.files[0])}
        />
      </div>
      {error && (
        <p style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: 4 }}>{error}</p>
      )}
    </div>
  )
}

export default FileUpload
