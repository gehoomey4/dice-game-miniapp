import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const manifest = {
    name: 'Dice Game: Over/Under 7',
    iconUrl: 'https://example.com/icon.png', // TODO: Replace with your actual icon URL
    description: 'A simple dice game on Farcaster.',
    postUrl: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/frame`, // The URL for frame interactions
    action: {
      type: 'post',
      name: 'Play Dice Game',
    },
  };

  return NextResponse.json(manifest, { status: 200 });
}
