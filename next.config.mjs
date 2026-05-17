/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile ESM-only packages
  transpilePackages: ["@hebcal/core", "kosher-zmanim"],
  experimental: {
    // Allow server-side use of these packages without issues
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
