import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './governmentbondcalculator.module.css';

const GovernmentBondCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [faceValue, setFaceValue] = useState('1000');
  const [couponRate, setCouponRate] = useState('5');
  const [yearsToMaturity, setYearsToMaturity] = useState('10');
  const [marketYield, setMarketYield] = useState('4.5');
  const [paymentsPerYear, setPaymentsPerYear] = useState('2'); // semi-annual
  const [result, setResult] = useState(null);

  // Helper: Parse number (remove commas, allow decimals)
  const parseNumber = (value) => {
    if (!value) return NaN;
    const cleaned = value.toString().replace(/[^0-9.]/g, '');
    return parseFloat(cleaned);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const F = parseNumber(faceValue);
    const c = parseNumber(couponRate) / 100; // Convert % to decimal
    const n = parseNumber(yearsToMaturity);
    const y = parseNumber(marketYield) / 100; // YTM as decimal
    const m = parseInt(paymentsPerYear);

    // Validate inputs
    if (isNaN(F) || isNaN(c) || isNaN(n) || isNaN(y) || isNaN(m)) {
      alert("Please enter valid numbers in all fields.");
      return;
    }
    if (F <= 0 || c < 0 || n <= 0 || y < 0 || m <= 0) {
      alert("Please enter positive values for all fields.");
      return;
    }

    // Calculate periodic coupon payment
    const couponPayment = (F * c) / m;
    const periods = n * m;
    const periodicYield = y / m;

    // Bond price = sum of discounted cash flows
    let price = 0;
    for (let t = 1; t <= periods; t++) {
      price += couponPayment / Math.pow(1 + periodicYield, t);
    }
    // Add present value of face value
    price += F / Math.pow(1 + periodicYield, periods);

    // Current Yield = Annual Coupon / Price
    const currentYield = ((F * c) / price) * 100;

    // Determine bond status
    const premium = price > F;
    const discount = price < F;
    const par = Math.abs(price - F) < 0.01;

    setResult({
      faceValue: F.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      couponRate: (c * 100).toFixed(2),
      marketYield: (y * 100).toFixed(2),
      price: price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      currentYield: currentYield.toFixed(2),
      premium,
      discount,
      par
    });
  };

  // Magnetic cursor effect for CTA button
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
        <title>Government Bond Calculator | Bond Price & Yield Tool</title>
        <meta
          name="description"
          content="Free government bond calculator to compute bond price, yield to maturity, current yield, and determine if a bond trades at premium, discount, or par."
        />
        <meta
          name="keywords"
          content="bond calculator, government bonds, treasury bonds, bond pricing, yield to maturity, fixed income calculator"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/government-bond-calculator" />
        <meta property="og:title" content="Government Bond Calculator - Free Online Tool" />
        <meta
          property="og:description"
          content="Calculate bond prices and yields based on coupon rate, market yield, and time to maturity."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/government-bond-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Government Bond Calculator</h1>
            <p className={styles.subtitle}>
              Calculate bond price, yield, and return to evaluate fixed-income investments.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter bond details to calculate price and yield metrics.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="faceValue" className={styles.label}>
                  Face Value ($)
                </label>
                <input
                  id="faceValue"
                  type="text"
                  value={faceValue}
                  onChange={(e) => setFaceValue(e.target.value)}
                  placeholder="e.g. 1,000"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="couponRate" className={styles.label}>
                  Annual Coupon Rate (%)
                </label>
                <input
                  id="couponRate"
                  type="number"
                  value={couponRate}
                  onChange={(e) => setCouponRate(e.target.value)}
                  placeholder="e.g. 5"
                  className={styles.input}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="yearsToMaturity" className={styles.label}>
                  Years to Maturity
                </label>
                <input
                  id="yearsToMaturity"
                  type="number"
                  value={yearsToMaturity}
                  onChange={(e) => setYearsToMaturity(e.target.value)}
                  placeholder="e.g. 10"
                  className={styles.input}
                  min="0.5"
                  step="0.5"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="marketYield" className={styles.label}>
                  Market Yield (YTM) (%)
                </label>
                <input
                  id="marketYield"
                  type="number"
                  value={marketYield}
                  onChange={(e) => setMarketYield(e.target.value)}
                  placeholder="e.g. 4.5"
                  className={styles.input}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="paymentsPerYear" className={styles.label}>
                  Payments Per Year
                </label>
                <select
                  id="paymentsPerYear"
                  value={paymentsPerYear}
                  onChange={(e) => setPaymentsPerYear(e.target.value)}
                  className={styles.input}
                >
                  <option value="1">Annually</option>
                  <option value="2">Semi-Annually</option>
                  <option value="4">Quarterly</option>
                  <option value="12">Monthly</option>
                </select>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className={styles.btnText}>Calculate Bond Value</span>
                <span className={styles.arrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Bond Valuation</h3>
                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Face Value:</strong> ${result.faceValue}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Coupon Rate:</strong> {result.couponRate}%
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Market Yield:</strong> {result.marketYield}%
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight} ${result.premium ? styles.positive : result.discount ? styles.negative : ''}`}>
                      <strong>Price:</strong> ${result.price}
                    </div>
                  </div>

                  <div className={styles.resultGrid} style={{ marginTop: '1rem' }}>
                    <div className={styles.resultItem}>
                      <strong>Current Yield:</strong> {result.currentYield}%
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Status:</strong>{' '}
                      {result.premium ? 'Premium' : result.discount ? 'Discount' : 'Par'}
                    </div>
                  </div>

                  <div className={styles.note}>
                    {result.premium
                      ? `Priced above par ($${result.price} > $${result.faceValue}) — demand exceeds supply.`
                      : result.discount
                      ? `Priced below par ($${result.price} < $${result.faceValue}) — higher yield attracts buyers.`
                      : `Trading at par — coupon rate equals market yield.`
                    }
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why a Bond Calculator Matters</h3>
                <p>
                  A <strong>Bond Calculator</strong> helps investors evaluate fixed-income securities by calculating price, yield, and return. It's essential for comparing bonds, assessing risk, and making informed investment decisions in rising or falling interest rate environments.
                </p>

                <h4>How to Use This Calculator</h4>
                <ul className={styles.list}>
                  <li><strong>Face Value:</strong> The amount paid at maturity (usually $1,000).</li>
                  <li><strong>Coupon Rate:</strong> Annual interest rate paid by the bond.</li>
                  <li><strong>Years to Maturity:</strong> Time until the bond matures.</li>
                  <li><strong>Market Yield (YTM):</strong> Current yield required by investors.</li>
                  <li><strong>Payments Per Year:</strong> How often interest is paid (e.g., semi-annual).</li>
                  <li>Click "Calculate" to see bond price and current yield.</li>
                </ul>

                <h4>Formulas Used</h4>
                <div className={styles.formula}>
                  <code>Bond Price = Σ [C/(1+y/m)^t] + F/(1+y/m)^n</code>
                  <br />
                  <code>Current Yield = (Annual Coupon / Bond Price) × 100</code>
                </div>
                <p>Where:</p>
                <ul className={styles.list}>
                  <li><strong>F</strong> = Face Value</li>
                  <li><strong>C</strong> = Periodic Coupon Payment</li>
                  <li><strong>y</strong> = Yield to Maturity (YTM)</li>
                  <li><strong>m</strong> = Payments per year</li>
                  <li><strong>n</strong> = Total number of periods</li>
                </ul>

                <h4>Understanding Bond Pricing</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Coupon vs. Market Rate</th>
                      <th>Bond Price</th>
                      <th>Investor Benefit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Coupon {'>'} Market</td>
                      <td>Premium</td>
                      <td>High income, but price drops to par at maturity</td>
                    </tr>
                    <tr>
                      <td>Coupon = Market</td>
                      <td>Par</td>
                      <td>Yield equals coupon rate</td>
                    </tr>
                    <tr>
                      <td>Coupon {'<'} Market</td>
                      <td>Discount</td>
                      <td>Lower income, but capital gain at maturity</td>
                    </tr>
                  </tbody>
                </table>

                <h4>Tips for Bond Investing</h4>
                <ul className={styles.list}>
                  <li>✅ <strong>Buy bonds at a discount</strong> when rates are rising</li>
                  <li>✅ <strong>Sell premium bonds</strong> before maturity to lock in gains</li>
                  <li>✅ <strong>Diversify maturities</strong> with a bond ladder</li>
                  <li>✅ <strong>Consider tax implications</strong> (municipal vs. corporate)</li>
                  <li>✅ <strong>Monitor credit ratings</strong> to avoid default risk</li>
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

export default GovernmentBondCalculator;