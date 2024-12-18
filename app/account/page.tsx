'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './../components/Header';
import Footer from './../components/Footer';
import { useSession } from 'next-auth/react';
import { Button } from '@radix-ui/themes';
import styles from './account.module.css';
import Image from 'next/image';
import { Settings, User, FilePenLine, MailCheck, Lock, Languages, ImagePlus, CircleX } from 'lucide-react';


interface AccountData {
  displayName: string;
  userEmail: string;
  password: string;
  linkedAccounts: {
    google: boolean;
    facebook: boolean;
  };
  notificationSettings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
  privacySettings: {
    profileVisibility: string;
    dataCollectionOptIn: boolean;
  };
  language: string;
  region: string;
  avatarUrl?: string;
}

const AccountPage: React.FC = () => {
  const { data: session, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<AccountData>({
    displayName: '',
    userEmail: '',
    password: '',
    linkedAccounts: { google: false, facebook: false },
    notificationSettings: { emailNotifications: false, pushNotifications: false },
    privacySettings: { profileVisibility: 'public', dataCollectionOptIn: true },
    language: '',
    region: '',
  });

  const [initialFormData, setInitialFormData] = useState<AccountData | null>(null); // New state

  // Fetch account data on load
useEffect(() => {
  const fetchAccountData = async () => {
    if (session?.user?.email) {
      try {
        const { data } = await axios.get('/api/account');

        // Preserve the existing logic for setting formData
        const updatedFormData = {
          ...formData, // Keep previous state intact
          displayName: data.account?.displayName || '',
          userEmail: data.account?.userEmail || '',
          linkedAccounts: data.account?.linkedAccounts || formData.linkedAccounts,
          notificationSettings: data.account?.notificationSettings || formData.notificationSettings,
          privacySettings: data.account?.privacySettings || formData.privacySettings,
          language: data.account?.language || '',
          region: data.account?.region || '',
        };

        setFormData(updatedFormData); // Set current form data
        setInitialFormData(updatedFormData); // Store initial state for cancellation logic
        setAvatarPreview(data.account?.avatarUrl || null);
      } catch (err) {
        console.error('Error fetching account data:', err);
      }
    }
  };

  fetchAccountData();
}, [session]);


  // Update formData and handle checkboxes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = e.target;
  
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle avatar file input
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Save account data with FormData
  const handleSave = async () => {
    if (!session?.user?.email) {
      alert('User not authenticated.');
      return;
    }

    try {
      const updatedFormData = {
        ...formData,
        userEmail: session.user.email,
        avatarUrl: avatarPreview || '',
      };

      const formDataToSend = new FormData();
      formDataToSend.append('data', JSON.stringify(updatedFormData));

      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
      }

      const response = await axios.post('/api/account', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        alert('Account information saved successfully!');
        setIsEditing(false);

        // Update session with the new avatar if applicable
        if (response.data.account?.avatarUrl) {
          setAvatarPreview(response.data.account.avatarUrl);
          await update({
            user: {
              ...session.user,
              image: response.data.account.avatarUrl,
            },
          });
        }
      } else {
        alert('Failed to save account information.');
      }
    } catch (err) {
      console.error('Error saving account information:', err);
      alert('Failed to save account information. Please try again.');
    }
  };

  const handleCancelClick = () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel? Unsaved changes will be lost."
    );
    if (confirmCancel && initialFormData) {
      setFormData(initialFormData); // Reset formData to initial state
      setIsEditing(false); // Exit editing mode
    }
  };
  
  


  return (
    <div className="flex flex-col h-screen bg-fixed bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/images/chef-cooking-2.png')" }}
      >
      <Header centralText="Account Settings" />
      <main className="flex-grow p-8 overflow-y-auto">

        {/* Editing Action Buttons */}
        <div className="flex justify-end mb-6 space-x-4">
          {isEditing ? (
            <>
              <Button
                onClick={handleCancelClick}
                className="text-xs flex p-2 px-4 bg-gray-400/30 border border-gray-100 shadow-lg ring-1 ring-black/5 rounded-full text-white items-center gap-2 -mt-2 -mb-2"
              >
                <CircleX className="w-4 h-4" /> Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="text-xs flex p-2 px-4 bg-pink-800/30 border border-sky-50 shadow-lg ring-1 ring-black/5 rounded-full text-sky-50 items-center gap-2 -mt-2 -mb-2"
              >
                <FilePenLine className="w-4 h-4" /> Save
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="text-xs flex p-2 px-4 bg-pink-800/45 border border-sky-50 shadow-lg ring-1 ring-black/5 rounded-full text-sky-50 items-center gap-2 -mt-2 -mb-2"
            >
              <FilePenLine className="w-4 h-4" /> Edit Profile
            </Button>
          )}
        </div>


        <div className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 mb-6 mt-2 p-6 rounded-2xl">
          <div className="flex items-center text-md font-normal mb-4">
          <div className="bg-[#00a39e] w-8 h-8 border border-white rounded-full flex items-center justify-center mr-2">
                  <User strokeWidth={1.5} className="w-5 h-5 text-white" /> {/* Example icon, you can change this */}
                </div>
              <p>Profile Information</p>
            </div>
          <div className={styles.sectionContent}>
            {/* Avatar Upload */}
            <div className={styles.avatarContainer}>
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className={styles.avatarPreview}
                  width={60}
                  height={60}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>No Avatar</div>
              )}
              {isEditing && (
                <div className={styles.avatarUploadWrapper}>
                  <label htmlFor="avatarUpload" className={styles.avatarUploadLabel}>
                    <ImagePlus className={styles.uploadIcon} /> Upload Avatar
                  </label>
                  <input
                    id="avatarUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className={styles.avatarUploadInput}
                  />
                </div>
              )}
            </div>
            {/* Display Name Field */}
            <label htmlFor="displayName" className={styles.label}>
              Display Name
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              className={styles.input}
              value={formData.displayName}
              onChange={handleChange}
              disabled={!isEditing}
            />
            {/* Email Field */}
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="userEmail"
              name="userEmail"
              type="text"
              className={styles.input}
              value={formData.userEmail}
              onChange={handleChange}
              disabled={!isEditing}
            />
            {/* Password Field */}
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={styles.input}
              value={isEditing ? formData.password : '******'}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Account Settings Section */}
        <div className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 mb-6 mt-2 p-6 rounded-2xl hidden">
          <div className="flex items-center text-md font-normal mb-4">
          <div className="bg-[#00a39e] w-8 h-8 border border-white rounded-full flex items-center justify-center mr-2">
                  <Settings strokeWidth={1.5} className="w-5 h-5 text-white" /> {/* Example icon, you can change this */}
                </div>
              <p>Account Settings</p>
            </div>
          <div className={styles.sectionContent}>
            <label htmlFor="linkedAccounts" className={styles.label}>
              Linked Accounts
            </label>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="linkedAccounts.google"
                  checked={formData.linkedAccounts.google}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                Google
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="linkedAccounts.facebook"
                  checked={formData.linkedAccounts.facebook}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                Facebook
              </label>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 mb-6 mt-2 p-6 rounded-2xl hidden">
          <div className="flex items-center text-md font-normal mb-4">
          <div className="bg-[#00a39e] w-8 h-8 border border-white rounded-full flex items-center justify-center mr-2">
                  <MailCheck strokeWidth={1.5} className="w-5 h-5 text-white" /> {/* Example icon, you can change this */}
                </div>
              <p>Notifications</p>
            </div>
          <div className={styles.sectionContent}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="notificationSettings.emailNotifications"
                checked={formData.notificationSettings.emailNotifications}
                onChange={handleChange}
                disabled={!isEditing}
              />
              Email Notifications
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="notificationSettings.pushNotifications"
                checked={formData.notificationSettings.pushNotifications}
                onChange={handleChange}
                disabled={!isEditing}
              />
              Push Notifications
            </label>
          </div>
        </div>

        {/* Privacy Settings Section */}
        <div className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 mb-6 mt-2 p-6 rounded-2xl">
          <div className="flex items-center text-md font-normal mb-4">
          <div className="bg-[#00a39e] w-8 h-8 border border-white rounded-full flex items-center justify-center mr-2">
                  <Lock strokeWidth={1.5} className="w-5 h-5 text-white" /> {/* Example icon, you can change this */}
                </div>
              <p>Privacy Settings</p>
            </div>
          <div className={styles.sectionContent}>
            <label className="hidden">Profile Visibility</label>
            <select
              name="privacySettings.profileVisibility"
              value={formData.privacySettings.profileVisibility}
              onChange={handleChange}
              disabled={!isEditing}
              className="hidden"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="privacySettings.dataCollectionOptIn"
                checked={formData.privacySettings.dataCollectionOptIn}
                onChange={handleChange}
                disabled={!isEditing}
              />
              Data Collection Opt-Out
            </label>
            <p>*We do not collect any data from our users.</p>
          </div>
        </div>

        {/* Language and Region Section */}
        <div className="bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 mb-4 mt-2 p-6 rounded-2xl hidden">
          <div className="flex items-center text-md font-normal mb-4">
          <div className="bg-[#00a39e] w-8 h-8 border border-white rounded-full flex items-center justify-center mr-2">
                  <Languages strokeWidth={1.5} className="w-5 h-5 text-white" /> {/* Example icon, you can change this */}
                </div>
              <p>Language and Region</p>
            </div>
          <div className={styles.sectionContent}>
            <label htmlFor="language" className={styles.label}>
              Language
            </label>
            <input
              id="language"
              name="language"
              type="text"
              className={styles.input}
              value={formData.language}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <label htmlFor="region" className={styles.label}>
              Region
            </label>
            <input
              id="region"
              name="region"
              type="text"
              className={styles.input}
              value={formData.region}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        
      </main>
      <Footer actions={['home', 'send']} />
      </div>

  );
};

export default AccountPage;
