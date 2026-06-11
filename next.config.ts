import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
        remotePatterns: [ // domains is deprecated
            {
              protocol: "https",
              hostname: "drive.google.com", 
            },
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
            },
            {
                protocol: "https",
                hostname: "bandai-hobby.net",
            },
        ],
    },
    env: {
        BACKEND_URL: process.env.BACKEND_URL
    }
};

export default nextConfig;
