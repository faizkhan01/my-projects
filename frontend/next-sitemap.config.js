/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.onlylatest.com',
  generateRobotsTxt: true, // (optional)
  output: 'standalone',
  alternateRefs: [
    {
      href: 'https://www.onlylatest.ca',
      hreflang: 'en-ca',
    },
  ],
  exclude: ['/server-sitemap.xml'], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://www.onlylatest.com/server-sitemap.xml', // <==== Add here
    ],
  },
};
