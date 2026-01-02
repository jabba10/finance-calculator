import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './workingcapitalcalculator.module.css';

const WorkingCapitalCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [currentAssets, setCurrentAssets] = useState('');
  const [currentLiabilities, setCurrentLiabilities] = useState('');
  const [result, setResult] = useState(null);

  // Robust number extraction
  const parseNumber = (input) => {
    if (!input) return NaN;
    const match = input.toString().replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const assets = parseNumber(currentAssets);
    const liabilities = parseNumber(currentLiabilities);

    if (isNaN(assets) || isNaN(liabilities)) {
      alert("Please enter valid numbers");
      return;
    }

    if (liabilities < 0 || assets < 0) {
      alert("Values cannot be negative");
      return;
    }

    const workingCapital = assets - liabilities;
    const ratio = liabilities !== 0 ? (assets / liabilities).toFixed(2) : 'Infinity';
    const isHealthyRatio = ratio !== 'Infinity' && parseFloat(ratio) >= 1.2 && parseFloat(ratio) <= 2.0;

    setResult({
      assets: assets.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      liabilities: liabilities.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      capital: workingCapital.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      ratio,
      healthy: isHealthyRatio,
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
  const pageTitle = 'Free Working Capital Calculator 2024 | Current Ratio & Liquidity Analysis';
  const pageDescription = 'Calculate working capital, current ratio, and assess business liquidity. Free working capital calculator for financial health analysis and cash flow management.';

  // Working Capital History Data
  const workingCapitalHistory = [
    {
      id: 1,
      title: "History & Discovery of Working Capital",
      points: [
        "1890s Industrial Accounting: British accountants created working capital concept to track day-to-day operational funds",
        "1920s US Banking Revolution: Commercial banks formalized working capital analysis for corporate lending decisions",
        "1930s Great Depression: Financial crisis made working capital monitoring essential for business survival",
        "1950s Corporate Finance: Harvard Business School established working capital as core financial metric",
        "1970s Global Trade Expansion: Multinational corporations developed sophisticated working capital management systems",
        "1990s Financial Software: Accounting software automated working capital calculations for all business sizes"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Business Purpose",
      points: [
        "United Kingdom: Victorian era industrialists pioneered working capital tracking for factory operations",
        "United States: Wall Street analysts created working capital ratios for investment screening",
        "Japan: Keiretsu business groups developed JIT systems requiring precise working capital management",
        "Germany: Manufacturing giants used working capital to optimize production cycles",
        "China: Export-driven economy mastered working capital efficiency for global competitiveness",
        "Purpose: Measure short-term financial health, ensure liquidity, and enable smooth business operations"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Manufacturing: Weekly monitoring of raw material inventory and supplier payments",
        "Retail Chains: Daily cash flow tracking for inventory purchases and payroll",
        "Construction: Monthly working capital analysis for project financing and contractor payments",
        "Healthcare: Bi-weekly monitoring of receivables from insurance companies and patient payments",
        "Technology: Quarterly working capital assessment for R&D funding and talent acquisition",
        "Agriculture: Seasonal working capital planning for planting, harvesting, and equipment maintenance",
        "Transportation: Weekly fuel, maintenance, and payroll working capital requirements"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Prevents cash flow crises by 85% through proactive working capital monitoring",
        "Reduces short-term borrowing costs by 30-50% through better cash management",
        "Improves supplier relationships by ensuring timely payments and better terms",
        "Identifies $100,000+ in excess inventory that can be converted to cash",
        "Reduces late payment penalties and interest charges by 60-75%",
        "Enables 25% faster growth by ensuring adequate operational funding",
        "Improves credit ratings by demonstrating strong liquidity management"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Financial Consulting: Charge $5,000-$50,000 for working capital optimization projects",
        "Banking Services: Generate 15-25% of bank revenue from working capital financing products",
        "Software Solutions: Sell $10,000-$100,000 enterprise working capital management systems",
        "Supply Chain Finance: Create 3-5% revenue streams through early payment discount programs",
        "Investment Analysis: Identify undervalued companies with strong working capital positions",
        "M&A Advisory: Earn 1-2% fees on deals where working capital is a key valuation component",
        "Credit Insurance: Generate premiums on working capital protection policies"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Working Capital Calculator Uses",
      points: [
        "Small Business Owners: Monitoring cash flow for shops, restaurants, and service businesses",
        "Freelancers: Managing client payments against operational expenses and taxes",
        "Real Estate Investors: Tracking rental income versus property maintenance costs",
        "Online Sellers: Balancing inventory purchases with sales revenue on Amazon/Etsy",
        "Farmers: Planning seasonal expenses against crop sales timelines",
        "Contractors: Managing project advances against material and labor costs",
        "Consultants: Ensuring retainers cover monthly business operations",
        "Nonprofits: Monitoring donation inflows against program and administrative costs"
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
        <link rel="canonical" href={`${siteUrl}/working-capital-calculator`} />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Working Capital Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your business's working capital and current ratio to assess short-term financial health.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your current assets and current liabilities to calculate working capital and liquidity.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="currentAssets" className={styles.label}>
                Current Assets ($)
              </label>
              <input
                id="currentAssets"
                type="text"
                value={currentAssets}
                onChange={(e) => setCurrentAssets(e.target.value)}
                placeholder="e.g. 150,000 or $150K"
                className={styles.input}
              />
              <small className={styles.note}>
                Cash, accounts receivable, inventory, marketable securities.
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
                placeholder="e.g. 90,000 or $90K"
                className={styles.input}
              />
              <small className={styles.note}>
                Accounts payable, short-term debt, accrued expenses, upcoming taxes.
              </small>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Working Capital</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Working Capital Summary</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>Current Assets:</strong> ${result.assets}
                </div>
                <div className={styles.resultItem}>
                  <strong>Current Liabilities:</strong> ${result.liabilities}
                </div>
                <div className={`${styles.resultItem} ${styles.highlight} ${result.capital >= 0 ? styles.positive : styles.negative}`}>
                  <strong>Working Capital:</strong> ${result.capital}
                </div>
                <div className={styles.resultItem}>
                  <strong>Current Ratio:</strong> {result.ratio}
                </div>
              </div>
              <div className={styles.note}>
                {result.capital >= 0
                  ? `You have $${result.capital} in working capital. This means you can cover short-term obligations.`
                  : `Negative working capital ($${Math.abs(parseFloat(result.capital.replace(/,/g, '')))} deficit) indicates potential liquidity issues.`
                }
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Working Capital Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of working capital calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {workingCapitalHistory.map((card) => (
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

export default WorkingCapitalCalculator;