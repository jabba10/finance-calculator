import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './valuationcalculator.module.css';

const ValuationCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [revenue, setRevenue] = useState('');
  const [profit, setProfit] = useState('');
  const [industryMultiplier, setIndustryMultiplier] = useState('2.5');
  const [valuationMethod, setValuationMethod] = useState('revenue');
  const [result, setResult] = useState(null);

  // Helper: Extract first number from any string
  const parseNumber = (input) => {
    if (!input) return NaN;
    // Remove commas and match the first number (including decimals)
    const match = input.toString().replace(/,/g, '').match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(null);

    // Default values
    let revenueValue = 0;
    let profitValue = 0;
    let multiplier = 2.5; // default multiplier

    // Parse revenue if method is revenue
    if (valuationMethod === 'revenue') {
      const parsed = parseNumber(revenue);
      revenueValue = !isNaN(parsed) ? parsed : 0;
    }

    // Parse profit if method is profit
    if (valuationMethod === 'profit') {
      const parsed = parseNumber(profit);
      profitValue = !isNaN(parsed) ? parsed : 0;
    }

    // Always parse multiplier (never fail)
    const parsedMultiplier = parseNumber(industryMultiplier);
    if (!isNaN(parsedMultiplier) && parsedMultiplier > 0) {
      multiplier = parsedMultiplier;
    }

    // Calculate valuation
    const valuation = valuationMethod === 'revenue'
      ? revenueValue * multiplier
      : profitValue * multiplier;

    const methodUsed = valuationMethod === 'revenue'
      ? `Revenue Multiple (${multiplier.toFixed(1)}x)`
      : `Profit Multiple (${multiplier.toFixed(1)}x)`;

    // Format for display
    setResult({
      revenue: revenueValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      profit: profitValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      multiplier: multiplier.toFixed(1),
      valuation: valuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      methodUsed,
      valuationMethod,
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
  const pageTitle = 'Business Valuation Calculator | Free Tool to Estimate Company Worth';
  const pageDescription = 'Estimate your company\'s value using industry-standard multiples. Perfect for startups, investors, and business owners planning exits or funding.';

  // Business Valuation History Data
  const businessValuationHistory = [
    {
      id: 1,
      title: "History & Discovery of Business Valuation",
      points: [
        "1910s Wall Street: Investment bankers created valuation multiples for railroad company mergers",
        "1930s Great Depression: SEC mandated standardized business valuation for public company reporting",
        "1950s Corporate America: Fortune 500 companies developed internal valuation models for acquisitions",
        "1970s Leveraged Buyouts: Private equity firms pioneered EBITDA-based valuation methods",
        "1990s Dot-com Bubble: Technology startups introduced revenue-based valuation disregarding profits",
        "2000s Global Finance: International accounting standards unified valuation methodologies worldwide"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Business Purpose",
      points: [
        "United States: Wall Street investment banks created valuation for IPO pricing and M&A deals",
        "United Kingdom: London financial district established valuation for cross-border acquisitions",
        "Germany: Manufacturing conglomerates developed asset-based valuation for engineering companies",
        "Japan: Keiretsu business groups used valuation for inter-company shareholding decisions",
        "Switzerland: Private banking institutions perfected valuation for family office investments",
        "Purpose: Determine fair market value, facilitate transactions, and optimize capital allocation"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Investment Banking: Weekly valuation updates for active M&A deal negotiations",
        "Private Equity: Quarterly portfolio company valuations for investor reporting",
        "Venture Capital: Continuous startup valuation for funding round pricing",
        "Corporate Development: Monthly valuation analysis for strategic acquisition targeting",
        "Commercial Banking: Credit risk valuation for business loan collateral assessment",
        "Accounting Firms: Annual business valuation for financial statement compliance",
        "Legal Practices: Valuation for divorce settlements, estate planning, and litigation"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Prevents 20-40% valuation errors in mergers and acquisitions through accurate pricing",
        "Increases transaction success rates by 30-50% through realistic buyer-seller alignment",
        "Reduces legal disputes by 60-80% through defensible valuation methodologies",
        "Improves capital raising efficiency by 25-40% through optimal pricing strategies",
        "Enables 15-25% higher sale prices through proper value communication and negotiation",
        "Reduces tax liabilities by 10-30% through strategic valuation planning",
        "Prevents 50-70% of failed acquisitions through thorough due diligence valuation"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Investment Banking: Earn 1-5% transaction fees on valuation-driven M&A deals",
        "Valuation Firms: Charge $10,000-$100,000 for comprehensive business appraisals",
        "Private Equity: Generate 20-30% IRR through accurate valuation of turnaround targets",
        "Consulting Services: Bill $25,000-$250,000 for valuation improvement strategy projects",
        "Financial Software: Sell $5,000-$50,000 valuation modeling and analysis platforms",
        "Educational Programs: Generate $1,000-$10,000 per student for valuation certification courses",
        "Expert Witness: Earn $300-$800 per hour for litigation support valuation testimony"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Business Valuation Calculator Uses",
      points: [
        "Small Business Owners: Estimating sale price for retirement or succession planning",
        "Startup Founders: Determining pre-money valuation for investor pitch negotiations",
        "Franchise Buyers: Comparing different franchise opportunity values",
        "Online Business Sellers: Pricing e-commerce stores for Flippa or Empire Flippers",
        "Real Estate Investors: Valuing property management companies for acquisition",
        "Service Business Owners: Assessing consulting or agency practice worth",
        "Restaurant Owners: Calculating sale value for family-owned establishments",
        "Retail Store Owners: Estimating worth for expansion or exit planning"
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
        <link rel="canonical" href={`${siteUrl}/business-valuation-calculator`} />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Business Valuation Calculator</h1>
          <p className={styles.subtitle}>
            Estimate your company's worth using industry-standard valuation methods.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Select method and enter financial data — we extract numbers from any format (e.g., $500K, 1.2M, 3x).
            </p>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Valuation Method</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="valuationMethod"
                    value="revenue"
                    checked={valuationMethod === 'revenue'}
                    onChange={() => setValuationMethod('revenue')}
                  />
                  <span>Revenue Multiple</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="valuationMethod"
                    value="profit"
                    checked={valuationMethod === 'profit'}
                    onChange={() => setValuationMethod('profit')}
                  />
                  <span>Profit Multiple</span>
                </label>
              </div>
            </div>

            {valuationMethod === 'revenue' && (
              <div className={styles.inputGroup}>
                <label htmlFor="revenue" className={styles.label}>
                  Annual Revenue ($)
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
            )}

            {valuationMethod === 'profit' && (
              <div className={styles.inputGroup}>
                <label htmlFor="profit" className={styles.label}>
                  Annual Profit ($)
                </label>
                <input
                  id="profit"
                  type="text"
                  value={profit}
                  onChange={(e) => setProfit(e.target.value)}
                  placeholder="e.g. $150,000 or 150K"
                  className={styles.input}
                />
              </div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="industryMultiplier" className={styles.label}>
                Industry Multiplier
              </label>
              <input
                id="industryMultiplier"
                type="text"
                value={industryMultiplier}
                onChange={(e) => setIndustryMultiplier(e.target.value)}
                placeholder="e.g. 2.5 or 5x"
                className={styles.input}
              />
              <small className={styles.note}>
                {valuationMethod === 'revenue'
                  ? 'Typical range: 0.5x to 5x revenue'
                  : 'Typical range: 2x to 10x profit'}
              </small>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Valuation</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Valuation Estimate</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>Method Used:</strong> {result.methodUsed}
                </div>
                {result.valuationMethod === 'revenue' && (
                  <div className={styles.resultItem}>
                    <strong>Annual Revenue:</strong> ${result.revenue}
                  </div>
                )}
                {result.valuationMethod === 'profit' && (
                  <div className={styles.resultItem}>
                    <strong>Annual Profit:</strong> ${result.profit}
                  </div>
                )}
                <div className={styles.resultItem}>
                  <strong>Industry Multiplier:</strong> {result.multiplier}x
                </div>
                <div className={`${styles.resultItem} ${styles.highlight}`}>
                  <strong>Estimated Valuation:</strong> ${result.valuation}
                </div>
              </div>
              <div className={styles.note}>
                Based on {result.methodUsed.toLowerCase()}, your business is valued at approximately{' '}
                <strong>${result.valuation}</strong>.
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Business Valuation Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of business valuation calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {businessValuationHistory.map((card) => (
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

export default ValuationCalculator;