// components/LoanCalculator.jsx
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './loancalculator.module.css';

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

  // SEO Metadata - Enhanced with comprehensive loan keywords
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = 'Free Loan Calculator 2024 | Monthly Payment & Interest Calculator';
  const pageDescription = 'Free loan calculator to estimate monthly payments, total interest, and amortization schedule for mortgages, auto loans, personal loans, and student loans.';

  // Comprehensive SEO Keywords Collections for Loan Calculator
  const singleKeywords = [
    'loan', 'calculator', 'payment', 'mortgage', 'auto', 'car', 'personal', 'student', 
    'interest', 'rate', 'term', 'principal', 'amortization', 'debt', 'borrow', 
    'lender', 'finance', 'credit', 'monthly', 'annual', 'APR', 'schedule', 
    'refinance', 'consolidation', 'prepayment', 'equity', 'home', 'vehicle',
    'education', 'business', 'installment', 'fixed', 'variable', 'adjustable',
    'secured', 'unsecured', 'collateral', 'cosigner', 'default', 'foreclosure',
    'bank', 'credit union', 'lending', 'borrowing', 'affordability', 'qualification'
  ];

  const twoWordKeywords = [
    'loan calculator', 'mortgage calculator', 'auto loan', 'car loan', 
    'personal loan', 'student loan', 'home loan', 'business loan', 
    'payment calculator', 'interest calculator', 'amortization calculator',
    'loan payment', 'monthly payment', 'loan term', 'interest rate',
    'loan amount', 'principal amount', 'debt calculator', 'loan estimate',
    'loan amortization', 'loan repayment', 'loan refinance', 'loan consolidation',
    'mortgage payment', 'car payment', 'student debt', 'credit score',
    'loan approval', 'loan prequalification', 'debt consolidation',
    'home equity', 'auto financing', 'education loan', 'small business loan',
    'installment loan', 'fixed rate', 'variable rate', 'adjustable rate',
    'secured loan', 'unsecured loan', 'loan officer', 'loan processor',
    'loan originator', 'loan servicer', 'debt management', 'credit report',
    'loan default', 'loan foreclosure', 'loan modification', 'debt settlement'
  ];

  const longTailKeywords = [
    'free online loan calculator for monthly payments',
    'mortgage payment calculator with taxes and insurance',
    'auto loan calculator with trade in value',
    'personal loan calculator for debt consolidation',
    'student loan calculator for repayment plans',
    'home equity loan calculator monthly payments',
    'business loan calculator for small business owners',
    'car loan calculator with down payment',
    'amortization schedule calculator with extra payments',
    'debt consolidation loan calculator savings',
    'mortgage calculator for first time home buyers',
    'refinance calculator to lower monthly payments',
    'auto loan calculator for new and used cars',
    'personal loan calculator for credit score improvement',
    'student loan repayment calculator income based',
    'home loan calculator for different mortgage types',
    'business loan calculator for startup funding',
    'debt payoff calculator snowball vs avalanche method',
    'mortgage calculator 15 year vs 30 year comparison',
    'car loan calculator with manufacturer incentives',
    'personal loan calculator for home improvements',
    'student loan calculator for graduate school',
    'home equity line of credit calculator payments',
    'small business loan calculator SBA 7a',
    'debt consolidation calculator for credit cards',
    'mortgage calculator with PMI and property taxes',
    'auto loan calculator for lease vs buy',
    'personal loan calculator for medical expenses',
    'student loan calculator for parent PLUS loans',
    'business loan calculator for equipment financing',
    'loan calculator for debt to income ratio',
    'mortgage calculator for jumbo loans',
    'car loan calculator with bad credit',
    'personal loan calculator for wedding expenses',
    'student loan calculator for forgiveness programs',
    'home loan calculator for FHA loans',
    'business loan calculator for working capital',
    'loan calculator for debt payoff timeline',
    'mortgage calculator for VA loans',
    'auto loan calculator with cash back offers',
    'personal loan calculator for vacation funding',
    'student loan calculator for consolidation options',
    'home equity calculator for renovation projects',
    'business loan calculator for expansion plans',
    'loan calculator for credit card payoff',
    'mortgage calculator for investment properties',
    'car loan calculator with extended warranty',
    'personal loan calculator for emergency expenses',
    'student loan calculator for different interest rates',
    'home loan calculator for construction loans',
    'business loan calculator for inventory financing',
    'loan calculator for debt management plan',
    'mortgage calculator for adjustable rate mortgages',
    'auto loan calculator with gap insurance',
    'personal loan calculator for debt relief',
    'student loan calculator for public service forgiveness',
    'home equity calculator for debt consolidation',
    'business loan calculator for franchise financing',
    'loan calculator for bankruptcy alternatives',
    'mortgage calculator for second homes',
    'car loan calculator with negative equity',
    'personal loan calculator for credit building'
  ];

  const allKeywords = [...singleKeywords, ...twoWordKeywords, ...longTailKeywords].join(', ');

  return (
    <>
      <Head>
        {/* Basic Meta */}
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={allKeywords} />
        <meta name="author" content="Calci Financial Tools" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        
        {/* Additional Meta Tags */}
        <meta name="subject" content="Loan Calculator & Payment Estimation" />
        <meta name="classification" content="Loans, Finance, Calculators, Mortgage, Auto Loan" />
        <meta name="topic" content="Loan Payment Calculation and Amortization" />
        <meta name="summary" content="Free online loan calculator for all types of loans" />
        <meta name="url" content={`${siteUrl}/loan-calculator`} />
        
        {/* Verification & Ownership */}
        <meta name="google-site-verification" content="your_verification_code" />
        <meta name="msvalidate.01" content="your_bing_verification" />
        
        {/* Location & Business */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="geo.position" content="39.8283;-98.5795" />
        <meta name="ICBM" content="39.8283, -98.5795" />
        
        {/* Canonical */}
        <link rel="canonical" href={`${siteUrl}/loan-calculator`} />
        
        {/* Alternate Languages */}
        <link rel="alternate" href={`${siteUrl}/loan-calculator`} hrefLang="x-default" />
        <link rel="alternate" href={`${siteUrl}/loan-calculator`} hrefLang="en" />
        <link rel="alternate" href={`${siteUrl}/es/loan-calculator`} hrefLang="es" />
        
        {/* Preload & Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/loan-calculator`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={`${siteUrl}/images/loan-calculator-preview.jpg`} />
        <meta property="og:image:alt" content="Loan Calculator Interface for Payment Estimation" />
        <meta property="og:site_name" content="Calci Financial Calculators" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:see_also" content={siteUrl} />
        
        {/* Facebook */}
        <meta property="fb:app_id" content="your_facebook_app_id" />
        <meta property="fb:pages" content="your_facebook_page_id" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@calcifinance" />
        <meta name="twitter:creator" content="@calcifinance" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={`${siteUrl}/images/loan-calculator-preview.jpg`} />
        <meta name="twitter:image:alt" content="Free Loan Calculator for All Loan Types" />
        
        {/* Additional Social */}
        <meta name="pinterest" content="nopin" description="Free loan calculator for payment estimation" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: pageTitle,
            description: pageDescription,
            url: `${siteUrl}/loan-calculator`,
            mainEntity: {
              '@type': 'SoftwareApplication',
              name: 'Loan Calculator',
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
              },
              description: 'Free online loan calculator for estimating monthly payments, total interest, and amortization schedules for all types of loans.',
              featureList: [
                'Monthly payment calculation',
                'Total interest estimation',
                'Amortization schedule generation',
                'Multiple loan type support',
                'Privacy-focused local calculations'
              ],
              processorRequirements: 'Web browser',
              permission: 'No special permissions required'
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: 'Loan Calculator', item: `${siteUrl}/loan-calculator` }
              ]
            },
            publisher: {
              '@type': 'Organization',
              name: 'Calci Financial Tools',
              url: siteUrl,
              logo: `${siteUrl}/images/logo.png`,
              sameAs: [
                'https://twitter.com/calcifinance',
                'https://www.linkedin.com/company/calci-finance',
                'https://www.facebook.com/calcifinance'
              ]
            }
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowToTool',
            name: 'Loan Calculator',
            description: 'A tool for estimating loan payments, total interest, and creating amortization schedules',
            url: `${siteUrl}/loan-calculator`,
            step: [
              {
                '@type': 'HowToStep',
                name: 'Enter Loan Amount',
                text: 'Input the total loan amount you want to borrow'
              },
              {
                '@type': 'HowToStep',
                name: 'Set Interest Rate',
                text: 'Enter the annual interest rate offered by the lender'
              },
              {
                '@type': 'HowToStep',
                name: 'Choose Loan Term',
                text: 'Select the repayment period in years'
              },
              {
                '@type': 'HowToStep',
                name: 'Calculate Payments',
                text: 'View your estimated monthly payment and total loan cost'
              }
            ],
            tool: ['Loan amount input', 'Interest rate selector', 'Term duration picker', 'Payment calculator'],
            about: {
              '@type': 'Thing',
              name: 'Loan Payment Calculation'
            },
            audience: {
              '@type': 'Audience',
              audienceType: ['Home Buyers', 'Car Shoppers', 'Students', 'Small Business Owners', 'Debt Consolidators']
            }
          })}
        </script>

        {/* Additional FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Is this loan calculator completely free to use?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, our loan calculator is 100% free with no hidden costs, registration requirements, or usage limits. You can calculate loan payments as many times as needed.'
                }
              },
              {
                '@type': 'Question',
                name: 'What types of loans can I calculate with this tool?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'This calculator works for all types of installment loans including mortgages, auto loans, personal loans, student loans, business loans, and home equity loans.'
                }
              },
              {
                '@type': 'Question',
                name: 'How accurate are the loan calculations?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Our calculator uses standard amortization formulas and provides accurate estimates for fixed-rate loans. Actual lender terms may vary based on credit score, fees, and other factors.'
                }
              },
              {
                '@type': 'Question',
                name: 'Does the calculator include taxes and insurance?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'This calculator shows principal and interest payments only. For mortgages, you would need to add property taxes, homeowners insurance, and PMI separately.'
                }
              },
              {
                '@type': 'Question',
                name: 'Can I calculate loans with extra payments?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'This basic calculator shows standard payment schedules. For extra payment calculations and accelerated payoff scenarios, use our advanced amortization calculator.'
                }
              },
              {
                '@type': 'Question',
                name: 'Do you store my loan information?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No, all calculations are performed locally in your browser. We do not store, transmit, or collect any of your financial or loan information.'
                }
              },
              {
                '@type': 'Question',
                name: 'Can I use this for business loan calculations?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, this calculator works for both personal and business loans. Simply enter your loan amount, interest rate, and term to get payment estimates.'
                }
              }
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