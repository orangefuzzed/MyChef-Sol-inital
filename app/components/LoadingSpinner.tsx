import React from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { PuffLoader } from 'react-spinners';

interface LoadingSpinnerProps {
  isLoading: boolean;
  loadingMessage: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isLoading, loadingMessage }) => {
  if (!isLoading) return null;

  return (
    <div className="flex justify-start">
      <Flex align="center" gap="4">
        <PuffLoader size={24} color="#15f992" />
        <Text size="2" style={{ color: 'white' }}>
          {loadingMessage}
        </Text>
      </Flex>
    </div>
  );
};

export default LoadingSpinner;
