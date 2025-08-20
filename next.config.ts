import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "http://ec2-54-233-2-124.sa-east-1.compute.amazonaws.com:3333/:path*",
      },
    ];
  },
};

export default nextConfig;
