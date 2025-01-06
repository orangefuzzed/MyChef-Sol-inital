import { NextResponse } from 'next/server';
import { fetchClaudeResponse } from './../../utils/aiUtils';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { recipe } = await request.json();

    if (!recipe) {
      return NextResponse.json({ error: 'No recipe provided' }, { status: 400 });
    }

    const prompt = `
      Based on the following recipe, suggest one side dish or side salad (whichever is appropriate), and one drink pairing (if appropriate):
      - Recipe: ${recipe.recipeTitle}
      - Description: ${recipe.description}
      - Ingredients: ${recipe.ingredients.join(', ')}

      Please respond in the following JSON format:
      {
        "message": "A brief conversational and friendly assistant message introducing the pairings.",
        "pairings": [
          {
            "type": "side",
            "recipeTitle": "Side Dish Title",
            "description": "Brief description of the side dish.",
            "ingredients": ["Ingredient 1", "Ingredient 2"],
            "instructions": ["Step 1", "Step 2"]
          },
          {
            "type": "drink",
            "recipeTitle": "Drink Title",
            "description": "Brief description of the drink pairing.",
            "ingredients": ["Ingredient 1", "Ingredient 2"],
            "instructions": ["Step 1", "Step 2"]
          }
        ]
      }

      Ensure the response is valid JSON with no additional text or commentary outside of the JSON structure.
    `;

    const aiResponse = await fetchClaudeResponse(prompt);

    if (!aiResponse || !aiResponse.messages) {
      throw new Error('Invalid response from Claude API.');
    }

    const reply = aiResponse.messages[0]?.content || '';
    return NextResponse.json({
      status: 'success',
      message: 'Pairings generated successfully!',
      data: JSON.parse(reply),
    });
} catch (error) {
    let errorMessage = 'Error communicating with Claude';
    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage = `Claude API returned an error: Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        errorMessage = 'No response received from Claude API';
      } else {
        errorMessage = `Error in request setup: ${error.message}`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error('Error in Claude API route:', errorMessage);

    return NextResponse.json({
      status: 'error',
      message: errorMessage
    }, { status: 500 });
  }
}
