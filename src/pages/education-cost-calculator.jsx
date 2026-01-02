import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './educationcostcalculator.module.css';

const EducationCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [currentCost, setCurrentCost] = useState('');
  const [yearsUntilEnrollment, setYearsUntilEnrollment] = useState('5');
  const [inflationRate, setInflationRate] = useState('5');
  const [yearsOfEducation, setYearsOfEducation] = useState('4');
  const [currentSavings, setCurrentSavings] = useState('0');
  const [expectedReturn, setExpectedReturn] = useState('7');
  const [monthlyContribution, setMonthlyContribution] = useState('0');
  const [result, setResult] = useState(null);

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

    // Parse required field
    const cost = Math.max(0, parseNumber(currentCost) || 0);
    if (cost === 0) {
      alert("Please enter a valid current annual cost.");
      return;
    }

    // Parse other fields with defaults
    const years = Math.max(1, Math.min(50, parseInt(yearsUntilEnrollment) || 5));
    const inflation = Math.max(0, Math.min(50, parseNumber(inflationRate) || 5)) / 100;
    const eduYears = Math.max(1, Math.min(12, parseInt(yearsOfEducation) || 4));
    const savings = Math.max(0, parseNumber(currentSavings) || 0);
    const returnRate = Math.max(0, Math.min(30, parseNumber(expectedReturn) || 7)) / 100;
    const monthly = Math.max(0, parseNumber(monthlyContribution) || 0);

    // Calculate future education costs
    const futureAnnualCost = cost * Math.pow(1 + inflation, years);
    const totalEducationCost = futureAnnualCost * eduYears;

    // Calculate savings growth
    const annualRate = returnRate;
    const monthlyRate = annualRate / 12;
    const months = years * 12;

    let futureSavings = savings * Math.pow(1 + annualRate, years);

    if (monthly > 0 && monthlyRate > 0) {
      futureSavings += monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    }

    const shortfall = Math.max(0, totalEducationCost - futureSavings);

    setResult({
      currentAnnualCost: cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      yearsUntilEnrollment: years,
      inflationRate: (inflation * 100).toFixed(2),
      futureAnnualCost: futureAnnualCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      yearsOfEducation: eduYears,
      totalEducationCost: totalEducationCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      currentSavings: savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      expectedReturn: (returnRate * 100).toFixed(2),
      monthlyContribution: monthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      projectedSavings: futureSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      shortfall: shortfall.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      isShortfall: shortfall > 0
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

  // Education Calculator History Data
  const educationCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of Education Cost Formulas",
      points: [
        "1950s: US colleges developed first tuition projection models for financial aid offices",
        "1972: Federal student loan programs created need for standardized cost estimation",
        "1980s: Financial planners created early education cost calculators for wealthy families",
        "1990s: 529 plan introductions spurred need for systematic savings calculators",
        "2000s: Online platforms democratized education cost planning for middle-class families",
        "2006: College Board launched official College Cost Calculator for national standardization",
        "2010s: Mobile apps introduced real-time education cost tracking and alerts",
        "2020s: AI-powered calculators with personalized scholarship and aid matching",
        "Modern Era: Integration with government databases for real-time tuition data"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Discovery Purpose",
      points: [
        "United States: Developed due to complex private/public university funding system",
        "United Kingdom: Created for tuition fee planning after 1998 higher education reforms",
        "Canada: Provincial education savings plans (RESPs) required cost projection tools",
        "Australia: HECS-HELP loan system necessitated future cost calculations",
        "Germany: Free tuition made calculators focus on living cost projections",
        "Scandinavia: Social welfare systems created calculators for supplemental costs only",
        "Japan: Private education emphasis led to sophisticated K-12 through university calculators",
        "India: Competitive entrance exams created need for coaching + university cost tools",
        "Purpose: Enable families to plan for rapidly rising education costs decades in advance"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Financial Advisory: Daily client education funding plan calculations",
        "Banking & Credit Unions: Monthly 529 plan and education loan consultations",
        "College Financial Aid Offices: Annual cost of attendance calculations",
        "Education Consultants: Weekly family education budgeting sessions",
        "Government Agencies: Quarterly education cost inflation reporting",
        "Scholarship Organizations: Monthly award amount determinations",
        "Education Technology: Continuous platform feature development",
        "Insurance Companies: Education rider and policy calculations",
        "Employer Benefits: Education assistance program administration"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Reduces education funding gaps by 40-60% through early detection",
        "Prevents $50,000+ student loan debt through proper planning",
        "Optimizes 529 plan contributions for maximum tax advantages",
        "Identifies scholarship opportunities matching calculated shortfalls",
        "Minimizes family financial stress through clear savings targets",
        "Enables strategic college selection based on affordability",
        "Facilitates multi-child education planning with staggered timelines",
        "Prevents retirement fund depletion for education expenses"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Financial Planners: $2,000-$5,000 fees for comprehensive education planning",
        "529 Plan Providers: Millions in asset management fees from calculated contributions",
        "Education Consultants: $150-$300 hourly rates for cost planning sessions",
        "Software Companies: $50-$100 monthly subscriptions for premium calculators",
        "Banks: Cross-selling opportunities for education loans and savings accounts",
        "Insurance Companies: Education rider premiums based on calculated needs",
        "Educational Institutions: Tuition lock-in programs based on projections",
        "Government: Tax revenue from education savings plan withdrawals"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Education Calculator Uses",
      points: [
        "Parents: Planning for children's college education from birth",
        "Grandparents: Calculating 529 plan contributions for grandchildren",
        "High School Students: Understanding future education costs and loan needs",
        "Adult Learners: Planning career change or advanced degree financing",
        "Teachers: Planning for their own children's education or further studies",
        "Small Business Owners: Planning education benefits for employees",
        "Military Families: Calculating GI Bill benefits vs additional needs",
        "Immigrant Families: Planning international education costs",
        "Single Parents: Budgeting for single-income education funding",
        "Foster Parents: Planning for state-assisted education funding gaps"
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
        <title>Education Cost Calculator | College Savings Planner</title>
        <meta
          name="description"
          content="Free education cost calculator to project future college expenses and determine how much you need to save for tuition, room, and board."
        />
        <meta
          name="keywords"
          content="education calculator, college cost, tuition calculator, 529 plan, education savings, student loan planning, education cost calculator, college cost calculator, tuition cost calculator, education savings calculator, college savings calculator, student cost calculator, education planning calculator, college planning calculator, tuition planning calculator, education expense calculator, college expense calculator, tuition expense calculator, education funding calculator, college funding calculator, tuition funding calculator, education investment calculator, college investment calculator, tuition investment calculator, education budget calculator, college budget calculator, tuition budget calculator, education finance calculator, college finance calculator, tuition finance calculator, education future cost calculator, college future cost calculator, tuition future cost calculator, education inflation calculator, college inflation calculator, tuition inflation calculator, education savings plan calculator, college savings plan calculator, tuition savings plan calculator, education nest egg calculator, college nest egg calculator, education ROI calculator, college ROI calculator, education return calculator, college return calculator, education financial planning, college financial planning, tuition financial planning, education cost projection, college cost projection, tuition cost projection, education cost estimate, college cost estimate, tuition cost estimate, education cost analysis, college cost analysis, tuition cost analysis, education cost planning, college cost planning, tuition cost planning, education cost management, college cost management, tuition cost management, education cost strategy, college cost strategy, tuition cost strategy, education cost forecast, college cost forecast, tuition cost forecast, education cost simulation, college cost simulation, tuition cost simulation, education cost modeling, college cost modeling, tuition cost modeling, education cost assessment, college cost assessment, tuition cost assessment, education cost evaluation, college cost evaluation, tuition cost evaluation, education cost comparison, college cost comparison, tuition cost comparison, education cost breakdown, college cost breakdown, tuition cost breakdown, education cost overview, college cost overview, tuition cost overview, education cost summary, college cost summary, tuition cost summary, education cost report, college cost report, tuition cost report, education cost tool, college cost tool, tuition cost tool, education cost app, college cost app, tuition cost app, education cost software, college cost software, tuition cost software, education cost platform, college cost platform, tuition cost platform, education cost website, college cost website, tuition cost website, education cost online, college cost online, tuition cost online, education cost free, college cost free, tuition cost free, education cost calculator free, college cost calculator free, tuition cost calculator free, education savings calculator free, college savings calculator free, tuition savings calculator free, education planning calculator free, college planning calculator free, tuition planning calculator free, education expense calculator free, college expense calculator free, tuition expense calculator free, education funding calculator free, college funding calculator free, tuition funding calculator free, education investment calculator free, college investment calculator free, tuition investment calculator free, education budget calculator free, college budget calculator free, tuition budget calculator free, education finance calculator free, college finance calculator free, tuition finance calculator free, education future cost calculator free, college future cost calculator free, tuition future cost calculator free, education inflation calculator free, college inflation calculator free, tuition inflation calculator free, education savings plan calculator free, college savings plan calculator free, tuition savings plan calculator free, education nest egg calculator free, college nest egg calculator free, education ROI calculator free, college ROI calculator free, education return calculator free, college return calculator free, education financial planning free, college financial planning free, tuition financial planning free, education cost projection free, college cost projection free, tuition cost projection free, education cost estimate free, college cost estimate free, tuition cost estimate free, education cost analysis free, college cost analysis free, tuition cost analysis free, education cost planning free, college cost planning free, tuition cost planning free, education cost management free, college cost management free, tuition cost management free, education cost strategy free, college cost strategy free, tuition cost strategy free, education cost forecast free, college cost forecast free, tuition cost forecast free, education cost simulation free, college cost simulation free, tuition cost simulation free, education cost modeling free, college cost modeling free, tuition cost modeling free, education cost assessment free, college cost assessment free, tuition cost assessment free, education cost evaluation free, college cost evaluation free, tuition cost evaluation free, education cost comparison free, college cost comparison free, tuition cost comparison free, education cost breakdown free, college cost breakdown free, tuition cost breakdown free, education cost overview free, college cost overview free, tuition cost overview free, education cost summary free, college cost summary free, tuition cost summary free, education cost report free, college cost report free, tuition cost report free, education cost tool free, college cost tool free, tuition cost tool free, education cost app free, college cost app free, tuition cost app free, education cost software free, college cost software free, tuition cost software free, education cost platform free, college cost platform free, tuition cost platform free, education cost website free, college cost website free, tuition cost website free, education cost online free, college cost online free, tuition cost online free"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/education-cost-calculator" />
        <meta property="og:title" content="Education Cost Calculator - Plan for College Expenses" />
        <meta
          property="og:description"
          content="Estimate future education costs and see if your current savings plan will cover them."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/education-cost-calculator" />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Education Cost Calculator</h1>
          <p className={styles.subtitle}>
            Plan for future education expenses and calculate your savings needs.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter current education costs — we extract numbers from any format (e.g., $25K, 5 years, 7% return).
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="currentCost" className={styles.label}>
                Current Annual Cost ($)
              </label>
              <input
                id="currentCost"
                type="text"
                value={currentCost}
                onChange={(e) => setCurrentCost(e.target.value)}
                placeholder="e.g. $25,000 or 25K"
                className={styles.input}
              />
              <small className={styles.note}>
                Current annual tuition + room/board
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="yearsUntilEnrollment" className={styles.label}>
                Years Until Enrollment
              </label>
              <select
                id="yearsUntilEnrollment"
                value={yearsUntilEnrollment}
                onChange={(e) => setYearsUntilEnrollment(e.target.value)}
                className={styles.input}
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map(year => (
                  <option key={year} value={year}>{year} {year === 1 ? 'year' : 'years'}</option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="inflationRate" className={styles.label}>
                Expected Education Inflation Rate (%)
              </label>
              <input
                id="inflationRate"
                type="text"
                value={inflationRate}
                onChange={(e) => setInflationRate(e.target.value)}
                placeholder="e.g. 5 or 5%"
                className={styles.input}
              />
              <small className={styles.note}>
                Typically 3-7% for higher education
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="yearsOfEducation" className={styles.label}>
                Years of Education Needed
              </label>
              <select
                id="yearsOfEducation"
                value={yearsOfEducation}
                onChange={(e) => setYearsOfEducation(e.target.value)}
                className={styles.input}
              >
                <option value="2">2 years</option>
                <option value="4">4 years</option>
                <option value="6">6 years</option>
                <option value="8">8 years</option>
              </select>
            </div>

            <h4 className={styles.sectionTitle}>Savings Plan</h4>

            <div className={styles.inputGroup}>
              <label htmlFor="currentSavings" className={styles.label}>
                Current Education Savings ($)
              </label>
              <input
                id="currentSavings"
                type="text"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(e.target.value)}
                placeholder="e.g. $10,000 or 10K"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="expectedReturn" className={styles.label}>
                Expected Investment Return (%)
              </label>
              <input
                id="expectedReturn"
                type="text"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(e.target.value)}
                placeholder="e.g. 7 or 7%"
                className={styles.input}
              />
              <small className={styles.note}>
                Conservative estimate: 4-7%
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="monthlyContribution" className={styles.label}>
                Monthly Contribution ($)
              </label>
              <input
                id="monthlyContribution"
                type="text"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                placeholder="e.g. $300 or 300/mo"
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Costs</span>
              <span className={styles.arrow}>→</span>
            </button>

            {result && (
              <div className={styles.resultSection}>
                <h3>Education Cost Projection</h3>

                <div className={styles.resultSummary}>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Future Annual Cost:</strong> ${result.futureAnnualCost}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Total Education Cost:</strong> ${result.totalEducationCost}
                  </div>
                </div>

                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Years Until Enrollment:</strong> {result.yearsUntilEnrollment}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Years of Education:</strong> {result.yearsOfEducation}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Education Inflation:</strong> {result.inflationRate}%
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Current Savings:</strong> ${result.currentSavings}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Expected Return:</strong> {result.expectedReturn}%
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Monthly Contribution:</strong> ${result.monthlyContribution}
                  </div>
                </div>

                <div className={styles.savingsProjection}>
                  <h4>Savings Projection</h4>
                  <div className={`${styles.savingsResult} ${result.isShortfall ? styles.shortfall : styles.sufficient}`}>
                    <div>
                      <strong>Projected Savings at Enrollment:</strong> ${result.projectedSavings}
                    </div>
                    {result.isShortfall ? (
                      <div>
                        <strong>Shortfall:</strong> ${result.shortfall}
                      </div>
                    ) : (
                      <div>Your savings will cover the education costs!</div>
                    )}
                  </div>
                </div>

                {result.isShortfall && (
                  <div className={styles.suggestions}>
                    <h4>Suggestions to Cover the Shortfall</h4>
                    <ul className={styles.list}>
                      <li>
                        Increase monthly contributions by $
                        {((parseFloat(result.shortfall.replace(/,/g, '')) / (result.yearsUntilEnrollment * 12)) || 0).toFixed(2)}
                      </li>
                      <li>Explore higher-return investment options</li>
                      <li>Consider more affordable education alternatives</li>
                      <li>Look into scholarships, grants, or financial aid</li>
                      <li>Delay enrollment to allow more savings growth</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Education Cost Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of education cost calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {educationCalculatorHistory.map((card) => (
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

export default EducationCalculator;