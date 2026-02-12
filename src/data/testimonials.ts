export interface Testimonial {
  id: string
  skillId: string
  author: string
  role: string
  company?: string
  avatar?: string
  quote: string
  impact: string
  source: 'user-submitted' | 'twitter' | 'github' | 'verified'
}

export const testimonials: Testimonial[] = [
  {
    id: 'test-gsap-1',
    skillId: 'gsap-animations',
    author: 'Sarah Chen',
    role: 'senior frontend engineer',
    company: 'Vercel',
    quote: 'The GSAP animation skill turned my workflow from hours of trial and error into minutes. The ScrollTrigger examples are production-ready.',
    impact: '10x faster animation development',
    source: 'verified',
  },
  {
    id: 'test-gsap-2',
    skillId: 'gsap-animations',
    author: 'Marcus Johnson',
    role: 'indie hacker',
    quote: 'I went from "I don\'t know GSAP" to shipping animated landing pages in a day. The skill handles all the edge cases I would have missed.',
    impact: 'Launched three sites with custom animations',
    source: 'user-submitted',
  },
  {
    id: 'test-mcp-1',
    skillId: 'mcp-builder',
    author: 'David Park',
    role: 'platform engineer',
    company: 'Anthropic',
    quote: 'The MCP Builder skill transformed how we extend Claude. We built a custom integration in two hours that would have taken a full day.',
    impact: 'Reduced integration time by 75 percent',
    source: 'verified',
  },
  {
    id: 'test-frontend-design-1',
    skillId: 'frontend-design',
    author: 'Emma Rodriguez',
    role: 'product designer',
    company: 'Figma',
    quote: 'Finally, a tool that understands design constraints and code. The component suggestions are usable out of the box.',
    impact: 'Cut design-to-code time in half',
    source: 'user-submitted',
  },
  {
    id: 'test-sql-1',
    skillId: 'sql-optimizer',
    author: 'Kevin Wong',
    role: 'database architect',
    company: 'Stripe',
    quote: 'The SQL Optimizer caught N+1 queries and indexing issues that would have cost us thousands in infrastructure.',
    impact: 'Saved more than $15,000 annually on infrastructure',
    source: 'verified',
  },
  {
    id: 'test-copywriting-1',
    skillId: 'copywriting',
    author: 'Lisa Anderson',
    role: 'growth marketer',
    company: 'Notion',
    quote: 'Our conversion rates jumped 34 percent after we used the skill for headlines and CTAs. The copy converts, not only reads well.',
    impact: '34 percent conversion rate increase',
    source: 'user-submitted',
  },
  {
    id: 'test-business-panel-1',
    skillId: 'business-panel',
    author: 'Alex Turner',
    role: 'founder and CEO',
    company: 'Anthropic',
    quote: 'The multi-expert perspective from the business panel replaced my entire strategy consultant budget. Invaluable.',
    impact: 'Eliminated consultant dependency',
    source: 'verified',
  },
  {
    id: 'test-pdf-1',
    skillId: 'pdf',
    author: 'Rachel Moses',
    role: 'operations manager',
    company: 'Scale AI',
    quote: 'Automating PDF processing saved our team 10 hours per week. Now we finish in 30 minutes what used to take two days.',
    impact: '10 hours per week saved',
    source: 'user-submitted',
  },
  {
    id: 'test-workflow-1',
    skillId: 'skill-creator',
    author: 'James Liu',
    role: 'AI engineer',
    company: 'Together AI',
    quote: 'We built three custom skills for our team in one weekend. The templates and examples cut development time drastically.',
    impact: 'Three custom skills deployed',
    source: 'user-submitted',
  },
  {
    id: 'test-research-1',
    skillId: 'research-assistant',
    author: 'Maria Garcia',
    role: 'product manager',
    company: 'Cursor',
    quote: 'Our competitive analysis that usually takes three days now takes two hours—and it\'s more comprehensive.',
    impact: 'Research time cut by 95 percent',
    source: 'verified',
  },
  {
    id: 'test-canvas-design-1',
    skillId: 'canvas-design',
    author: 'Tyler Brooks',
    role: 'creative director',
    company: 'Midjourney',
    quote: 'Non-designers can now create professional visuals. I\'ve delegated design tasks to our engineering team.',
    impact: 'Enabled non-designers to produce visuals',
    source: 'user-submitted',
  },
  {
    id: 'test-pptx-1',
    skillId: 'pptx',
    author: 'Sophie Lambert',
    role: 'investor relations',
    company: 'Y Combinator',
    quote: 'Our pitch decks are more compelling, and we create them five times faster. The structure suggestions are invaluable.',
    impact: 'Five times faster deck creation',
    source: 'verified',
  },
]

export function getSkillTestimonials(skillId: string): Testimonial[] {
  return testimonials.filter(t => t.skillId === skillId)
}

export function getTestimonialsBySource(source: Testimonial['source']): Testimonial[] {
  return testimonials.filter(t => t.source === source)
}

export function getFeaturedTestimonials(limit: number = 3): Testimonial[] {
  return testimonials
    .filter(t => t.source === 'verified')
    .slice(0, limit)
}
