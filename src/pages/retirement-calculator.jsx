import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './retirementcalculator.module.css';

const RetirementCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('65');
  const [currentSavings, setCurrentSavings] = useState('50000');
  const [annualContribution, setAnnualContribution] = useState('10000');
  const [employerMatch, setEmployerMatch] = useState('3');
  const [matchLimit, setMatchLimit] = useState('6');
  const [annualReturn, setAnnualReturn] = useState('7');
  const [inflationRate, setInflationRate] = useState('3');
  const [result, setResult] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const age = parseInt(currentAge);
    const retireAge = parseInt(retirementAge);
    const savings = parseFloat(currentSavings);
    const contribution = parseFloat(annualContribution);
    const match = parseFloat(employerMatch) / 100;
    const limit = parseFloat(matchLimit) / 100;
    const returnRate = parseFloat(annualReturn) / 100;
    const inflation = parseFloat(inflationRate) / 100;

    const yearsToRetire = retireAge - age;

    if (yearsToRetire <= 0) {
      alert("Retirement age must be greater than current age.");
      return;
    }

    // Employer match capped at contribution × match limit
    const effectiveMatch = Math.min(contribution * match, contribution * limit);
    const totalAnnualContribution = contribution + effectiveMatch;

    // Future value with annual contributions and compound growth
    let futureValue = savings;
    for (let i = 0; i < yearsToRetire; i++) {
      futureValue = (futureValue + totalAnnualContribution) * (1 + returnRate);
    }

    // Inflation-adjusted (real) value
    const realValue = futureValue / Math.pow(1 + inflation, yearsToRetire);

    // Sustainable withdrawal: using real return (after inflation)
    const realReturn = (1 + returnRate) / (1 + inflation) - 1;
    const monthlyWithdrawal = (futureValue * realReturn) / 12;

    setResult({
      yearsToRetire,
      totalContributions: (totalAnnualContribution * yearsToRetire).toFixed(2),
      employerMatchTotal: (effectiveMatch * yearsToRetire).toFixed(2),
      futureValue: futureValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      realValue: realValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      monthlyWithdrawal: monthlyWithdrawal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      annualReturn: (returnRate * 100).toFixed(2),
      inflationAdjustedReturn: (realReturn * 100).toFixed(2)
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
        <title>401(k) Retirement Calculator | Plan Your Retirement Savings</title>
        <meta
          name="description"
          content="Calculate how your 401(k) will grow over time. Includes employer match, compound growth, and inflation adjustment."
        />
        <meta
          name="keywords"
          content="retirement calculator, 401k calculator, retirement planning, compound growth, employer match"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/retirement-calculator" />
        <meta property="og:title" content="401(k) Retirement Calculator" />
        <meta
          property="og:description"
          content="See how much your retirement savings could grow with consistent contributions and compound interest."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/retirement-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>401(k) Retirement Calculator</h1>
            <p className={styles.subtitle}>
              Plan your retirement savings and see how your 401(k) could grow over time.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your current retirement savings details.
              </p>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="currentAge" className={styles.label}>
                    Current Age
                  </label>
                  <input
                    id="currentAge"
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(e.target.value)}
                    className={styles.input}
                    min="18"
                    max="100"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="retirementAge" className={styles.label}>
                    Retirement Age
                  </label>
                  <input
                    id="retirementAge"
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(e.target.value)}
                    className={styles.input}
                    min="18"
                    max="100"
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="currentSavings" className={styles.label}>
                  Current 401(k) Savings ($)
                </label>
                <input
                  id="currentSavings"
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(e.target.value)}
                  placeholder="e.g. 50,000"
                  className={styles.input}
                  min="0"
                  step="1000"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="annualContribution" className={styles.label}>
                  Annual Contribution ($)
                </label>
                <input
                  id="annualContribution"
                  type="number"
                  value={annualContribution}
                  onChange={(e) => setAnnualContribution(e.target.value)}
                  placeholder="e.g. 10,000"
                  className={styles.input}
                  min="0"
                  step="1000"
                  required
                />
                <small className={styles.note}>
                  Your personal contribution (not including employer match)
                </small>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="employerMatch" className={styles.label}>
                    Employer Match (%)
                  </label>
                  <input
                    id="employerMatch"
                    type="number"
                    value={employerMatch}
                    onChange={(e) => setEmployerMatch(e.target.value)}
                    className={styles.input}
                    min="0"
                    max="100"
                    step="0.1"
                    required
                  />
                  <small className={styles.note}>
                    Employer contribution percentage
                  </small>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="matchLimit" className={styles.label}>
                    Match Limit (% of salary)
                  </label>
                  <input
                    id="matchLimit"
                    type="number"
                    value={matchLimit}
                    onChange={(e) => setMatchLimit(e.target.value)}
                    className={styles.input}
                    min="0"
                    max="100"
                    step="0.1"
                    required
                  />
                  <small className={styles.note}>
                    Maximum % of salary employer will match
                  </small>
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="annualReturn" className={styles.label}>
                    Expected Annual Return (%)
                  </label>
                  <input
                    id="annualReturn"
                    type="number"
                    value={annualReturn}
                    onChange={(e) => setAnnualReturn(e.target.value)}
                    className={styles.input}
                    min="0"
                    max="20"
                    step="0.1"
                    required
                  />
                  <small className={styles.note}>
                    Historical average: 7–10%
                  </small>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="inflationRate" className={styles.label}>
                    Expected Inflation Rate (%)
                  </label>
                  <input
                    id="inflationRate"
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(e.target.value)}
                    className={styles.input}
                    min="0"
                    max="10"
                    step="0.1"
                    required
                  />
                  <small className={styles.note}>
                    Long-term average: ~3%
                  </small>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className={styles.btnText}>Calculate Retirement</span>
                <span className={styles.arrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Retirement Projection</h3>
                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Years Until Retirement:</strong> {result.yearsToRetire}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Total Contributions:</strong> ${parseFloat(result.totalContributions).toLocaleString()}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Employer Match Total:</strong> ${parseFloat(result.employerMatchTotal).toLocaleString()}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Projected Annual Return:</strong> {result.annualReturn}%
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Inflation-Adjusted Return:</strong> {result.inflationAdjustedReturn}%
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Projected 401(k) Balance:</strong> ${result.futureValue}
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Inflation-Adjusted Value:</strong> ${result.realValue}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Est. Monthly Withdrawal*:</strong> ${result.monthlyWithdrawal}
                    </div>
                  </div>
                  <div className={styles.note}>
                    *Assuming you withdraw only the investment returns ({result.annualReturn}% annually) while preserving principal.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Retirement Planning Matters</h3>
                <p>
                  A <strong>401(k) retirement plan</strong> is one of the most powerful tools for building long-term wealth. This calculator helps you understand how consistent contributions, employer matching, and compound growth can significantly impact your retirement savings over time.
                </p>

                <h4>How to Use This Calculator</h4>
                <ul className={styles.list}>
                  <li><strong>Current Age & Retirement Age:</strong> Determines your investment time horizon</li>
                  <li><strong>Current Savings:</strong> Your existing 401(k) balance</li>
                  <li><strong>Annual Contribution:</strong> Your yearly contribution (not including employer match)</li>
                  <li><strong>Employer Match:</strong> Your employer's matching contribution percentage</li>
                  <li><strong>Match Limit:</strong> Maximum percentage of your salary your employer will match</li>
                  <li><strong>Annual Return:</strong> Expected average annual investment return (7–10% is typical for stocks)</li>
                  <li><strong>Inflation Rate:</strong> Expected long-term inflation rate (~3% historical average)</li>
                </ul>

                <h4>Key Retirement Concepts</h4>
                <div className={styles.conceptGrid}>
                  <div className={styles.conceptCard}>
                    <h5>Compound Growth</h5>
                    <p>Your money grows exponentially as earnings generate their own earnings over time.</p>
                  </div>
                  <div className={styles.conceptCard}>
                    <h5>Employer Matching</h5>
                    <p>Free money from your employer — always contribute enough to get the full match.</p>
                  </div>
                  <div className={styles.conceptCard}>
                    <h5>Tax Advantages</h5>
                    <p>Traditional 401(k): tax-deferred growth. Roth 401(k): tax-free withdrawals.</p>
                  </div>
                  <div className={styles.conceptCard}>
                    <h5>Inflation Impact</h5>
                    <p>Your money loses purchasing power over time — investments should outpace inflation.</p>
                  </div>
                </div>

                <h4>Formula Used</h4>
                <div className={styles.formula}>
                  <code>FV = (P × (1+r)ⁿ) + [C × ((1+r)ⁿ - 1)/r]</code>
                </div>
                <p>Where:</p>
                <ul className={styles.list}>
                  <li><strong>P</strong> = current savings</li>
                  <li><strong>C</strong> = annual contribution</li>
                  <li><strong>r</strong> = annual return rate</li>
                  <li><strong>n</strong> = years until retirement</li>
                </ul>

                <h4>Contribution Benchmarks</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Age Group</th>
                      <th>Recommended Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>30 years old</td>
                      <td>1× annual salary saved</td>
                    </tr>
                    <tr>
                      <td>40 years old</td>
                      <td>3× annual salary saved</td>
                    </tr>
                    <tr>
                      <td>50 years old</td>
                      <td>6× annual salary saved</td>
                    </tr>
                    <tr>
                      <td>60 years old</td>
                      <td>8× annual salary saved</td>
                    </tr>
                  </tbody>
                </table>

                <h4>Retirement Savings Tips</h4>
                <ul className={styles.list}>
                  <li>✅ <strong>Start early</strong> — Time is your greatest ally in compounding</li>
                  <li>✅ <strong>Maximize employer match</strong> — It's essentially free money</li>
                  <li>✅ <strong>Increase contributions annually</strong> — Aim for 15–20% of income</li>
                  <li>✅ <strong>Diversify investments</strong> — Balance stocks and bonds appropriately</li>
                  <li>✅ <strong>Review regularly</strong> — Adjust as your situation changes</li>
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

export default RetirementCalculator;