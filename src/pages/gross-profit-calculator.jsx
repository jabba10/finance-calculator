import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './grossprofitcalculator.module.css';

const GrossProfitCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [inputs, setInputs] = useState({
    revenue: '10000',
    cogs: '6000',
    operatingExpenses: '2000',
    taxRate: '25'
  });

  const [results, setResults] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const revenue = parseFloat(inputs.revenue);
    const cogs = parseFloat(inputs.cogs);
    const operatingExpenses = parseFloat(inputs.operatingExpenses);
    const taxRate = parseFloat(inputs.taxRate) / 100;

    // Validation
    if (isNaN(revenue) || isNaN(cogs) || isNaN(operatingExpenses) || isNaN(taxRate)) {
      alert("Please enter valid numbers in all fields");
      return;
    }

    if (revenue < 0 || cogs < 0 || operatingExpenses < 0 || taxRate < 0 || taxRate > 1) {
      alert("Values cannot be negative or invalid");
      return;
    }

    // Calculations
    const grossProfit = revenue - cogs;
    const grossMargin = (grossProfit / revenue) * 100;
    const operatingProfit = grossProfit - operatingExpenses;
    const taxAmount = operatingProfit * taxRate;
    const netProfit = operatingProfit - taxAmount;

    setResults({
      revenue: revenue.toFixed(2),
      cogs: cogs.toFixed(2),
      grossProfit: grossProfit.toFixed(2),
      grossMargin: grossMargin.toFixed(2),
      operatingExpenses: operatingExpenses.toFixed(2),
      operatingProfit: operatingProfit.toFixed(2),
      taxRate: (taxRate * 100).toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      netProfit: netProfit.toFixed(2)
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
        <title>Gross Profit Calculator | Free Tool to Analyze Business Profitability</title>
        <meta
          name="description"
          content="Calculate your gross profit, gross margin, operating profit, and net profit with our free calculator. Understand your business profitability at every level."
        />
        <meta
          name="keywords"
          content="gross profit calculator, profit margin, net profit, operating profit, financial analysis, business tools"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/gross-profit-calculator" />

        {/* Open Graph / Social */}
        <meta property="og:title" content="Gross Profit Calculator | Analyze Your Business Margins" />
        <meta
          property="og:description"
          content="Free tool to calculate gross profit, operating profit, and net profit — essential for startups, small businesses, and financial planning."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/gross-profit-calculator" />
        <meta property="og:image" content="https://www.financecalculatorfree.com/images/grossprofit-og.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gross Profit Calculator | Analyze Your Business Margins" />
        <meta
          name="twitter:description"
          content="See how much you really make after COGS, expenses, and taxes with our detailed profit calculator."
        />
        <meta name="twitter:image" content="https://www.financecalculatorfree.com/images/grossprofit-twitter.png" />
      </Head>

      {/* Gap above content (from navbar) */}
      <div className={styles.spacerTop}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Gross Profit Calculator</h1>
          <p className={styles.subtitle}>
            Analyze your business profitability by calculating gross profit, operating profit, and net profit margins.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="revenue" className={styles.label}>
                  Total Revenue ($)
                </label>
                <input
                  type="number"
                  id="revenue"
                  name="revenue"
                  value={inputs.revenue}
                  onChange={handleChange}
                  placeholder="e.g. 10000"
                  step="100"
                  min="0"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="cogs" className={styles.label}>
                  Cost of Goods Sold ($)
                </label>
                <input
                  type="number"
                  id="cogs"
                  name="cogs"
                  value={inputs.cogs}
                  onChange={handleChange}
                  placeholder="e.g. 6000"
                  step="100"
                  min="0"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="operatingExpenses" className={styles.label}>
                  Operating Expenses ($)
                </label>
                <input
                  type="number"
                  id="operatingExpenses"
                  name="operatingExpenses"
                  value={inputs.operatingExpenses}
                  onChange={handleChange}
                  placeholder="e.g. 2000"
                  step="100"
                  min="0"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="taxRate" className={styles.label}>
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  id="taxRate"
                  name="taxRate"
                  value={inputs.taxRate}
                  onChange={handleChange}
                  placeholder="e.g. 25"
                  step="0.1"
                  min="0"
                  max="100"
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className="taxpro-btn-label">Calculate Profitability</span>
                <span className="taxpro-btn-arrow">→</span>
              </button>
            </form>

            {results && (
              <div className={styles.resultSection}>
                <h3>Profitability Analysis</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Revenue:</strong> ${results.revenue}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>COGS:</strong> ${results.cogs}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Gross Profit:</strong> ${results.grossProfit}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Gross Margin:</strong> {results.grossMargin}%
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Operating Expenses:</strong> ${results.operatingExpenses}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Operating Profit:</strong> ${results.operatingProfit}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Tax Rate:</strong> {results.taxRate}%
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Tax Amount:</strong> ${results.taxAmount}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Net Profit:</strong> ${results.netProfit}
                  </div>
                </div>
                <div className={styles.note}>
                  Results are estimates. Actual profitability may vary based on accounting methods and additional factors.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Understanding Profit Margins</h3>
            <p>
              Gross profit measures your company's efficiency in producing and selling goods, while net profit shows your true bottom line after all expenses. Tracking these metrics helps you <strong>identify cost issues</strong>, <strong>price products effectively</strong>, and <strong>improve overall profitability</strong>.
            </p>

            <h4>How to Use This Calculator</h4>
            <p>
              Enter your <strong>total revenue</strong>, <strong>cost of goods sold (COGS)</strong>, <strong>operating expenses</strong>, and <strong>tax rate</strong>. The calculator will show your gross profit, operating profit, and net profit with corresponding margins.
            </p>

            <h4>Key Profitability Formulas</h4>
            <div className={styles.formula}>
              <code>Gross Profit = Revenue - COGS</code>
            </div>
            <div className={styles.formula}>
              <code>Gross Margin = (Gross Profit / Revenue) × 100</code>
            </div>
            <div className={styles.formula}>
              <code>Operating Profit = Gross Profit - Operating Expenses</code>
            </div>
            <div className={styles.formula}>
              <code>Net Profit = Operating Profit - Taxes</code>
            </div>
            <p>
              These metrics help you understand where money is being made and lost in your business operations.
            </p>

            <h4>Essential Profit Metrics</h4>
            <ul className={styles.list}>
              <li><strong>Gross Profit:</strong> Revenue minus direct production costs</li>
              <li><strong>Gross Margin:</strong> Gross profit as percentage of revenue</li>
              <li><strong>Operating Profit:</strong> Profit after operating expenses</li>
              <li><strong>Net Profit:</strong> Final profit after all expenses and taxes</li>
            </ul>

            <h4>Industry Benchmark Margins</h4>
            <ul className={styles.list}>
              <li><strong>Retail:</strong> 20-30% gross margin</li>
              <li><strong>Manufacturing:</strong> 30-50% gross margin</li>
              <li><strong>Software:</strong> 70-90% gross margin</li>
              <li><strong>Restaurants:</strong> 10-15% net profit margin</li>
            </ul>

            <h4>Improving Your Margins</h4>
            <ul className={styles.list}>
              <li>Negotiate better supplier prices to reduce COGS</li>
              <li>Increase prices strategically</li>
              <li>Reduce waste in production</li>
              <li>Optimize operational efficiency</li>
              <li>Review tax strategies with professionals</li>
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
              <span className="btn-label">Explore Business Calculators</span>
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

export default GrossProfitCalculator;