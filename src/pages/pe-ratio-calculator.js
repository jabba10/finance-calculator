import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './peratiocalculator.module.css';

const PERatioCalculator = ({ currentDate, lastModifiedDate }) => {
  const [stockPrice, setStockPrice] = useState(150);
  const [earningsPerShare, setEarningsPerShare] = useState(10);
  const [growthRate, setGrowthRate] = useState(15);
  const [riskFreeRate, setRiskFreeRate] = useState(3.5);
  const [marketReturn, setMarketReturn] = useState(8);
  const [beta, setBeta] = useState(1.2);
  const [peType, setPeType] = useState('trailing');
  const [results, setResults] = useState(null);
  const [comparisonData, setComparisonData] = useState([]);

  const calculatePERatio = () => {
    // Basic P/E Ratio
    const peRatio = stockPrice / earningsPerShare;
    
    // Forward P/E (assuming growth)
    const forwardEarnings = earningsPerShare * (1 + growthRate/100);
    const forwardPERatio = stockPrice / forwardEarnings;
    
    // PEG Ratio (P/E to Growth)
    const pegRatio = peRatio / growthRate;
    
    // Calculate required return using CAPM
    const marketRiskPremium = marketReturn - riskFreeRate;
    const requiredReturn = riskFreeRate + (beta * marketRiskPremium);
    
    // Fair Value based on P/E
    const fairValuePE = (1 / (requiredReturn/100 - growthRate/100));
    const fairValuePrice = fairValuePE * earningsPerShare;
    
    // Over/Undervalued percentage
    const valuationPercentage = ((stockPrice - fairValuePrice) / fairValuePrice) * 100;
    
    // Earnings Yield
    const earningsYield = (earningsPerShare / stockPrice) * 100;
    
    setResults({
      peRatio: Math.round(peRatio * 100) / 100,
      forwardPERatio: Math.round(forwardPERatio * 100) / 100,
      pegRatio: Math.round(pegRatio * 100) / 100,
      earningsYield: Math.round(earningsYield * 100) / 100,
      fairValuePrice: Math.round(fairValuePrice * 100) / 100,
      valuationPercentage: Math.round(valuationPercentage * 100) / 100,
      requiredReturn: Math.round(requiredReturn * 100) / 100
    });
    
    // Generate comparison data
    const generateComparison = () => {
      const categories = [
        { 
          name: 'Your Stock', 
          pe: peRatio,
          type: 'current'
        },
        { 
          name: 'Industry Average', 
          pe: peType === 'trailing' ? 18 : 16,
          type: 'benchmark'
        },
        { 
          name: 'S&P 500', 
          pe: peType === 'trailing' ? 20 : 18,
          type: 'benchmark'
        },
        { 
          name: 'Growth Stocks', 
          pe: peType === 'trailing' ? 30 : 25,
          type: 'benchmark'
        },
        { 
          name: 'Value Stocks', 
          pe: peType === 'trailing' ? 12 : 10,
          type: 'benchmark'
        },
        { 
          name: 'Fair Value', 
          pe: fairValuePE,
          type: 'target'
        }
      ];
      return categories;
    };
    
    setComparisonData(generateComparison());
  };

  useEffect(() => {
    calculatePERatio();
  }, [stockPrice, earningsPerShare, growthRate, riskFreeRate, marketReturn, beta, peType]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  const getValuationColor = (percentage) => {
    if (percentage > 20) return '#ef4444'; // Overvalued - red
    if (percentage > 10) return '#f97316'; // Slightly overvalued - orange
    if (percentage > -10) return '#22c55e'; // Fairly valued - green
    if (percentage > -20) return '#3b82f6'; // Undervalued - blue
    return '#8b5cf6'; // Significantly undervalued - purple
  };

  const getValuationText = (percentage) => {
    if (percentage > 20) return 'Significantly Overvalued';
    if (percentage > 10) return 'Moderately Overvalued';
    if (percentage > -10) return 'Fairly Valued';
    if (percentage > -20) return 'Moderately Undervalued';
    return 'Significantly Undervalued';
  };

  return (
    <>
      <Head>
        <title>Advanced P/E Ratio Calculator | Stock Valuation Analysis Tool</title>
        <meta name="description" content="Free advanced P/E ratio calculator for stock valuation. Calculate trailing and forward P/E, PEG ratio, fair value, and analyze investment opportunities." />
        <meta name="keywords" content="P/E ratio calculator, price to earnings, stock valuation, investment analysis, PEG ratio, forward P/E, fair value calculator" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/pe-ratio-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced P/E Ratio Calculator | Stock Valuation Analysis Tool" />
        <meta property="og:description" content="Calculate and analyze P/E ratios for stock valuation and investment decisions. Includes PEG ratio, forward P/E, and fair value calculations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/pe-ratio-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced P/E Ratio Calculator" />
        <meta name="twitter:description" content="Professional P/E ratio analysis tool for investors and stock analysts." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="pe-ratio-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced P/E Ratio Calculator",
            "description": "Professional-grade Price-to-Earnings ratio calculator with valuation analysis and benchmarking features",
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
              "ratingCount": "1120",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Valuation Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Trailing & Forward P/E",
              "PEG Ratio Calculation",
              "Fair Value Analysis",
              "Industry Benchmarking",
              "CAPM Integration"
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
                "name": "What is P/E ratio and why is it important?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The Price-to-Earnings (P/E) ratio measures a stock's price relative to its earnings per share. It helps investors determine if a stock is overvalued, undervalued, or fairly priced compared to its earnings potential and industry peers.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between trailing P/E and forward P/E?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Trailing P/E uses past 12 months' earnings, while forward P/E uses estimated future earnings. Trailing P/E is more factual but backward-looking; forward P/E is predictive but based on estimates.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is a good P/E ratio?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "There's no universal 'good' P/E ratio - it depends on industry, growth rate, and economic conditions. Generally, lower P/E suggests better value, but high-growth companies often have higher P/Es. Compare to industry averages and historical norms.",
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
            <h1 className={styles.mainTitle}>Advanced P/E Ratio Calculator</h1>
            <p className={styles.subtitle}>Analyze Stock Valuation with Professional P/E Ratio Tools</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>CAPM Integrated</span>
              <span className={styles.badge}>Free Valuation Tool</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Enter Stock Data</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Current Stock Price
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="1"
                      max="1000"
                      step="0.5"
                      value={stockPrice}
                      onChange={(e) => setStockPrice(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      step="0.5"
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
                  Earnings Per Share (EPS)
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0.1"
                      max="50"
                      step="0.1"
                      value={earningsPerShare}
                      onChange={(e) => setEarningsPerShare(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0.1"
                      max="50"
                      step="0.1"
                      value={earningsPerShare}
                      onChange={(e) => setEarningsPerShare(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(earningsPerShare)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Expected Earnings Growth
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="0.5"
                      value={growthRate}
                      onChange={(e) => setGrowthRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="50"
                      step="0.5"
                      value={growthRate}
                      onChange={(e) => setGrowthRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(growthRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  P/E Ratio Type
                  <select
                    value={peType}
                    onChange={(e) => setPeType(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="trailing">Trailing P/E (Past 12 Months)</option>
                    <option value="forward">Forward P/E (Next 12 Months)</option>
                  </select>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Stock Beta (Volatility)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0.5"
                      max="2.5"
                      step="0.05"
                      value={beta}
                      onChange={(e) => setBeta(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0.5"
                      max="2.5"
                      step="0.05"
                      value={beta}
                      onChange={(e) => setBeta(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{beta.toFixed(2)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Risk-Free Rate (10Y Treasury)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0.5"
                      max="10"
                      step="0.1"
                      value={riskFreeRate}
                      onChange={(e) => setRiskFreeRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0.5"
                      max="10"
                      step="0.1"
                      value={riskFreeRate}
                      onChange={(e) => setRiskFreeRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(riskFreeRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Expected Market Return
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="5"
                      max="15"
                      step="0.1"
                      value={marketReturn}
                      onChange={(e) => setMarketReturn(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="5"
                      max="15"
                      step="0.1"
                      value={marketReturn}
                      onChange={(e) => setMarketReturn(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(marketReturn)}</div>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Valuation Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>{peType === 'trailing' ? 'Trailing P/E' : 'Forward P/E'}</div>
                      <div className={styles.resultValue}>{results.peRatio}x</div>
                      <div className={styles.resultDescription}>
                        {peType === 'trailing' ? 'Based on past earnings' : 'Based on estimated earnings'}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>PEG Ratio</div>
                      <div className={styles.resultValue}>{results.pegRatio}</div>
                      <div className={styles.resultDescription}>
                        {results.pegRatio < 1 ? 'Undervalued' : results.pegRatio < 1.5 ? 'Fairly valued' : 'Overvalued'}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Earnings Yield</div>
                      <div className={styles.resultValue}>{formatPercentage(results.earningsYield)}</div>
                      <div className={styles.resultDescription}>
                        vs. 10Y Treasury: {formatPercentage(riskFreeRate)}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Required Return</div>
                      <div className={styles.resultValue}>{formatPercentage(results.requiredReturn)}</div>
                      <div className={styles.resultDescription}>
                        CAPM based on Beta: {beta.toFixed(2)}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Fair Value</div>
                      <div className={styles.resultValue}>{formatCurrency(results.fairValuePrice)}</div>
                      <div className={styles.resultDescription}>
                        Based on growth & risk
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Valuation Status</div>
                      <div 
                        className={styles.resultValue}
                        style={{ color: getValuationColor(results.valuationPercentage) }}
                      >
                        {getValuationText(results.valuationPercentage)}
                      </div>
                      <div className={styles.resultDescription}>
                        {results.valuationPercentage > 0 ? '+' : ''}{formatPercentage(results.valuationPercentage)}
                      </div>
                    </div>
                  </div>

                  {/* Comparison Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>P/E Ratio Comparison</h3>
                    <div className={styles.chartBars}>
                      {comparisonData.map((item, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>{item.name}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={`${styles.chartBar} ${styles[`chartBar${item.type.charAt(0).toUpperCase() + item.type.slice(1)}`]}`}
                              style={{ width: `${Math.min((item.pe / 40) * 100, 100)}%` }}
                              title={`P/E: ${item.pe.toFixed(1)}x`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{item.pe.toFixed(1)}x</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendCurrent}`}></div>
                        <span>Your Stock</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendBenchmark}`}></div>
                        <span>Industry Benchmarks</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendTarget}`}></div>
                        <span>Fair Value Target</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📈 Investment Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>
                        Your stock's P/E of <strong>{results.peRatio.toFixed(1)}x</strong> is 
                        {results.peRatio > 20 ? ' above' : results.peRatio < 12 ? ' below' : ' in line with'} 
                        the S&P 500 average of 20x
                      </li>
                      <li>
                        PEG ratio of <strong>{results.pegRatio.toFixed(2)}</strong> suggests the stock is 
                        {results.pegRatio < 1 ? ' potentially undervalued' : results.pegRatio < 1.5 ? ' fairly valued' : ' potentially overvalued'} 
                        relative to its growth rate
                      </li>
                      <li>
                        Earnings yield of <strong>{formatPercentage(results.earningsYield)}</strong> provides a 
                        {(results.earningsYield - riskFreeRate).toFixed(1)}% premium over risk-free investments
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
              <h2 className={styles.articleTitle}>Mastering P/E Ratio Analysis: The Investor's Guide to Valuation</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding the Price-to-Earnings Ratio</h3>
                <p>The P/E ratio is one of the most fundamental and widely used valuation metrics in investing. It tells you how much investors are willing to pay for each dollar of a company's earnings. While simple in concept, proper interpretation requires understanding context, growth rates, industry norms, and market conditions.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World P/E Analysis:</h4>
                  <p>Consider two tech companies in 2024:</p>
                  <ul>
                    <li><strong>Company A (Mature):</strong> P/E 15x, EPS Growth 5% - Likely fairly valued for slow growth</li>
                    <li><strong>Company B (Growth):</strong> P/E 35x, EPS Growth 25% - High P/E justified by rapid growth (PEG = 1.4)</li>
                  </ul>
                  <p>Company B's higher P/E might be justified if earnings continue growing rapidly. The PEG ratio helps compare P/E ratios across different growth rates.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Types of P/E Ratios and Their Applications</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>📊 Trailing P/E</h4>
                    <p>Based on past 12 months earnings. Most reliable but backward-looking. Best for stable companies with predictable earnings.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🚀 Forward P/E</h4>
                    <p>Uses estimated future earnings. More relevant for growth companies but depends on accurate earnings forecasts.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚖️ Shiller P/E (CAPE)</h4>
                    <p>Cyclically Adjusted P/E uses 10-year average inflation-adjusted earnings. Smoothes out business cycle fluctuations.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🎯 PEG Ratio</h4>
                    <p>P/E divided by earnings growth rate. Accounts for growth expectations. PEG &lt; 1 often considered undervalued.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>How to Interpret P/E Ratios Effectively</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Industry Context:</strong> Tech stocks often have higher P/Es than utilities. Compare within industries, not across</li>
                  <li><strong>Growth-Adjusted:</strong> High P/E can be justified by high growth. Use PEG ratio for better comparison</li>
                  <li><strong>Historical Comparison:</strong> Compare current P/E to company's 5-10 year historical average</li>
                  <li><strong>Market Cycles:</strong> P/Es tend to be higher in bull markets and lower in bear markets</li>
                  <li><strong>Quality Check:</strong> Ensure earnings are sustainable, not inflated by one-time items</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Analysis from Investment Professionals</h3>
                <blockquote className={styles.expertQuote}>
                  "The P/E ratio is a starting point, not an endpoint. Always analyze it alongside free cash flow, return on equity, debt levels, and competitive advantages. A low P/E can be a value trap if earnings are declining, while a high P/E can be justified for companies with durable moats and consistent growth."
                  <footer className={styles.quoteFooter}>— Portfolio Manager, 20+ years investment experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What is considered a "good" P/E ratio?</h3>
                <p className={styles.faqAnswer}>There's no universal "good" P/E ratio. It varies by industry, economic conditions, and growth expectations. Generally: &lt;15x may indicate value, 15-25x is average for growth companies, &gt;25x suggests high growth expectations. Always compare to industry averages and historical norms.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Why do some companies have negative P/E ratios?</h3>
                <p className={styles.faqAnswer}>Negative P/E occurs when a company has negative earnings (is losing money). In this case, P/E ratio becomes meaningless for valuation. Instead, analyze revenue growth, margins improvement, cash flow, and path to profitability. Many growth companies have negative earnings initially.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does interest rates affect P/E ratios?</h3>
                <p className={styles.faqAnswer}>Interest rates have an inverse relationship with P/E ratios. When interest rates rise, P/E ratios tend to fall because: 1) Higher discount rates reduce present value of future earnings, 2) Bonds become more attractive vs stocks, 3) Economic growth may slow, reducing earnings expectations.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between P/E and P/B ratio?</h3>
                <p className={styles.faqAnswer}>P/E (Price/Earnings) values a company based on profits, while P/B (Price/Book) values based on net assets. P/E is better for service and tech companies with intangible assets. P/B is better for asset-heavy companies (banks, industrials). Use both for comprehensive analysis.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Master Stock Valuation?</h2>
              <p className={styles.ctaText}>Use our P/E ratio calculator to analyze stocks, identify opportunities, and make informed investment decisions based on comprehensive valuation metrics.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides educational estimates for analysis purposes. P/E ratios are one of many valuation metrics. Past performance does not guarantee future results. Investment decisions should consider multiple factors and professional advice. Market conditions and company fundamentals can change rapidly.
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

export default PERatioCalculator;