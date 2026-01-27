import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { categories } from '../data/skills'
import { siteConfig } from '../config/site'

type FormData = {
  name: string
  description: string
  category: string
  tags: string
  useCases: string
}

type FormErrors = {
  name?: string
  description?: string
  category?: string
}

type SubmitStatus = 'idle' | 'success' | 'error'

export function SubmitSkill() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category: '',
    tags: '',
    useCases: '',
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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const issueTitle = encodeURIComponent(`[Skill Request] ${formData.name}`)
      const issueBody = encodeURIComponent(
        `## Skill Request\n\n` +
        `**Name:** ${formData.name}\n\n` +
        `**Category:** ${formData.category}\n\n` +
        `**Description:**\n${formData.description}\n\n` +
        (formData.tags ? `**Tags:** ${formData.tags}\n\n` : '') +
        (formData.useCases ? `**Use Cases:**\n${formData.useCases}\n\n` : '') +
        `---\n*Submitted via skills.newth.ai*`
      )

      const githubUrl = `${siteConfig.links.github}/issues/new?title=${issueTitle}&body=${issueBody}&labels=skill-request`

      window.open(githubUrl, '_blank', 'noopener,noreferrer')
      setSubmitStatus('success')

      setFormData({
        name: '',
        description: '',
        category: '',
        tags: '',
        useCases: '',
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

  return (
    <div className="min-h-screen relative">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      <Nav />

      <main className="px-6 md:px-12 pt-28 md:pt-32 pb-24">
        <div className="max-w-2xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-8 text-sm hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-grey-400)' }}
          >
            <span>&larr;</span> Back to skills
          </Link>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-4 tracking-tight">
            Submit a Skill
          </h1>
          <p
            className="text-lg mb-12"
            style={{ color: 'var(--color-grey-200)' }}
          >
            Have an idea for a new skill? Submit your request and we'll consider adding it to the collection.
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

            <div className="pt-4">
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 rounded-full text-base font-medium transition-all duration-200 hover:opacity-90"
                style={{
                  background: 'var(--color-white)',
                  color: 'var(--color-bg)',
                }}
              >
                Submit Request
              </button>
              <p
                className="mt-4 text-sm"
                style={{ color: 'var(--color-grey-400)' }}
              >
                This will open a GitHub issue with your skill request.
              </p>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
