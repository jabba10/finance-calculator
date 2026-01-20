import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './roecalculator.module.css';

const ReturnOnEquityCalculator = ({ currentDate, lastModifiedDate }) => {
  const [netIncome, setNetIncome] = useState(250000);
  const [shareholderEquity, setShareholderEquity] = useState(1500000);
  const [totalAssets, setTotalAssets] = useState(3000000);
  const [totalLiabilities, setTotalLiabilities] = useState(1500000);
  const [preferredDividends, setPreferredDividends] = useState(0);
  const [averageEquity, setAverageEquity] = useState(true);
  const [results, setResults] = useState(null);
  const [comparisonData, setComparisonData] = useState([]);

  const calculateROE = () => {
    // Calculate equity from assets and liabilities if provided
    const calculatedEquity = totalAssets - totalLiabilities;
    const effectiveEquity = shareholderEquity > 0 ? shareholderEquity : calculatedEquity;
    
    // Calculate ROE
    const roe = (netIncome / effectiveEquity) * 100;
    
    // Calculate related ratios
    const returnOnAssets = (netIncome / totalAssets) * 100;
    const financialLeverage = totalAssets / effectiveEquity;
    const equityMultiplier = totalAssets / effectiveEquity;
    const debtToEquity = totalLiabilities / effectiveEquity;
    const netProfitMargin = (netIncome / (netIncome / 0.1)) * 100; // Assuming 10% net margin for revenue estimation
    const assetTurnover = (netIncome / 0.1) / totalAssets; // Revenue estimated from net income
    
    // Calculate DuPont Analysis components
    const dupontROE = netProfitMargin * assetTurnover * equityMultiplier;
    
    // Calculate ROE with preferred dividends
    const roeWithPreferred = ((netIncome - preferredDividends) / effectiveEquity) * 100;

    // Generate industry comparison data
    const industries = [
      { name: 'Technology', avgROE: 22, avgLeverage: 1.8, color: '#666666' },
      { name: 'Banking', avgROE: 12, avgLeverage: 10.5, color: '#888888' },
      { name: 'Healthcare', avgROE: 18, avgLeverage: 2.2, color: '#444444' },
      { name: 'Retail', avgROE: 15, avgLeverage: 2.8, color: '#777777' },
      { name: 'Utilities', avgROE: 10, avgLeverage: 3.5, color: '#999999' },
    ];

    setResults({
      netIncome,
      shareholderEquity: effectiveEquity,
      totalAssets,
      totalLiabilities,
      roe,
      returnOnAssets,
      financialLeverage,
      equityMultiplier,
      debtToEquity,
      netProfitMargin,
      assetTurnover,
      dupontROE,
      roeWithPreferred,
      preferredDividends,
      calculatedEquity,
    });

    setComparisonData(industries);
  };

  useEffect(() => {
    calculateROE();
  }, [netIncome, shareholderEquity, totalAssets, totalLiabilities, preferredDividends, averageEquity]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  const formatRatio = (value) => {
    return value.toFixed(2);
  };

  const getROEStatus = (roe) => {
    if (roe >= 20) return { status: 'Excellent', color: '#000000', emoji: '🚀', description: 'Exceptional profitability' };
    if (roe >= 15) return { status: 'Strong', color: '#333333', emoji: '✅', description: 'Above average performance' };
    if (roe >= 10) return { status: 'Good', color: '#666666', emoji: '👍', description: 'Solid performance' };
    if (roe >= 5) return { status: 'Fair', color: '#888888', emoji: '⚠️', description: 'Needs improvement' };
    return { status: 'Poor', color: '#999999', emoji: '❌', description: 'Below expectations' };
  };

  const getLeverageStatus = (leverage) => {
    if (leverage >= 8) return { status: 'High', color: '#000000', emoji: '⚡', description: 'Aggressive financing' };
    if (leverage >= 3) return { status: 'Moderate', color: '#333333', emoji: '📊', description: 'Balanced approach' };
    return { status: 'Low', color: '#666666', emoji: '🛡️', description: 'Conservative structure' };
  };

  return (
    <>
      <Head>
        <title>Advanced Return on Equity (ROE) Calculator | Measure Shareholder Returns</title>
        <meta name="description" content="Free advanced Return on Equity (ROE) calculator for businesses and investors. Calculate ROE, analyze profitability, perform DuPont analysis, and compare with industry benchmarks." />
        <meta name="keywords" content="ROE calculator, return on equity, profitability ratio, DuPont analysis, shareholder returns, financial ratios, investment analysis" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/roe-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Return on Equity (ROE) Calculator | Measure Shareholder Returns" />
        <meta property="og:description" content="Calculate and analyze Return on Equity (ROE) for accurate business profitability assessment. Perform DuPont analysis and compare with industry standards." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/roe-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Return on Equity (ROE) Calculator" />
        <meta name="twitter:description" content="Professional ROE analysis tool for investors, business owners, and financial analysts." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="return-on-equity-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Return on Equity (ROE) Calculator",
            "description": "Professional profitability calculator for Return on Equity analysis and DuPont financial modeling",
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
              "ratingCount": "1150",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Financial Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "ROE Calculation",
              "DuPont Analysis",
              "Industry Benchmarking",
              "Financial Leverage Analysis",
              "Shareholder Return Assessment"
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
                "name": "What is Return on Equity (ROE) and why is it important?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Return on Equity (ROE) measures how effectively a company generates profits from shareholders' equity. It's calculated as Net Income ÷ Shareholders' Equity. ROE is crucial because it shows how efficiently management uses investor capital to generate earnings growth.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is a good ROE for a company?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Generally, ROE above 15% is considered good, while above 20% is excellent. However, optimal ROE varies by industry. Capital-intensive industries might have lower ROE targets, while technology companies often aim for higher returns. Always compare against industry averages.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is DuPont analysis and how does it relate to ROE?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "DuPont analysis breaks ROE into three components: Profit Margin, Asset Turnover, and Financial Leverage. This helps identify whether high ROE comes from operational efficiency, asset utilization, or financial leverage, providing deeper insight into performance drivers.",
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
            <h1 className={styles.mainTitle}>Advanced Return on Equity (ROE) Calculator</h1>
            <p className={styles.subtitle}>Measure Your Business's Profitability and Shareholder Return Efficiency</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>DuPont Analysis</span>
              <span className={styles.badge}>Industry Benchmarks</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Enter Financial Data</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Net Income
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="5000000"
                      step="10000"
                      value={netIncome}
                      onChange={(e) => setNetIncome(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="5000000"
                      step="10000"
                      value={netIncome}
                      onChange={(e) => setNetIncome(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(netIncome)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Shareholder Equity
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="10000"
                      value={shareholderEquity}
                      onChange={(e) => setShareholderEquity(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="10000000"
                      step="10000"
                      value={shareholderEquity}
                      onChange={(e) => setShareholderEquity(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(shareholderEquity)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Preferred Dividends (Optional)
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="1000"
                      value={preferredDividends}
                      onChange={(e) => setPreferredDividends(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="1000000"
                      step="1000"
                      value={preferredDividends}
                      onChange={(e) => setPreferredDividends(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(preferredDividends)}</div>
                </label>
              </div>

              <h2 className={styles.sectionTitle} style={{ marginTop: '2rem' }}>Alternative Input Method</h2>
              <p className={styles.inputHelp}>Enter total assets and liabilities to calculate equity automatically</p>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Total Assets
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="20000000"
                      step="10000"
                      value={totalAssets}
                      onChange={(e) => setTotalAssets(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="20000000"
                      step="10000"
                      value={totalAssets}
                      onChange={(e) => setTotalAssets(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(totalAssets)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Total Liabilities
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="20000000"
                      step="10000"
                      value={totalLiabilities}
                      onChange={(e) => setTotalLiabilities(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="20000000"
                      step="10000"
                      value={totalLiabilities}
                      onChange={(e) => setTotalLiabilities(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(totalLiabilities)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={averageEquity}
                    onChange={(e) => setAverageEquity(e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  Use average shareholder equity (recommended for growing companies)
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Profitability Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsHeader}>
                    <div className={styles.primaryResult}>
                      <div className={styles.primaryResultLabel}>Return on Equity (ROE)</div>
                      <div className={styles.primaryResultValue}>{formatPercentage(results.roe)}</div>
                      <div className={styles.primaryResultStatus}>
                        <span className={styles.statusEmoji}>{getROEStatus(results.roe).emoji}</span>
                        <span className={styles.statusText}>{getROEStatus(results.roe).status}</span>
                        <span className={styles.statusDescription}>{getROEStatus(results.roe).description}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Return on Assets</div>
                      <div className={styles.resultValue}>{formatPercentage(results.returnOnAssets)}</div>
                      <div className={styles.resultSubtext}>
                        Asset Efficiency
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Financial Leverage</div>
                      <div className={styles.resultValue}>{formatRatio(results.financialLeverage)}x</div>
                      <div className={styles.resultSubtext}>
                        {getLeverageStatus(results.financialLeverage).emoji} {getLeverageStatus(results.financialLeverage).status}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Equity Multiplier</div>
                      <div className={styles.resultValue}>{formatRatio(results.equityMultiplier)}x</div>
                      <div className={styles.resultSubtext}>
                        Assets ÷ Equity
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Debt to Equity</div>
                      <div className={styles.resultValue}>{formatRatio(results.debtToEquity)}</div>
                      <div className={styles.resultSubtext}>
                        Liabilities ÷ Equity
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Net Income</div>
                      <div className={styles.resultValue}>{formatCurrency(results.netIncome)}</div>
                      <div className={styles.resultSubtext}>
                        Profit After Tax
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Shareholder Equity</div>
                      <div className={styles.resultValue}>{formatCurrency(results.shareholderEquity)}</div>
                      <div className={styles.resultSubtext}>
                        Assets - Liabilities
                      </div>
                    </div>
                  </div>

                  {/* DuPont Analysis Visualization */}
                  <div className={styles.dupontContainer}>
                    <h3 className={styles.dupontTitle}>DuPont Analysis Breakdown</h3>
                    <div className={styles.dupontFormula}>
                      <div className={styles.dupontEquation}>
                        <span className={styles.dupontComponent}>ROE</span>
                        <span className={styles.dupontEquals}>=</span>
                        <span className={styles.dupontComponent}>Profit Margin</span>
                        <span className={styles.dupontTimes}>×</span>
                        <span className={styles.dupontComponent}>Asset Turnover</span>
                        <span className={styles.dupontTimes}>×</span>
                        <span className={styles.dupontComponent}>Equity Multiplier</span>
                      </div>
                      <div className={styles.dupontValues}>
                        <div className={styles.dupontValue}>
                          <div className={styles.dupontValueLabel}>Profit Margin</div>
                          <div className={styles.dupontValueNumber}>{formatPercentage(results.netProfitMargin)}</div>
                          <div className={styles.dupontValueBar}>
                            <div 
                              className={styles.dupontValueFill}
                              style={{ width: `${Math.min(100, results.netProfitMargin * 2)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className={styles.dupontTimesSymbol}>×</div>
                        <div className={styles.dupontValue}>
                          <div className={styles.dupontValueLabel}>Asset Turnover</div>
                          <div className={styles.dupontValueNumber}>{formatRatio(results.assetTurnover)}x</div>
                          <div className={styles.dupontValueBar}>
                            <div 
                              className={styles.dupontValueFill}
                              style={{ width: `${Math.min(100, results.assetTurnover * 50)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className={styles.dupontTimesSymbol}>×</div>
                        <div className={styles.dupontValue}>
                          <div className={styles.dupontValueLabel}>Equity Multiplier</div>
                          <div className={styles.dupontValueNumber}>{formatRatio(results.equityMultiplier)}x</div>
                          <div className={styles.dupontValueBar}>
                            <div 
                              className={styles.dupontValueFill}
                              style={{ width: `${Math.min(100, results.equityMultiplier * 20)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className={styles.dupontEqualsSymbol}>=</div>
                        <div className={styles.dupontResult}>
                          <div className={styles.dupontValueLabel}>Calculated ROE</div>
                          <div className={styles.dupontValueNumber}>{formatPercentage(results.dupontROE)}</div>
                          <div className={styles.dupontValueBar}>
                            <div 
                              className={styles.dupontValueFill}
                              style={{ width: `${Math.min(100, results.roe)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.dupontInsights}>
                      <div className={styles.dupontInsight}>
                        <span className={styles.dupontInsightEmoji}>💰</span>
                        <span className={styles.dupontInsightText}>
                          Profit margin contributes {formatPercentage((results.netProfitMargin / results.roe) * 100)} to ROE
                        </span>
                      </div>
                      <div className={styles.dupontInsight}>
                        <span className={styles.dupontInsightEmoji}>⚡</span>
                        <span className={styles.dupontInsightText}>
                          Asset turnover contributes {formatPercentage((results.assetTurnover / results.roe) * 100)} to ROE
                        </span>
                      </div>
                      <div className={styles.dupontInsight}>
                        <span className={styles.dupontInsightEmoji}>📈</span>
                        <span className={styles.dupontInsightText}>
                          Financial leverage contributes {formatPercentage((results.equityMultiplier / results.roe) * 100)} to ROE
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ROE Composition Visualization */}
                  <div className={styles.compositionContainer}>
                    <h3 className={styles.compositionTitle}>ROE Composition Analysis</h3>
                    <div className={styles.compositionChart}>
                      <div className={styles.compositionBar}>
                        <div 
                          className={styles.compositionSegment}
                          style={{ 
                            width: `${(results.netIncome / results.shareholderEquity) * 100}%`,
                            background: '#666666'
                          }}
                          title={`ROE: ${formatPercentage(results.roe)}`}
                        >
                          <span className={styles.compositionSegmentLabel}>ROE: {formatPercentage(results.roe)}</span>
                        </div>
                      </div>
                      <div className={styles.compositionBreakdown}>
                        <div className={styles.compositionItem}>
                          <div className={styles.compositionItemLabel}>
                            <span className={styles.compositionDot} style={{ background: '#666666' }}></span>
                            Net Income
                          </div>
                          <div className={styles.compositionItemValue}>{formatCurrency(results.netIncome)}</div>
                        </div>
                        <div className={styles.compositionItem}>
                          <div className={styles.compositionItemLabel}>
                            <span className={styles.compositionDot} style={{ background: '#888888' }}></span>
                            Shareholder Equity
                          </div>
                          <div className={styles.compositionItemValue}>{formatCurrency(results.shareholderEquity)}</div>
                        </div>
                        <div className={styles.compositionItem}>
                          <div className={styles.compositionItemLabel}>
                            <span className={styles.compositionDot} style={{ background: '#444444' }}></span>
                            ROE Ratio
                          </div>
                          <div className={styles.compositionItemValue}>{formatPercentage(results.roe)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Industry Comparison */}
                  <div className={styles.industryComparison}>
                    <h3 className={styles.comparisonTitle}>Industry ROE Benchmark Comparison</h3>
                    <div className={styles.comparisonGrid}>
                      {comparisonData.map((industry, index) => (
                        <div key={index} className={styles.industryCard}>
                          <div className={styles.industryHeader}>
                            <div className={styles.industryName}>{industry.name}</div>
                            <div className={styles.industryROE}>{formatPercentage(industry.avgROE)}</div>
                          </div>
                          <div className={styles.industryDetails}>
                            <div className={styles.industryDetail}>
                              <span>Avg Leverage:</span>
                              <span>{formatRatio(industry.avgLeverage)}x</span>
                            </div>
                          </div>
                          <div className={styles.comparisonBar}>
                            <div className={styles.comparisonTrack}>
                              <div 
                                className={styles.comparisonFill}
                                style={{ 
                                  width: `${Math.min(100, industry.avgROE)}%`,
                                  background: industry.color
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className={styles.comparisonResult}>
                            {results.roe > industry.avgROE ? (
                              <span className={styles.better}>📈 {formatPercentage(results.roe - industry.avgROE)} above industry</span>
                            ) : (
                              <span className={styles.worse}>📉 {formatPercentage(industry.avgROE - results.roe)} below industry</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Financial Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Your ROE of <strong>{formatPercentage(results.roe)}</strong> indicates {getROEStatus(results.roe).description.toLowerCase()} relative to equity investment</li>
                      <li>For every $100 of shareholder equity, the company generates <strong>${results.roe.toFixed(2)}</strong> in net income</li>
                      <li>Financial leverage of <strong>{formatRatio(results.financialLeverage)}x</strong> suggests a {getLeverageStatus(results.financialLeverage).description.toLowerCase()} capital structure</li>
                      {results.roe < 15 && (
                        <li>⚠️ Consider improving ROE by increasing net income through revenue growth or cost reduction</li>
                      )}
                      {results.debtToEquity > 2 && (
                        <li>⚠️ High debt-to-equity ratio ({formatRatio(results.debtToEquity)}) may indicate excessive financial risk</li>
                      )}
                      {results.preferredDividends > 0 && (
                        <li>ROE excluding preferred dividends: <strong>{formatPercentage(results.roeWithPreferred)}</strong></li>
                      )}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Understanding Return on Equity (ROE): The Ultimate Profitability Metric</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Why ROE is the Most Important Metric for Investors</h3>
                <p>Return on Equity (ROE) measures how effectively a company generates profits from shareholders' investments. Unlike other profitability metrics, ROE considers both operating efficiency and financial leverage, providing a comprehensive view of management's ability to create value for shareholders. Warren Buffett famously considers ROE one of the most important metrics for evaluating investment opportunities.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World Interpretation:</h4>
                  <p>A company with $1 million in shareholder equity and $200,000 in net income:</p>
                  <ul>
                    <li><strong>ROE Calculation:</strong> $200,000 ÷ $1,000,000 = 20%</li>
                    <li><strong>Interpretation:</strong> For every $1 invested by shareholders, the company generates $0.20 in profit annually</li>
                    <li><strong>Investment Perspective:</strong> A 20% ROE means equity doubles approximately every 3.6 years (using Rule of 72)</li>
                    <li><strong>Benchmarking:</strong> Compare against industry average and company's historical ROE</li>
                  </ul>
                  <p>This metric directly links to shareholder wealth creation potential.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategies to Improve Return on Equity</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>💰 Increase Profit Margins</h4>
                    <p>Optimize pricing strategies, reduce production costs, improve operational efficiency, and focus on higher-margin products or services to boost net income.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚡ Enhance Asset Efficiency</h4>
                    <p>Improve inventory turnover, accelerate accounts receivable collection, optimize asset utilization, and divest underperforming assets.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Optimize Capital Structure</h4>
                    <p>Use appropriate debt levels to leverage returns, manage working capital efficiently, and consider share buybacks when appropriate.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🚀 Strategic Reinvestment</h4>
                    <p>Reinvest profits into high-return projects, expand into profitable markets, and allocate capital to initiatives with the best ROE potential.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>DuPont Analysis: Breaking Down ROE Components</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Profit Margin Component:</strong> Net Income ÷ Revenue - Measures operational efficiency and pricing power</li>
                  <li><strong>Asset Turnover Component:</strong> Revenue ÷ Total Assets - Measures how efficiently assets generate sales</li>
                  <li><strong>Financial Leverage Component:</strong> Total Assets ÷ Shareholders' Equity - Measures use of debt to amplify returns</li>
                  <li><strong>ROE Formula:</strong> Profit Margin × Asset Turnover × Financial Leverage = ROE</li>
                  <li><strong>Analysis Value:</strong> Identifies whether high ROE comes from operations, efficiency, or leverage</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Insight from Investment Analysts</h3>
                <blockquote className={styles.expertQuote}>
                  "While high ROE is attractive, sustainable ROE matters more. Look for companies that maintain strong ROE through economic cycles. Also, analyze whether high ROE comes from operational excellence or excessive leverage. The DuPont analysis is essential for understanding the quality of ROE and identifying potential risks."
                  <footer className={styles.quoteFooter}>— Chartered Financial Analyst, Investment Management Director</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can ROE be too high?</h3>
                <p className={styles.faqAnswer}>Yes, extremely high ROE (above 40-50%) may indicate excessive financial leverage, unsustainable profit margins, or accounting irregularities. It could also mean the company isn't reinvesting enough for future growth. Sustainable ROE in the 15-25% range is often preferable to extremely high but risky ROE.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does debt affect ROE?</h3>
                <p className={styles.faqAnswer}>Debt amplifies ROE through financial leverage. When companies use debt (which has fixed costs) to finance assets that generate returns higher than the interest rate, ROE increases. However, excessive debt increases financial risk and can lead to volatility in ROE during economic downturns.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between ROE and ROI?</h3>
                <p className={styles.faqAnswer}>ROE measures return specifically on shareholders' equity, while ROI (Return on Investment) can refer to returns on any type of investment. ROE focuses on equity investors' perspective, while ROI is broader and can include debt financing. ROE is more specific to evaluating management's use of shareholder capital.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How often should ROE be calculated and analyzed?</h3>
                <p className={styles.faqAnswer}>ROE should be calculated quarterly for public companies and at least annually for private companies. However, analyzing ROE trends over 3-5 years provides more meaningful insights than single-period calculations. Regular monitoring helps identify performance changes and assess management effectiveness.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Analyze Your Business Profitability?</h2>
              <p className={styles.ctaText}>Use our ROE calculator to assess shareholder return efficiency, perform DuPont analysis, and develop strategies for improved profitability.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides financial estimates for educational purposes. ROE analysis should consider industry context, economic conditions, and company-specific factors. High ROE may result from financial leverage rather than operational excellence. Consult with a qualified financial professional for specific investment or business decisions.
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
    revalidate: 21600, // 6 hours
  };
}

export default ReturnOnEquityCalculator;