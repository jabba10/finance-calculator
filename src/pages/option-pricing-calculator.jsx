import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './optionpricingcalculator.module.css';

// Helper: Standard normal CDF approximation
const normCDF = (x) => {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (x > 0) prob = 1 - prob;
  return prob;
};

// Helper: Standard normal PDF
const normPDF = (x) => {
  return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
};

const OptionPricingCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [inputs, setInputs] = useState({
    spotPrice: '100',
    strikePrice: '100',
    timeToExpiry: '1',
    riskFreeRate: '5',
    volatility: '20'
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateOptionPrices = () => {
    const S = parseFloat(inputs.spotPrice);     // Spot price
    const K = parseFloat(inputs.strikePrice);   // Strike price
    const T = parseFloat(inputs.timeToExpiry);  // Time to expiry (years)
    const r = parseFloat(inputs.riskFreeRate) / 100; // Risk-free rate
    const sigma = parseFloat(inputs.volatility) / 100; // Volatility (std dev)

    if (isNaN(S) || isNaN(K) || isNaN(T) || isNaN(r) || isNaN(sigma)) {
      alert("Please enter valid numbers for all fields.");
      return;
    }

    if (S <= 0 || K <= 0 || T <= 0 || sigma <= 0) {
      alert("Spot price, strike price, time, and volatility must be positive.");
      return;
    }

    const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    const callPrice = S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
    const putPrice = K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1);

    // Greeks (basic)
    const deltaCall = normCDF(d1);
    const deltaPut = normCDF(d1) - 1;
    const gamma = normPDF(d1) / (S * sigma * Math.sqrt(T));
    const vega = S * normPDF(d1) * Math.sqrt(T) / 100; // per 1% vol

    setResult({
      call: callPrice.toFixed(2),
      put: putPrice.toFixed(2),
      deltaCall: deltaCall.toFixed(4),
      deltaPut: deltaPut.toFixed(4),
      gamma: gamma.toFixed(6),
      vega: vega.toFixed(4),
      d1: d1.toFixed(4),
      d2: d2.toFixed(4),
      spot: S,
      strike: K,
      time: T,
      rate: (r * 100).toFixed(2),
      vol: (sigma * 100).toFixed(2)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateOptionPrices();
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
        <title>Option Pricing Calculator | Black-Scholes Model Tool</title>
        <meta
          name="description"
          content="Free option pricing calculator using the Black-Scholes model to compute call and put prices, deltas, gamma, and vega."
        />
        <meta
          name="keywords"
          content="option calculator, Black-Scholes, call put pricing, options trading, financial derivatives, volatility calculator"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/option-pricing-calculator" />
        <meta property="og:title" content="Option Pricing Calculator - Black-Scholes Model" />
        <meta
          property="og:description"
          content="Calculate fair value of European call and put options with Greeks (delta, gamma, vega) using the Black-Scholes formula."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/option-pricing-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Option Pricing Calculator</h1>
            <p className={styles.subtitle}>
              Price European call and put options using the Black-Scholes model.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter parameters to calculate option prices and Greeks.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="spotPrice" className={styles.label}>
                  Current Stock Price ($)
                </label>
                <input
                  type="number"
                  id="spotPrice"
                  name="spotPrice"
                  value={inputs.spotPrice}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  step="0.01"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="strikePrice" className={styles.label}>
                  Strike Price ($)
                </label>
                <input
                  type="number"
                  id="strikePrice"
                  name="strikePrice"
                  value={inputs.strikePrice}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  step="0.01"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="timeToExpiry" className={styles.label}>
                  Time to Expiry (Years)
                </label>
                <input
                  type="number"
                  id="timeToExpiry"
                  name="timeToExpiry"
                  value={inputs.timeToExpiry}
                  onChange={handleChange}
                  placeholder="e.g. 1"
                  step="0.01"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="riskFreeRate" className={styles.label}>
                  Risk-Free Rate (%)
                </label>
                <input
                  type="number"
                  id="riskFreeRate"
                  name="riskFreeRate"
                  value={inputs.riskFreeRate}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  step="0.01"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="volatility" className={styles.label}>
                  Volatility (σ, %)
                </label>
                <input
                  type="number"
                  id="volatility"
                  name="volatility"
                  value={inputs.volatility}
                  onChange={handleChange}
                  placeholder="e.g. 20"
                  step="0.01"
                  required
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.ctaButton}>
                <span className={styles.btnText}>Calculate Option Prices</span>
                <span className={styles.btnArrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Option Pricing Results (Black-Scholes)</h3>
                  <div className={styles.resultGrid}>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Call Price:</strong> ${result.call}
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Put Price:</strong> ${result.put}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Delta (Call):</strong> {result.deltaCall}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Delta (Put):</strong> {result.deltaPut}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Gamma:</strong> {result.gamma}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Vega:</strong> ${result.vega}/1%
                    </div>
                  </div>
                  <div className={styles.note}>
                    Based on Black-Scholes model. Greeks help manage risk in options trading.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Option Pricing Matters</h3>
                <p>
                  <strong>Option pricing</strong> is essential for traders, investors, and risk managers to determine the fair value of call and put options. Mispricing creates arbitrage opportunities, while accurate valuation supports hedging and speculation.
                </p>

                <h4>How to Use This Calculator</h4>
                <p>
                  Enter the <strong>current stock price</strong>, <strong>strike price</strong>, <strong>time to expiry</strong>, <strong>risk-free rate</strong>, and <strong>volatility</strong>. The calculator uses the <strong>Black-Scholes model</strong> to compute:
                </p>
                <ul className={styles.list}>
                  <li><strong>Call & Put Prices</strong></li>
                  <li><strong>Greeks:</strong> Delta, Gamma, Vega (risk sensitivities)</li>
                </ul>

                <h4>The Black-Scholes Formula</h4>
                <div className={styles.formula}>
                  <code>C = S·N(d₁) − K·e⁻ʳᵀ·N(d₂)</code>
                </div>
                <div className={styles.formula}>
                  <code>P = K·e⁻ʳᵀ·N(−d₂) − S·N(−d₁)</code>
                </div>
                <p>Where:</p>
                <div className={styles.formula}>
                  <code>d₁ = [ln(S/K) + (r + σ²/2)T] / (σ√T)</code>
                </div>
                <div className={styles.formula}>
                  <code>d₂ = d₁ − σ√T</code>
                </div>
                <ul className={styles.list}>
                  <li><strong>S</strong> = Spot price</li>
                  <li><strong>K</strong> = Strike price</li>
                  <li><strong>r</strong> = Risk-free rate</li>
                  <li><strong>T</strong> = Time to expiry (years)</li>
                  <li><strong>σ</strong> = Volatility</li>
                  <li><strong>N()</strong> = Standard normal CDF</li>
                </ul>

                <h4>Key Greeks</h4>
                <ul className={styles.list}>
                  <li><strong>Delta:</strong> Option price change per $1 move in stock</li>
                  <li><strong>Gamma:</strong> Rate of change of delta</li>
                  <li><strong>Vega:</strong> Sensitivity to volatility changes</li>
                </ul>

                <h4>Real-World Applications</h4>
                <ul className={styles.list}>
                  <li><strong>Trading:</strong> Identify under/overvalued options</li>
                  <li><strong>Hedging:</strong> Use delta to hedge portfolio risk</li>
                  <li><strong>Risk Management:</strong> Monitor gamma and vega exposure</li>
                  <li><strong>Employee Stock Options:</strong> Estimate fair value</li>
                </ul>

                <h4>Assumptions</h4>
                <ul className={styles.list}>
                  <li>No dividends</li>
                  <li>No transaction costs</li>
                  <li>Constant volatility and interest rates</li>
                  <li>Log-normal price distribution</li>
                  <li>European-style (no early exercise)</li>
                </ul>

                <h4>Limitations</h4>
                <ul className={styles.list}>
                  <li>Does not price American options (early exercise)</li>
                  <li>Volatility is assumed constant (not realistic)</li>
                  <li>Ignores market frictions like bid-ask spreads</li>
                  <li>Assumes continuous trading and no jumps</li>
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

export default OptionPricingCalculator;