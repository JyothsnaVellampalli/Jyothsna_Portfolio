import { Card } from '../components/ui/Card'
import AnimatedWords from '../components/ui/AnimatedWords'
import { Code2, Server, Layout, Brain } from 'lucide-react'

const groups = [
  {
    category: 'Languages',
    items: ['JavaScript / TypeScript', 'Python', 'Rust'],
    icon: <Code2 className="h-6 w-6" />,
  },
  {
    category: 'Backend & Cloud',
    items: ['Node.js', 'Express.js', 'REST APIs', 'GraphQL', 'AWS Serverless architectures'],
    icon: <Server className="h-6 w-6" />,
  },
  {
    category: 'Frontend',
    items: ['React Js', 'Next Js', 'Responsive Design'],
    icon: <Layout className="h-6 w-6" />,
  },
  {
    category: 'AI',
    items: ['RAG', 'AWS Bedrock Agentcore', 'Google AI Studio'],
    icon: <Brain className="h-6 w-6" />,
  },
]

function Skills() {
  return (
    <section id="skills" className="bg-card/30 py-20">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            <AnimatedWords text="Skills & Technologies" />
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            <AnimatedWords text="My technical arsenal for building modern applications." />
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {groups.map((group) => (
            <Card
              key={group.category}
              className="group p-6 transition-all duration-300 hover:shadow-lg"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="text-primary transition-transform group-hover:scale-110">
                  {group.icon}
                </div>
                <h3 className="text-xl font-bold text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-foreground group-hover:drop-shadow-[0_0_16px_rgba(255,255,255,1)]">
                  {group.category}
                </h3>
              </div>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <div
                    key={item}
                    className="cursor-default text-muted-foreground transition-all duration-300 hover:text-foreground hover:drop-shadow-[0_0_16px_rgba(255,255,255,1.2)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
