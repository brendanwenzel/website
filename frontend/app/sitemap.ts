import type { MetadataRoute } from 'next';

const BASE = 'https://www.brendanwenzel.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    '',
    '/services',
    '/services/marketing-consulting',
    '/services/media-buying',
    '/services/web-development',
    '/portfolio',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
  ].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.7,
  }));
}
