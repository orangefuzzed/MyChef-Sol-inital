// Settings Page - app/settings/page.tsx
'use client';

import React from 'react';
import Header from './../components/Header';

const SettingsPage: React.FC = () => {
  return (
    <div>
      <Header centralText="Settings" />
      <h1>Settings</h1>
    </div>
  );
};

export default SettingsPage;