import { Card, CardContent } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import ParticleField from '../components/effects/ParticleField'
import { Github, ExternalLink } from 'lucide-react'

const projects = [
  {
    title: 'Set haul',
    description:
      'SetuHaul is an end-to-end freight dock scheduling and driver assistance platform built on AWS Bedrock AgentCore. Drivers report en-route issues through a conversational AI agent; operations staff manage shipments, approve ETA changes, and allocate dock slots through an admin dashboard with AI-powered slot suggestions',
    tech: ['React', 'TypeScript', 'Python', 'SQL', 'AWS Bedrock Agentcore', 'claude-sonnet-4'],
    video: 'https://drive.google.com/file/d/110GCy0Skn2BFiXjKf2qTDACGyJJH9AC6/preview',
    github: 'https://github.com/JyothsnaVellampalli/sethaul',
    link: 'https://sethaul.vercel.app/',
  },
  {
    title: 'Pizzeria',
    description:
      'A full-stack dine-in pizzeria platform — self-ordering at the table, live kitchen ops, executive analytics, and an AI assistant that knows your menu.',
    tech: ['React', 'Node js', 'Express', 'SQL', 'google/genai', 'gemini-3.5-flash'],
    video: 'https://drive.google.com/file/d/13k-tSnFBbg1rtRWk10omIqQ5F5aiPeYZ/preview',
    github: 'https://github.com/JyothsnaVellampalli/Pizzeria-ai',
    link: 'https://pizzeria-ai-topaz.vercel.app/',
  },
  {
    title: 'AI Resume Matcher',
    description:
      'An intelligent candidate screening and recruitment copilot that analyzes multiple resumes against a job description, extracts core competencies, computes compatibility match scores, highlights candidate strengths and skill gaps, and generates ranked leaderboards.',
    tech: ['React', 'Node js', 'Express', 'google/genai', 'gemini-3.5-flash'],
    video: 'https://drive.google.com/file/d/1AeWlJGl_T0sHbsT6cEi2vptl1A6x7X_y/preview',
    github: 'https://github.com/JyothsnaVellampalli/resume-matcher',
    link: 'https://resume-matcher-wheat.vercel.app/',
  },
]

function Projects() {
  return (
    <section id="projects" className="relative overflow-hidden py-20">
      <ParticleField
        mode="section"
        className="absolute inset-0 pointer-events-none"
      />

      <div className="container relative z-10 mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            Featured Projects
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            A few recent projects that showcase my technical skills.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-12">
          {projects.map((project) => (
            <Card
              key={project.title}
              className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div className="space-y-6">
                <div className="aspect-video relative overflow-hidden rounded-t-lg bg-black">
                  {project.video ? (
                    <iframe
                      src={project.video}
                      className="h-full w-full"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      title={`${project.title} demo`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-card text-muted-foreground">
                      Project preview
                    </div>
                  )}
                </div>

                <CardContent className="p-8">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-primary">
                      {project.title}
                    </h3>
                    <p className="leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <Badge key={t} variant="outline">
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-4 pt-4">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm" className="group">
                          <Github className="mr-2 h-4 w-4" />
                          Code
                        </Button>
                      </a>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm" className="group">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Live Demo
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
