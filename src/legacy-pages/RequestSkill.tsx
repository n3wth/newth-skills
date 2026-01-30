import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { SEO } from '../components/SEO'
import { siteConfig } from '../config/site'

type FormData = {
  skillName: string
  description: string
  useCase: string
}

type FormErrors = {
  skillName?: string
  description?: string
}

type SubmitStatus = 'idle' | 'success' | 'error'

export function RequestSkill() {
  const [formData, setFormData] = useState<FormData>({
    skillName: '',
    description: '',
    useCase: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.skillName.trim()) {
      newErrors.skillName = 'Skill name is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
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
      const issueTitle = encodeURIComponent(`[Skill Request] ${formData.skillName}`)
      const issueBody = encodeURIComponent(
        `## Skill Request\n\n` +
        `**Requested Skill:** ${formData.skillName}\n\n` +
        `### Description\n${formData.description}\n\n` +
        (formData.useCase ? `### Use Case\n${formData.useCase}\n\n` : '') +
        `---\n*Submitted via skills.newth.ai marketplace*`
      )

      const githubUrl = `${siteConfig.links.github}/issues/new?title=${issueTitle}&body=${issueBody}&labels=skill-request`

      const newWindow = window.open(githubUrl, '_blank', 'noopener,noreferrer')
      
      if (newWindow) {
        setSubmitStatus('success')
        setFormData({
          skillName: '',
          description: '',
          useCase: '',
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Failed to submit skill request:', error)
      setSubmitStatus('error')
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      <SEO
        title="Request a Skill - newth.ai skills"
        description="Request a new skill for the newth.ai skills marketplace. Let us know what you'd like to see."
        canonicalUrl="/request-skill"
      />
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
            Request a Skill
          </h1>
          <p
            className="text-lg mb-12"
            style={{ color: 'var(--color-grey-200)' }}
          >
            Have an idea for a skill you'd like to see? Let us know what you need and we'll consider adding it to the marketplace.
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
                A GitHub issue has been opened with your skill request. Thank you for your feedback!
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
                htmlFor="skillName"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Skill Name <span style={{ color: 'var(--color-coral)' }}>*</span>
              </label>
              <input
                type="text"
                id="skillName"
                name="skillName"
                value={formData.skillName}
                onChange={handleChange}
                placeholder="e.g., Image Compression"
                className="w-full px-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none"
                style={{
                  background: 'var(--glass-bg)',
                  border: `1px solid ${errors.skillName ? 'var(--color-coral)' : 'var(--glass-border)'}`,
                  color: 'var(--color-white)',
                }}
              />
              {errors.skillName && (
                <p
                  className="mt-2 text-sm"
                  style={{ color: 'var(--color-coral)' }}
                >
                  {errors.skillName}
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
                placeholder="Describe what this skill should do and how it would help you..."
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
                htmlFor="useCase"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Use Case{' '}
                <span
                  className="font-normal"
                  style={{ color: 'var(--color-grey-400)' }}
                >
                  (optional)
                </span>
              </label>
              <textarea
                id="useCase"
                name="useCase"
                value={formData.useCase}
                onChange={handleChange}
                placeholder="Describe a specific scenario where you'd use this skill..."
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
