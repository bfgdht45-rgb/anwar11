import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // إزالة output: standalone عشان Vercel يشتغل صح
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
