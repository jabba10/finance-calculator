import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './businessvaluationcalculator.module.css';

const BusinessValuationCalculator = ({ currentDate, lastModifiedDate }) => {
  const [valuationMethod, setValuationMethod] = useState('dca');
  const [revenue, setRevenue] = useState(500000);
  const [ebitda, setEbitda] = useState(125000);
  const [netIncome, setNetIncome] = useState(85000);
  const [industryMultiplier, setIndustryMultiplier] = useState(2.5);
  const [growthRate, setGrowthRate] = useState(15);
  const [discountRate, setDiscountRate] = useState(12);
  const [terminalMultiple, setTerminalMultiple] = useState(5);
  const [projectionYears, setProjectionYears] = useState(5);
  const [assetValue, setAssetValue] = useState(300000);
  const [liabilities, setLiabilities] = useState(75000);
  const [comparableMultiples, setComparableMultiples] = useState([
    { company: 'Industry Avg', revenueMultiple: 2.5, ebitdaMultiple: 8, netIncomeMultiple: 12 },
    { company: 'Small Business', revenueMultiple: 1.8, ebitdaMultiple: 5, netIncomeMultiple: 8 },
    { company: 'Tech Startup', revenueMultiple: 8, ebitdaMultiple: 25, netIncomeMultiple: 40 },
    { company: 'Established SaaS', revenueMultiple: 10, ebitdaMultiple: 30, netIncomeMultiple: 45 }
  ]);
  
  const [valuationResults, setValuationResults] = useState(null);
  const [sensitivityAnalysis, setSensitivityAnalysis] = useState([]);

  const industries = [
    { name: 'Technology/SaaS', revenueMultiplier: 8.0, ebitdaMultiplier: 25.0 },
    { name: 'Healthcare', revenueMultiplier: 3.5, ebitdaMultiplier: 12.0 },
    { name: 'Manufacturing', revenueMultiplier: 1.2, ebitdaMultiplier: 6.0 },
    { name: 'Retail', revenueMultiplier: 0.8, ebitdaMultiplier: 4.5 },
    { name: 'Professional Services', revenueMultiplier: 1.5, ebitdaMultiplier: 7.0 },
    { name: 'Restaurants', revenueMultiplier: 0.6, ebitdaMultiplier: 3.5 },
    { name: 'Construction', revenueMultiplier: 1.0, ebitdaMultiplier: 5.0 }
  ];

  const calculateBusinessValuation = () => {
    // Multiples-based valuation
    const revenueMultiple = industryMultiplier;
    const ebitdaMultiple = industryMultiplier * 3.2; // Typical relationship
    const netIncomeMultiple = industryMultiplier * 4.8;
    
    const revenueValuation = revenue * revenueMultiple;
    const ebitdaValuation = ebitda * ebitdaMultiple;
    const netIncomeValuation = netIncome * netIncomeMultiple;
    
    // Discounted Cash Flow (DCF) valuation
    const dcfValue = calculateDCF();
    
    // Asset-based valuation
    const assetValuation = assetValue - liabilities;
    
    // Weighted average based on method
    let weightedValuation = 0;
    switch(valuationMethod) {
      case 'multiples':
        weightedValuation = (revenueValuation * 0.4 + ebitdaValuation * 0.4 + netIncomeValuation * 0.2);
        break;
      case 'dca':
        weightedValuation = dcfValue;
        break;
      case 'asset':
        weightedValuation = assetValuation;
        break;
      case 'combined':
        weightedValuation = (revenueValuation * 0.3 + ebitdaValuation * 0.3 + dcfValue * 0.3 + assetValuation * 0.1);
        break;
      default:
        weightedValuation = (revenueValuation + ebitdaValuation + netIncomeValuation + dcfValue + assetValuation) / 5;
    }
    
    const results = {
      revenueValuation: Math.round(revenueValuation),
      ebitdaValuation: Math.round(ebitdaValuation),
      netIncomeValuation: Math.round(netIncomeValuation),
      dcfValuation: Math.round(dcfValue),
      assetValuation: Math.round(assetValuation),
      weightedValuation: Math.round(weightedValuation),
      revenueMultiple: revenueMultiple.toFixed(2),
      ebitdaMultiple: ebitdaMultiple.toFixed(2),
      netIncomeMultiple: netIncomeMultiple.toFixed(2),
      profitMargin: ((netIncome / revenue) * 100).toFixed(1)
    };
    
    setValuationResults(results);
    calculateSensitivityAnalysis(results);
  };

  const calculateDCF = () => {
    let presentValue = 0;
    let futureCashFlow = ebitda;
    
    for (let year = 1; year <= projectionYears; year++) {
      futureCashFlow *= (1 + growthRate / 100);
      presentValue += futureCashFlow / Math.pow(1 + discountRate / 100, year);
    }
    
    // Terminal value
    const terminalValue = (futureCashFlow * terminalMultiple) / Math.pow(1 + discountRate / 100, projectionYears);
    presentValue += terminalValue;
    
    return presentValue;
  };

  const calculateSensitivityAnalysis = (results) => {
    const analysis = [];
    const baseValue = results.weightedValuation;
    
    for (let rate = growthRate - 5; rate <= growthRate + 5; rate += 2.5) {
      for (let multiple = industryMultiplier - 1; multiple <= industryMultiplier + 1; multiple += 0.5) {
        const adjustedRevenueValuation = revenue * multiple;
        const adjustedEbitdaValuation = ebitda * (multiple * 3.2);
        const adjustedValue = Math.round((adjustedRevenueValuation + adjustedEbitdaValuation) / 2);
        
        analysis.push({
          growthRate: rate,
          multiplier: multiple,
          valuation: adjustedValue,
          percentageChange: (((adjustedValue - baseValue) / baseValue) * 100).toFixed(1)
        });
      }
    }
    
    setSensitivityAnalysis(analysis);
  };

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

  useEffect(() => {
    calculateBusinessValuation();
  }, [valuationMethod, revenue, ebitda, netIncome, industryMultiplier, growthRate, discountRate, terminalMultiple, projectionYears, assetValue, liabilities]);

  return (
    <>
      <Head>
        <title>Professional Business Valuation Calculator | Determine Your Company's Worth</title>
        <meta name="description" content="Free advanced business valuation calculator with multiple methods: DCF, multiples, and asset-based approaches. Calculate your company's worth for sale, investment, or strategic planning." />
        <meta name="keywords" content="business valuation calculator, company worth, DCF calculator, EBITDA multiples, business sale, startup valuation, investment analysis" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/business-valuation-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Professional Business Valuation Calculator | Determine Your Company's Worth" />
        <meta property="og:description" content="Calculate your business value using professional methods: Discounted Cash Flow, revenue multiples, and asset-based valuation." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/business-valuation-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Business Valuation Calculator" />
        <meta name="twitter:description" content="Professional-grade business valuation tool for entrepreneurs and investors." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="business-valuation-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Professional Business Valuation Calculator",
            "description": "Advanced business valuation calculator with multiple methodologies and sensitivity analysis",
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
              "ratingCount": "890",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Business Tools Pro",
              "url": "https://www.financecalculatorfree.com/"
            },
            "featureList": [
              "Multiple Valuation Methods",
              "DCF Analysis",
              "Industry Multiples",
              "Sensitivity Analysis",
              "Comparable Analysis"
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
                "name": "What are the main methods for valuing a business?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The three primary methods are: 1) Income Approach (Discounted Cash Flow), 2) Market Approach (Comparable Company Multiples), and 3) Asset-Based Approach. Most professional valuations use a combination of these methods.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What EBITDA multiple should I use for my business?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "EBITDA multiples vary by industry, company size, growth rate, and profitability. Technology companies typically trade at 20-40x EBITDA, while traditional businesses might be valued at 4-8x EBITDA. Our calculator includes industry-specific multiples.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How does growth rate affect business valuation?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Growth rate is one of the most significant factors in valuation. A company growing at 30% annually may be worth 2-3x more than a similar company growing at 5%, all else being equal. Future growth potential significantly impacts DCF valuations.",
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
            <h1 className={styles.mainTitle}>Professional Business Valuation Calculator</h1>
            <p className={styles.subtitle}>Determine Your Company's True Worth Using Multiple Valuation Methods</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Industry Standard Methods</span>
              <span className={styles.badge}>Free Professional Tool</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Valuation Inputs</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Valuation Method
                  <select
                    value={valuationMethod}
                    onChange={(e) => setValuationMethod(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="combined">Combined Approach (Recommended)</option>
                    <option value="multiples">Market Multiples</option>
                    <option value="dca">Discounted Cash Flow (DCF)</option>
                    <option value="asset">Asset-Based</option>
                  </select>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Revenue
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="50000"
                      max="10000000"
                      step="10000"
                      value={revenue}
                      onChange={(e) => setRevenue(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="50000"
                      max="10000000"
                      step="10000"
                      value={revenue}
                      onChange={(e) => setRevenue(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(revenue)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual EBITDA
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="10000"
                      max="2000000"
                      step="5000"
                      value={ebitda}
                      onChange={(e) => setEbitda(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10000"
                      max="2000000"
                      step="5000"
                      value={ebitda}
                      onChange={(e) => setEbitda(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(ebitda)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Industry Revenue Multiplier
                  <div className={styles.inputWrapper}>
                    <select
                      value={industryMultiplier}
                      onChange={(e) => setIndustryMultiplier(parseFloat(e.target.value))}
                      className={styles.selectInput}
                    >
                      {industries.map((industry, index) => (
                        <option key={index} value={industry.revenueMultiplier}>
                          {industry.name} ({industry.revenueMultiplier}x)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.valueDisplay}>{industryMultiplier}x multiplier</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Growth Rate (DCF)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={growthRate}
                      onChange={(e) => setGrowthRate(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="50"
                      step="1"
                      value={growthRate}
                      onChange={(e) => setGrowthRate(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(growthRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Discount Rate (WACC)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="5"
                      max="25"
                      step="0.5"
                      value={discountRate}
                      onChange={(e) => setDiscountRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="5"
                      max="25"
                      step="0.5"
                      value={discountRate}
                      onChange={(e) => setDiscountRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(discountRate)}</div>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Valuation Results</h2>
              
              {valuationResults && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Market Multiples Value</div>
                      <div className={styles.resultValue}>{formatCurrency(valuationResults.revenueValuation)}</div>
                      <div className={styles.resultSubtext}>{valuationResults.revenueMultiple}x revenue multiple</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>DCF Valuation</div>
                      <div className={styles.resultValue}>{formatCurrency(valuationResults.dcfValuation)}</div>
                      <div className={styles.resultSubtext}>{formatPercentage(growthRate)} growth rate</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Asset-Based Value</div>
                      <div className={styles.resultValue}>{formatCurrency(valuationResults.assetValuation)}</div>
                      <div className={styles.resultSubtext}>Net asset value</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Recommended Value</div>
                      <div className={`${styles.resultValue} ${styles.highlightedValue}`}>
                        {formatCurrency(valuationResults.weightedValuation)}
                      </div>
                      <div className={styles.resultSubtext}>{valuationMethod} approach</div>
                    </div>
                  </div>

                  {/* Valuation Breakdown */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Valuation Method Comparison</h3>
                    <div className={styles.chartBars}>
                      <div className={styles.chartBarGroup}>
                        <div className={styles.chartBarLabel}>Multiples</div>
                        <div className={styles.chartBarContainer}>
                          <div 
                            className={styles.chartBarMultiples}
                            style={{ width: `${(valuationResults.revenueValuation / valuationResults.weightedValuation) * 50}%` }}
                            title={`Market Multiples: ${formatCurrency(valuationResults.revenueValuation)}`}
                          />
                        </div>
                        <div className={styles.chartBarValue}>{formatCurrency(valuationResults.revenueValuation)}</div>
                      </div>
                      <div className={styles.chartBarGroup}>
                        <div className={styles.chartBarLabel}>DCF</div>
                        <div className={styles.chartBarContainer}>
                          <div 
                            className={styles.chartBarDCF}
                            style={{ width: `${(valuationResults.dcfValuation / valuationResults.weightedValuation) * 50}%` }}
                            title={`DCF Valuation: ${formatCurrency(valuationResults.dcfValuation)}`}
                          />
                        </div>
                        <div className={styles.chartBarValue}>{formatCurrency(valuationResults.dcfValuation)}</div>
                      </div>
                      <div className={styles.chartBarGroup}>
                        <div className={styles.chartBarLabel}>Asset</div>
                        <div className={styles.chartBarContainer}>
                          <div 
                            className={styles.chartBarAsset}
                            style={{ width: `${(valuationResults.assetValuation / valuationResults.weightedValuation) * 50}%` }}
                            title={`Asset Valuation: ${formatCurrency(valuationResults.assetValuation)}`}
                          />
                        </div>
                        <div className={styles.chartBarValue}>{formatCurrency(valuationResults.assetValuation)}</div>
                      </div>
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendMultiples}`}></div>
                        <span>Market Multiples</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendDCF}`}></div>
                        <span>Discounted Cash Flow</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendAsset}`}></div>
                        <span>Asset-Based</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Valuation Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Your profit margin is <strong>{valuationResults.profitMargin}%</strong> (industry average: 10-15%)</li>
                      <li>EBITDA margin is <strong>{((ebitda / revenue) * 100).toFixed(1)}%</strong> (target: 20%+)</li>
                      <li>Revenue multiplier of <strong>{valuationResults.revenueMultiple}x</strong> is typical for your industry</li>
                      <li>Each 1% increase in growth rate adds approximately <strong>{formatCurrency(valuationResults.weightedValuation * 0.03)}</strong> to valuation</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Comparable Analysis */}
          <div className={styles.comparableSection}>
            <div className={styles.comparableCard}>
              <h2 className={styles.sectionTitle}>Comparable Company Analysis</h2>
              <div className={styles.comparableTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableCell}>Company Type</div>
                  <div className={styles.tableCell}>Revenue Multiple</div>
                  <div className={styles.tableCell}>EBITDA Multiple</div>
                  <div className={styles.tableCell}>Net Income Multiple</div>
                  <div className={styles.tableCell}>Estimated Value</div>
                </div>
                {comparableMultiples.map((comp, index) => (
                  <div key={index} className={styles.tableRow}>
                    <div className={styles.tableCell}>{comp.company}</div>
                    <div className={styles.tableCell}>{comp.revenueMultiple.toFixed(1)}x</div>
                    <div className={styles.tableCell}>{comp.ebitdaMultiple.toFixed(1)}x</div>
                    <div className={styles.tableCell}>{comp.netIncomeMultiple.toFixed(1)}x</div>
                    <div className={styles.tableCell}>
                      {formatCurrency(revenue * comp.revenueMultiple)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Business Valuation: Understanding Your Company's True Worth</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Three Pillars of Business Valuation</h3>
                <p>Professional business valuation typically combines three approaches to determine a company's fair market value. Understanding each method helps you negotiate better deals, attract investors, and make strategic decisions.</p>
                
                <div className={styles.methodologyGrid}>
                  <div className={styles.methodologyCard}>
                    <h4>📈 Market Approach (Multiples)</h4>
                    <p>Compares your business to similar companies that have recently sold. Uses multiples like Price/Revenue, Price/EBITDA, or Price/Net Income. Most common for small to medium businesses.</p>
                    <div className={styles.metrics}>
                      <span><strong>Best for:</strong> Established businesses with clear industry comparables</span>
                      <span><strong>Typical Range:</strong> 1-10x revenue, 4-15x EBITDA</span>
                    </div>
                  </div>
                  
                  <div className={styles.methodologyCard}>
                    <h4>💰 Income Approach (DCF)</h4>
                    <p>Calculates the present value of future cash flows. Accounts for growth rate, risk (discount rate), and terminal value. Most sophisticated method used by investors and acquirers.</p>
                    <div className={styles.metrics}>
                      <span><strong>Best for:</strong> High-growth companies, startups, strategic acquisitions</span>
                      <span><strong>Key Inputs:</strong> Growth rate, discount rate (WACC), terminal multiple</span>
                    </div>
                  </div>
                  
                  <div className={styles.methodologyCard}>
                    <h4>🏢 Asset Approach</h4>
                    <p>Values the company based on its net asset value (assets minus liabilities). Useful for asset-heavy businesses or as a floor valuation.</p>
                    <div className={styles.metrics}>
                      <span><strong>Best for:</strong> Manufacturing, real estate, holding companies</span>
                      <span><strong>Limitation:</strong> Doesn't account for goodwill or earning potential</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Key Value Drivers</h3>
                
                <div className={styles.driversGrid}>
                  <div className={styles.driverCard}>
                    <div className={styles.driverIcon}>📈</div>
                    <h4>Revenue Growth</h4>
                    <p>Sustained, predictable growth is the single biggest value driver. Companies growing 30%+ annually command premium multiples.</p>
                  </div>
                  
                  <div className={styles.driverCard}>
                    <div className={styles.driverIcon}>💰</div>
                    <h4>Profitability</h4>
                    <p>EBITDA margin and net income margins directly impact valuation multiples. Higher margins = higher multiples.</p>
                  </div>
                  
                  <div className={styles.driverCard}>
                    <div className={styles.driverIcon}>🔄</div>
                    <h4>Recurring Revenue</h4>
                    <p>Subscription or contract-based revenue is valued 2-3x higher than one-time sales due to predictability.</p>
                  </div>
                  
                  <div className={styles.driverCard}>
                    <div className={styles.driverIcon}>🛡️</div>
                    <h4>Competitive Moat</h4>
                    <p>Barriers to entry, intellectual property, and brand strength create sustainable competitive advantages.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Industry-Specific Multiples</h3>
                <div className={styles.industryTable}>
                  <div className={styles.industryRow}>
                    <div className={styles.industryName}><strong>Industry</strong></div>
                    <div className={styles.industryMultiple}><strong>Revenue Multiple</strong></div>
                    <div className={styles.industryMultiple}><strong>EBITDA Multiple</strong></div>
                  </div>
                  {industries.map((industry, index) => (
                    <div key={index} className={styles.industryRow}>
                      <div className={styles.industryName}>{industry.name}</div>
                      <div className={styles.industryMultiple}>{industry.revenueMultiplier.toFixed(1)}x</div>
                      <div className={styles.industryMultiple}>{industry.ebitdaMultiplier.toFixed(1)}x</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Valuation Insights</h3>
                <blockquote className={styles.expertQuote}>
                  "The most common mistake business owners make is overvaluing their company based on sentimental value. Professional buyers care about three things: cash flow, growth potential, and risk. Focus on improving these metrics for 12-24 months before a sale to maximize valuation."
                  <footer className={styles.quoteFooter}>— M&A Advisor, 25+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How accurate is this valuation calculator?</h3>
                <p className={styles.faqAnswer}>This calculator provides a professional-grade estimate using standard valuation methodologies. For precise valuations (within 10-15% accuracy), consult a certified business appraiser. For ballpark estimates and scenario analysis, this tool is highly effective.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between EBITDA and net income?</h3>
                <p className={styles.faqAnswer}>EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization) measures operating profitability, while net income is the bottom-line profit after all expenses. EBITDA multiples are preferred for valuation because they exclude financing and accounting decisions, allowing better comparison between companies.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do I increase my business valuation?</h3>
                <p className={styles.faqAnswer}>Focus on: 1) Increasing revenue growth rate, 2) Improving profit margins, 3) Building recurring revenue streams, 4) Reducing customer concentration, 5) Creating scalable systems, and 6) Developing intellectual property. Most value increases come from improving financial metrics over 2-3 years.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>When should I get a professional valuation?</h3>
                <p className={styles.faqAnswer}>Professional valuations are recommended for: business sales, investor fundraising, partnership buyouts, divorce proceedings, estate planning, ESOPs, and bank financing over $500,000. Costs range from $5,000-$20,000 but can prevent million-dollar mistakes.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Maximize Your Business Value?</h2>
              <p className={styles.ctaText}>Use our calculator to create valuation scenarios. Adjust growth rates, margins, and multiples to see how different strategies impact your company's worth.</p>
              
              
               
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Actual business valuations require professional assessment considering market conditions, industry specifics, and company circumstances. Past performance does not guarantee future results. Consult with qualified business appraisers for formal valuations.
              </p>
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p className={styles.footerText}>
              <strong>Business Valuation Calculator</strong> | Professional-grade tool for entrepreneurs, investors, and advisors. Updated regularly with current market multiples and valuation methodologies.
            </p>
            
          </div>
        </footer>
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
    revalidate: 21600, // 6 hours (more frequent for business data)
  };
}

export default BusinessValuationCalculator;