import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import Link from 'next/link';
import styles from './helloccalculator.module.css';

const HELOCCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [inputs, setInputs] = useState({
    homeValue: '400000',
    mortgageBalance: '250000',
    creditLimit: '80',
    interestRate: '6.5',
    drawPeriodYears: '10',
    repaymentYears: '15'
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const calculateHELOC = () => {
    const parseInput = (value) => {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    };

    const homeValue = parseInput(inputs.homeValue);
    const mortgageBalance = parseInput(inputs.mortgageBalance);
    const creditLimitPercent = parseInput(inputs.creditLimit) / 100;
    const interestRate = parseInput(inputs.interestRate) / 100;
    const drawPeriod = parseInput(inputs.drawPeriodYears) || 10;
    const repaymentPeriod = parseInput(inputs.repaymentYears) || 15;

    const maxHELOCLimit = homeValue * creditLimitPercent - mortgageBalance;
    const availableCredit = Math.max(maxHELOCLimit, 0);

    let interestOnlyPayment = 0;
    let amortizingPayment = 0;

    if (availableCredit > 0 && interestRate > 0) {
      const monthlyInterestRate = interestRate / 12;
      interestOnlyPayment = availableCredit * monthlyInterestRate;

      const totalRepaymentMonths = repaymentPeriod * 12;
      if (totalRepaymentMonths > 0) {
        amortizingPayment = availableCredit *
          (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalRepaymentMonths)) /
          (Math.pow(1 + monthlyInterestRate, totalRepaymentMonths) - 1);
      }
    }

    setResult({
      homeValue: homeValue.toLocaleString(),
      mortgageBalance: mortgageBalance.toLocaleString(),
      ltv: (creditLimitPercent * 100).toFixed(1),
      availableCredit: availableCredit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      interestOnlyPayment: interestOnlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      amortizingPayment: amortizingPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      interestRate: inputs.interestRate || '0',
      drawPeriod,
      repaymentPeriod
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateHELOC();
  };

  const handleMouseMove = (e) => {
    const el = ctaButtonRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty('--x', `${x}px`);
      el.style.setProperty('--y', `${y}px`);
    }
  };

  return (
    <>
      <Helmet>
        <title>HELOC Calculator | Estimate Home Equity Line of Credit</title>
        <meta name="description" content="Calculate your HELOC limit, interest-only payments, and amortizing repayment. Free, responsive, professional tool for homeowners." />
        <meta name="keywords" content="HELOC calculator, home equity line of credit, loan to value, LTV, interest only payment, mortgage calculator" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/heloccalculator" />
      </Helmet>

      <div className={styles.page}>
        {/* Gap above content */}
        <div className={styles.spacerTop}></div>

        <div className={styles.contentWrapper}>
          {/* Hero */}
          <section className={styles.hero}>
            <h1 className={styles.title}>HELOC Calculator</h1>
            <p className={styles.subtitle}>
              Estimate your Home Equity Line of Credit (HELOC) limit and payments.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="homeValue" className={styles.label}>Current Home Value ($)</label>
                <input
                  type="number"
                  id="homeValue"
                  name="homeValue"
                  value={inputs.homeValue}
                  onChange={handleChange}
                  placeholder="e.g. 400000"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="mortgageBalance" className={styles.label}>Outstanding Mortgage Balance ($)</label>
                <input
                  type="number"
                  id="mortgageBalance"
                  name="mortgageBalance"
                  value={inputs.mortgageBalance}
                  onChange={handleChange}
                  placeholder="e.g. 250000"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="creditLimit" className={styles.label}>Max LTV for HELOC (%)</label>
                <input
                  type="number"
                  id="creditLimit"
                  name="creditLimit"
                  value={inputs.creditLimit}
                  onChange={handleChange}
                  placeholder="e.g. 80"
                  step="0.1"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="interestRate" className={styles.label}>Estimated Interest Rate (%)</label>
                <input
                  type="number"
                  id="interestRate"
                  name="interestRate"
                  value={inputs.interestRate}
                  onChange={handleChange}
                  placeholder="e.g. 6.5"
                  step="0.01"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="drawPeriodYears" className={styles.label}>Draw Period (Years)</label>
                <input
                  type="number"
                  id="drawPeriodYears"
                  name="drawPeriodYears"
                  value={inputs.drawPeriodYears}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="repaymentYears" className={styles.label}>Repayment Period (Years)</label>
                <input
                  type="number"
                  id="repaymentYears"
                  name="repaymentYears"
                  value={inputs.repaymentYears}
                  onChange={handleChange}
                  placeholder="e.g. 15"
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                Calculate HELOC
                <span className={styles.arrow}>→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>HELOC Summary</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Home Value:</strong> ${result.homeValue}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Mortgage Balance:</strong> ${result.mortgageBalance}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Available HELOC:</strong> ${result.availableCredit}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Interest Rate:</strong> {result.interestRate}%
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Draw Period:</strong> {result.drawPeriod} years
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Repayment Period:</strong> {result.repaymentPeriod} years
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Monthly (Draw):</strong> ${result.interestOnlyPayment}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Monthly (Repayment):</strong> ${result.amortizingPayment}
                  </div>
                </div>
                <p className={styles.note}>
                  During the draw period, you typically pay interest only. In repayment, principal is amortized.
                </p>
              </div>
            )}
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why HELOC Matters</h3>
                <p>
                  A <strong>Home Equity Line of Credit (HELOC)</strong> allows homeowners to borrow against the equity in their home, typically at a lower interest rate than credit cards or personal loans. It's a flexible way to finance home improvements, debt consolidation, or education.
                </p>

                <h4>How to Use This Calculator</h4>
                <p>
                  Enter your <strong>home value</strong>, <strong>current mortgage balance</strong>, and the lender's <strong>maximum LTV (Loan-to-Value)</strong> limit (usually 80%). Add the expected <strong>interest rate</strong>, <strong>draw period</strong>, and <strong>repayment term</strong>. The calculator shows:
                </p>
                <ul className={styles.list}>
                  <li><strong>Available HELOC limit</strong></li>
                  <li><strong>Monthly interest-only payment</strong> during draw period</li>
                  <li><strong>Amortizing payment</strong> during repayment phase</li>
                </ul>

                <h4>The HELOC Formulas</h4>
                <div className={styles.formula}>
                  <code>
                    Available Credit = (Home Value × LTV) − Mortgage Balance
                  </code>
                </div>
                <div className={styles.formula}>
                  <code>
                    Interest-Only Payment = Credit × (Rate / 12)
                  </code>
                </div>
                <div className={styles.formula}>
                  <code>
                    Amortizing Payment = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1]
                  </code>
                </div>
                <p>Where:</p>
                <ul className={styles.list}>
                  <li><strong>LTV</strong> = Max loan-to-value ratio (e.g., 80%)</li>
                  <li><strong>Rate</strong> = Annual interest rate</li>
                  <li><strong>P</strong> = Loan amount (available credit)</li>
                  <li><strong>r</strong> = Monthly interest rate</li>
                  <li><strong>n</strong> = Number of repayment months</li>
                </ul>
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

export default HELOCCalculator;