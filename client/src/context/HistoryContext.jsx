import { createContext, useContext, useState, useEffect } from 'react'

const HistoryContext = createContext()

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('student_history') || '[]') }
    catch { return [] }
  })

  const addEntry = (type, title) => {
    const entry = {
      id: Date.now(),
      type,   // 'chat' | 'summary' | 'quiz' | 'orientation' | 'flashcard' | 'exam'
      title,
      date: new Date().toISOString()
    }
    const updated = [entry, ...history].slice(0, 50) // garder 50 entrées max
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
