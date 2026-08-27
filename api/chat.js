/**
 * ============================================================
 * Vercel Serverless Function: POST /api/chat
 * ============================================================
 *
 * RAG-powered chat endpoint.
 * 1. Embeds the user's question using Gemini
 * 2. Queries Pinecone for relevant chunks
 * 3. Sends context + question to Gemini for a grounded answer
 *
 * Required env vars (set in Vercel Dashboard > Settings > Environment Variables):
 *   PINECONE_API_KEY
 *   PINECONE_INDEX_NAME
 *   GEMINI_API_KEY
 *
 * ============================================================
 */

import { Pinecone } from '@pinecone-database/pinecone'
import { GoogleGenerativeAI } from '@google/generative-ai'

const PINECONE_API_KEY = process.env.PINECONE_API_KEY
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'portfolio'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const TOP_K = 5

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

    // Extract text from matched chunks
    const contextChunks = queryResponse.matches
      .filter((m) => m.score > 0.3)
      .map((m) => m.metadata.text)

    const context = contextChunks.length > 0
      ? contextChunks.join('\n\n---\n\n')
      : 'No relevant information found in the knowledge base.'

    // 3. Generate answer using Gemini with retrieved context
    const chatModel = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' })

    const prompt = `${SYSTEM_PROMPT}

CONTEXT (retrieved from knowledge base):
${context}

USER QUESTION:
${question.trim()}

ANSWER:`

    const result = await chatModel.generateContent(prompt)
    console.log("result: ", result)
    const answer = result.response.text()
    console.log('answer: ', answer)
    return res.status(200).json({ answer, sources: contextChunks.length })
  } catch (err) {
    console.error('Chat function error:', err)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}
