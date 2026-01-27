interface SEOProps {
  title?: string
  description?: string
  canonicalUrl?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  keywords?: string[]
}

const BASE_URL = 'https://skills.newth.ai'
const DEFAULT_TITLE = 'newth.ai skills - Extend Your AI Coding Assistant'
const DEFAULT_DESCRIPTION = 'Skills for Gemini CLI, Claude Code, and more. Extend your AI coding assistant with specialized capabilities. Install with one command.'
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`

export function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonicalUrl = BASE_URL,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  keywords = [],
}: SEOProps) {
  const fullCanonicalUrl = canonicalUrl.startsWith('http') ? canonicalUrl : `${BASE_URL}${canonicalUrl}`
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonicalUrl} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="newth.ai skills" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:image:alt" content={title} />
    </>
  )
}
