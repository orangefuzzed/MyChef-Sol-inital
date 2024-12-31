// app/MyHome/page.tsx

import React from 'react';
import MyHomescreen from '../components/MyHomeScreen'; // Import the duplicated MyHomescreen component

const MyHomePage: React.FC = () => {
  return <MyHomescreen />;
};

export default MyHomePage;
