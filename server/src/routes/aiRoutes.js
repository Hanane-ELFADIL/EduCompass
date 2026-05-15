import express from 'express'
import Groq from 'groq-sdk'
import multer from 'multer'
import fs from 'fs'
import optionalAuth from '../middleware/optionalAuth.js'

// pdf-parse requires CommonJS require (not compatible with ESM import)
import { createRequire } from 'module'
const _require = createRequire(import.meta.url)
const pdfParse = _require('pdf-parse')

const router = express.Router()
const upload = multer({ dest: 'uploads/', limits: { fileSize: 10 * 1024 * 1024 } })

// Lazy-initialize Groq so it reads GROQ_API_KEY after dotenv has loaded
let _groq = null
const getGroq = () => {
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  return _groq
}

const ask = async (systemPrompt, userMessage, maxTokens = 1500) => {
  const res = await getGroq().chat.completions.create({
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

// ── buildMultilingualSystemPrompt ────────────
// Prepends a STRONG language-detection instruction so the AI always mirrors
// the student's input language, regardless of the base prompt language.
const buildMultilingualSystemPrompt = (basePrompt, uiLang) => {
  // Strong, unambiguous instruction placed BEFORE the base prompt
  const langInstruction = `CRITICAL RULE — LANGUAGE: You MUST detect the language of the student's message and respond in EXACTLY that language. Do NOT default to French.
- If the student writes in Arabic (العربية) → respond in Arabic
- If the student writes in Darija (الدارجة المغربية) → respond in Darija
- If the student writes in English → respond in English
- If the student writes in French → respond in French
- NEVER switch languages unless the student switches first.
- This rule overrides everything else.`

  return langInstruction + "\n\n" + basePrompt
}

// ── POST /api/ai/chat ────────────────────────
router.post('/chat', optionalAuth, async (req, res) => {
  try {
    const { messages, uiLang = 'fr' } = req.body
    const baseSystem = `You are an expert educational assistant for Moroccan students (high school and university level). You help with revision, course explanations, study methods, and academic orientation. Be encouraging, precise, and pedagogical. Use concrete examples from the Moroccan educational context. Keep responses under 400 words.`
    const system = buildMultilingualSystemPrompt(baseSystem, uiLang)
    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1000,
      messages: [{ role: 'system', content: system }, ...messages.filter(m => m.role === 'user' || m.role === 'assistant')]
    })
    res.json({ reply: completion.choices[0].message.content })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ── POST /api/ai/summary ─────────────────────
router.post('/summary', optionalAuth, async (req, res) => {
  try {
    const { text, uiLang = 'fr' } = req.body
    const baseSystem = `You are an expert educational summarizer. Analyze the provided course content and create a well-structured summary using markdown formatting.

Structure your response EXACTLY like this:
## Summary

### Key Ideas
- List the 3-5 most important concepts

### Detailed Notes
Explain each key idea with context and examples

### Quick Recap
2-3 sentences capturing the essence

### Study Tips
1-2 specific tips for memorizing this content

Be thorough, educational, and use clear language. Adapt to the complexity of the content.`
    const system = buildMultilingualSystemPrompt(baseSystem, uiLang)
    const summary = await ask(system, `Please summarize this course content:\n\n${text}`, 2000)
    res.json({ summary })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ── POST /api/ai/quiz ────────────────────────
router.post('/quiz', optionalAuth, async (req, res) => {
  try {
    const { courseText, subject, numQ = 5, uiLang = 'fr' } = req.body
    const input = courseText?.trim()
      ? `Generate ${numQ} MCQ questions from this course content:\n\n${courseText}`
      : `Generate ${numQ} MCQ questions on the subject: ${subject}`

    const baseSystem = `Generate exactly ${numQ} high-quality MCQ questions for Moroccan students. Each question must have 4 clear options and exactly one correct answer. Vary difficulty levels. Respond ONLY with valid JSON, no text before or after: [{"question":"...","options":["A","B","C","D"],"correct":0}] where "correct" is the 0-based index of the correct answer.`
    const system = buildMultilingualSystemPrompt(baseSystem, uiLang)

    const raw = await ask(system, input, 2500)
    const questions = safeParseJSON(raw)
    if (!questions.length) throw new Error('Aucune question générée')
    res.json({ questions })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ── POST /api/ai/flashcards ──────────────────
router.post('/flashcards', optionalAuth, async (req, res) => {
  try {
    const { text, uiLang = 'fr' } = req.body
    const baseSystem = `Generate exactly 8 question/answer flashcards from the course content. Questions should be clear and concise. Answers should be complete but brief. Cover the most important concepts. Respond ONLY with valid JSON: [{"question":"...","answer":"..."}]`
    const system = buildMultilingualSystemPrompt(baseSystem, uiLang)
    const raw = await ask(system, `Course content:\n\n${text}`, 1800)
    const cards = safeParseJSON(raw)
    res.json({ cards })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ── POST /api/ai/orientation ─────────────────
router.post('/orientation', optionalAuth, async (req, res) => {
  try {
    const { text, uiLang = 'fr' } = req.body
    const baseSystem = `You are an expert academic orientation counselor specializing in the Moroccan education system (Bac, CPGE, universities, grandes écoles, professional schools). 

Analyze the student's profile and provide a comprehensive, personalized orientation report using markdown:

## Orientation Report

### Profile Analysis
Summarize the student's strengths and interests

### Recommended Academic Tracks
List 3-5 specific tracks with brief explanations

### Top Institutions in Morocco
Name specific schools/universities for each track

### Subjects to Strengthen
Prioritized list with study advice

### Career Prospects
Concrete job opportunities for each recommended track

### Action Plan
3 immediate steps the student should take

Be specific, encouraging, and realistic about the Moroccan context.`
    const system = buildMultilingualSystemPrompt(baseSystem, uiLang)
    const advice = await ask(system, `Student profile:\n\n${text}`, 2000)
    res.json({ advice })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ── POST /api/ai/exam ────────────────────────
router.post('/exam', optionalAuth, async (req, res) => {
  try {
    const { subject, numQ = 10, uiLang = 'fr', courseText = '' } = req.body
    const baseSystem = `Generate exactly ${numQ} exam questions${subject ? ` on the subject: ${subject}` : ''}. Vary question types (definition, application, analysis). Each question must have 4 options and exactly one correct answer. Respond ONLY with valid JSON: [{"question":"...","options":["A","B","C","D"],"correct":0}]`
    const system = buildMultilingualSystemPrompt(baseSystem, uiLang)
    const input = courseText?.trim()
      ? `Generate ${numQ} exam questions from this course content:\n\n${courseText}`
      : `Generate ${numQ} exam questions on: ${subject}`
    const raw = await ask(system, input, 3000)
    const questions = safeParseJSON(raw)
    if (!questions.length) throw new Error('Aucune question générée')
    res.json({ questions })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ── POST /api/ai/extract ─────────────────────
// Extrait le texte d'un PDF ou image
router.post('/extract', upload.single('file'), optionalAuth, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu' })

    const { mimetype, path: filePath } = req.file
    let extractedText = ''

    if (mimetype === 'application/pdf') {
      try {
        const dataBuffer = fs.readFileSync(filePath)
        const pdfData = await pdfParse(dataBuffer)
        extractedText = pdfData.text?.trim() || ''
        if (!extractedText) {
          extractedText = 'Ce PDF ne contient pas de texte extractible (PDF scanné). Essayez une image JPG/PNG du document.'
        }
      } catch (pdfErr) {
        extractedText = `Erreur lors de la lecture du PDF: ${pdfErr.message}. Copiez-collez le texte manuellement.`
      }
    } else if (mimetype.startsWith('image/')) {
      // Pour les images : encoder en base64 et envoyer à Groq vision
      const imageBuffer = fs.readFileSync(filePath)
      const base64 = imageBuffer.toString('base64')

      const visionRes = await getGroq().chat.completions.create({
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
