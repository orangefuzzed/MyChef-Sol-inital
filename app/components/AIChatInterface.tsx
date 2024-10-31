'use client';

import React, { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useAIContext } from '../contexts/AIContext';
import { sendMessageToClaude } from '../services/claudeService';
import { MicrophoneIcon } from '@heroicons/react/24/solid';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PersonIcon,
  RocketIcon,
  ExternalLinkIcon,
  PaperPlaneIcon,
} from '@radix-ui/react-icons';
import { Flex, Text } from '@radix-ui/themes';
import { PuffLoader } from 'react-spinners';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import RecipeSuggestions from './RecipeSuggestions';
import { Recipe } from '../../types/Recipe';
import { useRecipeContext } from '../contexts/RecipeContext'; // Import useRecipeContext


interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai' | 'system';
}

// Remove or comment out this interface in AIChatInterface.tsx
/*
interface Recipe {
  id: string;
  title: string;
  description: string;
  mainIngredient: string;
  spicinessLevel: string;
  ingredients: string[];
  instructions: string[];
  imageURL?: string;
}
*/


// TODO: Revisit the use of formatRecipe. Commented out for now until confirmed usage.
// const formatRecipe = (recipe: string) => {
//   return (
//     recipe
//       .replace(/^(.*?)\n/, (match, p1) => `## ${p1}\n\n`)
//       .replace(/\*\*(.*?)\*\*/g, (match, p1) => {
//         if (p1.startsWith('Rating:')) return `\n\n**${p1}**\n`;
//         if (p1.startsWith('Protein:')) return `\n**${p1}**\n`;
//         if (p1.startsWith('Description:')) return `\n**${p1}**\n`;
//         if (p1 === 'Ingredients:') return `\n\n---\n\n**${p1}**\n`;
//         if (p1 === 'Instructions:') return `\n\n---\n\n**${p1}**\n`;
//         return `\n\n**${p1}**\n`;
//       })
//       .replace(/(\d+\. )/g, `\n$1`) + '\n\n---\n'
//   );
// };


const AIChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Thinking...');
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null); // Add state for recipe
  const [currentShoppingList, setCurrentShoppingList] = useState(null);
  const [currentCookMode, setCurrentCookMode] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [currentRecipeList, setCurrentRecipeList] = useState<Recipe[]>([]);

  
  const { setRecipeSuggestions } = useRecipeContext(); // Use recipeSuggestions context

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // **Loading message effect**
  useEffect(() => {
    let interval: number | null = null; // Initialize interval

    if (isLoading) {
      const messages = [
        'Thinking...',
        'Cooking up something special...',
        'Gathering ingredients...',
        'Whisking ideas...',
        'Simmering thoughts...',
        'Just a moment...',
        'Almost ready...',
      ];
      let index = 0;
      interval = window.setInterval(() => {
        setLoadingMessage(messages[index % messages.length]);
        index++;
      }, 3000);
    } else {
      setLoadingMessage('');
    }

    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [isLoading]);

// Function to save the generated recipe to MongoDB
const saveRecipeToDatabase = async (recipe: Recipe) => {
  try {
    const response = await fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipe }),
    });

    if (!response.ok) {
      throw new Error('Failed to save recipe to database');
    }

    console.log('Recipe saved successfully to MongoDB');
  } catch (error) {
    console.error('Error saving recipe to MongoDB:', error);
  }
};


const handleSendMessage = async () => {
  if (inputMessage.trim() === '') return;

  setIsLoading(true);

  try {
    const newMessage: Message = {
      id: messages.length,
      text: inputMessage,
      sender: 'user',
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    const conversationHistory = messages
      .map((msg) => `${msg.sender === 'user' ? 'Human' : 'Assistant'}: ${msg.text}`)
      .join('\n');

    const fullPrompt = `
      ${conversationHistory}
      Human: ${newMessage.text}
      Assistant:
      
      Please provide 5-8 recipe suggestions based on the following user input.

      Respond in the following JSON format:

      {
        "message": "Brief assistant message introducing the suggestions.",
        "recipes": [
          {
            "id": "unique_recipe_id",
            "recipeTitle": "Recipe Title",
            "description": "Brief description",
            "mainIngredient": "chicken or beef",
            "ingredients": ["Ingredient 1", "Ingredient 2"],
            "instructions": ["Step 1", "Step 2"],
            "imageURL": "optional_image_url"
          }
        ]
      }

      Ensure the response is valid JSON with no additional text or commentary outside of the JSON structure.
    `;

    const aiResponse = await sendMessageToClaude(fullPrompt, 'recipe suggestions');

    interface AIResponse {
      message: string;
      recipes: any[]; // Adjust as needed if you know the structure of recipes more specifically
    }
    
    // Parse the AI's response
    let parsedResponse: AIResponse;

    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (error) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('Invalid response structure from Claude API');
    }

    if (!parsedResponse || !parsedResponse.message || !Array.isArray(parsedResponse.recipes)) {
      console.error('Unexpected response structure:', parsedResponse);
      throw new Error('Invalid response structure from Claude API');
    }


    // Update state with the assistant's message and list of recipes
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: messages.length + 1,
        text: parsedResponse.message,
        sender: 'ai',
      },
    ]);

    setRecipeSuggestions(parsedResponse.recipes);
    setCurrentRecipeList(parsedResponse.recipes);

    console.log('Parsed AI Response:', parsedResponse); // Log the parsed response
