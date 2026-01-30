import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
