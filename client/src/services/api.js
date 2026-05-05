import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

// Ajouter le token JWT à chaque requête automatiquement
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

// Quiz
export const generateQuiz = async (courseText, subject) => {
  const res = await api.post('/ai/quiz', { courseText, subject })
  return res.data.questions
}

// Orientation
export const getOrientation = async (text) => {
  const res = await api.post('/ai/orientation', { text })
  return res.data.advice
}