// Save recipe suggestions to the context
setRecipeSuggestions(parsedResponse.recipes); // Update RecipeContext with the suggestions
setCurrentRecipeList(parsedResponse.recipes);
console.log('Updated Recipe Suggestions:', parsedResponse.recipes);

// Save all recipe suggestions to MongoDB
for (const recipe of parsedResponse.recipes) {
  await saveRecipeToDatabase(recipe); // Reintroduce the save logic
}


    console.log('Updated Recipe Suggestions:', parsedResponse.recipes);

  } catch (error) {
    console.error('An error occurred:', error);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: messages.length + 1,
        text: 'An error occurred while processing your request. Please try again.',
        sender: 'system',
      },
    ]);
  } finally {
    setIsLoading(false);
    setInputMessage('');
  }
};

  
  

  // Add these functions
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  {/*// Action card click handlers
  const handleCreateShoppingList = async () => {
    if (!currentRecipe) {
      console.error('No recipe data available.');
      return;
    }

    setIsLoading(true);

    const followUpPrompt = `
      Based on the following recipe, generate a shopping list as a JSON object with the following structure:
      {
        "ingredients": [
          { "name": "Ingredient Name", "quantity": "Amount" },
          // ... more ingredients
        ],
        "totalItems": X
      }
      - Do **not** include any additional text or commentary.
      - Do **not** include explanations before or after the JSON.
      - **Only** output the JSON object.
      - Ensure the JSON is valid and properly formatted.

      Recipe: ${JSON.stringify(currentRecipe)}
    `;

    let aiResponse; // Declare aiResponse here

    try {
      aiResponse = await sendMessageToClaude(followUpPrompt, 'shoppingList');
      console.log('AI Response:', aiResponse); // Logs the AI response

      const shoppingListData = JSON.parse(aiResponse);
      setCurrentShoppingList(shoppingListData);
      console.log('Updated currentShoppingList:', shoppingListData); // Add this line here

      // Optionally, add a message to the chat
      const newAiMessage: Message = {
        id: messages.length + 1,
        text: "I've generated your shopping list. Click the button below to view it.",
        sender: 'ai',
      };
      setMessages((prevMessages) => [...prevMessages, newAiMessage]);
    } catch (e) {
      console.error('Failed to parse AI response as JSON', e);
      console.error('AI Response that failed to parse:', aiResponse); // Now aiResponse is accessible here

      // Provide feedback to the user
      const errorMessage: Message = {
        id: messages.length + 1,
        text: 'Sorry, I was unable to generate a shopping list due to a technical issue. Please try again.',
        sender: 'ai',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };*/}

  const handleRecipeSelect = async (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    setCurrentRecipeList([]); // Clear the recipe list after selection

    // Optionally, save the recipe to the database here
    try {
      await axios.post('/api/recipes', { recipe });
      console.log('Recipe saved to database');
    } catch (error) {
      console.error('Error saving recipe:', error);
    }

    // Generate shopping list and cook mode content
    setIsLoading(true);

    try {
      // Prepare prompts for Shopping List and Cook Mode
      const shoppingListPrompt = `
        Based on the following recipe, generate a shopping list as a JSON object with the following structure:

        {
          "ingredients": [
            { "name": "Ingredient Name", "quantity": "Amount" },
            // ... more ingredients
          ],
          "totalItems": X
        }

        - Do **not** include any additional text or commentary.
        - Do **not** include explanations before or after the JSON.
        - **Only** output the JSON object.
        - Ensure the JSON is valid and properly formatted.

        Recipe: ${JSON.stringify(recipe)}
      `;

      const cookModePrompt = `
        Guide me through the step-by-step cooking process for the following recipe. Include the amount of each ingredient in the corresponding step.

        Please format your response using markdown with **bold** section titles (e.g., **Ingredients**, **Equipment**). Use bullet points for ingredients and equipment. For each step, prefix it with **Step 1**, **Step 2**, etc., and add spacing between each step for readability.

        Recipe: ${JSON.stringify(recipe)}
      `;

      // Send prompts in parallel
      const [shoppingListResponse, cookModeResponse] = await Promise.all([
        sendMessageToClaude(shoppingListPrompt, 'shoppingList'),
        sendMessageToClaude(cookModePrompt, 'cookMode'),
      ]);

      // Parse and set the shopping list
      const shoppingListData = JSON.parse(shoppingListResponse);
      setCurrentShoppingList(shoppingListData);

      // Store Cook Mode Content
      setCurrentCookMode(cookModeResponse);

      // Optionally, add a message to the chat
      const newAiMessage: Message = {
        id: messages.length + 1,
        text: `Great choice! I've prepared the shopping list and cooking instructions for "${recipe.recipeTitle}". Use the action buttons below to proceed.`,
        sender: 'ai',
      };
      setMessages((prevMessages) => [...prevMessages, newAiMessage]);
    } catch (error) {
      console.error('An error occurred:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: messages.length + 1,
          text: 'An error occurred while processing your request. Please try again.',
          sender: 'system',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }; // <-- Added closing brace here

  const handleAddToMealPlan = async () => {
    const followUpPrompt = `Add the last recipe you provided to my meal plan.`;
    const aiResponse = await sendMessageToClaude(followUpPrompt, 'addToMealPlan');
    console.log('Added to Meal Plan:', aiResponse);
  };

  const renderActionCards = () => {
    console.log('Checking currentRecipe in renderActionCards:', currentRecipe);
    console.log('Rendering action cards. currentShoppingList:', currentShoppingList);
    console.log('Current Cook Mode:', currentCookMode);

    if (currentRecipe) {
      return (
        <div className="action-cards flex gap-4 mt-4">
          {/* View Shopping List Button */}
          {currentShoppingList && (
            <Link
              href={{
                pathname: `/shopping-list`,
                query: { shoppingListData: JSON.stringify(currentShoppingList) },
              }}
            >
              <button className="p-2 px-6 bg-slate-700 rounded-full text-white flex items-center gap-2">
                View Shopping List
                <ExternalLinkIcon className="w-5 h-5" />
              </button>
            </Link>
          )}

          {/* View in Cook Mode Button */}
          {currentCookMode && (
            <Link
              href={{
                pathname: `/cook-mode`,
                query: { cookModeData: currentCookMode },
              }}
            >
              <button className="p-2 px-6 bg-slate-700 rounded-full text-white flex items-center gap-2">
                View in Cook Mode
                <ExternalLinkIcon className="w-5 h-5" />
              </button>
            </Link>
          )}

          {/* Other Action Buttons */}
          <button className="p-2 px-6 bg-slate-700 rounded-full text-white" onClick={handleAddToMealPlan}>
            Add to Meal Plan
          </button>
          
{currentRecipe && (
  <Link
    href={{
      pathname: `/recipe-view`,
      query: { recipeData: JSON.stringify(currentRecipe) },
    }}
  >
    <button className="p-2 px-6 bg-slate-700 rounded-full text-white flex items-center gap-2">
      View Recipe
      <ExternalLinkIcon className="w-5 h-5" />
    </button>
  </Link>
)}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Header centralText="MyChef AI Chat" />
      <div className="flex flex-col h-screen bg-gray-900 text-white">
        {/* Top Bar 
        <div className="flex justify-between items-center p-4 bg-gray-800">
          <button className="p-2 bg-white rounded-full">
            <HamburgerMenuIcon className="h-6 w-6 text-black" />
          </button>
          <div className="px-4 py-2 bg-gray-800 text-white border border-white rounded-full">
            MyChef
          </div>
          <button className="p-2 bg-white rounded-full">
            <Pencil2Icon className="h-6 w-6 text-black" />
          </button>
        </div>*/}


        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center mb-2">
                  {message.sender === 'user' ? (
                    <>
                      <span className="text-sm mr-2">Me</span>
                      <div className="rounded-full bg-[#DD005F] p-1">
                        <PersonIcon className="h-4 w-4 text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-full bg-gray-700 p-1 mr-2">
                        <RocketIcon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm">MyChef</span>
                    </>
                  )}
                </div>
                <div
                  className={`max-w-lg p-3 rounded-3xl ${
                    message.sender === 'user' ? 'bg-white text-black' : 'bg-gray-700 text-white'
                  }`}
                >
                  {message.sender === 'user' ? (
                    message.text
                  ) : (
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{message.text}</ReactMarkdown>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <Flex align="center" gap="4">
                <PuffLoader size={24} color="#15f992" />
                <Text size="2" style={{ color: 'white' }}>
                  {loadingMessage}
                </Text>
              </Flex>
            </div>
          )}

          <div ref={messagesEndRef} />

          {/* Recipe Suggestions */}
{currentRecipeList.length > 0 ? (
  <RecipeSuggestions recipes={currentRecipeList} onSelect={handleRecipeSelect} />
) : (
  <p>No recipe suggestions to show.</p>
)}


          {/* Ensure action cards render */}
          {!isLoading && renderActionCards()} {/* Only display action cards if not loading */}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-800">
          <div className="flex items-center bg-white rounded-full p-2">
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="...ask me for a great recipe"
              className="flex-1 bg-transparent text-black placeholder-gray-400 focus:outline-none"
              disabled={isLoading}
            />
            <div className="flex space-x-2">
              <button className="p-1 text-gray-400">
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button className="p-1 text-gray-400">
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={() => handleSendMessage()}
              className="p-3 rounded-full bg-[#CA244D] text-white ml-2"
              disabled={isLoading}
            >
              <PaperPlaneIcon className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full bg-[#ffffff] text-black ml-2">
              <MicrophoneIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      <Footer actions={['home', 'save', 'favorite', 'send']} />
    </>
  );
};

export default AIChatInterface;
