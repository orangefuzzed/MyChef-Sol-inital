'use client';

import React, { useState, useEffect } from 'react';
import Header from './../components/Header';
import Footer from './../components/Footer';
import { Avatar } from '@radix-ui/themes';
import { User, Upload } from 'lucide-react';
import { useSession } from 'next-auth/react';
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
    <>
      <Header centralText="Your Profile" />
      <div className="main-content">
        <h1 className="text-2xl text-white mb-4 font-semibold">Your Profile</h1>
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
          <div key={label} className="mb-4">
            <label className="block text-lg text-white mb-2 font-medium">{label}</label>
            {isEditing ? (
              <input
                type="text"
                value={state}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                className="w-full p-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            ) : (
              <p className="text-lg text-white bg-gray-700 rounded-lg p-4">{state}</p>
            )}
          </div>
        ))}

        {isEditing ? (
          <div className="flex justify-between mt-6">
            <button
              className="px-6 py-2 rounded-full bg-green-500 text-black hover:bg-green-600 transition-colors duration-200"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="px-6 py-2 rounded-full bg-red-500 text-black hover:bg-red-600 transition-colors duration-200"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="px-6 py-2 mt-6 rounded-full bg-accent text-black hover:bg-accent-dark transition-colors duration-200"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
      <Footer actions={['home', 'send']} />
    </>
  );
};

export default ProfilePage;
