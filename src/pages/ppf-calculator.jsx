import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
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

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>PPF Calculator | Public Provident Fund Maturity & Interest Estimator</title>
        <meta
          name="description"
          content="Free PPF calculator to estimate maturity amount, total interest, and year-wise growth of your Public Provident Fund investment in India."
        />
        <meta
          name="keywords"
          content="
          PPF calculator,
          Public Provident Fund,
          PPF interest calculator,
          PPF maturity calculator,
          PPF investment,
          PPF returns,
          PPF India,
          PPF account,
          tax saving calculator,
          Section 80C,
          PPF yearly interest,
          PPF 15 years,
          PPF extension,
          PPF balance,
          PPF contribution,
          PPF scheme,
          government savings,
          long term savings India,
          tax free interest,
          PPF compounding,
          PPF yearly breakdown,
          PPF online calculator,
          free PPF tool,
          PPF amount at maturity,
          PPF interest rate,
          PPF investment calculator,
          PPF planning,
          retirement savings India,
          secure investment India,
          PPF vs FD,
          PPF vs mutual funds,
          PPF calculator with interest,
          PPF calculator India,
          how much PPF,
          PPF monthly investment,
          PPF annual limit,
          PPF tax benefit,
          PPF calculator with partial withdrawal,
          PPF calculator with loan,
          calculate PPF maturity,
          PPF growth estimator,
          PPF financial calculator,
          PPF retirement planning,
          best PPF calculator
          "
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/ppf-calculator" />
        <meta property="og:title" content="PPF Calculator - Estimate Your Tax-Free Maturity Amount" />
        <meta
          property="og:description"
          content="Calculate your PPF maturity value with current interest rates, annual contributions, and 15-year tenure. Fully tax-free under Section 80C."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/ppf-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

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
                <div className={styles.note}>Max ₹1.5 lakh/year under Section 80C</div>
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
                <div className={styles.note}>Standard PPF tenure: 15 years</div>
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
                  className={styles.select}
                >
                  <option value="yearly">Yearly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>

              <button type="submit" className={styles.ctaButton}>
                <span className={styles.btnText}>Calculate PPF Maturity</span>
                <span className={styles.btnArrow}>→</span>
              </button>

              {results && (
                <div className={styles.resultSection}>
                  <h3>PPF Projection</h3>
                  <div className={styles.summary}>
                    <div className={`${styles.summaryItem} ${styles.highlight}`}>
                      <strong>Maturity Value:</strong> ₹{results.maturityValue}
                    </div>
                    <div className={styles.summaryItem}>
                      <strong>Total Investment:</strong> ₹{results.totalInvestment}
                    </div>
                    <div className={styles.summaryItem}>
                      <strong>Total Interest Earned:</strong> ₹{results.totalInterest}
                    </div>
                    <div className={styles.summaryItem}>
                      <strong>Interest Rate:</strong> {results.interestRate}%
                    </div>
                    <div className={styles.summaryItem}>
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
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>What is PPF (Public Provident Fund)?</h3>
                <p>
                  PPF is a **government-backed savings scheme in India** offering **tax-free returns**, **capital protection**, and **long-term wealth creation**. It has a **15-year lock-in** (extendable) and qualifies for **Section 80C** tax deduction up to ₹1.5 lakh/year.
                </p>

                <h4>Key Benefits of PPF</h4>
                <ul className={styles.list}>
                  <li><strong>Tax Exemption:</strong> EEE status — Exempt at investment, accrual & withdrawal</li>
                  <li><strong>Safe Investment:</strong> Sovereign-backed by Government of India</li>
                  <li><strong>Compound Interest:</strong> Interest compounded annually</li>
                  <li><strong>Loan Facility:</strong> Available from Year 3 to Year 6</li>
                  <li><strong>Partial Withdrawal:</strong> Permitted from Year 7 onwards</li>
                  <li><strong>Low Minimum:</strong> ₹500/year to keep account active</li>
                </ul>

                <h4>How PPF Interest Works</h4>
                <div className={styles.formula}>
                  <code>
                    Interest = Monthly balance × (Annual Rate / 12)<br />
                    Interest credited at year-end on lowest balance between 5th–31st of each month
                  </code>
                </div>
                <p>
                  To maximize returns, deposit funds **before the 5th** of each month.
                </p>

                <h4>PPF vs Other Tax-Saving Options</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Scheme</th>
                      <th>Lock-in</th>
                      <th>Returns</th>
                      <th>Risk</th>
                      <th>Tax Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>PPF</td>
                      <td>15 years</td>
                      <td>7–7.5%</td>
                      <td>None</td>
                      <td>EEE</td>
                    </tr>
                    <tr>
                      <td>ELSS</td>
                      <td>3 years</td>
                      <td>10–12%</td>
                      <td>High</td>
                      <td>EEE</td>
                    </tr>
                    <tr>
                      <td>NSC</td>
                      <td>5 years</td>
                      <td>7.7%</td>
                      <td>None</td>
                      <td>EET</td>
                    </tr>
                    <tr>
                      <td>5-Year FD</td>
                      <td>5 years</td>
                      <td>6.5–7.5%</td>
                      <td>Low</td>
                      <td>ETT</td>
                    </tr>
                  </tbody>
                </table>

                <h4>Ideal For</h4>
                <ul className={styles.list}>
                  <li>Conservative investors seeking **tax-free, risk-free returns**</li>
                  <li>Long-term goals like **child education or retirement**</li>
                  <li>Maximizing **Section 80C deductions**</li>
                  <li>Portfolio **stability anchor** amid market volatility</li>
                </ul>

                <h4>Tips to Maximize PPF Returns</h4>
                <ul className={styles.list}>
                  <li>Deposit early in the financial year (April)</li>
                  <li>Make contributions before the 5th of each month</li>
                  <li>Invest the full ₹1.5 lakh limit annually</li>
                  <li>Extend after 15 years for continued compounding</li>
                  <li>Use PPF as part of a diversified tax-saving strategy</li>
                </ul>
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

export default PPFCalculator;