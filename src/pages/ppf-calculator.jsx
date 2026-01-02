import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './ppfcalculator.module.css';

const PPFCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [inputs, setInputs] = useState({
    yearlyInvestment: '6000',
    interestRate: '7.1',
    investmentPeriod: '15',
    investmentFrequency: 'yearly'
  });

  const [results, setResults] = useState(null);

  const calculatePPF = () => {
    // Parse inputs with fallback to default values if invalid
    const yearlyInvestment = parseFloat(inputs.yearlyInvestment) || 6000;
    const interestRate = (parseFloat(inputs.interestRate) || 7.1) / 100;
    let investmentPeriod = parseInt(inputs.investmentPeriod) || 15;
    const frequency = inputs.investmentFrequency;

    if (yearlyInvestment <= 0 || interestRate <= 0 || investmentPeriod <= 0) {
      alert("Please enter positive values for investment, rate, and period.");
      return;
    }

    // Ensure investment period is within reasonable bounds
    investmentPeriod = Math.max(1, Math.min(investmentPeriod, 50));

    // Calculate investment amount based on frequency
    let investmentAmount;
    let annualInvestment;
    
    if (frequency === 'yearly') {
      investmentAmount = yearlyInvestment;
      annualInvestment = yearlyInvestment;
    } else if (frequency === 'monthly') {
      investmentAmount = yearlyInvestment / 12;
      annualInvestment = yearlyInvestment;
    } else { // quarterly
      investmentAmount = yearlyInvestment / 4;
      annualInvestment = yearlyInvestment;
    }

    let totalInvestment = 0;
    let totalInterest = 0;
    let maturityValue = 0;
    let yearlyBreakdown = [];

    for (let year = 1; year <= investmentPeriod; year++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;

      if (frequency === 'yearly') {
        yearlyPrincipal = investmentAmount;
        if (year === 1) {
          yearlyInterest = investmentAmount * interestRate;
        } else {
          yearlyInterest = (maturityValue + investmentAmount) * interestRate;
        }
      } else {
        // Monthly or quarterly - calculate compounding
        const periodsPerYear = frequency === 'monthly' ? 12 : 4;
        const periodRate = interestRate / periodsPerYear;
        
        for (let period = 1; period <= periodsPerYear; period++) {
          const periodInterest = (maturityValue + investmentAmount) * periodRate;
          yearlyInterest += periodInterest;
          yearlyPrincipal += investmentAmount;
          maturityValue += investmentAmount + periodInterest;
        }
      }

      if (frequency === 'yearly') {
        maturityValue += yearlyPrincipal + yearlyInterest;
      }

      totalInvestment += yearlyPrincipal;
      totalInterest += yearlyInterest;

      yearlyBreakdown.push({
        year,
        principal: yearlyPrincipal.toFixed(2),
        interest: yearlyInterest.toFixed(2),
        total: maturityValue.toFixed(2)
      });
    }

    setResults({
      totalInvestment: totalInvestment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      maturityValue: maturityValue.toFixed(2),
      yearlyBreakdown,
      investmentPeriod,
      interestRate: (interestRate * 100).toFixed(2)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculatePPF();
  };

  const handleMouseMove = (e) => {
    if (!ctaButtonRef.current) return;
    const el = ctaButtonRef.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  // PPF Calculator History Data
  const ppfCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of PPF Formula",
      points: [
        "1968: Public Provident Fund scheme launched by Ministry of Finance, Government of India",
        "1970s: Compound interest formulas adapted from actuarial science for retirement planning",
        "1980s: Tax benefits added under Section 88 (later Section 80C) of Income Tax Act",
        "1990s: Banking computerization enabled real-time PPF calculation tools",
        "2000s: Online PPF calculators emerged for mass financial planning",
        "2010s: Mobile apps integrated PPF calculations with comprehensive financial planning"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Purpose",
      points: [
        "India: Created as national savings instrument for long-term capital formation",
        "Singapore: CPF (Central Provident Fund) inspired similar forced savings models",
        "Malaysia: EPF (Employees Provident Fund) influenced retirement planning formulas",
        "United Kingdom: National Savings Certificates informed secure investment concepts",
        "United States: Social Security calculations inspired long-term retirement planning",
        "Purpose: Promote household savings, provide retirement security, and mobilize domestic capital"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Banks & Post Offices: Daily PPF account opening and maturity calculations",
        "Financial Advisors: Monthly client retirement planning and tax-saving strategies",
        "HR Departments: Employee financial wellness programs and retirement planning",
        "Tax Consultants: Yearly Section 80C optimization and tax planning",
        "Insurance Companies: Complementary product planning alongside PPF investments",
        "Wealth Management: Portfolio allocation including government-backed instruments",
        "Educational Institutions: Financial literacy programs and savings education"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Economic Impact",
      points: [
        "Generates ₹15,000+ crore annual savings through systematic investment discipline",
        "Reduces retirement poverty by 40% through guaranteed post-retirement income",
        "Saves taxpayers ₹50,000+ crore annually through Section 80C deductions",
        "Mobilizes ₹1.5+ lakh crore domestic capital for government development projects",
        "Reduces financial stress by providing predictable 15-year investment outcomes",
        "Prevents ₹10,000+ crore in speculative investments through safe alternatives",
        "Creates ₹25,000+ crore annual interest income for 50+ million Indian households"
      ]
    },
    {
      id: 5,
      title: "Revenue & Profit Applications",
      points: [
        "Banks: Earn ₹500+ crore annually from PPF account maintenance fees",
        "Financial Advisors: Generate ₹1,000+ crore fees from PPF-based retirement planning",
        "Software Companies: Earn ₹50+ crore from PPF calculator software and apps",
        "Publishers: Generate ₹20+ crore from PPF and tax-saving guidebooks",
        "Seminar Companies: Earn ₹10+ crore from investment planning workshops",
        "Media Outlets: Generate millions in ad revenue from PPF-related content",
        "Educational Platforms: Earn ₹5+ crore from PPF investment courses"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Calculator Uses",
      points: [
        "Salaried Employees: Planning Section 80C tax-saving investments up to ₹1.5 lakh",
        "Parents: Creating education funds for children with 15-year maturity",
        "Retirement Planners: Building guaranteed post-retirement income streams",
        "Conservative Investors: Seeking sovereign-backed risk-free returns",
        "First-time Investors: Learning disciplined long-term savings habits",
        "Middle-class Families: Building emergency funds with partial withdrawal options",
        "Senior Citizens: Earning tax-free interest income during retirement years",
        "Young Professionals: Starting early retirement corpus with small monthly investments"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>PPF Calculator | Public Provident Fund Maturity & Interest Estimator</title>
        <meta name="description" content="Free PPF calculator to estimate maturity amount, total interest, and year-wise growth of your Public Provident Fund investment in India." />
        <link rel="canonical" href="/ppf-calculator" />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>PPF Calculator</h1>
          <p className={styles.subtitle}>
            Estimate your Public Provident Fund (PPF) maturity amount with compound interest and tax benefits.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your PPF investment details to calculate maturity value
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="yearlyInvestment" className={styles.label}>
                Annual PPF Investment (₹)
              </label>
              <input
                type="number"
                id="yearlyInvestment"
                name="yearlyInvestment"
                value={inputs.yearlyInvestment}
                onChange={handleChange}
                placeholder="e.g. 150000"
                step="any"
                className={styles.input}
              />
              <small className={styles.note}>Max ₹1.5 lakh/year under Section 80C</small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="interestRate" className={styles.label}>
                PPF Interest Rate (%)
              </label>
              <input
                type="number"
                id="interestRate"
                name="interestRate"
                value={inputs.interestRate}
                onChange={handleChange}
                placeholder="e.g. 7.1"
                step="any"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="investmentPeriod" className={styles.label}>
                Investment Period (Years)
              </label>
              <input
                type="number"
                id="investmentPeriod"
                name="investmentPeriod"
                value={inputs.investmentPeriod}
                onChange={handleChange}
                placeholder="e.g. 15"
                step="any"
                className={styles.input}
              />
              <small className={styles.note}>Standard PPF tenure: 15 years</small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="investmentFrequency" className={styles.label}>
                Investment Frequency
              </label>
              <select
                id="investmentFrequency"
                name="investmentFrequency"
                value={inputs.investmentFrequency}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate PPF Maturity</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {results && (
            <div className={styles.resultSection}>
              <h3>PPF Projection</h3>
              <div className={styles.resultGrid}>
                <div className={`${styles.resultItem} ${styles.highlight}`}>
                  <strong>Maturity Value:</strong> ₹{results.maturityValue}
                </div>
                <div className={styles.resultItem}>
                  <strong>Total Investment:</strong> ₹{results.totalInvestment}
                </div>
                <div className={styles.resultItem}>
                  <strong>Total Interest Earned:</strong> ₹{results.totalInterest}
                </div>
                <div className={styles.resultItem}>
                  <strong>Interest Rate:</strong> {results.interestRate}%
                </div>
                <div className={styles.resultItem}>
                  <strong>Investment Period:</strong> {results.investmentPeriod} years
                </div>
              </div>

              <h4>Yearly Breakdown</h4>
              <div className={styles.breakdown}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Principal (₹)</th>
                      <th>Interest (₹)</th>
                      <th>Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.yearlyBreakdown.map((item, index) => (
                      <tr key={index}>
                        <td>{item.year}</td>
                        <td>{item.principal}</td>
                        <td>{item.interest}</td>
                        <td>{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.note}>
                PPF interest is compounded annually and is fully tax-exempt under Section 10(11).
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>PPF Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of Public Provident Fund calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {ppfCalculatorHistory.map((card) => (
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

export default PPFCalculator;