import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './occupancycostcalculator.module.css';

const OccupancyCostCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [inputs, setInputs] = useState({
    rent: '',
    utilities: '',
    maintenance: '',
    insurance: '',
    propertyTax: ''
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const rent = parseFloat(inputs.rent) || 0;
    const utilities = parseFloat(inputs.utilities) || 0;
    const maintenance = parseFloat(inputs.maintenance) || 0;
    const insurance = parseFloat(inputs.insurance) || 0;
    const propertyTax = parseFloat(inputs.propertyTax) || 0;

    if (rent < 0 || utilities < 0 || maintenance < 0 || insurance < 0 || propertyTax < 0) {
      alert("Please enter non-negative values.");
      return;
    }

    const monthlyTotal = rent + utilities + maintenance + insurance / 12 + propertyTax / 12;
    const annualTotal = monthlyTotal * 12;

    setResult({
      monthly: monthlyTotal.toFixed(2),
      annual: annualTotal.toFixed(2)
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
        <title>Occupancy Cost Calculator | Commercial & Residential Space Tool</title>
        <meta
          name="description"
          content="Free occupancy cost calculator to determine total monthly and annual expenses for commercial or residential space including rent, utilities, taxes, and insurance."
        />
        <meta
          name="keywords"
          content="occupancy cost calculator, rent calculator, commercial lease, office space cost, property expense tool"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/occupancy-cost-calculator" />
        <meta property="og:title" content="Occupancy Cost Calculator - Total Space Expense Tool" />
        <meta
          property="og:description"
          content="Calculate your full occupancy costs including rent, utilities, maintenance, insurance, and property tax."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/occupancy-cost-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Occupancy Cost Calculator</h1>
            <p className={styles.subtitle}>
              Calculate your total monthly and annual costs of occupying a commercial or residential space.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your space costs — we extract numbers from any format (e.g., $2K, $1.2K/year).
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="rent" className={styles.label}>
                  Monthly Rent ($)
                </label>
                <input
                  type="number"
                  id="rent"
                  name="rent"
                  value={inputs.rent}
                  onChange={handleChange}
                  placeholder="e.g. 2,000"
                  step="0.01"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="utilities" className={styles.label}>
                  Monthly Utilities ($)
                </label>
                <input
                  type="number"
                  id="utilities"
                  name="utilities"
                  value={inputs.utilities}
                  onChange={handleChange}
                  placeholder="e.g. 150"
                  step="0.01"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="maintenance" className={styles.label}>
                  Maintenance ($/month)
                </label>
                <input
                  type="number"
                  id="maintenance"
                  name="maintenance"
                  value={inputs.maintenance}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  step="0.01"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="insurance" className={styles.label}>
                  Insurance ($/year)
                </label>
                <input
                  type="number"
                  id="insurance"
                  name="insurance"
                  value={inputs.insurance}
                  onChange={handleChange}
                  placeholder="e.g. 1,200"
                  step="0.01"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="propertyTax" className={styles.label}>
                  Property Tax ($/year)
                </label>
                <input
                  type="number"
                  id="propertyTax"
                  name="propertyTax"
                  value={inputs.propertyTax}
                  onChange={handleChange}
                  placeholder="e.g. 3,600"
                  step="0.01"
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.ctaButton}>
                <span className={styles.btnText}>Calculate Total Cost</span>
                <span className={styles.btnArrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Occupancy Cost Summary</h3>
                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Monthly Cost:</strong> ${result.monthly}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Annual Cost:</strong> ${result.annual}
                    </div>
                  </div>
                  <div className={styles.resultNote}>
                    This total includes rent, utilities, maintenance, insurance, and prorated property tax.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Occupancy Cost Matters</h3>
                <p>
                  <strong>Occupancy Cost</strong> is the total expense of occupying a space — not just rent. Many businesses and tenants overlook hidden costs like maintenance, insurance, and taxes, leading to budget overruns.
                </p>

                <h4>How to Use This Calculator</h4>
                <p>
                  Enter your <strong>monthly rent</strong>, <strong>utilities</strong>, <strong>monthly maintenance</strong>, and the <strong>annual insurance</strong> and <strong>property tax</strong>. The calculator automatically prorates yearly costs to monthly and gives you a complete picture of your true occupancy expense.
                </p>

                <h4>The Occupancy Cost Formula</h4>
                <div className={styles.formula}>
                  <code>Total Monthly Cost = Rent + Utilities + Maintenance + (Insurance / 12) + (Property Tax / 12)</code>
                </div>
                <p>
                  This helps you compare lease options fairly, budget accurately, and negotiate better terms with landlords.
                </p>

                <h4>Example Use Cases</h4>
                <ul className={styles.list}>
                  <li><strong>Small Business:</strong> Compare two retail spaces with different rent but varying utility costs.</li>
                  <li><strong>Office Lease:</strong> Factor in maintenance and insurance when evaluating a commercial lease.</li>
                  <li><strong>Home Office:</strong> Calculate true cost for tax deductions or remote work planning.</li>
                </ul>

                <h4>Tips for Reducing Occupancy Costs</h4>
                <ul className={styles.list}>
                  <li>✅ <strong>Negotiate tenant improvements</strong> — ask landlord to cover upgrades</li>
                  <li>✅ <strong>Bundle services</strong> — combine internet, phone, security for discounts</li>
                  <li>✅ <strong>Energy efficiency</strong> — LED lighting, smart thermostats reduce utilities</li>
                  <li>✅ <strong>Review insurance annually</strong> — avoid over-insuring</li>
                  <li>✅ <strong>Challenge property tax assessments</strong> — especially after market shifts</li>
                </ul>

                <h4>Commercial Leasing Terms to Know</h4>
                <ul className={styles.list}>
                  <li><strong>Gross Lease:</strong> Landlord pays most operating expenses</li>
                  <li><strong>Net Lease:</strong> Tenant pays some or all additional costs</li>
                  <li><strong>Triple Net (NNN):</strong> Tenant pays property tax, insurance, and maintenance</li>
                  <li><strong>Common Area Maintenance (CAM):</strong> Fees for shared spaces</li>
                  <li><strong>Escalation Clause:</strong> Rent increases over time</li>
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

export default OccupancyCostCalculator;