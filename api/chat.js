/**
 * ============================================================
 * Vercel Serverless Function: POST /api/chat
 * ============================================================
 *
 * RAG-powered chat endpoint.
 * 1. Embeds the user's question using Gemini
 * 2. Queries Pinecone for relevant chunks
 * 3. Sends context + question to Gemini for a grounded answer
 *    (through OpenRouter when OPEN_ROUTER_API_KEY is set, otherwise
 *    directly through the Gemini API)
 *
 * Required env vars (set in Vercel Dashboard > Settings > Environment Variables):
 *   PINECONE_API_KEY
 *   PINECONE_INDEX_NAME
 *   GEMINI_API_KEY       - always needed for query embeddings
 *   OPEN_ROUTER_API_KEY  - optional; when set, answers are generated via OpenRouter
 *
 * ============================================================
 */

import { Pinecone } from '@pinecone-database/pinecone'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { findFaqAnswer } from '../knowledge/faq.js'

const PINECONE_API_KEY = process.env.PINECONE_API_KEY
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'portfolio'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const OPEN_ROUTER_API_KEY = process.env.OPEN_ROUTER_API_KEY
const OPEN_ROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const TOP_K = 5

// Chat models tried in order — later ones are fallbacks for when earlier ones are overloaded.
// On OpenRouter the same models are addressed as `google/<model>`.
const CHAT_MODELS = ['gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.5-flash-lite']

// Overloaded / rate-limited / temporary server errors — worth telling the user to retry
const TRANSIENT_STATUSES = new Set([429, 500, 502, 503, 504])

const SYSTEM_PROMPT = `You are a helpful assistant on Jyothsna's portfolio website.
You answer questions about Jyothsna's skills, experience, projects, and background.

Rules:
- Only answer based on the provided context. If the context doesn't contain the answer, say "I don't have that information, but you can reach out to Jyothsna directly."
- Be concise and friendly.
- Do not make up information that isn't in the context.
- If asked about something unrelated to Jyothsna's professional profile, politely redirect.
- Format responses with short paragraphs. Use bullet points for lists.`

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Validate env
  if (!PINECONE_API_KEY || !GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server misconfigured: missing API keys' })
  }

  // Parse request
  const { question } = req.body || {}
  if (!question?.trim()) {
    return res.status(400).json({ error: 'Question is required' })
  }

  // Common questions (including the widget's suggestion chips) are answered
  // from knowledge/faq.js without calling Pinecone or Gemini
  const faqAnswer = findFaqAnswer(question)
  if (faqAnswer) {
    return res.status(200).json({ answer: faqAnswer, sources: 0, cached: true })
  }

  try {
    // 1. Embed the question
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' })
    const embResult = await embeddingModel.embedContent({
      content: { parts: [{ text: question.trim() }] },
      outputDimensionality: 768,
    })
    const queryEmbedding = embResult.embedding.values

    // 2. Query Pinecone for relevant context
    const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY })
    const index = pinecone.index(PINECONE_INDEX_NAME)

    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK: TOP_K,
      includeMetadata: true,
    })

    console.log('Pinecone query response:', queryResponse)

    // Extract text from matched chunks
    const contextChunks = queryResponse.matches
      .filter((m) => m.score > 0.3)
      .map((m) => m.metadata.text)

    const context = contextChunks.length > 0
      ? contextChunks.join('\n\n---\n\n')
      : 'No relevant information found in the knowledge base.'

    // 3. Generate answer using Gemini with retrieved context
    const prompt = `${SYSTEM_PROMPT}

CONTEXT (retrieved from knowledge base):
${context}

USER QUESTION:
${question.trim()}

ANSWER:`

    const generate = OPEN_ROUTER_API_KEY
      ? (model) => generateWithOpenRouter(model, prompt)
      : (model) => generateWithGemini(genAI, model, prompt)
    const { answer, model } = await generateWithFallback(generate)
    console.log(`answer (${model}): `, answer)
    return res.status(200).json({ answer, sources: contextChunks.length })
  } catch (err) {
    console.error('Chat function error:', err)
    if (TRANSIENT_STATUSES.has(err.status)) {
      return res.status(503).json({
        error: "I'm getting a lot of questions right now. Please try again in a moment.",
        retryable: true,
      })
    }
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

/**
 * Try each model in CHAT_MODELS until one answers. Moves on when a model is
 * overloaded/rate-limited (transient) or doesn't exist (404); anything else
 * (bad key, bad request) is thrown straight away since other models would
 * fail the same way.
 */
async function generateWithFallback(generate) {
  let lastErr
  for (const model of CHAT_MODELS) {
    try {
      return { answer: await generate(model), model }
    } catch (err) {
      if (!TRANSIENT_STATUSES.has(err.status) && err.status !== 404) throw err
      console.warn(`Model ${model} unavailable (${err.status}), trying next`)
      lastErr = err
    }
  }
  throw lastErr
}

async function generateWithGemini(genAI, model, prompt) {
  const result = await genAI.getGenerativeModel({ model }).generateContent(prompt)
  return result.response.text()
}

/**
 * Generate via OpenRouter's OpenAI-compatible chat completions API.
 * Errors carry `status` so generateWithFallback can decide whether to try the next model.
 */
async function generateWithOpenRouter(model, prompt) {
  const response = await fetch(OPEN_ROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPEN_ROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: `google/${model}`,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const err = new Error(data.error?.message || `OpenRouter request failed (${response.status})`)
    err.status = response.status
    throw err
  }

  const answer = data.choices?.[0]?.message?.content
  if (!answer) {
    // OpenRouter can return 200 with an upstream error in the body
    const err = new Error(data.error?.message || 'OpenRouter returned no answer')
    err.status = data.error?.code || 502
    throw err
  }
  return answer
}
