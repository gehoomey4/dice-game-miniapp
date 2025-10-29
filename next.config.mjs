/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Aliases to handle problematic imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
    };

    // Mark these packages as external to prevent bundling issues
    config.externals = [
      ...(config.externals || []),
      '@coinbase/onchainkit',
      '@wagmi/core',
      'viem',
    ];

    return config;
  },
};

export default nextConfig;
