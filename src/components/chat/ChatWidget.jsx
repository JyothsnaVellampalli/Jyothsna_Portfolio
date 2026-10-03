import { useState, useRef, useEffect } from 'react'
import Button from '../ui/Button'
import Markdown from '../ui/Markdown'
import { MessageCircle, X, Send, Bot, User, Loader2, RotateCcw } from 'lucide-react'

const WELCOME_MESSAGE = {
  role: 'bot',
  content:
    "Hi! I'm Jyothsna's AI assistant. Ask me anything about her skills, projects, or experience.",
}

const SUGGESTIONS = [
  'What are her top skills?',
  'Tell me about her AI projects',
  'What is her current role?',
  'How much experience does she have?',
  'What AWS experience does she have?',
  'Why is she a good fit for an FDE role?',
  'How can I contact her?',
]

function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatContainerRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll the message list (never the page)
  useEffect(() => {
    const container = chatContainerRef.current
    if (container) container.scrollTop = container.scrollHeight
  }, [messages, loading])

  // Focus the input when the panel opens
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // Close on Escape for accessibility
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const sendQuestion = async (question, { isRetry = false } = {}) => {
    const trimmed = question.trim()
    if (!trimmed || loading) return

    setMessages((prev) =>
      isRetry
        ? // Drop the failed reply; the user's question is already shown
          prev.slice(0, -1)
        : [...prev, { role: 'user', content: trimmed }],
    )
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
      })
      const data = await res.json()
      if (data.retryable) {
        setMessages((prev) => [
          ...prev,
          { role: 'bot', content: data.error, retryQuestion: trimmed },
        ])
        return
      }
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setMessages((prev) => [...prev, { role: 'bot', content: data.answer }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: `Sorry, I couldn't process that. ${err.message}` },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    sendQuestion(input)
  }


  return (
    <>
      {/* Launcher button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat assistant'}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:bottom-6 md:right-6"
      >
        {/* Pulsing ring to draw attention (hidden once opened) */}
        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-60" />
        )}
        <span className="relative">
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </span>
      </button>

      {/* Chat panel */}
      <div
        role="dialog"
        aria-label="Chat assistant"
        aria-hidden={!open}
        className={`fixed z-[99] flex flex-col overflow-hidden border border-border bg-card shadow-2xl transition-all duration-300 ease-out
          bottom-0 right-0 h-[100dvh] w-full rounded-none
          sm:bottom-24 sm:right-6 sm:h-[560px] sm:max-h-[calc(100dvh-8rem)] sm:w-[400px] sm:rounded-2xl
          ${
            open
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none translate-y-4 opacity-0'
          }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-secondary/30 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Ask About Me</p>
              <p className="text-xs text-muted-foreground">AI assistant · usually instant</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2.5 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'bot' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'whitespace-pre-wrap rounded-br-sm bg-primary text-primary-foreground'
                    : 'rounded-bl-sm bg-secondary/50 text-foreground'
                }`}
              >
                {msg.role === 'bot' ? <Markdown text={msg.content} /> : msg.content}
                {msg.retryQuestion && i === messages.length - 1 && (
                  <button
                    type="button"
                    onClick={() => sendQuestion(msg.retryQuestion, { isRetry: true })}
                    disabled={loading}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Try again
                  </button>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {messages.length === 1 && !loading && (
            <div className="flex flex-wrap gap-2 pt-1">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => sendQuestion(s)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="flex gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-secondary/50 px-3.5 py-2.5 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex shrink-0 items-center gap-2 border-t border-border p-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about skills, projects..."
            className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={loading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={loading || !input.trim()}
            className="h-10 w-10 shrink-0 rounded-full"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </>
  )
}

export default ChatWidget
