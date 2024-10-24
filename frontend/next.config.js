// eslint-disable-next-line
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const isDev = process.env.NODE_ENV === 'development';

/**
 * @type {import('next').NextConfig}
 */

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  output: 'standalone',
  webpack: (config) => {
    // https://github.com/vercel/next.js/issues/49334#issuecomment-1577848112
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    });

    return config;
  },
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
      preventFullImport: true,
    },
    lodash: {
      transform: 'lodash/{{member}}',
      preventFullImport: true,
    },
    '@/ui-kit/?(((\\w*)?/?)*)': {
      transform: '@/ui-kit/{{matches.[1]}}/{{member}}',
      skipDefaultConversion: true,
    },
    '@phosphor-icons/react': {
      transform: '@phosphor-icons/react/{{member}}',
    },
  },
  images: {
    domains: [
      ...(isDev
        ? [
            'tipsscore.com',
            'tipsscore.comresb',
            'flagcdn.com',
            'i.ibb.co',
            'ibb.co',
            'localhost',
          ]
        : []),
      'loremflickr.com',
      process.env.IMAGES_CLOUDFRONT_HOST,
    ],
  }
});
