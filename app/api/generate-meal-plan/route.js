import { NextResponse } from 'next/server';

export async function POST(req) {
  console.log('API route called');
  const apiKey = process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    console.error('Claude API key is not set');
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
    }
    console.log('Received prompt:', prompt);

    const formattedPrompt = `\n\nHuman: ${prompt}\n\nAssistant: Certainly! I'd be happy to generate a weekly meal plan for you. Here's a diverse 7-day meal plan with a variety of cuisines and options:`;

    console.log('Sending request to Claude AI...');
    const response = await fetch('https://api.anthropic.com/v1/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-2.1",
        prompt: formattedPrompt,
        max_tokens_to_sample: 2048,
        temperature: 0.7,
      }),
    });

    console.log('Claude AI response status:', response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Error response from Claude AI:', errorBody);
      if (response.status === 401) {
        return NextResponse.json({ message: 'Authentication error with AI service' }, { status: 500 });
      } else if (response.status === 429) {
        return NextResponse.json({ message: 'AI service quota exceeded' }, { status: 503 });
      } else {
        return NextResponse.json({ message: 'Error communicating with AI service' }, { status: 500 });
      }
    }

    const data = await response.json();
    console.log('Received data from Claude AI:', data);
    if (!data.completion) {
      return NextResponse.json({ message: 'Invalid response from AI service' }, { status: 500 });
    }
    return NextResponse.json({ result: data.completion });
  } catch (error) {
    console.error('Error in generate-meal-plan:', error);
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}