/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.licdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.backblazeb2.com',
        pathname: '/**',
      }
    ],
  },
}

module.exports = nextConfig 