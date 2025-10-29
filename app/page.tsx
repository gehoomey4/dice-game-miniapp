'use client';

import { useState } from 'react';
import { Address, Balance, ConnectWallet } from '@coinbase/onchainkit';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

// TODO: Replace with your contract's ABI and address once compiled and deployed.
const contractAddress = '0x...'; // Replace with your deployed contract address
const contractAbi = []; // Replace with your contract ABI

export default function Home() {
  const [betAmount, setBetAmount] = useState('0.01');
  const [choice, setChoice] = useState<'under' | 'over' | null>(null);
  const { address } = useAccount();
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  async function handleBet(isOverSeven: boolean) {
    setChoice(isOverSeven ? 'over' : 'under');
    // TODO: Enable contract interaction
    // writeContract({
    //   address: contractAddress,
    //   abi: contractAbi,
    //   functionName: 'placeBet',
    //   args: [isOverSeven],
    //   value: parseEther(betAmount),
    // });
    console.log(`Betting ${betAmount} ETH on ${isOverSeven ? 'Over 7' : 'Under 7'}`);
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-900 text-white">
      <div className="absolute top-4 right-4">
        <ConnectWallet />
      </div>

      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-4">Dice Game: Over/Under 7</h1>

        {address && (
          <div className="p-4 mb-4 text-center bg-gray-700 rounded-md">
            <p className="mb-2">Your Wallet:</p>
            <Address address={address} className="text-lg font-mono" />
            <p className="mt-2">
              Balance: <Balance address={address} />
            </p>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="betAmount" className="block mb-2 text-sm font-medium">Bet Amount (ETH)</label>
          <input
            type="number"
            id="betAmount"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
            step="0.01"
            min="0.001"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            onClick={() => handleBet(false)}
            disabled={isPending || !address}
            className="px-4 py-2 font-bold text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-500"
          >
            Bet Under 7
          </button>
          <button
            onClick={() => handleBet(true)}
            disabled={isPending || !address}
            className="px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-500"
          >
            Bet Over 7
          </button>
        </div>

        {isPending && (
          <div className="text-center text-yellow-400">
            Waiting for confirmation...
          </div>
        )}

        {isConfirming && (
          <div className="text-center text-blue-400">
            Transaction pending...
          </div>
        )}

        {isConfirmed && (
          <div className="p-4 mt-4 text-center bg-green-900 rounded-md">
            <p className="font-bold">Transaction Successful!</p>
            {/* You would typically get the result from contract events here */}
            <p>You chose {choice}. The dice roll result will appear here.</p>
          </div>
        )}

        {error && (
          <div className="p-4 mt-4 text-center text-red-400 bg-red-900 rounded-md">
            <p>Error: {error.shortMessage || error.message}</p>
          </div>
        )}
      </div>
    </main>
  );
}
