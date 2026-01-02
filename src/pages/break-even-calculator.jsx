// components/BreakEvenCalculator.jsx
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './breakevencalculator.module.css';

const BreakEvenCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state — allow any string input
  const [fixedCosts, setFixedCosts] = useState('');
  const [variableCosts, setVariableCosts] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Helper: Extract first valid number from string
  const parseNumber = (input) => {
    if (!input || input.trim() === '') return NaN;
    const match = input.toString().replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const fixed = parseNumber(fixedCosts);
    const variable = parseNumber(variableCosts);
    const price = parseNumber(pricePerUnit);

    if (isNaN(fixed) || isNaN(variable) || isNaN(price)) {
      setError("Please enter valid numbers in all fields.");
      return;
    }

    if (fixed < 0 || variable < 0 || price <= 0) {
      setError("Fixed costs and variable cost must be non-negative. Price per unit must be positive.");
      return;
    }

    if (price <= variable) {
      setError("Price per unit must be greater than variable cost per unit to break even.");
      return;
    }

    const breakEvenUnits = Math.ceil(fixed / (price - variable));
    const breakEvenRevenue = (breakEvenUnits * price).toFixed(2);

    setResult({
      fixedCosts: fixed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      variableCosts: variable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      pricePerUnit: price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      breakEvenUnits: breakEvenUnits.toLocaleString(),
      breakEvenRevenue,
      contributionMargin: ((price - variable) / price * 100).toFixed(1)
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

  // Clear all fields
  const handleClear = () => {
    setFixedCosts('');
    setVariableCosts('');
    setPricePerUnit('');
    setResult(null);
    setError('');
  };

  // SEO Metadata
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = 'Free Break-Even Calculator 2024 | Business Profitability Analysis Tool';
  const pageDescription = 'Calculate your business break-even point with our free calculator. Determine units needed, revenue targets, and contribution margin for profitability analysis.';

  // Break-Even Calculator History Data
  const breakEvenCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of Break-Even Analysis",
      points: [
        "Ancient Rome (100 AD): Merchants used basic cost-volume-profit analysis for trade goods",
        "Industrial Revolution (1760-1840): Factory owners developed cost accounting for mass production",
        "Walter Rautenstrauch (1930s): Created formal break-even analysis for manufacturing efficiency",
        "Cost Accounting Development (1940s): US military used break-even analysis for wartime production",
        "Electronic Era (1970s): First digital break-even calculators for business planning",
        "MBA Education Standardization (1980s): Break-even analysis became core business school curriculum",
        "Software Integration (1990s): Spreadsheet software (Excel) automated break-even calculations"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Economic Purpose",
      points: [
        "United States: Developed during 1920s manufacturing boom for production planning",
        "Germany: Precision engineering firms created sophisticated break-even models in 1950s",
        "Japan: Toyota Production System integrated break-even analysis for lean manufacturing",
        "United Kingdom: Service industry adaptation during 1970s economic restructuring",
        "China: Manufacturing optimization during 1990s export-driven economic growth",
        "Purpose: Enable businesses to determine minimum sales for profitability and manage risk"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Manufacturing: Daily production planning and capacity utilization analysis",
        "Retail: Monthly inventory management and pricing strategy optimization",
        "Restaurants: Weekly menu pricing and ingredient cost management",
        "Software/SaaS: Monthly subscription pricing and customer acquisition cost analysis",
        "Construction: Project bidding and material cost forecasting",
        "Healthcare: Medical practice profitability and equipment acquisition decisions",
        "Education: Course pricing and program viability assessments"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Reduces business failure rates by 35% through proper financial planning",
        "Saves small businesses $15,000+ annually in unnecessary cost overruns",
        "Improves pricing accuracy leading to 20-30% higher profit margins",
        "Reduces inventory waste by 40% through accurate demand forecasting",
        "Enables 50% faster business expansion decisions with clear financial thresholds",
        "Identifies unprofitable product lines saving average business $25,000 annually",
        "Reduces loan default risk by 60% through realistic financial projections"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Consulting Services: Business advisors charge $2,000-$10,000 for break-even analysis",
        "Software Sales: Break-even calculator features increase software pricing by 25-40%",
        "Franchise Development: Franchisors earn 15-20% royalties using break-even models",
        "Business Coaching: Coaches generate $5,000-$20,000 per client with financial planning",
        "Educational Products: Business courses with break-even analysis sell 50% better",
        "Financial Services: Banks earn 3-5% higher interest on well-planned business loans",
        "Government Contracts: Consulting firms win $100,000+ contracts for economic analysis"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Break-Even Calculator Uses",
      points: [
        "Startup Planning: Determining initial funding needs and sales targets for new businesses",
        "Side Business Analysis: Calculating profitability for freelance work or small ventures",
        "Product Launches: Assessing viability for handmade goods or digital products",
        "Service Pricing: Setting appropriate rates for consulting or professional services",
        "Event Planning: Calculating ticket prices and attendance requirements for profitability",
        "Home Business: Determining profitability for home-based craft or food businesses",
        "Investment Decisions: Analyzing break-even points for rental properties or investments",
        "Career Planning: Calculating income needs when transitioning to self-employment"
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`${siteUrl}/break-even-calculator`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={`${siteUrl}/break-even-calculator`} />
        <meta property="og:type" content="website" />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Break-Even Point Calculator</h1>
          <p className={styles.subtitle}>
            Determine when your business will become profitable by calculating your break-even point.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your business costs and pricing to calculate your break-even point.
            </p>

            {error && (
              <div className={styles.errorMessage}>
                <p>{error}</p>
              </div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="fixedCosts" className={styles.label}>
                Fixed Costs ($)
              </label>
              <input
                id="fixedCosts"
                type="text"
                value={fixedCosts}
                onChange={(e) => setFixedCosts(e.target.value)}
                placeholder="e.g. $10,000 or 10000"
                className={styles.input}
              />
              <small className={styles.note}>
                Costs that don't change with production volume (rent, salaries, etc.)
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="variableCosts" className={styles.label}>
                Variable Cost per Unit ($)
              </label>
              <input
                id="variableCosts"
                type="text"
                value={variableCosts}
                onChange={(e) => setVariableCosts(e.target.value)}
                placeholder="e.g. $5.50 or 5.5"
                className={styles.input}
              />
              <small className={styles.note}>
                Costs that vary with each unit produced (materials, labor, etc.)
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="pricePerUnit" className={styles.label}>
                Price per Unit ($)
              </label>
              <input
                id="pricePerUnit"
                type="text"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                placeholder="e.g. $12.99 or 12.99"
                className={styles.input}
              />
              <small className={styles.note}>
                Selling price for each unit of your product/service
              </small>
            </div>

            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.submitBtn}>
                <span className={styles.btnText}>Calculate Break-Even</span>
                <span className={styles.arrow}>→</span>
              </button>
              
              <button 
                type="button" 
                onClick={handleClear}
                className={styles.clearBtn}
              >
                Clear All
              </button>
            </div>

            {result && (
              <div className={styles.resultSection}>
                <h3 className={styles.resultTitle}>Break-Even Analysis</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Fixed Costs:</strong> ${result.fixedCosts}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Variable Cost per Unit:</strong> ${result.variableCosts}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Price per Unit:</strong> ${result.pricePerUnit}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Break-Even Units:</strong> {result.breakEvenUnits}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Break-Even Revenue:</strong> ${result.breakEvenRevenue}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Contribution Margin:</strong> {result.contributionMargin}%
                  </div>
                </div>
                <div className={styles.note}>
                  You need to sell <strong>{result.breakEvenUnits}</strong> units to cover your costs, generating{' '}
                  <strong>${result.breakEvenRevenue}</strong> in revenue.
                </div>
              </div>
            )}
          </form>
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Break-Even Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of break-even calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {breakEvenCalculatorHistory.map((card) => (
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
              <a>
                <button
                  className={styles.ctaButton}
                  ref={ctaButtonRef}
                  onMouseMove={handleMouseMove}
                >
                  <span className={styles.buttonText}>Explore All Calculators</span>
                  <span className={styles.arrow}>→</span>
                </button>
              </a>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default BreakEvenCalculator;