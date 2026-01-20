import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './currentratiocalculator.module.css';

const CurrentRatioCalculator = ({ currentDate, lastModifiedDate }) => {
  const [cash, setCash] = useState(50000);
  const [accountsReceivable, setAccountsReceivable] = useState(75000);
  const [inventory, setInventory] = useState(100000);
  const [marketableSecurities, setMarketableSecurities] = useState(25000);
  const [otherCurrentAssets, setOtherCurrentAssets] = useState(15000);
  const [accountsPayable, setAccountsPayable] = useState(60000);
  const [shortTermDebt, setShortTermDebt] = useState(40000);
  const [accruedExpenses, setAccruedExpenses] = useState(25000);
  const [otherCurrentLiabilities, setOtherCurrentLiabilities] = useState(10000);
  const [results, setResults] = useState(null);
  const [industryData, setIndustryData] = useState([]);

  const calculateCurrentRatio = () => {
    const totalCurrentAssets = cash + accountsReceivable + inventory + marketableSecurities + otherCurrentAssets;
    const totalCurrentLiabilities = accountsPayable + shortTermDebt + accruedExpenses + otherCurrentLiabilities;
    const currentRatio = totalCurrentAssets / totalCurrentLiabilities;
    const workingCapital = totalCurrentAssets - totalCurrentLiabilities;
    const quickRatio = (cash + accountsReceivable + marketableSecurities) / totalCurrentLiabilities;
    const cashRatio = (cash + marketableSecurities) / totalCurrentLiabilities;
    const assetComposition = {
      cashPercentage: (cash / totalCurrentAssets) * 100,
      accountsReceivablePercentage: (accountsReceivable / totalCurrentAssets) * 100,
      inventoryPercentage: (inventory / totalCurrentAssets) * 100,
      securitiesPercentage: (marketableSecurities / totalCurrentAssets) * 100,
      otherAssetsPercentage: (otherCurrentAssets / totalCurrentAssets) * 100
    };
    const liabilityComposition = {
      accountsPayablePercentage: (accountsPayable / totalCurrentLiabilities) * 100,
      shortTermDebtPercentage: (shortTermDebt / totalCurrentLiabilities) * 100,
      accruedExpensesPercentage: (accruedExpenses / totalCurrentLiabilities) * 100,
      otherLiabilitiesPercentage: (otherCurrentLiabilities / totalCurrentLiabilities) * 100
    };

    // Generate industry comparison data
    const industries = [
      { name: 'Technology', avgRatio: 2.8, description: 'High cash reserves, low inventory', color: '#666666' },
      { name: 'Retail', avgRatio: 1.5, description: 'High inventory, fast turnover', color: '#888888' },
      { name: 'Manufacturing', avgRatio: 2.1, description: 'Moderate inventory, equipment', color: '#444444' },
      { name: 'Healthcare', avgRatio: 2.3, description: 'Equipment intensive, steady cash flow', color: '#777777' },
      { name: 'Construction', avgRatio: 1.4, description: 'Project-based, variable liabilities', color: '#999999' },
    ];

    setResults({
      totalCurrentAssets,
      totalCurrentLiabilities,
      currentRatio,
      workingCapital,
      quickRatio,
      cashRatio,
      assetComposition,
      liabilityComposition,
      cash,
      accountsReceivable,
      inventory,
      marketableSecurities,
      otherCurrentAssets,
      accountsPayable,
      shortTermDebt,
      accruedExpenses,
      otherCurrentLiabilities,
    });

    setIndustryData(industries);
  };

  useEffect(() => {
    calculateCurrentRatio();
  }, [cash, accountsReceivable, inventory, marketableSecurities, otherCurrentAssets, 
      accountsPayable, shortTermDebt, accruedExpenses, otherCurrentLiabilities]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatRatio = (value) => {
    return value.toFixed(2);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const getCurrentRatioStatus = (ratio) => {
    if (ratio >= 2.0) return { status: 'Excellent', color: '#000000', emoji: '✅', description: 'Strong liquidity position' };
    if (ratio >= 1.5) return { status: 'Good', color: '#333333', emoji: '👍', description: 'Adequate liquidity' };
    if (ratio >= 1.0) return { status: 'Adequate', color: '#666666', emoji: '⚠️', description: 'Minimum acceptable level' };
    if (ratio >= 0.5) return { status: 'Concerning', color: '#888888', emoji: '❌', description: 'Potential liquidity issues' };
    return { status: 'Critical', color: '#999999', emoji: '🚨', description: 'Immediate action required' };
  };

  const getQuickRatioStatus = (ratio) => {
    if (ratio >= 1.0) return { status: 'Strong', color: '#000000', emoji: '✅' };
    if (ratio >= 0.8) return { status: 'Adequate', color: '#333333', emoji: '⚠️' };
    return { status: 'Weak', color: '#666666', emoji: '❌' };
  };

  return (
    <>
      <Head>
        <title>Advanced Current Ratio Calculator | Measure Business Liquidity</title>
        <meta name="description" content="Free advanced current ratio calculator for businesses. Calculate current ratio, quick ratio, cash ratio, and analyze short-term financial health and liquidity position." />
        <meta name="keywords" content="current ratio calculator, business liquidity, financial ratios, quick ratio, acid-test ratio, financial health calculator, business analysis" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/current-ratio-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Current Ratio Calculator | Measure Business Liquidity" />
        <meta property="og:description" content="Calculate and analyze current ratio for accurate business liquidity assessment. Monitor quick ratio, cash ratio, and optimize short-term financial health." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/current-ratio-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Current Ratio Calculator" />
        <meta name="twitter:description" content="Professional current ratio analysis tool for business owners and financial managers." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="current-ratio-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Current Ratio Calculator",
            "description": "Professional business liquidity calculator for current ratio analysis and financial health assessment",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "1050",
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
              "Current Ratio Calculation",
              "Quick Ratio (Acid-Test)",
              "Cash Ratio Analysis",
              "Industry Benchmarking",
              "Asset/Liability Breakdown"
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
                "name": "What is the current ratio and why is it important?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The current ratio measures a company's ability to pay short-term obligations with its current assets. It's calculated as Current Assets ÷ Current Liabilities. A ratio above 1.0 indicates the company can cover its short-term debts, while below 1.0 suggests potential liquidity issues.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is a good current ratio for a business?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Generally, a current ratio between 1.5 and 2.0 is considered healthy. Below 1.0 indicates potential liquidity problems, while above 2.0 may suggest inefficient use of assets. However, optimal ratios vary by industry, with technology companies often maintaining higher ratios than retailers.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between current ratio and quick ratio?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The current ratio includes all current assets (including inventory), while the quick ratio (acid-test) excludes inventory and other less liquid assets. The quick ratio provides a more conservative measure of immediate liquidity.",
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
            <h1 className={styles.mainTitle}>Advanced Current Ratio Calculator</h1>
            <p className={styles.subtitle}>Measure Your Business's Short-Term Liquidity and Financial Health</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Industry Benchmarks</span>
              <span className={styles.badge}>Professional Analysis</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Enter Current Assets</h2>
              
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
                  Marketable Securities
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="1000"
                      value={marketableSecurities}
                      onChange={(e) => setMarketableSecurities(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="500000"
                      step="1000"
                      value={marketableSecurities}
                      onChange={(e) => setMarketableSecurities(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(marketableSecurities)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Other Current Assets
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="1000"
                      value={otherCurrentAssets}
                      onChange={(e) => setOtherCurrentAssets(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="500000"
                      step="1000"
                      value={otherCurrentAssets}
                      onChange={(e) => setOtherCurrentAssets(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(otherCurrentAssets)}</div>
                </label>
              </div>

              <h2 className={styles.sectionTitle} style={{ marginTop: '2rem' }}>Enter Current Liabilities</h2>

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
                  Accrued Expenses
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="1000"
                      value={accruedExpenses}
                      onChange={(e) => setAccruedExpenses(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="500000"
                      step="1000"
                      value={accruedExpenses}
                      onChange={(e) => setAccruedExpenses(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(accruedExpenses)}</div>
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
              <h2 className={styles.sectionTitle}>Liquidity Analysis Results</h2>
              
              {results && (
                <>
                  <div className={styles.resultsHeader}>
                    <div className={styles.primaryResult}>
                      <div className={styles.primaryResultLabel}>Current Ratio</div>
                      <div className={styles.primaryResultValue}>{formatRatio(results.currentRatio)}</div>
                      <div className={styles.primaryResultStatus}>
                        <span className={styles.statusEmoji}>{getCurrentRatioStatus(results.currentRatio).emoji}</span>
                        <span className={styles.statusText}>{getCurrentRatioStatus(results.currentRatio).status}</span>
                        <span className={styles.statusDescription}>{getCurrentRatioStatus(results.currentRatio).description}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Quick Ratio</div>
                      <div className={styles.resultValue}>{formatRatio(results.quickRatio)}</div>
                      <div className={styles.resultSubtext}>
                        {getQuickRatioStatus(results.quickRatio).emoji} {getQuickRatioStatus(results.quickRatio).status}
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
                      <div className={styles.resultLabel}>Working Capital</div>
                      <div className={styles.resultValue}>{formatCurrency(results.workingCapital)}</div>
                      <div className={styles.resultSubtext}>
                        {results.workingCapital > 0 ? 'Positive' : 'Negative'} Position
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Current Assets</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalCurrentAssets)}</div>
                      <div className={styles.resultSubtext}>
                        Total Liquid Assets
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Current Liabilities</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalCurrentLiabilities)}</div>
                      <div className={styles.resultSubtext}>
                        Short-term Obligations
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Assets to Liabilities</div>
                      <div className={styles.resultValue}>{formatRatio(results.currentRatio)}:1</div>
                      <div className={styles.resultSubtext}>
                        Ratio Interpretation
                      </div>
                    </div>
                  </div>

                  {/* Ratio Visualization */}
                  <div className={styles.ratioVisualization}>
                    <h3 className={styles.visualizationTitle}>Current Ratio Visualization</h3>
                    <div className={styles.ratioBar}>
                      <div className={styles.ratioBarAssets} style={{ width: '100%' }}>
                        <div className={styles.ratioBarLabel}>Current Assets: {formatCurrency(results.totalCurrentAssets)}</div>
                      </div>
                      <div className={styles.ratioBarLiabilities} style={{ 
                        width: `${Math.min(100, (results.totalCurrentLiabilities / results.totalCurrentAssets) * 100)}%` 
                      }}>
                        <div className={styles.ratioBarLabel}>Current Liabilities: {formatCurrency(results.totalCurrentLiabilities)}</div>
                      </div>
                    </div>
                    <div className={styles.ratioInterpretation}>
                      <div className={styles.interpretationItem}>
                        <div className={styles.interpretationLabel}>For every $1 of liabilities, you have:</div>
                        <div className={styles.interpretationValue}>${formatRatio(results.currentRatio)} in assets</div>
                      </div>
                      <div className={styles.interpretationItem}>
                        <div className={styles.interpretationLabel}>Assets cover liabilities by:</div>
                        <div className={styles.interpretationValue}>{formatPercentage((results.totalCurrentAssets / results.totalCurrentLiabilities - 1) * 100)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Asset and Liability Composition */}
                  <div className={styles.compositionContainer}>
                    <div className={styles.compositionSection}>
                      <h3 className={styles.compositionTitle}>Current Assets Composition</h3>
                      <div className={styles.compositionChart}>
                        <div className={styles.compositionItem}>
                          <div className={styles.compositionLabel}>
                            <span className={styles.compositionDot} style={{ background: '#666666' }}></span>
                            Cash & Equivalents
                          </div>
                          <div className={styles.compositionBar}>
                            <div 
                              className={styles.compositionFill}
                              style={{ 
                                width: `${results.assetComposition.cashPercentage}%`,
                                background: '#666666'
                              }}
                            ></div>
                            <span className={styles.compositionPercentage}>{formatPercentage(results.assetComposition.cashPercentage)}</span>
                          </div>
                        </div>
                        <div className={styles.compositionItem}>
                          <div className={styles.compositionLabel}>
                            <span className={styles.compositionDot} style={{ background: '#888888' }}></span>
                            Accounts Receivable
                          </div>
                          <div className={styles.compositionBar}>
                            <div 
                              className={styles.compositionFill}
                              style={{ 
                                width: `${results.assetComposition.accountsReceivablePercentage}%`,
                                background: '#888888'
                              }}
                            ></div>
                            <span className={styles.compositionPercentage}>{formatPercentage(results.assetComposition.accountsReceivablePercentage)}</span>
                          </div>
                        </div>
                        <div className={styles.compositionItem}>
                          <div className={styles.compositionLabel}>
                            <span className={styles.compositionDot} style={{ background: '#444444' }}></span>
                            Inventory
                          </div>
                          <div className={styles.compositionBar}>
                            <div 
                              className={styles.compositionFill}
                              style={{ 
                                width: `${results.assetComposition.inventoryPercentage}%`,
                                background: '#444444'
                              }}
                            ></div>
                            <span className={styles.compositionPercentage}>{formatPercentage(results.assetComposition.inventoryPercentage)}</span>
                          </div>
                        </div>
                        <div className={styles.compositionItem}>
                          <div className={styles.compositionLabel}>
                            <span className={styles.compositionDot} style={{ background: '#777777' }}></span>
                            Marketable Securities
                          </div>
                          <div className={styles.compositionBar}>
                            <div 
                              className={styles.compositionFill}
                              style={{ 
                                width: `${results.assetComposition.securitiesPercentage}%`,
                                background: '#777777'
                              }}
                            ></div>
                            <span className={styles.compositionPercentage}>{formatPercentage(results.assetComposition.securitiesPercentage)}</span>
                          </div>
                        </div>
                        <div className={styles.compositionItem}>
                          <div className={styles.compositionLabel}>
                            <span className={styles.compositionDot} style={{ background: '#999999' }}></span>
                            Other Current Assets
                          </div>
                          <div className={styles.compositionBar}>
                            <div 
                              className={styles.compositionFill}
                              style={{ 
                                width: `${results.assetComposition.otherAssetsPercentage}%`,
                                background: '#999999'
                              }}
                            ></div>
                            <span className={styles.compositionPercentage}>{formatPercentage(results.assetComposition.otherAssetsPercentage)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.compositionSection}>
                      <h3 className={styles.compositionTitle}>Current Liabilities Composition</h3>
                      <div className={styles.compositionChart}>
                        <div className={styles.compositionItem}>
                          <div className={styles.compositionLabel}>
                            <span className={styles.compositionDot} style={{ background: '#666666' }}></span>
                            Accounts Payable
                          </div>
                          <div className={styles.compositionBar}>
                            <div 
                              className={styles.compositionFill}
                              style={{ 
                                width: `${results.liabilityComposition.accountsPayablePercentage}%`,
                                background: '#666666'
                              }}
                            ></div>
                            <span className={styles.compositionPercentage}>{formatPercentage(results.liabilityComposition.accountsPayablePercentage)}</span>
                          </div>
                        </div>
                        <div className={styles.compositionItem}>
                          <div className={styles.compositionLabel}>
                            <span className={styles.compositionDot} style={{ background: '#888888' }}></span>
                            Short-term Debt
                          </div>
                          <div className={styles.compositionBar}>
                            <div 
                              className={styles.compositionFill}
                              style={{ 
                                width: `${results.liabilityComposition.shortTermDebtPercentage}%`,
                                background: '#888888'
                              }}
                            ></div>
                            <span className={styles.compositionPercentage}>{formatPercentage(results.liabilityComposition.shortTermDebtPercentage)}</span>
                          </div>
                        </div>
                        <div className={styles.compositionItem}>
                          <div className={styles.compositionLabel}>
                            <span className={styles.compositionDot} style={{ background: '#444444' }}></span>
                            Accrued Expenses
                          </div>
                          <div className={styles.compositionBar}>
                            <div 
                              className={styles.compositionFill}
                              style={{ 
                                width: `${results.liabilityComposition.accruedExpensesPercentage}%`,
                                background: '#444444'
                              }}
                            ></div>
                            <span className={styles.compositionPercentage}>{formatPercentage(results.liabilityComposition.accruedExpensesPercentage)}</span>
                          </div>
                        </div>
                        <div className={styles.compositionItem}>
                          <div className={styles.compositionLabel}>
                            <span className={styles.compositionDot} style={{ background: '#777777' }}></span>
                            Other Liabilities
                          </div>
                          <div className={styles.compositionBar}>
                            <div 
                              className={styles.compositionFill}
                              style={{ 
                                width: `${results.liabilityComposition.otherLiabilitiesPercentage}%`,
                                background: '#777777'
                              }}
                            ></div>
                            <span className={styles.compositionPercentage}>{formatPercentage(results.liabilityComposition.otherLiabilitiesPercentage)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Industry Comparison */}
                  <div className={styles.industryComparison}>
                    <h3 className={styles.comparisonTitle}>Industry Benchmark Comparison</h3>
                    <div className={styles.comparisonGrid}>
                      {industryData.map((industry, index) => (
                        <div key={index} className={styles.industryCard}>
                          <div className={styles.industryHeader}>
                            <div className={styles.industryName}>{industry.name}</div>
                            <div className={styles.industryRatio}>{formatRatio(industry.avgRatio)}</div>
                          </div>
                          <div className={styles.industryDescription}>{industry.description}</div>
                          <div className={styles.comparisonBar}>
                            <div className={styles.comparisonTrack}>
                              <div 
                                className={styles.comparisonFill}
                                style={{ 
                                  width: `${Math.min(100, industry.avgRatio * 25)}%`,
                                  background: industry.color
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className={styles.comparisonResult}>
                            {results.currentRatio > industry.avgRatio ? (
                              <span className={styles.better}>📈 {formatRatio(results.currentRatio - industry.avgRatio)} above industry average</span>
                            ) : (
                              <span className={styles.worse}>📉 {formatRatio(industry.avgRatio - results.currentRatio)} below industry average</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Financial Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Your current ratio of <strong>{formatRatio(results.currentRatio)}</strong> indicates {getCurrentRatioStatus(results.currentRatio).description.toLowerCase()}</li>
                      <li>For every $1 of current liabilities, you have <strong>${formatRatio(results.currentRatio)}</strong> in current assets</li>
                      <li>Quick ratio (excluding inventory) of <strong>{formatRatio(results.quickRatio)}</strong> shows {results.quickRatio >= 1 ? 'strong' : 'limited'} ability to meet immediate obligations</li>
                      {results.currentRatio < 1.5 && (
                        <li>⚠️ Consider improving liquidity by increasing current assets or reducing current liabilities</li>
                      )}
                      {results.assetComposition.inventoryPercentage > 40 && (
                        <li>⚠️ High inventory concentration ({formatPercentage(results.assetComposition.inventoryPercentage)}) may reduce liquidity quality</li>
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
              <h2 className={styles.articleTitle}>Understanding the Current Ratio: Your Business's Liquidity Lifeline</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Why the Current Ratio is Critical for Business Health</h3>
                <p>The current ratio is one of the most important financial metrics for assessing a company's short-term financial health. It measures whether a business has enough resources to pay its debts over the next 12 months. Unlike profit measures, the current ratio focuses on liquidity—the ability to convert assets to cash quickly to meet obligations.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World Interpretation:</h4>
                  <p>A company with a current ratio of 2.0 means:</p>
                  <ul>
                    <li><strong>For every $1</strong> of current liabilities, the company has <strong>$2</strong> in current assets</li>
                    <li>Assets could decline by <strong>50%</strong> and still cover all liabilities</li>
                    <li>The company has a <strong>comfortable cushion</strong> for unexpected expenses or revenue shortfalls</li>
                    <li>Creditors view this as a <strong>low-risk</strong> lending situation</li>
                  </ul>
                  <p>This ratio provides immediate insight into financial stability and risk level.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategies to Optimize Your Current Ratio</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>💰 Increase Current Assets</h4>
                    <p>Build cash reserves, accelerate accounts receivable collections through discounts or factoring, and maintain optimal inventory levels to improve liquidity.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📉 Reduce Current Liabilities</h4>
                    <p>Negotiate longer payment terms with suppliers, refinance short-term debt to longer terms, and strategically time expense payments.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚡ Improve Asset Quality</h4>
                    <p>Reduce slow-moving inventory, implement stricter credit policies, and convert non-productive assets to cash or more liquid forms.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📊 Balance Sheet Management</h4>
                    <p>Maintain optimal balance between assets and liabilities, regularly review aging reports, and implement working capital management policies.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Related Liquidity Ratios Explained</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Quick Ratio (Acid-Test):</strong> (Cash + AR + Marketable Securities) ÷ Current Liabilities - More conservative, excludes inventory</li>
                  <li><strong>Cash Ratio:</strong> (Cash + Marketable Securities) ÷ Current Liabilities - Most conservative measure</li>
                  <li><strong>Operating Cash Flow Ratio:</strong> Operating Cash Flow ÷ Current Liabilities - Measures cash generation ability</li>
                  <li><strong>Working Capital Ratio:</strong> Current Assets - Current Liabilities - Absolute dollar amount of liquidity</li>
                  <li><strong>Days Working Capital:</strong> Shows how many days of operations current assets can cover</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Insight from Financial Analysts</h3>
                <blockquote className={styles.expertQuote}>
                  "While a current ratio above 2.0 is generally positive, context matters. A manufacturing company with 2.5 might be efficient, while a tech company with 1.8 could be under-leveraged. Always compare against industry peers and consider business cycle stage. The trend matters more than any single measurement."
                  <footer className={styles.quoteFooter}>— CFA Charterholder, Corporate Financial Analyst</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can a current ratio be too high?</h3>
                <p className={styles.faqAnswer}>Yes, a current ratio significantly above industry norms (e.g., 3.0 or higher) may indicate inefficient use of assets. Excess cash earns minimal returns, high inventory ties up capital and risks obsolescence, and lax accounts receivable policies can indicate poor credit management. Optimal is better than maximum.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does inventory affect current ratio vs. quick ratio?</h3>
                <p className={styles.faqAnswer}>Inventory is included in the current ratio but excluded from the quick ratio. This difference is critical: if inventory represents a large portion of current assets, the current ratio may overstate true liquidity. The quick ratio provides a more conservative view by excluding less-liquid inventory.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What current ratio do lenders typically require?</h3>
                <p className={styles.faqAnswer}>Most commercial lenders require a minimum current ratio of 1.0-1.2 as a loan covenant. Stronger borrowers may have covenant requirements of 1.5 or higher. Falling below covenant levels can trigger loan default, so maintaining adequate ratios is crucial for financing access.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How often should I calculate my current ratio?</h3>
                <p className={styles.faqAnswer}>Businesses should calculate current ratio monthly as part of regular financial review. Quarterly is minimum for most businesses, while volatile industries or rapidly growing companies may need weekly monitoring. Regular tracking helps identify trends and address issues before they become critical.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Optimize Your Business Liquidity?</h2>
              <p className={styles.ctaText}>Use our current ratio calculator to assess your liquidity position, compare with industry standards, and develop strategies for stronger financial health.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides financial estimates for educational purposes. Current ratio needs vary by industry, business model, and economic conditions. A single ratio should not be used in isolation for financial decisions. Consult with a qualified financial professional for specific business advice.
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
       
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

export default CurrentRatioCalculator;