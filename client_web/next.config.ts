import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: [
      "http://31.127.38.182:3000",
      "http://localhost:3000",
    ],
  },
};

export default nextConfig;
