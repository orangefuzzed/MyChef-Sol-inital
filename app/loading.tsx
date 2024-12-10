'use client';

import React from 'react';
import { PuffLoader } from 'react-spinners';
import Image from 'next/image';

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50 space-y-8">
        {/* Chef Whiskington Icon and Loader */}
        <div className="flex flex-col items-center space-y-4">
          {/* Chef Whiskington Icon */}
          <div className="relative">
            <Image
              src="/images/food-bot-1.png"
              alt="Dishcovery Icon"
              width={60}
              height={60}
              className="absolute top-[10px] left-1/2 transform -translate-x-1/2 z-10"
            />
            <PuffLoader size={100} color="#27ff52" />
          </div>

          {/* Rotating Loading Text */}
          <p className="text-white text-md font-normal text-center">Loading... Please hold tight!</p>
        </div>
        </div>
  );
};

export default Loading;
