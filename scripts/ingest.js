/**
 * ============================================================
 * RAG Ingestion Script
 * ============================================================
 *
 * Run this ONCE (or whenever you update your knowledge files)
 * to chunk, embed, and upsert your content into Pinecone.
 *
 * Usage:
 *   1. Add your .txt files to the /knowledge folder
 *   2. Set environment variables (see below)
 *   3. Run: npm run ingest
 *
 * Required env vars (set in .env or shell):
 *   PINECONE_API_KEY    - Your Pinecone API key
 *   PINECONE_INDEX_NAME - Name of your Pinecone index (e.g. "portfolio")
 *   GEMINI_API_KEY      - Google AI Studio API key (for embeddings)
 *
 * Prerequisites:
 *   - Create a Pinecone index with dimension=768 and metric=cosine
 *     (we use outputDimensionality=768 with gemini-embedding-001)
 *
 * ============================================================
 */

import { Pinecone } from '@pinecone-database/pinecone'
import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'node:fs'
import path from 'node:path'

// ─── Config ────────────────────────────────────────────────────────────────────

const PINECONE_API_KEY = process.env.PINECONE_API_KEY
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'portfolio'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const KNOWLEDGE_DIR = path.resolve('knowledge')
const CHUNK_SIZE = 500 // characters per chunk
const CHUNK_OVERLAP = 100 // overlap between chunks for context continuity

// ─── Validation ────────────────────────────────────────────────────────────────

if (!PINECONE_API_KEY) {
  console.error('❌ Missing PINECONE_API_KEY environment variable')
  process.exit(1)
}
if (!GEMINI_API_KEY) {
  console.error('❌ Missing GEMINI_API_KEY environment variable')
  process.exit(1)
}

// ─── Initialize clients ────────────────────────────────────────────────────────

const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY })
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' })

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Split text into overlapping chunks for embedding.
 */
function chunkText(text, size = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const chunks = []
  let start = 0
  while (start < text.length) {
    const end = Math.min(start + size, text.length)
    chunks.push(text.slice(start, end).trim())
    start += size - overlap
  }
  return chunks.filter((c) => c.length > 20) // skip tiny fragments
}

/**
 * Generate embedding for a text chunk using Gemini (reduced to 768 dims).
 */
async function getEmbedding(text) {
  const result = await embeddingModel.embedContent({
    content: { parts: [{ text }] },
    outputDimensionality: 768,
  })
  return result.embedding.values
}

/**
 * Read all .txt files from the knowledge directory.
 */
function loadKnowledgeFiles() {
  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    console.error(`❌ Knowledge directory not found: ${KNOWLEDGE_DIR}`)
    process.exit(1)
  }

  const files = fs.readdirSync(KNOWLEDGE_DIR).filter((f) => f.endsWith('.txt'))
  if (files.length === 0) {
    console.error('❌ No .txt files found in /knowledge directory')
    process.exit(1)
  }

  return files.map((file) => ({
    filename: file,
    content: fs.readFileSync(path.join(KNOWLEDGE_DIR, file), 'utf-8'),
  }))
}

// ─── Main ingestion flow ───────────────────────────────────────────────────────

async function ingest() {
  console.log('📂 Loading knowledge files...')
  const files = loadKnowledgeFiles()
  console.log(`   Found ${files.length} file(s)\n`)

  const index = pinecone.index(PINECONE_INDEX_NAME)

  // Collect all vectors
  const vectors = []

  for (const file of files) {
    console.log(`📄 Processing: ${file.filename}`)
    const chunks = chunkText(file.content)
    console.log(`   Split into ${chunks.length} chunks`)

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      const embedding = await getEmbedding(chunk)

      vectors.push({
        id: `${file.filename}-chunk-${i}`,
        values: embedding,
        metadata: {
          source: file.filename,
          chunkIndex: i,
          text: chunk,
        },
      })

      // Rate limiting: small delay between embedding calls
      if (i < chunks.length - 1) {
        await new Promise((r) => setTimeout(r, 100))
      }
    }

    console.log(`   ✓ Embedded ${chunks.length} chunks\n`)
  }

  // Upsert in batches of 100 (Pinecone limit)
  console.log(`📤 Upserting ${vectors.length} vectors to Pinecone...`)
  const batchSize = 100
  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize)
    await index.upsert(batch)
  }

  console.log('✅ Ingestion complete!')
  console.log(`   Index: ${PINECONE_INDEX_NAME}`)
  console.log(`   Vectors: ${vectors.length}`)
}

ingest().catch((err) => {
  console.error('❌ Ingestion failed:', err.message)
  process.exit(1)
})
