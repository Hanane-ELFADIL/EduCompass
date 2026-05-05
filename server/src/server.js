import 'dotenv/config'
import app from './app.js'
import connectDB from './config/db.js'

const PORT = process.env.PORT || 5000

// Connexion MongoDB optionnelle — le serveur démarre même si MongoDB échoue
connectDB().catch(err => {
  console.warn('⚠️ MongoDB non connecté (auth désactivée):', err.message)
})

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`)
  console.log(`🌍 Mode: ${process.env.NODE_ENV || 'development'}`)
})
