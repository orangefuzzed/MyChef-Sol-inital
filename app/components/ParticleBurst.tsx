import React, { useEffect } from 'react';

interface ParticleBurstProps {
  onComplete?: () => void; // Callback for when animation completes
}

const ParticleBurst: React.FC<ParticleBurstProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.(); // Call onComplete when animation ends
    }, 600); // Match the animation duration
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className={`absolute w-1.5 h-1.5 bg-[#27ff52] rounded-full animate-particle-${index}`}
        ></div>
      ))}
    </div>
  );
};

export default ParticleBurst;
