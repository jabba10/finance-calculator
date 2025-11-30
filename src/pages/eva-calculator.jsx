import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './evacalculator.module.css';

const EvaCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [nopat, setNopat] = useState('');
  const [capital, setCapital] = useState('');
  const [wacc, setWacc] = useState('');
  const [result, setResult] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const profit = parseFloat(nopat);
    const investedCapital = parseFloat(capital);
    const costOfCapital = parseFloat(wacc); // % value

    if (
      isNaN(profit) ||
      isNaN(investedCapital) ||
      isNaN(costOfCapital) ||
      investedCapital <= 0 ||
      costOfCapital < 0 ||
      costOfCapital > 100
    ) {
      alert("Please enter valid positive numbers. WACC must be between 0 and 100.");
      return;
    }

    // Convert WACC to decimal
    const waccDecimal = costOfCapital / 100;

    // EVA = NOPAT - (Invested Capital × WACC)
    const eva = profit - investedCapital * waccDecimal;
    const evaFormatted = eva.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const isValueCreating = eva > 0;

    setResult({
      nopat: profit.toLocaleString(),
      capital: investedCapital.toLocaleString(),
      wacc: costOfCapital.toFixed(2),
      eva: evaFormatted,
      isValueCreating,
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
    "eva", "economic", "value", "added", "calculator", "nopat", "wacc", "capital", "profit", "profitability",
    "shareholder", "value", "roi", "roic", "finance", "financial", "analysis", "metrics", "performance", "cfo",
    "ceo", "investor", "equity", "debt", "cost", "of", "capital", "hurdle", "rate", "economic", "profit", "valuation",
    "business", "valuation", "corporate", "finance", "free", "online", "tool", "cash", "flow", "free", "cash", "flow",
    "npv", "irr", "discounted", "cash", "flow", "ebit", "earnings", "before", "interest", "tax", "financial", "modeling",
    "executive", "compensation", "incentives", "m&a", "mergers", "acquisitions", "division", "performance", "asset",
    "efficiency", "return", "investment", "capital", "efficiency", "book", "value", "market", "value", "value", "creation"
  ];

  const twoWordKeywords = [
    "eva calculator", "economic value", "value added", "nopat calculation", "wacc calculator", "cost capital",
    "capital efficiency", "shareholder value", "economic profit", "financial metrics", "performance metric", "cfo tool",
    "ceo dashboard", "investor analysis", "equity cost", "debt cost", "hurdle rate", "business valuation", "corporate finance",
    "free calculator", "online tool", "cash flow", "free cash", "npv analysis", "irr calculation", "ebit margin",
    "return investment", "roic ratio", "division performance", "m&a analysis", "merger evaluation", "acquisition value",
    "asset turnover", "capital structure", "value creation", "value destruction", "profit analysis", "economic return",
    "capital charge", "weighted average", "average cost", "cost capital", "financial modeling", "executive incentive",
    "performance bonus", "economic value", "added metric"
  ];

  const longTailKeywords = [
    "free eva calculator online no signup",
    "how to calculate economic value added",
    "eva calculator for business valuation",
    "economic value added formula calculator",
    "calculate eva from nopat and wacc",
    "eva calculator for investors and analysts",
    "what is a good eva for a company",
    "free tool to measure shareholder value creation",
    "eva vs net income calculator",
    "calculate true economic profit with eva",
    "eva calculator for cfo financial reporting",
    "economic value added for executive compensation",
    "eva calculator with wacc and nopat inputs",
    "free eva tool for mba students",
    "how to improve eva for your business",
    "eva calculator for division performance",
    "calculate eva for mergers and acquisitions",
    "free online eva calculator for startups",
    "eva calculator with roic and npv context",
    "economic value added benchmark by industry",
    "eva calculator for asset-heavy companies",
    "how amazon and coca cola use eva",
    "free eva calculator for financial modeling",
    "eva vs roi vs roic comparison tool",
    "calculate cost of capital for eva",
    "eva calculator for private equity firms",
    "free tool to assess value creation or destruction",
    "eva calculator for business school projects",
    "downloadable eva spreadsheet alternative",
    "real time economic value added calculator",
    "eva calculator for executive incentive plans",
    "how to explain eva to board members",
    "eva calculator with free cash flow integration",
    "calculate eva after tax operating profit",
    "eva calculator for manufacturing businesses",
    "free financial metric calculator suite eva",
    "eva calculator for saas and tech companies",
    "how eva aligns management with shareholder value",
    "eva calculator with sensitivity analysis",
    "free tool to evaluate capital allocation efficiency"
  ];

  const allKeywords = [...new Set([...singleKeywords, ...twoWordKeywords, ...longTailKeywords])].join(', ');

  return (
    <>
      {/* SEO Metadata */}
      <Head>
        <title>EVA Calculator | Free Economic Value Added Tool</title>
        <meta
          name="description"
          content="Calculate Economic Value Added (EVA) to measure true profitability after cost of capital. See if your business creates or destroys shareholder value."
        />
        <meta
          name="keywords"
          content={allKeywords}
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/eva-calculator" />

        {/* Open Graph / Social */}
        <meta property="og:title" content="EVA Calculator | Measure True Business Profitability" />
        <meta
          property="og:description"
          content="Free tool to calculate EVA — a superior metric that accounts for cost of capital and true economic profit."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/eva-calculator" />
        <meta property="og:image" content="https://www.financecalculatorfree.com/images/eva-og.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="EVA Calculator | Measure True Business Profitability" />
        <meta
          name="twitter:description"
          content="See if your company is truly profitable after accounting for the cost of capital using our free EVA calculator."
        />
        <meta name="twitter:image" content="https://www.financecalculatorfree.com/images/eva-twitter.png" />
      </Head>

      {/* Gap above content (from navbar) */}
      <div className={styles.spacerTop}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>EVA Calculator</h1>
          <p className={styles.subtitle}>
            Calculate Economic Value Added (EVA) to measure true economic profit after cost of capital.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter NOPAT, invested capital, and WACC to calculate Economic Value Added.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="nopat" className={styles.label}>
                  NOPAT ($)
                </label>
                <input
                  id="nopat"
                  type="text"
                  value={nopat}
                  onChange={(e) => setNopat(e.target.value)}
                  placeholder="e.g. 250,000"
                  className={styles.input}
                  required
                />
                <small className={styles.note}>
                  Net Operating Profit After Tax — profit after taxes but before interest.
                </small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="capital" className={styles.label}>
                  Invested Capital ($)
                </label>
                <input
                  id="capital"
                  type="text"
                  value={capital}
                  onChange={(e) => setCapital(e.target.value)}
                  placeholder="e.g. 1,200,000"
                  className={styles.input}
                  required
                />
                <small className={styles.note}>
                  Total capital invested in the business (equity + debt).
                </small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="wacc" className={styles.label}>
                  WACC (%)
                </label>
                <input
                  id="wacc"
                  type="number"
                  value={wacc}
                  onChange={(e) => setWacc(e.target.value)}
                  placeholder="e.g. 8.5"
                  className={styles.input}
                  min="0"
                  max="100"
                  step="0.1"
                  required
                />
                <small className={styles.note}>
                  Weighted Average Cost of Capital — your required rate of return.
                </small>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className="taxpro-btn-label">Calculate EVA</span>
                <span className="taxpro-btn-arrow">→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Economic Value Added (EVA)</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>NOPAT:</strong> ${result.nopat}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Capital:</strong> ${result.capital}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>WACC:</strong> {result.wacc}%
                  </div>
                  <div className={`${styles.resultItem} highlight ${result.isValueCreating ? styles.positive : styles.negative}`}>
                    <strong>EVA:</strong> ${result.eva}
                  </div>
                </div>
                <div className={styles.note}>
                  {result.isValueCreating
                    ? `Your company is creating economic value. Every dollar invested earns more than the cost of capital.`
                    : `Negative EVA means your company is destroying value. Consider improving efficiency or reducing capital.`
                  }
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why EVA Matters</h3>
            <p>
              <strong>Economic Value Added (EVA)</strong> measures the true economic profit of a company after accounting for the cost of capital. Unlike accounting profit, EVA answers: <strong>"Are we earning more than our investors expect?"</strong>
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li><strong>NOPAT:</strong> Net Operating Profit After Tax (EBIT × (1 − Tax Rate)).</li>
              <li><strong>Invested Capital:</strong> Total capital used in operations (equity + debt).</li>
              <li><strong>WACC:</strong> Weighted Average Cost of Capital (your hurdle rate).</li>
              <li>Click “Calculate EVA” to see if your business is creating or destroying value.</li>
            </ul>

            <h4>Formula Used</h4>
            <div className={styles.formula}>
              <code>EVA = NOPAT − (Invested Capital × WACC)</code>
            </div>
            <p>
              <strong>Example:</strong> NOPAT = $250,000, Capital = $1.2M, WACC = 8.5% →
              <br />
              Cost of Capital = 1,200,000 × 0.085 = $102,000
              <br />
              EVA = 250,000 − 102,000 = <strong>$148,000</strong> → <strong>Value Created</strong>
            </p>

            <h4>Interpreting the Results</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>EVA Result</th>
                  <th>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>EVA {'>'} $0</td>
                  <td>✅ Creating value — returns exceed cost of capital</td>
                </tr>
                <tr>
                  <td>EVA = $0</td>
                  <td>⚠️ Breaking even — returns equal cost of capital</td>
                </tr>
                <tr>
                  <td>EVA {'<'} $0</td>
                  <td>❌ Destroying value — returns below required return</td>
                </tr>
              </tbody>
            </table>

            <h4>Real-World Applications</h4>
            <ul className={styles.list}>
              <li><strong>Executives:</strong> Evaluate performance beyond net income</li>
              <li><strong>Investors:</strong> Compare companies on true profitability</li>
              <li><strong>Managers:</strong> Incentivize value-creating decisions</li>
              <li><strong>M&A:</strong> Assess if an acquisition will add value</li>
              <li><strong>Divisions:</strong> Measure performance of business units</li>
            </ul>

            <h4>Tips to Improve EVA</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Increase NOPAT</strong> via pricing, cost control, or sales growth</li>
              <li>✅ <strong>Reduce invested capital</strong> by selling unused assets or improving turnover</li>
              <li>✅ <strong>Optimize capital structure</strong> to lower WACC (but avoid excessive debt)</li>
              <li>✅ <strong>Exit low-return projects</strong> that drag down EVA</li>
              <li>✅ <strong>Focus on high-margin, high-turnover businesses</strong></li>
            </ul>

            <h4>Advantages Over Net Income</h4>
            <p>
              EVA is superior to net income because it:
            </p>
            <ul className={styles.list}>
              <li>✅ Accounts for the <strong>cost of equity</strong> (not just debt)</li>
              <li>✅ Encourages efficient use of <strong>capital</strong></li>
              <li>✅ Aligns management incentives with <strong>shareholder value</strong></li>
              <li>✅ Prevents false profits from <strong>over-investment</strong></li>
            </ul>
            <p>
              Companies like <strong>Coca-Cola</strong> and <strong>Amazon</strong> use EVA to guide strategic decisions.
            </p>

            <h4>Limitations of EVA</h4>
            <ul className={styles.list}>
              <li>❌ Requires accurate WACC estimation</li>
              <li>❌ Can be complex to calculate for divisions</li>
              <li>❌ May discourage long-term R&D investments</li>
              <li>❌ Less useful for asset-light or startup companies</li>
            </ul>
            <p>
              Use EVA alongside <strong>ROIC</strong>, <strong>Free Cash Flow</strong>, and <strong>NPV</strong> for best results.
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

export default EvaCalculator;