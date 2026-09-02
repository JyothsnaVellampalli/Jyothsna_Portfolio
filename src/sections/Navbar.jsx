import Button from '../components/ui/Button'
import { Download } from 'lucide-react'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

// Replace this with your actual Google Drive shareable link
const RESUME_URL = 'https://drive.google.com/drive/folders/1qmOgaHaQr-nUmzsuyn4Cj70yGASSn9qo?usp=sharing'

function Navbar() {
  const handleResume = () => {
    window.open(RESUME_URL, '_blank', 'noopener,noreferrer')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="#" className="cursor-pointer text-2xl font-bold text-primary">
            {'<Dev/>'}
          </a>

          <div className="hidden space-x-8 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="hidden items-center gap-2 md:flex"
            onClick={handleResume}
          >
            <Download className="h-4 w-4" />
            Resume
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
