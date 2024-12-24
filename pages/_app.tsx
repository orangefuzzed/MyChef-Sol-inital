import { AppProps } from 'next/app';
import Head from 'next/head';
import '../app/globals.css';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    let deferredPrompt: BeforeInstallPromptEvent | null = null;

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js?v=1').then(
          (registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
          },
          (err) => {
            console.log('Service Worker registration failed:', err);
          }
        );
      });
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      const installButton = document.getElementById('installButton');
      if (installButton) {
        installButton.style.display = 'block'; // Show the button
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleInstallClick = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          deferredPrompt = null;
        });
      }
    };

    const installButton = document.getElementById('installButton');
    if (installButton) {
      installButton.addEventListener('click', handleInstallClick);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      if (installButton) {
        installButton.removeEventListener('click', handleInstallClick);
      }
    };
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
