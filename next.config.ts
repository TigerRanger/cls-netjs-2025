import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  async rewrites() {
    return [
      {
        source: '/magento-graphql/:path*', // Your Next.js proxy endpoint
        destination: 'http://cls-computer-admin.nz/graphql/:path*', // Magento GraphQL endpoint
      },
    ];
  },
  
  env: {
    MAGENTO_ENDPOINT: process.env.MAGENTO_ENDPOINT,
    MAGENTO_ENDPOINT_SITE: process.env.MAGENTO_ENDPOINT_SITE,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXTJS_SECRET_KEY: process.env.NEXTJS_SECRET_KEY,
    WP_ENDPOINT:process.env.WP_ENDPOINT,
    WP_SITE_URL:process.env.WP_SITE_URL,
    MAIN_SITE_URL: process.env.MAIN_SITE_URL,
  },


  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cls-computer.de",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "cls-computer-admin.nz",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "cls-blog.nz",
        pathname: "/**",
      },
    ],
  }

};

export default nextConfig;
