import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './litigationcostcalculator.module.css';

const LitigationCostCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [inputs, setInputs] = useState({
    attorneyHours: '',
    hourlyRate: '',
    courtFees: '',
    expertFees: '',
    discoveryCosts: '',
    adminCosts: ''
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

    const attorneyHours = parseFloat(inputs.attorneyHours) || 0;
    const hourlyRate = parseFloat(inputs.hourlyRate) || 0;
    const courtFees = parseFloat(inputs.courtFees) || 0;
    const expertFees = parseFloat(inputs.expertFees) || 0;
    const discoveryCosts = parseFloat(inputs.discoveryCosts) || 0;
    const adminCosts = parseFloat(inputs.adminCosts) || 0;

    if (attorneyHours < 0 || hourlyRate < 0 || courtFees < 0 || expertFees < 0 || discoveryCosts < 0 || adminCosts < 0) {
      alert("Please enter non-negative values.");
      return;
    }

    const attorneyCost = attorneyHours * hourlyRate;
    const totalCost = attorneyCost + courtFees + expertFees + discoveryCosts + adminCosts;

    setResult({
      attorney: attorneyCost.toFixed(2),
      total: totalCost.toFixed(2)
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
        <title>Litigation Cost Calculator | Legal Expense Estimator</title>
        <meta
          name="description"
          content="Free litigation cost calculator to estimate total legal expenses including attorney fees, court costs, expert witnesses, and discovery."
        />
        <meta
          name="keywords"
          content="litigation calculator, legal cost estimator, attorney fee calculator, lawsuit cost, court expense tool"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/litigation-cost-calculator" />
        <meta property="og:title" content="Litigation Cost Calculator - Estimate Legal Expenses" />
        <meta
          property="og:description"
          content="Calculate your expected litigation costs before filing or defending a lawsuit."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/litigation-cost-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Litigation Cost Calculator</h1>
            <p className={styles.subtitle}>
              Estimate the total cost of legal proceedings before filing or defending a lawsuit.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter estimated legal costs — we extract numbers from any format (e.g., $300/hr, 40 hrs).
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="attorneyHours" className={styles.label}>
                  Attorney Hours
                </label>
                <input
                  type="number"
                  id="attorneyHours"
                  name="attorneyHours"
                  value={inputs.attorneyHours}
                  onChange={handleChange}
                  placeholder="e.g. 40"
                  step="0.5"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="hourlyRate" className={styles.label}>
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  id="hourlyRate"
                  name="hourlyRate"
                  value={inputs.hourlyRate}
                  onChange={handleChange}
                  placeholder="e.g. 300"
                  step="0.01"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="courtFees" className={styles.label}>
                  Court & Filing Fees ($)
                </label>
                <input
                  type="number"
                  id="courtFees"
                  name="courtFees"
                  value={inputs.courtFees}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  step="0.01"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="expertFees" className={styles.label}>
                  Expert Witness Fees ($)
                </label>
                <input
                  type="number"
                  id="expertFees"
                  name="expertFees"
                  value={inputs.expertFees}
                  onChange={handleChange}
                  placeholder="e.g. 2,000"
                  step="0.01"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="discoveryCosts" className={styles.label}>
                  Discovery & Depositions ($)
                </label>
                <input
                  type="number"
                  id="discoveryCosts"
                  name="discoveryCosts"
                  value={inputs.discoveryCosts}
                  onChange={handleChange}
                  placeholder="e.g. 1,500"
                  step="0.01"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="adminCosts" className={styles.label}>
                  Administrative Costs ($)
                </label>
                <input
                  type="number"
                  id="adminCosts"
                  name="adminCosts"
                  value={inputs.adminCosts}
                  onChange={handleChange}
                  placeholder="e.g. 300"
                  step="0.01"
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.ctaButton}>
                <span className={styles.btnText}>Calculate Litigation Cost</span>
                <span className={styles.btnArrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Litigation Cost Summary</h3>
                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Attorney Fees:</strong> ${result.attorney}
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Total Estimated Cost:</strong> ${result.total}
                    </div>
                  </div>
                  <div className={styles.note}>
                    This estimate includes attorney time, court fees, expert witnesses, discovery, and administrative costs.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Litigation Cost Matters</h3>
                <p>
                  <strong>Litigation can be extremely expensive</strong> — often exceeding $10,000 even for simple cases. Many individuals and small businesses go to court without understanding the full financial impact, risking financial strain.
                </p>

                <h4>How to Use This Calculator</h4>
                <p>
                  Enter your estimated <strong>attorney hours</strong> and <strong>hourly rate</strong>, then add projected <strong>court fees</strong>, <strong>expert witness costs</strong>, <strong>discovery expenses</strong>, and <strong>administrative overhead</strong>. The calculator gives you a realistic total to help you decide whether to settle, mediate, or proceed.
                </p>

                <h4>The Litigation Cost Formula</h4>
                <div className={styles.formula}>
                  <code>Total Cost = (Attorney Hours × Hourly Rate) + Court Fees + Expert Fees + Discovery + Admin Costs</code>
                </div>
                <p>
                  This helps you budget accurately, evaluate settlement offers, and avoid unexpected legal bills.
                </p>

                <h4>Example Use Cases</h4>
                <ul className={styles.list}>
                  <li><strong>Small Business:</strong> Assess cost of suing a vendor for breach of contract.</li>
                  <li><strong>Individual:</strong> Decide whether to pursue a personal injury claim.</li>
                  <li><strong>Landlord:</strong> Weigh the cost of eviction vs. settling with a tenant.</li>
                </ul>

                <h4>Tips to Reduce Legal Costs</h4>
                <ul className={styles.list}>
                  <li>✅ <strong>Negotiate a flat fee</strong> instead of hourly billing</li>
                  <li>✅ <strong>Use mediation or arbitration</strong> — faster and cheaper than trial</li>
                  <li>✅ <strong>Limit discovery requests</strong> to only essential documents</li>
                  <li>✅ <strong>Keep communication concise</strong> to reduce billable hours</li>
                  <li>✅ <strong>Ask for cost estimates</strong> before major case milestones</li>
                </ul>

                <h4>Alternative Dispute Resolution (ADR)</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Method</th>
                      <th>Avg. Cost</th>
                      <th>Timeframe</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Negotiation</td>
                      <td>$0–$2,000</td>
                      <td>Days–Weeks</td>
                    </tr>
                    <tr>
                      <td>Mediation</td>
                      <td>$2,000–$5,000</td>
                      <td>Weeks</td>
                    </tr>
                    <tr>
                      <td>Arbitration</td>
                      <td>$5,000–$25,000</td>
                      <td>Months</td>
                    </tr>
                    <tr>
                      <td>Civil Trial</td>
                      <td>$10,000–$100,000+</td>
                      <td>6–24+ months</td>
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

export default LitigationCostCalculator;