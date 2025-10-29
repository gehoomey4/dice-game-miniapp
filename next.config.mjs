/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Aliases to handle problematic imports for native modules
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
    };

    // Mark these core web3 packages as external to prevent bundling issues in Vercel
    config.externals = [
      ...(config.externals || []),
      '@coinbase/onchainkit',
      'wagmi',
      'viem',
    ];

    return config;
  },
};

export default nextConfig;
