import Badge from '../components/ui/Badge'
import AnimatedWords from '../components/ui/AnimatedWords'

// A subtle line-art SVG used as a faint background watermark.
const bgSvg = encodeURIComponent(
  `<svg width="800" height="400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="30" fill="none" stroke="rgb(168 85 247)" stroke-width="0.5" opacity="0.12"/><circle cx="50" cy="50" r="20" fill="none" stroke="rgb(168 85 247)" stroke-width="0.5" opacity="0.12"/></svg>`,
)

const paragraphs = [
  'I am a developer with a passion for tackling complex problems head-on and a drive to keep expanding my toolkit, whether that means exploring new research, mastering a framework, or studying how technology shapes daily life.',
  'By asking sharp questions and breaking problems into clear, actionable steps, I build streamlined solutions.',
  'Time is my most precious resource, so I lean on continuous learning to make every minute count, balancing hands-on building with deep study.',
  'When I am not developing, you will find me exploring ideas from books and podcasts, meditating.',
]

// const paragraphs = []

const tags = ['Problem Solver', 'Critical Thinker', 'Lifelong Learner']

function About() {
  return (
    <section
      id="about"
      className="bg-card/30 py-20"
      style={{
        backgroundImage: `url("data:image/svg+xml,${bgSvg}")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold md:text-5xl">
              <AnimatedWords text="About Me" />
            </h2>
          </div>

          <div className="space-y-8 text-lg text-muted-foreground">
            {paragraphs.map((text, i) => (
              <p key={i} className="leading-relaxed">
                <AnimatedWords text={text} />
              </p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="relative cursor-default transition-all duration-300 ease-out hover:z-10 hover:scale-125 hover:border-purple-400 hover:bg-purple-500/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
