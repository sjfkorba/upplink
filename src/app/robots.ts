import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/login', '/api/'], // Private pages hide karein
    },
    sitemap: 'https://upp-link.com/sitemap.xml',
  };
}