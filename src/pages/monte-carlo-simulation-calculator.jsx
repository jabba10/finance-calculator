import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './montecarlosimulationcalculator.module.css';

const MonteCarloSimulationCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [inputs, setInputs] = useState({
    initialInvestment: '10000',
    annualReturn: '8',
    volatility: '15',
    years: '10',
    trials: '1000'
  });

  const [results, setResults] = useState(null);

  // Generate random return using normal distribution approximation
  const getRandomReturn = (mean, stdDev) => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + z * stdDev;
  };

  const runSimulation = () => {
    const initial = parseFloat(inputs.initialInvestment);
    const meanReturn = parseFloat(inputs.annualReturn) / 100;
    const volatility = parseFloat(inputs.volatility) / 100;
    const years = parseInt(inputs.years);
    const trials = parseInt(inputs.trials);

    if (initial <= 0 || meanReturn < 0 || volatility < 0 || years <= 0 || trials < 100) {
      alert("Please enter valid positive values.");
      return;
    }

    const outcomes = [];

    for (let i = 0; i < trials; i++) {
      let value = initial;
      for (let year = 0; year < years; year++) {
        const randomReturn = getRandomReturn(meanReturn, volatility);
        value *= (1 + randomReturn);
      }
      outcomes.push(value);
    }

    // Sort and calculate percentiles
    outcomes.sort((a, b) => a - b);
    const avg = outcomes.reduce((a, b) => a + b, 0) / trials;
    const min = outcomes[0];
    const max = outcomes[outcomes.length - 1];
    const p10 = outcomes[Math.floor(0.1 * trials)];
    const p90 = outcomes[Math.floor(0.9 * trials)];

    setResults({
      initial,
      years,
      avg: avg.toFixed(2),
      min: min.toFixed(2),
      max: max.toFixed(2),
      p10: p10.toFixed(2),
      p90: p90.toFixed(2),
      trials
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runSimulation();
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
        <title>Monte Carlo Simulation Calculator | Investment Risk Tool</title>
        <meta
          name="description"
          content="Free Monte Carlo simulation calculator to model thousands of investment outcomes and understand risk, volatility, and potential returns over time."
        />
        <meta
          name="keywords"
          content="monte carlo calculator, investment simulation, portfolio risk, financial modeling, retirement planning tool"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/monte-carlo-simulation-calculator" />
        <meta property="og:title" content="Monte Carlo Simulation Calculator - Model Investment Outcomes" />
        <meta
          property="og:description"
          content="Simulate thousands of investment paths to visualize risk, return ranges, and probability of success."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/monte-carlo-simulation-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Monte Carlo Simulation Calculator</h1>
            <p className={styles.subtitle}>
              Simulate thousands of investment outcomes to understand risk and potential returns.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter investment parameters — we'll simulate thousands of possible outcomes.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="initialInvestment" className={styles.label}>
                  Initial Investment ($)
                </label>
                <input
                  type="number"
                  id="initialInvestment"
                  name="initialInvestment"
                  value={inputs.initialInvestment}
                  onChange={handleChange}
                  placeholder="e.g. 10,000"
                  step="100"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="annualReturn" className={styles.label}>
                  Avg Annual Return (%)
                </label>
                <input
                  type="number"
                  id="annualReturn"
                  name="annualReturn"
                  value={inputs.annualReturn}
                  onChange={handleChange}
                  placeholder="e.g. 8"
                  step="0.1"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="volatility" className={styles.label}>
                  Volatility (Std Dev %)
                </label>
                <input
                  type="number"
                  id="volatility"
                  name="volatility"
                  value={inputs.volatility}
                  onChange={handleChange}
                  placeholder="e.g. 15"
                  step="0.1"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="years" className={styles.label}>
                  Investment Horizon (Years)
                </label>
                <input
                  type="number"
                  id="years"
                  name="years"
                  value={inputs.years}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                  min="1"
                  max="50"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="trials" className={styles.label}>
                  Number of Simulations
                </label>
                <input
                  type="number"
                  id="trials"
                  name="trials"
                  value={inputs.trials}
                  onChange={handleChange}
                  placeholder="e.g. 1,000"
                  min="100"
                  max="10000"
                  required
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.ctaButton}>
                <span className={styles.btnText}>Run Simulation</span>
                <span className={styles.btnArrow}>→</span>
              </button>

              {results && (
                <div className={styles.resultSection}>
                  <h3>Simulation Results ({results.trials} Trials)</h3>
                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Initial:</strong> ${parseFloat(results.initial).toLocaleString()}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Years:</strong> {results.years}
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Average:</strong> ${results.avg}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Best Case:</strong> ${results.max}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Worst Case:</strong> ${results.min}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>10% Chance Below:</strong> ${results.p10}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>90% Chance Below:</strong> ${results.p90}
                    </div>
                  </div>
                  <div className={styles.note}>
                    Results are randomized. Refresh to re-run with new random paths.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Monte Carlo Simulation Matters</h3>
                <p>
                  Traditional financial projections use fixed returns, but <strong>real markets are volatile</strong>. The <strong>Monte Carlo Simulation</strong> runs thousands of scenarios with random returns to show a range of possible outcomes — helping you understand risk, not just average returns.
                </p>

                <h4>How to Use This Calculator</h4>
                <p>
                  Enter your <strong>initial investment</strong>, expected <strong>average annual return</strong>, <strong>volatility</strong> (standard deviation), and <strong>investment horizon</strong>. The tool simulates thousands of random return paths and shows the distribution of final portfolio values.
                </p>

                <h4>The Simulation Concept</h4>
                <div className={styles.formula}>
                  <code>Final Value = Initial × ∏(1 + Random Return<sub>i</sub>) for i = 1 to Years</code>
                </div>
                <p>
                  Each trial uses random annual returns drawn from a normal distribution with your specified mean and volatility. After thousands of trials, we calculate percentiles to show likely outcomes.
                </p>

                <h4>Key Insights</h4>
                <ul className={styles.list}>
                  <li><strong>Average Outcome:</strong> Expected final value across all scenarios</li>
                  <li><strong>P10 (10th percentile):</strong> 90% chance of doing better</li>
                  <li><strong>P90 (90th percentile):</strong> Only 10% chance of doing better</li>
                  <li><strong>Min/Max:</strong> Extreme outcomes (rare, but possible)</li>
                </ul>

                <h4>Example Use Cases</h4>
                <ul className={styles.list}>
                  <li><strong>Retirement Planning:</strong> Estimate the safety of your nest egg</li>
                  <li><strong>Investment Decisions:</strong> Compare portfolios with different risk levels</li>
                  <li><strong>Financial Advice:</strong> Show clients realistic outcome ranges</li>
                </ul>

                <h4>Interpreting Results</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Percentile</th>
                      <th>Interpretation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>10%</td>
                      <td>Only 10% of outcomes were lower — conservative estimate</td>
                    </tr>
                    <tr>
                      <td>50% (Median)</td>
                      <td>Half of outcomes were higher, half lower</td>
                    </tr>
                    <tr>
                      <td>90%</td>
                      <td>Top 10% performance — optimistic scenario</td>
                    </tr>
                  </tbody>
                </table>

                <h4>Tips for Better Accuracy</h4>
                <ul className={styles.list}>
                  <li>Use long-term historical averages for return and volatility</li>
                  <li>Increase simulation count (1,000–10,000) for smoother results</li>
                  <li>Adjust volatility based on asset class (stocks: 15–20%, bonds: 5–8%)</li>
                  <li>Consider inflation-adjusted returns for real purchasing power</li>
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

export default MonteCarloSimulationCalculator;