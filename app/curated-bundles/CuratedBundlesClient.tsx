'use client'

import { useState, useMemo } from 'react'
import { Nav, Footer } from '@/src/components'
import { BundleCard } from '@/src/components/BundleCard'
import { bundles } from '@/src/data/bundles'
import type { Bundle } from '@/src/data/bundles'

type PersonaFilter = 'all' | Bundle['persona']

const personas: { value: PersonaFilter; label: string }[] = [
  { value: 'all', label: 'All Bundles' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'devops', label: 'DevOps' },
  { value: 'creator', label: 'Creator' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'founder', label: 'Founder' },
]

export function CuratedBundlesClient() {
  const [activePersona, setActivePersona] = useState<PersonaFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBundles = useMemo(() => {
    return bundles.filter(bundle => {
      const matchesPersona = activePersona === 'all' || bundle.persona === activePersona
      const matchesSearch =
        searchQuery === '' ||
        bundle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bundle.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bundle.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesPersona && matchesSearch
    })
  }, [activePersona, searchQuery])

  return (
    <div className="min-h-screen relative content-loaded">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />

      <Nav />

      <main className="px-6 md:px-12 pt-28 md:pt-32 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-semibold text-[var(--color-white)] mb-4">
              Skill Bundles for Every Role
            </h1>
            <p className="text-lg text-[var(--color-grey-400)] max-w-2xl mx-auto">
              Pre-curated collections of complementary skills. Everything you need to level up your workflow, organized by profession.
            </p>
          </div>

          {/* Filter Section */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
              <div className="w-full sm:w-auto">
                <label htmlFor="bundle-search" className="sr-only">Search bundles</label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-grey-600)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    id="bundle-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search bundles..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-sm text-[var(--color-white)] placeholder:text-[var(--color-grey-600)] focus:outline-none focus:border-[var(--glass-highlight)]"
                  />
                </div>
              </div>
            </div>

            {/* Persona Filter */}
            <div className="flex flex-wrap gap-2">
              {personas.map((persona) => (
                <button
                  key={persona.value}
                  onClick={() => setActivePersona(persona.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activePersona === persona.value
                      ? 'bg-[var(--color-white)] text-[var(--color-bg)]'
                      : 'bg-[var(--glass-bg)] text-[var(--color-grey-400)] border border-[var(--glass-border)] hover:border-[var(--glass-highlight)]'
                  }`}
                >
                  {persona.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bundles Grid */}
          {filteredBundles.length > 0 ? (
            <>
              <p className="text-sm text-[var(--color-grey-400)] mb-6">
                {filteredBundles.length} bundle{filteredBundles.length !== 1 ? 's' : ''} available
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBundles.map((bundle, index) => (
                  <BundleCard key={bundle.id} bundle={bundle} index={index} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <svg
                className="w-16 h-16 mx-auto mb-4 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-lg font-medium text-[var(--color-grey-300)] mb-2">
                No bundles found
              </h3>
              <p className="text-sm text-[var(--color-grey-600)]">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-20 pt-12 border-t border-[var(--glass-border)]">
            <h2 className="text-2xl font-semibold text-[var(--color-white)] mb-8">
              How Bundles Work
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                <svg className="w-8 h-8 mb-3" viewBox="0 0 32 32">
                  <rect x="2" y="2" width="28" height="28" fill="#ff6961" opacity={0.8} />
                </svg>
                <h3 className="text-lg font-medium text-[var(--color-white)] mb-2">Pre-Curated</h3>
                <p className="text-sm text-[var(--color-grey-400)]">
                  Each bundle is carefully selected to complement each other and solve real problems for your role.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                <svg className="w-8 h-8 mb-3" viewBox="0 0 32 32">
                  <circle cx="16" cy="16" r="14" fill="#30d158" opacity={0.8} />
                </svg>
                <h3 className="text-lg font-medium text-[var(--color-white)] mb-2">One Command</h3>
                <p className="text-sm text-[var(--color-grey-400)]">
                  Install an entire bundle with a single command. No manual selection needed.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                <svg className="w-8 h-8 mb-3" viewBox="0 0 32 32">
                  <polygon points="16,2 30,30 2,30" fill="#64d2ff" opacity={0.8} />
                </svg>
                <h3 className="text-lg font-medium text-[var(--color-white)] mb-2">Proven Workflows</h3>
                <p className="text-sm text-[var(--color-grey-400)]">
                  Based on how professionals use these skills together in real projects.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
