'use client';

import React, { useState } from 'react';
import { usePreferencesContext } from '../contexts/PreferencesContext'; // Import context
import ScheduleCheckBoxes from './ScheduleCheckBoxes';
import DietaryRestrictions from './DietaryRestrictions';
import LocationPreferences from './LocationPreferences';
import CookingStyleCheckboxes from './CookingStyleCheckboxes';
import IngredientsCheckBoxes from './IngredientsCheckBoxes';
import PreferencesPreview from './PreferencesPreview';
import GetStartedModal from './GetStartedModal';
import IntroSlide from './IntroSlide';
import Toast from './../components/Toast'; // Import Toast

interface PreferencesFlowProps {
  isOpen: boolean; // Whether the modal is open
  onClose: () => void; // Function to close the modal
}

const PreferencesFlow: React.FC<PreferencesFlowProps> = ({ isOpen, onClose }) => {
  const { preferences, setPreferences, fetchPreferences } = usePreferencesContext(); // Use context
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [toastList, setToastList] = useState<
    { id: number; message: string; type: 'success' | 'error' }[]
  >([]);

  const handleSavePreferences = async () => {
    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        addToast('Preferences saved successfully!', 'success');
        fetchPreferences(); // Refresh preferences from backend
        onClose(); // Close the modal
      } else {
        addToast('Failed to save preferences.', 'error');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      addToast('An error occurred while saving preferences.', 'error');
    }
  };

  const addToast = (message: string, type: 'success' | 'error') => {
    const id = new Date().getTime();
    setToastList((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToastList((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prevIndex) => Math.min(prevIndex + 1, slides.length - 1));
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const slides = [
    {
      title: '',
      content: <IntroSlide onNext={handleNextSlide} />, // Hook in the intro slide
    },
    {
      title: '',
      content: (
        <div>
          <CookingStyleCheckboxes
            selectedStyles={preferences.cookingStyle}
            onChange={(value) =>
              setPreferences((prev) => ({ ...prev, cookingStyle: value }))
            }
          />
        </div>
      ),
    },
    {
      title: '',
      content: (
        <div>
          <ScheduleCheckBoxes
            selectedOptions={preferences.schedule}
            onChange={(value) =>
              setPreferences((prev) => ({ ...prev, schedule: value }))
            }
          />
        </div>
      ),
    },
    {
      title: '',
      content: (
        <div>
          <IngredientsCheckBoxes
            selectedIngredients={preferences.ingredients}
            onChange={(value) =>
              setPreferences((prev) => ({ ...prev, ingredients: value }))
            }
          />
        </div>
      ),
    },
    {
      title: '',
      content: (
        <div>
          <LocationPreferences
            country={preferences.location?.country || ''}
            measurementSystem={preferences.location?.measurementSystem || ''}
            highAltitude={!!preferences.location?.highAltitude} // Ensure boolean
            onCountryChange={(value) =>
              setPreferences((prev) => ({
                ...prev,
                location: {
                  ...prev.location,
                  country: value,
                },
              }))
            }
            onMeasurementSystemChange={(value) =>
              setPreferences((prev) => ({
                ...prev,
                location: {
                  ...prev.location,
                  measurementSystem: value,
                },
              }))
            }
            onHighAltitudeChange={(value) =>
              setPreferences((prev) => ({
                ...prev,
                location: {
                  ...prev.location,
                  highAltitude: !!value, // Ensure boolean
                },
              }))
            }
          />
        </div>
      ),
    },
    {
      title: '',
      content: (
        <div>
          <DietaryRestrictions
            selectedRestrictions={preferences.dietaryRestrictions}
            onChange={(value) =>
              setPreferences((prev) => ({ ...prev, dietaryRestrictions: value }))
            }
          />
        </div>
      ),
    },
    {
      title: 'Preview Preferences',
      content: (
        <div>
          <PreferencesPreview
            preferences={preferences}
            onSavePreferences={handleSavePreferences}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Toast Container */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-4">
        {toastList.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => setToastList((prev) => prev.filter((t) => t.id !== toast.id))}
          />
        ))}
      </div>

      {/* Preferences Modal */}
      {isOpen && (
        <GetStartedModal
          isOpen={isOpen}
          onClose={onClose}
          slides={slides}
          currentSlideIndex={currentSlideIndex}
          onNext={handleNextSlide}
          onPrev={handlePrevSlide}
        />
      )}
    </div>
  );
};

export default PreferencesFlow;
