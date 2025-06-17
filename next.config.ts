import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
// const { version } = require('./package.json');
import { version } from "./package.json";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "app",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "https",
        hostname: "api.titleseeker.com",
      },
      {
        protocol: "https",
        hostname: "static.titleseeker.com",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },
};

export default withNextIntl(nextConfig);
