'use client';

import React, { useEffect } from 'react';
import styles from './ProfileEditModal.module.css';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    displayName: string;
    email: string;
    password: string;
    privacySettings: {
      profileVisibility: string;
    };
    linkedAccounts: {
      google: boolean;
      facebook: boolean;
    };
    notificationSettings: {
      emailNotifications: boolean;
      pushNotifications: boolean;
    };
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    displayName: string;
    email: string;
    password: string;
    privacySettings: {
      profileVisibility: string;
    };
    linkedAccounts: {
      google: boolean;
      facebook: boolean;
    };
    notificationSettings: {
      emailNotifications: boolean;
      pushNotifications: boolean;
    };
  }>>;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, formData, setFormData }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    } else {
      document.body.style.overflow = 'auto'; // Re-enable scrolling when modal is closed
    }

    return () => {
      document.body.style.overflow = 'auto'; // Clean up when component is unmounted
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.modalTitle}>Edit Profile Information</h2>
        <div className={styles.formGroup}>
          <label htmlFor="displayName">Display Name</label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            value={formData.displayName}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled // Email should not be editable
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <button onClick={onClose} className={styles.saveButton}>
          Save
        </button>
      </div>
    </div>
  );
};

export default ProfileEditModal;
