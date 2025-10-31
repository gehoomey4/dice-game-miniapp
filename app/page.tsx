'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { parseEther } from 'viem';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

import { GAME_CONTRACT_ADDRESS, GAME_CONTRACT_ABI } from './config';

const ConnectWallet = dynamic(() => import('@coinbase/onchainkit/wallet').then(mod => mod.ConnectWallet), { ssr: false });

export default function Home() {
  // 0 = Under 7, 1 = Over 7
  const [guess, setGuess] = useState<0 | 1>(1); // Default to Over 7
  const [betAmount, setBetAmount] = useState('0.000001');

  const { address } = useAccount();
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const chainId = useChainId();

  const explorerUrl = chainId === 8453 ? `https://basescan.org/tx/${hash}` : `https://sepolia.etherscan.io/tx/${hash}`;

  async function handleBet() {
    writeContract({
      address: GAME_CONTRACT_ADDRESS,
      abi: GAME_CONTRACT_ABI,
      functionName: 'guess',
      args: [guess],
      value: parseEther(betAmount),
    });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Base classes for choice buttons
  const baseButtonClasses = "p-4 text-base font-bold rounded-lg border-2 transition-all duration-200";
  const selectedButtonClasses = "bg-blue-600 border-blue-600 text-white";
  const defaultButtonClasses = "border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:border-gray-500";

  // Base classes for message boxes
  const baseMessageClasses = "p-3 mt-5 rounded-lg text-center text-sm";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white p-4 sm:p-5">
      <div className="absolute top-4 right-4 sm:top-5 sm:right-5">
        <ConnectWallet />
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 w-full max-w-sm sm:max-w-md shadow-2xl"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">🎲 Dice Game 🎲</h1>

        {/* Bet Amount Selection */}
        <div>
          <label className="text-sm font-bold text-gray-400 mb-2 block">Bet Amount (ETH)</label>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            step="0.000001"
            min="0.000001"
            className="w-full p-3 text-lg border border-gray-600 bg-gray-900 text-white rounded-lg mb-5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Over/Under Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setGuess(0)} // 0 = Under
            className={`${baseButtonClasses} ${guess === 0 ? selectedButtonClasses : defaultButtonClasses}`}
          >
            Under 7
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setGuess(1)} // 1 = Over
            className={`${baseButtonClasses} ${guess === 1 ? selectedButtonClasses : defaultButtonClasses}`}
          >
            Over 7
          </motion.button>
        </div>

        {/* Main Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-4 text-lg font-bold rounded-lg border-none bg-blue-600 text-white mt-2 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
          disabled={isPending || !address}
          onClick={handleBet}
        >
          {isPending ? 'Confirming...' : 'Roll the Dice!'}
        </motion.button>

        {/* Status Messages */}
        {isConfirming && (
          <div className={`${baseMessageClasses} bg-gray-700 text-gray-300`}>
            <p>Transaction pending...</p>
          </div>
        )}

        {isConfirmed && (
          <div className={`${baseMessageClasses} bg-green-900/80 text-green-300`}>
            <p>
              Bet placed successfully!{' '}
              <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="underline">
                View on Explorer
              </a>
            </p>
          </div>
        )}

        {error && (
          <div className={`${baseMessageClasses} bg-red-900/80 text-red-300`}>
            <p>Error: {error.message}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}