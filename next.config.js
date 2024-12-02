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
  env: {
    REDIS_URL: process.env.REDIS_URL,
    REDIS_SECRET: process.env.REDIS_SECRET,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL
  },
}

module.exports = nextConfig
