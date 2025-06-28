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
  async headers() {
    return [
      {
        // Apply security headers to pages, but exclude static assets
        source: "/((?!_next/static|_next/image|favicon.ico).*)",
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
                ? "default-src 'self'; worker-src 'self' blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* https://*.clerk.accounts.dev https://*.clerk.com https://*.clerk.dev https://clerk.genmail.app https://va.vercel-scripts.com https://vercel.live https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://*.clerk.com https://*.clerk.dev https://clerk.genmail.app https://challenges.cloudflare.com; img-src 'self' data: https://*.supabase.co https://*.clerk.com https://*.clerk.dev https://clerk.genmail.app; connect-src 'self' http://localhost:* https://*.supabase.co https://*.clerk.com https://*.clerk.dev https://clerk.genmail.app wss://*.clerk.dev https://*.clerk.accounts.dev https://clerk-telemetry.com https://vercel.live https://challenges.cloudflare.com; frame-src 'self' http://localhost:* https://*.clerk.accounts.dev https://*.clerk.com https://*.clerk.dev https://clerk.genmail.app https://challenges.cloudflare.com https://vercel.live; frame-ancestors 'self';"
                : "default-src 'self'; worker-src 'self' blob:; script-src 'self' 'unsafe-inline' https://*.clerk.com https://*.clerk.dev https://clerk.genmail.app https://va.vercel-scripts.com https://vercel.live https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://*.clerk.com https://*.clerk.dev https://clerk.genmail.app https://challenges.cloudflare.com; img-src 'self' data: https://*.supabase.co https://*.clerk.com https://*.clerk.dev https://clerk.genmail.app; connect-src 'self' https://*.supabase.co https://*.clerk.com https://*.clerk.dev https://clerk.genmail.app wss://*.clerk.dev https://*.clerk.accounts.dev https://clerk-telemetry.com https://vercel.live https://challenges.cloudflare.com; frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://*.clerk.dev https://clerk.genmail.app https://challenges.cloudflare.com https://vercel.live; frame-ancestors 'self';",
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
