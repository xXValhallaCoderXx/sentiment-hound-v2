/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
    },
    images: {
        domains: ['lh3.googleusercontent.com']
    }
};

export default nextConfig;
