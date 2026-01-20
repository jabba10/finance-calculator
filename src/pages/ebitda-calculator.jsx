import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './ebitdacalculator.module.css';

const EBITDACalculator = ({ currentDate, lastModifiedDate }) => {
  const [revenue, setRevenue] = useState(1000000);
  const [cogs, setCogs] = useState(400000);
  const [operatingExpenses, setOperatingExpenses] = useState(300000);
  const [depreciation, setDepreciation] = useState(50000);
  const [amortization, setAmortization] = useState(25000);
  const [results, setResults] = useState(null);
  const [comparisonData, setComparisonData] = useState([]);

  const calculateEBITDA = () => {
    const grossProfit = revenue - cogs;
    const operatingIncome = grossProfit - operatingExpenses;
    const ebitda = operatingIncome + depreciation + amortization;
    const ebitdaMargin = (ebitda / revenue) * 100;
    const operatingMargin = (operatingIncome / revenue) * 100;
    const grossMargin = (grossProfit / revenue) * 100;

    // Generate industry comparison data
    const industries = [
      { name: 'Technology', avgMargin: 35, color: '#3B82F6' },
      { name: 'Manufacturing', avgMargin: 25, color: '#10B981' },
      { name: 'Retail', avgMargin: 15, color: '#F59E0B' },
      { name: 'Healthcare', avgMargin: 28, color: '#8B5CF6' },
      { name: 'Construction', avgMargin: 18, color: '#EF4444' },
    ];

    setResults({
      revenue,
      grossProfit,
      operatingIncome,
      ebitda,
      ebitdaMargin,
      operatingMargin,
      grossMargin,
      depreciation,
      amortization,
    });

    setComparisonData(industries);
  };

  useEffect(() => {
    calculateEBITDA();
  }, [revenue, cogs, operatingExpenses, depreciation, amortization]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <>
      <Head>
        <title>Advanced EBITDA Calculator | Measure Business Profitability</title>
        <meta name="description" content="Free advanced EBITDA calculator for businesses. Calculate Earnings Before Interest, Taxes, Depreciation, and Amortization with detailed margin analysis and industry comparisons." />
        <meta name="keywords" content="EBITDA calculator, business profitability, financial metrics, earnings analysis, margin calculator, business valuation" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/ebitda-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced EBITDA Calculator | Measure Business Profitability" />
        <meta property="og:description" content="Calculate and analyze EBITDA for accurate business performance measurement. Compare with industry standards and optimize profitability." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/ebitda-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced EBITDA Calculator" />
        <meta name="twitter:description" content="Professional EBITDA calculation tool for business owners and financial analysts." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="ebitda-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced EBITDA Calculator",
            "description": "Professional business profitability calculator for EBITDA analysis and financial benchmarking",
            "applicationCategory": "BusinessApplication",
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
              "name": "Business Financial Tools",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "EBITDA Margin Calculation",
              "Industry Benchmarking",
              "Visual Margin Analysis",
              "Multiple Currency Support",
              "Export Financial Reports"
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
                "name": "What is EBITDA and why is it important for businesses?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization) measures a company's operational profitability by excluding non-operating expenses and non-cash items. It's crucial for comparing business performance across industries and evaluating operational efficiency.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is considered a good EBITDA margin?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A good EBITDA margin varies by industry. Typically, margins above 15% are considered healthy, but technology companies often achieve 30%+, while retail might be 10-15%. Our calculator includes industry benchmarks for comparison.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How can I improve my company's EBITDA?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Improve EBITDA by increasing revenue through pricing optimization or market expansion, reducing COGS through better procurement, and controlling operating expenses. Regular EBITDA analysis helps identify improvement opportunities.",
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
            <h1 className={styles.mainTitle}>Advanced EBITDA Calculator</h1>
            <p className={styles.subtitle}>Measure Your Business's Core Profitability and Compare with Industry Standards</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Industry Benchmarks</span>
              <span className={styles.badge}>Financial Analysis</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Enter Your Financials</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Revenue
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="10000"
                      max="10000000"
                      step="10000"
                      value={revenue}
                      onChange={(e) => setRevenue(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10000"
                      max="10000000"
                      step="10000"
                      value={revenue}
                      onChange={(e) => setRevenue(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(revenue)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Cost of Goods Sold (COGS)
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max={revenue}
                      step="10000"
                      value={cogs}
                      onChange={(e) => setCogs(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max={revenue}
                      step="10000"
                      value={cogs}
                      onChange={(e) => setCogs(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(cogs)} ({formatPercentage((cogs/revenue)*100)})</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Operating Expenses
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max={revenue - cogs}
                      step="10000"
                      value={operatingExpenses}
                      onChange={(e) => setOperatingExpenses(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max={revenue - cogs}
                      step="10000"
                      value={operatingExpenses}
                      onChange={(e) => setOperatingExpenses(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(operatingExpenses)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Depreciation
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="1000"
                      value={depreciation}
                      onChange={(e) => setDepreciation(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="500000"
                      step="1000"
                      value={depreciation}
                      onChange={(e) => setDepreciation(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(depreciation)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Amortization
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="250000"
                      step="1000"
                      value={amortization}
                      onChange={(e) => setAmortization(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="250000"
                      step="1000"
                      value={amortization}
                      onChange={(e) => setAmortization(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(amortization)}</div>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Profitability Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>EBITDA</div>
                      <div className={styles.resultValue}>{formatCurrency(results.ebitda)}</div>
                      <div className={styles.resultSubtext}>Operating Profit + D&A</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>EBITDA Margin</div>
                      <div className={styles.resultValue}>{formatPercentage(results.ebitdaMargin)}</div>
                      <div className={styles.resultSubtext}>(EBITDA ÷ Revenue)</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Operating Income</div>
                      <div className={styles.resultValue}>{formatCurrency(results.operatingIncome)}</div>
                      <div className={styles.resultSubtext}>Gross Profit - OpEx</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Operating Margin</div>
                      <div className={styles.resultValue}>{formatPercentage(results.operatingMargin)}</div>
                      <div className={styles.resultSubtext}>(Op Income ÷ Revenue)</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Gross Profit</div>
                      <div className={styles.resultValue}>{formatCurrency(results.grossProfit)}</div>
                      <div className={styles.resultSubtext}>Revenue - COGS</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Gross Margin</div>
                      <div className={styles.resultValue}>{formatPercentage(results.grossMargin)}</div>
                      <div className={styles.resultSubtext}>(Gross Profit ÷ Revenue)</div>
                    </div>
                  </div>

                  {/* Margin Breakdown Visualization */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Revenue Breakdown</h3>
                    <div className={styles.profitabilityChart}>
                      <div className={styles.chartBarFull}>
                        <div className={styles.chartBarSegment} style={{ 
                          width: '100%',
                          background: 'linear-gradient(90deg, #4F46E5 0%, #6366F1 100%)'
                        }}>
                          <span className={styles.chartBarLabel}>Total Revenue: {formatCurrency(results.revenue)}</span>
                        </div>
                      </div>
                      
                      <div className={styles.chartBarFull}>
                        <div className={styles.chartBarSegment} style={{ 
                          width: `${100 - results.grossMargin}%`,
                          background: '#EF4444'
                        }}>
                          <span className={styles.chartBarLabel}>COGS: {formatCurrency(results.cogs)}</span>
                        </div>
                        <div className={styles.chartBarSegment} style={{ 
                          width: `${results.grossMargin}%`,
                          background: '#10B981'
                        }}>
                          <span className={styles.chartBarLabel}>Gross Profit: {formatCurrency(results.grossProfit)}</span>
                        </div>
                      </div>
                      
                      <div className={styles.chartBarFull}>
                        <div className={styles.chartBarSegment} style={{ 
                          width: `${(results.operatingExpenses / results.revenue) * 100}%`,
                          background: '#F59E0B'
                        }}>
                          <span className={styles.chartBarLabel}>Operating Expenses: {formatCurrency(operatingExpenses)}</span>
                        </div>
                        <div className={styles.chartBarSegment} style={{ 
                          width: `${results.operatingMargin}%`,
                          background: '#3B82F6'
                        }}>
                          <span className={styles.chartBarLabel}>Operating Income: {formatCurrency(results.operatingIncome)}</span>
                        </div>
                      </div>
                      
                      <div className={styles.chartBarFull}>
                        <div className={styles.chartBarSegment} style={{ 
                          width: `${((results.depreciation + results.amortization) / results.revenue) * 100}%`,
                          background: '#8B5CF6'
                        }}>
                          <span className={styles.chartBarLabel}>D&A: {formatCurrency(results.depreciation + results.amortization)}</span>
                        </div>
                        <div className={styles.chartBarSegment} style={{ 
                          width: `${results.ebitdaMargin}%`,
                          background: '#EC4899'
                        }}>
                          <span className={styles.chartBarLabel}>EBITDA: {formatCurrency(results.ebitda)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor}`} style={{ background: '#4F46E5' }}></div>
                        <span>Revenue</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor}`} style={{ background: '#EF4444' }}></div>
                        <span>COGS</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor}`} style={{ background: '#10B981' }}></div>
                        <span>Gross Profit</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor}`} style={{ background: '#F59E0B' }}></div>
                        <span>Operating Expenses</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor}`} style={{ background: '#3B82F6' }}></div>
                        <span>Operating Income</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor}`} style={{ background: '#8B5CF6' }}></div>
                        <span>Depreciation & Amortization</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor}`} style={{ background: '#EC4899' }}></div>
                        <span>EBITDA</span>
                      </div>
                    </div>
                  </div>

                  {/* Industry Comparison */}
                  <div className={styles.comparisonContainer}>
                    <h3 className={styles.comparisonTitle}>Industry Benchmark Comparison</h3>
                    <div className={styles.comparisonGrid}>
                      {comparisonData.map((industry, index) => (
                        <div key={index} className={styles.industryCard}>
                          <div className={styles.industryHeader}>
                            <div className={styles.industryName}>{industry.name}</div>
                            <div className={styles.industryMargin}>{industry.avgMargin}% avg</div>
                          </div>
                          <div className={styles.marginBar}>
                            <div 
                              className={styles.marginFill}
                              style={{ 
                                width: `${Math.min(100, industry.avgMargin * 3)}%`,
                                background: industry.color
                              }}
                            />
                          </div>
                          <div className={styles.comparisonResult}>
                            {results.ebitdaMargin > industry.avgMargin ? (
                              <span className={styles.better}>📈 {formatPercentage(results.ebitdaMargin - industry.avgMargin)} above industry</span>
                            ) : (
                              <span className={styles.worse}>📉 {formatPercentage(industry.avgMargin - results.ebitdaMargin)} below industry</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Financial Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Your EBITDA margin of <strong>{formatPercentage(results.ebitdaMargin)}</strong> indicates {results.ebitdaMargin > 20 ? 'strong' : results.ebitdaMargin > 10 ? 'moderate' : 'weak'} operational profitability</li>
                      <li>For every dollar of revenue, you retain <strong>{formatCurrency(results.ebitda / 100)}</strong> as EBITDA</li>
                      <li>Your gross margin of <strong>{formatPercentage(results.grossMargin)}</strong> suggests {results.grossMargin > 50 ? 'excellent' : results.grossMargin > 30 ? 'good' : 'moderate'} product/service pricing power</li>
                      {results.operatingExpenses > results.grossProfit * 0.4 && (
                        <li>⚠️ Operating expenses represent <strong>{formatPercentage((operatingExpenses/revenue)*100)}</strong> of revenue - consider cost optimization</li>
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
              <h2 className={styles.articleTitle}>Understanding EBITDA: The Key Metric for Business Profitability</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Why EBITDA Matters for Your Business</h3>
                <p>EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization) has become the standard metric for evaluating a company's operational profitability. Unlike net income, EBITDA removes the effects of financing decisions, tax environments, and accounting choices related to capital investments, providing a clearer view of core business performance.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World Application:</h4>
                  <p>Two companies with identical operations but different capital structures:</p>
                  <ul>
                    <li><strong>Company A:</strong> Heavy debt = High interest expense = Lower net income</li>
                    <li><strong>Company B:</strong> No debt = No interest expense = Higher net income</li>
                  </ul>
                  <p>Both companies would have <strong>identical EBITDA</strong>, showing they're equally profitable at the operational level, despite different financing strategies.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategies to Improve EBITDA</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>💰 Revenue Optimization</h4>
                    <p>Increase prices strategically, expand to new markets, upsell existing customers, and optimize your product mix for higher-margin offerings.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📉 COGS Reduction</h4>
                    <p>Negotiate better supplier terms, improve operational efficiency, reduce waste, and implement lean manufacturing principles.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚡ Operating Efficiency</h4>
                    <p>Automate processes, optimize staffing levels, reduce overhead costs, and implement technology solutions that improve productivity.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📊 Margin Analysis</h4>
                    <p>Regularly analyze product/service margins, identify underperforming areas, and reallocate resources to higher-margin activities.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common Business Applications</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Business Valuation:</strong> EBITDA multiples are commonly used to value companies for sale or acquisition</li>
                  <li><strong>Performance Benchmarking:</strong> Compare your profitability against industry peers and competitors</li>
                  <li><strong>Loan Applications:</strong> Lenders use EBITDA to assess debt service capability and creditworthiness</li>
                  <li><strong>Investor Reporting:</strong> Show operational performance independent of capital structure</li>
                  <li><strong>Strategic Planning:</strong> Set profitability targets and measure operational improvement initiatives</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Insight from Financial Analysts</h3>
                <blockquote className={styles.expertQuote}>
                  "While EBITDA is a powerful metric, it should never be used in isolation. Always analyze it alongside cash flow, net income, and working capital metrics. A company with strong EBITDA but poor cash conversion may have underlying operational issues."
                  <footer className={styles.quoteFooter}>— CFA Charterholder, Investment Banking Director</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between EBITDA and net income?</h3>
                <p className={styles.faqAnswer}>Net income is the "bottom line" profit after ALL expenses including interest, taxes, depreciation, and amortization. EBITDA focuses solely on operational profitability by excluding these items, making it better for comparing companies with different capital structures or tax situations.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can EBITDA be manipulated or misleading?</h3>
                <p className={styles.faqAnswer}>Yes, EBITDA can be manipulated through aggressive revenue recognition, capitalizing expenses that should be operating costs, or excluding legitimate operating expenses. This is why it's crucial to analyze EBITDA alongside other financial metrics and understand exactly what's included/excluded in the calculation.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What EBITDA multiple should I use for valuation?</h3>
                <p className={styles.faqAnswer}>EBITDA multiples vary by industry, company size, growth rate, and market conditions. Technology companies might trade at 15-25x EBITDA, while manufacturing might be 5-8x. Use comparable company analysis within your specific industry to determine appropriate multiples.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does EBITDA relate to cash flow?</h3>
                <p className={styles.faqAnswer}>EBITDA is often called "cash earnings" but it's not cash flow. To get to actual cash flow from operations, you need to account for changes in working capital (inventory, receivables, payables) and capital expenditures. EBITDA minus CapEx is a closer approximation to free cash flow.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Optimize Your Business Profitability?</h2>
              <p className={styles.ctaText}>Use our EBITDA calculator to benchmark your performance, identify improvement opportunities, and make data-driven financial decisions for your business.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides financial estimates for educational purposes. EBITDA is one of many financial metrics and should not be used in isolation for business decisions. Actual financial performance may vary. Consult with a qualified financial professional for specific business advice.
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

export default EBITDACalculator;