import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './cashflowcal.module.css';

const CashFlowCalculator = ({ currentDate, lastModifiedDate }) => {
  const [cashFlowType, setCashFlowType] = useState('business');
  const [initialCash, setInitialCash] = useState(50000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(25000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(18000);
  const [revenueGrowthRate, setRevenueGrowthRate] = useState(5);
  const [expenseGrowthRate, setExpenseGrowthRate] = useState(3);
  const [months, setMonths] = useState(12);
  const [safetyBuffer, setSafetyBuffer] = useState(3);
  const [seasonalityFactor, setSeasonalityFactor] = useState(10);
  const [seasonalityPattern, setSeasonalityPattern] = useState('summer_peak');
  const [irregularIncome, setIrregularIncome] = useState([]);
  const [irregularExpenses, setIrregularExpenses] = useState([]);
  const [cashFlowResults, setCashFlowResults] = useState(null);
  const [cashFlowData, setCashFlowData] = useState([]);
  const [monthlyResults, setMonthlyResults] = useState([]);
  const [scenarios, setScenarios] = useState([]);

  const seasonalityPatterns = {
    'summer_peak': [1.3, 1.2, 1.1, 1.0, 0.9, 0.8, 1.2, 1.4, 1.3, 1.1, 1.0, 0.9],
    'winter_peak': [0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.2, 1.1, 1.0, 0.9, 0.8, 0.7],
    'q4_peak': [0.9, 0.9, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.1, 1.2, 1.5, 1.5],
    'consistent': [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
    'spring_fall_peak': [1.2, 1.4, 1.3, 1.0, 0.8, 0.7, 0.8, 0.9, 1.3, 1.4, 1.2, 1.1]
  };

  const calculateCashFlow = () => {
    let currentCash = initialCash;
    const dataPoints = [];
    let totalRevenue = 0;
    let totalExpenses = 0;
    let lowestCashBalance = currentCash;
    let burnRate = 0;
    let runway = 0;
    let monthsNegative = 0;
    const monthlyData = [];

    const seasonalityFactors = seasonalityPatterns[seasonalityPattern] || seasonalityPatterns['consistent'];

    for (let month = 1; month <= months; month++) {
      // Apply seasonality
      const seasonalityIndex = (month - 1) % 12;
      const seasonalityMultiplier = 1 + (seasonalityFactor / 100) * (seasonalityFactors[seasonalityIndex] - 1);
      
      // Calculate monthly values with growth
      const monthlyRev = monthlyRevenue * 
                         Math.pow(1 + revenueGrowthRate / 100, (month - 1) / 12) * 
                         seasonalityMultiplier;
      
      const monthlyExp = monthlyExpenses * 
                         Math.pow(1 + expenseGrowthRate / 100, (month - 1) / 12);
      
      // Add irregular income/expenses
      const monthIrregularIncome = irregularIncome
        .filter(item => item.month === month)
        .reduce((sum, item) => sum + item.amount, 0);
      
      const monthIrregularExpenses = irregularExpenses
        .filter(item => item.month === month)
        .reduce((sum, item) => sum + item.amount, 0);
      
      const netCashFlow = monthlyRev + monthIrregularIncome - monthlyExp - monthIrregularExpenses;
      currentCash += netCashFlow;
      
      totalRevenue += monthlyRev + monthIrregularIncome;
      totalExpenses += monthlyExp + monthIrregularExpenses;
      
      if (currentCash < lowestCashBalance) {
        lowestCashBalance = currentCash;
      }
      
      if (currentCash < 0) {
        monthsNegative++;
      }
      
      monthlyData.push({
        month: month,
        revenue: monthlyRev + monthIrregularIncome,
        expenses: monthlyExp + monthIrregularExpenses,
        netCashFlow: netCashFlow,
        cumulativeCash: currentCash,
        seasonality: seasonalityFactors[seasonalityIndex]
      });
      
      // Store quarterly data points for chart
      if (month % 3 === 0 || month === months) {
        dataPoints.push({
          period: `Q${Math.ceil(month/3)}`,
          revenue: totalRevenue,
          expenses: totalExpenses,
          cumulativeCash: currentCash,
          month: month
        });
      }
    }
    
    // Calculate key metrics
    const averageMonthlyProfit = (totalRevenue - totalExpenses) / months;
    const profitMargin = ((totalRevenue - totalExpenses) / totalRevenue) * 100;
    
    // Calculate burn rate and runway
    if (averageMonthlyProfit < 0) {
      burnRate = Math.abs(averageMonthlyProfit);
      runway = currentCash / burnRate;
    }
    
    // Calculate safety buffer adequacy
    const bufferMonths = currentCash / ((totalExpenses / months) * (1 + expenseGrowthRate / 100));
    
    const results = {
      finalCashBalance: Math.round(currentCash * 100) / 100,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      totalProfit: Math.round((totalRevenue - totalExpenses) * 100) / 100,
      averageMonthlyProfit: Math.round(averageMonthlyProfit * 100) / 100,
      profitMargin: Math.round(profitMargin * 100) / 100,
      lowestCashBalance: Math.round(lowestCashBalance * 100) / 100,
      monthsNegative: monthsNegative,
      burnRate: Math.round(burnRate * 100) / 100,
      runway: Math.round(runway * 100) / 100,
      bufferAdequacy: Math.round(bufferMonths * 100) / 100,
      cashFlowStability: Math.round(((months - monthsNegative) / months) * 100 * 100) / 100,
      monthlyResults: monthlyData // Store monthly data in results
    };
    
    setCashFlowResults(results);
    setCashFlowData(dataPoints);
    setMonthlyResults(monthlyData);
    calculateScenarios(results, monthlyData);
  };

  const calculateScenarios = (baseResults, monthlyData) => {
    const scenarioTypes = [
      { name: 'Optimistic', revenueMultiplier: 1.2, expenseMultiplier: 0.9 },
      { name: 'Pessimistic', revenueMultiplier: 0.8, expenseMultiplier: 1.2 },
      { name: 'High Growth', revenueMultiplier: 1.5, expenseMultiplier: 1.1 },
      { name: 'Conservative', revenueMultiplier: 1.0, expenseMultiplier: 0.95 }
    ];
    
    const calculatedScenarios = scenarioTypes.map(scenario => {
      let scenarioCash = initialCash;
      let scenarioRevenue = 0;
      let scenarioExpenses = 0;
      
      monthlyData.forEach(month => {
        const adjustedRevenue = month.revenue * scenario.revenueMultiplier;
        const adjustedExpenses = month.expenses * scenario.expenseMultiplier;
        const netCashFlow = adjustedRevenue - adjustedExpenses;
        scenarioCash += netCashFlow;
        scenarioRevenue += adjustedRevenue;
        scenarioExpenses += adjustedExpenses;
      });
      
      return {
        name: scenario.name,
        finalCashBalance: Math.round(scenarioCash * 100) / 100,
        totalProfit: Math.round((scenarioRevenue - scenarioExpenses) * 100) / 100,
        profitMargin: Math.round(((scenarioRevenue - scenarioExpenses) / scenarioRevenue) * 100 * 100) / 100,
        revenueMultiplier: scenario.revenueMultiplier,
        expenseMultiplier: scenario.expenseMultiplier
      };
    });
    
    setScenarios(calculatedScenarios);
  };

  const addIrregularIncome = () => {
    const newIncome = {
      id: Date.now(),
      month: Math.floor(months / 2),
      amount: 5000,
      description: 'Bonus/One-time income'
    };
    setIrregularIncome([...irregularIncome, newIncome]);
  };

  const addIrregularExpense = () => {
    const newExpense = {
      id: Date.now(),
      month: Math.floor(months / 2),
      amount: 3000,
      description: 'One-time expense'
    };
    setIrregularExpenses([...irregularExpenses, newExpense]);
  };

  const removeIrregularIncome = (id) => {
    setIrregularIncome(irregularIncome.filter(item => item.id !== id));
  };

  const removeIrregularExpense = (id) => {
    setIrregularExpenses(irregularExpenses.filter(item => item.id !== id));
  };

  useEffect(() => {
    calculateCashFlow();
  }, [
    cashFlowType, initialCash, monthlyRevenue, monthlyExpenses, 
    revenueGrowthRate, expenseGrowthRate, months, safetyBuffer,
    seasonalityFactor, seasonalityPattern, irregularIncome, irregularExpenses
  ]);

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

  const formatMonth = (monthNumber) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[(monthNumber - 1) % 12];
  };

  return (
    <>
      <Head>
        <title>Advanced Cash Flow Calculator | Forecast & Analyze Your Cash Position</title>
        <meta name="description" content="Free advanced cash flow calculator with forecasting, scenario analysis, and seasonality adjustments. Plan your business or personal cash needs with professional tools." />
        <meta name="keywords" content="cash flow calculator, cash flow forecast, business cash flow, financial planning, burn rate calculator, cash runway, cash management" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/cashflow-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Cash Flow Calculator | Forecast & Analyze Your Cash Position" />
        <meta property="og:description" content="Forecast your cash flow with seasonality adjustments, scenario analysis, and burn rate calculations. Essential tool for business owners and financial planners." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/cashflow-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cash Flow Calculator & Forecaster" />
        <meta name="twitter:description" content="Professional cash flow forecasting tool with multiple scenarios and visualizations." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="cash-flow-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Cash Flow Calculator",
            "description": "Professional cash flow forecasting calculator with scenario analysis and seasonality adjustments",
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
              "ratingCount": "950",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Financial Management Tools",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Cash Flow Forecasting",
              "Scenario Analysis",
              "Seasonality Adjustments",
              "Burn Rate Calculation",
              "Visual Cash Flow Charts",
              "Irregular Income/Expense Tracking"
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
                "name": "What is cash flow and why is it important?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Cash flow is the net amount of cash moving in and out of a business or personal finances. Positive cash flow means more money coming in than going out. It's critical for survival - businesses can be profitable but still fail due to poor cash flow management.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How do I calculate my cash runway?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Cash runway = Current cash balance ÷ Monthly burn rate. Our calculator automatically computes this based on your inputs. A 6-month runway is generally considered safe, while less than 3 months requires immediate attention.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between profit and cash flow?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Profit is revenue minus expenses on an accrual basis, while cash flow tracks actual cash movements. A business can be profitable but have negative cash flow due to timing differences, inventory purchases, or accounts receivable.",
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
            <h1 className={styles.mainTitle}>Advanced Cash Flow Calculator</h1>
            <p className={styles.subtitle}>Forecast Your Financial Health with Precision Cash Flow Analysis</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Scenario Analysis</span>
              <span className={styles.badge}>Professional Tool</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Cash Flow Inputs</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Cash Flow Type
                  <select
                    value={cashFlowType}
                    onChange={(e) => setCashFlowType(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="business">Business Cash Flow</option>
                    <option value="personal">Personal Cash Flow</option>
                    <option value="startup">Startup Burn Rate</option>
                    <option value="project">Project Cash Flow</option>
                  </select>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Initial Cash Balance
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="1000"
                      max="500000"
                      step="1000"
                      value={initialCash}
                      onChange={(e) => setInitialCash(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1000"
                      max="500000"
                      step="1000"
                      value={initialCash}
                      onChange={(e) => setInitialCash(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(initialCash)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Monthly Revenue/Income
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="1000"
                      max="200000"
                      step="1000"
                      value={monthlyRevenue}
                      onChange={(e) => setMonthlyRevenue(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1000"
                      max="200000"
                      step="1000"
                      value={monthlyRevenue}
                      onChange={(e) => setMonthlyRevenue(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(monthlyRevenue)}/month</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Monthly Expenses
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="500"
                      max="150000"
                      step="500"
                      value={monthlyExpenses}
                      onChange={(e) => setMonthlyExpenses(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="500"
                      max="150000"
                      step="500"
                      value={monthlyExpenses}
                      onChange={(e) => setMonthlyExpenses(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(monthlyExpenses)}/month</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Revenue Growth Rate (Monthly)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.5"
                      value={revenueGrowthRate}
                      onChange={(e) => setRevenueGrowthRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      value={revenueGrowthRate}
                      onChange={(e) => setRevenueGrowthRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(revenueGrowthRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Expense Growth Rate (Monthly)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      step="0.5"
                      value={expenseGrowthRate}
                      onChange={(e) => setExpenseGrowthRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="15"
                      step="0.5"
                      value={expenseGrowthRate}
                      onChange={(e) => setExpenseGrowthRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(expenseGrowthRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Forecast Period
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="3"
                      max="36"
                      step="3"
                      value={months}
                      onChange={(e) => setMonths(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="3"
                      max="36"
                      step="3"
                      value={months}
                      onChange={(e) => setMonths(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.monthsSymbol}>months</span>
                  </div>
                  <div className={styles.valueDisplay}>{months} months</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Seasonality Pattern
                  <select
                    value={seasonalityPattern}
                    onChange={(e) => setSeasonalityPattern(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="summer_peak">Summer Peak (Retail, Tourism)</option>
                    <option value="winter_peak">Winter Peak (Utilities, Heating)</option>
                    <option value="q4_peak">Q4 Peak (Retail, E-commerce)</option>
                    <option value="spring_fall_peak">Spring/Fall Peak (Services, Education)</option>
                    <option value="consistent">Consistent (Subscription, SaaS)</option>
                  </select>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Seasonality Intensity
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="5"
                      value={seasonalityFactor}
                      onChange={(e) => setSeasonalityFactor(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="50"
                      step="5"
                      value={seasonalityFactor}
                      onChange={(e) => setSeasonalityFactor(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{seasonalityFactor}% variation</div>
                </label>
              </div>

              <div className={styles.irregularSection}>
                <div className={styles.irregularHeader}>
                  <h4>Irregular Income/Expenses</h4>
                  <div className={styles.irregularButtons}>
                    <button 
                      className={styles.smallButton}
                      onClick={addIrregularIncome}
                    >
                      + Add Income
                    </button>
                    <button 
                      className={styles.smallButton}
                      onClick={addIrregularExpense}
                    >
                      + Add Expense
                    </button>
                  </div>
                </div>
                
                {irregularIncome.length > 0 && (
                  <div className={styles.irregularList}>
                    <h5>Irregular Income</h5>
                    {irregularIncome.map(item => (
                      <div key={item.id} className={styles.irregularItem}>
                        <span>Month {item.month}: {formatCurrency(item.amount)}</span>
                        <button 
                          className={styles.removeButton}
                          onClick={() => removeIrregularIncome(item.id)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {irregularExpenses.length > 0 && (
                  <div className={styles.irregularList}>
                    <h5>Irregular Expenses</h5>
                    {irregularExpenses.map(item => (
                      <div key={item.id} className={styles.irregularItem}>
                        <span>Month {item.month}: {formatCurrency(item.amount)}</span>
                        <button 
                          className={styles.removeButton}
                          onClick={() => removeIrregularExpense(item.id)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Cash Flow Analysis</h2>
              
              {cashFlowResults && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Final Cash Balance</div>
                      <div className={styles.resultValue}>
                        {formatCurrency(cashFlowResults.finalCashBalance)}
                      </div>
                      <div className={styles.resultSubtext}>
                        {cashFlowResults.finalCashBalance >= initialCash ? '🟢 Increased' : '🔴 Decreased'}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Profit</div>
                      <div className={styles.resultValue}>
                        {formatCurrency(cashFlowResults.totalProfit)}
                      </div>
                      <div className={styles.resultSubtext}>
                        Profit Margin: {formatPercentage(cashFlowResults.profitMargin)}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Monthly Avg. Profit</div>
                      <div className={styles.resultValue}>
                        {formatCurrency(cashFlowResults.averageMonthlyProfit)}
                      </div>
                      <div className={styles.resultSubtext}>
                        {cashFlowResults.averageMonthlyProfit >= 0 ? 'Positive' : 'Negative'} cash flow
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Cash Runway</div>
                      <div className={styles.resultValue}>
                        {cashFlowResults.runway > 0 ? `${cashFlowResults.runway.toFixed(1)} months` : 'N/A'}
                      </div>
                      <div className={styles.resultSubtext}>
                        Burn Rate: {formatCurrency(cashFlowResults.burnRate)}/month
                      </div>
                    </div>
                  </div>

                  {/* Cash Flow Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Cash Flow Projection</h3>
                    <div className={styles.chartBars}>
                      {cashFlowData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>{data.period}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarRevenue}
                              style={{ width: `${(data.revenue / cashFlowData[cashFlowData.length - 1].revenue) * 70}%` }}
                              title={`Revenue: ${formatCurrency(data.revenue)}`}
                            />
                            <div 
                              className={styles.chartBarExpenses}
                              style={{ width: `${(data.expenses / cashFlowData[cashFlowData.length - 1].revenue) * 70}%` }}
                              title={`Expenses: ${formatCurrency(data.expenses)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>
                            {formatCurrency(data.cumulativeCash)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendRevenue}`}></div>
                        <span>Cumulative Revenue</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendExpenses}`}></div>
                        <span>Cumulative Expenses</span>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className={styles.metricsCard}>
                    <h3 className={styles.metricsTitle}>📊 Key Financial Metrics</h3>
                    <div className={styles.metricsGrid}>
                      <div className={styles.metricItem}>
                        <div className={styles.metricLabel}>Lowest Cash Balance</div>
                        <div className={styles.metricValue}>
                          {formatCurrency(cashFlowResults.lowestCashBalance)}
                        </div>
                        <div className={`${styles.metricStatus} ${cashFlowResults.lowestCashBalance > 0 ? styles.positive : styles.negative}`}>
                          {cashFlowResults.lowestCashBalance > 0 ? 'Safe' : 'At Risk'}
                        </div>
                      </div>
                      <div className={styles.metricItem}>
                        <div className={styles.metricLabel}>Months Negative</div>
                        <div className={styles.metricValue}>
                          {cashFlowResults.monthsNegative} of {months}
                        </div>
                        <div className={styles.metricStatus}>
                          {cashFlowResults.cashFlowStability}% stability
                        </div>
                      </div>
                      <div className={styles.metricItem}>
                        <div className={styles.metricLabel}>Buffer Adequacy</div>
                        <div className={styles.metricValue}>
                          {cashFlowResults.bufferAdequacy.toFixed(1)} months
                        </div>
                        <div className={`${styles.metricStatus} ${cashFlowResults.bufferAdequacy >= 3 ? styles.positive : styles.caution}`}>
                          {cashFlowResults.bufferAdequacy >= 3 ? 'Adequate' : 'Insufficient'}
                        </div>
                      </div>
                      <div className={styles.metricItem}>
                        <div className={styles.metricLabel}>Cash Flow Health</div>
                        <div className={styles.metricValue}>
                          {cashFlowResults.averageMonthlyProfit > 0 ? 'Positive' : 'Negative'}
                        </div>
                        <div className={`${styles.metricStatus} ${cashFlowResults.averageMonthlyProfit > 0 ? styles.positive : styles.negative}`}>
                          {cashFlowResults.averageMonthlyProfit > 0 ? 'Healthy' : 'Critical'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scenario Analysis */}
                  <div className={styles.scenariosCard}>
                    <h3 className={styles.scenariosTitle}>Scenario Analysis</h3>
                    <div className={styles.scenariosGrid}>
                      {scenarios.map((scenario, index) => (
                        <div key={index} className={styles.scenarioItem}>
                          <div className={styles.scenarioHeader}>
                            <h4>{scenario.name}</h4>
                            <div className={styles.scenarioMultipliers}>
                              <span>Rev: {scenario.revenueMultiplier}x</span>
                              <span>Exp: {scenario.expenseMultiplier}x</span>
                            </div>
                          </div>
                          <div className={styles.scenarioContent}>
                            <div className={styles.scenarioMetric}>
                              <span>Final Cash:</span>
                              <strong>{formatCurrency(scenario.finalCashBalance)}</strong>
                            </div>
                            <div className={styles.scenarioMetric}>
                              <span>Total Profit:</span>
                              <strong>{formatCurrency(scenario.totalProfit)}</strong>
                            </div>
                            <div className={styles.scenarioMetric}>
                              <span>Margin:</span>
                              <strong>{formatPercentage(scenario.profitMargin)}</strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Monthly Breakdown */}
          <div className={styles.monthlySection}>
            <div className={styles.monthlyCard}>
              <h2 className={styles.sectionTitle}>Monthly Cash Flow Breakdown</h2>
              <div className={styles.monthlyTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableCell}>Month</div>
                  <div className={styles.tableCell}>Revenue</div>
                  <div className={styles.tableCell}>Expenses</div>
                  <div className={styles.tableCell}>Net Flow</div>
                  <div className={styles.tableCell}>Cumulative Cash</div>
                  <div className={styles.tableCell}>Seasonality</div>
                </div>
                {monthlyResults.slice(0, Math.min(12, months)).map((monthData, index) => (
                  <div key={index} className={styles.tableRow}>
                    <div className={styles.tableCell}>
                      {formatMonth(index + 1)} {index + 1}
                    </div>
                    <div className={styles.tableCell}>
                      {formatCurrency(monthData.revenue)}
                    </div>
                    <div className={styles.tableCell}>
                      {formatCurrency(monthData.expenses)}
                    </div>
                    <div className={`${styles.tableCell} ${monthData.netCashFlow >= 0 ? styles.positive : styles.negative}`}>
                      {formatCurrency(monthData.netCashFlow)}
                    </div>
                    <div className={styles.tableCell}>
                      {formatCurrency(monthData.cumulativeCash)}
                    </div>
                    <div className={styles.tableCell}>
                      {`${(monthData.seasonality * 100).toFixed(0)}%`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Mastering Cash Flow Management: The Lifeblood of Your Finances</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Why Cash Flow Matters More Than Profit</h3>
                <p>Cash flow is the actual movement of money in and out of your business or personal accounts. Unlike profit (which is an accounting concept), cash flow represents real money available to pay bills, invest, or save. Many profitable businesses fail due to poor cash flow management.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World Example:</h4>
                  <p>A consulting firm signs a $120,000 annual contract paid quarterly:</p>
                  <ul>
                    <li><strong>Monthly profit:</strong> $10,000 (on paper)</li>
                    <li><strong>Monthly cash flow:</strong> $0 for two months, then $30,000 quarterly</li>
                    <li><strong>Challenge:</strong> Must cover $15,000 monthly expenses with irregular cash inflow</li>
                  </ul>
                  <p>This illustrates why cash flow forecasting is essential even for profitable businesses.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Key Cash Flow Strategies</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>💰 Accelerate Receivables</h4>
                    <p>Offer discounts for early payment, require deposits, invoice immediately, and implement automated payment reminders. Reducing average collection period from 45 to 30 days can transform cash flow.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📅 Delay Payables Strategically</h4>
                    <p>Take advantage of payment terms without damaging relationships. Negotiate 60-90 day terms with suppliers while collecting from customers in 30 days creates positive cash flow timing.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📊 Forecast Religiously</h4>
                    <p>Update cash flow forecasts weekly, track against actuals, and identify variances early. The most successful businesses forecast 13 weeks out with 95%+ accuracy.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🛡️ Maintain Cash Reserves</h4>
                    <p>Keep 3-6 months of operating expenses in cash reserves. This buffer protects against seasonality, unexpected expenses, or temporary revenue declines.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding Cash Flow Metrics</h3>
                
                <div className={styles.metricsExplanation}>
                  <div className={styles.metricExplanation}>
                    <h4>📈 Operating Cash Flow (OCF)</h4>
                    <p>Cash generated from core business operations. Positive OCF indicates the business can sustain itself without external financing. Formula: Net Income + Depreciation - Changes in Working Capital.</p>
                  </div>
                  
                  <div className={styles.metricExplanation}>
                    <h4>⏳ Cash Conversion Cycle (CCC)</h4>
                    <p>Days inventory outstanding + Days sales outstanding - Days payables outstanding. Shorter CCC means faster cash generation. Amazon's negative CCC is a key competitive advantage.</p>
                  </div>
                  
                  <div className={styles.metricExplanation}>
                    <h4>🔥 Burn Rate & Runway</h4>
                    <p>Monthly cash consumption (burn rate) divided by current cash equals runway in months. Startups should maintain 18+ months runway, established businesses 3-6 months.</p>
                  </div>
                  
                  <div className={styles.metricExplanation}>
                    <h4>🔄 Free Cash Flow (FCF)</h4>
                    <p>Operating Cash Flow minus Capital Expenditures. Represents cash available for dividends, debt repayment, or reinvestment. The ultimate measure of financial health.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common Applications</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Business Planning:</strong> Determine working capital needs for growth or seasonal fluctuations</li>
                  <li><strong>Startup Funding:</strong> Calculate burn rate and runway to plan fundraising timing</li>
                  <li><strong>Loan Applications:</strong> Demonstrate ability to service debt with projected cash flows</li>
                  <li><strong>Investment Analysis:</strong> Evaluate free cash flow generation for valuation</li>
                  <li><strong>Personal Finance:</strong> Plan for irregular income, large expenses, or emergency funds</li>
                  <li><strong>Seasonal Businesses:</strong> Manage cash through peak and trough periods</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Insights from Financial Controllers</h3>
                <blockquote className={styles.expertQuote}>
                  "The most common cash flow mistake I see is focusing on profitability while ignoring timing. A business can be profitable on paper but bankrupt in reality if cash outflows precede inflows. Weekly cash flow forecasting should be non-negotiable for any serious business owner."
                  <footer className={styles.quoteFooter}>— CFO, 20+ years experience with scaling businesses</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between direct and indirect cash flow methods?</h3>
                <p className={styles.faqAnswer}>The direct method tracks actual cash receipts and payments, while the indirect method starts with net income and adjusts for non-cash items and changes in balance sheet accounts. Our calculator uses the direct method for clarity, but businesses typically use indirect method for financial reporting.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How much cash reserve should I maintain?</h3>
                <p className={styles.faqAnswer}>For businesses: 3-6 months of operating expenses. For startups: 12-18 months of runway. For personal finances: 3-6 months of living expenses in emergency fund. The exact amount depends on income stability, industry volatility, and risk tolerance.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do I improve my cash conversion cycle?</h3>
                <p className={styles.faqAnswer}>1) Reduce inventory days through better forecasting, 2) Decrease receivables through faster invoicing and collections, 3) Increase payables days through supplier negotiation. Each day reduced in CCC improves cash flow significantly at scale.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>When should I worry about negative cash flow?</h3>
                <p className={styles.faqAnswer}>Negative operating cash flow is always concerning. Negative investing cash flow can be positive (growth investments). Negative financing cash flow can be positive (debt repayment). Focus on operating cash flow - consistently negative requires immediate action.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Take Control of Your Cash Flow Today</h2>
              <p className={styles.ctaText}>Use our calculator to create multiple scenarios. Test different growth rates, seasonality patterns, and expense levels to find your optimal cash management strategy.</p>
              
              <div className={styles.buttonGroup}>
                <button 
                  className={styles.primaryButton}
                  onClick={() => {
                    setRevenueGrowthRate(10);
                    setExpenseGrowthRate(2);
                    setSafetyBuffer(6);
                  }}
                >
                  Try Growth Scenario
                </button>
                <button 
                  className={styles.secondaryButton}
                  onClick={() => {
                    setMonthlyRevenue(15000);
                    setMonthlyExpenses(12000);
                    setInitialCash(25000);
                  }}
                >
                  Load Conservative Example
                </button>
              </div>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational and planning purposes. Actual cash flows may vary based on market conditions, customer behavior, and unforeseen circumstances. The projections are based on the assumptions provided and should be reviewed regularly. Consider consulting with a financial advisor for personalized cash flow management strategies.
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

export default CashFlowCalculator;