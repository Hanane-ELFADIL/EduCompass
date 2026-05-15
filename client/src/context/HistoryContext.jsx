import { createContext, useContext, useState } from 'react'
import { useAuth } from './AuthContext'

const HistoryContext = createContext()

export function HistoryProvider({ children }) {
  const { user } = useAuth()

  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('student_history') || '[]') }
    catch { return [] }
  })

  const addEntry = (type, title) => {
    // Guard: no-op for guest / unauthenticated users — history is auth-only
    if (!user) return

    const entry = {
      id: Date.now(),
      type,   // 'chat' | 'summary' | 'quiz' | 'orientation' | 'flashcard' | 'exam'
      title,
      date: new Date().toISOString()
    }
    const updated = [entry, ...history].slice(0, 50) // keep max 50 entries
    setHistory(updated)
    localStorage.setItem('student_history', JSON.stringify(updated))
  }

  const getStats = () => ({
    total:    history.length,
    chats:    history.filter(h => h.type === 'chat').length,
    summaries:history.filter(h => h.type === 'summary').length,
    quizzes:  history.filter(h => h.type === 'quiz').length,
    exams:    history.filter(h => h.type === 'exam').length,
  })

  return (
    <HistoryContext.Provider value={{ history, addEntry, getStats }}>
      {children}
    </HistoryContext.Provider>
  )
}

export const useHistory = () => useContext(HistoryContext)
