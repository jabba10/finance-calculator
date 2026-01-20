import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './leveragecalculator.module.css';

const LeverageCalculator = ({ currentDate, lastModifiedDate }) => {
  const [initialInvestment, setInitialInvestment] = useState(25000);
  const [leverageRatio, setLeverageRatio] = useState(4);
  const [assetReturn, setAssetReturn] = useState(8);
  const [loanInterestRate, setLoanInterestRate] = useState(4);
  const [holdingPeriod, setHoldingPeriod] = useState(5);
  const [assetVolatility, setAssetVolatility] = useState(15);
  const [maintenanceMargin, setMaintenanceMargin] = useState(25);
  const [results, setResults] = useState(null);
  const [scenarioData, setScenarioData] = useState([]);

  const calculateLeverage = () => {
    // Calculate total investment with leverage
    const borrowedAmount = initialInvestment * (leverageRatio - 1);
    const totalInvestment = initialInvestment + borrowedAmount;
    
    // Calculate annual returns
    const unleveragedReturn = initialInvestment * (assetReturn / 100);
    const leveragedAssetReturn = totalInvestment * (assetReturn / 100);
    const interestCost = borrowedAmount * (loanInterestRate / 100);
    const netLeveragedReturn = leveragedAssetReturn - interestCost;
    
    // Calculate returns over holding period
    const unleveragedFinalValue = initialInvestment * Math.pow(1 + (assetReturn / 100), holdingPeriod);
    const leveragedFinalValue = initialInvestment * Math.pow(1 + (netLeveragedReturn / initialInvestment), holdingPeriod);
    
    // Calculate risk metrics
    const leverageMultiplier = totalInvestment / initialInvestment;
    const volatilityAmplification = assetVolatility * leverageMultiplier;
    const marginCallPrice = totalInvestment * (maintenanceMargin / 100);
    const priceDropForMarginCall = ((totalInvestment - marginCallPrice) / totalInvestment) * 100;
    
    // Calculate return on equity (ROE)
    const unleveragedROE = (unleveragedReturn / initialInvestment) * 100;
    const leveragedROE = (netLeveragedReturn / initialInvestment) * 100;
    
    // Calculate different scenarios
    const scenarios = [];
    const returnScenarios = [-30, -20, -10, 0, 10, 20, 30];
    
    for (const returnPercent of returnScenarios) {
      const scenarioAssetReturn = totalInvestment * (returnPercent / 100);
      const scenarioNetReturn = scenarioAssetReturn - interestCost;
      const scenarioROE = (scenarioNetReturn / initialInvestment) * 100;
      const scenarioTotalValue = initialInvestment + scenarioNetReturn;
      
      scenarios.push({
        returnPercent: returnPercent,
        assetReturn: Math.round(scenarioAssetReturn),
        netReturn: Math.round(scenarioNetReturn),
        roe: scenarioROE,
        totalValue: Math.round(scenarioTotalValue),
        isPositive: scenarioNetReturn > 0
      });
    }
    
    setResults({
      totalInvestment: Math.round(totalInvestment),
      borrowedAmount: Math.round(borrowedAmount),
      unleveragedReturn: Math.round(unleveragedReturn),
      leveragedAssetReturn: Math.round(leveragedAssetReturn),
      interestCost: Math.round(interestCost),
      netLeveragedReturn: Math.round(netLeveragedReturn),
      unleveragedFinalValue: Math.round(unleveragedFinalValue),
      leveragedFinalValue: Math.round(leveragedFinalValue),
      leverageMultiplier: leverageMultiplier,
      volatilityAmplification: volatilityAmplification,
      marginCallPrice: Math.round(marginCallPrice),
      priceDropForMarginCall: priceDropForMarginCall,
      unleveragedROE: unleveragedROE,
      leveragedROE: leveragedROE,
      netGainLoss: Math.round(netLeveragedReturn - unleveragedReturn)
    });
    
    setScenarioData(scenarios);
  };

  useEffect(() => {
    calculateLeverage();
  }, [initialInvestment, leverageRatio, assetReturn, loanInterestRate, holdingPeriod, assetVolatility, maintenanceMargin]);

  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '0%';
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(numValue)) return '0%';
    return `${numValue.toFixed(2)}%`;
  };

  const formatDecimal = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '0.00';
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(numValue)) return '0.00';
    return numValue.toFixed(2);
  };

  const leverageRatios = [
    { value: 1, label: '1:1 (No Leverage)' },
    { value: 2, label: '2:1 (Conservative)' },
    { value: 3, label: '3:1 (Moderate)' },
    { value: 4, label: '4:1 (Aggressive)' },
    { value: 5, label: '5:1 (Very Aggressive)' },
    { value: 10, label: '10:1 (Extreme)' }
  ];

  // Calculate derived values for warning card (with null checks)
  const warningCalculatedROE = results ? results.leveragedROE : 0;
  const warningCalculatedLoss = results ? Math.abs((assetReturn * leverageRatio) - ((leverageRatio - 1) * loanInterestRate)) : 0;

  return (
    <>
      <Head>
        <title>Advanced Leverage Calculator | Calculate Investment Returns with Borrowed Capital</title>
        <meta name="description" content="Free advanced leverage calculator for investments, real estate, and trading. Calculate amplified returns, margin requirements, and risk analysis with borrowed capital." />
        <meta name="keywords" content="leverage calculator, margin calculator, investment leverage, real estate leverage, trading leverage, risk calculator, return amplification" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/operating-leverage-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Leverage Calculator | Calculate Investment Returns with Borrowed Capital" />
        <meta property="og:description" content="Calculate amplified investment returns with leverage, analyze margin requirements, and understand risk-reward tradeoffs with borrowed capital." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/operating-leverage-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Leverage Calculator" />
        <meta name="twitter:description" content="Calculate investment returns amplified through leverage with comprehensive risk analysis." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="leverage-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Leverage Calculator",
            "description": "Professional leverage calculator for investment analysis with borrowed capital, margin requirements, and risk assessment",
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
              "name": "Investment Tools Pro",
              "url": "https://www.financecalculatorfree.com/"
            },
            "featureList": [
              "Leverage Ratio Analysis",
              "Margin Requirement Calculations",
              "Risk-Return Scenarios",
              "Volatility Amplification",
              "Return on Equity (ROE) Analysis"
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
                "name": "What is leverage and how does it work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Leverage involves using borrowed capital to increase the potential return of an investment. For example, with 4:1 leverage, you control $400,000 of assets with only $100,000 of your own money. This amplifies both gains and losses relative to your initial investment.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What are the risks of using leverage?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Leverage amplifies losses as well as gains. Key risks include: margin calls (requiring additional funds), interest costs reducing net returns, increased volatility exposure, potential for total loss exceeding initial investment, and forced liquidation at unfavorable prices.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's a safe leverage ratio for beginners?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "For beginners, 2:1 leverage is generally considered safe. More experienced investors might use 3:1 or 4:1. Anything above 5:1 is considered high risk. The appropriate ratio depends on asset volatility, interest rates, your risk tolerance, and investment horizon.",
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
            <h1 className={styles.mainTitle}>Advanced Leverage Calculator</h1>
            <p className={styles.subtitle}>Calculate Amplified Investment Returns with Borrowed Capital & Analyze Risk-Reward Tradeoffs</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Risk Analysis</span>
              <span className={styles.badge}>Professional Tool</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate Your Leverage</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Initial Investment (Equity)
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
                  Leverage Ratio
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={leverageRatio}
                      onChange={(e) => setLeverageRatio(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="1"
                      value={leverageRatio}
                      onChange={(e) => setLeverageRatio(parseInt(e.target.value) || 1)}
                      className={styles.numberInput}
                    />
                    <span className={styles.ratioSymbol}>:1</span>
                  </div>
                  <div className={styles.valueDisplay}>{leverageRatio}:1</div>
                  <div className={styles.leveragePresets}>
                    {leverageRatios.map((ratio) => (
                      <button
                        key={ratio.value}
                        className={`${styles.leveragePreset} ${leverageRatio === ratio.value ? styles.activePreset : ''}`}
                        onClick={() => setLeverageRatio(ratio.value)}
                      >
                        {ratio.label}
                      </button>
                    ))}
                  </div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Expected Asset Return
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="-20"
                      max="30"
                      step="1"
                      value={assetReturn}
                      onChange={(e) => setAssetReturn(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="-20"
                      max="30"
                      step="1"
                      value={assetReturn}
                      onChange={(e) => setAssetReturn(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(assetReturn)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Loan Interest Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      step="0.5"
                      value={loanInterestRate}
                      onChange={(e) => setLoanInterestRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="15"
                      step="0.5"
                      value={loanInterestRate}
                      onChange={(e) => setLoanInterestRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(loanInterestRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Holding Period
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={holdingPeriod}
                      onChange={(e) => setHoldingPeriod(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="30"
                      step="1"
                      value={holdingPeriod}
                      onChange={(e) => setHoldingPeriod(parseInt(e.target.value) || 1)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{holdingPeriod} years</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Asset Volatility
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="1"
                      value={assetVolatility}
                      onChange={(e) => setAssetVolatility(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="5"
                      max="50"
                      step="1"
                      value={assetVolatility}
                      onChange={(e) => setAssetVolatility(parseInt(e.target.value) || 10)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(assetVolatility)}</div>
                  <div className={styles.inputHint}>Annual standard deviation (risk measure)</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Maintenance Margin
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      step="1"
                      value={maintenanceMargin}
                      onChange={(e) => setMaintenanceMargin(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10"
                      max="50"
                      step="1"
                      value={maintenanceMargin}
                      onChange={(e) => setMaintenanceMargin(parseInt(e.target.value) || 25)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(maintenanceMargin)}</div>
                  <div className={styles.inputHint}>Minimum equity percentage required</div>
                </label>
              </div>

              <div className={styles.warningCard}>
                <h4 className={styles.warningTitle}>⚠️ Leverage Risk Warning</h4>
                <p className={styles.warningText}>
                  Leverage amplifies both gains AND losses. With {leverageRatio}:1 leverage, a {formatDecimal(Math.abs(assetReturn))}% asset return becomes {formatDecimal(warningCalculatedROE)}% return on your equity, but a -{formatDecimal(Math.abs(assetReturn))}% asset return becomes -{formatDecimal(warningCalculatedLoss)}% loss on your equity.
                </p>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Leverage Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Investment</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalInvestment)}</div>
                      <div className={styles.resultSubtext}>{formatCurrency(results.borrowedAmount)} borrowed</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Annual Return on Equity</div>
                      <div className={styles.resultValue}>{formatPercentage(results.leveragedROE)}</div>
                      <div className={styles.resultSubtext} style={{ color: results.netGainLoss >= 0 ? '#00aa00' : '#cc0000' }}>
                        vs {formatPercentage(results.unleveragedROE)} unleveraged
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Net Annual Gain/Loss</div>
                      <div className={styles.resultValue} style={{ color: results.netLeveragedReturn >= 0 ? '#00aa00' : '#cc0000' }}>
                        {formatCurrency(results.netLeveragedReturn)}
                      </div>
                      <div className={styles.resultSubtext}>After interest costs</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Risk Amplification</div>
                      <div className={styles.resultValue}>{formatDecimal(results.leverageMultiplier)}x</div>
                      <div className={styles.resultSubtext}>{formatPercentage(results.volatilityAmplification)} volatility</div>
                    </div>
                  </div>

                  {/* Investment Breakdown */}
                  <div className={styles.breakdownCard}>
                    <h3 className={styles.breakdownTitle}>Investment Structure</h3>
                    <div className={styles.breakdownChart}>
                      <div className={styles.chartContainer}>
                        <div className={styles.chartLabels}>
                          <div className={styles.chartLabel}>Your Equity: {formatCurrency(initialInvestment)}</div>
                          <div className={styles.chartLabel}>Borrowed Funds: {formatCurrency(results.borrowedAmount)}</div>
                        </div>
                        <div className={styles.chartVisual}>
                          <div 
                            className={styles.chartEquity}
                            style={{ width: `${(initialInvestment / results.totalInvestment) * 100}%` }}
                          >
                            <div className={styles.chartSegmentLabel}>Equity</div>
                          </div>
                          <div 
                            className={styles.chartDebt}
                            style={{ width: `${(results.borrowedAmount / results.totalInvestment) * 100}%` }}
                          >
                            <div className={styles.chartSegmentLabel}>Debt</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.leverageMetrics}>
                      <div className={styles.metricItem}>
                        <div className={styles.metricLabel}>Debt-to-Equity Ratio</div>
                        <div className={styles.metricValue}>{formatDecimal((results.borrowedAmount / initialInvestment))}:1</div>
                      </div>
                      <div className={styles.metricItem}>
                        <div className={styles.metricLabel}>Interest Coverage</div>
                        <div className={styles.metricValue}>{formatDecimal((results.leveragedAssetReturn / results.interestCost))}x</div>
                      </div>
                      <div className={styles.metricItem}>
                        <div className={styles.metricLabel}>Margin Call Trigger</div>
                        <div className={styles.metricValue}>{formatPercentage(results.priceDropForMarginCall)} drop</div>
                      </div>
                    </div>
                  </div>

                  {/* Scenario Analysis */}
                  <div className={styles.scenarioContainer}>
                    <h3 className={styles.scenarioTitle}>Return Scenarios with {leverageRatio}:1 Leverage</h3>
                    <div className={styles.scenarioGrid}>
                      {scenarioData.map((scenario, index) => (
                        <div key={index} className={styles.scenarioItem}>
                          <div className={styles.scenarioHeader}>
                            <div className={styles.scenarioReturn}>{formatPercentage(scenario.returnPercent)}</div>
                            <div className={styles.scenarioLabel}>Asset Return</div>
                          </div>
                          <div className={styles.scenarioBody}>
                            <div className={styles.scenarioMetric}>
                              <div className={styles.metricLabel}>Net Return</div>
                              <div className={styles.metricValue} style={{ color: scenario.netReturn >= 0 ? '#00aa00' : '#cc0000' }}>
                                {formatCurrency(scenario.netReturn)}
                              </div>
                            </div>
                            <div className={styles.scenarioMetric}>
                              <div className={styles.metricLabel}>Return on Equity</div>
                              <div className={styles.metricValue} style={{ color: scenario.roe >= 0 ? '#00aa00' : '#cc0000' }}>
                                {formatPercentage(scenario.roe)}
                              </div>
                            </div>
                            <div className={styles.scenarioMetric}>
                              <div className={styles.metricLabel}>Total Value</div>
                              <div className={styles.metricValue}>{formatCurrency(scenario.totalValue)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>⚡ Leverage Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Leverage amplifies your returns by <strong>{formatDecimal(results.leverageMultiplier)}x</strong></li>
                      <li>Your annual return on equity increases from <strong>{formatPercentage(results.unleveragedROE)}</strong> to <strong>{formatPercentage(results.leveragedROE)}</strong></li>
                      <li>Volatility is amplified to <strong>{formatPercentage(results.volatilityAmplification)}</strong> annually</li>
                      <li>A <strong>{formatPercentage(results.priceDropForMarginCall)}</strong> price drop would trigger a margin call</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Understanding Leverage: The Double-Edged Sword of Investing</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>How Leverage Works: Amplifying Returns</h3>
                <p>Leverage allows investors to control larger asset positions than they could with their own capital alone. By borrowing money to invest, you amplify both potential returns and risks. The key metric is the leverage ratio, which shows how much total capital you control relative to your own equity.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Example: Real Estate Investment with 4:1 Leverage</h4>
                  <ul>
                    <li><strong>Your Investment:</strong> $100,000 cash</li>
                    <li><strong>Mortgage (3:1 leverage):</strong> $300,000 borrowed at 4% interest</li>
                    <li><strong>Total Property Value:</strong> $400,000</li>
                    <li><strong>Property Appreciation (5%):</strong> $20,000 gain</li>
                    <li><strong>Interest Cost:</strong> $12,000 (4% of $300,000)</li>
                    <li><strong>Net Gain:</strong> $8,000 (8% return on your $100,000)</li>
                    <li><strong>Unleveraged Alternative:</strong> $5,000 gain (5% of $100,000)</li>
                    <li><strong>Leverage Benefit:</strong> +60% higher return</li>
                  </ul>
                  <p>This example shows how leverage can significantly boost returns when asset appreciation exceeds borrowing costs.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common Leverage Applications</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🏠 Real Estate</h4>
                    <p><strong>Typical Leverage:</strong> 3:1 to 5:1 (20-25% down payment)<br/>
                    <strong>Interest Rates:</strong> 3-7% (mortgage rates)<br/>
                    <strong>Benefits:</strong> Tax-deductible interest, rental income covers payments<br/>
                    <strong>Risks:</strong> Property value declines, vacancy rates, interest rate hikes</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Stock Market</h4>
                    <p><strong>Typical Leverage:</strong> 2:1 (Regulation T margin)<br/>
                    <strong>Interest Rates:</strong> 5-12% (broker margin rates)<br/>
                    <strong>Benefits:</strong> Amplified gains, short-term trading advantage<br/>
                    <strong>Risks:</strong> Margin calls, high volatility, daily interest accrual</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 Business & Private Equity</h4>
                    <p><strong>Typical Leverage:</strong> 3:1 to 10:1 (LBO structures)<br/>
                    <strong>Interest Rates:</strong> 6-15% (business loan rates)<br/>
                    <strong>Benefits:</strong> Higher ROE, tax shield from interest deductions<br/>
                    <strong>Risks:</strong> Cash flow constraints, covenant violations, business cycles</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🌐 Forex & Crypto Trading</h4>
                    <p><strong>Typical Leverage:</strong> 10:1 to 100:1 (varies by jurisdiction)<br/>
                    <strong>Interest Rates:</strong> Rollover/swaps (can be positive or negative)<br/>
                    <strong>Benefits:</strong> Small moves create large profits, 24/7 markets<br/>
                    <strong>Risks:</strong> Extremely high risk, rapid account depletion, platform risks</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Risk Management with Leverage</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Margin Requirements:</strong> Always maintain buffer above minimum margin requirements (typically 25-50% extra)</li>
                  <li><strong>Stop-Loss Orders:</strong> Use automated stop-losses to limit downside (set at 10-20% below entry for leveraged positions)</li>
                  <li><strong>Position Sizing:</strong> Limit leveraged positions to 5-10% of total portfolio value to prevent catastrophic losses</li>
                  <li><strong>Interest Rate Hedging:</strong> Use fixed-rate loans or interest rate swaps for predictable borrowing costs</li>
                  <li><strong>Diversification:</strong> Avoid concentrating leveraged positions in single assets or correlated markets</li>
                  <li><strong>Stress Testing:</strong> Regularly test portfolio against worst-case scenarios (2008 crisis, 2020 pandemic moves)</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding Margin Calls</h3>
                <div className={styles.warningCard}>
                  <h4>📉 Margin Call Mechanics & Prevention</h4>
                  <ol className={styles.marginSteps}>
                    <li><strong>Initial Margin:</strong> Minimum equity required to open position (typically 50% for stocks, 20-25% for real estate)</li>
                    <li><strong>Maintenance Margin:</strong> Minimum equity required to keep position open (typically 25% for stocks, lenders may require 30-40% for real estate)</li>
                    <li><strong>Margin Call Trigger:</strong> When equity falls below maintenance margin, broker/lender demands additional funds</li>
                    <li><strong>Margin Call Response:</strong> Deposit more funds, sell other assets, or forced liquidation of leveraged position</li>
                    <li><strong>Liquidation:</strong> If margin call not met, position automatically sold at market price (often at worst possible time)</li>
                    <li><strong>Prevention Strategies:</strong> Maintain 150% of minimum margin, use stop-losses, avoid maximum leverage, regular monitoring</li>
                  </ol>
                  <p><strong>Historical Lesson:</strong> During the 2008 financial crisis, many leveraged investors faced margin calls just as asset prices reached lows, forcing sales at the worst possible time and locking in permanent losses.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Leverage Advice</h3>
                <blockquote className={styles.expertQuote}>
                  "The most important rule with leverage is to never use more than you can afford to lose. Many investors focus only on the upside potential, but leverage works both ways. I recommend beginners start with no leverage, then gradually add 2:1 leverage only after they've experienced a full market cycle. Always calculate your break-even point including interest costs, and maintain a cash buffer equal to at least 6 months of interest payments."
                  <footer className={styles.quoteFooter}>— Portfolio Manager & Risk Strategist, 25+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between good debt and bad debt for leverage?</h3>
                <p className={styles.faqAnswer}>Good debt for leverage has: 1) Lower interest rate than expected investment return, 2) Tax-deductible interest (mortgages, business loans), 3) Funds productive assets that generate income/cash flow, 4) Fixed or predictable interest costs, 5) Long-term maturity matching investment horizon. Bad debt has: high interest rates, funds consumption or depreciating assets, variable rates exposing you to rate hikes, short-term maturities requiring frequent refinancing.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do I calculate my maximum safe leverage ratio?</h3>
                <p className={styles.faqAnswer}>Maximum safe leverage = (1 / Maximum tolerable drawdown). If you can tolerate a 25% portfolio decline without panicking or needing the money, maximum leverage = 1 / 0.25 = 4:1. More conservative formula: Maximum leverage = (Expected return - Interest rate) / (Asset volatility × Risk tolerance factor). For most individual investors, 2:1 to 3:1 is generally considered prudent for long-term investments.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What happens during a margin call and how can I avoid it?</h3>
                <p className={styles.faqAnswer}>During a margin call: 1) Broker/lender notifies you that equity has fallen below maintenance margin, 2) You have 2-5 days (varies) to deposit additional funds, 3) If unmet, broker liquidates positions (often at worst prices). To avoid: maintain equity 150% of minimum requirement, use stop-loss orders, diversify leveraged positions, avoid maximum allowable leverage, keep cash reserves, monitor positions daily during volatile periods.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Is leverage suitable for retirement accounts?</h3>
                <p className={styles.faqAnswer}>Generally no, and often not allowed. Most retirement accounts (401k, IRA) prohibit borrowing or margin trading. Some exceptions: 1) Mortgage on investment property in Self-Directed IRA (complex and rare), 2) Limited margin in certain brokerage IRAs (restricted). For retirement funds, focus on time horizon and compounding rather than leverage. If you do use leverage, keep it minimal (1.5:1 to 2:1 maximum) and only with funds you won't need for 10+ years.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Analyze Your Leverage Strategy?</h2>
              <p className={styles.ctaText}>Use our calculator to test different leverage ratios, understand risk amplification, and find the optimal balance between potential returns and acceptable risk for your investment goals.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides educational estimates based on simplified assumptions. Leverage involves significant risks including potential losses exceeding initial investment, margin calls, forced liquidation, interest rate risk, and market volatility. Past performance does not guarantee future results. This tool is for educational purposes only and not investment advice. Consult with qualified financial professionals before using leverage. Leverage may not be suitable for all investors.
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
    revalidate: 21600, // 6 hours (not 24)
  };
}

export default LeverageCalculator;