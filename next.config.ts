import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Включаем standalone output для Docker
  output: "standalone",
};

export default nextConfig;
