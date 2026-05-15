// context/AuthContext.jsx — Gestion de l'authentification
// Stocke l'utilisateur connecté dans localStorage
// Le mode invité est stocké dans sessionStorage (éphémère)
// Accessible depuis tous les composants

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 3.1 — guestMode initialisé depuis sessionStorage (éphémère)
  const [guestMode, setGuestMode] = useState(
    () => sessionStorage.getItem('educompass_guest') === 'true'
  )

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('student_ai_user')
    if (saved) setUser(JSON.parse(saved))
    setLoading(false)
  }, [])

  // 3.2 — Entrer en mode invité (no-op si un utilisateur est connecté)
  const enterGuestMode = () => {
    if (user !== null) return
    setGuestMode(true)
    sessionStorage.setItem('educompass_guest', 'true')
  }

  // 3.3 — Quitter le mode invité
  const exitGuestMode = () => {
    setGuestMode(false)
    sessionStorage.removeItem('educompass_guest')
  }

  // 3.4 — login efface le mode invité avant de connecter l'utilisateur
  const login = (userData) => {
    // Inline exitGuestMode logic to keep the closure consistent
    setGuestMode(false)
    sessionStorage.removeItem('educompass_guest')

    setUser(userData)
    localStorage.setItem('student_ai_user', JSON.stringify(userData))
  }

  // 3.5 — logout efface aussi le mode invité
  const logout = () => {
    setUser(null)
    localStorage.removeItem('student_ai_user')
    localStorage.removeItem('student_ai_token')

    setGuestMode(false)
    sessionStorage.removeItem('educompass_guest')
  }

  // 3.6 — Exposer guestMode, enterGuestMode, exitGuestMode dans le contexte
  return (
    <AuthContext.Provider value={{ user, login, logout, loading, guestMode, enterGuestMode, exitGuestMode }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
