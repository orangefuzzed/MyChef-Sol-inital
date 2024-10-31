'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { FaLeaf, FaChild, FaUtensils, FaHeartbeat, FaClipboardList } from 'react-icons/fa';
import styles from './preferences.module.css'; // Import the CSS module
import Header from '../components/Header';
import Footer from '../components/Footer';

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
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <Header centralText="Your Preferences" />
      <div className={styles.mainContent}>
        <div className={styles.sectionsContainer}>
          {/* Dietary Preferences Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <FaLeaf className={styles.sectionIcon} />
              <h2>Dietary Preferences</h2>
            </div>
            <div className={styles.preferenceItem}>
              <strong>Cuisine Preferences:</strong>{' '}
              {preferences.cuisinePreferences.length > 0
                ? formatPreferences(preferences.cuisinePreferences)
                : 'None specified'}
            </div>
            <div className={styles.preferenceItem}>
              <strong>Dietary Preferences:</strong>{' '}
              {preferences.dietaryPreferences.length > 0
                ? formatPreferences(preferences.dietaryPreferences)
                : 'None specified'}
            </div>
            <div className={styles.preferenceItem}>
              <strong>Dietary Restrictions:</strong>{' '}
              {preferences.dietaryRestrictions.length > 0
                ? preferences.dietaryRestrictions
                    .map(
                      (restriction) =>
                        `${restriction.name} (${restriction.isAllergy ? 'Allergy' : 'Preference'})`
                    )
                    .join(', ')
                : 'None'}
            </div>
            <div className={styles.preferenceItem}>
              <strong>Diets:</strong> {preferences.diets || 'None specified'}
            </div>
          </section>

          {/* Cooking Preferences Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <FaUtensils className={styles.sectionIcon} />
              <h2>Cooking Preferences</h2>
            </div>
            <div className={styles.preferenceItem}>
              <strong>Cooking Difficulty Preferences:</strong>{' '}
              {preferences.cookingDifficultyPreferences.length > 0
                ? formatPreferences(preferences.cookingDifficultyPreferences)
                : 'None specified'}
            </div>
            <div className={styles.preferenceItem}>
              <strong>Cooking Methods:</strong>{' '}
              {preferences.cookingMethods && preferences.cookingMethods.length > 0
                ? preferences.cookingMethods.join(', ')
                : 'No preference'}
            </div>
            <div className={styles.preferenceItem}>
              <strong>Cooking Preferences Notes:</strong>{' '}
              {preferences.cookingPreferencesNotes || 'None'}
            </div>
          </section>

          {/* Wellness Goals Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <FaHeartbeat className={styles.sectionIcon} />
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
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <FaClipboardList className={styles.sectionIcon} />
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
            <div className={styles.preferenceItem}>
              <strong>Experience Mapping:</strong>{' '}
              {preferences.experienceMapping && preferences.experienceMapping.length > 0
                ? preferences.experienceMapping.join(', ')
                : 'None'}
            </div>
            <div className={styles.preferenceItem}>
              <strong>Experience Mapping Notes:</strong>{' '}
              {preferences.experienceMappingNotes || 'None'}
            </div>
          </section>

          {/* Additional Notes Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <FaChild className={styles.sectionIcon} />
              <h2>Additional Notes</h2>
            </div>
            <div className={styles.preferenceItem}>
              <strong>General Preferences Notes:</strong>{' '}
              {preferences.generalPreferencesNotes || 'None'}
            </div>
          </section>
        </div>
        <div className={styles.editPreferencesContainer}>
          <Link href="/preferencesWalkthrough">
            <button className={styles.editButton}>Edit Preferences</button>
          </Link>
        </div>
      </div>
      <Footer actions={["home", "save", "favorite", "send"]} />
    </div>
  );
};

export default PreferencesPage;
