import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import Link from 'next/link';
import styles from './mortgagecalculator.module.css';

const MortgageCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [homeValue, setHomeValue] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [result, setResult] = useState(null);

  const parseNumber = (input) => {
    if (!input) return NaN;
    const match = input.toString().replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const home = parseNumber(homeValue);
    const down = parseNumber(downPayment);
    const term = parseNumber(loanTerm);
    const rate = parseNumber(interestRate);

    if (isNaN(home) || isNaN(down) || isNaN(term) || isNaN(rate)) {
      setResult(null);
      return;
    }

    const loanAmount = home - down;
    const monthlyRate = rate / 100 / 12;
    const payments = term * 12;

    const monthlyPayment = (loanAmount * monthlyRate) / 
                          (1 - Math.pow(1 + monthlyRate, -payments));
    const totalInterest = (monthlyPayment * payments) - loanAmount;

    setResult({
      homeValue: home.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      downPayment: down.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      loanAmount: loanAmount.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      monthlyPayment: monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      totalInterest: totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      totalCost: (home + totalInterest).toLocaleString(undefined, { maximumFractionDigits: 2 }),
      term: term,
      rate: rate.toFixed(2)
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
        <title>Mortgage Calculator | Estimate Monthly Home Loan Payments</title>
        <meta
          name="description"
          content="Calculate your monthly mortgage payment, total interest, and loan cost based on home price, down payment, term, and interest rate."
        />
        <meta
          name="keywords"
          content="mortgage calculator, home loan calculator, monthly payment estimator, PITI calculator"
        />
        <meta property="og:title" content="Mortgage Calculator" />
        <meta
          property="og:description"
          content="Estimate your monthly mortgage payment and total loan cost with our free, easy-to-use calculator."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className={styles.container}>
        {/* Spacer for Navbar */}
        <div className={styles.spacerTop}></div>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Mortgage Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your monthly mortgage payments and total loan cost.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your home details to calculate your estimated monthly payment.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="homeValue" className={styles.label}>
                  Home Value ($)
                </label>
                <input
                  id="homeValue"
                  type="text"
                  value={homeValue}
                  onChange={(e) => setHomeValue(e.target.value)}
                  placeholder="e.g. 300,000 or $300K"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="downPayment" className={styles.label}>
                  Down Payment ($)
                </label>
                <input
                  id="downPayment"
                  type="text"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  placeholder="e.g. 60,000 or $60K"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="loanTerm" className={styles.label}>
                  Loan Term (years)
                </label>
                <input
                  id="loanTerm"
                  type="text"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  placeholder="e.g. 30 or 15"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="interestRate" className={styles.label}>
                  Interest Rate (%)
                </label>
                <input
                  id="interestRate"
                  type="text"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="e.g. 3.5 or 4.25"
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span>Calculate Mortgage</span>
                <span className={styles.arrow}>→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Mortgage Summary</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Home Value:</strong> ${result.homeValue}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Down Payment:</strong> ${result.downPayment}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Loan Amount:</strong> ${result.loanAmount}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Monthly Payment:</strong> ${result.monthlyPayment}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Interest Rate:</strong> {result.rate}%
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Loan Term:</strong> {result.term} years
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Total Interest:</strong> ${result.totalInterest}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Total Cost:</strong> ${result.totalCost}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Understanding Your Mortgage</h3>
            <p>
              <strong>A mortgage</strong> is a loan used to purchase real estate, where the property serves as collateral. Your monthly payment consists of principal, interest, taxes, and insurance (PITI).
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li>
                <strong>Home Value:</strong> The purchase price or current market value of the property
              </li>
              <li>
                <strong>Down Payment:</strong> Your initial payment (typically 3-20% of home value)
              </li>
              <li>
                <strong>Loan Term:</strong> Duration of the loan (usually 15 or 30 years)
              </li>
              <li>
                <strong>Interest Rate:</strong> Annual percentage rate (APR) for the loan
              </li>
            </ul>

            <h4>Formulas Used</h4>
            <div className={styles.formula}>
              <code>M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]</code>
              <p>Where:</p>
              <ul className={styles.list}>
                <li>M = Monthly payment</li>
                <li>P = Loan principal (home value - down payment)</li>
                <li>i = Monthly interest rate (annual rate ÷ 12)</li>
                <li>n = Number of payments (loan term in years × 12)</li>
              </ul>
            </div>

            <h4>Tips for Home Buyers</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Save for a larger down payment</strong> to reduce monthly payments</li>
              <li>✅ <strong>Improve your credit score</strong> to qualify for better rates</li>
              <li>✅ <strong>Consider different loan terms</strong> (15-year vs 30-year)</li>
              <li>✅ <strong>Factor in all homeownership costs</strong> (maintenance, taxes, insurance)</li>
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
            <span>View All Calculators</span>
            <span className={styles.arrow}>→</span>
          </Link>
        </section>

        {/* Spacer for Footer */}
        <div className={styles.spacerBottom}></div>
      </div>
    </>
  );
};

export default MortgageCalculator;