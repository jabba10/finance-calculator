import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './cashflowcal.module.css';

const CashFlowCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [revenue, setRevenue] = useState('');
  const [cogs, setCogs] = useState('');
  const [operatingExpenses, setOperatingExpenses] = useState('');
  const [depreciation, setDepreciation] = useState('10000');
  const [interest, setInterest] = useState('5000');
  const [taxRate, setTaxRate] = useState('25');
  const [result, setResult] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert inputs to numbers and validate
    const rev = parseFloat(revenue);
    const c = parseFloat(cogs);
    const opex = parseFloat(operatingExpenses);
    const dep = parseFloat(depreciation) || 0;
    const int = parseFloat(interest) || 0;
    const tax = parseFloat(taxRate) / 100;

    // Validate inputs
    if (isNaN(rev) || isNaN(c) || isNaN(opex) || isNaN(tax)) {
      alert("Please enter valid numbers in all required fields");
      return;
    }

    if (rev < 0 || c < 0 || opex < 0 || dep < 0 || int < 0 || tax < 0) {
      alert("Values cannot be negative");
      return;
    }

    if (tax > 0.5) {
      alert("Tax rate cannot exceed 50%");
      return;
    }

    // Calculations
    const grossProfit = rev - c;
    const ebit = grossProfit - opex - dep;
    const ebt = ebit - int;
    const taxes = ebt * tax;
    const netIncome = ebt - taxes;
    const operatingCashFlow = netIncome + dep;

    setResult({
      revenue: rev.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      cogs: c.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      operatingExpenses: opex.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      depreciation: dep.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      grossProfit: grossProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      ebit: ebit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      netIncome: netIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      operatingCashFlow: operatingCashFlow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      taxRate: (tax * 100).toFixed(2)
    });
  };

  // Magnetic effect on CTA button
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
      {/* SEO with React Helmet */}
      <Head>
        <title>Cash Flow Calculator | Free Tool to Estimate Operating Cash Flow</title>
        <meta
          name="description"
          content="Use our free cash flow calculator to estimate operating cash flow, assess business liquidity, and improve financial planning."
        />
        <meta
          name="keywords"
          content="cash flow calculator, operating cash flow, business finance, financial calculator, startup tools"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/cashflow-calculator" />

        {/* Open Graph / Social Sharing Metadata */}
        <meta property="og:title" content="Cash Flow Calculator | Financial Health Tool" />
        <meta
          property="og:description"
          content="Calculate your business's operating cash flow quickly and accurately."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/cashflow-calculator" />
        <meta property="og:image" content="https://www.financecalculatorfree.com/images/cashflow-og.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cash Flow Calculator | Financial Health Tool" />
        <meta
          name="twitter:description"
          content="Estimate your operating cash flow and understand your business’s real financial performance."
        />
        <meta name="twitter:image" content="https://www.financecalculatorfree.com/images/cashflow-twitter.png" />
      </Head>

      {/* Spacing above content (gap from navbar) */}
      <div className={styles.spacerTop}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Cash Flow Calculator</h1>
          <p className={styles.subtitle}>
            Estimate your business's operating cash flow to assess financial health and liquidity.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your income and expense details to calculate operating cash flow.
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
                  placeholder="e.g. 500000"
                  className={styles.input}
                  min="0"
                  step="any"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="cogs" className={styles.label}>
                  Cost of Goods Sold (COGS) ($)
                </label>
                <input
                  id="cogs"
                  type="number"
                  value={cogs}
                  onChange={(e) => setCogs(e.target.value)}
                  placeholder="e.g. 200000"
                  className={styles.input}
                  min="0"
                  step="any"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="operatingExpenses" className={styles.label}>
                  Operating Expenses ($)
                </label>
                <input
                  id="operatingExpenses"
                  type="number"
                  value={operatingExpenses}
                  onChange={(e) => setOperatingExpenses(e.target.value)}
                  placeholder="e.g. 100000"
                  className={styles.input}
                  min="0"
                  step="any"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="depreciation" className={styles.label}>
                  Depreciation ($)
                </label>
                <input
                  id="depreciation"
                  type="number"
                  value={depreciation}
                  onChange={(e) => setDepreciation(e.target.value)}
                  className={styles.input}
                  min="0"
                  step="any"
                />
                <small className={styles.note}>Non-cash expense added back to cash flow</small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="interest" className={styles.label}>
                  Interest Expense ($)
                </label>
                <input
                  id="interest"
                  type="number"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className={styles.input}
                  min="0"
                  step="any"
                />
                <small className={styles.note}>Pre-tax interest cost</small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="taxRate" className={styles.label}>
                  Tax Rate (%)
                </label>
                <input
                  id="taxRate"
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className={styles.input}
                  min="0"
                  max="50"
                  step="0.1"
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className="taxpro-btn-label">Calculate Cash Flow</span>
                <span className="taxpro-btn-arrow">→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Operating Cash Flow Results</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Gross Profit:</strong> ${result.grossProfit}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>EBIT:</strong> ${result.ebit}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Net Income:</strong> ${result.netIncome}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Operating Cash Flow:</strong> ${result.operatingCashFlow}
                  </div>
                </div>
                <div className={styles.note}>
                  Your operating cash flow is <strong>${result.operatingCashFlow}</strong>, which reflects the actual cash generated from core operations.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why Cash Flow Matters</h3>
            <p>
              <strong>Operating Cash Flow (OCF)</strong> measures the actual cash a business generates from its core operations. Unlike net income, it accounts for non-cash expenses like depreciation and is a key indicator of <strong>liquidity, sustainability, and financial health</strong>.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li><strong>Revenue:</strong> Total sales or income from operations</li>
              <li><strong>COGS:</strong> Direct costs of producing goods or services</li>
              <li><strong>Operating Expenses:</strong> Rent, salaries, marketing, etc.</li>
              <li><strong>Depreciation:</strong> Non-cash expense; added back to net income</li>
              <li><strong>Interest:</strong> Cost of debt financing (affects taxable income)</li>
              <li><strong>Tax Rate:</strong> Effective corporate tax rate</li>
              <li>Click "Calculate Cash Flow" to see your operating cash flow</li>
            </ul>

            <h4>Formula Used</h4>
            <div className={styles.formula}>
              <code>OCF = Net Income + Depreciation</code>
            </div>
            <p>
              Where:
              <ul className={styles.list}>
                <li><strong>Net Income</strong> = (Revenue - COGS - OpEx - Depreciation - Interest) × (1 - Tax Rate)</li>
                <li><strong>Depreciation</strong> is added back because it's a non-cash expense</li>
              </ul>
            </p>
            <p>
              <strong>Example:</strong> $500K revenue, $200K COGS, $100K OpEx, $10K depreciation, $5K interest, 25% tax
              <br />
              Net Income = ($185K EBT × 0.75) = $138,750 → OCF = $138,750 + $10,000 = <strong>$148,750</strong>
            </p>

            <h4>Interpreting Your Cash Flow</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cash Flow Level</th>
                  <th>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Positive</td>
                  <td>Healthy: Business generates more cash than it spends</td>
                </tr>
                <tr>
                  <td>Zero</td>
                  <td>Break-even: Cash neutral, may need external funding</td>
                </tr>
                <tr>
                  <td>Negative</td>
                  <td>Warning sign: May face liquidity issues or over-leveraging</td>
                </tr>
              </tbody>
            </table>

            <h4>Industry Benchmarks</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Industry</th>
                  <th>Typical OCF Margin</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Software (SaaS)</td>
                  <td>20-40%</td>
                </tr>
                <tr>
                  <td>Retail</td>
                  <td>5-10%</td>
                </tr>
                <tr>
                  <td>Manufacturing</td>
                  <td>10-15%</td>
                </tr>
                <tr>
                  <td>Restaurants</td>
                  <td>3-8%</td>
                </tr>
                <tr>
                  <td>Construction</td>
                  <td>5-12%</td>
                </tr>
              </tbody>
            </table>

            <h4>Tips to Improve Cash Flow</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Speed up receivables</strong> — invoice promptly, offer early payment discounts</li>
              <li>✅ <strong>Delay payables</strong> — negotiate longer payment terms</li>
              <li>✅ <strong>Reduce inventory</strong> — optimize stock levels</li>
              <li>✅ <strong>Cut non-essential costs</strong> — review recurring expenses</li>
              <li>✅ <strong>Lease instead of buy</strong> — preserve capital</li>
            </ul>

            <h4>Advanced Cash Flow Concepts</h4>
            <ul className={styles.list}>
              <li><strong>Free Cash Flow (FCF):</strong> OCF - Capital Expenditures</li>
              <li><strong>Cash Flow Forecasting:</strong> Project future inflows/outflows</li>
              <li><strong>DCF Valuation:</strong> Use OCF to value a business</li>
              <li><strong>Cash Conversion Cycle:</strong> Measures efficiency of cash flow management</li>
            </ul>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaSectionHeading}>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
          <p className={styles.ctaSectionSubtext}>Free Financial Planning Tools – Try Now</p>
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

      {/* Spacing below content (gap before footer) */}
      <div className={styles.spacerBottom}></div>
    </>
  );
};

export default CashFlowCalculator;