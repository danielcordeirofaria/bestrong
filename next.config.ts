import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack(config, { isServer }) {
    if (isServer) {
      config.externals.push('bcrypt');
    }
    return config;
  },
};

export default nextConfig;
