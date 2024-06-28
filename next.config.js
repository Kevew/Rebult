/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'utfs.io'], 
  },
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig
