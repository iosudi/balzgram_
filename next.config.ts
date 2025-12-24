import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/hubs/chat",
        destination: "https://balzgram.runasp.net/hubs/chat",
      },
    ];
  },
};

export default nextConfig;
