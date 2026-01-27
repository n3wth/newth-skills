import { useParams, Link } from 'react-router-dom'
import { skills, type Skill } from '../data/skills'
import { CategoryShape } from '../components/CategoryShape'
import { CommandBox } from '../components/CommandBox'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { SkillCard } from '../components/SkillCard'
import { categoryConfig } from '../config/categories'

function getRelatedSkills(currentSkill: Skill, allSkills: Skill[], limit: number = 4): Skill[] {
  const otherSkills = allSkills.filter(s => s.id !== currentSkill.id)
  
  const scored = otherSkills.map(skill => {
    let score = 0
    
    if (skill.category === currentSkill.category) {
      score += 10
    }
    
    const matchingTags = skill.tags.filter(tag => currentSkill.tags.includes(tag))
    score += matchingTags.length * 2
    
    return { skill, score }
  })
  
  scored.sort((a, b) => b.score - a.score)
  
  return scored.slice(0, limit).map(item => item.skill)
}

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
    <div className="min-h-screen relative content-loaded">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      <Nav />

      <main className="px-6 md:px-12 pt-28 md:pt-32 pb-24">
        <div className="max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-8 text-sm hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-grey-400)' }}
          >
            <span>&larr;</span> All skills
          </Link>

          <div className="flex flex-wrap items-center gap-4 mb-6">
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
            {skill.compatibility && skill.compatibility.length > 0 && (
              <div className="flex items-center gap-2 sm:ml-auto">
                {skill.compatibility.map(platform => (
                  <span
                    key={platform}
                    className="text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5"
                    style={{
                      color: platform === 'gemini' ? '#8b5cf6' : '#f97316',
                      backgroundColor: platform === 'gemini' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(249, 115, 22, 0.15)',
                      border: `1px solid ${platform === 'gemini' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(249, 115, 22, 0.3)'}`,
                    }}
                  >
                    {platform === 'gemini' ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                      </svg>
                    )}
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </span>
                ))}
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 tracking-tight">
            {skill.name}
          </h1>

          <p
            className="text-lg md:text-xl leading-relaxed mb-6"
            style={{ color: 'var(--color-grey-200)' }}
          >
            {skill.description}
          </p>

          {skill.longDescription && (
            <p
              className="text-base md:text-lg leading-relaxed mb-8"
              style={{ color: 'var(--color-grey-400)' }}
            >
              {skill.longDescription}
            </p>
          )}

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

          {(skill.features || skill.useCases) && (
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {skill.features && skill.features.length > 0 && (
                <div className="glass-card p-6 md:p-8">
                  <h2 className="text-lg font-medium text-white mb-5 flex items-center gap-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={config?.color || 'var(--color-grey-400)'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Features
                  </h2>
                  <ul className="space-y-3">
                    {skill.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm"
                        style={{ color: 'var(--color-grey-200)' }}
                      >
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: config?.color || 'var(--color-grey-400)' }}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {skill.useCases && skill.useCases.length > 0 && (
                <div className="glass-card p-6 md:p-8">
                  <h2 className="text-lg font-medium text-white mb-5 flex items-center gap-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={config?.color || 'var(--color-grey-400)'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Use Cases
                  </h2>
                  <ul className="space-y-3">
                    {skill.useCases.map((useCase, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm"
                        style={{ color: 'var(--color-grey-200)' }}
                      >
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: config?.color || 'var(--color-grey-400)' }}
                        />
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="glass-card p-6 md:p-8">
            <h2 className="text-lg font-medium text-white mb-4">Install this skill</h2>
            <CommandBox
              name="Install"
              command={`curl -fsSL https://skills.newth.ai/install.sh | bash -s -- ${skill.id}`}
              primary={true}
              skillId={skill.id}
            />
          </div>

          {(() => {
            const relatedSkills = getRelatedSkills(skill, skills)
            if (relatedSkills.length === 0) return null
            return (
              <div className="mt-16">
                <h2 className="text-2xl font-semibold text-white mb-8">Related Skills</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {relatedSkills.map(relatedSkill => (
                    <SkillCard key={relatedSkill.id} skill={relatedSkill} />
                  ))}
                </div>
              </div>
            )
          })()}
        </div>
      </main>

      <Footer />
    </div>
  )
}
