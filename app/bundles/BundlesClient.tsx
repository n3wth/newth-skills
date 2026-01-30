'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { skills, type Skill } from '@/src/data/skills'
import { Nav } from '@/src/components/Nav'
import { Footer } from '@/src/components/Footer'
import { SkillCard } from '@/src/components/SkillCard'
import { CommandBox } from '@/src/components/CommandBox'
import {
  getAllBundles,
  createBundle,
  deleteBundle,
  parseBundleFromUrl,
  getBundleShareUrl,
  type SkillBundle
} from '@/src/lib/community'

export function BundlesClient() {
  const searchParams = useSearchParams()
  const [bundles, setBundles] = useState<SkillBundle[]>([])
  const [selectedBundle, setSelectedBundle] = useState<SkillBundle | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newBundleName, setNewBundleName] = useState('')
  const [newBundleDesc, setNewBundleDesc] = useState('')
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [sharedBundle, setSharedBundle] = useState<{ name: string; skillIds: string[] } | null>(null)
  const [_isHydrated, setIsHydrated] = useState(false)

  // Initialize client-side state after hydration
  useEffect(() => {
    setBundles(getAllBundles())
    if (searchParams) {
      setSharedBundle(parseBundleFromUrl(searchParams as unknown as URLSearchParams))
    }
    setIsHydrated(true)
  }, [searchParams])

  const handleCreateBundle = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!newBundleName.trim()) return

    const bundle = createBundle(newBundleName.trim(), newBundleDesc.trim(), [])
    setBundles(getAllBundles())
    setSelectedBundle(bundle)
    setNewBundleName('')
    setNewBundleDesc('')
    setShowCreateForm(false)
  }, [newBundleName, newBundleDesc])

  const handleDeleteBundle = useCallback((bundleId: string) => {
    if (confirm('Are you sure you want to delete this bundle?')) {
      deleteBundle(bundleId)
      setBundles(getAllBundles())
      if (selectedBundle?.id === bundleId) {
        setSelectedBundle(null)
      }
    }
  }, [selectedBundle])

  const handleCopyShareUrl = useCallback(async (bundleId: string) => {
    const url = getBundleShareUrl(bundleId)
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(bundleId)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch {
      // Fallback
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiedUrl(bundleId)
      setTimeout(() => setCopiedUrl(null), 2000)
    }
  }, [])

  const handleSaveSharedBundle = useCallback(() => {
    if (!sharedBundle) return
    const bundle = createBundle(sharedBundle.name, 'Imported bundle', sharedBundle.skillIds)
    setBundles(getAllBundles())
    setSelectedBundle(bundle)
    setSharedBundle(null)
  }, [sharedBundle])

  const selectedBundleSkills = useMemo(() => {
    if (!selectedBundle) return []
    return selectedBundle.skillIds
      .map(id => skills.find(s => s.id === id))
      .filter((s): s is Skill => s !== undefined)
  }, [selectedBundle])

  const sharedBundleSkills = useMemo(() => {
    if (!sharedBundle) return []
    return sharedBundle.skillIds
      .map(id => skills.find(s => s.id === id))
      .filter((s): s is Skill => s !== undefined)
  }, [sharedBundle])

  const installAllCommand = useMemo(() => {
    if (!selectedBundle || selectedBundleSkills.length === 0) return ''
    return selectedBundleSkills
      .map(skill => skill.skillFile
        ? `curl -fsSL ${skill.skillFile} -o ~/.claude/skills/${skill.id}.md`
        : `curl -fsSL https://skills.newth.ai/install.sh | bash -s -- ${skill.id}`
      )
      .join(' && ')
  }, [selectedBundle, selectedBundleSkills])

  return (
    <div className="min-h-screen relative content-loaded">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      <Nav />

      <main className="px-6 md:px-12 pt-28 md:pt-32 pb-24">
        <div className="max-w-6xl mx-auto">
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
                Skill Bundles
              </h1>
              <p className="mt-2" style={{ color: 'var(--color-grey-300)' }}>
                Create collections of skills and share them with others
              </p>
            </div>
          </div>

          {sharedBundle && (
            <div
              className="glass-card p-6 mb-8"
              style={{ border: '1px solid rgba(34, 197, 94, 0.4)' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">
                    Shared Bundle: {sharedBundle.name}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--color-grey-400)' }}>
                    {sharedBundleSkills.length} skill{sharedBundleSkills.length !== 1 ? 's' : ''} in this bundle
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSharedBundle(null)}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-70"
                    style={{ color: 'var(--color-grey-400)', border: '1px solid var(--glass-border)' }}
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={handleSaveSharedBundle}
                    className="px-4 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#22c55e' }}
                  >
                    Save to My Bundles
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sharedBundleSkills.map(skill => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="glass-card p-4 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">My Bundles</h2>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="p-2 rounded-full transition-colors hover:bg-white/10"
                    style={{ color: 'var(--color-grey-300)' }}
                    aria-label="Create new bundle"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>

                {showCreateForm && (
                  <form onSubmit={handleCreateBundle} className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--glass-bg)' }}>
                    <label htmlFor="bundle-name" className="sr-only">Bundle name</label>
                    <input
                      id="bundle-name"
                      type="text"
                      value={newBundleName}
                      onChange={(e) => setNewBundleName(e.target.value)}
                      placeholder="Bundle name"
                      className="w-full px-3 py-2 rounded-md text-sm mb-2 bg-white/5 border text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                      style={{ borderColor: 'var(--glass-border)' }}
                      autoFocus
                    />
                    <label htmlFor="bundle-desc" className="sr-only">Bundle description</label>
                    <textarea
                      id="bundle-desc"
                      value={newBundleDesc}
                      onChange={(e) => setNewBundleDesc(e.target.value)}
                      placeholder="Description (optional)"
                      rows={2}
                      className="w-full px-3 py-2 rounded-md text-sm mb-3 bg-white/5 border text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20 resize-none"
                      style={{ borderColor: 'var(--glass-border)' }}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors hover:bg-white/10"
                        style={{ color: 'var(--color-grey-400)' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!newBundleName.trim()}
                        className="flex-1 px-3 py-1.5 rounded-md text-xs font-medium text-white transition-colors disabled:opacity-50"
                        style={{ backgroundColor: '#22c55e' }}
                      >
                        Create
                      </button>
                    </div>
                  </form>
                )}

                {bundles.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm mb-2" style={{ color: 'var(--color-grey-400)' }}>
                      No bundles yet
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-grey-500)' }}>
                      Create a bundle to collect your favorite skills
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {bundles.map(bundle => (
                      <button
                        key={bundle.id}
                        onClick={() => setSelectedBundle(bundle)}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                          selectedBundle?.id === bundle.id ? 'bg-white/10' : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{bundle.name}</p>
                            <p className="text-xs" style={{ color: 'var(--color-grey-400)' }}>
                              {bundle.skillIds.length} skill{bundle.skillIds.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCopyShareUrl(bundle.id)
                              }}
                              className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                              style={{ color: copiedUrl === bundle.id ? '#22c55e' : 'var(--color-grey-400)' }}
                              title="Copy share link"
                            >
                              {copiedUrl === bundle.id ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              ) : (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteBundle(bundle.id)
                              }}
                              className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                              style={{ color: 'var(--color-grey-400)' }}
                              title="Delete bundle"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              {selectedBundle ? (
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-white mb-1">{selectedBundle.name}</h2>
                      {selectedBundle.description && (
                        <p className="text-sm" style={{ color: 'var(--color-grey-400)' }}>
                          {selectedBundle.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {selectedBundleSkills.length > 0 && (
                    <div className="glass-card p-4 mb-6">
                      <h3 className="text-sm font-medium text-white mb-2">Install All Skills</h3>
                      <CommandBox
                        name="Install Bundle"
                        command={installAllCommand}
                        primary={true}
                      />
                    </div>
                  )}

                  {selectedBundleSkills.length === 0 ? (
                    <div className="text-center py-16 glass-card">
                      <p className="text-lg text-white mb-2">No skills in this bundle</p>
                      <p className="text-sm mb-4" style={{ color: 'var(--color-grey-400)' }}>
                        Browse skills and add them to this bundle
                      </p>
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#22c55e' }}
                      >
                        Browse Skills
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {selectedBundleSkills.map(skill => (
                        <SkillCard key={skill.id} skill={skill} />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 glass-card">
                  <p className="text-lg text-white mb-2">Select a bundle</p>
                  <p className="text-sm" style={{ color: 'var(--color-grey-400)' }}>
                    Choose a bundle from the sidebar or create a new one
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
