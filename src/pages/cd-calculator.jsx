import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './cdcalculator.module.css';

const CdCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [initialDeposit, setInitialDeposit] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [termYears, setTermYears] = useState('');
  const [compoundFrequency, setCompoundFrequency] = useState('monthly');
  const [result, setResult] = useState(null);

  // Compound frequency mapping
  const frequencyMap = {
    annually: 1,
    semiannually: 2,
    quarterly: 4,
    monthly: 12,
    daily: 365,
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const principal = parseFloat(initialDeposit.replace(/,/g, ''));
    const rate = parseFloat(interestRate);
    const years = parseFloat(termYears);
    const n = frequencyMap[compoundFrequency];

    if (
      isNaN(principal) || 
      isNaN(rate) || 
      isNaN(years) || 
      principal <= 0 || 
      rate < 0 || 
      years <= 0
    ) {
      alert("Please enter valid positive values.");
      return;
    }

    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const amount = principal * Math.pow(1 + (rate / 100) / n, n * years);
    const interestEarned = amount - principal;

    // Effective APY: (1 + r/n)^n - 1 → annualized yield
    const apy = (((amount / principal) ** (1 / years) - 1) * 100).toFixed(2);

    setResult({
      principal: principal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      maturity: amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      interest: interestEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      apy,
    });
  };

  // Magnetic cursor effect for CTA button
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
        <title>CD Calculator | Calculate CD Maturity & Interest</title>
        <meta
          name="description"
          content="Free CD calculator to project your certificate of deposit maturity value, interest earned, and effective APY with compound interest."
        />
        <meta
          name="keywords"
          content="cd calculator, certificate of deposit, compound interest, apy calculator, savings calculator"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/cd-calculator" />
        <meta property="og:title" content="CD Calculator - Project Your CD Growth" />
        <meta
          property="og:description"
          content="See how much your CD will earn over time with compounding. Compare rates and terms easily."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/cd-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>CD Calculator</h1>
            <p className={styles.subtitle}>
              Calculate your CD's maturity value and interest earned with compound interest.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your CD details to calculate maturity value and total interest.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="initialDeposit" className={styles.label}>
                  Initial Deposit ($)
                </label>
                <input
                  id="initialDeposit"
                  type="text"
                  value={initialDeposit}
                  onChange={(e) => setInitialDeposit(e.target.value)}
                  placeholder="e.g. 10,000"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="interestRate" className={styles.label}>
                  Annual Interest Rate (%)
                </label>
                <input
                  id="interestRate"
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="e.g. 4.5"
                  className={styles.input}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="termYears" className={styles.label}>
                  Term (Years)
                </label>
                <input
                  id="termYears"
                  type="number"
                  value={termYears}
                  onChange={(e) => setTermYears(e.target.value)}
                  placeholder="e.g. 3"
                  className={styles.input}
                  min="0.5"
                  step="0.5"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="compoundFrequency" className={styles.label}>
                  Compounding Frequency
                </label>
                <select
                  id="compoundFrequency"
                  value={compoundFrequency}
                  onChange={(e) => setCompoundFrequency(e.target.value)}
                  className={styles.input}
                >
                  <option value="annually">Annually</option>
                  <option value="semiannually">Semi-Annually</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="monthly">Monthly</option>
                  <option value="daily">Daily</option>
                </select>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className={styles.btnText}>Calculate CD Value</span>
                <span className={styles.arrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>CD Maturity Summary</h3>
                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Initial Deposit:</strong> ${result.principal}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Maturity Value:</strong> ${result.maturity}
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Interest Earned:</strong> ${result.interest}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Effective APY:</strong> {result.apy}%
                    </div>
                  </div>
                  <div className={styles.note}>
                    Your CD will grow to <strong>${result.maturity}</strong> after the term, earning{' '}
                    <strong>${result.interest}</strong> in interest. The effective yield is {result.apy}% due to compounding.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why a CD Calculator Matters</h3>
                <p>
                  A <strong>CD (Certificate of Deposit)</strong> is a low-risk savings tool that offers a fixed interest rate for a set term. This calculator helps you project how much your money will grow, so you can{' '}
                  <strong>compare CD offers, plan savings goals, and maximize returns</strong>.
                </p>

                <h4>How to Use This Calculator</h4>
                <ul className={styles.list}>
                  <li><strong>Initial Deposit:</strong> How much you're investing (minimums vary by bank).</li>
                  <li><strong>Interest Rate:</strong> The APY or nominal rate offered by the bank.</li>
                  <li><strong>Term:</strong> Length of the CD (3 months to 5+ years).</li>
                  <li><strong>Compounding:</strong> How often interest is added (monthly is common).</li>
                  <li>Click “Calculate” to see your maturity value and total interest.</li>
                </ul>

                <h4>Formula Used: Compound Interest</h4>
                <div className={styles.formula}>
                  <code>A = P × (1 + r/n)^(nt)</code>
                </div>
                <p>Where:</p>
                <ul className={styles.list}>
                  <li><strong>A</strong> = Maturity Value</li>
                  <li><strong>P</strong> = Principal (initial deposit)</li>
                  <li><strong>r</strong> = Annual interest rate (as decimal)</li>
                  <li><strong>n</strong> = Compounding periods per year</li>
                  <li><strong>t</strong> = Time in years</li>
                </ul>
                <p>
                  <strong>Example:</strong> $10,000 at 4.5% for 3 years, compounded monthly →
                  <br />
                  A = 10,000 × (1 + 0.045/12)<sup>36</sup> ≈ <strong>$11,432.57</strong>
                </p>

                <h4>Current CD Rate Benchmarks (2024)</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Term</th>
                      <th>Average Rate</th>
                      <th>Top Rates (High-Yield)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>6 months</td>
                      <td>4.0% – 4.5%</td>
                      <td>5.0%+</td>
                    </tr>
                    <tr>
                      <td>1 year</td>
                      <td>4.5% – 5.0%</td>
                      <td>5.5%+</td>
                    </tr>
                    <tr>
                      <td>3 years</td>
                      <td>4.2% – 4.8%</td>
                      <td>5.2%+</td>
                    </tr>
                    <tr>
                      <td>5 years</td>
                      <td>4.0% – 4.6%</td>
                      <td>5.0%+</td>
                    </tr>
                  </tbody>
                </table>

                <h4>Tips to Maximize CD Returns</h4>
                <ul className={styles.list}>
                  <li>✅ <strong>Shop around</strong> — online banks often offer higher rates</li>
                  <li>✅ <strong>Consider bump-up CDs</strong> — option to increase rate if rates rise</li>
                  <li>✅ <strong>Use CD ladders</strong> — stagger maturities for flexibility and yield</li>
                  <li>✅ <strong>Check for early withdrawal penalties</strong> — avoid costly fees</li>
                  <li>✅ <strong>Reinvest interest</strong> — let compounding work over time</li>
                </ul>

                <h4>CDs vs. Other Savings Options</h4>
                <ul className={styles.list}>
                  <li><strong>Savings Accounts:</strong> Lower rate, but fully liquid</li>
                  <li><strong>Money Market Accounts:</strong> Slightly higher rate, check-writing access</li>
                  <li><strong>Treasuries:</strong> Tax advantages, very safe, competitive yields</li>
                  <li><strong>Stock Market:</strong> Higher potential return, but high risk</li>
                </ul>
                <p>
                  CDs are ideal for <strong>short-to-medium-term financial goals</strong> where safety and predictable growth matter most.
                </p>
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

export default CdCalculator;