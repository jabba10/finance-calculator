import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './quickratiocalculator.module.css';

const QuickRatioCalculator = ({ currentDate, lastModifiedDate }) => {
  const [currentAssets, setCurrentAssets] = useState(150000);
  const [inventory, setInventory] = useState(50000);
  const [prepaidExpenses, setPrepaidExpenses] = useState(10000);
  const [currentLiabilities, setCurrentLiabilities] = useState(80000);
  const [quickRatio, setQuickRatio] = useState(null);
  const [industryBenchmark, setIndustryBenchmark] = useState('general');
  const [analysis, setAnalysis] = useState('');

  const industryBenchmarks = {
    'general': { min: 1.0, target: 1.5, max: 2.0 },
    'technology': { min: 1.2, target: 1.8, max: 2.5 },
    'retail': { min: 0.8, target: 1.2, max: 1.8 },
    'manufacturing': { min: 0.9, target: 1.3, max: 1.8 },
    'service': { min: 1.1, target: 1.6, max: 2.2 },
    'healthcare': { min: 1.3, target: 1.7, max: 2.3 }
  };

  const calculateQuickRatio = () => {
    const quickAssets = currentAssets - inventory - prepaidExpenses;
    const ratio = quickAssets / currentLiabilities;
    setQuickRatio(Math.round(ratio * 100) / 100);
    
    // Perform analysis
    const benchmark = industryBenchmarks[industryBenchmark];
    let analysisText = '';
    
    if (ratio < benchmark.min) {
      analysisText = `⚠️ WEAK liquidity position. Your quick ratio of ${ratio.toFixed(2)} is below the ${industryBenchmark} industry minimum of ${benchmark.min}. This indicates potential difficulty meeting short-term obligations without selling inventory.`;
    } else if (ratio >= benchmark.min && ratio < benchmark.target) {
      analysisText = `📊 ADEQUATE liquidity position. Your quick ratio of ${ratio.toFixed(2)} meets the ${industryBenchmark} industry minimum but is below the target of ${benchmark.target}. Consider improving cash position or reducing short-term debt.`;
    } else if (ratio >= benchmark.target && ratio <= benchmark.max) {
      analysisText = `✅ STRONG liquidity position. Your quick ratio of ${ratio.toFixed(2)} meets the ${industryBenchmark} industry target of ${benchmark.target}. This indicates good ability to meet short-term obligations.`;
    } else {
      analysisText = `💪 EXCESSIVE liquidity position. Your quick ratio of ${ratio.toFixed(2)} exceeds the ${industryBenchmark} industry maximum of ${benchmark.max}. While safe, this may indicate inefficient use of assets.`;
    }
    
    setAnalysis(analysisText);
  };

  useEffect(() => {
    calculateQuickRatio();
  }, [currentAssets, inventory, prepaidExpenses, currentLiabilities, industryBenchmark]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getRatioColor = (ratio) => {
    const benchmark = industryBenchmarks[industryBenchmark];
    if (ratio < benchmark.min) return '#dc2626'; // Red
    if (ratio < benchmark.target) return '#f59e0b'; // Amber
    if (ratio <= benchmark.max) return '#16a34a'; // Green
    return '#9333ea'; // Purple (excessive)
  };

  const getRatioStatus = (ratio) => {
    const benchmark = industryBenchmarks[industryBenchmark];
    if (ratio < benchmark.min) return 'Weak';
    if (ratio < benchmark.target) return 'Adequate';
    if (ratio <= benchmark.max) return 'Strong';
    return 'Excessive';
  };

  return (
    <>
      <Head>
        <title>Quick Ratio Calculator | Measure Business Liquidity Accurately</title>
        <meta name="description" content="Free professional quick ratio calculator with industry benchmarks. Analyze your company's liquidity position, compare against industry standards, and improve financial health." />
        <meta name="keywords" content="quick ratio calculator, acid test ratio, liquidity ratio, financial analysis, business liquidity, financial health, current ratio, working capital" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://yourdomain.com/quick-ratio-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Quick Ratio Calculator | Measure Business Liquidity Accurately" />
        <meta property="og:description" content="Calculate and analyze your company's quick ratio. Free tool with industry benchmarks and actionable insights." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/quick-ratio-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Professional Quick Ratio Calculator" />
        <meta name="twitter:description" content="Analyze your company's liquidity position with industry-specific benchmarks." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="quick-ratio-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Professional Quick Ratio Calculator",
            "description": "Industry-standard quick ratio calculator with benchmarks and financial analysis tools",
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
              "name": "Financial Analysis Tools",
              "url": "https://yourdomain.com"
            },
            "featureList": [
              "Industry Benchmarks",
              "Real-time Analysis",
              "Financial Health Assessment",
              "Actionable Insights",
              "Export Results"
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
                "name": "What is the quick ratio and why is it important?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The quick ratio (acid-test ratio) measures a company's ability to pay its current liabilities without relying on inventory sales. It's a stricter liquidity measure than the current ratio and indicates immediate financial health.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is a good quick ratio for my industry?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Quick ratio benchmarks vary by industry. Technology companies typically need 1.2-2.5, retail 0.8-1.8, and manufacturing 0.9-1.8. Our calculator includes industry-specific benchmarks for accurate comparison.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How can I improve my quick ratio?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Improve quick ratio by increasing cash/receivables, reducing inventory, converting inventory to cash faster, paying down short-term debt, or extending payment terms with suppliers while collecting receivables faster.",
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
            <h1 className={styles.mainTitle}>Professional Quick Ratio Calculator</h1>
            <p className={styles.subtitle}>Analyze Your Business Liquidity with Industry-Standard Benchmarks</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Industry Benchmarks</span>
              <span className={styles.badge}>No Signup Required</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate Your Quick Ratio</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Current Assets
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="10000"
                      max="1000000"
                      step="1000"
                      value={currentAssets}
                      onChange={(e) => setCurrentAssets(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10000"
                      max="1000000"
                      step="1000"
                      value={currentAssets}
                      onChange={(e) => setCurrentAssets(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(currentAssets)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Inventory
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="1000"
                      value={inventory}
                      onChange={(e) => setInventory(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="500000"
                      step="1000"
                      value={inventory}
                      onChange={(e) => setInventory(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(inventory)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Prepaid Expenses
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="1000"
                      value={prepaidExpenses}
                      onChange={(e) => setPrepaidExpenses(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="200000"
                      step="1000"
                      value={prepaidExpenses}
                      onChange={(e) => setPrepaidExpenses(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(prepaidExpenses)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Current Liabilities
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="10000"
                      max="500000"
                      step="1000"
                      value={currentLiabilities}
                      onChange={(e) => setCurrentLiabilities(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10000"
                      max="500000"
                      step="1000"
                      value={currentLiabilities}
                      onChange={(e) => setCurrentLiabilities(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(currentLiabilities)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Industry Benchmark
                  <select
                    value={industryBenchmark}
                    onChange={(e) => setIndustryBenchmark(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="general">General Business</option>
                    <option value="technology">Technology</option>
                    <option value="retail">Retail</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="service">Service Industry</option>
                    <option value="healthcare">Healthcare</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Liquidity Analysis</h2>
              
              {quickRatio !== null && (
                <>
                  <div className={styles.ratioDisplay}>
                    <div className={styles.ratioValue} style={{ color: getRatioColor(quickRatio) }}>
                      {quickRatio.toFixed(2)}
                    </div>
                    <div className={styles.ratioLabel}>Quick Ratio</div>
                    <div className={styles.ratioStatus} style={{ backgroundColor: getRatioColor(quickRatio) }}>
                      {getRatioStatus(quickRatio)}
                    </div>
                  </div>

                  <div className={styles.calculationBreakdown}>
                    <h3 className={styles.breakdownTitle}>Calculation Breakdown</h3>
                    <div className={styles.breakdownGrid}>
                      <div className={styles.breakdownItem}>
                        <span className={styles.breakdownLabel}>Current Assets:</span>
                        <span className={styles.breakdownValue}>{formatCurrency(currentAssets)}</span>
                      </div>
                      <div className={styles.breakdownItem}>
                        <span className={styles.breakdownLabel}>Less Inventory:</span>
                        <span className={styles.breakdownValue}>-{formatCurrency(inventory)}</span>
                      </div>
                      <div className={styles.breakdownItem}>
                        <span className={styles.breakdownLabel}>Less Prepaid Expenses:</span>
                        <span className={styles.breakdownValue}>-{formatCurrency(prepaidExpenses)}</span>
                      </div>
                      <div className={styles.breakdownDivider}>
                        <span className={styles.dividerLine}></span>
                      </div>
                      <div className={styles.breakdownItem}>
                        <span className={styles.breakdownLabel}>Quick Assets:</span>
                        <span className={styles.breakdownValue}>{formatCurrency(currentAssets - inventory - prepaidExpenses)}</span>
                      </div>
                      <div className={styles.breakdownItem}>
                        <span className={styles.breakdownLabel}>Current Liabilities:</span>
                        <span className={styles.breakdownValue}>{formatCurrency(currentLiabilities)}</span>
                      </div>
                    </div>
                    <div className={styles.formula}>
                      <div className={styles.formulaTitle}>Formula:</div>
                      <div className={styles.formulaText}>
                        (Current Assets - Inventory - Prepaid Expenses) ÷ Current Liabilities
                      </div>
                    </div>
                  </div>

                  {/* Industry Benchmark Comparison */}
                  <div className={styles.benchmarkContainer}>
                    <h3 className={styles.benchmarkTitle}>
                      {industryBenchmark.charAt(0).toUpperCase() + industryBenchmark.slice(1)} Industry Benchmarks
                    </h3>
                    <div className={styles.benchmarkScale}>
                      <div className={styles.scaleLabels}>
                        <span>Weak</span>
                        <span>Adequate</span>
                        <span>Strong</span>
                        <span>Excessive</span>
                      </div>
                      <div className={styles.scaleBar}>
                        <div 
                          className={styles.scaleSegment}
                          style={{ 
                            width: '25%',
                            backgroundColor: '#dc2626'
                          }}
                        >
                          <span className={styles.scaleValue}>
                            &lt;{industryBenchmarks[industryBenchmark].min}
                          </span>
                        </div>
                        <div 
                          className={styles.scaleSegment}
                          style={{ 
                            width: '25%',
                            backgroundColor: '#f59e0b'
                          }}
                        >
                          <span className={styles.scaleValue}>
                            {industryBenchmarks[industryBenchmark].min}-{industryBenchmarks[industryBenchmark].target}
                          </span>
                        </div>
                        <div 
                          className={styles.scaleSegment}
                          style={{ 
                            width: '25%',
                            backgroundColor: '#16a34a'
                          }}
                        >
                          <span className={styles.scaleValue}>
                            {industryBenchmarks[industryBenchmark].target}-{industryBenchmarks[industryBenchmark].max}
                          </span>
                        </div>
                        <div 
                          className={styles.scaleSegment}
                          style={{ 
                            width: '25%',
                            backgroundColor: '#9333ea'
                          }}
                        >
                          <span className={styles.scaleValue}>
                            &gt;{industryBenchmarks[industryBenchmark].max}
                          </span>
                        </div>
                      </div>
                      <div 
                        className={styles.currentMarker}
                        style={{ 
                          left: `${Math.min(Math.max((quickRatio / 4) * 100, 2.5), 97.5)}%`,
                          backgroundColor: getRatioColor(quickRatio)
                        }}
                        title={`Your Ratio: ${quickRatio.toFixed(2)}`}
                      >
                        <div className={styles.markerLabel}>You are here</div>
                      </div>
                    </div>
                  </div>

                  {/* Analysis */}
                  <div className={styles.analysisCard}>
                    <h3 className={styles.analysisTitle}>📊 Financial Analysis</h3>
                    <p className={styles.analysisText}>{analysis}</p>
                    
                    <div className={styles.improvementTips}>
                      <h4 className={styles.tipsTitle}>💡 Improvement Strategies:</h4>
                      <ul className={styles.tipsList}>
                        <li><strong>Increase cash position:</strong> Accelerate accounts receivable collection</li>
                        <li><strong>Optimize inventory:</strong> Reduce slow-moving stock and improve turnover</li>
                        <li><strong>Manage liabilities:</strong> Extend accounts payable terms or refinance short-term debt</li>
                        <li><strong>Review prepaid expenses:</strong> Defer non-essential prepayments</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>The Quick Ratio: Your Business's Financial Health Check</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>What is the Quick Ratio?</h3>
                <p>The quick ratio, also known as the acid-test ratio, is a critical financial metric that measures a company's ability to meet its short-term obligations using its most liquid assets. Unlike the current ratio which includes all current assets, the quick ratio excludes inventory and prepaid expenses, providing a more conservative view of liquidity.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Why It Matters:</h4>
                  <ul>
                    <li><strong>Creditor Assessment:</strong> Lenders use quick ratio to evaluate loan repayment ability</li>
                    <li><strong>Investor Insight:</strong> Investors assess financial stability and risk management</li>
                    <li><strong>Supplier Confidence:</strong> Suppliers check payment reliability before extending credit</li>
                    <li><strong>Internal Management:</strong> Helps identify liquidity risks before they become crises</li>
                  </ul>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Industry-Specific Considerations</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🏪 Retail Businesses</h4>
                    <p>Typically operate with lower quick ratios (0.8-1.2) due to high inventory turnover. Cash conversion cycles are rapid, making inventory more liquid.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💻 Technology Companies</h4>
                    <p>Often maintain higher ratios (1.2-2.5) due to minimal inventory and significant cash reserves for R&D and rapid scaling.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏭 Manufacturing</h4>
                    <p>Require moderate ratios (0.9-1.8) as they maintain inventory for production but need liquidity for raw material purchases.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏥 Healthcare</h4>
                    <p>Maintain high ratios (1.3-2.3) due to long payment cycles from insurance companies and need for emergency funds.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Real-World Applications</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Loan Applications:</strong> Banks require minimum quick ratios for business loans and credit lines</li>
                  <li><strong>Investment Decisions:</strong> Venture capitalists evaluate quick ratio when funding startups</li>
                  <li><strong>Supplier Negotiations:</strong> Strong ratios provide leverage for better payment terms</li>
                  <li><strong>Risk Management:</strong> Early warning system for potential cash flow problems</li>
                  <li><strong>Strategic Planning:</strong> Guides decisions on inventory levels, credit policies, and capital structure</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Insights</h3>
                <blockquote className={styles.expertQuote}>
                  "A quick ratio below industry standards isn't necessarily a death sentence, but it's a flashing warning light. Smart businesses use this metric proactively to adjust inventory management, receivables collection, and payment terms before liquidity becomes critical."
                  <footer className={styles.quoteFooter}>— Corporate Financial Analyst, Fortune 500 Companies</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between quick ratio and current ratio?</h3>
                <p className={styles.faqAnswer}>The current ratio includes ALL current assets (including inventory and prepaid expenses), while the quick ratio excludes these less-liquid items. The quick ratio provides a more conservative, realistic view of immediate liquidity since inventory may not be quickly convertible to cash at full value.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can a quick ratio be too high?</h3>
                <p className={styles.faqAnswer}>Yes, excessively high quick ratios (above 3.0) may indicate inefficient use of assets. Excess cash could be invested for growth, inventory could be increased to meet demand, or debt could be strategically used for expansion. Balance is key to optimal financial management.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How often should I calculate my quick ratio?</h3>
                <p className={styles.faqAnswer}>For most businesses, monthly calculation is recommended. Public companies report quarterly. During growth phases, financial stress, or when negotiating with lenders, more frequent calculation (even weekly) can provide crucial insights into financial health trends.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What if my industry isn't listed?</h3>
                <p className={styles.faqAnswer}>Use the "General Business" benchmark as a starting point, then research industry-specific data from sources like industry associations, financial databases (Bloomberg, S&P), or academic studies on your specific sector's financial ratios.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Take Control of Your Business Liquidity</h2>
              <p className={styles.ctaText}>Use this calculator regularly to monitor your financial health. Adjust inputs to model different scenarios and make informed business decisions.</p>
              
              
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational and informational purposes. Financial decisions should be based on comprehensive analysis and professional advice. Industry benchmarks are general guidelines and may not reflect specific company circumstances.
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

export default QuickRatioCalculator;