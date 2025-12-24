import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/hubs/chat/:path*",
        destination: "https://balzgram.runasp.net/hubs/chat/:path*",
      },
    ];
  },
};

export default nextConfig;
