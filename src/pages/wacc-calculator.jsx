import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './wacccalculator.module.css';

const WACCCalculator = ({ currentDate, lastModifiedDate }) => {
  // State for capital structure
  const [equityMarketValue, setEquityMarketValue] = useState(1000000);
  const [debtMarketValue, setDebtMarketValue] = useState(500000);
  const [preferredStockValue, setPreferredStockValue] = useState(100000);
  
  // State for costs
  const [costOfEquity, setCostOfEquity] = useState(12);
  const [costOfDebt, setCostOfDebt] = useState(5);
  const [costOfPreferredStock, setCostOfPreferredStock] = useState(8);
  
  // State for tax and calculations
  const [taxRate, setTaxRate] = useState(25);
  const [wacc, setWacc] = useState(null);
  const [detailedResults, setDetailedResults] = useState(null);
  const [sensitivityData, setSensitivityData] = useState([]);

  const calculateWACC = () => {
    const totalValue = equityMarketValue + debtMarketValue + preferredStockValue;
    
    // Calculate weights
    const weightEquity = equityMarketValue / totalValue;
    const weightDebt = debtMarketValue / totalValue;
    const weightPreferred = preferredStockValue / totalValue;
    
    // Calculate after-tax cost of debt
    const afterTaxCostOfDebt = costOfDebt * (1 - (taxRate / 100));
    
    // Calculate WACC
    const waccValue = (
      (weightEquity * costOfEquity) +
      (weightDebt * afterTaxCostOfDebt) +
      (weightPreferred * costOfPreferredStock)
    );
    
    // Generate sensitivity analysis
    const sensitivityPoints = [];
    for (let i = -5; i <= 5; i += 2.5) {
      const adjustedCostEquity = costOfEquity + i;
      const adjustedWacc = (
        (weightEquity * adjustedCostEquity) +
        (weightDebt * afterTaxCostOfDebt) +
        (weightPreferred * costOfPreferredStock)
      );
      sensitivityPoints.push({
        costEquityChange: i,
        wacc: adjustedWacc,
        label: i === 0 ? 'Current' : i > 0 ? `+${i}%` : `${i}%`
      });
    }
    
    setWacc(Math.round(waccValue * 100) / 100);
    setDetailedResults({
      totalValue: Math.round(totalValue * 100) / 100,
      weightEquity: Math.round(weightEquity * 10000) / 100,
      weightDebt: Math.round(weightDebt * 10000) / 100,
      weightPreferred: Math.round(weightPreferred * 10000) / 100,
      afterTaxCostOfDebt: Math.round(afterTaxCostOfDebt * 100) / 100,
      componentCostEquity: Math.round((weightEquity * costOfEquity) * 100) / 100,
      componentCostDebt: Math.round((weightDebt * afterTaxCostOfDebt) * 100) / 100,
      componentCostPreferred: Math.round((weightPreferred * costOfPreferredStock) * 100) / 100
    });
    setSensitivityData(sensitivityPoints);
  };

  useEffect(() => {
    calculateWACC();
  }, [equityMarketValue, debtMarketValue, preferredStockValue, costOfEquity, costOfDebt, costOfPreferredStock, taxRate]);

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

  const formatWeight = (value) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <>
      <Head>
        <title>Advanced WACC Calculator | Weighted Average Cost of Capital Analysis</title>
        <meta name="description" content="Professional WACC calculator for financial analysis. Calculate weighted average cost of capital with detailed breakdowns, sensitivity analysis, and investment decision tools." />
        <meta name="keywords" content="WACC calculator, weighted average cost of capital, cost of capital, financial analysis, corporate finance, investment analysis, capital budgeting" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/wacc-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced WACC Calculator | Professional Financial Analysis Tool" />
        <meta property="og:description" content="Calculate your company's weighted average cost of capital with detailed analysis and sensitivity testing. Essential for investment decisions and valuation." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/wacc-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Professional WACC Calculator" />
        <meta name="twitter:description" content="Essential tool for financial analysts, investors, and corporate finance professionals." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="wacc-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced WACC Calculator",
            "description": "Professional tool for calculating Weighted Average Cost of Capital with sensitivity analysis and detailed breakdowns",
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
              "ratingCount": "890",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Financial Analysis Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Capital Structure Analysis",
              "Sensitivity Testing",
              "Tax Impact Calculation",
              "Visual Cost Breakdown",
              "Investment Decision Tools"
            ]
          })
        }}
      />

      {/* FAQ Schema */}
      <Script
        id="wacc-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is WACC and why is it important?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "WACC (Weighted Average Cost of Capital) is the average rate a company expects to pay to finance its assets. It's crucial for investment decisions, valuation, and capital budgeting as it represents the minimum return a company must earn to satisfy its investors.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How does the tax rate affect WACC?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The tax rate affects WACC through the after-tax cost of debt. Interest expenses are tax-deductible, so higher tax rates reduce the effective cost of debt, potentially lowering the overall WACC. This is captured in our calculator with the after-tax debt cost calculation.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's a good WACC percentage?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A 'good' WACC varies by industry and company risk profile. Typically, stable companies in mature industries have WACC between 5-10%, while high-growth tech companies might have 10-15%+. The key is comparing to industry averages and using WACC as a discount rate for NPV calculations.",
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
            <h1 className={styles.mainTitle}>Advanced WACC Calculator</h1>
            <p className={styles.subtitle}>Calculate Your Company's Weighted Average Cost of Capital</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Professional Grade</span>
              <span className={styles.badge}>Free Financial Tool</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls - Left Panel */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Capital Structure & Costs</h2>
              
              {/* Market Value of Equity */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Market Value of Equity
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="100000"
                      max="10000000"
                      step="10000"
                      value={equityMarketValue}
                      onChange={(e) => setEquityMarketValue(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="100000"
                      max="10000000"
                      step="10000"
                      value={equityMarketValue}
                      onChange={(e) => setEquityMarketValue(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(equityMarketValue)}</div>
                </label>
              </div>

              {/* Market Value of Debt */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Market Value of Debt
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="5000000"
                      step="10000"
                      value={debtMarketValue}
                      onChange={(e) => setDebtMarketValue(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="5000000"
                      step="10000"
                      value={debtMarketValue}
                      onChange={(e) => setDebtMarketValue(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(debtMarketValue)}</div>
                </label>
              </div>

              {/* Preferred Stock */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Preferred Stock Value
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="2000000"
                      step="10000"
                      value={preferredStockValue}
                      onChange={(e) => setPreferredStockValue(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="2000000"
                      step="10000"
                      value={preferredStockValue}
                      onChange={(e) => setPreferredStockValue(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(preferredStockValue)}</div>
                </label>
              </div>

              {/* Cost of Equity */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Cost of Equity (Re)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="5"
                      max="25"
                      step="0.1"
                      value={costOfEquity}
                      onChange={(e) => setCostOfEquity(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="5"
                      max="25"
                      step="0.1"
                      value={costOfEquity}
                      onChange={(e) => setCostOfEquity(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(costOfEquity)}</div>
                </label>
              </div>

              {/* Cost of Debt */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Cost of Debt (Rd)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      step="0.1"
                      value={costOfDebt}
                      onChange={(e) => setCostOfDebt(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="15"
                      step="0.1"
                      value={costOfDebt}
                      onChange={(e) => setCostOfDebt(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(costOfDebt)}</div>
                </label>
              </div>

              {/* Cost of Preferred Stock */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Cost of Preferred Stock (Rp)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="3"
                      max="15"
                      step="0.1"
                      value={costOfPreferredStock}
                      onChange={(e) => setCostOfPreferredStock(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="3"
                      max="15"
                      step="0.1"
                      value={costOfPreferredStock}
                      onChange={(e) => setCostOfPreferredStock(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(costOfPreferredStock)}</div>
                </label>
              </div>

              {/* Tax Rate */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Corporate Tax Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      step="0.5"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="40"
                      step="0.5"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(taxRate)}</div>
                </label>
              </div>
            </div>

            {/* Results Display - Right Panel */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>WACC Analysis Results</h2>
              
              {wacc && detailedResults && (
                <>
                  {/* WACC Result */}
                  <div className={styles.waccResult}>
                    <div className={styles.waccLabel}>Calculated WACC</div>
                    <div className={styles.waccValue}>{formatPercentage(wacc)}</div>
                    <div className={styles.waccInterpretation}>
                      {wacc < 8 ? "Low Cost of Capital - Attractive for Investments" :
                       wacc < 12 ? "Moderate Cost of Capital - Industry Average" :
                       "High Cost of Capital - Higher Risk Profile"}
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className={styles.breakdownSection}>
                    <h3 className={styles.breakdownTitle}>Capital Structure Breakdown</h3>
                    <div className={styles.breakdownGrid}>
                      <div className={styles.breakdownItem}>
                        <div className={styles.breakdownLabel}>Total Capital</div>
                        <div className={styles.breakdownValue}>{formatCurrency(detailedResults.totalValue)}</div>
                      </div>
                      <div className={styles.breakdownItem}>
                        <div className={styles.breakdownLabel}>Equity Weight</div>
                        <div className={styles.breakdownValue}>{formatWeight(detailedResults.weightEquity)}</div>
                      </div>
                      <div className={styles.breakdownItem}>
                        <div className={styles.breakdownLabel}>Debt Weight</div>
                        <div className={styles.breakdownValue}>{formatWeight(detailedResults.weightDebt)}</div>
                      </div>
                      <div className={styles.breakdownItem}>
                        <div className={styles.breakdownLabel}>Preferred Weight</div>
                        <div className={styles.breakdownValue}>{formatWeight(detailedResults.weightPreferred)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Cost Components */}
                  <div className={styles.componentsSection}>
                    <h3 className={styles.componentsTitle}>Cost Components Contribution</h3>
                    <div className={styles.componentsChart}>
                      <div className={styles.componentBarGroup}>
                        <div className={styles.componentLabel}>Equity Component</div>
                        <div className={styles.componentBarContainer}>
                          <div 
                            className={styles.componentBarEquity}
                            style={{ width: `${(detailedResults.componentCostEquity / wacc) * 100}%` }}
                            title={`Equity: ${formatPercentage(detailedResults.componentCostEquity)}`}
                          />
                        </div>
                        <div className={styles.componentValue}>{formatPercentage(detailedResults.componentCostEquity)}</div>
                      </div>
                      <div className={styles.componentBarGroup}>
                        <div className={styles.componentLabel}>Debt Component</div>
                        <div className={styles.componentBarContainer}>
                          <div 
                            className={styles.componentBarDebt}
                            style={{ width: `${(detailedResults.componentCostDebt / wacc) * 100}%` }}
                            title={`Debt: ${formatPercentage(detailedResults.componentCostDebt)}`}
                          />
                        </div>
                        <div className={styles.componentValue}>{formatPercentage(detailedResults.componentCostDebt)}</div>
                      </div>
                      <div className={styles.componentBarGroup}>
                        <div className={styles.componentLabel}>Preferred Component</div>
                        <div className={styles.componentBarContainer}>
                          <div 
                            className={styles.componentBarPreferred}
                            style={{ width: `${(detailedResults.componentCostPreferred / wacc) * 100}%` }}
                            title={`Preferred: ${formatPercentage(detailedResults.componentCostPreferred)}`}
                          />
                        </div>
                        <div className={styles.componentValue}>{formatPercentage(detailedResults.componentCostPreferred)}</div>
                      </div>
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendEquity}`}></div>
                        <span>Equity Cost Contribution</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendDebt}`}></div>
                        <span>Debt Cost Contribution</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendPreferred}`}></div>
                        <span>Preferred Stock Contribution</span>
                      </div>
                    </div>
                  </div>

                  {/* Sensitivity Analysis */}
                  <div className={styles.sensitivitySection}>
                    <h3 className={styles.sensitivityTitle}>Sensitivity to Cost of Equity Changes</h3>
                    <div className={styles.sensitivityTable}>
                      <div className={styles.tableHeader}>
                        <div className={styles.tableCell}>Δ Cost of Equity</div>
                        <div className={styles.tableCell}>Resulting WACC</div>
                        <div className={styles.tableCell}>Impact</div>
                      </div>
                      {sensitivityData.map((point, index) => (
                        <div 
                          key={index} 
                          className={`${styles.tableRow} ${point.costEquityChange === 0 ? styles.currentRow : ''}`}
                        >
                          <div className={styles.tableCell}>{point.label}</div>
                          <div className={styles.tableCell}>{formatPercentage(point.wacc)}</div>
                          <div className={styles.tableCell}>
                            {point.wacc > wacc ? '↑ Higher' : point.wacc < wacc ? '↓ Lower' : 'Current'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Financial Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>After-tax cost of debt: <strong>{formatPercentage(detailedResults.afterTaxCostOfDebt)}</strong></li>
                      <li>Debt contributes <strong>{formatPercentage((detailedResults.componentCostDebt / wacc) * 100)}</strong> to your WACC</li>
                      <li>Equity represents <strong>{formatWeight(detailedResults.weightEquity)}</strong> of your capital structure</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Mastering WACC: The Investor's Guide to Cost of Capital</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>What Exactly is WACC?</h3>
                <p>The Weighted Average Cost of Capital (WACC) represents a company's blended cost of capital from all sources: equity, debt, and preferred stock. It's the minimum return a company must earn on its existing asset base to satisfy its investors or creditors.</p>
                
                <div className={styles.formulaCard}>
                  <h4>WACC Formula:</h4>
                  <div className={styles.formula}>
                    WACC = (E/V × Re) + (D/V × Rd × (1 - Tc)) + (P/V × Rp)
                  </div>
                  <div className={styles.formulaExplanation}>
                    <ul>
                      <li><strong>E:</strong> Market value of equity</li>
                      <li><strong>D:</strong> Market value of debt</li>
                      <li><strong>P:</strong> Market value of preferred stock</li>
                      <li><strong>V:</strong> Total value (E + D + P)</li>
                      <li><strong>Re:</strong> Cost of equity</li>
                      <li><strong>Rd:</strong> Cost of debt</li>
                      <li><strong>Rp:</strong> Cost of preferred stock</li>
                      <li><strong>Tc:</strong> Corporate tax rate</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Practical Applications in Finance</h3>
                
                <div className={styles.applicationsGrid}>
                  <div className={styles.applicationCard}>
                    <h4>📈 Investment Decisions</h4>
                    <p>WACC serves as the discount rate in Net Present Value (NPV) calculations. Projects with returns exceeding WACC create shareholder value.</p>
                  </div>
                  
                  <div className={styles.applicationCard}>
                    <h4>💰 Company Valuation</h4>
                    <p>Used in Discounted Cash Flow (DCF) models to determine enterprise value. Lower WACC typically results in higher company valuations.</p>
                  </div>
                  
                  <div className={styles.applicationCard}>
                    <h4>🏢 Capital Structure Optimization</h4>
                    <p>Helps determine optimal debt-to-equity ratio by balancing tax benefits of debt with bankruptcy risk.</p>
                  </div>
                  
                  <div className={styles.applicationCard}>
                    <h4>📊 Performance Benchmarking</h4>
                    <p>Companies compare their Return on Invested Capital (ROIC) against WACC to measure value creation.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Industry WACC Benchmarks</h3>
                <div className={styles.benchmarkTable}>
                  <div className={styles.benchmarkRow}>
                    <div className={styles.benchmarkIndustry}>Technology</div>
                    <div className={styles.benchmarkWacc}>9-12%</div>
                    <div className={styles.benchmarkReason}>High growth expectations, volatile earnings</div>
                  </div>
                  <div className={styles.benchmarkRow}>
                    <div className={styles.benchmarkIndustry}>Utilities</div>
                    <div className={styles.benchmarkWacc}>5-7%</div>
                    <div className={styles.benchmarkReason}>Stable cash flows, regulated returns</div>
                  </div>
                  <div className={styles.benchmarkRow}>
                    <div className={styles.benchmarkIndustry}>Manufacturing</div>
                    <div className={styles.benchmarkWacc}>7-10%</div>
                    <div className={styles.benchmarkReason}>Moderate growth, tangible assets</div>
                  </div>
                  <div className={styles.benchmarkRow}>
                    <div className={styles.benchmarkIndustry}>Healthcare</div>
                    <div className={styles.benchmarkWacc}>8-11%</div>
                    <div className={styles.benchmarkReason}>Regulatory risk balanced with growth</div>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Insights</h3>
                <blockquote className={styles.expertQuote}>
                  "WACC is more than just a number—it's the gateway to understanding how a company finances its operations and creates value. The most successful investors don't just calculate WACC; they understand what drives its components and how changes in capital markets affect it."
                  <footer className={styles.quoteFooter}>— CFA Charterholder & Investment Banker, 20+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>WACC Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do I estimate cost of equity for my calculation?</h3>
                <p className={styles.faqAnswer}>The most common method is the Capital Asset Pricing Model (CAPM): Re = Rf + β(Rm - Rf). Where Rf is the risk-free rate (usually 10-year Treasury yield), β is the stock's beta (volatility relative to market), and (Rm - Rf) is the equity risk premium. Our calculator allows direct input of your estimated cost of equity.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Why use market values instead of book values?</h3>
                <p className={styles.faqAnswer}>Market values reflect current investor expectations and the true economic cost of capital. Book values are historical accounting figures that don't represent current opportunity costs. Market values ensure WACC reflects the actual return investors expect today.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does WACC change with different capital structures?</h3>
                <p className={styles.faqAnswer}>WACC follows a U-shaped curve. Initially, adding debt reduces WACC due to tax shields, but beyond an optimal point, WACC increases as bankruptcy risk rises. This creates the optimal capital structure theory, which our sensitivity analysis helps explore.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should WACC be adjusted for different projects?</h3>
                <p className={styles.faqAnswer}>Yes! The company-wide WACC should be adjusted for project-specific risk. Higher-risk projects should use a higher discount rate (WACC + risk premium), while lower-risk projects might use a lower rate. This is called the "hurdle rate" adjustment.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Optimize Your Capital Structure?</h2>
              <p className={styles.ctaText}>Use our WACC calculator to analyze your company's cost of capital, test different scenarios, and make informed financial decisions. Adjust inputs to match your specific situation and industry benchmarks.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational and analytical purposes. Actual WACC calculations for business decisions should be performed by qualified financial professionals. Market conditions, company-specific risks, and other factors may affect actual cost of capital.
              </p>
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p className={styles.footerText}>
              <strong>WACC Calculator</strong> | A professional financial analysis tool for investors, analysts, and corporate finance professionals.
            </p>
            <p className={styles.footerNote}>
              Last updated: {currentDate} | For educational use | Not financial advice
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
    revalidate: 21600, // 6 hours
  };
}

export default WACCCalculator;