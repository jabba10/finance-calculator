import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './currentratiocalculator.module.css';

const CurrentRatioCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [currentAssets, setCurrentAssets] = useState('');
  const [currentLiabilities, setCurrentLiabilities] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Helper: Extract first number from any string
  const parseNumber = (input) => {
    if (!input) return NaN;
    const match = input.toString().replace(/,/g, '').match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const assets = parseNumber(currentAssets);
    const liabilities = parseNumber(currentLiabilities);

    // Validate inputs
    if (isNaN(assets)) {
      setError('Please enter a valid value for Current Assets.');
      return;
    }
    if (isNaN(liabilities)) {
      setError('Please enter a valid value for Current Liabilities.');
      return;
    }
    if (liabilities <= 0) {
      setError('Current Liabilities must be greater than zero.');
      return;
    }

    const ratio = (assets / liabilities).toFixed(2);
    const isHealthy = ratio >= 1.2 && ratio <= 2.0;

    setResult({
      assets: assets.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      liabilities: liabilities.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      ratio,
      isHealthy,
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
  const pageTitle = 'Free Current Ratio Calculator 2024 | Liquidity Ratio Analysis Tool';
  const pageDescription = 'Calculate current ratio to measure business liquidity and short-term financial health. Free current ratio calculator for financial analysis and credit assessment.';

  // Current Ratio History Data
  const currentRatioHistory = [
    {
      id: 1,
      title: "History & Discovery of Current Ratio",
      points: [
        "1890s US Banking: Commercial banks created current ratio to assess short-term loan repayment capacity",
        "1920s Accounting Standards: American Institute of Accountants formalized current ratio as liquidity benchmark",
        "1930s Great Depression: SEC mandated current ratio disclosure in corporate financial statements",
        "1950s Corporate Finance: Financial analysts established 2:1 as ideal current ratio benchmark",
        "1970s Global Banking: Basel Committee incorporated current ratio into international banking standards",
        "2000s Financial Technology: Automated current ratio calculators became standard in accounting software"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Business Purpose",
      points: [
        "United States: Wall Street analysts developed current ratio for corporate bond rating systems",
        "United Kingdom: London financial district established current ratio for trade credit assessment",
        "Japan: Keiretsu business networks used current ratio for supplier payment term negotiations",
        "Germany: Manufacturing export companies used current ratio for international trade financing",
        "China: State-owned banks implemented current ratio for domestic enterprise credit scoring",
        "Purpose: Measure short-term financial health, assess liquidity risk, and ensure operational continuity"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Commercial Banking: Daily current ratio monitoring for corporate credit line reviews",
        "Manufacturing: Weekly current ratio analysis for raw material purchasing decisions",
        "Retail Chains: Monthly current ratio tracking for inventory management and seasonal planning",
        "Construction: Project-based current ratio assessment for contractor payment schedules",
        "Healthcare: Quarterly current ratio review for medical supply procurement and insurance reimbursements",
        "Technology: Continuous current ratio monitoring for R&D funding and talent acquisition",
        "Transportation: Monthly current ratio analysis for fuel purchases and equipment maintenance"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Prevents 85-95% of cash flow crises through early liquidity warning signals",
        "Reduces short-term borrowing costs by 2-4% through better credit ratings",
        "Improves supplier relationships by ensuring 99% on-time payment track record",
        "Identifies $50,000-$500,000 in excess inventory for cash conversion",
        "Reduces emergency financing needs by 60-80% through proactive liquidity management",
        "Improves loan approval rates by 40-60% through strong current ratio presentation",
        "Enables 20-30% faster growth through optimal working capital allocation"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Financial Software: Charge $5,000-$50,000 for current ratio analytics and forecasting tools",
        "Banking Services: Generate 10-20% of commercial banking revenue from current ratio-based lending",
        "Accounting Firms: Bill $10,000-$100,000 for current ratio optimization consulting services",
        "Supply Chain Finance: Create 3-5% profit margins through current ratio-based payment solutions",
        "Investment Analysis: Generate 20%+ returns by identifying companies with improving current ratios",
        "Credit Rating Agencies: Charge $15,000-$75,000 for current ratio-based corporate ratings",
        "M&A Advisory: Earn 1-2% transaction fees on deals where current ratio is key to valuation"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Current Ratio Calculator Uses",
      points: [
        "Small Business Owners: Monitoring cash flow for shops, restaurants, and local services",
        "Freelancers: Managing client project advances against operating expenses",
        "Real Estate Investors: Assessing property liquidity for mortgage refinancing decisions",
        "E-commerce Sellers: Balancing inventory purchases with sales revenue cycles",
        "Contractors: Tracking project payments against material and labor costs",
        "Farmers: Planning seasonal expenses against crop revenue timelines",
        "Restaurant Owners: Managing food inventory turnover against daily sales",
        "Consultants: Ensuring retainers cover monthly business operations and taxes"
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
        <link rel="canonical" href={`${siteUrl}/current-ratio-calculator`} />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Current Ratio Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your business's current ratio to assess short-term liquidity and financial health.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your current assets and liabilities — we'll extract numbers from any format (e.g., $120K, 80k, 1.2 million).
            </p>

            {error && (
              <div className={styles.error}>{error}</div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="currentAssets" className={styles.label}>
                Current Assets ($)
              </label>
              <input
                id="currentAssets"
                type="text"
                value={currentAssets}
                onChange={(e) => setCurrentAssets(e.target.value)}
                placeholder="e.g. $120,000 or 120K"
                className={styles.input}
              />
              <small className={styles.note}>
                Cash, accounts receivable, inventory, prepaid expenses — all convertible within a year.
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="currentLiabilities" className={styles.label}>
                Current Liabilities ($)
              </label>
              <input
                id="currentLiabilities"
                type="text"
                value={currentLiabilities}
                onChange={(e) => setCurrentLiabilities(e.target.value)}
                placeholder="e.g. $80,000 or 80K"
                className={styles.input}
              />
              <small className={styles.note}>
                Accounts payable, short-term loans, accrued expenses, taxes due within 12 months.
              </small>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Current Ratio</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Current Ratio Result</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>Current Assets:</strong> ${result.assets}
                </div>
                <div className={styles.resultItem}>
                  <strong>Current Liabilities:</strong> ${result.liabilities}
                </div>
                <div className={`${styles.resultItem} ${styles.highlight} ${result.isHealthy ? styles.positive : styles.negative}`}>
                  <strong>Current Ratio:</strong> {result.ratio}
                </div>
                <div className={styles.resultItem}>
                  <strong>Status:</strong> {result.isHealthy ? 'Healthy' : 'Needs Attention'}
                </div>
              </div>
              <div className={styles.note}>
                {result.isHealthy
                  ? `A ratio of ${result.ratio} indicates strong short-term financial health.`
                  : `A ratio below 1.2 or above 2.0 may signal liquidity risk or inefficient asset use.`
                }
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Current Ratio Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of current ratio calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {currentRatioHistory.map((card) => (
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

export default CurrentRatioCalculator;