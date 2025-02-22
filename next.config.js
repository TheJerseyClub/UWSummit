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
        hostname: 's3.us-west-000.backblazeb2.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig 