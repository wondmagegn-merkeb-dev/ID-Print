
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
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      }
    ],
  },
  webpack: (config, { isServer }) => {
    // This is to address an issue with pdf.js-extract trying to require 'canvas'
    // which is a server-side dependency. We can safely ignore it for all builds.
    config.resolve.alias.canvas = false;
    config.resolve.alias.fs = false;
    
    return config;
  },
};

export default nextConfig;
