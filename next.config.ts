import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Production optimizations
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header for security

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all external images for article covers
      },
    ],
    formats: ['image/avif', 'image/webp'], // Prefer modern formats
  },

  // Build optimizations
  typescript: {
    ignoreBuildErrors: false, // Set to false for production to catch errors
  },
  reactStrictMode: true, // Enable for better performance and debugging
  eslint: {
    ignoreDuringBuilds: true, // We run lint separately
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-markdown'], // Tree-shake unused imports
  },
};

export default nextConfig;
