/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Add these packages to the externals list to prevent bundling issues.
    config.externals.push('@coinbase/onchainkit', 'wagmi', 'viem');

    // Aliases for native modules that are not needed in a server environment.
    config.resolve.alias['@react-native-async-storage/async-storage'] = false;
    config.resolve.alias['pino-pretty'] = false;

    return config;
  },
};

export default nextConfig;
