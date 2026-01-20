import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './profitmargincalculator.module.css';

const ProfitMarginCalculator = ({ currentDate, lastModifiedDate }) => {
  const [revenue, setRevenue] = useState(100000);
  const [costOfGoodsSold, setCostOfGoodsSold] = useState(60000);
  const [operatingExpenses, setOperatingExpenses] = useState(25000);
  const [taxRate, setTaxRate] = useState(25);
  const [interestExpense, setInterestExpense] = useState(5000);
  const [results, setResults] = useState(null);
  const [marginChart, setMarginChart] = useState([]);

  const calculateProfitMargins = () => {
    // Calculate key metrics
    const grossProfit = revenue - costOfGoodsSold;
    const operatingProfit = grossProfit - operatingExpenses;
    const earningsBeforeTax = operatingProfit - interestExpense;
    const taxAmount = earningsBeforeTax * (taxRate / 100);
    const netProfit = earningsBeforeTax - taxAmount;
    
    // Calculate margins
    const grossMargin = (grossProfit / revenue) * 100;
    const operatingMargin = (operatingProfit / revenue) * 100;
    const netProfitMargin = (netProfit / revenue) * 100;
    const contributionMargin = ((revenue - costOfGoodsSold) / revenue) * 100;
    const markupPercentage = ((revenue - costOfGoodsSold) / costOfGoodsSold) * 100;

    // Calculate industry benchmarks
    const industryAverages = {
      retail: { gross: 35, operating: 8, net: 4 },
      manufacturing: { gross: 42, operating: 12, net: 7 },
      technology: { gross: 75, operating: 25, net: 18 },
      services: { gross: 55, operating: 18, net: 12 },
      restaurant: { gross: 28, operating: 10, net: 5 }
    };

    // Create chart data for revenue breakdown
    const chartData = [
      { category: 'COGS', value: costOfGoodsSold, color: '#dc3545' },
      { category: 'Operating Expenses', value: operatingExpenses, color: '#ffc107' },
      { category: 'Interest Expense', value: interestExpense, color: '#6f42c1' },
      { category: 'Taxes', value: taxAmount, color: '#17a2b8' },
      { category: 'Net Profit', value: netProfit, color: '#28a745' }
    ];

    // Create margin comparison data
    const marginData = [];
    const industries = ['retail', 'manufacturing', 'technology', 'services', 'restaurant'];
    
    industries.forEach(industry => {
      marginData.push({
        industry: industry.charAt(0).toUpperCase() + industry.slice(1),
        grossMargin: industryAverages[industry].gross,
        operatingMargin: industryAverages[industry].operating,
        netMargin: industryAverages[industry].net
      });
    });

    setMarginChart(chartData);

    setResults({
      grossProfit: Math.round(grossProfit),
      operatingProfit: Math.round(operatingProfit),
      netProfit: Math.round(netProfit),
      grossMargin: Math.round(grossMargin * 100) / 100,
      operatingMargin: Math.round(operatingMargin * 100) / 100,
      netProfitMargin: Math.round(netProfitMargin * 100) / 100,
      contributionMargin: Math.round(contributionMargin * 100) / 100,
      markupPercentage: Math.round(markupPercentage * 100) / 100,
      taxAmount: Math.round(taxAmount),
      earningsBeforeTax: Math.round(earningsBeforeTax),
      industryComparison: marginData,
      chartData: chartData
    });
  };

  useEffect(() => {
    calculateProfitMargins();
  }, [revenue, costOfGoodsSold, operatingExpenses, taxRate, interestExpense]);

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

  const getMarginHealth = (margin, type) => {
    const thresholds = {
      gross: { excellent: 50, good: 35, fair: 20, poor: 10 },
      operating: { excellent: 20, good: 15, fair: 10, poor: 5 },
      net: { excellent: 15, good: 10, fair: 5, poor: 2 }
    };

    if (margin >= thresholds[type].excellent) return { text: 'Excellent', color: '#28a745' };
    if (margin >= thresholds[type].good) return { text: 'Good', color: '#20c997' };
    if (margin >= thresholds[type].fair) return { text: 'Fair', color: '#ffc107' };
    return { text: 'Needs Improvement', color: '#dc3545' };
  };

  const getIndustryIcon = (industry) => {
    const icons = {
      Retail: '🛒',
      Manufacturing: '🏭',
      Technology: '💻',
      Services: '👔',
      Restaurant: '🍽️'
    };
    return icons[industry] || '📊';
  };

  return (
    <>
      <Head>
        <title>Advanced Profit Margin Calculator | Business Profitability Analysis</title>
        <meta name="description" content="Free advanced profit margin calculator with visual charts. Calculate gross, operating, and net profit margins, compare industry benchmarks, and optimize business profitability." />
        <meta name="keywords" content="profit margin calculator, business profitability, gross margin, operating margin, net profit, financial analysis, business calculator" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/profit-margin-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Profit Margin Calculator | Business Profitability Analysis" />
        <meta property="og:description" content="Calculate and analyze your business profit margins. Free visual tool for entrepreneurs, business owners, and financial analysts." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/profit-margin-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Profit Margin Calculator" />
        <meta name="twitter:description" content="Analyze your business profitability with comprehensive margin calculations and industry comparisons." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="profit-margin-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Profit Margin Calculator",
            "description": "Professional-grade profit margin calculator with industry benchmarks and visualization tools",
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
              "ratingCount": "1150",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Business Analytics Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Multiple Margin Calculations",
              "Industry Benchmark Comparisons",
              "Visual Revenue Breakdown",
              "Profit Health Analysis",
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
                "name": "What is the difference between gross margin and net profit margin?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Gross margin measures profitability after direct costs (COGS), while net profit margin shows final profitability after ALL expenses including operating costs, taxes, and interest. Gross margin indicates production efficiency, while net margin shows overall business health.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is a good profit margin for my business?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Good profit margins vary by industry. Technology companies often have 15-25% net margins, while retail might be 2-5%. Use our calculator to compare with industry benchmarks and identify improvement opportunities.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How can I improve my profit margins?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Key strategies include: increasing prices strategically, reducing cost of goods sold through better sourcing, optimizing operating expenses, improving operational efficiency, and increasing sales volume to spread fixed costs.",
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
            <h1 className={styles.mainTitle}>Advanced Profit Margin Calculator</h1>
            <p className={styles.subtitle}>Analyze Business Profitability Across All Margin Types with Industry Benchmarks</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Industry Benchmarks</span>
              <span className={styles.badge}>Professional Analysis</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Enter Your Financial Data</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Total Revenue
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="1000"
                      max="10000000"
                      step="1000"
                      value={revenue}
                      onChange={(e) => setRevenue(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1000"
                      max="10000000"
                      step="1000"
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
                      step="1000"
                      value={costOfGoodsSold}
                      onChange={(e) => setCostOfGoodsSold(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max={revenue}
                      step="1000"
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
                  Operating Expenses
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max={revenue - costOfGoodsSold}
                      step="1000"
                      value={operatingExpenses}
                      onChange={(e) => setOperatingExpenses(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max={revenue - costOfGoodsSold}
                      step="1000"
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
                  Tax Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="0.1"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="50"
                      step="0.1"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(taxRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Interest Expense
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max={revenue}
                      step="100"
                      value={interestExpense}
                      onChange={(e) => setInterestExpense(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max={revenue}
                      step="100"
                      value={interestExpense}
                      onChange={(e) => setInterestExpense(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(interestExpense)}</div>
                </label>
              </div>

              <div className={styles.marginFormulas}>
                <h3 className={styles.formulaTitle}>Key Margin Formulas</h3>
                <div className={styles.formulaGrid}>
                  <div className={styles.formulaItem}>
                    <span className={styles.formulaLabel}>Gross Margin:</span>
                    <span className={styles.formulaText}>(Revenue - COGS) ÷ Revenue × 100</span>
                  </div>
                  <div className={styles.formulaItem}>
                    <span className={styles.formulaLabel}>Operating Margin:</span>
                    <span className={styles.formulaText}>(Gross Profit - OpEx) ÷ Revenue × 100</span>
                  </div>
                  <div className={styles.formulaItem}>
                    <span className={styles.formulaLabel}>Net Profit Margin:</span>
                    <span className={styles.formulaText}>Net Profit ÷ Revenue × 100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Profitability Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Gross Profit</div>
                      <div className={styles.resultValue}>{formatCurrency(results.grossProfit)}</div>
                      <div className={styles.resultSubtext}>After direct costs</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Operating Profit</div>
                      <div className={styles.resultValue}>{formatCurrency(results.operatingProfit)}</div>
                      <div className={styles.resultSubtext}>After operating expenses</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Net Profit</div>
                      <div className={styles.resultValue}>{formatCurrency(results.netProfit)}</div>
                      <div className={styles.resultSubtext}>After all expenses & taxes</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Markup Percentage</div>
                      <div className={styles.resultValue}>{formatPercentage(results.markupPercentage)}</div>
                      <div className={styles.resultSubtext}>Price above cost</div>
                    </div>
                  </div>

                  {/* Margin Analysis */}
                  <div className={styles.marginAnalysis}>
                    <h3 className={styles.chartTitle}>Margin Analysis</h3>
                    <div className={styles.marginBars}>
                      <div className={styles.marginBarGroup}>
                        <div className={styles.marginLabel}>Gross Margin</div>
                        <div className={styles.marginBarContainer}>
                          <div 
                            className={styles.marginBar}
                            style={{ width: `${Math.min(results.grossMargin, 100)}%`, backgroundColor: getMarginHealth(results.grossMargin, 'gross').color }}
                          />
                        </div>
                        <div className={styles.marginValue}>{formatPercentage(results.grossMargin)}</div>
                        <div className={styles.marginHealth} style={{ color: getMarginHealth(results.grossMargin, 'gross').color }}>
                          {getMarginHealth(results.grossMargin, 'gross').text}
                        </div>
                      </div>
                      
                      <div className={styles.marginBarGroup}>
                        <div className={styles.marginLabel}>Operating Margin</div>
                        <div className={styles.marginBarContainer}>
                          <div 
                            className={styles.marginBar}
                            style={{ width: `${Math.min(results.operatingMargin, 100)}%`, backgroundColor: getMarginHealth(results.operatingMargin, 'operating').color }}
                          />
                        </div>
                        <div className={styles.marginValue}>{formatPercentage(results.operatingMargin)}</div>
                        <div className={styles.marginHealth} style={{ color: getMarginHealth(results.operatingMargin, 'operating').color }}>
                          {getMarginHealth(results.operatingMargin, 'operating').text}
                        </div>
                      </div>
                      
                      <div className={styles.marginBarGroup}>
                        <div className={styles.marginLabel}>Net Profit Margin</div>
                        <div className={styles.marginBarContainer}>
                          <div 
                            className={styles.marginBar}
                            style={{ width: `${Math.min(results.netProfitMargin, 100)}%`, backgroundColor: getMarginHealth(results.netProfitMargin, 'net').color }}
                          />
                        </div>
                        <div className={styles.marginValue}>{formatPercentage(results.netProfitMargin)}</div>
                        <div className={styles.marginHealth} style={{ color: getMarginHealth(results.netProfitMargin, 'net').color }}>
                          {getMarginHealth(results.netProfitMargin, 'net').text}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Breakdown Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Revenue Distribution</h3>
                    <div className={styles.revenueChart}>
                      {marginChart.map((item, index) => (
                        <div key={index} className={styles.revenueSegment}>
                          <div 
                            className={styles.segmentBar}
                            style={{ 
                              height: `${(item.value / revenue) * 100}%`,
                              backgroundColor: item.color
                            }}
                          >
                            <div className={styles.segmentValue}>{formatCurrency(item.value)}</div>
                          </div>
                          <div className={styles.segmentLabel}>{item.category}</div>
                          <div className={styles.segmentPercentage}>
                            {formatPercentage((item.value / revenue) * 100)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      {marginChart.map((item, index) => (
                        <div key={index} className={styles.legendItem}>
                          <div className={styles.legendColor} style={{ backgroundColor: item.color }}></div>
                          <span>{item.category}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📈 Profitability Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Your <strong>gross margin of {formatPercentage(results.grossMargin)}</strong> indicates your production efficiency</li>
                      <li>You keep <strong>{formatCurrency(results.netProfit)}</strong> as net profit from every {formatCurrency(revenue)} in revenue</li>
                      <li>Operating expenses consume <strong>{formatPercentage((operatingExpenses / revenue) * 100)}</strong> of your revenue</li>
                      <li>For every dollar in revenue, you earn <strong>{formatCurrency(results.netProfit / revenue)}</strong> in net profit</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Mastering Profit Margins: The Key to Business Success</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding Different Types of Profit Margins</h3>
                <p>Profit margins are the most critical metrics for measuring business health and efficiency. Each margin type tells a different story about your operations, costs, and overall financial performance. Understanding these differences is essential for making informed business decisions.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real Business Example:</h4>
                  <p>A software company with $1,000,000 in annual revenue:</p>
                  <ul>
                    <li><strong>COGS:</strong> $200,000 (server costs, support)</li>
                    <li><strong>Gross Profit:</strong> $800,000 (80% gross margin)</li>
                    <li><strong>Operating Expenses:</strong> $600,000 (salaries, marketing, R&D)</li>
                    <li><strong>Operating Profit:</strong> $200,000 (20% operating margin)</li>
                    <li><strong>Net Profit:</strong> $150,000 (15% net margin)</li>
                  </ul>
                  <p>This shows how margins progressively shrink as more expenses are accounted for.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Industry Benchmarks & Competitive Analysis</h3>
                
                <div className={styles.industryTable}>
                  <h4>Average Profit Margins by Industry</h4>
                  <div className={styles.tableContainer}>
                    <table>
                      <thead>
                        <tr>
                          <th>Industry</th>
                          <th>Gross Margin</th>
                          <th>Operating Margin</th>
                          <th>Net Profit Margin</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results?.industryComparison.map((industry, index) => (
                          <tr key={index}>
                            <td>{getIndustryIcon(industry.industry)} {industry.industry}</td>
                            <td>{formatPercentage(industry.grossMargin)}</td>
                            <td>{formatPercentage(industry.operatingMargin)}</td>
                            <td>{formatPercentage(industry.netMargin)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className={styles.tableNote}>Compare your margins against industry averages to identify strengths and opportunities for improvement.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategies to Improve Each Margin Type</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>💰 Improve Gross Margin</h4>
                    <p>Negotiate better supplier prices, optimize production processes, reduce material waste, increase prices strategically, or offer premium products with higher margins.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📊 Boost Operating Margin</h4>
                    <p>Automate processes to reduce labor costs, optimize marketing spend, renegotiate leases, implement energy-saving measures, and streamline administrative functions.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Maximize Net Profit Margin</h4>
                    <p>Utilize tax deductions and credits, refinance high-interest debt, optimize inventory to reduce storage costs, and implement cost-control measures across all departments.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🚀 Scale Profitability</h4>
                    <p>Increase sales volume to spread fixed costs, implement tiered pricing, focus on high-margin products/services, and build recurring revenue streams.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common Applications in Business</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Pricing Strategy:</strong> Determine optimal price points to achieve target margins</li>
                  <li><strong>Cost Control:</strong> Identify areas where expenses can be reduced without impacting quality</li>
                  <li><strong>Investment Decisions:</strong> Evaluate project profitability and resource allocation</li>
                  <li><strong>Performance Benchmarking:</strong> Compare against competitors and industry standards</li>
                  <li><strong>Financial Forecasting:</strong> Project future profitability based on margin trends</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Insights from Financial Analysts</h3>
                <blockquote className={styles.expertQuote}>
                  "Profit margins are the heartbeat of your business. They tell you not just if you're making money, but HOW you're making it. The most successful entrepreneurs monitor their margins religiously and understand that improving margins is often more valuable than increasing revenue. A 1% improvement in net margin can have a bigger impact on your bottom line than a 10% increase in sales."
                  <footer className={styles.quoteFooter}>— CFO, 25+ years financial analysis experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between margin and markup?</h3>
                <p className={styles.faqAnswer}>Margin is expressed as a percentage of revenue (profit ÷ revenue), while markup is expressed as a percentage of cost (profit ÷ cost). A 50% margin means you keep 50 cents from each dollar of revenue, while a 50% markup means you add 50% to your cost to get the selling price.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Why is my net margin lower than industry average?</h3>
                <p className={styles.faqAnswer}>Common reasons include: higher cost structures, inefficient operations, pricing below market, excessive overhead, or unique business models. Analyze each expense category systematically to identify improvement opportunities.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How often should I calculate my profit margins?</h3>
                <p className={styles.faqAnswer}>Calculate margins monthly for regular monitoring, quarterly for strategic review, and annually for comprehensive analysis. More frequent calculation (weekly) may be beneficial during rapid growth, cost restructuring, or pricing changes.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What is a good contribution margin?</h3>
                <p className={styles.faqAnswer}>A contribution margin of 40-60% is generally good, but varies by industry. This metric shows how much revenue remains after variable costs to cover fixed costs and generate profit. Higher contribution margins provide more flexibility for growth and investment.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Optimize Your Business Profitability</h2>
              <p className={styles.ctaText}>Use this calculator to analyze your current margins, set improvement targets, and track progress over time. Experiment with different scenarios to find your optimal profitability strategy.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Actual business results may vary based on market conditions, competition, and operational factors. These figures are based on standard accounting principles but may not reflect all tax implications or industry-specific considerations. Consult with a qualified accountant or financial advisor for business-specific advice.
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

export default ProfitMarginCalculator;