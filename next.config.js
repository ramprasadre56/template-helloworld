/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore Remotion src folder during Next.js compilation
  webpack: (config, { isServer }) => {
    // Handle Remotion-specific imports
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
  // Allow images from Supabase storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;
