import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/'], // Sensitive routes ko hide rakhein
    },
    sitemap: 'https://upp-link.com/sitemap.xml',
  };
}