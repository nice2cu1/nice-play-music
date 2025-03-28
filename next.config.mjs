/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '8.217.105.136',
                port: '5244',
                pathname: '/**',
            },
        ]
    }
};

export default nextConfig;