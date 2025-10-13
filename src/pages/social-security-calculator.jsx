import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
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

  return (
    <>
      <Helmet>
        <title>Social Security Benefits Calculator | Estimate Retirement Income</title>
        <meta
          name="description"
          content="Estimate your future Social Security retirement benefits based on birth year, income, and planned retirement age."
        />
        <meta
          name="keywords"
          content="social security calculator, retirement benefits estimator, SS benefits, retirement planning"
        />
        <meta property="og:title" content="Social Security Benefits Calculator" />
        <meta
          property="og:description"
          content="Calculate your estimated monthly Social Security benefit at retirement."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className={styles.container}>
        {/* Spacer for Navbar */}
        <div className={styles.spacerTop}></div>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Social Security Benefits Calculator</h1>
          <p className={styles.subtitle}>
            Estimate your future Social Security retirement benefits based on your earnings history.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
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
                <p className={styles.note}>Full retirement age depends on birth year</p>
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
                <p className={styles.note}>Up to $142,800 is taxed for Social Security</p>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span>Calculate Benefits</span>
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
                <p className={styles.note}>
                  *Based on average life expectancy. Actual benefits depend on earnings history and retirement age.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Understanding Social Security Benefits</h3>
            <p>
              Social Security provides a foundation for retirement income, but benefits vary based on your earnings history and when you claim them. This calculator helps you estimate your future monthly payments.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li>
                <strong>Birth Year:</strong> Determines your full retirement age (67 for those born 1960+)
              </li>
              <li>
                <strong>Current Age:</strong> Shows how many years until retirement
              </li>
              <li>
                <strong>Retirement Age:</strong> Benefits increase ~8% annually if you delay past full retirement age
              </li>
              <li>
                <strong>Annual Income:</strong> Only income up to $142,800 (2021 limit) counts toward benefits
              </li>
              <li>Click "Calculate Benefits" to see your estimated monthly payment</li>
            </ul>

            <h4>How Benefits Are Calculated</h4>
            <div className={styles.formula}>
              <code>
                PIA = AIME × (90% of first $996 + 32% of $996–$6,002 + 15% above $6,002)
              </code>
            </div>
            <p>Where:</p>
            <ul className={styles.list}>
              <li>
                <strong>PIA</strong> = Primary Insurance Amount (benefit at full retirement age)
              </li>
              <li>
                <strong>AIME</strong> = Average Indexed Monthly Earnings (top 35 earning years)
              </li>
              <li>Bend points adjust annually for inflation</li>
            </ul>
            <p>
              <strong>Example:</strong> $60K average income retiring at 67 → ~$1,800/month
            </p>

            <h4>Impact of Claiming Age</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Claiming Age</th>
                  <th>% of Full Benefit</th>
                  <th>Example Monthly*</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>62 (earliest)</td>
                  <td>70%</td>
                  <td>$1,260</td>
                </tr>
                <tr>
                  <td>65</td>
                  <td>86.7%</td>
                  <td>$1,560</td>
                </tr>
                <tr>
                  <td>67 (full)</td>
                  <td>100%</td>
                  <td>$1,800</td>
                </tr>
                <tr>
                  <td>70 (maximum)</td>
                  <td>124%</td>
                  <td>$2,232</td>
                </tr>
              </tbody>
            </table>
            <p className={styles.note}>*Example assumes $1,800 full retirement benefit</p>

            <h4>Key Strategies</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Delay benefits</strong> — Each year past full retirement age adds ~8% until 70</li>
              <li>✅ <strong>Check earnings record</strong> — Errors reduce your benefit</li>
              <li>✅ <strong>Coordinate with spouse</strong> — May qualify for up to 50% of spouse's benefit</li>
              <li>✅ <strong>Consider taxes</strong> — Benefits may be taxable if income exceeds thresholds</li>
              <li>✅ <strong>Plan for COLA</strong> — Benefits increase with inflation (average 1-3% annually)</li>
            </ul>
          </div>
        </section>

        {/* CTA Section — Fixed for Next.js 13+ */}
        <section className={styles.ctaSection}>
          <h2>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
          <p>Free Financial Planning Tools – Try Now</p>
          <Link
            href="/retirement-suite"
            className={styles.ctaButton}
            ref={ctaButtonRef}
            onMouseMove={handleMouseMove}
          >
            <span>Explore All Calculators</span>
            <span className={styles.arrow}>→</span>
          </Link>
        </section>

        {/* Spacer for Footer */}
        <div className={styles.spacerBottom}></div>
      </div>
    </>
  );
};

export default SocialSecurityCalculator;