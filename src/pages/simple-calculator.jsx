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

  // SEO Metadata
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = 'Simple Calculator Online | Free Basic Arithmetic Tool 2024';
  const pageDescription = 'Free online simple calculator for basic math operations. Perform addition, subtraction, multiplication, division instantly. Perfect for students, shopping, bills & daily calculations.';
  const imagePreview = `${siteUrl}/images/simple-calculator.jpg`;

  // History data
  const calculatorHistory = [
    {
      id: 1,
      title: "History & Discovery",
      points: [
        "Ancient civilizations used counting boards (abacus) as early as 2400 BC in Mesopotamia",
        "First mechanical calculator invented by Blaise Pascal in 1642 (France)",
        "Electronic calculator invented in 1961 by Jack Kilby (USA) at Texas Instruments",
        "First handheld calculator introduced by Texas Instruments in 1967",
        "Modern digital calculators evolved from the Intel 4004 microprocessor (1971)",
        "Arithmetic operations based on ancient Babylonian and Greek mathematical principles"
      ]
    },
    {
      id: 2,
      title: "Country of Origin & Purpose",
      points: [
        "France - Pascal's calculator designed for tax computation and accounting",
        "USA - Electronic calculators developed for space program calculations",
        "Japan - Advanced calculator technology for business and engineering",
        "Primary purpose: Replace manual calculation errors in business and science",
        "Enabled faster financial transactions and engineering computations",
        "Revolutionized education by making mathematics more accessible"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Applications",
      points: [
        "Banking & Finance: Daily interest calculations, loan amortization, forex trading",
        "Engineering: Structural calculations, electrical load computations, material estimations",
        "Education: Teaching mathematical concepts, exam preparation, homework assistance",
        "Retail & Commerce: Pricing, discounts, inventory management, profit margin calculations",
        "Healthcare: Dosage calculations, patient statistics, medical research data analysis",
        "Construction: Material quantities, cost estimates, measurement conversions",
        "Logistics: Route optimization, fuel calculations, load distribution"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Revenue Impact",
      points: [
        "Reduces calculation errors by 99.9% compared to manual computation",
        "Saves average of 2 hours daily per employee in accounting departments",
        "Increases retail pricing accuracy leading to 3-5% higher profit margins",
        "Engineering firms report 40% faster project estimations with calculator tools",
        "Financial institutions process 300% more daily transactions with digital calculators",
        "Reduces educational grading time by 50% for mathematics teachers",
        "Healthcare dosage errors reduced by 85% with precise calculation tools"
      ]
    },
    {
      id: 5,
      title: "Money Making Applications",
      points: [
        "Business Optimization: Real-time profit/loss analysis during negotiations",
        "Investment Analysis: Instant ROI calculations for investment decisions",
        "E-commerce: Dynamic pricing algorithms adjusting to market conditions",
        "Freelancing: Accurate project estimates and hourly rate calculations",
        "Real Estate: Quick mortgage and rental yield computations",
        "Stock Trading: Immediate position sizing and risk assessment",
        "Manufacturing: Cost per unit calculations for pricing strategies"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Usage",
      points: [
        "Daily Budgeting: Grocery shopping totals, monthly expense tracking",
        "Home Management: Recipe measurements, DIY project material calculations",
        "Personal Finance: Loan repayments, savings goals, retirement planning",
        "Shopping: Discount calculations, price comparisons, sales tax computations",
        "Travel Planning: Currency conversions, distance calculations, fuel costs",
        "Education: Homework help, test preparation, learning basic math",
        "Health & Fitness: Calorie counting, workout measurements, BMI calculations"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={`${siteUrl}/simple-calculator`} />
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

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Calculator History & Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and real-world impact of calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {calculatorHistory.map((card) => (
                <div key={card.id} className={styles.historyCard}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <ul className={styles.cardList}>
                    {card.points.map((point, index) => (
                      <li key={index} className={styles.cardListItem}>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
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