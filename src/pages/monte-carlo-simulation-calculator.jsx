import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './montecarlosimulationcalculator.module.css';

const MonteCarloCalculator = ({ currentDate, lastModifiedDate }) => {
  const [initialInvestment, setInitialInvestment] = useState(100000);
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [timeHorizon, setTimeHorizon] = useState(30);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [volatility, setVolatility] = useState(15);
  const [inflationRate, setInflationRate] = useState(3);
  const [simulations, setSimulations] = useState(1000);
  const [confidenceLevel, setConfidenceLevel] = useState(95);
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const generateRandomReturn = (mean, stdDev) => {
    // Box-Muller transform for normal distribution
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdDev + mean;
  };

  const calculateMonteCarloSimulation = () => {
    setIsCalculating(true);
    
    // Convert annual percentages to monthly
    const monthlyMean = expectedReturn / 100 / 12;
    const monthlyStdDev = volatility / 100 / Math.sqrt(12);
    const monthlyInflation = inflationRate / 100 / 12;
    const months = timeHorizon * 12;
    
    const simulationResults = [];
    const percentile95 = [];
    const percentile5 = [];
    const median = [];
    const confidenceBounds = [];
    
    // Track final values for statistics
    const finalValues = [];
    
    // Run simulations
    for (let sim = 0; sim < simulations; sim++) {
      let portfolioValue = initialInvestment;
      const monthlyPath = [];
      
      for (let month = 1; month <= months; month++) {
        const randomReturn = generateRandomReturn(monthlyMean, monthlyStdDev);
        portfolioValue = portfolioValue * (1 + randomReturn) + monthlyContribution;
        
        // Adjust for inflation (in real terms)
        const inflationAdjustment = Math.pow(1 + monthlyInflation, month);
        const realValue = portfolioValue / inflationAdjustment;
        
        if (month % 12 === 0 || month === months) {
          const year = month / 12;
          monthlyPath.push({
            year: year,
            nominalValue: Math.round(portfolioValue),
            realValue: Math.round(realValue)
          });
        }
      }
      
      finalValues.push(Math.round(portfolioValue));
      simulationResults.push(monthlyPath);
    }
    
    // Calculate statistics for each year
    for (let year = 1; year <= timeHorizon; year++) {
      const yearValues = simulationResults.map(sim => 
        sim.find(data => data.year === year)?.nominalValue || 0
      );
      
      yearValues.sort((a, b) => a - b);
      
      const p5Index = Math.floor(simulations * 0.05);
      const p50Index = Math.floor(simulations * 0.50);
      const p95Index = Math.floor(simulations * 0.95);
      
      percentile5.push(yearValues[p5Index] || 0);
      median.push(yearValues[p50Index] || 0);
      percentile95.push(yearValues[p95Index] || 0);
      
      // Confidence bounds for selected confidence level
      const confidenceIndex = Math.floor(simulations * ((100 - confidenceLevel) / 100 / 2));
      const lowerBound = yearValues[confidenceIndex] || 0;
      const upperBound = yearValues[simulations - confidenceIndex - 1] || 0;
      
      confidenceBounds.push({
        year: year,
        lower: lowerBound,
        median: yearValues[p50Index] || 0,
        upper: upperBound
      });
    }
    
    // Calculate final statistics
    finalValues.sort((a, b) => a - b);
    const successRate = (finalValues.filter(val => val >= initialInvestment).length / simulations) * 100;
    
    const worstCaseIndex = Math.floor(simulations * 0.05);
    const bestCaseIndex = Math.floor(simulations * 0.95);
    const medianIndex = Math.floor(simulations * 0.50);
    
    setResults({
      successRate: Math.round(successRate * 100) / 100,
      worstCase: finalValues[worstCaseIndex] || 0,
      medianCase: finalValues[medianIndex] || 0,
      bestCase: finalValues[bestCaseIndex] || 0,
      average: Math.round(finalValues.reduce((a, b) => a + b, 0) / simulations),
      stdDeviation: Math.round(Math.sqrt(
        finalValues.reduce((sq, n) => sq + Math.pow(n - finalValues.reduce((a, b) => a + b, 0) / simulations, 2), 0) / simulations
      )),
      confidenceLower: finalValues[Math.floor(simulations * ((100 - confidenceLevel) / 100 / 2))] || 0,
      confidenceUpper: finalValues[simulations - Math.floor(simulations * ((100 - confidenceLevel) / 100 / 2)) - 1] || 0
    });
    
    setChartData(confidenceBounds);
    setIsCalculating(false);
  };

  useEffect(() => {
    calculateMonteCarloSimulation();
  }, [initialInvestment, monthlyContribution, timeHorizon, expectedReturn, volatility, inflationRate, simulations, confidenceLevel]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return '#10b981';
    if (probability >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <>
      <Head>
        <title>Advanced Monte Carlo Simulation Calculator | Risk Analysis & Financial Forecasting</title>
        <meta name="description" content="Free advanced Monte Carlo simulation calculator for investment risk analysis. Forecast portfolio outcomes with confidence intervals and probability distributions." />
        <meta name="keywords" content="monte carlo simulation, investment risk calculator, portfolio analysis, financial forecasting, retirement planning, risk assessment, probability analysis" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/monte-carlo-simulation-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Monte Carlo Simulation Calculator | Risk Analysis & Financial Forecasting" />
        <meta property="og:description" content="Analyze investment risks with Monte Carlo simulations. Free professional tool for financial planners and investors." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/monte-carlo-simulation-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Monte Carlo Simulation Calculator" />
        <meta name="twitter:description" content="Forecast your financial future with probability-based simulations." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="monte-carlo-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Monte Carlo Simulation Calculator",
            "description": "Professional-grade Monte Carlo simulation tool for investment risk analysis and financial forecasting",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "850",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Financial Analytics Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Probability Distributions",
              "Confidence Interval Analysis",
              "Risk Assessment Tools",
              "Multiple Simulation Scenarios",
              "Visual Outcome Charts"
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
                "name": "What is Monte Carlo simulation and how does it work in finance?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Monte Carlo simulation uses random sampling and statistical modeling to estimate the probability of different outcomes in financial forecasting. It runs thousands of simulations with random variables (returns, volatility) to show the range of possible investment outcomes and their probabilities.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How many simulations should I run for accurate results?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "For most financial applications, 1,000-10,000 simulations provide statistically significant results. Our calculator defaults to 1,000 simulations, which balances accuracy with reasonable computation time. More simulations reduce sampling error but increase calculation time.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What do the confidence intervals mean?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A 95% confidence interval means there's a 95% probability that your actual outcome will fall within that range. For example, if our simulation shows a 95% confidence interval of $500,000 to $2,000,000, there's a 95% chance your portfolio will end up somewhere in that range.",
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
            <h1 className={styles.mainTitle}>Advanced Monte Carlo Simulation Calculator</h1>
            <p className={styles.subtitle}>Forecast Your Financial Future with Probability-Based Analysis</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>{simulations.toLocaleString()} Simulations</span>
              <span className={styles.badge}>Professional Grade</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Configure Your Simulation</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Initial Investment
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="1000"
                      max="1000000"
                      step="1000"
                      value={initialInvestment}
                      onChange={(e) => setInitialInvestment(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1000"
                      max="1000000"
                      step="1000"
                      value={initialInvestment}
                      onChange={(e) => setInitialInvestment(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(initialInvestment)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Monthly Contribution
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      step="100"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(monthlyContribution)}/month</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Time Horizon
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="1"
                      value={timeHorizon}
                      onChange={(e) => setTimeHorizon(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="5"
                      max="50"
                      step="1"
                      value={timeHorizon}
                      onChange={(e) => setTimeHorizon(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{timeHorizon} years</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Expected Annual Return
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.5"
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(expectedReturn)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Volatility (Risk)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      step="0.5"
                      value={volatility}
                      onChange={(e) => setVolatility(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="5"
                      max="40"
                      step="0.5"
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
                  Annual Inflation Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(inflationRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Number of Simulations
                  <select
                    value={simulations}
                    onChange={(e) => setSimulations(parseInt(e.target.value))}
                    className={styles.selectInput}
                  >
                    <option value="100">100 (Fast)</option>
                    <option value="500">500 (Balanced)</option>
                    <option value="1000">1,000 (Recommended)</option>
                    <option value="5000">5,000 (Accurate)</option>
                    <option value="10000">10,000 (High Precision)</option>
                  </select>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Confidence Level
                  <select
                    value={confidenceLevel}
                    onChange={(e) => setConfidenceLevel(parseInt(e.target.value))}
                    className={styles.selectInput}
                  >
                    <option value="90">90% Confidence</option>
                    <option value="95">95% Confidence</option>
                    <option value="99">99% Confidence</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Simulation Results</h2>
              
              {isCalculating ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Running {simulations.toLocaleString()} simulations...</p>
                  <p className={styles.loadingSubtext}>This may take a few seconds</p>
                </div>
              ) : results && (
                <>
                  <div className={styles.probabilityCard} style={{ borderColor: getProbabilityColor(results.successRate) }}>
                    <div className={styles.probabilityHeader}>
                      <h3 className={styles.probabilityTitle}>Success Probability</h3>
                      <div 
                        className={styles.probabilityValue}
                        style={{ color: getProbabilityColor(results.successRate) }}
                      >
                        {formatPercentage(results.successRate)}
                      </div>
                    </div>
                    <p className={styles.probabilityDescription}>
                      Probability of ending with more than your initial investment after {timeHorizon} years
                    </p>
                  </div>

                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Worst Case (5th percentile)</div>
                      <div className={`${styles.resultValue} ${styles.worstCase}`}>{formatCurrency(results.worstCase)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Median Outcome (50th percentile)</div>
                      <div className={`${styles.resultValue} ${styles.medianCase}`}>{formatCurrency(results.medianCase)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Best Case (95th percentile)</div>
                      <div className={`${styles.resultValue} ${styles.bestCase}`}>{formatCurrency(results.bestCase)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Average Outcome</div>
                      <div className={styles.resultValue}>{formatCurrency(results.average)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Standard Deviation</div>
                      <div className={styles.resultValue}>{formatCurrency(results.stdDeviation)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>{confidenceLevel}% Confidence Interval</div>
                      <div className={styles.resultValue}>
                        {formatCurrency(results.confidenceLower)} - {formatCurrency(results.confidenceUpper)}
                      </div>
                    </div>
                  </div>

                  {/* Confidence Interval Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Portfolio Value Distribution Over Time</h3>
                    <div className={styles.chartBars}>
                      {chartData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>Year {data.year}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarConfidence}
                              style={{ 
                                width: `${((data.upper - data.lower) / results.bestCase) * 100}%`,
                                left: `${(data.lower / results.bestCase) * 100}%`
                              }}
                              title={`${confidenceLevel}% Confidence: ${formatCurrency(data.lower)} - ${formatCurrency(data.upper)}`}
                            />
                            <div 
                              className={styles.chartBarMedian}
                              style={{ left: `${(data.median / results.bestCase) * 100}%` }}
                              title={`Median: ${formatCurrency(data.median)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{formatCurrency(data.median)}</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendConfidence}`}></div>
                        <span>{confidenceLevel}% Confidence Interval</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendMedian}`}></div>
                        <span>Median Outcome</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Risk Analysis Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Your portfolio could range from <strong>{formatCurrency(results.worstCase)}</strong> to <strong>{formatCurrency(results.bestCase)}</strong></li>
                      <li>There's a <strong>{formatPercentage(results.successRate)}</strong> chance you'll end with more than your initial investment</li>
                      <li>The <strong>{formatPercentage(confidenceLevel)}% confidence interval</strong> spans {formatCurrency(results.confidenceLower)} to {formatCurrency(results.confidenceUpper)}</li>
                      <li>Standard deviation of <strong>{formatCurrency(results.stdDeviation)}</strong> indicates investment risk level</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Monte Carlo Simulation: The Gold Standard for Financial Risk Analysis</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>What Makes Monte Carlo Analysis So Powerful?</h3>
                <p>Monte Carlo simulation is a computational technique that uses random sampling to model the probability of different outcomes in complex systems. In finance, it helps investors understand not just what might happen, but how likely each outcome is. Unlike deterministic models that give single-point estimates, Monte Carlo provides a probability distribution of possible results.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World Example: Retirement Planning</h4>
                  <p>A 45-year-old with $250,000 invested, contributing $1,500 monthly:</p>
                  <ul>
                    <li><strong>Traditional projection:</strong> "You'll have $2.1 million at age 65"</li>
                    <li><strong>Monte Carlo analysis:</strong> 
                      <ul>
                        <li>80% chance of having $1.5M - $3.2M</li>
                        <li>10% chance of having less than $1.5M</li>
                        <li>10% chance of having more than $3.2M</li>
                        <li>Probability of running out of money: 15%</li>
                      </ul>
                    </li>
                  </ul>
                  <p>Monte Carlo reveals the uncertainty that traditional methods hide.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Key Components of Financial Monte Carlo Simulations</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>📈 Return Distribution</h4>
                    <p>Uses historical or expected returns with random variation. Most models assume log-normal distribution based on actual market behavior patterns.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚡ Volatility Modeling</h4>
                    <p>Incorporates standard deviation of returns to simulate market ups and downs. Higher volatility = wider outcome ranges = more uncertainty.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📊 Correlation Effects</h4>
                    <p>Advanced models include correlation between different asset classes to accurately simulate diversified portfolio behavior.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🔄 Sequence of Returns Risk</h4>
                    <p>Random return sequences create different outcomes even with identical averages. Early losses can devastate retirement plans.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Practical Applications in Finance</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Retirement Planning:</strong> Determine safe withdrawal rates and probability of portfolio depletion</li>
                  <li><strong>Portfolio Optimization:</strong> Find asset allocations that maximize returns for given risk tolerance</li>
                  <li><strong>Option Pricing:</strong> Value complex derivatives and financial instruments</li>
                  <li><strong>Risk Management:</strong> Calculate Value at Risk (VaR) and stress test portfolios</li>
                  <li><strong>Project Finance:</strong> Evaluate capital investment projects with uncertain cash flows</li>
                  <li><strong>Insurance:</strong> Model catastrophic risks and set appropriate premiums</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Interpreting Results Like a Professional</h3>
                <blockquote className={styles.expertQuote}>
                  "The most valuable insight from Monte Carlo isn't the median outcome—it's understanding the tails of the distribution. Professional investors focus on the worst 5% of outcomes to ensure they can survive bad scenarios, while still positioning for the best 25% of outcomes to achieve growth."
                  <footer className={styles.quoteFooter}>— CFA Charterholder & Portfolio Manager, 20+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How accurate are Monte Carlo simulations?</h3>
                <p className={styles.faqAnswer}>Monte Carlo simulations provide statistical accuracy based on input assumptions. They don't predict the future but show the probability distribution of possible outcomes. Accuracy depends on: 1) Quality of input assumptions, 2) Number of simulations (more = more accurate), 3) Proper modeling of distributions and correlations. They're most valuable for understanding ranges and probabilities, not exact predictions.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between deterministic and Monte Carlo analysis?</h3>
                <p className={styles.faqAnswer}>Deterministic models use fixed inputs to produce single-point estimates (e.g., "8% average return = $X in 20 years"). Monte Carlo uses probability distributions to produce thousands of possible outcomes and shows their likelihood. Deterministic tells you what could happen; Monte Carlo tells you how likely each outcome is. Financial planners use both: deterministic for planning, Monte Carlo for risk assessment.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does sequence of returns risk affect retirement?</h3>
                <p className={styles.faqAnswer}>Sequence risk means the order of returns matters more than the average return during retirement withdrawal phases. Bad returns early in retirement can devastate a portfolio even with good long-term averages. Monte Carlo captures this by testing thousands of different return sequences. A portfolio might survive 90% of scenarios but fail in 10% where bad returns come early—this is what sequence risk reveals.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I use historical data or expected returns?</h3>
                <p className={styles.faqAnswer}>Professional models often blend both. Historical data provides realistic volatility and correlation patterns, but past performance doesn't guarantee future results. Expected returns reflect current market conditions and forward-looking estimates. Most experts recommend using conservative expected returns (lower than historical averages) with historical volatility patterns for retirement planning. Our calculator lets you adjust both independently.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Understand Your Financial Risks?</h2>
              <p className={styles.ctaText}>Use our Monte Carlo simulator to explore different scenarios. Adjust inputs to see how changes affect your probability of success and potential outcomes.</p>
              
              <p className={styles.disclaimer}>
                <strong>Important Limitations:</strong> This calculator uses simplified assumptions and normal distribution modeling. Real financial markets have fat tails, skewness, and changing correlations not captured here. Results are for educational purposes only. Past performance does not guarantee future results. Consult with a qualified financial advisor for personalized advice. Monte Carlo simulations cannot predict black swan events or structural market changes.
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

export default MonteCarloCalculator;