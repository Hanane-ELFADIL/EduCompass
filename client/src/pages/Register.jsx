import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BsMortarboard } from 'react-icons/bs'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { registerUser } from '../services/api'

function Register() {
  const { t } = useLang()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      const data = await registerUser(form)
      login(data.user)
      localStorage.setItem('student_ai_token', data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><BsMortarboard /></div>
          <h2 className="auth-title">{t.registerTitle}</h2>
          <p className="auth-subtitle">{t.registerSub}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-form">
          <div className="form-group">
            <label className="form-label">{t.nameLabel}</label>
            <input
              type="text"
              className="form-input"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t.emailLabel}</label>
            <input
              type="email"
              className="form-input"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t.passLabel}</label>
            <input
              type="password"
              className="form-input"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
            />
          </div>
          <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? '...' : t.registerBtn}
          </button>
        </div>

        <p className="auth-link">
          {t.hasAccount} <Link to="/login">{t.login}</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
