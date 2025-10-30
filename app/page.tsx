'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import dynamic from 'next/dynamic';

const ConnectWallet = dynamic(() => import('@coinbase/onchainkit/wallet').then(mod => mod.ConnectWallet), { ssr: false });

// --- مقادیر کانترکت ---
// ⚠️ مطمئن شوید که Jules از آدرس کانترکت نهایی شما استفاده می‌کند
const GAME_CONTRACT_ADDRESS = '0xefa95f3b3713443abf6bfe4091eef899ef1d0b32';

// ABI (رابط) کانترکت شما
const GAME_CONTRACT_ABI = [
  {
    "type": "function",
    "name": "guess",
    "inputs": [
      { "name": "_guess", "type": "uint8", "internalType": "enum DiceGame.Guess" }
    ],
    "outputs": [],
    "stateMutability": "payable"
  }
];
// --- پایان مقادیر کانترکت ---

export default function Home() {
  // 0 = Under 7, 1 = Over 7
  const [guess, setGuess] = useState<0 | 1>(1); // پیش‌فرض روی Over 7
  const [betAmount, setBetAmount] = useState('0.001');

  const { address } = useAccount();
  const { data: hash, error, isPending, writeContract } = useWriteContract();

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


  // استایل‌های CSS
  const baseButtonStyle: React.CSSProperties = {
    padding: '16px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '8px',
    border: '2px solid #555',
    backgroundColor: 'transparent',
    color: '#fff',
  };

  const messageStyle: React.CSSProperties = {
    padding: '12px',
    marginTop: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '14px',
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#111',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
    },
    card: {
      backgroundColor: '#222',
      borderRadius: '16px',
      padding: '24px',
      width: '100%',
      maxWidth: '400px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
      border: '1px solid #333',
    },
    header: {
      fontSize: '28px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '24px',
    },
    label: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#aaa',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: '1px solid #444',
      backgroundColor: '#111',
      color: '#fff',
      borderRadius: '8px',
      boxSizing: 'border-box',
      marginBottom: '20px',
    },
    buttonGroup: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
      marginBottom: '24px',
    },
    button: baseButtonStyle,
    buttonSelected: {
      ...baseButtonStyle,
      backgroundColor: '#0052FF',
      borderColor: '#0052FF',
    },
    transactionButton: {
      width: '100%',
      padding: '16px',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#0052FF',
      color: 'white',
      marginTop: '10px',
    },
    message: messageStyle,
    errorMessage: {
      ...messageStyle,
      backgroundColor: '#400',
      color: '#f99',
    },
    successMessage: {
      ...messageStyle,
      backgroundColor: '#040',
      color: '#9f9',
    },
  };

  return (
    // SafeArea برای جلوگیری از تداخل با UI موبایل (از سند ۸)
      <div style={styles.container}>
        <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <ConnectWallet />
        </div>
        <div style={styles.card}>
          <h1 style={styles.header}>🎲 Dice Game 🎲</h1>

          {/* انتخاب مبلغ شرط */}
          <div>
            <label style={styles.label}>Bet Amount (ETH)</label>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              step="0.001"
              min="0.0001"
              style={styles.input}
            />
          </div>

          {/* انتخاب Over یا Under */}
          <div style={styles.buttonGroup}>
            <button
              onClick={() => setGuess(0)} // 0 = Under
              style={guess === 0 ? styles.buttonSelected : styles.button}
            >
              Under 7
            </button>
            <button
              onClick={() => setGuess(1)} // 1 = Over
              style={guess === 1 ? styles.buttonSelected : styles.button}
            >
              Over 7
            </button>
          </div>

          {/* دکمه‌ی اصلی بازی */}
          <button
            style={styles.transactionButton}
            disabled={isPending || !address}
            onClick={handleBet}
          >
            {isPending ? 'Confirming...' : 'Roll the Dice!'}
          </button>

          {/* نمایش پیام‌های وضعیت */}
          {isConfirming && (
            <div style={styles.message}>
              <p>Transaction pending...</p>
            </div>
          )}

          {isConfirmed && (
            <div style={styles.successMessage}>
              <p>Bet placed successfully! Check your wallet.</p>
            </div>
          )}

          {error && (
            <div style={styles.errorMessage}>
              <p>Error: {error.message}</p>
            </div>
          )}

        </div>
      </div>
  );
}