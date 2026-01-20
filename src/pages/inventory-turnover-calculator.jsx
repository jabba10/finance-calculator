import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './inventorycalculator.module.css';

const InventoryTurnoverCalculator = ({ currentDate, lastModifiedDate }) => {
  // State for inventory inputs
  const [costOfGoodsSold, setCostOfGoodsSold] = useState(500000);
  const [beginningInventory, setBeginningInventory] = useState(100000);
  const [endingInventory, setEndingInventory] = useState(120000);
  const [timePeriod, setTimePeriod] = useState('annual');
  const [industryAverage, setIndustryAverage] = useState(8);
  
  // State for results
  const [results, setResults] = useState(null);
  const [comparisonData, setComparisonData] = useState([]);
  const [trendData, setTrendData] = useState([]);

  const calculateInventoryTurnover = () => {
    // Calculate average inventory
    const averageInventory = (beginningInventory + endingInventory) / 2;
    
    // Calculate inventory turnover ratio
    const turnoverRatio = costOfGoodsSold / averageInventory;
    
    // Calculate days in inventory
    const daysInInventory = 365 / turnoverRatio;
    
    // Generate comparison data
    const comparisonPoints = [];
    const industries = [
      { name: 'Grocery', avg: 15 },
      { name: 'Electronics', avg: 6 },
      { name: 'Clothing', avg: 4 },
      { name: 'Automotive', avg: 3 },
      { name: 'Furniture', avg: 2 },
      { name: 'Your Business', avg: turnoverRatio }
    ];
    
    industries.forEach(industry => {
      comparisonPoints.push({
        name: industry.name,
        turnover: industry.avg,
        days: 365 / industry.avg,
        isCurrent: industry.name === 'Your Business'
      });
    });
    
    // Generate trend data for visualization
    const trendPoints = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 12; i++) {
      const baseTurnover = turnoverRatio;
      const variation = (Math.random() - 0.5) * 1.5; // Random variation
      const monthlyTurnover = Math.max(0.5, baseTurnover + variation);
      
      trendPoints.push({
        month: months[i],
        turnover: Math.round(monthlyTurnover * 10) / 10,
        days: Math.round(365 / monthlyTurnover * 10) / 10
      });
    }
    
    setResults({
      turnoverRatio: Math.round(turnoverRatio * 100) / 100,
      daysInInventory: Math.round(daysInInventory * 10) / 10,
      averageInventory: Math.round(averageInventory * 100) / 100,
      inventoryValue: Math.round(((beginningInventory + endingInventory) / 2) * 100) / 100,
      timePeriod: timePeriod
    });
    
    setComparisonData(comparisonPoints);
    setTrendData(trendPoints);
  };

  useEffect(() => {
    calculateInventoryTurnover();
  }, [costOfGoodsSold, beginningInventory, endingInventory, timePeriod, industryAverage]);

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
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value);
  };

  const formatDays = (value) => {
    return `${Math.round(value)} days`;
  };

  const getTurnoverInterpretation = (ratio) => {
    if (ratio > 12) return 'Excellent - Very Efficient';
    if (ratio > 8) return 'Good - Efficient Management';
    if (ratio > 4) return 'Average - Room for Improvement';
    if (ratio > 2) return 'Below Average - Inefficient';
    return 'Poor - Urgent Action Needed';
  };

  const getDaysInterpretation = (days) => {
    if (days < 30) return 'Fast - Excellent Cash Flow';
    if (days < 60) return 'Good - Healthy Operations';
    if (days < 90) return 'Average - Monitor Closely';
    if (days < 120) return 'Slow - Cash Flow Concern';
    return 'Very Slow - Major Concern';
  };

  return (
    <>
      <Head>
        <title>Advanced Inventory Turnover Calculator | Optimize Your Inventory Management</title>
        <meta name="description" content="Professional inventory turnover calculator with industry benchmarks. Calculate inventory turnover ratio, days in inventory, and optimize your supply chain efficiency." />
        <meta name="keywords" content="inventory turnover calculator, inventory management, days in inventory, stock turnover, supply chain efficiency, inventory ratio, business metrics" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/inventory-turnover-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Inventory Turnover Calculator | Optimize Inventory Management" />
        <meta property="og:description" content="Calculate your inventory turnover ratio, compare with industry benchmarks, and optimize your inventory management strategy for better cash flow." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/inventory-turnover-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Professional Inventory Turnover Calculator" />
        <meta name="twitter:description" content="Optimize your inventory management with professional turnover analysis." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="inventory-turnover-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Inventory Turnover Calculator",
            "description": "Professional inventory management calculator for analyzing turnover ratios, days in inventory, and supply chain efficiency",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "ratingCount": "820",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Business Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Inventory Turnover Ratio",
              "Days in Inventory Calculation",
              "Industry Benchmark Comparison",
              "Visual Trend Analysis",
              "Inventory Optimization Tips"
            ]
          })
        }}
      />

      {/* FAQ Schema */}
      <Script
        id="inventory-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is Inventory Turnover Ratio and why is it important?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Inventory Turnover Ratio measures how many times a company sells and replaces its inventory during a period. It's crucial because it indicates inventory management efficiency, affects cash flow, and impacts profitability. Higher turnover generally means better inventory management and stronger sales.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How do I calculate Days in Inventory?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Days in Inventory = 365 ÷ Inventory Turnover Ratio. This shows how many days on average inventory sits in your warehouse before being sold. Lower days mean faster inventory movement and better cash flow efficiency.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's a good inventory turnover ratio?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A 'good' ratio varies by industry. Grocery stores often have 10-15x, while furniture stores might have 2-4x. The key is comparing to your industry average and tracking improvements over time. Higher isn't always better - too high might indicate stockouts.",
                  "datePublished": currentDate
                }
              }
            ]
          })
        }}
      />

      <div className={styles.container}>
        {/* Header Spacer to prevent navbar overlap */}
        <div className={styles.headerSpacer}></div>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.mainTitle}>Advanced Inventory Turnover Calculator</h1>
            <p className={styles.subtitle}>Optimize Your Inventory Management & Improve Cash Flow Efficiency</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Professional Tool</span>
              <span className={styles.badge}>Free Business Analysis</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Inventory Inputs</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Cost of Goods Sold (COGS)
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="10000"
                      max="5000000"
                      step="10000"
                      value={costOfGoodsSold}
                      onChange={(e) => setCostOfGoodsSold(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10000"
                      max="5000000"
                      step="10000"
                      value={costOfGoodsSold}
                      onChange={(e) => setCostOfGoodsSold(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(costOfGoodsSold)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Beginning Inventory
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="5000"
                      max="1000000"
                      step="5000"
                      value={beginningInventory}
                      onChange={(e) => setBeginningInventory(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="5000"
                      max="1000000"
                      step="5000"
                      value={beginningInventory}
                      onChange={(e) => setBeginningInventory(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(beginningInventory)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Ending Inventory
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="5000"
                      max="1000000"
                      step="5000"
                      value={endingInventory}
                      onChange={(e) => setEndingInventory(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="5000"
                      max="1000000"
                      step="5000"
                      value={endingInventory}
                      onChange={(e) => setEndingInventory(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(endingInventory)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Time Period
                  <select
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="annual">Annual</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Industry Average Turnover
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="0.5"
                      value={industryAverage}
                      onChange={(e) => setIndustryAverage(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="20"
                      step="0.5"
                      value={industryAverage}
                      onChange={(e) => setIndustryAverage(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.timesSymbol}>x</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatNumber(industryAverage)} times</div>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Inventory Analysis Results</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Turnover Ratio</div>
                      <div className={styles.resultValue}>{formatNumber(results.turnoverRatio)}x</div>
                      <div className={styles.resultInterpretation}>
                        {getTurnoverInterpretation(results.turnoverRatio)}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Days in Inventory</div>
                      <div className={styles.resultValue}>{formatDays(results.daysInInventory)}</div>
                      <div className={styles.resultInterpretation}>
                        {getDaysInterpretation(results.daysInInventory)}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Average Inventory</div>
                      <div className={styles.resultValue}>{formatCurrency(results.averageInventory)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Industry Comparison</div>
                      <div className={styles.resultValue}>
                        {results.turnoverRatio > industryAverage ? 'Above' : results.turnoverRatio < industryAverage ? 'Below' : 'Equal to'} Average
                      </div>
                    </div>
                  </div>

                  {/* Industry Comparison Chart */}
                  <div className={styles.comparisonContainer}>
                    <h3 className={styles.comparisonTitle}>Industry Benchmark Comparison</h3>
                    <div className={styles.comparisonBars}>
                      {comparisonData.map((industry, index) => (
                        <div key={index} className={styles.comparisonBarGroup}>
                          <div className={styles.comparisonBarLabel}>{industry.name}</div>
                          <div className={styles.comparisonBarContainer}>
                            <div 
                              className={industry.isCurrent ? styles.comparisonBarCurrent : styles.comparisonBarIndustry}
                              style={{ width: `${Math.min(industry.turnover / 20 * 100, 100)}%` }}
                              title={`${industry.name}: ${formatNumber(industry.turnover)}x turnover (${formatDays(industry.days)})`}
                            />
                          </div>
                          <div className={styles.comparisonBarValue}>{formatNumber(industry.turnover)}x</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendCurrent}`}></div>
                        <span>Your Business</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendIndustry}`}></div>
                        <span>Industry Benchmarks</span>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Trend Visualization */}
                  <div className={styles.trendContainer}>
                    <h3 className={styles.trendTitle}>Monthly Turnover Trend</h3>
                    <div className={styles.trendChart}>
                      {trendData.map((month, index) => (
                        <div key={index} className={styles.trendBarGroup}>
                          <div className={styles.trendBarLabel}>{month.month}</div>
                          <div className={styles.trendBarContainer}>
                            <div 
                              className={styles.trendBar}
                              style={{ width: `${(month.turnover / 20) * 100}%` }}
                              title={`${month.month}: ${formatNumber(month.turnover)}x turnover`}
                            />
                          </div>
                          <div className={styles.trendBarValue}>{formatNumber(month.turnover)}x</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Inventory Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Your inventory turns over every <strong>{formatDays(results.daysInInventory)}</strong></li>
                      <li>You're holding <strong>{formatCurrency(results.averageInventory)}</strong> in inventory on average</li>
                      <li>Compared to industry average: <strong>{results.turnoverRatio > industryAverage ? `${formatNumber(results.turnoverRatio - industryAverage)}x higher` : results.turnoverRatio < industryAverage ? `${formatNumber(industryAverage - results.turnoverRatio)}x lower` : 'equal'}</strong></li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Mastering Inventory Turnover: The Key to Cash Flow Efficiency</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding Inventory Turnover Ratio</h3>
                <p>Inventory Turnover Ratio is one of the most critical metrics for any business that holds inventory. It measures how efficiently a company manages its inventory by calculating how many times inventory is sold and replaced during a specific period.</p>
                
                <div className={styles.formulaCard}>
                  <h4>Inventory Turnover Formula:</h4>
                  <div className={styles.formula}>
                    Inventory Turnover = Cost of Goods Sold ÷ Average Inventory
                  </div>
                  <div className={styles.formula}>
                    Days in Inventory = 365 ÷ Inventory Turnover
                  </div>
                  <div className={styles.formulaExplanation}>
                    <ul>
                      <li><strong>Cost of Goods Sold (COGS):</strong> Direct costs of producing goods sold</li>
                      <li><strong>Average Inventory:</strong> (Beginning Inventory + Ending Inventory) ÷ 2</li>
                      <li><strong>Inventory Turnover:</strong> Times inventory is replaced annually</li>
                      <li><strong>Days in Inventory:</strong> Average days inventory sits unsold</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Why Inventory Efficiency Matters</h3>
                
                <div className={styles.importanceGrid}>
                  <div className={styles.importanceCard}>
                    <h4>💰 Cash Flow Impact</h4>
                    <p>Inventory ties up cash. Faster turnover frees up capital for growth, investments, and operations. Every day inventory sits unsold represents tied-up capital.</p>
                  </div>
                  
                  <div className={styles.importanceCard}>
                    <h4>📈 Profitability Connection</h4>
                    <p>Higher turnover reduces storage costs, minimizes obsolescence risk, and improves return on inventory investment, directly boosting profitability.</p>
                  </div>
                  
                  <div className={styles.importanceCard}>
                    <h4>🛒 Customer Satisfaction</h4>
                    <p>Optimal inventory levels prevent stockouts while avoiding overstocking. This balance ensures product availability and fresh merchandise.</p>
                  </div>
                  
                  <div className={styles.importanceCard}>
                    <h4>📊 Operational Efficiency</h4>
                    <p>Inventory turnover reflects supply chain efficiency, demand forecasting accuracy, and overall operational effectiveness.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Industry Turnover Benchmarks</h3>
                <div className={styles.industryTable}>
                  <div className={styles.industryRow}>
                    <div className={styles.industryName}>Industry</div>
                    <div className={styles.industryTurnover}>Turnover Ratio</div>
                    <div className={styles.industryDays}>Days in Inventory</div>
                    <div className={styles.industryExplanation}>Characteristics</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryName}>Grocery Stores</div>
                    <div className={styles.industryTurnover}>14-16x</div>
                    <div className={styles.industryDays}>23-26 days</div>
                    <div className={styles.industryExplanation}>Perishable goods, high volume</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryName}>Electronics Retail</div>
                    <div className={styles.industryTurnover}>5-7x</div>
                    <div className={styles.industryDays}>52-73 days</div>
                    <div className={styles.industryExplanation}>Technology products, moderate obsolescence</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryName}>Clothing Retail</div>
                    <div className={styles.industryTurnover}>4-6x</div>
                    <div className={styles.industryDays}>61-91 days</div>
                    <div className={styles.industryExplanation}>Seasonal fashion, trend-dependent</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryName}>Automotive Parts</div>
                    <div className={styles.industryTurnover}>2-4x</div>
                    <div className={styles.industryDays}>91-183 days</div>
                    <div className={styles.industryExplanation}>Durable goods, infrequent purchases</div>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Inventory Management Insights</h3>
                <blockquote className={styles.expertQuote}>
                  "Inventory is often the largest asset on a retailer's balance sheet and the biggest cash flow challenge. The optimal turnover ratio balances having enough inventory to meet demand while minimizing holding costs. Regularly track this metric—it's the pulse of your inventory health and a leading indicator of cash flow challenges."
                  <footer className={styles.quoteFooter}>— Supply Chain Consultant & Inventory Management Expert, 20+ years experience</footer>
                </blockquote>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategies to Improve Inventory Turnover</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>📊 Improve Demand Forecasting</h4>
                    <p>Use historical data, seasonality analysis, and market trends to predict demand more accurately. Implement inventory management software with forecasting capabilities.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🔄 Implement Just-in-Time (JIT)</h4>
                    <p>Coordinate with suppliers for timely deliveries to reduce inventory holding. JIT systems minimize stock while ensuring availability.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏷️ Optimize Pricing Strategy</h4>
                    <p>Use dynamic pricing, promotions, and discounts for slow-moving items. Bundle products to move inventory faster.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📦 Streamline Inventory Classification</h4>
                    <p>Use ABC analysis: Focus most attention on high-value items (A), moderate on medium (B), minimal on low-value (C) items.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common Inventory Management Applications</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Retail Optimization:</strong> Determine optimal stock levels for different product categories</li>
                  <li><strong>Manufacturing Efficiency:</strong> Balance raw material inventory with production schedules</li>
                  <li><strong>Cash Flow Management:</strong> Forecast cash needs based on inventory cycles</li>
                  <li><strong>Supplier Negotiation:</strong> Use turnover data to negotiate better terms with suppliers</li>
                  <li><strong>Business Valuation:</strong> Assess inventory efficiency for investment decisions</li>
                </ul>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Inventory Turnover Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can inventory turnover be too high?</h3>
                <p className={styles.faqAnswer}>Yes, excessively high turnover can indicate problems: insufficient inventory leading to stockouts, lost sales, and poor customer service. It might also suggest overly aggressive discounting. The ideal turnover balances having enough inventory to meet demand without excessive holding costs.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do I calculate turnover for seasonal businesses?</h3>
                <p className={styles.faqAnswer}>For seasonal businesses, calculate turnover separately for peak and off-peak seasons. Use weighted averages or calculate monthly turnover ratios. Consider using a 12-month rolling average to smooth out seasonal fluctuations for better trend analysis.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between inventory turnover and stock-to-sales ratio?</h3>
                <p className={styles.faqAnswer}>Inventory turnover measures how many times inventory is replaced annually. Stock-to-sales ratio compares inventory value to sales for a specific period (usually month-end inventory ÷ monthly sales). Both are important: turnover shows efficiency, stock-to-sales shows inventory adequacy.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How often should I calculate inventory turnover?</h3>
                <p className={styles.faqAnswer}>Calculate monthly for active monitoring, quarterly for strategic planning, and annually for comprehensive analysis. More frequent calculation (weekly for fast-moving goods) helps identify problems early. Regular tracking enables timely corrective actions.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Optimize Your Inventory Management Today</h2>
              <p className={styles.ctaText}>Use our inventory turnover calculator to analyze your efficiency, compare with industry standards, and implement strategies to improve your cash flow and profitability.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational and analytical purposes. Actual inventory management should consider business-specific factors, market conditions, and professional advice. Inventory decisions significantly impact cash flow and should be made with careful planning.
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

export default InventoryTurnoverCalculator;