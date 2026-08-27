import { Card, CardContent } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import AnimatedWords from '../components/ui/AnimatedWords'
import { Award } from 'lucide-react'

const certifications = [
  {
    title: 'Rust Programming',
    issuer: "Let's Get Rusty",
    status: 'completed',
  },
  {
    title: 'FDE Academy Certificate',
    issuer: 'FDE Academy',
    status: 'in-progress',
  },
]

function Certifications() {
  return (
    <section id="certifications" className="py-20">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            <AnimatedWords text="Certifications" />
          </h2>
        </div>

        <div className="mx-auto grid max-w-2xl gap-6">
          {certifications.map((cert) => (
            <Card
              key={cert.title}
              className="group transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <Award className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-primary">
                    {cert.title}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {cert.issuer}
                  </span>
                </div>
                <Badge
                  variant={cert.status === 'completed' ? 'default' : 'secondary'}
                >
                  {cert.status === 'completed' ? 'Completed' : 'In Progress'}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Certifications
