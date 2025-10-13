import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './debtequitycalculator.module.css';

const DebtEquityCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [totalLiabilities, setTotalLiabilities] = useState('');
  const [totalEquity, setTotalEquity] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Helper: Extract first number from any string
  const parseNumber = (input) => {
    if (!input) return NaN;
    const match = input.toString().replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const liabilities = parseNumber(totalLiabilities);
    const equity = parseNumber(totalEquity);

    // Validate parsed numbers
    if (isNaN(liabilities)) {
      setError('Please enter a valid value for Total Liabilities.');
      return;
    }
    if (isNaN(equity)) {
      setError('Please enter a valid value for Total Equity.');
      return;
    }
    if (equity <= 0) {
      setError('Total Equity must be greater than zero to calculate the ratio.');
      return;
    }

    const ratio = (liabilities / equity).toFixed(2);
    let riskLevel = '';
    let riskColor = '';

    if (ratio < 0.5) {
      riskLevel = 'Low Risk';
      riskColor = styles.textSuccess;
    } else if (ratio < 1.5) {
      riskLevel = 'Moderate Risk';
      riskColor = styles.textWarning;
    } else {
      riskLevel = 'High Risk';
      riskColor = styles.textDanger;
    }

    setResult({
      totalLiabilities: liabilities.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalEquity: equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      ratio,
      riskLevel,
      riskColor,
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
        <title>Debt-to-Equity Calculator | Free Financial Leverage Tool</title>
        <meta
          name="description"
          content="Calculate your company's debt-to-equity ratio to assess financial leverage, risk level, and capital structure health."
        />
        <meta
          name="keywords"
          content="debt to equity calculator, d/e ratio, financial leverage, capital structure, business finance tools"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/debt-to-equity-calculator" />

        {/* Open Graph / Social */}
        <meta property="og:title" content="Debt-to-Equity Calculator | Measure Financial Risk" />
        <meta
          property="og:description"
          content="Free tool to calculate your D/E ratio — used by investors, lenders, and executives to evaluate financial stability."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/debt-to-equity-calculator" />
        <meta property="og:image" content="https://www.financecalculatorfree.com/images/debt-equity-og.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Debt-to-Equity Calculator | Measure Financial Risk" />
        <meta
          name="twitter:description"
          content="See how much debt your company uses compared to equity — critical for assessing long-term sustainability."
        />
        <meta name="twitter:image" content="https://www.financecalculatorfree.com/images/debt-equity-twitter.png" />
      </Head>

      {/* Gap above content (from navbar) */}
      <div className={styles.spacerTop}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Debt-to-Equity Ratio Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your company's financial leverage and assess capital structure health.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your company's total liabilities and equity — we'll extract numbers from any format.
              </p>

              {error && (
                <div className={styles.error}>{error}</div>
              )}

              <div className={styles.inputGroup}>
                <label htmlFor="totalLiabilities" className={styles.label}>
                  Total Liabilities ($)
                </label>
                <input
                  id="totalLiabilities"
                  type="text"
                  value={totalLiabilities}
                  onChange={(e) => setTotalLiabilities(e.target.value)}
                  placeholder="e.g. $500,000 or 500K"
                  className={styles.input}
                />
                <small className={styles.note}>
                  All debts: loans, payables, obligations.
                </small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="totalEquity" className={styles.label}>
                  Total Shareholders' Equity ($)
                </label>
                <input
                  id="totalEquity"
                  type="text"
                  value={totalEquity}
                  onChange={(e) => setTotalEquity(e.target.value)}
                  placeholder="e.g. $750,000 or 1.2M"
                  className={styles.input}
                />
                <small className={styles.note}>
                  Book value: assets minus liabilities.
                </small>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className="taxpro-btn-label">Calculate Ratio</span>
                <span className="taxpro-btn-arrow">→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Capital Structure Analysis</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Total Liabilities:</strong> ${result.totalLiabilities}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Total Equity:</strong> ${result.totalEquity}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Debt-to-Equity Ratio:</strong> {result.ratio}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Financial Risk:</strong>{' '}
                    <span className={result.riskColor}> {result.riskLevel}</span>
                  </div>
                </div>
                <div className={styles.note}>
                  A ratio of <strong>{result.ratio}</strong> indicates{' '}
                  {result.riskLevel.toLowerCase()} financial risk for creditors and investors.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why Debt-to-Equity Ratio Matters</h3>
            <p>
              The <strong>Debt-to-Equity (D/E) Ratio</strong> measures a company's financial leverage by comparing its total liabilities to shareholders' equity. It's a critical metric for assessing <strong>financial health, risk level, and capital structure efficiency</strong>.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li><strong>Total Liabilities:</strong> All outstanding debts (short-term + long-term)</li>
              <li><strong>Total Equity:</strong> Assets minus liabilities (book value)</li>
              <li>Enter values freely — we extract numbers from any format (e.g., $500K, 1.2 million)</li>
              <li>Click "Calculate Ratio" to see your D/E ratio and risk assessment</li>
            </ul>

            <h4>Formula Used</h4>
            <div className={styles.formula}>
              <code>Debt-to-Equity Ratio = Total Liabilities ÷ Total Shareholders' Equity</code>
            </div>
            <p>
              <strong>Example:</strong> $500,000 liabilities ÷ $750,000 equity = <strong>0.67</strong> ratio
            </p>

            <h4>Interpreting Your Ratio</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ratio Range</th>
                  <th>Interpretation</th>
                  <th>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Below 0.5</td>
                  <td>Conservative financing</td>
                  <td className={styles.textSuccess}>Low</td>
                </tr>
                <tr>
                  <td>0.5 - 1.5</td>
                  <td>Balanced approach</td>
                  <td className={styles.textWarning}>Moderate</td>
                </tr>
                <tr>
                  <td>Above 1.5</td>
                  <td>Aggressive leverage</td>
                  <td className={styles.textDanger}>High</td>
                </tr>
              </tbody>
            </table>

            <h4>Industry Benchmarks</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Industry</th>
                  <th>Average D/E Ratio</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Technology</td>
                  <td>0.5 - 1.0</td>
                </tr>
                <tr>
                  <td>Manufacturing</td>
                  <td>1.0 - 1.5</td>
                </tr>
                <tr>
                  <td>Utilities</td>
                  <td>1.5 - 2.0</td>
                </tr>
                <tr>
                  <td>Financial Services</td>
                  <td>2.0 - 5.0</td>
                </tr>
                <tr>
                  <td>Real Estate</td>
                  <td>3.0 - 6.0</td>
                </tr>
              </tbody>
            </table>

            <h4>Optimizing Your Capital Structure</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Balance debt and equity</strong> — find your optimal mix</li>
              <li>✅ <strong>Consider cost of capital</strong> — debt is often cheaper than equity</li>
              <li>✅ <strong>Match debt maturity</strong> to asset lifespan</li>
              <li>✅ <strong>Maintain flexibility</strong> — avoid over-leveraging</li>
              <li>✅ <strong>Monitor industry norms</strong> — standards vary by sector</li>
            </ul>

            <h4>Advanced Financial Ratios</h4>
            <p>
              For more comprehensive analysis:
            </p>
            <ul className={styles.list}>
              <li><strong>Debt Ratio:</strong> Total debt ÷ Total assets</li>
              <li><strong>Equity Ratio:</strong> Total equity ÷ Total assets</li>
              <li><strong>Interest Coverage Ratio:</strong> EBIT ÷ Interest expenses</li>
              <li><strong>Debt Service Coverage Ratio:</strong> Net operating income ÷ Total debt service</li>
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

export default DebtEquityCalculator;