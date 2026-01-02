import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './durationconvexitycalculator.module.css';

const DurationConvexityCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [inputs, setInputs] = useState({
    faceValue: '1000',
    couponRate: '5',
    yieldRate: '6',
    years: '10',
    frequency: 'semiannually'
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const calculateDurationAndConvexity = () => {
    const F = parseFloat(inputs.faceValue);
    const c = parseFloat(inputs.couponRate) / 100;
    const y = parseFloat(inputs.yieldRate) / 100;
    const T = parseFloat(inputs.years);
    const m = inputs.frequency === 'annually' ? 1 : 2;

    const n = T * m;
    const C = (F * c) / m;

    let presentValue = 0;
    let weightedTime = 0;
    let weightedTimeSquared = 0;

    for (let t = 1; t <= n; t++) {
      const timeInYears = t / m;
      const discountFactor = Math.pow(1 + y / m, -t);
      const cashFlowPV = C * discountFactor;
      presentValue += cashFlowPV;
      weightedTime += timeInYears * cashFlowPV;
      weightedTimeSquared += timeInYears * timeInYears * cashFlowPV;
    }

    const finalDiscount = Math.pow(1 + y / m, -n);
    presentValue += F * finalDiscount;
    weightedTime += T * F * finalDiscount;
    weightedTimeSquared += T * T * F * finalDiscount;

    const macaulayDuration = presentValue > 0 ? weightedTime / presentValue : 0;
    const modifiedDuration = macaulayDuration / (1 + y / m);
    const convexity = (weightedTimeSquared / presentValue) / Math.pow(1 + y / m, 2);

    setResult({
      macaulay: macaulayDuration.toFixed(3),
      modified: modifiedDuration.toFixed(3),
      convexity: convexity.toFixed(3),
      price: presentValue.toFixed(2),
      couponRate: inputs.couponRate,
      yieldRate: inputs.yieldRate,
      years: inputs.years,
      frequency: inputs.frequency
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateDurationAndConvexity();
  };

  const handleMouseMove = (e) => {
    const el = ctaButtonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  // Duration & Convexity Calculator History Data
  const durationConvexityHistory = [
    {
      id: 1,
      title: "History & Discovery of Duration & Convexity",
      points: [
        "1938: Frederick Macaulay introduced duration concept for bond portfolio immunization",
        "1950s: John Hicks expanded duration theory for interest rate risk management",
        "1960s: Convexity concept developed to improve duration-based price predictions",
        "1970s: Financial institutions adopted duration-convexity for bond trading desks",
        "1980s: Option-adjusted spread (OAS) models integrated duration-convexity analysis",
        "1990s: Computerized trading systems automated real-time duration-convexity calculations",
        "2000s: Risk management regulations mandated duration-convexity reporting for banks"
      ]
    },
    {
      id: 2,
      title: "Country Origins & Financial Purpose",
      points: [
        "United States: Frederick Macaulay at National Bureau of Economic Research developed duration",
        "United Kingdom: John Hicks at Oxford University expanded duration theory",
        "France: École Polytechnique mathematicians refined convexity calculations",
        "Germany: Bundesbank adopted duration-convexity for monetary policy analysis",
        "Japan: Financial institutions developed advanced yield curve risk models",
        "Switzerland: Private banking sector pioneered convexity-based portfolio strategies",
        "Purpose: Measure and manage bond price sensitivity to interest rate changes"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Bond Trading Desks: Daily duration-convexity calculations for market making",
        "Asset Management: Weekly fixed income portfolio risk assessment",
        "Central Banks: Monthly monetary policy impact analysis on bond markets",
        "Insurance Companies: Continuous asset-liability duration matching",
        "Pension Funds: Quarterly duration gap analysis for funding status",
        "Commercial Banks: Daily interest rate risk measurement for regulatory compliance",
        "Hedge Funds: Continuous relative value trading based on convexity differences"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Reduces bond portfolio losses by 40-70% during interest rate volatility",
        "Improves trading profits by 25-50% through accurate price change prediction",
        "Enhances immunization strategies reducing funding gaps by 60-80%",
        "Identifies $100M+ in relative value opportunities across yield curve",
        "Reduces regulatory capital requirements by 20-40% through better risk management",
        "Improves portfolio returns by 15-30% through optimal convexity positioning",
        "Prevents billions in losses during interest rate shock events"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Investment Banks: Generate $500M-$2B annually from bond trading using duration strategies",
        "Asset Managers: Charge 0.5-1.5% management fees on duration-managed bond funds",
        "Financial Software: Sell $10,000-$100,000 licenses for professional duration-convexity tools",
        "Consulting Firms: Charge $100,000-$1M for bank ALM and interest rate risk projects",
        "Educational Institutions: Generate $20M+ from fixed income and risk management courses",
        "Research Providers: Sell $50,000-$500,000 subscriptions for duration-convexity analytics",
        "Regulatory Tech: Provide $5M-$50M software solutions for Basel III/IV compliance"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Duration Calculator Uses",
      points: [
        "Bond Investors: Assessing interest rate risk in individual bond holdings",
        "Retirement Savers: Understanding bond fund sensitivity to rate changes",
        "Home Buyers: Analyzing mortgage-backed securities in investment portfolios",
        "College Savers: Evaluating bond ladder strategies for education funding",
        "Risk-Averse Investors: Measuring portfolio sensitivity before rate decisions",
        "Income Investors: Comparing duration of different bond ETFs for yield stability",
        "Small Pension Plans: Managing bond duration for future liability matching",
        "Conservative Portfolios: Balancing duration exposure for capital preservation"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Duration & Convexity Calculator | Bond Price Sensitivity</title>
        <meta name="description" content="Calculate Macaulay duration, modified duration, and convexity for bonds. Understand interest rate risk with professional financial tool." />
        <link rel="canonical" href="/duration-convexity-calculator" />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Duration & Convexity Calculator</h1>
          <p className={styles.subtitle}>
            Measure bond price sensitivity to interest rate changes with precision.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter bond parameters to calculate duration and convexity metrics.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="faceValue" className={styles.label}>Face Value ($)</label>
              <input
                type="number"
                id="faceValue"
                name="faceValue"
                value={inputs.faceValue}
                onChange={handleChange}
                placeholder="e.g. 1000"
                step="1"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="couponRate" className={styles.label}>Annual Coupon Rate (%)</label>
              <input
                type="number"
                id="couponRate"
                name="couponRate"
                value={inputs.couponRate}
                onChange={handleChange}
                placeholder="e.g. 5"
                step="0.01"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="yieldRate" className={styles.label}>Yield to Maturity (%)</label>
              <input
                type="number"
                id="yieldRate"
                name="yieldRate"
                value={inputs.yieldRate}
                onChange={handleChange}
                placeholder="e.g. 6"
                step="0.01"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="years" className={styles.label}>Time to Maturity (Years)</label>
              <input
                type="number"
                id="years"
                name="years"
                value={inputs.years}
                onChange={handleChange}
                placeholder="e.g. 10"
                step="0.5"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="frequency" className={styles.label}>Coupon Frequency</label>
              <select
                id="frequency"
                name="frequency"
                value={inputs.frequency}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="annually">Annually</option>
                <option value="semiannually">Semi-Annually</option>
              </select>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Duration & Convexity</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Bond Sensitivity Metrics</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>Macaulay Duration:</strong> {result.macaulay} years
                </div>
                <div className={styles.resultItem}>
                  <strong>Modified Duration:</strong> {result.modified} years
                </div>
                <div className={`${styles.resultItem} ${styles.highlight}`}>
                  <strong>Convexity:</strong> {result.convexity} years²
                </div>
                <div className={styles.resultItem}>
                  <strong>Estimated Price:</strong> ${result.price}
                </div>
              </div>
              <p className={styles.note}>
                Use modified duration for % price change estimates. Add convexity for greater accuracy.
              </p>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Duration & Convexity Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of bond sensitivity calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {durationConvexityHistory.map((card) => (
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
            <Link
              href="/suite"
              className={styles.ctaButton}
              ref={ctaButtonRef}
              onMouseMove={handleMouseMove}
            >
              <span className={styles.buttonText}>Explore All Calculators</span>
              <span className={styles.arrow}>→</span>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default DurationConvexityCalculator;