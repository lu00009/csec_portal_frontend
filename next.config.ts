// next.config.ts
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ["robohash.org", "csec-portal-backend-1.onrender.com"]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash].css',
          chunkFilename: 'static/css/[name].[contenthash].css',
        })
      );
    }
    return config;
  },
};

export default nextConfig;
