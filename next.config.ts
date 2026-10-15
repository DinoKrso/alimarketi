import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/favicon/favicon.ico" }];
  },
};

export default nextConfig;
