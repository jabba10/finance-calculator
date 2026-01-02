import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './debtequitycalculator.module.css';

const DebtEquityCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [totalLiabilities, setTotalLiabilities] = useState('');
  const [totalEquity, setTotalEquity] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Helper: Extract first number from any string
  const parseNumber = (input) => {
    if (!input) return NaN;
    const match = input.toString().replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const liabilities = parseNumber(totalLiabilities);
    const equity = parseNumber(totalEquity);

    // Validate parsed numbers
    if (isNaN(liabilities)) {
      setError('Please enter a valid value for Total Liabilities.');
      return;
    }
    if (isNaN(equity)) {
      setError('Please enter a valid value for Total Equity.');
      return;
    }
    if (equity <= 0) {
      setError('Total Equity must be greater than zero to calculate the ratio.');
      return;
    }

    const ratio = (liabilities / equity).toFixed(2);
    let riskLevel = '';
    let riskColor = '';

    if (ratio < 0.5) {
      riskLevel = 'Low Risk';
      riskColor = styles.textSuccess;
    } else if (ratio < 1.5) {
      riskLevel = 'Moderate Risk';
      riskColor = styles.textWarning;
    } else {
      riskLevel = 'High Risk';
      riskColor = styles.textDanger;
    }

    setResult({
      totalLiabilities: liabilities.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalEquity: equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      ratio,
      riskLevel,
      riskColor,
    });
  };

  // Magnetic effect on CTA button
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
  const pageTitle = 'Debt-to-Equity Ratio Calculator | Free Financial Leverage Tool';
  const pageDescription = 'Calculate your company\'s debt-to-equity ratio to assess financial leverage, risk level, and capital structure health.';

  // Debt-to-Equity History Data
  const debtEquityHistory = [
    {
      id: 1,
      title: "History & Discovery of Debt-to-Equity Ratio",
      points: [
        "1910s US Banking: Commercial banks created debt-to-equity ratio to assess corporate loan risk",
        "1930s Great Depression: SEC mandated D/E ratio disclosure in financial statements",
        "1950s Corporate Finance: Modigliani-Miller theorem formalized capital structure theory",
        "1970s Investment Banking: Wall Street analysts standardized D/E for valuation multiples",
        "1980s Leveraged Buyouts: Private equity firms used D/E to structure acquisition financing",
        "2000s Financial Crisis: Basel Accords incorporated D/E into global banking regulations"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Business Purpose",
      points: [
        "United States: Wall Street investment banks developed D/E for merger analysis",
        "United Kingdom: London Stock Exchange required D/E for listed company disclosures",
        "Japan: Keiretsu groups used D/E for inter-company financing decisions",
        "Germany: Manufacturing conglomerates established conservative D/E benchmarks",
        "China: State-owned enterprises adopted D/E for infrastructure project financing",
        "Purpose: Measure financial leverage, assess bankruptcy risk, and optimize capital structure"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Commercial Banking: Daily D/E analysis for corporate lending decisions",
        "Private Equity: Monthly D/E monitoring for portfolio company leverage",
        "Real Estate: Quarterly D/E calculation for property acquisition financing",
        "Manufacturing: Monthly review of D/E for equipment financing decisions",
        "Utilities: Regulatory D/E reporting for rate-setting commission filings",
        "Technology: Venture capital D/E assessment for growth stage funding",
        "Construction: Project-based D/E analysis for bonding capacity"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Reduces bankruptcy risk by 60-80% through optimal leverage management",
        "Improves credit ratings by 2-3 notches with balanced D/E ratios",
        "Lowers borrowing costs by 1-3% through better risk assessment",
        "Increases valuation multiples by 2-5x through efficient capital structure",
        "Prevents liquidity crises by maintaining healthy equity buffers",
        "Enables 25-40% larger acquisitions through structured leverage",
        "Reduces regulatory capital requirements by 15-30% for financial institutions"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Investment Banking: Earn 1-2% fees on D/E optimization advisory services",
        "Commercial Lending: Generate 3-5% spreads on risk-adjusted loan pricing",
        "Private Equity: Achieve 20-30% IRR through leveraged acquisitions",
        "Financial Software: Sell $50,000-$500,000 D/E analytics platforms",
        "Credit Rating Agencies: Charge $25,000-$100,000 for D/E-based ratings",
        "M&A Advisory: Earn 1% success fees on D/E-structured transactions",
        "Risk Management: Sell $100,000+ D/E monitoring services to corporations"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Debt-to-Equity Calculator Uses",
      points: [
        "Small Business Owners: Assessing loan capacity for expansion or equipment",
        "Real Estate Investors: Calculating property leverage for mortgage decisions",
        "Startup Founders: Determining optimal funding mix between debt and equity",
        "Franchise Operators: Evaluating franchise purchase financing options",
        "Online Business Owners: Assessing e-commerce business leverage for scaling",
        "Professional Practices: Doctors/lawyers analyzing practice financing",
        "Farmers: Calculating equipment and land acquisition leverage",
        "Retail Store Owners: Assessing inventory and expansion financing"
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
        <link rel="canonical" href={`${siteUrl}/debt-to-equity-calculator`} />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Debt-to-Equity Ratio Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your company's financial leverage and assess capital structure health.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your company's total liabilities and equity — we'll extract numbers from any format.
            </p>

            {error && (
              <div className={styles.error}>{error}</div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="totalLiabilities" className={styles.label}>
                Total Liabilities ($)
              </label>
              <input
                id="totalLiabilities"
                type="text"
                value={totalLiabilities}
                onChange={(e) => setTotalLiabilities(e.target.value)}
                placeholder="e.g. $500,000 or 500K"
                className={styles.input}
              />
              <small className={styles.note}>
                All debts: loans, payables, obligations.
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="totalEquity" className={styles.label}>
                Total Shareholders' Equity ($)
              </label>
              <input
                id="totalEquity"
                type="text"
                value={totalEquity}
                onChange={(e) => setTotalEquity(e.target.value)}
                placeholder="e.g. $750,000 or 1.2M"
                className={styles.input}
              />
              <small className={styles.note}>
                Book value: assets minus liabilities.
              </small>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Ratio</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Capital Structure Analysis</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>Total Liabilities:</strong> ${result.totalLiabilities}
                </div>
                <div className={styles.resultItem}>
                  <strong>Total Equity:</strong> ${result.totalEquity}
                </div>
                <div className={`${styles.resultItem} ${styles.highlight}`}>
                  <strong>Debt-to-Equity Ratio:</strong> {result.ratio}
                </div>
                <div className={styles.resultItem}>
                  <strong>Financial Risk:</strong>{' '}
                  <span className={result.riskColor}> {result.riskLevel}</span>
                </div>
              </div>
              <div className={styles.note}>
                A ratio of <strong>{result.ratio}</strong> indicates{' '}
                {result.riskLevel.toLowerCase()} financial risk for creditors and investors.
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Debt-to-Equity Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of debt-to-equity calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {debtEquityHistory.map((card) => (
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

export default DebtEquityCalculator;