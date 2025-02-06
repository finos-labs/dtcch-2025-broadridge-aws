const isProd = process.env.NODE_ENV === "production"

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: !isProd,
  logging: { fetches: { fullUrl: true } },
  output: isProd ? "standalone" : undefined,
};

export default nextConfig;
