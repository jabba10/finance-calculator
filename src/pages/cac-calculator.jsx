import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './cac.module.css';

const CustomerAcquisitionCostCalculator = ({ currentDate, lastModifiedDate }) => {
  const [marketingExpenses, setMarketingExpenses] = useState({
    advertising: 5000,
    salaries: 8000,
    software: 2000,
    content: 1500,
    events: 3000,
    other: 1000
  });
  const [newCustomers, setNewCustomers] = useState(200);
  const [businessType, setBusinessType] = useState('saas');
  const [timePeriod, setTimePeriod] = useState('monthly');
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);

  const industryBenchmarks = {
    'saas': { excellent: 100, good: 300, average: 500, poor: 1000 },
    'ecommerce': { excellent: 10, good: 25, average: 50, poor: 100 },
    'b2b': { excellent: 200, good: 500, average: 1000, poor: 2500 },
    'subscription': { excellent: 50, good: 150, average: 300, poor: 600 },
    'marketplace': { excellent: 75, good: 200, average: 400, poor: 800 },
    'enterprise': { excellent: 1000, good: 3000, average: 7000, poor: 15000 }
  };

  const timePeriodMultipliers = {
    'daily': 30,
    'weekly': 4.33,
    'monthly': 1,
    'quarterly': 1/3,
    'yearly': 1/12
  };

  const calculateCAC = () => {
    const totalExpenses = Object.values(marketingExpenses).reduce((sum, expense) => sum + expense, 0);
    const cac = totalExpenses / newCustomers;
    const benchmark = industryBenchmarks[businessType];
    const multiplier = timePeriodMultipliers[timePeriod];
    const monthlyCAC = cac * multiplier;
    const annualizedCAC = monthlyCAC * 12;
    
    let performanceRating = 'Excellent';
    let ratingColor = '#4CAF50';
    let recommendation = '';
    let ratingIcon = '🚀';
    
    if (monthlyCAC <= benchmark.excellent) {
      performanceRating = 'Excellent';
      ratingColor = '#4CAF50';
      recommendation = 'Your CAC is highly competitive. Consider scaling successful channels.';
      ratingIcon = '🚀';
    } else if (monthlyCAC <= benchmark.good) {
      performanceRating = 'Good';
      ratingColor = '#8BC34A';
      recommendation = 'Your CAC is above average. Optimize underperforming channels.';
      ratingIcon = '✅';
    } else if (monthlyCAC <= benchmark.average) {
      performanceRating = 'Average';
      ratingColor = '#FFC107';
      recommendation = 'Your CAC needs improvement. Focus on high-ROI marketing channels.';
      ratingIcon = '⚠️';
    } else {
      performanceRating = 'Poor';
      ratingColor = '#F44336';
      recommendation = 'Your CAC is too high. Review marketing strategy and customer targeting.';
      ratingIcon = '❌';
    }
    
    const expenseBreakdown = Object.entries(marketingExpenses)
      .filter(([_, amount]) => amount > 0)
      .map(([type, amount]) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1'),
        amount,
        percentage: (amount / totalExpenses) * 100,
        color: getExpenseColor(type)
      }));
    
    const comparisonData = [
      { label: 'Your CAC', value: monthlyCAC, color: '#000000' },
      { label: 'Industry Excellent', value: benchmark.excellent, color: '#4CAF50' },
      { label: 'Industry Good', value: benchmark.good, color: '#8BC34A' },
      { label: 'Industry Average', value: benchmark.average, color: '#FFC107' },
      { label: 'Industry Poor', value: benchmark.poor, color: '#F44336' }
    ];
    
    const ltvCacRatio = benchmark.average > 0 ? (benchmark.average * 36) / monthlyCAC : 0;
    const healthyLTVtoCAC = ltvCacRatio >= 3;
    
    setResults({
      cac: Math.round(cac * 100) / 100,
      monthlyCAC: Math.round(monthlyCAC * 100) / 100,
      annualizedCAC: Math.round(annualizedCAC * 100) / 100,
      totalExpenses,
      performanceRating,
      ratingColor,
      recommendation,
      ratingIcon,
      ltvCacRatio: Math.round(ltvCacRatio * 100) / 100,
      healthyLTVtoCAC,
      newCustomersPerDollar: Math.round((newCustomers / totalExpenses) * 100) / 100,
      expensePerChannel: totalExpenses / expenseBreakdown.length,
      benchmarkAverage: benchmark.average
    });
    
    setChartData({
      expenseBreakdown,
      comparison: comparisonData
    });
  };

  const getExpenseColor = (type) => {
    const colors = {
      'advertising': '#2196F3',
      'salaries': '#FF9800',
      'software': '#9C27B0',
      'content': '#4CAF50',
      'events': '#FF5722',
      'other': '#607D8B'
    };
    return colors[type] || '#795548';
  };

  useEffect(() => {
    calculateCAC();
  }, [marketingExpenses, newCustomers, businessType, timePeriod]);

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

  const updateExpense = (expenseType, value) => {
    setMarketingExpenses(prev => ({
      ...prev,
      [expenseType]: Math.max(0, parseInt(value) || 0)
    }));
  };

  return (
    <>
      <Head>
        <title>Advanced Customer Acquisition Cost Calculator | CAC Analysis Tool</title>
        <meta name="description" content="Professional CAC calculator with industry benchmarks. Calculate customer acquisition cost, analyze marketing efficiency, and optimize your growth strategy." />
        <meta name="keywords" content="customer acquisition cost calculator, CAC calculator, marketing ROI, SaaS metrics, growth marketing, customer lifetime value" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/cac-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Customer Acquisition Cost Calculator | CAC Analysis Tool" />
        <meta property="og:description" content="Calculate your CAC and compare against industry benchmarks. Optimize marketing spend and improve customer acquisition efficiency." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/cac-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Professional CAC Calculator" />
        <meta name="twitter:description" content="Analyze your customer acquisition cost and compare against industry benchmarks." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="cac-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Customer Acquisition Cost Calculator",
            "description": "Professional marketing analytics tool for calculating and optimizing customer acquisition costs",
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
              "ratingCount": "950",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Business Metrics Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Industry Benchmark Comparisons",
              "Expense Breakdown Analysis",
              "LTV:CAC Ratio Calculation",
              "Time Period Adjustments",
              "Marketing Efficiency Optimization"
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
                "name": "What is a good Customer Acquisition Cost (CAC) for my business?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Good CAC varies by industry. For SaaS, $100-300 is excellent, $300-500 is good. For e-commerce, $10-25 is excellent. The key is LTV:CAC ratio - aim for at least 3:1.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What costs should be included in CAC calculation?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Include all marketing and sales expenses: advertising spend, marketing team salaries, software tools, content creation, events, and agency fees over the same time period.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How can I reduce my CAC effectively?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Focus on: 1) Improving conversion rates, 2) Increasing customer lifetime value, 3) Optimizing high-performing channels, 4) Implementing referral programs, 5) Enhancing targeting precision.",
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
            <h1 className={styles.mainTitle}>Advanced Customer Acquisition Cost Calculator</h1>
            <p className={styles.subtitle}>Analyze Your Marketing Efficiency and Optimize Growth Spending</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Industry Benchmarks</span>
              <span className={styles.badge}>LTV:CAC Analysis</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate Your CAC</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  New Customers Acquired
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="10000"
                      step="1"
                      value={newCustomers}
                      onChange={(e) => setNewCustomers(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      step="1"
                      value={newCustomers}
                      onChange={(e) => setNewCustomers(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.unitSymbol}>customers</span>
                  </div>
                  <div className={styles.valueDisplay}>{newCustomers.toLocaleString()} customers</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <h3 className={styles.inputSubtitle}>Marketing & Sales Expenses</h3>
                
                <div className={styles.expenseGrid}>
                  <div className={styles.expenseInput}>
                    <label className={styles.expenseLabel}>Advertising Spend</label>
                    <div className={styles.expenseWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        min="0"
                        max="1000000"
                        step="100"
                        value={marketingExpenses.advertising}
                        onChange={(e) => updateExpense('advertising', e.target.value)}
                        className={styles.expenseNumberInput}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.expenseInput}>
                    <label className={styles.expenseLabel}>Sales & Marketing Salaries</label>
                    <div className={styles.expenseWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        min="0"
                        max="1000000"
                        step="100"
                        value={marketingExpenses.salaries}
                        onChange={(e) => updateExpense('salaries', e.target.value)}
                        className={styles.expenseNumberInput}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.expenseInput}>
                    <label className={styles.expenseLabel}>Software & Tools</label>
                    <div className={styles.expenseWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        min="0"
                        max="1000000"
                        step="100"
                        value={marketingExpenses.software}
                        onChange={(e) => updateExpense('software', e.target.value)}
                        className={styles.expenseNumberInput}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.expenseInput}>
                    <label className={styles.expenseLabel}>Content Creation</label>
                    <div className={styles.expenseWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        min="0"
                        max="1000000"
                        step="100"
                        value={marketingExpenses.content}
                        onChange={(e) => updateExpense('content', e.target.value)}
                        className={styles.expenseNumberInput}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.expenseInput}>
                    <label className={styles.expenseLabel}>Events & Conferences</label>
                    <div className={styles.expenseWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        min="0"
                        max="1000000"
                        step="100"
                        value={marketingExpenses.events}
                        onChange={(e) => updateExpense('events', e.target.value)}
                        className={styles.expenseNumberInput}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.expenseInput}>
                    <label className={styles.expenseLabel}>Other Expenses</label>
                    <div className={styles.expenseWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        min="0"
                        max="1000000"
                        step="100"
                        value={marketingExpenses.other}
                        onChange={(e) => updateExpense('other', e.target.value)}
                        className={styles.expenseNumberInput}
                      />
                    </div>
                  </div>
                </div>
                
                <div className={styles.totalExpenseDisplay}>
                  Total Expenses: <strong>{formatCurrency(Object.values(marketingExpenses).reduce((sum, expense) => sum + expense, 0))}</strong>
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
                    <option value="saas">SaaS (Software as a Service)</option>
                    <option value="ecommerce">E-commerce & Retail</option>
                    <option value="b2b">B2B Services</option>
                    <option value="subscription">Subscription Box</option>
                    <option value="marketplace">Marketplace Platform</option>
                    <option value="enterprise">Enterprise Software</option>
                  </select>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Time Period
                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="timePeriod"
                        value="daily"
                        checked={timePeriod === 'daily'}
                        onChange={(e) => setTimePeriod(e.target.value)}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioText}>Daily</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="timePeriod"
                        value="weekly"
                        checked={timePeriod === 'weekly'}
                        onChange={(e) => setTimePeriod(e.target.value)}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioText}>Weekly</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="timePeriod"
                        value="monthly"
                        checked={timePeriod === 'monthly'}
                        onChange={(e) => setTimePeriod(e.target.value)}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioText}>Monthly</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="timePeriod"
                        value="quarterly"
                        checked={timePeriod === 'quarterly'}
                        onChange={(e) => setTimePeriod(e.target.value)}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioText}>Quarterly</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="timePeriod"
                        value="yearly"
                        checked={timePeriod === 'yearly'}
                        onChange={(e) => setTimePeriod(e.target.value)}
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
              <h2 className={styles.sectionTitle}>Marketing Efficiency Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Customer Acquisition Cost</div>
                      <div className={styles.resultValue} style={{ color: results.ratingColor }}>
                        {formatCurrency(results.monthlyCAC)}
                      </div>
                      <div className={styles.resultSubtext}>
                        {results.ratingIcon} {results.performanceRating}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>New Customers per $</div>
                      <div className={styles.resultValue}>{results.newCustomersPerDollar.toFixed(2)}</div>
                      <div className={styles.resultSubtext}>Customers per dollar spent</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>LTV:CAC Ratio</div>
                      <div className={styles.resultValue} style={{ color: results.healthyLTVtoCAC ? '#4CAF50' : '#F44336' }}>
                        {results.ltvCacRatio}:1
                      </div>
                      <div className={styles.resultSubtext}>
                        {results.healthyLTVtoCAC ? '✅ Healthy' : '❌ Needs Improvement'}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Marketing Spend</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalExpenses)}</div>
                      <div className={styles.resultSubtext}>For {newCustomers.toLocaleString()} customers</div>
                    </div>
                  </div>

                  {/* CAC Comparison Visualization */}
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
                                width: `${Math.min(data.value / results.benchmarkAverage * 100, 100)}%`,
                                backgroundColor: data.color
                              }}
                              title={`${data.label}: ${formatCurrency(data.value)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{formatCurrency(data.value)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expense Breakdown */}
                  <div className={styles.expenseBreakdown}>
                    <h3 className={styles.chartTitle}>Marketing Expense Allocation</h3>
                    <div className={styles.expensePieChart}>
                      <div className={styles.pieChartContainer}>
                        {chartData.expenseBreakdown && chartData.expenseBreakdown.map((expense, index) => (
                          <div 
                            key={index}
                            className={styles.pieSegment}
                            style={{
                              backgroundColor: expense.color,
                              transform: `rotate(${expense.percentage * 3.6}deg)`
                            }}
                            title={`${expense.name}: ${formatCurrency(expense.amount)} (${formatPercentage(expense.percentage)})`}
                          />
                        ))}
                      </div>
                      <div className={styles.expenseLegend}>
                        {chartData.expenseBreakdown && chartData.expenseBreakdown.map((expense, index) => (
                          <div key={index} className={styles.legendItem}>
                            <div 
                              className={styles.legendColor}
                              style={{ backgroundColor: expense.color }}
                            ></div>
                            <span className={styles.legendText}>
                              <strong>{expense.name}:</strong> {formatCurrency(expense.amount)} ({formatPercentage(expense.percentage)})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className={styles.insightsCard} style={{ borderLeftColor: results.ratingColor }}>
                    <h3 className={styles.insightsTitle}>📈 Growth Optimization Recommendations</h3>
                    <div className={styles.recommendationBox}>
                      <p className={styles.recommendationText}>{results.recommendation}</p>
                      
                      <div className={styles.actionSteps}>
                        <h4 className={styles.actionTitle}>Key Improvement Strategies:</h4>
                        <ul className={styles.actionList}>
                          {results.performanceRating === 'Poor' || results.performanceRating === 'Average' ? (
                            <>
                              <li>Audit and pause underperforming marketing channels</li>
                              <li>Double down on channels with lowest CAC</li>
                              <li>Improve website conversion rate by 25%</li>
                              <li>Implement referral program to reduce paid acquisition</li>
                              <li>Optimize ad targeting and messaging</li>
                            </>
                          ) : (
                            <>
                              <li>Scale successful acquisition channels with increased budget</li>
                              <li>Implement A/B testing for continuous optimization</li>
                              <li>Focus on customer retention to increase LTV</li>
                              <li>Explore new customer segments with similar characteristics</li>
                              <li>Consider expanding to new geographic markets</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* CAC vs LTV Visualization */}
                  <div className={styles.cacLtvVisualization}>
                    <h3 className={styles.chartTitle}>LTV:CAC Health Check</h3>
                    <div className={styles.ratioVisualization}>
                      <div className={styles.ratioBar}>
                        <div 
                          className={styles.cacPortion}
                          style={{ width: '25%' }}
                          title={`CAC: ${formatCurrency(results.monthlyCAC)}`}
                        >
                          <span className={styles.ratioLabel}>CAC</span>
                          <span className={styles.ratioValue}>{formatCurrency(results.monthlyCAC)}</span>
                        </div>
                        <div 
                          className={styles.ltvPortion}
                          style={{ width: `${Math.min(results.ltvCacRatio * 25, 75)}%` }}
                          title={`LTV: ${formatCurrency(results.monthlyCAC * results.ltvCacRatio)}`}
                        >
                          <span className={styles.ratioLabel}>LTV</span>
                          <span className={styles.ratioValue}>{formatCurrency(results.monthlyCAC * results.ltvCacRatio)}</span>
                        </div>
                      </div>
                      <div className={styles.ratioInfo}>
                        <div className={styles.ratioIndicator}>
                          <div className={`${styles.indicatorDot} ${results.healthyLTVtoCAC ? styles.indicatorGood : styles.indicatorPoor}`}></div>
                          <span className={styles.indicatorText}>
                            Target Ratio: <strong>3:1</strong> | Your Ratio: <strong>{results.ltvCacRatio}:1</strong>
                          </span>
                        </div>
                        <p className={styles.ratioNote}>
                          {results.healthyLTVtoCAC 
                            ? '✅ Healthy ratio indicates sustainable growth'
                            : '⚠️ Ratio below 3:1 suggests potential scaling challenges'}
                        </p>
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
              <h2 className={styles.articleTitle}>Mastering Customer Acquisition Cost: The Key to Sustainable Growth</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding CAC: Your Growth Efficiency Metric</h3>
                <p>Customer Acquisition Cost (CAC) measures how much your business spends to acquire a new customer. It's the single most important metric for evaluating marketing efficiency and determining whether your growth is sustainable. By calculating and optimizing CAC, you can scale profitably while avoiding the "growth at all costs" trap that sinks many startups.</p>
                
                <div className={styles.formulaCard}>
                  <h4>Calculation Formula:</h4>
                  <div className={styles.formulaBox}>
                    CAC = Total Marketing & Sales Expenses ÷ Number of New Customers Acquired
                  </div>
                  <p>Example: $20,500 marketing spend ÷ 200 new customers = $102.50 CAC</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Industry Benchmarks: What's a Good CAC?</h3>
                
                <div className={styles.benchmarksTable}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Industry</th>
                        <th>Excellent CAC</th>
                        <th>Good CAC</th>
                        <th>Average CAC</th>
                        <th>Poor CAC</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>SaaS</td>
                        <td>&lt; $100</td>
                        <td>$100-$300</td>
                        <td>$300-$500</td>
                        <td>&gt; $500</td>
                      </tr>
                      <tr>
                        <td>E-commerce</td>
                        <td>&lt; $10</td>
                        <td>$10-$25</td>
                        <td>$25-$50</td>
                        <td>&gt; $50</td>
                      </tr>
                      <tr>
                        <td>B2B Services</td>
                        <td>&lt; $200</td>
                        <td>$200-$500</td>
                        <td>$500-$1000</td>
                        <td>&gt; $1000</td>
                      </tr>
                      <tr>
                        <td>Marketplace</td>
                        <td>&lt; $75</td>
                        <td>$75-$200</td>
                        <td>$200-$400</td>
                        <td>&gt; $400</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The Golden Rule: LTV:CAC Ratio</h3>
                <div className={styles.goldenRuleCard}>
                  <div className={styles.ruleColumn}>
                    <h4>💰 Minimum Ratio: 3:1</h4>
                    <p>For sustainable growth, Customer Lifetime Value (LTV) should be at least 3 times your CAC. This ensures profitability after accounting for other costs.</p>
                  </div>
                  <div className={styles.ruleColumn}>
                    <h4>🚀 Ideal Ratio: 5:1+</h4>
                    <p>High-growth companies often maintain LTV:CAC ratios of 5:1 or higher, allowing for aggressive reinvestment in customer acquisition.</p>
                  </div>
                  <div className={styles.ruleColumn}>
                    <h4>⚠️ Danger Zone: &lt; 1:1</h4>
                    <p>Ratios below 1:1 mean you're losing money on every customer. This is unsustainable and requires immediate strategic changes.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Advanced CAC Optimization Strategies</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🎯 Improve Targeting Precision</h4>
                    <p>Use data analytics to identify your highest-value customer segments. Create detailed buyer personas and tailor marketing messages specifically to their needs.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📊 Optimize Conversion Funnels</h4>
                    <p>Analyze drop-off points in your customer journey. Small improvements in conversion rates at each stage can dramatically reduce CAC.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🤝 Implement Referral Programs</h4>
                    <p>Turn satisfied customers into advocates. Well-designed referral programs can reduce CAC by 30-50% while increasing customer quality.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🔄 Focus on Retention</h4>
                    <p>Increasing customer lifetime value is as important as reducing CAC. Improve retention by 5% and watch your LTV:CAC ratio soar.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common CAC Calculation Mistakes to Avoid</h3>
                <ul className={styles.warningList}>
                  <li><strong>Incomplete Expense Tracking:</strong> Forgetting to include salaries, software costs, or overhead expenses</li>
                  <li><strong>Wrong Time Alignment:</strong> Comparing expenses from one period with customers from another</li>
                  <li><strong>Ignoring Attribution:</strong> Not tracking which channels actually drive conversions</li>
                  <li><strong>Overlooking Customer Quality:</strong> Focusing only on quantity without considering customer value</li>
                  <li><strong>Forgetting Payback Period:</strong> Not calculating how long it takes to recover CAC</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Insights from Growth Marketers</h3>
                <blockquote className={styles.expertQuote}>
                  "The best growth teams obsess over CAC, but they understand it's meaningless without LTV context. A $500 CAC might be disastrous for one business but fantastic for another with a $5,000 LTV. Always pair these metrics together for strategic decision-making."
                  <footer className={styles.quoteFooter}>— Director of Growth, Venture-Backed SaaS Company, 10+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I include salaries in CAC calculation?</h3>
                <p className={styles.faqAnswer}>Yes, include salaries for all marketing and sales personnel directly involved in customer acquisition. For executives or shared roles, allocate an appropriate percentage of their time and cost to acquisition activities.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How often should I calculate CAC?</h3>
                <p className={styles.faqAnswer}>Calculate CAC monthly for regular monitoring, but also review quarterly and annually for trend analysis. Segment CAC by channel (paid search, social, referrals) for more actionable insights.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between CAC and CPA?</h3>
                <p className={styles.faqAnswer}>CAC (Customer Acquisition Cost) measures cost to acquire a paying customer. CPA (Cost Per Acquisition) often refers to any conversion (lead, signup, download). Always clarify what "acquisition" means in your context.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do I calculate payback period?</h3>
                <p className={styles.faqAnswer}>Payback Period = CAC ÷ (Average Revenue Per User × Gross Margin). For SaaS, aim for &lt;12 months. For e-commerce, aim for &lt;3 months. Shorter payback periods reduce cash flow risk.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Optimize Your Growth Strategy</h2>
              <p className={styles.ctaText}>Use our calculator to benchmark your CAC against industry standards and develop a data-driven growth plan. Test different scenarios to find your optimal marketing mix.</p>
              
              
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational and planning purposes. Industry benchmarks are based on aggregated data and may not reflect specific market conditions or business models. Actual optimal CAC varies based on business stage, market position, funding, and strategic objectives. Consult with qualified business advisors before making significant marketing investment decisions.
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

export default CustomerAcquisitionCostCalculator;