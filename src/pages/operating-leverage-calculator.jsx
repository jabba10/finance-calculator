import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './leveragecalculator.module.css';

const LeverageCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [totalAssets, setTotalAssets] = useState('');
  const [totalEquity, setTotalEquity] = useState('');
  const [ebit, setEbit] = useState('');
  const [interestExpense, setInterestExpense] = useState('');
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

    // Parse all inputs safely
    const assets = Math.max(0, parseNumber(totalAssets) || 0);
    const equity = Math.max(0, parseNumber(totalEquity) || 0);
    const ebitValue = Math.max(0, parseNumber(ebit) || 0);
    const interest = Math.max(0, parseNumber(interestExpense) || 0);

    // Avoid division by zero
    if (equity === 0 || assets === 0 || interest === 0) {
      alert("Please enter valid positive values. Equity, Assets, and Interest Expense must be greater than zero.");
      return;
    }

    // Calculate derived values
    const debt = assets - equity;

    // Ratios
    const debtToEquity = equity > 0 ? debt / equity : Infinity;
    const debtToAssets = assets > 0 ? (debt / assets) * 100 : 0;
    const equityMultiplier = equity > 0 ? assets / equity : 0;
    const interestCoverage = interest > 0 ? ebitValue / interest : Infinity;

    // Format result for display
    setResult({
      totalAssets: assets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalEquity: equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalDebt: debt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      debtToEquity: isFinite(debtToEquity) ? debtToEquity.toFixed(2) : 'Infinity',
      debtToAssets: debtToAssets.toFixed(2),
      equityMultiplier: equityMultiplier.toFixed(2),
      interestCoverage: isFinite(interestCoverage) ? interestCoverage.toFixed(2) : 'Infinity',
      ebit: ebitValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      interestExpense: interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
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

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>Leverage Calculator | Debt-to-Equity & Coverage Ratios</title>
        <meta
          name="description"
          content="Free leverage calculator to analyze debt-to-equity, debt-to-assets, equity multiplier, and interest coverage ratios for business financial health."
        />
        <meta
          name="keywords"
          content="leverage calculator, debt to equity, financial leverage, interest coverage ratio, business finance tools"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/leverage-calculator" />
        <meta property="og:title" content="Leverage Calculator - Analyze Financial Risk" />
        <meta
          property="og:description"
          content="Calculate key leverage ratios to assess your company's capital structure and risk exposure."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/leverage-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Leverage Calculator</h1>
            <p className={styles.subtitle}>
              Analyze your company's financial leverage and debt structure.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your financial data — we extract numbers from any format (e.g., $1M, 500K, EBIT: $150k).
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="totalAssets" className={styles.label}>
                  Total Assets ($)
                </label>
                <input
                  id="totalAssets"
                  type="text"
                  value={totalAssets}
                  onChange={(e) => setTotalAssets(e.target.value)}
                  placeholder="e.g. $1,000,000 or 1M"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="totalEquity" className={styles.label}>
                  Total Equity ($)
                </label>
                <input
                  id="totalEquity"
                  type="text"
                  value={totalEquity}
                  onChange={(e) => setTotalEquity(e.target.value)}
                  placeholder="e.g. $400,000 or 400K"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="ebit" className={styles.label}>
                  EBIT ($)
                </label>
                <input
                  id="ebit"
                  type="text"
                  value={ebit}
                  onChange={(e) => setEbit(e.target.value)}
                  placeholder="e.g. $150,000 or 150K"
                  className={styles.input}
                />
                <small className={styles.note}>
                  Earnings Before Interest and Taxes
                </small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="interestExpense" className={styles.label}>
                  Interest Expense ($)
                </label>
                <input
                  id="interestExpense"
                  type="text"
                  value={interestExpense}
                  onChange={(e) => setInterestExpense(e.target.value)}
                  placeholder="e.g. $25,000 or 25K"
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className={styles.btnText}>Calculate Leverage</span>
                <span className={styles.arrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Leverage Analysis Results</h3>
                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Total Debt:</strong> ${result.totalDebt}
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Debt-to-Equity Ratio:</strong> {result.debtToEquity}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Debt-to-Assets Ratio:</strong> {result.debtToAssets}%
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Equity Multiplier:</strong> {result.equityMultiplier}
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Interest Coverage Ratio:</strong> {result.interestCoverage}x
                    </div>
                  </div>
                  <div className={styles.note}>
                    {parseFloat(result.debtToEquity) > 2 && result.debtToEquity !== 'Infinity' ? (
                      <span>
                        Your debt-to-equity ratio of <strong>{result.debtToEquity}</strong> indicates{' '}
                        <strong>high financial leverage</strong>, which may increase risk but can amplify returns.
                      </span>
                    ) : result.debtToEquity === 'Infinity' ? (
                      <span>
                        <strong>Zero equity detected</strong> — this suggests a highly risky capital structure.
                      </span>
                    ) : (
                      <span>
                        Your debt-to-equity ratio of <strong>{result.debtToEquity}</strong> indicates{' '}
                        <strong>moderate financial leverage</strong>, suggesting a balanced capital structure.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Leverage Matters</h3>
                <p>
                  <strong>Financial leverage</strong> measures how much debt a company uses to finance its assets. While leverage can magnify returns, it also increases risk. Understanding your leverage ratios helps assess{' '}
                  <strong>financial stability, risk exposure, and capital structure efficiency</strong>.
                </p>

                <h4>How to Use This Calculator</h4>
                <ul className={styles.list}>
                  <li><strong>Total Assets:</strong> Sum of all assets on the balance sheet</li>
                  <li><strong>Total Equity:</strong> Total shareholders' equity</li>
                  <li><strong>EBIT:</strong> Operating profit before interest and taxes</li>
                  <li><strong>Interest Expense:</strong> Annual interest payments on debt</li>
                  <li>Enter values freely — we extract numbers from any format (e.g., $1M, 500K, EBIT: $150k)</li>
                  <li>Click "Calculate Leverage" to analyze your capital structure</li>
                </ul>

                <h4>Key Leverage Ratios</h4>
                <div className={styles.formula}>
                  <code>Debt-to-Equity = Total Debt / Total Equity</code>
                </div>
                <div className={styles.formula}>
                  <code>Debt-to-Assets = Total Debt / Total Assets</code>
                </div>
                <div className={styles.formula}>
                  <code>Equity Multiplier = Total Assets / Total Equity</code>
                </div>
                <div className={styles.formula}>
                  <code>Interest Coverage = EBIT / Interest Expense</code>
                </div>

                <h4>Interpreting Leverage Ratios</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Ratio</th>
                      <th>Healthy Range</th>
                      <th>Interpretation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Debt-to-Equity</td>
                      <td>0.5–2.0</td>
                      <td>Higher values indicate more aggressive financing</td>
                    </tr>
                    <tr>
                      <td>Debt-to-Assets</td>
                      <td>{'<'} 0.6</td>
                      <td>Percentage of assets financed by debt</td>
                    </tr>
                    <tr>
                      <td>Equity Multiplier</td>
                      <td>1.0–3.0</td>
                      <td>Higher values show more assets per equity dollar</td>
                    </tr>
                    <tr>
                      <td>Interest Coverage</td>
                      <td>{'>'} 3.0</td>
                      <td>Ability to pay interest from operating income</td>
                    </tr>
                  </tbody>
                </table>

                <h4>Industry Benchmarks</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Industry</th>
                      <th>Avg Debt-to-Equity</th>
                      <th>Typical Interest Coverage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Utilities</td>
                      <td>1.5–2.5</td>
                      <td>3–5x</td>
                    </tr>
                    <tr>
                      <td>Technology</td>
                      <td>0.3–1.0</td>
                      <td>8–12x</td>
                    </tr>
                    <tr>
                      <td>Manufacturing</td>
                      <td>0.8–1.5</td>
                      <td>4–6x</td>
                    </tr>
                    <tr>
                      <td>Retail</td>
                      <td>1.0–2.0</td>
                      <td>5–7x</td>
                    </tr>
                    <tr>
                      <td>Banking</td>
                      <td>4.0–10.0</td>
                      <td>N/A</td>
                    </tr>
                  </tbody>
                </table>

                <h4>Pros and Cons of Leverage</h4>
                <div className={styles.prosCons}>
                  <div className={styles.pros}>
                    <h5>Advantages</h5>
                    <ul className={styles.list}>
                      <li>✅ Amplifies returns on equity when profitable</li>
                      <li>✅ Interest payments are tax-deductible</li>
                      <li>✅ Allows faster growth than equity financing alone</li>
                      <li>✅ Maintains ownership control (no equity dilution)</li>
                    </ul>
                  </div>
                  <div className={styles.cons}>
                    <h5>Risks</h5>
                    <ul className={styles.list}>
                      <li>❌ Increases financial risk and potential bankruptcy</li>
                      <li>❌ Fixed interest payments reduce cash flow flexibility</li>
                      <li>❌ Higher leverage may increase borrowing costs</li>
                      <li>❌ Magnifies losses during downturns</li>
                    </ul>
                  </div>
                </div>

                <h4>Optimal Leverage Strategies</h4>
                <ul className={styles.list}>
                  <li><strong>Match debt maturity with asset life:</strong> Finance long-term assets with long-term debt</li>
                  <li><strong>Maintain coverage ratios:</strong> Ensure EBIT comfortably covers interest payments</li>
                  <li><strong>Consider industry norms:</strong> Leverage appropriate for your sector</li>
                  <li><strong>Stress test scenarios:</strong> Model performance under adverse conditions</li>
                  <li><strong>Monitor covenants:</strong> Stay compliant with lender requirements</li>
                </ul>
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
                  <span className={styles.btnText}>Explore All Calculators</span>
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

export default LeverageCalculator;