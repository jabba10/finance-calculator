import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './payrollcalculator.module.css';

const PayrollCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [inputs, setInputs] = useState({
    hourlyRate: '25',
    hoursWorked: '40',
    overtimeRate: '37.5',
    overtimeHours: '0',
    taxRate: '22',
    deductions: '0'
  });

  const [results, setResults] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const hourlyRate = parseFloat(inputs.hourlyRate);
    const hoursWorked = parseFloat(inputs.hoursWorked);
    const overtimeRate = parseFloat(inputs.overtimeRate);
    const overtimeHours = parseFloat(inputs.overtimeHours);
    const taxRate = parseFloat(inputs.taxRate) / 100;
    const deductions = parseFloat(inputs.deductions);

    // Validation
    if (
      isNaN(hourlyRate) || isNaN(hoursWorked) || isNaN(overtimeRate) ||
      isNaN(overtimeHours) || isNaN(taxRate) || isNaN(deductions)
    ) {
      alert("Please enter valid numbers in all fields");
      return;
    }

    if (hourlyRate < 0 || hoursWorked < 0 || overtimeRate < 0 || 
        overtimeHours < 0 || taxRate < 0 || deductions < 0) {
      alert("Values cannot be negative");
      return;
    }

    // Calculations
    const regularPay = hourlyRate * Math.min(hoursWorked, 40);
    const overtimePay = overtimeHours * overtimeRate;
    const grossPay = regularPay + overtimePay;
    const taxAmount = grossPay * taxRate;
    const netPay = grossPay - taxAmount - deductions;

    setResults({
      regularPay: regularPay.toFixed(2),
      overtimePay: overtimePay.toFixed(2),
      grossPay: grossPay.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      deductions: deductions.toFixed(2),
      netPay: netPay.toFixed(2),
      taxRate: (taxRate * 100).toFixed(2)
    });
  };

  // Magnetic effect on CTA button
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
      {/* SEO Metadata */}
      <Head>
        <title>Payroll Calculator | Free Take-Home Pay Estimator</title>
        <meta
          name="description"
          content="Calculate your take-home pay after taxes and deductions. Estimate net pay, gross earnings, overtime, and more with our free payroll calculator."
        />
        <meta
          name="keywords"
          content="payroll calculator, take-home pay, salary calculator, paycheck estimator, tax deduction tool"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/payroll-calculator" />

        {/* Open Graph / Social */}
        <meta property="og:title" content="Payroll Calculator | Estimate Your Net Pay" />
        <meta
          property="og:description"
          content="Free tool to calculate your real take-home pay after taxes and deductions."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/payroll-calculator" />
        <meta property="og:image" content="https://www.financecalculatorfree.com/images/payroll-og.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Payroll Calculator | Estimate Your Net Pay" />
        <meta
          name="twitter:description"
          content="See how much you really take home after taxes and deductions."
        />
        <meta name="twitter:image" content="https://www.financecalculatorfree.com/images/payroll-twitter.png" />
      </Head>

      {/* Gap above content */}
      <div className={styles.spacerTop}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Payroll Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your take-home pay after taxes and deductions.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="hourlyRate" className={styles.label}>
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  id="hourlyRate"
                  name="hourlyRate"
                  value={inputs.hourlyRate}
                  onChange={handleChange}
                  placeholder="e.g. 25"
                  step="0.01"
                  min="0"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="hoursWorked" className={styles.label}>
                  Regular Hours Worked
                </label>
                <input
                  type="number"
                  id="hoursWorked"
                  name="hoursWorked"
                  value={inputs.hoursWorked}
                  onChange={handleChange}
                  placeholder="e.g. 40"
                  step="0.25"
                  min="0"
                  max="80"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="overtimeRate" className={styles.label}>
                  Overtime Rate ($)
                </label>
                <input
                  type="number"
                  id="overtimeRate"
                  name="overtimeRate"
                  value={inputs.overtimeRate}
                  onChange={handleChange}
                  placeholder="e.g. 37.5"
                  step="0.01"
                  min="0"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="overtimeHours" className={styles.label}>
                  Overtime Hours
                </label>
                <input
                  type="number"
                  id="overtimeHours"
                  name="overtimeHours"
                  value={inputs.overtimeHours}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  step="0.25"
                  min="0"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="taxRate" className={styles.label}>
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  id="taxRate"
                  name="taxRate"
                  value={inputs.taxRate}
                  onChange={handleChange}
                  placeholder="e.g. 22"
                  step="0.1"
                  min="0"
                  max="100"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="deductions" className={styles.label}>
                  Deductions ($)
                </label>
                <input
                  type="number"
                  id="deductions"
                  name="deductions"
                  value={inputs.deductions}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  step="1"
                  min="0"
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className="taxpro-btn-label">Calculate Payroll</span>
                <span className="taxpro-btn-arrow">→</span>
              </button>
            </form>

            {results && (
              <div className={styles.resultSection}>
                <h3>Payroll Results</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Regular Pay:</strong> ${results.regularPay}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Overtime Pay:</strong> ${results.overtimePay}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Gross Pay:</strong> ${results.grossPay}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Tax Rate:</strong> {results.taxRate}%
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Tax Amount:</strong> ${results.taxAmount}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Deductions:</strong> ${results.deductions}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Net Pay:</strong> ${results.netPay}
                  </div>
                </div>
                <div className={styles.note}>
                  Results are estimates. Actual payroll may vary based on additional factors.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Understanding Your Paycheck</h3>
            <p>
              Your take-home pay is determined by several factors including your hourly rate, hours worked, overtime, taxes, and deductions. This calculator helps you estimate your <strong>net pay</strong> after all these considerations.
            </p>

            <h4>How to Use This Calculator</h4>
            <p>
              Enter your <strong>hourly rate</strong>, <strong>regular hours worked</strong>, and any <strong>overtime</strong> information. Then include your estimated <strong>tax rate</strong> and any <strong>deductions</strong> (like health insurance or retirement contributions) to get an accurate estimate of your take-home pay.
            </p>

            <h4>Key Payroll Concepts</h4>
            <div className={styles.formula}>
              <code>Net Pay = (Regular Pay + Overtime Pay) - Taxes - Deductions</code>
            </div>
            <p>
              Regular pay is calculated up to 40 hours per week (standard full-time work week in the US). Overtime is typically paid at 1.5 times your regular rate for hours worked beyond 40.
            </p>

            <h4>Important Terms</h4>
            <ul className={styles.list}>
              <li><strong>Gross Pay:</strong> Total earnings before deductions</li>
              <li><strong>Net Pay:</strong> Take-home pay after all deductions</li>
              <li><strong>Overtime Pay:</strong> Additional pay for hours worked beyond standard work week</li>
              <li><strong>Tax Withholding:</strong> Estimated taxes deducted from your paycheck</li>
            </ul>

            <h4>Common Deductions</h4>
            <ul className={styles.list}>
              <li><strong>Federal/State Taxes:</strong> Required payroll taxes</li>
              <li><strong>Social Security/Medicare:</strong> FICA contributions</li>
              <li><strong>Health Insurance:</strong> Premium payments</li>
              <li><strong>Retirement:</strong> 401(k) or other retirement contributions</li>
            </ul>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaSectionHeading}>
            Free Financial Planning Tools: Budget, Invest & Plan Retirement
          </h2>
          <p className={styles.ctaSectionSubtext}>
            Free Financial Planning Tools – Try Now
          </p>
          <Link href="/suite" passHref legacyBehavior>
            <a
              className={styles.ctaButton}
              ref={ctaButtonRef}
              onMouseMove={handleMouseMove}
            >
              <span className="btn-label">Explore All Calculators</span>
              <span className="btn-icon" aria-hidden="true">→</span>
            </a>
          </Link>
        </section>
      </div>

      {/* Gap below content */}
      <div className={styles.spacerBottom}></div>
    </>
  );
};

export default PayrollCalculator;