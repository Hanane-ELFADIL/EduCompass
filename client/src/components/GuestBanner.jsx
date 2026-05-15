import { useState } from 'react'
import { useLang } from '../context/LangContext'

const BANNER_KEY = 'educompass_banner_dismissed'

/**
 * GuestBanner — dismissible strip shown to unauthenticated / guest users.
 *
 * Props:
 *   onLogin    () => void  — navigate to /login
 *   onRegister () => void  — navigate to /register
 */
function GuestBanner({ onLogin, onRegister }) {
  const { t } = useLang()

  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(BANNER_KEY) === 'true'
  )

  if (dismissed) return null

  function handleDismiss() {
    sessionStorage.setItem(BANNER_KEY, 'true')
    setDismissed(true)
  }

  return (
    <div className="guest-banner">
      <p>{t.guestBannerMsg}</p>
      <div className="guest-banner-actions">
        <button className="btn-banner-login" onClick={onLogin}>
          {t.login}
        </button>
        <button className="btn-banner-register" onClick={onRegister}>
          {t.register}
        </button>
        <button className="btn-banner-dismiss" onClick={handleDismiss}>
          {t.guestBannerDismiss}
        </button>
      </div>
    </div>
  )
}

export default GuestBanner
