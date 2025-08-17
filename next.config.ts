import type { NextConfig } from "next";

const API_URL = process.env.API_URL?.trim();

if (!API_URL) {
  throw new Error("API_URL não definida no .env");
}

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
