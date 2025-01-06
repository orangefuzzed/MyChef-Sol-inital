import React from 'react';
import { Recipe } from './../../types/Recipe';

interface PairingsCardProps {
  pairing: Recipe;
}

export const PairingsCard: React.FC<PairingsCardProps> = ({ pairing }) => {
  return (
    <div className="pairings-card bg-gray-800 p-4 rounded-lg mb-4">
      <h4 className="text-lg font-bold">{pairing.recipeTitle}</h4>
      <p className="text-yellow-400">{pairing.description}</p>
      <div className="actions">
        <button className="btn-save">Save</button>
        <button className="btn-favorite">Favorite</button>
      </div>
    </div>
  );
};
