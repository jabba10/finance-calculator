import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './creditcardpayoffcalculator.module.css';

const CreditCardPayoffCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [balance, setBalance] = useState('');
  const [interestRate, setInterestRate] = useState('18.99');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Helper: Extract first number from any string
  const parseNumber = (input) => {
    if (!input) return NaN;
    const match = input.toString().replace(/,/g, '').match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    // Parse inputs
    const principal = parseNumber(balance);
    const aprPercent = parseNumber(interestRate);
    const monthlyAmount = parseNumber(monthlyPayment);

    // Validate inputs
    if (isNaN(principal) || principal <= 0) {
      setError('Please enter a valid current balance.');
      return;
    }
    if (isNaN(aprPercent) || aprPercent < 0) {
      setError('Please enter a valid interest rate.');
      return;
    }
    if (isNaN(monthlyAmount) || monthlyAmount <= 0) {
      setError('Please enter a valid monthly payment.');
      return;
    }

    const apr = aprPercent / 100;
    const monthlyRate = apr / 12;

    // Check if payment covers interest
    if (monthlyAmount <= principal * monthlyRate) {
      setError('Your monthly payment is too low to cover the interest. Please increase it.');
      return;
    }

    // Calculate months to payoff using logarithmic formula
    const months = Math.log(monthlyAmount / (monthlyAmount - principal * monthlyRate)) / Math.log(1 + monthlyRate);
    const totalPayments = monthlyAmount * months;
    const totalInterest = totalPayments - principal;

    const years = Math.floor(months / 12);
    const remainingMonths = Math.ceil(months % 12);

    setResult({
      balance: principal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      interestRate: aprPercent.toFixed(2),
      monthlyPayment: monthlyAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      payoffTime: {
        months: Math.ceil(months),
        years,
        remainingMonths
      },
      totalInterest: totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalPayments: totalPayments.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
        <title>Credit Card Payoff Calculator | Debt Repayment Tool</title>
        <meta
          name="description"
          content="Free credit card payoff calculator to estimate how long it will take to pay off your debt and how much interest you'll pay."
        />
        <meta
          name="keywords"
          content="credit card calculator, payoff calculator, debt repayment, credit card interest, debt free calculator"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/credit-card-payoff-calculator" />
        <meta property="og:title" content="Credit Card Payoff Calculator - Get Debt Free Faster" />
        <meta
          property="og:description"
          content="Calculate your credit card payoff timeline and total interest based on balance, APR, and monthly payments."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/credit-card-payoff-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Credit Card Payoff Calculator</h1>
            <p className={styles.subtitle}>
              Estimate how long it will take to pay off your credit card and how much interest you’ll pay.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your credit card details — we extract numbers from any format (e.g., $5K, 18.99%, $200/mo).
              </p>

              {error && (
                <div className={styles.error}>{error}</div>
              )}

              <div className={styles.inputGroup}>
                <label htmlFor="balance" className={styles.label}>
                  Current Balance ($)
                </label>
                <input
                  id="balance"
                  type="text"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  placeholder="e.g. $5,000 or 5K"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="interestRate" className={styles.label}>
                  Annual Interest Rate (APR %)
                </label>
                <input
                  id="interestRate"
                  type="text"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="e.g. 18.99 or 18.99%"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="monthlyPayment" className={styles.label}>
                  Monthly Payment ($)
                </label>
                <input
                  id="monthlyPayment"
                  type="text"
                  value={monthlyPayment}
                  onChange={(e) => setMonthlyPayment(e.target.value)}
                  placeholder="e.g. $200 or 200/mo"
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.ctaButton}>
                <span className={styles.btnText}>Calculate Payoff</span>
                <span className={styles.btnArrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Payoff Summary</h3>
                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Current Balance:</strong> ${result.balance}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>APR:</strong> {result.interestRate}%
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Monthly Payment:</strong> ${result.monthlyPayment}
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Time to Pay Off:</strong>{' '}
                      {result.payoffTime.years > 0 && ` ${result.payoffTime.years} yr`}
                      {result.payoffTime.remainingMonths > 0 && ` ${result.payoffTime.remainingMonths} mo`}
                    </div>
                  </div>

                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Total Interest:</strong> ${result.totalInterest}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Total Paid:</strong> ${result.totalPayments}
                    </div>
                  </div>

                  <div className={styles.note}>
                    You’ll be debt-free in <strong>{result.payoffTime.months} months</strong> and pay <strong>${result.totalInterest}</strong> in interest.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Paying Off Credit Card Debt Matters</h3>
                <p>
                  High-interest credit card debt can <strong>grow quickly</strong> due to compounding interest. This calculator helps you understand how long it will take to become debt-free and how much you’ll pay in interest — empowering you to make smarter repayment decisions.
                </p>

                <h4>How to Use This Calculator</h4>
                <ul className={styles.list}>
                  <li><strong>Current Balance:</strong> Total amount you owe</li>
                  <li><strong>APR:</strong> Annual Percentage Rate (check your statement)</li>
                  <li><strong>Monthly Payment:</strong> What you plan to pay each month</li>
                  <li>Enter any format — we extract numbers from text, symbols, and units</li>
                  <li>Click "Calculate Payoff" to see your timeline and total cost</li>
                </ul>

                <h4>Formula Used</h4>
                <div className={styles.formula}>
                  <code>n = log(P / (P - B × r)) / log(1 + r)</code>
                </div>
                <p>Where:</p>
                <ul className={styles.list}>
                  <li><strong>n</strong> = Number of months to payoff</li>
                  <li><strong>P</strong> = Monthly payment</li>
                  <li><strong>B</strong> = Balance (principal)</li>
                  <li><strong>r</strong> = Monthly interest rate (APR / 12)</li>
                  <li><strong>Total Interest</strong> = (P × n) - B</li>
                </ul>
                <p>
                  <strong>Example:</strong> $5,000 balance, 18.99% APR, $200/month
                  <br />
                  → Payoff Time: <strong>32 months</strong> → Total Interest: <strong>$1,380</strong>
                </p>

                <h4>Impact of Increasing Payments</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Monthly Payment</th>
                      <th>Payoff Time</th>
                      <th>Total Interest</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>$150</td><td>~45 months</td><td>$1,850</td></tr>
                    <tr><td>$200</td><td>~32 months</td><td>$1,380</td></tr>
                    <tr><td>$300</td><td>~19 months</td><td>$780</td></tr>
                    <tr><td>$500</td><td>~11 months</td><td>$390</td></tr>
                  </tbody>
                </table>

                <h4>Debt Payoff Strategies</h4>
                <ul className={styles.list}>
                  <li><strong>Debt Avalanche:</strong> Pay off highest-interest cards first (saves most money)</li>
                  <li><strong>Debt Snowball:</strong> Pay off smallest balances first (builds momentum)</li>
                  <li><strong>Balance Transfer:</strong> Move debt to 0% intro APR card (watch for fees)</li>
                  <li><strong>Debt Consolidation:</strong> Combine into a lower-interest personal loan</li>
                  <li><strong>Minimum Payment Trap:</strong> Only paying minimums can take decades!</li>
                </ul>

                <h4>Tips to Pay Off Faster</h4>
                <ul className={styles.list}>
                  <li>✅ <strong>Pay more than the minimum</strong> — even $25 extra helps</li>
                  <li>✅ <strong>Use windfalls</strong> — bonuses, tax refunds, gifts</li>
                  <li>✅ <strong>Cut discretionary spending</strong> — dining out, subscriptions</li>
                  <li>✅ <strong>Stop using the card</strong> — avoid adding to the balance</li>
                  <li>✅ <strong>Avoid cash advances</strong> — they accrue interest immediately</li>
                </ul>

                <h4>Advanced Tips</h4>
                <ul className={styles.list}>
                  <li><strong>Auto-pay:</strong> Set up automatic payments above minimum</li>
                  <li><strong>Bi-weekly payments:</strong> Pay half monthly amount every 2 weeks = 1 extra payment/year</li>
                  <li><strong>Refinance:</strong> Look into credit unions or balance transfer cards</li>
                  <li><strong>Emergency Fund:</strong> Save $500–$1,000 to avoid future debt</li>
                  <li><strong>Credit Score:</strong> Paying down balances improves utilization (30% of score)</li>
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

export default CreditCardPayoffCalculator;