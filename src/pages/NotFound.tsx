import { Link } from 'react-router-dom'
import { skills } from '../data/skills'
import { Nav, Footer, SkillCard } from '../components'

const suggestedSkills = skills.filter(s => s.featured).slice(0, 4)

export function NotFound() {
  return (
    <div className="min-h-screen relative content-loaded">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />

      <Nav />

      <main className="px-6 md:px-12 pt-32 pb-24">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="label mb-4">404 Error</p>
          <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-white">
            Page not found
          </h1>
          <p className="text-grey-400 text-lg mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="glass-pill px-6 py-3 rounded-full text-sm font-medium inline-block"
          >
            Back to home
          </Link>
        </div>

        <div className="max-w-5xl mx-auto">
          <p className="label mb-6 text-center">Maybe try one of these skills</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {suggestedSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
