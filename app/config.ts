// Contract configuration
export const GAME_CONTRACT_ADDRESS = '0x8e252cc98e751adf3f205413f28b34c99bdac7eb';

export const GAME_CONTRACT_ABI = [
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
