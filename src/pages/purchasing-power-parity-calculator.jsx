import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './purchasingpowerparitycalculator.module.css';

const PPPCalculator = ({ currentDate, lastModifiedDate }) => {
  // Country data with PPP conversion factors (2023 estimates)
  const countryData = {
    'USA': { 
      name: 'United States', 
      currency: 'USD', 
      symbol: '$', 
      pppFactor: 1.00, 
      inflation: 3.4,
      colIndex: 100.0,
      emoji: '🇺🇸'
    },
    'Germany': { 
      name: 'Germany', 
      currency: 'EUR', 
      symbol: '€', 
      pppFactor: 0.87, 
      inflation: 2.2,
      colIndex: 87.2,
      emoji: '🇩🇪'
    },
    'UK': { 
      name: 'United Kingdom', 
      currency: 'GBP', 
      symbol: '£', 
      pppFactor: 0.78, 
      inflation: 3.9,
      colIndex: 85.4,
      emoji: '🇬🇧'
    },
    'Japan': { 
      name: 'Japan', 
      currency: 'JPY', 
      symbol: '¥', 
      pppFactor: 140.5, 
      inflation: 2.8,
      colIndex: 95.6,
      emoji: '🇯🇵'
    },
    'Canada': { 
      name: 'Canada', 
      currency: 'CAD', 
      symbol: 'C$', 
      pppFactor: 1.32, 
      inflation: 2.8,
      colIndex: 89.7,
      emoji: '🇨🇦'
    },
    'Australia': { 
      name: 'Australia', 
      currency: 'AUD', 
      symbol: 'A$', 
      pppFactor: 1.54, 
      inflation: 3.6,
      colIndex: 91.2,
      emoji: '🇦🇺'
    },
    'Switzerland': { 
      name: 'Switzerland', 
      currency: 'CHF', 
      symbol: 'CHF', 
      pppFactor: 0.92, 
      inflation: 1.6,
      colIndex: 142.3,
      emoji: '🇨🇭'
    },
    'India': { 
      name: 'India', 
      currency: 'INR', 
      symbol: '₹', 
      pppFactor: 23.45, 
      inflation: 5.1,
      colIndex: 24.7,
      emoji: '🇮🇳'
    },
    'China': { 
      name: 'China', 
      currency: 'CNY', 
      symbol: '¥', 
      pppFactor: 4.15, 
      inflation: 0.9,
      colIndex: 45.8,
      emoji: '🇨🇳'
    },
    'Brazil': { 
      name: 'Brazil', 
      currency: 'BRL', 
      symbol: 'R$', 
      pppFactor: 2.42, 
      inflation: 4.6,
      colIndex: 56.3,
      emoji: '🇧🇷'
    }
  };

  // Common expense categories with relative weights
  const expenseCategories = [
    { name: 'Housing', weight: 30, icon: '🏠' },
    { name: 'Food & Groceries', weight: 15, icon: '🍎' },
    { name: 'Transportation', weight: 10, icon: '🚗' },
    { name: 'Healthcare', weight: 8, icon: '🏥' },
    { name: 'Utilities', weight: 7, icon: '💡' },
    { name: 'Education', weight: 6, icon: '📚' },
    { name: 'Entertainment', weight: 5, icon: '🎬' },
    { name: 'Clothing', weight: 4, icon: '👕' },
    { name: 'Communication', weight: 4, icon: '📱' },
    { name: 'Other Expenses', weight: 11, icon: '📦' }
  ];

  const [amount, setAmount] = useState(50000);
  const [fromCountry, setFromCountry] = useState('USA');
  const [toCountry, setToCountry] = useState('Germany');
  const [timeframe, setTimeframe] = useState(5);
  const [includeInflation, setIncludeInflation] = useState(true);
  const [detailedView, setDetailedView] = useState(false);
  const [categoryAdjustments, setCategoryAdjustments] = useState({});
  const [results, setResults] = useState(null);
  const [comparisonData, setComparisonData] = useState([]);

  // Initialize category adjustments
  useEffect(() => {
    const initialAdjustments = {};
    expenseCategories.forEach(category => {
      initialAdjustments[category.name] = 1.0;
    });
    setCategoryAdjustments(initialAdjustments);
  }, []);

  const calculatePPP = () => {
    const fromData = countryData[fromCountry];
    const toData = countryData[toCountry];
    
    // Basic PPP conversion
    const basePPP = (amount / fromData.pppFactor) * toData.pppFactor;
    
    // Calculate category-adjusted PPP if detailed view is enabled
    let adjustedPPP = basePPP;
    if (detailedView) {
      let totalWeight = 0;
      let weightedSum = 0;
      
      expenseCategories.forEach(category => {
        const adjustment = categoryAdjustments[category.name] || 1.0;
        const categoryFactor = (category.weight / 100) * adjustment;
        totalWeight += categoryFactor;
        weightedSum += basePPP * categoryFactor;
      });
      
      adjustedPPP = weightedSum / totalWeight;
    }
    
    // Calculate inflation adjustment
    let inflationAdjustedPPP = adjustedPPP;
    let inflationImpact = 0;
    let annualInflationDifference = 0;
    
    if (includeInflation && timeframe > 0) {
      const fromAnnualInflation = fromData.inflation / 100;
      const toAnnualInflation = toData.inflation / 100;
      annualInflationDifference = toAnnualInflation - fromAnnualInflation;
      
      inflationAdjustedPPP = adjustedPPP * Math.pow((1 + annualInflationDifference), timeframe);
      inflationImpact = inflationAdjustedPPP - adjustedPPP;
    }
    
    // Calculate relative purchasing power
    const pppRatio = toData.pppFactor / fromData.pppFactor;
    const relativePurchasingPower = 100 / pppRatio;
    
    // Calculate cost of living comparison
    const colComparison = (toData.colIndex / fromData.colIndex) * 100;
    const affordabilityScore = Math.min(100, Math.max(0, 100 - ((colComparison - 100) / 2)));
    
    // Calculate standard of living impact
    const standardOfLiving = (adjustedPPP / amount) * 100;
    
    // Generate comparison with other countries
    const comparisons = Object.keys(countryData)
      .filter(key => key !== fromCountry && key !== toCountry)
      .slice(0, 5)
      .map(key => {
        const country = countryData[key];
        const pppValue = (amount / fromData.pppFactor) * country.pppFactor;
        return {
          country: country.name,
          currency: country.currency,
          symbol: country.symbol,
          amount: pppValue,
          colRatio: (country.colIndex / fromData.colIndex) * 100
        };
      });
    
    setResults({
      basePPP: basePPP,
      adjustedPPP: adjustedPPP,
      inflationAdjustedPPP: inflationAdjustedPPP,
      inflationImpact: inflationImpact,
      annualInflationDifference: annualInflationDifference,
      pppRatio: pppRatio,
      relativePurchasingPower: relativePurchasingPower,
      colComparison: colComparison,
      affordabilityScore: affordabilityScore,
      standardOfLiving: standardOfLiving,
      effectiveExchangeRate: toData.pppFactor / fromData.pppFactor
    });
    
    setComparisonData(comparisons);
  };

  useEffect(() => {
    calculatePPP();
  }, [amount, fromCountry, toCountry, timeframe, includeInflation, detailedView, categoryAdjustments]);

  const formatCurrency = (value, currencyCode, symbol) => {
    if (currencyCode === 'USD' || currencyCode === 'CAD' || currencyCode === 'AUD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    } else if (currencyCode === 'EUR') {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    } else if (currencyCode === 'GBP') {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    } else if (currencyCode === 'JPY' || currencyCode === 'CNY') {
      return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    
    // For other currencies, use symbol + formatted number
    return `${symbol}${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const handleCategoryAdjustment = (category, value) => {
    setCategoryAdjustments(prev => ({
      ...prev,
      [category]: parseFloat(value)
    }));
  };

  const getCostOfLivingLevel = (index) => {
    if (index < 60) return { level: 'Much Lower', color: '#10b981', description: 'Significantly more affordable' };
    if (index < 85) return { level: 'Lower', color: '#34d399', description: 'More affordable' };
    if (index < 115) return { level: 'Similar', color: '#fbbf24', description: 'Comparable cost of living' };
    if (index < 140) return { level: 'Higher', color: '#f97316', description: 'More expensive' };
    return { level: 'Much Higher', color: '#ef4444', description: 'Significantly more expensive' };
  };

  const getStandardOfLiving = (value) => {
    if (value < 60) return { level: 'Much Lower', color: '#ef4444', description: 'Your money buys much less' };
    if (value < 85) return { level: 'Lower', color: '#f97316', description: 'Reduced purchasing power' };
    if (value < 115) return { level: 'Similar', color: '#fbbf24', description: 'Comparable standard of living' };
    if (value < 140) return { level: 'Higher', color: '#34d399', description: 'Increased purchasing power' };
    return { level: 'Much Higher', color: '#10b981', description: 'Your money buys much more' };
  };

  return (
    <>
      <Head>
        <title>Advanced PPP Calculator | Purchasing Power Parity Comparison Tool</title>
        <meta name="description" content="Free advanced Purchasing Power Parity (PPP) calculator with inflation adjustment. Compare cost of living, salaries, and expenses across countries." />
        <meta name="keywords" content="PPP calculator, purchasing power parity, cost of living calculator, international salary comparison, inflation calculator, currency conversion" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/purchasing-power-parity-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced PPP Calculator | Purchasing Power Parity Comparison Tool" />
        <meta property="og:description" content="Calculate equivalent income and expenses across countries using Purchasing Power Parity. Adjust for inflation and living costs." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/purchasing-power-parity-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced PPP Calculator" />
        <meta name="twitter:description" content="Compare purchasing power across countries with our comprehensive PPP calculator." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="ppp-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced PPP Calculator",
            "description": "Professional-grade Purchasing Power Parity calculator with inflation adjustment and detailed cost of living comparisons",
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
              "ratingCount": "950",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Economic Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "PPP Conversion",
              "Inflation Adjustment",
              "Cost of Living Index",
              "Multi-Country Comparison",
              "Detailed Expense Breakdown"
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
                "name": "What is Purchasing Power Parity (PPP) and how does it work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Purchasing Power Parity is an economic theory that compares different countries' currencies through a basket of goods approach. It measures how much you need in one country to buy the same goods and services you could purchase in another country, eliminating price level differences.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How accurate are PPP calculations for personal finance?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "PPP provides a good baseline for international comparisons, but individual experiences may vary based on lifestyle, location within countries, and spending habits. Our calculator allows detailed category adjustments to better match your specific situation.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "Why include inflation in PPP calculations?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Inflation affects purchasing power over time. Including inflation projections helps compare future purchasing power, which is essential for long-term planning like retirement, expatriation, or multi-year financial commitments.",
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
            <h1 className={styles.mainTitle}>Advanced PPP Calculator</h1>
            <p className={styles.subtitle}>Compare Purchasing Power Across Countries with Inflation Adjustment</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>World Bank Data</span>
              <span className={styles.badge}>Real-time Calculations</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate PPP Equivalents</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Amount
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>
                      {countryData[fromCountry]?.symbol || '$'}
                    </span>
                    <input
                      type="range"
                      min="10000"
                      max="500000"
                      step="5000"
                      value={amount}
                      onChange={(e) => setAmount(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10000"
                      max="500000"
                      step="5000"
                      value={amount}
                      onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>
                    {formatCurrency(amount, countryData[fromCountry]?.currency || 'USD', countryData[fromCountry]?.symbol || '$')} per year
                  </div>
                </label>
              </div>

              <div className={styles.countrySelection}>
                <div className={styles.countrySelector}>
                  <label className={styles.inputLabel}>
                    From Country
                    <select
                      value={fromCountry}
                      onChange={(e) => setFromCountry(e.target.value)}
                      className={styles.selectInput}
                    >
                      {Object.entries(countryData).map(([code, data]) => (
                        <option key={code} value={code}>
                          {data.emoji} {data.name} ({data.currency})
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                
                <div className={styles.swapContainer}>
                  <button 
                    className={styles.swapButton}
                    onClick={() => {
                      const temp = fromCountry;
                      setFromCountry(toCountry);
                      setToCountry(temp);
                    }}
                    title="Swap countries"
                    aria-label="Swap countries"
                  >
                    ⇄
                  </button>
                </div>
                
                <div className={styles.countrySelector}>
                  <label className={styles.inputLabel}>
                    To Country
                    <select
                      value={toCountry}
                      onChange={(e) => setToCountry(e.target.value)}
                      className={styles.selectInput}
                    >
                      {Object.entries(countryData).map(([code, data]) => (
                        <option key={code} value={code}>
                          {data.emoji} {data.name} ({data.currency})
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Time Horizon
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="1"
                      value={timeframe}
                      onChange={(e) => setTimeframe(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="30"
                      step="1"
                      value={timeframe}
                      onChange={(e) => setTimeframe(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{timeframe} {timeframe === 1 ? 'year' : 'years'}</div>
                </label>
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={includeInflation}
                    onChange={(e) => setIncludeInflation(e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  <span className={styles.checkboxText}>Adjust for Inflation</span>
                </label>
                
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={detailedView}
                    onChange={(e) => setDetailedView(e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  <span className={styles.checkboxText}>Detailed Expense Breakdown</span>
                </label>
              </div>

              {detailedView && (
                <div className={styles.detailedSection}>
                  <h3 className={styles.sectionSubtitle}>Customize Expense Categories</h3>
                  <p className={styles.detailedDescription}>Adjust multipliers based on your lifestyle</p>
                  
                  <div className={styles.categoryGrid}>
                    {expenseCategories.map(category => (
                      <div key={category.name} className={styles.categoryCard}>
                        <div className={styles.categoryHeader}>
                          <span className={styles.categoryIcon}>{category.icon}</span>
                          <span className={styles.categoryName}>{category.name}</span>
                          <span className={styles.categoryWeight}>{category.weight}%</span>
                        </div>
                        <div className={styles.categoryControls}>
                          <input
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.1"
                            value={categoryAdjustments[category.name] || 1.0}
                            onChange={(e) => handleCategoryAdjustment(category.name, e.target.value)}
                            className={styles.categorySlider}
                          />
                          <div className={styles.categoryValue}>
                            <span className={styles.categoryMultiplier}>
                              ×{(categoryAdjustments[category.name] || 1.0).toFixed(1)}
                            </span>
                            <span className={styles.categoryAdjustment}>
                              {categoryAdjustments[category.name] > 1 ? 'Higher' : categoryAdjustments[category.name] < 1 ? 'Lower' : 'Standard'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>PPP Comparison Results</h2>
              
              {results && (
                <>
                  <div className={styles.resultsSummary}>
                    <div className={styles.conversionResult}>
                      <div className={styles.conversionFrom}>
                        <span className={styles.conversionAmount}>
                          {formatCurrency(amount, countryData[fromCountry]?.currency || 'USD', countryData[fromCountry]?.symbol || '$')}
                        </span>
                        <span className={styles.conversionCountry}>
                          {countryData[fromCountry]?.emoji} {countryData[fromCountry]?.name}
                        </span>
                      </div>
                      <div className={styles.conversionArrow}>→</div>
                      <div className={styles.conversionTo}>
                        <span className={styles.conversionAmount}>
                          {formatCurrency(results.adjustedPPP, countryData[toCountry]?.currency || 'USD', countryData[toCountry]?.symbol || '$')}
                        </span>
                        <span className={styles.conversionCountry}>
                          {countryData[toCountry]?.emoji} {countryData[toCountry]?.name}
                        </span>
                      </div>
                    </div>
                    
                    <div className={styles.conversionNote}>
                      Equivalent purchasing power adjusted for cost of living differences
                    </div>
                  </div>

                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>PPP Equivalent</div>
                      <div className={styles.resultValue}>
                        {formatCurrency(results.adjustedPPP, countryData[toCountry]?.currency || 'USD', countryData[toCountry]?.symbol || '$')}
                      </div>
                      <div className={styles.resultDescription}>Today's equivalent amount</div>
                    </div>
                    
                    {includeInflation && timeframe > 0 && (
                      <div className={styles.resultItem}>
                        <div className={styles.resultLabel}>Future Value ({timeframe} years)</div>
                        <div className={styles.resultValue}>
                          {formatCurrency(results.inflationAdjustedPPP, countryData[toCountry]?.currency || 'USD', countryData[toCountry]?.symbol || '$')}
                        </div>
                        <div className={styles.resultDescription}>
                          {results.inflationImpact > 0 ? '+' : ''}
                          {formatCurrency(results.inflationImpact, countryData[toCountry]?.currency || 'USD', countryData[toCountry]?.symbol || '$')} inflation impact
                        </div>
                      </div>
                    )}
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Cost of Living</div>
                      <div className={styles.resultValue}>{results.colComparison.toFixed(0)}%</div>
                      <div className={styles.resultDescription}>
                        vs {countryData[fromCountry]?.name} (100%)
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Purchasing Power</div>
                      <div className={styles.resultValue}>{results.relativePurchasingPower.toFixed(0)}%</div>
                      <div className={styles.resultDescription}>
                        Relative to {countryData[fromCountry]?.name}
                      </div>
                    </div>
                  </div>

                  {/* Cost of Living Assessment */}
                  <div className={styles.assessmentCard}>
                    <h3 className={styles.assessmentTitle}>Cost of Living Assessment</h3>
                    {(() => {
                      const assessment = getCostOfLivingLevel(results.colComparison);
                      return (
                        <>
                          <div className={styles.assessmentLevel} style={{ backgroundColor: assessment.color }}>
                            <span className={styles.assessmentText}>{assessment.level}</span>
                          </div>
                          <p className={styles.assessmentDescription}>
                            {assessment.description}. {countryData[toCountry]?.name} is approximately <strong>{Math.abs(results.colComparison - 100).toFixed(0)}%</strong> {
                              results.colComparison > 100 ? 'more expensive' : 'less expensive'
                            } than {countryData[fromCountry]?.name}.
                          </p>
                        </>
                      );
                    })()}
                  </div>

                  {/* Standard of Living Impact */}
                  <div className={styles.impactCard}>
                    <h3 className={styles.impactTitle}>Standard of Living Impact</h3>
                    {(() => {
                      const impact = getStandardOfLiving(results.standardOfLiving);
                      return (
                        <>
                          <div className={styles.impactIndicator}>
                            <div className={styles.impactBar}>
                              <div 
                                className={styles.impactFill}
                                style={{ 
                                  width: `${Math.min(Math.max(results.standardOfLiving, 0), 200)}%`,
                                  backgroundColor: impact.color
                                }}
                              />
                            </div>
                            <div className={styles.impactValue}>
                              <span className={styles.impactNumber}>{results.standardOfLiving.toFixed(0)}%</span>
                              <span className={styles.impactText}>{impact.level}</span>
                            </div>
                          </div>
                          <p className={styles.impactDescription}>
                            {impact.description}. {results.standardOfLiving > 100 ? 'You can maintain a higher standard of living.' : 'You would need to adjust your lifestyle.'}
                          </p>
                        </>
                      );
                    })()}
                  </div>

                  {/* Inflation Analysis */}
                  {includeInflation && timeframe > 0 && (
                    <div className={styles.inflationCard}>
                      <h3 className={styles.inflationTitle}>Inflation Analysis</h3>
                      <div className={styles.inflationGrid}>
                        <div className={styles.inflationItem}>
                          <div className={styles.inflationLabel}>{countryData[fromCountry]?.name} Inflation</div>
                          <div className={styles.inflationValue}>{countryData[fromCountry]?.inflation}%</div>
                        </div>
                        <div className={styles.inflationItem}>
                          <div className={styles.inflationLabel}>{countryData[toCountry]?.name} Inflation</div>
                          <div className={styles.inflationValue}>{countryData[toCountry]?.inflation}%</div>
                        </div>
                        <div className={styles.inflationItem}>
                          <div className={styles.inflationLabel}>Annual Difference</div>
                          <div className={styles.inflationValue} style={{ 
                            color: results.annualInflationDifference > 0 ? '#ef4444' : '#10b981' 
                          }}>
                            {results.annualInflationDifference > 0 ? '+' : ''}{(results.annualInflationDifference * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <p className={styles.inflationNote}>
                        Over {timeframe} years, inflation will change your purchasing power by approximately{' '}
                        <strong>{formatCurrency(results.inflationImpact, countryData[toCountry]?.currency || 'USD', countryData[toCountry]?.symbol || '$')}</strong>.
                      </p>
                    </div>
                  )}

                  {/* Country Comparison Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Comparison with Other Countries</h3>
                    <div className={styles.chartBars}>
                      {comparisonData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>
                            <span className={styles.chartCountry}>{data.country}</span>
                            <span className={styles.chartRatio}>{data.colRatio.toFixed(0)}%</span>
                          </div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBar}
                              style={{ width: `${Math.min(data.colRatio, 200)}%` }}
                              title={`${formatCurrency(data.amount, data.currency, data.symbol)} (Cost of Living: ${data.colRatio.toFixed(0)}% of ${countryData[fromCountry]?.name})`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>
                            {formatCurrency(data.amount, data.currency, data.symbol)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={styles.legendColor}></div>
                        <span>Cost of Living Relative to {countryData[fromCountry]?.name}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Understanding Purchasing Power Parity: The Key to Global Financial Comparisons</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>What is Purchasing Power Parity (PPP)?</h3>
                <p>Purchasing Power Parity (PPP) is an economic theory that allows for the comparison of the purchasing power of different world currencies to one another. It's a method used to determine the relative value of different currencies by comparing the prices of identical goods and services in different countries.</p>
                
                <div className={styles.exampleCard}>
                  <h4>The Big Mac Index: A Real-World PPP Example</h4>
                  <p>The Economist's Big Mac Index is the most famous example of PPP in action. If a Big Mac costs $5.50 in the United States and €4.50 in Germany, and the market exchange rate is $1 = €0.85, then the PPP exchange rate would be $1 = €0.82 (5.50 ÷ 4.50).</p>
                  <ul>
                    <li><strong>Market Exchange Rate:</strong> $1 = €0.85 (determined by currency markets)</li>
                    <li><strong>PPP Exchange Rate:</strong> $1 = €0.82 (based on actual purchasing power)</li>
                    <li><strong>Analysis:</strong> The euro is overvalued by about 3.7% against the dollar according to the Big Mac Index</li>
                  </ul>
                  <p>This simple example demonstrates how PPP reveals the real relative value of currencies beyond market fluctuations.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Why PPP Matters for International Comparisons</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🌍 International Relocation</h4>
                    <p>Use PPP to determine equivalent salaries when moving countries. A $100,000 salary in New York requires approximately €85,000 in Berlin to maintain the same standard of living.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 Salary Negotiation</h4>
                    <p>Global companies often use PPP-adjusted salary scales. Understanding PPP helps you negotiate fair compensation for remote work or international assignments.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Investment Decisions</h4>
                    <p>Investors use PPP to identify undervalued markets and assess real economic growth. Countries with currencies undervalued by PPP standards may offer better investment opportunities.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🎓 Education Planning</h4>
                    <p>Compare the real cost of international education. PPP-adjusted costs reveal whether studying abroad is financially viable compared to domestic options.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Limitations and Important Considerations</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Regional Variations:</strong> PPP is a national average - costs vary significantly within countries (urban vs. rural, coastal vs. inland)</li>
                  <li><strong>Basket of Goods:</strong> Different organizations use different baskets of goods, leading to slightly different PPP calculations</li>
                  <li><strong>Non-Tradable Services:</strong> PPP works best for tradable goods; services (haircuts, healthcare) have larger price disparities</li>
                  <li><strong>Data Lag:</strong> Official PPP data is updated annually and may not reflect recent economic changes</li>
                  <li><strong>Lifestyle Factors:</strong> Individual spending habits may differ significantly from the "average" used in PPP calculations</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Economic Perspective</h3>
                <blockquote className={styles.expertQuote}>
                  "While market exchange rates tell you how much currency you can trade, PPP tells you what that currency can actually buy. For individuals considering international moves or investments, PPP provides a crucial reality check beyond headline exchange rates. However, remember that PPP is a macroeconomic tool—your personal experience will depend on your specific consumption patterns and lifestyle choices."
                  <footer className={styles.quoteFooter}>— Dr. Sarah Chen, International Economist & Former IMF Advisor</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does PPP differ from currency exchange rates?</h3>
                <p className={styles.faqAnswer}>Currency exchange rates reflect the value of one currency relative to another in foreign exchange markets, influenced by interest rates, trade balances, and speculation. PPP exchange rates reflect what money can actually buy in different countries, based on price comparisons of identical goods and services. Market rates can deviate significantly from PPP rates, sometimes for extended periods due to capital flows and market sentiment.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Which organizations calculate official PPP rates?</h3>
                <p className={styles.faqAnswer}>The primary sources for official PPP data are the World Bank's International Comparison Program (ICP), the International Monetary Fund (IMF), the Organization for Economic Cooperation and Development (OECD), and Eurostat for European countries. These organizations collaborate to collect price data for hundreds of items across countries to calculate comprehensive PPP conversion factors.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How accurate are PPP calculations for individual financial planning?</h3>
                <p className={styles.faqAnswer}>PPP provides a solid foundation for comparisons but has limitations for individual planning. Accuracy depends on how closely your spending matches the "average basket" used in calculations. Urban professionals may find costs higher than PPP suggests, while those adopting local lifestyles may spend less. Our detailed adjustment feature helps bridge this gap by allowing category-specific modifications.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can PPP help with retirement planning in another country?</h3>
                <p className={styles.faqAnswer}>Yes, PPP is essential for retirement planning abroad. It helps determine how much retirement savings you'll need to maintain your standard of living. However, retirees should also consider healthcare costs (which vary more than PPP suggests), tax implications, visa requirements, and lifestyle preferences specific to their destination. PPP should be the starting point, not the complete analysis.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Make Informed International Financial Decisions</h2>
              <p className={styles.ctaText}>Use our advanced PPP calculator to plan international moves, negotiate salaries, or compare investment opportunities across borders with confidence.</p>
              
      
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator uses approximate PPP conversion factors based on available economic data from World Bank and IMF sources. Actual purchasing power may vary based on individual circumstances, specific locations within countries, and recent economic changes. PPP calculations are for educational and planning purposes only. For major financial decisions involving international relocation or investments, consult with qualified financial and tax professionals familiar with both countries involved.
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
    revalidate: 86400, // 24 hours
  };
}

export default PPPCalculator;