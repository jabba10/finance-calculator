import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './profitmargincalculator.module.css';

const ProfitMarginCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [revenue, setRevenue] = useState('');
  const [cost, setCost] = useState('');
  const [result, setResult] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const revenueValue = parseFloat(revenue);
    const costValue = parseFloat(cost);

    // Validation
    if (isNaN(revenueValue) || isNaN(costValue)) {
      alert("Please enter valid numbers in all fields");
      return;
    }

    if (revenueValue <= 0) {
      alert("Revenue must be greater than zero.");
      return;
    }

    if (costValue < 0) {
      alert("Cost cannot be negative.");
      return;
    }

    // Calculations
    const grossProfit = revenueValue - costValue;
    const profitMargin = (grossProfit / revenueValue) * 100;
    const markup = (grossProfit / costValue) * 100;

    setResult({
      revenue: revenueValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      cost: costValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      grossProfit: grossProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      profitMargin: profitMargin.toFixed(2),
      markup: markup.toFixed(2),
      isProfitable: grossProfit >= 0
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
        <title>Profit Margin Calculator | Free Tool to Calculate Gross Profit</title>
        <meta
          name="description"
          content="Calculate your gross profit margin instantly. Understand profitability, compare against benchmarks, and improve pricing with our free calculator."
        />
        <meta
          name="keywords"
          content="profit margin calculator, gross profit, business profitability, markup vs margin, pricing tool"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/profit-margin-calculator" />

        {/* Open Graph / Social */}
        <meta property="og:title" content="Profit Margin Calculator | Measure Business Profitability" />
        <meta
          property="og:description"
          content="Free tool to calculate your profit margin and understand how much you keep from each sale."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/profit-margin-calculator" />
        <meta property="og:image" content="https://www.financecalculatorfree.com/images/profitmargin-og.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Profit Margin Calculator | Measure Business Profitability" />
        <meta
          name="twitter:description"
          content="See your real profit margin and learn how to improve it with actionable insights."
        />
        <meta name="twitter:image" content="https://www.financecalculatorfree.com/images/profitmargin-twitter.png" />
      </Head>

      {/* Gap above content (from navbar) */}
      <div className={styles.spacerTop}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Profit Margin Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your profit margin to understand business profitability and make informed pricing decisions.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your revenue and costs to calculate profit margin.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="revenue" className={styles.label}>
                  Total Revenue ($)
                </label>
                <input
                  id="revenue"
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  placeholder="e.g. 10000.00"
                  className={styles.input}
                  min="0.01"
                  step="0.01"
                  required
                />
                <small className={styles.note}>
                  Total sales or income from products/services
                </small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="cost" className={styles.label}>
                  Total Costs ($)
                </label>
                <input
                  id="cost"
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="e.g. 6500.00"
                  className={styles.input}
                  min="0"
                  step="0.01"
                  required
                />
                <small className={styles.note}>
                  Cost of goods sold, labor, overhead, etc.
                </small>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className="taxpro-btn-label">Calculate Profit Margin</span>
                <span className="taxpro-btn-arrow">→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Profitability Analysis</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Revenue:</strong> ${result.revenue}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Costs:</strong> ${result.cost}
                  </div>
                  <div className={`${styles.resultItem} ${result.isProfitable ? styles.highlight : styles.warning}`}>
                    <strong>Gross Profit:</strong> ${result.grossProfit}
                  </div>
                  <div className={`${styles.resultItem} ${result.isProfitable ? styles.highlight : styles.warning}`}>
                    <strong>Profit Margin:</strong> {result.profitMargin}%
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Markup Percentage:</strong> {result.markup}%
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Status:</strong>{' '}
                    <span className={result.isProfitable ? styles.textSuccess : styles.textDanger}>
                      {result.isProfitable ? 'Profitable' : 'Not Profitable'}
                    </span>
                  </div>
                </div>
                <div className={styles.note}>
                  Your business has a <strong>{result.profitMargin}%</strong> profit margin, meaning you keep ${result.profitMargin} from every $100 in revenue.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why Profit Margin Matters</h3>
            <p>
              <strong>Profit margin</strong> is the most important metric for assessing business health. It shows what percentage of revenue becomes profit after accounting for costs. Tracking margins helps you <strong>price products effectively, control expenses, and grow sustainably</strong>.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li><strong>Revenue:</strong> Total income from sales before any expenses</li>
              <li><strong>Costs:</strong> All expenses including production, labor, overhead, etc.</li>
              <li>Click "Calculate" to see your gross profit, margin percentage, and markup</li>
            </ul>

            <h4>Formulas Used</h4>
            <div className={styles.formula}>
              <code>Gross Profit = Revenue - Costs</code>
            </div>
            <div className={styles.formula}>
              <code>Profit Margin = (Gross Profit ÷ Revenue) × 100</code>
            </div>
            <div className={styles.formula}>
              <code>Markup Percentage = (Gross Profit ÷ Costs) × 100</code>
            </div>
            <p>
              <strong>Example:</strong> $10,000 revenue - $6,500 costs = $3,500 gross profit
              <br />
              Profit Margin = ($3,500 ÷ $10,000) × 100 = <strong>35%</strong>
              <br />
              Markup = ($3,500 ÷ $6,500) × 100 = <strong>53.85%</strong>
            </p>

            <h4>Profit Margin vs. Markup</h4>
            <p>
              While related, these metrics serve different purposes:
            </p>
            <ul className={styles.list}>
              <li><strong>Profit Margin</strong> shows profitability as percentage of revenue (what you keep)</li>
              <li><strong>Markup</strong> shows how much you add to costs to set prices (what you charge)</li>
              <li>A 50% markup equals a 33% margin (on $100 cost: $150 price → $50 profit is 33% of $150)</li>
            </ul>

            <h4>Industry Benchmarks (Average Gross Margins)</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Industry</th>
                  <th>Average Margin</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Software (SaaS)</td>
                  <td>70-90%</td>
                </tr>
                <tr>
                  <td>Retail</td>
                  <td>25-50%</td>
                </tr>
                <tr>
                  <td>Restaurants</td>
                  <td>3-15%</td>
                </tr>
                <tr>
                  <td>Manufacturing</td>
                  <td>20-35%</td>
                </tr>
                <tr>
                  <td>Consulting</td>
                  <td>25-60%</td>
                </tr>
              </tbody>
            </table>

            <h4>Tips to Improve Profit Margins</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Increase prices strategically</strong> — test small increases first</li>
              <li>✅ <strong>Reduce variable costs</strong> — negotiate with suppliers, find efficiencies</li>
              <li>✅ <strong>Optimize product mix</strong> — focus on higher-margin items</li>
              <li>✅ <strong>Increase sales volume</strong> — spread fixed costs over more units</li>
              <li>✅ <strong>Reduce overhead</strong> — automate processes, eliminate waste</li>
            </ul>

            <h4>Advanced Margin Analysis</h4>
            <p>
              For deeper financial insights:
            </p>
            <ul className={styles.list}>
              <li><strong>Net Profit Margin:</strong> (Revenue - All expenses) ÷ Revenue</li>
              <li><strong>Operating Margin:</strong> (Operating income ÷ Revenue)</li>
              <li><strong>Contribution Margin:</strong> (Revenue - Variable costs) ÷ Revenue</li>
              <li><strong>Break-even Analysis:</strong> Fixed costs ÷ (Price - Variable cost per unit)</li>
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

export default ProfitMarginCalculator;