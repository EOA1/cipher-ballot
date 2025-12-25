/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@fhevm-sdk'],
  // Removed experimental.esmExternals as it's not recommended and may disrupt module resolution
}

module.exports = nextConfig
