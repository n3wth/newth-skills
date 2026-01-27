import { useParams, Link } from 'react-router-dom'
import { skills } from '../data/skills'
import { CategoryShape } from '../components/CategoryShape'
import { CommandBox } from '../components/CommandBox'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { categoryConfig } from '../config/categories'

export function SkillDetail() {
  const { skillId } = useParams<{ skillId: string }>()
  const skill = skills.find(s => s.id === skillId)

  if (!skill) {
    return (
      <div className="min-h-screen relative">
        <div className="mesh-gradient" />
        <div className="noise-overlay" />
        <Nav />
        <main className="px-6 md:px-12 pt-32 pb-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Skill not found
            </h1>
            <p className="text-lg mb-8" style={{ color: 'var(--color-grey-400)' }}>
              The skill you're looking for doesn't exist.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white hover:opacity-70 transition-opacity"
            >
              <span>&larr;</span> Back to all skills
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const config = categoryConfig[skill.category]

  return (
    <div className="min-h-screen relative">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      <Nav />

      <main className="px-6 md:px-12 pt-28 md:pt-32 pb-24">
        <div className="max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-8 text-sm hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-grey-400)' }}
          >
            <span>&larr;</span> All skills
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <CategoryShape category={skill.category} size={24} />
            <span
              className="text-sm font-medium px-3 py-1 rounded-full"
              style={{
                color: config?.color || 'var(--color-grey-400)',
                backgroundColor: config?.color ? `${config.color}20` : 'var(--glass-bg)',
              }}
            >
              {skill.category.charAt(0).toUpperCase() + skill.category.slice(1)}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 tracking-tight">
            {skill.name}
          </h1>

          <p
            className="text-lg md:text-xl leading-relaxed mb-8"
            style={{ color: 'var(--color-grey-200)' }}
          >
            {skill.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-12">
            {skill.tags.map(tag => (
              <span
                key={tag}
                className="text-xs uppercase tracking-wider px-3 py-1.5 rounded-full"
                style={{
                  color: 'var(--color-grey-400)',
                  backgroundColor: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="glass-card p-6 md:p-8">
            <h2 className="text-lg font-medium text-white mb-4">Install this skill</h2>
            <CommandBox
              name="Install"
              command={`curl -fsSL https://skills.newth.ai/install.sh | bash -s -- ${skill.id}`}
              primary={true}
              skillId={skill.id}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
