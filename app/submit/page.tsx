import type { Metadata } from 'next'
import { SubmitClient } from './SubmitClient'

export const metadata: Metadata = {
  title: 'Submit a Skill',
  description: 'Submit your skill to the newth.ai skills marketplace. Contribute to the community and help others extend their AI assistants.',
  alternates: { canonical: '/submit' },
}

export default function SubmitPage() {
  return <SubmitClient />
}
