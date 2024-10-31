'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './../components/Header';
import Footer from './../components/Footer';
import { useSession } from 'next-auth/react';
import { Button } from '@radix-ui/themes';
import {
  FaUser,
  FaCog,
  FaEnvelope,
  FaSave,
  FaEdit,
  FaLock,
  FaLanguage,
  FaUpload,
} from 'react-icons/fa';
import styles from './account.module.css';
import Image from 'next/image';

const AccountPage: React.FC = () => {
  const { data: session, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // **Updated formData state**
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    linkedAccounts: {
      google: false,
      facebook: false,
    },
    notificationSettings: {
      emailNotifications: false,
      pushNotifications: false,
    },
    privacySettings: {
      profileVisibility: 'public',
      dataCollectionOptIn: true,
    },
    language: '',
    region: '',
  });

  // Fetch the user's account data when the component loads
  useEffect(() => {
    const fetchAccountData = async () => {
      if (session?.user?.email) {
        try {
          const response = await axios.get('/api/account');
          if (response.status === 200) {
            const account = response.data.account;
            setFormData({
              displayName: account.displayName || '',
              email: session.user.email, // Set email from session
              password: '',
              linkedAccounts: account.linkedAccounts || {
                google: false,
                facebook: false,
              },
              notificationSettings: account.notificationSettings || {
                emailNotifications: false,
                pushNotifications: false,
              },
              privacySettings: account.privacySettings || {
                profileVisibility: 'public',
                dataCollectionOptIn: true,
              },
              language: account.language || '',
              region: account.region || '',
            });
            setAvatarPreview(account.avatarUrl || null);
          }
        } catch (error) {
          console.error('Failed to fetch account data:', error);
        }
      }
    };

    fetchAccountData();
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      const { checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!session?.user?.email) {
      alert('User not authenticated.');
      return;
    }

    try {
      // Include userEmail in formData before saving
      const updatedFormData = {
        ...formData,
        userEmail: session.user.email,
      };

      const formDataToSend = new FormData();
      formDataToSend.append('data', JSON.stringify(updatedFormData));
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
      }

      const response = await axios.post('/api/account', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('Account information saved successfully!');
        setIsEditing(false);

        // Update the session to reflect the new avatar
        if (response.data.account && response.data.account.avatarUrl) {
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
    } catch (error) {
      console.error('Failed to save account information:', error);
      alert('Failed to save account information. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <Header centralText="Account Settings" />
      <main className={styles.mainContent}>
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <FaUser className={styles.icon} />
            <h2 className={styles.sectionTitle}>Profile Information</h2>
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
                    <FaUpload className={styles.uploadIcon} /> Upload Avatar
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
              id="email"
              name="email"
              type="email"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
              disabled // Email should not be editable
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
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <FaCog className={styles.icon} />
            <h2 className={styles.sectionTitle}>Account Settings</h2>
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
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <FaEnvelope className={styles.icon} />
            <h2 className={styles.sectionTitle}>Notifications</h2>
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
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <FaLock className={styles.icon} />
            <h2 className={styles.sectionTitle}>Privacy Settings</h2>
          </div>
          <div className={styles.sectionContent}>
            <label className={styles.label}>Profile Visibility</label>
            <select
              name="privacySettings.profileVisibility"
              value={formData.privacySettings.profileVisibility}
              onChange={handleChange}
              disabled={!isEditing}
              className={styles.input}
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
              Data Collection Opt-In
            </label>
          </div>
        </div>

        {/* Language and Region Section */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <FaLanguage className={styles.icon} />
            <h2 className={styles.sectionTitle}>Language and Region</h2>
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

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          {isEditing ? (
            <Button onClick={handleSave} className={styles.saveButton}>
              <FaSave className={styles.buttonIcon} /> Save
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)} className={styles.editButton}>
              <FaEdit className={styles.buttonIcon} /> Edit Profile
            </Button>
          )}
        </div>
      </main>
      <Footer actions={['home', 'send']} />
    </div>
  );
};

export default AccountPage;
