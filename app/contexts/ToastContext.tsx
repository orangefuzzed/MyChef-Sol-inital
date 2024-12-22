import React, { createContext, useContext, useState, ReactNode } from 'react';
import Toast from '../components/Toast'; // Import your existing Toast component

type ToastType = 'success' | 'error';

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<ToastType | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToastMessage(message);
    setToastType(type);

    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToastMessage(null);
      setToastType(null);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Render the Toast component at the app level */}
      {toastMessage && toastType && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => {
            setToastMessage(null);
            setToastType(null);
          }}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
