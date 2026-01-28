import { useParams, Link, Navigate } from 'react-router-dom'
import { Nav, Footer, SEO } from '../components'
import { SkillCard } from '../components/SkillCard'
import { CommandBox } from '../components/CommandBox'
import { getBundleById } from '../data/bundles'
import { skills } from '../data/skills'

export function BundleDetail() {
  const { bundleId } = useParams<{ bundleId: string }>()
  const bundle = bundleId ? getBundleById(bundleId) : undefined

  if (!bundle) {
    return <Navigate to="/curated-bundles" replace />
  }

  const bundleSkills = bundle.skillIds
    .map(id => skills.find(s => s.id === id))
    .filter(Boolean)

  const installCommand = `curl -sL https://skills.newth.ai/install.sh | sh -s -- ${bundle.skillIds.join(' ')}`

  const difficultyColors = {
    beginner: 'bg-green-500/15 text-green-400',
    intermediate: 'bg-yellow-500/15 text-yellow-400',
    advanced: 'bg-red-500/15 text-red-400',
  }

  return (
    <>
      <SEO
        title={`${bundle.name} | AI Skills Bundle`}
        description={bundle.description}
        canonicalUrl={`/curated-bundles/${bundle.id}`}
      />

      <div className="min-h-screen relative content-loaded">
        <div className="mesh-gradient" />
        <div className="noise-overlay" />

        <Nav />

        <main className="px-6 md:px-12 pt-28 md:pt-32 pb-24">
          <div className="max-w-5xl mx-auto">
            {/* Back link */}
            <Link
              to="/curated-bundles"
              className="inline-flex items-center gap-2 text-sm text-[var(--color-grey-400)] hover:text-[var(--color-white)] transition-colors mb-8"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Bundles
            </Link>

            {/* Header */}
            <div className="mb-12">
              <div className="flex items-start gap-4 mb-4">
                <h1 className="text-3xl md:text-4xl font-semibold text-[var(--color-white)]">
                  {bundle.name}
                </h1>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${difficultyColors[bundle.difficulty]}`}>
                  {bundle.difficulty}
                </span>
              </div>
              <p className="text-lg text-[var(--color-grey-300)] mb-6">
                {bundle.longDescription}
              </p>
              <div className="flex flex-wrap gap-2">
                {bundle.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-[var(--glass-bg)] text-[var(--color-grey-400)] border border-[var(--glass-border)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Install Section */}
            <div className="mb-12 p-6 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
              <h2 className="text-lg font-semibold text-[var(--color-white)] mb-4">
                Install all {bundle.skillIds.length} skills
              </h2>
              <CommandBox name="Install Bundle" command={installCommand} primary={true} />
              <p className="text-xs text-[var(--color-grey-600)] mt-3">
                Setup time: {bundle.estimatedSetupTime}
              </p>
            </div>

            {/* What You Can Build */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-[var(--color-white)] mb-6">
                What you can build
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {bundle.whatYouCanBuild.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                  >
                    <div className="w-2 h-2 rounded-full bg-[var(--color-sage)]" />
                    <span className="text-sm text-[var(--color-grey-300)]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Grid */}
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-white)] mb-6">
                Included skills ({bundleSkills.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bundleSkills.map((skill) => skill && (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
