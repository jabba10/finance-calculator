import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './legalretainercalculator.module.css';

const LegalRetainerCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [inputs, setInputs] = useState({
    attorneyRate: '250',
    estimatedHours: '20',
    flatFee: '',
    upfrontPayment: '5000'
  });

  const [result, setResult] = useState(null);
  const [calculationMode, setCalculationMode] = useState('hourly');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleModeChange = (mode) => {
    setCalculationMode(mode);
  };

  const calculateRetainer = () => {
    let requiredRetainer = 0;
    let estimatedTotal = 0;
    let hours = parseFloat(inputs.estimatedHours) || 0;
    let rate = parseFloat(inputs.attorneyRate) || 0;
    let flat = parseFloat(inputs.flatFee) || 0;
    let upfront = parseFloat(inputs.upfrontPayment) || 0;

    if (hours < 0 || rate < 0 || flat < 0 || upfront < 0) {
      alert("Please enter non-negative values.");
      return;
    }

    if (calculationMode === 'hourly') {
      estimatedTotal = rate * hours;
      requiredRetainer = estimatedTotal;
    } else if (calculationMode === 'flat') {
      if (flat <= 0) {
        alert("Flat fee must be greater than $0.");
        return;
      }
      estimatedTotal = flat;
      requiredRetainer = flat;
    } else if (calculationMode === 'upfront') {
      if (upfront <= 0) {
        alert("Upfront payment must be greater than $0.");
        return;
      }
      estimatedTotal = rate * hours;
      requiredRetainer = upfront;
    }

    const coveragePercent = estimatedTotal > 0 ? (requiredRetainer / estimatedTotal * 100).toFixed(1) : 0;

    setResult({
      mode: calculationMode,
      rate: rate.toFixed(2),
      hours,
      flatFee: flat.toFixed(2),
      upfront: upfront.toFixed(2),
      estimatedTotal: estimatedTotal.toFixed(2),
      requiredRetainer: requiredRetainer.toFixed(2),
      coverage: coveragePercent
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateRetainer();
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
        <title>Legal Retainer Calculator | Estimate Attorney Fees</title>
        <meta
          name="description"
          content="Calculate your legal retainer fee based on hourly, flat, or upfront billing models. Plan your legal budget with confidence."
        />
        <meta
          name="keywords"
          content="legal retainer calculator, attorney fee estimator, legal billing calculator, lawyer retainer cost"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/legal-retainer-calculator" />
        <meta property="og:title" content="Legal Retainer Calculator" />
        <meta
          property="og:description"
          content="Estimate your legal retainer fee and understand attorney billing models."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/legal-retainer-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Legal Retainer Calculator</h1>
            <p className={styles.subtitle}>
              Estimate your legal retainer fee and understand attorney billing.
            </p>
          </section>

          {/* Calculator Section */}
          <section className={styles.calculatorSection}>
            <div className={styles.calculatorCard}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.modeSelector}>
                  <label>
                    <input
                      type="radio"
                      checked={calculationMode === 'hourly'}
                      onChange={() => handleModeChange('hourly')}
                    />
                    Hourly
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={calculationMode === 'flat'}
                      onChange={() => handleModeChange('flat')}
                    />
                    Flat Fee
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={calculationMode === 'upfront'}
                      onChange={() => handleModeChange('upfront')}
                    />
                    Upfront
                  </label>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="attorneyRate" className={styles.label}>
                    Attorney Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    id="attorneyRate"
                    name="attorneyRate"
                    value={inputs.attorneyRate}
                    onChange={handleChange}
                    placeholder="e.g. 250"
                    step="5"
                    required
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="estimatedHours" className={styles.label}>
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    id="estimatedHours"
                    name="estimatedHours"
                    value={inputs.estimatedHours}
                    onChange={handleChange}
                    placeholder="e.g. 20"
                    step="0.5"
                    required
                    className={styles.input}
                  />
                </div>

                {calculationMode === 'flat' && (
                  <div className={styles.inputGroup}>
                    <label htmlFor="flatFee" className={styles.label}>
                      Flat Fee ($)
                    </label>
                    <input
                      type="number"
                      id="flatFee"
                      name="flatFee"
                      value={inputs.flatFee}
                      onChange={handleChange}
                      placeholder="e.g. 4,500"
                      step="100"
                      required
                      className={styles.input}
                    />
                  </div>
                )}

                {calculationMode === 'upfront' && (
                  <div className={styles.inputGroup}>
                    <label htmlFor="upfrontPayment" className={styles.label}>
                      Upfront Payment ($)
                    </label>
                    <input
                      type="number"
                      id="upfrontPayment"
                      name="upfrontPayment"
                      value={inputs.upfrontPayment}
                      onChange={handleChange}
                      placeholder="e.g. 5,000"
                      step="100"
                      required
                      className={styles.input}
                    />
                  </div>
                )}

                <button type="submit" className={styles.submitBtn}>
                  <span className={styles.btnText}>Calculate Retainer</span>
                  <span className={styles.arrow}>→</span>
                </button>

                {result && (
                  <div className={styles.resultSection}>
                    <h3>Retainer Summary</h3>
                    <div className={styles.resultGrid}>
                      {result.mode === 'hourly' && (
                        <>
                          <div className={styles.resultItem}>
                            <strong>Hourly Rate:</strong> ${result.rate}
                          </div>
                          <div className={styles.resultItem}>
                            <strong>Estimated Hours:</strong> {result.hours}
                          </div>
                          <div className={`${styles.resultItem} ${styles.highlight}`}>
                            <strong>Required Retainer:</strong> ${result.requiredRetainer}
                          </div>
                          <div className={styles.resultItem}>
                            <strong>Estimated Total:</strong> ${result.estimatedTotal}
                          </div>
                        </>
                      )}

                      {result.mode === 'flat' && (
                        <>
                          <div className={styles.resultItem}>
                            <strong>Flat Fee:</strong> ${result.flatFee}
                          </div>
                          <div className={`${styles.resultItem} ${styles.highlight}`}>
                            <strong>Retainer Due:</strong> ${result.requiredRetainer}
                          </div>
                          <div className={styles.resultItem}>
                            <strong>Covers 100%</strong> of legal costs
                          </div>
                        </>
                      )}

                      {result.mode === 'upfront' && (
                        <>
                          <div className={styles.resultItem}>
                            <strong>Hourly Rate:</strong> ${result.rate}
                          </div>
                          <div className={styles.resultItem}>
                            <strong>Estimated Cost:</strong> ${result.estimatedTotal}
                          </div>
                          <div className={`${styles.resultItem} ${styles.highlight}`}>
                            <strong>Upfront Payment:</strong> ${result.upfront}
                          </div>
                          <div className={styles.resultItem}>
                            <strong>Covers:</strong> {result.coverage}%
                          </div>
                        </>
                      )}
                    </div>
                    <div className={styles.note}>
                      A retainer is an upfront payment held in trust. It's drawn against as work is performed.
                    </div>
                  </div>
                )}
              </form>
            </div>
          </section>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Legal Retainers Matter</h3>
                <p>
                  A <strong>legal retainer</strong> is an upfront fee paid to secure an attorney’s services. It builds trust, ensures availability, and covers initial work. Understanding retainer costs helps avoid surprises and manage legal budgets.
                </p>

                <h4>How to Use This Calculator</h4>
                <p>Choose your billing model:</p>
                <ul className={styles.list}>
                  <li><strong>Hourly:</strong> Estimate total cost based on rate × hours</li>
                  <li><strong>Flat Fee:</strong> For predictable services like incorporations or wills</li>
                  <li><strong>Upfront Payment:</strong> See how much of your estimate a given retainer covers</li>
                </ul>

                <h4>The Retainer Formulas</h4>
                <div className={styles.formula}>
                  <code>Hourly Model: Retainer = Rate × Estimated Hours</code>
                </div>
                <div className={styles.formula}>
                  <code>Flat Fee Model: Retainer = Agreed Flat Fee</code>
                </div>
                <div className={styles.formula}>
                  <code>Coverage % = (Upfront Payment / Estimated Total) × 100</code>
                </div>
                <p>
                  The retainer is typically held in a <strong>trust account</strong> and billed against hourly.
                </p>

                <h4>Real-World Applications</h4>
                <ul className={styles.list}>
                  <li><strong>Business Law:</strong> Incorporation, contracts, compliance</li>
                  <li><strong>Real Estate:</strong> Closings, title disputes, leasing</li>
                  <li><strong>Family Law:</strong> Divorce, custody, prenups</li>
                  <li><strong>Intellectual Property:</strong> Trademarks, patents, licensing</li>
                </ul>

                <h4>Key Questions to Ask Your Attorney</h4>
                <ul className={styles.list}>
                  <li>Is the retainer refundable if unused?</li>
                  <li>How often will I receive billing statements?</li>
                  <li>What happens when the retainer runs low?</li>
                  <li>Are there additional costs (filing fees, experts)?</li>
                </ul>

                <h4>Example</h4>
                <p>
                  An attorney charges $300/hour for a 15-hour project. The estimated cost is <strong>$4,500</strong>. A retainer of $5,000 covers the work and provides a buffer. If only 12 hours are used, $1,400 may be refunded.
                </p>

                <h4>Tips for Clients</h4>
                <ul className={styles.list}>
                  <li>Get retainer terms in writing</li>
                  <li>Ask for regular updates</li>
                  <li>Clarify scope of work</li>
                  <li>Understand what’s included/excluded</li>
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
                  className={styles.ctaButton}
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

export default LegalRetainerCalculator;