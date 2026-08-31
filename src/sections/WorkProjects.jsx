import { Card, CardContent } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import AnimatedWords from '../components/ui/AnimatedWords'
import { Briefcase } from 'lucide-react'

const workProjects = [
  {
    title: 'Internal AI Agent Platform',
    company: 'Cooper Standard, Chennai',
    role: 'AWS AI Developer',
    period: 'Nov 2025 – Present',
    description:
      'Developed an internal AI Agent platform enabling developers to create and manage AI agents via configurable system prompts, with automated deployment, scaling, and policy-based access control using AWS AgentCore Runtime, Gateway and policy engines.',
    tech: ['React js', 'Python', 'AWS Bedrock AgentCore', 'AWS Cognito', 'PostgreSQL'],
  },
  {
    title: 'AI-Based Assessment Tool',
    company: 'Self-employed (Freelance)',
    role: 'Freelance Developer',
    period: 'June 2025 – Sept 2025',
    description:
      'Built an AI-driven assessment platform prototype, working directly with client requirements to shape the product from concept to delivery.',
    tech: ['React JS', 'Client Collaboration'],
  },
  {
    title: 'Catalouge editor, Booking Platform, UI library, Policy management engine',
    company: 'Roanuz, Chennai',
    role: 'Software Developer',
    period: 'Nov 2022 – Nov 2025',
    description:
      'Led serverless catalog editing/viewing application; optimized PDFs to static HTML via S3, reducing viewing cost to zero. Delivered booking platform modules (guest journeys, affiliate workflows) covering 30%+ of features and improving UX by 50%. Developed Rust-based policy management for B2B e-commerce, enhancing security and scalability. Built an internal UI library used across multiple teams, improving overall development speed by 30%.',
    tech: ['AWS Serverless', 'Rust', 'React JS', 'Node JS', 'Python', 'Radix UI'],
  },
  {
    title: 'SaaS Product Development',
    company: 'Klenty, Chennai',
    role: 'Software Developer',
    period: 'June 2022 - Nov 2022',
    description:
      'Contributed to Klenty, a SaaS product, by building in-app notifications and analytics charts. Integrated third-party libraries including Chargebee, working within the Express.js framework.',
    tech: ['Express.js', 'Chargebee', 'Analytics', 'Notifications'],
  },
]

function WorkProjects() {
  return (
    <section id="work" className="bg-card/30 py-20">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            <AnimatedWords text="Professional Experience" />
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            <AnimatedWords text="Projects I've contributed to in a professional capacity. Details are limited due to confidentiality." />
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8">
          {workProjects.map((project) => (
            <Card
              key={project.title}
              className="group transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-primary">
                          {project.title}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {project.role} · {project.company}
                        </span>
                      </div>
                    </div>
                    {project.period && (
                      <span className="shrink-0 text-xs font-medium text-muted-foreground">
                        {project.period}
                      </span>
                    )}
                  </div>

                  <p className="leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tech.map((t) => (
                      <Badge key={t} variant="outline">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WorkProjects
