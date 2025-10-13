import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import Link from 'next/link';
import styles from './compoundinterestcalculator.module.css';

const CompoundInterestCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [years, setYears] = useState('');
  const [compounding, setCompounding] = useState('12');
  const [result, setResult] = useState(null);

  const parseNumber = (input) => {
    if (!input) return NaN;
    const match = input.toString().replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const p = parseNumber(principal);
    const r = parseNumber(interestRate);
    const t = parseNumber(years);
    const n = parseNumber(compounding);

    if (isNaN(p) || isNaN(r) || isNaN(t) || isNaN(n)) {
      setResult(null);
      return;
    }

    const amount = p * Math.pow(1 + r / 100 / n, n * t);
    const interest = amount - p;

    setResult({
      principal: p.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      rate: r.toFixed(2),
      years: t,
      compounding: n,
      amount: amount.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      interest: interest.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      growth: ((amount / p - 1) * 100).toFixed(2)
    });
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

  return (
    <>
      <Helmet>
        <title>Compound Interest Calculator | See How Your Money Grows Over Time</title>
        <meta
          name="description"
          content="Calculate future investment value with compound interest. See how your money grows based on principal, rate, time, and compounding frequency."
        />
        <meta
          name="keywords"
          content="compound interest calculator, investment growth, future value calculator, Rule of 72"
        />
        <meta property="og:title" content="Compound Interest Calculator" />
        <meta
          property="og:description"
          content="See how your money can grow over time with the power of compound interest."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className={styles.container}>
        {/* Spacer for Navbar */}
        <div className={styles.spacerTop}></div>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Compound Interest Calculator</h1>
          <p className={styles.subtitle}>
            See how your money can grow over time with the power of compound interest.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your investment details to calculate future value.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="principal" className={styles.label}>
                  Initial Investment ($)
                </label>
                <input
                  id="principal"
                  type="text"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  placeholder="e.g. 10,000 or $10K"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="interestRate" className={styles.label}>
                  Annual Interest Rate (%)
                </label>
                <input
                  id="interestRate"
                  type="text"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="e.g. 5 or 7.5"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="years" className={styles.label}>
                  Time Period (years)
                </label>
                <input
                  id="years"
                  type="text"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  placeholder="e.g. 10 or 20"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="compounding" className={styles.label}>
                  Compounding Frequency
                </label>
                <select
                  id="compounding"
                  value={compounding}
                  onChange={(e) => setCompounding(e.target.value)}
                  className={styles.input}
                >
                  <option value="1">Annually</option>
                  <option value="2">Semi-Annually</option>
                  <option value="4">Quarterly</option>
                  <option value="12">Monthly</option>
                  <option value="365">Daily</option>
                </select>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span>Calculate Growth</span>
                <span className={styles.arrow}>→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Investment Summary</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Initial Investment:</strong> ${result.principal}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Annual Rate:</strong> {result.rate}%
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Time Period:</strong> {result.years} years
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Compounding:</strong> {result.compounding}x/year
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Future Value:</strong> ${result.amount}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Interest Earned:</strong> ${result.interest}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Total Growth:</strong> {result.growth}%
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>The Power of Compound Interest</h3>
            <p>
              <strong>Compound interest</strong> is interest calculated on the initial principal and also on the accumulated interest of previous periods. Over time, this leads to exponential growth of your investment.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li>
                <strong>Initial Investment:</strong> Your starting amount (principal)
              </li>
              <li>
                <strong>Annual Interest Rate:</strong> Expected annual return rate
              </li>
              <li>
                <strong>Time Period:</strong> Number of years your money will grow
              </li>
              <li>
                <strong>Compounding Frequency:</strong> How often interest is calculated and added
              </li>
            </ul>

            <h4>Formulas Used</h4>
            <div className={styles.formula}>
              <code>A = P (1 + r/n)^(nt)</code>
              <p>Where:</p>
              <ul className={styles.list}>
                <li>A = Future value of investment</li>
                <li>P = Principal investment amount</li>
                <li>r = Annual interest rate (decimal)</li>
                <li>n = Number of compounding periods per year</li>
                <li>t = Time money is invested for (years)</li>
              </ul>
            </div>

            <h4>The Rule of 72</h4>
            <p>To estimate how long it takes to double your money:</p>
            <div className={styles.formula}>
              <code>Years to double = 72 ÷ Interest Rate</code>
            </div>
            <p>
              <strong>Example:</strong> At 6% interest, your money doubles in about 12 years (72 ÷ 6 = 12).
            </p>

            <h4>Investment Strategies</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Start early</strong> - Time is your greatest ally in compounding</li>
              <li>✅ <strong>Invest regularly</strong> - Consistent contributions amplify growth</li>
              <li>✅ <strong>Reinvest dividends</strong> - Let your earnings generate more earnings</li>
              <li>✅ <strong>Minimize fees</strong> - High fees can significantly reduce long-term gains</li>
            </ul>
          </div>
        </section>

        {/* CTA Section — Fixed for Next.js 13+ */}
        <section className={styles.ctaSection}>
          <h2>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
          <p>Free Financial Planning Tools – Try Now</p>
          <Link
            href="/suite"
            className={styles.ctaButton}
            ref={ctaButtonRef}
            onMouseMove={handleMouseMove}
          >
            <span>Discover More Calculators</span>
            <span className={styles.arrow}>→</span>
          </Link>
        </section>

        {/* Spacer for Footer */}
        <div className={styles.spacerBottom}></div>
      </div>
    </>
  );
};

export default CompoundInterestCalculator;