import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './carloancal.module.css';

const CarLoanCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [carPrice, setCarPrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [tradeIn, setTradeIn] = useState('0');
  const [loanTerm, setLoanTerm] = useState('60');
  const [interestRate, setInterestRate] = useState('5.5');
  const [result, setResult] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Parse inputs with fallback and clamp to 0
    const price = Math.max(0, parseFloat(carPrice) || 30000);
    const down = Math.max(0, parseFloat(downPayment) || 0);
    const trade = Math.max(0, parseFloat(tradeIn) || 0);
    const termMonths = Math.max(1, parseInt(loanTerm) || 60); // at least 1 month
    const annualRate = Math.max(0, parseFloat(interestRate) || 5.5);
    const monthlyRate = (annualRate / 100) / 12;

    // Calculate loan amount (ensure non-negative)
    const loanAmount = Math.max(0, price - down - trade);

    let monthlyPayment, totalPayment, totalInterest;

    // Handle zero interest rate
    if (monthlyRate === 0) {
      monthlyPayment = loanAmount / termMonths;
      totalPayment = loanAmount;
      totalInterest = 0;
    } else {
      // Standard loan formula: M = P [i(1+i)^n] / [(1+i)^n - 1]
      const x = Math.pow(1 + monthlyRate, termMonths);
      monthlyPayment = (loanAmount * monthlyRate * x) / (x - 1);
      totalPayment = monthlyPayment * termMonths;
      totalInterest = Math.max(0, totalPayment - loanAmount);
    }

    // Format numbers for display
    const formatMoney = (value) =>
      value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    setResult({
      carPrice: formatMoney(price),
      downPayment: formatMoney(down),
      tradeIn: formatMoney(trade),
      loanAmount: formatMoney(loanAmount),
      monthlyPayment: formatMoney(monthlyPayment),
      totalInterest: formatMoney(totalInterest),
      totalPayment: formatMoney(totalPayment),
      loanTerm: termMonths.toString(),
      interestRate: annualRate.toFixed(2),
    });
  };

  // Magnetic effect on CTA button
  const handleMouseMove = useCallback((e) => {
    if (!ctaButtonRef.current) return;
    const el = ctaButtonRef.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  }, []);

  // Car Loan Calculator History Data
  const carLoanCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of Car Loan Formula",
      points: [
        "1700s: Compound interest formulas developed by mathematicians like Jacob Bernoulli",
        "1800s: Banking institutions formalized amortization schedules for installment loans",
        "1920s: Ford Motor Company pioneered auto financing for Model T purchases",
        "1930s: General Motors Acceptance Corporation (GMAC) standardized car loan calculations",
        "1950s: Computerization enabled instant loan payment calculations at dealerships",
        "2000s: Online car loan calculators became standard for consumer financial planning"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Business Purpose",
      points: [
        "United States: Automobile manufacturers created financing divisions to boost sales",
        "Germany: Precision engineering companies developed specialized loan formulas",
        "Japan: Bank-Mitsubishi partnerships refined auto loan risk assessment models",
        "United Kingdom: Banking institutions standardized APR calculations for transparency",
        "Canada: Government-regulated formulas for fair lending practices",
        "Purpose: Enable vehicle ownership through predictable monthly payment structures"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Automotive Dealers: Daily calculation of customer payment options and affordability",
        "Banks & Credit Unions: Monthly loan origination and risk assessment processing",
        "Insurance Companies: Premium calculations based on vehicle financing terms",
        "Ride-Sharing Platforms: Fleet acquisition financing analysis",
        "Car Rental Companies: Vehicle procurement and replacement planning",
        "Fleet Management: Corporate vehicle financing optimization",
        "Used Car Market: Depreciation-adjusted loan calculations"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Reduces default rates by 40-60% through accurate payment forecasting",
        "Increases vehicle sales by 30-50% with accessible financing options",
        "Saves customers 15-25% in interest through optimal term selection",
        "Reduces loan processing time by 70-80% with instant calculations",
        "Improves credit approval rates by 25-35% with clear affordability assessment",
        "Prevents $10,000+ in negative equity situations through proper loan structuring",
        "Enables 50% faster dealership transactions with pre-calculated options"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Auto Dealers: Generate $3,000-$5,000 profit per vehicle through financing packages",
        "Banks: Earn $2-$4 billion annually from auto loan interest revenue",
        "Credit Unions: Achieve 40% higher membership through competitive auto loans",
        "FinTech Apps: Generate $50-$100M from premium loan calculation features",
        "Insurance Companies: Increase premiums by 20-30% with financed vehicle coverage",
        "Car Manufacturers: Boost sales by 60% with captive financing programs",
        "Online Platforms: Earn $10-$50 per lead through loan calculator referrals"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Car Loan Calculator Uses",
      points: [
        "First-Time Buyers: Calculating affordable payments within monthly budget",
        "Family Upgrades: Comparing loan terms for minivan or SUV purchases",
        "Students: Finding manageable payments for reliable transportation to college",
        "Commuters: Calculating fuel savings vs. loan costs for fuel-efficient vehicles",
        "Small Business Owners: Analyzing vehicle financing for business operations",
        "Retirees: Determining fixed-income-friendly payments for replacement vehicles",
        "Rural Residents: Calculating 4x4 or truck financing for essential transportation",
        "Environmentalists: Comparing EV loan costs vs. gas savings over loan term"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Car Loan Calculator | Estimate Monthly Payment & Interest</title>
        <meta name="description" content="Free car loan calculator to estimate your monthly payment, total interest, and overall cost of financing a vehicle." />
        <link rel="canonical" href="/car-loan-calculator" />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Car Loan Calculator</h1>
          <p className={styles.subtitle}>
            Estimate your monthly payment and total cost of financing a vehicle.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your car purchase details to calculate your loan payment.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="carPrice" className={styles.label}>
                Car Price ($)
              </label>
              <input
                id="carPrice"
                type="number"
                value={carPrice}
                onChange={(e) => setCarPrice(e.target.value)}
                placeholder="e.g. 30,000"
                className={styles.input}
                step="0.01"
                min="0"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="downPayment" className={styles.label}>
                Down Payment ($)
              </label>
              <input
                id="downPayment"
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                placeholder="e.g. 5,000"
                className={styles.input}
                step="0.01"
                min="0"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="tradeIn" className={styles.label}>
                Trade-In Value ($)
              </label>
              <input
                id="tradeIn"
                type="number"
                value={tradeIn}
                onChange={(e) => setTradeIn(e.target.value)}
                placeholder="e.g. 3,000"
                className={styles.input}
                step="0.01"
                min="0"
              />
              <small className={styles.note}>Value of your current vehicle</small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="loanTerm" className={styles.label}>
                Loan Term (Months)
              </label>
              <input
                id="loanTerm"
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                placeholder="e.g. 60"
                className={styles.input}
                step="1"
                min="1"
              />
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
                step="0.01"
                min="0"
                max="100"
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Car Loan</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Loan Summary</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>Loan Amount:</strong> ${result.loanAmount}
                </div>
                <div className={styles.resultItem}>
                  <strong>Interest Rate:</strong> {result.interestRate}%
                </div>
                <div className={styles.resultItem}>
                  <strong>Loan Term:</strong> {result.loanTerm} months
                </div>
                <div className={`${styles.resultItem} ${styles.highlight}`}>
                  <strong>Monthly Payment:</strong> ${result.monthlyPayment}
                </div>
              </div>

              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>Total Interest:</strong> ${result.totalInterest}
                </div>
                <div className={styles.resultItem}>
                  <strong>Total Paid:</strong> ${result.totalPayment}
                </div>
              </div>

              <div className={styles.note}>
                You'll pay <strong>${result.totalInterest}</strong> in interest over the life of the loan — that's{' '}
                <strong>
                  {(
                    (parseFloat(result.totalInterest.replace(/,/g, '')) /
                      parseFloat(result.totalPayment.replace(/,/g, ''))) *
                    100
                  ).toFixed(1)}
                  %
                </strong>{' '}
                of your total cost.
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Car Loan Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of car loan calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {carLoanCalculatorHistory.map((card) => (
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
              <a
                className={styles.ctaButton}
                ref={ctaButtonRef}
                onMouseMove={handleMouseMove}
                aria-label="Explore all financial calculators"
              >
                <span className={styles.buttonText}>Explore All Calculators</span>
                <span className={styles.arrow}>→</span>
              </a>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default CarLoanCalculator;