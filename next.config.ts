import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.aimeleondore.com",
        port: "",
        pathname: "/cdn/shop/files/**"
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        port: "",
        pathname: "/s/files/**"
      }
    ]
  }
};  

export default nextConfig;
