const savedRecipeSchema = {
    userId: { type: 'ObjectId', required: true },
    recipeId: { type: 'string', required: true },
    title: { type: 'string', required: true },
    ingredients: { type: 'array', items: { type: 'string' }, required: true },
    instructions: { type: 'array', items: { type: 'string' }, required: true },
    prepTime: { type: 'number' },
    cookTime: { type: 'number' },
    servings: { type: 'number' },
    cuisine: { type: 'string' },
    dietaryRestrictions: { type: 'array', items: { type: 'string' } },
    imageUrl: { type: 'string' },
    rating: { type: 'number', minimum: 0, maximum: 5 },
    dateAdded: { type: 'date', default: Date.now }
  };
  
  module.exports = savedRecipeSchema;