import React from 'react';
import { ClipLoader } from 'react-spinners';  // Import spinner from react-spinners

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <ClipLoader size={35} color="#DD005F" />  {/* Customize size and color as needed */}
    </div>
  );
};

export default LoadingSpinner;
