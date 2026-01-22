// src/pages/_app.js
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import './globals.css';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const canonicalUrl = `https://www.financecalculatorfree.com${router.asPath}`;
  const GA_MEASUREMENT_ID = 'G-2E7Q5ZXC2D';

  // Google Analytics route tracking
  useEffect(() => {
    const handleRouteChange = (url) => {
      window.gtag?.('config', GA_MEASUREMENT_ID, {
        page_path: url,
        anonymize_ip: true,
      });
    };

    handleRouteChange(router.asPath);
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, router.asPath]);

  // ===== CORE GOATCOUNTER FIX =====
  // Manual GoatCounter Tracking for Next.js SPA
  useEffect(() => {
    // This is the key function that sends data to GoatCounter
    const sendToGoatCounter = (path) => {
      // SAFETY CHECK: Only run this in the browser
      if (typeof window === 'undefined') return;
      
      // Construct the tracking pixel URL as per GoatCounter's method
      if (!path) path = window.location.pathname + window.location.search + window.location.hash;
      const baseUrl = 'https://financecalculatorfree.goatcounter.com/count';
      const query = `p=${encodeURIComponent(path)}&t=${encodeURIComponent(document.title)}`;
      
      // Append a timestamp to prevent caching
      const imgUrl = `${baseUrl}?${query}&_=${Date.now()}`;
      
      // Create and append an invisible tracking pixel
      const pixel = document.createElement('img');
      pixel.src = imgUrl;
      pixel.style.display = 'none';
      pixel.referrerPolicy = 'no-referrer';
      pixel.loading = 'lazy';
      document.body.appendChild(pixel);
      
      console.log('[GoatCounter] Tracked:', path); // Optional: for debugging
    };

    // Track the initial page load
    sendToGoatCounter(router.asPath);

    // Track subsequent route changes
    const handleRouteChange = (url) => {
      sendToGoatCounter(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, router.asPath]);
  // ===== END GOATCOUNTER FIX =====

  return (
    <>
      <Head>
        <link rel="canonical" href={canonicalUrl} key="canonical" />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://financecalculatorfree.goatcounter.com" />
        <link rel="dns-prefetch" href="https://gc.zgo.at" />
      </Head>

      {/* Google Analytics Scripts */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true
            });
          `,
        }}
      />

      {/* GoatCounter Script (Optional - loads the JS API for advanced features) */}
      {/* If the manual tracking above works, you can optionally keep this for its helper functions. */}
      <Script
        data-goatcounter="https://financecalculatorfree.goatcounter.com/count"
        src="https://gc.zgo.at/count.js"
        strategy="lazyOnload"
        async
      />

      <Navbar />
      <main className="app-wrapper">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}