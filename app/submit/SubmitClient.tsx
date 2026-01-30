'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Nav } from '@/src/components/Nav'
import { Footer } from '@/src/components/Footer'
import { categories } from '@/src/data/skills'
import { siteConfig } from '@/src/config/site'

type FormData = {
  name: string
  description: string
  longDescription: string
  category: string
  tags: string
  features: string
  useCases: string
  compatibility: string[]
  contributorName: string
  contributorGithub: string
}

type FormErrors = {
  name?: string
  description?: string
  category?: string
  contributorName?: string
}

type SubmitStatus = 'idle' | 'success' | 'error'

export function SubmitClient() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    longDescription: '',
    category: '',
    tags: '',
    features: '',
    useCases: '',
    compatibility: ['gemini', 'claude'],
    contributorName: '',
    contributorGithub: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')

  const categoryOptions = categories.filter(c => c.id !== 'all')

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Skill name is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }

    if (!formData.contributorName.trim()) {
      newErrors.contributorName = 'Your name is required for attribution'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const issueTitle = encodeURIComponent(`[Skill Submission] ${formData.name}`)
      const issueBody = encodeURIComponent(
        `## Skill Submission\n\n` +
        `### Basic Information\n` +
        `**Name:** ${formData.name}\n` +
        `**Category:** ${formData.category}\n` +
        `**Compatibility:** ${formData.compatibility.join(', ')}\n\n` +
        `### Description\n${formData.description}\n\n` +
        (formData.longDescription ? `### Long Description\n${formData.longDescription}\n\n` : '') +
        (formData.tags ? `### Tags\n${formData.tags}\n\n` : '') +
        (formData.features ? `### Features\n${formData.features}\n\n` : '') +
        (formData.useCases ? `### Use Cases\n${formData.useCases}\n\n` : '') +
        `### Contributor\n` +
        `**Name:** ${formData.contributorName}\n` +
        (formData.contributorGithub ? `**GitHub:** @${formData.contributorGithub}\n` : '') +
        `\n---\n*Submitted via skills.newth.ai marketplace*`
      )

      const githubUrl = `${siteConfig.links.github}/issues/new?title=${issueTitle}&body=${issueBody}&labels=skill-submission`

      window.open(githubUrl, '_blank', 'noopener,noreferrer')
      setSubmitStatus('success')

      setFormData({
        name: '',
        description: '',
        longDescription: '',
        category: '',
        tags: '',
        features: '',
        useCases: '',
        compatibility: ['gemini', 'claude'],
        contributorName: '',
        contributorGithub: '',
      })
    } catch {
      setSubmitStatus('error')
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }

    if (submitStatus !== 'idle') {
      setSubmitStatus('idle')
    }
  }

  const handleCompatibilityChange = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      compatibility: prev.compatibility.includes(platform)
        ? prev.compatibility.filter(p => p !== platform)
        : [...prev.compatibility, platform]
    }))
  }

  return (
    <div className="min-h-screen relative content-loaded">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      <Nav />

      <main className="px-6 md:px-12 pt-28 md:pt-32 pb-24">
        <div className="max-w-2xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-8 text-sm hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-grey-400)' }}
          >
            <span>&larr;</span> Back to skills
          </Link>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-4 tracking-tight">
            Submit a Skill
          </h1>
          <p
            className="text-lg mb-6"
            style={{ color: 'var(--color-grey-200)' }}
          >
            Contribute a skill to the marketplace. Your submission will be reviewed and, if approved, added to the catalog with full attribution.
          </p>
          <p
            className="text-sm mb-12"
            style={{ color: 'var(--color-grey-400)' }}
          >
            New to contributing? Check out our{' '}
            <Link href="/contribute" className="text-white hover:opacity-70 transition-opacity underline">
              contribution guide
            </Link>{' '}
            for templates and guidelines.
          </p>

          {submitStatus === 'success' && (
            <div
              className="glass-card p-6 mb-8"
              style={{ borderColor: 'var(--color-sage)' }}
            >
              <p
                className="text-base font-medium mb-2"
                style={{ color: 'var(--color-sage)' }}
              >
                Request submitted!
              </p>
              <p
                className="text-sm"
                style={{ color: 'var(--color-grey-300)' }}
              >
                A GitHub issue has been opened with your skill request. Thank you for contributing!
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div
              className="glass-card p-6 mb-8"
              style={{ borderColor: 'var(--color-coral)' }}
            >
              <p
                className="text-base font-medium mb-2"
                style={{ color: 'var(--color-coral)' }}
              >
                Something went wrong
              </p>
              <p
                className="text-sm"
                style={{ color: 'var(--color-grey-300)' }}
              >
                Please try again or submit directly on{' '}
                <a
                  href={`${siteConfig.links.github}/issues/new`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-hover"
                  style={{ color: 'var(--color-white)' }}
                >
                  GitHub
                </a>
                .
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Skill Name <span style={{ color: 'var(--color-coral)' }}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., React Testing"
                className="w-full px-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none"
                style={{
                  background: 'var(--glass-bg)',
                  border: `1px solid ${errors.name ? 'var(--color-coral)' : 'var(--glass-border)'}`,
                  color: 'var(--color-white)',
                }}
              />
              {errors.name && (
                <p
                  className="mt-2 text-sm"
                  style={{ color: 'var(--color-coral)' }}
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Category <span style={{ color: 'var(--color-coral)' }}>*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none appearance-none cursor-pointer"
                style={{
                  background: 'var(--glass-bg)',
                  border: `1px solid ${errors.category ? 'var(--color-coral)' : 'var(--glass-border)'}`,
                  color: formData.category ? 'var(--color-white)' : 'var(--color-grey-400)',
                }}
              >
                <option value="">Select a category</option>
                {categoryOptions.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p
                  className="mt-2 text-sm"
                  style={{ color: 'var(--color-coral)' }}
                >
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Description <span style={{ color: 'var(--color-coral)' }}>*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what this skill should do and how it would help users..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none resize-none"
                style={{
                  background: 'var(--glass-bg)',
                  border: `1px solid ${errors.description ? 'var(--color-coral)' : 'var(--glass-border)'}`,
                  color: 'var(--color-white)',
                }}
              />
              {errors.description && (
                <p
                  className="mt-2 text-sm"
                  style={{ color: 'var(--color-coral)' }}
                >
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Tags{' '}
                <span
                  className="font-normal"
                  style={{ color: 'var(--color-grey-400)' }}
                >
                  (optional)
                </span>
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., testing, react, jest, automation"
                className="w-full px-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none"
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--color-white)',
                }}
              />
              <p
                className="mt-2 text-sm"
                style={{ color: 'var(--color-grey-400)' }}
              >
                Comma-separated keywords to help categorize the skill
              </p>
            </div>

            <div>
              <label
                htmlFor="longDescription"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Long Description{' '}
                <span
                  className="font-normal"
                  style={{ color: 'var(--color-grey-400)' }}
                >
                  (optional)
                </span>
              </label>
              <textarea
                id="longDescription"
                name="longDescription"
                value={formData.longDescription}
                onChange={handleChange}
                placeholder="A more detailed description explaining the skill's capabilities..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none resize-none"
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--color-white)',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="features"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Features{' '}
                <span
                  className="font-normal"
                  style={{ color: 'var(--color-grey-400)' }}
                >
                  (optional)
                </span>
              </label>
              <textarea
                id="features"
                name="features"
                value={formData.features}
                onChange={handleChange}
                placeholder="List key features, one per line..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none resize-none"
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--color-white)',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="useCases"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Use Cases{' '}
                <span
                  className="font-normal"
                  style={{ color: 'var(--color-grey-400)' }}
                >
                  (optional)
                </span>
              </label>
              <textarea
                id="useCases"
                name="useCases"
                value={formData.useCases}
                onChange={handleChange}
                placeholder="Describe specific scenarios where this skill would be useful..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none resize-none"
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--color-white)',
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-3"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Compatibility{' '}
                <span
                  className="font-normal"
                  style={{ color: 'var(--color-grey-400)' }}
                >
                  (select all that apply)
                </span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.compatibility.includes('gemini')}
                    onChange={() => handleCompatibilityChange('gemini')}
                    className="w-4 h-4 rounded"
                  />
                  <span style={{ color: 'var(--color-grey-200)' }}>Gemini CLI</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.compatibility.includes('claude')}
                    onChange={() => handleCompatibilityChange('claude')}
                    className="w-4 h-4 rounded"
                  />
                  <span style={{ color: 'var(--color-grey-200)' }}>Claude Code</span>
                </label>
              </div>
            </div>

            <div
              className="glass-card p-6"
              style={{ borderColor: 'var(--glass-border)' }}
            >
              <h3 className="text-base font-medium text-white mb-4">Contributor Information</h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="contributorName"
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--color-grey-200)' }}
                  >
                    Your Name <span style={{ color: 'var(--color-coral)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="contributorName"
                    name="contributorName"
                    value={formData.contributorName}
                    onChange={handleChange}
                    placeholder="Your display name for attribution"
                    className="w-full px-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none"
                    style={{
                      background: 'var(--glass-bg)',
                      border: `1px solid ${errors.contributorName ? 'var(--color-coral)' : 'var(--glass-border)'}`,
                      color: 'var(--color-white)',
                    }}
                  />
                  {errors.contributorName && (
                    <p
                      className="mt-2 text-sm"
                      style={{ color: 'var(--color-coral)' }}
                    >
                      {errors.contributorName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="contributorGithub"
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--color-grey-200)' }}
                  >
                    GitHub Username{' '}
                    <span
                      className="font-normal"
                      style={{ color: 'var(--color-grey-400)' }}
                    >
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    id="contributorGithub"
                    name="contributorGithub"
                    value={formData.contributorGithub}
                    onChange={handleChange}
                    placeholder="your-github-username"
                    className="w-full px-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none"
                    style={{
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--color-white)',
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 rounded-full text-base font-medium transition-all duration-200 hover:opacity-90"
                style={{
                  background: 'var(--color-white)',
                  color: 'var(--color-bg)',
                }}
              >
                Submit Skill
              </button>
              <p
                className="mt-4 text-sm"
                style={{ color: 'var(--color-grey-400)' }}
              >
                This will open a GitHub issue with your skill submission for review.
              </p>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
