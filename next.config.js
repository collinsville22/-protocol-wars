/** @type {import('next').NextConfig} */
  const nextConfig = {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true
    },
    reactStrictMode: true,
    swcMinify: true,
    experimental: {},
    webpack: (config) => {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false
      };
      return config;
    },
  }

  module.exports = nextConfig
