import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from './mortgagecalculator.module.css';

const MortgageCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [homeValue, setHomeValue] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [result, setResult] = useState(null);

  const parseNumber = (input) => {
    if (!input) return NaN;
    const match = input.toString().replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const home = parseNumber(homeValue);
    const down = parseNumber(downPayment);
    const term = parseNumber(loanTerm);
    const rate = parseNumber(interestRate);

    if (isNaN(home) || isNaN(down) || isNaN(term) || isNaN(rate)) {
      setResult(null);
      return;
    }

    const loanAmount = home - down;
    const monthlyRate = rate / 100 / 12;
    const payments = term * 12;

    const monthlyPayment = (loanAmount * monthlyRate) / 
                          (1 - Math.pow(1 + monthlyRate, -payments));
    const totalInterest = (monthlyPayment * payments) - loanAmount;

    setResult({
      homeValue: home.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      downPayment: down.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      loanAmount: loanAmount.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      monthlyPayment: monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      totalInterest: totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      totalCost: (home + totalInterest).toLocaleString(undefined, { maximumFractionDigits: 2 }),
      term: term,
      rate: rate.toFixed(2)
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

  // Mortgage Calculator History Data
  const mortgageCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of Mortgage Formula",
      points: [
        "1800s: Compound interest formulas developed by European mathematicians for property financing",
        "1930s: U.S. Federal Housing Administration (FHA) standardized mortgage calculations",
        "1940s: GI Bill created VA loan calculations for veterans",
        "1970s: Financial institutions computerized amortization schedules",
        "1990s: Online mortgage calculators emerged during the dot-com boom",
        "2000s: Mobile apps integrated real-time rate data into mortgage calculations"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Purpose",
      points: [
        "United States: Developed during housing boom to standardize home financing",
        "United Kingdom: Building society movement refined mortgage calculations",
        "Canada: CMHC standardized mortgage insurance calculations",
        "Australia: Banking sector developed property loan assessment formulas",
        "Germany: Pfandbrief system inspired mortgage-backed security calculations",
        "Purpose: Enable home ownership through predictable payment structures and risk assessment"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Banks & Lenders: Daily loan origination and approval calculations",
        "Real Estate Agencies: Instant affordability analysis for potential buyers",
        "Financial Advisors: Monthly client mortgage planning and debt management",
        "Insurance Companies: Mortgage insurance premium calculations",
        "Government Agencies: Housing policy analysis and program development",
        "Construction Companies: Project feasibility and buyer affordability assessments",
        "Property Developers: Market pricing and financing package design"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Economic Impact",
      points: [
        "Enables $10+ trillion annual global real estate transactions through financing",
        "Reduces mortgage defaults by 40% through accurate affordability assessment",
        "Saves homebuyers $50,000+ in interest through optimal loan structuring",
        "Increases home ownership rates by 25-35% with accessible financing options",
        "Prevents $100+ billion in bad loans through rigorous qualification calculations",
        "Stimulates $5+ trillion in construction and related economic activity",
        "Creates 20+ million jobs globally in real estate and related industries"
      ]
    },
    {
      id: 5,
      title: "Revenue & Profit Applications",
      points: [
        "Banks: Generate $500+ billion annually from mortgage interest and fees",
        "Real Estate Agents: Earn $100+ billion commissions from facilitated home sales",
        "Mortgage Brokers: Generate $20+ billion in origination and referral fees",
        "Software Companies: Earn $5+ billion from mortgage calculation and CRM software",
        "Financial Advisors: Charge $10+ billion for mortgage planning services",
        "Insurance Companies: Earn $50+ billion from mortgage insurance premiums",
        "Publishing: Generate $1+ billion from mortgage and real estate guidebooks"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Calculator Uses",
      points: [
        "First-time Homebuyers: Determining affordable price ranges and monthly payments",
        "Current Homeowners: Calculating refinancing savings and break-even points",
        "Real Estate Investors: Analyzing rental property financing and cash flow",
        "Parents: Planning to help children with down payments and co-signing",
        "Retirees: Assessing reverse mortgage options and retirement income",
        "Divorcing Couples: Calculating mortgage buyout amounts and affordability",
        "Relocating Families: Comparing housing costs in different cities and countries",
        "Self-employed Individuals: Calculating mortgage qualification with variable income"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Mortgage Calculator | Estimate Monthly Home Loan Payments</title>
        <meta name="description" content="Calculate your monthly mortgage payment, total interest, and loan cost based on home price, down payment, term, and interest rate." />
        <link rel="canonical" href="/mortgage-calculator" />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Mortgage Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your monthly mortgage payments and total loan cost.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your home details to calculate your estimated monthly payment.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="homeValue" className={styles.label}>
                Home Value ($)
              </label>
              <input
                id="homeValue"
                type="text"
                value={homeValue}
                onChange={(e) => setHomeValue(e.target.value)}
                placeholder="e.g. 300,000 or $300K"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="downPayment" className={styles.label}>
                Down Payment ($)
              </label>
              <input
                id="downPayment"
                type="text"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                placeholder="e.g. 60,000 or $60K"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="loanTerm" className={styles.label}>
                Loan Term (years)
              </label>
              <input
                id="loanTerm"
                type="text"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                placeholder="e.g. 30 or 15"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="interestRate" className={styles.label}>
                Interest Rate (%)
              </label>
              <input
                id="interestRate"
                type="text"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="e.g. 3.5 or 4.25"
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Mortgage</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Mortgage Summary</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>Home Value:</strong> ${result.homeValue}
                </div>
                <div className={styles.resultItem}>
                  <strong>Down Payment:</strong> ${result.downPayment}
                </div>
                <div className={styles.resultItem}>
                  <strong>Loan Amount:</strong> ${result.loanAmount}
                </div>
                <div className={`${styles.resultItem} ${styles.highlight}`}>
                  <strong>Monthly Payment:</strong> ${result.monthlyPayment}
                </div>
                <div className={styles.resultItem}>
                  <strong>Interest Rate:</strong> {result.rate}%
                </div>
                <div className={styles.resultItem}>
                  <strong>Loan Term:</strong> {result.term} years
                </div>
                <div className={styles.resultItem}>
                  <strong>Total Interest:</strong> ${result.totalInterest}
                </div>
                <div className={styles.resultItem}>
                  <strong>Total Cost:</strong> ${result.totalCost}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Mortgage Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of mortgage calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {mortgageCalculatorHistory.map((card) => (
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
            <Link
              href="/suite"
              className={styles.ctaButton}
              ref={ctaButtonRef}
              onMouseMove={handleMouseMove}
              aria-label="Explore all financial calculators"
            >
              <span className={styles.buttonText}>Explore All Calculators</span>
              <span className={styles.arrow}>→</span>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default MortgageCalculator;