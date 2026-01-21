import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configure as SPA - all routes will be handled by client-side routing
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Trailing slashes for static hosting compatibility
  trailingSlash: true,

  // Enable React strict mode
  reactStrictMode: true,

  // Skip type checking during build to preserve existing functionality
  // The original Vite build did not enforce strict type checking
  typescript: {
    ignoreBuildErrors: true,
  },

  // Skip ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable source maps in development to suppress missing .map file warnings
  // from third-party libraries (e.g., motion/framer-motion)
  productionBrowserSourceMaps: false,
};

export default nextConfig;

