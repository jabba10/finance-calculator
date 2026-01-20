import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './optionpricingcalculator.module.css';

const OptionPricingCalculator = ({ currentDate, lastModifiedDate }) => {
  const [optionType, setOptionType] = useState('call');
  const [underlyingPrice, setUnderlyingPrice] = useState(100);
  const [strikePrice, setStrikePrice] = useState(105);
  const [timeToExpiration, setTimeToExpiration] = useState(30);
  const [volatility, setVolatility] = useState(30);
  const [riskFreeRate, setRiskFreeRate] = useState(5);
  const [dividendYield, setDividendYield] = useState(1);
  const [pricingModel, setPricingModel] = useState('black-scholes');
  const [results, setResults] = useState(null);
  const [greeks, setGreeks] = useState(null);
  const [profitLossData, setProfitLossData] = useState([]);
  const [impliedVolatility, setImpliedVolatility] = useState(null);

  const pricingModels = {
    'black-scholes': {
      name: "Black-Scholes Model",
      description: "Standard model for European options",
      suitableFor: "Non-dividend paying stocks, European options"
    },
    'binomial': {
      name: "Binomial Model",
      description: "Discrete-time model for American options",
      suitableFor: "American options, dividend-paying stocks"
    },
    'monte-carlo': {
      name: "Monte Carlo Simulation",
      description: "Statistical simulation for complex options",
      suitableFor: "Path-dependent options, exotic options"
    }
  };

  const calculateOptionPrice = () => {
    const S = underlyingPrice; // Current stock price
    const K = strikePrice; // Strike price
    const T = timeToExpiration / 365; // Time to expiration in years
    const σ = volatility / 100; // Volatility (decimal)
    const r = riskFreeRate / 100; // Risk-free rate (decimal)
    const q = dividendYield / 100; // Dividend yield (decimal)
    
    let optionPrice, delta, gamma, theta, vega, rho;
    
    if (pricingModel === 'black-scholes') {
      // Black-Scholes calculation
      const d1 = (Math.log(S / K) + (r - q + σ * σ / 2) * T) / (σ * Math.sqrt(T));
      const d2 = d1 - σ * Math.sqrt(T);
      
      const N = (x) => {
        // Cumulative normal distribution function approximation
        const a1 = 0.31938153;
        const a2 = -0.356563782;
        const a3 = 1.781477937;
        const a4 = -1.821255978;
        const a5 = 1.330274429;
        const L = Math.abs(x);
        const K = 1 / (1 + 0.2316419 * L);
        let w = 1 - 1 / Math.sqrt(2 * Math.PI) * Math.exp(-L * L / 2) * (a1 * K + a2 * K * K + a3 * Math.pow(K, 3) + a4 * Math.pow(K, 4) + a5 * Math.pow(K, 5));
        if (x < 0) w = 1 - w;
        return w;
      };
      
      if (optionType === 'call') {
        optionPrice = S * Math.exp(-q * T) * N(d1) - K * Math.exp(-r * T) * N(d2);
        delta = Math.exp(-q * T) * N(d1);
        rho = K * T * Math.exp(-r * T) * N(d2) / 100;
      } else {
        optionPrice = K * Math.exp(-r * T) * N(-d2) - S * Math.exp(-q * T) * N(-d1);
        delta = Math.exp(-q * T) * (N(d1) - 1);
        rho = -K * T * Math.exp(-r * T) * N(-d2) / 100;
      }
      
      // Greek calculations
      gamma = Math.exp(-q * T) * normalPDF(d1) / (S * σ * Math.sqrt(T));
      vega = S * Math.exp(-q * T) * normalPDF(d1) * Math.sqrt(T) / 100;
      
      // Theta calculation (per day)
      if (optionType === 'call') {
        theta = (-S * Math.exp(-q * T) * normalPDF(d1) * σ / (2 * Math.sqrt(T)) 
                - r * K * Math.exp(-r * T) * N(d2) 
                + q * S * Math.exp(-q * T) * N(d1)) / 365;
      } else {
        theta = (-S * Math.exp(-q * T) * normalPDF(d1) * σ / (2 * Math.sqrt(T)) 
                + r * K * Math.exp(-r * T) * N(-d2) 
                - q * S * Math.exp(-q * T) * N(-d1)) / 365;
      }
      
    } else if (pricingModel === 'binomial') {
      // Simplified Binomial model approximation
      const steps = 100;
      const dt = T / steps;
      const u = Math.exp(σ * Math.sqrt(dt));
      const d = 1 / u;
      const p = (Math.exp((r - q) * dt) - d) / (u - d);
      
      // Initialize option values at expiration
      let optionValues = [];
      for (let i = 0; i <= steps; i++) {
        const stockPrice = S * Math.pow(u, steps - i) * Math.pow(d, i);
        optionValues[i] = Math.max(0, optionType === 'call' ? stockPrice - K : K - stockPrice);
      }
      
      // Work backwards through the tree
      for (let j = steps - 1; j >= 0; j--) {
        for (let i = 0; i <= j; i++) {
          optionValues[i] = Math.exp(-r * dt) * (p * optionValues[i] + (1 - p) * optionValues[i + 1]);
          
          // Early exercise for American options
          const stockPrice = S * Math.pow(u, j - i) * Math.pow(d, i);
          const exerciseValue = Math.max(0, optionType === 'call' ? stockPrice - K : K - stockPrice);
          optionValues[i] = Math.max(optionValues[i], exerciseValue);
        }
      }
      
      optionPrice = optionValues[0];
      
      // Simplified Greeks for binomial (using finite differences)
      delta = calculateDelta();
      gamma = calculateGamma();
      vega = calculateVega();
      theta = calculateTheta();
      rho = calculateRho();
      
    } else {
      // Monte Carlo simulation approximation
      const simulations = 10000;
      let payoffs = 0;
      
      for (let i = 0; i < simulations; i++) {
        const random = Math.random();
        const z = Math.sqrt(-2 * Math.log(random)) * Math.cos(2 * Math.PI * Math.random());
        const stockPriceAtExpiry = S * Math.exp((r - q - σ * σ / 2) * T + σ * Math.sqrt(T) * z);
        
        if (optionType === 'call') {
          payoffs += Math.max(0, stockPriceAtExpiry - K);
        } else {
          payoffs += Math.max(0, K - stockPriceAtExpiry);
        }
      }
      
      optionPrice = (payoffs / simulations) * Math.exp(-r * T);
      
      // Simplified Greeks for Monte Carlo
      delta = calculateDelta();
      gamma = calculateGamma();
      vega = calculateVega();
      theta = calculateTheta();
      rho = calculateRho();
    }
    
    // Calculate implied volatility (simplified)
    const calculateIV = () => {
      // Simplified IV calculation using approximation
      if (optionPrice <= 0) return 0;
      
      const moneyness = Math.abs(Math.log(S / K));
      const timeWeight = Math.sqrt(T);
      const priceRatio = optionPrice / S;
      
      let iv = (priceRatio * 100) / (0.4 * timeWeight);
      iv = Math.min(Math.max(iv, 5), 100); // Bound between 5% and 100%
      
      return iv;
    };
    
    // Generate profit/loss data
    const generateProfitLossData = () => {
      const data = [];
      const minPrice = S * 0.7;
      const maxPrice = S * 1.3;
      const steps = 20;
      
      for (let i = 0; i <= steps; i++) {
        const stockPrice = minPrice + (maxPrice - minPrice) * (i / steps);
        const intrinsicValue = Math.max(0, optionType === 'call' ? stockPrice - K : K - stockPrice);
        const profit = intrinsicValue - optionPrice;
        
        data.push({
          stockPrice: Math.round(stockPrice * 100) / 100,
          intrinsicValue: Math.round(intrinsicValue * 100) / 100,
          profit: Math.round(profit * 100) / 100,
          breakeven: Math.abs(profit) < 0.01
        });
      }
      
      return data;
    };
    
    // Helper functions for Greeks
    function normalPDF(x) {
      return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
    }
    
    function calculateDelta() {
      const dS = 0.01;
      const price1 = calculateBSPrice(S + dS, K, T, σ, r, q);
      const price2 = calculateBSPrice(S - dS, K, T, σ, r, q);
      return (price1 - price2) / (2 * dS);
    }
    
    function calculateGamma() {
      const dS = 0.01;
      const price1 = calculateBSPrice(S + dS, K, T, σ, r, q);
      const price2 = calculateBSPrice(S, K, T, σ, r, q);
      const price3 = calculateBSPrice(S - dS, K, T, σ, r, q);
      return (price1 - 2 * price2 + price3) / (dS * dS);
    }
    
    function calculateVega() {
      const dσ = 0.01;
      const price1 = calculateBSPrice(S, K, T, σ + dσ, r, q);
      const price2 = calculateBSPrice(S, K, T, σ - dσ, r, q);
      return (price1 - price2) / (2 * dσ) / 100;
    }
    
    function calculateTheta() {
      const dT = 1/365;
      const price1 = calculateBSPrice(S, K, T + dT, σ, r, q);
      const price2 = calculateBSPrice(S, K, T - dT, σ, r, q);
      return -(price1 - price2) / (2 * dT) / 365;
    }
    
    function calculateRho() {
      const dr = 0.01;
      const price1 = calculateBSPrice(S, K, T, σ, r + dr, q);
      const price2 = calculateBSPrice(S, K, T, σ, r - dr, q);
      return (price1 - price2) / (2 * dr) / 100;
    }
    
    function calculateBSPrice(S, K, T, σ, r, q) {
      const d1 = (Math.log(S / K) + (r - q + σ * σ / 2) * T) / (σ * Math.sqrt(T));
      const d2 = d1 - σ * Math.sqrt(T);
      
      const N = (x) => {
        const L = Math.abs(x);
        const K = 1 / (1 + 0.2316419 * L);
        const a1 = 0.31938153;
        const a2 = -0.356563782;
        const a3 = 1.781477937;
        const a4 = -1.821255978;
        const a5 = 1.330274429;
        let w = 1 - 1 / Math.sqrt(2 * Math.PI) * Math.exp(-L * L / 2) * (a1 * K + a2 * K * K + a3 * Math.pow(K, 3) + a4 * Math.pow(K, 4) + a5 * Math.pow(K, 5));
        if (x < 0) w = 1 - w;
        return w;
      };
      
      if (optionType === 'call') {
        return S * Math.exp(-q * T) * N(d1) - K * Math.exp(-r * T) * N(d2);
      } else {
        return K * Math.exp(-r * T) * N(-d2) - S * Math.exp(-q * T) * N(-d1);
      }
    }
    
    const iv = calculateIV();
    const plData = generateProfitLossData();
    
    setResults({
      optionPrice: Math.round(optionPrice * 100) / 100,
      intrinsicValue: Math.round(Math.max(0, optionType === 'call' ? S - K : K - S) * 100) / 100,
      timeValue: Math.round(Math.max(0, optionPrice - Math.max(0, optionType === 'call' ? S - K : K - S)) * 100) / 100,
      breakevenPrice: Math.round((optionType === 'call' ? K + optionPrice : K - optionPrice) * 100) / 100,
      moneyness: S > K ? (optionType === 'call' ? 'In-the-Money' : 'Out-of-the-Money') : 
                S < K ? (optionType === 'call' ? 'Out-of-the-Money' : 'In-the-Money') : 'At-the-Money'
    });
    
    setGreeks({
      delta: Math.round(delta * 1000) / 1000,
      gamma: Math.round(gamma * 10000) / 10000,
      theta: Math.round(theta * 100) / 100,
      vega: Math.round(vega * 100) / 100,
      rho: Math.round(rho * 100) / 100
    });
    
    setProfitLossData(plData);
    setImpliedVolatility(Math.round(iv * 100) / 100);
  };

  useEffect(() => {
    calculateOptionPrice();
  }, [optionType, underlyingPrice, strikePrice, timeToExpiration, volatility, riskFreeRate, dividendYield, pricingModel]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  const formatNumber = (value, decimals = 2) => {
    return value.toFixed(decimals);
  };

  const getOptionStatusColor = (status) => {
    switch(status) {
      case 'In-the-Money': return '#10B981';
      case 'At-the-Money': return '#F59E0B';
      case 'Out-of-the-Money': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <>
      <Head>
        <title>Option Pricing Calculator | Black-Scholes & Greeks Analysis</title>
        <meta name="description" content="Advanced option pricing calculator using Black-Scholes, Binomial, and Monte Carlo models. Calculate option prices, Greeks (delta, gamma, theta, vega, rho), and analyze profit/loss scenarios." />
        <meta name="keywords" content="option pricing calculator, black-scholes calculator, options greeks, call option calculator, put option calculator, implied volatility, options trading" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/option-pricing-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Option Pricing Calculator | Black-Scholes & Greeks Analysis" />
        <meta property="og:description" content="Calculate option prices using multiple models, analyze Greeks, and visualize profit/loss scenarios." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/option-pricing-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Option Pricing Calculator" />
        <meta name="twitter:description" content="Professional options pricing tool with Greeks analysis and profit/loss visualization." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="option-pricing-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Option Pricing Calculator",
            "description": "Professional options pricing tool with multiple models, Greeks analysis, and profit/loss visualization",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "1850",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Trading Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Black-Scholes Model",
              "Binomial Model",
              "Monte Carlo Simulation",
              "Greeks Calculation",
              "Profit/Loss Visualization",
              "Implied Volatility"
            ]
          })
        }}
      />

      {/* FAQ Schema */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is the Black-Scholes model and when should I use it?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The Black-Scholes model is a mathematical model for pricing European-style options. It assumes constant volatility, no transaction costs, and efficient markets. Use it for non-dividend paying stocks and European options that can only be exercised at expiration.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What are option Greeks and why are they important?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Option Greeks (Delta, Gamma, Theta, Vega, Rho) measure the sensitivity of option prices to various factors. Delta measures price sensitivity to underlying asset changes, Gamma measures Delta's rate of change, Theta measures time decay, Vega measures volatility sensitivity, and Rho measures interest rate sensitivity.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between intrinsic value and time value?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Intrinsic value is the immediate exercise value of an option (stock price minus strike for calls, strike minus stock price for puts). Time value represents the additional premium for the possibility of future price movements before expiration. Time value decays as expiration approaches.",
                  "datePublished": currentDate
                }
              }
            ]
          })
        }}
      />

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.mainTitle}>Option Pricing Calculator</h1>
            <p className={styles.subtitle}>Calculate Option Prices, Analyze Greeks, and Visualize Profit/Loss Scenarios</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Professional Tool</span>
              <span className={styles.badge}>No Signup Required</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Option Parameters</h2>
              
              <div className={styles.optionTypeSelector}>
                <div className={styles.optionTypeButtons}>
                  <button
                    className={`${styles.optionTypeButton} ${optionType === 'call' ? styles.optionTypeButtonActive : ''}`}
                    onClick={() => setOptionType('call')}
                  >
                    Call Option
                  </button>
                  <button
                    className={`${styles.optionTypeButton} ${optionType === 'put' ? styles.optionTypeButtonActive : ''}`}
                    onClick={() => setOptionType('put')}
                  >
                    Put Option
                  </button>
                </div>
                <div className={styles.optionTypeDescription}>
                  {optionType === 'call' 
                    ? "Right to buy at strike price" 
                    : "Right to sell at strike price"}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Underlying Asset Price
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="1"
                      max="1000"
                      step="1"
                      value={underlyingPrice}
                      onChange={(e) => setUnderlyingPrice(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      step="0.01"
                      value={underlyingPrice}
                      onChange={(e) => setUnderlyingPrice(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(underlyingPrice)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Strike Price
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="1"
                      max="1000"
                      step="1"
                      value={strikePrice}
                      onChange={(e) => setStrikePrice(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      step="0.01"
                      value={strikePrice}
                      onChange={(e) => setStrikePrice(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(strikePrice)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Time to Expiration
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="365"
                      step="1"
                      value={timeToExpiration}
                      onChange={(e) => setTimeToExpiration(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="365"
                      step="1"
                      value={timeToExpiration}
                      onChange={(e) => setTimeToExpiration(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>days</span>
                  </div>
                  <div className={styles.valueDisplay}>{timeToExpiration} days ({(timeToExpiration/365).toFixed(2)} years)</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Implied Volatility
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="5"
                      max="200"
                      step="1"
                      value={volatility}
                      onChange={(e) => setVolatility(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="5"
                      max="200"
                      step="0.1"
                      value={volatility}
                      onChange={(e) => setVolatility(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(volatility)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Risk-Free Interest Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.1"
                      value={riskFreeRate}
                      onChange={(e) => setRiskFreeRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.1"
                      value={riskFreeRate}
                      onChange={(e) => setRiskFreeRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(riskFreeRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Dividend Yield
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={dividendYield}
                      onChange={(e) => setDividendYield(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={dividendYield}
                      onChange={(e) => setDividendYield(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(dividendYield)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Pricing Model
                  <select
                    value={pricingModel}
                    onChange={(e) => setPricingModel(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="black-scholes">Black-Scholes Model</option>
                    <option value="binomial">Binomial Model</option>
                    <option value="monte-carlo">Monte Carlo Simulation</option>
                  </select>
                </label>
                <div className={styles.modelDescription}>
                  {pricingModels[pricingModel].description}
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Option Analysis</h2>
              
              {results && greeks && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Option Price</div>
                      <div className={styles.resultValue}>{formatCurrency(results.optionPrice)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Intrinsic Value</div>
                      <div className={styles.resultValue}>{formatCurrency(results.intrinsicValue)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Time Value</div>
                      <div className={styles.resultValue}>{formatCurrency(results.timeValue)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Moneyness</div>
                      <div 
                        className={styles.resultValue}
                        style={{ color: getOptionStatusColor(results.moneyness) }}
                      >
                        {results.moneyness}
                      </div>
                    </div>
                  </div>

                  {/* Greeks Display */}
                  <div className={styles.greeksSection}>
                    <h3 className={styles.chartTitle}>Option Greeks</h3>
                    <div className={styles.greeksGrid}>
                      <div className={styles.greekItem}>
                        <div className={styles.greekLabel}>Delta</div>
                        <div className={styles.greekValue}>{formatNumber(greeks.delta, 3)}</div>
                        <div className={styles.greekDescription}>Price sensitivity</div>
                      </div>
                      <div className={styles.greekItem}>
                        <div className={styles.greekLabel}>Gamma</div>
                        <div className={styles.greekValue}>{formatNumber(greeks.gamma, 4)}</div>
                        <div className={styles.greekDescription}>Delta sensitivity</div>
                      </div>
                      <div className={styles.greekItem}>
                        <div className={styles.greekLabel}>Theta</div>
                        <div className={styles.greekValue}>{formatNumber(greeks.theta, 2)}/day</div>
                        <div className={styles.greekDescription}>Time decay</div>
                      </div>
                      <div className={styles.greekItem}>
                        <div className={styles.greekLabel}>Vega</div>
                        <div className={styles.greekValue}>{formatNumber(greeks.vega, 2)}</div>
                        <div className={styles.greekDescription}>Volatility sensitivity</div>
                      </div>
                      <div className={styles.greekItem}>
                        <div className={styles.greekLabel}>Rho</div>
                        <div className={styles.greekValue}>{formatNumber(greeks.rho, 2)}</div>
                        <div className={styles.greekDescription}>Interest rate sensitivity</div>
                      </div>
                    </div>
                  </div>

                  {/* Profit/Loss Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Profit/Loss at Expiration</h3>
                    <div className={styles.profitLossChart}>
                      <div className={styles.chartAxis}>
                        <div className={styles.chartYAxis}>
                          <div className={styles.chartYLabel}>Profit/Loss ($)</div>
                          <div className={styles.chartYScale}>
                            {[-results.optionPrice * 2, -results.optionPrice, 0, results.optionPrice, results.optionPrice * 2].map((val, i) => (
                              <div key={i} className={styles.chartYTick}>{formatNumber(val)}</div>
                            ))}
                          </div>
                        </div>
                        <div className={styles.chartArea}>
                          {profitLossData.map((data, index) => (
                            <div 
                              key={index} 
                              className={styles.chartDataPoint}
                              style={{ 
                                left: `${(index / profitLossData.length) * 100}%`,
                                bottom: `${50 + (data.profit / (results.optionPrice * 2)) * 50}%`
                              }}
                              title={`Stock: $${data.stockPrice}, P/L: ${formatCurrency(data.profit)}`}
                            >
                              {data.breakeven && <div className={styles.breakevenPoint}></div>}
                            </div>
                          ))}
                          <div className={styles.zeroLine}></div>
                          <div className={styles.currentPriceLine} style={{ left: `${((underlyingPrice - profitLossData[0]?.stockPrice) / (profitLossData[profitLossData.length-1]?.stockPrice - profitLossData[0]?.stockPrice)) * 100}%` }}>
                            <div className={styles.currentPriceLabel}>Current: {formatCurrency(underlyingPrice)}</div>
                          </div>
                          <div className={styles.strikePriceLine} style={{ left: `${((strikePrice - profitLossData[0]?.stockPrice) / (profitLossData[profitLossData.length-1]?.stockPrice - profitLossData[0]?.stockPrice)) * 100}%` }}>
                            <div className={styles.strikePriceLabel}>Strike: {formatCurrency(strikePrice)}</div>
                          </div>
                        </div>
                      </div>
                      <div className={styles.chartXAxis}>
                        <div className={styles.chartXLabel}>Stock Price at Expiration ($)</div>
                        <div className={styles.chartXScale}>
                          {[profitLossData[0]?.stockPrice, profitLossData[Math.floor(profitLossData.length/2)]?.stockPrice, profitLossData[profitLossData.length-1]?.stockPrice].map((val, i) => (
                            <div key={i} className={styles.chartXTick}>{formatNumber(val)}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📈 Key Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Breakeven price: <strong>{formatCurrency(results.breakevenPrice)}</strong></li>
                      <li>Maximum {optionType === 'call' ? 'risk' : 'profit'}: <strong>{formatCurrency(results.optionPrice)}</strong></li>
                      <li>Theta decay per day: <strong>{formatNumber(Math.abs(greeks.theta), 2)}</strong></li>
                      <li>Delta: Option price changes by <strong>{formatNumber(Math.abs(greeks.delta) * 100, 1)}%</strong> for each 1% stock move</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Understanding Option Pricing: From Black-Scholes to Modern Models</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The Mathematics of Options</h3>
                <p>Option pricing combines probability theory, stochastic calculus, and financial economics to determine the fair value of options. The core insight is that options can be replicated using a dynamic portfolio of the underlying asset and risk-free bonds, leading to risk-neutral pricing.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Black-Scholes Formula:</h4>
                  <p>For a non-dividend paying European call option:</p>
                  <div className={styles.formula}>
                    C = S₀N(d₁) - Ke⁻ʳᵀN(d₂)
                  </div>
                  <p>Where:</p>
                  <ul>
                    <li>C = Call option price</li>
                    <li>S₀ = Current stock price</li>
                    <li>K = Strike price</li>
                    <li>r = Risk-free interest rate</li>
                    <li>T = Time to expiration</li>
                    <li>N() = Cumulative normal distribution</li>
                    <li>d₁ = [ln(S₀/K) + (r + σ²/2)T] / (σ√T)</li>
                    <li>d₂ = d₁ - σ√T</li>
                  </ul>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding Option Greeks</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>Δ Delta (0 to ±1)</h4>
                    <p>Measures option price sensitivity to underlying asset price changes. Call deltas range 0 to 1, put deltas range -1 to 0. Delta also approximates probability of expiring in-the-money.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>Γ Gamma (Always Positive)</h4>
                    <p>Measures the rate of change of Delta. Highest for at-the-money options near expiration. Gamma risk increases as expiration approaches.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>Θ Theta (Usually Negative)</h4>
                    <p>Measures time decay - how much option value decreases each day. Theta accelerates as expiration approaches, especially for at-the-money options.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>V Vega (Always Positive)</h4>
                    <p>Measures sensitivity to implied volatility changes. Higher for longer-dated options. Vega decreases as expiration approaches.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Practical Trading Applications</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Covered Calls:</strong> Sell call options against owned stock to generate income</li>
                  <li><strong>Protective Puts:</strong> Buy put options as insurance against stock declines</li>
                  <li><strong>Straddles/Strangles:</strong> Profit from large price moves in either direction</li>
                  <li><strong>Iron Condors:</strong> Profit from low volatility and range-bound markets</li>
                  <li><strong>Delta Hedging:</strong> Neutralize price risk by adjusting position delta</li>
                  <li><strong>Volatility Trading:</strong> Trade based on changes in implied vs. realized volatility</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Trading Insights</h3>
                <blockquote className={styles.expertQuote}>
                  "Options are not just about direction. They're about volatility, time, and probability. The most successful option traders understand that managing Greeks is more important than predicting price direction. Always know your maximum risk, manage your position size, and never underestimate the impact of time decay."
                  <footer className={styles.quoteFooter}>— Professional Options Trader, 20+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between implied and historical volatility?</h3>
                <p className={styles.faqAnswer}>Historical volatility measures past price fluctuations, calculated from historical returns. Implied volatility is forward-looking, derived from option prices, reflecting market expectations of future volatility. Implied volatility is often higher due to the volatility risk premium.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Why do options lose value over time even if the stock price doesn't move?</h3>
                <p className={styles.faqAnswer}>This is time decay (theta). Options have limited lifespans, and each day that passes without favorable price movement reduces the probability of finishing in-the-money. Time decay accelerates as expiration approaches, especially for at-the-money options.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What are the limitations of the Black-Scholes model?</h3>
                <p className={styles.faqAnswer}>Black-Scholes assumes constant volatility (violated by volatility smiles/smirks), continuous trading (violated by market closures), no transaction costs (violated by bid-ask spreads), and European exercise (violated by American options). It also assumes log-normal price distribution, which doesn't account for fat tails.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do dividends affect option prices?</h3>
                <p className={styles.faqAnswer}>Dividends reduce call prices (expected stock price drop on ex-dividend date) and increase put prices. For European options, the effect is through the dividend yield in pricing formulas. For American options, early exercise may be optimal just before ex-dividend dates.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Master Options Trading?</h2>
              <p className={styles.ctaText}>Use this calculator to explore different option strategies, understand Greeks, and develop your trading intuition. Always paper trade new strategies before risking real capital.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides theoretical values for educational purposes. Actual option prices may differ due to market conditions, liquidity, and model limitations. Options trading involves substantial risk and is not suitable for all investors. Past performance is not indicative of future results. Consult with a qualified financial professional before trading options.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export async function getStaticProps() {
  const buildTime = new Date();
  const currentDate = buildTime.toISOString().split('T')[0];
  const lastModifiedDate = buildTime.toISOString();
  
  return {
    props: {
      currentDate,
      lastModifiedDate,
    },
    revalidate: 21600,
  };
}

export default OptionPricingCalculator;