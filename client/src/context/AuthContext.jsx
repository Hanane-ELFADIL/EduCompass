// context/AuthContext.jsx — Gestion de l'authentification
// Stocke l'utilisateur connecté dans localStorage
// Accessible depuis tous les composants

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('student_ai_user')
    if (saved) setUser(JSON.parse(saved))
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('student_ai_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('student_ai_user')
    localStorage.removeItem('student_ai_token')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
