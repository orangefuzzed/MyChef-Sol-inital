import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ message: 'Claude API key is not set' }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-2.1",
        prompt: "Hello, Claude!",
        max_tokens_to_sample: 10,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return NextResponse.json({ message: 'Claude AI error', error: errorBody }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ result: data.completion });
  } catch (error) {
    return NextResponse.json({ message: 'An error occurred', error: error.toString() }, { status: 500 });
  }
}