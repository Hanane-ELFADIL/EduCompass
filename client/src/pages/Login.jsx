import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BsMortarboard } from 'react-icons/bs'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { loginUser } from '../services/api'

function Login() {
  const { t } = useLang()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      const data = await loginUser(form)
      login(data.user)
      localStorage.setItem('student_ai_token', data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><BsMortarboard /></div>
          <h2 className="auth-title">{t.loginTitle}</h2>
          <p className="auth-subtitle">{t.loginSub}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-form">
          <div className="form-group">
            <label className="form-label">{t.emailLabel}</label>
            <input
              type="email"
              className="form-input"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t.passLabel}</label>
            <input
              type="password"
              className="form-input"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? '...' : t.loginBtn}
          </button>
        </div>

        <p className="auth-link">
          {t.noAccount} <Link to="/register">{t.register}</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
