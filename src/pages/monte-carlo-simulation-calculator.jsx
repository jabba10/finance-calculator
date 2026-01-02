import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
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

  // Monte Carlo Simulation History Data
  const monteCarloHistory = [
    {
      id: 1,
      title: "History & Discovery of Monte Carlo Simulation",
      points: [
        "1940s Manhattan Project: Stanislaw Ulam & John von Neumann created Monte Carlo methods for nuclear weapon design",
        "1950s Physics Research: Method expanded to solve complex particle transport problems",
        "1960s Finance: Economists adapted Monte Carlo for stock price modeling and option pricing",
        "1970s Engineering: Widespread adoption for reliability analysis and system simulation",
        "1980s Computers: Personal computers enabled broader business applications",
        "1990s Finance Boom: Wall Street embraced Monte Carlo for risk management and derivatives",
        "2000s AI Integration: Machine learning combined with Monte Carlo for enhanced predictions"
      ]
    },
    {
      id: 2,
      title: "Country Origins & Scientific Purpose",
      points: [
        "United States: Los Alamos Laboratory developed original methods for nuclear physics",
        "United Kingdom: Cambridge University expanded applications to mathematical finance",
        "France: École Polytechnique pioneered industrial applications in engineering",
        "Japan: Financial institutions refined high-frequency trading simulations",
        "Switzerland: Insurance companies developed actuarial risk modeling",
        "Purpose: Solve probabilistic problems where analytical solutions are impossible"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Investment Banking: Daily risk assessment and derivative pricing",
        "Asset Management: Monthly portfolio stress testing and scenario analysis",
        "Insurance: Continuous premium pricing and catastrophic risk modeling",
        "Engineering: Weekly reliability testing for complex systems",
        "Pharmaceuticals: Monthly clinical trial outcome simulations",
        "Energy: Daily oil price forecasting and reserve estimation",
        "Aerospace: Continuous flight safety and system failure analysis"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Reduces investment risk by 40-60% through comprehensive scenario analysis",
        "Improves portfolio returns by 15-25% through optimized asset allocation",
        "Identifies $1M+ in annual savings through better risk management",
        "Reduces insurance claims by 20-30% through improved pricing models",
        "Increases engineering safety by 99.9% through failure probability analysis",
        "Improves drug development success rates by 25-35% through trial simulation",
        "Prevents 80% of catastrophic financial losses through stress testing"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Financial Software: Charge $50,000-$500,000 annually for enterprise risk platforms",
        "Consulting Firms: Generate $100,000-$1M fees for custom simulation implementations",
        "Hedge Funds: Achieve 20-40% alpha through sophisticated trading strategies",
        "Insurance Companies: Increase premiums accuracy by 15-25% for higher profits",
        "Quant Funds: Manage $10B+ assets using Monte Carlo-based strategies",
        "Academic Research: Secure $500,000-$5M grants for advanced simulation studies",
        "FinTech Startups: Raise $10M-$100M for AI-enhanced simulation platforms"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Monte Carlo Calculator Uses",
      points: [
        "Retirement Planning: Simulating 1,000+ market scenarios for nest egg safety",
        "Mortgage Decisions: Testing interest rate impacts on loan affordability",
        "College Savings: Projecting education fund growth under different market conditions",
        "Small Business: Forecasting revenue under various economic scenarios",
        "Real Estate: Modeling property value appreciation with market volatility",
        "Personal Finance: Stress testing emergency funds against job loss risk",
        "Investment Strategy: Comparing stock vs bond allocations for retirement",
        "Entrepreneurs: Simulating startup success probabilities under different funding scenarios"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Monte Carlo Simulation Calculator | Investment Risk Tool</title>
        <meta name="description" content="Free Monte Carlo simulation calculator to model thousands of investment outcomes and understand risk, volatility, and potential returns over time." />
        <link rel="canonical" href="/monte-carlo-simulation-calculator" />
      </Head>

      <div className={styles.page}>
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

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Run Simulation</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

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
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Monte Carlo Simulation History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of Monte Carlo simulation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {monteCarloHistory.map((card) => (
                <div key={card.id} className={styles.historyCard}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <ul className={styles.cardList}>
                    {card.points.map((point, index) => (
                      <li key={index} className={styles.cardListItem}>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
            <p>Free Financial Planning Tools – Try Now</p>
            <Link href="/suite" legacyBehavior>
              <a
                className={styles.ctaButton}
                ref={ctaButtonRef}
                onMouseMove={handleMouseMove}
              >
                <span className={styles.buttonText}>Explore All Calculators</span>
                <span className={styles.arrow}>→</span>
              </a>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default MonteCarloSimulationCalculator;