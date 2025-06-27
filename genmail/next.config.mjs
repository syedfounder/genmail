/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.example.com", // Replace with your actual domain in production
      },
      {
        protocol: "https",
        hostname: "qrxzrsmpmllggnopbqze.supabase.co", // Supabase storage domain
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
