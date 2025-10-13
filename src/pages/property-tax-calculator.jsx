import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import Link from 'next/link';
import styles from './propertytaxcalculator.module.css';

const PropertyTaxCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [homeValue, setHomeValue] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [annualTax, setAnnualTax] = useState(null);
  const [monthlyTax, setMonthlyTax] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = parseFloat(homeValue) || 300000;
    const rate = (parseFloat(taxRate) || 1.2) / 100;

    const yearlyTax = Math.max(0, value * rate);
    const monthly = Math.max(0, yearlyTax / 12);

    setAnnualTax(yearlyTax.toFixed(2));
    setMonthlyTax(monthly.toFixed(2));
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

  return (
    <>
      <Helmet>
        <title>Property Tax Calculator | Estimate Annual & Monthly Property Tax</title>
        <meta
          name="description"
          content="Estimate your annual and monthly property tax based on home value and local tax rate with our free, easy-to-use calculator."
        />
        <meta
          name="keywords"
          content="property tax calculator, home tax estimator, real estate tax tool, property tax by state"
        />
        <meta property="og:title" content="Property Tax Calculator" />
        <meta
          property="og:description"
          content="Calculate your estimated property tax using home value and local tax rate."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className={styles.container}>
        {/* Spacer for Navbar */}
        <div className={styles.spacerTop}></div>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Property Tax Calculator</h1>
          <p className={styles.subtitle}>
            Estimate your annual and monthly property tax based on home value and local tax rate.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your home's market value and the local property tax rate to calculate your estimated tax.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="homeValue" className={styles.label}>
                  Home Market Value ($)
                </label>
                <input
                  id="homeValue"
                  type="number"
                  value={homeValue}
                  onChange={(e) => setHomeValue(e.target.value)}
                  placeholder="e.g. 350000"
                  className={styles.input}
                  step="any"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="taxRate" className={styles.label}>
                  Annual Property Tax Rate (%)
                </label>
                <input
                  id="taxRate"
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  placeholder="e.g. 1.2"
                  className={styles.input}
                  step="any"
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span>Calculate Tax</span>
                <span className={styles.arrow}>→</span>
              </button>
            </form>

            {annualTax !== null && (
              <div className={styles.resultSection}>
                <h3>Estimated Property Tax</h3>
                <div className={styles.resultGrid}>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Annual Tax:</strong> ${annualTax}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Monthly Tax:</strong> ${monthlyTax}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Home Value:</strong>{' '}
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(parseFloat(homeValue) || 0)}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Tax Rate:</strong> {(parseFloat(taxRate) || 0).toFixed(2)}%
                  </div>
                </div>
                <p className={styles.note}>
                  This is an estimate. Actual taxes may vary based on exemptions, assessments, and local regulations.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why Property Tax Calculation Matters</h3>
            <p>
              <strong>Property tax</strong> is a major expense for homeowners and investors. Accurately estimating it helps with{' '}
              <strong>budgeting, mortgage planning, and investment analysis</strong>. This calculator gives you a quick, reliable estimate using the standard formula.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li>Enter the <strong>current market value</strong> of your home.</li>
              <li>Input the <strong>annual tax rate</strong> (as a percentage) from your local government.</li>
              <li>Click "Calculate Tax" to see your <strong>annual and monthly estimates</strong>.</li>
            </ul>

            <h4>Formula Used</h4>
            <div className={styles.formula}>
              <code>Annual Property Tax = Home Value × (Tax Rate / 100)</code>
              <br />
              <code>Monthly Tax = Annual Tax / 12</code>
            </div>
            <p>
              Example: $400,000 home at 1.25% tax rate → $400,000 × 0.0125 = <strong>$5,000/year</strong> ($416.67/month).
            </p>

            <h4>Key Factors Affecting Property Tax</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Factor</th>
                  <th>Impact</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Assessed Value</td>
                  <td>May differ from market value; used by local assessors</td>
                </tr>
                <tr>
                  <td>Tax Rate (Millage Rate)</td>
                  <td>Set by local governments; varies by county/school district</td>
                </tr>
                <tr>
                  <td>Exemptions</td>
                  <td>Homestead, senior, or veteran discounts reduce tax</td>
                </tr>
                <tr>
                  <td>Reassessment Cycles</td>
                  <td>Values updated every 1–5 years; can increase tax</td>
                </tr>
                <tr>
                  <td>Special Districts</td>
                  <td>Fire, flood control, or Mello-Roos add extra fees</td>
                </tr>
              </tbody>
            </table>

            <h4>Real-World Applications</h4>
            <ul className={styles.list}>
              <li><strong>Home Buyers:</strong> Include tax in mortgage affordability analysis</li>
              <li><strong>Investors:</strong> Evaluate cash flow and ROI for rental properties</li>
              <li><strong>Refinancing:</strong> Compare tax obligations across new locations</li>
              <li><strong>Budgeting:</strong> Plan for annual tax bills or escrow payments</li>
            </ul>

            <h4>State & Local Variations</h4>
            <p>Tax rates vary widely:</p>
            <ul className={styles.list}>
              <li><strong>High:</strong> NJ (2.21%), IL (2.05%), NH (1.71%)</li>
              <li><strong>Low:</strong> Hawaii (0.30%), Alabama (0.40%), Louisiana (0.53%)</li>
            </ul>
            <p>
              Always check your <strong>county assessor's website</strong> for accurate rates and exemptions.
            </p>

            <h4>Tips to Reduce Property Tax</h4>
            <ul className={styles.list}>
              <li>Apply for a <strong>homestead exemption</strong> if eligible</li>
              <li>Appeal your <strong>assessment</strong> if overvalued</li>
              <li>Check for <strong>veteran, senior, or disability discounts</strong></li>
              <li>Monitor reassessment notices and file objections</li>
            </ul>
          </div>
        </section>

        {/* CTA Section — Fixed for Next.js 13+ */}
        <section className={styles.ctaSection}>
          <h2>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
          <p>Free Financial Planning Tools – Try Now</p>
          <Link
            href="/suite"
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

export default PropertyTaxCalculator;