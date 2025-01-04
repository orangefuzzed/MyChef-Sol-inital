'use client';

import React, { useState } from 'react';
import { usePreferencesContext } from '../contexts/PreferencesContext'; // Import context
import AdventureScaleSlider from './AdventureScaleSlider';
import DietaryRestrictions from './DietaryRestrictions';
import CookingStyleCheckboxes from './CookingStyleCheckboxes';
import PreferencesPreview from './PreferencesPreview';
import GetStartedModal from './GetStartedModal';
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

  const slides = [
    {
      title: 'Who’s in Your Kitchen?',
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
      title: 'Adventure Scale',
      content: (
        <div>
          <AdventureScaleSlider
            value={preferences.adventureScale}
            onChange={(value) =>
              setPreferences((prev) => ({ ...prev, adventureScale: value }))
            }
          />
        </div>
      ),
    },
    {
      title: 'Dietary Restrictions',
      content: (
        <div>
          <DietaryRestrictions
            selected={preferences.dietaryRestrictions}
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

  const handleNextSlide = () => {
    setCurrentSlideIndex((prevIndex) => Math.min(prevIndex + 1, slides.length - 1));
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

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
