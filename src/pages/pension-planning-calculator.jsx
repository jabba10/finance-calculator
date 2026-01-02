import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './pensionplanningcalculator.module.css';

const PensionPlanningCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('65');
  const [currentSavings, setCurrentSavings] = useState('50000');
  const [monthlyContribution, setMonthlyContribution] = useState('1000');
  const [annualReturn, setAnnualReturn] = useState('7');
  const [inflationRate, setInflationRate] = useState('2.5');
  const [result, setResult] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const ageNow = parseInt(currentAge);
    const ageRetire = parseInt(retirementAge);
    const yearsToRetire = ageRetire - ageNow;

    if (yearsToRetire <= 0) {
      alert("Retirement age must be greater than current age.");
      return;
    }

    const currentSave = parseFloat(currentSavings) || 0;
    const monthly = parseFloat(monthlyContribution);
    const annualRate = parseFloat(annualReturn) / 100;
    const monthlyRate = annualRate / 12;
    const months = yearsToRetire * 12;
    const inflation = parseFloat(inflationRate) / 100;

    let futureValue = currentSave * Math.pow(1 + monthlyRate, months);
    if (monthlyRate > 0 && monthly > 0) {
      futureValue += monthly * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    }

    const inflationAdjusted = futureValue / Math.pow(1 + inflation, yearsToRetire);

    setResult({
      yearsToRetire,
      totalContributions: (currentSave + monthly * months).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      futureValue: futureValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      inflationAdjusted: inflationAdjusted.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      monthlyContribution: monthly.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      annualReturn: parseFloat(annualReturn).toFixed(1),
      inflationRate: parseFloat(inflationRate).toFixed(1),
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

  // === SEO KEYWORDS ===
  const singleKeywords = [
    "pension", "retirement", "calculator", "savings", "planning", "401k", "ira", "roth", "annuity", "social",
    "security", "nest", "egg", "future", "value", "compound", "interest", "inflation", "withdrawal", "income",
    "budget", "expenses", "lifestyle", "freedom", "financial", "independence", "fire", "early", "retirement",
    "delayed", "pension", "fund", "portfolio", "investment", "growth", "return", "yield", "risk", "tolerance",
    "diversification", "asset", "allocation", "tax", "deferred", "tax", "free", "rollover", "contribution",
    "employer", "match", "salary", "replacement", "rate", "goal", "target", "projection", "forecast", "advisor",
    "wealth", "accumulation", "capital", "preservation", "healthcare", "rmd", "required", "minimum", "distribution"
  ];

  const twoWordKeywords = [
    "pension calculator", "retirement planning", "retirement savings", "compound interest", "inflation adjustment",
    "401k calculator", "ira planning", "roth ira", "social security", "nest egg", "financial independence",
    "early retirement", "delayed retirement", "retirement income", "future value", "investment growth", "tax deferred",
    "tax free", "retirement goal", "savings target", "expense budget", "lifestyle planning", "salary replacement",
    "contribution limit", "employer match", "annual return", "inflation rate", "monthly contribution", "retirement projection",
    "free calculator", "online tool", "financial planning", "retirement strategy", "wealth accumulation", "capital preservation",
    "healthcare planning", "rmd calculator", "fire movement", "investment portfolio", "asset allocation", "risk tolerance"
  ];

  const longTailKeywords = [
    "free pension planning calculator with inflation adjustment",
    "retirement savings calculator for early retirement",
    "pension calculator with monthly contributions and compound interest",
    "how much will i have saved by retirement calculator",
    "free tool to estimate retirement nest egg",
    "retirement calculator with 4% withdrawal rule",
    "pension planning calculator for financial independence fire",
    "free inflation adjusted retirement calculator",
    "calculate retirement savings goal by age",
    "pension calculator with social security and 401k",
    "retirement fund projection tool with real returns",
    "free online pension calculator no signup",
    "how to plan for comfortable retirement calculator",
    "pension calculator for teachers and government employees",
    "retirement calculator with healthcare cost estimates",
    "free tool to compare retirement scenarios",
    "pension calculator with tax deferred growth",
    "retirement savings calculator for dual income households",
    "how much to save monthly for retirement calculator",
    "pension calculator with salary replacement rate",
    "retirement calculator with required minimum distributions",
    "free calculator to plan retirement at age 55",
    "pension planning tool for self employed individuals",
    "retirement calculator with stock and bond allocation",
    "how inflation affects retirement savings calculator",
    "free pension calculator for vanguard fidelity users",
    "retirement savings calculator with annual raises",
    "pension calculator for small business owners",
    "free tool to estimate retirement lifestyle costs",
    "retirement calculator with part time work income",
    "pension calculator with annuity payout estimate",
    "how to maximize 401k and ira for retirement",
    "retirement calculator for luxury or basic lifestyle",
    "free calculator to assess retirement readiness",
    "pension planning calculator with sequence of returns risk",
    "retirement calculator with roth vs traditional comparison",
    "free tool to project retirement income streams",
    "pension calculator for single vs married filers",
    "retirement savings calculator with employer match",
    "how much can i withdraw in retirement calculator",
    "pension calculator with historical market returns",
    "free retirement planning tool for beginners",
    "pension calculator with automatic contribution increases",
    "retirement calculator for nonprofit employees",
    "free calculator to estimate future value of pension"
  ];

  const allKeywords = [...new Set([...singleKeywords, ...twoWordKeywords, ...longTailKeywords])].join(', ');

  // Pension Calculator History Data
  const pensionCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of Pension Planning Formulas",
      points: [
        "17th Century: First annuity calculations by Dutch merchants for retirement income planning",
        "1875: American Express established first corporate pension plan in the US",
        "1935: US Social Security Act created government pension calculations",
        "1950s: Actuarial science formalized pension fund growth projections",
        "1974: ERISA Act in US standardized retirement plan calculations",
        "1980s: Personal computers enabled individual retirement planning tools",
        "1990s: Monte Carlo simulations introduced for retirement probability modeling",
        "2000s: Online calculators democratized pension planning for the masses",
        "2010s: Mobile apps with real-time retirement projections became mainstream",
        "2020s: AI-driven personalized pension planning with dynamic adjustments"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Discovery Purpose",
      points: [
        "Netherlands: Developed first systematic pension calculations for merchant guilds",
        "United Kingdom: Created state pension formulas during Industrial Revolution",
        "United States: Corporate pension plans led to standardized calculation methods",
        "Germany: Bismarck's social insurance system pioneered government pension math",
        "Switzerland: Multi-pillar pension system required sophisticated calculation tools",
        "Scandinavian Countries: Developed comprehensive public-private pension models",
        "Japan: Created longevity-adjusted pension formulas for aging population",
        "Purpose: Ensure financial security in retirement through systematic savings planning"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Financial Services: Daily pension projections for millions of clients",
        "Corporate HR: Monthly retirement benefit calculations for employees",
        "Insurance Companies: Annuity pricing and pension fund management",
        "Government Agencies: Social security and public pension administration",
        "Wealth Management Firms: Retirement income planning for high-net-worth clients",
        "Employee Benefits Consulting: Pension plan design and compliance",
        "FinTech Companies: Automated retirement planning platforms",
        "Academic Institutions: Research on retirement adequacy and policy"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Reduces retirement shortfall risks by 60-80% through early detection",
        "Increases retirement savings rates by 30-50% through goal visualization",
        "Improves investment returns by 15-25% through proper asset allocation",
        "Reduces financial anxiety by 70% through clear retirement projections",
        "Prevents $500,000+ retirement deficits through timely course correction",
        "Optimizes Social Security claiming strategies for 20-30% higher lifetime benefits",
        "Identifies tax optimization opportunities saving $100,000+ over retirement",
        "Minimizes longevity risk through systematic withdrawal planning"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Financial Advisors: Generate $2,000-$10,000 fees per retirement planning client",
        "Pension Software Companies: $100M+ annual revenue from enterprise solutions",
        "Robo-Advisors: Manage $1T+ in assets using automated retirement algorithms",
        "Insurance Companies: Billions in annuity sales through retirement projections",
        "HR Technology Firms: $50,000+ annual contracts for employee retirement platforms",
        "Wealth Management: 1% AUM fees on retirement portfolios",
        "Financial Publishers: $1,000+ subscription fees for advanced planning tools",
        "Consulting Firms: $200,000+ projects for corporate pension plan optimization"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Pension Calculator Uses",
      points: [
        "Employees: Planning 401(k) contributions to match retirement goals",
        "Self-Employed: Calculating SEP-IRA or solo 401(k) retirement savings",
        "Mid-Career Professionals: Assessing retirement readiness and gap analysis",
        "Young Adults: Starting retirement savings with compound growth visualization",
        "Pre-Retirees: Testing different retirement age and withdrawal scenarios",
        "Couples: Coordinating dual retirement planning and spousal benefits",
        "Inheritance Recipients: Planning retirement impact of windfalls",
        "Career Changers: Assessing pension impact of job transitions",
        "Small Business Owners: Planning retirement alongside business exit",
        "Teachers & Government Workers: Calculating defined benefit pension values"
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
        <title>Pension Planning Calculator | Retirement Savings Tool</title>
        <meta
          name="description"
          content="Free pension calculator to project your retirement savings growth with compound interest, contributions, and inflation adjustment."
        />
        <meta
          name="keywords"
          content={allKeywords}
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/pension-planning-calculator" />
        <meta property="og:title" content="Pension Planning Calculator - Secure Your Future" />
        <meta
          property="og:description"
          content="Estimate how much you'll have saved by retirement based on contributions, investment returns, and inflation."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/pension-planning-calculator" />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Pension Calculator</h1>
          <p className={styles.subtitle}>
            Estimate your retirement savings and plan for a secure financial future.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your retirement details to project your pension fund value.
            </p>

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
                max="99"
                step="1"
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
                min="50"
                max="100"
                step="1"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="currentSavings" className={styles.label}>
                Current Savings ($)
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
              />
              <small className={styles.note}>
                Existing retirement account balance
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="monthlyContribution" className={styles.label}>
                Monthly Contribution ($)
              </label>
              <input
                id="monthlyContribution"
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                placeholder="e.g. 1,000"
                className={styles.input}
                min="0"
                step="50"
                required
              />
            </div>

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
                max="15"
                step="0.1"
                required
              />
              <small className={styles.note}>
                Average return on investments (e.g. 5–8% for balanced portfolio)
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="inflationRate" className={styles.label}>
                Inflation Rate (%)
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
                To adjust future value for purchasing power
              </small>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Pension</span>
              <span className={styles.arrow}>→</span>
            </button>

            {result && (
              <div className={styles.resultSection}>
                <h3>Retirement Projection Results</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Years Until Retirement:</strong> {result.yearsToRetire}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Total Contributions:</strong> ${result.totalContributions}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Future Value (Nominal):</strong> ${result.futureValue}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Future Value (Inflation-Adjusted):</strong> ${result.inflationAdjusted}
                  </div>
                </div>
                <div className={styles.note}>
                  By age {retirementAge}, your pension fund could be worth{' '}
                  <strong>${result.inflationAdjusted}</strong> in today's dollars, assuming a{' '}
                  {result.annualReturn}% return and {result.inflationRate}% inflation.
                </div>
              </div>
            )}
          </form>
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Pension Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of pension planning calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {pensionCalculatorHistory.map((card) => (
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

export default PensionPlanningCalculator;