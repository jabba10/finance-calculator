import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './inventorycalculator.module.css';

const InventoryCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [beginningInventory, setBeginningInventory] = useState('');
  const [purchases, setPurchases] = useState('');
  const [endingInventory, setEndingInventory] = useState('');
  const [sales, setSales] = useState('');
  const [result, setResult] = useState(null);

  // Enhanced number parsing: handles $, commas, k, M, etc.
  const parseInput = (input) => {
    if (!input || typeof input !== 'string') return NaN;

    const lower = input.toLowerCase();
    let multiplier = 1;
    if (lower.includes('k')) multiplier = 1e3;
    else if (lower.includes('m')) multiplier = 1e6;
    else if (lower.includes('b')) multiplier = 1e9;

    // Remove everything except digits, decimal point, and leading minus
    const cleaned = input.replace(/[^0-9.-]+/g, '');
    const num = parseFloat(cleaned);

    return isNaN(num) ? NaN : num * multiplier;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const beg = parseInput(beginningInventory);
    const pur = parseInput(purchases);
    const end = parseInput(endingInventory);
    const rev = parseInput(sales);

    // Use 0 for any invalid/non-numeric input
    const safeBeg = isNaN(beg) ? 0 : beg;
    const safePur = isNaN(pur) ? 0 : pur;
    const safeEnd = isNaN(end) ? 0 : end;
    const safeRev = isNaN(rev) ? 0 : rev;

    // COGS = Beginning + Purchases - Ending
    const cogs = safeBeg + safePur - safeEnd;

    // Inventory Turnover = COGS / Average Inventory
    const avgInventory = (safeBeg + safeEnd) / 2;
    const turnover = avgInventory > 0 ? (cogs / avgInventory).toFixed(2) : 0;

    // Days in Inventory = 365 / Turnover
    const daysInInventory = turnover > 0 ? (365 / turnover).toFixed(1) : 0;

    // Gross Profit & Margin
    const grossProfit = safeRev - cogs;
    const grossMargin = safeRev > 0 ? ((grossProfit / safeRev) * 100).toFixed(2) : 0;

    setResult({
      cogs: cogs.toLocaleString(),
      turnover,
      daysInInventory,
      grossProfit: grossProfit.toLocaleString(),
      grossMargin,
      healthyTurnover: +turnover >= 4 && +turnover <= 12,
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
        <title>Inventory Calculator | Free Tool to Analyze Stock Efficiency</title>
        <meta
          name="description"
          content="Calculate COGS, inventory turnover, days in inventory, and gross margin. Optimize stock levels and improve profitability with our free calculator."
        />
        <meta
          name="keywords"
          content="inventory calculator, inventory turnover, COGS, days in inventory, retail tools, business efficiency"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/inventory-calculator" />

        {/* Open Graph / Social */}
        <meta property="og:title" content="Inventory Calculator | Measure Stock Efficiency" />
        <meta
          property="og:description"
          content="Free tool to calculate inventory turnover, COGS, and days in stock — essential for retailers, e-commerce, and manufacturers."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/inventory-calculator" />
        <meta property="og:image" content="https://www.financecalculatorfree.com/images/inventory-og.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Inventory Calculator | Measure Stock Efficiency" />
        <meta
          name="twitter:description"
          content="See how fast your inventory sells and optimize ordering with our easy-to-use calculator."
        />
        <meta name="twitter:image" content="https://www.financecalculatorfree.com/images/inventory-twitter.png" />
      </Head>

      {/* Gap above content (from navbar) */}
      <div className={styles.spacerTop}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Inventory Calculator</h1>
          <p className={styles.subtitle}>
            Calculate COGS, turnover, and days in inventory to optimize stock and profitability.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter inventory and sales data using formats like $25k, 1.5M, 100,000, etc. All inputs accepted.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="beginningInventory" className={styles.label}>
                  Beginning Inventory ($)
                </label>
                <input
                  id="beginningInventory"
                  type="text"
                  value={beginningInventory}
                  onChange={(e) => setBeginningInventory(e.target.value)}
                  placeholder="e.g. $25,000 or 25k"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="purchases" className={styles.label}>
                  Purchases During Period ($)
                </label>
                <input
                  id="purchases"
                  type="text"
                  value={purchases}
                  onChange={(e) => setPurchases(e.target.value)}
                  placeholder="e.g. 60,000 or $60k"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="endingInventory" className={styles.label}>
                  Ending Inventory ($)
                </label>
                <input
                  id="endingInventory"
                  type="text"
                  value={endingInventory}
                  onChange={(e) => setEndingInventory(e.target.value)}
                  placeholder="e.g. 15,000"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="sales" className={styles.label}>
                  Total Sales Revenue ($)
                </label>
                <input
                  id="sales"
                  type="text"
                  value={sales}
                  onChange={(e) => setSales(e.target.value)}
                  placeholder="e.g. 100,000 or 1M"
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className="taxpro-btn-label">Calculate Inventory Metrics</span>
                <span className="taxpro-btn-arrow">→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Inventory Performance</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>COGS:</strong> ${result.cogs}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Turnover:</strong> {result.turnover}x/year
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Days in Inventory:</strong> {result.daysInInventory} days
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Gross Margin:</strong> {result.grossMargin}%
                  </div>
                </div>
                <div className={styles.note}>
                  {result.healthyTurnover
                    ? `Your inventory turns over ${result.turnover}x per year — a healthy balance between stock and sales.`
                    : `Turnover of ${result.turnover}x may indicate overstocking (too low) or stockouts (too high). Optimize ordering.`
                  }
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why Inventory Management Matters</h3>
            <p>
              <strong>Inventory management</strong> is critical for retail, e-commerce, manufacturing, and any business that holds stock. Poor inventory control leads to <strong>overstocking, waste, or stockouts</strong>. This calculator helps you measure efficiency and profitability.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li><strong>Beginning Inventory:</strong> Value at start of period (month/quarter).</li>
              <li><strong>Purchases:</strong> All inventory bought during the period.</li>
              <li><strong>Ending Inventory:</strong> Value left at end of period.</li>
              <li><strong>Sales:</strong> Total revenue from sold goods.</li>
              <li>Click “Calculate” to see key metrics like COGS, turnover, and margin.</li>
            </ul>

            <h4>Formulas Used</h4>
            <div className={styles.formula}>
              <code>COGS = Beginning + Purchases − Ending Inventory</code>
            </div>
            <div className={styles.formula}>
              <code>Inventory Turnover = COGS ÷ Average Inventory</code>
            </div>
            <div className={styles.formula}>
              <code>Days in Inventory = 365 ÷ Turnover</code>
            </div>
            <div className={styles.formula}>
              <code>Gross Margin = (Sales − COGS) ÷ Sales × 100</code>
            </div>

            <h4>Real-World Example</h4>
            <p>
              <strong>Beginning:</strong> $25,000<br />
              <strong>Purchases:</strong> $60,000<br />
              <strong>Ending:</strong> $15,000<br />
              <strong>Sales:</strong> $100,000
              <br /><br />
              COGS = 25k + 60k − 15k = <strong>$70,000</strong><br />
              Turnover = 70k / ((25k + 15k)/2) = <strong>3.5x/year</strong><br />
              Days in Inventory = 365 / 3.5 ≈ <strong>104 days</strong>
            </p>

            <h4>What Your Turnover Tells You</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Turnover Rate</th>
                  <th>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1–3x</td>
                  <td>⚠️ Low — Risk of overstocking or slow-moving items</td>
                </tr>
                <tr>
                  <td>4–12x</td>
                  <td>✅ Healthy — Balanced inventory and demand</td>
                </tr>
                <tr>
                  <td>12–20x+</td>
                  <td>⚠️ High — Risk of stockouts, lost sales</td>
                </tr>
              </tbody>
            </table>

            <h4>Tips to Optimize Inventory</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Use ABC analysis</strong> — focus on high-value items</li>
              <li>✅ <strong>Forecast demand</strong> using sales history and trends</li>
              <li>✅ <strong>Set reorder points</strong> to avoid stockouts</li>
              <li>✅ <strong>Negotiate better terms</strong> with suppliers for faster restocking</li>
              <li>✅ <strong>Run promotions</strong> on slow-moving stock</li>
            </ul>

            <h4>Advanced Use: Just-in-Time (JIT)</h4>
            <p>
              Top companies like Toyota and Amazon use <strong>Just-in-Time inventory</strong> to minimize holding costs. This requires:
            </p>
            <ul className={styles.list}>
              <li>Reliable suppliers</li>
              <li>Precise demand forecasting</li>
              <li>Efficient logistics</li>
            </ul>
            <p>
              Use this calculator to benchmark your current turnover before adopting JIT.
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

export default InventoryCalculator;