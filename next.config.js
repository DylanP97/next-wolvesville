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

module.exports = nextConfig