const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/dnhq4fcyp/**',
            },
        ],
    },
    experimental: {
        optimizePackageImports: ['@dicebear/core', '@dicebear/collection'],
    },
}

module.exports = withPWA(nextConfig)
