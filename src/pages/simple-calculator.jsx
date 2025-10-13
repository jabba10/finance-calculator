// components/SimpleCalculator.jsx
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './SimpleCalculator.module.css';

const SimpleCalculator = () => {
  const ctaButtonRef = useRef(null);
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  // Handle button clicks
  const handlePress = (value) => {
    if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === '=') {
      try {
        // Safely evaluate expression
        const evaluatedResult = Function(`"use strict"; return (${input})`)().toString();
        setResult(evaluatedResult);
      } catch (error) {
        setResult('Error');
      }
    } else {
      setInput((prev) => prev + value);
    }
  };

  // Handle keyboard input
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      if (/[0-9+\-*/.()]/.test(key)) {
        e.preventDefault();
        handlePress(key);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handlePress('=');
      } else if (key === 'Escape') {
        handlePress('C');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input]);

  // Magnetic effect on CTA
  const handleMouseMove = (e) => {
    const el = ctaButtonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  // SEO Metadata
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = 'Simple Calculator | Basic Arithmetic Tool for Everyday Math';
  const pageDescription =
    'A fast, clean, and intuitive simple calculator for everyday math tasks like bills, budgeting, shopping, and more. No ads, no signup.';
  const imagePreview = `${siteUrl}/images/simple-calculator.jpg`;

  return (
    <>
      <Head>
        {/* Basic Meta */}
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="simple calculator, basic calculator, arithmetic calculator, free online calculator, addition, subtraction, multiplication, division"
        />
        <meta name="author" content="Calci" />
        <meta name="robots" content="index, follow" />

        {/* Canonical */}
        <link rel="canonical" href={`${siteUrl}/simple-calculator`} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/simple-calculator`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imagePreview} />
        <meta property="og:image:alt" content="Simple calculator interface for everyday math" />
        <meta property="og:site_name" content="Calci" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@calci" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imagePreview} />
        <meta name="twitter:image:alt" content="Free simple calculator for quick daily calculations" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: pageTitle,
            description: pageDescription,
            url: `${siteUrl}/simple-calculator`,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: siteUrl,
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Simple Calculator',
                  item: `${siteUrl}/simple-calculator`,
                },
              ],
            },
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Tool',
            name: 'Simple Calculator',
            description: 'A basic arithmetic calculator for addition, subtraction, multiplication, and division.',
            url: `${siteUrl}/simple-calculator`,
            keywords: 'calculator, arithmetic, math, addition, subtraction',
            applicationCategory: 'Utilities',
            offers: {
              '@type': 'Offer',
              availability: 'https://schema.org/InStock',
              price: '0',
              priceCurrency: 'USD',
            },
          })}
        </script>
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Simple Calculator</h1>
          <p className={styles.subtitle}>
            A fast, clean, and intuitive tool for everyday math tasks.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <div className={styles.display}>
            <div className={styles.input}>{input || '0'}</div>
            {result && <div className={styles.result}>= {result}</div>}
          </div>

          <div className={styles.buttons}>
            {['C', '(', ')', '/'].map((btn) => (
              <button
                key={btn}
                className={`${styles.btn} ${styles.function}`}
                onClick={() => handlePress(btn)}
                aria-label={btn === 'C' ? 'Clear' : btn}
              >
                {btn}
              </button>
            ))}
            {['7', '8', '9', '*'].map((btn) => (
              <button
                key={btn}
                className={`${styles.btn} ${styles.number}`}
                onClick={() => handlePress(btn)}
              >
                {btn}
              </button>
            ))}
            {['4', '5', '6', '-'].map((btn) => (
              <button
                key={btn}
                className={`${styles.btn} ${styles.number}`}
                onClick={() => handlePress(btn)}
              >
                {btn}
              </button>
            ))}
            {['1', '2', '3', '+'].map((btn) => (
              <button
                key={btn}
                className={`${styles.btn} ${styles.number}`}
                onClick={() => handlePress(btn)}
              >
                {btn}
              </button>
            ))}
            <button className={`${styles.btn} ${styles.number}`} onClick={() => handlePress('0')}>
              0
            </button>
            <button className={`${styles.btn} ${styles.number}`} onClick={() => handlePress('.')}>
              .
            </button>
            <button className={`${styles.btn} ${styles.equal}`} onClick={() => handlePress('=')}>
              =
            </button>
          </div>

          <div className={styles.note}>
            Supports: +, −, ×, ÷, and parentheses.
          </div>
        </div>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.container}>
            <div className={styles.infoCard}>
              <h3>Why It Matters</h3>
              <p>
                A <strong>simple calculator</strong> helps with daily tasks — splitting bills, budgeting, shopping, or checking measurements — quickly and accurately.
              </p>

              <h4>How to Use</h4>
              <ul className={styles.list}>
                <li>Click numbers and operators (<code>+</code>, <code>−</code>, <code>×</code>, <code>÷</code>)</li>
                <li>Use <strong>parentheses</strong> for order control</li>
                <li>Press <strong>=</strong> to calculate or <strong>C</strong> to clear</li>
                <li>Keyboard friendly: Type and press <strong>Enter</strong></li>
              </ul>

              <h4>Order of Operations</h4>
              <div className={styles.formula}>
                <code>PEMDAS: Parentheses → Exponents → Multiplication/Division → Addition/Subtraction</code>
              </div>
              <p>Example: <code>3 + 5 × 2</code> = 13 (multiplication first).</p>

              <h4>Real-World Uses</h4>
              <ul className={styles.list}>
                <li><strong>Shopping:</strong> Add prices & apply discounts</li>
                <li><strong>Dining:</strong> Split checks & tip</li>
                <li><strong>Home Projects:</strong> Measure areas or materials</li>
                <li><strong>Students:</strong> Check homework</li>
                <li><strong>Freelancers:</strong> Estimate project costs</li>
              </ul>

              <h4>Examples</h4>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Expression</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Tip</td>
                    <td>45 × 0.18</td>
                    <td>$8.10</td>
                  </tr>
                  <tr>
                    <td>Discount</td>
                    <td>80 − (80 × 0.2)</td>
                    <td>$64</td>
                  </tr>
                  <tr>
                    <td>Room Area</td>
                    <td>12 × 10</td>
                    <td>120 sq ft</td>
                  </tr>
                  <tr>
                    <td>Budget Left</td>
                    <td>2500 − (800 + 350 + 200)</td>
                    <td>$1,150</td>
                  </tr>
                </tbody>
              </table>

              <h4>Benefits</h4>
              <ul className={styles.list}>
                <li>✅ Fast & accurate</li>
                <li>✅ Works on any device</li>
                <li>✅ Free and ad-free</li>
                <li>✅ Keyboard support</li>
                <li>✅ Instant load</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2>More Financial Tools?</h2>
            <p>Explore 50+ free calculators — no login, just results.</p>
            <Link href="/suite" legacyBehavior>
              <button
                className={styles.ctaButton}
                ref={ctaButtonRef}
                onMouseMove={handleMouseMove}
              >
                <span className={styles.buttonText}>Explore All Calculators</span>
                <span className={styles.arrow}>→</span>
              </button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default SimpleCalculator;