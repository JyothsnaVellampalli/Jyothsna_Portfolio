/**
 * ============================================================
 * Local API dev server
 * ============================================================
 *
 * Runs the chat API locally on port 3001 so the chatbot works
 * during development without needing Vercel CLI.
 *
 * Usage: npm run dev:api
 * (Run alongside `npm run dev` in a separate terminal)
 *
 * ============================================================
 */

import http from 'node:http'
import chatHandler from '../api/chat.js'

const PORT = 3001

const server = http.createServer(async (req, res) => {
  // CORS headers for local dev
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.url === '/api/chat' && req.method === 'POST') {
    // Collect body
    let body = ''
    for await (const chunk of req) {
      body += chunk
    }

    try {
      req.body = JSON.parse(body)
    } catch {
      req.body = {}
    }

    // Create a mock res object compatible with the Vercel handler
    const mockRes = {
      statusCode: 200,
      headers: {},
      body: null,
      status(code) {
        this.statusCode = code
        return this
      },
      json(data) {
        this.body = JSON.stringify(data)
        res.writeHead(this.statusCode, {
          'Content-Type': 'application/json',
          ...Object.fromEntries(
            Object.entries(res.getHeaders?.() || {})
          ),
        })
        res.end(this.body)
      },
    }

    console.log("invoking chat handler")
    await chatHandler(req, mockRes)
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
  }
})

server.listen(PORT, () => {
  console.log(`\n🤖 Chat API running at http://localhost:${PORT}/api/chat\n`)
})
