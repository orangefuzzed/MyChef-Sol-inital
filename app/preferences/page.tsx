'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { FaLeaf, FaChild, FaUtensils, FaHeartbeat, FaClipboardList } from 'react-icons/fa';
import styles from './preferences.module.css'; // Import the CSS module and make a change for no reason other than to mess with git
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Salad, Clock, Soup, Bookmark, FilePenLine } from 'lucide-react';

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
      <div className={styles.noPreferencesContainer}>
        <p>No preferences found.</p>
        <Link href="/preferencesWalkthrough">
          <button className={styles.editButton}>Set Your Preferences</button>
        </Link>
      </div>
    );
  }

  // Helper function to display rankings
  const formatPreferences = (prefs: Preference[]) =>
    prefs
      .sort((a, b) => a.ranking - b.ranking)
      .map((pref) => `${pref.name} (Ranking: ${pref.ranking})`)
      .join(', ');

  return (
    <div className="flex flex-col h-screen bg-fixed bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/meal-cooking-1.png')" }}
        >
      <Header centralText="Your Preferences" />
      <div className="flex-grow p-8 overflow-y-auto">
        <div className={styles.sectionsContainer}>

          {/* Dietary Preferences Section */}
          <section className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 pt-2 pb-6 px-6 rounded-2xl">
            {/* Edit Preferences Button */}
            <Link href="/preferencesWalkthrough">
              <button className="justify-end p-2 px-6 bg-pink-800/50 border border-sky-50 shadow-lg ring-1 ring-black/5 rounded-full text-sky-50 flex items-center gap-2 mb-2">
                Edit Preferences
                <FilePenLine className="w-5 h-5" />
              </button>
            </Link>
            {/* Dietary Preferences Title and Content */}
            <div className="flex items-center text-lg font-semibold mb-2">
            <div className="bg-[#00a39e] w-8 h-8 border border-white rounded-full flex items-center justify-center mb-2 mr-2">
                  <Soup strokeWidth={1.5} className="w-4 h-4 text-white" /> {/* Example icon, you can change this */}
                </div>
              <h2>Dietary Preferences</h2>
            </div>
            <div className="mt-4">
              <strong className="text-lg font-semibold">Cuisine Preferences:</strong>
              {preferences.cuisinePreferences.length > 0 ? (
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  {preferences.cuisinePreferences.map((preference, index) => (
                    <li key={index} className="text-sm">
                      {preference.name} (Ranking: {preference.ranking})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-gray-500">None specified</p>
              )}
            </div>

            {/* Dietary Preferences */}
              <section className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Dietary Preferences</h3>
                {preferences.dietaryPreferences.length > 0 ? (
                  <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                    {preferences.dietaryPreferences.map((preference, index) => (
                      <li key={index} className="text-sm">
                        {preference.name} (Ranking: {preference.ranking})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">None specified</p>
                )}
              </section>

              {/* Dietary Restrictions */}
              <section className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Dietary Restrictions</h3>
                {preferences.dietaryRestrictions.length > 0 ? (
                  <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
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
                <h3 className="text-lg font-semibold mb-2">Diets</h3>
                {preferences.diets ? (
                  <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
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
            <div className="flex items-center text-lg font-semibold mb-2">
            <div className="bg-[#00a39e] w-8 h-8 border border-white rounded-full flex items-center justify-center mb-2 mr-2">
                  <Soup strokeWidth={1.5} className="w-4 h-4 text-white" /> {/* Example icon, you can change this */}
                </div>
              <h2>Cooking Preferences</h2>
            </div>
            <div className={styles.preferenceItem}>
              <strong>Cooking Difficulty Preferences:</strong>{' '}
              {preferences.cookingDifficultyPreferences.length > 0
                ? formatPreferences(preferences.cookingDifficultyPreferences)
                : 'None specified'}
            </div>
            {/* Cooking Methods */}
            <section className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Cooking Methods</h3>
              {preferences.cookingMethods && preferences.cookingMethods.length > 0 ? (
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  {preferences.cookingMethods.map((method, index) => (
                    <li key={index} className="text-sm">{method}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-gray-500">No preference</p>
              )}
            </section>
            <div className={styles.preferenceItem}>
              <strong>Cooking Preferences Notes:</strong>{' '}
              {preferences.cookingPreferencesNotes || 'None'}
            </div>
          </section>

          {/* Wellness Goals Section */}
          <section className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl">
            <div className="flex items-center text-lg font-semibold mb-2">
            <div className="bg-[#00a39e] w-8 h-8 border border-white rounded-full flex items-center justify-center mb-2 mr-2">
                  <Soup strokeWidth={1.5} className="w-4 h-4 text-white" /> {/* Example icon, you can change this */}
                </div>
              <h2>Wellness Goals</h2>
            </div>
            <div className={styles.preferenceItem}>
              <strong>User Goals:</strong> {preferences.userGoals || 'None specified'}
            </div>
            <div className={styles.preferenceItem}>
              <strong>Wellness Importance:</strong>{' '}
              {preferences.wellnessImportance || 'Not specified'}
            </div>
            <div className={styles.preferenceItem}>
              <strong>Wellness Notes:</strong> {preferences.wellnessNotes || 'None'}
            </div>
          </section>

          {/* Interaction Preferences Section */}
          <section className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl">
            <div className="flex items-center text-lg font-semibold mb-2">
            <div className="bg-[#00a39e] w-8 h-8 border border-white rounded-full flex items-center justify-center mb-2 mr-2">
                  <Soup strokeWidth={1.5} className="w-4 h-4 text-white" /> {/* Example icon, you can change this */}
                </div>
              <h2>Interaction Preferences</h2>
            </div>
            <div className={styles.preferenceItem}>
              <strong>Interaction Preferences:</strong>{' '}
              {preferences.interactionPreferences.length > 0
                ? formatPreferences(preferences.interactionPreferences)
                : 'None specified'}
            </div>
            <div className={styles.preferenceItem}>
              <strong>Interaction Importance:</strong>{' '}
              {preferences.interactionImportance || 'Not specified'}
            </div>
            {/* Experience Mapping */}
            <section className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Experience Mapping</h3>
              {preferences.experienceMapping && preferences.experienceMapping.length > 0 ? (
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  {preferences.experienceMapping.map((experience, index) => (
                    <li key={index} className="text-sm">{experience}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-gray-500">None</p>
              )}
            </section>

            <div className={styles.preferenceItem}>
              <strong>Experience Mapping Notes:</strong>{' '}
              {preferences.experienceMappingNotes || 'None'}
            </div>
          </section>

          {/* Additional Notes Section */}
          <section className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl">
            <div className="flex items-center text-lg font-semibold mb-2">
            <div className="bg-[#00a39e] w-8 h-8 border border-white rounded-full flex items-center justify-center mb-2 mr-2">
                  <Soup strokeWidth={1.5} className="w-4 h-4 text-white" /> {/* Example icon, you can change this */}
                </div>
              <h2>Additional Notes</h2>
            </div>
            <div className={styles.preferenceItem}>
              <strong>General Preferences Notes:</strong>{' '}
              {preferences.generalPreferencesNotes || 'None'}
            </div>
          </section>
        </div>
      </div>
      <Footer actions={["home", "save", "favorite", "send"]} />
    </div>
  );
};

export default PreferencesPage;
