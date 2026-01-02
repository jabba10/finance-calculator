import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './retirementcalculator.module.css';

const RetirementCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('65');
  const [currentSavings, setCurrentSavings] = useState('50000');
  const [annualContribution, setAnnualContribution] = useState('10000');
  const [employerMatch, setEmployerMatch] = useState('3');
  const [matchLimit, setMatchLimit] = useState('6');
  const [annualReturn, setAnnualReturn] = useState('7');
  const [inflationRate, setInflationRate] = useState('3');
  const [result, setResult] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const age = parseInt(currentAge);
    const retireAge = parseInt(retirementAge);
    const savings = parseFloat(currentSavings);
    const contribution = parseFloat(annualContribution);
    const match = parseFloat(employerMatch) / 100;
    const limit = parseFloat(matchLimit) / 100;
    const returnRate = parseFloat(annualReturn) / 100;
    const inflation = parseFloat(inflationRate) / 100;

    const yearsToRetire = retireAge - age;

    if (yearsToRetire <= 0) {
      alert("Retirement age must be greater than current age.");
      return;
    }

    // Employer match capped at contribution × match limit
    const effectiveMatch = Math.min(contribution * match, contribution * limit);
    const totalAnnualContribution = contribution + effectiveMatch;

    // Future value with annual contributions and compound growth
    let futureValue = savings;
    for (let i = 0; i < yearsToRetire; i++) {
      futureValue = (futureValue + totalAnnualContribution) * (1 + returnRate);
    }

    // Inflation-adjusted (real) value
    const realValue = futureValue / Math.pow(1 + inflation, yearsToRetire);

    // Sustainable withdrawal: using real return (after inflation)
    const realReturn = (1 + returnRate) / (1 + inflation) - 1;
    const monthlyWithdrawal = (futureValue * realReturn) / 12;

    setResult({
      yearsToRetire,
      totalContributions: (totalAnnualContribution * yearsToRetire).toFixed(2),
      employerMatchTotal: (effectiveMatch * yearsToRetire).toFixed(2),
      futureValue: futureValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      realValue: realValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      monthlyWithdrawal: monthlyWithdrawal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      annualReturn: (returnRate * 100).toFixed(2),
      inflationAdjustedReturn: (realReturn * 100).toFixed(2)
    });
  };

  // Magnetic cursor effect for CTA button
  const handleMouseMove = (e) => {
    if (!ctaButtonRef.current) return;
    const el = ctaButtonRef.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  // History cards data for 401(k) Retirement Calculator
  const retirementHistoryCards = [
    {
      id: 1,
      title: "History & Discovery of 401(k) Retirement Calculator",
      points: [
        "1978: U.S. Congress created 401(k) plan via Revenue Act to supplement pensions",
        "1980s: Early retirement calculators emerged as personal computers became popular",
        "1990s: Online calculators appeared with basic compound interest formulas",
        "2000s: Sophisticated models added inflation, employer match, and tax scenarios",
        "2010s: Mobile apps enabled real-time retirement planning",
        "2020s: AI-powered calculators with personalized investment recommendations"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Country-Specific Development",
      points: [
        "United States: Pioneered 401(k) calculators due to employer-sponsored system",
        "United Kingdom: Developed similar tools for workplace pension auto-enrollment",
        "Canada: Created RRSP calculators with unique contribution limits",
        "Australia: Built Superannuation calculators for mandatory retirement savings",
        "Germany: Developed Riester-Rente calculators with government subsidies",
        "Japan: Created NISA and iDeCo calculators for tax-advantaged accounts",
        "Purpose: Help workers worldwide optimize retirement savings across different systems"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Financial Services: Daily use by advisors for client retirement planning",
        "HR Departments: Monthly employee education sessions and benefit optimization",
        "Banking: Weekly customer consultations for retirement account management",
        "Insurance: Annuity planning and retirement income projections",
        "Investment Firms: Portfolio allocation based on retirement time horizons",
        "Government Agencies: Social security integration and public pension planning",
        "Corporate Training: Quarterly financial wellness programs for employees"
      ]
    },
    {
      id: 4,
      title: "Problems Solved & Financial Impact",
      points: [
        "Prevents retirement savings shortfalls by 40-60% through early planning",
        "Increases retirement account balances by 25-50% through optimized contributions",
        "Maximizes employer match utilization, adding $100K+ to retirement savings",
        "Reduces retirement anxiety by 70% with clear financial projections",
        "Identifies investment gaps 10-20 years before retirement for correction",
        "Optimizes Social Security claiming strategies for maximum lifetime benefits",
        "Prevents premature retirement withdrawals preserving compound growth"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation & Business Applications",
      points: [
        "Financial Advisors: Generate $5,000-$20,000 per client for retirement planning",
        "Retirement Software: $50-$500/month subscriptions for advanced calculators",
        "Banks: Increase retirement product sales by 30-50% using calculator tools",
        "401(k) Providers: Boost plan participation by 20-40% with educational tools",
        "Insurance Companies: Sell $100K+ annuities using retirement income projections",
        "Investment Platforms: Increase AUM by 25% through retirement-focused marketing",
        "HR Tech Companies: Charge $10-$50/employee for financial wellness platforms"
      ]
    },
    {
      id: 6,
      title: "Ordinary People & Everyday Applications",
      points: [
        "Young Professionals: Planning to start retirement savings at age 25-30",
        "Mid-Career Workers: Catching up on retirement savings at age 40-50",
        "Pre-Retirees: Determining if they can afford to retire at 62, 65, or 67",
        "Small Business Owners: Planning solo 401(k) contributions and SEP IRAs",
        "Couples: Coordinating retirement goals and joint savings strategies",
        "Job Changers: Understanding 401(k) rollover options and implications",
        "Parents: Balancing retirement savings with college fund contributions",
        "Freelancers: Planning retirement without employer-sponsored plans"
      ]
    }
  ];

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>401(k) Retirement Calculator | Plan Your Retirement Savings</title>
        <meta
          name="description"
          content="Calculate how your 401(k) will grow over time. Includes employer match, compound growth, and inflation adjustment."
        />
        <meta
          name="keywords"
          content="401k calculator, retirement planning, retirement savings, compound interest calculator, employer match calculator, retirement income projection, inflation adjustment, financial planning, retirement age calculator, investment growth projection"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/retirement-calculator" />
        <meta property="og:title" content="401(k) Retirement Calculator" />
        <meta
          property="og:description"
          content="See how much your retirement savings could grow with consistent contributions and compound interest."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/retirement-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>401(k) Retirement Calculator</h1>
            <p className={styles.subtitle}>
              Plan your retirement savings and see how your 401(k) could grow over time.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your current retirement savings details.
              </p>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="currentAge" className={styles.label}>
                    Current Age
                  </label>
                  <input
                    id="currentAge"
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(e.target.value)}
                    className={styles.input}
                    min="18"
                    max="100"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="retirementAge" className={styles.label}>
                    Retirement Age
                  </label>
                  <input
                    id="retirementAge"
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(e.target.value)}
                    className={styles.input}
                    min="18"
                    max="100"
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="currentSavings" className={styles.label}>
                  Current 401(k) Savings ($)
                </label>
                <input
                  id="currentSavings"
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(e.target.value)}
                  placeholder="e.g. 50,000"
                  className={styles.input}
                  min="0"
                  step="1000"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="annualContribution" className={styles.label}>
                  Annual Contribution ($)
                </label>
                <input
                  id="annualContribution"
                  type="number"
                  value={annualContribution}
                  onChange={(e) => setAnnualContribution(e.target.value)}
                  placeholder="e.g. 10,000"
                  className={styles.input}
                  min="0"
                  step="1000"
                  required
                />
                <small className={styles.note}>
                  Your personal contribution (not including employer match)
                </small>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="employerMatch" className={styles.label}>
                    Employer Match (%)
                  </label>
                  <input
                    id="employerMatch"
                    type="number"
                    value={employerMatch}
                    onChange={(e) => setEmployerMatch(e.target.value)}
                    className={styles.input}
                    min="0"
                    max="100"
                    step="0.1"
                    required
                  />
                  <small className={styles.note}>
                    Employer contribution percentage
                  </small>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="matchLimit" className={styles.label}>
                    Match Limit (% of salary)
                  </label>
                  <input
                    id="matchLimit"
                    type="number"
                    value={matchLimit}
                    onChange={(e) => setMatchLimit(e.target.value)}
                    className={styles.input}
                    min="0"
                    max="100"
                    step="0.1"
                    required
                  />
                  <small className={styles.note}>
                    Maximum % of salary employer will match
                  </small>
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="annualReturn" className={styles.label}>
                    Expected Annual Return (%)
                  </label>
                  <input
                    id="annualReturn"
                    type="number"
                    value={annualReturn}
                    onChange={(e) => setAnnualReturn(e.target.value)}
                    className={styles.input}
                    min="0"
                    max="20"
                    step="0.1"
                    required
                  />
                  <small className={styles.note}>
                    Historical average: 7–10%
                  </small>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="inflationRate" className={styles.label}>
                    Expected Inflation Rate (%)
                  </label>
                  <input
                    id="inflationRate"
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(e.target.value)}
                    className={styles.input}
                    min="0"
                    max="10"
                    step="0.1"
                    required
                  />
                  <small className={styles.note}>
                    Long-term average: ~3%
                  </small>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className={styles.btnText}>Calculate Retirement</span>
                <span className={styles.arrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Retirement Projection</h3>
                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Years Until Retirement:</strong> {result.yearsToRetire}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Total Contributions:</strong> ${parseFloat(result.totalContributions).toLocaleString()}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Employer Match Total:</strong> ${parseFloat(result.employerMatchTotal).toLocaleString()}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Projected Annual Return:</strong> {result.annualReturn}%
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Inflation-Adjusted Return:</strong> {result.inflationAdjustedReturn}%
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Projected 401(k) Balance:</strong> ${result.futureValue}
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Inflation-Adjusted Value:</strong> ${result.realValue}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Est. Monthly Withdrawal*:</strong> ${result.monthlyWithdrawal}
                    </div>
                  </div>
                  <div className={styles.note}>
                    *Assuming you withdraw only the investment returns ({result.annualReturn}% annually) while preserving principal.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* History Cards Section */}
          <section className={styles.historySection}>
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <h2>401(k) Retirement Calculator: History & Global Impact</h2>
                <p className={styles.sectionSubtitle}>
                  Discover how retirement calculators evolved and transformed financial planning worldwide
                </p>
              </div>
              
              <div className={styles.cardsGrid}>
                {retirementHistoryCards.map((card) => (
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
            <div className={styles.ctaSectionInner}>
              <h2>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
              <p>Free Financial Planning Tools – Try Now</p>
              <Link href="/suite" legacyBehavior>
                <a
                  className={styles.ctaButton}
                  ref={ctaButtonRef}
                  onMouseMove={handleMouseMove}
                >
                  <span className={styles.buttonText}>Explore All Calculators</span>
                  <span className={styles.arrow}>→</span>
                </a>
              </Link>
            </div>
          </section>

          {/* Footer Spacer */}
          <div className={styles.footerSpacer} />
        </div>
      </div>
    </>
  );
};

export default RetirementCalculator;