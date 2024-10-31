'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './contexts/AuthContext';
import HomeScreen from './components/HomeScreen'; // Import your HomeScreen component

const Page = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login'); // Redirect to login page if the user is not logged in
    }
  }, [user, router]);

  return user ? <HomeScreen /> : null; // Render HomeScreen only if the user is logged in
};

export default Page;
