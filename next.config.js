/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  // Fix for workspace root detection
  outputFileTracingRoot: path.join(__dirname, ''),
  // Force env loading from correct directory
  env: {
    USER_EMAIL: process.env.USER_EMAIL,
    USER_PASSWORD_HASH: process.env.USER_PASSWORD_HASH,
    JWT_SECRET: process.env.JWT_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  },
}

module.exports = nextConfig
