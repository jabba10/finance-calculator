import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './ebitdacalculator.module.css';

const EbitdaCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [revenue, setRevenue] = useState('');
  const [cogs, setCogs] = useState('');
  const [opex, setOpex] = useState('');
  const [result, setResult] = useState(null);

  // Enhanced number parsing: handles $, commas, k, M, etc.
  const parseCurrency = (input) => {
    if (!input || typeof input !== 'string') return NaN;

    // Convert k, M, B shortcuts
    const lower = input.toLowerCase();
    let multiplier = 1;
    if (lower.includes('k')) multiplier = 1e3;
    else if (lower.includes('m')) multiplier = 1e6;
    else if (lower.includes('b')) multiplier = 1e9;

    // Remove all non-digit or decimal characters except minus at start
    const cleaned = input.replace(/[^0-9.-]+/g, '');
    const num = parseFloat(cleaned);

    // Return NaN if invalid, otherwise apply multiplier
    return isNaN(num) ? NaN : num * multiplier;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const rev = parseCurrency(revenue);
    const cost = parseCurrency(cogs);
    const expenses = parseCurrency(opex);

    // If any value is NaN, treat as 0 (still compute)
    const safeRev = isNaN(rev) ? 0 : rev;
    const safeCost = isNaN(cost) ? 0 : cost;
    const safeExpenses = isNaN(expenses) ? 0 : expenses;

    const grossProfit = safeRev - safeCost;
    const ebitda = grossProfit - safeExpenses;
    const margin = safeRev > 0 ? ((ebitda / safeRev) * 100).toFixed(2) : 0;

    setResult({
      revenue: safeRev.toLocaleString(),
      grossProfit: grossProfit.toLocaleString(),
      ebitda: ebitda.toLocaleString(),
      margin,
      positive: ebitda >= 0,
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
        <title>EBITDA Calculator | Free Tool to Calculate Business Profitability</title>
        <meta
          name="description"
          content="Calculate your EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization) to assess operational profitability and business health."
        />
        <meta
          name="keywords"
          content="ebitda calculator, earnings before interest taxes depreciation amortization, business profitability, financial metrics, startup tools"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/ebitda-calculator" />

        {/* Open Graph / Social */}
        <meta property="og:title" content="EBITDA Calculator | Measure Operational Profitability" />
        <meta
          property="og:description"
          content="Free tool to calculate EBITDA and EBITDA margin — used by investors, startups, and executives to evaluate performance."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/ebitda-calculator" />
        <meta property="og:image" content="https://www.financecalculatorfree.com/images/ebitda-og.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="EBITDA Calculator | Measure Operational Profitability" />
        <meta
          name="twitter:description"
          content="See your company's core profitability with our free EBITDA calculator."
        />
        <meta name="twitter:image" content="https://www.financecalculatorfree.com/images/ebitda-twitter.png" />
      </Head>

      {/* Gap above content (from navbar) */}
      <div className={styles.spacerTop}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>EBITDA Calculator</h1>
          <p className={styles.subtitle}>
            Calculate Earnings Before Interest, Taxes, Depreciation, and Amortization to assess business profitability.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your total revenue, cost of goods sold (COGS), and operating expenses.
                You can use formats like $1.2M, 500k, 1,200,000, etc.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="revenue" className={styles.label}>
                  Total Revenue ($)
                </label>
                <input
                  id="revenue"
                  type="text"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  placeholder="e.g. 1,200,000 or $1.2M"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="cogs" className={styles.label}>
                  Cost of Goods Sold (COGS) ($)
                </label>
                <input
                  id="cogs"
                  type="text"
                  value={cogs}
                  onChange={(e) => setCogs(e.target.value)}
                  placeholder="e.g. 450,000 or $450k"
                  className={styles.input}
                />
                <small className={styles.note}>
                  Direct costs of producing goods or services (materials, labor, manufacturing).
                </small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="opex" className={styles.label}>
                  Operating Expenses ($)
                </label>
                <input
                  id="opex"
                  type="text"
                  value={opex}
                  onChange={(e) => setOpex(e.target.value)}
                  placeholder="e.g. 300,000"
                  className={styles.input}
                />
                <small className={styles.note}>
                  Rent, salaries, marketing, utilities, admin — excluding interest, taxes, depreciation.
                </small>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className="taxpro-btn-label">Calculate EBITDA</span>
                <span className="taxpro-btn-arrow">→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>EBITDA Results</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Revenue:</strong> ${result.revenue}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Gross Profit:</strong> ${result.grossProfit}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight} ${result.positive ? styles.positive : styles.negative}`}>
                    <strong>EBITDA:</strong> ${result.ebitda}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Margin:</strong> {result.margin}%
                  </div>
                </div>
                <div className={styles.note}>
                  {result.positive
                    ? `Your business generated $${result.ebitda} in EBITDA. This measures core operational profitability.`
                    : `Negative EBITDA suggests operational losses. Review costs or revenue strategy.`
                  }
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why EBITDA Matters</h3>
            <p>
              <strong>EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization)</strong> is a key metric used to evaluate a company’s <strong>operating performance and profitability</strong>, independent of financing, accounting, or tax decisions. It’s widely used by investors, lenders, and executives.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li><strong>Revenue:</strong> Total sales or service income.</li>
              <li><strong>COGS:</strong> Direct production costs (inventory, raw materials, direct labor).</li>
              <li><strong>Operating Expenses:</strong> Overhead (salaries, rent, marketing, admin).</li>
              <li>Click “Calculate EBITDA” to see profit before non-operating factors.</li>
            </ul>

            <h4>Formula Used</h4>
            <div className={styles.formula}>
              <code>EBITDA = Revenue − COGS − Operating Expenses</code>
            </div>
            <div className={styles.formula}>
              <code>EBITDA Margin = (EBITDA ÷ Revenue) × 100</code>
            </div>
            <p>
              <strong>Example:</strong> $1.2M revenue, $450K COGS, $300K opex →
              <br />
              EBITDA = 1,200,000 − 450,000 − 300,000 = <strong>$450,000</strong>
              <br />
              Margin = (450,000 / 1,200,000) × 100 = <strong>37.5%</strong>
            </p>

            <h4>Real-World Applications</h4>
            <ul className={styles.list}>
              <li><strong>Investors:</strong> Compare company profitability across industries</li>
              <li><strong>Startups:</strong> Show operational efficiency to attract funding</li>
              <li><strong>M&A:</strong> Used in valuation multiples (e.g., 8x EBITDA)</li>
              <li><strong>Lenders:</strong> Assess ability to service debt</li>
              <li><strong>Management:</strong> Track operational efficiency over time</li>
            </ul>

            <h4>Industry Benchmarks (EBITDA Margin)</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Industry</th>
                  <th>Typical EBITDA Margin</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Software (SaaS)</td>
                  <td>60% – 80%</td>
                </tr>
                <tr>
                  <td>Retail</td>
                  <td>5% – 10%</td>
                </tr>
                <tr>
                  <td>Restaurants</td>
                  <td>10% – 15%</td>
                </tr>
                <tr>
                  <td>Manufacturing</td>
                  <td>15% – 25%</td>
                </tr>
                <tr>
                  <td>Healthcare Services</td>
                  <td>20% – 35%</td>
                </tr>
              </tbody>
            </table>

            <h4>Tips to Improve EBITDA</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Increase pricing</strong> without losing volume</li>
              <li>✅ <strong>Negotiate lower COGS</strong> (bulk discounts, better suppliers)</li>
              <li>✅ <strong>Reduce overhead</strong> (remote work, automation)</li>
              <li>✅ <strong>Scale efficiently</strong> — grow revenue faster than expenses</li>
              <li>✅ <strong>Outsource non-core functions</strong> (HR, IT, accounting)</li>
            </ul>

            <h4>Limitations of EBITDA</h4>
            <p>
              While useful, EBITDA has limitations:
            </p>
            <ul className={styles.list}>
              <li>❌ Ignores <strong>debt and interest</strong> payments</li>
              <li>❌ Excludes <strong>tax burden</strong></li>
              <li>❌ Doesn’t account for <strong>capital expenditures</strong> (CapEx)</li>
              <li>❌ Can be <strong>misleading</strong> if used alone (e.g., hides high depreciation)</li>
            </ul>
            <p>
              Always use EBITDA alongside <strong>net income, cash flow, and CapEx</strong> for a full picture.
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

export default EbitdaCalculator;