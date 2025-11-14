/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "res.cloudinary.com",
        ],
        unoptimized: true,
    },
    experimental: {
        optimizePackageImports: ['@dicebear/core', '@dicebear/collection'],
    },
}

module.exports = nextConfig