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
      },
      {
        protocol: 'https',
        hostname: 'tjzsdlhdjnbjvhxgxrin.supabase.co',
        pathname: '/storage/v1/object/public/**',
      }
    ],
  },
}

module.exports = nextConfig 