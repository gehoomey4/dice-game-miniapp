/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // This is the definitive solution to prevent bundling issues in Vercel.
    // By marking these core web3 packages as external, we let the runtime handle them
    // instead of webpack, avoiding subpath export resolution errors.
    config.externals.push('@coinbase/onchainkit', 'wagmi', 'viem');

    // Aliases for native modules that are not needed in a server environment.
    config.resolve.alias['@react-native-async-storage/async-storage'] = false;
    config.resolve.alias['pino-pretty'] = false;

    return config;
  },
};

export default nextConfig;
