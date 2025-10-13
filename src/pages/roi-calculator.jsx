import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
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
    const el = ctaButtonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  return (
    <>
      {/* SEO Metadata */}
      <Head>
        <title>ROI Calculator | Free Return on Investment Tool</title>
        <meta
          name="description"
          content="Calculate your Return on Investment (ROI) instantly. Measure profitability, compare investments, and make smarter financial decisions."
        />
        <meta
          name="keywords"
          content="roi calculator, return on investment, investment analysis, profit calculator, financial tools"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/roi-calculator" />

        {/* Open Graph / Social */}
        <meta property="og:title" content="ROI Calculator | Measure Investment Performance" />
        <meta
          property="og:description"
          content="Free tool to calculate ROI and annualized returns — perfect for stocks, real estate, marketing, and business investments."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/roi-calculator" />
        <meta property="og:image" content="https://www.financecalculatorfree.com/images/roi-og.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ROI Calculator | Measure Investment Performance" />
        <meta
          name="twitter:description"
          content="See your true return on investment with our free ROI calculator."
        />
        <meta name="twitter:image" content="https://www.financecalculatorfree.com/images/roi-twitter.png" />
      </Head>

      {/* Gap above content (from navbar) */}
      <div className={styles.spacerTop}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>ROI Calculator</h1>
          <p className={styles.subtitle}>
            Calculate Return on Investment to measure the profitability of your investments and business decisions.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
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
                  step="0.01"
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
                  step="0.01"
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
                  step="0.1"
                  required
                />
                <small className={styles.note}>
                  Duration of investment in years
                </small>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className="taxpro-btn-label">Calculate ROI</span>
                <span className="taxpro-btn-arrow">→</span>
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
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why ROI Matters</h3>
            <p>
              <strong>Return on Investment (ROI)</strong> is the most important metric for evaluating the efficiency of an investment. It compares the magnitude and timing of gains to the investment cost, helping you <strong>compare investments, justify decisions, and allocate resources effectively</strong>.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li><strong>Initial Investment:</strong> Total amount invested (purchase price + any additional costs)</li>
              <li><strong>Final Value:</strong> Current value or sale price of investment</li>
              <li><strong>Time Period:</strong> Duration of investment in years (for annualized ROI)</li>
              <li>Click "Calculate ROI" to see your return percentage and profit/loss</li>
            </ul>

            <h4>Formulas Used</h4>
            <div className={styles.formula}>
              <code>ROI = ((Final Value - Initial Investment) ÷ Initial Investment) × 100</code>
            </div>
            <div className={styles.formula}>
              <code>Annualized ROI = ((1 + ROI)<sup>1/Years</sup> - 1) × 100</code>
            </div>
            <p>
              <strong>Example:</strong> $10,000 investment grows to $15,000 in 3 years
              <br />
              ROI = (($15,000 - $10,000) ÷ $10,000) × 100 = <strong>50%</strong>
              <br />
              Annualized ROI = ((1 + 0.5)<sup>1/3</sup> - 1) × 100 = <strong>14.47%</strong>
            </p>

            <h4>Interpreting ROI Results</h4>
            <ul className={styles.list}>
              <li><strong>Positive ROI:</strong> Investment generated profit</li>
              <li><strong>Negative ROI:</strong> Investment resulted in loss</li>
              <li><strong>0% ROI:</strong> Broke even (no profit or loss)</li>
              <li><strong>Higher ROI:</strong> More efficient use of capital</li>
              <li>Compare ROI to alternative investments and industry benchmarks</li>
            </ul>

            <h4>Industry Benchmarks (Average ROI)</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Investment Type</th>
                  <th>Average Annual ROI</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>S&P 500 (Stocks)</td>
                  <td>7-10%</td>
                </tr>
                <tr>
                  <td>Real Estate</td>
                  <td>8-12%</td>
                </tr>
                <tr>
                  <td>Startup Investments</td>
                  <td>25%+ (high risk)</td>
                </tr>
                <tr>
                  <td>Bonds</td>
                  <td>2-5%</td>
                </tr>
                <tr>
                  <td>Marketing Campaigns</td>
                  <td>5:1 ratio (500%)</td>
                </tr>
              </tbody>
            </table>

            <h4>Tips to Improve ROI</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Reduce investment costs</strong> — negotiate better terms</li>
              <li>✅ <strong>Increase returns</strong> — optimize performance</li>
              <li>✅ <strong>Shorten payback period</strong> — faster returns improve annualized ROI</li>
              <li>✅ <strong>Diversify</strong> — balance high and low risk investments</li>
              <li>✅ <strong>Monitor regularly</strong> — adjust strategy as needed</li>
            </ul>

            <h4>Advanced ROI Considerations</h4>
            <p>
              For more sophisticated analysis:
            </p>
            <ul className={styles.list}>
              <li><strong>Risk-Adjusted ROI:</strong> ROI ÷ Investment Risk</li>
              <li><strong>ROI with Time Value:</strong> Discounted cash flow analysis</li>
              <li><strong>Social ROI:</strong> Measuring non-financial benefits</li>
              <li><strong>Marketing ROI:</strong> (Sales Growth - Marketing Cost) ÷ Marketing Cost</li>
              <li><strong>ROI vs. ROE:</strong> Return on Equity considers leverage</li>
            </ul>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaSectionHeading}>
            Free Financial Planning Tools: Budget, Invest & Plan Retirement
          </h2>
          <p className={styles.ctaSectionSubtext}>
            Free Financial Planning Tools – Try Now
          </p>
          <Link href="/suite" passHref legacyBehavior>
            <a
              className={styles.ctaButton}
              ref={ctaButtonRef}
              onMouseMove={handleMouseMove}
            >
              <span className="btn-label">Explore All Calculators</span>
              <span className="btn-icon" aria-hidden="true">→</span>
            </a>
          </Link>
        </section>
      </div>

      {/* Gap below content (before footer) */}
      <div className={styles.spacerBottom}></div>
    </>
  );
};

export default ROICalculator;