
'use client';

import React, { useState, useEffect } from 'react';
import Header from './../components/Header';
import { Button } from '@radix-ui/themes';
import { useSession } from 'next-auth/react';
import { Avatar } from '@radix-ui/themes';
import { User, Upload } from 'lucide-react';
import styles from './profile.module.css';
import axios from 'axios';

const ProfilePage: React.FC = () => {
  const { data: session } = useSession();
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setUsername(session.user.name || '');
      setName(session.user.name || '');
      setEmail(session.user.email || '');
      setAvatar(session.user.image || '');
    }
  }, [session]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(URL.createObjectURL(file)); // Temporary URL for preview
    }
  };

  const handleSave = async () => {
    try {
      // Send updated user data to backend
      const updatedData = { username, name, email, avatar };
      await axios.put('/api/user/update', updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const profileFields = [
    { label: 'Username', state: username, setter: setUsername, placeholder: 'Enter your username...' },
    { label: 'Name', state: name, setter: setName, placeholder: 'Enter your full name...' },
    { label: 'Email', state: email, setter: setEmail, placeholder: 'Enter your email address...' },
  ];

  return (
    <div className={styles.container}>
      <Header centralText="Your Profile" />
      <h1 className={styles.title}>Your Profile</h1>
      <div className={styles.avatarContainer}>
        {avatar ? (
          <Avatar
            src={avatar}
            fallback={name[0]?.toUpperCase() ?? 'U'}
            size="6"
            className={styles.avatar}
          />
        ) : (
          <User size={72} color="#ffffff" className={styles.defaultIcon} />
        )}
        {isEditing && (
          <label htmlFor="avatarUpload" className={styles.avatarUploadLabel}>
            <Upload size={24} />
            <input
              id="avatarUpload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className={styles.avatarInput}
            />
          </label>
        )}
      </div>

      {profileFields.map(({ label, state, setter, placeholder }) => (
        <div key={label} className={styles.formGroup}>
          <label className={styles.label}>{label}</label>
          {isEditing ? (
            <input
              type="text"
              value={state}
              onChange={(e) => setter(e.target.value)}
              placeholder={placeholder}
              className={`${styles.input} ${styles.editable}`}
            />
          ) : (
            <p className={styles.text}>{state}</p>
          )}
        </div>
      ))}

      {isEditing ? (
        <div className={styles.buttonGroup}>
          <button className={styles.saveButton} onClick={handleSave}>Save</button>
          <button className={styles.cancelButton} onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <button className={styles.editButton} onClick={() => setIsEditing(true)}>Edit Profile</button>
      )}
    </div>
  );
};

export default ProfilePage;