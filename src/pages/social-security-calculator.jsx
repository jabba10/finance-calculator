import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from './socialsecuritycalculator.module.css';

const SocialSecurityCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [birthYear, setBirthYear] = useState('');
  const [retirementAge, setRetirementAge] = useState('67');
  const [currentAge, setCurrentAge] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const birthYr = parseInt(birthYear) || new Date().getFullYear() - 40;
    const currentYr = new Date().getFullYear();
    const age = parseInt(currentAge) || 40;
    const income = parseFloat(annualIncome) || 50000;
    const retirementYr = birthYr + (parseInt(retirementAge) || 67);
    const yearsToRetirement = Math.max(0, retirementYr - currentYr);
    const fullRetirementAge = parseInt(retirementAge) || 67;

    const averageIndexedMonthlyEarnings = Math.min(Math.max(income, 0), 142800) / 12;
    let benefit;

    if (fullRetirementAge === 67) {
      benefit = averageIndexedMonthlyEarnings * 0.42;
    } else if (fullRetirementAge === 66) {
      benefit = averageIndexedMonthlyEarnings * 0.44;
    } else {
      benefit = averageIndexedMonthlyEarnings * 0.40;
    }

    let adjustmentFactor = 1;
    if (age < fullRetirementAge) {
      const monthsEarly = Math.max(0, (fullRetirementAge - age) * 12);
      adjustmentFactor = 1 - (0.0056 * Math.min(monthsEarly, 36)) - 
                        (0.0042 * Math.max(monthsEarly - 36, 0));
    } else if (age > fullRetirementAge) {
      const monthsLate = Math.max(0, (age - fullRetirementAge) * 12);
      adjustmentFactor = 1 + (0.0067 * Math.min(monthsLate, 36)) + 
                        (0.0042 * Math.max(monthsLate - 36, 0));
    }

    const monthlyBenefit = Math.max(0, benefit * adjustmentFactor);
    const annualBenefit = monthlyBenefit * 12;
    const lifetimeBenefit = annualBenefit * Math.max(0, (21.6 - (age - 62)));

    setResult({
      monthlyBenefit: monthlyBenefit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      annualBenefit: annualBenefit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      lifetimeBenefit: lifetimeBenefit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      fullRetirementAge,
      yearsToRetirement,
      retirementYear: retirementYr,
      currentAge: age,
      birthYear: birthYr
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

  const currentYear = new Date().getFullYear();
  const birthYears = Array.from({ length: 100 }, (_, i) => currentYear - 18 - i);

  // Social Security Calculator History Data
  const socialSecurityCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of Social Security Formula",
      points: [
        "1935: President Franklin D. Roosevelt signed Social Security Act into law",
        "1937: First Social Security taxes collected, first formula developed by economist Edwin Witte",
        "1950s: Amendments introduced bend-point formula for progressive benefits",
        "1970s: Automatic Cost of Living Adjustments (COLAs) formula added",
        "1983: Greenspan Commission reformed formula to address long-term solvency",
        "2000s: Online calculators emerged for personal benefit estimation"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Purpose",
      points: [
        "United States: Created during Great Depression to prevent elderly poverty",
        "Germany: Otto von Bismarck established first social insurance in 1889",
        "United Kingdom: Beveridge Report (1942) inspired modern welfare state",
        "Canada: Old Age Security (OAS) program launched in 1952",
        "Australia: Superannuation system established in 1992",
        "Purpose: Provide retirement income, disability insurance, and survivor benefits"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Financial Advisors: Daily client retirement planning and income projections",
        "HR Departments: Monthly employee retirement education and transition planning",
        "Insurance Companies: Annuity and long-term care product pricing",
        "Government Agencies: Monthly benefit distribution and program forecasting",
        "Retirement Communities: Resident financial qualification assessments",
        "Law Firms: Divorce settlement and survivor benefit calculations",
        "Academic Institutions: Economic research and policy analysis"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Economic Impact",
      points: [
        "Reduces elderly poverty from 35% to under 10% through guaranteed income",
        "Prevents $500 billion+ in welfare costs by keeping seniors self-sufficient",
        "Increases retirement confidence by 60% with predictable income streams",
        "Reduces family financial burdens by $200K+ per elderly household",
        "Stimulates $1.5 trillion in annual economic activity through benefit spending",
        "Prevents 15 million Americans from falling into poverty annually",
        "Provides disability protection for 150+ million workers"
      ]
    },
    {
      id: 5,
      title: "Revenue & Profit Applications",
      points: [
        "Financial Advisors: Generate $3,000-$10,000 fees per client for retirement planning",
        "Software Companies: Earn $50M+ annually from Social Security optimization software",
        "Insurance Agents: Sell $5B+ in annuities complementary to Social Security",
        "Publishing: Generate $20M+ from Social Security planning books and courses",
        "Seminar Companies: Earn $500K+ from retirement planning workshops",
        "Law Firms: Bill $200M+ annually for Social Security disability claims",
        "Media Outlets: Generate millions in ad revenue from retirement content"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Calculator Uses",
      points: [
        "Workers: Planning optimal claiming age for maximum lifetime benefits",
        "Couples: Coordinating spousal and survivor benefit strategies",
        "Divorced Individuals: Calculating benefits from ex-spouse's record",
        "Disabled Workers: Estimating Social Security Disability Insurance (SSDI)",
        "Survivors: Determining benefits after spouse's death",
        "Self-Employed: Planning for retirement without employer pensions",
        "Early Retirees: Estimating benefits with reduced earnings years",
        "Immigrants: Understanding benefits with limited U.S. work history"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Social Security Benefits Calculator | Estimate Retirement Income</title>
        <meta name="description" content="Estimate your future Social Security retirement benefits based on birth year, income, and planned retirement age." />
        <link rel="canonical" href="/social-security-calculator" />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Social Security Benefits Calculator</h1>
          <p className={styles.subtitle}>
            Estimate your future Social Security retirement benefits based on your earnings history.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your details to estimate your Social Security benefits.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="birthYear" className={styles.label}>
                Year of Birth
              </label>
              <select
                id="birthYear"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className={styles.input}
              >
                <option value="">Select year</option>
                {birthYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="currentAge" className={styles.label}>
                Current Age
              </label>
              <input
                id="currentAge"
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
                placeholder="e.g. 45"
                className={styles.input}
                step="any"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="retirementAge" className={styles.label}>
                Planned Retirement Age
              </label>
              <select
                id="retirementAge"
                value={retirementAge}
                onChange={(e) => setRetirementAge(e.target.value)}
                className={styles.input}
              >
                <option value="62">62 (Earliest)</option>
                <option value="63">63</option>
                <option value="64">64</option>
                <option value="65">65</option>
                <option value="66">66</option>
                <option value="67">67 (Full Retirement)</option>
                <option value="68">68</option>
                <option value="69">69</option>
                <option value="70">70 (Maximum)</option>
              </select>
              <small className={styles.note}>Full retirement age depends on birth year</small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="annualIncome" className={styles.label}>
                Current Annual Income ($)
              </label>
              <input
                id="annualIncome"
                type="number"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value)}
                placeholder="e.g. 60000"
                className={styles.input}
                step="any"
              />
              <small className={styles.note}>Up to $142,800 is taxed for Social Security</small>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Benefits</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Benefit Estimate</h3>
              <div className={styles.resultGrid}>
                <div className={`${styles.resultItem} ${styles.highlight}`}>
                  <strong>Monthly Benefit at Retirement:</strong> ${result.monthlyBenefit}
                </div>
                <div className={styles.resultItem}>
                  <strong>Annual Benefit:</strong> ${result.annualBenefit}
                </div>
                <div className={styles.resultItem}>
                  <strong>Full Retirement Age:</strong> {result.fullRetirementAge}
                </div>
                <div className={styles.resultItem}>
                  <strong>Years Until Retirement:</strong> {result.yearsToRetirement}
                </div>
                <div className={styles.resultItem}>
                  <strong>Estimated Lifetime Benefit*:</strong> ${result.lifetimeBenefit}
                </div>
              </div>
              <div className={styles.note}>
                *Based on average life expectancy. Actual benefits depend on earnings history and retirement age.
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Social Security Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of Social Security benefit calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {socialSecurityCalculatorHistory.map((card) => (
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

export default SocialSecurityCalculator;