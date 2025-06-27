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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Content-Security-Policy",
            value:
              process.env.NODE_ENV === "development"
                ? "frame-src 'self' http://localhost:* https://*.clerk.accounts.dev https://*.clerk.com https://challenges.cloudflare.com; frame-ancestors 'self';"
                : "frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://challenges.cloudflare.com; frame-ancestors 'self';",
          },
        ],
      },
    ];
  },
  experimental: {
    // Enable development features
    serverComponentsExternalPackages: [],
  },
  // Disable strict mode temporarily to avoid double-mounting issues in development
  reactStrictMode: process.env.NODE_ENV !== "development",
};

export default nextConfig;
