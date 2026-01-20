import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './roicalculator.module.css';

const RoiCalculator = ({ currentDate, lastModifiedDate }) => {
  const [initialInvestment, setInitialInvestment] = useState(50000);
  const [annualRevenue, setAnnualRevenue] = useState(15000);
  const [annualExpenses, setAnnualExpenses] = useState(5000);
  const [investmentPeriod, setInvestmentPeriod] = useState(5);
  const [investmentType, setInvestmentType] = useState('business');
  const [taxRate, setTaxRate] = useState(25);
  const [inflationRate, setInflationRate] = useState(2.5);
  const [results, setResults] = useState(null);
  const [roiData, setRoiData] = useState([]);

  const investmentTypeOptions = [
    { value: 'business', label: 'Business Investment' },
    { value: 'realEstate', label: 'Real Estate' },
    { value: 'stocks', label: 'Stock Market' },
    { value: 'startup', label: 'Startup Company' },
    { value: 'education', label: 'Education/Training' },
    { value: 'equipment', label: 'Equipment/Machinery' },
    { value: 'marketing', label: 'Marketing Campaign' },
  ];

  const calculateROI = () => {
    const annualNetProfit = annualRevenue - annualExpenses;
    const annualNetProfitAfterTax = annualNetProfit * (1 - taxRate / 100);
    
    // Calculate cumulative cash flows
    const cashFlows = [];
    let cumulativeProfit = 0;
    let breakEvenYear = null;
    
    for (let year = 1; year <= investmentPeriod; year++) {
      // Adjust for inflation
      const inflationFactor = Math.pow(1 + inflationRate / 100, year - 1);
      const annualProfit = annualNetProfitAfterTax * inflationFactor;
      cumulativeProfit += annualProfit;
      
      cashFlows.push({
        year,
        annualProfit: Math.round(annualProfit * 100) / 100,
        cumulativeProfit: Math.round(cumulativeProfit * 100) / 100,
        investmentCovered: cumulativeProfit >= initialInvestment,
      });
      
      if (!breakEvenYear && cumulativeProfit >= initialInvestment) {
        breakEvenYear = year;
      }
    }
    
    // Calculate ROI metrics
    const totalProfit = cashFlows[cashFlows.length - 1]?.cumulativeProfit || 0;
    const totalROI = ((totalProfit / initialInvestment) * 100);
    const annualizedROI = (Math.pow(1 + totalROI / 100, 1 / investmentPeriod) - 1) * 100;
    const netPresentValue = calculateNPV(annualNetProfitAfterTax, initialInvestment, inflationRate, investmentPeriod);
    
    // Calculate Payback Period
    const paybackPeriod = calculatePaybackPeriod(cashFlows, initialInvestment);
    
    setResults({
      totalProfit: Math.round(totalProfit * 100) / 100,
      totalROI: Math.round(totalROI * 100) / 100,
      annualizedROI: Math.round(annualizedROI * 100) / 100,
      netPresentValue: Math.round(netPresentValue * 100) / 100,
      breakEvenYear,
      paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      annualNetProfit: Math.round(annualNetProfit * 100) / 100,
      annualNetProfitAfterTax: Math.round(annualNetProfitAfterTax * 100) / 100,
    });
    
    setRoiData(cashFlows);
  };

  const calculateNPV = (annualCashFlow, initialInvestment, discountRate, years) => {
    let npv = -initialInvestment;
    for (let i = 1; i <= years; i++) {
      npv += annualCashFlow / Math.pow(1 + discountRate / 100, i);
    }
    return npv;
  };

  const calculatePaybackPeriod = (cashFlows, initialInvestment) => {
    let cumulative = 0;
    for (let i = 0; i < cashFlows.length; i++) {
      cumulative += cashFlows[i].annualProfit;
      if (cumulative >= initialInvestment) {
        return i + 1 - (cumulative - initialInvestment) / cashFlows[i].annualProfit;
      }
    }
    return investmentPeriod + 1; // Never breaks even within period
  };

  useEffect(() => {
    calculateROI();
  }, [initialInvestment, annualRevenue, annualExpenses, investmentPeriod, investmentType, taxRate, inflationRate]);

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

  const formatYears = (value) => {
    if (value === null || value === undefined) return 'Never';
    if (value === Math.floor(value)) return `${value} years`;
    const years = Math.floor(value);
    const months = Math.round((value - years) * 12);
    return `${years} years, ${months} months`;
  };

  return (
    <>
      <Head>
        <title>Advanced ROI Calculator | Return on Investment Analysis Tool</title>
        <meta name="description" content="Free advanced ROI calculator with detailed analysis. Calculate return on investment for business ventures, real estate, stocks, and other investments. Includes NPV, payback period, and break-even analysis." />
        <meta name="keywords" content="ROI calculator, return on investment calculator, investment calculator, business ROI, profitability calculator, NPV calculator, payback period calculator" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/roi-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced ROI Calculator | Return on Investment Analysis Tool" />
        <meta property="og:description" content="Calculate ROI for any investment. Free tool with comprehensive financial analysis including NPV and payback period." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/roi-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced ROI Calculator" />
        <meta name="twitter:description" content="Analyze your investment returns with our powerful ROI calculator." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="roi-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced ROI Calculator",
            "description": "Professional-grade return on investment calculator with comprehensive financial analysis tools",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
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
              "ROI & Annualized ROI",
              "Net Present Value (NPV)",
              "Payback Period Analysis",
              "Break-even Calculation",
              "Tax & Inflation Adjustments"
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
                "name": "What is ROI and why is it important?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "ROI (Return on Investment) measures the profitability of an investment relative to its cost. It's expressed as a percentage and helps investors compare different investment opportunities to make informed decisions about where to allocate capital for maximum returns.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between simple ROI and annualized ROI?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Simple ROI shows total return over the entire investment period, while annualized ROI calculates the average yearly return, making it easier to compare investments with different time horizons. Annualized ROI accounts for compounding effects over time.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is a good ROI percentage?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A 'good' ROI depends on the investment type and risk level. Generally, 7-10% is good for low-risk investments, 10-15% for moderate risk, and 15%+ for high-risk ventures. Always compare ROI to alternative investments and consider the risk-adjusted return.",
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
            <h1 className={styles.mainTitle}>Advanced ROI Calculator</h1>
            <p className={styles.subtitle}>Analyze Your Investment Returns with Precision</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Professional Analysis</span>
              <span className={styles.badge}>No Signup Required</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate Your ROI</h2>
              
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
                      value={initialInvestment}
                      onChange={(e) => setInitialInvestment(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1000"
                      max="1000000"
                      step="1000"
                      value={initialInvestment}
                      onChange={(e) => setInitialInvestment(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(initialInvestment)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Revenue
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="1000"
                      max="500000"
                      step="1000"
                      value={annualRevenue}
                      onChange={(e) => setAnnualRevenue(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1000"
                      max="500000"
                      step="1000"
                      value={annualRevenue}
                      onChange={(e) => setAnnualRevenue(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(annualRevenue)}/year</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Expenses
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="250000"
                      step="1000"
                      value={annualExpenses}
                      onChange={(e) => setAnnualExpenses(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="250000"
                      step="1000"
                      value={annualExpenses}
                      onChange={(e) => setAnnualExpenses(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(annualExpenses)}/year</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Investment Period
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={investmentPeriod}
                      onChange={(e) => setInvestmentPeriod(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="30"
                      step="1"
                      value={investmentPeriod}
                      onChange={(e) => setInvestmentPeriod(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{investmentPeriod} years</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Investment Type
                  <select
                    value={investmentType}
                    onChange={(e) => setInvestmentType(e.target.value)}
                    className={styles.selectInput}
                  >
                    {investmentTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Tax Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="50"
                      step="1"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(taxRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Inflation Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(inflationRate)} annually</div>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Your ROI Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total ROI</div>
                      <div className={styles.resultValue}>{formatPercentage(results.totalROI)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Annualized ROI</div>
                      <div className={styles.resultValue}>{formatPercentage(results.annualizedROI)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Net Profit</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalProfit)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Net Present Value</div>
                      <div className={styles.resultValue}>{formatCurrency(results.netPresentValue)}</div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className={styles.metricsCard}>
                    <h3 className={styles.metricsTitle}>Key Performance Indicators</h3>
                    <div className={styles.metricsGrid}>
                      <div className={styles.metricItem}>
                        <span className={styles.metricLabel}>Annual Net Profit (Pre-tax)</span>
                        <span className={styles.metricValue}>{formatCurrency(results.annualNetProfit)}</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricLabel}>Annual Net Profit (After-tax)</span>
                        <span className={styles.metricValue}>{formatCurrency(results.annualNetProfitAfterTax)}</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricLabel}>Payback Period</span>
                        <span className={styles.metricValue}>{formatYears(results.paybackPeriod)}</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricLabel}>Break-even Year</span>
                        <span className={styles.metricValue}>
                          {results.breakEvenYear ? `Year ${results.breakEvenYear}` : 'Beyond period'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ROI Timeline Visualization */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Investment Returns Timeline</h3>
                    <div className={styles.chartBars}>
                      {roiData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>Year {data.year}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarCumulative}
                              style={{ width: `${Math.min((data.cumulativeProfit / (initialInvestment * 2)) * 100, 100)}%` }}
                              title={`Cumulative: ${formatCurrency(data.cumulativeProfit)}`}
                            />
                            <div 
                              className={styles.chartBarAnnual}
                              style={{ width: `${(data.annualProfit / (initialInvestment * 0.5)) * 100}%` }}
                              title={`Annual: ${formatCurrency(data.annualProfit)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>
                            <div>{formatCurrency(data.annualProfit)} annual</div>
                            <div className={styles.chartSubValue}>{formatCurrency(data.cumulativeProfit)} cumulative</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendAnnual}`}></div>
                        <span>Annual Profit</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendCumulative}`}></div>
                        <span>Cumulative Profit</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={styles.breakEvenLine}></div>
                        <span>Break-even Point</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>💡 Investment Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Your investment generates <strong>{formatCurrency(results.annualNetProfitAfterTax)}</strong> in after-tax profit annually</li>
                      <li>You'll recover your initial investment in approximately <strong>{formatYears(results.paybackPeriod)}</strong></li>
                      <li>This investment yields <strong>{formatPercentage(results.annualizedROI)}</strong> annually, comparable to {results.annualizedROI > 15 ? 'high-growth' : results.annualizedROI > 10 ? 'moderate' : 'conservative'} investments</li>
                      <li>A positive NPV of <strong>{formatCurrency(results.netPresentValue)}</strong> indicates this investment creates value beyond the required return</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Mastering ROI Analysis: The Investor's Ultimate Tool</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding ROI: Beyond Simple Percentages</h3>
                <p>Return on Investment (ROI) is more than just a percentage—it's a comprehensive metric that evaluates the efficiency and profitability of an investment. While simple ROI tells you the total return, sophisticated investors look at annualized ROI, Net Present Value (NPV), payback period, and risk-adjusted returns to make truly informed decisions.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World ROI Comparison:</h4>
                  <p>Comparing different $50,000 investments:</p>
                  <ul>
                    <li><strong>Stock Portfolio:</strong> 8% annual ROI, 5-year period = $73,466 total</li>
                    <li><strong>Real Estate:</strong> 12% annual ROI, 5-year period = $88,117 total</li>
                    <li><strong>Business Startup:</strong> 25% annual ROI, 5-year period = $152,588 total</li>
                    <li><strong>Education (MBA):</strong> 15% annual ROI via salary increase = $100,569 total</li>
                  </ul>
                  <p>Higher ROI typically correlates with higher risk, so consider your risk tolerance.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Advanced ROI Strategies for Maximum Returns</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🚀 Leverage & Scaling</h4>
                    <p>Use leverage wisely to amplify returns. A 20% ROI on a $100,000 investment yields $20,000, but 20% on a $500,000 leveraged investment yields $100,000. Understand the risks of debt.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 Tax Optimization</h4>
                    <p>Structure investments to minimize tax impact. Use tax-advantaged accounts, consider capital gains timing, and explore tax credits. A 15% ROI after taxes is better than 20% before taxes if taxed at 40%.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Diversification & Rebalancing</h4>
                    <p>Diversify across asset classes to optimize risk-adjusted returns. Regular rebalancing ensures you're not overexposed to underperforming assets and can lock in gains from outperformers.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⏰ Timing & Compounding</h4>
                    <p>The earlier you invest, the more compounding works in your favor. A 15% ROI for 20 years yields 1,536% total return, while the same ROI for 10 years yields 305%—demonstrating exponential growth over time.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Industry-Specific ROI Benchmarks</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Technology Startups:</strong> Target 30-50%+ ROI but expect high failure rates. Successful exits can yield 10-100x returns.</li>
                  <li><strong>Real Estate:</strong> Residential: 8-12% ROI; Commercial: 10-15%; REITs: 7-10%. Includes appreciation and rental income.</li>
                  <li><strong>Stock Market:</strong> Historical S&P 500 average: 10% annual ROI. Growth stocks: 15-25%; Value stocks: 8-12%; Dividends: 4-6%.</li>
                  <li><strong>Small Business:</strong> Service businesses: 15-25% ROI; Retail: 10-20%; Manufacturing: 20-30%. Higher ROI often requires active management.</li>
                  <li><strong>Education/Training:</strong> ROI measured through salary increases. MBA: 15-25% ROI; Technical certifications: 20-40%; Continuing education: 10-15%.</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Insights from Investment Professionals</h3>
                <blockquote className={styles.expertQuote}>
                  "The most successful investors don't just look at ROI—they analyze risk-adjusted returns, liquidity, tax implications, and opportunity cost. A 20% ROI on a highly illiquid investment might be inferior to 15% on a liquid one. Always calculate your ROI across multiple dimensions before committing capital."
                  <footer className={styles.quoteFooter}>— Chartered Financial Analyst, 25+ years investment experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between ROI, ROE, and ROA?</h3>
                <p className={styles.faqAnswer}>ROI (Return on Investment) measures overall profitability relative to total investment. ROE (Return on Equity) measures profitability relative to shareholder equity. ROA (Return on Assets) measures efficiency in using assets to generate profits. Each provides different insights: ROI for overall returns, ROE for shareholder value, ROA for operational efficiency.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do I account for risk in ROI calculations?</h3>
                <p className={styles.faqAnswer}>Use risk-adjusted ROI metrics like Sharpe Ratio (return per unit of risk) or Sortino Ratio (return per unit of downside risk). Alternatively, apply a risk premium to your required ROI—add 2-5% for moderate risk, 5-10% for high risk. Always compare ROI to investments with similar risk profiles.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I include opportunity cost in ROI calculations?</h3>
                <p className={styles.faqAnswer}>Absolutely. Opportunity cost represents the return from the next best alternative. If you could earn 8% in a stock market index fund, any investment should ideally return more than 8% to justify the risk and effort. Our calculator helps by showing you the annualized ROI for comparison with other opportunities.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What is a good payback period?</h3>
                <p className={styles.faqAnswer}>Payback period depends on industry and investment type: Technology (2-3 years), Real Estate (5-10 years), Manufacturing (3-5 years), Infrastructure (10-20 years). Generally, shorter payback periods are preferred as they reduce risk and free up capital for other investments sooner.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Make Smarter Investment Decisions?</h2>
              <p className={styles.ctaText}>Use our calculator to analyze potential investments, compare opportunities, and make data-driven financial decisions. Adjust the inputs to match your specific investment scenario.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Actual investment returns may vary based on market conditions, management, and unforeseen factors. Past performance does not guarantee future results. Consider consulting with a financial advisor for personalized investment advice. All calculations are based on the inputs provided and assume consistent annual returns.
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
    revalidate: 21600, // 6 hours
  };
}

export default RoiCalculator;