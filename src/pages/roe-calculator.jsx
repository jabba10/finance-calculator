import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './roecalculator.module.css';

const ROECalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [netIncome, setNetIncome] = useState('');
  const [shareholderEquity, setShareholderEquity] = useState('');
  const [result, setResult] = useState(null);

  // Helper: Parse input (remove commas, allow decimals)
  const parseNumber = (value) => {
    if (!value) return NaN;
    // Remove commas and any non-numeric characters except decimal point
    const clean = value.toString().replace(/[^0-9.]/g, '');
    return parseFloat(clean);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const income = parseNumber(netIncome);
    const equity = parseNumber(shareholderEquity);

    // Validation
    if (isNaN(income)) {
      alert("Please enter a valid number for Net Income.");
      return;
    }
    if (isNaN(equity) || equity <= 0) {
      alert("Shareholder's Equity must be a positive number.");
      return;
    }

    const roe = ((income / equity) * 100).toFixed(2);
    const isStrong = parseFloat(roe) >= 15;

    setResult({
      netIncome: income.toLocaleString(),
      shareholderEquity: equity.toLocaleString(),
      roe,
      isStrong,
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
        <title>ROE Calculator | Free Return on Equity Tool</title>
        <meta
          name="description"
          content="Calculate Return on Equity (ROE) to measure how efficiently a company generates profit from shareholder investment."
        />
        <meta
          name="keywords"
          content="roe calculator, return on equity, financial ratio, profitability tool, investor tools"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/roe-calculator" />

        {/* Open Graph / Social */}
        <meta property="og:title" content="ROE Calculator | Measure Profitability Efficiency" />
        <meta
          property="og:description"
          content="Free tool to calculate ROE — used by investors, analysts, and executives to evaluate company performance."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/roe-calculator" />
        <meta property="og:image" content="https://www.financecalculatorfree.com/images/roe-og.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ROE Calculator | Measure Profitability Efficiency" />
        <meta
          name="twitter:description"
          content="See how well a company uses shareholder capital to generate profits with our free ROE calculator."
        />
        <meta name="twitter:image" content="https://www.financecalculatorfree.com/images/roe-twitter.png" />
      </Head>

      {/* Gap above content (from navbar) */}
      <div className={styles.spacerTop}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>ROE Calculator</h1>
          <p className={styles.subtitle}>
            Calculate Return on Equity (ROE) to measure how efficiently a company generates profit from shareholder investment.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter net income and shareholder's equity to calculate ROE.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="netIncome" className={styles.label}>
                  Net Income ($)
                </label>
                <input
                  id="netIncome"
                  type="text"
                  value={netIncome}
                  onChange={(e) => setNetIncome(e.target.value)}
                  placeholder="e.g. 75,000"
                  className={styles.input}
                  required
                />
                <small className={styles.note}>
                  Profit after all expenses, taxes, and interest — from the income statement.
                </small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="shareholderEquity" className={styles.label}>
                  Shareholder's Equity ($)
                </label>
                <input
                  id="shareholderEquity"
                  type="text"
                  value={shareholderEquity}
                  onChange={(e) => setShareholderEquity(e.target.value)}
                  placeholder="e.g. 500,000"
                  className={styles.input}
                  required
                />
                <small className={styles.note}>
                  Total assets minus total liabilities — from the balance sheet.
                </small>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className="taxpro-btn-label">Calculate ROE</span>
                <span className="taxpro-btn-arrow">→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Return on Equity (ROE)</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Net Income:</strong> ${result.netIncome}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Shareholder's Equity:</strong> ${result.shareholderEquity}
                  </div>
                  <div className={`${styles.resultItem} highlight ${result.isStrong ? styles.positive : styles.negative}`}>
                    <strong>ROE:</strong> {result.roe}%
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Efficiency:</strong> {result.isStrong ? 'High' : 'Moderate/Low'}
                  </div>
                </div>
                <div className={styles.note}>
                  {result.isStrong
                    ? `An ROE of ${result.roe}% indicates strong profitability and efficient use of equity capital.`
                    : `An ROE below 15% may suggest inefficiency or intense competition. Compare to industry peers.`
                  }
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why ROE Matters</h3>
            <p>
              <strong>Return on Equity (ROE)</strong> measures how effectively a company generates profit from the money shareholders have invested. It’s one of the most important metrics for investors, analysts, and executives to evaluate financial performance and management efficiency.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li><strong>Net Income:</strong> Found on the income statement (after taxes and expenses).</li>
              <li><strong>Shareholder's Equity:</strong> On the balance sheet (Assets − Liabilities).</li>
              <li>Click “Calculate ROE” to see the percentage return on equity.</li>
            </ul>

            <h4>Formula Used</h4>
            <div className={styles.formula}>
              <code>ROE = (Net Income ÷ Shareholder's Equity) × 100</code>
            </div>
            <p>
              <strong>Example:</strong> $75,000 net income, $500,000 equity →
              <br />
              ROE = (75,000 / 500,000) × 100 = <strong>15%</strong>
              <br />
              This means the company generates $0.15 in profit for every $1 of shareholder equity.
            </p>

            <h4>Interpreting the Results</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ROE</th>
                  <th>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0% – 10%</td>
                  <td>⚠️ Low — May indicate poor management or competitive pressure</td>
                </tr>
                <tr>
                  <td>10% – 15%</td>
                  <td>✅ Average — Typical for many stable industries</td>
                </tr>
                <tr>
                  <td>15% – 20%</td>
                  <td>✅ Strong — Efficient use of capital</td>
                </tr>
                <tr>
                  <td>20%+</td>
                  <td>✅ Excellent — Top-tier performance (e.g., tech, SaaS)</td>
                </tr>
              </tbody>
            </table>

            <h4>Real-World Applications</h4>
            <ul className={styles.list}>
              <li><strong>Investors:</strong> Compare companies before buying stock</li>
              <li><strong>Fund Managers:</strong> Screen high-performing stocks for portfolios</li>
              <li><strong>CEOs:</strong> Track management effectiveness and strategy success</li>
              <li><strong>Lenders:</strong> Assess long-term profitability for loan risk</li>
              <li><strong>Startups:</strong> Show investors how efficiently capital is used</li>
            </ul>

            <h4>Industry Benchmarks (Average ROE)</h4>
            <ul className={styles.list}>
              <li><strong>Technology (SaaS):</strong> 20% – 35%</li>
              <li><strong>Consumer Goods:</strong> 15% – 25%</li>
              <li><strong>Financial Services:</strong> 10% – 15%</li>
              <li><strong>Retail:</strong> 8% – 12%</li>
              <li><strong>Utilities:</strong> 8% – 10%</li>
            </ul>
            <p>
              Always compare ROE within the same industry — capital intensity varies widely.
            </p>

            <h4>Tips to Improve ROE</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Increase net income</strong> via pricing, cost control, or sales growth</li>
              <li>✅ <strong>Optimize asset use</strong> — improve inventory or receivables turnover</li>
              <li>✅ <strong>Use debt strategically</strong> (increases ROE via leverage — but increases risk)</li>
              <li>✅ <strong>Buy back shares</strong> — reduces equity, increases ROE (if profitable)</li>
              <li>✅ <strong>Focus on high-margin products</strong> to boost profitability</li>
            </ul>

            <h4>Limitations of ROE</h4>
            <p>
              ROE can be misleading if used alone:
            </p>
            <ul className={styles.list}>
              <li>❌ High ROE from excessive debt (risky)</li>
              <li>❌ Share buybacks can inflate ROE without real growth</li>
              <li>❌ Varies by industry — not comparable across sectors</li>
              <li>❌ One-time gains can distort results</li>
            </ul>
            <p>
              Always use ROE alongside <strong>ROA (Return on Assets)</strong>, <strong>debt-to-equity</strong>, and <strong>EPS</strong> for a full picture.
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

export default ROECalculator;