/**
 * Platform compatibility badges for Gemini CLI and Claude Code
 * Uses official brand colors and icons
 */
import type { ReactNode } from 'react'

type Platform = 'gemini' | 'claude'

interface PlatformConfig {
  name: string
  color: string
  bgColor: string
  borderColor: string
  icon: ReactNode
}

const platformConfigs: Record<Platform, PlatformConfig> = {
  gemini: {
    name: 'Gemini CLI',
    color: '#4285F4', // Google Blue
    bgColor: 'rgba(66, 133, 244, 0.15)',
    borderColor: 'rgba(66, 133, 244, 0.3)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 65 65" fill="none">
        <path
          d="M32.5 0c.68 0 1.27.47 1.44 1.13a39 39 0 002 5.9c2.15 5 5.1 9.38 8.85 13.13 3.75 3.75 8.13 6.7 13.13 8.85a39 39 0 005.9 2c.66.17 1.13.76 1.13 1.44s-.47 1.27-1.13 1.44a39 39 0 00-5.9 2c-5 2.15-9.38 5.1-13.13 8.85-3.75 3.75-6.7 8.13-8.85 13.13a39 39 0 00-2 5.9c-.17.66-.76 1.13-1.44 1.13s-1.27-.47-1.44-1.13a39 39 0 00-2-5.9c-2.15-5-5.1-9.38-8.85-13.13-3.75-3.75-8.13-6.7-13.13-8.85a39 39 0 00-5.9-2A1.49 1.49 0 010 32.5c0-.68.47-1.27 1.13-1.44a39 39 0 005.9-2c5-2.15 9.38-5.1 13.13-8.85 3.75-3.75 6.7-8.13 8.85-13.13a39 39 0 002-5.9A1.49 1.49 0 0132.5 0z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  claude: {
    name: 'Claude Code',
    color: '#da7756', // Anthropic Terra Cotta
    bgColor: 'rgba(218, 119, 86, 0.15)',
    borderColor: 'rgba(218, 119, 86, 0.3)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="m3.127 10.604 3.135-1.76.053-.153-.053-.085H6.11l-.525-.032-1.791-.048-1.554-.065-1.505-.08-.38-.081L0 7.832l.036-.234.32-.214.455.04 1.009.069 1.513.105 1.097.064 1.626.17h.259l.036-.105-.089-.065-.068-.064-1.566-1.062-1.695-1.121-.887-.646-.48-.327-.243-.306-.104-.67.435-.48.585.04.15.04.593.456 1.267.981 1.654 1.218.242.202.097-.068.012-.049-.109-.181-.9-1.626-.96-1.655-.428-.686-.113-.411a2 2 0 0 1-.068-.484l.496-.674L4.446 0l.662.089.279.242.411.94.666 1.48 1.033 2.014.302.597.162.553.06.17h.105v-.097l.085-1.134.157-1.392.154-1.792.052-.504.25-.605.497-.327.387.186.319.456-.045.294-.19 1.23-.37 1.93-.243 1.29h.142l.161-.16.654-.868 1.097-1.372.484-.545.565-.601.363-.287h.686l.505.751-.226.775-.707.895-.585.759-.839 1.13-.524.904.048.072.125-.012 1.897-.403 1.024-.186 1.223-.21.553.258.06.263-.218.536-1.307.323-1.533.307-2.284.54-.028.02.032.04 1.029.098.44.024h1.077l2.005.15.525.346.315.424-.053.323-.807.411-3.631-.863-.872-.218h-.12v.073l.726.71 1.331 1.202 1.667 1.55.084.383-.214.302-.226-.032-1.464-1.101-.565-.497-1.28-1.077h-.084v.113l.295.432 1.557 2.34.08.718-.112.234-.404.141-.444-.08-.911-1.28-.94-1.44-.759-1.291-.093.053-.448 4.821-.21.246-.484.186-.403-.307-.214-.496.214-.98.258-1.28.21-1.016.19-1.263.112-.42-.008-.028-.092.012-.953 1.307-1.448 1.957-1.146 1.227-.274.109-.477-.247.045-.44.266-.39 1.586-2.018.956-1.25.617-.723-.004-.105h-.036l-4.212 2.736-.75.096-.324-.302.04-.496.154-.162 1.267-.871z" />
      </svg>
    ),
  },
}

interface PlatformBadgeProps {
  platform: Platform
  size?: 'sm' | 'md'
}

export function PlatformBadge({ platform, size = 'md' }: PlatformBadgeProps) {
  const config = platformConfigs[platform]
  if (!config) return null

  const sizeClasses = size === 'sm'
    ? 'text-[10px] px-2 py-1 gap-1'
    : 'text-xs px-3 py-1.5 gap-1.5'

  return (
    <span
      className={`font-medium rounded-full flex items-center ${sizeClasses}`}
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
        border: `1px solid ${config.borderColor}`,
      }}
    >
      {config.icon}
      {config.name}
    </span>
  )
}

interface PlatformBadgesProps {
  platforms?: Platform[]
  size?: 'sm' | 'md'
  className?: string
}

export function PlatformBadges({ platforms, size = 'md', className = '' }: PlatformBadgesProps) {
  if (!platforms || platforms.length === 0) return null

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {platforms.map(platform => (
        <PlatformBadge key={platform} platform={platform} size={size} />
      ))}
    </div>
  )
}

export type { Platform }
