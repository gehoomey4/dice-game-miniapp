import { NextRequest, NextResponse } from 'next/server';

const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

// Frame state management
type FrameState = {
  page: 'start' | 'game' | 'result';
  choice?: 'under' | 'over';
  roll?: number;
};

// Function to generate the frame HTML based on state
function getFrameHtml(state: FrameState): string {
  let image = `${baseUrl}/start-image.png`;
  let buttons = '<meta property="fc:frame:button:1" content="Play Dice Game" />';

  if (state.page === 'game') {
    image = `${baseUrl}/game-image.png`; // TODO: Create game-image.png
    buttons = `
      <meta property="fc:frame:button:1" content="Bet Under 7" />
      <meta property="fc:frame:button:2" content="Bet Over 7" />
    `;
  } else if (state.page === 'result' && state.roll !== undefined) {
    const result = (state.choice === 'under' && state.roll < 7) || (state.choice === 'over' && state.roll > 7) ? 'Won' : 'Lost';
    image = `${baseUrl}/result-image.png?result=${result}&roll=${state.roll}`; // TODO: Create a dynamic result image API
    buttons = '<meta property="fc:frame:button:1" content="Play Again" />';
  }

  const postUrl = `${baseUrl}/api/frame`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${image}" />
        ${buttons}
        <meta property="fc:frame:post_url" content="${postUrl}" />
      </head>
    </html>
  `;
}


async function getResponse(req: NextRequest): Promise<NextResponse> {
  const { untrustedData } = await req.json();
  const buttonIndex = untrustedData.buttonIndex;

  let state: FrameState = { page: 'start' };

  // This is a simplified state management. In a real app, you'd use a more robust solution.
  try {
    const decodedState = JSON.parse(decodeURIComponent(untrustedData.state || '{}'));
    if (decodedState.page) {
      state = decodedState;
    }
  } catch (e) {
    console.warn('Invalid state:', e);
  }

  if (state.page === 'start' || (state.page === 'result' && buttonIndex === 1)) {
    // Transition to game page
    state = { page: 'game' };
  } else if (state.page === 'game') {
    // Simulate a dice roll
    const roll = Math.floor(Math.random() * 12) + 2; // Simulate two dice rolls (2-12)
    const choice = buttonIndex === 1 ? 'under' : 'over';
    state = { page: 'result', choice, roll };
  }

  const frameHtml = getFrameHtml(state);

  return new NextResponse(frameHtml, { status: 200, headers: { 'Content-Type': 'text/html' } });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
