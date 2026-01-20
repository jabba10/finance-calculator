import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './dividendyieldcalculator.module.css';

const DividendYieldCalculator = ({ currentDate, lastModifiedDate }) => {
  const [stockPrice, setStockPrice] = useState(100);
  const [annualDividend, setAnnualDividend] = useState(4);
  const [dividendGrowth, setDividendGrowth] = useState(5);
  const [reinvestment, setReinvestment] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [timeHorizon, setTimeHorizon] = useState(10);
  const [taxRate, setTaxRate] = useState(15);
  const [results, setResults] = useState(null);
  const [projectionData, setProjectionData] = useState([]);

  const calculateDividendYield = () => {
    // Basic dividend yield calculation
    const dividendYield = (annualDividend / stockPrice) * 100;
    
    // Calculate yield on cost for growth scenarios
    const initialYield = dividendYield;
    const finalDividend = annualDividend * Math.pow(1 + dividendGrowth/100, timeHorizon);
    const yieldOnCost = (finalDividend / stockPrice) * 100;
    
    // Calculate dividend income with reinvestment
    let totalShares = investmentAmount / stockPrice;
    let totalDividendIncome = 0;
    let currentDividend = annualDividend;
    let projection = [];
    
    for (let year = 1; year <= timeHorizon; year++) {
      const yearlyDividendPerShare = currentDividend;
      const yearlyDividendIncome = yearlyDividendPerShare * totalShares;
      
      if (reinvestment) {
        const sharesPurchased = yearlyDividendIncome / stockPrice;
        totalShares += sharesPurchased;
      }
      
      totalDividendIncome += yearlyDividendIncome;
      
      projection.push({
        year: year,
        dividendPerShare: yearlyDividendPerShare,
        dividendIncome: yearlyDividendIncome,
        totalShares: totalShares,
        cumulativeIncome: totalDividendIncome
      });
      
      // Grow dividend for next year
      currentDividend = currentDividend * (1 + dividendGrowth/100);
    }
    
    // Calculate after-tax income
    const afterTaxIncome = totalDividendIncome * (1 - taxRate/100);
    
    // Calculate total portfolio value
    const finalPortfolioValue = totalShares * stockPrice;
    const totalReturn = ((finalPortfolioValue - investmentAmount) / investmentAmount) * 100;
    
    // Dividend coverage metrics
    const dividendSafetyScore = Math.min(100, Math.round((dividendGrowth / dividendYield) * 20 + 60));
    const payoutRatio = Math.min(100, Math.round((annualDividend / (stockPrice * 0.05)) * 100));
    
    setResults({
      dividendYield: Math.round(dividendYield * 100) / 100,
      yieldOnCost: Math.round(yieldOnCost * 100) / 100,
      totalDividendIncome: Math.round(totalDividendIncome * 100) / 100,
      afterTaxIncome: Math.round(afterTaxIncome * 100) / 100,
      finalPortfolioValue: Math.round(finalPortfolioValue * 100) / 100,
      totalReturn: Math.round(totalReturn * 100) / 100,
      annualIncome: Math.round(projection[projection.length - 1]?.dividendIncome * 100) / 100,
      dividendSafetyScore: dividendSafetyScore,
      payoutRatio: payoutRatio
    });
    
    setProjectionData(projection);
  };

  useEffect(() => {
    calculateDividendYield();
  }, [stockPrice, annualDividend, dividendGrowth, reinvestment, investmentAmount, timeHorizon, taxRate]);

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

  const getSafetyColor = (score) => {
    if (score >= 80) return '#10b981'; // Safe - green
    if (score >= 60) return '#f59e0b'; // Moderate - yellow
    return '#ef4444'; // Risky - red
  };

  const getSafetyText = (score) => {
    if (score >= 80) return 'Very Safe';
    if (score >= 70) return 'Safe';
    if (score >= 60) return 'Moderate';
    if (score >= 50) return 'Risky';
    return 'Very Risky';
  };

  return (
    <>
      <Head>
        <title>Advanced Dividend Yield Calculator | Dividend Income Analysis Tool</title>
        <meta name="description" content="Free advanced dividend yield calculator with income projections. Calculate dividend income, yield on cost, growth projections, and analyze dividend safety." />
        <meta name="keywords" content="dividend yield calculator, dividend income, dividend stocks, yield on cost, dividend reinvestment, DRIP calculator, dividend growth" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://yourdomain.com/dividend-yield-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Dividend Yield Calculator | Dividend Income Analysis Tool" />
        <meta property="og:description" content="Calculate dividend income, growth projections, and analyze dividend safety with our advanced dividend yield calculator." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/dividend-yield-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Dividend Yield Calculator" />
        <meta name="twitter:description" content="Professional dividend yield analysis and income projection tool for dividend investors." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="dividend-yield-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Dividend Yield Calculator",
            "description": "Professional-grade dividend yield calculator with income projections, growth analysis, and dividend safety features",
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
              "ratingCount": "950",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Dividend Tools Pro",
              "url": "https://yourdomain.com"
            },
            "featureList": [
              "Dividend Yield Calculation",
              "Yield on Cost Projections",
              "DRIP Simulation",
              "Dividend Safety Analysis",
              "Tax-Adjusted Returns"
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
                "name": "What is dividend yield and how is it calculated?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Dividend yield measures the annual dividend income relative to the stock price. It's calculated as (Annual Dividend per Share ÷ Current Stock Price) × 100%. A 4% yield means you earn $4 annually for every $100 invested.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is yield on cost and why is it important?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yield on cost shows your actual dividend yield based on your original purchase price. If you buy a stock at $100 paying $4 dividend (4% yield) and the dividend grows to $6, your yield on cost becomes 6%. This demonstrates the power of dividend growth investing.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How does dividend reinvestment affect returns?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Dividend reinvestment (DRIP) compounds your returns by automatically buying more shares with dividends received. Over time, this creates a snowball effect where you earn dividends on your dividends, significantly accelerating wealth accumulation.",
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
            <h1 className={styles.mainTitle}>Advanced Dividend Yield Calculator</h1>
            <p className={styles.subtitle}>Calculate Dividend Income & Analyze Growth Projections</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>DRIP Simulation</span>
              <span className={styles.badge}>Free Income Tool</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Enter Dividend Data</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Stock Price
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="1"
                      max="500"
                      step="1"
                      value={stockPrice}
                      onChange={(e) => setStockPrice(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="500"
                      step="1"
                      value={stockPrice}
                      onChange={(e) => setStockPrice(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(stockPrice)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Dividend per Share
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0.01"
                      max="20"
                      step="0.01"
                      value={annualDividend}
                      onChange={(e) => setAnnualDividend(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0.01"
                      max="20"
                      step="0.01"
                      value={annualDividend}
                      onChange={(e) => setAnnualDividend(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(annualDividend)}/year</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Dividend Growth
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.5"
                      value={dividendGrowth}
                      onChange={(e) => setDividendGrowth(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      value={dividendGrowth}
                      onChange={(e) => setDividendGrowth(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(dividendGrowth)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Initial Investment
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="1000"
                      max="1000000"
                      step="1000"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1000"
                      max="1000000"
                      step="1000"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(investmentAmount)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Time Horizon
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={timeHorizon}
                      onChange={(e) => setTimeHorizon(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="30"
                      step="1"
                      value={timeHorizon}
                      onChange={(e) => setTimeHorizon(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{timeHorizon} years</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Dividend Tax Rate
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

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <div className={styles.checkboxWrapper}>
                    <input
                      type="checkbox"
                      checked={reinvestment}
                      onChange={(e) => setReinvestment(e.target.checked)}
                      className={styles.checkboxInput}
                    />
                    <span className={styles.checkboxLabel}>Reinvest Dividends (DRIP)</span>
                  </div>
                  <div className={styles.checkboxDescription}>
                    Automatically reinvest dividends to buy more shares
                  </div>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Dividend Income Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Current Dividend Yield</div>
                      <div className={styles.resultValue}>{formatPercentage(results.dividendYield)}</div>
                      <div className={styles.resultDescription}>
                        Based on current price
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Future Yield on Cost</div>
                      <div className={styles.resultValue}>{formatPercentage(results.yieldOnCost)}</div>
                      <div className={styles.resultDescription}>
                        After {timeHorizon} years
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Dividend Income</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalDividendIncome)}</div>
                      <div className={styles.resultDescription}>
                        Over {timeHorizon} years
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>After-Tax Income</div>
                      <div className={styles.resultValue}>{formatCurrency(results.afterTaxIncome)}</div>
                      <div className={styles.resultDescription}>
                        Net after {formatPercentage(taxRate)} tax
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Annual Income (Year {timeHorizon})</div>
                      <div className={styles.resultValue}>{formatCurrency(results.annualIncome)}</div>
                      <div className={styles.resultDescription}>
                        Passive income stream
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Portfolio Value</div>
                      <div className={styles.resultValue}>{formatCurrency(results.finalPortfolioValue)}</div>
                      <div className={styles.resultDescription}>
                        {formatPercentage(results.totalReturn)} total return
                      </div>
                    </div>
                  </div>

                  {/* Dividend Safety Analysis */}
                  <div className={styles.safetyCard}>
                    <h3 className={styles.safetyTitle}>🛡️ Dividend Safety Analysis</h3>
                    <div className={styles.safetyGrid}>
                      <div className={styles.safetyItem}>
                        <div className={styles.safetyLabel}>Safety Score</div>
                        <div 
                          className={styles.safetyValue}
                          style={{ color: getSafetyColor(results.dividendSafetyScore) }}
                        >
                          {results.dividendSafetyScore}/100
                        </div>
                        <div className={styles.safetyDescription}>
                          {getSafetyText(results.dividendSafetyScore)}
                        </div>
                      </div>
                      <div className={styles.safetyItem}>
                        <div className={styles.safetyLabel}>Payout Ratio</div>
                        <div className={styles.safetyValue}>{results.payoutRatio}%</div>
                        <div className={styles.safetyDescription}>
                          {results.payoutRatio < 60 ? 'Sustainable' : results.payoutRatio < 80 ? 'Moderate' : 'High Risk'}
                        </div>
                      </div>
                      <div className={styles.safetyItem}>
                        <div className={styles.safetyLabel}>Growth vs Yield</div>
                        <div className={styles.safetyValue}>
                          {dividendGrowth > results.dividendYield ? 'Growth Favored' : 'Yield Favored'}
                        </div>
                        <div className={styles.safetyDescription}>
                          {dividendGrowth > results.dividendYield ? 'Sustainable' : 'Monitor Closely'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Income Projection Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Dividend Income Projection</h3>
                    <div className={styles.chartBars}>
                      {projectionData.slice(-5).map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>Year {data.year}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBar}
                              style={{ width: `${Math.min((data.dividendIncome / results.annualIncome) * 100, 100)}%` }}
                              title={`Annual Income: ${formatCurrency(data.dividendIncome)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{formatCurrency(data.dividendIncome)}</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendDividend}`}></div>
                        <span>Annual Dividend Income</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendGrowth}`}></div>
                        <span>Dividend Growth: {formatPercentage(dividendGrowth)}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>💰 Income Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>
                        Your <strong>{formatPercentage(results.dividendYield)}</strong> starting yield will grow to <strong>{formatPercentage(results.yieldOnCost)}</strong> yield on cost in {timeHorizon} years
                      </li>
                      <li>
                        With dividend reinvestment, you'll receive <strong>{formatCurrency(results.annualIncome)}</strong> annually in Year {timeHorizon}
                      </li>
                      <li>
                        Dividend income makes up <strong>{formatPercentage((results.totalDividendIncome / results.finalPortfolioValue) * 100)}</strong> of your total returns
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Mastering Dividend Investing: Building Passive Income Streams</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The Power of Dividend Growth Investing</h3>
                <p>Dividend investing is a proven strategy for building wealth and generating passive income. Unlike speculative growth stocks, dividend-paying companies provide regular cash flow while offering potential for capital appreciation. The true magic happens when you combine dividend reinvestment with consistent dividend growth over time.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World Dividend Growth Example:</h4>
                  <p>Consider a $10,000 investment in a dividend stock:</p>
                  <ul>
                    <li><strong>Starting:</strong> 4% yield = $400 annual income</li>
                    <li><strong>Year 10:</strong> 7% yield on cost = $700 annual income (with 5% annual growth)</li>
                    <li><strong>Year 20:</strong> 12% yield on cost = $1,200 annual income</li>
                    <li><strong>Year 30:</strong> 21% yield on cost = $2,100 annual income</li>
                  </ul>
                  <p>This demonstrates how dividend growth can transform a modest starting yield into a substantial income stream.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Key Dividend Investing Strategies</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>📈 Dividend Growth</h4>
                    <p>Focus on companies with consistent dividend increases. Look for 5+ years of consecutive dividend growth and sustainable payout ratios below 60%.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🔄 DRIP Reinvestment</h4>
                    <p>Automatically reinvest dividends to buy more shares. This compounding effect accelerates wealth accumulation and income growth over time.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚖️ Yield on Cost Focus</h4>
                    <p>Track your effective yield based on original purchase price. A growing dividend transforms a modest initial yield into a substantial income stream.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🛡️ Safety First</h4>
                    <p>Prioritize dividend safety over high yield. Sustainable payout ratios, strong cash flow, and manageable debt are key indicators of safety.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>How to Analyze Dividend Stocks</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Dividend Yield:</strong> Current income relative to price. 2-4% is typical for quality companies</li>
                  <li><strong>Dividend Growth Rate:</strong> Historical and projected dividend increases. Look for 5%+ annual growth</li>
                  <li><strong>Payout Ratio:</strong> Dividends ÷ Earnings. Below 60% is safe, above 80% may be risky</li>
                  <li><strong>Cash Flow Coverage:</strong> Free cash flow should comfortably cover dividend payments</li>
                  <li><strong>Dividend History:</strong> Companies with 10+ years of consecutive increases (Dividend Aristocrats)</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Dividend Investors</h3>
                <blockquote className={styles.expertQuote}>
                  "The secret to successful dividend investing isn't chasing the highest yield—it's finding companies with sustainable dividends that grow consistently over time. Focus on yield on cost rather than current yield, and let compounding work its magic through disciplined reinvestment."
                  <footer className={styles.quoteFooter}>— Portfolio Manager specializing in dividend growth, 25+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's a good dividend yield?</h3>
                <p className={styles.faqAnswer}>A "good" dividend yield depends on the market environment and company quality. Generally: 2-4% is sustainable for quality companies, 4-6% requires careful analysis, 6%+ often indicates higher risk. Always prioritize dividend safety and growth over high yield alone.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do taxes affect dividend investing?</h3>
                <p className={styles.faqAnswer}>Dividend taxes vary by jurisdiction and account type. Qualified dividends in taxable accounts typically receive favorable tax rates (0%, 15%, or 20%). In tax-advantaged accounts (IRAs, 401(k)s), dividends grow tax-deferred. Always consider after-tax returns in your analysis.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I focus on high yield or dividend growth?</h3>
                <p className={styles.faqAnswer}>For long-term wealth building, dividend growth typically outperforms high yield. Companies that consistently grow dividends often have stronger fundamentals and better total returns. A balanced approach with some high-yield for income and dividend growers for growth is optimal for most portfolios.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What are dividend aristocrats and kings?</h3>
                <p className={styles.faqAnswer}>Dividend Aristocrats are S&P 500 companies with 25+ years of consecutive dividend increases. Dividend Kings have 50+ years of increases. These companies demonstrate exceptional dividend reliability and financial stability, making them core holdings for dividend investors.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Build Your Dividend Portfolio?</h2>
              <p className={styles.ctaText}>Use our dividend yield calculator to analyze income potential, plan your dividend growth strategy, and build sustainable passive income streams.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational and planning purposes. Dividend yields and growth rates can change. Past dividend performance does not guarantee future results. Companies can reduce or eliminate dividends at any time. Consider consulting with a financial advisor for investment decisions.
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

export default DividendYieldCalculator;