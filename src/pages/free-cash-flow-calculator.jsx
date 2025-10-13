import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './freecashflowcalculator.module.css';

const FreeCashFlowCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [revenue, setRevenue] = useState('');
  const [cogs, setCogs] = useState('');
  const [operatingExpenses, setOperatingExpenses] = useState('');
  const [depreciation, setDepreciation] = useState('10000');
  const [interest, setInterest] = useState('5000');
  const [taxRate, setTaxRate] = useState('25');
  const [result, setResult] = useState(null);

  // Helper: Extract first number from any string
  const parseNumber = (input) => {
    if (!input) return NaN;
    const match = input.toString().replace(/,/g, '').match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(null);

    const rev = Math.max(0, parseNumber(revenue) || 0);
    const c = Math.max(0, parseNumber(cogs) || 0);
    const opex = Math.max(0, parseNumber(operatingExpenses) || 0);
    const dep = Math.max(0, parseNumber(depreciation) || 0);
    const int = Math.max(0, parseNumber(interest) || 0);
    const taxPercent = Math.max(0, Math.min(100, parseNumber(taxRate) || 0));
    const taxRateDecimal = taxPercent / 100;

    if (rev === 0) {
      alert("Please enter a valid revenue amount greater than zero.");
      return;
    }

    const grossProfit = rev - c;
    const ebit = grossProfit - opex - dep;
    const ebt = ebit - int;
    const taxes = ebt > 0 ? ebt * taxRateDecimal : 0;
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
      taxRate: taxPercent.toFixed(2)
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
        <title>Free Cash Flow Calculator | Operating Cash Flow Tool</title>
        <meta
          name="description"
          content="Calculate your business's operating cash flow with this free tool. Estimate OCF from revenue, COGS, expenses, and taxes."
        />
        <meta
          name="keywords"
          content="cash flow calculator, operating cash flow, OCF, net income, depreciation, business finance tools"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/free-cash-flow-calculator" />
        <meta property="og:title" content="Free Cash Flow Calculator - Business Liquidity Tool" />
        <meta
          property="og:description"
          content="Estimate your company's operating cash flow to assess financial health and liquidity."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/free-cash-flow-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Cash Flow Calculator</h1>
            <p className={styles.subtitle}>
              Estimate your business's operating cash flow to assess financial health and liquidity.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your income and expenses — we extract numbers from any format (e.g., $500K, 200K COGS, tax: 25%).
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="revenue" className={styles.label}>
                  Total Revenue ($)
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

              <div className={styles.inputGroup}>
                <label htmlFor="cogs" className={styles.label}>
                  Cost of Goods Sold (COGS) ($)
                </label>
                <input
                  id="cogs"
                  type="text"
                  value={cogs}
                  onChange={(e) => setCogs(e.target.value)}
                  placeholder="e.g. $200,000 or 200K"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="operatingExpenses" className={styles.label}>
                  Operating Expenses ($)
                </label>
                <input
                  id="operatingExpenses"
                  type="text"
                  value={operatingExpenses}
                  onChange={(e) => setOperatingExpenses(e.target.value)}
                  placeholder="e.g. $100,000 or 100K"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="depreciation" className={styles.label}>
                  Depreciation ($)
                </label>
                <input
                  id="depreciation"
                  type="text"
                  value={depreciation}
                  onChange={(e) => setDepreciation(e.target.value)}
                  placeholder="e.g. 10,000 or 10K"
                  className={styles.input}
                />
                <small className={styles.note}>Non-cash expense added back to cash flow</small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="interest" className={styles.label}>
                  Interest Expense ($)
                </label>
                <input
                  id="interest"
                  type="text"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  placeholder="e.g. 5,000 or 5K"
                  className={styles.input}
                />
                <small className={styles.note}>Pre-tax interest cost</small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="taxRate" className={styles.label}>
                  Tax Rate (%)
                </label>
                <input
                  id="taxRate"
                  type="text"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  placeholder="e.g. 25 or 25%"
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className={styles.btnText}>Calculate Cash Flow</span>
                <span className={styles.arrow}>→</span>
              </button>

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
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Cash Flow Matters</h3>
                <p>
                  <strong>Operating Cash Flow (OCF)</strong> measures the actual cash a business generates from its core operations. Unlike net income, it accounts for non-cash expenses like depreciation and is a key indicator of{' '}
                  <strong>liquidity, sustainability, and financial health</strong>.
                </p>

                <h4>How to Use This Calculator</h4>
                <ul className={styles.list}>
                  <li><strong>Revenue:</strong> Total sales or income from operations</li>
                  <li><strong>COGS:</strong> Direct costs of producing goods or services</li>
                  <li><strong>Operating Expenses:</strong> Rent, salaries, marketing, etc.</li>
                  <li><strong>Depreciation:</strong> Non-cash expense; added back to net income</li>
                  <li><strong>Interest:</strong> Cost of debt financing (affects taxable income)</li>
                  <li><strong>Tax Rate:</strong> Effective corporate tax rate (we extract numbers from any format)</li>
                  <li>Enter values freely — we extract numbers from text, symbols, and units</li>
                  <li>Click "Calculate Cash Flow" to see your operating cash flow</li>
                </ul>

                <h4>Formula Used</h4>
                <div className={styles.formula}>
                  <code>OCF = Net Income + Depreciation</code>
                </div>
                <p>Where:</p>
                <ul className={styles.list}>
                  <li><strong>Net Income</strong> = (Revenue - COGS - OpEx - Depreciation - Interest) × (1 - Tax Rate)</li>
                  <li><strong>Depreciation</strong> is added back because it’s a non-cash expense</li>
                </ul>
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
                      <td>20–40%</td>
                    </tr>
                    <tr>
                      <td>Retail</td>
                      <td>5–10%</td>
                    </tr>
                    <tr>
                      <td>Manufacturing</td>
                      <td>10–15%</td>
                    </tr>
                    <tr>
                      <td>Restaurants</td>
                      <td>3–8%</td>
                    </tr>
                    <tr>
                      <td>Construction</td>
                      <td>5–12%</td>
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
            </div>
          </section>

          {/* CTA Section */}
          <section className={styles.ctaSection}>
            <div className={styles.ctaSectionInner}>
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
            </div>
          </section>

          {/* Footer Spacer */}
          <div className={styles.footerSpacer} />
        </div>
      </div>
    </>
  );
};

export default FreeCashFlowCalculator;