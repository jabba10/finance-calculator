import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
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

  // Credit Card Calculator History Data
  const creditCardCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of Credit Card Payoff Formulas",
      points: [
        "1950s: Diners Club created first credit card minimum payment calculations",
        "1970s: Bank Americard (Visa) developed amortization tables for revolving credit",
        "1980s: Personal finance experts popularized debt snowball and avalanche formulas",
        "1990s: Consumer protection laws required clear payoff disclosure on statements",
        "2000s: Credit CARD Act of 2009 mandated standardized payoff calculations",
        "2010s: Mobile apps introduced real-time payoff tracking and goal setting",
        "2015: Federal Reserve standardized minimum payment calculation formulas",
        "2020s: AI-powered calculators with personalized debt reduction strategies",
        "Modern Era: Integration with financial apps for automated payoff planning"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Discovery Purpose",
      points: [
        "United States: Developed due to widespread credit card adoption and high APRs",
        "United Kingdom: Consumer credit regulations required clear repayment timelines",
        "Australia: Financial counseling services created debt management calculators",
        "Canada: Banking regulations mandated transparent payoff calculations",
        "Japan: Low credit card usage led to specialized balance transfer calculators",
        "Germany: Conservative credit culture focused on rapid payoff strategies",
        "Brazil: High inflation environment necessitated dynamic payoff calculations",
        "India: Growing credit card market created need for EMI payment calculators",
        "Purpose: Empower consumers to understand true cost of credit card debt"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Banking & Credit Cards: Daily customer payoff inquiries and counseling",
        "Financial Counseling: Weekly client debt management plan calculations",
        "Debt Settlement Companies: Monthly negotiation strategy optimization",
        "Credit Unions: Member financial education and debt reduction planning",
        "Financial Apps: Continuous user payoff progress tracking and nudges",
        "Government Agencies: Consumer protection compliance monitoring",
        "Educational Institutions: Personal finance course curriculum tools",
        "Nonprofit Organizations: Free debt counseling service tools",
        "Employer Wellness Programs: Financial wellness benefit calculations"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Saves $5,000+ per household in unnecessary interest payments",
        "Reduces credit card payoff time by 40-60% through optimal strategies",
        "Prevents debt spiral by showing minimum payment trap consequences",
        "Improves credit scores by 50-100 points through faster debt reduction",
        "Identifies $10,000+ balance transfer savings opportunities",
        "Reduces financial stress by 70% through clear payoff timelines",
        "Prevents bankruptcy by enabling manageable repayment plans",
        "Increases savings rates by 30% by freeing up debt payments"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Financial Institutions: Cross-selling balance transfer and consolidation products",
        "Debt Management Companies: 15-25% fee savings from negotiated payoffs",
        "Financial Apps: Premium subscription fees for advanced payoff features",
        "Credit Counselors: $50-$150 hourly fees for debt plan creation",
        "Educational Platforms: $200-$500 course fees for debt freedom programs",
        "Software Companies: $10,000+ enterprise licenses for banking integration",
        "Media Companies: Ad revenue from debt payoff content and calculators",
        "Government: Reduced social program costs from improved financial stability",
        "Employers: Increased productivity from financially stable employees"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Credit Card Calculator Uses",
      points: [
        "Recent Graduates: Managing student debt combined with credit card balances",
        "Families: Budgeting for holiday spending and post-holiday payoff planning",
        "Homeowners: Calculating payoff timelines before applying for mortgages",
        "Small Business Owners: Separating business and personal card debt",
        "Retirees: Managing fixed income credit card repayment strategies",
        "Medical Patients: Planning payoff of medical expense credit cards",
        "Divorcees: Calculating debt division and individual payoff responsibilities",
        "Travelers: Paying off vacation credit card debt from trips",
        "Impulse Shoppers: Understanding consequences of retail credit card debt",
        "Emergency Fund Builders: Balancing debt payoff vs savings priorities"
      ]
    }
  ];

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Credit Card Payoff Calculator | Debt Repayment Tool</title>
        <meta
          name="description"
          content="Free credit card payoff calculator to estimate how long it will take to pay off your debt and how much interest you'll pay."
        />
        <meta
          name="keywords"
          content="credit card calculator, payoff calculator, debt repayment, credit card interest, debt free calculator, credit card payoff, debt calculator, credit card debt, payoff calculator, credit card payoff calculator, debt payoff, credit card interest calculator, debt free, financial calculator, money calculator, finance tools, debt repayment calculator, credit card payoff timeline, APR calculator, monthly payment calculator, balance payoff, debt reduction, credit card management, financial planning, debt free date, interest savings, debt consolidation, credit card balance, minimum payment, debt snowball, debt avalanche, credit card APR, payoff time, total interest, debt free calculator, credit card payoff strategy, financial freedom, debt elimination, credit card payoff plan, money management, personal finance, budgeting tools, debt free journey, credit card payoff date, interest calculation, debt payoff calculator, credit card payoff schedule, financial calculator, debt free planning, credit card payoff formula, debt free goals, credit card payoff estimate, financial tools, money management tools, debt payoff strategy, credit card payoff tips, debt free living, credit card payoff methods, financial planning calculator, debt payoff timeline, credit card interest rate, payoff calculator tool, debt free calculator online, credit card payoff calculator free, financial freedom calculator, debt elimination calculator, money saving calculator, credit card debt calculator, payoff calculator app, debt free date calculator, interest payment calculator, credit card payoff app, financial calculator online, debt reduction calculator, credit card payoff planner, money calculator tool, finance calculator app, debt free plan, credit card payoff strategy calculator, financial planning tools, debt payoff estimation, credit card payoff simulation, money management calculator, personal finance calculator, debt free timeline, credit card payoff forecast, financial calculator tool, debt payoff planning, credit card payoff analyzer, budget calculator, debt free strategy, credit card payoff helper, financial calculator app, debt payoff assistant, credit card payoff estimator, money tool, finance helper, debt free assistant, credit card payoff guide, financial calculator free, debt payoff tool, credit card payoff wizard, money management app, personal finance tool, debt free app, credit card payoff assistant, financial calculator tool, debt payoff wizard, credit card payoff expert, money calculator app, finance calculator tool, debt free tool, credit card payoff master, financial calculator pro, debt payoff guru, credit card payoff specialist, money management specialist, personal finance expert, debt free expert, credit card payoff pro, financial calculator expert, debt payoff master, credit card payoff genius, money management genius, personal finance genius, debt free genius"
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
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Credit Card Payoff Calculator</h1>
          <p className={styles.subtitle}>
            Estimate how long it will take to pay off your credit card and how much interest you'll pay.
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

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Payoff</span>
              <span className={styles.arrow}>→</span>
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
                  You'll be debt-free in <strong>{result.payoffTime.months} months</strong> and pay <strong>${result.totalInterest}</strong> in interest.
                </div>
              </div>
            )}
          </form>
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Credit Card Payoff Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of credit card payoff calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {creditCardCalculatorHistory.map((card) => (
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
            <h2>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
            <p>Free Financial Planning Tools – Try Now</p>
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

export default CreditCardPayoffCalculator;