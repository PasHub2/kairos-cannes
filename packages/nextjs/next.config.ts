import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  // THIS BLOCK IS THE FIX: It authorizes your Pinata gateway for image loading.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "your-gateway-name.mypinata.cloud", // IMPORTANT: Replace with your actual gateway URL
        port: "",
        pathname: "/ipfs/**",
      },
    ],
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

const isIpfs = process.env.NEXT_PUBLIC_IPFS_BUILD === "true";

if (isIpfs) {
  nextConfig.output = "export";
  nextConfig.trailingSlash = true;
  if (nextConfig.images) {
      nextConfig.images.unoptimized = true;
  }
}

module.exports = nextConfig;