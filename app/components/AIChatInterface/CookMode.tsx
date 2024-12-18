import React, { useState } from 'react';

interface CookModeProps {
  cookModeData: string[]; // Array of instructions
  recipeTitle: string;    // The recipe title
}

const CookMode: React.FC<CookModeProps> = ({ cookModeData, recipeTitle }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoPlay = () => {
    const video = document.getElementById('cookModeVideo') as HTMLVideoElement;
    if (video) {
      video.play()
        .then(() => {
          setIsPlaying(true);
          console.log('Video is now playing.');
        })
        .catch((err) => console.error('Error playing video:', err));
    }
  };

  return (
    <div className="cook-mode bg-white/30 backdrop-blur-lg border-white border shadow-lg ring-1 ring-black/5 p-6 rounded-2xl">
      <h2 className="text-2xl font-medium text-sky-50 text-center">
        Let&apos;s Cook Up Some {recipeTitle}!
      </h2>

      <div className="flex justify-center my-4">
        {!isPlaying ? (
          <button
            className="px-4 py-2 bg-pink-800 text-white rounded-full shadow-md"
            onClick={handleVideoPlay}
          >
            Click to Play Video
          </button>
        ) : (
          <p className="text-green-500">Video is Playing</p>
        )}
      </div>

      <video
        id="cookModeVideo"
        className="rounded-lg shadow-lg"
        width="300"
        height="200"
        muted
        playsInline
        loop
        src="/videos/tiny-video.mp4"
      >
        Your browser does not support the video tag.
      </video>

      <div className="py-3 flex items-center text-sm text-black before:flex-1 before:border-t before:border-pink-800 before:me-6 after:flex-1 after:border-t after:border-pink-800 after:ms-6 dark:text-white dark:before:border-neutral-600 dark:after:border-neutral-600">
        INSTRUCTIONS
      </div>
      <ol className="list-decimal pl-6 text-base text-white text-lg leading-relaxed space-y-4">
        {cookModeData.map((step, index) => (
          <li key={index} className="mb-2">
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default CookMode;
