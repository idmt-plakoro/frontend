import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
        remotePatterns: [ // domains is deprecated
            {
                protocol: 'https',
                hostname: 'drive.google.com',
                pathname: '**',
            },
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
            },
            {
                protocol: "https",
                hostname: "picsum.photos",
            },
        ],
    },
    env: {
        BACKEND_URL: process.env.BACKEND_URL
    },
    async headers() {
        return [
            {
                // matching all API routes or resource paths
                source: "/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" }, // change this to specific domain if needed
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                ]
            }
        ];
    }
};

export default nextConfig;
