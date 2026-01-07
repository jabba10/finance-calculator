// src/pages/_app.js
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import './globals.css';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const canonicalUrl = `https://www.financecalculatorfree.com${router.asPath}`;

  return (
    <>
      <Head>
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <Navbar />
      <main className="app-wrapper">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}