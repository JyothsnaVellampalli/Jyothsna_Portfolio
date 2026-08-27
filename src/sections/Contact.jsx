import AnimatedWords from '../components/ui/AnimatedWords'
import ParticleOrb from '../components/effects/ParticleOrb'
import { Mail, Linkedin, Github } from 'lucide-react'

const contacts = [
  {
    icon: <Mail className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />,
    label: 'jyotshna.vellampalli@gmail.com',
    href: 'mailto:jyotshna.vellampalli@gmail.com?subject=Portfolio Contact',
  },
  {
    icon: <Linkedin className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />,
    label: 'linkedin.com/in/jyothsna-vellampalli',
    href: 'https://www.linkedin.com/in/jyothsna-vellampalli/',
  },
  {
    icon: <Github className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />,
    label: 'github.com/JyothsnaVellampalli',
    href: 'https://github.com/yothsnaVellampalli',
  },
]

const opportunities = [
  'Full time job',
  'Freelance & contract work',
  'Mentoring'
]

function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-20">
      <ParticleOrb />

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              <AnimatedWords text="Let's Connect" />
            </h2>
            <p className="text-xl text-muted-foreground">
              <AnimatedWords text="Ready to collaborate on your next project?" />
            </p>
          </div>

          <div className="mx-auto flex max-w-3xl flex-col justify-center gap-20 md:flex-row">
            <div>
              <h3 className="mb-6 text-2xl font-bold">
                <AnimatedWords
                  text="Get in Touch"
                  wordClassName="hover:scale-110 hover:drop-shadow-[0_0_16px_rgba(255,255,255,1)]"
                />
              </h3>
              <div className="space-y-6">
                {contacts.map((c) => (
                  <div key={c.label} className="group flex items-center gap-4">
                    {c.icon}
                    <a
                      href={c.href}
                      target={c.href.startsWith('http') ? '_blank' : undefined}
                      rel={
                        c.href.startsWith('http')
                          ? 'noopener noreferrer'
                          : undefined
                      }
                      className="cursor-pointer transition-colors hover:text-primary"
                    >
                      {c.label}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-6 text-2xl font-bold">
                <AnimatedWords
                  text="Open to Opportunities"
                  wordClassName="hover:scale-110 hover:drop-shadow-[0_0_16px_rgba(255,255,255,1)]"
                />
              </h3>
              <div className="space-y-3 text-muted-foreground">
                {opportunities.map((item) => (
                  <div
                    key={item}
                    className="cursor-default transition-all duration-300 hover:text-foreground hover:drop-shadow-[0_0_16px_rgba(255,255,255,1.2)]"
                  >
                    {'\u2022'} {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
