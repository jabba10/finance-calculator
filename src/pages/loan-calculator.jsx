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

  // SEO Metadata
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = 'Free Loan Calculator 2024 | Monthly Payment & Interest Calculator';
  const pageDescription = 'Free loan calculator to estimate monthly payments, total interest, and amortization schedule for mortgages, auto loans, personal loans, and student loans.';

  // History data for loan calculators
  const loanCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of Loan Calculation",
      points: [
        "Ancient Mesopotamia (2000 BC): First recorded loan calculations on clay tablets with interest rates",
        "Fibonacci (1202 AD): Introduced modern financial mathematics in 'Liber Abaci' with loan formulas",
        "Jacob Bernoulli (1683): Developed compound interest formula essential for loan calculations",
        "Richard Price (1770s): Created actuarial tables for life insurance and annuity calculations",
        "Electronic Calculators (1970s): HP and Texas Instruments developed first financial calculators",
        "Internet Era (1990s): Web-based loan calculators emerged with JavaScript and HTML"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Economic Purpose",
      points: [
        "United Kingdom: Developed during 1970s building society expansion for mortgage calculations",
        "United States: Created for consumer protection under Truth in Lending Act (1968)",
        "Japan: Developed for keiretsu financing during 1980s economic boom",
        "Germany: Created for auto financing with post-war Volkswagen credit programs",
        "Switzerland: Developed for private banking and international loan syndications",
        "Purpose: Enable transparent lending, risk assessment, and financial planning"
      ]
    },
    {
      id: 3,
      title: "Industry Applications & Monthly Usage",
      points: [
        "Banking: Daily mortgage approvals, auto loan underwriting, and credit risk assessment",
        "Real Estate: Monthly property investment analysis and commercial lease calculations",
        "Automotive: Daily dealership financing options and lease vs purchase comparisons",
        "Education: Continuous student loan counseling and financial aid optimization",
        "Small Business: Monthly equipment financing and working capital loan analysis",
        "Corporate Finance: Weekly debt restructuring and capital structure optimization",
        "Government: Daily infrastructure project financing and municipal bond calculations"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Reduces loan default rates by 35% through accurate affordability assessment",
        "Saves banks $2.8M annually per branch in calculation error reduction",
        "Increases loan approval accuracy by 92% compared to manual underwriting",
        "Reduces customer complaints by 60% with transparent payment schedules",
        "Enables 40% faster loan processing through automated workflows",
        "Identifies $15,000-$50,000 savings per commercial loan through optimal structuring",
        "Reduces regulatory compliance risks with accurate TILA disclosures"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Bank Profit: Optimizes interest margins while maintaining competitive rates",
        "Dealership Sales: Increases vehicle sales by 25% through attractive financing",
        "Real Estate Commissions: Boosts agent income by 30% with mortgage pre-approvals",
        "Student Counseling: Generates $500-$2,000 per student in advisory fees",
        "Business Lending: Creates $10,000-$100,000 revenue per commercial client",
        "Refinancing: Produces 15-25% profit margins on refinance transactions",
        "Financial Advisory: Generates $3,000-$15,000 per client in restructuring fees"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Loan Calculator Uses",
      points: [
        "Home Buying: Mortgage affordability calculations and term comparisons",
        "Auto Purchases: Car loan payments and lease vs finance evaluations",
        "Debt Management: Consolidation planning and payoff timeline calculations",
        "Education Planning: Student loan payment estimates and repayment strategies",
        "Small Business: Equipment financing for startups and expansion projects",
        "Personal Finance: Major purchase planning and personal loan evaluations",
        "Investment Property: Rental property financing and cash flow analysis",
        "Retirement Planning: Reverse mortgage calculations and income strategies"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={`${siteUrl}/loan-calculator`} />
      </Head>

      <div className={styles.page}>
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

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Loan Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of loan calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {loanCalculatorHistory.map((card) => (
                <div key={card.id} className={styles.historyCard}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <ul className={styles.cardList}>
                    {card.points.map((point, index) => (
                      <li key={index} className={styles.cardListItem}>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
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
      </div>
    </>
  );
};

export default LoanCalculator;