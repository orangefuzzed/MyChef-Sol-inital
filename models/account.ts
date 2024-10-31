import { Db } from 'mongodb';

export interface IAccount {
  userEmail: string;
  displayName: string;
  avatarUrl?: string;
  // Security Settings
  passwordHash?: string; // Updated to ensure we use 'passwordHash' consistently
  twoFactorEnabled?: boolean;
  linkedAccounts?: { provider: string; providerId: string }[];
  // Subscription Details
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  // Preferences
  themePreference?: 'dark' | 'light';
  notificationSettings?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
  privacySettings?: {
    profileVisibility: 'public' | 'private';
    dataCollectionOptIn: boolean;
  };
  language?: string;
  region?: string;
}

// Function to get the accounts collection
export const getAccountsCollection = async (db: Db) => {
  return db.collection<IAccount>('accounts');
};

// You can add CRUD methods here if needed, e.g., createAccount, updateAccount, etc.
