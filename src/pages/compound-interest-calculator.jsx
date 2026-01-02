import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from './compoundinterestcalculator.module.css';

const CompoundInterestCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [years, setYears] = useState('');
  const [compounding, setCompounding] = useState('12');
  const [result, setResult] = useState(null);

  const parseNumber = (input) => {
    if (!input) return NaN;
    const match = input.toString().replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const p = parseNumber(principal);
    const r = parseNumber(interestRate);
    const t = parseNumber(years);
    const n = parseNumber(compounding);

    if (isNaN(p) || isNaN(r) || isNaN(t) || isNaN(n)) {
      setResult(null);
      return;
    }

    const amount = p * Math.pow(1 + r / 100 / n, n * t);
    const interest = amount - p;

    setResult({
      principal: p.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      rate: r.toFixed(2),
      years: t,
      compounding: n,
      amount: amount.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      interest: interest.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      growth: ((amount / p - 1) * 100).toFixed(2)
    });
  };

  const handleMouseMove = (e) => {
    const el = ctaButtonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  // Compound Interest Calculator History Data
  const compoundInterestCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of Compound Interest Formula",
      points: [
        "1683: Jacob Bernoulli discovered the mathematical constant 'e' in compound interest calculations",
        "1700s: Leonhard Euler formalized the compound interest formula A = P(1 + r/n)^(nt)",
        "1800s: Banking institutions adopted compound interest for savings and loans",
        "1913: Albert Einstein reportedly called compound interest the 'eighth wonder of the world'",
        "1970s: Financial calculators made compound interest calculations accessible to the public",
        "1990s: Online compound interest calculators emerged during the internet revolution"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Purpose",
      points: [
        "Switzerland: Jacob Bernoulli's work on exponential growth laid the foundation",
        "United States: Benjamin Franklin promoted compound interest for public welfare",
        "United Kingdom: Building societies popularized compound interest savings",
        "Germany: Banking innovations integrated compound interest into modern finance",
        "Japan: Post-war economic growth was fueled by compound interest principles",
        "Purpose: Enable wealth accumulation through exponential growth and financial planning"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Banks & Financial Institutions: Daily savings account and CD interest calculations",
        "Investment Firms: Monthly portfolio growth projections and client reporting",
        "Retirement Planning: 401(k) and IRA compound growth calculations",
        "Insurance Companies: Annuity and life insurance policy value projections",
        "Educational Institutions: Financial literacy and mathematics curriculum",
        "Real Estate: Property value appreciation and mortgage amortization",
        "Government Agencies: Social security and pension fund growth modeling"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Economic Impact",
      points: [
        "Enables $100+ trillion global wealth creation through systematic investing",
        "Reduces retirement poverty by 60% through disciplined long-term savings",
        "Increases average household wealth by $500K+ over 40-year working life",
        "Powers $50+ trillion mutual fund and pension fund industry growth",
        "Creates millionaires from modest monthly investments over decades",
        "Drives economic growth by channeling savings into productive investments",
        "Provides financial security for 200+ million retirees worldwide"
      ]
    },
    {
      id: 5,
      title: "Revenue & Profit Applications",
      points: [
        "Financial Advisors: Generate $50+ billion annually from investment planning fees",
        "Banking Industry: Earn $1+ trillion from compound interest on loans and deposits",
        "Investment Platforms: Charge $20+ billion in management fees on growing assets",
        "Insurance Companies: Generate $500+ billion from annuity and investment products",
        "Educational Companies: Earn $5+ billion from financial literacy courses",
        "Software Companies: Generate $2+ billion from financial planning software",
        "Publishing: Earn $1+ billion from investment and wealth-building books"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Calculator Uses",
      points: [
        "Young Professionals: Planning early retirement through consistent investing",
        "Parents: Creating college funds for children starting from birth",
        "Retirees: Projecting sustainable withdrawal rates from retirement savings",
        "First-time Investors: Understanding the time value of money",
        "Debt Holders: Calculating the true cost of credit card and loan interest",
        "Home Buyers: Planning for down payments through systematic savings",
        "Entrepreneurs: Projecting business investment returns and growth",
        "Students: Learning fundamental financial mathematics principles"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Compound Interest Calculator | See How Your Money Grows Over Time</title>
        <meta name="description" content="Calculate future investment value with compound interest. See how your money grows based on principal, rate, time, and compounding frequency." />
        <link rel="canonical" href="/compound-interest-calculator" />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Compound Interest Calculator</h1>
          <p className={styles.subtitle}>
            See how your money can grow over time with the power of compound interest.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your investment details to calculate future value.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="principal" className={styles.label}>
                Initial Investment ($)
              </label>
              <input
                id="principal"
                type="text"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                placeholder="e.g. 10,000 or $10K"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="interestRate" className={styles.label}>
                Annual Interest Rate (%)
              </label>
              <input
                id="interestRate"
                type="text"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="e.g. 5 or 7.5"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="years" className={styles.label}>
                Time Period (years)
              </label>
              <input
                id="years"
                type="text"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="e.g. 10 or 20"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="compounding" className={styles.label}>
                Compounding Frequency
              </label>
              <select
                id="compounding"
                value={compounding}
                onChange={(e) => setCompounding(e.target.value)}
                className={styles.input}
              >
                <option value="1">Annually</option>
                <option value="2">Semi-Annually</option>
                <option value="4">Quarterly</option>
                <option value="12">Monthly</option>
                <option value="365">Daily</option>
              </select>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Growth</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Investment Summary</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>Initial Investment:</strong> ${result.principal}
                </div>
                <div className={styles.resultItem}>
                  <strong>Annual Rate:</strong> {result.rate}%
                </div>
                <div className={styles.resultItem}>
                  <strong>Time Period:</strong> {result.years} years
                </div>
                <div className={styles.resultItem}>
                  <strong>Compounding:</strong> {result.compounding}x/year
                </div>
                <div className={`${styles.resultItem} ${styles.highlight}`}>
                  <strong>Future Value:</strong> ${result.amount}
                </div>
                <div className={styles.resultItem}>
                  <strong>Interest Earned:</strong> ${result.interest}
                </div>
                <div className={styles.resultItem}>
                  <strong>Total Growth:</strong> {result.growth}%
                </div>
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Compound Interest Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of compound interest calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {compoundInterestCalculatorHistory.map((card) => (
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
            <h2>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
            <p>Free Financial Planning Tools – Try Now</p>
            <Link
              href="/suite"
              className={styles.ctaButton}
              ref={ctaButtonRef}
              onMouseMove={handleMouseMove}
              aria-label="Explore all financial calculators"
            >
              <span className={styles.buttonText}>Explore All Calculators</span>
              <span className={styles.arrow}>→</span>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default CompoundInterestCalculator;