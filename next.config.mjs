/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    strictNextHead: true,
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: '/not-found',
        },
      ],
    }
  },
};

export default nextConfig;
