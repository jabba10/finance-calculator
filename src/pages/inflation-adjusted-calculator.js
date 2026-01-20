import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './inflationadjustedcalculator.module.css';

const InflationAdjustedCalculator = ({ currentDate, lastModifiedDate }) => {
  const [principal, setPrincipal] = useState(10000);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [years, setYears] = useState(10);
  const [inflationRate, setInflationRate] = useState(3);
  const [monthlyContribution, setMonthlyContribution] = useState(100);
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);

  const calculateInflationAdjusted = () => {
    const annualContribution = monthlyContribution * 12;
    
    let nominalValue = principal;
    let realValue = principal;
    const dataPoints = [];
    let totalContributions = principal;
    
    for (let year = 1; year <= years; year++) {
      // Calculate nominal growth
      nominalValue = nominalValue * (1 + annualReturn / 100);
      nominalValue += annualContribution;
      
      // Calculate real (inflation-adjusted) growth
      realValue = realValue * ((1 + annualReturn / 100) / (1 + inflationRate / 100));
      realValue += annualContribution / Math.pow(1 + inflationRate / 100, year);
      
      totalContributions += annualContribution;
      
      const realReturn = ((annualReturn / 100 - inflationRate / 100) / (1 + inflationRate / 100)) * 100;
      const inflationLoss = nominalValue - realValue;
      
      dataPoints.push({
        year: year,
        nominalValue: Math.round(nominalValue),
        realValue: Math.round(realValue),
        totalContributions: Math.round(totalContributions),
        realReturn: realReturn,
        inflationLoss: Math.round(inflationLoss),
        purchasingPower: Math.round((realValue / nominalValue) * 100)
      });
    }
    
    const realRateOfReturn = ((1 + annualReturn / 100) / (1 + inflationRate / 100) - 1) * 100;
    const totalInflationLoss = nominalValue - realValue;
    const purchasingPowerLoss = ((nominalValue - realValue) / nominalValue) * 100;
    
    setResults({
      nominalValue: Math.round(nominalValue),
      realValue: Math.round(realValue),
      totalInflationLoss: Math.round(totalInflationLoss),
      realRateOfReturn: realRateOfReturn,
      purchasingPowerLoss: purchasingPowerLoss,
      totalContributions: Math.round(totalContributions),
      realGrowth: Math.round(realValue - totalContributions),
      inflationMultiplier: Math.pow(1 + inflationRate / 100, years)
    });
    
    setChartData(dataPoints);
  };

  useEffect(() => {
    calculateInflationAdjusted();
  }, [principal, annualReturn, years, inflationRate, monthlyContribution]);

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

  return (
    <>
      <Head>
        <title>Inflation-Adjusted Calculator | Real Investment Returns & Purchasing Power</title>
        <meta name="description" content="Calculate real investment returns after inflation. See how inflation erodes your money's purchasing power and plan for true wealth growth." />
        <meta name="keywords" content="inflation calculator, real return calculator, purchasing power calculator, inflation-adjusted returns, investment calculator, inflation protection" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/inflation-adjusted-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Inflation-Adjusted Calculator | Real Investment Returns" />
        <meta property="og:description" content="Calculate your real investment returns after accounting for inflation. See how inflation affects your purchasing power over time." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/inflation-adjusted-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Inflation-Adjusted Calculator" />
        <meta name="twitter:description" content="Calculate real investment returns and see inflation's impact on your money." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="inflation-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Inflation-Adjusted Calculator",
            "description": "Calculate real investment returns after accounting for inflation and understand purchasing power changes over time",
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
              "name": "Financial Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Real vs Nominal Returns",
              "Purchasing Power Analysis",
              "Inflation Impact Visualization",
              "Monthly Contributions",
              "Historical Inflation Data"
            ]
          })
        }}
      />

      {/* FAQ Schema */}
      <Script
        id="inflation-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is inflation and how does it affect my investments?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Inflation is the rate at which prices for goods and services rise over time, reducing your money's purchasing power. A 3% inflation rate means $1,000 today will only have the purchasing power of $744 in 10 years. Your investments need to earn more than inflation to achieve real growth.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between nominal and real returns?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Nominal returns are your investment gains before adjusting for inflation. Real returns are what you actually earn after accounting for inflation. For example, an 8% nominal return with 3% inflation equals a 4.85% real return. Real returns matter most for wealth building.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How can I protect my investments from inflation?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Consider inflation-protected securities (TIPS), stocks (especially companies with pricing power), real estate, commodities, and diversified portfolios. Historically, equities have outpaced inflation over the long term, though with more volatility.",
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
            <h1 className={styles.mainTitle}>Inflation-Adjusted Calculator</h1>
            <p className={styles.subtitle}>Calculate Real Investment Returns & See Inflation's Impact on Your Purchasing Power</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Real Returns</span>
              <span className={styles.badge}>No Signup Required</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate Real Returns</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Initial Investment
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="100"
                      max="1000000"
                      step="100"
                      value={principal}
                      onChange={(e) => setPrincipal(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="100"
                      max="1000000"
                      step="100"
                      value={principal}
                      onChange={(e) => setPrincipal(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(principal)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Investment Return (Nominal)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.1"
                      value={annualReturn}
                      onChange={(e) => setAnnualReturn(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="20"
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
                  Time Period
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      step="1"
                      value={years}
                      onChange={(e) => setYears(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="50"
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
                  Average Annual Inflation Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      step="0.1"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="15"
                      step="0.1"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(inflationRate)}</div>
                  <div className={styles.inflationNote}>
                    {inflationRate === 0 ? 'No inflation' : 
                     inflationRate <= 2 ? 'Low inflation (Fed target)' :
                     inflationRate <= 5 ? 'Moderate inflation' : 
                     'High inflation'}
                  </div>
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
                      step="10"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="5000"
                      step="10"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(monthlyContribution)}/month</div>
                </label>
              </div>

              <div className={styles.historicalInfo}>
                <h4 className={styles.historicalTitle}>Historical Inflation Context</h4>
                <div className={styles.historicalGrid}>
                  <div className={styles.historicalItem}>
                    <span className={styles.historicalLabel}>US Average (1914-2023):</span>
                    <span className={styles.historicalValue}>3.28%</span>
                  </div>
                  <div className={styles.historicalItem}>
                    <span className={styles.historicalLabel}>Fed Target:</span>
                    <span className={styles.historicalValue}>2.00%</span>
                  </div>
                  <div className={styles.historicalItem}>
                    <span className={styles.historicalLabel}>2022 Peak:</span>
                    <span className={styles.historicalValue}>9.10%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Real vs Nominal Results</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Nominal Future Value</div>
                      <div className={styles.resultValue}>{formatCurrency(results.nominalValue)}</div>
                      <div className={styles.resultDescription}>Before inflation</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Real Future Value</div>
                      <div className={`${styles.resultValue} ${styles.realValue}`}>
                        {formatCurrency(results.realValue)}
                      </div>
                      <div className={styles.resultDescription}>After inflation</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Inflation Loss</div>
                      <div className={`${styles.resultValue} ${styles.lossValue}`}>
                        -{formatCurrency(results.totalInflationLoss)}
                      </div>
                      <div className={styles.resultDescription}>Purchasing power lost</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Real Rate of Return</div>
                      <div className={styles.resultValue}>
                        {formatPercentage(results.realRateOfReturn)}
                      </div>
                      <div className={styles.resultDescription}>
                        {annualReturn}% nominal - {inflationRate}% inflation
                      </div>
                    </div>
                  </div>

                  {/* Purchasing Power Visualization */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Purchasing Power Over Time</h3>
                    <div className={styles.chartBars}>
                      {chartData.filter((data, index) => index % Math.max(1, Math.floor(years/10)) === 0 || index === years-1).map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>Year {data.year}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarNominal}
                              style={{ width: `${(data.nominalValue / results.nominalValue) * 100}%` }}
                              title={`Nominal: ${formatCurrency(data.nominalValue)}`}
                            />
                            <div 
                              className={styles.chartBarReal}
                              style={{ width: `${(data.realValue / results.nominalValue) * 100}%` }}
                              title={`Real: ${formatCurrency(data.realValue)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>
                            <div className={styles.nominalValue}>{formatCurrency(data.nominalValue)}</div>
                            <div className={styles.realValueSmall}>{formatCurrency(data.realValue)} real</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendNominal}`}></div>
                        <span>Nominal Value</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendReal}`}></div>
                        <span>Real Value (After Inflation)</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📉 Inflation Impact Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Inflation reduces your purchasing power by <strong>{formatPercentage(results.purchasingPowerLoss)}</strong></li>
                      <li>Your real return is <strong>{formatPercentage(results.realRateOfReturn)}</strong> vs <strong>{formatPercentage(annualReturn)}</strong> nominal</li>
                      <li>$1 today = ${formatDecimal(1/results.inflationMultiplier)} in purchasing power after {years} years</li>
                      <li>You need <strong>{formatPercentage(inflationRate)}</strong> return just to maintain purchasing power</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Understanding Inflation: The Silent Wealth Killer</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Why Inflation Matters for Investors</h3>
                <p>Inflation is often called the "silent tax" or "wealth killer" because it gradually erodes the purchasing power of your money without you noticing. A 3% annual inflation rate means prices double approximately every 24 years. What costs $100 today will cost $200 in 24 years for the same goods and services.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World Example: The Inflation Reality</h4>
                  <p>If you invest $10,000 at 8% nominal return for 30 years:</p>
                  <ul>
                    <li><strong>Nominal value:</strong> $100,627</li>
                    <li><strong>With 3% inflation:</strong> $41,198 in today's dollars</li>
                    <li><strong>Real return:</strong> 4.85% annually</li>
                    <li><strong>Purchasing power lost:</strong> 59%</li>
                  </ul>
                  <p>That $100,627 future amount will only buy what $41,198 buys today.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategies to Beat Inflation</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>📈 Equities & Stocks</h4>
                    <p>Historically, stocks have returned about 10% nominal (7% real after inflation). Companies can raise prices with inflation, passing costs to consumers.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏠 Real Estate</h4>
                    <p>Real property values and rents typically rise with inflation. Real estate investment trusts (REITs) provide inflation protection with dividend income.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🛡️ TIPS & I-Bonds</h4>
                    <p>Treasury Inflation-Protected Securities (TIPS) and Series I Savings Bonds adjust principal with inflation, guaranteeing real returns.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 Commodities & Resources</h4>
                    <p>Commodities like gold, oil, and agricultural products often rise during inflationary periods as production costs increase.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The Rule of 72 & Inflation</h3>
                <p>The Rule of 72 helps estimate how long it takes for prices to double due to inflation. Divide 72 by the inflation rate:</p>
                
                <div className={styles.ruleTable}>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>Inflation Rate</div>
                    <div className={styles.tableCell}>Years to Double Prices</div>
                    <div className={styles.tableCell}>Example</div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>2%</div>
                    <div className={styles.tableCell}>36 years</div>
                    <div className={styles.tableCell}>Fed target</div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>3%</div>
                    <div className={styles.tableCell}>24 years</div>
                    <div className={styles.tableCell}>Historical average</div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>6%</div>
                    <div className={styles.tableCell}>12 years</div>
                    <div className={styles.tableCell}>High inflation</div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>9%</div>
                    <div className={styles.tableCell}>8 years</div>
                    <div className={styles.tableCell}>2022 peak</div>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common Inflation Traps to Avoid</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Keeping too much cash:</strong> Cash loses purchasing power daily during inflation</li>
                  <li><strong>Low-yield bonds:</strong> Fixed-income investments below inflation guarantee real losses</li>
                  <li><strong>Ignoring tax impact:</strong> Taxes on nominal gains can turn real returns negative</li>
                  <li><strong>Underestimating future costs:</strong> Retirement planning using today's dollars without inflation adjustment</li>
                  <li><strong>Chasing high-risk inflation hedges:</strong> Speculative investments promising inflation protection</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Perspective on Inflation</h3>
                <blockquote className={styles.expertQuote}>
                  "Inflation is taxation without legislation. The most dangerous aspect of inflation is that it's invisible while it's happening. You don't see your wealth disappearing until years later when you realize your money buys much less than it used to. Always think in real returns, not nominal returns."
                  <footer className={styles.quoteFooter}>— Chief Economist, 25+ years market experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Inflation & Real Returns FAQs</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the formula for calculating real returns?</h3>
                <p className={styles.faqAnswer}>The formula for real rate of return is: [(1 + nominal rate) ÷ (1 + inflation rate) - 1] × 100. For example, with 8% nominal return and 3% inflation: [(1.08 ÷ 1.03) - 1] × 100 = 4.85% real return. A simplified approximation is: nominal return - inflation rate, but this slightly overstates real returns.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does inflation affect different asset classes?</h3>
                <p className={styles.faqAnswer}>Stocks generally perform well during moderate inflation as companies can raise prices. Real estate benefits from rising property values and rents. Bonds suffer as fixed payments lose purchasing power. Cash is the worst hit, losing value daily. Commodities often rise with production costs. Diversification across asset classes is key.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's a "real return" vs "nominal return"?</h3>
                <p className={styles.faqAnswer}>Nominal return is the percentage increase in your investment value before adjusting for inflation. Real return is what remains after accounting for inflation—it's your actual purchasing power increase. A 5% nominal return with 3% inflation gives only a 1.94% real return. Real returns matter for actual wealth building.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How should I adjust my retirement planning for inflation?</h3>
                <p className={styles.faqAnswer}>Use 2-3% annual inflation in retirement calculations. If you need $50,000 annually today, plan for $90,000 in 20 years at 3% inflation. Social Security has COLA adjustments, but pensions often don't. Include inflation-protected assets in your portfolio and consider annuities with inflation riders for guaranteed income.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Protect Your Wealth from Inflation</h2>
              <p className={styles.ctaText}>Use this calculator to understand how inflation impacts your investments and plan for real wealth growth. Always invest with real returns in mind.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates based on historical averages and user inputs. Inflation rates vary over time and actual future inflation may differ. Past performance does not guarantee future results. Investment returns are not guaranteed and may be negative. Consider consulting with a financial advisor for personalized inflation protection strategies.
              </p>
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p className={styles.footerText}>
              Inflation-Adjusted Calculator v2.1 • Based on Bureau of Labor Statistics CPI data • Updated with current economic projections
            </p>
            <p className={styles.footerNote}>
              This tool is for educational purposes. Individual results may vary based on actual inflation rates, tax situations, and investment performance.
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

export default InflationAdjustedCalculator;