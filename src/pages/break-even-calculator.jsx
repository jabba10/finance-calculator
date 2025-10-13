import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './BreakEvenCalculator.module.css';

const BreakEvenCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state — allow any string input
  const [fixedCosts, setFixedCosts] = useState('');
  const [variableCosts, setVariableCosts] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [result, setResult] = useState(null);

  // Helper: Extract first valid number from string
  const parseNumber = (input) => {
    if (!input) return NaN;
    const match = input.toString().replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const fixed = parseNumber(fixedCosts);
    const variable = parseNumber(variableCosts);
    const price = parseNumber(pricePerUnit);

    if (isNaN(fixed) || isNaN(variable) || isNaN(price)) {
      alert("Please enter valid numbers in all fields.");
      return;
    }

    if (fixed < 0 || variable < 0 || price <= 0) {
      alert("Fixed costs and variable cost must be non-negative. Price per unit must be positive.");
      return;
    }

    if (price <= variable) {
      alert("Price per unit must be greater than variable cost per unit to break even.");
      return;
    }

    const breakEvenUnits = Math.ceil(fixed / (price - variable));
    const breakEvenRevenue = (breakEvenUnits * price).toFixed(2);

    setResult({
      fixedCosts: fixed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      variableCosts: variable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      pricePerUnit: price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      breakEvenUnits: breakEvenUnits.toLocaleString(),
      breakEvenRevenue,
      contributionMargin: ((price - variable) / price * 100).toFixed(1)
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
        <title>Break-Even Point Calculator | Free Financial Tool</title>
        <meta
          name="description"
          content="Calculate your business break-even point with this free, easy-to-use calculator. Determine how many units you need to sell to cover costs."
        />
        <meta name="keywords" content="break-even calculator, financial planning, startup costs, pricing strategy" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/break-even-calculator" />
        <meta property="og:title" content="Break-Even Point Calculator" />
        <meta
          property="og:description"
          content="Free tool to calculate when your business will become profitable."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/break-even-calculator" />
      </Head>

      {/* Spacing above */}
      <div className={styles.spacerTop} />

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Break-Even Point Calculator</h1>
          <p className={styles.subtitle}>
            Determine when your business will become profitable by calculating your break-even point.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your business costs and pricing to calculate your break-even point.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="fixedCosts" className={styles.label}>
                Fixed Costs ($)
              </label>
              <input
                id="fixedCosts"
                type="text"
                value={fixedCosts}
                onChange={(e) => setFixedCosts(e.target.value)}
                placeholder="e.g. $10,000 or 10000"
                className={styles.input}
              />
              <small className={styles.note}>
                Costs that don't change with production volume (rent, salaries, etc.)
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="variableCosts" className={styles.label}>
                Variable Cost per Unit ($)
              </label>
              <input
                id="variableCosts"
                type="text"
                value={variableCosts}
                onChange={(e) => setVariableCosts(e.target.value)}
                placeholder="e.g. $5.50 or 5.5"
                className={styles.input}
              />
              <small className={styles.note}>
                Costs that vary with each unit produced (materials, labor, etc.)
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="pricePerUnit" className={styles.label}>
                Price per Unit ($)
              </label>
              <input
                id="pricePerUnit"
                type="text"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                placeholder="e.g. $12.99 or 12.99"
                className={styles.input}
              />
              <small className={styles.note}>
                Selling price for each unit of your product/service
              </small>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Break-Even</span>
              <span className={styles.arrow}>→</span>
            </button>

            {result && (
              <div className={styles.resultSection}>
                <h3>Break-Even Analysis</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Fixed Costs:</strong> ${result.fixedCosts}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Variable Cost per Unit:</strong> ${result.variableCosts}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Price per Unit:</strong> ${result.pricePerUnit}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Break-Even Units:</strong> {result.breakEvenUnits}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Break-Even Revenue:</strong> ${result.breakEvenRevenue}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Contribution Margin:</strong> {result.contributionMargin}%
                  </div>
                </div>
                <div className={styles.note}>
                  You need to sell <strong>{result.breakEvenUnits}</strong> units to cover your costs, generating{' '}
                  <strong>${result.breakEvenRevenue}</strong> in revenue.
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Understanding Break-Even Analysis</h3>
            <p>
              The <strong>Break-Even Point</strong> is the sales amount where total revenue equals total costs, resulting in neither profit nor loss. It's a fundamental metric for assessing{' '}
              <strong>business viability, pricing strategy, and financial planning</strong>.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li><strong>Fixed Costs:</strong> Ongoing expenses that don't vary with production</li>
              <li><strong>Variable Costs:</strong> Expenses that change with each unit produced</li>
              <li><strong>Price per Unit:</strong> What you charge customers for each unit</li>
              <li>Click "Calculate Break-Even" to see your break-even point</li>
            </ul>

            <h4>Formula Used</h4>
            <div className={styles.formula}>
              <code>
                Break-Even Units = Fixed Costs ÷ (Price per Unit - Variable Cost per Unit)
              </code>
            </div>
            <p>
              <strong>Example:</strong> $10,000 fixed costs ÷ ($12.99 - $5.50) = <strong>1,334 units</strong>
            </p>

            <h4>Key Business Metrics</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Calculation</th>
                  <th>Importance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Contribution Margin</td>
                  <td>(Price - Variable Cost) ÷ Price</td>
                  <td>Shows what portion of revenue contributes to fixed costs</td>
                </tr>
                <tr>
                  <td>Margin of Safety</td>
                  <td>(Actual Sales - Break-Even Sales) ÷ Actual Sales</td>
                  <td>Measures how much sales can drop before losses occur</td>
                </tr>
                <tr>
                  <td>Operating Leverage</td>
                  <td>Contribution Margin ÷ Net Income</td>
                  <td>Shows how revenue changes affect profitability</td>
                </tr>
              </tbody>
            </table>

            <h4>Industry Benchmarks</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Industry</th>
                  <th>Typical Break-Even Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Retail</td>
                  <td>6-18 months</td>
                </tr>
                <tr>
                  <td>Restaurants</td>
                  <td>1-3 years</td>
                </tr>
                <tr>
                  <td>Software (SaaS)</td>
                  <td>2-4 years</td>
                </tr>
                <tr>
                  <td>Manufacturing</td>
                  <td>3-5 years</td>
                </tr>
                <tr>
                  <td>Consulting Services</td>
                  <td>3-12 months</td>
                </tr>
              </tbody>
            </table>

            <h4>Strategies to Lower Your Break-Even Point</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Reduce fixed costs</strong> — negotiate better leases, outsource non-core functions</li>
              <li>✅ <strong>Lower variable costs</strong> — bulk purchasing, process optimization</li>
              <li>✅ <strong>Increase prices</strong> — if market conditions allow</li>
              <li>✅ <strong>Product mix optimization</strong> — focus on higher-margin products</li>
              <li>✅ <strong>Increase sales volume</strong> — through marketing and sales efforts</li>
            </ul>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
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
        </section>
      </div>

      {/* Spacing below */}
      <div className={styles.spacerBottom} />
    </>
  );
};

export default BreakEvenCalculator;