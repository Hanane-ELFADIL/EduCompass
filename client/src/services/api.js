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

// Chat — passes uiLang so backend applies the correct multilingual prompt
export const sendMessage = async (messages, uiLang = 'fr') => {
  const res = await api.post('/ai/chat', { messages, uiLang })
  return res.data.reply
}

// Summary
export const generateSummary = async (text, uiLang = 'fr') => {
  const res = await api.post('/ai/summary', { text, uiLang })
  return res.data.summary
}

// Quiz — numQ optional (default 5)
export const generateQuiz = async (courseText, subject, numQ = 5, uiLang = 'fr') => {
  const res = await api.post('/ai/quiz', { courseText, subject, numQ, uiLang })
  return res.data.questions
}

// Flashcards
export const generateFlashcards = async (text, uiLang = 'fr') => {
  const res = await api.post('/ai/flashcards', { text, uiLang })
  return res.data.cards
}

// Orientation
export const getOrientation = async (text, uiLang = 'fr') => {
  const res = await api.post('/ai/orientation', { text, uiLang })
  return res.data.advice
}

// Exam
export const generateExam = async (subject, numQ = 10, uiLang = 'fr', courseText = '') => {
  const res = await api.post('/ai/exam', { subject, numQ, uiLang, courseText })
  return res.data.questions
}

// File extraction (PDF / Image → text)
export const extractFromFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await api.post('/ai/extract', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data.text
}
