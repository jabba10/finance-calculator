import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './roicalculator.module.css';

const ROICalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [initialInvestment, setInitialInvestment] = useState('');
  const [finalValue, setFinalValue] = useState('');
  const [timePeriod, setTimePeriod] = useState('1');
  const [result, setResult] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const investment = parseFloat(initialInvestment);
    const value = parseFloat(finalValue);
    const period = parseFloat(timePeriod);

    // Validation
    if (isNaN(investment) || isNaN(value) || isNaN(period)) {
      alert("Please enter valid numbers in all fields");
      return;
    }

    if (investment <= 0) {
      alert("Initial investment must be greater than zero.");
      return;
    }

    if (period < 0) {
      alert("Time period cannot be negative.");
      return;
    }

    // Calculations
    const netProfit = value - investment;
    const roi = ((netProfit / investment) * 100).toFixed(2);
    const annualizedRoi = period > 0
      ? ((Math.pow(1 + netProfit / investment, 1 / period) - 1) * 100).toFixed(2)
      : roi;

    setResult({
      initialInvestment: investment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      finalValue: value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      netProfit: netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      roi,
      annualizedRoi,
      timePeriod: period,
      isProfitable: netProfit >= 0
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
  const pageTitle = 'ROI Calculator | Free Return on Investment Analysis Tool';
  const pageDescription = 'Calculate Return on Investment (ROI) instantly. Measure investment performance, compare opportunities, and optimize financial decisions.';

  // ROI Calculator History Data
  const roiCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of ROI Calculation",
      points: [
        "18th Century England: Industrialists created ROI to evaluate factory investments",
        "1920s America: DuPont Corporation formalized ROI for corporate capital allocation",
        "1950s: Investment banks adopted ROI for securities analysis and portfolio management",
        "1970s: Harvard Business School standardized ROI as core financial metric",
        "1990s Tech Boom: Venture capitalists used ROI to evaluate startup investments",
        "2000s Digital Age: Online platforms created real-time ROI calculation tools",
        "Modern Era: AI-driven predictive ROI models for investment optimization"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Business Purpose",
      points: [
        "United States: Corporate America developed ROI for capital budgeting decisions",
        "United Kingdom: Financial institutions created ROI for investment banking",
        "Germany: Manufacturing firms used ROI for equipment investment analysis",
        "Japan: Keiretsu groups optimized ROI across supply chain investments",
        "Switzerland: Private banks refined ROI for wealth management clients",
        "Singapore: Global funds established ROI benchmarks for Asian markets",
        "Purpose: Measure investment efficiency, compare opportunities, and allocate capital effectively"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Investment Banking: Daily ROI analysis for client portfolios and deals",
        "Venture Capital: Quarterly ROI evaluation for startup investments",
        "Real Estate: Monthly ROI tracking for property investments and developments",
        "Corporate Finance: Annual ROI calculations for capital expenditure projects",
        "Marketing Agencies: Campaign ROI measurement for client reporting",
        "Manufacturing: Equipment ROI analysis for production efficiency",
        "Technology: R&D ROI assessment for innovation investments",
        "Retail: Store expansion ROI evaluation for growth strategies"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Identifies 20-50% better investment opportunities through comparative analysis",
        "Reduces capital allocation errors by 60% through data-driven decisions",
        "Improves portfolio returns by 15-30% through ROI-based selection",
        "Reduces failed investments by 40% through proper due diligence",
        "Increases investor confidence with 50% better performance transparency",
        "Enables 30% faster business scaling with optimized investment timing",
        "Identifies $100,000+ in wasted capital through poor ROI detection"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Investment Firms: Generate 20-30% returns through ROI-optimized portfolios",
        "Real Estate: Achieve 8-12% annual ROI on property investments",
        "Private Equity: Secure 25%+ ROI on company acquisitions and turnarounds",
        "Venture Capital: Target 10x ROI on successful startup exits",
        "Hedge Funds: Deliver 15-20% ROI through sophisticated strategies",
        "Corporate Investments: Earn 15-25% ROI on strategic business expansions",
        "Marketing: Achieve 5:1 ROI ratios on effective campaign spending"
      ]
    },
    {
      id: 6,
      title: "Ordinary People ROI Calculator Uses",
      points: [
        "Stock Investors: Calculating returns on individual stock purchases",
        "Real Estate Investors: Measuring rental property and flip profits",
        "Retirement Savers: Tracking 401(k) and IRA investment performance",
        "Small Business Owners: Evaluating equipment and expansion investments",
        "Homeowners: Calculating ROI on home improvement projects",
        "Education Investors: Measuring return on degree and certification costs",
        "Side Hustlers: Evaluating ROI on gig economy platforms",
        "Crypto Traders: Tracking cryptocurrency investment performance"
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
        <link rel="canonical" href={`${siteUrl}/roi-calculator`} />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>ROI Calculator</h1>
          <p className={styles.subtitle}>
            Calculate Return on Investment to measure the profitability of your investments and business decisions.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your investment details to calculate ROI.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="initialInvestment" className={styles.label}>
                Initial Investment ($)
              </label>
              <input
                id="initialInvestment"
                type="number"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(e.target.value)}
                placeholder="e.g. 10000.00"
                className={styles.input}
                min="0.01"
                step="any"
                required
              />
              <small className={styles.note}>
                Amount initially invested
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="finalValue" className={styles.label}>
                Final Value ($)
              </label>
              <input
                id="finalValue"
                type="number"
                value={finalValue}
                onChange={(e) => setFinalValue(e.target.value)}
                placeholder="e.g. 15000.00"
                className={styles.input}
                min="0"
                step="any"
                required
              />
              <small className={styles.note}>
                Current or final value of investment
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="timePeriod" className={styles.label}>
                Time Period (Years)
              </label>
              <input
                id="timePeriod"
                type="number"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                placeholder="e.g. 3"
                className={styles.input}
                min="0.1"
                step="any"
                required
              />
              <small className={styles.note}>
                Duration of investment in years
              </small>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate ROI</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Investment Analysis</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>Initial Investment:</strong> ${result.initialInvestment}
                </div>
                <div className={styles.resultItem}>
                  <strong>Final Value:</strong> ${result.finalValue}
                </div>
                <div className={`${styles.resultItem} ${result.isProfitable ? styles.highlight : styles.warning}`}>
                  <strong>Net Profit/Loss:</strong> ${result.netProfit}
                </div>
                <div className={`${styles.resultItem} ${result.isProfitable ? styles.highlight : styles.warning}`}>
                  <strong>ROI:</strong> {result.roi}%
                </div>
                {result.timePeriod > 1 && (
                  <div className={`${styles.resultItem} ${result.isProfitable ? styles.highlight : styles.warning}`}>
                    <strong>Annualized ROI:</strong> {result.annualizedRoi}%
                  </div>
                )}
                <div className={styles.resultItem}>
                  <strong>Time Period:</strong> {result.timePeriod} year{result.timePeriod !== 1 ? 's' : ''}
                </div>
                <div className={styles.resultItem}>
                  <strong>Status:</strong>{' '}
                  <span className={result.isProfitable ? styles.textSuccess : styles.textDanger}>
                    {result.isProfitable ? 'Profitable' : 'Not Profitable'}
                  </span>
                </div>
              </div>
              <div className={styles.note}>
                Your investment returned <strong>{result.roi}%</strong> overall
                {result.timePeriod > 1 ? `, with an annualized return of ${result.annualizedRoi}%` : ''}.
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>ROI Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of return on investment calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {roiCalculatorHistory.map((card) => (
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

export default ROICalculator;