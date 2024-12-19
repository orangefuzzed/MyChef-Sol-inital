// types.d.ts
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface Window {
    opera?: unknown; // Optional property since it's not always present
    BeforeInstallPromptEvent?: BeforeInstallPromptEvent; // Extend global Window
  }
}

export {};
