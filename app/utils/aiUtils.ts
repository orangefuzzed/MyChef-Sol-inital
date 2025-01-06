import axios from 'axios';

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'; // Correct Claude API endpoint

// Fetch response from Claude
export async function fetchClaudeResponse(prompt: string): Promise<any> {
  try {
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 3072, // Adjust token limit as needed
        messages: [
          {
            role: "user",
            content: prompt,
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error in fetchClaudeResponse:', error);
    throw new Error('Failed to fetch Claude response.');
  }
}
