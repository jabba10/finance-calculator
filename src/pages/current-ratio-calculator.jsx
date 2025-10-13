import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './currentratiocalculator.module.css';

const CurrentRatioCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [currentAssets, setCurrentAssets] = useState('');
  const [currentLiabilities, setCurrentLiabilities] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Helper: Extract first number from any string
  const parseNumber = (input) => {
    if (!input) return NaN;
    const match = input.toString().replace(/,/g, '').match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const assets = parseNumber(currentAssets);
    const liabilities = parseNumber(currentLiabilities);

    // Validate inputs
    if (isNaN(assets)) {
      setError('Please enter a valid value for Current Assets.');
      return;
    }
    if (isNaN(liabilities)) {
      setError('Please enter a valid value for Current Liabilities.');
      return;
    }
    if (liabilities <= 0) {
      setError('Current Liabilities must be greater than zero.');
      return;
    }

    const ratio = (assets / liabilities).toFixed(2);
    const isHealthy = ratio >= 1.2 && ratio <= 2.0;

    setResult({
      assets: assets.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      liabilities: liabilities.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      ratio,
      isHealthy,
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
        <title>Current Ratio Calculator | Free Liquidity Tool</title>
        <meta
          name="description"
          content="Calculate your business's current ratio to assess short-term liquidity and financial health. Essential for startups, small businesses, and investors."
        />
        <meta
          name="keywords"
          content="current ratio calculator, liquidity ratio, financial health, working capital, business finance tools"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/current-ratio-calculator" />

        {/* Open Graph / Social */}
        <meta property="og:title" content="Current Ratio Calculator | Measure Financial Health" />
        <meta
          property="og:description"
          content="Free tool to calculate your current ratio — a key indicator of short-term liquidity and financial stability."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/current-ratio-calculator" />
        <meta property="og:image" content="https://yourdomain.com/images/current-ratio-og.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Current Ratio Calculator | Measure Financial Health" />
        <meta
          name="twitter:description"
          content="See if your business can cover short-term obligations with our free current ratio calculator."
        />
        <meta name="twitter:image" content="https://www.financecalculatorfree.com/images/current-ratio-twitter.png" />
      </Head>

      {/* Gap above content (from navbar) */}
      <div className={styles.spacerTop}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Current Ratio Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your business's current ratio to assess short-term liquidity and financial health.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your current assets and liabilities — we’ll extract numbers from any format (e.g., $120K, 80k, 1.2 million).
              </p>

              {error && (
                <div className={styles.error}>{error}</div>
              )}

              <div className={styles.inputGroup}>
                <label htmlFor="currentAssets" className={styles.label}>
                  Current Assets ($)
                </label>
                <input
                  id="currentAssets"
                  type="text"
                  value={currentAssets}
                  onChange={(e) => setCurrentAssets(e.target.value)}
                  placeholder="e.g. $120,000 or 120K"
                  className={styles.input}
                />
                <small className={styles.note}>
                  Cash, accounts receivable, inventory, prepaid expenses — all convertible within a year.
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
                  placeholder="e.g. $80,000 or 80K"
                  className={styles.input}
                />
                <small className={styles.note}>
                  Accounts payable, short-term loans, accrued expenses, taxes due within 12 months.
                </small>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className="taxpro-btn-label">Calculate Current Ratio</span>
                <span className="taxpro-btn-arrow">→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Current Ratio Result</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Current Assets:</strong> ${result.assets}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Current Liabilities:</strong> ${result.liabilities}
                  </div>
                  <div className={`${styles.resultItem} highlight ${result.isHealthy ? styles.positive : styles.negative}`}>
                    <strong>Current Ratio:</strong> {result.ratio}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Status:</strong> {result.isHealthy ? 'Healthy' : 'Needs Attention'}
                  </div>
                </div>
                <div className={styles.note}>
                  {result.isHealthy
                    ? `A ratio of ${result.ratio} indicates strong short-term financial health.`
                    : `A ratio below 1.2 or above 2.0 may signal liquidity risk or inefficient asset use.`
                  }
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why the Current Ratio Matters</h3>
            <p>
              The <strong>Current Ratio</strong> is a key liquidity metric that measures a company’s ability to pay its short-term obligations using its short-term assets. It’s one of the most widely used indicators of financial health by lenders, investors, and managers.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li><strong>Current Assets:</strong> All assets expected to be converted to cash within one year.</li>
              <li><strong>Current Liabilities:</strong> Debts due within one year.</li>
              <li>Enter values freely — we extract numbers from any format (e.g., $120K, 80k, 1.2 million).</li>
              <li>Click “Calculate” to get your current ratio and liquidity assessment.</li>
            </ul>

            <h4>Formula Used</h4>
            <div className={styles.formula}>
              <code>Current Ratio = Current Assets ÷ Current Liabilities</code>
            </div>
            <p>
              <strong>Example:</strong> $120,000 in assets, $80,000 in liabilities →
              <br />
              Current Ratio = 120,000 / 80,000 = <strong>1.5</strong>
              <br />
              This means you have $1.50 in assets for every $1.00 of liabilities.
            </p>

            <h4>Interpreting the Results</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Current Ratio</th>
                  <th>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>less than 1.0</td>
                  <td>❌ Insufficient assets to cover debts — high risk of default</td>
                </tr>
                <tr>
                  <td>1.0 – 1.2</td>
                  <td>⚠️ Minimum acceptable — tight liquidity</td>
                </tr>
                <tr>
                  <td>1.2 – 2.0</td>
                  <td>✅ Healthy — good balance of liquidity and efficiency</td>
                </tr>
                <tr>
                  <td>greater than 2.0</td>
                  <td>⚠️ Excess assets — may indicate underutilized capital</td>
                </tr>
              </tbody>
            </table>

            <h4>Real-World Applications</h4>
            <ul className={styles.list}>
              <li><strong>Small Businesses:</strong> Ensure you can cover payroll, rent, and suppliers</li>
              <li><strong>Startups:</strong> Monitor financial runway and investor confidence</li>
              <li><strong>Lenders:</strong> Assess creditworthiness before approving loans</li>
              <li><strong>Investors:</strong> Compare liquidity across companies</li>
              <li><strong>Management:</strong> Track financial performance over time</li>
            </ul>

            <h4>Tips to Improve Your Current Ratio</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Collect receivables faster</strong> — offer discounts for early payment</li>
              <li>✅ <strong>Reduce inventory levels</strong> — avoid overstocking</li>
              <li>✅ <strong>Refinance short-term debt</strong> into long-term loans</li>
              <li>✅ <strong>Delay non-essential purchases</strong> to preserve cash</li>
              <li>✅ <strong>Use a line of credit</strong> strategically to smooth cash flow</li>
            </ul>

            <h4>Related Metrics</h4>
            <p>
              The Current Ratio is part of a family of liquidity ratios:
            </p>
            <ul className={styles.list}>
              <li><strong>Quick Ratio (Acid-Test):</strong> Excludes inventory — stricter test</li>
              <li><strong>Cash Ratio:</strong> Only cash and marketable securities</li>
              <li><strong>Working Capital:</strong> Current Assets − Current Liabilities</li>
            </ul>
            <p>
              Use these together for a complete picture of short-term financial strength.
            </p>

            <h4>Industry Benchmarks</h4>
            <ul className={styles.list}>
              <li><strong>Retail:</strong> 1.4 – 2.0</li>
              <li><strong>Manufacturing:</strong> 1.3 – 1.8</li>
              <li><strong>Technology (SaaS):</strong> 2.0 – 3.0+</li>
              <li><strong>Restaurants:</strong> 1.0 – 1.5</li>
              <li><strong>Construction:</strong> 1.5 – 2.5</li>
            </ul>
            <p>
              Always compare your ratio to industry peers for meaningful insights.
            </p>
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

export default CurrentRatioCalculator;