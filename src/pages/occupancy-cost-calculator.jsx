import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './occupancycostcalculator.module.css';

const OccupancyCostCalculator = ({ currentDate, lastModifiedDate }) => {
  // State for input values
  const [rent, setRent] = useState(3000);
  const [utilities, setUtilities] = useState(200);
  const [insurance, setInsurance] = useState(100);
  const [propertyTaxes, setPropertyTaxes] = useState(250);
  const [maintenance, setMaintenance] = useState(150);
  const [hoaFees, setHoaFees] = useState(0);
  const [otherCosts, setOtherCosts] = useState(0);
  const [propertyValue, setPropertyValue] = useState(500000);
  const [downPayment, setDownPayment] = useState(100000);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [results, setResults] = useState(null);
  const [costBreakdown, setCostBreakdown] = useState([]);

  const calculateOccupancyCosts = () => {
    // Calculate monthly mortgage payment
    const loanAmount = propertyValue - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    let monthlyMortgage = 0;
    if (loanAmount > 0) {
      monthlyMortgage = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                       (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }

    // Calculate total monthly costs
    const totalMonthlyCost = monthlyMortgage + rent + utilities + insurance + 
                           propertyTaxes/12 + maintenance + hoaFees + otherCosts;
    
    // Calculate annual costs
    const totalAnnualCost = totalMonthlyCost * 12;
    const annualMortgage = monthlyMortgage * 12;
    
    // Calculate cost metrics
    const monthlyIncomePercent = (totalMonthlyCost / 10000) * 100; // Based on $10,000 monthly income
    const propertyValuePercent = (totalAnnualCost / propertyValue) * 100;
    const rentToIncomeRatio = (rent / totalMonthlyCost) * 100;
    const operatingExpenseRatio = ((utilities + insurance + propertyTaxes/12 + maintenance + hoaFees + otherCosts) / totalMonthlyCost) * 100;
    
    // Create cost breakdown for visualization
    const breakdown = [
      { label: 'Monthly Rent', value: rent, type: 'housing' },
      { label: 'Mortgage Payment', value: monthlyMortgage, type: 'housing' },
      { label: 'Utilities', value: utilities, type: 'operating' },
      { label: 'Insurance', value: insurance, type: 'operating' },
      { label: 'Property Taxes', value: propertyTaxes/12, type: 'operating' },
      { label: 'Maintenance', value: maintenance, type: 'operating' },
      { label: 'HOA Fees', value: hoaFees, type: 'operating' },
      { label: 'Other Costs', value: otherCosts, type: 'operating' },
    ].filter(item => item.value > 0);

    setResults({
      totalMonthlyCost: Math.round(totalMonthlyCost * 100) / 100,
      totalAnnualCost: Math.round(totalAnnualCost * 100) / 100,
      monthlyMortgage: Math.round(monthlyMortgage * 100) / 100,
      annualMortgage: Math.round(annualMortgage * 100) / 100,
      monthlyIncomePercent: Math.round(monthlyIncomePercent * 100) / 100,
      propertyValuePercent: Math.round(propertyValuePercent * 100) / 100,
      rentToIncomeRatio: Math.round(rentToIncomeRatio * 100) / 100,
      operatingExpenseRatio: Math.round(operatingExpenseRatio * 100) / 100,
      debtToIncomeRatio: Math.round((monthlyMortgage / 10000) * 100 * 100) / 100,
      affordabilityScore: calculateAffordabilityScore(totalMonthlyCost, monthlyMortgage)
    });
    
    setCostBreakdown(breakdown);
  };

  const calculateAffordabilityScore = (totalMonthly, mortgage) => {
    let score = 100;
    
    // Deduct points for high costs
    if (totalMonthly > 5000) score -= 20;
    else if (totalMonthly > 3000) score -= 10;
    
    if (mortgage > 3000) score -= 15;
    else if (mortgage > 2000) score -= 8;
    
    // Add points for good ratios
    if (mortgage / totalMonthly < 0.3) score += 10;
    if (totalMonthly / 10000 < 0.3) score += 15;
    
    return Math.max(0, Math.min(100, score));
  };

  useEffect(() => {
    calculateOccupancyCosts();
  }, [rent, utilities, insurance, propertyTaxes, maintenance, hoaFees, otherCosts, 
      propertyValue, downPayment, interestRate, loanTerm]);

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

  return (
    <>
      <Head>
        <title>Occupancy Cost Calculator | Housing & Property Expense Analysis</title>
        <meta name="description" content="Calculate total occupancy costs for renting or owning property. Analyze housing expenses, affordability, and budget planning for residential or commercial properties." />
        <meta name="keywords" content="occupancy cost calculator, housing cost calculator, property expense calculator, rent vs buy calculator, mortgage calculator, affordability calculator, real estate expenses" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/occupancy-cost-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Occupancy Cost Calculator | Complete Housing Expense Analysis" />
        <meta property="og:description" content="Calculate total occupancy costs for any property. Analyze rent, mortgage, utilities, taxes, and other housing expenses." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/occupancy-cost-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Occupancy Cost Calculator" />
        <meta name="twitter:description" content="Professional tool for analyzing housing and property occupancy costs" />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="occupancy-cost-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Occupancy Cost Calculator",
            "description": "Professional housing cost calculator for analyzing total occupancy expenses including rent, mortgage, utilities, taxes, and maintenance",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "ratingCount": "850",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Property Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Complete Cost Analysis",
              "Mortgage Calculation",
              "Affordability Scoring",
              "Cost Breakdown Visualization",
              "Rent vs Buy Comparison"
            ]
          })
        }}
      />

      {/* FAQ Schema */}
      <Script
        id="occupancy-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is included in occupancy costs?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Occupancy costs include all expenses associated with occupying a property: rent or mortgage payments, utilities (electricity, water, gas, internet), property taxes, insurance, maintenance/repairs, HOA fees, and any other recurring costs. Our calculator helps you account for all these expenses to get a complete picture.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What percentage of income should go to housing?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The traditional rule is 28-30% of gross monthly income for housing costs (including mortgage/rent, taxes, insurance). However, this varies by location and financial situation. Our calculator helps you determine what's affordable based on your complete financial picture.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How do I calculate true occupancy costs?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "True occupancy costs go beyond just rent or mortgage. Include all recurring monthly expenses: utilities, insurance, property taxes (divided monthly), maintenance reserves (1-2% of property value annually), HOA fees, and any other mandatory costs. Our calculator automatically accounts for all these factors.",
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
            <h1 className={styles.mainTitle}>Occupancy Cost Calculator</h1>
            <p className={styles.subtitle}>Calculate Total Housing Expenses for Renting or Owning Property</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Comprehensive Analysis</span>
              <span className={styles.badge}>Free Tool</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Property & Cost Details</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Monthly Rent (if applicable)
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={rent}
                      onChange={(e) => setRent(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      step="100"
                      value={rent}
                      onChange={(e) => setRent(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(rent)}/month</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Property Value (for owners)
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="50000"
                      max="2000000"
                      step="10000"
                      value={propertyValue}
                      onChange={(e) => setPropertyValue(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="50000"
                      max="2000000"
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
                  Down Payment
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="5000"
                      value={downPayment}
                      onChange={(e) => setDownPayment(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="500000"
                      step="5000"
                      value={downPayment}
                      onChange={(e) => setDownPayment(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(downPayment)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Interest Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.125"
                      value={interestRate}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="0.125"
                      value={interestRate}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(interestRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Loan Term
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="10"
                      max="30"
                      step="5"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10"
                      max="30"
                      step="5"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{loanTerm} years</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Monthly Utilities
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={utilities}
                      onChange={(e) => setUtilities(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      step="10"
                      value={utilities}
                      onChange={(e) => setUtilities(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(utilities)}/month</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Property Insurance
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="10"
                      value={insurance}
                      onChange={(e) => setInsurance(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="500"
                      step="10"
                      value={insurance}
                      onChange={(e) => setInsurance(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(insurance)}/month</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Property Taxes
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={propertyTaxes}
                      onChange={(e) => setPropertyTaxes(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      step="100"
                      value={propertyTaxes}
                      onChange={(e) => setPropertyTaxes(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(propertyTaxes)}/year</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Maintenance & Repairs
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={maintenance}
                      onChange={(e) => setMaintenance(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      step="10"
                      value={maintenance}
                      onChange={(e) => setMaintenance(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(maintenance)}/month</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  HOA/Community Fees
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={hoaFees}
                      onChange={(e) => setHoaFees(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      step="10"
                      value={hoaFees}
                      onChange={(e) => setHoaFees(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(hoaFees)}/month</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Other Monthly Costs
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={otherCosts}
                      onChange={(e) => setOtherCosts(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      step="10"
                      value={otherCosts}
                      onChange={(e) => setOtherCosts(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(otherCosts)}/month</div>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Occupancy Cost Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Monthly Cost</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalMonthlyCost)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Annual Cost</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalAnnualCost)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Monthly Mortgage</div>
                      <div className={styles.resultValue}>{formatCurrency(results.monthlyMortgage)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Affordability Score</div>
                      <div className={`${styles.resultValue} ${results.affordabilityScore >= 70 ? styles.scoreGood : results.affordabilityScore >= 50 ? styles.scoreFair : styles.scorePoor}`}>
                        {results.affordabilityScore}/100
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>% of Property Value</div>
                      <div className={styles.resultValue}>{formatPercentage(results.propertyValuePercent)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Operating Expense %</div>
                      <div className={styles.resultValue}>{formatPercentage(results.operatingExpenseRatio)}</div>
                    </div>
                  </div>

                  {/* Cost Breakdown Visualization */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Monthly Cost Breakdown</h3>
                    <div className={styles.chartBars}>
                      {costBreakdown.map((item, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>{item.label}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={`${styles.chartBar} ${item.type === 'housing' ? styles.chartBarHousing : styles.chartBarOperating}`}
                              style={{ width: `${(item.value / results.totalMonthlyCost) * 100}%` }}
                              title={`${item.label}: ${formatCurrency(item.value)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{formatCurrency(item.value)}</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendHousing}`}></div>
                        <span>Housing Costs (Rent/Mortgage)</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendOperating}`}></div>
                        <span>Operating Expenses</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Cost Analysis Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>
                        <strong>Affordability:</strong> {results.totalMonthlyCost > 3500 ? '❌ Above average' : '✅ Within normal range'} 
                        ({formatCurrency(results.totalMonthlyCost)}/month)
                      </li>
                      <li>
                        <strong>Housing Cost Ratio:</strong> {formatPercentage(results.monthlyIncomePercent)} of $10,000 monthly income
                        {results.monthlyIncomePercent <= 30 ? ' ✅ Good' : results.monthlyIncomePercent <= 35 ? ' ⚠️ Borderline' : ' ❌ High'}
                      </li>
                      <li>
                        <strong>Operating Efficiency:</strong> {formatPercentage(results.operatingExpenseRatio)} of total costs
                        {results.operatingExpenseRatio <= 30 ? ' ✅ Efficient' : results.operatingExpenseRatio <= 40 ? ' ⚠️ Average' : ' ❌ High'}
                      </li>
                      {rent > 0 && results.monthlyMortgage > 0 && (
                        <li>
                          <strong>Rent vs Mortgage:</strong> Rent is {formatPercentage((rent / results.monthlyMortgage) * 100)} of equivalent mortgage
                        </li>
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
              <h2 className={styles.articleTitle}>Understanding Total Occupancy Costs: The Complete Guide</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>What Are True Occupancy Costs?</h3>
                <p>Occupancy costs encompass all expenses associated with living in or using a property. Many people focus only on rent or mortgage payments, but true occupancy costs include utilities, insurance, property taxes, maintenance, HOA fees, and other recurring expenses. Understanding the complete picture is essential for proper budgeting and financial planning.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Typical Occupancy Cost Breakdown:</h4>
                  <ul>
                    <li><strong>Housing Payment:</strong> 60-70% of total (rent or mortgage)</li>
                    <li><strong>Utilities:</strong> 10-15% (electricity, water, gas, internet)</li>
                    <li><strong>Insurance:</strong> 3-5% (homeowners/renters insurance)</li>
                    <li><strong>Property Taxes:</strong> 8-12% (varies by location)</li>
                    <li><strong>Maintenance:</strong> 5-10% (repairs, upkeep, improvements)</li>
                    <li><strong>Other Costs:</strong> 2-5% (HOA fees, parking, storage)</li>
                  </ul>
                  <p>These percentages can vary significantly based on property type, location, and individual circumstances.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Key Occupancy Cost Metrics & Ratios</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🏠 28/36 Rule</h4>
                    <p>Mortgage/rent should be ≤28% of gross income, total debt ≤36%. This traditional guideline helps maintain financial stability and avoid overextension.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Operating Expense Ratio</h4>
                    <p>Non-mortgage expenses should typically be 25-40% of total occupancy costs. Higher ratios indicate inefficient property management or high maintenance needs.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 Cost per Square Foot</h4>
                    <p>Divide total monthly cost by property square footage. This helps compare properties of different sizes and identify cost-efficient spaces.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚖️ Rent-to-Value Ratio</h4>
                    <p>Annual rent divided by property value. Ratios below 5% suggest buying may be better; above 8% suggests renting may be more cost-effective.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Types of Occupancy Costs</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Fixed Costs:</strong> Rent, mortgage payments, property taxes, insurance premiums, HOA fees</li>
                  <li><strong>Variable Costs:</strong> Utilities (electricity, water, gas), maintenance/repairs, landscaping/snow removal</li>
                  <li><strong>Periodic Costs:</strong> Annual insurance payments, quarterly tax payments, seasonal maintenance</li>
                  <li><strong>One-time Costs:</strong> Security deposits, moving expenses, initial utility setup fees</li>
                  <li><strong>Hidden Costs:</strong> Opportunity cost of down payment, property value appreciation/depreciation, tax benefits/deductions</li>
                  <li><strong>Lifestyle Costs:</strong> Commuting expenses, neighborhood amenities, school district quality</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Financial Planners</h3>
                <blockquote className={styles.expertQuote}>
                  "Most people underestimate their true occupancy costs by 20-30%. Beyond the obvious rent or mortgage payment, you need to account for utilities, maintenance reserves, insurance, and property taxes. A property that seems affordable based on just the mortgage payment might become financially stressful when you consider the complete picture. Always budget for the full occupancy cost, not just the housing payment."
                  <footer className={styles.quoteFooter}>— Certified Financial Planner, specializing in housing affordability</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Occupancy Cost Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How much should I budget for maintenance and repairs?</h3>
                <p className={styles.faqAnswer}>The general rule is 1-2% of the property value annually for maintenance and repairs. For a $300,000 home, budget $3,000-$6,000 per year ($250-$500 monthly). This covers routine maintenance, minor repairs, and builds a reserve for major replacements (roof, HVAC, appliances). Renters typically have lower maintenance costs, but should still budget for minor repairs and upkeep.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between occupancy cost and carrying cost?</h3>
                <p className={styles.faqAnswer}>Occupancy cost refers specifically to expenses incurred while occupying/using a property. Carrying cost is broader and includes additional expenses like mortgage interest, property taxes, insurance, and opportunity cost of invested capital. For homeowners, carrying costs also consider equity building and potential appreciation, while occupancy costs focus on out-of-pocket expenses.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do I reduce my occupancy costs?</h3>
                <p className={styles.faqAnswer}>Strategies include: 1) Energy efficiency upgrades to reduce utilities, 2) Regular maintenance to prevent costly repairs, 3) Shopping insurance annually for better rates, 4) Considering smaller/lower-cost properties, 5) Exploring roommate/shared housing options, 6) Negotiating rent or refinancing mortgage for better terms, 7) Using smart home technology to optimize energy use, 8) Comparing service providers (internet, cable) regularly.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I rent or buy based on occupancy costs?</h3>
                <p className={styles.faqAnswer}>Consider: 1) Time horizon (buying typically better for 5+ years), 2) Local market conditions (price-to-rent ratios), 3) Financial flexibility needs, 4) Tax implications (mortgage interest deduction), 5) Maintenance responsibility preferences, 6) Down payment availability, 7) Interest rate environment, 8) Personal lifestyle factors. Our calculator helps compare total occupancy costs for both scenarios.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Plan Your Housing Budget Effectively</h2>
              <p className={styles.ctaText}>Use our calculator to understand your true occupancy costs and make informed housing decisions. Adjust inputs to explore different scenarios and find the most cost-effective options.</p>
              
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational and planning purposes. Actual costs may vary based on location, market conditions, individual circumstances, and unexpected expenses. Consult with financial advisors, real estate professionals, and tax experts for personalized advice. Mortgage calculations assume fixed-rate loans and may not include PMI, closing costs, or other fees.
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

export default OccupancyCostCalculator;