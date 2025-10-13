import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './artc.module.css';

const AccountsReceivableTurnoverCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [inputs, setInputs] = useState({
    netCreditSales: '500000',
    beginningReceivables: '50000',
    endingReceivables: '70000'
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateARTurnover = () => {
    const netCreditSales = parseFloat(inputs.netCreditSales);
    const beginning = parseFloat(inputs.beginningReceivables);
    const ending = parseFloat(inputs.endingReceivables);

    if (isNaN(netCreditSales) || isNaN(beginning) || isNaN(ending)) {
      alert("Please enter valid numbers for all fields.");
      return;
    }

    if (netCreditSales < 0 || beginning < 0 || ending < 0) {
      alert("Values cannot be negative.");
      return;
    }

    // Average Accounts Receivable
    const averageReceivables = (beginning + ending) / 2;

    // Avoid division by zero
    if (averageReceivables === 0) {
      alert("Average receivables cannot be zero.");
      return;
    }

    // Accounts Receivable Turnover Ratio
    const turnover = netCreditSales / averageReceivables;

    // Average Collection Period (in days)
    const collectionPeriod = 365 / turnover;

    setResult({
      netCreditSales: netCreditSales.toLocaleString(),
      beginning: beginning.toLocaleString(),
      ending: ending.toLocaleString(),
      averageReceivables: averageReceivables.toFixed(2),
      turnover: turnover.toFixed(2),
      collectionPeriod: collectionPeriod.toFixed(1)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateARTurnover();
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
        <title>Accounts Receivable Turnover Calculator | A/R Efficiency Tool</title>
        <meta
          name="description"
          content="Free accounts receivable turnover calculator to measure how efficiently your business collects customer payments and manages credit."
        />
        <meta
          name="keywords"
          content="AR turnover calculator, accounts receivable ratio, collection period, credit sales, financial efficiency tool"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/accounts-receivable-turnover-calculator" />
        <meta property="og:title" content="Accounts Receivable Turnover Calculator - Measure Collections" />
        <meta
          property="og:description"
          content="Calculate your AR turnover ratio and average collection period to improve cash flow and credit management."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/accounts-receivable-turnover-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Accounts Receivable Turnover Calculator</h1>
            <p className={styles.subtitle}>
              Measure how efficiently your business collects customer payments.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your credit sales and receivables to assess collection efficiency.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="netCreditSales" className={styles.label}>
                  Net Credit Sales ($)
                </label>
                <input
                  type="number"
                  id="netCreditSales"
                  name="netCreditSales"
                  value={inputs.netCreditSales}
                  onChange={handleChange}
                  placeholder="e.g. 500,000"
                  step="100"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="beginningReceivables" className={styles.label}>
                  Beginning A/R ($)
                </label>
                <input
                  type="number"
                  id="beginningReceivables"
                  name="beginningReceivables"
                  value={inputs.beginningReceivables}
                  onChange={handleChange}
                  placeholder="e.g. 50,000"
                  step="100"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="endingReceivables" className={styles.label}>
                  Ending A/R ($)
                </label>
                <input
                  type="number"
                  id="endingReceivables"
                  name="endingReceivables"
                  value={inputs.endingReceivables}
                  onChange={handleChange}
                  placeholder="e.g. 70,000"
                  step="100"
                  required
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.ctaButton}>
                <span className={styles.btnText}>Calculate A/R Turnover</span>
                <span className={styles.btnArrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Accounts Receivable Efficiency</h3>
                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Net Credit Sales:</strong> ${result.netCreditSales}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Avg. Receivables:</strong> ${result.averageReceivables}
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Turnover Ratio:</strong> {result.turnover}x
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Avg. Collection:</strong> {result.collectionPeriod} days
                    </div>
                  </div>
                  <div className={styles.note}>
                    A higher turnover ratio means faster collections. Compare to industry benchmarks.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why A/R Turnover Matters</h3>
                <p>
                  The <strong>Accounts Receivable Turnover Ratio</strong> measures how efficiently a company collects cash from customers who buy on credit. A high turnover indicates strong collections, while a low ratio may signal cash flow problems or credit risk.
                </p>

                <h4>How to Use This Calculator</h4>
                <p>
                  Enter your <strong>annual net credit sales</strong>, <strong>beginning accounts receivable</strong>, and <strong>ending accounts receivable</strong>. The tool calculates:
                </p>
                <ul className={styles.list}>
                  <li><strong>Turnover Ratio:</strong> How many times A/R is collected per year</li>
                  <li><strong>Average Collection Period:</strong> Average days to collect payment</li>
                </ul>

                <h4>The Formulas</h4>
                <div className={styles.formula}>
                  <code>Average A/R = (Beginning + Ending) / 2</code>
                </div>
                <div className={styles.formula}>
                  <code>A/R Turnover = Net Credit Sales / Average A/R</code>
                </div>
                <div className={styles.formula}>
                  <code>Avg Collection Period = 365 / Turnover</code>
                </div>
                <p>Where:</p>
                <ul className={styles.list}>
                  <li><strong>Net Credit Sales:</strong> Sales on credit, net of returns</li>
                  <li><strong>Average A/R:</strong> Mean receivables over the period</li>
                  <li><strong>365:</strong> Days in a year (use 360 for some industries)</li>
                </ul>

                <h4>Real-World Applications</h4>
                <ul className={styles.list}>
                  <li><strong>Cash Flow Management:</strong> Predict incoming cash</li>
                  <li><strong>Credit Policy:</strong> Evaluate if terms are too lenient</li>
                  <li><strong>Performance Benchmarking:</strong> Compare to industry averages</li>
                  <li><strong>Investor Reporting:</strong> Show operational efficiency</li>
                </ul>

                <h4>What's a Good Ratio?</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Turnover Ratio</th>
                      <th>Interpretation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>10+</td>
                      <td>Excellent — fast collections (retail, services)</td>
                    </tr>
                    <tr>
                      <td>5–10</td>
                      <td>Good — typical for B2B businesses</td>
                    </tr>
                    <tr>
                      <td>1–5</td>
                      <td>Low — may need process improvements</td>
                    </tr>
                  </tbody>
                </table>

                <h4>Example</h4>
                <p>
                  A company with $500,000 in credit sales and average receivables of $60,000 has a turnover of <strong>8.33x</strong>. This means it collects its receivables <strong>8.3 times per year</strong>, or every <strong>44 days</strong> on average.
                </p>

                <h4>Improving A/R Turnover</h4>
                <ul className={styles.list}>
                  <li>✅ Send invoices promptly after delivery</li>
                  <li>✅ Offer early payment discounts (e.g., 2/10 net 30)</li>
                  <li>✅ Follow up on overdue accounts systematically</li>
                  <li>✅ Tighten credit approval for new customers</li>
                  <li>✅ Use automated billing and reminder systems</li>
                  <li>✅ Require deposits for large orders</li>
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
                  className={styles.ctaButtonLink}
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

export default AccountsReceivableTurnoverCalculator;