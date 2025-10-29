/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Ensure externals is an array
    config.externals = config.externals || [];

    // Add the packages that are causing issues with Vercel's bundling
    config.externals.push('@coinbase/onchainkit', 'wagmi', 'viem');

    // Aliases for native modules that are not needed in a server environment
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
    };

    return config;
  },
};

export default nextConfig;
