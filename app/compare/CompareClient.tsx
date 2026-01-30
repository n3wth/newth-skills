'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { skills, type Skill } from '@/src/data/skills'
import { Nav } from '@/src/components/Nav'
import { Footer } from '@/src/components/Footer'
import { CategoryShape } from '@/src/components/CategoryShape'
import { CommandBox } from '@/src/components/CommandBox'
import { AssistantBadge } from '@/src/components/AssistantBadge'
import { categoryConfig } from '@/src/config/categories'
import { clearComparison, removeFromComparison, getComparisonSkills } from '@/src/lib/community'

export function CompareClient() {
  const searchParams = useSearchParams()
  const [comparisonIds, setComparisonIds] = useState<string[]>(() => {
    const urlSkills = searchParams.get('skills')
    if (urlSkills) {
      return urlSkills.split(',').filter(Boolean)
    }
    return getComparisonSkills()
  })

  const comparedSkills = useMemo(() => {
    return comparisonIds
      .map(id => skills.find(s => s.id === id))
      .filter((s): s is Skill => s !== undefined)
  }, [comparisonIds])

  const handleRemove = (skillId: string) => {
    removeFromComparison(skillId)
    setComparisonIds(prev => prev.filter(id => id !== skillId))
  }

  const handleClear = () => {
    clearComparison()
    setComparisonIds([])
  }

  const allFeatures = useMemo(() => {
    const featureSet = new Set<string>()
    comparedSkills.forEach(skill => skill.features?.forEach(f => featureSet.add(f)))
    return Array.from(featureSet)
  }, [comparedSkills])

  const allUseCases = useMemo(() => {
    const useCaseSet = new Set<string>()
    comparedSkills.forEach(skill => skill.useCases?.forEach(u => useCaseSet.add(u)))
    return Array.from(useCaseSet)
  }, [comparedSkills])

  if (comparedSkills.length === 0) {
    return (
      <div className="min-h-screen relative">
        <div className="mesh-gradient" />
        <div className="noise-overlay" />
        <Nav />
        <main className="px-6 md:px-12 pt-32 pb-24">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Compare Skills
            </h1>
            <p className="text-lg mb-8" style={{ color: 'var(--color-grey-200)' }}>
              Select skills to compare them side by side.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#22c55e' }}
            >
              Browse Skills
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative content-loaded">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      <Nav />

      <main className="px-6 md:px-12 pt-28 md:pt-32 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 mb-4 text-sm hover:opacity-70 transition-opacity"
                style={{ color: 'var(--color-grey-400)' }}
              >
                <span>&larr;</span> All skills
              </Link>
              <h1 className="text-3xl md:text-4xl font-semibold text-white">
                Compare Skills
              </h1>
            </div>
            <button
              onClick={handleClear}
              className="px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-70"
              style={{
                color: 'var(--color-grey-400)',
                border: '1px solid var(--glass-border)',
              }}
            >
              Clear All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr>
                  <th className="text-left p-4 w-48" style={{ color: 'var(--color-grey-400)' }}></th>
                  {comparedSkills.map(skill => (
                    <th key={skill.id} className="p-4 text-left align-top">
                      <div className="glass-card p-4 relative">
                        <button
                          onClick={() => handleRemove(skill.id)}
                          className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
                          style={{ color: 'var(--color-grey-400)' }}
                          aria-label={`Remove ${skill.name} from comparison`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                        <div className="flex items-center gap-2 mb-2">
                          <CategoryShape category={skill.category} size={16} />
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{
                              color: categoryConfig[skill.category]?.color || 'var(--color-grey-400)',
                              backgroundColor: `${categoryConfig[skill.category]?.color || 'var(--color-grey-400)'}20`,
                            }}
                          >
                            {skill.category}
                          </span>
                        </div>
                        <Link
                          href={`/skill/${skill.id}`}
                          className="text-lg font-semibold text-white hover:opacity-70 transition-opacity block mb-2"
                        >
                          {skill.name}
                        </Link>
                        <p className="text-xs" style={{ color: 'var(--color-grey-300)' }}>
                          {skill.description.slice(0, 100)}...
                        </p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t" style={{ borderColor: 'var(--glass-border)' }}>
                  <td className="p-4 text-sm font-medium" style={{ color: 'var(--color-grey-400)' }}>
                    Compatibility
                  </td>
                  {comparedSkills.map(skill => (
                    <td key={skill.id} className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {skill.compatibility?.map(assistantId => (
                          <AssistantBadge key={assistantId} assistantId={assistantId} size="sm" />
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr className="border-t" style={{ borderColor: 'var(--glass-border)' }}>
                  <td className="p-4 text-sm font-medium" style={{ color: 'var(--color-grey-400)' }}>
                    Version
                  </td>
                  {comparedSkills.map(skill => (
                    <td key={skill.id} className="p-4 text-sm text-white">
                      {skill.version}
                    </td>
                  ))}
                </tr>

                <tr className="border-t" style={{ borderColor: 'var(--glass-border)' }}>
                  <td className="p-4 text-sm font-medium" style={{ color: 'var(--color-grey-400)' }}>
                    Last Updated
                  </td>
                  {comparedSkills.map(skill => (
                    <td key={skill.id} className="p-4 text-sm text-white">
                      {new Date(skill.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  ))}
                </tr>

                <tr className="border-t" style={{ borderColor: 'var(--glass-border)' }}>
                  <td className="p-4 text-sm font-medium align-top" style={{ color: 'var(--color-grey-400)' }}>
                    Tags
                  </td>
                  {comparedSkills.map(skill => (
                    <td key={skill.id} className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {skill.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full"
                            style={{
                              color: 'var(--color-grey-300)',
                              backgroundColor: 'var(--glass-bg)',
                              border: '1px solid var(--glass-border)',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {allFeatures.length > 0 && (
                  <>
                    <tr className="border-t" style={{ borderColor: 'var(--glass-border)' }}>
                      <td colSpan={comparedSkills.length + 1} className="p-4">
                        <h3 className="text-sm font-semibold text-white">Features</h3>
                      </td>
                    </tr>
                    {allFeatures.map((feature, index) => (
                      <tr key={index} className="border-t" style={{ borderColor: 'var(--glass-border)' }}>
                        <td className="p-4 text-xs" style={{ color: 'var(--color-grey-400)' }}>
                          {feature}
                        </td>
                        {comparedSkills.map(skill => (
                          <td key={skill.id} className="p-4 text-center">
                            {skill.features?.includes(feature) ? (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-grey-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}

                {allUseCases.length > 0 && (
                  <>
                    <tr className="border-t" style={{ borderColor: 'var(--glass-border)' }}>
                      <td colSpan={comparedSkills.length + 1} className="p-4">
                        <h3 className="text-sm font-semibold text-white">Use Cases</h3>
                      </td>
                    </tr>
                    {allUseCases.map((useCase, index) => (
                      <tr key={index} className="border-t" style={{ borderColor: 'var(--glass-border)' }}>
                        <td className="p-4 text-xs" style={{ color: 'var(--color-grey-400)' }}>
                          {useCase}
                        </td>
                        {comparedSkills.map(skill => (
                          <td key={skill.id} className="p-4 text-center">
                            {skill.useCases?.includes(useCase) ? (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-grey-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}

                <tr className="border-t" style={{ borderColor: 'var(--glass-border)' }}>
                  <td className="p-4 text-sm font-medium align-top" style={{ color: 'var(--color-grey-400)' }}>
                    Install Command
                  </td>
                  {comparedSkills.map(skill => (
                    <td key={skill.id} className="p-4">
                                        <CommandBox
                                          name="Install"
                                          command={skill.skillFile
                                            ? `curl -fsSL ${skill.skillFile} -o ~/.claude/skills/${skill.id}.md`
                                            : `curl -fsSL https://skills.newth.ai/install.sh | bash -s -- ${skill.id}`
                                          }
                                          skillId={skill.id}
                                          primary={false}
                                        />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
