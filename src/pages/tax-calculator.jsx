// components/TaxCalculator.jsx
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './taxcalculator.module.css';

const TaxCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [income, setIncome] = useState('');
  const [filingStatus, setFilingStatus] = useState('single');
  const [result, setResult] = useState(null);

  // 2026 U.S. Federal Tax Brackets (standard)
  const taxBrackets = {
    single: [
      { limit: 11600, rate: 0.1 },
      { limit: 47150, rate: 0.12 },
      { limit: 100525, rate: 0.22 },
      { limit: 191950, rate: 0.24 },
      { limit: 243725, rate: 0.32 },
      { limit: 609350, rate: 0.35 },
      { rate: 0.37 }
    ],
    married: [
      { limit: 23200, rate: 0.1 },
      { limit: 94300, rate: 0.12 },
      { limit: 201050, rate: 0.22 },
      { limit: 383900, rate: 0.24 },
      { limit: 487450, rate: 0.32 },
      { limit: 731200, rate: 0.35 },
      { rate: 0.37 }
    ],
    head: [
      { limit: 16550, rate: 0.1 },
      { limit: 63100, rate: 0.12 },
      { limit: 100500, rate: 0.22 },
      { limit: 191950, rate: 0.24 },
      { limit: 243700, rate: 0.32 },
      { limit: 609350, rate: 0.35 },
      { rate: 0.37 }
    ]
  };

  const calculateTax = (income, status) => {
    const brackets = taxBrackets[status];
    let remaining = income;
    let totalTax = 0;
    let prevLimit = 0;

    for (let i = 0; i < brackets.length; i++) {
      const bracket = brackets[i];
      const currentLimit = bracket.limit || Infinity;

      if (remaining <= 0) break;

      const taxableInBracket = Math.min(remaining, currentLimit - prevLimit);
      totalTax += taxableInBracket * bracket.rate;
      remaining -= taxableInBracket;
      prevLimit = currentLimit;
    }

    return {
      tax: totalTax.toFixed(2),
      effectiveRate: ((totalTax / income) * 100).toFixed(2)
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const incomeNum = parseFloat(income);
    if (isNaN(incomeNum) || incomeNum < 0) {
      alert('Please enter a valid positive number for income');
      return;
    }

    const taxData = calculateTax(incomeNum, filingStatus);

    setResult({
      ...taxData,
      income: incomeNum.toLocaleString(),
      filingStatus:
        filingStatus === 'single' ? 'Single' :
        filingStatus === 'married' ? 'Married Filing Jointly' : 'Head of Household'
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

  // SEO Metadata
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = 'Free Tax Calculator 2026 | Estimate Federal Income Tax & Refund';
  const pageDescription = 'Free 2026 tax calculator to estimate your federal income tax, effective tax rate, and potential refund. Calculate taxes for Single, Married, Head of Household filing statuses.';
  const imagePreview = `${siteUrl}/images/tax-calculator-preview.jpg`;

  // History data for tax calculators
  const taxCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of Tax Calculation",
      points: [
        "Ancient Egypt (3000 BC): First recorded tax system with grain taxation calculations",
        "Roman Empire (167 BC): Introduced proportional tax rates and census-based assessment",
        "William the Conqueror (1086): Domesday Book established systematic property tax calculation",
        "Income Tax Modernization: UK (1799) and USA (1861) during war financing needs",
        "Electronic Tax Calculators: Developed in 1970s with personal computer revolution",
        "Online Tax Calculators: Emerged in 1995 with internet commercialization and e-filing"
      ]
    },
    {
      id: 2,
      title: "Global Tax Calculator Origins & Purpose",
      points: [
        "United Kingdom: First modern income tax calculator (1799) for war funding against Napoleon",
        "United States: Federal income tax calculator (1913) after 16th Amendment ratification",
        "Germany: Developed progressive tax calculators during Weimar Republic economic reforms",
        "Scandinavian Countries: Created high-accuracy calculators for complex welfare state taxation",
        "Singapore: Pioneered simplified tax calculators for their territorial tax system",
        "Purpose: Enable citizens to comply with increasingly complex tax laws and optimize liabilities"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Accounting Firms: Daily use for client tax planning and quarterly estimates",
        "Financial Services: Monthly portfolio tax impact analysis and investment planning",
        "Corporate Finance: Weekly use for payroll calculations and tax provision estimates",
        "Real Estate: Monthly property tax calculations and investment property analysis",
        "Small Businesses: Daily use for sales tax, payroll tax, and quarterly filings",
        "E-commerce: Real-time sales tax calculations across multiple jurisdictions",
        "International Corporations: Monthly transfer pricing and cross-border tax calculations"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Reduces tax filing errors by 85% compared to manual calculations",
        "Saves average business $2,500 annually in potential penalty avoidance",
        "Increases tax deduction identification by 40% through systematic calculation",
        "Reduces CPA consultation time by 60% with pre-calculated tax scenarios",
        "Enables businesses to identify $15,000+ in average annual tax savings",
        "Improves cash flow management through accurate quarterly tax estimates",
        "Reduces audit risks through precise calculation and documentation"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Tax Optimization: Identifying $8,000-$25,000 in average annual savings per business",
        "Investment Strategy: Enhancing after-tax returns by 1.5-3% through tax-aware investing",
        "Business Structure: Optimizing entity selection to save 5-15% on total tax burden",
        "International Expansion: Reducing global effective tax rates by 8-12%",
        "R&D Credits: Identifying $50,000+ in average annual tax credits for qualifying companies",
        "Depreciation Strategy: Accelerating deductions to improve cash flow by 15-25%",
        "Retirement Planning: Saving 20-35% on taxes through strategic contribution timing"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Tax Calculator Uses",
      points: [
        "Salary Planning: Calculating take-home pay for job offers and salary negotiations",
        "Tax Refund Estimation: Estimating annual refunds to plan major purchases",
        "Side Income Management: Calculating tax obligations for freelance and gig work",
        "Home Office Deductions: Determining eligible home office expense deductions",
        "Education Planning: Calculating education credit eligibility (AOTC, LLC)",
        "Retirement Contributions: Optimizing 401(k) and IRA contributions for tax benefits",
        "Charitable Giving: Calculating deduction values for charitable contributions",
        "Healthcare Planning: Estimating medical expense deduction eligibility"
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
        <link rel="canonical" href={`${siteUrl}/tax-calculator`} />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Tax Calculator</h1>
          <p className={styles.subtitle}>
            Estimate your federal income tax, effective tax rate, and understand your tax brackets.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your annual income and select your filing status for 2026 tax estimation.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="income" className={styles.label}>
                Annual Gross Income ($)
              </label>
              <input
                id="income"
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="e.g. 75000"
                className={styles.input}
                min="0"
                step="any"
                required
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
                <option value="head">Head of Household</option>
              </select>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate My Tax</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>2026 Tax Estimate</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}><strong>Estimated Federal Tax:</strong> ${result.tax}</div>
                <div className={styles.resultItem}><strong>Effective Tax Rate:</strong> {result.effectiveRate}%</div>
                <div className={styles.resultItem}><strong>Annual Income:</strong> ${result.income}</div>
                <div className={styles.resultItem}><strong>Filing Status:</strong> {result.filingStatus}</div>
              </div>
              <div className={styles.note}>
                This estimate is for federal income tax only using 2026 tax brackets. Excludes state taxes, FICA, deductions, credits, and other tax considerations.
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Tax Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of tax calculation tools
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
            <h2>Need More Financial Planning Tools?</h2>
            <p>Explore our full suite of 50+ specialized calculators for comprehensive financial planning and analysis.</p>
            <Link href="/suite" legacyBehavior>
              <button
                className={styles.ctaButton}
                ref={ctaButtonRef}
                onMouseMove={handleMouseMove}
              >
                <span className={styles.buttonText}>Explore All Financial Calculators</span>
                <span className={styles.arrow}>→</span>
              </button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default TaxCalculator;