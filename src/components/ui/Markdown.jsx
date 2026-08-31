import { Fragment } from 'react'

/**
 * Minimal, dependency-free Markdown renderer for chat responses.
 * Supports:
 *   - **bold** and __bold__
 *   - *italic* and _italic_
 *   - `inline code`
 *   - Unordered lists (lines starting with -, *, or •)
 *   - Ordered lists (lines starting with "1.", "2.", ...)
 *   - Paragraphs (blank-line separated)
 *
 * This intentionally covers only what the LLM tends to output, keeping the
 * bundle small and the rendering predictable/safe (no raw HTML injection).
 */

// Parse inline formatting (bold, italic, code) within a single line of text.
function renderInline(text, keyPrefix = '') {
  // Tokenize on the supported inline patterns, keeping the delimiters.
  const pattern = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|`[^`]+`)/g
  const parts = text.split(pattern).filter(Boolean)

  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`

    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={key} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('__') && part.endsWith('__')) {
      return (
        <strong key={key} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={key}
          className="rounded bg-background/60 px-1.5 py-0.5 font-mono text-[0.85em]"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    if (
      (part.startsWith('*') && part.endsWith('*')) ||
      (part.startsWith('_') && part.endsWith('_'))
    ) {
      return (
        <em key={key} className="italic">
          {part.slice(1, -1)}
        </em>
      )
    }
    return <Fragment key={key}>{part}</Fragment>
  })
}

// Group consecutive lines into blocks: paragraphs, unordered/ordered lists.
function parseBlocks(text) {
  const lines = text.split('\n')
  const blocks = []
  let currentList = null // { type: 'ul' | 'ol', items: [] }
  let paragraph = []

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: 'p', text: paragraph.join(' ') })
      paragraph = []
    }
  }
  const flushList = () => {
    if (currentList) {
      blocks.push(currentList)
      currentList = null
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (line === '') {
      flushParagraph()
      flushList()
      continue
    }

    const ulMatch = line.match(/^[-*•]\s+(.*)$/)
    const olMatch = line.match(/^\d+\.\s+(.*)$/)

    if (ulMatch) {
      flushParagraph()
      if (currentList?.type !== 'ul') {
        flushList()
        currentList = { type: 'ul', items: [] }
      }
      currentList.items.push(ulMatch[1])
    } else if (olMatch) {
      flushParagraph()
      if (currentList?.type !== 'ol') {
        flushList()
        currentList = { type: 'ol', items: [] }
      }
      currentList.items.push(olMatch[1])
    } else {
      flushList()
      paragraph.push(line)
    }
  }

  flushParagraph()
  flushList()
  return blocks
}

function Markdown({ text, className = '' }) {
  const blocks = parseBlocks(text)

  return (
    <div className={className}>
      {blocks.map((block, i) => {
        if (block.type === 'p') {
          return (
            <p key={i} className="mb-2 last:mb-0">
              {renderInline(block.text, `p${i}`)}
            </p>
          )
        }

        if (block.type === 'ul') {
          return (
            <ul key={i} className="mb-2 list-disc space-y-1 pl-5 last:mb-0">
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item, `ul${i}-${j}`)}</li>
              ))}
            </ul>
          )
        }

        return (
          <ol key={i} className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">
            {block.items.map((item, j) => (
              <li key={j}>{renderInline(item, `ol${i}-${j}`)}</li>
            ))}
          </ol>
        )
      })}
    </div>
  )
}

export default Markdown
