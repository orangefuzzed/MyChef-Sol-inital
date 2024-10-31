export interface RecipeResponse {
  id: string;
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  imageURL?: string;
  userEmail: string;
  createdAt?: Date;
  updatedAt?: Date;
}
