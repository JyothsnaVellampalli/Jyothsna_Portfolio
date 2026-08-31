import Navbar from './sections/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import Projects from './sections/Projects'
import WorkProjects from './sections/WorkProjects'
import Skills from './sections/Skills'
import Certifications from './sections/Certifications'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import ChatWidget from './components/chat/ChatWidget'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <WorkProjects />
      <Skills />
      <Certifications />
      <Contact />
      <Footer />
      <ChatWidget />
    </div>
  )
}

export default App
