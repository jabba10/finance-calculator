import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './purchasingpowerparitycalculator.module.css';

const PurchasingPowerParityCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [inputs, setInputs] = useState({
    priceA: '',
    exchangeRate: ''
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

    const priceA = parseFloat(inputs.priceA);
    const exchangeRate = parseFloat(inputs.exchangeRate); // Units of Currency B per 1 Unit of Currency A

    if (isNaN(priceA) || isNaN(exchangeRate) || priceA <= 0 || exchangeRate <= 0) {
      alert("Please enter valid positive values for both fields.");
      return;
    }

    const priceB = priceA * exchangeRate;

    setResult({
      priceA: priceA.toFixed(2),
      exchangeRate: exchangeRate.toFixed(4),
      priceB: priceB.toFixed(2)
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
        <title>Purchasing Power Parity Calculator | PPP Tool</title>
        <meta
          name="description"
          content="Free purchasing power parity (PPP) calculator to compare currency values and cost of living between countries."
        />
        <meta
          name="keywords"
          content="PPP calculator, purchasing power parity, currency comparison, cost of living, international economics"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/purchasing-power-parity-calculator" />
        <meta property="og:title" content="Purchasing Power Parity Calculator - Compare Currencies" />
        <meta
          property="og:description"
          content="Calculate how much a good should cost in another country based on exchange rates and PPP theory."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/purchasing-power-parity-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Purchasing Power Parity (PPP) Calculator</h1>
            <p className={styles.subtitle}>
              Compare the relative value of currencies based on the cost of goods across countries.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="priceA" className={styles.label}>
                  Price in Country A ($)
                </label>
                <input
                  type="number"
                  id="priceA"
                  name="priceA"
                  value={inputs.priceA}
                  onChange={handleChange}
                  placeholder="e.g. 5.00"
                  step="0.01"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="exchangeRate" className={styles.label}>
                  Exchange Rate (B per A)
                </label>
                <input
                  type="number"
                  id="exchangeRate"
                  name="exchangeRate"
                  value={inputs.exchangeRate}
                  onChange={handleChange}
                  placeholder="e.g. 1.25"
                  step="0.0001"
                  required
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.ctaButton}>
                <span className={styles.btnText}>Calculate PPP</span>
                <span className={styles.btnArrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>PPP Result</h3>
                  <p>
                    A good costing <strong>${result.priceA}</strong> in Country A
                    should cost <strong>${result.priceB}</strong> in Country B
                    at an exchange rate of <strong>{result.exchangeRate}</strong>.
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why PPP Matters</h3>
                <p>
                  <strong>Purchasing Power Parity (PPP)</strong> helps compare economic productivity and standards of living between countries by equalizing the purchasing power of different currencies.
                </p>

                <h4>How to Use This Calculator</h4>
                <p>
                  Enter the price of a common good (like a burger or coffee) in one country, and the current exchange rate. The calculator estimates what that same good <em>should</em> cost in another country if PPP holds.
                </p>

                <h4>The PPP Formula</h4>
                <div className={styles.formula}>
                  <code>Price in Country B = Price in Country A × Exchange Rate</code>
                </div>
                <p>
                  This helps identify <strong>overvalued or undervalued currencies</strong> and is widely used in economics, international finance, and policy-making.
                </p>

                <h4>Example</h4>
                <p>
                  If a coffee costs $3.00 in the US and the USD/EUR exchange rate is 0.92, PPP suggests it should cost about <strong>$2.76 in Europe</strong>. If it costs more, the euro may be overvalued.
                </p>

                <h4>Real-World Applications</h4>
                <ul className={styles.list}>
                  <li><strong>Cost of Living Comparisons:</strong> Adjust salaries for international relocation</li>
                  <li><strong>Economic Indicators:</strong> IMF and World Bank use PPP to compare GDP across nations</li>
                  <li><strong>Investment Decisions:</strong> Assess market pricing and profitability abroad</li>
                  <li><strong>Inflation Analysis:</strong> Track real changes in purchasing power over time</li>
                  <li><strong>Currency Valuation:</strong> Determine if a currency is trading above or below fair value</li>
                </ul>

                <h4>Limitations of PPP</h4>
                <ul className={styles.list}>
                  <li>Doesn't account for non-tradable goods (like haircuts or rent)</li>
                  <li>Tariffs, taxes, and transportation costs affect real prices</li>
                  <li>Quality differences aren't captured</li>
                  <li>Short-term deviations are common due to speculation and capital flows</li>
                  <li>Assumes no trade barriers or transaction costs</li>
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
                  <span className={styles.btnText}>View All Tools</span>
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

export default PurchasingPowerParityCalculator;