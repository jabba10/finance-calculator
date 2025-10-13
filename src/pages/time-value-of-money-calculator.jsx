import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import Link from 'next/link';
import styles from './timevalueofmoneycalculator.module.css';

const TimeValueOfMoneyCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [inputs, setInputs] = useState({
    presentValue: '',
    futureValue: '',
    rate: '',
    years: '',
    compoundFrequency: 'annually'
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const calculateTVM = () => {
    let pv = parseFloat(inputs.presentValue);
    let fv = parseFloat(inputs.futureValue);
    const rate = parseFloat(inputs.rate) / 100;
    const years = parseFloat(inputs.years);
    const frequency = inputs.compoundFrequency;

    if (!rate || !years || (isNaN(pv) && isNaN(fv))) return;

    const n = {
      annually: 1,
      semiannually: 2,
      quarterly: 4,
      monthly: 12,
      weekly: 52,
      daily: 365
    }[frequency];

    let calculatedFV, calculatedPV;

    if (!isNaN(pv)) {
      calculatedFV = pv * Math.pow(1 + rate / n, n * years);
      calculatedPV = pv;
    }

    if (!isNaN(fv)) {
      calculatedPV = fv / Math.pow(1 + rate / n, n * years);
      calculatedFV = fv;
    }

    if (!isNaN(pv) && !isNaN(fv)) {
      calculatedFV = pv * Math.pow(1 + rate / n, n * years);
      calculatedPV = fv / Math.pow(1 + rate / n, n * years);
    }

    setResult({
      presentValue: calculatedPV?.toFixed(2),
      futureValue: calculatedFV?.toFixed(2),
      rate: inputs.rate,
      years,
      frequency
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateTVM();
  };

  const handleMouseMove = (e) => {
    const el = ctaButtonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  const formatFrequency = (freq) => {
    return freq
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace('annually', 'Annually');
  };

  return (
    <>
      <Helmet>
        <title>Time Value of Money Calculator | Present & Future Value</title>
        <meta name="description" content="Calculate present value (PV) and future value (FV) with compound interest. Supports annual, monthly, daily compounding. Free, responsive, professional financial tool." />
        <meta name="keywords" content="time value of money, TVM calculator, present value, future value, compound interest, finance calculator, NPV" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/timevalueofmoneycalculator" />
      </Helmet>

      <div className={styles.page}>
        {/* Gap above content */}
        <div className={styles.spacerTop}></div>

        <div className={styles.contentWrapper}>
          {/* Hero */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Time Value of Money Calculator</h1>
            <p className={styles.subtitle}>
              Calculate present and future value of money with compound interest.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="presentValue" className={styles.label}>Present Value ($)</label>
                <input
                  type="number"
                  id="presentValue"
                  name="presentValue"
                  value={inputs.presentValue}
                  onChange={handleChange}
                  placeholder="e.g. 1000"
                  step="0.01"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="futureValue" className={styles.label}>Future Value ($)</label>
                <input
                  type="number"
                  id="futureValue"
                  name="futureValue"
                  value={inputs.futureValue}
                  onChange={handleChange}
                  placeholder="e.g. 2000"
                  step="0.01"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="rate" className={styles.label}>Annual Interest Rate (%)</label>
                <input
                  type="number"
                  id="rate"
                  name="rate"
                  value={inputs.rate}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  step="0.01"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="years" className={styles.label}>Time Period (Years)</label>
                <input
                  type="number"
                  id="years"
                  name="years"
                  value={inputs.years}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                  step="0.1"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="compoundFrequency" className={styles.label}>Compounding Frequency</label>
                <select
                  id="compoundFrequency"
                  name="compoundFrequency"
                  value={inputs.compoundFrequency}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="annually">Annually</option>
                  <option value="semiannually">Semi-Annually</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="daily">Daily</option>
                </select>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Calculate TVM
                <span className={styles.arrow}>→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Time Value of Money Results</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Present Value:</strong> ${result.presentValue}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Future Value:</strong> ${result.futureValue}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Interest Rate:</strong> {result.rate}%
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Time Period:</strong> {result.years} years
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Compounded:</strong> {formatFrequency(result.frequency)}
                  </div>
                </div>
                <p className={styles.note}>
                  The time value of money shows how money grows (or shrinks) over time due to interest.
                </p>
              </div>
            )}
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Time Value of Money Matters</h3>
                <p>
                  <strong>Time Value of Money (TVM)</strong> is the concept that a dollar today is worth more than a dollar in the future due to its earning potential. This principle is foundational in finance, investing, and retirement planning.
                </p>

                <h4>How to Use This Calculator</h4>
                <p>
                  Enter either the <strong>present value</strong> or <strong>future value</strong> (or both), along with the <strong>interest rate</strong> and <strong>time period</strong>. The calculator uses compound interest to show how money grows or what a future amount is worth today.
                </p>

                <h4>The TVM Formulas</h4>
                <div className={styles.formula}>
                  <code>FV = PV × (1 + r/n)^(nt)</code>
                </div>
                <div className={styles.formula}>
                  <code>PV = FV / (1 + r/n)^(nt)</code>
                </div>
                <p>Where:</p>
                <ul className={styles.list}>
                  <li><strong>FV</strong> = Future Value</li>
                  <li><strong>PV</strong> = Present Value</li>
                  <li><strong>r</strong> = Annual interest rate</li>
                  <li><strong>n</strong> = Number of compounding periods per year</li>
                  <li><strong>t</strong> = Time in years</li>
                </ul>

                <h4>Real-World Applications</h4>
                <ul className={styles.list}>
                  <li><strong>Investing:</strong> Estimate how much $10,000 will grow in 20 years at 7% interest</li>
                  <li><strong>Retirement:</strong> Calculate how much you need to save today to reach $1M</li>
                  <li><strong>Loans:</strong> Understand the true cost of borrowing over time</li>
                  <li><strong>Business Decisions:</strong> Compare project returns using net present value (NPV)</li>
                </ul>

                <h4>Example</h4>
                <p>
                  If you invest <strong>$5,000</strong> at <strong>6% annual interest compounded monthly</strong> for <strong>15 years</strong>, it will grow to <strong>$12,216.09</strong>. This shows the power of compounding.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className={styles.ctaSection}>
            <h2>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
            <p>Free Financial Planning Tools – Try Now</p>
            {/* ✅ Correct Next.js Link — no <a> tag */}
            <Link
              href="/suite"
              className={styles.ctaButton}
              ref={ctaButtonRef}
              onMouseMove={handleMouseMove}
            >
              Explore All Calculators
              <span className={styles.arrow}>→</span>
            </Link>
          </section>
        </div>

        {/* Gap below content */}
        <div className={styles.spacerBottom}></div>
      </div>
    </>
  );
};

export default TimeValueOfMoneyCalculator;