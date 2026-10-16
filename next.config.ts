import type { NextConfig } from "next";

// As chamadas para /api/* passam por src/app/api/[...path]/route.ts,
// que injeta a x-api-key no servidor. Configure SEARCHPRICE_API_URL e
// SEARCHPRICE_API_KEY (veja .env.example).
const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
