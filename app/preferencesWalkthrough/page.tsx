// app/preferencesWalkthrough/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Header from './../components/Header';
import Footer from './../components/Footer';
import { Button } from '@radix-ui/themes';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Settings, Frown, Meh, Smile, ThumbsUp, Heart, Bot, Fish, Utensils, CookingPot, FilePenLine, HeartPulse } from 'lucide-react';
import RankingSlider from './../components/RankingSlider';
import * as Slider from '@radix-ui/react-slider';
import styles from './PreferencesWalkthrough.module.css';

// Define TypeScript interfaces
interface FieldItem {
  label: string;
  field: string;
  type: string;
  placeholder?: string;
  options?: string[];
}

interface Step {
  section: string;
  fields: FieldItem[];
  icon: JSX.Element;
  notesField?: boolean;
}

interface UserPreferencesInterface {
  cuisinePreferences: string[];
  dietaryPreferences: string[];
  cookingDifficultyPreferences: string[];
  interactionPreferences: string[];
  wellnessImportance: number;
  interactionImportance: number;
  dietaryRestrictions: Array<{
    name: string;
    isAllergy: boolean;
  }>;
  generalPreferencesNotes: string;
  mealPlanningNotes: string;
  cookingPreferencesNotes: string;
  wellnessNotes: string;
  experienceMappingNotes: string;
  // You can add other fields if needed, based on the default values and structure used in your component
}

const steps: Step[] = [
  {
    section: 'General Preferences',
    fields: [
      {
        label: 'Cuisine Types',
        field: 'cuisinePreferences',
        type: 'ranking',
        options: ['Italian', 'Mexican', 'Japanese', 'Indian', 'Chinese', 'French', 'Greek'],
      },
      {
        label: 'Dietary Options',
        field: 'dietaryPreferences',
        type: 'ranking',
        options: ['Vegetarian', 'Vegan', 'Paleo', 'Keto', 'Gluten-Free', 'Halal', 'Kosher'],
      },
      {
        label: 'Dietary Restrictions',
        field: 'dietaryRestrictions',
        type: 'restrictions', // New custom type
        options: ['Gluten', 'Dairy', 'Nuts', 'Shellfish', 'Soy', 'Eggs', 'Fish'],
      },
    ],
    
    icon: <Fish strokeWidth={1.5} className="w-6 h-6 text-white" />,
    notesField: true,
  },
  {
    section: 'Meal Planning & Family Considerations',
    fields: [
      {
        label: 'Meal Planning',
        field: 'mealPlanning',
        placeholder:
          'Describe preferences for meal planning, e.g., number of meals, focus on dinners...',
        type: 'text',
      },
      {
        label: 'Diets',
        field: 'diets',
        placeholder:
          'Mention any specific diets, e.g., high protein, low carb, South Beach diet...',
        type: 'text',
      },
      {
        label: 'Family Considerations',
        field: 'familyConsiderations',
        placeholder: 'Describe family size or preferences, e.g., family of 4, kid-friendly...',
        type: 'text',
      },
    ],
    icon: <CookingPot strokeWidth={1.5} className="w-6 h-6 text-white" />,
    notesField: true,
  },
  {
    section: 'Cooking Preferences',
    fields: [
      {
        label: 'Preferred Cooking Methods',
        field: 'cookingMethods',
        placeholder: 'Select your preferred cooking methods...',
        type: 'checkbox',
        options: ['Baking', 'Grilling', 'Steaming', 'Frying'],
      },
      {
        label: 'Preferred Cooking Difficulty',
        field: 'cookingDifficultyPreferences',
        type: 'ranking',
        options: ['Easy', 'Medium', 'Hard'],
      },
      {
        label: 'Whole/Raw Food vs. Processed',
        field: 'wholeFood',
        placeholder: 'Mention preferences for whole foods over processed items...',
        type: 'text',
      },
    ],
    icon: <HeartPulse strokeWidth={1.5} className="w-6 h-6 text-white"/>,
    notesField: true,
  },
  {
    section: 'Seasonality & Wellness',
    fields: [
      {
        label: 'Seasonality or Location',
        field: 'seasonality',
        placeholder:
          'Mention preferences for in-season ingredients or local availability...',
        type: 'text',
      },
      {
        label: 'User Goals',
        field: 'userGoals',
        placeholder: "Do you have any health or wellness goals you'd like help with?",
        type: 'text',
      },
      {
        label: 'Importance of Wellness Goals',
        field: 'wellnessImportance',
        type: 'slider',
      },
    ],
    icon: <Bot strokeWidth={1.5} className="w-6 h-6 text-white"/>,
    notesField: true,
  },
  {
    section: 'Experience Mapping',
    fields: [
      {
        label: 'Interaction Preferences',
        field: 'interactionPreferences',
        type: 'ranking',
        options: ['Planning', 'Notifications', 'Cooking Guidance', 'Proactive Suggestions'],
      },
      {
        label: 'Interaction Preference Importance',
        field: 'interactionImportance',
        type: 'slider',
      },
      {
        label: 'Experience Mapping',
        field: 'experienceMapping',
        placeholder: 'How do you want the AI to assist you?',
        type: 'checkbox',
        options: ['Planning', 'Notifications', 'Cooking Guidance', 'Proactive Suggestions'],
      },
    ],
    icon: <Utensils strokeWidth={1.5} className="w-6 h-6 text-white"/>,
    notesField: true,
  },
];

