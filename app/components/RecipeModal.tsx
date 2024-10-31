import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

// Make sure this interface matches the one in RecipeCard.tsx
interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  cuisine?: string;
  dietaryRestrictions?: string[];
  imageUrl?: string;
  rating?: number;
  protein?: number;
  difficulty?: string;
}

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  const formatRecipeContent = () => {
    return `
## ${recipe.title}

${recipe.rating ? `**Rating:** ${'★'.repeat(Math.floor(recipe.rating))}${'☆'.repeat(5 - Math.floor(recipe.rating))}\n` : ''}
${recipe.protein ? `**Protein:** ${recipe.protein} g per serving\n` : ''}
${recipe.description ? `**Description:** ${recipe.description}\n` : ''}
${recipe.difficulty ? `**Difficulty:** ${recipe.difficulty}\n` : ''}
${recipe.prepTime ? `**Prep Time:** ${recipe.prepTime} minutes\n` : ''}
${recipe.cookTime ? `**Cook Time:** ${recipe.cookTime} minutes\n` : ''}
${recipe.servings ? `**Servings:** ${recipe.servings}\n` : ''}

<details>
<summary class="collapsible-button ingredients-button">**Ingredients:**</summary>

${recipe.ingredients.map(ingredient => `* ${ingredient}`).join('\n')}

</details>

<details>
<summary class="collapsible-button instructions-button">**Instructions:**</summary>

${recipe.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}

</details>
    `;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
        <div className="mt-3">
          <ReactMarkdown 
            rehypePlugins={[rehypeRaw]}
            components={{
              details: ({ children }) => <details className="mb-4">{children}</details>,
            }}
          >
            {formatRecipeContent()}
          </ReactMarkdown>
          
          <div className="mt-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;