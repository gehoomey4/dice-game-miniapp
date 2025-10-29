import { NextRequest, NextResponse } from 'next/server';
import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit/dist/farcaster/index.js';

const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
const contractAddress = '0x...'; // TODO: Replace with your deployed contract address

// Generates the initial frame
function getInitialFrame() {
  const imageUrl = `${baseUrl}/start-image.png`;
  const postUrl = `${baseUrl}/api/frame`;
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${imageUrl}" />
        <meta property="fc:frame:button:1" content="Play Dice Game" />
        <meta property="fc:frame:post_url" content="${postUrl}" />
      </head>
    </html>
  `;
}

// Generates the frame for placing a bet (which will trigger a transaction)
function getBettingFrame() {
  const imageUrl = `${baseUrl}/game-image.png`;
  const postUrl = `${baseUrl}/api/frame`; // This could be a different URL if state changes
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${imageUrl}" />
        <meta property="fc:frame:button:1" content="Bet Under 7" />
        <meta property="fc:frame:button:1:action" content="tx" />
        <meta property="fc:frame:button:1:target" content="${baseUrl}/api/transaction?choice=under" />
        <meta property="fc:frame:button:2" content="Bet Over 7" />
        <meta property="fc:frame:button:2:action" content="tx" />
        <meta property="fc:frame:button:2:target" content="${baseUrl}/api/transaction?choice=over" />
      </head>
    </html>
  `;
}

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let message: any;
  try {
    const body: FrameRequest = await req.json();
    const { isValid, message: frameMessage } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });
    if (!isValid) {
      return new NextResponse('Invalid frame message', { status: 400 });
    }
    message = frameMessage;
  } catch (e) {
    // This handles the initial GET request for the frame
    return new NextResponse(getInitialFrame(), { status: 200, headers: { 'Content-Type': 'text/html' } });
  }

  // If we are here, it means it's a POST request from a frame interaction
  // After the first click ("Play Dice Game"), we show the betting frame
  const frameHtml = getBettingFrame();

  return new NextResponse(frameHtml, { status: 200, headers: { 'Content-Type': 'text/html' } });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

// Add a GET handler for initial frame loading
export async function GET(req: NextRequest): Promise<Response> {
  return new NextResponse(getInitialFrame(), { status: 200, headers: { 'Content-Type': 'text/html' } });
}

export const dynamic = 'force-dynamic';
