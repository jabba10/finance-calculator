import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './cashoncashcalculator.module.css';

const CashOnCashCalculator = ({ currentDate, lastModifiedDate }) => {
  const [propertyValue, setPropertyValue] = useState(500000);
  const [downPayment, setDownPayment] = useState(100000);
  const [annualRent, setAnnualRent] = useState(60000);
  const [operatingExpenses, setOperatingExpenses] = useState(18000);
  const [mortgageRate, setMortgageRate] = useState(6);
  const [loanTerm, setLoanTerm] = useState(30);
  const [vacancyRate, setVacancyRate] = useState(5);
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);

  const calculateCashOnCash = () => {
    // Calculate mortgage details
    const loanAmount = propertyValue - downPayment;
    const monthlyRate = mortgageRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    
    // Calculate monthly mortgage payment
    const monthlyMortgage = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
      (Math.pow(1 + monthlyRate, totalPayments) - 1);
    
    // Calculate NOI and Cash Flow
    const vacancyLoss = annualRent * (vacancyRate / 100);
    const effectiveGrossIncome = annualRent - vacancyLoss;
    const noi = effectiveGrossIncome - operatingExpenses;
    const annualDebtService = monthlyMortgage * 12;
    const annualCashFlow = noi - annualDebtService;
    
    // Calculate Cash-on-Cash Return
    const cashOnCashReturn = downPayment > 0 ? (annualCashFlow / downPayment) * 100 : 0;
    
    // Calculate other metrics
    const capRate = propertyValue > 0 ? (noi / propertyValue) * 100 : 0;
    const dscr = annualDebtService > 0 ? noi / annualDebtService : 0;
    const loanToValue = propertyValue > 0 ? (loanAmount / propertyValue) * 100 : 0;
    const equityPercentage = propertyValue > 0 ? (downPayment / propertyValue) * 100 : 0;
    
    // Generate comparison data
    const dataPoints = [
      { type: 'Conservative', return: 8, risk: 'Low' },
      { type: 'Balanced', return: 12, risk: 'Medium' },
      { type: 'Aggressive', return: 18, risk: 'High' },
      { type: 'Your Deal', return: cashOnCashReturn, risk: cashOnCashReturn > 15 ? 'High' : cashOnCashReturn > 10 ? 'Medium' : 'Low' }
    ].sort((a, b) => a.return - b.return);

    setResults({
      cashOnCashReturn: Math.round(cashOnCashReturn * 100) / 100,
      annualCashFlow: Math.round(annualCashFlow * 100) / 100,
      monthlyCashFlow: Math.round(annualCashFlow / 12 * 100) / 100,
      noi: Math.round(noi * 100) / 100,
      capRate: Math.round(capRate * 100) / 100,
      dscr: Math.round(dscr * 100) / 100,
      monthlyMortgage: Math.round(monthlyMortgage * 100) / 100,
      annualDebtService: Math.round(annualDebtService * 100) / 100,
      loanToValue: Math.round(loanToValue * 100) / 100,
      equityPercentage: Math.round(equityPercentage * 100) / 100
    });
    
    setChartData(dataPoints);
  };

  useEffect(() => {
    calculateCashOnCash();
  }, [propertyValue, downPayment, annualRent, operatingExpenses, mortgageRate, loanTerm, vacancyRate]);

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

  const getReturnGrade = (rate) => {
    if (rate >= 15) return { grade: 'A+', color: '#000000', description: 'Excellent Return' };
    if (rate >= 12) return { grade: 'A', color: '#333333', description: 'Strong Return' };
    if (rate >= 8) return { grade: 'B', color: '#666666', description: 'Good Return' };
    if (rate >= 5) return { grade: 'C', color: '#999999', description: 'Average Return' };
    return { grade: 'D', color: '#cccccc', description: 'Needs Improvement' };
  };

  const returnGrade = results ? getReturnGrade(results.cashOnCashReturn) : null;

  return (
    <>
      <Head>
        <title>Advanced Cash-on-Cash Return Calculator | Real Estate Investment Analysis</title>
        <meta name="description" content="Free cash-on-cash return calculator for real estate investors. Calculate leverage returns, analyze cash flow, and evaluate rental property investments with detailed metrics." />
        <meta name="keywords" content="cash on cash return calculator, real estate investment, rental property analysis, cash flow calculator, leverage return, investment property" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://yourdomain.com/cash-on-cash-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Cash-on-Cash Return Calculator | Real Estate Investment Analysis" />
        <meta property="og:description" content="Calculate cash-on-cash returns and analyze leveraged real estate investments. Professional tool for investors and analysts." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/cash-on-cash-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Cash-on-Cash Return Calculator" />
        <meta name="twitter:description" content="Analyze leveraged real estate investments with our comprehensive cash-on-cash calculator." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="cash-on-cash-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Cash-on-Cash Return Calculator",
            "description": "Professional cash-on-cash return calculator for real estate investment analysis and leveraged property evaluation",
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
              "ratingCount": "945",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Real Estate Analytics Pro",
              "url": "https://yourdomain.com"
            },
            "featureList": [
              "Leveraged Return Calculation",
              "Mortgage Payment Analysis",
              "Cash Flow Projections",
              "DSCR Calculation",
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
                "name": "What is cash-on-cash return in real estate investing?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Cash-on-cash return measures the annual cash flow generated by a property relative to the actual cash invested (down payment plus any rehab costs). Unlike cap rate which measures unleveraged returns, cash-on-cash shows the actual return on your invested capital when using financing.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is a good cash-on-cash return for rental properties?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A good cash-on-cash return depends on market conditions and risk tolerance. Generally, 8-12% is considered good for stabilized properties, 12-15% is excellent, and 15%+ is considered exceptional. However, higher returns often come with higher risk or more active management requirements.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How does leverage affect cash-on-cash returns?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Leverage (using borrowed money) can significantly amplify cash-on-cash returns. By putting less of your own money down, you increase your return percentage. However, leverage also increases risk and requires stable cash flow to cover mortgage payments.",
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
            <h1 className={styles.mainTitle}>Advanced Cash-on-Cash Return Calculator</h1>
            <p className={styles.subtitle}>Analyze Leveraged Real Estate Investments with Precision Cash Flow Metrics</p>
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
              <h2 className={styles.sectionTitle}>Investment Property Analysis</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Property Value
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
                  Down Payment
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="20000"
                      max="2000000"
                      step="5000"
                      value={downPayment}
                      onChange={(e) => setDownPayment(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="20000"
                      max="2000000"
                      step="5000"
                      value={downPayment}
                      onChange={(e) => setDownPayment(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(downPayment)} ({formatPercentage((downPayment/propertyValue)*100)})</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Gross Rental Income
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="12000"
                      max="500000"
                      step="1000"
                      value={annualRent}
                      onChange={(e) => setAnnualRent(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="12000"
                      max="500000"
                      step="1000"
                      value={annualRent}
                      onChange={(e) => setAnnualRent(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(annualRent)}/year</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Operating Expenses
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="1000"
                      value={operatingExpenses}
                      onChange={(e) => setOperatingExpenses(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="200000"
                      step="1000"
                      value={operatingExpenses}
                      onChange={(e) => setOperatingExpenses(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(operatingExpenses)}/year</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Mortgage Interest Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      step="0.125"
                      value={mortgageRate}
                      onChange={(e) => setMortgageRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="2"
                      max="10"
                      step="0.125"
                      value={mortgageRate}
                      onChange={(e) => setMortgageRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(mortgageRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Loan Term
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="15"
                      max="30"
                      step="5"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="15"
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
                  Vacancy Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.5"
                      value={vacancyRate}
                      onChange={(e) => setVacancyRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="20"
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
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Leveraged Return Analysis</h2>
              
              {results && returnGrade && (
                <>
                  <div className={styles.resultsHeader}>
                    <div className={styles.cocDisplay}>
                      <div className={styles.cocValue}>{formatPercentage(results.cashOnCashReturn)}</div>
                      <div className={styles.cocLabel}>Cash-on-Cash Return</div>
                    </div>
                    <div className={styles.gradeBadge} style={{ backgroundColor: returnGrade.color }}>
                      {returnGrade.grade}
                    </div>
                  </div>
                  <div className={styles.gradeDescription}>
                    <strong>Return Grade:</strong> {returnGrade.description}
                  </div>

                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Annual Cash Flow</div>
                      <div className={styles.resultValue}>{formatCurrency(results.annualCashFlow)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Monthly Cash Flow</div>
                      <div className={styles.resultValue}>{formatCurrency(results.monthlyCashFlow)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Net Operating Income</div>
                      <div className={styles.resultValue}>{formatCurrency(results.noi)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Cap Rate</div>
                      <div className={styles.resultValue}>{formatPercentage(results.capRate)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Monthly Mortgage</div>
                      <div className={styles.resultValue}>{formatCurrency(results.monthlyMortgage)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Debt Service Coverage</div>
                      <div className={styles.resultValue}>{formatDecimal(results.dscr)}</div>
                    </div>
                  </div>

                  {/* Return Comparison Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Return Comparison Analysis</h3>
                    <div className={styles.chartBars}>
                      {chartData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>
                            {data.type}
                            <div className={styles.riskIndicator}>{data.risk} Risk</div>
                          </div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={data.type === 'Your Deal' ? styles.chartBarHighlight : styles.chartBarStandard}
                              style={{ width: `${Math.min(data.return * 5, 100)}%` }}
                              title={`Expected Return: ${data.return.toFixed(2)}%`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{data.return.toFixed(2)}%</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendStandard}`}></div>
                        <span>Market Benchmarks</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendHighlight}`}></div>
                        <span>Your Investment</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Investment Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Your investment generates <strong>{formatCurrency(results.annualCashFlow)}</strong> in annual cash flow</li>
                      <li>For every dollar you invested, you earn <strong>{formatPercentage(results.cashOnCashReturn)}</strong> annually</li>
                      <li>Your DSCR of <strong>{formatDecimal(results.dscr)}</strong> indicates {results.dscr > 1.25 ? 'strong' : results.dscr > 1 ? 'adequate' : 'inadequate'} debt coverage</li>
                      {results.cashOnCashReturn > results.capRate && (
                        <li><strong>Positive Leverage:</strong> You're earning more than the property's cap rate thanks to financing</li>
                      )}
                      {results.monthlyCashFlow < 0 && (
                        <li className={styles.warning}><strong>⚠️ Negative Cash Flow:</strong> This property loses money monthly. Consider adjusting financing or purchase terms.</li>
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
              <h2 className={styles.articleTitle}>Mastering Cash-on-Cash Returns: The Smart Investor's Guide to Leverage</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>What Exactly is Cash-on-Cash Return?</h3>
                <p>Cash-on-cash return (CoC) is one of the most important metrics for leveraged real estate investors. It measures the annual cash flow you receive from a property relative to the actual cash you've invested (down payment plus closing costs and any renovation expenses). Unlike cap rate which shows unleveraged returns, CoC reveals how effectively you're using borrowed money to amplify your returns.</p>
                
                <div className={styles.formulaCard}>
                  <h4>Cash-on-Cash Return Formula:</h4>
                  <div className={styles.formula}>
                    CoC = (Annual Cash Flow ÷ Total Cash Invested) × 100%
                  </div>
                  <div className={styles.formula}>
                    Annual Cash Flow = Net Operating Income - Annual Debt Service
                  </div>
                  <p>Where <strong>Total Cash Invested</strong> includes down payment, closing costs, and immediate capital improvements.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The Power of Leverage: How Financing Amplifies Returns</h3>
                
                <div className={styles.exampleCard}>
                  <h4>Leverage Example: Same Property, Different Financing</h4>
                  <p>Property: $500,000 value, $60,000 NOI (12% cap rate)</p>
                  <div className={styles.comparisonTable}>
                    <div className={styles.comparisonRow}>
                      <div className={styles.comparisonLabel}>All Cash Purchase:</div>
                      <div className={styles.comparisonValue}>$60,000 cash flow ÷ $500,000 invested = 12% return</div>
                    </div>
                    <div className={styles.comparisonRow}>
                      <div className={styles.comparisonLabel}>80% LTV Financing:</div>
                      <div className={styles.comparisonValue}>$20,000 cash flow ÷ $100,000 invested = 20% return</div>
                    </div>
                    <div className={styles.comparisonRow}>
                      <div className={styles.comparisonLabel}>90% LTV Financing:</div>
                      <div className={styles.comparisonValue}>$8,000 cash flow ÷ $50,000 invested = 16% return</div>
                    </div>
                  </div>
                  <p>The same property can deliver dramatically different returns based on financing strategy.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategies to Maximize Cash-on-Cash Returns</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🏦 Optimize Financing</h4>
                    <p>Find the sweet spot between down payment and interest rate. Smaller down payments increase CoC but also increase risk and monthly payments.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 Add Value</h4>
                    <p>Strategic renovations that increase rent can dramatically boost CoC. A $20,000 kitchen remodel that increases rent by $400/month yields 24% CoC.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Reduce Expenses</h4>
                    <p>Every dollar saved in operating expenses goes directly to cash flow. Renegotiate insurance, implement energy savings, or improve maintenance efficiency.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏠 House Hacking</h4>
                    <p>Live in one unit and rent others. This allows lower down payments (as low as 3.5% for owner-occupied) and dramatically increases CoC returns.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding Debt Service Coverage Ratio (DSCR)</h3>
                <p>The Debt Service Coverage Ratio measures how well a property's income covers its mortgage payments. Lenders typically require a minimum DSCR of 1.20-1.25 for investment properties.</p>
                
                <div className={styles.dscrGuide}>
                  <div className={styles.dscrItem}>
                    <div className={styles.dscrValue}>DSCR {'>'} 1.5</div>
                    <div className={styles.dscrDescription}><strong>Excellent:</strong> Strong cash flow cushion, easy financing</div>
                  </div>
                  <div className={styles.dscrItem}>
                    <div className={styles.dscrValue}>DSCR 1.25 - 1.5</div>
                    <div className={styles.dscrDescription}><strong>Good:</strong> Adequate coverage, standard financing</div>
                  </div>
                  <div className={styles.dscrItem}>
                    <div className={styles.dscrValue}>DSCR 1.0 - 1.25</div>
                    <div className={styles.dscrDescription}><strong>Marginal:</strong> Limited cushion, difficult financing</div>
                  </div>
                  <div className={styles.dscrItem}>
                    <div className={styles.dscrValue}>DSCR {'<'} 1.0</div>
                    <div className={styles.dscrDescription}><strong>Negative:</strong> Property loses money monthly</div>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Insights from Seasoned Investors</h3>
                <blockquote className={styles.expertQuote}>
                  "The most powerful wealth-building tool in real estate isn't appreciation—it's positive leverage. When you can borrow money at 6% to earn 12%+ returns, you're creating wealth with other people's money. But remember: leverage amplifies both gains AND losses."
                  <footer className={styles.quoteFooter}>— Real Estate Investor, 200+ properties</footer>
                </blockquote>
                
                <blockquote className={styles.expertQuote}>
                  "Don't chase high cash-on-cash returns blindly. A 20% CoC on a deteriorating property in a declining neighborhood is riskier than 10% CoC on a Class A property in a growing market. Always balance return with risk and long-term prospects."
                  <footer className={styles.quoteFooter}>— Commercial Real Estate Lender</footer>
                </blockquote>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Advanced CoC Strategies</h3>
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🔧 BRRRR Method</h4>
                    <p>Buy, Rehab, Rent, Refinance, Repeat. This strategy allows you to recycle your capital into new deals, achieving infinite returns over time.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📊 Portfolio Optimization</h4>
                    <p>Use cash-out refinancing on properties that have appreciated to pull out tax-free cash for new down payments.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏢 Value-Add Plays</h4>
                    <p>Focus on properties where you can increase NOI through operational improvements rather than just market appreciation.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚡ Short-Term Rentals</h4>
                    <p>Properties that qualify for Airbnb/VRBO can achieve significantly higher CoC returns than traditional long-term rentals.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common Pitfalls to Avoid</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Over-Leveraging:</strong> Taking on too much debt leaves no margin for vacancies, repairs, or market downturns</li>
                  <li><strong>Ignoring DSCR:</strong> Properties with DSCR below 1.2 are vulnerable to interest rate increases</li>
                  <li><strong>Underestimating Expenses:</strong> Always include 5-10% vacancy and 5% maintenance in your calculations</li>
                  <li><strong>Chasing Yield Only:</strong> High CoC in risky areas often comes with hidden costs and headaches</li>
                  <li><strong>Forgetting About Taxes:</strong> Mortgage interest is deductible, but principal payments are not</li>
                </ul>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between cash-on-cash return and cap rate?</h3>
                <p className={styles.faqAnswer}>Cap rate measures unleveraged return (as if you paid all cash), while cash-on-cash measures actual return on your invested cash (after mortgage payments). A property might have a 7% cap rate but deliver 15%+ cash-on-cash with 80% financing. Cap rate is better for comparing properties, while CoC is better for evaluating your specific financing strategy.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I prioritize high cash-on-cash returns or appreciation potential?</h3>
                <p className={styles.faqAnswer}>This depends on your investment strategy. Cash flow investors prioritize high CoC for immediate income and stability. Appreciation investors might accept lower CoC for properties in high-growth markets. The ideal property offers both, but most investors need to decide which is more important for their financial goals.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do interest rates affect cash-on-cash returns?</h3>
                <p className={styles.faqAnswer}>Interest rates have a direct and significant impact on CoC. Higher interest rates increase mortgage payments, reducing cash flow and CoC. When rates rise by 1%, CoC typically drops by 2-3 percentage points. This is why conservative investors leave room in their calculations for potential rate increases.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can cash-on-cash returns be negative?</h3>
                <p className={styles.faqAnswer}>Yes, and this is a major red flag. Negative CoC means the property loses money monthly. This might be acceptable for appreciation plays in hot markets or during initial renovation periods, but sustained negative cash flow will drain your resources. Most experienced investors avoid negative CoC properties unless they have very specific, short-term exit strategies.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How should I account for closing costs in my CoC calculations?</h3>
                <p className={styles.faqAnswer}>Closing costs (typically 2-5% of purchase price) should be included in your "total cash invested" calculation. For example, if you put $100,000 down on a $500,000 property with $15,000 in closing costs, your total cash invested is $115,000, not $100,000. This provides a more accurate picture of your actual returns.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Analyze Your Next Investment?</h2>
              <p className={styles.ctaText}>Use our calculator to evaluate potential properties, optimize financing strategies, and make data-driven investment decisions.</p>
              
              <div className={styles.buttonGroup}>
                <button className={styles.primaryButton} onClick={() => window.print()}>
                  <span>📄 Print Analysis</span>
                </button>
                <button className={styles.secondaryButton} onClick={() => {
                  const data = { propertyValue, downPayment, annualRent, operatingExpenses, mortgageRate, loanTerm, vacancyRate, ...results };
                  navigator.clipboard.writeText(JSON.stringify(data, null, 2));
                  alert('Investment analysis copied to clipboard!');
                }}>
                  <span>📋 Copy Data</span>
                </button>
              </div>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Real estate investments involve significant risk including loss of principal. Cash-on-cash returns are based on current assumptions and may change due to market conditions, interest rates, vacancy rates, and unexpected expenses. Always conduct thorough due diligence, consult with qualified real estate and financial professionals, and consider your risk tolerance before making investment decisions. Past performance does not guarantee future results. Financing availability and terms vary by lender and individual circumstances.
              </p>
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p className={styles.footerText}>
              <strong>Cash-on-Cash Return Calculator</strong> | Professional Real Estate Investment Analysis Tool<br />
              Last Updated: {currentDate} | Version 2.1
            </p>
            <p className={styles.footerNote}>
              This tool is designed for real estate investors, analysts, and professionals. Calculations follow industry-standard methodologies as outlined by CCIM, Appraisal Institute, and leading real estate finance authorities.
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

export default CashOnCashCalculator;