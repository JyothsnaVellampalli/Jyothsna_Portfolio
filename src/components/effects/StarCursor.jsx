import { useEffect } from 'react'

/**
 * Custom glowing star cursor with a fading particle trail.
 * Adds a `.hover` state over interactive elements and hides the trail
 * when the tab is hidden. Runs once on mount; no visible React output.
 */
function StarCursor() {
  useEffect(() => {
    // Respect touch devices — no custom cursor there.
    if (window.matchMedia('(pointer: coarse)').matches) return

    const star = document.createElement('div')
    star.className = 'cursor-star'
    document.body.appendChild(star)

    let trails = []
    let rafId = null
    let x = 0
    let y = 0
    let lastTrail = 0

    const spawnTrail = (tx, ty, time) => {
      if (time - lastTrail < 16) return
      lastTrail = time

      const dot = document.createElement('div')
      dot.className = 'cursor-trail'
      dot.style.left = `${tx}px`
      dot.style.top = `${ty}px`
      document.body.appendChild(dot)
      trails.push(dot)

      if (trails.length > 15) {
        const oldest = trails.shift()
        oldest?.parentNode?.removeChild(oldest)
      }

      window.setTimeout(() => {
        dot.parentNode?.removeChild(dot)
        trails = trails.filter((t) => t !== dot)
      }, 600)
    }

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      star.style.transform = `translate(${x}px, ${y}px)`
      if (!rafId) {
        rafId = requestAnimationFrame((time) => {
          spawnTrail(x, y, time)
          rafId = null
        })
      }
    }

    const interactiveSelector =
      'a, button, [role="button"], input, textarea, select'
    const onOver = (e) => {
      if (e.target.matches?.(interactiveSelector)) star.classList.add('hover')
    }
    const onOut = (e) => {
      if (e.target.matches?.(interactiveSelector))
        star.classList.remove('hover')
    }
    const onLeave = () => {
      star.style.opacity = '0'
    }
    const onEnter = () => {
      star.style.opacity = '1'
    }
    const onVisibility = () => {
      if (document.hidden && trails.length) {
        trails.forEach((t) => t.remove())
        trails = []
      }
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseout', onOut, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('visibilitychange', onVisibility)
      if (rafId) cancelAnimationFrame(rafId)
      trails.forEach((t) => t.remove())
      star.remove()
    }
  }, [])

  return null
}

export default StarCursor
