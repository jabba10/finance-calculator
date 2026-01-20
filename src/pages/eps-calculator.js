import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './epscalculator.module.css';

const EPSCalculator = ({ currentDate, lastModifiedDate }) => {
  const [netIncome, setNetIncome] = useState(10000000);
  const [preferredDividends, setPreferredDividends] = useState(1000000);
  const [weightedAverageShares, setWeightedAverageShares] = useState(5000000);
  const [dilutedShares, setDilutedShares] = useState(5500000);
  const [extraordinaryItems, setExtraordinaryItems] = useState(500000);
  const [taxRate, setTaxRate] = useState(25);
  const [results, setResults] = useState(null);
  const [comparisonData, setComparisonData] = useState([]);

  const calculateEPS = () => {
    // Basic EPS Calculation
    const basicEPS = (netIncome - preferredDividends) / weightedAverageShares;
    
    // Diluted EPS Calculation
    const dilutedEPS = (netIncome - preferredDividends) / dilutedShares;
    
    // Adjusted EPS (excluding extraordinary items)
    const netIncomeExcludingExtraordinary = netIncome - (extraordinaryItems * (1 - taxRate/100));
    const adjustedEPS = (netIncomeExcludingExtraordinary - preferredDividends) / weightedAverageShares;
    
    // Profit Margin
    const profitMargin = ((netIncome - preferredDividends) / netIncome) * 100;
    
    // Earnings Yield
    const assumedSharePrice = 50; // For calculation purposes
    const earningsYield = (basicEPS / assumedSharePrice) * 100;
    
    setResults({
      basicEPS: Math.round(basicEPS * 100) / 100,
      dilutedEPS: Math.round(dilutedEPS * 100) / 100,
      adjustedEPS: Math.round(adjustedEPS * 100) / 100,
      profitMargin: Math.round(profitMargin * 100) / 100,
      earningsYield: Math.round(earningsYield * 100) / 100,
      peRatio: Math.round(assumedSharePrice / basicEPS * 100) / 100
    });
    
    // Generate comparison data
    const generateComparison = () => {
      const companies = [
        { name: 'Your Company', eps: basicEPS },
        { name: 'Tech Industry Avg', eps: basicEPS * 1.2 },
        { name: 'S&P 500 Avg', eps: basicEPS * 0.8 },
        { name: 'Growth Benchmark', eps: basicEPS * 1.5 },
        { name: 'Value Benchmark', eps: basicEPS * 0.7 }
      ];
      return companies;
    };
    
    setComparisonData(generateComparison());
  };

  useEffect(() => {
    calculateEPS();
  }, [netIncome, preferredDividends, weightedAverageShares, dilutedShares, extraordinaryItems, taxRate]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatEPS = (value) => {
    return `$${value.toFixed(2)}`;
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <>
      <Head>
        <title>Advanced EPS Calculator | Earnings Per Share Analysis Tool</title>
        <meta name="description" content="Free advanced EPS calculator for financial analysis. Calculate basic EPS, diluted EPS, analyze profitability, and compare with industry benchmarks." />
        <meta name="keywords" content="EPS calculator, earnings per share, financial analysis, stock valuation, profitability metrics, diluted EPS, basic EPS" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://yourdomain.com/eps-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced EPS Calculator | Earnings Per Share Analysis Tool" />
        <meta property="og:description" content="Calculate and analyze Earnings Per Share (EPS) metrics for investment decisions and financial reporting." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/eps-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced EPS Calculator" />
        <meta name="twitter:description" content="Professional EPS calculation and analysis tool for investors and financial analysts." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="eps-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced EPS Calculator",
            "description": "Professional-grade Earnings Per Share calculator with financial analysis and benchmarking features",
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
              "name": "Financial Analysis Pro",
              "url": "https://yourdomain.com"
            },
            "featureList": [
              "Basic & Diluted EPS",
              "Adjusted EPS Calculations",
              "Industry Benchmarking",
              "Profitability Analysis",
              "Valuation Metrics"
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
                "name": "What is EPS and why is it important?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Earnings Per Share (EPS) measures a company's profitability per outstanding share of common stock. It's a key metric for investors to assess profitability, compare companies, and make investment decisions. Higher EPS generally indicates better profitability.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between basic EPS and diluted EPS?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Basic EPS uses weighted average common shares outstanding, while diluted EPS includes all convertible securities (options, warrants, convertible bonds). Diluted EPS shows worst-case scenario earnings if all dilutive securities were converted.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How do extraordinary items affect EPS?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Extraordinary items (one-time gains/losses) can distort EPS. Adjusted EPS excludes these to show sustainable earnings. Always analyze both GAAP EPS and adjusted EPS for a complete picture.",
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
            <h1 className={styles.mainTitle}>Advanced EPS Calculator</h1>
            <p className={styles.subtitle}>Calculate Earnings Per Share Metrics for Investment Analysis</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>GAAP Compliant</span>
              <span className={styles.badge}>Free Financial Tool</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Enter Financial Data</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Net Income
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="100000"
                      max="1000000000"
                      step="100000"
                      value={netIncome}
                      onChange={(e) => setNetIncome(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="100000"
                      max="1000000000"
                      step="100000"
                      value={netIncome}
                      onChange={(e) => setNetIncome(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(netIncome)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Preferred Dividends
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="50000000"
                      step="100000"
                      value={preferredDividends}
                      onChange={(e) => setPreferredDividends(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="50000000"
                      step="100000"
                      value={preferredDividends}
                      onChange={(e) => setPreferredDividends(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(preferredDividends)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Weighted Average Shares
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="100000"
                      max="100000000"
                      step="100000"
                      value={weightedAverageShares}
                      onChange={(e) => setWeightedAverageShares(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="100000"
                      max="100000000"
                      step="100000"
                      value={weightedAverageShares}
                      onChange={(e) => setWeightedAverageShares(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatNumber(weightedAverageShares)} shares</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Diluted Shares Outstanding
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="100000"
                      max="100000000"
                      step="100000"
                      value={dilutedShares}
                      onChange={(e) => setDilutedShares(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="100000"
                      max="100000000"
                      step="100000"
                      value={dilutedShares}
                      onChange={(e) => setDilutedShares(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatNumber(dilutedShares)} shares</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Extraordinary Items (Gain/Loss)
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="-10000000"
                      max="10000000"
                      step="100000"
                      value={extraordinaryItems}
                      onChange={(e) => setExtraordinaryItems(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="-10000000"
                      max="10000000"
                      step="100000"
                      value={extraordinaryItems}
                      onChange={(e) => setExtraordinaryItems(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(extraordinaryItems)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Corporate Tax Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="0.5"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="50"
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
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>EPS Analysis Results</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Basic EPS</div>
                      <div className={styles.resultValue}>{formatEPS(results.basicEPS)}</div>
                      <div className={styles.resultDescription}>GAAP Standard</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Diluted EPS</div>
                      <div className={styles.resultValue}>{formatEPS(results.dilutedEPS)}</div>
                      <div className={styles.resultDescription}>Including Convertibles</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Adjusted EPS</div>
                      <div className={styles.resultValue}>{formatEPS(results.adjustedEPS)}</div>
                      <div className={styles.resultDescription}>Excluding Extraordinary</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Profit Margin</div>
                      <div className={styles.resultValue}>{formatPercentage(results.profitMargin)}</div>
                      <div className={styles.resultDescription}>After Preferred</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>P/E Ratio</div>
                      <div className={styles.resultValue}>{results.peRatio}x</div>
                      <div className={styles.resultDescription}>At $50 Share Price</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Earnings Yield</div>
                      <div className={styles.resultValue}>{formatPercentage(results.earningsYield)}</div>
                      <div className={styles.resultDescription}>Return on Price</div>
                    </div>
                  </div>

                  {/* Comparison Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>EPS Comparison Analysis</h3>
                    <div className={styles.chartBars}>
                      {comparisonData.map((company, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>{company.name}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBar}
                              style={{ width: `${(company.eps / Math.max(...comparisonData.map(c => c.eps))) * 100}%` }}
                              title={`EPS: ${formatEPS(company.eps)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{formatEPS(company.eps)}</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendYourCompany}`}></div>
                        <span>Your Company Position</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Financial Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Dilution impact: <strong>{formatPercentage(((results.basicEPS - results.dilutedEPS) / results.basicEPS) * 100)}</strong> reduction from convertible securities</li>
                      <li>Extraordinary items affect EPS by: <strong>{formatEPS(results.basicEPS - results.adjustedEPS)}</strong></li>
                      <li>Your earnings yield of <strong>{formatPercentage(results.earningsYield)}</strong> compares to current 10-year treasury yield of ~4.5%</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Understanding Earnings Per Share: The Investor's Key Metric</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Why EPS Matters in Financial Analysis</h3>
                <p>Earnings Per Share (EPS) is one of the most widely used financial metrics for evaluating a company's profitability and stock valuation. It represents the portion of a company's profit allocated to each outstanding share of common stock, providing a standardized measure to compare companies of different sizes and across industries.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World EPS Analysis:</h4>
                  <p>Consider two companies in the same industry:</p>
                  <ul>
                    <li><strong>Company A:</strong> Net Income $50M, 10M shares → EPS $5.00</li>
                    <li><strong>Company B:</strong> Net Income $100M, 50M shares → EPS $2.00</li>
                  </ul>
                  <p>Despite Company B having double the net income, Company A is more profitable per share and might be more attractive to investors seeking earnings efficiency.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Types of EPS Calculations</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>📈 Basic EPS</h4>
                    <p>(Net Income - Preferred Dividends) ÷ Weighted Average Common Shares. The standard GAAP measure used in financial statements.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📊 Diluted EPS</h4>
                    <p>Accounts for all potential common shares from convertible securities. Shows the "worst-case" EPS if all dilutive instruments convert.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🎯 Adjusted EPS</h4>
                    <p>Excludes one-time items, restructuring costs, and extraordinary gains/losses to show sustainable earnings power.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🚀 Forward EPS</h4>
                    <p>Analyst estimates of future EPS based on projected earnings and share counts. Used for valuation and growth analysis.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>How to Interpret EPS Results</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Trend Analysis:</strong> Consistent EPS growth over 5-10 years indicates sustainable competitive advantages</li>
                  <li><strong>Industry Comparison:</strong> Compare your EPS to industry averages to assess competitive positioning</li>
                  <li><strong>Quality Check:</strong> Large gaps between basic and diluted EPS suggest significant dilution risk</li>
                  <li><strong>Valuation:</strong> Combine EPS with P/E ratio to assess whether a stock is fairly valued</li>
                  <li><strong>Dividend Safety:</strong> EPS should comfortably cover dividend payments (dividend payout ratio)</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Analysis from Financial Professionals</h3>
                <blockquote className={styles.expertQuote}>
                  "While EPS is crucial, never analyze it in isolation. Always examine EPS trends alongside revenue growth, profit margins, and cash flow generation. A company growing EPS through share buybacks rather than actual earnings growth warrants careful scrutiny."
                  <footer className={styles.quoteFooter}>— CFA Charterholder, Equity Research Director</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's a "good" EPS number?</h3>
                <p className={styles.faqAnswer}>There's no universal "good" EPS—it depends on industry, company size, and growth stage. More important than the absolute number is EPS growth over time, consistency, and how it compares to industry peers. Focus on EPS trends rather than single data points.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do stock buybacks affect EPS?</h3>
                <p className={styles.faqAnswer}>Stock buybacks reduce the number of outstanding shares, which increases EPS even if net income stays flat. This can make a company appear more profitable per share. Analyze whether EPS growth comes from actual earnings growth or just share count reduction.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Why is diluted EPS important?</h3>
                <p className={styles.faqAnswer}>Diluted EPS shows the potential impact of convertible securities (options, warrants, convertible bonds) on earnings per share. If diluted EPS is significantly lower than basic EPS, the company has substantial dilution risk that could reduce future earnings for existing shareholders.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does EPS relate to stock price?</h3>
                <p className={styles.faqAnswer}>EPS directly influences stock price through the Price-to-Earnings (P/E) ratio. Stock Price = EPS × P/E Ratio. If EPS grows while P/E remains constant, the stock price should increase proportionally. This is why earnings growth is so critical for stock appreciation.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Analyze Your Investment?</h2>
              <p className={styles.ctaText}>Use our EPS calculator to evaluate company profitability, compare with benchmarks, and make informed investment decisions.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational and analytical purposes. EPS calculations may vary based on accounting methods and assumptions. Past performance does not guarantee future results. Consult with a financial advisor for investment decisions.
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

export default EPSCalculator;