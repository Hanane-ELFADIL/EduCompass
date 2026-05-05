import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import aiRoutes from './routes/aiRoutes.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/ai', aiRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

app.use((err, req, res, next) => {
  console.error('❌ Erreur:', err.message)
  res.status(500).json({ error: err.message })
})

export default app
