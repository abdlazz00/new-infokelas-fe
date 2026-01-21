// src/app/robots.js

export default function robots() {
  const baseUrl = 'https://infokelas.com'

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/login'],
      disallow: [
        '/dashboard/', 
        '/classes/', 
        '/assignments/', 
        '/schedule/', 
        '/profile/', 
        '/announcements/',
        '/api/' 
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}