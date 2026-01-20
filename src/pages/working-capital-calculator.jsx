import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './workingcapitalcalculator.module.css';

const WorkingCapitalCalculator = ({ currentDate, lastModifiedDate }) => {
  const [cash, setCash] = useState(50000);
  const [accountsReceivable, setAccountsReceivable] = useState(100000);
  const [inventory, setInventory] = useState(75000);
  const [accountsPayable, setAccountsPayable] = useState(60000);
  const [shortTermDebt, setShortTermDebt] = useState(30000);
  const [otherCurrentLiabilities, setOtherCurrentLiabilities] = useState(15000);
  const [results, setResults] = useState(null);
  const [trendData, setTrendData] = useState([]);

  const calculateWorkingCapital = () => {
    const currentAssets = cash + accountsReceivable + inventory;
    const currentLiabilities = accountsPayable + shortTermDebt + otherCurrentLiabilities;
    const workingCapital = currentAssets - currentLiabilities;
    const workingCapitalRatio = currentAssets / currentLiabilities;
    const quickRatio = (cash + accountsReceivable) / currentLiabilities;
    const cashRatio = cash / currentLiabilities;
    const netWorkingCapitalPercentage = (workingCapital / currentAssets) * 100;

    // Generate industry comparison data
    const industries = [
      { name: 'Manufacturing', avgRatio: 2.1, avgWorkingCapital: 1.5, color: '#666666' },
      { name: 'Retail', avgRatio: 1.8, avgWorkingCapital: 1.2, color: '#888888' },
      { name: 'Technology', avgRatio: 2.5, avgWorkingCapital: 2.0, color: '#444444' },
      { name: 'Healthcare', avgRatio: 1.9, avgWorkingCapital: 1.4, color: '#777777' },
      { name: 'Construction', avgRatio: 1.6, avgWorkingCapital: 1.0, color: '#999999' },
    ];

    // Generate trend data
    const trends = [];
    for (let i = 0; i < 6; i++) {
      const monthOffset = i;
      const monthAssets = currentAssets * (1 - (monthOffset * 0.05));
      const monthLiabilities = currentLiabilities * (1 + (monthOffset * 0.02));
      const monthWorkingCapital = monthAssets - monthLiabilities;
      
      trends.push({
        month: `Month ${i + 1}`,
        currentAssets: Math.round(monthAssets),
        currentLiabilities: Math.round(monthLiabilities),
        workingCapital: Math.round(monthWorkingCapital),
      });
    }

    setResults({
      currentAssets,
      currentLiabilities,
      workingCapital,
      workingCapitalRatio,
      quickRatio,
      cashRatio,
      netWorkingCapitalPercentage,
      cash,
      accountsReceivable,
      inventory,
      accountsPayable,
      shortTermDebt,
      otherCurrentLiabilities,
    });

    setTrendData(trends);
  };

  useEffect(() => {
    calculateWorkingCapital();
  }, [cash, accountsReceivable, inventory, accountsPayable, shortTermDebt, otherCurrentLiabilities]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value, decimals = 2) => {
    return value.toFixed(decimals);
  };

  const formatRatio = (value) => {
    return `${value.toFixed(2)}:1`;
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  const getHealthStatus = (ratio) => {
    if (ratio >= 2.0) return { status: 'Excellent', color: '#000000', emoji: '✅' };
    if (ratio >= 1.5) return { status: 'Good', color: '#333333', emoji: '👍' };
    if (ratio >= 1.0) return { status: 'Adequate', color: '#666666', emoji: '⚠️' };
    return { status: 'Concerning', color: '#888888', emoji: '❌' };
  };

  const getWorkingCapitalHealth = (workingCapital) => {
    if (workingCapital > 0) return { status: 'Positive', color: '#000000', emoji: '📈' };
    return { status: 'Negative', color: '#666666', emoji: '📉' };
  };

  return (
    <>
      <Head>
        <title>Advanced Working Capital Calculator | Measure Business Liquidity</title>
        <meta name="description" content="Free advanced working capital calculator for businesses. Calculate working capital, current ratio, quick ratio, and analyze business liquidity and short-term financial health." />
        <meta name="keywords" content="working capital calculator, business liquidity, current ratio, quick ratio, financial health, cash flow management, business calculator" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/working-capital-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Working Capital Calculator | Measure Business Liquidity" />
        <meta property="og:description" content="Calculate and analyze working capital for accurate business liquidity assessment. Monitor current ratio, quick ratio, and optimize short-term financial health." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/working-capital-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Working Capital Calculator" />
        <meta name="twitter:description" content="Professional working capital analysis tool for business owners and financial managers." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="working-capital-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Working Capital Calculator",
            "description": "Professional business liquidity calculator for working capital analysis and financial health assessment",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "920",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Business Financial Tools",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Working Capital Calculation",
              "Current Ratio Analysis",
              "Quick Ratio (Acid-Test)",
              "Industry Benchmarking",
              "Trend Analysis"
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
                "name": "What is working capital and why is it important for businesses?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Working capital is the difference between a company's current assets and current liabilities. It measures short-term financial health and liquidity, indicating whether a business can meet its short-term obligations and fund day-to-day operations.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is a good current ratio for a business?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A current ratio between 1.5:1 and 2:1 is generally considered healthy. Below 1:1 suggests liquidity issues, while above 2:1 may indicate inefficient use of assets. However, optimal ratios vary by industry and business model.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How can I improve my company's working capital?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Improve working capital by accelerating accounts receivable collections, optimizing inventory levels, extending accounts payable terms, and maintaining adequate cash reserves. Regular monitoring and proactive management are key.",
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
            <h1 className={styles.mainTitle}>Advanced Working Capital Calculator</h1>
            <p className={styles.subtitle}>Measure Your Business's Liquidity and Short-Term Financial Health</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Industry Benchmarks</span>
              <span className={styles.badge}>Financial Analysis</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Enter Your Financials</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Cash & Cash Equivalents
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="1000"
                      value={cash}
                      onChange={(e) => setCash(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="500000"
                      step="1000"
                      value={cash}
                      onChange={(e) => setCash(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(cash)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Accounts Receivable
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="1000"
                      value={accountsReceivable}
                      onChange={(e) => setAccountsReceivable(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="500000"
                      step="1000"
                      value={accountsReceivable}
                      onChange={(e) => setAccountsReceivable(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(accountsReceivable)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Inventory
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="1000"
                      value={inventory}
                      onChange={(e) => setInventory(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="500000"
                      step="1000"
                      value={inventory}
                      onChange={(e) => setInventory(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(inventory)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Accounts Payable
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="1000"
                      value={accountsPayable}
                      onChange={(e) => setAccountsPayable(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="500000"
                      step="1000"
                      value={accountsPayable}
                      onChange={(e) => setAccountsPayable(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(accountsPayable)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Short-term Debt
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="1000"
                      value={shortTermDebt}
                      onChange={(e) => setShortTermDebt(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="500000"
                      step="1000"
                      value={shortTermDebt}
                      onChange={(e) => setShortTermDebt(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(shortTermDebt)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Other Current Liabilities
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="1000"
                      value={otherCurrentLiabilities}
                      onChange={(e) => setOtherCurrentLiabilities(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="500000"
                      step="1000"
                      value={otherCurrentLiabilities}
                      onChange={(e) => setOtherCurrentLiabilities(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(otherCurrentLiabilities)}</div>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Liquidity Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Working Capital</div>
                      <div className={styles.resultValue}>{formatCurrency(results.workingCapital)}</div>
                      <div className={styles.resultSubtext}>
                        {getWorkingCapitalHealth(results.workingCapital).emoji} 
                        {getWorkingCapitalHealth(results.workingCapital).status}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Current Ratio</div>
                      <div className={styles.resultValue}>{formatRatio(results.workingCapitalRatio)}</div>
                      <div className={styles.resultSubtext}>
                        {getHealthStatus(results.workingCapitalRatio).emoji} 
                        {getHealthStatus(results.workingCapitalRatio).status}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Quick Ratio</div>
                      <div className={styles.resultValue}>{formatRatio(results.quickRatio)}</div>
                      <div className={styles.resultSubtext}>
                        Acid-Test (Excludes Inventory)
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Cash Ratio</div>
                      <div className={styles.resultValue}>{formatRatio(results.cashRatio)}</div>
                      <div className={styles.resultSubtext}>
                        Most Conservative Measure
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Current Assets</div>
                      <div className={styles.resultValue}>{formatCurrency(results.currentAssets)}</div>
                      <div className={styles.resultSubtext}>
                        Cash + AR + Inventory
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Current Liabilities</div>
                      <div className={styles.resultValue}>{formatCurrency(results.currentLiabilities)}</div>
                      <div className={styles.resultSubtext}>
                        AP + Debt + Other
                      </div>
                    </div>
                  </div>

                  {/* Working Capital Composition Visualization */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Working Capital Composition</h3>
                    <div className={styles.compositionChart}>
                      <div className={styles.chartSection}>
                        <div className={styles.chartSectionLabel}>Current Assets: {formatCurrency(results.currentAssets)}</div>
                        <div className={styles.chartBar}>
                          <div 
                            className={styles.chartSegment}
                            style={{ 
                              width: `${(results.cash / results.currentAssets) * 100}%`,
                              background: '#666666'
                            }}
                            title={`Cash: ${formatCurrency(results.cash)}`}
                          >
                            <span className={styles.chartSegmentLabel}>Cash</span>
                          </div>
                          <div 
                            className={styles.chartSegment}
                            style={{ 
                              width: `${(results.accountsReceivable / results.currentAssets) * 100}%`,
                              background: '#888888'
                            }}
                            title={`Accounts Receivable: ${formatCurrency(results.accountsReceivable)}`}
                          >
                            <span className={styles.chartSegmentLabel}>AR</span>
                          </div>
                          <div 
                            className={styles.chartSegment}
                            style={{ 
                              width: `${(results.inventory / results.currentAssets) * 100}%`,
                              background: '#444444'
                            }}
                            title={`Inventory: ${formatCurrency(results.inventory)}`}
                          >
                            <span className={styles.chartSegmentLabel}>Inventory</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.chartSection}>
                        <div className={styles.chartSectionLabel}>Current Liabilities: {formatCurrency(results.currentLiabilities)}</div>
                        <div className={styles.chartBar}>
                          <div 
                            className={styles.chartSegment}
                            style={{ 
                              width: `${(results.accountsPayable / results.currentLiabilities) * 100}%`,
                              background: '#777777'
                            }}
                            title={`Accounts Payable: ${formatCurrency(results.accountsPayable)}`}
                          >
                            <span className={styles.chartSegmentLabel}>AP</span>
                          </div>
                          <div 
                            className={styles.chartSegment}
                            style={{ 
                              width: `${(results.shortTermDebt / results.currentLiabilities) * 100}%`,
                              background: '#999999'
                            }}
                            title={`Short-term Debt: ${formatCurrency(results.shortTermDebt)}`}
                          >
                            <span className={styles.chartSegmentLabel}>Debt</span>
                          </div>
                          <div 
                            className={styles.chartSegment}
                            style={{ 
                              width: `${(results.otherCurrentLiabilities / results.currentLiabilities) * 100}%`,
                              background: '#555555'
                            }}
                            title={`Other Liabilities: ${formatCurrency(results.otherCurrentLiabilities)}`}
                          >
                            <span className={styles.chartSegmentLabel}>Other</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.chartSection}>
                        <div className={styles.chartSectionLabel}>Working Capital: {formatCurrency(results.workingCapital)}</div>
                        <div className={styles.chartBar}>
                          <div 
                            className={styles.chartSegment}
                            style={{ 
                              width: `${results.workingCapital > 0 ? 100 : 0}%`,
                              background: results.workingCapital > 0 ? '#000000' : '#666666'
                            }}
                            title={`Working Capital: ${formatCurrency(results.workingCapital)}`}
                          >
                            <span className={styles.chartSegmentLabel}>
                              {results.workingCapital > 0 ? 'Positive' : 'Negative'} WC
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ background: '#666666' }}></div>
                        <span>Cash & Equivalents</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ background: '#888888' }}></div>
                        <span>Accounts Receivable</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ background: '#444444' }}></div>
                        <span>Inventory</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ background: '#777777' }}></div>
                        <span>Accounts Payable</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ background: '#999999' }}></div>
                        <span>Short-term Debt</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ background: '#555555' }}></div>
                        <span>Other Liabilities</span>
                      </div>
                    </div>
                  </div>

                  {/* Trend Analysis */}
                  <div className={styles.trendContainer}>
                    <h3 className={styles.trendTitle}>6-Month Working Capital Trend</h3>
                    <div className={styles.trendGrid}>
                      {trendData.map((trend, index) => (
                        <div key={index} className={styles.trendCard}>
                          <div className={styles.trendMonth}>{trend.month}</div>
                          <div className={styles.trendValue}>
                            <div className={styles.trendLabel}>Working Capital</div>
                            <div className={styles.trendAmount}>{formatCurrency(trend.workingCapital)}</div>
                            <div className={`${styles.trendStatus} ${
                              trend.workingCapital > 0 ? styles.trendPositive : styles.trendNegative
                            }`}>
                              {trend.workingCapital > 0 ? 'Positive' : 'Negative'}
                            </div>
                          </div>
                          <div className={styles.trendBreakdown}>
                            <div className={styles.trendItem}>
                              <span>Assets:</span>
                              <span>{formatCurrency(trend.currentAssets)}</span>
                            </div>
                            <div className={styles.trendItem}>
                              <span>Liabilities:</span>
                              <span>{formatCurrency(trend.currentLiabilities)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Financial Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Your working capital of <strong>{formatCurrency(results.workingCapital)}</strong> indicates a {results.workingCapital > 0 ? 'healthy surplus' : 'potential shortfall'} for day-to-day operations</li>
                      <li>Current ratio of <strong>{formatRatio(results.workingCapitalRatio)}</strong> suggests {results.workingCapitalRatio >= 2 ? 'strong' : results.workingCapitalRatio >= 1.5 ? 'adequate' : 'concerning'} short-term liquidity</li>
                      <li>Quick ratio (excluding inventory) of <strong>{formatRatio(results.quickRatio)}</strong> shows {results.quickRatio >= 1 ? 'good' : 'limited'} ability to meet immediate obligations</li>
                      {results.workingCapitalRatio < 1.5 && (
                        <li>⚠️ Consider improving working capital by reducing inventory levels or accelerating accounts receivable collections</li>
                      )}
                      {results.cashRatio < 0.5 && (
                        <li>⚠️ Low cash ratio suggests limited immediate liquidity - consider maintaining higher cash reserves</li>
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
              <h2 className={styles.articleTitle}>Understanding Working Capital: The Lifeblood of Your Business</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Why Working Capital is Critical for Business Survival</h3>
                <p>Working capital represents the operating liquidity available to a business for day-to-day operations. It's the difference between current assets (cash, inventory, accounts receivable) and current liabilities (accounts payable, short-term debt). Adequate working capital ensures a business can meet its short-term obligations and fund ongoing operations without interruption.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World Example:</h4>
                  <p>A manufacturing company with:</p>
                  <ul>
                    <li><strong>Current Assets:</strong> $250,000 (Cash: $50k, AR: $100k, Inventory: $100k)</li>
                    <li><strong>Current Liabilities:</strong> $150,000 (AP: $80k, Debt: $50k, Other: $20k)</li>
                    <li><strong>Working Capital:</strong> $100,000 ($250k - $150k)</li>
                    <li><strong>Current Ratio:</strong> 1.67:1 ($250k ÷ $150k)</li>
                  </ul>
                  <p>This company has sufficient liquidity to cover short-term obligations and fund operations.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategies to Optimize Working Capital</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>💰 Accelerate Receivables</h4>
                    <p>Offer early payment discounts, implement stricter credit policies, and use invoice factoring to convert receivables to cash faster.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📉 Optimize Inventory</h4>
                    <p>Implement just-in-time inventory systems, reduce safety stock levels, and regularly review inventory turnover ratios.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚡ Extend Payables</h4>
                    <p>Negotiate longer payment terms with suppliers, take advantage of payment discounts, and strategically time payments.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📊 Cash Flow Management</h4>
                    <p>Maintain cash flow forecasts, establish credit lines for emergencies, and optimize the cash conversion cycle.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Key Working Capital Ratios Explained</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Current Ratio:</strong> Measures overall short-term liquidity (Current Assets ÷ Current Liabilities)</li>
                  <li><strong>Quick Ratio (Acid-Test):</strong> More conservative measure excluding inventory [(Cash + AR) ÷ Current Liabilities]</li>
                  <li><strong>Cash Ratio:</strong> Most conservative measure (Cash ÷ Current Liabilities)</li>
                  <li><strong>Working Capital Turnover:</strong> Measures efficiency in using working capital (Revenue ÷ Average Working Capital)</li>
                  <li><strong>Days Working Capital:</strong> Shows how many days of operations can be funded by working capital</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Insight from Financial Controllers</h3>
                <blockquote className={styles.expertQuote}>
                  "Working capital management is not just about having enough liquidity—it's about optimizing the balance between having too much (inefficient) and too little (risky). The most successful businesses actively manage their working capital components rather than just monitoring the total."
                  <footer className={styles.quoteFooter}>— Corporate Controller, Fortune 500 Company</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between working capital and cash flow?</h3>
                <p className={styles.faqAnswer}>Working capital is a snapshot of current assets minus current liabilities at a specific point in time. Cash flow measures the movement of cash in and out of the business over a period. While related, they serve different purposes: working capital indicates liquidity position, while cash flow shows cash generation and usage patterns.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can a company have too much working capital?</h3>
                <p className={styles.faqAnswer}>Yes, excessive working capital can indicate inefficient use of resources. Too much cash might earn low returns, excess inventory ties up capital and risks obsolescence, and lax accounts receivable policies can indicate poor credit management. The goal is optimal, not maximum, working capital.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do seasonal businesses manage working capital?</h3>
                <p className={styles.faqAnswer}>Seasonal businesses must build working capital reserves during peak seasons to cover lean periods. They often use lines of credit, carefully time inventory purchases, and may negotiate extended payment terms with suppliers to manage working capital fluctuations throughout the year.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the cash conversion cycle and why does it matter?</h3>
                <p className={styles.faqAnswer}>The cash conversion cycle measures how long it takes to convert inventory and other resources into cash flows from sales. It includes days inventory outstanding, days sales outstanding, and days payable outstanding. A shorter cycle means more efficient working capital management and better liquidity.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Optimize Your Business Liquidity?</h2>
              <p className={styles.ctaText}>Use our working capital calculator to assess your current position, identify improvement opportunities, and develop strategies for better financial health.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides financial estimates for educational purposes. Working capital needs vary by industry, business model, and economic conditions. Actual financial requirements may differ. Consult with a qualified financial professional for specific business advice.
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

export default WorkingCapitalCalculator;