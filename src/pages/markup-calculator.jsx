import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './markupcalculator.module.css';

const MarkupCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [cost, setCost] = useState('');
  const [markupPercent, setMarkupPercent] = useState('');
  const [result, setResult] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const costValue = parseFloat(cost);
    const markupValue = parseFloat(markupPercent);

    // Validation
    if (isNaN(costValue) || isNaN(markupValue)) {
      alert("Please enter valid numbers in all fields");
      return;
    }

    if (costValue <= 0) {
      alert("Cost must be greater than zero.");
      return;
    }

    if (markupValue < 0) {
      alert("Markup percentage cannot be negative.");
      return;
    }

    // Calculations
    const markupAmount = (costValue * markupValue) / 100;
    const sellingPrice = costValue + markupAmount;
    const grossProfit = sellingPrice - costValue;
    const marginPercent = (grossProfit / sellingPrice) * 100;

    setResult({
      cost: costValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      markupPercent: markupValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      markupAmount: markupAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      sellingPrice: sellingPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      grossProfit: grossProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      marginPercent: marginPercent.toFixed(2)
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
        <title>Markup Calculator | Free Selling Price & Profit Tool</title>
        <meta
          name="description"
          content="Calculate your selling price, markup amount, and profit margin. Optimize pricing strategy with our free markup calculator."
        />
        <meta
          name="keywords"
          content="markup calculator, profit margin, selling price, pricing tool, business calculator"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/markup-calculator" />

        {/* Open Graph / Social */}
        <meta property="og:title" content="Markup Calculator | Set Your Ideal Selling Price" />
        <meta
          property="og:description"
          content="Free tool to calculate markup, selling price, and profit margin instantly."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/markup-calculator" />
        <meta property="og:image" content="https://www.financecalculatorfree.com/images/markup-og.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Markup Calculator | Set Your Ideal Selling Price" />
        <meta
          name="twitter:description"
          content="See how markup affects your profit margin and optimize your pricing."
        />
        <meta name="twitter:image" content="https://www.financecalculatorfree.com/images/markup-twitter.png" />
      </Head>

      {/* Gap above content (from navbar) */}
      <div className={styles.spacerTop}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Markup Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your selling price, markup amount, and profit margin for optimal pricing strategy.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your product cost and desired markup percentage.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="cost" className={styles.label}>
                  Product Cost ($)
                </label>
                <input
                  id="cost"
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="e.g. 50.00"
                  className={styles.input}
                  min="0.01"
                  step="any"
                  required
                />
                <small className={styles.note}>
                  The cost to produce or purchase the product
                </small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="markupPercent" className={styles.label}>
                  Markup Percentage (%)
                </label>
                <input
                  id="markupPercent"
                  type="number"
                  value={markupPercent}
                  onChange={(e) => setMarkupPercent(e.target.value)}
                  placeholder="e.g. 30"
                  className={styles.input}
                  min="0"
                  step="any"
                  required
                />
                <small className={styles.note}>
                  The percentage you want to add to the cost
                </small>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className="taxpro-btn-label">Calculate Markup</span>
                <span className="taxpro-btn-arrow">→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Markup Calculation Results</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Cost:</strong> ${result.cost}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Markup %:</strong> {result.markupPercent}%
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Selling Price:</strong> ${result.sellingPrice}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Markup Amount:</strong> ${result.markupAmount}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Gross Profit:</strong> ${result.grossProfit}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Profit Margin:</strong> {result.marginPercent}%
                  </div>
                </div>
                <div className={styles.note}>
                  At a {result.markupPercent}% markup, your profit margin is <strong>{result.marginPercent}%</strong> of the selling price.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why Markup Matters</h3>
            <p>
              <strong>Markup pricing</strong> is essential for ensuring your business remains profitable. It helps you determine the right selling price by adding a percentage to your product cost. Understanding markup vs. margin helps you <strong>price competitively, cover overhead, and achieve desired profitability</strong>.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li><strong>Product Cost:</strong> Your cost to produce or purchase the item (materials, labor, shipping, etc.)</li>
              <li><strong>Markup Percentage:</strong> The percentage you want to add to the cost to determine selling price</li>
              <li>Click "Calculate Markup" to see your selling price and profit margin</li>
            </ul>

            <h4>Formulas Used</h4>
            <div className={styles.formula}>
              <code>Selling Price = Cost + (Cost × Markup Percentage / 100)</code>
            </div>
            <div className={styles.formula}>
              <code>Profit Margin = (Selling Price - Cost) / Selling Price × 100</code>
            </div>
            <p>
              <strong>Example:</strong> $50 cost with 30% markup → $50 + ($50 × 0.30) = <strong>$65 selling price</strong>
              <br />
              Profit Margin = ($65 - $50) / $65 × 100 = <strong>23.08% margin</strong>
            </p>

            <h4>Markup vs. Margin</h4>
            <p>
              While often confused, markup and margin are different:
            </p>
            <ul className={styles.list}>
              <li><strong>Markup</strong> is the amount added to the cost price to determine selling price</li>
              <li><strong>Margin</strong> is the percentage of the selling price that is profit</li>
              <li>A 50% markup equals a 33% margin (on $100 cost: $150 selling price → $50 profit is 33% of $150)</li>
            </ul>

            <h4>Industry Benchmarks (Typical Markups)</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Industry</th>
                  <th>Average Markup</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Retail (Clothing)</td>
                  <td>50-100%</td>
                </tr>
                <tr>
                  <td>Electronics</td>
                  <td>15-30%</td>
                </tr>
                <tr>
                  <td>Restaurants</td>
                  <td>60-300%</td>
                </tr>
                <tr>
                  <td>Manufacturing</td>
                  <td>20-50%</td>
                </tr>
                <tr>
                  <td>Jewelry</td>
                  <td>100-500%</td>
                </tr>
              </tbody>
            </table>

            <h4>Pricing Strategy Tips</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Know your costs</strong> — include all expenses (materials, labor, overhead)</li>
              <li>✅ <strong>Research competitors</strong> — price competitively but don't race to the bottom</li>
              <li>✅ <strong>Consider value-based pricing</strong> — charge what customers are willing to pay</li>
              <li>✅ <strong>Adjust for volume</strong> — lower markup for high-volume products</li>
              <li>✅ <strong>Review regularly</strong> — update prices as costs and market conditions change</li>
            </ul>

            <h4>Advanced Pricing Considerations</h4>
            <p>
              For more sophisticated pricing strategies:
            </p>
            <ul className={styles.list}>
              <li><strong>Psychological pricing:</strong> $9.99 instead of $10</li>
              <li><strong>Tiered pricing:</strong> Different prices for different versions/quantities</li>
              <li><strong>Bundle pricing:</strong> Discounts for purchasing multiple items together</li>
              <li><strong>Dynamic pricing:</strong> Adjust prices based on demand, time, or customer</li>
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

export default MarkupCalculator;