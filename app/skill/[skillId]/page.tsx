import type { Metadata } from 'next'
import { skills } from '@/src/data/skills'
import { SkillDetailClient } from './SkillDetailClient'

type Props = {
  params: Promise<{ skillId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { skillId } = await params
  const skill = skills.find(s => s.id === skillId)

  if (!skill) {
    return {
      title: 'Skill Not Found',
      description: 'The skill you are looking for does not exist.',
    }
  }

  return {
    title: `${skill.name} - AI Skill`,
    description: skill.longDescription || skill.description,
    alternates: { canonical: `/skill/${skillId}` },
    keywords: skill.tags,
  }
}

export async function generateStaticParams() {
  return skills.map((skill) => ({ skillId: skill.id }))
}

export default async function SkillDetailPage({ params }: Props) {
  const { skillId } = await params
  return <SkillDetailClient skillId={skillId} />
}
