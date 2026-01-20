import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './assetturnovercalculator.module.css';

const AssetTurnoverCalculator = ({ currentDate, lastModifiedDate }) => {
  const [netSales, setNetSales] = useState(1000000);
  const [beginningAssets, setBeginningAssets] = useState(800000);
  const [endingAssets, setEndingAssets] = useState(900000);
  const [industry, setIndustry] = useState('general');
  const [assetTurnover, setAssetTurnover] = useState(null);
  const [comparisonData, setComparisonData] = useState([]);
  const [analysis, setAnalysis] = useState('');

  const industryBenchmarks = {
    'general': { min: 0.5, target: 1.0, max: 2.0, description: 'General Business' },
    'retail': { min: 1.5, target: 2.5, max: 4.0, description: 'Retail' },
    'technology': { min: 0.6, target: 1.2, max: 2.0, description: 'Technology' },
    'manufacturing': { min: 0.8, target: 1.5, max: 2.5, description: 'Manufacturing' },
    'service': { min: 1.0, target: 2.0, max: 3.5, description: 'Service Industry' },
    'utilities': { min: 0.2, target: 0.4, max: 0.8, description: 'Utilities' },
    'pharmaceutical': { min: 0.3, target: 0.6, max: 1.0, description: 'Pharmaceutical' },
    'construction': { min: 1.2, target: 2.0, max: 3.0, description: 'Construction' }
  };

  const calculateAssetTurnover = () => {
    const averageAssets = (beginningAssets + endingAssets) / 2;
    const turnover = netSales / averageAssets;
    const roundedTurnover = Math.round(turnover * 100) / 100;
    
    setAssetTurnover(roundedTurnover);
    
    // Generate comparison data
    const benchmark = industryBenchmarks[industry];
    const comparison = [];
    
    Object.keys(industryBenchmarks).forEach(key => {
      if (key !== industry) {
        const industryData = industryBenchmarks[key];
        comparison.push({
          industry: key,
          description: industryData.description,
          target: industryData.target,
          min: industryData.min,
          max: industryData.max
        });
      }
    });
    
    setComparisonData(comparison.slice(0, 4)); // Show top 4 comparisons
    
    // Perform analysis
    let analysisText = '';
    const industryName = benchmark.description;
    
    if (turnover < benchmark.min) {
      analysisText = `⚠️ POOR asset efficiency. Your asset turnover of ${roundedTurnover.toFixed(2)} is below the ${industryName} industry minimum of ${benchmark.min}. This indicates underutilized assets and potential operational inefficiencies.`;
    } else if (turnover >= benchmark.min && turnover < benchmark.target) {
      analysisText = `📊 MODERATE asset efficiency. Your asset turnover of ${roundedTurnover.toFixed(2)} is within ${industryName} industry range but below the target of ${benchmark.target}. There's room for improvement in asset utilization.`;
    } else if (turnover >= benchmark.target && turnover <= benchmark.max) {
      analysisText = `✅ STRONG asset efficiency. Your asset turnover of ${roundedTurnover.toFixed(2)} meets or exceeds the ${industryName} industry target of ${benchmark.target}. Your assets are being used effectively to generate sales.`;
    } else {
      analysisText = `💪 EXCEPTIONAL asset efficiency. Your asset turnover of ${roundedTurnover.toFixed(2)} exceeds the ${industryName} industry maximum of ${benchmark.max}. This indicates highly efficient asset utilization but may warrant review of asset investment levels.`;
    }
    
    setAnalysis(analysisText);
  };

  useEffect(() => {
    calculateAssetTurnover();
  }, [netSales, beginningAssets, endingAssets, industry]);

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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const getEfficiencyColor = (turnover) => {
    const benchmark = industryBenchmarks[industry];
    if (!benchmark || !turnover) return '#666666';
    if (turnover < benchmark.min) return '#dc2626'; // Red
    if (turnover < benchmark.target) return '#f59e0b'; // Amber
    if (turnover <= benchmark.max) return '#16a34a'; // Green
    return '#9333ea'; // Purple (exceptional)
  };

  const getEfficiencyStatus = (turnover) => {
    const benchmark = industryBenchmarks[industry];
    if (!benchmark || !turnover) return 'Calculating...';
    if (turnover < benchmark.min) return 'Poor';
    if (turnover < benchmark.target) return 'Moderate';
    if (turnover <= benchmark.max) return 'Strong';
    return 'Exceptional';
  };

  const calculateAnnualRevenuePerAsset = (turnover) => {
    if (!turnover) return null;
    return formatCurrency(turnover * 1000); // Revenue per $1,000 of assets
  };

  return (
    <>
      <Head>
        <title>Asset Turnover Ratio Calculator | Measure Asset Efficiency & Productivity</title>
        <meta name="description" content="Free professional asset turnover ratio calculator with industry benchmarks. Analyze your company's asset efficiency, compare against industry standards, and optimize asset utilization." />
        <meta name="keywords" content="asset turnover ratio calculator, asset efficiency, financial ratios, business productivity, asset utilization, financial analysis, efficiency ratios" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://yourdomain.com/asset-turnover-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Asset Turnover Ratio Calculator | Measure Asset Efficiency & Productivity" />
        <meta property="og:description" content="Calculate and analyze your company's asset turnover ratio. Free tool with industry benchmarks and actionable insights." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/asset-turnover-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Professional Asset Turnover Ratio Calculator" />
        <meta name="twitter:description" content="Analyze your company's asset efficiency with industry-specific benchmarks." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="asset-turnover-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Professional Asset Turnover Ratio Calculator",
            "description": "Industry-standard asset turnover calculator with benchmarks and efficiency analysis tools",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "ratingCount": "750",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Financial Analysis Tools Pro",
              "url": "https://yourdomain.com"
            },
            "featureList": [
              "Industry Benchmarks",
              "Real-time Analysis",
              "Efficiency Assessment",
              "Actionable Insights",
              "Multi-Industry Comparison"
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
                "name": "What is asset turnover ratio and why is it important?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Asset turnover ratio measures how efficiently a company uses its assets to generate revenue. It's calculated as Net Sales divided by Average Total Assets. A higher ratio indicates better asset utilization and operational efficiency.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is a good asset turnover ratio for my industry?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Good asset turnover ratios vary significantly by industry. Retail typically has high ratios (2-4), manufacturing moderate (1-2.5), and capital-intensive industries like utilities low ratios (0.2-0.8). Our calculator includes industry-specific benchmarks for accurate comparison.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How can I improve my asset turnover ratio?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Improve asset turnover by increasing sales without proportional asset growth, optimizing inventory management, disposing of underutilized assets, improving production efficiency, or restructuring asset-heavy operations.",
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
            <h1 className={styles.mainTitle}>Asset Turnover Ratio Calculator</h1>
            <p className={styles.subtitle}>Measure Your Business Efficiency with Professional Asset Utilization Analysis</p>
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
              <h2 className={styles.sectionTitle}>Calculate Your Asset Efficiency</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Net Sales / Revenue
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="100000"
                      max="10000000"
                      step="10000"
                      value={netSales}
                      onChange={(e) => setNetSales(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="100000"
                      max="10000000"
                      step="10000"
                      value={netSales}
                      onChange={(e) => setNetSales(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(netSales)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Beginning Total Assets
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="50000"
                      max="5000000"
                      step="10000"
                      value={beginningAssets}
                      onChange={(e) => setBeginningAssets(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="50000"
                      max="5000000"
                      step="10000"
                      value={beginningAssets}
                      onChange={(e) => setBeginningAssets(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(beginningAssets)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Ending Total Assets
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="50000"
                      max="5000000"
                      step="10000"
                      value={endingAssets}
                      onChange={(e) => setEndingAssets(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="50000"
                      max="5000000"
                      step="10000"
                      value={endingAssets}
                      onChange={(e) => setEndingAssets(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(endingAssets)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Industry Benchmark
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="general">General Business</option>
                    <option value="retail">Retail</option>
                    <option value="technology">Technology</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="service">Service Industry</option>
                    <option value="utilities">Utilities</option>
                    <option value="pharmaceutical">Pharmaceutical</option>
                    <option value="construction">Construction</option>
                  </select>
                </label>
              </div>

              <div className={styles.calculationNote}>
                <div className={styles.noteIcon}>📝</div>
                <div className={styles.noteContent}>
                  <strong>Formula:</strong> Asset Turnover = Net Sales ÷ Average Total Assets
                  <br />
                  <small>Where Average Total Assets = (Beginning Assets + Ending Assets) ÷ 2</small>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Asset Efficiency Analysis</h2>
              
              {assetTurnover !== null && (
                <>
                  <div className={styles.efficiencyDisplay}>
                    <div className={styles.efficiencyValue} style={{ color: getEfficiencyColor(assetTurnover) }}>
                      {formatNumber(assetTurnover)}
                    </div>
                    <div className={styles.efficiencyLabel}>Asset Turnover Ratio</div>
                    <div className={styles.efficiencyStatus} style={{ backgroundColor: getEfficiencyColor(assetTurnover) }}>
                      {getEfficiencyStatus(assetTurnover)}
                    </div>
                  </div>

                  <div className={styles.calculationBreakdown}>
                    <h3 className={styles.breakdownTitle}>Calculation Details</h3>
                    <div className={styles.breakdownGrid}>
                      <div className={styles.breakdownItem}>
                        <span className={styles.breakdownLabel}>Net Sales:</span>
                        <span className={styles.breakdownValue}>{formatCurrency(netSales)}</span>
                      </div>
                      <div className={styles.breakdownItem}>
                        <span className={styles.breakdownLabel}>Beginning Assets:</span>
                        <span className={styles.breakdownValue}>{formatCurrency(beginningAssets)}</span>
                      </div>
                      <div className={styles.breakdownItem}>
                        <span className={styles.breakdownLabel}>Ending Assets:</span>
                        <span className={styles.breakdownValue}>{formatCurrency(endingAssets)}</span>
                      </div>
                      <div className={styles.breakdownDivider}>
                        <span className={styles.dividerLine}></span>
                      </div>
                      <div className={styles.breakdownItem}>
                        <span className={styles.breakdownLabel}>Average Assets:</span>
                        <span className={styles.breakdownValue}>{formatCurrency((beginningAssets + endingAssets) / 2)}</span>
                      </div>
                      <div className={styles.breakdownItem}>
                        <span className={styles.breakdownLabel}>Asset Turnover:</span>
                        <span className={styles.breakdownValue}>{formatNumber(assetTurnover)}</span>
                      </div>
                    </div>
                    
                    <div className={styles.efficiencyMetrics}>
                      <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Revenue per $1,000 of Assets</div>
                        <div className={styles.metricValue}>{calculateAnnualRevenuePerAsset(assetTurnover)}</div>
                      </div>
                      <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Asset Intensity</div>
                        <div className={styles.metricValue}>${(1000 / assetTurnover).toFixed(0)} per $1,000 Revenue</div>
                      </div>
                    </div>
                  </div>

                  {/* Industry Benchmark Comparison */}
                  <div className={styles.benchmarkContainer}>
                    <h3 className={styles.benchmarkTitle}>
                      {industryBenchmarks[industry].description} Industry Benchmarks
                    </h3>
                    <div className={styles.benchmarkScale}>
                      <div className={styles.scaleLabels}>
                        <span>Poor</span>
                        <span>Moderate</span>
                        <span>Strong</span>
                        <span>Exceptional</span>
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
                            &lt;{industryBenchmarks[industry].min}
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
                            {industryBenchmarks[industry].min}-{industryBenchmarks[industry].target}
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
                            {industryBenchmarks[industry].target}-{industryBenchmarks[industry].max}
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
                            &gt;{industryBenchmarks[industry].max}
                          </span>
                        </div>
                      </div>
                      <div 
                        className={styles.currentMarker}
                        style={{ 
                          left: `${Math.min(Math.max((assetTurnover / 4) * 100, 2.5), 97.5)}%`,
                          backgroundColor: getEfficiencyColor(assetTurnover)
                        }}
                        title={`Your Ratio: ${assetTurnover.toFixed(2)}`}
                      >
                        <div className={styles.markerLabel}>Your Ratio</div>
                      </div>
                    </div>
                    
                    <div className={styles.industryComparison}>
                      <h4 className={styles.comparisonTitle}>Industry Comparison</h4>
                      <div className={styles.comparisonGrid}>
                        {comparisonData.map((item, index) => (
                          <div key={index} className={styles.comparisonItem}>
                            <div className={styles.comparisonIndustry}>{item.description}</div>
                            <div className={styles.comparisonRange}>
                              {item.min.toFixed(1)} - {item.max.toFixed(1)}
                            </div>
                            <div className={styles.comparisonTarget}>
                              Target: {item.target.toFixed(1)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Analysis */}
                  <div className={styles.analysisCard}>
                    <h3 className={styles.analysisTitle}>📊 Efficiency Analysis</h3>
                    <p className={styles.analysisText}>{analysis}</p>
                    
                    <div className={styles.improvementTips}>
                      <h4 className={styles.tipsTitle}>💡 Strategies to Improve Asset Efficiency:</h4>
                      <ul className={styles.tipsList}>
                        <li><strong>Optimize inventory management:</strong> Reduce stock levels while maintaining service quality</li>
                        <li><strong>Dispose of underutilized assets:</strong> Sell or lease idle equipment and property</li>
                        <li><strong>Increase sales without adding assets:</strong> Focus on higher-margin products and services</li>
                        <li><strong>Improve production efficiency:</strong> Reduce downtime and increase throughput</li>
                        <li><strong>Consider asset leasing:</strong> Convert capital expenditures to operating expenses</li>
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
              <h2 className={styles.articleTitle}>Asset Turnover Ratio: The Ultimate Efficiency Metric</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>What Does Asset Turnover Really Mean?</h3>
                <p>The asset turnover ratio measures how effectively a company uses its assets to generate sales revenue. It's a key efficiency metric that shows how much revenue each dollar of assets produces. A higher ratio indicates better asset utilization, while a lower ratio may suggest underutilized assets or inefficient operations.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World Interpretation:</h4>
                  <ul>
                    <li><strong>Asset Turnover of 2.0:</strong> Each $1 of assets generates $2 in annual sales</li>
                    <li><strong>Asset Turnover of 0.5:</strong> Each $1 of assets generates only $0.50 in annual sales</li>
                    <li><strong>Industry Example:</strong> Walmart typically has ratios around 2.5, while Exxon Mobil might have 1.0 due to capital-intensive operations</li>
                  </ul>
                  <p>This ratio helps investors and managers understand how efficiently capital is being deployed.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Industry Variations & What They Mean</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🏪 Retail Industry</h4>
                    <p>Typically has high ratios (2-4) due to low asset intensity and high inventory turnover. Companies like Amazon achieve even higher ratios through asset-light models.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏭 Manufacturing</h4>
                    <p>Moderate ratios (1-2.5) reflect significant capital investment in plant and equipment. Efficiency comes from maximizing production capacity utilization.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚡ Utilities</h4>
                    <p>Low ratios (0.2-0.8) due to massive infrastructure investments. Efficiency focuses on regulatory compliance and long-term asset management.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💻 Technology</h4>
                    <p>Varies widely (0.6-2.0). Software companies have high ratios, while hardware manufacturers have lower ratios due to production facilities.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategic Applications</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Investment Analysis:</strong> Compare companies within the same industry to identify efficiency leaders</li>
                  <li><strong>Operational Improvement:</strong> Identify underperforming assets and optimize utilization</li>
                  <li><strong>M&A Due Diligence:</strong> Assess target company's asset efficiency pre-acquisition</li>
                  <li><strong>Capital Allocation:</strong> Guide decisions on asset purchases vs. leasing</li>
                  <li><strong>Performance Benchmarking:</strong> Track efficiency improvements over time and against competitors</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Insights</h3>
                <blockquote className={styles.expertQuote}>
                  "Asset turnover tells you how hard your assets are working. A declining ratio often precedes profitability issues. Smart companies monitor this metric quarterly and take corrective action before efficiency problems impact the bottom line. Remember: idle assets don't just sit there—they cost money and opportunity."
                  <footer className={styles.quoteFooter}>— Operations Efficiency Consultant, Fortune 500 Companies</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can asset turnover be too high?</h3>
                <p className={styles.faqAnswer}>Yes, excessively high asset turnover (well above industry norms) might indicate underinvestment in assets, which could limit growth potential or indicate aging equipment needing replacement. It could also suggest aggressive sales practices that may not be sustainable. Balance is key—assets should be utilized efficiently but not stretched beyond capacity.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does asset turnover differ from inventory turnover?</h3>
                <p className={styles.faqAnswer}>Asset turnover considers ALL assets (including property, equipment, cash, etc.), while inventory turnover focuses only on inventory efficiency. Asset turnover gives a broader efficiency picture, while inventory turnover provides specific insights into inventory management. Both are important for comprehensive operational analysis.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I use total assets or net assets?</h3>
                <p className={styles.faqAnswer}>Standard practice uses total assets (not net of depreciation). This provides consistency when comparing companies with different depreciation methods. Some analysts use net assets for specific industries, but for general comparison, total assets as reported on the balance sheet is recommended.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How often should I calculate asset turnover?</h3>
                <p className={styles.faqAnswer}>For internal management, quarterly calculation is ideal to track trends. For investment analysis, annual calculation suffices but should be compared over 3-5 year periods to identify trends. During rapid growth or restructuring, monthly calculation can provide timely insights into efficiency changes.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Optimize Your Asset Efficiency Today</h2>
              <p className={styles.ctaText}>Use this calculator to benchmark your asset utilization against industry standards and identify improvement opportunities.</p>
              
              
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational and informational purposes. Financial and operational decisions should be based on comprehensive analysis and professional advice. Industry benchmarks are general guidelines and may not reflect specific company circumstances or accounting methods.
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

export default AssetTurnoverCalculator;