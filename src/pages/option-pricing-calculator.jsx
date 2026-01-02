import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
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

  // Option Pricing Calculator History Data
  const optionPricingHistory = [
    {
      id: 1,
      title: "History & Discovery of Option Pricing Formula",
      points: [
        "1973: Black-Scholes-Merton model published by Fischer Black, Myron Scholes, and Robert Merton",
        "Nobel Prize 1997: Scholes and Merton awarded for their contributions to option pricing theory",
        "Chicago Board Options Exchange (CBOE): First to implement the model in 1973",
        "Pre-1973: Options traded without scientific pricing methods, relying on intuition",
        "1990s: Extensions to include dividends, stochastic volatility, and jumps",
        "2000s+: Computational methods for American and exotic options pricing"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Scientific Purpose",
      points: [
        "United States: Developed at University of Chicago and MIT",
        "United Kingdom: Robert Merton contributed while at MIT",
        "Purpose: Provide mathematical framework for fair option pricing",
        "Innovation: First closed-form solution for European option pricing",
        "Foundation: Built on earlier work by Louis Bachelier (1900) and Paul Samuelson",
        "Impact: Revolutionized financial markets and derivatives trading worldwide"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Investment Banks: Daily pricing of trillions in options and structured products",
        "Hedge Funds: Real-time arbitrage and volatility trading strategies",
        "Market Makers: Continuous pricing for liquidity provision on exchanges",
        "Corporate Treasury: Monthly hedging of foreign exchange and commodity risks",
        "Insurance Companies: Quarterly calculation of embedded option values",
        "Pension Funds: Annual risk assessment of option positions",
        "Proprietary Trading Firms: Microsecond pricing for high-frequency trading"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Eliminated pricing uncertainty, reducing bid-ask spreads by 50-80%",
        "Enabled growth of options markets from $0 to $100+ trillion annual volume",
        "Reduced trading costs by billions through improved market efficiency",
        "Allowed corporations to hedge risks more effectively, saving 20-40% on hedging costs",
        "Enabled creation of structured products, generating $50+ billion annual fees",
        "Improved risk management, preventing billions in potential losses",
        "Facilitated quantitative trading strategies earning 15-30% annual returns"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Investment Banks: Generate $50+ billion annually from derivatives trading desks",
        "Hedge Funds: Earn 2% management + 20% performance fees on option strategies",
        "Market Makers: Profit $100k+ daily from bid-ask spreads on liquid options",
        "Software Companies: Charge $10k-$100k annually for pricing platforms",
        "Financial Data Providers: Sell option pricing data for $5k-$50k per month",
        "Trading Education: Generate $100+ million from option trading courses",
        "FinTech Apps: Monetize with premium features at $20-$200/month subscriptions"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Option Pricing Uses",
      points: [
        "Retail Traders: Evaluating fair value of options before buying/selling",
        "Small Investors: Calculating covered call premiums for income generation",
        "Retirement Savers: Assessing risks in options within 401(k) plans",
        "Homeowners: Understanding mortgage prepayment options (financial options)",
        "Employees: Valuing stock options as part of compensation packages",
        "Small Business Owners: Hedging currency risks for international operations",
        "Real Estate Investors: Pricing lease options on properties",
        "Farmers: Calculating crop insurance and futures options values"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Option Pricing Calculator | Black-Scholes Model Tool</title>
        <meta
          name="description"
          content="Free option pricing calculator using the Black-Scholes model to compute call and put prices, deltas, gamma, and vega."
        />
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

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Option Prices</span>
              <span className={styles.arrow}>→</span>
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

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Option Pricing Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of option pricing calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {optionPricingHistory.map((card) => (
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
              <button
                className={styles.ctaButton}
                ref={ctaButtonRef}
                onMouseMove={handleMouseMove}
              >
                <span className={styles.buttonText}>Explore All Calculators</span>
                <span className={styles.arrow}>→</span>
              </button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default OptionPricingCalculator;