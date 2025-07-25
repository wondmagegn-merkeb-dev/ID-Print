import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // This is to address an issue with pdf.js-extract trying to require 'canvas'
    // which is a server-side dependency. We can safely ignore it for the client-side build.
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
