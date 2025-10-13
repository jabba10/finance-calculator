import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './workingcapitalcalculator.module.css';

const WorkingCapitalCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [currentAssets, setCurrentAssets] = useState('');
  const [currentLiabilities, setCurrentLiabilities] = useState('');
  const [result, setResult] = useState(null);

  // Robust number extraction
  const parseNumber = (input) => {
    if (!input) return NaN;
    const match = input.toString().replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const assets = parseNumber(currentAssets);
    const liabilities = parseNumber(currentLiabilities);

    if (isNaN(assets) || isNaN(liabilities)) {
      alert("Please enter valid numbers");
      return;
    }

    if (liabilities < 0 || assets < 0) {
      alert("Values cannot be negative");
      return;
    }

    const workingCapital = assets - liabilities;
    const ratio = liabilities !== 0 ? (assets / liabilities).toFixed(2) : 'Infinity';
    const isHealthyRatio = ratio !== 'Infinity' && parseFloat(ratio) >= 1.2 && parseFloat(ratio) <= 2.0;

    setResult({
      assets: assets.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      liabilities: liabilities.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      capital: workingCapital.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      ratio,
      healthy: isHealthyRatio,
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
        <title>Working Capital Calculator | Free Tool to Assess Liquidity</title>
        <meta
          name="description"
          content="Calculate your business's working capital and current ratio to assess short-term financial health and liquidity."
        />
        <meta
          name="keywords"
          content="working capital calculator, current ratio, liquidity ratio, business finance, cash flow tool"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/working-capital-calculator" />

        {/* Open Graph / Social */}
        <meta property="og:title" content="Working Capital Calculator | Measure Business Liquidity" />
        <meta
          property="og:description"
          content="Free tool to calculate working capital and current ratio — essential for startups, small businesses, and financial planning."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/working-capital-calculator" />
        <meta property="og:image" content="https://www.financecalculatorfree.com/images/workingcapital-og.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Working Capital Calculator | Measure Business Liquidity" />
        <meta
          name="twitter:description"
          content="See if your business can cover short-term obligations with our free working capital calculator."
        />
        <meta name="twitter:image" content="https://www.financecalculatorfree.com/images/workingcapital-twitter.png" />
      </Head>

      {/* Gap above content (from navbar) */}
      <div className={styles.spacerTop}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Working Capital Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your business's working capital and current ratio to assess short-term financial health.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your current assets and current liabilities to calculate working capital and liquidity.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="currentAssets" className={styles.label}>
                  Current Assets ($)
                </label>
                <input
                  id="currentAssets"
                  type="text"
                  value={currentAssets}
                  onChange={(e) => setCurrentAssets(e.target.value)}
                  placeholder="e.g. 150,000 or $150K"
                  className={styles.input}
                />
                <small className={styles.note}>
                  Cash, accounts receivable, inventory, marketable securities.
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
                  placeholder="e.g. 90,000 or $90K"
                  className={styles.input}
                />
                <small className={styles.note}>
                  Accounts payable, short-term debt, accrued expenses, upcoming taxes.
                </small>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className="taxpro-btn-label">Calculate Working Capital</span>
                <span className="taxpro-btn-arrow">→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Working Capital Summary</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Current Assets:</strong> ${result.assets}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Current Liabilities:</strong> ${result.liabilities}
                  </div>
                  <div className={`${styles.resultItem} highlight ${result.capital >= 0 ? styles.positive : styles.negative}`}>
                    <strong>Working Capital:</strong> ${result.capital}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Current Ratio:</strong> {result.ratio}
                  </div>
                </div>
                <div className={styles.note}>
                  {result.capital >= 0
                    ? `You have $${result.capital} in working capital. This means you can cover short-term obligations.`
                    : `Negative working capital ($${result.capital}) indicates potential liquidity issues.`
                  }
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why Working Capital Matters</h3>
            <p>
              <strong>Working capital</strong> measures a company’s short-term financial health — its ability to pay bills, manage operations, and handle emergencies. It’s the lifeblood of day-to-day business.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li><strong>Current Assets:</strong> Cash, receivables, inventory — anything convertible to cash within a year.</li>
              <li><strong>Current Liabilities:</strong> Debts due within one year (payables, short-term loans, etc.).</li>
              <li>Enter values freely — we extract numbers from any format (e.g., 150k, $90,000).</li>
              <li>Click “Calculate” to see your working capital and current ratio.</li>
            </ul>

            <h4>Formulas Used</h4>
            <div className={styles.formula}>
              <code>Working Capital = Current Assets − Current Liabilities</code>
            </div>
            <div className={styles.formula}>
              <code>Current Ratio = Current Assets ÷ Current Liabilities</code>
            </div>
            <p>
              <strong>Example:</strong> $150K assets, $90K liabilities →
              <br />
              Working Capital = 150,000 − 90,000 = <strong>$60,000</strong>
              <br />
              Current Ratio = 150,000 / 90,000 = <strong>1.67</strong> → <strong>Healthy</strong>
            </p>

            <h4>Interpreting the Results</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Healthy Range</th>
                  <th>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Working Capital</td>
                  <td>Positive</td>
                  <td>✅ Can cover short-term debts</td>
                </tr>
                <tr>
                  <td>Current Ratio</td>
                  <td>1.2 – 2.0</td>
                  <td>✅ Ideal liquidity balance</td>
                </tr>
                <tr>
                  <td>Current Ratio less than 1.0</td>
                  <td>N/A</td>
                  <td>❌ Risk of default</td>
                </tr>
                <tr>
                  <td>Current Ratio greater than 2.0</td>
                  <td>N/A</td>
                  <td>⚠️ Excess idle assets</td>
                </tr>
              </tbody>
            </table>

            <h4>Real-World Applications</h4>
            <ul className={styles.list}>
              <li><strong>Small Businesses:</strong> Ensure you can pay rent, payroll, and suppliers</li>
              <li><strong>Startups:</strong> Monitor runway and cash flow during growth phases</li>
              <li><strong>Lenders:</strong> Assess creditworthiness before approving loans</li>
              <li><strong>Investors:</strong> Evaluate financial stability of potential investments</li>
              <li><strong>Seasonal Businesses:</strong> Plan for low-revenue periods</li>
            </ul>

            <h4>Tips to Improve Working Capital</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Speed up receivables</strong> — offer early payment discounts</li>
              <li>✅ <strong>Negotiate longer payables</strong> — extend terms with suppliers</li>
              <li>✅ <strong>Reduce excess inventory</strong> — free up cash</li>
              <li>✅ <strong>Use a line of credit</strong> for temporary shortfalls</li>
              <li>✅ <strong>Monitor cash flow weekly</strong> — catch issues early</li>
            </ul>

            <h4>Advanced Use: Operating Cycle</h4>
            <p>
              Combine working capital with:
            </p>
            <ul className={styles.list}>
              <li><strong>Days Sales Outstanding (DSO)</strong> — how fast you collect receivables</li>
              <li><strong>Days Inventory Outstanding (DIO)</strong> — how long inventory sits</li>
              <li><strong>Days Payable Outstanding (DPO)</strong> — how long you take to pay bills</li>
            </ul>
            <p>
              <strong>Net Operating Cycle = DSO + DIO − DPO</strong>
              <br />
              A shorter cycle means faster cash generation.
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

export default WorkingCapitalCalculator;