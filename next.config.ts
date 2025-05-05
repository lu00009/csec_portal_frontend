// next.config.ts
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      "robohash.org", 
      "csec-portal-backend-1.onrender.com",
      "res.cloudinary.com"
    ]
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
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'http',
  //       hostname: 'csec-portal-backend-1.onrender.com',
  //       port: '',
  //       pathname: '/uploads/**',
  //     },
  //   ],
    // // You can add more image configuration options
    // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // formats: ['image/webp'],
    // minimumCacheTTL: 60,
  }
  
  
export default nextConfig;
