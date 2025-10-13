import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import Link from 'next/link';
import styles from './durationconvexitycalculator.module.css';

const DurationConvexityCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [inputs, setInputs] = useState({
    faceValue: '1000',
    couponRate: '5',
    yieldRate: '6',
    years: '10',
    frequency: 'semiannually'
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const calculateDurationAndConvexity = () => {
    const F = parseFloat(inputs.faceValue);
    const c = parseFloat(inputs.couponRate) / 100;
    const y = parseFloat(inputs.yieldRate) / 100;
    const T = parseFloat(inputs.years);
    const m = inputs.frequency === 'annually' ? 1 : 2;

    const n = T * m;
    const C = (F * c) / m;

    let presentValue = 0;
    let weightedTime = 0;
    let weightedTimeSquared = 0;

    for (let t = 1; t <= n; t++) {
      const timeInYears = t / m;
      const discountFactor = Math.pow(1 + y / m, -t);
      const cashFlowPV = C * discountFactor;
      presentValue += cashFlowPV;
      weightedTime += timeInYears * cashFlowPV;
      weightedTimeSquared += timeInYears * timeInYears * cashFlowPV;
    }

    const finalDiscount = Math.pow(1 + y / m, -n);
    presentValue += F * finalDiscount;
    weightedTime += T * F * finalDiscount;
    weightedTimeSquared += T * T * F * finalDiscount;

    const macaulayDuration = presentValue > 0 ? weightedTime / presentValue : 0;
    const modifiedDuration = macaulayDuration / (1 + y / m);
    const convexity = (weightedTimeSquared / presentValue) / Math.pow(1 + y / m, 2);

    setResult({
      macaulay: macaulayDuration.toFixed(3),
      modified: modifiedDuration.toFixed(3),
      convexity: convexity.toFixed(3),
      price: presentValue.toFixed(2),
      couponRate: inputs.couponRate,
      yieldRate: inputs.yieldRate,
      years: inputs.years,
      frequency: inputs.frequency
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateDurationAndConvexity();
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
        <title>Duration & Convexity Calculator | Bond Price Sensitivity</title>
        <meta name="description" content="Calculate Macaulay duration, modified duration, and convexity for bonds. Understand interest rate risk with professional, responsive financial tool." />
        <meta name="keywords" content="duration calculator, convexity calculator, bond duration, modified duration, Macaulay duration, fixed income, interest rate risk" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/durationconvexitycalculator" />
      </Helmet>

      <div className={styles.page}>
        {/* Gap above content */}
        <div className={styles.spacerTop}></div>

        <div className={styles.contentWrapper}>
          {/* Hero */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Duration & Convexity Calculator</h1>
            <p className={styles.subtitle}>
              Measure bond price sensitivity to interest rate changes with precision.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="faceValue" className={styles.label}>Face Value ($)</label>
                <input
                  type="number"
                  id="faceValue"
                  name="faceValue"
                  value={inputs.faceValue}
                  onChange={handleChange}
                  placeholder="e.g. 1000"
                  step="1"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="couponRate" className={styles.label}>Annual Coupon Rate (%)</label>
                <input
                  type="number"
                  id="couponRate"
                  name="couponRate"
                  value={inputs.couponRate}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  step="0.01"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="yieldRate" className={styles.label}>Yield to Maturity (%)</label>
                <input
                  type="number"
                  id="yieldRate"
                  name="yieldRate"
                  value={inputs.yieldRate}
                  onChange={handleChange}
                  placeholder="e.g. 6"
                  step="0.01"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="years" className={styles.label}>Time to Maturity (Years)</label>
                <input
                  type="number"
                  id="years"
                  name="years"
                  value={inputs.years}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                  step="0.5"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="frequency" className={styles.label}>Coupon Frequency</label>
                <select
                  id="frequency"
                  name="frequency"
                  value={inputs.frequency}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="annually">Annually</option>
                  <option value="semiannually">Semi-Annually</option>
                </select>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Calculate Duration & Convexity
                <span className={styles.arrow}>→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Bond Sensitivity Metrics</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Macaulay Duration:</strong> {result.macaulay} years
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Modified Duration:</strong> {result.modified} years
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Convexity:</strong> {result.convexity} years²
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Estimated Price:</strong> ${result.price}
                  </div>
                </div>
                <p className={styles.note}>
                  Use modified duration for % price change estimates. Add convexity for greater accuracy.
                </p>
              </div>
            )}
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Duration & Convexity Matter</h3>
                <p>
                  <strong>Duration</strong> and <strong>convexity</strong> are key metrics for measuring how bond prices change with interest rates. They help investors manage interest rate risk in fixed-income portfolios.
                </p>

                <h4>How to Use This Calculator</h4>
                <p>
                  Enter the bond’s <strong>face value</strong>, <strong>coupon rate</strong>, <strong>yield to maturity</strong>, and <strong>maturity period</strong>. The tool calculates:
                </p>
                <ul className={styles.list}>
                  <li><strong>Macaulay Duration:</strong> Weighted average time to receive cash flows</li>
                  <li><strong>Modified Duration:</strong> Price sensitivity to yield changes (in %)</li>
                  <li><strong>Convexity:</strong> Curvature correction for large rate changes</li>
                </ul>

                <h4>The Formulas</h4>
                <div className={styles.formula}>
                  <code>Macaulay Duration = Σ [t × CFₜ / (1 + y/m)ᵗ] / Price</code>
                </div>
                <div className={styles.formula}>
                  <code>Modified Duration = Macaulay / (1 + y/m)</code>
                </div>
                <div className={styles.formula}>
                  <code>Convexity = Σ [t(t+1) × CFₜ / (1 + y/m)ᵗ⁺²] / (Price × (1 + y/m)²)</code>
                </div>
                <p>Where:</p>
                <ul className={styles.list}>
                  <li><strong>CFₜ</strong> = Cash flow at time t</li>
                  <li><strong>y</strong> = Yield to maturity</li>
                  <li><strong>m</strong> = Compounding frequency per year</li>
                  <li><strong>t</strong> = Time period (in years)</li>
                </ul>

                <h4>Real-World Applications</h4>
                <ul className={styles.list}>
                  <li><strong>Portfolio Risk Management:</strong> Match duration to investment horizon</li>
                  <li><strong>Interest Rate Hedging:</strong> Use duration to hedge against rate changes</li>
                  <li><strong>Bond Comparison:</strong> Choose bonds with lower sensitivity if rates are rising</li>
                  <li><strong>Immunization:</strong> Balance duration and convexity to protect portfolio value</li>
                </ul>

                <h4>Example</h4>
                <p>
                  A 10-year bond with a 5% coupon and 6% yield has a <strong>modified duration of 7.4 years</strong>. If rates rise 1%, the price drops ~7.4%. With convexity, the actual drop is slightly less (~7.1%) due to curvature.
                </p>

                <h4>Key Insights</h4>
                <ul className={styles.list}>
                  <li>Longer maturity → higher duration</li>
                  <li>Higher coupon → lower duration</li>
                  <li>Higher yield → lower duration</li>
                  <li>Convexity improves accuracy for large rate moves</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className={styles.ctaSection}>
            <h2>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
            <p>Free Financial Planning Tools – Try Now</p>
            {/* ✅ Correct Next.js Link — no <a> tag */}
            <Link
              href="/suite"
              className={styles.ctaButton}
              ref={ctaButtonRef}
              onMouseMove={handleMouseMove}
            >
              Explore All Calculators
              <span className={styles.arrow}>→</span>
            </Link>
          </section>
        </div>

        {/* Gap below content */}
        <div className={styles.spacerBottom}></div>
      </div>
    </>
  );
};

export default DurationConvexityCalculator;