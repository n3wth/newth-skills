import type { NextConfig } from 'next'
import path from 'path'

const localUiPath = path.resolve(__dirname, '../ui/dist')

const nextConfig: NextConfig = {
  // Transpile the local @n3wth/ui package
  transpilePackages: ['@n3wth/ui'],

  // Empty turbopack config to satisfy Next.js 16 (uses Turbopack by default)
  turbopack: {},

  // Webpack config for symlink resolution (using --webpack flag in dev script)
  webpack: (config) => {
    // Enable symlink resolution
    config.resolve.symlinks = true

    // Use local package if available (dev), otherwise use npm version (CI)
    try {
      const fs = require('fs')
      if (fs.existsSync(localUiPath)) {
        config.resolve.alias = {
          ...config.resolve.alias,
          '@n3wth/ui': localUiPath,
        }
      }
    } catch {}

    return config
  },

  // Output static HTML for all pages
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Trailing slashes for cleaner URLs
  trailingSlash: false,

  // Enable React strict mode
  reactStrictMode: true,
}

export default nextConfig
