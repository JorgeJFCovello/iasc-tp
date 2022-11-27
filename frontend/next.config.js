/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    WS_URL: process.env.WS_URL,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACK_URL}/api/:path*`,
      },
      {
        source: '/socket.io:path*',
        destination: `${process.env.WS_URL}/ws/socket:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
