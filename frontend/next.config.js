/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACK_URL}/api/:path*`,
      },
      {
        source: '/socket.io/:path*',
        destination: `${process.env.BACK_URL}/socket.io/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
