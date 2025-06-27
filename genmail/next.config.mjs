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
    // PRODUCTION: Enable ESLint validation
    ignoreDuringBuilds: process.env.NODE_ENV !== "production",
  },
  typescript: {
    // PRODUCTION: Enable TypeScript validation
    ignoreBuildErrors: process.env.NODE_ENV !== "production",
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value:
              process.env.NODE_ENV === "development"
                ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* https://*.clerk.accounts.dev https://*.clerk.com https://*.clerk.dev; style-src 'self' 'unsafe-inline' https://*.clerk.com https://*.clerk.dev; img-src 'self' data: https://*.supabase.co https://*.clerk.com https://*.clerk.dev; connect-src 'self' http://localhost:* https://*.supabase.co https://*.clerk.com https://*.clerk.dev wss://*.clerk.dev; frame-src 'self' http://localhost:* https://*.clerk.accounts.dev https://*.clerk.com https://*.clerk.dev https://challenges.cloudflare.com; frame-ancestors 'self';"
                : "default-src 'self'; script-src 'self' 'unsafe-inline' https://*.clerk.com https://*.clerk.dev; style-src 'self' 'unsafe-inline' https://*.clerk.com https://*.clerk.dev; img-src 'self' data: https://*.supabase.co https://*.clerk.com https://*.clerk.dev; connect-src 'self' https://*.supabase.co https://*.clerk.com https://*.clerk.dev wss://*.clerk.dev; frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://*.clerk.dev https://challenges.cloudflare.com; frame-ancestors 'self';",
          },
        ],
      },
    ];
  },
  experimental: {
    // Enable development features
    serverComponentsExternalPackages: [],
  },
  // Enable strict mode for production builds
  reactStrictMode: true,
};

export default nextConfig;
