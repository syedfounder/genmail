import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { NextRequest } from "next/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to extract client IP from request headers
export function getClientIP(request: NextRequest | Request): string {
  // Try different header sources in order of preference
  const xForwardedFor = request.headers.get("x-forwarded-for");
  const xRealIp = request.headers.get("x-real-ip");

  // x-forwarded-for can contain multiple IPs, take the first one
  if (xForwardedFor) {
    const ips = xForwardedFor.split(",");
    return ips[0].trim();
  }

  if (xRealIp) {
    return xRealIp.trim();
  }

  // Fallback for environments where the above headers are not set
  // Note: request.ip is available in some environments like Express, but not standard in Next.js Edge/Serverless Functions.
  // The 'x-forwarded-host' is not a reliable source for the client IP.
  return "127.0.0.1";
}
