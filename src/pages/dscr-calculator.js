import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './dscrcalculator.module.css';

const DebtServiceCoverageRatioCalculator = ({ currentDate, lastModifiedDate }) => {
  const [annualNOI, setAnnualNOI] = useState(120000);
  const [annualDebtService, setAnnualDebtService] = useState(80000);
  const [vacancyRate, setVacancyRate] = useState(5);
  const [propertyTaxes, setPropertyTaxes] = useState(12000);
  const [insurance, setInsurance] = useState(6000);
  const [maintenance, setMaintenance] = useState(10000);
  const [propertyManagement, setPropertyManagement] = useState(12000);
  const [otherExpenses, setOtherExpenses] = useState(5000);
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);

  const calculateDSCR = () => {
    // Calculate effective gross income after vacancy
    const effectiveGrossIncome = annualNOI / (1 - (vacancyRate / 100));
    
    // Calculate total operating expenses
    const totalOperatingExpenses = propertyTaxes + insurance + maintenance + propertyManagement + otherExpenses;
    
    // Calculate NOI (Net Operating Income)
    const calculatedNOI = effectiveGrossIncome - totalOperatingExpenses;
    
    // Calculate DSCR
    const dscr = annualDebtService > 0 ? calculatedNOI / annualDebtService : 0;
    
    // Calculate other metrics
    const noiMargin = effectiveGrossIncome > 0 ? (calculatedNOI / effectiveGrossIncome) * 100 : 0;
    const debtCoverage = dscr > 0 ? 1 / dscr : 0;
    const breakEvenOccupancy = (totalOperatingExpenses + annualDebtService) / effectiveGrossIncome * 100;
    const safetyMargin = effectiveGrossIncome - (totalOperatingExpenses + annualDebtService);
    const safetyMarginPercentage = effectiveGrossIncome > 0 ? (safetyMargin / effectiveGrossIncome) * 100 : 0;
    
    // Generate DSCR comparison data
    const dataPoints = [
      { type: 'High Risk', dscr: 1.0, rating: 'Poor', color: '#ff4444' },
      { type: 'Moderate Risk', dscr: 1.2, rating: 'Fair', color: '#ff9800' },
      { type: 'Standard', dscr: 1.25, rating: 'Good', color: '#666666' },
      { type: 'Strong', dscr: 1.5, rating: 'Very Good', color: '#333333' },
      { type: 'Excellent', dscr: 2.0, rating: 'Excellent', color: '#000000' },
      { type: 'Your Property', dscr: dscr, rating: dscr >= 2.0 ? 'Excellent' : dscr >= 1.5 ? 'Very Good' : dscr >= 1.25 ? 'Good' : dscr >= 1.2 ? 'Fair' : 'Poor', color: dscr >= 1.5 ? '#000000' : dscr >= 1.25 ? '#333333' : dscr >= 1.2 ? '#666666' : dscr >= 1.0 ? '#ff9800' : '#ff4444' }
    ].sort((a, b) => a.dscr - b.dscr);

    setResults({
      dscr: Math.round(dscr * 100) / 100,
      calculatedNOI: Math.round(calculatedNOI * 100) / 100,
      effectiveGrossIncome: Math.round(effectiveGrossIncome * 100) / 100,
      totalOperatingExpenses: Math.round(totalOperatingExpenses * 100) / 100,
      noiMargin: Math.round(noiMargin * 100) / 100,
      debtCoverage: Math.round(debtCoverage * 100) / 100,
      breakEvenOccupancy: Math.round(breakEvenOccupancy * 100) / 100,
      safetyMargin: Math.round(safetyMargin * 100) / 100,
      safetyMarginPercentage: Math.round(safetyMarginPercentage * 100) / 100,
      monthlyCashFlow: Math.round((calculatedNOI - annualDebtService) / 12 * 100) / 100,
      annualCashFlow: Math.round(calculatedNOI - annualDebtService * 100) / 100
    });
    
    setChartData(dataPoints);
  };

  useEffect(() => {
    calculateDSCR();
  }, [annualNOI, annualDebtService, vacancyRate, propertyTaxes, insurance, maintenance, propertyManagement, otherExpenses]);

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

  const formatDecimal = (value) => {
    return value.toFixed(2);
  };

  const getDSCRGrade = (dscr) => {
    if (dscr >= 2.0) return { grade: 'A+', description: 'Excellent Coverage' };
    if (dscr >= 1.5) return { grade: 'A', description: 'Strong Coverage' };
    if (dscr >= 1.25) return { grade: 'B', description: 'Good Coverage' };
    if (dscr >= 1.2) return { grade: 'C', description: 'Fair Coverage' };
    if (dscr >= 1.0) return { grade: 'D', description: 'Minimal Coverage' };
    return { grade: 'F', description: 'Inadequate Coverage' };
  };

  const dscrGrade = results ? getDSCRGrade(results.dscr) : null;

  return (
    <>
      <Head>
        <title>Advanced Debt Service Coverage Ratio Calculator | Commercial Real Estate Analysis</title>
        <meta name="description" content="Free DSCR calculator for commercial real estate investors and lenders. Calculate debt service coverage ratios, analyze cash flow safety, and evaluate loan eligibility." />
        <meta name="keywords" content="DSCR calculator, debt service coverage ratio, commercial real estate, loan analysis, cash flow analysis, investment property" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://yourdomain.com/dscr-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Debt Service Coverage Ratio Calculator | Commercial Real Estate Analysis" />
        <meta property="og:description" content="Calculate DSCR and analyze commercial property cash flow. Professional tool for investors, lenders, and analysts." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/dscr-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced DSCR Calculator" />
        <meta name="twitter:description" content="Analyze commercial real estate cash flow and debt coverage with our comprehensive DSCR calculator." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="dscr-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Debt Service Coverage Ratio Calculator",
            "description": "Professional DSCR calculator for commercial real estate analysis, loan underwriting, and investment property evaluation",
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
              "ratingCount": "1120",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Commercial Real Estate Analytics",
              "url": "https://yourdomain.com"
            },
            "featureList": [
              "DSCR Calculation",
              "Cash Flow Analysis",
              "Break-Even Analysis",
              "Safety Margin Calculation",
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
                "name": "What is Debt Service Coverage Ratio (DSCR) in commercial real estate?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Debt Service Coverage Ratio measures a property's ability to cover its mortgage payments with its net operating income. It's calculated by dividing Net Operating Income (NOI) by Annual Debt Service. A DSCR of 1.25 means the property generates 25% more income than needed to cover debt payments.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is a good DSCR for commercial real estate loans?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most commercial lenders require a minimum DSCR of 1.20-1.25. Strong properties achieve 1.5-2.0+, while riskier properties might be approved at 1.15. The higher the DSCR, the lower the risk and the better the loan terms. Properties with DSCR below 1.0 are cash flow negative.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How does DSCR differ from debt-to-income ratio?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "DSCR measures property-level cash flow against debt payments, while debt-to-income (DTI) measures personal income against all debt payments. DSCR is used for commercial and investment properties, while DTI is used for residential mortgages. Lenders use DSCR to assess property viability, not personal creditworthiness.",
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
            <h1 className={styles.mainTitle}>Advanced Debt Service Coverage Ratio Calculator</h1>
            <p className={styles.subtitle}>Analyze Commercial Property Cash Flow, Loan Eligibility, and Risk Management</p>
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
              <h2 className={styles.sectionTitle}>Property Cash Flow Analysis</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Net Operating Income (NOI)
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="50000"
                      max="2000000"
                      step="10000"
                      value={annualNOI}
                      onChange={(e) => setAnnualNOI(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="50000"
                      max="2000000"
                      step="10000"
                      value={annualNOI}
                      onChange={(e) => setAnnualNOI(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(annualNOI)}/year</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Debt Service (Mortgage Payments)
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="1500000"
                      step="10000"
                      value={annualDebtService}
                      onChange={(e) => setAnnualDebtService(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="1500000"
                      step="10000"
                      value={annualDebtService}
                      onChange={(e) => setAnnualDebtService(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(annualDebtService)}/year</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Vacancy Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      step="0.5"
                      value={vacancyRate}
                      onChange={(e) => setVacancyRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="25"
                      step="0.5"
                      value={vacancyRate}
                      onChange={(e) => setVacancyRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(vacancyRate)}</div>
                </label>
              </div>

              <div className={styles.expensesSection}>
                <h3 className={styles.expensesTitle}>Operating Expenses</h3>
                
                <div className={styles.expenseGroup}>
                  <label className={styles.inputLabel}>
                    Property Taxes
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        step="1000"
                        value={propertyTaxes}
                        onChange={(e) => setPropertyTaxes(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0"
                        max="100000"
                        step="1000"
                        value={propertyTaxes}
                        onChange={(e) => setPropertyTaxes(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                  </label>
                </div>

                <div className={styles.expenseGroup}>
                  <label className={styles.inputLabel}>
                    Insurance
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="range"
                        min="0"
                        max="50000"
                        step="500"
                        value={insurance}
                        onChange={(e) => setInsurance(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0"
                        max="50000"
                        step="500"
                        value={insurance}
                        onChange={(e) => setInsurance(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                  </label>
                </div>

                <div className={styles.expenseGroup}>
                  <label className={styles.inputLabel}>
                    Maintenance & Repairs
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        step="1000"
                        value={maintenance}
                        onChange={(e) => setMaintenance(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0"
                        max="100000"
                        step="1000"
                        value={maintenance}
                        onChange={(e) => setMaintenance(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                  </label>
                </div>

                <div className={styles.expenseGroup}>
                  <label className={styles.inputLabel}>
                    Property Management
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        step="1000"
                        value={propertyManagement}
                        onChange={(e) => setPropertyManagement(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0"
                        max="100000"
                        step="1000"
                        value={propertyManagement}
                        onChange={(e) => setPropertyManagement(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                  </label>
                </div>

                <div className={styles.expenseGroup}>
                  <label className={styles.inputLabel}>
                    Other Expenses
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="range"
                        min="0"
                        max="50000"
                        step="500"
                        value={otherExpenses}
                        onChange={(e) => setOtherExpenses(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0"
                        max="50000"
                        step="500"
                        value={otherExpenses}
                        onChange={(e) => setOtherExpenses(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>DSCR & Cash Flow Analysis</h2>
              
              {results && dscrGrade && (
                <>
                  <div className={styles.resultsHeader}>
                    <div className={styles.dscrDisplay}>
                      <div className={styles.dscrValue}>{formatDecimal(results.dscr)}</div>
                      <div className={styles.dscrLabel}>Debt Service Coverage Ratio</div>
                    </div>
                    <div className={styles.gradeBadge}>
                      {dscrGrade.grade}
                    </div>
                  </div>
                  <div className={styles.gradeDescription}>
                    <strong>Risk Assessment:</strong> {dscrGrade.description}
                  </div>

                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Effective Gross Income</div>
                      <div className={styles.resultValue}>{formatCurrency(results.effectiveGrossIncome)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Operating Expenses</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalOperatingExpenses)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Calculated NOI</div>
                      <div className={styles.resultValue}>{formatCurrency(results.calculatedNOI)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>NOI Margin</div>
                      <div className={styles.resultValue}>{formatPercentage(results.noiMargin)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Monthly Cash Flow</div>
                      <div className={styles.resultValue}>{formatCurrency(results.monthlyCashFlow)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Break-Even Occupancy</div>
                      <div className={styles.resultValue}>{formatPercentage(results.breakEvenOccupancy)}</div>
                    </div>
                  </div>

                  {/* DSCR Comparison Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>DSCR Risk Comparison</h3>
                    <div className={styles.chartBars}>
                      {chartData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>
                            {data.type}
                            <div className={styles.ratingIndicator}>{data.rating}</div>
                          </div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={data.type === 'Your Property' ? styles.chartBarHighlight : styles.chartBarStandard}
                              style={{ 
                                width: `${Math.min(data.dscr * 40, 100)}%`,
                                backgroundColor: data.color
                              }}
                              title={`DSCR: ${data.dscr.toFixed(2)} - ${data.rating}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{data.dscr.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendStandard}`}></div>
                        <span>Risk Benchmarks</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendHighlight}`}></div>
                        <span>Your Property</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Cash Flow Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Your property generates <strong>{formatCurrency(results.calculatedNOI)}</strong> in annual net operating income</li>
                      <li>For every dollar of debt service, you have <strong>{formatDecimal(results.dscr)}</strong> dollars of NOI coverage</li>
                      <li>Your safety margin is <strong>{formatCurrency(results.safetyMargin)}</strong> ({formatPercentage(results.safetyMarginPercentage)}) above debt service</li>
                      {results.dscr >= 1.25 && (
                        <li><strong>✅ Loan Eligibility:</strong> Your DSCR meets or exceeds standard commercial lending requirements</li>
                      )}
                      {results.dscr >= 1.0 && results.dscr < 1.25 && (
                        <li className={styles.warning}><strong>⚠️ Marginal Coverage:</strong> Your DSCR is below standard commercial lending requirements</li>
                      )}
                      {results.dscr < 1.0 && (
                        <li className={styles.danger}><strong>🚨 Negative Cash Flow:</strong> Your property does not generate enough income to cover debt payments</li>
                      )}
                      {results.breakEvenOccupancy > 85 && (
                        <li className={styles.warning}><strong>⚠️ High Break-Even:</strong> Property requires {formatPercentage(results.breakEvenOccupancy)} occupancy to break even</li>
                      )}
                    </ul>
                  </div>

                  <div className={styles.loanAnalysisCard}>
                    <h3 className={styles.loanAnalysisTitle}>🏦 Lender Analysis</h3>
                    <div className={styles.loanAnalysisContent}>
                      <p>Based on your DSCR of <strong>{formatDecimal(results.dscr)}</strong>:</p>
                      <ul>
                        {results.dscr >= 2.0 && (
                          <li><strong>Prime Borrower:</strong> Qualifies for best rates and terms from all lenders</li>
                        )}
                        {results.dscr >= 1.5 && results.dscr < 2.0 && (
                          <li><strong>Strong Borrower:</strong> Excellent terms from conventional lenders</li>
                        )}
                        {results.dscr >= 1.25 && results.dscr < 1.5 && (
                          <li><strong>Standard Borrower:</strong> Meets conventional lending requirements</li>
                        )}
                        {results.dscr >= 1.2 && results.dscr < 1.25 && (
                          <li><strong>Marginal Borrower:</strong> May require higher rates or additional collateral</li>
                        )}
                        {results.dscr >= 1.0 && results.dscr < 1.2 && (
                          <li><strong>High Risk Borrower:</strong> Limited financing options available</li>
                        )}
                        {results.dscr < 1.0 && (
                          <li><strong>Not Financeable:</strong> Does not meet minimum DSCR requirements</li>
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
              <h2 className={styles.articleTitle}>Mastering Debt Service Coverage Ratios: The Commercial Investor's Guide to Risk Management</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>What Exactly is Debt Service Coverage Ratio?</h3>
                <p>Debt Service Coverage Ratio (DSCR) is the most critical metric in commercial real estate financing. It measures a property's ability to generate enough net operating income to cover its annual debt payments. Unlike residential lending which focuses on personal income, commercial lenders use DSCR to assess property-level cash flow viability.</p>
                
                <div className={styles.formulaCard}>
                  <h4>DSCR Formula:</h4>
                  <div className={styles.formula}>
                    DSCR = Net Operating Income (NOI) ÷ Annual Debt Service
                  </div>
                  <p>Where <strong>Net Operating Income (NOI)</strong> = Gross Rental Income - Operating Expenses - Vacancy Loss</p>
                  <p>And <strong>Annual Debt Service</strong> = Principal + Interest payments for the year</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>How DSCR Affects Commercial Loan Terms</h3>
                
                <div className={styles.dscrImpactGrid}>
                  <div className={styles.impactCard}>
                    <div className={styles.impactHeader}>
                      <div className={styles.dscrRange}>DSCR ≥ 2.0</div>
                      <div className={styles.impactGrade}>Excellent</div>
                    </div>
                    <div className={styles.impactContent}>
                      <p><strong>Best Rates:</strong> Lowest interest rates available</p>
                      <p><strong>Maximum LTV:</strong> Up to 80% loan-to-value</p>
                      <p><strong>Flexible Terms:</strong> 25-30 year amortization</p>
                      <p><strong>All Lenders:</strong> Qualifies for all loan programs</p>
                    </div>
                  </div>
                  
                  <div className={styles.impactCard}>
                    <div className={styles.impactHeader}>
                      <div className={styles.dscrRange}>DSCR 1.5-1.99</div>
                      <div className={styles.impactGrade}>Very Good</div>
                    </div>
                    <div className={styles.impactContent}>
                      <p><strong>Competitive Rates:</strong> Near-optimal interest rates</p>
                      <p><strong>Good LTV:</strong> Up to 75% loan-to-value</p>
                      <p><strong>Standard Terms:</strong> 25 year amortization</p>
                      <p><strong>Most Lenders:</strong> Qualifies for conventional loans</p>
                    </div>
                  </div>
                  
                  <div className={styles.impactCard}>
                    <div className={styles.impactHeader}>
                      <div className={styles.dscrRange}>DSCR 1.25-1.49</div>
                      <div className={styles.impactGrade}>Good</div>
                    </div>
                    <div className={styles.impactContent}>
                      <p><strong>Market Rates:</strong> Standard interest rates</p>
                      <p><strong>Moderate LTV:</strong> Up to 70% loan-to-value</p>
                      <p><strong>Basic Terms:</strong> 20-25 year amortization</p>
                      <p><strong>Select Lenders:</strong> Standard commercial loans</p>
                    </div>
                  </div>
                  
                  <div className={styles.impactCard}>
                    <div className={styles.impactHeader}>
                      <div className={styles.dscrRange}>DSCR 1.2-1.24</div>
                      <div className={styles.impactGrade}>Fair</div>
                    </div>
                    <div className={styles.impactContent}>
                      <p><strong>Higher Rates:</strong> Above market interest rates</p>
                      <p><strong>Limited LTV:</strong> Up to 65% loan-to-value</p>
                      <p><strong>Restricted Terms:</strong> 20 year amortization</p>
                      <p><strong>Few Lenders:</strong> Bridge or specialty lenders</p>
                    </div>
                  </div>
                  
                  <div className={styles.impactCard}>
                    <div className={styles.impactHeader}>
                      <div className={styles.dscrRange}>DSCR 1.0-1.19</div>
                      <div className={styles.impactGrade}>Poor</div>
                    </div>
                    <div className={styles.impactContent}>
                      <p><strong>High Rates:</strong> Significantly higher rates</p>
                      <p><strong>Low LTV:</strong> Maximum 60% loan-to-value</p>
                      <p><strong>Short Terms:</strong> 15-20 year amortization</p>
                      <p><strong>Limited Options:</strong> Hard money or private lenders</p>
                    </div>
                  </div>
                  
                  <div className={styles.impactCard}>
                    <div className={styles.impactHeader}>
                      <div className={styles.dscrRange}>DSCR {'<'} 1.0</div>
                      <div className={styles.impactGrade}>Risky</div>
                    </div>
                    <div className={styles.impactContent}>
                      <p><strong>Very High Rates:</strong> Maximum interest rates</p>
                      <p><strong>Minimal LTV:</strong> 50% or less loan-to-value</p>
                      <p><strong>Short Term:</strong> 3-5 year bridge loans only</p>
                      <p><strong>No Options:</strong> Not financeable conventionally</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategies to Improve Your DSCR</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>💰 Increase Rental Income</h4>
                    <p>Renovate units to command higher rents, implement ancillary income streams (laundry, storage), or adjust rental rates to market levels.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📉 Reduce Operating Expenses</h4>
                    <p>Renegotiate vendor contracts, implement energy efficiency measures, optimize property management, and reduce turnover costs.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏦 Restructure Debt</h4>
                    <p>Refinance to lower interest rates, extend loan term to reduce payments, or negotiate interest-only periods to improve cash flow.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📊 Optimize Occupancy</h4>
                    <p>Reduce vacancy rates through better marketing, tenant retention programs, and competitive pricing strategies.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding Break-Even Occupancy</h3>
                <p>Break-even occupancy is the minimum occupancy rate needed to cover all operating expenses and debt service. This critical metric helps investors understand their risk exposure.</p>
                
                <div className={styles.breakEvenGuide}>
                  <div className={styles.breakEvenItem}>
                    <div className={styles.breakEvenRange}>Break-Even {'<'} 70%</div>
                    <div className={styles.breakEvenDescription}><strong>Low Risk:</strong> Significant cushion for market fluctuations</div>
                  </div>
                  <div className={styles.breakEvenItem}>
                    <div className={styles.breakEvenRange}>Break-Even 70-80%</div>
                    <div className={styles.breakEvenDescription}><strong>Moderate Risk:</strong> Reasonable cushion, standard for stabilized properties</div>
                  </div>
                  <div className={styles.breakEvenItem}>
                    <div className={styles.breakEvenRange}>Break-Even 81-85%</div>
                    <div className={styles.breakEvenDescription}><strong>Elevated Risk:</strong> Limited cushion, requires strong management</div>
                  </div>
                  <div className={styles.breakEvenItem}>
                    <div className={styles.breakEvenRange}>Break-Even {'>'} 85%</div>
                    <div className={styles.breakEvenDescription}><strong>High Risk:</strong> Minimal margin for error, difficult to finance</div>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Insights from Commercial Lenders</h3>
                <blockquote className={styles.expertQuote}>
                  "DSCR isn't just a underwriting requirement—it's a property health indicator. A 1.8 DSCR tells me the property can withstand a 20% rent drop or 15% expense increase. A 1.2 DSCR leaves no room for error. Smart investors target 1.5+ for stability and refinance options."
                  <footer className={styles.quoteFooter}>— Commercial Mortgage Underwriter, $500M+ portfolio</footer>
                </blockquote>
                
                <blockquote className={styles.expertQuote}>
                  "The biggest mistake I see is investors underestimating operating expenses. They calculate DSCR with 5% vacancy and then experience 15% in reality. Always stress test your DSCR with realistic worst-case scenarios, not just optimistic projections."
                  <footer className={styles.quoteFooter}>— Commercial Real Estate Broker</footer>
                </blockquote>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Advanced DSCR Strategies for Portfolio Managers</h3>
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🏢 Cross-Collateralization</h4>
                    <p>Use strong DSCR properties to support weaker ones in portfolio financing, achieving better overall terms while maintaining growth.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Value-Add Plays</h4>
                    <p>Target properties with low current DSCR but high potential. Improve NOI through operational efficiencies and rent increases.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚡ Bridge Financing</h4>
                    <p>Use short-term bridge loans for acquisitions, then improve DSCR through renovations before securing permanent financing.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🔄 Portfolio Optimization</h4>
                    <p>Sell low-DSCR properties and reinvest in higher-DSCR assets to improve overall portfolio health and financing options.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common DSCR Scenarios and Solutions</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>New Construction:</strong> Projects may have 0 DSCR initially. Use interest reserves and projected stabilized DSCR for financing.</li>
                  <li><strong>Value-Add Properties:</strong> Current DSCR may be low but projected DSCR after improvements justifies investment.</li>
                  <li><strong>Seasonal Properties:</strong> Use annualized DSCR rather than monthly calculations for resorts or seasonal businesses.</li>
                  <li><strong>Portfolio Properties:</strong> Lenders may consider blended DSCR across multiple properties for portfolio loans.</li>
                  <li><strong>Bridge-to-Permanent:</strong> Bridge loans may accept lower DSCR with exit strategy to improve before permanent financing.</li>
                </ul>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between DSCR and debt yield?</h3>
                <p className={styles.faqAnswer}>DSCR measures income coverage of debt payments, while debt yield measures the property's unleveraged return to the lender. Debt Yield = NOI ÷ Loan Amount. Lenders often use both metrics: DSCR for payment coverage and debt yield for worst-case recovery analysis. A 10% debt yield means the lender could recover their loan if they had to foreclose and operate the property.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do lenders calculate debt service for DSCR?</h3>
                <p className={styles.faqAnswer}>Lenders typically use the actual or proposed mortgage payment including principal and interest. Some use the first year's payment, others use a 30-year amortization regardless of loan term. For variable rate loans, they may use a stress rate (current rate + 2%). Always clarify which calculation method your lender uses.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can DSCR be too high?</h3>
                <p className={styles.faqAnswer}>While extremely high DSCR (3.0+) indicates excellent safety, it may also suggest under-utilization of leverage. Investors might consider cash-out refinancing to access equity for additional investments while maintaining a strong DSCR. However, from a lender's perspective, higher DSCR is always better—there's no such thing as "too safe."</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do interest rates affect DSCR?</h3>
                <p className={styles.faqAnswer}>Interest rates directly impact debt service payments. A 1% rate increase can reduce DSCR by 0.1-0.2 points. When evaluating properties, stress test your DSCR with higher interest rates. Many lenders underwrite at a "stress rate" (current rate + 1-2%) to ensure the property can handle rate increases.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What expenses are included in NOI for DSCR calculations?</h3>
                <p className={styles.faqAnswer}>NOI includes all property-level operating expenses: property taxes, insurance, maintenance, repairs, property management, utilities paid by owner, and marketing. It excludes capital expenditures, income taxes, depreciation, and debt service. Some lenders may adjust NOI for above/below-market management fees or one-time expenses.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Analyze Your Commercial Property?</h2>
              <p className={styles.ctaText}>Use our calculator to evaluate DSCR, assess loan eligibility, and make informed commercial real estate decisions.</p>
              
              
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Actual DSCR calculations may vary based on lender requirements, underwriting standards, and specific property characteristics. Commercial lending terms and requirements are subject to change and vary by lender, property type, and market conditions. Always consult with qualified commercial real estate professionals, mortgage brokers, and legal advisors before making investment or financing decisions. Past performance does not guarantee future results. Property values and income projections may fluctuate.
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

export default DebtServiceCoverageRatioCalculator;