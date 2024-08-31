import createNextIntlPlugin from "next-intl/plugin";

import path from "path";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreBuildErrors: true,
  },
};

export default withNextIntl(nextConfig);
