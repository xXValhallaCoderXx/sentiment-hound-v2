/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
    },
    transpilePackages: ['@repo/db', '@repo/services'],
    images: {
        domains: ['lh3.googleusercontent.com']
    }
};

export default nextConfig;
