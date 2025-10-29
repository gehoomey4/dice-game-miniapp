/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // For server-side builds, we need to externalize these packages
    // to prevent Vercel's bundler from failing on subpath exports.
    if (isServer) {
      config.externals = [
        '@coinbase/onchainkit',
        'wagmi',
        'viem',
        ...config.externals
      ];
    }

    // Aliases for native modules that are not needed in a server environment.
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
    };

    return config;
  },
};

export default nextConfig;
