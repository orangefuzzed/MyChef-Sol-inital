'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import styles from './preferences.module.css'; // Import the CSS module and make a change for no reason other than to mess with git
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Bot, Fish, Utensils, CookingPot, FilePenLine, HeartPulse, Settings } from 'lucide-react';
import Image from 'next/image';


interface Preference {
  name: string;
  ranking: number;
}

interface DietaryRestriction {
  name: string;
  isAllergy: boolean;
}

interface UserPreferences {
  userEmail: string;
  cuisinePreferences: Preference[];
  dietaryPreferences: Preference[];
  cookingDifficultyPreferences: Preference[];
  interactionPreferences: Preference[];
  dietaryRestrictions: DietaryRestriction[];
  mealPlanning?: string;
  diets?: string;
  familyConsiderations?: string;
  cookingMethods?: string[];
  wholeFood?: string;
  seasonality?: string;
  userGoals?: string;
  wellnessImportance?: number;
  interactionImportance?: number;
  experienceMapping?: string[];
  generalPreferencesNotes?: string;
  mealPlanningNotes?: string;
  cookingPreferencesNotes?: string;
  wellnessNotes?: string;
  experienceMappingNotes?: string;
}

const PreferencesPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user?.email) {
      // Redirect to login if not authenticated
      router.push('/api/auth/signin');
      return;
    }

    // Fetch user preferences
    const fetchPreferences = async () => {
      try {
        const response = await axios.get('/api/preferences');
        setPreferences(response.data.preferences);
      } catch (error) {
        console.error('Failed to fetch preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [session, status, router]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading preferences...</p>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div
        className="flex flex-col items-center justify-center h-screen bg-fixed bg-cover"
        style={{ backgroundImage: "url('/images/meal-cooking-1.png')" }}
      >
        {/* Main Container */}
        <div className="flex flex-col items-center justify-center space-y-6 bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-4 m-6 rounded-2xl">
          {/* Chef Whiskington Icon */}
          <div className="relative bg-black w-20 h-20 border border-white rounded-full flex items-center justify-center">
            <Image
              src="/images/kAi.png"
              alt="Dishcovery Icon"
              width={60}
              height={60}
              className="mb-2"
            />
          </div>
  
          {/* Content */}
          <p className="text-center text-base font-medium text-sky-50">
            Oops! You don't have any preferences set yet. Your preferences helps kAi
            to create and deliver tailored recipes for your dietary needs - would you like to
            set them now?
          </p>
  
          {/* Button */}
          <Link href="/preferencesWalkthrough">
            <button className="text-sm p-2 px-6 bg-pink-800/50 border border-sky-50 shadow-lg ring-1 ring-black/5 rounded-full text-sky-50 flex items-center gap-2">
              Set Your Preferences
              <Settings className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    );
  }
  

  {/*// Helper function to display rankings
  const formatPreferences = (prefs: Preference[]) =>
    prefs
      .sort((a, b) => a.ranking - b.ranking)
      .map((pref) => `${pref.name} (Ranking: ${pref.ranking})`)
      .join(', ');*/}

      // Convert ranking to stars with appropriate colors
  const getStars = (ranking: number) => {
    const colors = ['text-rose-500', 'text-amber-500', 'text-cyan-400', 'text-lime-500'];
    const stars = '★'.repeat(ranking).padEnd(4, '☆'); // Ensure all ratings show 3 stars for consistency
    const color = colors[ranking - 1] || 'text-gray-500'; // Fallback for invalid rankings

    return <span className={`text-sm ${color}`}>{stars}</span>;
  };


  return (
    <div className="flex flex-col h-screen bg-fixed bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/meal-cooking-1.png')" }}
        >
      <Header centralText="Your Preferences" />
      <div className="flex-grow p-8 overflow-y-auto">
        <div className={styles.sectionsContainer}>

          {/* Edit Preferences Button */}
          <Link className="flex justify-end" href="/preferencesWalkthrough">
              <button className="text-xs flex p-2 px-4 bg-pink-800/40 border border-sky-50 shadow-lg ring-1 ring-black/5 rounded-full text-sky-50 items-center gap-2 -mt-2 -mb-2">
                Edit Preferences
                <FilePenLine className="w-4 h-4" />
              </button>
            </Link>

          {/* Dietary Preferences Section */}
          <section className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl">
          
            {/* Dietary Preferences Title and Content */}
            <div className="flex items-center text-lg font-light mb-2">
            <div className="bg-[#00a39e] w-8 h-8 border border-white rounded-full flex items-center justify-center mr-2">
                  <Fish strokeWidth={1.5} className="w-5 h-5 text-white" /> {/* Example icon, you can change this */}
                </div>
              <p>General Preferences</p>
            </div>
            <div className="mt-4">
              <p className="mt-2 text-base font-medium mb-2">Cuisine Preferences:</p>
                {preferences.cuisinePreferences.length > 0 ? (
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sky-50">
                    {preferences.cuisinePreferences.map((preference, index) => (
                      <li key={index} className="text-sm">
                        <span>{preference.name}: </span>
                        {getStars(preference.ranking)}
                      </li>
                    ))}
                  </ul>
                ) : (
              <p className="mt-2 text-sm text-gray-500">None specified</p>
              )}
            </div>

            {/* Dietary Preferences */}
              <section className="mt-4">
                <p className="text-base font-medium mb-2">Dietary Preferences</p>
                {preferences.dietaryPreferences.length > 0 ? (
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sky-50">
                    {preferences.dietaryPreferences.map((preference, index) => (
                      <li key={index} className="text-sm">
                        <span>{preference.name}: </span>
                        {getStars(preference.ranking)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">None specified</p>
                )}
              </section>

              {/* Dietary Restrictions */}
              <section className="mt-4">
                <p className="text-base font-medium mb-2">Dietary Restrictions</p>
                {preferences.dietaryRestrictions.length > 0 ? (
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sky-50">
                    {preferences.dietaryRestrictions.map((restriction, index) => (
                      <li key={index} className="text-sm">
                        {restriction.name} ({restriction.isAllergy ? 'Allergy' : 'Preference'})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">None</p>
                )}
              </section>

              {/* Diets */}
              <section className="mt-4">
                <p className="text-base font-medium mb-2">Diets</p>
                {preferences.diets ? (
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sky-50">
                    {preferences.diets.split(',').map((diet, index) => (
                      <li key={index} className="text-sm">{diet.trim()}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">None specified</p>
                )}
              </section>
          </section>

          {/* Cooking Preferences Section */}
          <section className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl">
            <div className="flex items-center text-lg font-light mb-2">
            <div className="bg-[#00a39e] w-8 h-8 border border-white rounded-full flex items-center justify-center mr-2">
                  <CookingPot strokeWidth={1.5} className="w-5 h-5 text-white" /> {/* Example icon, you can change this */}
                </div>
              <p>Cooking Preferences</p>
            </div>
            {/* Cooking Difficulty Preferences */}
              <section className="mt-4">
              <p className="mt-2 text-base font-medium mb-2">Cooking Difficulty Preferences:</p>
                {preferences.cookingDifficultyPreferences.length > 0 ? (
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sky-50">
                    {preferences.cookingDifficultyPreferences.map((preference, index) => (
                      <li key={index} className="text-sm">
                        <span>{preference.name}: </span>
                        {getStars(preference.ranking)} {/* Add the stars here */}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">None specified</p>
                )}
              </section>

            {/* Cooking Methods */}
            <section className="mt-4">
              <p className="text-base font-medium mb-2">Cooking Methods</p>
              {preferences.cookingMethods && preferences.cookingMethods.length > 0 ? (
                <ul className="list-disc list-inside mt-2 space-y-1 text-sky-50">
                  {preferences.cookingMethods.map((method, index) => (
                    <li key={index} className="text-sm">{method}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-gray-500">No preference</p>
              )}
            </section>
            <section className="mt-4">
              <p className="mt-2 text-base font-medium text-sky-50 mb-2">Cooking Preferences Notes:</p>
                {preferences.cookingPreferencesNotes || 'None'}
            </section>
          </section>

          {/* Wellness Goals Section */}
          <section className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl">
            <div className="flex items-center text-lg font-light mb-2">
            <div className="bg-[#00a39e] w-8 h-8 border border-white rounded-full flex items-center justify-center mr-2">
                  <HeartPulse strokeWidth={1.5} className="w-5 h-5 text-white" /> {/* Example icon, you can change this */}
                </div>
              <p>Wellness Goals</p>
            </div>
            <div className={styles.preferenceItem}>
              <p className="text-base font-medium text-white mb-2">User Goals:</p> {preferences.userGoals || 'None specified'}
            </div>
            <div className={styles.preferenceItem}>
              <p className="mt-2 text-base font-medium text-white mb-2">Wellness Importance:</p> {' '}
              {preferences.wellnessImportance || 'Not specified'}
            </div>
            <div className={styles.preferenceItem}>
              <p className="mt-2 text-base font-medium text-white mb-2">Wellness Notes:</p> {preferences.wellnessNotes || 'None'}
            </div>
          </section>

          {/* Interaction Preferences Section */}
          <section className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl">
            <div className="flex items-center text-lg font-light mb-2">
            <div className="bg-[#00a39e] w-8 h-8 border border-white rounded-full flex items-center justify-center mr-2">
                  <Bot strokeWidth={1.5} className="w-5 h-5 text-white" /> {/* Example icon, you can change this */}
                </div>
              <p>Interaction Preferences</p>
            </div>
            <div className="mt-4">
              <p className="mt-2 text-base font-medium mb-2">Interaction Preferences:</p>
              {preferences.interactionPreferences.length > 0 ? (
                <ul className="list-disc list-inside mt-2 space-y-1 text-sky-50">
                  {preferences.interactionPreferences.map((preference, index) => (
                    <li key={index} className="text-sm">
                      <span>{preference.name}: </span>
                      {getStars(preference.ranking)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-gray-500">None specified</p>
              )}
            </div>

            <div className={styles.preferenceItem}>
              <p className="mt-2 text-base font-medium text-white mb-2">Interaction Importance:</p> {' '}
              {preferences.interactionImportance || 'Not specified'}
            </div>
            {/* Experience Mapping */}
            <section className="mt-4">
              <p className="text-base font-medium mb-2">Experience Mapping</p>
              {preferences.experienceMapping && preferences.experienceMapping.length > 0 ? (
                <ul className="list-disc list-inside mt-2 space-y-1 text-sky-50">
                  {preferences.experienceMapping.map((experience, index) => (
                    <li key={index} className="text-sm">{experience}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-gray-500">None</p>
              )}
            </section>

            <div className="text-base font-medium mt-2">
              <p className="text-base font-medium text-white mt-2 mb-2">Experience Mapping Notes:</p> {' '}
             
            </div>
            <div className={styles.preferenceItem}>
              <p className="mt-2 text-base font-medium text-white mt-2 mb-2"></p> {' '}
              {preferences.experienceMappingNotes || 'None'}
            </div>
          </section>

          {/* Additional Notes Section */}
          <section className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl">
            <div className="flex items-center text-lg font-light mb-2">
            <div className="bg-[#00a39e] w-8 h-8 border border-white rounded-full flex items-center justify-center mr-2">
                  <Utensils strokeWidth={1.5} className="w-5 h-5 text-white" /> {/* Example icon, you can change this */}
                </div>
              <p>Additional Notes</p>
            </div>
            <div className={styles.preferenceItem}>
              <p className="mt-2 text-base font-medium text-white mt-2 mb-2">General Preferences Notes:</p> {' '}
              {preferences.generalPreferencesNotes || 'None'}
            </div>
          </section>
        </div>
      </div>
      <Footer actions={["home", "send"]} />
    </div>
  );
};

export default PreferencesPage;
