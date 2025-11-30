import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },
      {
        protocol: "https",
        hostname: "lh1.googleusercontent.com"
      },
      {
        protocol: "https",
        hostname: "lh2.googleusercontent.com"
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com"
      },
      {
        protocol: "https",
        hostname: "lh4.googleusercontent.com"
      },
      {
        protocol: "https",
        hostname: "lh5.googleusercontent.com"
      },
      {
        protocol: "https",
        hostname: "lh6.googleusercontent.com"
      },
      {
        protocol: "https",
        hostname: "lh7.googleusercontent.com"
      },
      {
        protocol: "https",
        hostname: "lh8.googleusercontent.com"
      },
      {
        protocol: "https",
        hostname: "lh9.googleusercontent.com"
      },
      {
        protocol: "https",
        hostname: "lh10.googleusercontent.com"
      },
      {
        protocol: "https",
        hostname: "placehold.co"
      }
    ],
  },
};

export default nextConfig;
