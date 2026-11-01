import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a second dev server run side by side (set NEXT_DIST_DIR=.next-test).
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Adding Cloudinary preemptively
      }
    ],
  },
};

export default nextConfig;
