import { AppProps } from 'next/app';
import Head from 'next/head';
import '../app/globals.css';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js?v=1').then(
            registration => {
              console.log('Service Worker registered with scope:', registration.scope);
            },
            err => {
              console.log('Service Worker registration failed:', err);
            }
          );
        });
      }
    }, []);
  
    return (
      <>
        <Head>
          <link rel="manifest" href="/manifest.json?v=2" />
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
          <meta name="theme-color" content="#FFA500" />
        </Head>
        <Component {...pageProps} />
      </>
    );
  }
  
  export default MyApp;
