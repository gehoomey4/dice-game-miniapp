import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData, parseEther } from 'viem';

// The ABI for the `guess` function
const abi = [
  {
    "type": "function",
    "name": "guess",
    "inputs": [
      {
        "name": "_guess",
        "type": "uint8",
        "internalType": "enum DiceGame.Guess"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  }
];

// The contract address
const contractAddress = '0x...'; // TODO: Replace with your deployed contract address
const betAmount = '0.001'; // The bet amount in ETH

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const choice = searchParams.get('choice');

  if (choice !== 'under' && choice !== 'over') {
    return new NextResponse('Invalid choice', { status: 400 });
  }

  const guessEnum = choice === 'under' ? 0 : 1;

  // Encode the function call data
  const data = encodeFunctionData({
    abi,
    functionName: 'guess',
    args: [guessEnum],
  });

  const txData = {
    chainId: 'eip155:8453', // Base Mainnet
    method: 'eth_sendTransaction',
    params: {
      to: contractAddress,
      data,
      value: parseEther(betAmount).toString(),
    },
  };

  return NextResponse.json(txData, { status: 200 });
}

export const dynamic = 'force-dynamic';
