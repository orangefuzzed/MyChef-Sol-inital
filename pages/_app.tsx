import { AppProps } from 'next/app';
import Head from 'next/head';
import '../app/globals.css';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    let deferredPrompt: BeforeInstallPromptEvent | null = null;

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js?v=1').then(
          (registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
          },
          (err) => {
            console.log('Service Worker registration failed:', err);
          }
        );
      });
    }

    window.addEventListener('beforeinstallprompt', (e: Event) => {
      console.log('beforeinstallprompt event fired'); // Debugging
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent; // Cast to the correct type
      const installButton = document.getElementById('installButton');
      if (installButton) {
        installButton.style.display = 'block'; // Show the button
      }
    });

    const handleInstallClick = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult: { outcome: 'accepted' | 'dismissed' }) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          deferredPrompt = null; // Reset the prompt
        });
      }
    };

    const installButton = document.getElementById('installButton');
    if (installButton) {
      installButton.addEventListener('click', handleInstallClick);
    }
  }, []);

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json?v=3" />
        <link rel="apple-touch-icon" href="/icons/dishcovery_icon-512x512.png" />
        <meta name="theme-color" content="#FFA500" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
