/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'utfs.io'], 
  },
  experimental: {
    appDir: true,
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.externals.push({ canvas: 'commonjs canvas' }) // https://github.com/Automattic/node-canvas/issues/867
    return config
  },
}

module.exports = nextConfig
