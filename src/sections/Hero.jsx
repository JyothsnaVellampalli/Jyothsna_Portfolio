import ParticleField from '../components/effects/ParticleField'

function Hero() {
  return (
    <section
      data-hero-section
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black py-20 md:py-32"
    >
      <ParticleField
        mode="hero"
        className="absolute inset-0 pointer-events-none"
      />

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          <div className="space-y-6">
            <h1 className="floating-text glowing-text text-5xl font-bold leading-tight md:text-7xl">
              Hello, I&apos;m Jyothsna
            </h1>
            <div className="floating-text-delayed font-mono text-2xl text-primary md:text-3xl">
              Forward deployed engineer (AI x Full-Stack)
            </div>
            <p className="floating-text mx-auto max-w-3xl text-xl leading-relaxed text-muted-foreground opacity-90">
              Building AI-powered solutions that solve real client problems.
              4+ years shipping production systems. <b>FDE Academy certified.</b>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
