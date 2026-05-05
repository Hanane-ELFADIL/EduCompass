import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('student_ai_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const loginUser = async ({ email, password }) => {
  const res = await api.post('/auth/login', { email, password })
  return res.data
}
export const registerUser = async ({ name, email, password }) => {
  const res = await api.post('/auth/register', { name, email, password })
  return res.data
}

// Chat
export const sendMessage = async (messages) => {
  const res = await api.post('/ai/chat', { messages })
  return res.data.reply
}

// Summary
export const generateSummary = async (text) => {
  const res = await api.post('/ai/summary', { text })
  return res.data.summary
}

// Quiz — numQ optional (default 5)
export const generateQuiz = async (courseText, subject, numQ = 5) => {
  const res = await api.post('/ai/quiz', { courseText, subject, numQ })
  return res.data.questions
}

// Flashcards
export const generateFlashcards = async (text) => {
  const res = await api.post('/ai/flashcards', { text })
  return res.data.cards
}

// Orientation
export const getOrientation = async (text) => {
  const res = await api.post('/ai/orientation', { text })
  return res.data.advice
}

// File extraction (PDF / Image → text)
// Uses FormData to send binary file to backend
export const extractFromFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await api.post('/ai/extract', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data.text
}
