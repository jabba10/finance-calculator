import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './developmentfeasibilitycalculator.module.css';

const DevelopmentFeasibilityCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [inputs, setInputs] = useState({
    npv: '',
    roi: '',
    marketScore: ''
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

    const npv = parseFloat(inputs.npv);
    const roi = parseFloat(inputs.roi);
    const marketScore = parseFloat(inputs.marketScore); // 1-10 scale

    if (isNaN(npv) || isNaN(roi) || isNaN(marketScore)) {
      alert("Please enter valid numbers for all fields.");
      return;
    }

    if (marketScore < 1 || marketScore > 10) {
      alert("Market Demand must be between 1 and 10.");
      return;
    }

    // Normalize NPV (scale 1-10): assume $100k = 5, $1M = 10
    const normalizedNPV = Math.min(10, Math.max(1, (Math.log10(npv / 10000 + 1)) * 2));
    
    // Normalize ROI (scale 1-10): 0% = 1, 50%+ = 10
    const normalizedROI = Math.min(10, Math.max(1, roi / 5));
    
    // Market score already on 1-10
    const feasibilityScore = ((normalizedNPV + normalizedROI + marketScore) / 3).toFixed(2);
    
    let recommendation = '';
    if (feasibilityScore >= 8) recommendation = 'Highly Feasible';
    else if (feasibilityScore >= 6) recommendation = 'Feasible';
    else if (feasibilityScore >= 4) recommendation = 'Marginal';
    else recommendation = 'Not Feasible';

    setResult({
      score: feasibilityScore,
      recommendation,
      normalizedNPV: normalizedNPV.toFixed(2),
      normalizedROI: normalizedROI.toFixed(2),
      marketScore: marketScore.toFixed(2)
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
        <title>Development Feasibility Calculator | Project Viability Tool</title>
        <meta
          name="description"
          content="Free development feasibility calculator to evaluate real estate, product, or business project viability using NPV, ROI, and market demand."
        />
        <meta
          name="keywords"
          content="feasibility calculator, project evaluation, NPV calculator, ROI analysis, business planning"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/development-feasibility-calculator" />
        <meta property="og:title" content="Development Feasibility Calculator - Assess Project Viability" />
        <meta
          property="og:description"
          content="Evaluate whether a real estate, product, or business development project is worth pursuing based on financial and market factors."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/development-feasibility-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Development Feasibility Calculator</h1>
            <p className={styles.subtitle}>
              Evaluate the viability of real estate, product, or business development projects.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter project metrics — we extract numbers from any format (e.g., $500K, 25%, 7/10).
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="npv" className={styles.label}>
                  Net Present Value (NPV) ($)
                </label>
                <input
                  type="number"
                  id="npv"
                  name="npv"
                  value={inputs.npv}
                  onChange={handleChange}
                  placeholder="e.g. 500000"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="roi" className={styles.label}>
                  Expected ROI (%)
                </label>
                <input
                  type="number"
                  id="roi"
                  name="roi"
                  value={inputs.roi}
                  onChange={handleChange}
                  placeholder="e.g. 25"
                  step="0.1"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="marketScore" className={styles.label}>
                  Market Demand (1–10)
                </label>
                <input
                  type="number"
                  id="marketScore"
                  name="marketScore"
                  value={inputs.marketScore}
                  onChange={handleChange}
                  placeholder="e.g. 7"
                  min="1"
                  max="10"
                  step="0.1"
                  required
                  className={styles.input}
                />
                <small className={styles.note}>
                  Rate market potential from 1 (low) to 10 (high)
                </small>
              </div>

              <button type="submit" className={styles.ctaButton}>
                <span className={styles.btnText}>Calculate Feasibility</span>
                <span className={styles.btnArrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Feasibility Assessment</h3>
                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Feasibility Score:</strong> {result.score}/10
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Recommendation:</strong>{' '}
                      <span className={`${styles.badge} ${styles[`badge${result.recommendation.replace(/\s+/g, '')}`]}`}>
                        {result.recommendation}
                      </span>
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Normalized Metrics:</strong> NPV: {result.normalizedNPV}, ROI: {result.normalizedROI}, Market: {result.marketScore}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Development Feasibility Matters</h3>
                <p>
                  A <strong>Development Feasibility Study</strong> helps determine whether a project — real estate, product, or business — is worth pursuing before significant resources are committed.
                </p>

                <h4>How to Use This Calculator</h4>
                <p>
                  Enter the estimated <strong>Net Present Value (NPV)</strong>, <strong>Return on Investment (ROI)</strong>, and a <strong>Market Demand score (1–10)</strong>. The tool combines these factors into a single feasibility score to guide your decision.
                </p>

                <h4>The Feasibility Formula</h4>
                <div className={styles.formula}>
                  <code>Feasibility Score = (Normalized NPV + Normalized ROI + Market Score) / 3</code>
                </div>
                <p>
                  Each input is normalized to a 1–10 scale to ensure balanced weighting. A score above <strong>7</strong> suggests high feasibility, while below <strong>5</strong> indicates high risk.
                </p>

                <h4>Example Use Cases</h4>
                <ul className={styles.list}>
                  <li><strong>Real Estate:</strong> Assess if a new housing development will be profitable.</li>
                  <li><strong>Product Launch:</strong> Evaluate if a tech product will succeed in the market.</li>
                  <li><strong>Business Expansion:</strong> Decide whether to open a new location.</li>
                </ul>

                <h4>Key Considerations</h4>
                <ul className={styles.list}>
                  <li><strong>NPV:</strong> Higher values indicate better long-term profitability</li>
                  <li><strong>ROI:</strong> Should exceed cost of capital and alternative investments</li>
                  <li><strong>Market Demand:</strong> Subjective but critical — validate with research</li>
                  <li><strong>Risk Adjustment:</strong> Consider volatility, competition, and execution risk</li>
                  <li><strong>Sensitivity Analysis:</strong> Test different assumptions for key variables</li>
                </ul>

                <h4>Next Steps After Evaluation</h4>
                <ul className={styles.list}>
                  <li>✅ Conduct detailed market research</li>
                  <li>✅ Perform competitive analysis</li>
                  <li>✅ Create a comprehensive business plan</li>
                  <li>✅ Secure necessary funding or approvals</li>
                  <li>✅ Develop a phased implementation strategy</li>
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

export default DevelopmentFeasibilityCalculator;