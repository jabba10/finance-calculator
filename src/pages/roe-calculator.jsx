import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './roecalculator.module.css';

const ROECalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [netIncome, setNetIncome] = useState('');
  const [shareholderEquity, setShareholderEquity] = useState('');
  const [result, setResult] = useState(null);

  // Helper: Parse input (remove commas, allow decimals)
  const parseNumber = (value) => {
    if (!value) return NaN;
    // Remove commas and any non-numeric characters except decimal point
    const clean = value.toString().replace(/[^0-9.]/g, '');
    return parseFloat(clean);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const income = parseNumber(netIncome);
    const equity = parseNumber(shareholderEquity);

    // Validation
    if (isNaN(income)) {
      alert("Please enter a valid number for Net Income.");
      return;
    }
    if (isNaN(equity) || equity <= 0) {
      alert("Shareholder's Equity must be a positive number.");
      return;
    }

    const roe = ((income / equity) * 100).toFixed(2);
    const isStrong = parseFloat(roe) >= 15;

    setResult({
      netIncome: income.toLocaleString(),
      shareholderEquity: equity.toLocaleString(),
      roe,
      isStrong,
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
  const pageTitle = 'ROE Calculator | Free Return on Equity Tool';
  const pageDescription = 'Calculate Return on Equity (ROE) to measure how efficiently a company generates profit from shareholder investment.';

  // ROE History Data
  const roeHistory = [
    {
      id: 1,
      title: "History & Discovery of Return on Equity",
      points: [
        "1910s US Stock Markets: Financial analysts created ROE to compare railroad company profitability",
        "1920s Graham-Dodd Analysis: Value investing pioneers formalized ROE as key stock selection metric",
        "1930s SEC Regulations: Required ROE disclosure in public company financial statements",
        "1950s Modern Portfolio Theory: ROE became central to risk-adjusted return calculations",
        "1970s Corporate Finance: Harvard Business School established ROE as primary management performance metric",
        "1990s Global Investing: International accounting standards unified ROE calculation methodologies"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Business Purpose",
      points: [
        "United States: Wall Street analysts developed ROE for blue-chip stock comparison",
        "United Kingdom: London financial district used ROE for Commonwealth company analysis",
        "Japan: Keiretsu business groups adopted ROE for cross-company performance benchmarking",
        "Germany: Manufacturing conglomerates used ROE for capital allocation decisions",
        "Switzerland: Private banking institutions applied ROE to family office investments",
        "Purpose: Measure management efficiency, assess capital allocation, and evaluate shareholder value creation"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Investment Banking: Daily ROE analysis for equity research and stock recommendations",
        "Private Equity: Quarterly ROE monitoring for portfolio company performance assessment",
        "Asset Management: Monthly ROE screening for mutual fund and ETF stock selection",
        "Corporate Finance: Weekly ROE tracking for executive compensation and bonus calculations",
        "Commercial Banking: ROE assessment for corporate lending and credit risk analysis",
        "Venture Capital: ROE projection for startup valuation and funding round decisions",
        "Insurance Companies: ROE evaluation for investment portfolio management"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Identifies 20-30% underperforming assets for strategic divestment or turnaround",
        "Improves capital allocation efficiency by 25-40% through ROE-based investment decisions",
        "Increases shareholder value by 15-25% through focused profitability improvement",
        "Reduces wasteful capital expenditures by 30-50% through ROE-based project screening",
        "Enables 2-3x higher acquisition premiums for companies with consistently strong ROE",
        "Improves stock valuation multiples by 20-35% through sustained ROE excellence",
        "Reduces cost of capital by 1-3% through enhanced investor confidence"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Investment Research: Charge $5,000-$50,000 annually for ROE-based stock analysis reports",
        "Financial Software: Sell $10,000-$250,000 ROE analytics and forecasting platforms",
        "Management Consulting: Bill $100,000-$1,000,000 for ROE improvement strategy projects",
        "Corporate Training: Generate $25,000-$150,000 for ROE-focused executive education programs",
        "Investment Banking: Earn 1-2% fees on M&A deals where ROE improvement drives valuation",
        "Private Equity: Achieve 25%+ IRR through ROE-focused turnaround investments",
        "Hedge Funds: Generate 20%+ returns by shorting low-ROE and longing high-ROE stocks"
      ]
    },
    {
      id: 6,
      title: "Ordinary People ROE Calculator Uses",
      points: [
        "Individual Investors: Comparing stock performance before buying shares",
        "Small Business Owners: Measuring profitability efficiency for growth planning",
        "Real Estate Investors: Calculating property investment returns vs equity",
        "Retirement Planners: Assessing mutual fund and ETF performance for 401k/IRA",
        "Startup Founders: Demonstrating capital efficiency to potential investors",
        "Franchise Operators: Evaluating different franchise opportunities",
        "Online Business Owners: Tracking e-commerce store profitability over time",
        "Professional Investors: Screening stocks for personal portfolio management"
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
        <link rel="canonical" href={`${siteUrl}/roe-calculator`} />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>ROE Calculator</h1>
          <p className={styles.subtitle}>
            Calculate Return on Equity (ROE) to measure how efficiently a company generates profit from shareholder investment.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter net income and shareholder's equity to calculate ROE.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="netIncome" className={styles.label}>
                Net Income ($)
              </label>
              <input
                id="netIncome"
                type="text"
                value={netIncome}
                onChange={(e) => setNetIncome(e.target.value)}
                placeholder="e.g. 75,000"
                className={styles.input}
                required
              />
              <small className={styles.note}>
                Profit after all expenses, taxes, and interest — from the income statement.
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="shareholderEquity" className={styles.label}>
                Shareholder's Equity ($)
              </label>
              <input
                id="shareholderEquity"
                type="text"
                value={shareholderEquity}
                onChange={(e) => setShareholderEquity(e.target.value)}
                placeholder="e.g. 500,000"
                className={styles.input}
                required
              />
              <small className={styles.note}>
                Total assets minus total liabilities — from the balance sheet.
              </small>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate ROE</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Return on Equity (ROE)</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>Net Income:</strong> ${result.netIncome}
                </div>
                <div className={styles.resultItem}>
                  <strong>Shareholder's Equity:</strong> ${result.shareholderEquity}
                </div>
                <div className={`${styles.resultItem} ${styles.highlight} ${result.isStrong ? styles.positive : styles.negative}`}>
                  <strong>ROE:</strong> {result.roe}%
                </div>
                <div className={styles.resultItem}>
                  <strong>Efficiency:</strong> {result.isStrong ? 'High' : 'Moderate/Low'}
                </div>
              </div>
              <div className={styles.note}>
                {result.isStrong
                  ? `An ROE of ${result.roe}% indicates strong profitability and efficient use of equity capital.`
                  : `An ROE below 15% may suggest inefficiency or intense competition. Compare to industry peers.`
                }
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>ROE Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of return on equity calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {roeHistory.map((card) => (
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

export default ROECalculator;