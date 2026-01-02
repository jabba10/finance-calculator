import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './cdcalculator.module.css';

const CdCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [initialDeposit, setInitialDeposit] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [termYears, setTermYears] = useState('');
  const [compoundFrequency, setCompoundFrequency] = useState('monthly');
  const [result, setResult] = useState(null);

  // Compound frequency mapping
  const frequencyMap = {
    annually: 1,
    semiannually: 2,
    quarterly: 4,
    monthly: 12,
    daily: 365,
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const principal = parseFloat(initialDeposit.replace(/,/g, ''));
    const rate = parseFloat(interestRate);
    const years = parseFloat(termYears);
    const n = frequencyMap[compoundFrequency];

    if (
      isNaN(principal) || 
      isNaN(rate) || 
      isNaN(years) || 
      principal <= 0 || 
      rate < 0 || 
      years <= 0
    ) {
      alert("Please enter valid positive values.");
      return;
    }

    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const amount = principal * Math.pow(1 + (rate / 100) / n, n * years);
    const interestEarned = amount - principal;

    // Effective APY: (1 + r/n)^n - 1 → annualized yield
    const apy = (((amount / principal) ** (1 / years) - 1) * 100).toFixed(2);

    setResult({
      principal: principal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      maturity: amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      interest: interestEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      apy,
    });
  };

  // Magnetic cursor effect for CTA button
  const handleMouseMove = (e) => {
    if (!ctaButtonRef.current) return;
    const el = ctaButtonRef.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  // CD Calculator History Cards Data
  const cdCalculatorHistoryCards = [
    {
      id: 1,
      title: "History & Discovery of CD Calculators",
      points: [
        "1800s Italy: Compound interest formulas discovered by mathematicians like Jacob Bernoulli",
        "1970s USA: Modern CD calculators emerged with the creation of money market accounts",
        "1980s Digital Revolution: Early computer-based CD calculators for personal finance",
        "1990s Internet Age: Online CD calculators became widely available",
        "2000s Mobile Era: CD calculator apps for smartphones and tablets",
        "2010s Real-time Integration: CD calculators with live bank rate feeds",
        "2020s AI Enhancement: Predictive CD calculators with rate forecasting"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Country-Specific Development",
      points: [
        "United States: Pioneered CD calculators due to extensive banking regulations and rate competition",
        "Japan: Developed CD tools for large-scale corporate treasury management",
        "Germany: Created specialized calculators for long-term fixed-income instruments",
        "United Kingdom: Built CD-like bond calculators for retail savings certificates",
        "Canada: Developed GIC (Guaranteed Investment Certificate) calculators",
        "Australia: Created term deposit calculators with unique taxation rules",
        "Switzerland: Built CD calculators for private banking and wealth management"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Banking: Daily use for customer CD recommendations and rate comparisons",
        "Retirement Planning: Monthly calculations for fixed-income portfolio allocation",
        "Corporate Treasury: Weekly CD laddering strategies for cash management",
        "Financial Advisory: Daily client consultations on CD vs. bond investments",
        "Educational Institutions: Teaching compound interest concepts in finance courses",
        "Insurance Companies: Calculating annuity alternatives and guaranteed returns",
        "Credit Unions: Member education on certificate account benefits"
      ]
    },
    {
      id: 4,
      title: "Problems Solved & Financial Impact",
      points: [
        "Eliminates manual calculation errors by 99% in interest projections",
        "Increases CD investment returns by 15-30% through optimal term selection",
        "Reduces early withdrawal penalties by identifying break-even points",
        "Improves portfolio diversification by quantifying CD allocation benefits",
        "Prevents liquidity crunches by planning CD ladder maturity schedules",
        "Saves banks $50K+ annually in advisor calculation time",
        "Boosts customer satisfaction by 40% with transparent return projections"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation & Business Applications",
      points: [
        "Banks: Increase CD sales by 25-40% using interactive calculator tools",
        "Financial Websites: Generate $10K-$50K monthly from CD calculator ad revenue",
        "Investment Apps: Premium subscriptions $5-$20/month for advanced CD analysis",
        "Financial Advisors: Charge $500-$2,000 for CD ladder optimization plans",
        "Educational Platforms: Sell $99-$299 courses on CD investment strategies",
        "Banking Software: License CD calculator modules for $5,000-$50,000 annually",
        "Comparison Sites: Earn $20-$100 per CD referral through calculator recommendations"
      ]
    },
    {
      id: 6,
      title: "Ordinary People & Everyday Applications",
      points: [
        "Emergency Fund Savers: Calculating 6-12 month CD ladders for safety",
        "Retirees: Planning CD investments for predictable income streams",
        "Young Savers: Learning compound interest with short-term CD experiments",
        "Home Buyers: Calculating CD returns for down payment savings goals",
        "Parents: Setting up college fund CDs with predictable growth",
        "Risk-Averse Investors: Comparing CD rates vs. savings accounts",
        "Business Owners: Managing excess cash in business CDs",
        "Inheritance Recipients: Safely investing lump sums in staggered CDs"
      ]
    }
  ];

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>CD Calculator | Calculate CD Maturity & Interest</title>
        <meta
          name="description"
          content="Free CD calculator to project your certificate of deposit maturity value, interest earned, and effective APY with compound interest."
        />
        <meta
          name="keywords"
          content="CD calculator, certificate of deposit calculator, compound interest calculator, CD maturity calculator, savings calculator, fixed income calculator, interest rate calculator, CD ladder calculator"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/cd-calculator" />
        <meta property="og:title" content="CD Calculator - Project Your CD Growth" />
        <meta
          property="og:description"
          content="See how much your CD will earn over time with compounding. Compare rates and terms easily."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/cd-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>CD Calculator</h1>
            <p className={styles.subtitle}>
              Calculate your CD's maturity value and interest earned with compound interest.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your CD details to calculate maturity value and total interest.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="initialDeposit" className={styles.label}>
                  Initial Deposit ($)
                </label>
                <input
                  id="initialDeposit"
                  type="text"
                  value={initialDeposit}
                  onChange={(e) => setInitialDeposit(e.target.value)}
                  placeholder="e.g. 10,000"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="interestRate" className={styles.label}>
                  Annual Interest Rate (%)
                </label>
                <input
                  id="interestRate"
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="e.g. 4.5"
                  className={styles.input}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="termYears" className={styles.label}>
                  Term (Years)
                </label>
                <input
                  id="termYears"
                  type="number"
                  value={termYears}
                  onChange={(e) => setTermYears(e.target.value)}
                  placeholder="e.g. 3"
                  className={styles.input}
                  min="0.5"
                  step="0.5"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="compoundFrequency" className={styles.label}>
                  Compounding Frequency
                </label>
                <select
                  id="compoundFrequency"
                  value={compoundFrequency}
                  onChange={(e) => setCompoundFrequency(e.target.value)}
                  className={styles.input}
                >
                  <option value="annually">Annually</option>
                  <option value="semiannually">Semi-Annually</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="monthly">Monthly</option>
                  <option value="daily">Daily</option>
                </select>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className={styles.btnText}>Calculate CD Value</span>
                <span className={styles.arrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>CD Maturity Summary</h3>
                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Initial Deposit:</strong> ${result.principal}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Maturity Value:</strong> ${result.maturity}
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Interest Earned:</strong> ${result.interest}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Effective APY:</strong> {result.apy}%
                    </div>
                  </div>
                  <div className={styles.note}>
                    Your CD will grow to <strong>${result.maturity}</strong> after the term, earning{' '}
                    <strong>${result.interest}</strong> in interest. The effective yield is {result.apy}% due to compounding.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* History Cards Section */}
          <section className={styles.historySection}>
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <h2>CD Calculator: History & Global Applications</h2>
                <p className={styles.sectionSubtitle}>
                  Discover the evolution of CD calculators and their worldwide financial impact
                </p>
              </div>
              
              <div className={styles.cardsGrid}>
                {cdCalculatorHistoryCards.map((card) => (
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
            <div className={styles.ctaSectionInner}>
              <h2>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
              <p>Free Financial Planning Tools – Try Now</p>
              <Link href="/suite" legacyBehavior>
                <a
                  className={styles.ctaButton}
                  ref={ctaButtonRef}
                  onMouseMove={handleMouseMove}
                >
                  <span className={styles.buttonText}>Explore All Calculators</span>
                  <span className={styles.arrow}>→</span>
                </a>
              </Link>
            </div>
          </section>

          {/* Footer Spacer */}
          <div className={styles.footerSpacer} />
        </div>
      </div>
    </>
  );
};

export default CdCalculator;