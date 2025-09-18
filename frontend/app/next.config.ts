// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  //?remove these after testing
    eslint: {
    ignoreDuringBuilds: true,
  },
    typescript: {
    ignoreBuildErrors: true,  
  },


  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "Cross-Origin-Embedder-Policy", 
            value: "unsafe-none",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
