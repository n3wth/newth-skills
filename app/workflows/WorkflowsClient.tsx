'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Nav, Footer } from '@/src/components'
import { WorkflowCard } from '@/src/components/WorkflowCard'
import { workflowTemplates, type Workflow } from '@/src/data/workflows'

const STORAGE_KEY = 'newth-skills-workflows'

function getStoredWorkflows(): Workflow[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function WorkflowsClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'templates' | 'my-workflows'>('templates')

  const storedWorkflows = getStoredWorkflows()

  const displayedWorkflows = useMemo(() => {
    const workflows = activeTab === 'templates' ? workflowTemplates : storedWorkflows

    if (!searchQuery) return workflows

    const query = searchQuery.toLowerCase()
    return workflows.filter(w =>
      w.name.toLowerCase().includes(query) ||
      w.description.toLowerCase().includes(query) ||
      w.tags.some(t => t.toLowerCase().includes(query))
    )
  }, [activeTab, searchQuery, storedWorkflows])

  return (
    <div className="min-h-screen relative">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />

      <Nav />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-semibold text-[var(--color-white)] mb-4">
              Skill Workflows
            </h1>
            <p className="text-lg text-[var(--color-grey-400)] max-w-2xl mx-auto">
              Chain multiple skills together to create powerful automated workflows.
              Combine capabilities like research, writing, and document creation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 p-1 bg-[var(--glass-bg)] rounded-lg border border-[var(--glass-border)]">
              <button
                onClick={() => setActiveTab('templates')}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  activeTab === 'templates'
                    ? 'bg-[var(--color-white)] text-[var(--color-bg)]'
                    : 'text-[var(--color-grey-400)] hover:text-[var(--color-white)]'
                }`}
              >
                Templates
              </button>
              <button
                onClick={() => setActiveTab('my-workflows')}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  activeTab === 'my-workflows'
                    ? 'bg-[var(--color-white)] text-[var(--color-bg)]'
                    : 'text-[var(--color-grey-400)] hover:text-[var(--color-white)]'
                }`}
              >
                My Workflows
                {storedWorkflows.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-[10px] rounded-full bg-[var(--glass-bg)] text-[var(--color-grey-400)]">
                    {storedWorkflows.length}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <label htmlFor="workflow-search" className="sr-only">Search workflows</label>
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
                  id="workflow-search"
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search workflows..."
                  className="w-64 pl-10 pr-4 py-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-sm text-[var(--color-white)] placeholder:text-[var(--color-grey-600)] focus:outline-none focus:border-[var(--glass-highlight)]"
                />
              </div>

              <Link
                href="/workflows/new"
                className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-white)] text-[var(--color-bg)] rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Workflow
              </Link>
            </div>
          </div>

          {displayedWorkflows.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center">
                <svg className="w-8 h-8 text-[var(--color-grey-600)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[var(--color-grey-300)] mb-2">
                {activeTab === 'my-workflows' ? 'No workflows yet' : 'No workflows found'}
              </h3>
              <p className="text-sm text-[var(--color-grey-600)] mb-6">
                {activeTab === 'my-workflows'
                  ? 'Create your first workflow to chain skills together'
                  : 'Try a different search term'
                }
              </p>
              {activeTab === 'my-workflows' && (
                <Link
                  href="/workflows/new"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-white)] text-[var(--color-bg)] rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Workflow
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedWorkflows.map((workflow, index) => (
                <WorkflowCard key={workflow.id} workflow={workflow} index={index} />
              ))}
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl">
                <svg className="w-5 h-5 text-[var(--color-sage)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-[var(--color-grey-300)]">
                  Templates are pre-built workflows you can use as starting points.
                  <Link href="/workflows/new" className="text-[var(--color-white)] ml-1 hover:underline">
                    Create your own
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
