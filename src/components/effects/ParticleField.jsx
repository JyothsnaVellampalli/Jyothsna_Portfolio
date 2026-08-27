import { useCallback, useEffect, useRef } from 'react'

/**
 * Canvas starfield of glowing particles that drift, wrap at edges, and are
 * repelled by the cursor. Each particle is drawn as layered radial gradients
 * plus a bright core and a small plus-shaped sparkle.
 *
 * mode="hero": particles explode outward from center on mount, then settle
 *              into a free-floating field; sizes to the viewport.
 * mode="section": particles seed in place and float immediately; sizes to
 *              the parent element.
 */
function ParticleField({ mode = 'section', className = '', style }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const rafRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const timeRef = useRef(0)
  const lastFrameRef = useRef(0)
  const activeRef = useRef(true)

  // Pre-build layered radial gradients for a given particle size.
  const buildGradients = useCallback((ctx, size) => {
    const layers = [
      { size: 8 * size, alpha: 0.03, color: '#6969b3' },
      { size: 5 * size, alpha: 0.08, color: '#98c1d9' },
      { size: 3 * size, alpha: 0.15, color: '#b8e0f5' },
      { size: 1.8 * size, alpha: 0.3, color: '#ffffff' },
    ]
    return layers.map((layer) => {
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, layer.size)
      gradient.addColorStop(0, layer.color)
      gradient.addColorStop(1, 'transparent')
      return { gradient, alpha: layer.alpha, size: layer.size }
    })
  }, [])

  const onMouseMove = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isHero = mode === 'hero'

    const sizeCanvas = () => {
      if (isHero) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        canvas.style.width = `${window.innerWidth}px`
        canvas.style.height = `${window.innerHeight}px`
      } else {
        const parent = canvas.parentElement
        if (!parent) return
        canvas.width = parent.offsetWidth
        canvas.height = parent.offsetHeight
        canvas.style.width = `${parent.offsetWidth}px`
        canvas.style.height = `${parent.offsetHeight}px`
      }
    }

    const count =
      window.innerWidth < 768 ? 50 : window.innerWidth < 1200 ? 100 : 150

    const seed = () => {
      particlesRef.current = []
      sizeCanvas()

      if (isHero) {
        const cx = canvas.width / 2
        const cy = canvas.height / 2
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2
          const maxR =
            Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height) / 2
          const dist = 200 + Math.random() * maxR
          let tx = cx + Math.cos(angle) * dist
          let ty = cy + Math.sin(angle) * dist
          tx = Math.max(20, Math.min(canvas.width - 20, tx))
          ty = Math.max(20, Math.min(canvas.height - 20, ty))
          const p = {
            x: cx,
            y: cy,
            baseX: tx,
            baseY: ty,
            vx: Math.cos(angle) * (4 + Math.random() * 6),
            vy: Math.sin(angle) * (4 + Math.random() * 6),
            size: 1.5 + Math.random() * 4,
            opacity: 0,
            phase: 'exploding',
            explosionTarget: { x: tx, y: ty },
          }
          p.gradients = buildGradients(ctx, p.size)
          particlesRef.current.push(p)
        }
      } else {
        const sectionCount = window.innerWidth < 768 ? 50 : 100
        for (let i = 0; i < sectionCount; i++) {
          const px = Math.random() * canvas.width
          const py = Math.random() * canvas.height
          const p = {
            x: px,
            y: py,
            baseX: px,
            baseY: py,
            vx: 0,
            vy: 0,
            size: 1.5 + Math.random() * 3,
            opacity: 0.3 + Math.random() * 0.5,
            phase: 'floating',
          }
          p.gradients = buildGradients(ctx, p.size)
          particlesRef.current.push(p)
        }
      }
    }

    const drawParticle = (p) => {
      ctx.save()
      const o = p.opacity
      if (p.gradients) {
        p.gradients.forEach(({ gradient, alpha, size }) => {
          ctx.globalAlpha = o * alpha
          ctx.translate(p.x, p.y)
          ctx.fillStyle = gradient
          ctx.fillRect(-size, -size, 2 * size, 2 * size)
          ctx.translate(-p.x, -p.y)
        })
      }
      // Bright core
      ctx.globalAlpha = o
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(p.x, p.y, 0.8 * p.size, 0, 2 * Math.PI)
      ctx.fill()
      // Plus-shaped sparkle
      ctx.globalAlpha = 0.6 * o
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 0.5
      const s = 3 * p.size
      ctx.beginPath()
      ctx.moveTo(p.x, p.y - s)
      ctx.lineTo(p.x, p.y + s)
      ctx.moveTo(p.x - s, p.y)
      ctx.lineTo(p.x + s, p.y)
      ctx.stroke()
      ctx.restore()
    }

    const updateFloating = (p) => {
      const m = mouseRef.current
      const dx = p.x - m.x
      const dy = p.y - m.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const radius = 120
      if (dist < radius && dist > 0) {
        const force = Math.pow((radius - dist) / radius, 3)
        const strength = 0.8
        p.vx += (dx / dist) * force * strength
        p.vy += (dy / dist) * force * strength
      }
      // Gentle ambient drift
      const nx = 0.001 * p.baseX
      const ny = 0.001 * p.baseY
      p.vx += 0.005 * Math.sin(0.2 * timeRef.current + nx)
      p.vy += 0.004 * Math.cos(0.15 * timeRef.current + ny)
      p.vx *= 0.997
      p.vy *= 0.997
      p.x += p.vx
      p.y += p.vy
      // Wrap around edges
      if (p.x < -10) p.x = canvas.width + 10
      if (p.x > canvas.width + 10) p.x = -10
      if (p.y < -10) p.y = canvas.height + 10
      if (p.y > canvas.height + 10) p.y = -10
    }

    const render = (time) => {
      if (isHero && !activeRef.current) {
        rafRef.current = requestAnimationFrame(render)
        return
      }
      // ~60fps throttle for the hero field
      if (isHero && time - lastFrameRef.current < 1000 / 60) {
        rafRef.current = requestAnimationFrame(render)
        return
      }
      lastFrameRef.current = time

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      timeRef.current += 0.016

      particlesRef.current.forEach((p) => {
        if (p.phase === 'exploding') {
          p.x += p.vx
          p.y += p.vy
          p.vx *= 0.99
          p.vy *= 0.99
          p.opacity = Math.min(0.8, p.opacity + 0.03)
          const reached =
            Math.sqrt(
              Math.pow(p.x - p.explosionTarget.x, 2) +
                Math.pow(p.y - p.explosionTarget.y, 2),
            ) < 30
          if (reached || timeRef.current > 5) {
            p.phase = 'floating'
            p.baseX = p.x
            p.baseY = p.y
            p.vx = 0
            p.vy = 0
          }
        } else {
          updateFloating(p)
        }
        drawParticle(p)
      })

      rafRef.current = requestAnimationFrame(render)
    }

    seed()
    rafRef.current = requestAnimationFrame(render)
    window.addEventListener('resize', sizeCanvas)
    window.addEventListener('mousemove', onMouseMove)

    // Pause the hero field when scrolled out of view (perf).
    let observer
    if (isHero) {
      const hero = document.querySelector('[data-hero-section]')
      if (hero) {
        observer = new IntersectionObserver(
          ([entry]) => {
            activeRef.current = entry.isIntersecting
          },
          { threshold: 0.1 },
        )
        observer.observe(hero)
      }
    }

    return () => {
      window.removeEventListener('resize', sizeCanvas)
      window.removeEventListener('mousemove', onMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      observer?.disconnect()
    }
  }, [mode, buildGradients, onMouseMove])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ zIndex: 1, ...style }}
    />
  )
}

export default ParticleField