const PreferencesWalkthrough = () => {
  const { data: session } = useSession();
  const [preferences, setPreferences] = useState<UserPreferencesInterface>({
    cuisinePreferences: [],
    dietaryPreferences: [],
    cookingDifficultyPreferences: [],
    interactionPreferences: [],
    wellnessImportance: 3,
    interactionImportance: 3,
    dietaryRestrictions: [],
    generalPreferencesNotes: '',
    mealPlanningNotes: '',
    cookingPreferencesNotes: '',
    wellnessNotes: '',
    experienceMappingNotes: '',
  });
  
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Fetch existing preferences on load
    async function fetchPreferences() {
      try {
        if (session?.user?.email) {
          const userEmail = session.user.email;
          const response = await axios.get(`/api/preferences?userEmail=${userEmail}`);
          if (response.data.preferences) {
            // Merge fetched preferences with default preferences
            setPreferences((prev) => ({
              ...prev,
              ...response.data.preferences,
              dietaryRestrictions: response.data.preferences.dietaryRestrictions || [],
            }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch preferences:', error);
      }
    }

    fetchPreferences();
  }, [session]);

  const handleInputChange = (field: keyof UserPreferencesInterface, value: string) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  };  

  const handleCheckboxChange = (field: keyof UserPreferencesInterface, option: string, checked: boolean) => {
    setPreferences((prev) => {
      const updatedValues: string[] = prev[field] as string[] || [];
      if (checked) {
        updatedValues.push(option);
      } else {
        const index = updatedValues.indexOf(option);
        if (index > -1) {
          updatedValues.splice(index, 1);
        }
      }
      return { ...prev, [field]: updatedValues };
    });
  };
  

  const handleRestrictionChange = (
    restriction: string,
    isChecked: boolean,
    isAllergy: boolean = false
  ) => {
    setPreferences((prev) => {
      const updatedRestrictions = Array.isArray(prev.dietaryRestrictions)
        ? [...prev.dietaryRestrictions]
        : [];
    
      const index = updatedRestrictions.findIndex(
        (item) => item.name === restriction
      );
  
      if (isChecked) {
        if (index > -1) {
          updatedRestrictions[index].isAllergy = isAllergy;
        } else {
          updatedRestrictions.push({ name: restriction, isAllergy });
        }
      } else {
        if (index > -1) {
          updatedRestrictions.splice(index, 1);
        }
      }
  
      return { ...prev, dietaryRestrictions: updatedRestrictions };
    });
  };
  

  const handleSliderChange = (field: keyof UserPreferencesInterface, value: number[]) => {
    setPreferences((prev) => ({ ...prev, [field]: value[0] }));
  };  

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSavePreferences = async () => {
    try {
      if (session?.user?.email) {
        const userEmail = session.user.email;
        const preferencesData = {
          userEmail,
          ...preferences,
        };
        await axios.post('/api/preferences', preferencesData);
        alert('Preferences saved successfully!');
      } else {
        alert('User not logged in.');
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
      alert('Failed to save preferences. Please try again.');
    }
  };

  const { section, fields, icon, notesField } = steps[currentStep];

  // Define importance labels, icons, and colors
  const importanceLabels = ['Low', 'Moderate', 'High', 'Very High', 'Critical'];
  const importanceIcons = [
    <Frown key="frown" />,
    <Meh key="meh" />,
    <Smile key="smile" />,
    <ThumbsUp  key="grin-stars" />,
    <Heart key="heart" />
  ];  
  const importanceColors = ['#f43f5e', '#f59e0b', '#22d3ee', '#84cc16', '#84cc16'];

  // Progress calculation
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  // Map section index to notes field in preferences state
  const notesFieldMapping: { [key: number]: string } = {
    0: 'generalPreferencesNotes',
    1: 'mealPlanningNotes',
    2: 'cookingPreferencesNotes',
    3: 'wellnessNotes',
    4: 'experienceMappingNotes',
  };

  return (
    <>
    <div className="flex flex-col h-screen bg-fixed bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/meal-cooking-1.png')" }}
        >
      <Header centralText="Preferences Walkthrough" />
      <div className="flex-grow p-8 overflow-y-auto">
      <div className="flex items-center text-lg font-normal mb-4">
              <div className="flex items-center justify-center mr-2">
                    <Settings strokeWidth={1.5} className="w-6 h-6 text-white" /> 
                  </div>
                <p>Set Your Preferences</p>
            </div>
            <div className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl mb-4">
              {/* Progress Bar */}
              <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <div className="text-white text-sm">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
        
        <div className="mb-4 bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl">
          <h2 className="text-md text-white mb-4 font-normal flex items-center gap-2">
            {icon}
            {section}
          </h2>
          {fields.map((fieldItem: FieldItem) => (
            <div key={fieldItem.field} className="mb-6">
              <h3 className="text-md text-white mb-2 font-normal">{fieldItem.label}:</h3>

              {/* Text Input */}
              {fieldItem.type === 'text' && (
                <textarea
                  className="w-full p-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder={fieldItem.placeholder}
                  value={
                    typeof preferences[fieldItem.field as keyof UserPreferencesInterface] === 'string'
                      ? (preferences[fieldItem.field as keyof UserPreferencesInterface] as string)
                      : ''
                  }
                  onChange={(e) =>
                    handleInputChange(fieldItem.field as keyof UserPreferencesInterface, e.target.value)
                  }
                  rows={3}
                />
              )}
              {/* Checkbox Options */}
              {fieldItem.type === 'checkbox' && fieldItem.options && (
                <div className="flex flex-wrap gap-4">
                  {fieldItem.options.map((option: string) => (
                    <div key={option} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          Array.isArray(preferences[fieldItem.field as keyof UserPreferencesInterface])
                            ? (preferences[fieldItem.field as keyof UserPreferencesInterface] as string[]).includes(option)
                            : false
                        }
                        onChange={(e) =>
                          handleCheckboxChange(fieldItem.field as keyof UserPreferencesInterface, option, e.target.checked)
                        }
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <label className="text-white">{option}</label>
                  </div>
                  ))}
                  
  </div>
)}



              {/* Restrictions Input */}
              {fieldItem.type === 'restrictions' && fieldItem.options && (
                <div className="space-y-4">
                  {fieldItem.options.map((restriction: string) => {
                    const dietaryRestrictions = Array.isArray(preferences.dietaryRestrictions)
                      ? preferences.dietaryRestrictions
                      : [];

                      const existingRestriction = dietaryRestrictions.find(
                        (item: { name: string; isAllergy: boolean }) => item.name === restriction
                      );                      
                    const isChecked = !!existingRestriction;
                    const isAllergy = existingRestriction?.isAllergy || false;

                    return (
                      <div key={restriction} className="flex items-center gap-4">
                        {/* Restriction Checkbox */}
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            handleRestrictionChange(restriction, e.target.checked, isAllergy)
                          }
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <label className="text-white">{restriction}</label>

                        {/* Allergy Checkbox */}
                        {isChecked && (
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isAllergy}
                              onChange={(e) =>
                                handleRestrictionChange(restriction, true, e.target.checked)
                              }
                              className="form-checkbox h-4 w-4 text-red-600"
                            />
                            <label className="text-red-400 text-sm">Allergy</label>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Ranking Slider */}
              {fieldItem.type === 'ranking' && fieldItem.options && (
                <div>
                  {fieldItem.options.map((option: string) => {
                    // Define the item type used in preferences
                    type RankingItem = { name: string; ranking: number };

                    // Type guard to ensure preferences[fieldItem.field] is an array of RankingItems
                    const rankingItems = preferences[fieldItem.field as keyof UserPreferencesInterface];
                    const isRankingItemArray = (
                      value: unknown
                    ): value is RankingItem[] => Array.isArray(value) && value.every(item => 'ranking' in item && 'name' in item);

                    const currentRanking = isRankingItemArray(rankingItems)
                      ? rankingItems.find((item) => item.name === option)?.ranking || 2
                      : 2;

                    const handleRankingChange = (value: number) => {
                      setPreferences((prev) => {
                        const prevValue = prev[fieldItem.field as keyof UserPreferencesInterface] as unknown;
                        const updatedPreferences: RankingItem[] = isRankingItemArray(prevValue)
                          ? [...(prevValue as RankingItem[])]
                          : [];

                        const index = updatedPreferences.findIndex((item) => item.name === option);

                        if (index > -1) {
                          updatedPreferences[index].ranking = value;
                        } else {
                          updatedPreferences.push({ name: option, ranking: value });
                        }

                        return { ...prev, [fieldItem.field]: updatedPreferences };
                      });
                    };

                    return (
                      <RankingSlider
                        key={option}
                        name={option}
                        ranking={currentRanking}
                        onChange={handleRankingChange}
                      />
                    );
                  })}
                </div>
              )}

              {/* Slider Input */}
            {fieldItem.type === 'slider' && (
              <div className={styles.sliderContainer}>
                <label className="text-white mb-2 flex items-center">
                  <span
                    className={styles.sliderIcon}
                    style={{
                      color: importanceColors[
                        (preferences[fieldItem.field as keyof UserPreferencesInterface] as number) - 1
                      ] || '#faad14',
                    }}
                  >
                    {importanceIcons[
                      (preferences[fieldItem.field as keyof UserPreferencesInterface] as number) - 1
                    ] || <Meh />}
                  </span>
                  {fieldItem.label}
                </label>
                <Slider.Root
                  className={styles.SliderRoot}
                  min={1}
                  max={5}
                  step={1}
                  value={[(preferences[fieldItem.field as keyof UserPreferencesInterface] as number) || 3]}
                  onValueChange={(value) =>
                    handleSliderChange(fieldItem.field as keyof UserPreferencesInterface, value)
                  }
                  aria-label={fieldItem.label}
                >
                  <Slider.Track className={styles.SliderTrack}>
                    <Slider.Range className={styles.SliderRange} />
                  </Slider.Track>
                  <Slider.Thumb
                    className={styles.SliderThumb}
                    style={{
                      borderColor: importanceColors[
                        (preferences[fieldItem.field as keyof UserPreferencesInterface] as number) - 1
                      ] || '#faad14',
                    }}
                  />
                </Slider.Root>
                <div
                  className={styles.sliderLabel}
                  style={{
                    color: importanceColors[
                      (preferences[fieldItem.field as keyof UserPreferencesInterface] as number) - 1
                    ] || '#faad14',
                  }}
                >
                  {importanceLabels[
                    (preferences[fieldItem.field as keyof UserPreferencesInterface] as number) - 1
                  ] || 'Moderate'}
                </div>
              </div>
            )}
            </div>
          ))}

          {/* Additional Notes Field */}
          {notesField && (
            <div className="mb-6">
              <h3 className="text-md text-white mb-2 font-medium">Additional Notes</h3>
              <textarea
                className="w-full p-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Any additional considerations or comments?"
                value={
                  typeof preferences[notesFieldMapping[currentStep] as keyof UserPreferencesInterface] ===
                  'string'
                    ? (preferences[notesFieldMapping[currentStep] as keyof UserPreferencesInterface] as string)
                    : ''
                }
                onChange={(e) =>
                handleInputChange(
                  notesFieldMapping[currentStep] as keyof UserPreferencesInterface,
                  e.target.value
                )
              }
              rows={4}
            />
          </div>
        )}

        </div>
        <div className="flex justify-between mt-6">
          {currentStep > 0 && (
            <Button
              size="3"
              className="px-6 py-2 rounded-full bg-gray-600 text-white hover:bg-gray-500 transition-colors duration-200"
              onClick={handleBack}
            >
              Back
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button
              size="3"
              className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200 ml-auto"
              onClick={handleNext}
            >
              Next
            </Button>
          ) : (
            <Button
              size="3"
              className="px-6 py-2 rounded-full bg-green-600 text-white hover:bg-green-500 transition-colors duration-200 ml-auto"
              onClick={handleSavePreferences}
            >
              Save Preferences
            </Button>
          )}
        </div>
      </div>
      <Footer actions={['home', 'save', 'favorite', 'send']} />
    </div>
    </>
  );
};

export default PreferencesWalkthrough;
