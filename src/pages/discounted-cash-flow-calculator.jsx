import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './discountedcashflowcalculator.module.css';

const DiscountedCashFlowCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [inputs, setInputs] = useState({
    cashFlows: ['', '', '', '', ''],
    discountRate: '10',
    terminalValue: '',
    includeTerminal: false
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCashFlowChange = (index, value) => {
    const newFlows = [...inputs.cashFlows];
    newFlows[index] = value;
    setInputs(prev => ({ ...prev, cashFlows: newFlows }));
  };

  const calculateDCF = () => {
    const rate = parseFloat(inputs.discountRate) / 100;
    const cashFlows = inputs.cashFlows.map(f => parseFloat(f) || 0);
    const terminalValue = inputs.includeTerminal ? parseFloat(inputs.terminalValue) || 0 : 0;

    if (rate < 0) {
      alert("Discount rate must be non-negative.");
      return;
    }

    let npv = 0;

    // Discount each cash flow: CF / (1 + r)^t
    cashFlows.forEach((cf, t) => {
      if (cf < 0) {
        alert(`Cash flow for Year ${t + 1} cannot be negative.`);
        return;
      }
      npv += cf / Math.pow(1 + rate, t + 1);
    });

    // Add terminal value (discounted to present)
    if (inputs.includeTerminal && terminalValue > 0) {
      const years = cashFlows.length;
      npv += terminalValue / Math.pow(1 + rate, years);
    }

    setResult({
      npv: npv.toFixed(2),
      discountRate: inputs.discountRate,
      years: cashFlows.length,
      terminalValue: inputs.includeTerminal ? terminalValue.toFixed(2) : '0',
      cashFlows: cashFlows.map(cf => cf.toFixed(2))
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateDCF();
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
        <title>Discounted Cash Flow Calculator | DCF Valuation Tool</title>
        <meta
          name="description"
          content="Free discounted cash flow (DCF) calculator to estimate the intrinsic value of investments using future cash flows and discount rate."
        />
        <meta
          name="keywords"
          content="DCF calculator, discounted cash flow, investment valuation, NPV calculator, business valuation tool"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/discounted-cash-flow-calculator" />
        <meta property="og:title" content="Discounted Cash Flow Calculator - Investment Valuation" />
        <meta
          property="og:description"
          content="Calculate the net present value (NPV) of future cash flows to determine if an investment is undervalued or overvalued."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/discounted-cash-flow-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Discounted Cash Flow (DCF) Calculator</h1>
            <p className={styles.subtitle}>
              Estimate the intrinsic value of an investment using future cash flows and discount rate.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter projected annual cash flows and your required rate of return.
              </p>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Annual Cash Flows ($)</label>
                <div className={styles.cashFlowGrid}>
                  {inputs.cashFlows.map((flow, index) => (
                    <div key={index} className={styles.cfInput}>
                      <label>Year {index + 1}</label>
                      <input
                        type="number"
                        value={flow}
                        onChange={(e) => handleCashFlowChange(index, e.target.value)}
                        placeholder="e.g. 10,000"
                        step="100"
                        className={styles.input}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="discountRate" className={styles.label}>
                  Discount Rate (%)
                </label>
                <input
                  type="number"
                  id="discountRate"
                  name="discountRate"
                  value={inputs.discountRate}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                  step="0.1"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="includeTerminal"
                    checked={inputs.includeTerminal}
                    onChange={handleChange}
                  />
                  Include Terminal Value
                </label>
              </div>

              {inputs.includeTerminal && (
                <div className={styles.inputGroup}>
                  <label htmlFor="terminalValue" className={styles.label}>
                    Terminal Value ($)
                  </label>
                  <input
                    type="number"
                    id="terminalValue"
                    name="terminalValue"
                    value={inputs.terminalValue}
                    onChange={handleChange}
                    placeholder="e.g. 100,000"
                    step="1000"
                    className={styles.input}
                  />
                </div>
              )}

              <button type="submit" className={styles.ctaButton}>
                <span className={styles.btnText}>Calculate DCF Value</span>
                <span className={styles.btnArrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Discounted Cash Flow Result</h3>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Net Present Value (NPV):</strong> ${result.npv}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Discount Rate:</strong> {result.discountRate}%
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Projection Period:</strong> {result.years} years
                  </div>
                  {result.terminalValue !== '0' && (
                    <div className={styles.resultItem}>
                      <strong>Terminal Value:</strong> ${result.terminalValue}
                    </div>
                  )}
                  <div className={styles.note}>
                    A positive NPV suggests the investment is undervalued. A negative NPV indicates overvaluation.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why DCF Matters</h3>
                <p>
                  <strong>Discounted Cash Flow (DCF)</strong> is a valuation method used to estimate the value of an investment based on its expected future cash flows. It’s widely used in finance, equity research, and business valuation to determine intrinsic value.
                </p>

                <h4>How to Use This Calculator</h4>
                <p>
                  Enter your projected <strong>annual cash flows</strong> (e.g., from a business, rental property, or stock), your <strong>required rate of return (discount rate)</strong>, and optionally a <strong>terminal value</strong> for long-term growth. The tool discounts each cash flow to its present value and sums them to calculate the <strong>Net Present Value (NPV)</strong>.
                </p>

                <h4>The DCF Formula</h4>
                <div className={styles.formula}>
                  <code>NPV = Σ [CFₜ / (1 + r)ᵗ] + [TV / (1 + r)ⁿ]</code>
                </div>
                <p>
                  Where:
                </p>
                <ul className={styles.list}>
                  <li><strong>CFₜ</strong> = Cash flow in year t</li>
                  <li><strong>r</strong> = Discount rate (required return)</li>
                  <li><strong>t</strong> = Time period (year)</li>
                  <li><strong>TV</strong> = Terminal value (optional)</li>
                  <li><strong>n</strong> = Final year of projection</li>
                </ul>
                <p>
                  This formula accounts for the <strong>time value of money</strong> — future cash is worth less than cash today.
                </p>

                <h4>Real-World Applications</h4>
                <ul className={styles.list}>
                  <li><strong>Stock Valuation:</strong> Estimate fair value of a company’s shares</li>
                  <li><strong>Real Estate:</strong> Value rental properties based on net income</li>
                  <li><strong>Startup Investing:</strong> Assess venture capital opportunities</li>
                  <li><strong>M&A:</strong> Evaluate acquisition targets</li>
                </ul>

                <h4>Key Assumptions</h4>
                <ul className={styles.list}>
                  <li><strong>Accurate Cash Flow Projections:</strong> The output depends heavily on input quality</li>
                  <li><strong>Appropriate Discount Rate:</strong> Reflects risk (e.g., 10% for moderate risk)</li>
                  <li><strong>Terminal Value:</strong> Often calculated using perpetuity growth model</li>
                </ul>

                <h4>Example</h4>
                <p>
                  A property generates $20,000/year for 5 years, with a terminal value of $200,000. At a 12% discount rate, the DCF value is <strong>$182,345</strong>. If the purchase price is lower, it may be a good investment.
                </p>

                <h4>Tips for Better Accuracy</h4>
                <ul className={styles.list}>
                  <li>Use conservative cash flow estimates</li>
                  <li>Adjust discount rate for risk level (higher risk = higher rate)</li>
                  <li>Consider sensitivity analysis with different scenarios</li>
                  <li>For terminal value, use sustainable growth rates (typically 2–3%)</li>
                  <li>Compare DCF value to current market price</li>
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

export default DiscountedCashFlowCalculator;