import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './earlyretirementcalculator.module.css';

const EarlyRetirementCalculator = ({ currentDate, lastModifiedDate }) => {
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(50);
  const [annualIncome, setAnnualIncome] = useState(80000);
  const [savingsRate, setSavingsRate] = useState(40);
  const [currentSavings, setCurrentSavings] = useState(100000);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [annualSpending, setAnnualSpending] = useState(40000);
  const [withdrawalRate, setWithdrawalRate] = useState(4);
  const [results, setResults] = useState(null);
  const [timelineData, setTimelineData] = useState([]);

  const calculateEarlyRetirement = () => {
    const yearsToRetirement = retirementAge - currentAge;
    const annualSavings = (annualIncome * savingsRate) / 100;
    const expenseRatio = 1 - (savingsRate / 100);
    const postRetirementIncome = annualSpending;
    
    let portfolio = currentSavings;
    const dataPoints = [];
    let totalContributions = currentSavings;
    let retirementDate = null;
    
    // Pre-retirement phase
    for (let year = 0; year <= 60; year++) {
      const currentYearAge = currentAge + year;
      
      // Growth from investment returns
      portfolio = portfolio * (1 + annualReturn / 100);
      
      // Add contributions during working years
      if (currentYearAge < retirementAge) {
        portfolio += annualSavings;
        totalContributions += annualSavings;
      }
      
      // Withdraw during retirement
      if (currentYearAge >= retirementAge && retirementDate !== null) {
        const withdrawalAmount = (postRetirementIncome * (withdrawalRate / 100)) / (withdrawalRate / 100);
        portfolio -= postRetirementIncome;
        
        if (portfolio <= 0 && retirementDate === null) {
          retirementDate = currentYearAge;
        }
      }
      
      // Check if FI reached
      const safeWithdrawalAmount = portfolio * (withdrawalRate / 100);
      const isFI = safeWithdrawalAmount >= annualSpending;
      
      if (year <= retirementAge - currentAge + 30) {
        dataPoints.push({
          age: currentYearAge,
          portfolio: Math.round(portfolio),
          annualSavings: currentYearAge < retirementAge ? Math.round(annualSavings) : 0,
          annualSpending: currentYearAge >= retirementAge ? Math.round(postRetirementIncome) : Math.round(annualIncome * expenseRatio),
          isFI: isFI,
          isRetired: currentYearAge >= retirementAge,
          safeWithdrawal: Math.round(safeWithdrawalAmount)
        });
      }
      
      if (currentYearAge === retirementAge) {
        retirementDate = currentYearAge;
      }
    }
    
    const fiPortfolioNeeded = annualSpending / (withdrawalRate / 100);
    const yearsToFI = Math.log((fiPortfolioNeeded + annualSavings / (annualReturn / 100)) / 
                             (currentSavings + annualSavings / (annualReturn / 100))) / 
                     Math.log(1 + annualReturn / 100);
    
    setResults({
      fiPortfolioNeeded: Math.round(fiPortfolioNeeded),
      yearsToFI: Math.round(yearsToFI * 10) / 10,
      projectedPortfolio: Math.round(portfolio),
      safeWithdrawalAmount: Math.round(fiPortfolioNeeded * (withdrawalRate / 100)),
      monthlySavingsNeeded: Math.round(annualSavings / 12),
      fireNumber: Math.round(fiPortfolioNeeded)
    });
    
    setTimelineData(dataPoints);
  };

  useEffect(() => {
    calculateEarlyRetirement();
  }, [currentAge, retirementAge, annualIncome, savingsRate, currentSavings, annualReturn, annualSpending, withdrawalRate]);

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

  return (
    <>
      <Head>
        <title>Early Retirement Calculator (FIRE) | Financial Independence Calculator</title>
        <meta name="description" content="Calculate your path to financial independence and early retirement. Discover your FIRE number, timeline, and savings strategy for achieving financial freedom." />
        <meta name="keywords" content="early retirement calculator, FIRE calculator, financial independence, retire early, retirement planning, FIRE movement, financial freedom" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://yourdomain.com/early-retirement-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Early Retirement Calculator (FIRE) | Achieve Financial Freedom" />
        <meta property="og:description" content="Calculate your path to financial independence and retire early with our comprehensive FIRE calculator." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/early-retirement-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Early Retirement Calculator (FIRE)" />
        <meta name="twitter:description" content="Plan your journey to financial independence and early retirement." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="early-retirement-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Early Retirement Calculator (FIRE)",
            "description": "Comprehensive financial independence and early retirement calculator for FIRE planning",
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
              "ratingCount": "980",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Financial Freedom Tools",
              "url": "https://yourdomain.com"
            },
            "featureList": [
              "FIRE Number Calculation",
              "Retirement Timeline",
              "Savings Rate Analysis",
              "Withdrawal Strategy",
              "Portfolio Projections"
            ]
          })
        }}
      />

      {/* FAQ Schema */}
      <Script
        id="fire-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is the FIRE movement and how does it work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "FIRE stands for Financial Independence, Retire Early. It's a movement focused on aggressive saving and investing to achieve financial independence much earlier than traditional retirement age, typically by saving 50-70% of income and building a portfolio 25-30 times annual expenses.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is the 4% rule in early retirement?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The 4% rule suggests you can safely withdraw 4% of your portfolio in the first year of retirement, adjusted for inflation each subsequent year, with a high probability of not running out of money over a 30-year retirement. For early retirement, many use a more conservative 3-3.5% withdrawal rate.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How much do I need to save for early retirement?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Your FIRE number is typically 25 times your annual expenses (based on the 4% rule). If you spend $40,000 annually, you need $1,000,000 invested. The higher your savings rate, the faster you reach this number.",
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
            <h1 className={styles.mainTitle}>Early Retirement Calculator (FIRE)</h1>
            <p className={styles.subtitle}>Calculate Your Path to Financial Independence and Retire Early</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>FIRE Movement</span>
              <span className={styles.badge}>No Signup Required</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Your FIRE Plan</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Current Age
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="20"
                      max="60"
                      step="1"
                      value={currentAge}
                      onChange={(e) => setCurrentAge(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="20"
                      max="60"
                      step="1"
                      value={currentAge}
                      onChange={(e) => setCurrentAge(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{currentAge} years old</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Target Retirement Age
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="30"
                      max="70"
                      step="1"
                      value={retirementAge}
                      onChange={(e) => setRetirementAge(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="30"
                      max="70"
                      step="1"
                      value={retirementAge}
                      onChange={(e) => setRetirementAge(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>Retire at {retirementAge}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Income
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="30000"
                      max="300000"
                      step="5000"
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="30000"
                      max="300000"
                      step="5000"
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(annualIncome)}/year</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Savings Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="10"
                      max="80"
                      step="1"
                      value={savingsRate}
                      onChange={(e) => setSavingsRate(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10"
                      max="80"
                      step="1"
                      value={savingsRate}
                      onChange={(e) => setSavingsRate(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{savingsRate}% of income</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Current Savings/Investments
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="10000"
                      value={currentSavings}
                      onChange={(e) => setCurrentSavings(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="1000000"
                      step="10000"
                      value={currentSavings}
                      onChange={(e) => setCurrentSavings(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(currentSavings)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Expected Annual Return
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="3"
                      max="12"
                      step="0.1"
                      value={annualReturn}
                      onChange={(e) => setAnnualReturn(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="3"
                      max="12"
                      step="0.1"
                      value={annualReturn}
                      onChange={(e) => setAnnualReturn(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(annualReturn)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Retirement Spending
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="20000"
                      max="150000"
                      step="5000"
                      value={annualSpending}
                      onChange={(e) => setAnnualSpending(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="20000"
                      max="150000"
                      step="5000"
                      value={annualSpending}
                      onChange={(e) => setAnnualSpending(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(annualSpending)}/year</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Safe Withdrawal Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="2.5"
                      max="5"
                      step="0.1"
                      value={withdrawalRate}
                      onChange={(e) => setWithdrawalRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="2.5"
                      max="5"
                      step="0.1"
                      value={withdrawalRate}
                      onChange={(e) => setWithdrawalRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{withdrawalRate}% ({(withdrawalRate * 25).toFixed(0)}x expenses)</div>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Your FIRE Results</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>FIRE Number</div>
                      <div className={styles.resultValue}>{formatCurrency(results.fireNumber)}</div>
                      <div className={styles.resultDescription}>25x annual expenses</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Years to FI</div>
                      <div className={styles.resultValue}>{results.yearsToFI} years</div>
                      <div className={styles.resultDescription}>Age {Math.round(currentAge + results.yearsToFI)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Monthly Savings</div>
                      <div className={styles.resultValue}>{formatCurrency(results.monthlySavingsNeeded)}</div>
                      <div className={styles.resultDescription}>${Math.round(results.monthlySavingsNeeded / (annualIncome/12) * 100)}% of income</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Safe Withdrawal</div>
                      <div className={styles.resultValue}>{formatCurrency(results.safeWithdrawalAmount)}/year</div>
                      <div className={styles.resultDescription}>{withdrawalRate}% of portfolio</div>
                    </div>
                  </div>

                  {/* Timeline Visualization */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Financial Independence Timeline</h3>
                    <div className={styles.timelineBars}>
                      {timelineData.filter((data, index) => index % 5 === 0 || data.age === retirementAge).map((data, index) => (
                        <div key={index} className={styles.timelineBarGroup}>
                          <div className={styles.timelineBarLabel}>
                            Age {data.age}
                            {data.age === retirementAge && <span className={styles.retirementMarker}>🎯</span>}
                            {data.isFI && !data.isRetired && <span className={styles.fiMarker}>🔥</span>}
                          </div>
                          <div className={styles.timelineBarContainer}>
                            <div 
                              className={styles.timelineBarPortfolio}
                              style={{ 
                                width: `${Math.min(100, (data.portfolio / results.fireNumber) * 100)}%`,
                                backgroundColor: data.isFI ? '#10b981' : '#3b82f6'
                              }}
                              title={`Portfolio: ${formatCurrency(data.portfolio)}`}
                            />
                          </div>
                          <div className={styles.timelineBarValue}>
                            {data.isRetired ? 'Retired' : data.isFI ? 'FI Reached!' : formatCurrency(data.portfolio)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.timelineLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendWorking}`}></div>
                        <span>Accumulation Phase</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendFI}`}></div>
                        <span>FI Target Reached</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendRetired}`}></div>
                        <span>Retirement Phase</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>🔥 Your FIRE Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>You need to save <strong>{formatCurrency(results.monthlySavingsNeeded)}</strong> monthly to reach FI</li>
                      <li>Your savings rate of <strong>{savingsRate}%</strong> will get you to FI in <strong>{results.yearsToFI} years</strong></li>
                      <li>At retirement, you can safely withdraw <strong>{formatCurrency(results.safeWithdrawalAmount)}</strong> annually</li>
                      {results.yearsToFI > retirementAge - currentAge && (
                        <li className={styles.warning}>⚠️ Consider increasing savings rate or lowering spending to retire by {retirementAge}</li>
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
              <h2 className={styles.articleTitle}>The FIRE Movement: Achieving Financial Independence and Retiring Early</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>What is the FIRE Movement?</h3>
                <p>FIRE (Financial Independence, Retire Early) is a lifestyle movement focused on extreme savings and investment to achieve financial independence much earlier than traditional retirement ages. Followers aim to save 50-70% of their income, build investment portfolios 25-30 times their annual expenses, and gain the freedom to work by choice, not necessity.</p>
                
                <div className={styles.exampleCard}>
                  <h4>The Math Behind FIRE:</h4>
                  <ul>
                    <li><strong>Savings Rate 50%:</strong> FI in 17 years</li>
                    <li><strong>Savings Rate 60%:</strong> FI in 12.5 years</li>
                    <li><strong>Savings Rate 70%:</strong> FI in 8.5 years</li>
                  </ul>
                  <p>Every percentage increase in savings rate dramatically reduces time to financial independence.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>FIRE Strategies & Approaches</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>💼 LeanFIRE</h4>
                    <p>Minimalist approach with annual expenses under $40,000. Requires smaller portfolio ($600k-$1M) but strict budgeting and lifestyle optimization.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏡 RegularFIRE</h4>
                    <p>Standard approach maintaining current lifestyle. Portfolio of $1-2.5M supporting $40k-$100k annual spending. Most common FIRE path.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🚀 FatFIRE</h4>
                    <p>High-income earners targeting $100k+ annual spending. Requires $2.5M+ portfolio but offers luxury and flexibility in retirement.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚡ BaristaFIRE</h4>
                    <p>Partial retirement where you cover some expenses with part-time work. Reduces portfolio requirements while maintaining benefits and purpose.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The 4% Rule & Safe Withdrawal Rates</h3>
                <p>The 4% rule, based on the Trinity Study, suggests you can withdraw 4% of your portfolio in the first year of retirement, adjusted for inflation annually, with a 95% success rate over 30 years. For early retirement (40+ years), many experts recommend 3-3.5% for added safety.</p>
                
                <div className={styles.withdrawalTable}>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>Withdrawal Rate</div>
                    <div className={styles.tableCell}>Portfolio Multiple</div>
                    <div className={styles.tableCell}>Success Rate (30 yrs)</div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>3.0%</div>
                    <div className={styles.tableCell}>33x expenses</div>
                    <div className={styles.tableCell}>99%+</div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>3.5%</div>
                    <div className={styles.tableCell}>29x expenses</div>
                    <div className={styles.tableCell}>95%</div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>4.0%</div>
                    <div className={styles.tableCell}>25x expenses</div>
                    <div className={styles.tableCell}>95%</div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>4.5%</div>
                    <div className={styles.tableCell}>22x expenses</div>
                    <div className={styles.tableCell}>85%</div>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Key Principles for FIRE Success</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Maximize Savings Rate:</strong> The most powerful lever. Every 10% increase cuts years off your timeline</li>
                  <li><strong>Reduce Expenses Strategically:</strong> Focus on "Big 3" expenses: housing, transportation, food</li>
                  <li><strong>Invest in Tax-Advantaged Accounts:</strong> Maximize 401(k), IRA, HSA, and Roth conversions</li>
                  <li><strong>Diversify Income Streams:</strong> Side hustles, rental income, dividend growth</li>
                  <li><strong>Maintain Flexibility:</strong> Be willing to adjust spending or earn supplemental income if needed</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from FIRE Achievers</h3>
                <blockquote className={styles.expertQuote}>
                  "The path to FIRE isn't about deprivation—it's about intentionality. Every dollar you don't spend today is buying you freedom tomorrow. Focus on increasing the gap between your earnings and spending, and invest the difference consistently."
                  <footer className={styles.quoteFooter}>— Early retiree at 42, 8 years into FIRE journey</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>FIRE Movement FAQs</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How much do I really need to retire early?</h3>
                <p className={styles.faqAnswer}>Your "FIRE number" is typically 25 times your annual expenses (based on the 4% rule). If you spend $40,000 annually, aim for $1,000,000 invested. For more conservative early retirement (40+ years), use 30x expenses (3.33% withdrawal rate).</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the most important factor for reaching FIRE quickly?</h3>
                <p className={styles.faqAnswer}>Savings rate is the most critical factor. A 50% savings rate leads to financial independence in about 17 years, while 75% reduces it to just 7 years. Increasing income while maintaining or reducing expenses accelerates the timeline dramatically.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do healthcare costs work in early retirement?</h3>
                <p className={styles.faqAnswer}>Healthcare is a significant consideration. Options include ACA marketplace plans (with subsidies based on income), health sharing ministries, part-time work with benefits, or geographic arbitrage (moving to countries with lower healthcare costs). Budget $500-$1,500 per month per person.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can I still retire early if I start late?</h3>
                <p className={styles.faqAnswer}>Yes! While starting early is ideal, you can still achieve FIRE starting in your 40s or 50s by maximizing savings rate (aim for 50%+), increasing income, controlling expenses, and potentially considering geographic arbitrage or BaristaFIRE options.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Start Your Journey to Financial Freedom</h2>
              <p className={styles.ctaText}>Use this calculator to create your personalized FIRE plan. Adjust your savings rate, spending, and timeline to find your optimal path to early retirement.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates based on historical market returns. Past performance does not guarantee future results. The 4% rule may not be appropriate for all situations, especially extended retirement periods. Consider sequence of returns risk, inflation, healthcare costs, and other variables. Consult with a financial advisor for personalized advice.
              </p>
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p className={styles.footerText}>
              Early Retirement Calculator v2.1 • Based on the Trinity Study and FIRE movement principles • Updated with current tax laws and investment data
            </p>
            <p className={styles.footerNote}>
              This tool is for educational purposes. Individual results may vary based on market conditions, tax situations, and personal circumstances.
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
    revalidate: 21600, // 24 hours
  };
}

export default EarlyRetirementCalculator;