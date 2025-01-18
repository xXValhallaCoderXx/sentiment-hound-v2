/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['database'], // your shared package name
    experimental: {
        optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals = [...(config.externals || [])];
        }
        return config;
    },
};

export default nextConfig;
