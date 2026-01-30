import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch about skills, report issues, or learn how to contribute.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact | newth.ai',
    description: 'Get in touch about skills, report issues, or learn how to contribute.',
    url: 'https://skills.newth.ai/contact',
    images: ['/og-image.png'],
  },
}

export default function ContactPage() {
  return <ContactClient />
}
