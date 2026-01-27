import { getSkillTestimonials } from '../data/testimonials'

interface SkillTestimonialsProps {
  skillId: string
  limit?: number
}

export function SkillTestimonials({ skillId, limit = 3 }: SkillTestimonialsProps) {
  const testimonials = getSkillTestimonials(skillId).slice(0, limit)

  if (testimonials.length === 0) return null

  return (
    <section className="py-12 border-t border-[var(--glass-border)]">
      <h3 className="text-xl font-semibold text-[var(--color-white)] mb-8">
        What users are saying
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="p-6 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-opacity-75 transition-colors"
          >
            <div className="mb-4">
              <p className="text-sm text-[var(--color-grey-400)] italic mb-4">
                "{testimonial.quote}"
              </p>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-[var(--color-white)] text-sm">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-[var(--color-grey-600)]">
                    {testimonial.role}
                    {testimonial.company && ` at ${testimonial.company}`}
                  </p>
                </div>
                {testimonial.source === 'verified' && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500 bg-opacity-15 text-green-400 font-medium">
                    Verified
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--glass-border)] border-opacity-50">
              <p className="text-xs text-[var(--color-sage)] font-semibold">
                Impact: {testimonial.impact}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
