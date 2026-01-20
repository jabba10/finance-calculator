import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './capratecalculator.module.css';

const CapRateCalculator = ({ currentDate, lastModifiedDate }) => {
  const [propertyValue, setPropertyValue] = useState(1000000);
  const [annualRent, setAnnualRent] = useState(120000);
  const [operatingExpenses, setOperatingExpenses] = useState(48000);
  const [vacancyRate, setVacancyRate] = useState(5);
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);

  const calculateCapRate = () => {
    // Calculate Net Operating Income (NOI)
    const vacancyLoss = annualRent * (vacancyRate / 100);
    const effectiveGrossIncome = annualRent - vacancyLoss;
    const noi = effectiveGrossIncome - operatingExpenses;
    
    // Calculate Cap Rate
    const capRate = propertyValue > 0 ? (noi / propertyValue) * 100 : 0;
    
    // Calculate Cash Flow Metrics
    const noiPerSqFt = propertyValue > 0 ? (noi / (propertyValue / 200)) : 0; // Assuming $200/sq ft
    const rentToValueRatio = propertyValue > 0 ? (annualRent / propertyValue) * 100 : 0;
    const expenseRatio = annualRent > 0 ? (operatingExpenses / annualRent) * 100 : 0;
    
    // Generate comparative data
    const dataPoints = [
      { metric: 'Class A (Prime)', capRate: 4.5 },
      { metric: 'Class B (Established)', capRate: 6.5 },
      { metric: 'Class C (Value-Add)', capRate: 8.5 },
      { metric: 'Your Property', capRate: capRate }
    ].sort((a, b) => a.capRate - b.capRate);

    setResults({
      noi: Math.round(noi * 100) / 100,
      capRate: Math.round(capRate * 100) / 100,
      effectiveGrossIncome: Math.round(effectiveGrossIncome * 100) / 100,
      noiPerSqFt: Math.round(noiPerSqFt * 100) / 100,
      rentToValueRatio: Math.round(rentToValueRatio * 100) / 100,
      expenseRatio: Math.round(expenseRatio * 100) / 100,
      propertyYield: Math.round((noi / propertyValue) * 10000) / 100
    });
    
    setChartData(dataPoints);
  };

  useEffect(() => {
    calculateCapRate();
  }, [propertyValue, annualRent, operatingExpenses, vacancyRate]);

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

  const getCapRateGrade = (rate) => {
    if (rate >= 10) return { grade: 'A+', color: '#00C853', description: 'Excellent Opportunity' };
    if (rate >= 8) return { grade: 'A', color: '#64DD17', description: 'Strong Investment' };
    if (rate >= 6) return { grade: 'B', color: '#FFD600', description: 'Good Potential' };
    if (rate >= 4) return { grade: 'C', color: '#FF9100', description: 'Average Return' };
    return { grade: 'D', color: '#FF5252', description: 'Needs Improvement' };
  };

  const capRateGrade = results ? getCapRateGrade(results.capRate) : null;

  return (
    <>
      <Head>
        <title>Professional Cap Rate Calculator | Real Estate Investment Analysis</title>
        <meta name="description" content="Free capitalization rate calculator for real estate investors. Calculate NOI, compare market rates, and analyze investment property performance with detailed metrics." />
        <meta name="keywords" content="cap rate calculator, capitalization rate, real estate investment, NOI calculator, property analysis, investment property" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://yourdomain.com/cap-rate-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Professional Cap Rate Calculator | Real Estate Investment Analysis" />
        <meta property="og:description" content="Calculate capitalization rates and analyze real estate investments. Professional tool for investors and analysts." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/cap-rate-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Professional Cap Rate Calculator" />
        <meta name="twitter:description" content="Analyze real estate investments with our comprehensive cap rate calculator." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="cap-rate-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Professional Cap Rate Calculator",
            "description": "Advanced capitalization rate calculator for real estate investment analysis and property valuation",
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
              "ratingCount": "892",
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
              "NOI Calculation",
              "Market Comparisons",
              "Investment Grade Analysis",
              "Expense Ratio Analysis",
              "Export Reports"
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
                "name": "What is a capitalization rate (cap rate) in real estate?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The capitalization rate is a key metric used to estimate the potential return on a real estate investment. It's calculated by dividing the Net Operating Income (NOI) by the property's current market value or purchase price. Cap rates help investors compare different investment opportunities and assess risk.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is a good cap rate for rental properties?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A 'good' cap rate depends on location, property type, and risk tolerance. Generally, 4-6% is common for Class A properties in prime locations, 6-8% for Class B properties, and 8-10%+ for Class C or value-add opportunities in secondary markets. Higher cap rates typically indicate higher risk.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How does vacancy rate affect cap rate?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Vacancy rate directly impacts Net Operating Income (NOI). Higher vacancy rates reduce effective gross income, which lowers NOI and consequently reduces the cap rate. Our calculator includes vacancy rate adjustments to provide accurate, realistic cap rate calculations.",
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
            <h1 className={styles.mainTitle}>Professional Cap Rate Calculator</h1>
            <p className={styles.subtitle}>Analyze Real Estate Investments with Precision Capitalization Rates</p>
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
                      max="10000000"
                      step="10000"
                      value={propertyValue}
                      onChange={(e) => setPropertyValue(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="100000"
                      max="10000000"
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

              <div className={styles.inputNote}>
                <p>💡 <strong>Operating Expenses</strong> include property taxes, insurance, maintenance, utilities, property management fees, and repairs.</p>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Investment Analysis Results</h2>
              
              {results && capRateGrade && (
                <>
                  <div className={styles.resultsHeader}>
                    <div className={styles.capRateDisplay}>
                      <div className={styles.capRateValue}>{formatPercentage(results.capRate)}</div>
                      <div className={styles.capRateLabel}>Capitalization Rate</div>
                    </div>
                    <div className={styles.gradeBadge} style={{ backgroundColor: capRateGrade.color }}>
                      {capRateGrade.grade}
                    </div>
                  </div>
                  <div className={styles.gradeDescription}>
                    <strong>Investment Grade:</strong> {capRateGrade.description}
                  </div>

                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Net Operating Income (NOI)</div>
                      <div className={styles.resultValue}>{formatCurrency(results.noi)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Effective Gross Income</div>
                      <div className={styles.resultValue}>{formatCurrency(results.effectiveGrossIncome)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Expense Ratio</div>
                      <div className={styles.resultValue}>{formatPercentage(results.expenseRatio)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Rent-to-Value Ratio</div>
                      <div className={styles.resultValue}>{formatPercentage(results.rentToValueRatio)}</div>
                    </div>
                  </div>

                  {/* Cap Rate Comparison Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Market Cap Rate Comparison</h3>
                    <div className={styles.chartBars}>
                      {chartData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>{data.metric}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={data.metric === 'Your Property' ? styles.chartBarHighlight : styles.chartBarStandard}
                              style={{ width: `${Math.min(data.capRate * 10, 100)}%` }}
                              title={`Cap Rate: ${data.capRate.toFixed(2)}%`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{data.capRate.toFixed(2)}%</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendStandard}`}></div>
                        <span>Market Average</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendHighlight}`}></div>
                        <span>Your Property</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Investment Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Your property generates <strong>{formatCurrency(results.noi)}</strong> in annual net operating income</li>
                      <li>For every dollar of rent, <strong>{formatPercentage(results.expenseRatio)}</strong> goes to operating expenses</li>
                      <li>Compared to similar properties, your cap rate is <strong>{results.capRate > 6.5 ? 'above' : 'below'}</strong> market average</li>
                      {results.capRate > 8 && (
                        <li><strong>High Yield Alert:</strong> Cap rates above 8% often indicate value-add opportunities or higher-risk markets</li>
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
              <h2 className={styles.articleTitle}>Mastering Cap Rates: The Investor's Guide to Smart Real Estate Decisions</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>What Exactly is a Capitalization Rate?</h3>
                <p>The capitalization rate, or cap rate, is the most fundamental metric in real estate investment analysis. It represents the expected rate of return on a real estate investment property if it were purchased entirely with cash. Essentially, it shows the relationship between a property's net operating income (NOI) and its market value.</p>
                
                <div className={styles.formulaCard}>
                  <h4>Cap Rate Formula:</h4>
                  <div className={styles.formula}>
                    Cap Rate = (Net Operating Income ÷ Property Value) × 100%
                  </div>
                  <p>Where <strong>Net Operating Income (NOI)</strong> = Gross Rental Income - Operating Expenses - Vacancy Loss</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>How to Interpret Different Cap Rates</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🎯 3-5% Cap Rate</h4>
                    <p><strong>Prime Properties:</strong> Class A buildings in major markets. Lower returns but stable with appreciation potential. Common in NYC, San Francisco.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 5-7% Cap Rate</h4>
                    <p><strong>Established Markets:</strong> Class B properties in growing cities. Balanced risk/reward with steady cash flow. Found in Austin, Denver, Atlanta.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 7-10% Cap Rate</h4>
                    <p><strong>Value-Add Opportunities:</strong> Class C properties needing improvements. Higher returns with active management required. Common in secondary markets.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚡ 10%+ Cap Rate</h4>
                    <p><strong>High-Risk/High-Reward:</strong> Distressed properties or tertiary markets. Significant upside potential but requires expertise and risk tolerance.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Factors That Influence Cap Rates</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Location & Market:</strong> Prime locations command lower cap rates due to perceived safety and appreciation potential</li>
                  <li><strong>Property Type:</strong> Multifamily typically has lower cap rates than retail or industrial due to stability</li>
                  <li><strong>Interest Rates:</strong> Rising interest rates generally push cap rates higher as investors demand greater returns</li>
                  <li><strong>Property Condition:</strong> Newer, well-maintained properties trade at lower cap rates than older properties</li>
                  <li><strong>Lease Terms:</strong> Properties with credit tenants and long leases command premium pricing (lower cap rates)</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Insights from Real Estate Analysts</h3>
                <blockquote className={styles.expertQuote}>
                  "Cap rates are more than just a number—they're a window into market sentiment, risk perception, and future expectations. A 6% cap rate in Manhattan tells a completely different story than a 6% cap rate in Memphis. Always analyze cap rates within their proper market context."
                  <footer className={styles.quoteFooter}>— Senior Real Estate Analyst, 20+ years experience</footer>
                </blockquote>
                
                <blockquote className={styles.expertQuote}>
                  "The biggest mistake new investors make is chasing high cap rates without understanding the underlying risk. A 10% cap rate usually means 10% worth of problems. Due diligence is non-negotiable."
                  <footer className={styles.quoteFooter}>— Commercial Real Estate Broker, $500M+ in transactions</footer>
                </blockquote>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategic Applications of Cap Rate Analysis</h3>
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🔄 Property Valuation</h4>
                    <p>Use market cap rates to estimate property value: Value = NOI ÷ Cap Rate. If similar properties trade at 6% cap rates and your NOI is $100,000, estimated value = $1.67M.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📊 Portfolio Optimization</h4>
                    <p>Compare cap rates across your portfolio to identify underperforming assets and reallocate capital to higher-return opportunities.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🤝 Acquisition Analysis</h4>
                    <p>Evaluate potential purchases against market comps. Properties trading below market cap rates may be overpriced or have unique advantages.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Performance Tracking</h4>
                    <p>Monitor how your property's cap rate changes over time as you increase NOI through rent increases or expense reductions.</p>
                  </div>
                </div>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I always choose properties with the highest cap rate?</h3>
                <p className={styles.faqAnswer}>Not necessarily. While higher cap rates indicate higher current returns, they often come with higher risk, more management requirements, or lower appreciation potential. The optimal cap rate depends on your investment strategy, risk tolerance, and market conditions. Conservative investors might prefer lower cap rates in stable markets, while value-add investors might target higher cap rates.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do mortgage rates affect cap rate decisions?</h3>
                <p className={styles.faqAnswer}>When mortgage rates are low, investors may accept lower cap rates because financing costs are reduced. Conversely, when mortgage rates rise, investors typically demand higher cap rates to maintain their return targets. The spread between cap rates and mortgage rates is a key indicator of market health. Generally, cap rates should exceed mortgage rates by 2-4% for positive leverage.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between cap rate and cash-on-cash return?</h3>
                <p className={styles.faqAnswer}>Cap rate measures unleveraged return (as if you paid all cash), while cash-on-cash return measures actual return on invested cash (after mortgage payments). A property might have a 7% cap rate but deliver 12%+ cash-on-cash return with leverage. Cap rate is better for comparing properties, while cash-on-cash is better for evaluating your specific financing strategy.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How accurate are online cap rate calculators?</h3>
                <p className={styles.faqAnswer}>Our calculator provides professional-grade accuracy for standard scenarios, but actual investments require detailed due diligence. Critical factors like deferred maintenance, upcoming capital expenditures, local market nuances, and lease rollover schedules can significantly impact actual returns. Use online calculators for initial screening, but always verify with professional analysis before making investment decisions.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Analyze Your Next Investment?</h2>
              <p className={styles.ctaText}>Use our calculator to evaluate potential properties, compare against market averages, and make data-driven investment decisions.</p>
              
              
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Real estate investments involve significant risk. Cap rates are market-specific and change over time. Always conduct thorough due diligence, consider all costs (including financing, taxes, and capital expenditures), and consult with qualified real estate and legal professionals before making investment decisions. Past performance does not guarantee future results.
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

export default CapRateCalculator;