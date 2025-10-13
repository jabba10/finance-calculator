import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import Link from 'next/link';
import styles from './mortgagerefinancebreakevencalculator.module.css';

const MortgageRefinanceBreakEvenCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [inputs, setInputs] = useState({
    currentLoanBalance: '250000',
    currentRate: '6.5',
    newRate: '5.0',
    loanTerm: '30',
    remainingTerm: '25',
    closingCosts: '4000',
    discountPoints: '0'
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateBreakEven = () => {
    const loanBalance = parseFloat(inputs.currentLoanBalance);
    const currentRate = parseFloat(inputs.currentRate) / 100;
    const newRate = parseFloat(inputs.newRate) / 100;
    const termYears = parseInt(inputs.loanTerm);
    const remainingYears = parseInt(inputs.remainingTerm);
    const closingCosts = parseFloat(inputs.closingCosts);
    const discountPoints = parseFloat(inputs.discountPoints);
    const pointsCost = loanBalance * (discountPoints / 100);

    const totalRefinanceCost = closingCosts + pointsCost;

    const r1 = currentRate / 12;
    const r2 = newRate / 12;

    const currentPayment = loanBalance * r1;
    const newPayment = loanBalance * r2;
    const monthlySavings = currentPayment - newPayment;

    if (monthlySavings <= 0) {
      setResult({
        monthlySavings: '0.00',
        totalCost: totalRefinanceCost.toFixed(2),
        breakEvenMonths: '—',
        breakEvenYears: '—',
        recommendation: 'Refinancing is not beneficial — new rate is not lower.'
      });
      return;
    }

    const breakEvenMonths = totalRefinanceCost / monthlySavings;
    const breakEvenYears = breakEvenMonths / 12;

    const recommendation = breakEvenYears < remainingYears
      ? 'Refinancing is recommended — you’ll break even before the loan ends.'
      : 'Refinancing may not be worth it — break-even occurs after loan term.';

    setResult({
      currentPayment: currentPayment.toFixed(2),
      newPayment: newPayment.toFixed(2),
      monthlySavings: monthlySavings.toFixed(2),
      totalCost: totalRefinanceCost.toFixed(2),
      breakEvenMonths: breakEvenMonths.toFixed(1),
      breakEvenYears: breakEvenYears.toFixed(1),
      recommendation
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateBreakEven();
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
        <title>Mortgage Refinance Break-Even Calculator | Free Financial Tool</title>
        <meta
          name="description"
          content="Calculate how long it takes to recover your refinance costs and start saving with our free mortgage refinance break-even calculator."
        />
        <meta
          name="keywords"
          content="mortgage refinance calculator, break even calculator, refinance savings, mortgage calculator"
        />
        <meta property="og:title" content="Mortgage Refinance Break-Even Calculator" />
        <meta
          property="og:description"
          content="Determine your break-even point for refinancing your mortgage."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className={styles.container}>
        {/* Spacer for Navbar */}
        <div className={styles.spacerTop}></div>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Mortgage Refinance Break-Even Calculator</h1>
          <p className={styles.subtitle}>
            Determine how long it takes to recover refinance costs and start saving.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your loan details to calculate your break-even point.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="currentLoanBalance" className={styles.label}>
                  Current Loan Balance ($)
                </label>
                <input
                  type="number"
                  id="currentLoanBalance"
                  name="currentLoanBalance"
                  value={inputs.currentLoanBalance}
                  onChange={handleChange}
                  placeholder="e.g. 250000"
                  step="1000"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="currentRate" className={styles.label}>
                  Current Interest Rate (%)
                </label>
                <input
                  type="number"
                  id="currentRate"
                  name="currentRate"
                  value={inputs.currentRate}
                  onChange={handleChange}
                  placeholder="e.g. 6.5"
                  step="0.01"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="newRate" className={styles.label}>
                  New Interest Rate (%)
                </label>
                <input
                  type="number"
                  id="newRate"
                  name="newRate"
                  value={inputs.newRate}
                  onChange={handleChange}
                  placeholder="e.g. 5.0"
                  step="0.01"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="loanTerm" className={styles.label}>
                  Original Loan Term (Years)
                </label>
                <input
                  type="number"
                  id="loanTerm"
                  name="loanTerm"
                  value={inputs.loanTerm}
                  onChange={handleChange}
                  placeholder="e.g. 30"
                  min="1"
                  max="30"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="remainingTerm" className={styles.label}>
                  Remaining Term (Years)
                </label>
                <input
                  type="number"
                  id="remainingTerm"
                  name="remainingTerm"
                  value={inputs.remainingTerm}
                  onChange={handleChange}
                  placeholder="e.g. 25"
                  min="1"
                  max="30"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="closingCosts" className={styles.label}>
                  Closing Costs ($)
                </label>
                <input
                  type="number"
                  id="closingCosts"
                  name="closingCosts"
                  value={inputs.closingCosts}
                  onChange={handleChange}
                  placeholder="e.g. 4000"
                  step="100"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="discountPoints" className={styles.label}>
                  Discount Points (%)
                </label>
                <input
                  type="number"
                  id="discountPoints"
                  name="discountPoints"
                  value={inputs.discountPoints}
                  onChange={handleChange}
                  placeholder="e.g. 0"
                  step="0.1"
                  className={styles.input}
                />
                <p className={styles.note}>1 point = 1% of loan amount</p>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span>Calculate Break-Even</span>
                <span className={styles.arrow}>→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Refinance Break-Even Analysis</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Current Payment:</strong> ${result.currentPayment}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>New Payment:</strong> ${result.newPayment}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Monthly Savings:</strong> ${result.monthlySavings}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Total Refinance Cost:</strong> ${result.totalCost}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Break-Even:</strong> {result.breakEvenMonths} months
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Or:</strong> {result.breakEvenYears} years
                  </div>
                </div>
                <div className={styles.resultItem}>
                  <strong>Recommendation:</strong> {result.recommendation}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why Break-Even Matters</h3>
            <p>
              <strong>Refinancing your mortgage</strong> can lower your monthly payment, but it comes
              with <strong>upfront costs</strong> (closing fees, points). The{' '}
              <strong>break-even point</strong> tells you how long it takes for your savings to cover
              those costs — helping you decide if refinancing makes financial sense.
            </p>

            <h4>How to Use This Calculator</h4>
            <p>
              Enter your <strong>current loan balance</strong>, <strong>current and new interest rates</strong>,{' '}
              <strong>remaining term</strong>, and <strong>refinance costs</strong> (including discount points). The tool calculates:
            </p>
            <ul className={styles.list}>
              <li><strong>Monthly interest savings</strong></li>
              <li><strong>Total refinance cost</strong></li>
              <li><strong>Break-even time</strong> in months and years</li>
            </ul>

            <h4>The Break-Even Formula</h4>
            <div className={styles.formula}>
              <code>Break-Even (months) = Total Refinance Cost / Monthly Savings</code>
            </div>
            <p>Where:</p>
            <ul className={styles.list}>
              <li><strong>Total Refinance Cost:</strong> Closing costs + Points</li>
              <li><strong>Monthly Savings:</strong> Old payment – New payment</li>
            </ul>

            <h4>Real-World Applications</h4>
            <ul className={styles.list}>
              <li><strong>Rate Drop:</strong> Save when market rates fall</li>
              <li><strong>Term Adjustment:</strong> Switch from 30-year to 15-year</li>
              <li><strong>Cash-Out:</strong> Tap home equity for renovations</li>
              <li><strong>Remove PMI:</strong> Refinance once 20% equity is reached</li>
            </ul>

            <h4>When to Refinance</h4>
            <ul className={styles.list}>
              <li>
                Break-even occurs <strong>before you plan to sell</strong>
              </li>
              <li>
                New rate is <strong>at least 0.5–1% lower</strong>
              </li>
              <li>
                You plan to stay in the home <strong>longer than break-even period</strong>
              </li>
              <li>You can reduce term without increasing payment</li>
            </ul>

            <h4>Hidden Costs to Consider</h4>
            <ul className={styles.list}>
              <li><strong>Appraisal fees</strong></li>
              <li><strong>Title insurance</strong></li>
              <li><strong>Origination fees</strong></li>
              <li><strong>Prepayment penalties</strong> (check current loan)</li>
            </ul>

            <h4>Example</h4>
            <p>
              You have a $250,000 loan at 6.5%. Refinancing to 5.0% saves $196/month. With $4,000 in
              closing costs, the break-even point is <strong>20.4 months</strong> (~1.7 years). If you
              plan to stay 5+ years, refinancing is smart.
            </p>
          </div>
        </section>

        {/* CTA Section — FIXED: No <a> inside <Link> */}
        <section className={styles.ctaSection}>
          <h2>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
          <p>Free Financial Planning Tools – Try Now</p>
          <Link
            href="/suite"
            className={styles.ctaButton}
            ref={ctaButtonRef}
            onMouseMove={handleMouseMove}
          >
            <span>Explore All Calculators</span>
            <span className={styles.arrow}>→</span>
          </Link>
        </section>

        {/* Spacer for Footer */}
        <div className={styles.spacerBottom}></div>
      </div>
    </>
  );
};

export default MortgageRefinanceBreakEvenCalculator;