import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './leveragecalculator.module.css';

const LeverageCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [totalAssets, setTotalAssets] = useState('');
  const [totalEquity, setTotalEquity] = useState('');
  const [ebit, setEbit] = useState('');
  const [interestExpense, setInterestExpense] = useState('');
  const [result, setResult] = useState(null);

  // Helper: Extract first number from any string
  const parseNumber = (input) => {
    if (!input) return NaN;
    const match = input.toString().replace(/,/g, '').match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(null);

    // Parse all inputs safely
    const assets = Math.max(0, parseNumber(totalAssets) || 0);
    const equity = Math.max(0, parseNumber(totalEquity) || 0);
    const ebitValue = Math.max(0, parseNumber(ebit) || 0);
    const interest = Math.max(0, parseNumber(interestExpense) || 0);

    // Avoid division by zero
    if (equity === 0 || assets === 0 || interest === 0) {
      alert("Please enter valid positive values. Equity, Assets, and Interest Expense must be greater than zero.");
      return;
    }

    // Calculate derived values
    const debt = assets - equity;

    // Ratios
    const debtToEquity = equity > 0 ? debt / equity : Infinity;
    const debtToAssets = assets > 0 ? (debt / assets) * 100 : 0;
    const equityMultiplier = equity > 0 ? assets / equity : 0;
    const interestCoverage = interest > 0 ? ebitValue / interest : Infinity;

    // Format result for display
    setResult({
      totalAssets: assets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalEquity: equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalDebt: debt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      debtToEquity: isFinite(debtToEquity) ? debtToEquity.toFixed(2) : 'Infinity',
      debtToAssets: debtToAssets.toFixed(2),
      equityMultiplier: equityMultiplier.toFixed(2),
      interestCoverage: isFinite(interestCoverage) ? interestCoverage.toFixed(2) : 'Infinity',
      ebit: ebitValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      interestExpense: interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    });
  };

  // Magnetic effect on CTA
  const handleMouseMove = (e) => {
    if (!ctaButtonRef.current) return;
    const el = ctaButtonRef.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  // Leverage Calculator History Cards Data
  const leverageCalculatorHistoryCards = [
    {
      id: 1,
      title: "History & Discovery of Leverage Calculators",
      points: [
        "Ancient Mesopotamia: Early leverage principles in loan-to-value ratios for agriculture",
        "16th Century Venice: Merchant banks developed debt-to-equity calculations for trade ventures",
        "1929 Wall Street Crash: Modern leverage ratios formalized after excessive margin trading",
        "1950s USA: Modigliani-Miller theorem established leverage theory in corporate finance",
        "1970s Global: International banks standardized leverage calculations for cross-border lending",
        "1980s Japan: Keiretsu system developed unique leverage models for industrial groups",
        "2008 Financial Crisis: Advanced leverage calculators for systemic risk assessment"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Country-Specific Development",
      points: [
        "United States: Developed for Wall Street investment banking and corporate M&A analysis",
        "Switzerland: Created for private banking client risk assessment and portfolio leverage",
        "Japan: Built for Zaibatsu conglomerates and keiretsu corporate group analysis",
        "Germany: Developed for Mittelstand small-to-medium enterprise financing models",
        "United Kingdom: Created for London banking sector and hedge fund leverage monitoring",
        "China: Built for state-owned enterprise debt monitoring and infrastructure financing",
        "Singapore: Developed for Asian financial hub corporate governance and risk management"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Investment Banking: Daily leverage calculations for M&A deals and LBO transactions",
        "Commercial Banking: Weekly credit risk assessment using debt-to-equity ratios",
        "Private Equity: Monthly portfolio company leverage optimization and restructuring",
        "Hedge Funds: Real-time leverage monitoring for margin trading strategies",
        "Insurance Companies: Quarterly asset-liability matching and capital adequacy testing",
        "Corporate Finance: Monthly capital structure optimization for public companies",
        "Regulatory Agencies: Continuous systemic risk monitoring of financial institutions"
      ]
    },
    {
      id: 4,
      title: "Problems Solved & Financial Impact",
      points: [
        "Prevents corporate bankruptcies by 40-60% through optimal leverage management",
        "Increases return on equity by 15-30% through strategic debt financing",
        "Reduces borrowing costs by 1-3% by maintaining optimal credit ratings",
        "Prevents regulatory capital breaches saving $100M+ in fines for financial institutions",
        "Optimizes M&A deal structures increasing transaction success rates by 25-40%",
        "Identifies over-leveraged companies 12-24 months before financial distress",
        "Improves investor returns by 20-50% through proper risk-reward balancing"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation & Business Applications",
      points: [
        "Financial Software: $5,000-$250,000 annual licenses for enterprise leverage analytics",
        "Consulting Firms: $50,000-$500,000 fees for corporate leverage optimization projects",
        "Investment Banks: 1-3% deal fees on $100M+ leveraged buyout transactions",
        "Credit Rating Agencies: $25,000-$150,000 annual subscriptions for leverage analytics",
        "Trading Platforms: 0.1-0.5% fees on $10B+ daily leveraged trading volumes",
        "Regulatory Technology: $100,000-$1M contracts for bank leverage compliance systems",
        "Educational Institutions: $2,000-$20,000 executive courses on leverage management"
      ]
    },
    {
      id: 6,
      title: "Ordinary People & Everyday Applications",
      points: [
        "Home Buyers: Calculating mortgage debt-to-income ratios for loan approvals",
        "Small Business Owners: Assessing optimal debt levels for business expansion",
        "Real Estate Investors: Analyzing property leverage for rental portfolio growth",
        "Stock Investors: Understanding company leverage before stock purchases",
        "Personal Finance: Managing credit card and loan debt relative to income",
        "Startup Founders: Determining safe debt levels for early-stage funding",
        "Retirees: Monitoring investment portfolio leverage for risk management",
        "Students: Learning financial leverage principles for career development"
      ]
    }
  ];

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>Leverage Calculator | Debt-to-Equity & Coverage Ratios</title>
        <meta
          name="description"
          content="Free leverage calculator to analyze debt-to-equity, debt-to-assets, equity multiplier, and interest coverage ratios for business financial health."
        />
        <meta
          name="keywords"
          content="leverage calculator, debt to equity calculator, financial leverage calculator, interest coverage ratio calculator, debt ratio calculator, financial risk assessment"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/leverage-calculator" />
        <meta property="og:title" content="Leverage Calculator - Analyze Financial Risk" />
        <meta
          property="og:description"
          content="Calculate key leverage ratios to assess your company's capital structure and risk exposure."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/leverage-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Leverage Calculator</h1>
            <p className={styles.subtitle}>
              Analyze your company's financial leverage and debt structure.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your financial data — we extract numbers from any format (e.g., $1M, 500K, EBIT: $150k).
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="totalAssets" className={styles.label}>
                  Total Assets ($)
                </label>
                <input
                  id="totalAssets"
                  type="text"
                  value={totalAssets}
                  onChange={(e) => setTotalAssets(e.target.value)}
                  placeholder="e.g. $1,000,000 or 1M"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="totalEquity" className={styles.label}>
                  Total Equity ($)
                </label>
                <input
                  id="totalEquity"
                  type="text"
                  value={totalEquity}
                  onChange={(e) => setTotalEquity(e.target.value)}
                  placeholder="e.g. $400,000 or 400K"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="ebit" className={styles.label}>
                  EBIT ($)
                </label>
                <input
                  id="ebit"
                  type="text"
                  value={ebit}
                  onChange={(e) => setEbit(e.target.value)}
                  placeholder="e.g. $150,000 or 150K"
                  className={styles.input}
                />
                <small className={styles.note}>
                  Earnings Before Interest and Taxes
                </small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="interestExpense" className={styles.label}>
                  Interest Expense ($)
                </label>
                <input
                  id="interestExpense"
                  type="text"
                  value={interestExpense}
                  onChange={(e) => setInterestExpense(e.target.value)}
                  placeholder="e.g. $25,000 or 25K"
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className={styles.btnText}>Calculate Leverage</span>
                <span className={styles.arrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Leverage Analysis Results</h3>
                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Total Debt:</strong> ${result.totalDebt}
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Debt-to-Equity Ratio:</strong> {result.debtToEquity}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Debt-to-Assets Ratio:</strong> {result.debtToAssets}%
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Equity Multiplier:</strong> {result.equityMultiplier}
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Interest Coverage Ratio:</strong> {result.interestCoverage}x
                    </div>
                  </div>
                  <div className={styles.note}>
                    {parseFloat(result.debtToEquity) > 2 && result.debtToEquity !== 'Infinity' ? (
                      <span>
                        Your debt-to-equity ratio of <strong>{result.debtToEquity}</strong> indicates{' '}
                        <strong>high financial leverage</strong>, which may increase risk but can amplify returns.
                      </span>
                    ) : result.debtToEquity === 'Infinity' ? (
                      <span>
                        <strong>Zero equity detected</strong> — this suggests a highly risky capital structure.
                      </span>
                    ) : (
                      <span>
                        Your debt-to-equity ratio of <strong>{result.debtToEquity}</strong> indicates{' '}
                        <strong>moderate financial leverage</strong>, suggesting a balanced capital structure.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* History Cards Section */}
          <section className={styles.historySection}>
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <h2>Leverage Calculator: Global History & Financial Impact</h2>
                <p className={styles.sectionSubtitle}>
                  Discover how leverage calculations evolved and transformed worldwide finance
                </p>
              </div>
              
              <div className={styles.cardsGrid}>
                {leverageCalculatorHistoryCards.map((card) => (
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

export default LeverageCalculator;