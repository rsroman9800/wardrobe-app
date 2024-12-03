/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['openweathermap.org'],
  },
  output: 'export',
}

module.exports = nextConfig