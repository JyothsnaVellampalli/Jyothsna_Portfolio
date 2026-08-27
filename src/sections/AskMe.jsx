import { useState, useRef, useEffect } from 'react'
import Button from '../components/ui/Button'
import AnimatedWords from '../components/ui/AnimatedWords'
import { Send, Bot, User, Loader2 } from 'lucide-react'

function AskMe() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content:
        "Hi! I'm Jyothsna's AI assistant. Ask me anything about her skills, projects, or experience.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatContainerRef = useRef(null)

  // Auto-scroll only the chat container (not the page)
  useEffect(() => {
    const container = chatContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages, loading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const question = input.trim()
    if (!question || loading) return

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: question }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setMessages((prev) => [...prev, { role: 'bot', content: data.answer }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: `Sorry, I couldn't process that. ${err.message}`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="ask" className="py-20">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            <AnimatedWords text="Ask About Me" />
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            <AnimatedWords text="Curious about my skills or projects? Ask my AI assistant — it knows my full background." />
          </p>
        </div>

        <div className="mx-auto max-w-2xl overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          {/* Messages area — scrolls internally */}
          <div
            ref={chatContainerRef}
            className="h-[400px] overflow-y-auto p-6 space-y-4"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'bot' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/50 text-foreground'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-4 py-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 border-t border-border p-4"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about skills, projects, experience..."
              className="flex-1 rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={loading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={loading || !input.trim()}
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default AskMe
