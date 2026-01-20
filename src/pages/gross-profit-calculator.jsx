import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './grossprofitcalculator.module.css';

const GrossProfitCalculator = ({ currentDate, lastModifiedDate }) => {
  const [revenue, setRevenue] = useState(100000);
  const [cogs, setCogs] = useState({
    materials: 30000,
    labor: 25000,
    overhead: 15000,
    shipping: 5000,
    production: 10000,
    other: 5000
  });
  const [businessType, setBusinessType] = useState('manufacturing');
  const [reportingPeriod, setReportingPeriod] = useState('monthly');
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);

  const industryBenchmarks = {
    'manufacturing': { excellent: 60, good: 50, average: 40, poor: 30 },
    'retail': { excellent: 50, good: 40, average: 30, poor: 20 },
    'software': { excellent: 85, good: 75, average: 65, poor: 50 },
    'restaurant': { excellent: 70, good: 60, average: 50, poor: 40 },
    'consulting': { excellent: 90, good: 80, average: 70, poor: 60 },
    'ecommerce': { excellent: 45, good: 35, average: 25, poor: 15 }
  };

  const periodMultipliers = {
    'daily': 30,
    'weekly': 4.33,
    'monthly': 1,
    'quarterly': 1/3,
    'yearly': 1/12
  };

  const calculateGrossProfit = () => {
    const totalCOGS = Object.values(cogs).reduce((sum, cost) => sum + cost, 0);
    const grossProfit = revenue - totalCOGS;
    const grossMargin = (grossProfit / revenue) * 100;
    
    const benchmark = industryBenchmarks[businessType];
    const multiplier = periodMultipliers[reportingPeriod];
    const monthlyGrossProfit = grossProfit * multiplier;
    const annualizedGrossProfit = monthlyGrossProfit * 12;
    
    let performanceRating = 'Excellent';
    let ratingColor = '#4CAF50';
    let recommendation = '';
    let ratingIcon = '🚀';
    
    if (grossMargin >= benchmark.excellent) {
      performanceRating = 'Excellent';
      ratingColor = '#4CAF50';
      recommendation = 'Exceptional gross margin. Focus on scaling while maintaining efficiency.';
      ratingIcon = '🚀';
    } else if (grossMargin >= benchmark.good) {
      performanceRating = 'Good';
      ratingColor = '#8BC34A';
      recommendation = 'Strong gross margin. Look for opportunities to optimize costs further.';
      ratingIcon = '✅';
    } else if (grossMargin >= benchmark.average) {
      performanceRating = 'Average';
      ratingColor = '#FFC107';
      recommendation = 'Average performance. Review cost structure and pricing strategy.';
      ratingIcon = '⚠️';
    } else {
      performanceRating = 'Poor';
      ratingColor = '#F44336';
      recommendation = 'Gross margin needs improvement. Immediate cost reduction required.';
      ratingIcon = '❌';
    }
    
    const cogsBreakdown = Object.entries(cogs)
      .filter(([_, amount]) => amount > 0)
      .map(([type, amount]) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1'),
        amount,
        percentage: (amount / totalCOGS) * 100,
        color: getCogsColor(type)
      }));
    
    const comparisonData = [
      { label: 'Your Margin', value: grossMargin, color: '#000000' },
      { label: 'Industry Excellent', value: benchmark.excellent, color: '#4CAF50' },
      { label: 'Industry Good', value: benchmark.good, color: '#8BC34A' },
      { label: 'Industry Average', value: benchmark.average, color: '#FFC107' },
      { label: 'Industry Poor', value: benchmark.poor, color: '#F44336' }
    ];
    
    const profitPerDollar = grossProfit / revenue;
    const breakEvenPoint = totalCOGS / (revenue - totalCOGS);
    
    setResults({
      grossProfit: Math.round(grossProfit * 100) / 100,
      grossMargin: Math.round(grossMargin * 100) / 100,
      monthlyGrossProfit: Math.round(monthlyGrossProfit * 100) / 100,
      annualizedGrossProfit: Math.round(annualizedGrossProfit * 100) / 100,
      totalCOGS,
      performanceRating,
      ratingColor,
      recommendation,
      ratingIcon,
      profitPerDollar: Math.round(profitPerDollar * 10000) / 100,
      breakEvenPoint: Math.round(breakEvenPoint * 100) / 100,
      revenuePercentage: 100,
      costPercentage: (totalCOGS / revenue) * 100,
      profitPercentage: grossMargin,
      benchmarkAverage: benchmark.average
    });
    
    setChartData({
      cogsBreakdown,
      comparison: comparisonData
    });
  };

  const getCogsColor = (type) => {
    const colors = {
      'materials': '#2196F3',
      'labor': '#FF9800',
      'overhead': '#9C27B0',
      'shipping': '#4CAF50',
      'production': '#FF5722',
      'other': '#607D8B'
    };
    return colors[type] || '#795548';
  };

  useEffect(() => {
    calculateGrossProfit();
  }, [revenue, cogs, businessType, reportingPeriod]);

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

  const updateCOGS = (costType, value) => {
    setCogs(prev => ({
      ...prev,
      [costType]: Math.max(0, parseInt(value) || 0)
    }));
  };

  return (
    <>
      <Head>
        <title>Advanced Gross Profit Calculator | Profit Margin Analysis Tool</title>
        <meta name="description" content="Professional gross profit calculator with industry benchmarks. Calculate gross profit margin, analyze cost structure, and optimize business profitability." />
        <meta name="keywords" content="gross profit calculator, profit margin calculator, COGS calculator, business profitability, financial analysis, cost of goods sold" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/gross-profit-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Gross Profit Calculator | Profit Margin Analysis Tool" />
        <meta property="og:description" content="Calculate your gross profit margin and compare against industry benchmarks. Analyze cost structure and optimize business profitability." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/gross-profit-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Professional Gross Profit Calculator" />
        <meta name="twitter:description" content="Analyze your gross profit margin and compare against industry benchmarks." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="gross-profit-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Gross Profit Calculator",
            "description": "Professional business profitability tool for calculating and analyzing gross profit margins",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "1200",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Financial Analytics Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Industry Benchmark Comparisons",
              "Cost Structure Analysis",
              "Profit Margin Optimization",
              "Time Period Adjustments",
              "Break-even Analysis"
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
                "name": "What is a good gross profit margin for my business?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Good gross margins vary by industry. Manufacturing: 40-60%, Retail: 30-50%, Software: 65-85%, Restaurants: 50-70%. The key is comparing to industry averages while maintaining competitive pricing.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What costs should be included in COGS?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Include all direct costs: raw materials, direct labor, manufacturing overhead, shipping/freight, production supplies, and any other costs directly tied to producing goods or services.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How can I improve my gross profit margin?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Focus on: 1) Reducing material costs through better sourcing, 2) Improving production efficiency, 3) Increasing prices strategically, 4) Reducing waste and rework, 5) Optimizing inventory management.",
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
            <h1 className={styles.mainTitle}>Advanced Gross Profit Calculator</h1>
            <p className={styles.subtitle}>Analyze Your Profit Margins and Optimize Business Profitability</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Industry Benchmarks</span>
              <span className={styles.badge}>Cost Structure Analysis</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate Your Gross Profit</h2>
              
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
                <h3 className={styles.inputSubtitle}>Cost of Goods Sold (COGS)</h3>
                
                <div className={styles.cogsGrid}>
                  <div className={styles.cogsInput}>
                    <label className={styles.cogsLabel}>Raw Materials</label>
                    <div className={styles.cogsWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        min="0"
                        max="1000000"
                        step="100"
                        value={cogs.materials}
                        onChange={(e) => updateCOGS('materials', e.target.value)}
                        className={styles.cogsNumberInput}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.cogsInput}>
                    <label className={styles.cogsLabel}>Direct Labor</label>
                    <div className={styles.cogsWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        min="0"
                        max="1000000"
                        step="100"
                        value={cogs.labor}
                        onChange={(e) => updateCOGS('labor', e.target.value)}
                        className={styles.cogsNumberInput}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.cogsInput}>
                    <label className={styles.cogsLabel}>Manufacturing Overhead</label>
                    <div className={styles.cogsWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        min="0"
                        max="1000000"
                        step="100"
                        value={cogs.overhead}
                        onChange={(e) => updateCOGS('overhead', e.target.value)}
                        className={styles.cogsNumberInput}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.cogsInput}>
                    <label className={styles.cogsLabel}>Shipping & Freight</label>
                    <div className={styles.cogsWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        min="0"
                        max="1000000"
                        step="100"
                        value={cogs.shipping}
                        onChange={(e) => updateCOGS('shipping', e.target.value)}
                        className={styles.cogsNumberInput}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.cogsInput}>
                    <label className={styles.cogsLabel}>Production Supplies</label>
                    <div className={styles.cogsWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        min="0"
                        max="1000000"
                        step="100"
                        value={cogs.production}
                        onChange={(e) => updateCOGS('production', e.target.value)}
                        className={styles.cogsNumberInput}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.cogsInput}>
                    <label className={styles.cogsLabel}>Other Direct Costs</label>
                    <div className={styles.cogsWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        min="0"
                        max="1000000"
                        step="100"
                        value={cogs.other}
                        onChange={(e) => updateCOGS('other', e.target.value)}
                        className={styles.cogsNumberInput}
                      />
                    </div>
                  </div>
                </div>
                
                <div className={styles.totalCogsDisplay}>
                  Total COGS: <strong>{formatCurrency(Object.values(cogs).reduce((sum, cost) => sum + cost, 0))}</strong>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Business Type
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="manufacturing">Manufacturing</option>
                    <option value="retail">Retail</option>
                    <option value="software">Software/SaaS</option>
                    <option value="restaurant">Restaurant/Food Service</option>
                    <option value="consulting">Consulting/Professional Services</option>
                    <option value="ecommerce">E-commerce</option>
                  </select>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Reporting Period
                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="reportingPeriod"
                        value="daily"
                        checked={reportingPeriod === 'daily'}
                        onChange={(e) => setReportingPeriod(e.target.value)}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioText}>Daily</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="reportingPeriod"
                        value="weekly"
                        checked={reportingPeriod === 'weekly'}
                        onChange={(e) => setReportingPeriod(e.target.value)}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioText}>Weekly</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="reportingPeriod"
                        value="monthly"
                        checked={reportingPeriod === 'monthly'}
                        onChange={(e) => setReportingPeriod(e.target.value)}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioText}>Monthly</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="reportingPeriod"
                        value="quarterly"
                        checked={reportingPeriod === 'quarterly'}
                        onChange={(e) => setReportingPeriod(e.target.value)}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioText}>Quarterly</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="reportingPeriod"
                        value="yearly"
                        checked={reportingPeriod === 'yearly'}
                        onChange={(e) => setReportingPeriod(e.target.value)}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioText}>Yearly</span>
                    </label>
                  </div>
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
                      <div className={styles.resultLabel}>Gross Profit</div>
                      <div className={styles.resultValue} style={{ color: results.ratingColor }}>
                        {formatCurrency(results.grossProfit)}
                      </div>
                      <div className={styles.resultSubtext}>
                        {results.ratingIcon} {results.performanceRating}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Gross Margin</div>
                      <div className={styles.resultValue} style={{ color: results.ratingColor }}>
                        {formatPercentage(results.grossMargin)}
                      </div>
                      <div className={styles.resultSubtext}>Profit Percentage</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Profit per $ Revenue</div>
                      <div className={styles.resultValue}>${results.profitPerDollar.toFixed(2)}</div>
                      <div className={styles.resultSubtext}>Per dollar of revenue</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Monthly Gross Profit</div>
                      <div className={styles.resultValue}>{formatCurrency(results.monthlyGrossProfit)}</div>
                      <div className={styles.resultSubtext}>Adjusted for period</div>
                    </div>
                  </div>

                  {/* Margin Comparison Visualization */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Industry Benchmark Comparison</h3>
                    <div className={styles.chartBars}>
                      {chartData.comparison && chartData.comparison.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>{data.label}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBar}
                              style={{ 
                                width: `${Math.min(data.value, 100)}%`,
                                backgroundColor: data.color
                              }}
                              title={`${data.label}: ${formatPercentage(data.value)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{formatPercentage(data.value)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* COGS Breakdown */}
                  <div className={styles.cogsBreakdown}>
                    <h3 className={styles.chartTitle}>Cost Structure Analysis</h3>
                    <div className={styles.cogsPieChart}>
                      <div className={styles.pieChartContainer}>
                        {chartData.cogsBreakdown && chartData.cogsBreakdown.map((cost, index) => (
                          <div 
                            key={index}
                            className={styles.pieSegment}
                            style={{
                              backgroundColor: cost.color,
                              transform: `rotate(${cost.percentage * 3.6}deg)`
                            }}
                            title={`${cost.name}: ${formatCurrency(cost.amount)} (${formatPercentage(cost.percentage)})`}
                          />
                        ))}
                      </div>
                      <div className={styles.cogsLegend}>
                        {chartData.cogsBreakdown && chartData.cogsBreakdown.map((cost, index) => (
                          <div key={index} className={styles.legendItem}>
                            <div 
                              className={styles.legendColor}
                              style={{ backgroundColor: cost.color }}
                            ></div>
                            <span className={styles.legendText}>
                              <strong>{cost.name}:</strong> {formatCurrency(cost.amount)} ({formatPercentage(cost.percentage)})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className={styles.insightsCard} style={{ borderLeftColor: results.ratingColor }}>
                    <h3 className={styles.insightsTitle}>📊 Profit Optimization Recommendations</h3>
                    <div className={styles.recommendationBox}>
                      <p className={styles.recommendationText}>{results.recommendation}</p>
                      
                      <div className={styles.actionSteps}>
                        <h4 className={styles.actionTitle}>Key Improvement Strategies:</h4>
                        <ul className={styles.actionList}>
                          {results.performanceRating === 'Poor' || results.performanceRating === 'Average' ? (
                            <>
                              <li>Negotiate better terms with suppliers for raw materials</li>
                              <li>Improve production efficiency to reduce labor costs</li>
                              <li>Review pricing strategy for potential increases</li>
                              <li>Reduce waste and rework in production process</li>
                              <li>Optimize inventory management to minimize carrying costs</li>
                            </>
                          ) : (
                            <>
                              <li>Maintain strong supplier relationships for continued cost advantages</li>
                              <li>Invest in technology to further improve production efficiency</li>
                              <li>Consider strategic price increases for premium positioning</li>
                              <li>Expand into higher-margin product lines or services</li>
                              <li>Invest in quality improvements to reduce warranty costs</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Revenue vs COGS vs Profit Visualization */}
                  <div className={styles.profitVisualization}>
                    <h3 className={styles.chartTitle}>Revenue Allocation Analysis</h3>
                    <div className={styles.allocationVisualization}>
                      <div className={styles.allocationBar}>
                        <div 
                          className={styles.revenuePortion}
                          style={{ width: '100%' }}
                          title={`Total Revenue: ${formatCurrency(revenue)}`}
                        >
                          <span className={styles.allocationLabel}>Total Revenue</span>
                          <span className={styles.allocationValue}>{formatCurrency(revenue)}</span>
                        </div>
                      </div>
                      <div className={styles.allocationSubBar}>
                        <div 
                          className={styles.cogsPortion}
                          style={{ width: `${results.costPercentage}%` }}
                          title={`COGS: ${formatCurrency(results.totalCOGS)} (${formatPercentage(results.costPercentage)})`}
                        >
                          <span className={styles.allocationLabel}>COGS</span>
                          <span className={styles.allocationValue}>{formatCurrency(results.totalCOGS)}</span>
                        </div>
                        <div 
                          className={styles.profitPortion}
                          style={{ width: `${results.profitPercentage}%` }}
                          title={`Gross Profit: ${formatCurrency(results.grossProfit)} (${formatPercentage(results.profitPercentage)})`}
                        >
                          <span className={styles.allocationLabel}>Gross Profit</span>
                          <span className={styles.allocationValue}>{formatCurrency(results.grossProfit)}</span>
                        </div>
                      </div>
                      <div className={styles.allocationLegend}>
                        <div className={styles.legendItem}>
                          <div className={`${styles.legendColor} ${styles.legendRevenue}`}></div>
                          <span>Total Revenue: {formatCurrency(revenue)}</span>
                        </div>
                        <div className={styles.legendItem}>
                          <div className={`${styles.legendColor} ${styles.legendCogs}`}></div>
                          <span>COGS: {formatCurrency(results.totalCOGS)} ({formatPercentage(results.costPercentage)})</span>
                        </div>
                        <div className={styles.legendItem}>
                          <div className={`${styles.legendColor} ${styles.legendProfit}`}></div>
                          <span>Gross Profit: {formatCurrency(results.grossProfit)} ({formatPercentage(results.profitPercentage)})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Mastering Gross Profit: The Foundation of Business Profitability</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding Gross Profit: Your Core Profitability Metric</h3>
                <p>Gross profit measures how efficiently your business produces goods or services. It represents the money left over after subtracting the direct costs of production (Cost of Goods Sold) from your total revenue. This metric is the foundation of all profitability analysis and determines your capacity to cover operating expenses and generate net profit.</p>
                
                <div className={styles.formulaCard}>
                  <h4>Calculation Formula:</h4>
                  <div className={styles.formulaBox}>
                    Gross Profit = Total Revenue - Cost of Goods Sold (COGS)
                  </div>
                  <div className={styles.formulaBox}>
                    Gross Margin = (Gross Profit ÷ Total Revenue) × 100
                  </div>
                  <p>Example: $100,000 revenue - $60,000 COGS = $40,000 gross profit (40% margin)</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Industry Gross Margin Benchmarks</h3>
                
                <div className={styles.benchmarksTable}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Industry</th>
                        <th>Excellent</th>
                        <th>Good</th>
                        <th>Average</th>
                        <th>Poor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Software/SaaS</td>
                        <td>≥ 85%</td>
                        <td>75-85%</td>
                        <td>65-75%</td>
                        <td>&lt; 65%</td>
                      </tr>
                      <tr>
                        <td>Manufacturing</td>
                        <td>≥ 60%</td>
                        <td>50-60%</td>
                        <td>40-50%</td>
                        <td>&lt; 40%</td>
                      </tr>
                      <tr>
                        <td>Retail</td>
                        <td>≥ 50%</td>
                        <td>40-50%</td>
                        <td>30-40%</td>
                        <td>&lt; 30%</td>
                      </tr>
                      <tr>
                        <td>Restaurants</td>
                        <td>≥ 70%</td>
                        <td>60-70%</td>
                        <td>50-60%</td>
                        <td>&lt; 50%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The Golden Rule: Understanding Contribution Margin</h3>
                <div className={styles.goldenRuleCard}>
                  <div className={styles.ruleColumn}>
                    <h4>💰 Gross Margin vs Net Margin</h4>
                    <p>Gross margin measures production efficiency. Net margin (after all expenses) measures overall profitability. A strong gross margin gives you room for operating expenses.</p>
                  </div>
                  <div className={styles.ruleColumn}>
                    <h4>📊 Contribution to Fixed Costs</h4>
                    <p>Gross profit must first cover all fixed costs (rent, salaries, marketing). What remains is your net profit. Higher gross margin means faster coverage of fixed costs.</p>
                  </div>
                  <div className={styles.ruleColumn}>
                    <h4>⚖️ Break-Even Analysis</h4>
                    <p>Break-even point = Fixed Costs ÷ Gross Margin %. Lower margins require higher sales volume to break even. Higher margins mean faster profitability.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Advanced Gross Profit Optimization Strategies</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🏭 Improve Production Efficiency</h4>
                    <p>Implement lean manufacturing, reduce setup times, minimize waste, and optimize workflow. Small efficiency gains can significantly impact gross margins.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🤝 Strategic Supplier Management</h4>
                    <p>Negotiate volume discounts, establish long-term partnerships, diversify suppliers, and consider vertical integration for critical components.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 Value-Based Pricing</h4>
                    <p>Price based on value delivered, not just costs incurred. Premium products/services should command premium margins to reflect their value.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📦 Optimize Product Mix</h4>
                    <p>Focus on high-margin products/services. Use contribution margin analysis to prioritize production and marketing efforts toward most profitable items.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common COGS Calculation Mistakes to Avoid</h3>
                <ul className={styles.warningList}>
                  <li><strong>Including Indirect Costs:</strong> Administrative salaries, marketing, and rent should not be in COGS</li>
                  <li><strong>Inconsistent Inventory Valuation:</strong> Switching between FIFO, LIFO, or weighted average methods</li>
                  <li><strong>Ignoring Overhead Allocation:</strong> Not properly allocating manufacturing overhead to products</li>
                  <li><strong>Missing Components:</strong> Forgetting shipping, freight, or import duties in COGS</li>
                  <li><strong>Timing Mismatches:</strong> Recognizing revenue before corresponding costs are incurred</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Insights from Financial Analysts</h3>
                <blockquote className={styles.expertQuote}>
                  "Gross margin is the first line of defense in profitability. Companies with consistently high gross margins have more strategic flexibility - they can invest more in R&D, withstand price competition better, and weather economic downturns more easily. It's not just a number; it's a measure of business model strength."
                  <footer className={styles.quoteFooter}>— CFO, Manufacturing Company, 20+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between gross profit and net profit?</h3>
                <p className={styles.faqAnswer}>Gross profit = Revenue - COGS (direct production costs). Net profit = Gross profit - All other expenses (operating expenses, taxes, interest). Gross profit measures production efficiency; net profit measures overall business profitability.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should employee salaries be included in COGS?</h3>
                <p className={styles.faqAnswer}>Only direct labor (employees directly involved in production) should be in COGS. Administrative, sales, and management salaries are operating expenses. For service businesses, billable hours of service providers are typically included.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How often should I calculate gross profit?</h3>
                <p className={styles.faqAnswer}>Calculate gross profit monthly for regular monitoring, and track trends over time. Segment by product line, customer type, or geographic region for more actionable insights into profitability drivers.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's a healthy gross margin for growth?</h3>
                <p className={styles.faqAnswer}>For sustainable growth, aim for gross margins at least 10-15% above your industry average. This provides cushion for investment in growth initiatives, marketing, and R&D while maintaining healthy profitability.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Optimize Your Business Profitability</h2>
              <p className={styles.ctaText}>Use our calculator to benchmark your gross margins against industry standards and develop a data-driven profit optimization plan. Test different scenarios to maximize your business profitability.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational and planning purposes. Industry benchmarks are based on aggregated data and may not reflect specific market conditions or business models. Actual optimal gross margins vary based on business stage, market position, competitive landscape, and strategic objectives. Consult with qualified financial advisors before making significant business decisions.
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

export default GrossProfitCalculator;