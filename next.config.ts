import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  // Transpile the local @n3wth/ui package
  transpilePackages: ['@n3wth/ui'],

  // Webpack config for symlink resolution (using --webpack flag in dev script)
  webpack: (config) => {
    // Enable symlink resolution
    config.resolve.symlinks = true

    // Add explicit alias for the local package
    config.resolve.alias = {
      ...config.resolve.alias,
      '@n3wth/ui': path.resolve(__dirname, '../ui/dist'),
    }

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
