/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.donordrive.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'donordrivecontent.com',
        port: ''
      }
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  }
}

module.exports = nextConfig
