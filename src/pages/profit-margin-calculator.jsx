import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
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

  // === SEO KEYWORDS ===
  const singleKeywords = [
    "profit", "margin", "calculator", "gross", "profitability", "business", "revenue", "cost", "pricing",
    "markup", "finance", "financial", "tool", "free", "online", "percentage", "analysis", "roi", "income",
    "expenses", "overhead", "cogs", "grossprofit", "net", "operating", "margin", "retail", "saas", "ecommerce",
    "restaurant", "manufacturing", "consulting", "markup", "pricing", "strategy", "break", "even", "unit",
    "economics", "benchmark", "ratio", "efficiency", "growth", "startup", "small", "business", "owner",
    "entrepreneur", "accounting", "bookkeeping", "budgeting", "forecasting", "profitability", "metrics", "kpis"
  ];

  const twoWordKeywords = [
    "profit margin", "margin calculator", "gross profit", "business profitability", "markup vs margin",
    "pricing tool", "profit calculator", "margin percentage", "cost calculation", "revenue analysis",
    "financial calculator", "free calculator", "online tool", "profit analysis", "margin benchmark",
    "gross margin", "net margin", "operating margin", "contribution margin", "break even",
    "price markup", "cost of goods", "business metrics", "profitability ratio", "roi calculator",
    "saas margins", "ecommerce profit", "restaurant margins", "retail markup", "manufacturing profit",
    "consulting margin", "small business", "startup finance", "unit economics", "pricing strategy",
    "profit per", "margin improvement", "cost reduction", "revenue growth", "expense tracking",
    "financial planning", "business analysis", "profit projection", "margin tracking", "income statement",
    "profit optimization", "pricing calculator", "markup calculator", "gross profit margin", "net profit"
  ];

  const longTailKeywords = [
    "free profit margin calculator online",
    "how to calculate gross profit margin",
    "profit margin vs markup calculator",
    "gross profit percentage calculator",
    "free online tool to calculate business profit",
    "what is a good profit margin for small business",
    "profit margin calculator for retail store",
    "saas gross margin calculator free",
    "restaurant profit margin calculator",
    "ecommerce profit margin analysis tool",
    "how to improve profit margins in manufacturing",
    "calculate markup and margin in one tool",
    "free financial calculator for entrepreneurs",
    "profit margin benchmark by industry",
    "is my business profitable calculator",
    "gross profit calculator with markup",
    "profit margin and break even analysis",
    "how to calculate net profit margin",
    "contribution margin calculator free",
    "operating profit margin calculator",
    "free tool for small business owners profitability",
    "profit margin calculator no signup",
    "compare profit margins across industries",
    "calculate profit from revenue and cost",
    "markup percentage to margin converter",
    "how much should I charge calculator",
    "pricing calculator based on costs and margin",
    "profit margin for service business",
    "free calculator for consulting firm margins",
    "what profit margin do startups need",
    "unit economics profit margin calculator",
    "how to calculate cogs and gross profit",
    "profit margin for dropshipping business",
    "online store profit margin tool",
    "calculate profit margin for product pricing",
    "free gross margin calculator for ecommerce",
    "profit margin calculator for contractors",
    "margin calculator for freelancers",
    "how to set prices using profit margin",
    "profit margin calculator with industry benchmarks",
    "free tool to analyze business profitability",
    "gross profit vs net profit calculator",
    "profit margin for food business calculator",
    "calculate profit margin for subscription business",
    "margin calculator for b2b services",
    "how to track profit margin over time",
    "profit margin calculator for solopreneurs",
    "free business finance calculator suite",
    "margin and markup difference explained tool",
    "real time profit margin calculator",
    "downloadable profit margin spreadsheet alternative"
  ];

  const allKeywords = [...new Set([...singleKeywords, ...twoWordKeywords, ...longTailKeywords])].join(', ');

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
          content={allKeywords}
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/profit-margin-calculator" />

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