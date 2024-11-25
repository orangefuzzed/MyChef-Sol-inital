import React from 'react';
import { Button, Flex, Text, Heading, Box, Card, Container, ScrollArea } from '@radix-ui/themes';
import { ShoppingCart, Heart, Plus, ChefHat, RefreshCw } from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  rating?: number;
  protein?: number;
  description?: string;
  ingredients: string[];
  instructions: string[];
}

interface RecipeViewProps {
  recipe: Recipe;
}

const RecipeView: React.FC<RecipeViewProps> = ({ recipe }) => {
  return (
    <ScrollArea className="h-screen w-full bg-gray-900">
      <Container size="3" className="py-4">
        <Card className="bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden">
          <Box className="p-6">
            <Heading size="8" className="mb-4 text-center text-white">{recipe.title}</Heading>
            
            <Flex justify="between" align="center" className="mb-4">
              {recipe.rating && (
                <Text size="3" className="text-yellow-500">{'★'.repeat(recipe.rating)}{'☆'.repeat(5 - recipe.rating)}</Text>
              )}
              {recipe.protein && (
                <Text size="3" className="text-gray-300">Protein: {recipe.protein}g per serving</Text>
              )}
            </Flex>
            
            {recipe.description && (
              <Text size="3" className="mb-6 text-gray-300 italic">{recipe.description}</Text>
            )}

            <Box className="mb-6">
              <Heading size="6" className="mb-3 text-white">Ingredients:</Heading>
              <ul className="list-disc pl-5">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-300 mb-1">{ingredient}</li>
                ))}
              </ul>
            </Box>

            <Box className="mb-6">
              <Heading size="6" className="mb-3 text-white">Instructions:</Heading>
              <ol className="list-decimal pl-5">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="text-gray-300 mb-2">{instruction}</li>
                ))}
              </ol>
            </Box>
          </Box>

          <Flex direction="column" className="p-4 bg-gray-700 w-full space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            {[
              { name: 'List', icon: ShoppingCart },
              { name: 'Favorite', icon: Heart },
              { name: 'Save', icon: Plus },
              { name: 'Cook Mode', icon: ChefHat },
              { name: 'Regenerate', icon: RefreshCw }
            ].map(({ name, icon: Icon }) => (
              <Button 
                key={name}
                variant="soft" 
                onClick={() => console.log(`${name} action`)}
                className="flex-1 justify-center items-center py-2 px-3 text-sm"
              >
                <Icon className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{name}</span>
              </Button>
            ))}
          </Flex>
        </Card>
      </Container>
    </ScrollArea>
  );
};

export default RecipeView;