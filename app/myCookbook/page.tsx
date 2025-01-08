// app/myCookbook/page.tsx

import React from 'react';
import HomeScreen from '../components/myCookbook'; // Import the duplicated myCookbook component

const MyCookBookPage: React.FC = () => {
  return <HomeScreen />;
};

export default MyCookBookPage;
