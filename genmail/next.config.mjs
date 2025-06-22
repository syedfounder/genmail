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
};

export default nextConfig;
