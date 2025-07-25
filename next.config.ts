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
      
    ],
  },
  webpack: (config, { isServer }) => {
    // This is to address an issue with pdf.js-extract trying to require 'canvas'
    // which is a server-side dependency. We can safely ignore it for the client-side build.
    if (!isServer) {
      config.resolve.alias.canvas = false;
      config.resolve.alias.fs = false;
    }

    // This is to address an issue with pdf.js-extract trying to require 'fs'
    // which is a server-side dependency. We can safely ignore it for the client-side build.
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    
    return config;
  },
};

export default nextConfig;
