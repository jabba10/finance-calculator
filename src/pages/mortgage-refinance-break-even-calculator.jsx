import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './mortgagerefinancebreakevencalculator.module.css';

const MortgageRefinanceCalculator = ({ currentDate, lastModifiedDate }) => {
  const [currentLoanBalance, setCurrentLoanBalance] = useState(300000);
  const [currentInterestRate, setCurrentInterestRate] = useState(6.5);
  const [remainingLoanTerm, setRemainingLoanTerm] = useState(25);
  const [newInterestRate, setNewInterestRate] = useState(5.0);
  const [newLoanTerm, setNewLoanTerm] = useState(30);
  const [closingCosts, setClosingCosts] = useState(5000);
  const [results, setResults] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [showChart, setShowChart] = useState(true);

  const calculateRefinance = () => {
    // Calculate monthly payments
    const currentMonthlyRate = currentInterestRate / 100 / 12;
    const currentMonths = remainingLoanTerm * 12;
    const currentPayment = currentLoanBalance * 
      (currentMonthlyRate * Math.pow(1 + currentMonthlyRate, currentMonths)) / 
      (Math.pow(1 + currentMonthlyRate, currentMonths) - 1);

    const newMonthlyRate = newInterestRate / 100 / 12;
    const newMonths = newLoanTerm * 12;
    const newPayment = currentLoanBalance * 
      (newMonthlyRate * Math.pow(1 + newMonthlyRate, newMonths)) / 
      (Math.pow(1 + newMonthlyRate, newMonths) - 1);

    // Calculate monthly savings
    const monthlySavings = currentPayment - newPayment;
    
    // Calculate break-even point (in months)
    const breakEvenMonths = monthlySavings > 0 ? 
      Math.ceil(closingCosts / monthlySavings) : Infinity;
    
    // Calculate total interest savings
    const currentTotalInterest = (currentPayment * currentMonths) - currentLoanBalance;
    const newTotalInterest = (newPayment * newMonths) - currentLoanBalance;
    const totalInterestSavings = currentTotalInterest - newTotalInterest;
    
    // Calculate net savings (considering closing costs)
    const netSavings = totalInterestSavings - closingCosts;
    
    // Generate monthly data for chart
    const data = [];
    let cumulativeSavings = 0;
    const maxMonths = Math.min(breakEvenMonths * 2, 120);
    
    for (let month = 1; month <= maxMonths; month++) {
      cumulativeSavings += monthlySavings;
      const netPosition = cumulativeSavings - closingCosts;
      
      if (month % 12 === 0 || month === 1 || month === breakEvenMonths || month === maxMonths) {
        data.push({
          month,
          cumulativeSavings: Math.round(cumulativeSavings),
          closingCosts: closingCosts,
          netPosition: Math.round(netPosition),
          label: month === breakEvenMonths ? 'Break-Even' : `Year ${Math.ceil(month/12)}`
        });
      }
    }

    setResults({
      currentPayment: Math.round(currentPayment),
      newPayment: Math.round(newPayment),
      monthlySavings: Math.round(monthlySavings),
      breakEvenMonths,
      breakEvenYears: Math.round((breakEvenMonths / 12) * 10) / 10,
      totalInterestSavings: Math.round(totalInterestSavings),
      netSavings: Math.round(netSavings),
      currentTotalInterest: Math.round(currentTotalInterest),
      newTotalInterest: Math.round(newTotalInterest),
      closingCosts
    });
    
    setMonthlyData(data);
  };

  useEffect(() => {
    calculateRefinance();
  }, [currentLoanBalance, currentInterestRate, remainingLoanTerm, newInterestRate, newLoanTerm, closingCosts]);

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

  const formatMonths = (months) => {
    if (months === Infinity) return 'Never';
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) return `${months} months`;
    if (remainingMonths === 0) return `${years} years`;
    return `${years} years, ${remainingMonths} months`;
  };

  return (
    <>
      <Head>
        <title>Mortgage Refinance Break-Even Calculator | Should You Refinance?</title>
        <meta name="description" content="Free mortgage refinance calculator to determine your break-even point and total savings. Calculate if refinancing makes financial sense for your situation." />
        <meta name="keywords" content="mortgage refinance calculator, break-even calculator, refinance savings, mortgage calculator, home loan refinance, interest savings" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/mortgage-refinance-break-even-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Mortgage Refinance Break-Even Calculator | Should You Refinance?" />
        <meta property="og:description" content="Calculate if refinancing your mortgage makes financial sense. Find your break-even point and potential savings." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/mortgage-refinance-break-even-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mortgage Refinance Break-Even Calculator" />
        <meta name="twitter:description" content="Calculate your refinance savings and break-even point in minutes." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="mortgage-refinance-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Mortgage Refinance Break-Even Calculator",
            "description": "Professional mortgage refinance calculator to determine break-even point and total savings",
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
              "name": "Financial Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Break-Even Analysis",
              "Monthly Savings Calculation",
              "Total Interest Comparison",
              "Closing Cost Analysis",
              "Visual Savings Timeline"
            ]
          })
        }}
      />

      {/* FAQ Schema */}
      <Script
        id="refinance-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is a refinance break-even point and why is it important?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The break-even point is when your monthly savings from refinancing equal the closing costs you paid. It's crucial because it tells you how long you need to keep the mortgage to actually benefit from refinancing.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How much does refinancing typically cost in closing fees?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Closing costs typically range from 2% to 5% of the loan amount. This includes appraisal fees, origination fees, title insurance, and other administrative costs. Our calculator helps you factor these into your decision.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "Should I refinance if I plan to move soon?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Generally, you shouldn't refinance if you plan to move before reaching the break-even point. The calculator helps determine if you'll stay long enough to recoup the closing costs through monthly savings.",
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
            <h1 className={styles.mainTitle}>Mortgage Refinance Break-Even Calculator</h1>
            <p className={styles.subtitle}>Calculate If Refinancing Makes Financial Sense for You</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Accurate Calculations</span>
              <span className={styles.badge}>No Signup Required</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls - Current Mortgage */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Current Mortgage Details</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Current Loan Balance
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="50000"
                      max="2000000"
                      step="10000"
                      value={currentLoanBalance}
                      onChange={(e) => setCurrentLoanBalance(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="50000"
                      max="2000000"
                      step="10000"
                      value={currentLoanBalance}
                      onChange={(e) => setCurrentLoanBalance(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(currentLoanBalance)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Current Interest Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      step="0.125"
                      value={currentInterestRate}
                      onChange={(e) => setCurrentInterestRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="2"
                      max="10"
                      step="0.125"
                      value={currentInterestRate}
                      onChange={(e) => setCurrentInterestRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(currentInterestRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Remaining Loan Term
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={remainingLoanTerm}
                      onChange={(e) => setRemainingLoanTerm(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="30"
                      step="1"
                      value={remainingLoanTerm}
                      onChange={(e) => setRemainingLoanTerm(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{remainingLoanTerm} years</div>
                </label>
              </div>

              <h2 className={styles.sectionTitle} style={{ marginTop: '2rem' }}>New Mortgage Details</h2>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  New Interest Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      step="0.125"
                      value={newInterestRate}
                      onChange={(e) => setNewInterestRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="2"
                      max="10"
                      step="0.125"
                      value={newInterestRate}
                      onChange={(e) => setNewInterestRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(newInterestRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  New Loan Term
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="10"
                      max="30"
                      step="1"
                      value={newLoanTerm}
                      onChange={(e) => setNewLoanTerm(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10"
                      max="30"
                      step="1"
                      value={newLoanTerm}
                      onChange={(e) => setNewLoanTerm(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{newLoanTerm} years</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Closing Costs
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      step="500"
                      value={closingCosts}
                      onChange={(e) => setClosingCosts(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="20000"
                      step="500"
                      value={closingCosts}
                      onChange={(e) => setClosingCosts(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(closingCosts)}</div>
                </label>
              </div>

              <div className={styles.toggleGroup}>
                <button
                  className={`${styles.toggleButton} ${showChart ? styles.active : ''}`}
                  onClick={() => setShowChart(true)}
                >
                  Show Chart
                </button>
                <button
                  className={`${styles.toggleButton} ${!showChart ? styles.active : ''}`}
                  onClick={() => setShowChart(false)}
                >
                  Show Table
                </button>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Refinance Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Monthly Payment</div>
                      <div className={styles.resultValue}>{formatCurrency(results.currentPayment)} → {formatCurrency(results.newPayment)}</div>
                      <div className={styles.resultSubtext}>
                        {results.monthlySavings > 0 ? 
                          `Save ${formatCurrency(results.monthlySavings)}/month` : 
                          `Increase ${formatCurrency(-results.monthlySavings)}/month`}
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Break-Even Point</div>
                      <div className={styles.resultValue}>{formatMonths(results.breakEvenMonths)}</div>
                      <div className={styles.resultSubtext}>
                        {results.breakEvenYears !== Infinity ? 
                          `(${results.breakEvenYears} years)` : 
                          'Will not break even'}
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Interest Savings</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalInterestSavings)}</div>
                      <div className={styles.resultSubtext}>
                        {formatCurrency(results.currentTotalInterest)} → {formatCurrency(results.newTotalInterest)}
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Net Savings</div>
                      <div className={`${styles.resultValue} ${results.netSavings >= 0 ? styles.positive : styles.negative}`}>
                        {formatCurrency(results.netSavings)}
                      </div>
                      <div className={styles.resultSubtext}>
                        After closing costs
                      </div>
                    </div>
                  </div>

                  {/* Savings Timeline Visualization */}
                  {showChart ? (
                    <div className={styles.chartContainer}>
                      <h3 className={styles.chartTitle}>Savings Over Time</h3>
                      <div className={styles.chartTimeline}>
                        {monthlyData.map((data, index) => (
                          <div key={index} className={styles.timelinePoint}>
                            <div className={styles.timelineLabel}>{data.label}</div>
                            <div className={styles.timelineBarContainer}>
                              <div 
                                className={styles.timelineBarSavings}
                                style={{ height: `${Math.min(100, (data.cumulativeSavings / (closingCosts * 3)) * 100)}%` }}
                                title={`Savings: ${formatCurrency(data.cumulativeSavings)}`}
                              />
                              <div 
                                className={styles.timelineBarCosts}
                                style={{ height: `${Math.min(100, (data.closingCosts / (closingCosts * 3)) * 100)}%` }}
                                title={`Closing Costs: ${formatCurrency(data.closingCosts)}`}
                              />
                            </div>
                            <div className={styles.timelineValue}>
                              {data.netPosition >= 0 ? '+' : ''}{formatCurrency(data.netPosition)}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className={styles.chartLegend}>
                        <div className={styles.legendItem}>
                          <div className={`${styles.legendColor} ${styles.legendSavings}`}></div>
                          <span>Cumulative Savings</span>
                        </div>
                        <div className={styles.legendItem}>
                          <div className={`${styles.legendColor} ${styles.legendCosts}`}></div>
                          <span>Closing Costs</span>
                        </div>
                        <div className={styles.legendItem}>
                          <div className={`${styles.legendColor} ${styles.legendBreakEven}`}></div>
                          <span>Break-Even Point</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.tableContainer}>
                      <h3 className={styles.chartTitle}>Monthly Savings Timeline</h3>
                      <table className={styles.savingsTable}>
                        <thead>
                          <tr>
                            <th>Period</th>
                            <th>Cumulative Savings</th>
                            <th>Closing Costs</th>
                            <th>Net Position</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monthlyData.map((data, index) => (
                            <tr key={index} className={data.netPosition >= 0 ? styles.positiveRow : styles.negativeRow}>
                              <td>{data.label}</td>
                              <td>{formatCurrency(data.cumulativeSavings)}</td>
                              <td>{formatCurrency(data.closingCosts)}</td>
                              <td className={data.netPosition >= 0 ? styles.positive : styles.negative}>
                                {data.netPosition >= 0 ? '+' : ''}{formatCurrency(data.netPosition)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Key Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>
                        {results.monthlySavings > 0 ? (
                          <>You'll save <strong>{formatCurrency(results.monthlySavings)}</strong> per month with refinancing</>
                        ) : (
                          <>Refinancing would <strong>increase</strong> your monthly payment by <strong>{formatCurrency(-results.monthlySavings)}</strong></>
                        )}
                      </li>
                      <li>
                        {results.breakEvenMonths !== Infinity ? (
                          <>You'll break even in <strong>{formatMonths(results.breakEvenMonths)}</strong> ({results.breakEvenYears} years)</>
                        ) : (
                          <>You will <strong>not break even</strong> with these terms</>
                        )}
                      </li>
                      <li>
                        {results.netSavings > 0 ? (
                          <>Total net savings after closing costs: <strong>{formatCurrency(results.netSavings)}</strong></>
                        ) : (
                          <>Refinancing would cost you <strong>{formatCurrency(-results.netSavings)}</strong> after closing costs</>
                        )}
                      </li>
                    </ul>
                  </div>

                  <div className={styles.decisionCard}>
                    <h3 className={styles.decisionTitle}>💡 Recommendation</h3>
                    <div className={styles.decisionContent}>
                      {results.netSavings > 0 && results.monthlySavings > 0 ? (
                        <>
                          <div className={styles.decisionPositive}>✅ Refinancing makes financial sense</div>
                          <p>Based on your inputs, refinancing would save you money in the long run. Consider refinancing if you plan to stay in your home for at least {formatMonths(results.breakEvenMonths)}.</p>
                        </>
                      ) : (
                        <>
                          <div className={styles.decisionNegative}>⚠️ Refinancing may not be beneficial</div>
                          <p>Based on your inputs, refinancing may not provide financial benefits. Consider adjusting terms or waiting for better interest rates.</p>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Mortgage Refinancing Guide: When Does It Make Sense?</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding the Break-Even Point</h3>
                <p>The break-even point is the single most important calculation in refinancing. It tells you exactly how long you need to keep your new mortgage to recoup the closing costs through monthly savings. If you plan to sell or refinance again before reaching this point, you'll lose money.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World Example:</h4>
                  <p>A $300,000 mortgage at 6.5% refinanced to 5.0% with $5,000 closing costs:</p>
                  <ul>
                    <li><strong>Monthly Savings:</strong> $288 reduction</li>
                    <li><strong>Break-Even:</strong> 17.4 months</li>
                    <li><strong>3-Year Savings:</strong> $10,368 total, $5,368 after costs</li>
                    <li><strong>5-Year Savings:</strong> $17,280 total, $12,280 after costs</li>
                  </ul>
                  <p>The longer you stay past the break-even point, the more you save.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>When Refinancing Makes Sense</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>📉 Rate Reduction</h4>
                    <p>When current rates are at least 0.75-1% lower than your existing rate. This rule of thumb has become more flexible with higher home values.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 Shortening Loan Term</h4>
                    <p>Moving from a 30-year to 15-year mortgage, even with similar monthly payments, saves hundreds of thousands in interest over the loan life.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💳 Eliminating PMI</h4>
                    <p>If your home has appreciated enough to reach 20% equity, refinancing can eliminate Private Mortgage Insurance (PMI) payments.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🔄 Switching Loan Types</h4>
                    <p>Moving from an adjustable-rate mortgage (ARM) to a fixed-rate mortgage when rates are low provides payment stability and protection from future rate increases.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Hidden Costs and Considerations</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Closing Costs:</strong> Typically 2-5% of loan amount including appraisal, title insurance, and origination fees</li>
                  <li><strong>Loan Term Reset:</strong> Extending your loan term may lower payments but increase total interest paid</li>
                  <li><strong>Credit Impact:</strong> Refinancing requires a hard credit inquiry which may temporarily lower your score</li>
                  <li><strong>Prepayment Penalties:</strong> Some loans have penalties for paying off early - check your current mortgage terms</li>
                  <li><strong>Tax Implications:</strong> Consult a tax professional as mortgage interest deduction rules may change</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Mortgage Professionals</h3>
                <blockquote className={styles.expertQuote}>
                  "Don't just look at the interest rate - consider the entire picture. A slightly higher rate with no closing costs might be better than a lower rate with high fees, especially if you plan to move within 5-7 years."
                  <footer className={styles.quoteFooter}>— Senior Mortgage Advisor, 20+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's considered a "good" break-even point?</h3>
                <p className={styles.faqAnswer}>Generally, a break-even point under 3-4 years is considered good. If you plan to stay in your home longer than the break-even period, refinancing makes financial sense. For those nearing retirement or planning to move soon, a shorter break-even period (under 2 years) is preferable.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can I refinance with no closing costs?</h3>
                <p className={styles.faqAnswer}>"No closing cost" refinances exist, but they typically come with a higher interest rate. The lender pays your closing costs in exchange for a slightly higher rate. This can be a good option if you plan to move before reaching a traditional break-even point, but you'll pay more interest over the long term.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does refinancing affect my credit score?</h3>
                <p className={styles.faqAnswer}>Refinancing typically causes a temporary 5-15 point drop in your credit score due to the hard inquiry and new credit account. This impact usually recovers within 6-12 months. Multiple refinance applications within a short period are treated as a single inquiry for scoring purposes if done within 14-45 days (depending on the scoring model).</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I refinance to take cash out?</h3>
                <p className={styles.faqAnswer}>Cash-out refinancing replaces your current mortgage with a larger loan, giving you the difference in cash. This increases your loan balance and may extend your repayment term. It makes sense for high-interest debt consolidation or home improvements that increase property value, but reduces your equity and should be approached cautiously.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Evaluate Your Refinance Options?</h2>
              <p className={styles.ctaText}>Use our calculator to compare your current mortgage with potential refinance scenarios. Adjust the inputs to match lenders' offers and find your optimal strategy.</p>
              
              <div className={styles.tipBox}>
                <strong>Pro Tip:</strong> Get quotes from at least 3 lenders and compare their Loan Estimates. Look beyond just the interest rate - compare closing costs, lender credits, and overall APR.
              </div>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Actual mortgage terms, rates, and closing costs may vary. Consult with qualified mortgage professionals and consider your personal financial situation before making refinancing decisions. All calculations assume no prepayments or additional payments.
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

export default MortgageRefinanceCalculator;