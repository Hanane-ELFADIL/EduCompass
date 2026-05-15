import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import User from '../models/User.js'

const router = express.Router()

const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })

// Check if MongoDB is connected
const isDbConnected = () => mongoose.connection.readyState === 1

// ── In-memory fallback store (used when MongoDB is unavailable) ──────────────
// Data is lost on server restart — for development only
const memUsers = new Map()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' })
    }

    if (isDbConnected()) {
      // Normal MongoDB path
      const exists = await User.findOne({ email })
      if (exists) return res.status(400).json({ message: 'Email déjà utilisé' })
      const user = await User.create({ name, email, password })
      const token = makeToken(user._id.toString())
      return res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
    } else {
      // In-memory fallback
      if (memUsers.has(email.toLowerCase())) {
        return res.status(400).json({ message: 'Email déjà utilisé' })
      }
      const hashed = await bcrypt.hash(password, 10)
      const id = `local_${Date.now()}`
      memUsers.set(email.toLowerCase(), { id, name, email: email.toLowerCase(), password: hashed })
      const token = makeToken(id)
      return res.json({ token, user: { id, name, email: email.toLowerCase() } })
    }
  } catch (err) {
    console.error('Register error:', err.message)
    res.status(500).json({ message: 'Erreur serveur. Réessayez.' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' })
    }

    if (isDbConnected()) {
      // Normal MongoDB path
      const user = await User.findOne({ email })
      if (!user) return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
      const ok = await user.comparePassword(password)
      if (!ok) return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
      const token = makeToken(user._id.toString())
      return res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
    } else {
      // In-memory fallback
      const stored = memUsers.get(email.toLowerCase())
      if (!stored) return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
      const ok = await bcrypt.compare(password, stored.password)
      if (!ok) return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
      const token = makeToken(stored.id)
      return res.json({ token, user: { id: stored.id, name: stored.name, email: stored.email } })
    }
  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).json({ message: 'Erreur serveur. Réessayez.' })
  }
})

export default router
