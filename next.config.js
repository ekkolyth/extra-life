/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['assets.donordrive.com']
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  }
}

module.exports = nextConfig
