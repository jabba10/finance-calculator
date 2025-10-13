import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './carloancal.module.css';

const CarLoanCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [carPrice, setCarPrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [tradeIn, setTradeIn] = useState('0');
  const [loanTerm, setLoanTerm] = useState('60');
  const [interestRate, setInterestRate] = useState('5.5');
  const [result, setResult] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Parse inputs with fallback and clamp to 0
    const price = Math.max(0, parseFloat(carPrice) || 30000);
    const down = Math.max(0, parseFloat(downPayment) || 0);
    const trade = Math.max(0, parseFloat(tradeIn) || 0);
    const termMonths = Math.max(1, parseInt(loanTerm) || 60); // at least 1 month
    const annualRate = Math.max(0, parseFloat(interestRate) || 5.5);
    const monthlyRate = (annualRate / 100) / 12;

    // Calculate loan amount (ensure non-negative)
    const loanAmount = Math.max(0, price - down - trade);

    let monthlyPayment, totalPayment, totalInterest;

    // Handle zero interest rate
    if (monthlyRate === 0) {
      monthlyPayment = loanAmount / termMonths;
      totalPayment = loanAmount;
      totalInterest = 0;
    } else {
      // Standard loan formula: M = P [i(1+i)^n] / [(1+i)^n - 1]
      const x = Math.pow(1 + monthlyRate, termMonths);
      monthlyPayment = (loanAmount * monthlyRate * x) / (x - 1);
      totalPayment = monthlyPayment * termMonths;
      totalInterest = Math.max(0, totalPayment - loanAmount);
    }

    // Format numbers for display
    const formatMoney = (value) =>
      value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    setResult({
      carPrice: formatMoney(price),
      downPayment: formatMoney(down),
      tradeIn: formatMoney(trade),
      loanAmount: formatMoney(loanAmount),
      monthlyPayment: formatMoney(monthlyPayment),
      totalInterest: formatMoney(totalInterest),
      totalPayment: formatMoney(totalPayment),
      loanTerm: termMonths.toString(),
      interestRate: annualRate.toFixed(2),
    });
  };

  // Magnetic effect on CTA button
  const handleMouseMove = useCallback((e) => {
    if (!ctaButtonRef.current) return;
    const el = ctaButtonRef.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  }, []);

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>Car Loan Calculator | Estimate Monthly Payment & Interest</title>
        <meta
          name="description"
          content="Free car loan calculator to estimate your monthly payment, total interest, and overall cost of financing a vehicle."
        />
        <meta
          name="keywords"
          content="car loan calculator, auto loan calculator, car payment estimator, vehicle financing tool"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/car-loan-calculator" />
        <meta property="og:title" content="Car Loan Calculator - Estimate Your Auto Financing" />
        <meta
          property="og:description"
          content="Calculate your car loan payment, total interest, and see how down payments and rates affect your budget."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/car-loan-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Car Loan Calculator</h1>
            <p className={styles.subtitle}>
              Estimate your monthly payment and total cost of financing a vehicle.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your car purchase details to calculate your loan payment.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="carPrice" className={styles.label}>
                  Car Price ($)
                </label>
                <input
                  id="carPrice"
                  type="number"
                  value={carPrice}
                  onChange={(e) => setCarPrice(e.target.value)}
                  placeholder="e.g. 30,000"
                  className={styles.input}
                  step="0.01"
                  min="0"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="downPayment" className={styles.label}>
                  Down Payment ($)
                </label>
                <input
                  id="downPayment"
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  placeholder="e.g. 5,000"
                  className={styles.input}
                  step="0.01"
                  min="0"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="tradeIn" className={styles.label}>
                  Trade-In Value ($)
                </label>
                <input
                  id="tradeIn"
                  type="number"
                  value={tradeIn}
                  onChange={(e) => setTradeIn(e.target.value)}
                  placeholder="e.g. 3,000"
                  className={styles.input}
                  step="0.01"
                  min="0"
                />
                <small className={styles.note}>Value of your current vehicle</small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="loanTerm" className={styles.label}>
                  Loan Term (Months)
                </label>
                <input
                  id="loanTerm"
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  placeholder="e.g. 60"
                  className={styles.input}
                  step="1"
                  min="1"
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
                  placeholder="e.g. 5.5"
                  className={styles.input}
                  step="0.01"
                  min="0"
                  max="100"
                />
              </div>

              <button type="submit" className={styles.ctaButton}>
                <span className={styles.btnText}>Calculate Car Loan</span>
                <span className={styles.btnArrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Loan Summary</h3>
                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Loan Amount:</strong> ${result.loanAmount}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Interest Rate:</strong> {result.interestRate}%
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Loan Term:</strong> {result.loanTerm} months
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Monthly Payment:</strong> ${result.monthlyPayment}
                    </div>
                  </div>

                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Total Interest:</strong> ${result.totalInterest}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Total Paid:</strong> ${result.totalPayment}
                    </div>
                  </div>

                  <div className={styles.resultNote}>
                    You'll pay <strong>${result.totalInterest}</strong> in interest over the life of the loan — that's{' '}
                    <strong>
                      {(
                        (parseFloat(result.totalInterest.replace(/,/g, '')) /
                          parseFloat(result.totalPayment.replace(/,/g, ''))) *
                        100
                      ).toFixed(1)}
                      %
                    </strong>{' '}
                    of your total cost.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why a Car Loan Calculator Matters</h3>
                <p>
                  Buying a car is a major expense, and financing can <strong>add thousands in interest</strong>. This calculator helps you understand your monthly payment, total cost, and how down payments, trade-ins, and interest rates impact your budget.
                </p>

                <h4>How to Use This Calculator</h4>
                <ul className={styles.list}>
                  <li><strong>Car Price:</strong> The sticker price or negotiated cost</li>
                  <li><strong>Down Payment:</strong> Cash you pay upfront</li>
                  <li><strong>Trade-In:</strong> Value of your old car (reduces loan amount)</li>
                  <li><strong>Loan Term:</strong> 48–72 months are common; longer = lower payment but more interest</li>
                  <li><strong>Interest Rate:</strong> Your APR (check lender offers)</li>
                  <li>Click "Calculate Car Loan" to see your payment and total cost</li>
                </ul>

                <h4>Formula Used</h4>
                <div className={styles.formula}>
                  <code>M = P [ i(1+i)ⁿ ] / [ (1+i)ⁿ – 1 ]</code>
                </div>
                <p>
                  Where:
                </p>
                <ul className={styles.list}>
                  <li><strong>M</strong> = Monthly payment</li>
                  <li><strong>P</strong> = Loan amount (price – down – trade-in)</li>
                  <li><strong>i</strong> = Monthly interest rate (annual rate / 12)</li>
                  <li><strong>n</strong> = Number of payments (loan term in months)</li>
                </ul>
                <p>
                  <strong>Example:</strong> $30K car, $5K down, $3K trade-in, 5.5% rate, 60 months
                  <br />
                  Loan = $22K → Monthly = <strong>$422</strong> → Total Paid = <strong>$25,320</strong> → Interest = <strong>$3,320</strong>
                </p>

                <h4>Impact of Loan Terms</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Term</th>
                      <th>Monthly Payment</th>
                      <th>Total Interest</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>48 Months</td><td>$504</td><td>$1,992</td></tr>
                    <tr><td>60 Months</td><td>$422</td><td>$3,320</td></tr>
                    <tr><td>72 Months</td><td>$367</td><td>$4,424</td></tr>
                    <tr><td>84 Months</td><td>$328</td><td>$5,552</td></tr>
                  </tbody>
                </table>

                <h4>Car Loan Tips</h4>
                <ul className={styles.list}>
                  <li>✅ <strong>Make a large down payment</strong> — reduces interest and loan risk</li>
                  <li>✅ <strong>Improve credit score</strong> — can save hundreds in interest</li>
                  <li>✅ <strong>Negotiate price first, then financing</strong> — don't let monthly payment distract you</li>
                  <li>✅ <strong>Avoid long loan terms</strong> — you may owe more than car is worth</li>
                  <li>✅ <strong>Compare multiple lenders</strong> — banks, credit unions, dealerships</li>
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
                  aria-label="Explore all financial calculators"
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

export default CarLoanCalculator;