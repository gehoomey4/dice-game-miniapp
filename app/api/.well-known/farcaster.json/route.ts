import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

  const manifest = {
    name: 'Dice Game: Over/Under 7 (On-Chain)',
    iconUrl: `${baseUrl}/icon.png`, // TODO: Replace with your actual icon URL
    description: 'A simple, on-chain dice game on Farcaster.',
    postUrl: `${baseUrl}/api/frame`, // The URL for frame interactions
    action: {
      type: 'post', // Changed to 'post' as it's more common for initial frame action
      name: 'Play On-Chain',
    },
  };

  return NextResponse.json(manifest, { status: 200 });
}
