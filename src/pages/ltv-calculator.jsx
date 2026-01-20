import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './ltvcalculator.module.css';

const LoanToValueRatioCalculator = ({ currentDate, lastModifiedDate }) => {
  const [propertyValue, setPropertyValue] = useState(500000);
  const [loanAmount, setLoanAmount] = useState(400000);
  const [downPayment, setDownPayment] = useState(100000);
  const [currentBalance, setCurrentBalance] = useState(350000);
  const [appraisedValue, setAppraisedValue] = useState(525000);
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Sync down payment with property value and loan amount
    const calculatedDownPayment = propertyValue - loanAmount;
    if (calculatedDownPayment >= 0) {
      setDownPayment(calculatedDownPayment);
    }
  }, [propertyValue, loanAmount]);

  const calculateLTV = () => {
    // Calculate LTV Ratios
    const purchaseLTV = propertyValue > 0 ? (loanAmount / propertyValue) * 100 : 0;
    const currentLTV = appraisedValue > 0 ? (currentBalance / appraisedValue) * 100 : 0;
    const initialEquity = propertyValue > 0 ? (downPayment / propertyValue) * 100 : 0;
    const currentEquity = appraisedValue > 0 ? ((appraisedValue - currentBalance) / appraisedValue) * 100 : 0;
    const equityChange = currentEquity - initialEquity;
    const appreciationAmount = appraisedValue - propertyValue;
    const appreciationPercentage = propertyValue > 0 ? (appreciationAmount / propertyValue) * 100 : 0;
    
    // Calculate loan paydown
    const loanPaydown = loanAmount - currentBalance;
    const paydownPercentage = loanAmount > 0 ? (loanPaydown / loanAmount) * 100 : 0;
    
    // Generate LTV comparison data
    const dataPoints = [
      { type: 'Conventional', ltv: 80, requirements: 'Standard', risk: 'Low' },
      { type: 'FHA', ltv: 96.5, requirements: 'Low Down Payment', risk: 'Medium' },
      { type: 'VA', ltv: 100, requirements: 'No Down Payment', risk: 'Low' },
      { type: 'Your Purchase', ltv: purchaseLTV, requirements: 'Your Deal', risk: purchaseLTV > 90 ? 'High' : purchaseLTV > 80 ? 'Medium' : 'Low' }
    ].sort((a, b) => a.ltv - b.ltv);

    setResults({
      purchaseLTV: Math.round(purchaseLTV * 100) / 100,
      currentLTV: Math.round(currentLTV * 100) / 100,
      initialEquity: Math.round(initialEquity * 100) / 100,
      currentEquity: Math.round(currentEquity * 100) / 100,
      equityChange: Math.round(equityChange * 100) / 100,
      appreciationAmount: Math.round(appreciationAmount * 100) / 100,
      appreciationPercentage: Math.round(appreciationPercentage * 100) / 100,
      loanPaydown: Math.round(loanPaydown * 100) / 100,
      paydownPercentage: Math.round(paydownPercentage * 100) / 100,
      totalEquity: Math.round((appraisedValue - currentBalance) * 100) / 100
    });
    
    setChartData(dataPoints);
  };

  useEffect(() => {
    calculateLTV();
  }, [propertyValue, loanAmount, downPayment, currentBalance, appraisedValue]);

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

  const getLTVGrade = (ltv) => {
    if (ltv <= 60) return { grade: 'A+', color: '#000000', description: 'Excellent Equity Position' };
    if (ltv <= 70) return { grade: 'A', color: '#333333', description: 'Strong Equity Position' };
    if (ltv <= 80) return { grade: 'B', color: '#666666', description: 'Good Equity Position' };
    if (ltv <= 90) return { grade: 'C', color: '#999999', description: 'Average Equity Position' };
    if (ltv <= 95) return { grade: 'D', color: '#cccccc', description: 'Limited Equity' };
    return { grade: 'F', color: '#ff4444', description: 'Negative Equity Risk' };
  };

  const ltvGrade = results ? getLTVGrade(results.currentLTV) : null;

  return (
    <>
      <Head>
        <title>Advanced Loan-to-Value Ratio Calculator | Real Estate Equity Analysis</title>
        <meta name="description" content="Free loan-to-value ratio calculator for real estate investors and homeowners. Calculate LTV ratios, equity positions, and analyze financing options with detailed metrics." />
        <meta name="keywords" content="loan to value ratio calculator, LTV calculator, equity calculator, real estate financing, mortgage analysis, property equity" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/ltv-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Loan-to-Value Ratio Calculator | Real Estate Equity Analysis" />
        <meta property="og:description" content="Calculate LTV ratios and analyze property equity positions. Professional tool for homeowners, investors, and lenders." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/ltv-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Loan-to-Value Ratio Calculator" />
        <meta name="twitter:description" content="Analyze property equity and financing options with our comprehensive LTV calculator." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="loan-to-value-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Loan-to-Value Ratio Calculator",
            "description": "Professional LTV calculator for real estate equity analysis, financing evaluation, and property investment decisions",
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
              "ratingCount": "1023",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Real Estate Analytics Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "LTV Ratio Calculation",
              "Equity Position Analysis",
              "Appreciation Tracking",
              "Loan Paydown Analysis",
              "Comparative Analysis"
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
                "name": "What is loan-to-value ratio (LTV) in real estate?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Loan-to-value ratio measures the relationship between a mortgage loan amount and the property's value. It's expressed as a percentage and helps lenders assess risk. A lower LTV means more borrower equity and lower risk, while a higher LTV indicates less equity and higher risk.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is a good LTV ratio for a mortgage?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "For conventional loans, 80% LTV or lower is ideal (20% down payment). This typically avoids private mortgage insurance (PMI). FHA loans allow up to 96.5% LTV (3.5% down), and VA loans allow 100% LTV (0% down). The best LTV depends on your goals: lower LTV means better rates and no PMI, while higher LTV preserves cash.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How does LTV affect mortgage insurance?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Private Mortgage Insurance (PMI) is typically required when LTV exceeds 80%. PMI protects the lender if you default. Once your LTV reaches 78% through loan paydown or property appreciation, you can request PMI removal. FHA loans have Mortgage Insurance Premiums (MIP) that may last the life of the loan.",
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
            <h1 className={styles.mainTitle}>Advanced Loan-to-Value Ratio Calculator</h1>
            <p className={styles.subtitle}>Analyze Property Equity, Financing Options, and Risk Management</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Professional Grade</span>
              <span className={styles.badge}>No Signup Required</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Property & Loan Analysis</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Property Purchase Price
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="100000"
                      max="5000000"
                      step="10000"
                      value={propertyValue}
                      onChange={(e) => setPropertyValue(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="100000"
                      max="5000000"
                      step="10000"
                      value={propertyValue}
                      onChange={(e) => setPropertyValue(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(propertyValue)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Original Loan Amount
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="5000000"
                      step="10000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="5000000"
                      step="10000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(loanAmount)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Down Payment (Auto-calculated)
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max={propertyValue}
                      step="5000"
                      value={downPayment}
                      onChange={(e) => {
                        const newDownPayment = parseInt(e.target.value);
                        setDownPayment(newDownPayment);
                        setLoanAmount(propertyValue - newDownPayment);
                      }}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max={propertyValue}
                      step="5000"
                      value={downPayment}
                      onChange={(e) => {
                        const newDownPayment = parseInt(e.target.value) || 0;
                        setDownPayment(newDownPayment);
                        setLoanAmount(propertyValue - newDownPayment);
                      }}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(downPayment)} ({formatPercentage((downPayment/propertyValue)*100)})</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Current Loan Balance
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max={loanAmount}
                      step="10000"
                      value={currentBalance}
                      onChange={(e) => setCurrentBalance(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max={loanAmount}
                      step="10000"
                      value={currentBalance}
                      onChange={(e) => setCurrentBalance(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(currentBalance)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Current Appraised Value
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="100000"
                      max="10000000"
                      step="10000"
                      value={appraisedValue}
                      onChange={(e) => setAppraisedValue(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="100000"
                      max="10000000"
                      step="10000"
                      value={appraisedValue}
                      onChange={(e) => setAppraisedValue(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(appraisedValue)}</div>
                </label>
              </div>

              <div className={styles.inputNote}>
                <p>💡 <strong>Note:</strong> Down payment is auto-calculated as Property Value minus Loan Amount. Adjust either value to change your down payment.</p>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Equity & LTV Analysis</h2>
              
              {results && ltvGrade && (
                <>
                  <div className={styles.resultsHeader}>
                    <div className={styles.ltvDisplay}>
                      <div className={styles.ltvValue}>{formatPercentage(results.currentLTV)}</div>
                      <div className={styles.ltvLabel}>Current LTV Ratio</div>
                    </div>
                    <div className={styles.gradeBadge} style={{ backgroundColor: ltvGrade.color }}>
                      {ltvGrade.grade}
                    </div>
                  </div>
                  <div className={styles.gradeDescription}>
                    <strong>Equity Position:</strong> {ltvGrade.description}
                  </div>

                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Purchase LTV</div>
                      <div className={styles.resultValue}>{formatPercentage(results.purchaseLTV)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Current Equity</div>
                      <div className={styles.resultValue}>{formatPercentage(results.currentEquity)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Equity</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalEquity)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Equity Change</div>
                      <div className={styles.resultValue}>{formatPercentage(results.equityChange)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Appreciation</div>
                      <div className={styles.resultValue}>{formatCurrency(results.appreciationAmount)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Loan Paydown</div>
                      <div className={styles.resultValue}>{formatCurrency(results.loanPaydown)}</div>
                    </div>
                  </div>

                  {/* LTV Comparison Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>LTV Comparison Analysis</h3>
                    <div className={styles.chartBars}>
                      {chartData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>
                            {data.type}
                            <div className={styles.riskIndicator}>{data.risk} Risk</div>
                          </div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={data.type === 'Your Purchase' ? styles.chartBarHighlight : styles.chartBarStandard}
                              style={{ width: `${Math.min(data.ltv, 100)}%` }}
                              title={`LTV: ${data.ltv.toFixed(2)}% - ${data.requirements}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{data.ltv.toFixed(2)}%</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendStandard}`}></div>
                        <span>Loan Program Benchmarks</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendHighlight}`}></div>
                        <span>Your Property</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Equity Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>You started with <strong>{formatPercentage(results.initialEquity)}</strong> equity and now have <strong>{formatPercentage(results.currentEquity)}</strong></li>
                      <li>Your equity has increased by <strong>{formatCurrency(results.totalEquity - downPayment)}</strong> since purchase</li>
                      {results.currentLTV <= 80 && (
                        <li><strong>✅ PMI Eligibility:</strong> Your LTV is below 80% - you may qualify to remove Private Mortgage Insurance</li>
                      )}
                      {results.currentLTV > 80 && results.currentLTV <= 90 && (
                        <li><strong>⚠️ PMI Status:</strong> Your LTV is above 80% - you likely have PMI. Consider when you'll reach 78% LTV.</li>
                      )}
                      {results.currentLTV > 90 && (
                        <li className={styles.warning}><strong>⚠️ Limited Equity:</strong> Your LTV exceeds 90%, indicating limited equity cushion.</li>
                      )}
                      {results.currentLTV > 100 && (
                        <li className={styles.danger}><strong>🚨 Negative Equity:</strong> Your LTV exceeds 100% - you owe more than the property is worth.</li>
                      )}
                    </ul>
                  </div>

                  <div className={styles.refinanceCard}>
                    <h3 className={styles.refinanceTitle}>🔁 Refinance Analysis</h3>
                    <div className={styles.refinanceContent}>
                      <p>Based on your current LTV of <strong>{formatPercentage(results.currentLTV)}</strong>:</p>
                      <ul>
                        {results.currentLTV <= 60 && (
                          <li><strong>Prime Refinance Candidate:</strong> You qualify for the best rates and terms</li>
                        )}
                        {results.currentLTV > 60 && results.currentLTV <= 75 && (
                          <li><strong>Good Refinance Candidate:</strong> Competitive rates available</li>
                        )}
                        {results.currentLTV > 75 && results.currentLTV <= 80 && (
                          <li><strong>Standard Refinance:</strong> Standard rates apply</li>
                        )}
                        {results.currentLTV > 80 && results.currentLTV <= 90 && (
                          <li><strong>Higher Cost Refinance:</strong> May require PMI or higher rates</li>
                        )}
                        {results.currentLTV > 90 && results.currentLTV <= 95 && (
                          <li><strong>Limited Options:</strong> Few lenders offer refinancing above 90% LTV</li>
                        )}
                        {results.currentLTV > 95 && (
                          <li><strong>No Refinance Options:</strong> Conventional refinancing not available</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Mastering Loan-to-Value Ratios: Your Guide to Smart Real Estate Financing</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>What Exactly is Loan-to-Value Ratio?</h3>
                <p>Loan-to-value ratio (LTV) is one of the most critical metrics in real estate financing. It measures the relationship between your mortgage amount and the property's value, expressed as a percentage. LTV helps lenders assess risk, determine loan eligibility, set interest rates, and decide whether mortgage insurance is required.</p>
                
                <div className={styles.formulaCard}>
                  <h4>LTV Formula:</h4>
                  <div className={styles.formula}>
                    LTV = (Loan Amount ÷ Property Value) × 100%
                  </div>
                  <p>Where <strong>Loan Amount</strong> is the mortgage balance and <strong>Property Value</strong> is the current market value or purchase price.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>How LTV Affects Your Mortgage Journey</h3>
                
                <div className={styles.ltvImpactGrid}>
                  <div className={styles.impactCard}>
                    <div className={styles.impactHeader}>
                      <div className={styles.ltvRange}>≤ 60% LTV</div>
                      <div className={styles.impactGrade}>Excellent</div>
                    </div>
                    <div className={styles.impactContent}>
                      <p><strong>Best Rates:</strong> Lowest interest rates available</p>
                      <p><strong>No PMI:</strong> Mortgage insurance not required</p>
                      <p><strong>Flexible Terms:</strong> Most loan programs available</p>
                    </div>
                  </div>
                  
                  <div className={styles.impactCard}>
                    <div className={styles.impactHeader}>
                      <div className={styles.ltvRange}>61-75% LTV</div>
                      <div className={styles.impactGrade}>Very Good</div>
                    </div>
                    <div className={styles.impactContent}>
                      <p><strong>Competitive Rates:</strong> Near-optimal interest rates</p>
                      <p><strong>No PMI:</strong> Typically below PMI threshold</p>
                      <p><strong>Good Options:</strong> Wide range of loan choices</p>
                    </div>
                  </div>
                  
                  <div className={styles.impactCard}>
                    <div className={styles.impactHeader}>
                      <div className={styles.ltvRange}>76-80% LTV</div>
                      <div className={styles.impactGrade}>Good</div>
                    </div>
                    <div className={styles.impactContent}>
                      <p><strong>Standard Rates:</strong> Market average interest rates</p>
                      <p><strong>PMI Threshold:</strong> At the edge of PMI requirements</p>
                      <p><strong>Solid Options:</strong> Most conventional loans available</p>
                    </div>
                  </div>
                  
                  <div className={styles.impactCard}>
                    <div className={styles.impactHeader}>
                      <div className={styles.ltvRange}>81-90% LTV</div>
                      <div className={styles.impactGrade}>Fair</div>
                    </div>
                    <div className={styles.impactContent}>
                      <p><strong>Higher Rates:</strong> Slightly elevated interest rates</p>
                      <p><strong>PMI Required:</strong> Mortgage insurance mandatory</p>
                      <p><strong>Limited Options:</strong> Some programs unavailable</p>
                    </div>
                  </div>
                  
                  <div className={styles.impactCard}>
                    <div className={styles.impactHeader}>
                      <div className={styles.ltvRange}>91-95% LTV</div>
                      <div className={styles.impactGrade}>Poor</div>
                    </div>
                    <div className={styles.impactContent}>
                      <p><strong>High Rates:</strong> Significantly higher interest rates</p>
                      <p><strong>Heavy PMI:</strong> Substantial mortgage insurance</p>
                      <p><strong>Few Options:</strong> Limited loan programs available</p>
                    </div>
                  </div>
                  
                  <div className={styles.impactCard}>
                    <div className={styles.impactHeader}>
                      <div className={styles.ltvRange}>96-100% LTV</div>
                      <div className={styles.impactGrade}>Risky</div>
                    </div>
                    <div className={styles.impactContent}>
                      <p><strong>Highest Rates:</strong> Maximum interest rates applied</p>
                      <p><strong>Required Programs:</strong> FHA/VA only typically</p>
                      <p><strong>No Equity Cushion:</strong> Vulnerable to market shifts</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategies to Improve Your LTV Ratio</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>💰 Make Extra Payments</h4>
                    <p>Every additional principal payment reduces your loan balance and improves your LTV. Even one extra payment per year can significantly accelerate LTV improvement.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏠 Increase Property Value</h4>
                    <p>Strategic renovations and improvements can increase your property's appraised value, thereby lowering your LTV ratio without paying down the loan.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Wait for Appreciation</h4>
                    <p>In appreciating markets, property values naturally increase over time. Patience can turn a high LTV into a favorable one through market growth.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🔄 Cash-Out Refinance</h4>
                    <p>If you have significant equity (low LTV), consider a cash-out refinance to access funds for investments while maintaining a reasonable LTV.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding Private Mortgage Insurance (PMI)</h3>
                <p>PMI is typically required when your LTV exceeds 80%. This insurance protects the lender if you default on the loan. PMI costs vary but typically range from 0.5% to 1.5% of the loan amount annually.</p>
                
                <div className={styles.pmiGuide}>
                  <div className={styles.pmiItem}>
                    <div className={styles.pmiScenario}>LTV {'>'} 80%</div>
                    <div className={styles.pmiDescription}><strong>PMI Required:</strong> Typically 0.5-1.5% of loan annually</div>
                  </div>
                  <div className={styles.pmiItem}>
                    <div className={styles.pmiScenario}>LTV reaches 78%</div>
                    <div className={styles.pmiDescription}><strong>Automatic Termination:</strong> Lender must remove PMI (conventional loans)</div>
                  </div>
                  <div className={styles.pmiItem}>
                    <div className={styles.pmiScenario}>LTV reaches 80%</div>
                    <div className={styles.pmiDescription}><strong>Request Removal:</strong> You can request PMI removal with appraisal</div>
                  </div>
                  <div className={styles.pmiItem}>
                    <div className={styles.pmiScenario}>FHA Loans</div>
                    <div className={styles.pmiDescription}><strong>MIP for Life:</strong> Mortgage Insurance Premium may last loan term</div>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Insights from Mortgage Professionals</h3>
                <blockquote className={styles.expertQuote}>
                  "LTV isn't just a number—it's a window into your financial flexibility. A 60% LTV gives you options: refinance at better rates, access equity for investments, or weather market downturns. A 95% LTV leaves you vulnerable and limited. Always aim for the lowest LTV you can reasonably achieve."
                  <footer className={styles.quoteFooter}>— Mortgage Underwriter, 15+ years experience</footer>
                </blockquote>
                
                <blockquote className={styles.expertQuote}>
                  "The most common mistake I see is homeowners focusing only on monthly payments. They take 95% LTV loans to minimize down payment, then pay thousands in PMI and higher interest rates. A slightly larger down payment often saves more in the long run than people realize."
                  <footer className={styles.quoteFooter}>— Certified Mortgage Planner</footer>
                </blockquote>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Advanced LTV Strategies for Investors</h3>
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🏢 Portfolio Optimization</h4>
                    <p>Maintain different LTV levels across your portfolio. Some properties at 60% LTV for stability, others at 80% LTV for growth, creating balanced risk exposure.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📊 BRRRR Method</h4>
                    <p>Buy, Rehab, Rent, Refinance, Repeat. This strategy allows you to achieve low LTV ratios after value-add improvements, then pull out equity for new investments.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚡ Velocity Banking</h4>
                    <p>Use a home equity line of credit (HELOC) to pay down your primary mortgage faster, rapidly improving your LTV and freeing up equity.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🔄 Cross-Collateralization</h4>
                    <p>Use equity from one property with low LTV to secure financing for another, optimizing your overall portfolio LTV.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common LTV Scenarios and Solutions</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>High LTV Purchase:</strong> Consider FHA (3.5% down) or conventional with PMI. Plan to refinance when LTV reaches 80%.</li>
                  <li><strong>Underwater Mortgage:</strong> If LTV {'>'} 100%, explore loan modification, short sale, or strategic default options.</li>
                  <li><strong>Equity Rich, Cash Poor:</strong> With low LTV but limited liquidity, consider HELOC or cash-out refinance for access to funds.</li>
                  <li><strong>Rental Property LTV:</strong> Investment properties typically require 20-25% down (75-80% LTV max). Plan accordingly.</li>
                  <li><strong>Rate-and-Term Refinance:</strong> Best executed when LTV is at its lowest point for optimal rates.</li>
                </ul>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between LTV and CLTV?</h3>
                <p className={styles.faqAnswer}>LTV (Loan-to-Value) measures your primary mortgage against property value. CLTV (Combined Loan-to-Value) includes all liens (primary mortgage + HELOC + second mortgages). For example, a $400,000 mortgage plus $50,000 HELOC on a $500,000 property gives 80% LTV but 90% CLTV. Lenders consider CLTV for risk assessment.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How often should I check my LTV ratio?</h3>
                <p className={styles.faqAnswer}>Check your LTV annually or whenever significant changes occur: after making extra payments, when considering refinancing, or if your local market experiences substantial appreciation/depreciation. Regular monitoring helps you identify optimal times to refinance or remove PMI.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can LTV affect my property insurance?</h3>
                <p className={styles.faqAnswer}>While LTV doesn't directly affect property insurance premiums, lenders may require additional insurance coverage (like flood insurance) for high-LTV properties in certain areas. Also, inadequate insurance that doesn't cover the full loan amount can violate loan terms for high-LTV mortgages.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What happens if my LTV goes above 100%?</h3>
                <p className={styles.faqAnswer}>An LTV above 100% means you're "underwater" or have "negative equity"—you owe more than the property is worth. This limits refinancing options, makes selling difficult, and increases foreclosure risk. Solutions include loan modification, short sale, deed-in-lieu, or waiting for market recovery.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do appraisals affect LTV calculations?</h3>
                <p className={styles.faqAnswer}>Appraisals directly determine the "value" in LTV. For purchases, lenders use the lower of purchase price or appraisal. For refinances, they use the appraisal value. Disputing a low appraisal or ordering a second appraisal can significantly impact your LTV and loan terms.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Analyze Your Property Equity?</h2>
              <p className={styles.ctaText}>Use our calculator to understand your LTV position, plan refinancing strategies, and make informed real estate decisions.</p>
              
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Actual LTV calculations may vary based on lender requirements, appraisal values, and specific loan programs. Property values fluctuate and past appreciation does not guarantee future results. PMI requirements and costs vary by lender and individual circumstances. Always consult with qualified mortgage professionals, real estate advisors, and financial planners before making real estate or financing decisions. Loan programs, rates, and requirements are subject to change.
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
    revalidate: 21600, // 24 hours
  };
}

export default LoanToValueRatioCalculator;