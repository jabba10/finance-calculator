import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './pensionplanningcalculator.module.css';

const PensionPlanningCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('65');
  const [currentSavings, setCurrentSavings] = useState('50000');
  const [monthlyContribution, setMonthlyContribution] = useState('1000');
  const [annualReturn, setAnnualReturn] = useState('7');
  const [inflationRate, setInflationRate] = useState('2.5');
  const [result, setResult] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const ageNow = parseInt(currentAge);
    const ageRetire = parseInt(retirementAge);
    const yearsToRetire = ageRetire - ageNow;

    if (yearsToRetire <= 0) {
      alert("Retirement age must be greater than current age.");
      return;
    }

    const currentSave = parseFloat(currentSavings) || 0;
    const monthly = parseFloat(monthlyContribution);
    const annualRate = parseFloat(annualReturn) / 100;
    const monthlyRate = annualRate / 12;
    const months = yearsToRetire * 12;
    const inflation = parseFloat(inflationRate) / 100;

    let futureValue = currentSave * Math.pow(1 + monthlyRate, months);
    if (monthlyRate > 0 && monthly > 0) {
      futureValue += monthly * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    }

    const inflationAdjusted = futureValue / Math.pow(1 + inflation, yearsToRetire);

    setResult({
      yearsToRetire,
      totalContributions: (currentSave + monthly * months).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      futureValue: futureValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      inflationAdjusted: inflationAdjusted.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      monthlyContribution: monthly.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      annualReturn: parseFloat(annualReturn).toFixed(1),
      inflationRate: parseFloat(inflationRate).toFixed(1),
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
        <title>Pension Planning Calculator | Retirement Savings Tool</title>
        <meta
          name="description"
          content="Free pension calculator to project your retirement savings growth with compound interest, contributions, and inflation adjustment."
        />
        <meta
          name="keywords"
          content="pension calculator, retirement planning, retirement savings, compound growth, retirement fund"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/pension-planning-calculator" />
        <meta property="og:title" content="Pension Planning Calculator - Secure Your Future" />
        <meta
          property="og:description"
          content="Estimate how much you'll have saved by retirement based on contributions, investment returns, and inflation."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/pension-planning-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Pension Calculator</h1>
            <p className={styles.subtitle}>
              Estimate your retirement savings and plan for a secure financial future.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your retirement details to project your pension fund value.
              </p>

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
                  max="99"
                  step="1"
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
                  min="50"
                  max="100"
                  step="1"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="currentSavings" className={styles.label}>
                  Current Savings ($)
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
                />
                <small className={styles.note}>
                  Existing retirement account balance
                </small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="monthlyContribution" className={styles.label}>
                  Monthly Contribution ($)
                </label>
                <input
                  id="monthlyContribution"
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  placeholder="e.g. 1,000"
                  className={styles.input}
                  min="0"
                  step="50"
                  required
                />
              </div>

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
                  max="15"
                  step="0.1"
                  required
                />
                <small className={styles.note}>
                  Average return on investments (e.g. 5–8% for balanced portfolio)
                </small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="inflationRate" className={styles.label}>
                  Inflation Rate (%)
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
                  To adjust future value for purchasing power
                </small>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className={styles.btnText}>Calculate Pension</span>
                <span className={styles.arrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Retirement Projection Results</h3>
                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Years Until Retirement:</strong> {result.yearsToRetire}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Total Contributions:</strong> ${result.totalContributions}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Future Value (Nominal):</strong> ${result.futureValue}
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Future Value (Inflation-Adjusted):</strong> ${result.inflationAdjusted}
                    </div>
                  </div>
                  <div className={styles.note}>
                    By age {retirementAge}, your pension fund could be worth{' '}
                    <strong>${result.inflationAdjusted}</strong> in today’s dollars, assuming a{' '}
                    {result.annualReturn}% return and {result.inflationRate}% inflation.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Pension Planning Matters</h3>
                <p>
                  <strong>Retirement planning</strong> ensures financial independence in your later years. This calculator helps you estimate how much you’ll have saved by retirement, accounting for contributions, investment growth, and inflation.
                </p>

                <h4>How to Use This Calculator</h4>
                <ul className={styles.list}>
                  <li><strong>Current Age:</strong> Your present age</li>
                  <li><strong>Retirement Age:</strong> When you plan to stop working</li>
                  <li><strong>Current Savings:</strong> Amount already saved in retirement accounts</li>
                  <li><strong>Monthly Contribution:</strong> How much you save each month</li>
                  <li><strong>Annual Return:</strong> Expected average investment return</li>
                  <li><strong>Inflation Rate:</strong> Expected average inflation (default: 2.5%)</li>
                  <li>Click "Calculate Pension" to see your projected retirement fund</li>
                </ul>

                <h4>Formula Used</h4>
                <div className={styles.formula}>
                  <code>FV = PV(1+r)ⁿ + PMT × [((1+r)ⁿ - 1)/r] × (1+r)</code>
                </div>
                <p>Where:</p>
                <ul className={styles.list}>
                  <li><strong>FV</strong> = Future Value of pension</li>
                  <li><strong>PV</strong> = Present value (current savings)</li>
                  <li><strong>PMT</strong> = Monthly contribution</li>
                  <li><strong>r</strong> = Monthly interest rate</li>
                  <li><strong>n</strong> = Number of months until retirement</li>
                  <li><strong>Inflation Adjustment:</strong> FV / (1 + inflation)^(years)</li>
                </ul>
                <p>
                  <strong>Example:</strong> Age 30, saving $1,000/month, $50K saved, 7% return, 2.5% inflation
                  <br />
                  → Future Value: ~$1.8M → Inflation-Adjusted: ~$860K (in today’s dollars)
                </p>

                <h4>Interpreting Your Results</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Savings Goal</th>
                      <th>Target Value (Today's $)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Basic Lifestyle</td>
                      <td>$500K – $750K</td>
                    </tr>
                    <tr>
                      <td>Comfortable Retirement</td>
                      <td>$750K – $1.5M</td>
                    </tr>
                    <tr>
                      <td>Luxury/Early Retirement</td>
                      <td>$1.5M+</td>
                    </tr>
                  </tbody>
                </table>

                <h4>Retirement Income Rule of Thumb</h4>
                <p>
                  The <strong>4% Rule</strong> suggests you can safely withdraw 4% of your retirement fund annually without running out.
                </p>
                <ul className={styles.list}>
                  <li>If you have <strong>$1,000,000</strong>, you can withdraw <strong>$40,000/year</strong></li>
                  <li>If you need <strong>$60,000/year</strong>, aim for a fund of <strong>$1.5 million</strong></li>
                </ul>

                <h4>Tips to Boost Your Pension</h4>
                <ul className={styles.list}>
                  <li>✅ <strong>Start early</strong> — compound interest works best over time</li>
                  <li>✅ <strong>Increase contributions annually</strong> — even 1% raises help</li>
                  <li>✅ <strong>Maximize tax-advantaged accounts</strong> — 401(k), IRA, Roth, etc.</li>
                  <li>✅ <strong>Diversify investments</strong> — balance risk and return</li>
                  <li>✅ <strong>Review plan yearly</strong> — adjust for life changes</li>
                </ul>

                <h4>Advanced Planning Tips</h4>
                <ul className={styles.list}>
                  <li><strong>Use Real vs Nominal Returns:</strong> Subtract inflation from return for real growth</li>
                  <li><strong>Sequence of Returns Risk:</strong> Poor early returns hurt more</li>
                  <li><strong>Healthcare & Long-Term Care:</strong> Plan for rising medical costs</li>
                  <li><strong>Social Security:</strong> Coordinate withdrawals with pension income</li>
                  <li><strong>Required Minimum Distributions (RMDs):</strong> Know when you must withdraw</li>
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

export default PensionPlanningCalculator;