import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import MealPlanning from '../app/meal-planning/page'


// Mock the fetch function
global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ result: 'Mocked meal plan' }),
    })
  ) as jest.Mock;
  
  describe('MealPlanning', () => {
    it('renders the meal planning form', () => {
      render(<MealPlanning />)
      expect(screen.getByText('Meal Planning')).toBeInTheDocument()
      expect(screen.getByText('Dietary Restrictions')).toBeInTheDocument()
      expect(screen.getByText('Meals per Day')).toBeInTheDocument()
      expect(screen.getByText('Cuisine Preference')).toBeInTheDocument()
      expect(screen.getByText('Generate Meal Plan')).toBeInTheDocument()
    })
  
    it('generates a meal plan when the button is clicked', async () => {
      render(<MealPlanning />)
      fireEvent.click(screen.getByText('Generate Meal Plan'))
      await waitFor(() => expect(screen.getByText('Your Meal Plan:')).toBeInTheDocument())
      expect(screen.getByText('Mocked meal plan')).toBeInTheDocument()
    })
  
    it('generates a shopping list when the button is clicked', async () => {
      render(<MealPlanning />)
      fireEvent.click(screen.getByText('Generate Meal Plan'))
      await waitFor(() => expect(screen.getByText('Your Meal Plan:')).toBeInTheDocument())
      fireEvent.click(screen.getByText('Generate Shopping List'))
      await waitFor(() => expect(screen.getByText('Shopping List:')).toBeInTheDocument())
    })
  
    it('saves a meal plan', async () => {
      render(<MealPlanning />)
      fireEvent.click(screen.getByText('Generate Meal Plan'))
      await waitFor(() => expect(screen.getByText('Your Meal Plan:')).toBeInTheDocument())
      fireEvent.click(screen.getByText('Save Meal Plan'))
      expect(screen.getByText('Saved Meal Plans')).toBeInTheDocument()
    })
  })