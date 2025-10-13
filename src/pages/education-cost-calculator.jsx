import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
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

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>Education Cost Calculator | College Savings Planner</title>
        <meta
          name="description"
          content="Free education cost calculator to project future college expenses and determine how much you need to save for tuition, room, and board."
        />
        <meta
          name="keywords"
          content="education calculator, college cost, tuition calculator, 529 plan, education savings, student loan planning"
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
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

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

              <button type="submit" className={styles.ctaButton}>
                <span className={styles.btnText}>Calculate Costs</span>
                <span className={styles.btnArrow}>→</span>
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

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Education Cost Planning Matters</h3>
                <p>
                  With education costs rising faster than general inflation, proper planning is essential. This calculator helps you estimate{' '}
                  <strong>future education expenses</strong> and determine whether your current savings plan will be sufficient to cover them. Understanding these costs years in advance allows you to make adjustments to your savings strategy.
                </p>

                <h4>How to Use This Calculator</h4>
                <ul className={styles.list}>
                  <li><strong>Current Annual Cost:</strong> Today's cost for one year of education (tuition + room/board)</li>
                  <li><strong>Years Until Enrollment:</strong> How long until the student begins education</li>
                  <li><strong>Education Inflation Rate:</strong> Expected annual increase in education costs (typically higher than general inflation)</li>
                  <li><strong>Years of Education Needed:</strong> Total duration of education program</li>
                  <li><strong>Current Savings:</strong> Amount already saved for education</li>
                  <li><strong>Expected Investment Return:</strong> Annual growth rate of education savings</li>
                  <li><strong>Monthly Contribution:</strong> Amount you'll add to savings each month</li>
                  <li>Enter any format — we extract numbers from text, symbols, and units</li>
                </ul>

                <h4>Key Formulas Used</h4>
                <div className={styles.formula}>
                  <code>Future Annual Cost = Current Cost × (1 + Inflation Rate)^Years Until Enrollment</code>
                </div>
                <div className={styles.formula}>
                  <code>Total Education Cost = Future Annual Cost × Years of Education</code>
                </div>
                <div className={styles.formula}>
                  <code>Projected Savings = Current Savings × (1 + Return Rate)^Years + Monthly Contributions × [(1 + Monthly Rate)^Months - 1] / Monthly Rate</code>
                </div>

                <h4>Education Cost Trends</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Institution Type</th>
                      <th>Average Annual Cost (2023)</th>
                      <th>Historical Inflation Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Public 4-Year (In-State)</td>
                      <td>$25,000–$35,000</td>
                      <td>4–6%</td>
                    </tr>
                    <tr>
                      <td>Public 4-Year (Out-of-State)</td>
                      <td>$40,000–$50,000</td>
                      <td>5–7%</td>
                    </tr>
                    <tr>
                      <td>Private 4-Year</td>
                      <td>$50,000–$75,000</td>
                      <td>3–5%</td>
                    </tr>
                    <tr>
                      <td>Community College</td>
                      <td>$10,000–$15,000</td>
                      <td>2–4%</td>
                    </tr>
                  </tbody>
                </table>

                <h4>Savings Strategies</h4>
                <div className={styles.strategies}>
                  <div className={styles.strategy}>
                    <h5>529 College Savings Plans</h5>
                    <ul className={styles.list}>
                      <li>Tax-advantaged savings specifically for education</li>
                      <li>Earnings grow tax-free when used for qualified expenses</li>
                      <li>Some states offer tax deductions for contributions</li>
                    </ul>
                  </div>
                  <div className={styles.strategy}>
                    <h5>Coverdell ESAs</h5>
                    <ul className={styles.list}>
                      <li>$2,000 annual contribution limit</li>
                      <li>Can be used for K-12 and higher education</li>
                      <li>More investment options than 529 plans</li>
                    </ul>
                  </div>
                  <div className={styles.strategy}>
                    <h5>UGMA/UTMA Accounts</h5>
                    <ul className={styles.list}>
                      <li>Flexible custodial accounts</li>
                      <li>No restrictions on use of funds</li>
                      <li>May impact financial aid eligibility</li>
                    </ul>
                  </div>
                </div>

                <h4>Ways to Reduce Education Costs</h4>
                <ul className={styles.list}>
                  <li><strong>Scholarships and Grants:</strong> Free money that doesn't need repayment</li>
                  <li><strong>Community College Transfer:</strong> Complete general requirements at lower cost</li>
                  <li><strong>Advanced Placement (AP) Credits:</strong> Earn college credits in high school</li>
                  <li><strong>Work-Study Programs:</strong> Earn while learning</li>
                  <li><strong>Employer Tuition Assistance:</strong> Some companies help pay for education</li>
                  <li><strong>Military Service Benefits:</strong> GI Bill and other education benefits</li>
                </ul>

                <h4>Financial Aid Considerations</h4>
                <p>
                  When planning for education costs, understand how different savings vehicles affect financial aid eligibility:
                </p>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Account Type</th>
                      <th>Impact on FAFSA</th>
                      <th>Considerations</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Parent-owned 529</td>
                      <td>5.64% of value counted</td>
                      <td>Most favorable treatment</td>
                    </tr>
                    <tr>
                      <td>Student-owned 529</td>
                      <td>20% of value counted</td>
                      <td>Less favorable than parent-owned</td>
                    </tr>
                    <tr>
                      <td>UTMA/UGMA</td>
                      <td>20% of value counted</td>
                      <td>Considered student asset</td>
                    </tr>
                    <tr>
                      <td>Parent Assets</td>
                      <td>Up to 5.64% of value</td>
                      <td>Includes investments, businesses</td>
                    </tr>
                    <tr>
                      <td>Student Income</td>
                      <td>50% above allowance</td>
                      <td>Summer jobs, etc.</td>
                    </tr>
                  </tbody>
                </table>
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
                  className={styles.ctaButtonLink}
                  ref={ctaButtonRef}
                  onMouseMove={handleMouseMove}
                >
                  <span className={styles.btnText}>Explore All Calculators</span>
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

export default EducationCalculator;