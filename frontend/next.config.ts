import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    // SEO continuity from the old Docusaurus URL scheme.
    return [
      { source: '/docs/services/:slug', destination: '/services/:slug', permanent: true },
      { source: '/docs/portfolio', destination: '/portfolio', permanent: true },
      { source: '/docs/privacy-policy', destination: '/privacy-policy', permanent: true },
      { source: '/docs/terms-of-service', destination: '/terms-of-service', permanent: true },
    ];
  },
};

export default nextConfig;
