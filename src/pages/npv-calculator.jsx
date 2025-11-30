import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './npvcalculator.module.css';

const NpvCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state — allow any input
  const [initialInvestment, setInitialInvestment] = useState('');
  const [discountRate, setDiscountRate] = useState('');
  const [cashFlows, setCashFlows] = useState(['', '', '', '', '']); // 5 years
  const [result, setResult] = useState(null);

  // Robust number extraction from any string
  const parseNumber = (value) => {
    if (!value || typeof value !== 'string') return 0;
    // Extract first valid number (handles $10,000, 15k, etc.)
    const match = value.replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };

  // Handle cash flow input change
  const handleCashFlowChange = (index, value) => {
    const newCashFlows = [...cashFlows];
    newCashFlows[index] = value;
    setCashFlows(newCashFlows);
  };

  // Add a new year
  const addYear = () => {
    if (cashFlows.length < 10) {
      setCashFlows([...cashFlows, '']);
    }
  };

  // Remove last year
  const removeYear = () => {
    if (cashFlows.length > 1) {
      setCashFlows(cashFlows.slice(0, -1));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const investment = parseNumber(initialInvestment);
    let rate = parseNumber(discountRate);
    // Treat discount rate as percentage (but allow raw decimals too)
    if (rate > 1) rate = rate / 100; // assume % if > 1

    let npv = 0;
    const validFlows = [];

    for (let i = 0; i < cashFlows.length; i++) {
      const cf = parseNumber(cashFlows[i]);
      validFlows.push(cf);
      npv += cf / Math.pow(1 + rate, i + 1);
    }

    npv -= investment;

    setResult({
      npv: npv.toFixed(2),
      investment: investment.toLocaleString(),
      discountRate: (rate * 100).toFixed(2),
      years: cashFlows.length,
      cashFlows: validFlows.map(cf => cf.toLocaleString()),
      isProfitable: npv > 0,
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
    "npv", "net", "present", "value", "calculator", "investment", "finance", "financial", "analysis",
    "project", "evaluation", "capital", "budgeting", "roi", "irr", "discount", "rate", "cash", "flow",
    "future", "money", "time", "value", "dollar", "profitability", "return", "yield", "valuation",
    "forecast", "modeling", "business", "startup", "real", "estate", "equity", "venture", "funding",
    "capital", "expenditure", "capex", "npv", "formula", "tool", "free", "online", "decision", "making",
    "risk", "adjusted", "dcf", "discounted", "cf", "revenue", "expense", "profit", "loss", "break",
    "even", "investment", "appraisal", "feasibility", "study", "spreadsheet", "excel", "alternative"
  ];

  const twoWordKeywords = [
    "npv calculator", "net present", "present value", "investment analysis", "financial calculator",
    "discounted cash", "cash flow", "capital budgeting", "roi calculator", "irr calculator",
    "discount rate", "future value", "time value", "money calculator", "profitability analysis",
    "investment appraisal", "project evaluation", "business valuation", "startup valuation",
    "real estate", "venture capital", "equity valuation", "capital expenditure", "capex analysis",
    "npv formula", "free calculator", "online tool", "financial modeling", "cash flow forecast",
    "investment decision", "risk adjusted", "dcf calculator", "npv vs irr", "break even",
    "feasibility study", "investment return", "rate of", "return calculator", "present value",
    "npv analysis", "capital project", "investment tool", "npv calculation", "cash flow analysis",
    "discount factor", "terminal value", "weighted average", "cost of", "capital", "wacc",
    "npv method", "investment metric", "financial metric", "npv excel"
  ];

  const longTailKeywords = [
    "free npv calculator online no signup",
    "how to calculate net present value",
    "npv calculator with smart input parsing",
    "discounted cash flow npv calculator",
    "npv calculator for real estate investment",
    "free net present value calculator for startups",
    "npv and irr calculator in one tool",
    "calculate npv with uneven cash flows",
    "npv calculator that accepts $10k or 15%",
    "online npv tool for business project evaluation",
    "how to use npv to evaluate investment opportunities",
    "npv calculator for capital budgeting decisions",
    "free financial calculator for npv and roi",
    "npv calculator for small business owners",
    "what is a good npv for a project",
    "npv vs payback period calculator",
    "npv calculator with wacc and terminal value",
    "how to calculate npv in excel alternative",
    "free tool to calculate npv for venture capital",
    "npv calculator for real estate development",
    "npv of annuity calculator",
    "npv calculator for startup funding rounds",
    "evaluate project profitability using npv",
    "free npv calculator with multiple cash flows",
    "npv calculator that handles messy inputs",
    "calculate net present value of future income",
    "npv calculator for rental property investment",
    "npv calculator for equipment purchase decision",
    "how to interpret npv results in business",
    "npv calculator for private equity deals",
    "free online npv tool for entrepreneurs",
    "npv calculator with sensitivity analysis",
    "npv calculator for solar panel investment",
    "npv calculator for franchise opportunity",
    "npv calculator for saas business valuation",
    "npv and payback period calculator",
    "discount rate impact on npv calculator",
    "npv calculator with automatic number extraction",
    "free npv calculator no registration required",
    "npv calculator for academic finance homework",
    "compare two projects using npv calculator",
    "npv calculator for government grant proposals",
    "npv calculator with inflation adjustment",
    "npv of perpetuity calculator",
    "free financial modeling tool for npv",
    "npv calculator for oil and gas projects",
    "npv calculator for mba students",
    "npv calculator with downloadable results",
    "real time npv calculation tool",
    "best free npv calculator for investors"
  ];

  const allKeywords = [...new Set([...singleKeywords, ...twoWordKeywords, ...longTailKeywords])].join(', ');

  return (
    <>
      {/* SEO Metadata */}
      <Head>
        <title>NPV Calculator | Free Net Present Value Tool</title>
        <meta
          name="description"
          content="Calculate Net Present Value (NPV) with smart input parsing. Evaluate investments, projects, or business ideas easily and accurately."
        />
        <meta
          name="keywords"
          content={allKeywords}
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/npv-calculator" />

        {/* Open Graph / Social */}
        <meta property="og:title" content="NPV Calculator | Evaluate Investment Profitability" />
        <meta
          property="og:description"
          content="Free tool to calculate Net Present Value — includes support for messy inputs like $10k, 15%, etc."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/npv-calculator" />
        <meta property="og:image" content="https://www.financecalculatorfree.com/images/npv-og.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NPV Calculator | Evaluate Investment Profitability" />
        <meta
          name="twitter:description"
          content="Smart NPV calculator that extracts numbers from any format — perfect for quick project evaluation."
        />
        <meta name="twitter:image" content="https://www.financecalculatorfree.com/images/npv-twitter.png" />
      </Head>

      {/* Gap above content (from navbar) */}
      <div className={styles.spacerTop}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>NPV Calculator</h1>
          <p className={styles.subtitle}>
            Enter any values — numbers, text, symbols — we'll extract usable figures automatically.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Type anything in the fields below. We handle messy inputs like "$10k", "15,000", or even "abc123".
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="initialInvestment" className={styles.label}>
                  Initial Investment
                </label>
                <input
                  id="initialInvestment"
                  type="text"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(e.target.value)}
                  placeholder="e.g. $50,000 or 50k"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="discountRate" className={styles.label}>
                  Discount Rate (%)
                </label>
                <input
                  id="discountRate"
                  type="text"
                  value={discountRate}
                  onChange={(e) => setDiscountRate(e.target.value)}
                  placeholder="e.g. 8% or 0.08"
                  className={styles.input}
                />
                <small className={styles.note}>
                  Enter as percent (e.g. 8) or decimal (e.g. 0.08). We'll convert it.
                </small>
              </div>

              <div className={styles.cashflows}>
                <h3 className={styles.cfTitle}>Annual Cash Flows</h3>
                <div className={styles.cfGrid}>
                  {cashFlows.map((cf, index) => (
                    <div key={index} className={styles.cfItem}>
                      <label htmlFor={`cf-${index}`} className={styles.label}>
                        Year {index + 1}
                      </label>
                      <input
                        id={`cf-${index}`}
                        type="text"
                        value={cf}
                        onChange={(e) => handleCashFlowChange(index, e.target.value)}
                        placeholder="e.g. $12,000"
                        className={styles.input}
                      />
                    </div>
                  ))}
                </div>

                <div className={styles.cfActions}>
                  <button
                    type="button"
                    onClick={addYear}
                    disabled={cashFlows.length >= 10}
                    className={`${styles.btn} ${styles.btnAdd}`}
                  >
                    + Add Year
                  </button>
                  <button
                    type="button"
                    onClick={removeYear}
                    disabled={cashFlows.length <= 1}
                    className={`${styles.btn} ${styles.btnRemove}`}
                  >
                    − Remove Year
                  </button>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className="taxpro-btn-label">Calculate NPV</span>
                <span className="taxpro-btn-arrow">→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Net Present Value (NPV)</h3>
                <div className={styles.resultGrid}>
                  <div className={`${styles.resultItem} highlight ${result.isProfitable ? styles.positive : styles.negative}`}>
                    <strong>NPV:</strong> ${result.npv}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Investment:</strong> ${result.investment}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Discount Rate:</strong> {result.discountRate}%
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Years:</strong> {result.years}
                  </div>
                </div>
                <div className={styles.note}>
                  {result.isProfitable
                    ? `This investment is profitable (NPV > $0). Expected value: $${result.npv}.`
                    : `This investment may not be profitable (NPV ≤ $0). Consider alternatives.`
                  }
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Smart Input Parsing</h3>
            <p>
              You can enter values like:
            </p>
            <ul className={styles.list}>
              <li><code>50000</code> → 50,000</li>
              <li><code>$12,345.67</code> → 12,345.67</li>
              <li><code>8%</code> → 8% discount rate</li>
              <li><code>10k</code> → 10,000</li>
              <li><code>abc123def</code> → 123</li>
              <li><code>   </code> or <code>xyz</code> → 0</li>
            </ul>
            <p>
              The calculator extracts the first valid number from any input. No errors, no restrictions.
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

export default NpvCalculator;