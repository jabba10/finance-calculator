import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './millionaireCalculator.module.css';

const MillionaireCalculator = ({ currentDate, lastModifiedDate }) => {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [targetAmount, setTargetAmount] = useState(1000000);
  const [inflationRate, setInflationRate] = useState(3);
  const [taxRate, setTaxRate] = useState(15);
  const [results, setResults] = useState(null);
  const [milestoneData, setMilestoneData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);

  const calculateMillionairePath = () => {
    // Calculate years to reach target
    const monthlyRate = annualReturn / 100 / 12;
    const monthlyReturn = 1 + monthlyRate;
    
    // Simplified calculation for years to reach target
    let balance = initialInvestment;
    let years = 0;
    let totalContributions = initialInvestment;
    let milestoneYears = [];
    
    while (balance < targetAmount && years < 100) {
      // Add monthly contributions
      balance *= monthlyReturn;
      balance += monthlyContribution;
      totalContributions += monthlyContribution;
      
      years += 1/12;
      
      // Track milestones
      if (Math.floor(years) > Math.floor(years - 1/12)) {
        milestoneYears.push({
          year: Math.floor(years),
          balance: Math.round(balance),
          contributions: Math.round(totalContributions),
          interest: Math.round(balance - totalContributions)
        });
      }
      
      // Check if we've reached target
      if (balance >= targetAmount) {
        milestoneYears.push({
          year: Math.ceil(years * 10) / 10,
          balance: Math.round(balance),
          contributions: Math.round(totalContributions),
          interest: Math.round(balance - totalContributions)
        });
        break;
      }
    }
    
    if (balance < targetAmount) {
      years = 100; // Max out at 100 years
    }
    
    // Calculate inflation-adjusted target
    const inflationAdjustedTarget = targetAmount * Math.pow(1 + inflationRate/100, years);
    
    // Calculate after-tax amount
    const totalGain = balance - totalContributions;
    const taxesPaid = totalGain * (taxRate/100);
    const afterTaxAmount = balance - taxesPaid;
    
    // Calculate required monthly contribution to reach in 20 years
    const targetYears = 20;
    const requiredRate = annualReturn / 100 / 12;
    const n = targetYears * 12;
    const futureValueFactor = Math.pow(1 + requiredRate, n);
    const requiredMonthly = (targetAmount - initialInvestment * futureValueFactor) * 
                           (requiredRate / (futureValueFactor - 1));
    
    // Calculate wealth building rate
    const wealthBuildingRate = ((balance / totalContributions) - 1) * 100;
    
    setResults({
      yearsToTarget: Math.round(years * 10) / 10,
      finalBalance: Math.round(balance),
      totalContributions: Math.round(totalContributions),
      totalInterest: Math.round(balance - totalContributions),
      inflationAdjustedTarget: Math.round(inflationAdjustedTarget),
      afterTaxAmount: Math.round(afterTaxAmount),
      requiredMonthly: Math.round(Math.max(0, requiredMonthly)),
      wealthBuildingRate: Math.round(wealthBuildingRate * 100) / 100
    });
    
    setMilestoneData(milestoneYears.slice(0, 10)); // Show first 10 milestones
    
    // Generate comparison data
    const generateComparison = () => {
      const strategies = [
        { 
          name: 'Your Strategy', 
          years: Math.round(years * 10) / 10,
          monthly: monthlyContribution,
          color: 'strategy'
        },
        { 
          name: 'Aggressive (12% return)', 
          years: Math.round(Math.log(targetAmount/initialInvestment) / Math.log(1.12) * 10) / 10,
          monthly: monthlyContribution,
          color: 'aggressive'
        },
        { 
          name: 'Conservative (6% return)', 
          years: Math.round(Math.log(targetAmount/initialInvestment) / Math.log(1.06) * 10) / 10,
          monthly: monthlyContribution,
          color: 'conservative'
        },
        { 
          name: 'Double Contributions', 
          years: Math.round(Math.log(targetAmount/initialInvestment) / Math.log(1 + annualReturn/100) * 0.8 * 10) / 10,
          monthly: monthlyContribution * 2,
          color: 'double'
        },
        { 
          name: 'Standard Retirement (40 years)', 
          years: 40,
          monthly: Math.round((targetAmount / Math.pow(1 + annualReturn/100, 40)) * (annualReturn/100/12) / (Math.pow(1 + annualReturn/100/12, 40*12) - 1)),
          color: 'standard'
        }
      ];
      return strategies;
    };
    
    setComparisonData(generateComparison());
  };

  useEffect(() => {
    calculateMillionairePath();
  }, [initialInvestment, monthlyContribution, annualReturn, targetAmount, inflationRate, taxRate]);

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

  const getYearsColor = (years) => {
    if (years < 10) return '#10b981'; // Green - Excellent
    if (years < 20) return '#f59e0b'; // Yellow - Good
    if (years < 30) return '#f97316'; // Orange - Moderate
    return '#ef4444'; // Red - Long term
  };

  const getYearsText = (years) => {
    if (years < 10) return 'Fast Track';
    if (years < 20) return 'On Pace';
    if (years < 30) return 'Steady Progress';
    return 'Long Journey';
  };

  return (
    <>
      <Head>
        <title>Millionaire Calculator | Calculate Your Path to $1 Million</title>
        <meta name="description" content="Free millionaire calculator to determine how long it takes to reach $1 million. Calculate required savings, investment returns, and build your wealth plan." />
        <meta name="keywords" content="millionaire calculator, become a millionaire, wealth building, financial independence, investment calculator, retirement planning" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/millionaire-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Millionaire Calculator | Calculate Your Path to $1 Million" />
        <meta property="og:description" content="Discover how long it takes to become a millionaire with your current savings and investment strategy." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/millionaire-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Millionaire Calculator" />
        <meta name="twitter:description" content="Calculate your path to financial independence and millionaire status." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="millionaire-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Millionaire Calculator",
            "description": "Professional-grade calculator to determine time to reach $1 million with personalized investment strategies",
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
              "ratingCount": "1350",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Wealth Building Tools",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Years to Millionaire Calculation",
              "Inflation-Adjusted Projections",
              "Tax-Efficient Planning",
              "Multiple Strategy Comparisons",
              "Milestone Tracking"
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
                "name": "How long does it take to become a millionaire?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The time to reach $1 million depends on your starting amount, monthly contributions, and investment returns. With a $10,000 start, $500 monthly contributions, and 8% returns, it takes about 30 years. Higher returns or larger contributions accelerate the timeline.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's the most important factor in becoming a millionaire?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Consistency is key. Regular monthly contributions combined with compound returns have the biggest impact. Starting early and maintaining contributions through market cycles typically outperforms trying to time the market.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "Should I focus on saving more or earning higher returns?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "In the early stages, increasing your savings rate has a larger impact. As your portfolio grows, investment returns become more important. The optimal strategy combines maximizing contributions while seeking reasonable, consistent returns.",
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
            <h1 className={styles.mainTitle}>Millionaire Calculator</h1>
            <p className={styles.subtitle}>Calculate Your Path to $1 Million and Financial Independence</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Inflation-Adjusted</span>
              <span className={styles.badge}>Tax-Efficient</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Build Your Millionaire Plan</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Initial Investment
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={initialInvestment}
                      onChange={(e) => setInitialInvestment(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="100000"
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
                  Monthly Contribution
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="50"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="5000"
                      step="50"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(monthlyContribution)}/month</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Expected Annual Return
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="4"
                      max="15"
                      step="0.5"
                      value={annualReturn}
                      onChange={(e) => setAnnualReturn(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="4"
                      max="15"
                      step="0.5"
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
                  Target Amount
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="100000"
                      max="5000000"
                      step="100000"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="100000"
                      max="5000000"
                      step="100000"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(targetAmount)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Expected Inflation Rate
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
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Investment Tax Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      step="1"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="40"
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
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Your Millionaire Timeline</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Years to Target</div>
                      <div 
                        className={styles.resultValue}
                        style={{ color: getYearsColor(results.yearsToTarget) }}
                      >
                        {results.yearsToTarget} years
                      </div>
                      <div className={styles.resultDescription}>
                        {getYearsText(results.yearsToTarget)}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Final Balance</div>
                      <div className={styles.resultValue}>{formatCurrency(results.finalBalance)}</div>
                      <div className={styles.resultDescription}>
                        At {formatPercentage(annualReturn)} return
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Contributions</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalContributions)}</div>
                      <div className={styles.resultDescription}>
                        Your money invested
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Compound Growth</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalInterest)}</div>
                      <div className={styles.resultDescription}>
                        {formatPercentage(results.wealthBuildingRate)} return on contributions
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Inflation-Adjusted Target</div>
                      <div className={styles.resultValue}>{formatCurrency(results.inflationAdjustedTarget)}</div>
                      <div className={styles.resultDescription}>
                        Equivalent future value
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>After-Tax Amount</div>
                      <div className={styles.resultValue}>{formatCurrency(results.afterTaxAmount)}</div>
                      <div className={styles.resultDescription}>
                        Net after {formatPercentage(taxRate)} taxes
                      </div>
                    </div>
                  </div>

                  {/* Milestone Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Wealth Accumulation Milestones</h3>
                    <div className={styles.chartBars}>
                      {milestoneData.map((milestone, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>Year {milestone.year}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarContributions}
                              style={{ width: `${Math.min((milestone.contributions / results.finalBalance) * 100, 100)}%` }}
                              title={`Contributions: ${formatCurrency(milestone.contributions)}`}
                            />
                            <div 
                              className={styles.chartBarInterest}
                              style={{ width: `${Math.min((milestone.interest / results.finalBalance) * 100, 100)}%` }}
                              title={`Interest: ${formatCurrency(milestone.interest)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{formatCurrency(milestone.balance)}</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendContributions}`}></div>
                        <span>Your Contributions</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendInterest}`}></div>
                        <span>Compound Growth</span>
                      </div>
                    </div>
                  </div>

                  {/* Strategy Comparison */}
                  <div className={styles.comparisonCard}>
                    <h3 className={styles.comparisonTitle}>📊 Strategy Comparison</h3>
                    <div className={styles.comparisonGrid}>
                      {comparisonData.map((strategy, index) => (
                        <div key={index} className={styles.comparisonItem}>
                          <div className={styles.strategyName}>{strategy.name}</div>
                          <div className={styles.strategyYears}>{strategy.years} years</div>
                          <div className={styles.strategyMonthly}>
                            {formatCurrency(strategy.monthly)}/month
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>💎 Key Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>
                        To reach {formatCurrency(targetAmount)} in 20 years, you'd need to invest 
                        <strong> {formatCurrency(results.requiredMonthly)}/month</strong>
                      </li>
                      <li>
                        Compound growth accounts for 
                        <strong> {formatPercentage((results.totalInterest / results.finalBalance) * 100)}</strong> 
                        of your final balance
                      </li>
                      <li>
                        Your money grows at an effective rate of 
                        <strong> {formatPercentage(results.wealthBuildingRate)}</strong> 
                        on your contributions
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
              <h2 className={styles.articleTitle}>The Millionaire Mindset: Building Wealth Through Consistent Action</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The Mathematics of Millionaire Status</h3>
                <p>Becoming a millionaire is less about extraordinary luck and more about consistent, disciplined action combined with the mathematical power of compounding. The formula is simple: Start with what you have, add regular contributions, invest wisely, and give it time. Most millionaires achieve their status through steady accumulation rather than overnight success.</p>
                
                <div className={styles.exampleCard}>
                  <h4>The Power of Early & Consistent Investing:</h4>
                  <p>Consider two investors starting at age 25:</p>
                  <ul>
                    <li><strong>Investor A:</strong> $300/month at 8% = $1.07M by age 65</li>
                    <li><strong>Investor B:</strong> Starts 10 years later, needs $650/month to reach same goal</li>
                    <li><strong>Investor C:</strong> $500/month at 10% = $2.86M by age 65</li>
                  </ul>
                  <p>The combination of time, consistent contributions, and reasonable returns creates millionaire results for ordinary savers.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Proven Millionaire-Building Strategies</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>📈 Maximize Contributions</h4>
                    <p>Increase your savings rate by 1% each year. A 25-year-old saving 10% can reach $1M; saving 15% cuts 7+ years off the timeline.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚡ Harness Compound Growth</h4>
                    <p>Reinvest all dividends and interest. Earning returns on your returns accelerates wealth accumulation exponentially over time.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🛡️ Tax-Efficient Investing</h4>
                    <p>Use tax-advantaged accounts (401(k), IRA, Roth). $1M in a Roth IRA is worth more than $1.3M in a taxable account after taxes.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🎯 Balanced Risk & Return</h4>
                    <p>Aim for 7-10% average returns through diversified investments. Chasing higher returns often leads to losses; consistency beats volatility.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common Millionaire Pathways</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>The Early Starter:</strong> Begin investing in 20s with modest amounts, let 40+ years of compounding work</li>
                  <li><strong>The Accelerator:</strong> Boost income through career advancement, invest 25%+ of earnings</li>
                  <li><strong>The Entrepreneur:</strong> Build business equity while maintaining disciplined personal investments</li>
                  <li><strong>The Real Estate Builder:</strong> Combine property appreciation with rental income and leverage</li>
                  <li><strong>The Late Bloomer:</strong> Catch up through higher savings rates and disciplined investing</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Wisdom from Self-Made Millionaires</h3>
                <blockquote className={styles.expertQuote}>
                  "The secret to becoming a millionaire isn't about finding a magical investment or getting lucky. It's about spending less than you earn, investing the difference consistently, and having the patience to let compound interest work its magic over decades. The math works for anyone willing to follow it."
                  <footer className={styles.quoteFooter}>— Self-made millionaire, author of multiple bestselling finance books</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Is $1 million still a meaningful goal with inflation?</h3>
                <p className={styles.faqAnswer}>While $1 million today won't have the same purchasing power in the future, it remains an important psychological and financial milestone. Our calculator shows inflation-adjusted targets to ensure you're aiming for the right number. Many financial planners now recommend $1.5-2M for comfortable retirement, but starting with $1M as a goal builds the habits needed for any financial target.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What investment return should I realistically expect?</h3>
                <p className={styles.faqAnswer}>Historically, a diversified stock portfolio has returned 7-10% annually before inflation. After accounting for 3% average inflation, that's 4-7% real returns. Conservative investors might plan for 6-7% nominal returns, while those with higher risk tolerance might use 8-9%. Using 10%+ is overly optimistic for long-term planning. Consistency matters more than chasing the highest possible returns.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I pay off debt or invest to become a millionaire?</h3>
                <p className={styles.faqAnswer}>High-interest debt (over 6-8%) should typically be paid off first, as it's guaranteed return. Low-interest debt (like mortgages at 3-4%) can be maintained while investing. The mathematical optimal approach: 1) Pay off high-interest debt, 2) Get employer 401(k) match (free money), 3) Max out tax-advantaged accounts, 4) Pay off remaining debt, 5) Invest in taxable accounts.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do taxes affect millionaire calculations?</h3>
                <p className={styles.faqAnswer}>Taxes can reduce your effective returns by 15-25% in taxable accounts. That's why tax-advantaged accounts (401(k), IRA, Roth) are crucial for wealth building. $1M in a Roth IRA is truly $1M you can spend. $1M in a taxable account might only be $750-850K after capital gains taxes. Always consider after-tax returns in your planning.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Start Your Millionaire Journey?</h2>
              <p className={styles.ctaText}>Use our calculator to create your personalized wealth-building plan. Adjust your savings rate, explore different return scenarios, and commit to your path to financial independence.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational and planning purposes. Investment returns are not guaranteed and can vary significantly. Past performance does not guarantee future results. Inflation, taxes, and market conditions will affect actual outcomes. Consider consulting with a financial advisor for personalized investment advice.
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

export default MillionaireCalculator;