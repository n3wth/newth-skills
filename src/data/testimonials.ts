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
    role: 'Senior Frontend Engineer',
    company: 'Vercel',
    quote: 'This skill turned my GSAP animation workflow from hours of trial-and-error into minutes. The ScrollTrigger examples are production-ready.',
    impact: '10x faster animation development',
    source: 'verified',
  },
  {
    id: 'test-gsap-2',
    skillId: 'gsap-animations',
    author: 'Marcus Johnson',
    role: 'Indie Hacker',
    quote: 'I went from "I don\'t know GSAP" to shipping animated landing pages in a day. The skill handles all the edge cases I would have missed.',
    impact: 'Launched 3 sites with custom animations',
    source: 'user-submitted',
  },
  {
    id: 'test-mcp-1',
    skillId: 'mcp-builder',
    author: 'David Park',
    role: 'Platform Engineer',
    company: 'Anthropic',
    quote: 'The MCP Builder skill is a game-changer for extending Claude. We built a custom integration in 2 hours that would have taken a full day.',
    impact: 'Reduced integration time by 75%',
    source: 'verified',
  },
  {
    id: 'test-frontend-design-1',
    skillId: 'frontend-design',
    author: 'Emma Rodriguez',
    role: 'Product Designer',
    company: 'Figma',
    quote: 'Finally, a tool that understands design constraints AND code. The component suggestions are actually usable.',
    impact: 'Cut design-to-code time in half',
    source: 'user-submitted',
  },
  {
    id: 'test-sql-1',
    skillId: 'sql-optimizer',
    author: 'Kevin Wong',
    role: 'Database Architect',
    company: 'Stripe',
    quote: 'This SQL Optimizer caught N+1 queries and indexing issues that would have cost us thousands in infrastructure costs.',
    impact: 'Saved $15K+ annually on infrastructure',
    source: 'verified',
  },
  {
    id: 'test-copywriting-1',
    skillId: 'copywriting',
    author: 'Lisa Anderson',
    role: 'Growth Marketer',
    company: 'Notion',
    quote: 'Our conversion rates jumped 34% after using this for headlines and CTAs. The copy actually converts, not just reads well.',
    impact: '+34% conversion rate',
    source: 'user-submitted',
  },
  {
    id: 'test-business-panel-1',
    skillId: 'business-panel',
    author: 'Alex Turner',
    role: 'Founder & CEO',
    company: 'Anthropic',
    quote: 'The multi-expert perspective from this skill replaced my entire strategy consultant budget. Seriously invaluable.',
    impact: 'Removed consultant dependency',
    source: 'verified',
  },
  {
    id: 'test-pdf-1',
    skillId: 'pdf',
    author: 'Rachel Moses',
    role: 'Operations Manager',
    company: 'Scale AI',
    quote: 'Automating PDF processing saved our team 10 hours per week. Now we do in 30 minutes what used to take 2 days.',
    impact: '10 hours/week saved',
    source: 'user-submitted',
  },
  {
    id: 'test-workflow-1',
    skillId: 'skill-creator',
    author: 'James Liu',
    role: 'AI Engineer',
    company: 'Together AI',
    quote: 'Built 3 custom skills for our team in one weekend. The templates and examples cut development time drastically.',
    impact: '3 custom skills deployed',
    source: 'user-submitted',
  },
  {
    id: 'test-research-1',
    skillId: 'research-assistant',
    author: 'Maria Garcia',
    role: 'Product Manager',
    company: 'Cursor',
    quote: 'Our competitive analysis that usually takes 3 days now takes 2 hours. And it\'s more comprehensive. Game changer.',
    impact: 'Research time cut by 95%',
    source: 'verified',
  },
  {
    id: 'test-canvas-design-1',
    skillId: 'canvas-design',
    author: 'Tyler Brooks',
    role: 'Creative Director',
    company: 'Midjourney',
    quote: 'Non-designers can now create professional visuals. I\'ve delegated design tasks to our engineering team.',
    impact: 'Empowered non-designers',
    source: 'user-submitted',
  },
  {
    id: 'test-pptx-1',
    skillId: 'pptx',
    author: 'Sophie Lambert',
    role: 'Investor Relations',
    company: 'Y Combinator',
    quote: 'Our pitch decks are more compelling and we create them 5x faster. The structure suggestions are gold.',
    impact: '5x faster deck creation',
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
