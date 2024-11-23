import React from 'react';

interface CookModeProps {
  cookModeData: string; // Assuming cook mode data is formatted as markdown.
}

const CookMode: React.FC<CookModeProps> = ({ cookModeData }) => {
  return (
    <div className="cook-mode">
      <h2 className="text-3xl font-bold mb-6">Lets Get Cooking!</h2>
      <div className="markdown-content">
        {/* Render markdown instructions */}
        <div dangerouslySetInnerHTML={{ __html: cookModeData }} />
      </div>
    </div>
  );
};

export default CookMode;
