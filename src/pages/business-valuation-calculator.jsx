import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './valuationcalculator.module.css';

const ValuationCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [revenue, setRevenue] = useState('');
  const [profit, setProfit] = useState('');
  const [industryMultiplier, setIndustryMultiplier] = useState('2.5');
  const [valuationMethod, setValuationMethod] = useState('revenue');
  const [result, setResult] = useState(null);

  // Helper: Extract first number from any string
  const parseNumber = (input) => {
    if (!input) return NaN;
    // Remove commas and match the first number (including decimals)
    const match = input.toString().replace(/,/g, '').match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(null);

    // Default values
    let revenueValue = 0;
    let profitValue = 0;
    let multiplier = 2.5; // default multiplier

    // Parse revenue if method is revenue
    if (valuationMethod === 'revenue') {
      const parsed = parseNumber(revenue);
      revenueValue = !isNaN(parsed) ? parsed : 0;
    }

    // Parse profit if method is profit
    if (valuationMethod === 'profit') {
      const parsed = parseNumber(profit);
      profitValue = !isNaN(parsed) ? parsed : 0;
    }

    // Always parse multiplier (never fail)
    const parsedMultiplier = parseNumber(industryMultiplier);
    if (!isNaN(parsedMultiplier) && parsedMultiplier > 0) {
      multiplier = parsedMultiplier;
    }

    // Calculate valuation
    const valuation = valuationMethod === 'revenue'
      ? revenueValue * multiplier
      : profitValue * multiplier;

    const methodUsed = valuationMethod === 'revenue'
      ? `Revenue Multiple (${multiplier.toFixed(1)}x)`
      : `Profit Multiple (${multiplier.toFixed(1)}x)`;

    // Format for display
    setResult({
      revenue: revenueValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      profit: profitValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      multiplier: multiplier.toFixed(1),
      valuation: valuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      methodUsed,
      valuationMethod,
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
        <title>Business Valuation Calculator | Free Tool to Estimate Company Worth</title>
        <meta
          name="description"
          content="Estimate your company's value using industry-standard multiples. Perfect for startups, investors, and business owners planning exits or funding."
        />
        <meta
          name="keywords"
          content="business valuation calculator, company valuation, startup valuation, revenue multiple, profit multiple, M&A tools"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/business-valuation-calculator" />

        {/* Open Graph / Social */}
        <meta property="og:title" content="Business Valuation Calculator | Estimate Your Company's Worth" />
        <meta
          property="og:description"
          content="Free tool to calculate business valuation using revenue or profit multiples — used by founders, investors, and advisors."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/business-valuation-calculator" />
        <meta property="og:image" content="https://www.financecalculatorfree.com/images/valuation-og.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Business Valuation Calculator | Estimate Your Company's Worth" />
        <meta
          name="twitter:description"
          content="See how much your business could be worth based on industry standards and financial performance."
        />
        <meta name="twitter:image" content="https://www.financecalculatorfree.com/images/valuation-twitter.png" />
      </Head>

      {/* Gap above content (from navbar) */}
      <div className={styles.spacerTop}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Business Valuation Calculator</h1>
          <p className={styles.subtitle}>
            Estimate your company's worth using industry-standard valuation methods.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Select method and enter financial data — we extract numbers from any format (e.g., $500K, 1.2M, 3x).
              </p>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Valuation Method</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="valuationMethod"
                      value="revenue"
                      checked={valuationMethod === 'revenue'}
                      onChange={() => setValuationMethod('revenue')}
                    />
                    <span>Revenue Multiple</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="valuationMethod"
                      value="profit"
                      checked={valuationMethod === 'profit'}
                      onChange={() => setValuationMethod('profit')}
                    />
                    <span>Profit Multiple</span>
                  </label>
                </div>
              </div>

              {valuationMethod === 'revenue' && (
                <div className={styles.inputGroup}>
                  <label htmlFor="revenue" className={styles.label}>
                    Annual Revenue ($)
                  </label>
                  <input
                    id="revenue"
                    type="text"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    placeholder="e.g. $500,000 or 500K"
                    className={styles.input}
                  />
                </div>
              )}

              {valuationMethod === 'profit' && (
                <div className={styles.inputGroup}>
                  <label htmlFor="profit" className={styles.label}>
                    Annual Profit ($)
                  </label>
                  <input
                    id="profit"
                    type="text"
                    value={profit}
                    onChange={(e) => setProfit(e.target.value)}
                    placeholder="e.g. $150,000 or 150K"
                    className={styles.input}
                  />
                </div>
              )}

              <div className={styles.inputGroup}>
                <label htmlFor="industryMultiplier" className={styles.label}>
                  Industry Multiplier
                </label>
                <input
                  id="industryMultiplier"
                  type="text"
                  value={industryMultiplier}
                  onChange={(e) => setIndustryMultiplier(e.target.value)}
                  placeholder="e.g. 2.5 or 5x"
                  className={styles.input}
                />
                <small className={styles.note}>
                  {valuationMethod === 'revenue'
                    ? 'Typical range: 0.5x to 5x revenue'
                    : 'Typical range: 2x to 10x profit'}
                </small>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className="taxpro-btn-label">Calculate Valuation</span>
                <span className="taxpro-btn-arrow">→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Valuation Estimate</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Method Used:</strong> {result.methodUsed}
                  </div>
                  {result.valuationMethod === 'revenue' && (
                    <div className={styles.resultItem}>
                      <strong>Annual Revenue:</strong> ${result.revenue}
                    </div>
                  )}
                  {result.valuationMethod === 'profit' && (
                    <div className={styles.resultItem}>
                      <strong>Annual Profit:</strong> ${result.profit}
                    </div>
                  )}
                  <div className={styles.resultItem}>
                    <strong>Industry Multiplier:</strong> {result.multiplier}x
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Estimated Valuation:</strong> ${result.valuation}
                  </div>
                </div>
                <div className={styles.note}>
                  Based on {result.methodUsed.toLowerCase()}, your business is valued at approximately{' '}
                  <strong>${result.valuation}</strong>.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why Business Valuation Matters</h3>
            <p>
              <strong>Business valuation</strong> is essential for selling your company, seeking investment, estate planning, or strategic decision-making. Understanding your company's worth helps you{' '}
              <strong>negotiate better deals, plan growth, and assess financial health</strong>.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li><strong>Select valuation method:</strong> Revenue or profit multiple</li>
              <li><strong>Enter financial data:</strong> Type freely — we extract numbers from any format</li>
              <li><strong>Adjust multiplier:</strong> Use industry benchmarks or your own value</li>
              <li>Click "Calculate" — get instant estimate even with messy input</li>
            </ul>

            <h4>Formulas Used</h4>
            <div className={styles.formula}>
              <code>Revenue-Based Valuation = Annual Revenue × Industry Multiplier</code>
            </div>
            <div className={styles.formula}>
              <code>Profit-Based Valuation = Annual Profit × Industry Multiplier</code>
            </div>
            <p>
              <strong>Example (Revenue):</strong> $500,000 revenue × 2.5 multiplier ={' '}
              <strong>$1,250,000 valuation</strong>
              <br />
              <strong>Example (Profit):</strong> $150,000 profit × 5 multiplier ={' '}
              <strong>$750,000 valuation</strong>
            </p>

            <h4>Valuation Methods Explained</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Best For</th>
                  <th>Pros</th>
                  <th>Cons</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Revenue Multiple</td>
                  <td>Startups, high-growth companies</td>
                  <td>Simple, works with negative profits</td>
                  <td>Ignores profitability</td>
                </tr>
                <tr>
                  <td>Profit Multiple</td>
                  <td>Established, profitable businesses</td>
                  <td>Reflects actual earnings</td>
                  <td>Requires consistent profits</td>
                </tr>
              </tbody>
            </table>

            <h4>Industry Multiplier Benchmarks</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Industry</th>
                  <th>Revenue Multiple</th>
                  <th>Profit Multiple</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Technology (SaaS)</td>
                  <td>5-10x</td>
                  <td>8-15x</td>
                </tr>
                <tr>
                  <td>Retail</td>
                  <td>0.5-1.5x</td>
                  <td>3-6x</td>
                </tr>
                <tr>
                  <td>Manufacturing</td>
                  <td>1-2x</td>
                  <td>4-8x</td>
                </tr>
                <tr>
                  <td>Professional Services</td>
                  <td>1-2x</td>
                  <td>3-6x</td>
                </tr>
                <tr>
                  <td>Restaurants</td>
                  <td>0.3-1x</td>
                  <td>2-4x</td>
                </tr>
              </tbody>
            </table>

            <h4>Tips to Increase Business Value</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Increase recurring revenue</strong> — subscriptions outperform one-time sales</li>
              <li>✅ <strong>Diversify customer base</strong> — reduce dependency on few clients</li>
              <li>✅ <strong>Document systems</strong> — make business less owner-dependent</li>
              <li>✅ <strong>Show growth trends</strong> — consistent growth increases multiples</li>
              <li>✅ <strong>Clean financials</strong> — professional accounting boosts credibility</li>
            </ul>

            <h4>Advanced Valuation Methods</h4>
            <p>
              For more precise valuations:
            </p>
            <ul className={styles.list}>
              <li><strong>DCF (Discounted Cash Flow):</strong> Future cash flows discounted to present value</li>
              <li><strong>Market Comparables:</strong> Compare to similar recently sold businesses</li>
              <li><strong>Asset-Based:</strong> Value of tangible and intangible assets</li>
              <li><strong>EBITDA Multiple:</strong> Earnings before interest, taxes, depreciation, and amortization</li>
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

export default ValuationCalculator;