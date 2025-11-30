// components/SimpleCalculator.jsx
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './simplecalculator.module.css';

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

  // SEO Metadata - Enhanced with comprehensive keywords
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = 'Simple Calculator Online | Free Basic Arithmetic Tool 2024';
  const pageDescription = 'Free online simple calculator for basic math operations. Perform addition, subtraction, multiplication, division instantly. Perfect for students, shopping, bills & daily calculations.';
  const imagePreview = `${siteUrl}/images/simple-calculator.jpg`;

  // Comprehensive SEO Keywords Collections for Simple Calculator
  const singleKeywords = [
    'calculator', 'math', 'arithmetic', 'addition', 'subtraction', 'multiplication', 
    'division', 'calculate', 'numbers', 'basic', 'simple', 'free', 'online', 
    'tool', 'compute', 'sum', 'difference', 'product', 'quotient', 'equation',
    'expression', 'result', 'digital', 'electronic', 'pocket', 'desktop',
    'browser', 'web', 'app', 'utility', 'quick', 'easy', 'fast', 'accurate'
  ];

  const twoWordKeywords = [
    'simple calculator', 'basic calculator', 'online calculator', 'free calculator',
    'math calculator', 'arithmetic calculator', 'addition calculator', 'subtraction calculator',
    'multiplication calculator', 'division calculator', 'digital calculator',
    'web calculator', 'browser calculator', 'desktop calculator', 'pocket calculator',
    'quick calculator', 'easy calculator', 'basic math', 'simple math',
    'math tool', 'calculation tool', 'number calculator', 'equation solver',
    'expression calculator', 'instant calculator', 'free tool', 'web tool',
    'math app', 'calculator app', 'basic arithmetic', 'simple arithmetic',
    'mental math', 'quick math', 'everyday math', 'daily calculator'
  ];

  const longTailKeywords = [
    'free online simple calculator for basic math',
    'easy to use calculator for addition and subtraction',
    'quick multiplication and division calculator online',
    'basic arithmetic calculator for everyday use',
    'simple math calculator for students and teachers',
    'free web based calculator no download required',
    'online calculator for quick calculations at work',
    'basic calculator for shopping and bill splitting',
    'simple digital calculator for homework help',
    'free calculator tool for basic mathematics',
    'easy calculator for percentage calculations',
    'simple math tool for budget planning',
    'online calculator for measurement conversions',
    'basic calculator for cooking and recipes',
    'free simple calculator for small business owners',
    'easy to use calculator for senior citizens',
    'simple math calculator for elementary students',
    'online calculator for quick price calculations',
    'basic calculator for tax and tip calculations',
    'free calculator for simple interest calculations',
    'easy percentage calculator for discounts',
    'simple calculator for area and volume calculations',
    'online basic calculator for freelance work',
    'free math calculator for daily expenses',
    'simple calculator for mortgage and loan estimates',
    'easy to use calculator for investment returns',
    'basic calculator for salary and wage calculations',
    'free online calculator for unit conversions',
    'simple calculator for fitness and health calculations',
    'basic math tool for DIY home projects',
    'free calculator for travel expense calculations',
    'simple calculator for recipe scaling',
    'online basic calculator for time calculations',
    'easy calculator for grade point average',
    'simple calculator for car loan payments',
    'free basic calculator for rent calculations',
    'simple math tool for savings goals',
    'online calculator for currency conversion',
    'basic calculator for profit margin calculations',
    'free simple calculator for tip sharing',
    'easy calculator for bill splitting with friends',
    'simple calculator for material estimates',
    'online basic calculator for dosage calculations',
    'free calculator for workout repetitions',
    'simple math tool for gardening projects',
    'basic calculator for painting estimates',
    'free online calculator for flooring calculations',
    'simple calculator for wallpaper measurements',
    'easy calculator for fabric requirements',
    'basic calculator for party planning',
    'free simple calculator for recipe doubling',
    'online calculator for percentage increase decrease',
    'simple math tool for sales calculations',
    'basic calculator for commission calculations',
    'free calculator for overtime pay',
    'simple calculator for net pay calculations',
    'easy calculator for retirement savings',
    'basic calculator for college expense planning',
    'free online calculator for vacation budgeting'
  ];

  const allKeywords = [...singleKeywords, ...twoWordKeywords, ...longTailKeywords].join(', ');

  return (
    <>
      <Head>
        {/* Basic Meta */}
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={allKeywords} />
        <meta name="author" content="Calci Financial Tools" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        
        {/* Additional Meta Tags */}
        <meta name="subject" content="Simple Calculator & Basic Math Tools" />
        <meta name="classification" content="Mathematics, Calculators, Basic Arithmetic, Online Tools" />
        <meta name="topic" content="Basic Mathematics and Simple Calculations" />
        <meta name="summary" content="Free online simple calculator for basic arithmetic operations" />
        <meta name="url" content={`${siteUrl}/simple-calculator`} />
        
        {/* Verification & Ownership */}
        <meta name="google-site-verification" content="your_verification_code" />
        <meta name="msvalidate.01" content="your_bing_verification" />
        
        {/* Location & Business */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="geo.position" content="39.8283;-98.5795" />
        <meta name="ICBM" content="39.8283, -98.5795" />
        
        {/* Canonical */}
        <link rel="canonical" href={`${siteUrl}/simple-calculator`} />
        
        {/* Alternate Languages */}
        <link rel="alternate" href={`${siteUrl}/simple-calculator`} hrefLang="x-default" />
        <link rel="alternate" href={`${siteUrl}/simple-calculator`} hrefLang="en" />
        <link rel="alternate" href={`${siteUrl}/es/simple-calculator`} hrefLang="es" />
        
        {/* Preload & Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/simple-calculator`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imagePreview} />
        <meta property="og:image:alt" content="Online Simple Calculator Interface" />
        <meta property="og:site_name" content="Calci Financial Calculators" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:see_also" content={siteUrl} />
        
        {/* Facebook */}
        <meta property="fb:app_id" content="your_facebook_app_id" />
        <meta property="fb:pages" content="your_facebook_page_id" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@calcifinance" />
        <meta name="twitter:creator" content="@calcifinance" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imagePreview} />
        <meta name="twitter:image:alt" content="Free Online Simple Calculator for Basic Math" />
        
        {/* Additional Social */}
        <meta name="pinterest" content="nopin" description="Free simple calculator for basic mathematics" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: pageTitle,
            description: pageDescription,
            url: `${siteUrl}/simple-calculator`,
            mainEntity: {
              '@type': 'SoftwareApplication',
              name: 'Simple Calculator',
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
              },
              description: 'Free online simple calculator for basic arithmetic operations including addition, subtraction, multiplication, and division.',
              featureList: [
                'Basic arithmetic operations',
                'Keyboard support',
                'Parentheses for order of operations',
                'Instant calculations',
                'Mobile-friendly design'
              ]
            },
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
            publisher: {
              '@type': 'Organization',
              name: 'Calci Financial Tools',
              url: siteUrl,
              logo: `${siteUrl}/images/logo.png`,
              sameAs: [
                'https://twitter.com/calcifinance',
                'https://www.linkedin.com/company/calci-finance',
                'https://www.facebook.com/calcifinance'
              ]
            }
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowToTool',
            name: 'Simple Calculator',
            description: 'A tool for performing basic arithmetic calculations online',
            url: `${siteUrl}/simple-calculator`,
            step: [
              {
                '@type': 'HowToStep',
                name: 'Enter Numbers',
                text: 'Click on number buttons or type using your keyboard'
              },
              {
                '@type': 'HowToStep',
                name: 'Select Operation',
                text: 'Choose from addition, subtraction, multiplication, or division'
              },
              {
                '@type': 'HowToStep',
                name: 'Calculate',
                text: 'Press equals button or Enter key to see the result'
              }
            ],
            tool: ['Keyboard', 'Mouse', 'Touchscreen'],
            about: {
              '@type': 'Thing',
              name: 'Basic Mathematics'
            },
            audience: {
              '@type': 'Audience',
              audienceType: ['Students', 'Teachers', 'Professionals', 'Parents', 'Senior Citizens']
            }
          })}
        </script>

        {/* Additional FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Is this simple calculator really free to use?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, our simple calculator is completely free with no hidden costs, registration, or download required. You can use it as much as you want for any basic math calculations.'
                }
              },
              {
                '@type': 'Question',
                name: 'What mathematical operations does this calculator support?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'This calculator supports all basic arithmetic operations: addition (+), subtraction (-), multiplication (×), division (÷), and parentheses for controlling order of operations. It follows standard PEMDAS rules.'
                }
              },
              {
                '@type': 'Question',
                name: 'Can I use the calculator with my keyboard?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes! You can type numbers and operators directly using your keyboard. Press Enter for equals, Escape to clear, and use standard mathematical symbols for operations.'
                }
              },
              {
                '@type': 'Question',
                name: 'Is this calculator mobile-friendly?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Absolutely! Our simple calculator works perfectly on smartphones, tablets, and desktop computers. The interface is responsive and touch-friendly for mobile users.'
                }
              },
              {
                '@type': 'Question',
                name: 'Do you store my calculation history?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No, all calculations are performed locally in your browser. We do not store, track, or transmit any of your calculation data. Your privacy is completely protected.'
                }
              }
            ]
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
              <h2>Simple Calculator - Free Online Tool</h2>
              <p>
                Our <strong>free online simple calculator</strong> provides instant basic arithmetic calculations for everyday use. Perfect for students, professionals, and anyone needing quick math solutions.
              </p>

              <h3>Why Choose Our Basic Calculator?</h3>
              <p>
                This <strong>simple math calculator</strong> offers a clean, intuitive interface with keyboard support, making it ideal for quick calculations without the clutter of physical calculators.
              </p>

              <h4>How to Use This Simple Calculator</h4>
              <ul className={styles.list}>
                <li>Click numbers and operators (<code>+</code>, <code>−</code>, <code>×</code>, <code>÷</code>)</li>
                <li>Use <strong>parentheses</strong> for order control</li>
                <li>Press <strong>=</strong> to calculate or <strong>C</strong> to clear</li>
                <li>Keyboard friendly: Type and press <strong>Enter</strong></li>
                <li>Mobile optimized for touch devices</li>
              </ul>

              <h4>Order of Operations (PEMDAS)</h4>
              <div className={styles.formula}>
                <code>PEMDAS: Parentheses → Exponents → Multiplication/Division → Addition/Subtraction</code>
              </div>
              <p>Example: <code>3 + 5 × 2</code> = 13 (multiplication first).</p>

              <h4>Practical Applications & Real-World Uses</h4>
              <ul className={styles.list}>
                <li><strong>Shopping & Retail:</strong> Add prices & apply discounts</li>
                <li><strong>Dining & Restaurants:</strong> Split checks & calculate tips</li>
                <li><strong>Home Improvement:</strong> Measure areas or material quantities</li>
                <li><strong>Academic Use:</strong> Check homework and practice math</li>
                <li><strong>Freelance Work:</strong> Estimate project costs and invoices</li>
                <li><strong>Personal Finance:</strong> Budget planning and expense tracking</li>
                <li><strong>Cooking & Recipes:</strong> Adjust ingredient quantities</li>
                <li><strong>Travel Planning:</strong> Calculate distances and expenses</li>
              </ul>

              <h4>Calculation Examples</h4>
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
                    <td>Restaurant Tip (18%)</td>
                    <td>45 × 0.18</td>
                    <td>$8.10</td>
                  </tr>
                  <tr>
                    <td>20% Discount</td>
                    <td>80 − (80 × 0.2)</td>
                    <td>$64</td>
                  </tr>
                  <tr>
                    <td>Room Area Calculation</td>
                    <td>12 × 10</td>
                    <td>120 sq ft</td>
                  </tr>
                  <tr>
                    <td>Monthly Budget</td>
                    <td>2500 − (800 + 350 + 200)</td>
                    <td>$1,150</td>
                  </tr>
                  <tr>
                    <td>Recipe Doubling</td>
                    <td>2 × (1.5 + 0.75 + 2.25)</td>
                    <td>9 cups</td>
                  </tr>
                </tbody>
              </table>

              <h4>Key Benefits & Features</h4>
              <ul className={styles.list}>
                <li>✅ Completely free with no hidden costs</li>
                <li>✅ Fast & accurate calculations</li>
                <li>✅ Works on any device - mobile, tablet, desktop</li>
                <li>✅ No ads or distractions</li>
                <li>✅ Full keyboard support</li>
                <li>✅ Instant loading - no waiting</li>
                <li>✅ Privacy focused - no data storage</li>
                <li>✅ No registration or signup required</li>
                <li>✅ Regular updates and improvements</li>
                <li>✅ Accessible design for all users</li>
              </ul>

              <h4>Perfect For Various Users</h4>
              <p>
                This <strong>basic arithmetic calculator</strong> serves multiple audiences:
              </p>
              <ul className={styles.list}>
                <li><strong>Students:</strong> Homework help and math practice</li>
                <li><strong>Teachers:</strong> Classroom demonstrations</li>
                <li><strong>Professionals:</strong> Quick office calculations</li>
                <li><strong>Parents:</strong> Helping children with schoolwork</li>
                <li><strong>Senior Citizens:</strong> Easy-to-use interface</li>
                <li><strong>Small Business Owners:</strong> Daily expense calculations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2>Need More Advanced Calculations?</h2>
            <p>Explore our full suite of 50+ specialized financial calculators for business, investment, and personal finance.</p>
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