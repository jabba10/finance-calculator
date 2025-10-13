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
        <title>Long-Term Savings Calculator | Project Maturity Value & Growth</title>
        <meta
          name="description"
          content="Free long-term savings calculator to estimate your maturity value, total interest earned, and year-by-year breakdown of growth."
        />
        <meta
          name="keywords"
          content="long term savings calculator, compound interest calculator, retirement savings tool, investment projection"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/long-term-savings-calculator" />
        <meta property="og:title" content="Long-Term Savings Calculator - Plan Your Future Growth" />
        <meta
          property="og:description"
          content="Calculate how your regular investments grow over time with compound interest in a long-term savings account."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/long-term-savings-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Long-Term Savings Calculator</h1>
            <p className={styles.subtitle}>
              Calculate your savings maturity amount with compound interest and yearly breakdown.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="yearlyInvestment" className={styles.label}>
                  Yearly Investment ($)
                </label>
                <input
                  type="number"
                  id="yearlyInvestment"
                  name="yearlyInvestment"
                  value={inputs.yearlyInvestment}
                  onChange={handleChange}
                  placeholder="e.g. 6,000"
                  step="any"
                  className={styles.input}
                />
                <div className={styles.note}>Recommended $100 - $100,000/year</div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="interestRate" className={styles.label}>
                  Interest Rate (%)
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
                <div className={styles.note}>Minimum 1 year</div>
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
                <span className={styles.btnText}>Calculate Maturity Value</span>
                <span className={styles.btnArrow}>→</span>
              </button>

              {results && (
                <div className={styles.resultSection}>
                  <h3>Savings Projection</h3>
                  <div className={styles.summary}>
                    <div className={`${styles.summaryItem} ${styles.highlight}`}>
                      <strong>Maturity Value:</strong> ${results.maturityValue}
                    </div>
                    <div className={styles.summaryItem}>
                      <strong>Total Investment:</strong> ${results.totalInvestment}
                    </div>
                    <div className={styles.summaryItem}>
                      <strong>Total Interest Earned:</strong> ${results.totalInterest}
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
                          <th>Principal ($)</th>
                          <th>Interest ($)</th>
                          <th>Total ($)</th>
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
                    Long-term savings accounts typically have better interest rates. Interest is compounded annually.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Understanding Long-Term Savings</h3>
                <p>
                  Long-term savings accounts offer <strong>stable returns</strong> and <strong>capital protection</strong>, making them ideal for conservative investors seeking steady growth for retirement, education, or other long-term goals.
                </p>

                <h4>Key Features of Long-Term Savings</h4>
                <ul className={styles.list}>
                  <li><strong>Tax Benefits:</strong> Some accounts offer tax-deferred or tax-free growth</li>
                  <li><strong>Tenure:</strong> Typically 5+ years for best rates</li>
                  <li><strong>Investment Limit:</strong> Varies by account type</li>
                  <li><strong>Interest Rate:</strong> Often higher than regular savings accounts</li>
                  <li><strong>Risk:</strong> Generally low-risk when FDIC insured</li>
                  <li><strong>Liquidity:</strong> Some penalties for early withdrawal</li>
                </ul>

                <h4>How Compound Interest Works</h4>
                <div className={styles.formula}>
                  <code>
                    Annual Interest = (Opening Balance + Deposits) × Interest Rate<br />
                    Interest is compounded annually and credited at year-end
                  </code>
                </div>
                <p>
                  The power of compounding makes long-term savings particularly attractive. Even small regular investments can grow substantially over 10+ years.
                </p>

                <h4>Savings vs Other Investment Options</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th>Savings Account</th>
                      <th>CDs</th>
                      <th>Stocks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Risk Level</td>
                      <td>Very Low</td>
                      <td>Low</td>
                      <td>High</td>
                    </tr>
                    <tr>
                      <td>Returns</td>
                      <td>2-5%</td>
                      <td>3-5%</td>
                      <td>7-10% avg (volatile)</td>
                    </tr>
                    <tr>
                      <td>Liquidity</td>
                      <td>High</td>
                      <td>Low</td>
                      <td>High</td>
                    </tr>
                    <tr>
                      <td>Best For</td>
                      <td>Emergency funds</td>
                      <td>Short-term goals</td>
                      <td>Long-term growth</td>
                    </tr>
                  </tbody>
                </table>

                <h4>Who Should Use Long-Term Savings?</h4>
                <ul className={styles.list}>
                  <li><strong>Conservative investors</strong> seeking stability</li>
                  <li>Those saving for <strong>specific future goals</strong></li>
                  <li>Parents saving for <strong>children's education</strong></li>
                  <li>Individuals building a <strong>retirement safety net</strong></li>
                  <li>Those wanting a <strong>low-risk allocation</strong> in their portfolio</li>
                </ul>

                <h4>Savings Strategies</h4>
                <ul className={styles.list}>
                  <li><strong>Automate contributions:</strong> Set up regular transfers</li>
                  <li><strong>Ladder maturities:</strong> For CD investments</li>
                  <li><strong>Maximize tax-advantaged accounts:</strong> Like IRAs or 401(k)s</li>
                  <li><strong>Review rates annually:</strong> Move funds for better returns</li>
                  <li><strong>Combine with investments:</strong> For balanced growth</li>
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