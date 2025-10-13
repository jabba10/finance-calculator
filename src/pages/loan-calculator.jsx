// components/LoanCalculator.jsx
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './LoanCalculator.module.css';

const LoanCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [result, setResult] = useState(null);

  // Format number with commas
  const formatNumber = (num) => {
    if (!num) return '';
    return parseFloat(num).toLocaleString('en-US', {
      maximumFractionDigits: 0,
      useGrouping: true,
    });
  };

  // Parse input (remove non-digit characters except decimal)
  const parseNumber = (value) => {
    const num = value.replace(/[^0-9.]/g, '');
    return num === '' ? '' : parseFloat(num);
  };

  // Handle loan amount input with formatting
  const handleLoanAmountChange = (e) => {
    const input = e.target.value;
    const numericValue = parseNumber(input);

    if (input === '' || numericValue === '') {
      setLoanAmount('');
      return;
    }

    if (numericValue <= 0) return;

    setLoanAmount(numericValue.toString());
  };

  // Display formatted loan amount
  const displayLoanAmount = loanAmount ? formatNumber(loanAmount) : '';

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loanAmount || !interestRate || !loanTerm) return;

    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12; // monthly interest rate
    const termInMonths = parseFloat(loanTerm) * 12;

    if (isNaN(principal) || isNaN(rate) || isNaN(termInMonths)) return;

    let monthlyPayment, totalPayment, totalInterest;

    if (rate === 0) {
      monthlyPayment = (principal / termInMonths).toFixed(2);
      totalPayment = principal.toFixed(2);
      totalInterest = '0.00';
    } else {
      monthlyPayment = ((principal * rate) / (1 - Math.pow(1 + rate, -termInMonths))).toFixed(2);
      totalPayment = (monthlyPayment * termInMonths).toFixed(2);
      totalInterest = (totalPayment - principal).toFixed(2);
    }

    setResult({
      monthlyPayment,
      totalPayment,
      totalInterest,
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

  // SEO Metadata
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = 'Loan Calculator | Estimate Monthly Payment & Total Interest';
  const pageDescription =
    'Estimate your loan payment, total interest, and total cost with our free loan calculator. Works for mortgages, auto loans, personal loans.';
  const imagePreview = `${siteUrl}/images/loan-calculator-preview.jpg`;

  return (
    <>
      <Head>
        {/* Basic Meta */}
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="loan calculator, mortgage calculator, auto loan, personal loan, payment estimator, interest calculator"
        />
        <meta name="author" content="Calci" />
        <meta name="robots" content="index, follow" />

        {/* Canonical URL */}
        <link rel="canonical" href={`${siteUrl}/loan-calculator`} />

        {/* Open Graph / Social */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/loan-calculator`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imagePreview} />
        <meta property="og:image:alt" content="Loan calculator interface showing payment breakdown" />
        <meta property="og:site_name" content="Calci" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@calci" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imagePreview} />
        <meta name="twitter:image:alt" content="Free loan calculator for estimating payments and interest" />

        {/* Structured Data - WebPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: pageTitle,
            description: pageDescription,
            url: `${siteUrl}/loan-calculator`,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: 'Loan Calculator', item: `${siteUrl}/loan-calculator` }
              ]
            }
          })}
        </script>

        {/* Structured Data - Tool */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Tool',
            name: 'Loan Calculator',
            description: 'Calculate monthly loan payments, total interest, and amortization schedule.',
            url: `${siteUrl}/loan-calculator`,
            applicationCategory: 'Finance',
            offers: {
              '@type': 'Offer',
              availability: 'https://schema.org/InStock',
              price: '0',
              priceCurrency: 'USD'
            },
            featureList: [
              'Monthly payment calculation',
              'Total interest estimate',
              'Supports any loan type',
              'No signup or data collection'
            ]
          })}
        </script>
      </Head>

      <div className={styles.page}>
        {/* Top Spacer (gap from navbar) */}
        <div className={styles.spacerTop}></div>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Loan Calculator</h1>
          <p className={styles.subtitle}>
            Estimate your monthly payment, total interest, and total cost of a loan.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter the loan amount, interest rate, and term to calculate your payment.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="loanAmount" className={styles.label}>
                Loan Amount ($)
              </label>
              <input
                id="loanAmount"
                type="text"
                value={displayLoanAmount}
                onChange={handleLoanAmountChange}
                placeholder="e.g. 25,000"
                className={styles.input}
                required
              />
              <small className={styles.note}>
                Enter any amount (e.g., 500, 10000, 500000)
              </small>
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
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="loanTerm" className={styles.label}>
                Loan Term (Years)
              </label>
              <input
                id="loanTerm"
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                placeholder="e.g. 5"
                className={styles.input}
                min="1"
                max="50"
                required
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Loan</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Loan Summary</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}><strong>Monthly Payment:</strong> ${result.monthlyPayment}</div>
                <div className={styles.resultItem}><strong>Total Interest:</strong> ${result.totalInterest}</div>
                <div className={styles.resultItem}><strong>Total Paid:</strong> ${result.totalPayment}</div>
                <div className={styles.resultItem}><strong>Principal:</strong> ${formatNumber(loanAmount)}</div>
              </div>
              <div className={styles.note}>
                This is an estimate. Actual payments may vary based on fees, compounding, or lender terms.
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.container}>
            <div className={styles.infoCard}>
              <h3>Why It Matters</h3>
              <p>
                A <strong>Loan Calculator</strong> helps you understand the true cost of borrowing — including monthly payments, total interest, and long-term impact.
              </p>

              <h4>How to Use</h4>
              <ul className={styles.list}>
                <li>Enter the <strong>loan amount</strong></li>
                <li>Input the <strong>annual interest rate</strong></li>
                <li>Set the <strong>loan term</strong> in years</li>
                <li>Click “Calculate Loan”</li>
              </ul>

              <h4>Formula: Loan Payment</h4>
              <div className={styles.formula}>
                <code>M = P × [i(1+i)^n] / [(1+i)^n − 1]</code>
              </div>
              <p>
                <strong>M</strong> = Monthly Payment<br />
                <strong>P</strong> = Principal<br />
                <strong>i</strong> = Monthly rate<br />
                <strong>n</strong> = Number of payments
              </p>

              <h4>Real-World Uses</h4>
              <ul className={styles.list}>
                <li><strong>Auto Loans:</strong> Compare car financing options</li>
                <li><strong>Mortgages:</strong> Evaluate 15 vs 30-year terms</li>
                <li><strong>Personal Loans:</strong> Avoid high-interest debt</li>
                <li><strong>Student Loans:</strong> Plan repayment strategies</li>
                <li><strong>Business Loans:</strong> Forecast cash flow impact</li>
              </ul>

              <h4>Example Comparison</h4>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Term</th>
                    <th>30-Year</th>
                    <th>15-Year</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Amount</td><td>$300k</td><td>$300k</td></tr>
                  <tr><td>Rate</td><td>6.5%</td><td>6.0%</td></tr>
                  <tr><td>Monthly</td><td>$1,896</td><td>$2,531</td></tr>
                  <tr><td>Total Paid</td><td>$682,560</td><td>$455,580</td></tr>
                  <tr><td>Interest</td><td>$382,560</td><td>$155,580</td></tr>
                </tbody>
              </table>

              <h4>Tips to Save</h4>
              <ul className={styles.list}>
                <li>✅ Improve credit score for lower rates</li>
                <li>✅ Make extra payments</li>
                <li>✅ Shorten loan term</li>
                <li>✅ Compare APRs</li>
                <li>✅ Refinance when rates drop</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2>More Financial Tools?</h2>
            <p>Explore 50+ free calculators — no login, just results.</p>
            <Link href="/suite" legacyBehavior>
              <button
                className={styles.ctaButton}
                ref={ctaButtonRef}
                onMouseMove={handleMouseMove}
              >
                <span className={styles.buttonText}>Explore All Calculators</span>
                <span className={styles.arrow}>→</span>
              </button>
            </Link>
          </div>
        </section>

        {/* Bottom Spacer (gap before footer) */}
        <div className={styles.spacerBottom}></div>
      </div>
    </>
  );
};

export default LoanCalculator;