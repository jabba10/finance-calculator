import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './taxbracketcalculator.module.css';

const TaxBracketCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [income, setIncome] = useState('');
  const [filingStatus, setFilingStatus] = useState('single');
  const [result, setResult] = useState(null);

  // 2024 U.S. Federal Tax Brackets
  const taxBrackets = {
    single: [
      { rate: 0.10, min: 0, max: 11600 },
      { rate: 0.12, min: 11601, max: 47150 },
      { rate: 0.22, min: 47151, max: 100525 },
      { rate: 0.24, min: 100526, max: 191950 },
      { rate: 0.32, min: 191951, max: 243725 },
      { rate: 0.35, min: 243726, max: 609350 },
      { rate: 0.37, min: 609351, max: Infinity }
    ],
    married: [
      { rate: 0.10, min: 0, max: 23200 },
      { rate: 0.12, min: 23201, max: 94300 },
      { rate: 0.22, min: 94301, max: 201050 },
      { rate: 0.24, min: 201051, max: 383900 },
      { rate: 0.32, min: 383901, max: 487450 },
      { rate: 0.35, min: 487451, max: 731200 },
      { rate: 0.37, min: 731201, max: Infinity }
    ],
    hoh: [
      { rate: 0.10, min: 0, max: 16550 },
      { rate: 0.12, min: 16551, max: 59950 },
      { rate: 0.22, min: 59951, max: 100500 },
      { rate: 0.24, min: 100501, max: 191950 },
      { rate: 0.32, min: 191951, max: 243700 },
      { rate: 0.35, min: 243701, max: 609350 },
      { rate: 0.37, min: 609351, max: Infinity }
    ]
  };

  // Helper: Extract first number from any string
  const parseNumber = (input) => {
    if (!input) return NaN;
    const match = input.toString().replace(/,/g, '').match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(null);

    // Parse income
    const incomeValue = Math.max(0, parseNumber(income) || 0);
    if (incomeValue === 0) {
      alert("Please enter a valid positive income amount.");
      return;
    }

    const brackets = taxBrackets[filingStatus];
    let taxOwed = 0;
    let breakdown = [];
    let marginalRate = 0;

    for (let bracket of brackets) {
      if (incomeValue >= bracket.min) {
        const taxableInBracket = Math.min(incomeValue, bracket.max) - bracket.min + 1;
        const taxInBracket = taxableInBracket * bracket.rate;
        taxOwed += taxInBracket;
        breakdown.push({
          rate: (bracket.rate * 100).toFixed(1),
          amount: taxableInBracket.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          tax: taxInBracket.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        });
        if (incomeValue <= bracket.max) {
          marginalRate = bracket.rate * 100;
        }
      }
    }

    const effectiveRate = (taxOwed / incomeValue) * 100;

    setResult({
      income: incomeValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      taxOwed: taxOwed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      effectiveRate: effectiveRate.toFixed(2),
      marginalRate: marginalRate.toFixed(1),
      breakdown
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

  // Tax Calculator History Data
  const taxCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of Tax Bracket Formulas",
      points: [
        "1862: US Civil War introduced first progressive income tax with 3% rate",
        "1913: 16th Amendment created modern income tax with graduated rates",
        "1940s: WWII expansion added multiple tax brackets for revenue generation",
        "1954: IRS Code formalized systematic tax bracket calculations",
        "1980s: Reagan tax reforms simplified but maintained bracket system",
        "1990s: Personal computers enabled individual tax planning calculators",
        "2000s: Online tax calculators became mainstream with web accessibility",
        "2010s: Mobile apps introduced real-time tax bracket analysis",
        "2020s: AI-driven tax optimization tools with personalized bracket strategies"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Discovery Purpose",
      points: [
        "United Kingdom: First implemented graduated income tax in 1799 during Napoleonic Wars",
        "United States: Progressive tax system formalized with 1913 Revenue Act",
        "Germany: Developed sophisticated bracket systems for social welfare funding",
        "Scandinavia: Created high-progressive systems for comprehensive social services",
        "Japan: Implemented unique bracket structures for aging population support",
        "China: Gradual introduction of progressive tax for economic development",
        "Australia: Simple bracket system with Medicare levy integration",
        "Purpose: Balance revenue generation with social equity through progressive taxation"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Payroll Services: Daily tax withholding calculations for millions of employees",
        "Accounting Firms: Monthly tax planning and quarterly estimated tax payments",
        "Financial Planning: Annual tax optimization for investment and retirement strategies",
        "Corporate Finance: Quarterly tax provision calculations and financial reporting",
        "HR Departments: Monthly payroll tax compliance and employee tax counseling",
        "Tax Software Companies: Year-round tax calculation engine maintenance",
        "Investment Banks: Tax impact analysis for mergers and acquisitions",
        "Government Agencies: Revenue forecasting and tax policy simulation"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Reduces tax liability by 15-30% through proper bracket management",
        "Prevents IRS penalties by ensuring accurate estimated tax payments",
        "Improves cash flow management through predictable tax obligations",
        "Optimizes retirement contributions for maximum tax deferral benefits",
        "Identifies $10,000+ annual savings through bracket-aware income shifting",
        "Minimizes Alternative Minimum Tax (AMT) exposure through proactive planning",
        "Enables strategic charitable giving for optimal tax deduction benefits",
        "Facilitates business structure selection (S-Corp, LLC, etc.) for tax efficiency"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Tax Software: $10B+ annual revenue from TurboTax, H&R Block, and competitors",
        "Accounting Firms: $50,000+ annual fees per corporate tax client",
        "Financial Advisors: 1% AUM fees enhanced by tax-efficient portfolio management",
        "Payroll Companies: $5-10 monthly per employee for tax calculation services",
        "Tax Consulting: $300-500 hourly rates for bracket optimization advice",
        "Educational Platforms: $200-500 course fees for tax planning certification",
        "Government Contractors: Multi-million dollar contracts for tax calculation systems",
        "FinTech Startups: Venture funding based on tax optimization technology"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Tax Calculator Uses",
      points: [
        "Employees: Estimating tax withholding and year-end refunds",
        "Freelancers: Calculating quarterly estimated tax payments",
        "Investors: Planning capital gains tax for stock sales",
        "Homeowners: Deducting mortgage interest and property taxes",
        "Parents: Claiming child tax credits and dependent exemptions",
        "Retirees: Managing Required Minimum Distributions (RMDs) tax impact",
        "Students: Understanding tax implications of scholarships and student loans",
        "Small Business Owners: Choosing between S-Corp and LLC taxation",
        "Real Estate Investors: Calculating depreciation and rental income taxes",
        "Inheritance Recipients: Planning tax on inherited assets"
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
        <title>Tax Bracket Calculator | 2024 Federal Income Tax Estimator</title>
        <meta
          name="description"
          content="Free tax bracket calculator to estimate your federal income tax, effective rate, and marginal tax bracket based on filing status and income."
        />
        <meta
          name="keywords"
          content="tax bracket calculator, federal tax calculator, income tax estimator, marginal tax rate calculator, effective tax rate calculator, 2024 tax brackets, tax planning tool, US tax calculator, progressive tax calculator, tax owed estimator, filing status calculator, single tax bracket, married filing jointly tax, head of household tax, tax rate finder, how much tax will I pay, what is my tax bracket, tax bracket by income, federal income tax calculator, IRS tax calculator, tax liability estimator, tax savings calculator, tax optimization tool, tax rate calculator, calculate my taxes, tax calculator 2024, US federal tax estimator, income tax brackets 2024, marginal vs effective tax rate, tax bracket estimator, tax calculator for salary, salary tax calculator, W-2 tax estimator, tax calculator for freelancers, self-employed tax bracket, tax planning calculator, retirement tax calculator, Roth vs traditional tax impact, capital gains tax vs income tax, tax bracket thresholds, IRS tax brackets, Form 1040 estimator, tax refund estimator, taxable income calculator, tax rate schedule, federal tax rates 2024, tax calculator with deductions, standard deduction impact, tax bracket after 401k, tax calculator after retirement contributions"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/tax-bracket-calculator" />
        <meta property="og:title" content="Tax Bracket Calculator - Estimate Your Taxes" />
        <meta
          property="og:description"
          content="Calculate your federal tax liability, effective rate, and marginal bracket for 2024."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/tax-bracket-calculator" />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Tax Bracket Calculator</h1>
          <p className={styles.subtitle}>
            Estimate your federal income tax, effective rate, and marginal tax bracket.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your annual income — we extract numbers from any format (e.g., $85K, 100,000).
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="income" className={styles.label}>
                Annual Income ($)
              </label>
              <input
                id="income"
                type="text"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="e.g. $85,000 or 85K"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="filingStatus" className={styles.label}>
                Filing Status
              </label>
              <select
                id="filingStatus"
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value)}
                className={styles.input}
              >
                <option value="single">Single</option>
                <option value="married">Married Filing Jointly</option>
                <option value="hoh">Head of Household</option>
              </select>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Tax</span>
              <span className={styles.arrow}>→</span>
            </button>

            {result && (
              <div className={styles.resultSection}>
                <h3>Tax Calculation Results</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Taxable Income:</strong> ${result.income}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Federal Tax Owed:</strong> ${result.taxOwed}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Effective Tax Rate:</strong> {result.effectiveRate}%
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Marginal Tax Rate:</strong> {result.marginalRate}%
                  </div>
                </div>

                <h4 className={styles.breakdownTitle}>Tax Breakdown by Bracket</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Rate</th>
                      <th>Taxable Amount</th>
                      <th>Tax</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.breakdown.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.rate}%</td>
                        <td>${item.amount}</td>
                        <td>${item.tax}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className={styles.note}>
                  You're in the <strong>{result.marginalRate}% marginal bracket</strong>, but your average (effective) rate is{' '}
                  <strong>{result.effectiveRate}%</strong>.
                </div>
              </div>
            )}
          </form>
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Tax Bracket Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of tax bracket calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {taxCalculatorHistory.map((card) => (
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

export default TaxBracketCalculator;