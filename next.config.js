/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['assets.donordrive.com']
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['@prisma/client']
  }
}

module.exports = nextConfig
