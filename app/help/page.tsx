// Help Page - app/help/page.tsx
'use client';

import React from 'react';
import Header from './../components/Header';

const HelpPage: React.FC = () => {
  return (
    <div>
      <Header centralText="Help & Support" />
      <h1>Help</h1>
    </div>
  );
};

export default HelpPage;