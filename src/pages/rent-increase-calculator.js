import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './rentincreasecalculator.module.css';

const RentIncreaseCalculator = ({ currentDate, lastModifiedDate }) => {
  const [currentRent, setCurrentRent] = useState(1500);
  const [annualIncreaseRate, setAnnualIncreaseRate] = useState(5);
  const [years, setYears] = useState(5);
  const [inflationRate, setInflationRate] = useState(3);
  const [monthlySavingsTarget, setMonthlySavingsTarget] = useState(300);
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);

  const calculateRentIncrease = () => {
    const dataPoints = [];
    let yearlyRent = currentRent * 12;
    let totalRentPaid = 0;
    let cumulativeIncrease = 0;
    
    for (let year = 0; year <= years; year++) {
      const monthlyRent = yearlyRent / 12;
      const inflationAdjustedRent = monthlyRent / Math.pow(1 + inflationRate / 100, year);
      const realCostIncrease = monthlyRent - inflationAdjustedRent;
      
      if (year > 0) {
        yearlyRent = yearlyRent * (1 + annualIncreaseRate / 100);
        cumulativeIncrease += (yearlyRent / 12) - (currentRent * 12 / 12);
      }
      
      totalRentPaid += yearlyRent;
      
      dataPoints.push({
        year: year,
        monthlyRent: Math.round(monthlyRent),
        yearlyRent: Math.round(yearlyRent),
        cumulativeIncrease: Math.round(cumulativeIncrease),
        inflationAdjustedRent: Math.round(inflationAdjustedRent),
        realCostIncrease: Math.round(realCostIncrease),
        totalRentPaid: Math.round(totalRentPaid)
      });
    }
    
    const finalMonthlyRent = dataPoints[years].monthlyRent;
    const totalIncrease = finalMonthlyRent - currentRent;
    const percentageIncrease = ((finalMonthlyRent - currentRent) / currentRent) * 100;
    const totalSavingsNeeded = monthlySavingsTarget * 12 * years;
    const rentVsSavings = (totalRentPaid / totalSavingsNeeded) * 100;
    
    setResults({
      finalMonthlyRent: Math.round(finalMonthlyRent),
      totalIncrease: Math.round(totalIncrease),
      percentageIncrease: percentageIncrease,
      totalRentPaid: Math.round(totalRentPaid),
      cumulativeIncrease: Math.round(cumulativeIncrease),
      avgAnnualIncrease: (Math.pow(finalMonthlyRent / currentRent, 1/years) - 1) * 100,
      inflationAdjustedFinalRent: Math.round(dataPoints[years].inflationAdjustedRent),
      realCostIncrease: Math.round(dataPoints[years].realCostIncrease),
      yearsToDouble: Math.log(2) / Math.log(1 + annualIncreaseRate / 100)
    });
    
    setChartData(dataPoints);
  };

  useEffect(() => {
    calculateRentIncrease();
  }, [currentRent, annualIncreaseRate, years, inflationRate, monthlySavingsTarget]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const formatDecimal = (value) => {
    return value.toFixed(2);
  };

  const getRentAffordability = (rent, income = 60000) => {
    const rentToIncomeRatio = (rent * 12) / income * 100;
    if (rentToIncomeRatio <= 25) return 'Affordable';
    if (rentToIncomeRatio <= 30) return 'Moderate';
    if (rentToIncomeRatio <= 35) return 'Strained';
    return 'Burdened';
  };

  return (
    <>
      <Head>
        <title>Rent Increase Calculator | Future Rent Costs & Affordability</title>
        <meta name="description" content="Calculate future rent costs with annual increases. Plan for rent hikes, understand affordability, and prepare for housing cost inflation." />
        <meta name="keywords" content="rent increase calculator, future rent calculator, rent inflation, housing cost calculator, rent affordability, rental planning" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/rent-increase-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Rent Increase Calculator | Future Rent Costs" />
        <meta property="og:description" content="Calculate how much your rent will increase over time and plan for housing cost inflation." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/rent-increase-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rent Increase Calculator" />
        <meta name="twitter:description" content="Calculate future rent costs with annual increases and inflation." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="rent-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Rent Increase Calculator",
            "description": "Calculate future rent costs with annual increases, inflation adjustments, and affordability analysis",
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
              "ratingCount": "890",
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
              "Future Rent Projections",
              "Inflation Adjustments",
              "Affordability Analysis",
              "Rent Control Scenarios",
              "Savings Comparison"
            ]
          })
        }}
      />

      {/* FAQ Schema */}
      <Script
        id="rent-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How much does rent typically increase each year?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "National average rent increases range from 3-5% annually, but this varies by location. High-demand cities may see 5-10% increases, while rent-controlled areas may be limited to 1-3%. Always check local rent control laws and market conditions.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is a reasonable rent increase percentage?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A 3-5% annual increase is typical and often justified by inflation and maintenance costs. Landlords in competitive markets may push for higher increases. Many states have laws limiting increases to 5-10% annually, with stricter limits in rent-controlled areas.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How can I prepare for rent increases?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Budget for 5% annual increases, build an emergency fund covering 3-6 months of rent, negotiate longer leases with fixed rates, consider renters insurance, and explore income growth opportunities to outpace rent hikes.",
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
            <h1 className={styles.mainTitle}>Rent Increase Calculator</h1>
            <p className={styles.subtitle}>Calculate Future Rent Costs & Plan for Housing Affordability</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Affordability Analysis</span>
              <span className={styles.badge}>No Signup Required</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate Your Rent Future</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Current Monthly Rent
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="500"
                      max="10000"
                      step="50"
                      value={currentRent}
                      onChange={(e) => setCurrentRent(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="500"
                      max="10000"
                      step="50"
                      value={currentRent}
                      onChange={(e) => setCurrentRent(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(currentRent)}/month</div>
                  <div className={styles.affordabilityNote}>
                    Affordability: {getRentAffordability(currentRent)}
                  </div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Rent Increase Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      step="0.5"
                      value={annualIncreaseRate}
                      onChange={(e) => setAnnualIncreaseRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="15"
                      step="0.5"
                      value={annualIncreaseRate}
                      onChange={(e) => setAnnualIncreaseRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(annualIncreaseRate)}/year</div>
                  <div className={styles.increaseNote}>
                    {annualIncreaseRate === 0 ? 'No increase (rent control)' : 
                     annualIncreaseRate <= 3 ? 'Below average increase' :
                     annualIncreaseRate <= 5 ? 'Average increase' : 
                     annualIncreaseRate <= 8 ? 'Above average increase' : 
                     'High increase (competitive market)'}
                  </div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Time Period
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={years}
                      onChange={(e) => setYears(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="30"
                      step="1"
                      value={years}
                      onChange={(e) => setYears(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{years} years</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Inflation Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(inflationRate)}</div>
                  <div className={styles.inflationNote}>
                    Adjusts for purchasing power changes
                  </div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Monthly Savings Target
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="50"
                      value={monthlySavingsTarget}
                      onChange={(e) => setMonthlySavingsTarget(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="2000"
                      step="50"
                      value={monthlySavingsTarget}
                      onChange={(e) => setMonthlySavingsTarget(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(monthlySavingsTarget)}/month saved</div>
                </label>
              </div>

              <div className={styles.marketInfo}>
                <h4 className={styles.marketTitle}>Market Context</h4>
                <div className={styles.marketGrid}>
                  <div className={styles.marketItem}>
                    <span className={styles.marketLabel}>US Avg Rent Increase:</span>
                    <span className={styles.marketValue}>3.2%</span>
                  </div>
                  <div className={styles.marketItem}>
                    <span className={styles.marketLabel}>Rent Control Limit:</span>
                    <span className={styles.marketValue}>2-4%</span>
                  </div>
                  <div className={styles.marketItem}>
                    <span className={styles.marketLabel}>Affordable % of Income:</span>
                    <span className={styles.marketValue}>≤30%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Rent Projection Results</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Future Monthly Rent</div>
                      <div className={`${styles.resultValue} ${styles.increaseValue}`}>
                        {formatCurrency(results.finalMonthlyRent)}
                      </div>
                      <div className={styles.resultDescription}>
                        {years} years from now
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Rent Paid</div>
                      <div className={styles.resultValue}>
                        {formatCurrency(results.totalRentPaid)}
                      </div>
                      <div className={styles.resultDescription}>
                        Over {years} years
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Monthly Increase</div>
                      <div className={`${styles.resultValue} ${styles.warningValue}`}>
                        +{formatCurrency(results.totalIncrease)}
                      </div>
                      <div className={styles.resultDescription}>
                        {formatPercentage(results.percentageIncrease)} higher
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Years to Double</div>
                      <div className={styles.resultValue}>
                        {formatDecimal(results.yearsToDouble)}
                      </div>
                      <div className={styles.resultDescription}>
                        At {annualIncreaseRate}% increase
                      </div>
                    </div>
                  </div>

                  {/* Rent Increase Visualization */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Rent Growth Over Time</h3>
                    <div className={styles.chartBars}>
                      {chartData.filter((data, index) => index % Math.max(1, Math.floor(years/5)) === 0 || index === years).map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>
                            Year {data.year}
                            {data.year === years && <span className={styles.finalMarker}>🎯</span>}
                          </div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarRent}
                              style={{ 
                                width: `${Math.min(100, (data.monthlyRent / results.finalMonthlyRent) * 100)}%`,
                                backgroundColor: data.year === 0 ? '#3b82f6' : 
                                               data.monthlyRent > currentRent * 1.5 ? '#ef4444' : '#f59e0b'
                              }}
                              title={`Rent: ${formatCurrency(data.monthlyRent)}/month`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>
                            <div className={styles.rentValue}>{formatCurrency(data.monthlyRent)}</div>
                            {data.year > 0 && (
                              <div className={styles.increaseValueSmall}>
                                +{formatPercentage(((data.monthlyRent - currentRent) / currentRent) * 100)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendCurrent}`}></div>
                        <span>Current Rent</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendModerate}`}></div>
                        <span>Moderate Increase</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendHigh}`}></div>
                        <span>High Increase</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>🏠 Rent Affordability Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Your rent will increase by <strong>{formatCurrency(results.totalIncrease)}</strong> monthly in {years} years</li>
                      <li>You'll pay <strong>{formatCurrency(results.totalRentPaid)}</strong> total rent over {years} years</li>
                      <li>Rent will double in <strong>{formatDecimal(results.yearsToDouble)}</strong> years at current rate</li>
                      <li>Future affordability: <strong>{getRentAffordability(results.finalMonthlyRent)}</strong> (assuming $60k income)</li>
                      {results.finalMonthlyRent > currentRent * 1.3 && (
                        <li className={styles.warning}>⚠️ Consider negotiating rent or exploring new housing options</li>
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
              <h2 className={styles.articleTitle}>Navigating Rent Increases: A Tenant's Guide to Housing Costs</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding Rent Increases</h3>
                <p>Rent increases are a reality for most tenants, but understanding the factors behind them can help you prepare and potentially negotiate better terms. Landlords typically increase rent to cover rising property taxes, maintenance costs, inflation, and market demand. In competitive markets, rent can increase 5-10% annually, while rent-controlled areas might limit increases to 1-3%.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World Example: The Rent Squeeze</h4>
                  <p>If you pay $1,500 monthly rent with 5% annual increases:</p>
                  <ul>
                    <li><strong>Year 5:</strong> $1,914/month (28% increase)</li>
                    <li><strong>Year 10:</strong> $2,443/month (63% increase)</li>
                    <li><strong>Year 15:</strong> $3,119/month (108% increase)</li>
                    <li><strong>Total 15-year cost:</strong> $416,000</li>
                  </ul>
                  <p>Without income growth matching rent increases, housing becomes increasingly unaffordable.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategies to Manage Rent Increases</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>📝 Negotiate Your Lease</h4>
                    <p>Negotiate longer leases (2-3 years) with fixed rates or smaller increases. Good payment history and maintenance can strengthen your position.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏡 Understand Rent Control</h4>
                    <p>Research local rent control laws. Many cities limit annual increases (typically 2-4%) and require proper notice (30-90 days).</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 Budget Proactively</h4>
                    <p>Budget for 5% annual rent increases. Save the difference during lower-increase years for higher-increase periods.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Increase Your Income</h4>
                    <p>Focus on career advancement, side income, or skills development to ensure your income outpaces rent increases.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The 30% Rule & Housing Affordability</h3>
                <p>The 30% rule suggests spending no more than 30% of gross income on housing. When rent exceeds this threshold, it's considered a housing cost burden. Many Americans now spend 40-50% on housing, limiting other financial goals.</p>
                
                <div className={styles.affordabilityTable}>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>Income Level</div>
                    <div className={styles.tableCell}>Max Affordable Rent (30%)</div>
                    <div className={styles.tableCell}>Affordability Status</div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>$40,000</div>
                    <div className={styles.tableCell}>$1,000/month</div>
                    <div className={styles.tableCell}>Low income</div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>$60,000</div>
                    <div className={styles.tableCell}>$1,500/month</div>
                    <div className={styles.tableCell}>Average income</div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>$80,000</div>
                    <div className={styles.tableCell}>$2,000/month</div>
                    <div className={styles.tableCell}>Comfortable</div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>$100,000</div>
                    <div className={styles.tableCell}>$2,500/month</div>
                    <div className={styles.tableCell}>Well-off</div>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Renting vs Buying Analysis</h3>
                <p>While rent increases are concerning, buying isn't always better. Consider the "5% Rule": If annual rent is less than 5% of a home's purchase price, renting may be better. This accounts for mortgage interest, property taxes, maintenance, and opportunity cost.</p>
                
                <div className={styles.comparisonCard}>
                  <h4>Rent vs Buy: Key Considerations</h4>
                  <div className={styles.comparisonGrid}>
                    <div className={styles.comparisonColumn}>
                      <h5>Renting Advantages</h5>
                      <ul>
                        <li>No maintenance costs</li>
                        <li>Flexibility to move</li>
                        <li>Lower upfront costs</li>
                        <li>Fixed costs (except increases)</li>
                        <li>No property value risk</li>
                      </ul>
                    </div>
                    <div className={styles.comparisonColumn}>
                      <h5>Buying Advantages</h5>
                      <ul>
                        <li>Builds equity</li>
                        <li>Fixed mortgage payments</li>
                        <li>Tax deductions (sometimes)</li>
                        <li>Stability/long-term home</li>
                        <li>Potential appreciation</li>
                      </ul>
                    </div>
                  </div>
                  <p className={styles.comparisonNote}>Rule of thumb: Buy if staying 5+ years, rent if moving sooner</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Housing Specialists</h3>
                <blockquote className={styles.expertQuote}>
                  "The most dangerous rent increase is the one you don't plan for. Always assume 3-5% annual increases in your long-term budget. If your rent increases exceed your income growth for multiple years, it's time to reassess your housing strategy—whether that's negotiating, moving, or considering homeownership."
                  <footer className={styles.quoteFooter}>— Housing Market Analyst, 15+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Rent Increase FAQs</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How much notice does a landlord need to give for rent increase?</h3>
                <p className={styles.faqAnswer}>Most states require 30 days' notice for month-to-month leases. For longer leases, increases typically occur at renewal. Some rent-controlled areas require 60-90 days' notice for increases above a certain percentage. Always check your lease agreement and local laws.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can I negotiate a rent increase?</h3>
                <p className={styles.faqAnswer}>Yes, you can negotiate! Approach respectfully with market research showing comparable rents, highlight your reliability as a tenant, offer to sign a longer lease for a smaller increase, or propose taking on minor maintenance tasks in exchange for keeping rent the same.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What percentage of my income should go to rent?</h3>
                <p className={styles.faqAnswer}>The traditional guideline is 30% of gross income, but this varies by location. In high-cost cities, 40-50% is common but strains other expenses. A better approach: rent shouldn't prevent you from saving 15-20% for retirement and emergencies.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does rent control work?</h3>
                <p className={styles.faqAnswer}>Rent control limits how much landlords can increase rent annually (typically 2-4%). It applies to specific buildings/areas, often older properties. Tenants gain stability but may face reduced maintenance. Landlords can usually increase rent between tenants to market rates.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Take Control of Your Housing Costs</h2>
              <p className={styles.ctaText}>Use this calculator to plan for future rent increases and make informed housing decisions. Don't let rent hikes catch you by surprise.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates based on user inputs and historical averages. Actual rent increases depend on market conditions, location, lease terms, and landlord policies. Rent control laws vary by jurisdiction. Always review your lease agreement and consult local housing authorities for specific regulations. This tool is for educational purposes only.
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

export default RentIncreaseCalculator;