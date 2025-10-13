import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './taxbracketcalculator.module.css';

const TaxBracketCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [income, setIncome] = useState('');
  const [filingStatus, setFilingStatus] = useState('single');
  const [result, setResult] = useState(null);

  // 2024 U.S. Federal Tax Brackets
  const taxBrackets = {
    single: [
      { rate: 0.10, min: 0, max: 11600 },
      { rate: 0.12, min: 11601, max: 47150 },
      { rate: 0.22, min: 47151, max: 100525 },
      { rate: 0.24, min: 100526, max: 191950 },
      { rate: 0.32, min: 191951, max: 243725 },
      { rate: 0.35, min: 243726, max: 609350 },
      { rate: 0.37, min: 609351, max: Infinity }
    ],
    married: [
      { rate: 0.10, min: 0, max: 23200 },
      { rate: 0.12, min: 23201, max: 94300 },
      { rate: 0.22, min: 94301, max: 201050 },
      { rate: 0.24, min: 201051, max: 383900 },
      { rate: 0.32, min: 383901, max: 487450 },
      { rate: 0.35, min: 487451, max: 731200 },
      { rate: 0.37, min: 731201, max: Infinity }
    ],
    hoh: [
      { rate: 0.10, min: 0, max: 16550 },
      { rate: 0.12, min: 16551, max: 59950 },
      { rate: 0.22, min: 59951, max: 100500 },
      { rate: 0.24, min: 100501, max: 191950 },
      { rate: 0.32, min: 191951, max: 243700 },
      { rate: 0.35, min: 243701, max: 609350 },
      { rate: 0.37, min: 609351, max: Infinity }
    ]
  };

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

    // Parse income
    const incomeValue = Math.max(0, parseNumber(income) || 0);
    if (incomeValue === 0) {
      alert("Please enter a valid positive income amount.");
      return;
    }

    const brackets = taxBrackets[filingStatus];
    let taxOwed = 0;
    let breakdown = [];
    let marginalRate = 0;

    for (let bracket of brackets) {
      if (incomeValue >= bracket.min) {
        const taxableInBracket = Math.min(incomeValue, bracket.max) - bracket.min + 1;
        const taxInBracket = taxableInBracket * bracket.rate;
        taxOwed += taxInBracket;
        breakdown.push({
          rate: (bracket.rate * 100).toFixed(1),
          amount: taxableInBracket.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          tax: taxInBracket.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        });
        if (incomeValue <= bracket.max) {
          marginalRate = bracket.rate * 100;
        }
      }
    }

    const effectiveRate = (taxOwed / incomeValue) * 100;

    setResult({
      income: incomeValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      taxOwed: taxOwed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      effectiveRate: effectiveRate.toFixed(2),
      marginalRate: marginalRate.toFixed(1),
      breakdown
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
        <title>Tax Bracket Calculator | 2024 Federal Income Tax Estimator</title>
        <meta
          name="description"
          content="Free tax bracket calculator to estimate your federal income tax, effective rate, and marginal tax bracket based on filing status and income."
        />
        <meta
          name="keywords"
          content="tax bracket calculator, federal tax, income tax, marginal tax rate, effective tax rate, tax planning"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/tax-bracket-calculator" />
        <meta property="og:title" content="Tax Bracket Calculator - Estimate Your Taxes" />
        <meta
          property="og:description"
          content="Calculate your federal tax liability, effective rate, and marginal bracket for 2024."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/tax-bracket-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Tax Bracket Calculator</h1>
            <p className={styles.subtitle}>
              Estimate your federal income tax, effective rate, and marginal tax bracket.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your annual income — we extract numbers from any format (e.g., $85K, 100,000).
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="income" className={styles.label}>
                  Annual Income ($)
                </label>
                <input
                  id="income"
                  type="text"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="e.g. $85,000 or 85K"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="filingStatus" className={styles.label}>
                  Filing Status
                </label>
                <select
                  id="filingStatus"
                  value={filingStatus}
                  onChange={(e) => setFilingStatus(e.target.value)}
                  className={styles.input}
                >
                  <option value="single">Single</option>
                  <option value="married">Married Filing Jointly</option>
                  <option value="hoh">Head of Household</option>
                </select>
              </div>

              <button type="submit" className={styles.ctaButton}>
                <span className={styles.btnText}>Calculate Tax</span>
                <span className={styles.btnArrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Tax Calculation Results</h3>
                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Taxable Income:</strong> ${result.income}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Federal Tax Owed:</strong> ${result.taxOwed}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Effective Tax Rate:</strong> {result.effectiveRate}%
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Marginal Tax Rate:</strong> {result.marginalRate}%
                    </div>
                  </div>

                  <h4 className={styles.breakdownTitle}>Tax Breakdown by Bracket</h4>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Rate</th>
                        <th>Taxable Amount</th>
                        <th>Tax</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.breakdown.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.rate}%</td>
                          <td>${item.amount}</td>
                          <td>${item.tax}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className={styles.note}>
                    You're in the <strong>{result.marginalRate}% marginal bracket</strong>, but your average (effective) rate is{' '}
                    <strong>{result.effectiveRate}%</strong>.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Tax Bracket Awareness Matters</h3>
                <p>
                  Understanding your <strong>tax bracket</strong> helps you make smarter financial decisions. It clarifies how much of your next dollar earned will be taxed and reveals opportunities for{' '}
                  <strong>tax optimization</strong>.
                </p>

                <h4>How to Use This Calculator</h4>
                <ul className={styles.list}>
                  <li><strong>Annual Income:</strong> Your gross taxable income (before deductions)</li>
                  <li><strong>Filing Status:</strong> Single, Married, or Head of Household</li>
                  <li>Enter any format — we extract numbers from text, symbols, and units</li>
                  <li>Click "Calculate Tax" to see your tax owed, effective rate, and marginal rate</li>
                  <li>Review the breakdown to see how much you pay in each bracket</li>
                </ul>

                <h4>Formula Used</h4>
                <div className={styles.formula}>
                  <code>Total Tax = Σ (Taxable Amount in Bracket × Bracket Rate)</code>
                </div>
                <p>Where:</p>
                <ul className={styles.list}>
                  <li><strong>Tax Brackets:</strong> Progressive rates increase with income</li>
                  <li><strong>Effective Rate:</strong> Total Tax / Taxable Income</li>
                  <li><strong>Marginal Rate:</strong> Rate on the last dollar earned</li>
                </ul>
                <p>
                  <strong>Example:</strong> $85,000 income (Single) → Taxed at 10%, 12%, and 22% brackets
                  <br />
                  → Total Tax: ~$15,300 → Effective Rate: ~18% → Marginal Rate: 22%
                </p>

                <h4>2024 U.S. Federal Tax Brackets</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Rate</th>
                      <th>Single</th>
                      <th>Married</th>
                      <th>Head of Household</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>10%</td><td>$0 – $11,600</td><td>$0 – $23,200</td><td>$0 – $16,550</td></tr>
                    <tr><td>12%</td><td>$11,601 – $47,150</td><td>$23,201 – $94,300</td><td>$16,551 – $59,950</td></tr>
                    <tr><td>22%</td><td>$47,151 – $100,525</td><td>$94,301 – $201,050</td><td>$59,951 – $100,500</td></tr>
                    <tr><td>24%</td><td>$100,526 – $191,950</td><td>$201,051 – $383,900</td><td>$100,501 – $191,950</td></tr>
                    <tr><td>32%</td><td>$191,951 – $243,725</td><td>$383,901 – $487,450</td><td>$191,951 – $243,700</td></tr>
                    <tr><td>35%</td><td>$243,726 – $609,350</td><td>$487,451 – $731,200</td><td>$243,701 – $609,350</td></tr>
                    <tr><td>37%</td><td>$609,351+</td><td>$731,201+</td><td>$609,351+</td></tr>
                  </tbody>
                </table>

                <h4>Key Concepts</h4>
                <ul className={styles.list}>
                  <li><strong>Marginal Tax Rate:</strong> The rate you pay on the next dollar earned</li>
                  <li><strong>Effective Tax Rate:</strong> Average rate across all income</li>
                  <li><strong>Progressive System:</strong> Higher income = higher rate only on that portion</li>
                  <li><strong>Tax Deductions:</strong> Reduce taxable income (e.g. 401(k), IRA, standard deduction)</li>
                  <li><strong>Tax Credits:</strong> Direct reduction in tax owed (e.g. Child Tax Credit)</li>
                </ul>

                <h4>Tax Planning Tips</h4>
                <ul className={styles.list}>
                  <li>✅ <strong>Maximize retirement accounts</strong> — defer income to lower brackets later</li>
                  <li>✅ <strong>Harvest tax losses</strong> — offset capital gains</li>
                  <li>✅ <strong>Time income and deductions</strong> — shift to optimal years</li>
                  <li>✅ <strong>Consider Roth vs. Traditional</strong> — based on current vs future tax rate</li>
                  <li>✅ <strong>Avoid bracket creep</strong> — small raises may push you into higher marginal rate</li>
                </ul>

                <h4>Advanced Strategies</h4>
                <ul className={styles.list}>
                  <li><strong>Backdoor Roth IRA:</strong> For high earners above income limits</li>
                  <li><strong>Mega Backdoor Roth:</strong> After-tax 401(k) to Roth conversion</li>
                  <li><strong>Charitable Giving:</strong> Bunch donations to exceed standard deduction</li>
                  <li><strong>State Taxes:</strong> Consider low/no-income-tax states in retirement</li>
                  <li><strong>Capital Gains Rates:</strong> 0%, 15%, or 20% — often lower than income rates</li>
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

export default TaxBracketCalculator;