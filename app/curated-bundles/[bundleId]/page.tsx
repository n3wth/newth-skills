import type { Metadata } from 'next'
import { bundles } from '@/src/data/bundles'
import { BundleDetailClient } from './BundleDetailClient'

type Props = {
  params: Promise<{ bundleId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bundleId } = await params
  const bundle = bundles.find(b => b.id === bundleId)

  if (!bundle) {
    return {
      title: 'Bundle Not Found',
      description: 'The bundle you are looking for does not exist.',
    }
  }

  return {
    title: `${bundle.name} - Skill Bundle`,
    description: bundle.description,
    alternates: { canonical: `/curated-bundles/${bundleId}` },
    keywords: bundle.tags,
  }
}

export async function generateStaticParams() {
  return bundles.map((bundle) => ({ bundleId: bundle.id }))
}

export default async function BundleDetailPage({ params }: Props) {
  const { bundleId } = await params
  return <BundleDetailClient bundleId={bundleId} />
}
