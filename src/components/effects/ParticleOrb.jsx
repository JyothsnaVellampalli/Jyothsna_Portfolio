import { cn } from '../../lib/cn'

/**
 * A rotating 3D orb of glowing particles. Each particle orbits outward on a
 * randomized axis; the wrapper spins on X/Y. All motion is CSS-driven
 * (see .particle-orb-* rules in index.css).
 */
function ParticleOrb({ className = '', count = 100 }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    rotateZ: Math.random() * 360,
    rotateY: Math.random() * 360,
    delay: 0.02 * i,
  }))

  return (
    <div className={cn('particle-orb-container', className)}>
      <div className="particle-orb-wrap">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle-3d"
            style={{
              '--rotate-z': `${p.rotateZ}deg`,
              '--rotate-y': `${p.rotateY}deg`,
              '--delay': `${p.delay}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default ParticleOrb
