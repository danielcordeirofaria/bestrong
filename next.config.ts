import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  webpack(config, { isServer }) {
    if (isServer) {
      config.externals.push('bcrypt');
    }
    return config;
  },
};

export default nextConfig;
