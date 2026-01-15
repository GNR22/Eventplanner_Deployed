/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui", "@acme/database"],
  experimental: {
    serverActions: true,
  },
};