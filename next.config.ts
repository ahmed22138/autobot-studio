import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  output: "standalone", // Required for Docker - creates minimal production build
};

export default nextConfig;
