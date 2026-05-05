import express from 'express'
import Groq from 'groq-sdk'
import multer from 'multer'
import fs from 'fs'

const router = express.Router()
const upload = multer({ dest: 'uploads/', limits: { fileSize: 10 * 1024 * 1024 } })
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const ask = async (systemPrompt, userMessage, maxTokens = 1500) => {
  const res = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ]
  })
  return res.choices[0].message.content
}

const safeParseJSON = (text, fallback = []) => {
  try {
    const match = text.match(/\[[\s\S]*\]/)
    return match ? JSON.parse(match[0]) : fallback
  } catch { return fallback }
}

// ── POST /api/ai/chat ────────────────────────
router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body
    const system = `Tu es un assistant pédagogique intelligent pour étudiants marocains (lycée et université).
Tu réponds dans la langue de l'étudiant (français, arabe, darija).
Tu aides avec : révisions, explications de cours, conseils, méthodes de travail.
Sois encourageant, clair et pédagogique. 300 mots max.`
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 800,
      messages: [{ role: 'system', content: system }, ...messages.filter(m => m.role === 'user' || m.role === 'assistant')]
    })
    res.json({ reply: completion.choices[0].message.content })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ── POST /api/ai/summary ─────────────────────
router.post('/summary', async (req, res) => {
  try {
    const { text } = req.body
    const system = `Tu crées des résumés de cours structurés pour étudiants. Réponds dans la même langue que le texte.
Format :
📌 **Idées principales**
- point 1
- point 2

🔑 **Concepts clés**
- concept 1

📝 **Résumé** (3-5 phrases)`
    const summary = await ask(system, `Résume ce cours :\n\n${text}`)
    res.json({ summary })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ── POST /api/ai/quiz ────────────────────────
router.post('/quiz', async (req, res) => {
  try {
    const { courseText, subject, numQ = 5 } = req.body
    const input = courseText?.trim()
      ? `Génère ${numQ} questions QCM à partir de ce cours :\n\n${courseText}`
      : `Génère ${numQ} questions QCM sur : ${subject}`

    const system = `Génère exactement ${numQ} questions QCM pour étudiants marocains.
Réponds UNIQUEMENT en JSON valide sans texte avant ou après :
[{"question":"...","options":["A","B","C","D"],"correct":0}]
"correct" = index 0-3 de la bonne réponse.`

    const raw = await ask(system, input, 2000)
    const questions = safeParseJSON(raw)
    if (!questions.length) throw new Error('Aucune question générée')
    res.json({ questions })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ── POST /api/ai/flashcards ──────────────────
router.post('/flashcards', async (req, res) => {
  try {
    const { text } = req.body
    const system = `Génère 8 flashcards question/réponse à partir du cours.
Réponds UNIQUEMENT en JSON valide :
[{"question":"...","answer":"..."}]`
    const raw = await ask(system, `Cours :\n\n${text}`, 1500)
    const cards = safeParseJSON(raw)
    if (!cards.length) throw new Error('Aucune flashcard générée')
    res.json({ cards })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ── POST /api/ai/orientation ─────────────────
router.post('/orientation', async (req, res) => {
  try {
    const { text } = req.body
    const system = `Tu es conseiller d'orientation pour le système éducatif marocain.
Réponds dans la langue de l'étudiant.
Format :
🎯 **Filières recommandées**
📚 **Matières à renforcer**
💡 **Conseils personnalisés**
🏫 **Établissements au Maroc**`
    const advice = await ask(system, `Mon profil :\n\n${text}\n\nQuelle orientation me conseilles-tu ?`)
    res.json({ advice })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ── POST /api/ai/extract ─────────────────────
// Extrait le texte d'un PDF ou image
router.post('/extract', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu' })

    const { mimetype, path: filePath } = req.file
    let extractedText = ''

    if (mimetype === 'application/pdf') {
      // Pour PDF : lire les premiers octets et demander à l'IA de traiter
      // En production, utiliser pdf-parse. Pour le MVP, on retourne un message
      extractedText = 'PDF reçu. Extraction automatique disponible avec pdf-parse. Pour l\'instant, copiez-collez le texte manuellement.'
    } else if (mimetype.startsWith('image/')) {
      // Pour les images : encoder en base64 et envoyer à Groq vision
      const imageBuffer = fs.readFileSync(filePath)
      const base64 = imageBuffer.toString('base64')

      const visionRes = await groq.chat.completions.create({
        model: 'llama-3.2-11b-vision-preview',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:${mimetype};base64,${base64}` } },
            { type: 'text', text: 'Extrais tout le texte visible dans cette image de cours. Retourne uniquement le texte extrait.' }
          ]
        }]
      })
      extractedText = visionRes.choices[0].message.content
    }

    // Supprimer le fichier temporaire
    fs.unlink(filePath, () => {})
    res.json({ text: extractedText })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
