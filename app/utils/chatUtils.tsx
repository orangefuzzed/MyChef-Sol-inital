// chatUtils.tsx

// Utility to handle errors centrally
export const handleError = (error: unknown, messageId: number, setMessages: Function, setIsLoading: Function) => {
    console.error('An error occurred:', error);
  
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const errorResponse = (error as { response: { status: number } }).response;
  
      if (errorResponse.status === 529) {
        setMessages((prevMessages: any[]) => [
          ...prevMessages,
          {
            id: messageId,
            text: 'Woops, looks like we ran into some heavy traffic. Click Get More Suggestions again to retry...',
            sender: 'system',
          },
        ]);
      }
    } else if (error instanceof Error && error.message.includes('Invalid response structure')) {
      setMessages((prevMessages: any[]) => [
        ...prevMessages,
        {
          id: messageId,
          text: 'Whoops! It seems the chef was cut off mid-sentece. Click "Continue" to let the chef finish its response.',
          sender: 'system',
        },
      ]);
    } else {
      setMessages((prevMessages: any[]) => [
        ...prevMessages,
        {
          id: messageId,
          text: 'An error occurred while processing your request. Please try again.',
          sender: 'system',
        },
      ]);
    }
  
    setIsLoading(false);
  };
  
  // Utility to generate prompts for AI interaction
  export const generatePrompt = (conversationHistory: string, message: string, promptType: string): string => {
    const commonPromptPart = `
      ${conversationHistory}
      Human: ${message}
      Assistant:
    `;
  
    switch (promptType) {
      case 'sendMessage':
        return `
          ${commonPromptPart}
          Please provide 3 recipe suggestions based on the following user input.
          
          Respond in the following JSON format:
          {
            "message": "Brief assistant message introducing the suggestions.",
            "recipes": [
              {
                "id": "unique_recipe_id",
                "recipeTitle": "Recipe Title",
                "rating": "★★★★☆",
                "protein": "X g",
                "description": "Brief description",
                "ingredients": ["Ingredient 1", "Ingredient 2"],
                "instructions": ["Step 1", "Step 2"]
              }
            ]
          }
          
          Ensure the response is valid JSON with no additional text or commentary outside of the JSON structure.
        `;
      case 'regenerateResponse':
        return `
          ${commonPromptPart}
          Please generate 4 new and different recipe suggestions for the user's request.
  
          Respond in the same JSON format as before.
        `;
      case 'continueResponse':
        return `
          ${message}
          Please continue from where you left off.
        `;
      default:
        return '';
    }
  };
  
  // Utility to format conversation history
  export const formatConversationHistory = (messages: any[]): string => {
    return messages
      .map((msg) => `${msg.sender === 'user' ? 'Human' : 'Assistant'}: ${msg.text}`)
      .join('\n');
  };
  
  export const parseAIResponse = (aiResponse: string) => {
    try {
      const parsedResponse = JSON.parse(aiResponse);
  
      if (
        !parsedResponse ||
        typeof parsedResponse !== 'object' ||
        !parsedResponse.message ||
        !Array.isArray(parsedResponse.recipes)
      ) {
        throw new Error('Invalid response structure from Claude API');
      }
  
      return parsedResponse;
    } catch (error) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('Invalid response structure from Claude API');
    }
  };
  

  