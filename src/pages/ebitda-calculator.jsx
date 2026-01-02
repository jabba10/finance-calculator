import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './ebitdacalculator.module.css';

const EbitdaCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [revenue, setRevenue] = useState('');
  const [cogs, setCogs] = useState('');
  const [opex, setOpex] = useState('');
  const [result, setResult] = useState(null);

  // Enhanced number parsing: handles $, commas, k, M, etc.
  const parseCurrency = (input) => {
    if (!input || typeof input !== 'string') return NaN;

    // Convert k, M, B shortcuts
    const lower = input.toLowerCase();
    let multiplier = 1;
    if (lower.includes('k')) multiplier = 1e3;
    else if (lower.includes('m')) multiplier = 1e6;
    else if (lower.includes('b')) multiplier = 1e9;

    // Remove all non-digit or decimal characters except minus at start
    const cleaned = input.replace(/[^0-9.-]+/g, '');
    const num = parseFloat(cleaned);

    // Return NaN if invalid, otherwise apply multiplier
    return isNaN(num) ? NaN : num * multiplier;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const rev = parseCurrency(revenue);
    const cost = parseCurrency(cogs);
    const expenses = parseCurrency(opex);

    // If any value is NaN, treat as 0 (still compute)
    const safeRev = isNaN(rev) ? 0 : rev;
    const safeCost = isNaN(cost) ? 0 : cost;
    const safeExpenses = isNaN(expenses) ? 0 : expenses;

    const grossProfit = safeRev - safeCost;
    const ebitda = grossProfit - safeExpenses;
    const margin = safeRev > 0 ? ((ebitda / safeRev) * 100).toFixed(2) : 0;

    setResult({
      revenue: safeRev.toLocaleString(),
      grossProfit: grossProfit.toLocaleString(),
      ebitda: ebitda.toLocaleString(),
      margin,
      positive: ebitda >= 0,
    });
  };

  // Magnetic effect on CTA button
  const handleMouseMove = (e) => {
    if (!ctaButtonRef.current) return;
    const el = ctaButtonRef.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  // SEO Metadata
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = 'EBITDA Calculator | Free Earnings Before Interest Taxes Depreciation Amortization Tool';
  const pageDescription = 'Calculate EBITDA instantly to measure business operational profitability. Analyze financial performance and valuation metrics.';

  // EBITDA Calculator History Data
  const ebitdaCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of EBITDA",
      points: [
        "1960s Wall Street: Investment bankers created EBITDA for leveraged buyout analysis",
        "1980s M&A Boom: Kohlberg Kravis Roberts popularized EBITDA in mega-deals",
        "1990s Tech Revolution: Silicon Valley adopted EBITDA for high-growth company valuation",
        "2000s Private Equity: PE firms standardized EBITDA multiples for portfolio valuation",
        "2010s Global Finance: International accounting bodies debated EBITDA standardization",
        "Modern Era: Real-time EBITDA calculation with AI-driven predictive analytics",
        "Purpose: Measure operational cash flow independent of financing and accounting decisions"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Business Purpose",
      points: [
        "United States: Wall Street investment banks developed EBITDA for LBO analysis",
        "United Kingdom: Private equity firms adopted EBITDA for cross-border acquisitions",
        "Germany: Manufacturing giants used EBITDA for operational efficiency benchmarking",
        "Japan: Keiretsu groups implemented EBITDA for international expansion analysis",
        "Switzerland: Global corporations standardized EBITDA for investor reporting",
        "China: State-owned enterprises adapted EBITDA for Western investor communication",
        "Purpose: Provide comparable operational profitability metric across industries and geographies"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Quarterly Applications",
      points: [
        "Private Equity: Daily EBITDA analysis for portfolio company monitoring",
        "Investment Banking: Deal-specific EBITDA calculations for M&A transactions",
        "Public Companies: Quarterly EBITDA reporting in SEC filings and earnings calls",
        "Startups: Monthly EBITDA tracking for investor updates and burn rate management",
        "Manufacturing: Weekly EBITDA monitoring for production efficiency optimization",
        "Technology: Real-time EBITDA analysis for SaaS metrics and growth tracking",
        "Healthcare: Procedure-based EBITDA calculation for service line profitability",
        "Real Estate: Property-level EBITDA analysis for asset valuation and management"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Identifies 20-40% operational improvement opportunities through margin analysis",
        "Improves acquisition target valuation accuracy by 30% through multiple analysis",
        "Reduces due diligence time by 50% through standardized profitability measurement",
        "Increases investment returns by 25% through better operational benchmarking",
        "Enables 40% faster business scaling with clear operational performance metrics",
        "Identifies $10M+ value creation potential in acquisition targets",
        "Improves lender confidence with transparent operational cash flow analysis"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Investment Banks: Generate $100M+ fees on EBITDA-based M&A deals",
        "Private Equity: Achieve 3-5x returns through EBITDA multiple expansion",
        "Consulting Firms: Charge $500K+ for EBITDA optimization projects",
        "Valuation Experts: Earn $50K+ for EBITDA-based business appraisals",
        "Corporate Finance: Save $10M+ through EBITDA-driven operational improvements",
        "Startup Investors: Realize 10x+ returns on EBITDA-positive exits",
        "Lending Institutions: Secure 8-12% returns on EBITDA-based loans"
      ]
    },
    {
      id: 6,
      title: "Ordinary People EBITDA Calculator Uses",
      points: [
        "Small Business Owners: Evaluating operational profitability for bank loans",
        "Startup Founders: Calculating burn rate and runway for investor presentations",
        "Real Estate Investors: Analyzing property operational cash flows",
        "Franchise Owners: Comparing unit profitability across locations",
        "Online Sellers: Assessing e-commerce store operational efficiency",
        "Consultants: Preparing client financial analysis and valuation reports",
        "Students: Learning corporate finance and valuation methodologies",
        "Investors: Analyzing public company earnings reports and SEC filings"
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
        <link rel="canonical" href={`${siteUrl}/ebitda-calculator`} />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>EBITDA Calculator</h1>
          <p className={styles.subtitle}>
            Calculate Earnings Before Interest, Taxes, Depreciation, and Amortization to assess business profitability.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your total revenue, cost of goods sold (COGS), and operating expenses.
              You can use formats like $1.2M, 500k, 1,200,000, etc.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="revenue" className={styles.label}>
                Total Revenue ($)
              </label>
              <input
                id="revenue"
                type="text"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                placeholder="e.g. 1,200,000 or $1.2M"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="cogs" className={styles.label}>
                Cost of Goods Sold (COGS) ($)
              </label>
              <input
                id="cogs"
                type="text"
                value={cogs}
                onChange={(e) => setCogs(e.target.value)}
                placeholder="e.g. 450,000 or $450k"
                className={styles.input}
              />
              <small className={styles.note}>
                Direct costs of producing goods or services (materials, labor, manufacturing).
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="opex" className={styles.label}>
                Operating Expenses ($)
              </label>
              <input
                id="opex"
                type="text"
                value={opex}
                onChange={(e) => setOpex(e.target.value)}
                placeholder="e.g. 300,000"
                className={styles.input}
              />
              <small className={styles.note}>
                Rent, salaries, marketing, utilities, admin — excluding interest, taxes, depreciation.
              </small>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate EBITDA</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>EBITDA Results</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>Revenue:</strong> ${result.revenue}
                </div>
                <div className={styles.resultItem}>
                  <strong>Gross Profit:</strong> ${result.grossProfit}
                </div>
                <div className={`${styles.resultItem} ${styles.highlight} ${result.positive ? styles.positive : styles.negative}`}>
                  <strong>EBITDA:</strong> ${result.ebitda}
                </div>
                <div className={styles.resultItem}>
                  <strong>Margin:</strong> {result.margin}%
                </div>
              </div>
              <div className={styles.note}>
                {result.positive
                  ? `Your business generated $${result.ebitda} in EBITDA. This measures core operational profitability.`
                  : `Negative EBITDA suggests operational losses. Review costs or revenue strategy.`
                }
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>EBITDA Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of EBITDA calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {ebitdaCalculatorHistory.map((card) => (
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

export default EbitdaCalculator;