/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Aliases for native modules that are not needed in a server environment.
    config.resolve.alias['@react-native-async-storage/async-storage'] = false;
    config.resolve.alias['pino-pretty'] = false;

    config.externals.push('@coinbase/onchainkit', 'wagmi', 'viem');

    return config;
  },
};

export default nextConfig;
