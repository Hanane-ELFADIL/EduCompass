import express from 'express'
import Groq from 'groq-sdk'

const router = express.Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const ask = async (systemPrompt, userMessage) => {
  const res = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1500,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ]
  })
  return res.choices[0].message.content
}

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body
    const system = `Tu es un assistant pédagogique intelligent pour étudiants marocains (lycée et université).
Tu réponds dans la langue utilisée par l'étudiant (français, arabe, ou darija).
Tu aides avec : révisions, explications de cours, conseils d'orientation, méthodes de travail.
Sois encourageant, clair et pédagogique. Utilise des exemples concrets.
Limite tes réponses à 300 mots maximum.`
    const groqMessages = [
      { role: 'system', content: system },
      ...messages.filter(m => m.role === 'user' || m.role === 'assistant')
    ]
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1000,
      messages: groqMessages
    })
    res.json({ reply: completion.choices[0].message.content })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/ai/summary
router.post('/summary', async (req, res) => {
  try {
    const { text } = req.body
    const system = `Tu es un assistant qui crée des résumés de cours clairs et structurés pour étudiants.
Réponds dans la même langue que le texte fourni.
Format de ton résumé :
📌 Idées principales (liste à puces)
🔑 Concepts clés (liste à puces)  
📝 Résumé en 3-5 phrases`
    const summary = await ask(system, `Résume ce cours :\n\n${text}`)
    res.json({ summary })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/ai/quiz
router.post('/quiz', async (req, res) => {
  try {
    const { courseText, subject } = req.body
    const input = courseText
      ? `Génère 5 questions QCM à partir de ce cours :\n\n${courseText}`
      : `Génère 5 questions QCM sur la matière : ${subject}`

    const system = `Tu es un générateur de quiz éducatifs pour étudiants marocains.
Génère exactement 5 questions à choix multiples.
Réponds UNIQUEMENT en JSON valide, sans texte avant ou après, avec ce format exact :
[
  {
    "question": "La question ici",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0
  }
]
"correct" est l'index (0-3) de la bonne réponse.`

    const raw = await ask(system, input)

    // Extraire le JSON proprement
    const match = raw.match(/\[[\s\S]*\]/)
    if (!match) throw new Error('Format JSON invalide')
    const questions = JSON.parse(match[0])
    res.json({ questions })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/ai/orientation
router.post('/orientation', async (req, res) => {
  try {
    const { text } = req.body
    const system = `Tu es un conseiller d'orientation scolaire expert pour le système éducatif marocain.
Tu connais les filières du lycée, CPGE, universités marocaines, écoles d'ingénieurs, médecine, etc.
Réponds dans la langue de l'étudiant.
Format de ta réponse :
🎯 Filières recommandées (avec explication)
📚 Matières à renforcer
💡 Conseils personnalisés
🏫 Établissements au Maroc adaptés`
    const advice = await ask(system, `Voici mon profil :\n\n${text}\n\nQuelle orientation me conseilles-tu ?`)
    res.json({ advice })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
