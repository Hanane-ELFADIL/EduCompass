import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Tous les champs sont requis' })
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'Email déjà utilisé' })
    const user = await User.create({ name, email, password })
    const token = makeToken(user._id)
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
    const ok = await user.comparePassword(password)
    if (!ok) return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
    const token = makeToken(user._id)
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
