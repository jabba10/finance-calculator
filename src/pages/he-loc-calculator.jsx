import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from './helloccalculator.module.css';

const HELOCCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [inputs, setInputs] = useState({
    homeValue: '400000',
    mortgageBalance: '250000',
    creditLimit: '80',
    interestRate: '6.5',
    drawPeriodYears: '10',
    repaymentYears: '15'
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const calculateHELOC = () => {
    const parseInput = (value) => {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    };

    const homeValue = parseInput(inputs.homeValue);
    const mortgageBalance = parseInput(inputs.mortgageBalance);
    const creditLimitPercent = parseInput(inputs.creditLimit) / 100;
    const interestRate = parseInput(inputs.interestRate) / 100;
    const drawPeriod = parseInput(inputs.drawPeriodYears) || 10;
    const repaymentPeriod = parseInput(inputs.repaymentYears) || 15;

    const maxHELOCLimit = homeValue * creditLimitPercent - mortgageBalance;
    const availableCredit = Math.max(maxHELOCLimit, 0);

    let interestOnlyPayment = 0;
    let amortizingPayment = 0;

    if (availableCredit > 0 && interestRate > 0) {
      const monthlyInterestRate = interestRate / 12;
      interestOnlyPayment = availableCredit * monthlyInterestRate;

      const totalRepaymentMonths = repaymentPeriod * 12;
      if (totalRepaymentMonths > 0) {
        amortizingPayment = availableCredit *
          (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalRepaymentMonths)) /
          (Math.pow(1 + monthlyInterestRate, totalRepaymentMonths) - 1);
      }
    }

    setResult({
      homeValue: homeValue.toLocaleString(),
      mortgageBalance: mortgageBalance.toLocaleString(),
      ltv: (creditLimitPercent * 100).toFixed(1),
      availableCredit: availableCredit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      interestOnlyPayment: interestOnlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      amortizingPayment: amortizingPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      interestRate: inputs.interestRate || '0',
      drawPeriod,
      repaymentPeriod
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateHELOC();
  };

  const handleMouseMove = (e) => {
    const el = ctaButtonRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty('--x', `${x}px`);
      el.style.setProperty('--y', `${y}px`);
    }
  };

  // HELOC Calculator History Data
  const helocCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of HELOC Calculator",
      points: [
        "1970s: First home equity lines emerged in California banking system",
        "1980s: Tax Reform Act made HELOCs popular for interest deductibility",
        "1990s: Online HELOC calculators developed by mortgage lenders",
        "2000s: Real-time equity calculation tools integrated into banking websites",
        "2010s: Mobile apps with HELOC calculators for instant pre-approval",
        "2020s: AI-powered HELOC calculators for personalized credit limits"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Financial Purpose",
      points: [
        "United States: Pioneered by savings and loans institutions in California",
        "Canada: Similar Home Equity Line of Credit (HELOC) products called 'readvanceable mortgages'",
        "Australia: 'Equity mate' calculators developed for property investment",
        "United Kingdom: Remortgage calculators with equity release features",
        "Germany: Pfandbrief-based home equity calculation systems",
        "Purpose: Enable homeowners to access built-up equity without selling property"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Banks: Daily calculation of customer equity positions for credit offers",
        "Mortgage Lenders: Weekly HELOC pre-approval processing for existing customers",
        "Real Estate Agencies: Monthly equity analysis for client financial planning",
        "Financial Advisors: Quarterly retirement planning using home equity",
        "Renovation Contractors: Project financing calculations for client proposals",
        "Debt Consolidation Services: Weekly debt repayment planning using equity",
        "Wealth Management: Annual review of home equity in net worth statements"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Reduces loan application time from weeks to minutes with instant calculations",
        "Increases HELOC approval rates by 40% through accurate equity assessment",
        "Saves homeowners 2-4% interest vs. credit cards through better financing",
        "Generates $10,000+ average fee income per HELOC for banks",
        "Creates $50 billion annual market in home equity lending",
        "Enables $100,000+ home improvement projects through accessible financing",
        "Reduces financial stress by providing emergency fund alternatives"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Banks: Earn 3-6% interest spreads on $100,000 average HELOC balances",
        "Mortgage Brokers: Receive 1-2% origination fees on HELOC transactions",
        "FinTech Apps: Charge $5-$20/month for premium HELOC management features",
        "Real Estate Platforms: Generate leads worth $200-$500 each for lenders",
        "Financial Advisors: Charge 1% AUM fees on equity-based investment portfolios",
        "Insurance Companies: Sell $500-$2000 annual policies for HELOC protection",
        "Software Providers: License HELOC calculation engines for $50k-$500k/year"
      ]
    },
    {
      id: 6,
      title: "Ordinary People HELOC Calculator Uses",
      points: [
        "Homeowners: Calculating available equity for kitchen or bathroom renovations",
        "Parents: Financing college education through home equity instead of student loans",
        "Entrepreneurs: Starting small businesses using home equity as capital",
        "Retirees: Creating supplemental retirement income through equity access",
        "Debt Consolidators: Paying off high-interest credit cards with lower HELOC rates",
        "Real Estate Investors: Calculating leverage for additional property purchases",
        "Medical Expense Planners: Covering unexpected healthcare costs",
        "Wedding Planners: Financing dream weddings through home equity"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>HELOC Calculator | Estimate Home Equity Line of Credit</title>
        <meta name="description" content="Calculate your HELOC limit, interest-only payments, and amortizing repayment. Free, responsive, professional tool for homeowners." />
        <link rel="canonical" href="https://www.financecalculatorfree.com/heloccalculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          {/* Hero */}
          <section className={styles.hero}>
            <h1 className={styles.title}>HELOC Calculator</h1>
            <p className={styles.subtitle}>
              Estimate your Home Equity Line of Credit (HELOC) limit and payments.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your home equity details to calculate available credit and payments.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="homeValue" className={styles.label}>Current Home Value ($)</label>
                <input
                  type="number"
                  id="homeValue"
                  name="homeValue"
                  value={inputs.homeValue}
                  onChange={handleChange}
                  placeholder="e.g. 400000"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="mortgageBalance" className={styles.label}>Outstanding Mortgage Balance ($)</label>
                <input
                  type="number"
                  id="mortgageBalance"
                  name="mortgageBalance"
                  value={inputs.mortgageBalance}
                  onChange={handleChange}
                  placeholder="e.g. 250000"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="creditLimit" className={styles.label}>Max LTV for HELOC (%)</label>
                <input
                  type="number"
                  id="creditLimit"
                  name="creditLimit"
                  value={inputs.creditLimit}
                  onChange={handleChange}
                  placeholder="e.g. 80"
                  step="0.1"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="interestRate" className={styles.label}>Estimated Interest Rate (%)</label>
                <input
                  type="number"
                  id="interestRate"
                  name="interestRate"
                  value={inputs.interestRate}
                  onChange={handleChange}
                  placeholder="e.g. 6.5"
                  step="0.01"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="drawPeriodYears" className={styles.label}>Draw Period (Years)</label>
                <input
                  type="number"
                  id="drawPeriodYears"
                  name="drawPeriodYears"
                  value={inputs.drawPeriodYears}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="repaymentYears" className={styles.label}>Repayment Period (Years)</label>
                <input
                  type="number"
                  id="repaymentYears"
                  name="repaymentYears"
                  value={inputs.repaymentYears}
                  onChange={handleChange}
                  placeholder="e.g. 15"
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className={styles.btnText}>Calculate HELOC</span>
                <span className={styles.arrow}>→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>HELOC Summary</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Home Value:</strong> ${result.homeValue}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Mortgage Balance:</strong> ${result.mortgageBalance}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Available HELOC:</strong> ${result.availableCredit}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Interest Rate:</strong> {result.interestRate}%
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Draw Period:</strong> {result.drawPeriod} years
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Repayment Period:</strong> {result.repaymentPeriod} years
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Monthly (Draw):</strong> ${result.interestOnlyPayment}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Monthly (Repayment):</strong> ${result.amortizingPayment}
                  </div>
                </div>
                <p className={styles.note}>
                  During the draw period, you typically pay interest only. In repayment, principal is amortized.
                </p>
              </div>
            )}
          </div>

          {/* History Cards Section */}
          <section className={styles.historySection}>
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <h2>HELOC Calculator History & Global Applications</h2>
                <p className={styles.sectionSubtitle}>
                  Explore the evolution and worldwide impact of home equity line of credit calculation tools
                </p>
              </div>
              
              <div className={styles.cardsGrid}>
                {helocCalculatorHistory.map((card) => (
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
            <h2>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
            <p>Free Financial Planning Tools – Try Now</p>
            <Link
              href="/suite"
              className={styles.ctaButton}
              ref={ctaButtonRef}
              onMouseMove={handleMouseMove}
            >
              <span className={styles.buttonText}>Explore All Calculators</span>
              <span className={styles.arrow}>→</span>
            </Link>
          </section>
        </div>
      </div>
    </>
  );
};

export default HELOCCalculator;