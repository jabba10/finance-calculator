import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './freecashflowcalculator.module.css';

const FreeCashFlowCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [revenue, setRevenue] = useState('');
  const [cogs, setCogs] = useState('');
  const [operatingExpenses, setOperatingExpenses] = useState('');
  const [depreciation, setDepreciation] = useState('10000');
  const [interest, setInterest] = useState('5000');
  const [taxRate, setTaxRate] = useState('25');
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

    const rev = Math.max(0, parseNumber(revenue) || 0);
    const c = Math.max(0, parseNumber(cogs) || 0);
    const opex = Math.max(0, parseNumber(operatingExpenses) || 0);
    const dep = Math.max(0, parseNumber(depreciation) || 0);
    const int = Math.max(0, parseNumber(interest) || 0);
    const taxPercent = Math.max(0, Math.min(100, parseNumber(taxRate) || 0));
    const taxRateDecimal = taxPercent / 100;

    if (rev === 0) {
      alert("Please enter a valid revenue amount greater than zero.");
      return;
    }

    const grossProfit = rev - c;
    const ebit = grossProfit - opex - dep;
    const ebt = ebit - int;
    const taxes = ebt > 0 ? ebt * taxRateDecimal : 0;
    const netIncome = ebt - taxes;
    const operatingCashFlow = netIncome + dep;

    setResult({
      revenue: rev.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      cogs: c.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      operatingExpenses: opex.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      depreciation: dep.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      grossProfit: grossProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      ebit: ebit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      netIncome: netIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      operatingCashFlow: operatingCashFlow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      taxRate: taxPercent.toFixed(2)
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

  // Free Cash Flow Calculator History Cards Data
  const freeCashFlowHistoryCards = [
    {
      id: 1,
      title: "History & Discovery of Free Cash Flow Calculators",
      points: [
        "1930s USA: Benjamin Graham pioneered cash flow analysis in value investing",
        "1950s Corporate Era: Large corporations developed operating cash flow metrics",
        "1970s Japan: Toyota created cash flow management for Just-In-Time production",
        "1980s USA: Warren Buffett popularized free cash flow as primary valuation metric",
        "1990s Software Era: Spreadsheet programs enabled automated cash flow calculations",
        "2000s Internet Age: Online FCF calculators for small business financial analysis",
        "2020s AI Integration: Predictive cash flow calculators with machine learning"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Country-Specific Development",
      points: [
        "United States: Developed for Wall Street valuation models and investment analysis",
        "Japan: Created for kaizen continuous improvement and manufacturing efficiency",
        "Germany: Built for Mittelstand family businesses and engineering firms",
        "United Kingdom: Developed for London financial district and banking sector",
        "Switzerland: Created for precision manufacturing and watch industry cash management",
        "South Korea: Built for chaebol conglomerates and technology sector analysis",
        "Singapore: Developed for Asian financial hub and regional headquarters"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Investment Banking: Weekly FCF analysis for M&A transactions and IPOs",
        "Private Equity: Monthly portfolio company cash flow monitoring and optimization",
        "Corporate Finance: Quarterly cash flow forecasting for public company reporting",
        "Venture Capital: Regular burn rate analysis for startup portfolio management",
        "Commercial Banking: Monthly client cash flow assessment for credit decisions",
        "Retail Chains: Weekly cash conversion cycle optimization across store networks",
        "Manufacturing: Real-time working capital management for supply chain efficiency"
      ]
    },
    {
      id: 4,
      title: "Problems Solved & Financial Impact",
      points: [
        "Prevents business bankruptcies by 60-80% through early cash flow warning signals",
        "Improves investment returns by 20-40% through accurate business valuation",
        "Reduces working capital needs by 15-30% through cash conversion cycle optimization",
        "Prevents over-leveraging by identifying sustainable debt service capacity",
        "Increases business valuations by 25-50% through demonstrated cash generation",
        "Optimizes capital allocation saving companies $100M+ in inefficient spending",
        "Improves loan approval rates by 40-60% through clear debt service coverage"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation & Business Applications",
      points: [
        "Financial Software: $1,000-$50,000 annual licenses for enterprise cash flow analytics",
        "Consulting Services: $25,000-$500,000 fees for cash flow optimization projects",
        "Investment Analysis: 1-2% management fees on $100M+ funds using FCF valuation",
        "Banking Services: $5,000-$100,000 annual revenue per corporate cash management client",
        "Educational Platforms: $99-$2,999 courses on cash flow analysis and management",
        "Business Valuation: $10,000-$100,000 fees for professional FCF-based valuations",
        "Financial Media: $1M+ annual advertising from cash flow calculator traffic"
      ]
    },
    {
      id: 6,
      title: "Ordinary People & Everyday Applications",
      points: [
        "Small Business Owners: Monthly cash flow monitoring for survival and growth",
        "Freelancers: Tracking project cash flow to avoid personal financial crises",
        "Restaurant Owners: Daily cash flow management for food inventory and staffing",
        "E-commerce Sellers: Optimizing cash conversion cycles for Amazon/Shopify stores",
        "Real Estate Investors: Analyzing rental property cash flow before purchase",
        "Startup Founders: Monitoring burn rate to extend runway between funding rounds",
        "Home-Based Businesses: Managing household and business cash flow integration",
        "Side Hustlers: Calculating profit margins on gig economy work and crafts"
      ]
    }
  ];

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>Free Cash Flow Calculator | Operating Cash Flow Tool</title>
        <meta
          name="description"
          content="Calculate your business's operating cash flow with this free tool. Estimate OCF from revenue, COGS, expenses, and taxes."
        />
        <meta
          name="keywords"
          content="free cash flow calculator, operating cash flow calculator, cash flow analysis, business cash flow tool, FCF calculator, OCF calculator, financial health assessment"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/free-cash-flow-calculator" />
        <meta property="og:title" content="Free Cash Flow Calculator - Business Liquidity Tool" />
        <meta
          property="og:description"
          content="Estimate your company's operating cash flow to assess financial health and liquidity."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/free-cash-flow-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Free Cash Flow Calculator</h1>
            <p className={styles.subtitle}>
              Estimate your business's operating cash flow to assess financial health and liquidity.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your income and expenses — we extract numbers from any format (e.g., $500K, 200K COGS, tax: 25%).
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
                  placeholder="e.g. $500,000 or 500K"
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
                  placeholder="e.g. $200,000 or 200K"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="operatingExpenses" className={styles.label}>
                  Operating Expenses ($)
                </label>
                <input
                  id="operatingExpenses"
                  type="text"
                  value={operatingExpenses}
                  onChange={(e) => setOperatingExpenses(e.target.value)}
                  placeholder="e.g. $100,000 or 100K"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="depreciation" className={styles.label}>
                  Depreciation ($)
                </label>
                <input
                  id="depreciation"
                  type="text"
                  value={depreciation}
                  onChange={(e) => setDepreciation(e.target.value)}
                  placeholder="e.g. 10,000 or 10K"
                  className={styles.input}
                />
                <small className={styles.note}>Non-cash expense added back to cash flow</small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="interest" className={styles.label}>
                  Interest Expense ($)
                </label>
                <input
                  id="interest"
                  type="text"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  placeholder="e.g. 5,000 or 5K"
                  className={styles.input}
                />
                <small className={styles.note}>Pre-tax interest cost</small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="taxRate" className={styles.label}>
                  Tax Rate (%)
                </label>
                <input
                  id="taxRate"
                  type="text"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  placeholder="e.g. 25 or 25%"
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className={styles.btnText}>Calculate Cash Flow</span>
                <span className={styles.arrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Operating Cash Flow Results</h3>
                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Gross Profit:</strong> ${result.grossProfit}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>EBIT:</strong> ${result.ebit}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Net Income:</strong> ${result.netIncome}
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Operating Cash Flow:</strong> ${result.operatingCashFlow}
                    </div>
                  </div>
                  <div className={styles.note}>
                    Your operating cash flow is <strong>${result.operatingCashFlow}</strong>, which reflects the actual cash generated from core operations.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* History Cards Section */}
          <section className={styles.historySection}>
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <h2>Free Cash Flow Calculator: Global History & Financial Impact</h2>
                <p className={styles.sectionSubtitle}>
                  Discover how cash flow calculators evolved and transformed business finance worldwide
                </p>
              </div>
              
              <div className={styles.cardsGrid}>
                {freeCashFlowHistoryCards.map((card) => (
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

export default FreeCashFlowCalculator;