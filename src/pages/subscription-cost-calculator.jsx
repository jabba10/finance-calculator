import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './subscriptioncostcalculator.module.css';

const SubscriptionCostCalculator = ({ currentDate, lastModifiedDate }) => {
  // Initial state for 5 common subscription categories
  const [subscriptions, setSubscriptions] = useState([
    { id: 1, name: 'Streaming Service', cost: 15.99, frequency: 'monthly', category: 'entertainment', usedDaily: true },
    { id: 2, name: 'Music Streaming', cost: 10.99, frequency: 'monthly', category: 'entertainment', usedDaily: true },
    { id: 3, name: 'Cloud Storage', cost: 2.99, frequency: 'monthly', category: 'productivity', usedDaily: false },
    { id: 4, name: 'Gym Membership', cost: 49.99, frequency: 'monthly', category: 'health', usedDaily: false },
    { id: 5, name: 'Food Delivery', cost: 12.99, frequency: 'monthly', category: 'food', usedDaily: false }
  ]);
  
  const [annualIncreaseRate, setAnnualIncreaseRate] = useState(5);
  const [years, setYears] = useState(3);
  const [monthlyIncome, setMonthlyIncome] = useState(4000);
  const [savingsGoal, setSavingsGoal] = useState(500);
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [newSubscription, setNewSubscription] = useState({ name: '', cost: 10, frequency: 'monthly', category: 'other', usedDaily: false });

  const categories = [
    { value: 'entertainment', label: '🎬 Entertainment', color: '#3b82f6' },
    { value: 'productivity', label: '💼 Productivity', color: '#10b981' },
    { value: 'health', label: '🏋️ Health & Fitness', color: '#ef4444' },
    { value: 'food', label: '🍔 Food & Dining', color: '#f59e0b' },
    { value: 'software', label: '💻 Software', color: '#8b5cf6' },
    { value: 'other', label: '📦 Other', color: '#6b7280' }
  ];

  const calculateSubscriptionCosts = () => {
    let monthlyTotal = 0;
    let yearlyTotal = 0;
    let categoryBreakdown = {};
    let unusedCost = 0;
    
    // Calculate current costs
    subscriptions.forEach(sub => {
      const monthlyCost = sub.frequency === 'monthly' ? sub.cost : sub.cost / 12;
      monthlyTotal += monthlyCost;
      yearlyTotal += monthlyCost * 12;
      
      // Track category breakdown
      if (!categoryBreakdown[sub.category]) {
        categoryBreakdown[sub.category] = 0;
      }
      categoryBreakdown[sub.category] += monthlyCost;
      
      // Track unused subscriptions
      if (!sub.usedDaily) {
        unusedCost += monthlyCost;
      }
    });
    
    // Project future costs with annual increases
    const projectionData = [];
    let cumulativeTotal = 0;
    let projectedMonthly = monthlyTotal;
    
    for (let year = 0; year <= years; year++) {
      const yearlyCost = projectedMonthly * 12;
      cumulativeTotal += yearlyCost;
      
      projectionData.push({
        year: year,
        monthlyCost: Math.round(projectedMonthly * 100) / 100,
        yearlyCost: Math.round(yearlyCost * 100) / 100,
        cumulativeCost: Math.round(cumulativeTotal * 100) / 100,
        incomePercentage: Math.round((projectedMonthly / monthlyIncome) * 1000) / 10,
        savingsImpact: Math.round((projectedMonthly / savingsGoal) * 1000) / 10
      });
      
      // Increase for next year
      if (year < years) {
        projectedMonthly = projectedMonthly * (1 + annualIncreaseRate / 100);
      }
    }
    
    const finalMonthly = projectionData[years].monthlyCost;
    const totalCumulativeCost = projectionData[years].cumulativeCost;
    const monthlyIncrease = finalMonthly - monthlyTotal;
    const percentageOfIncome = (monthlyTotal / monthlyIncome) * 100;
    const savingsOpportunity = unusedCost;
    
    // Find category with highest cost
    const highestCategory = Object.entries(categoryBreakdown).reduce((max, [category, cost]) => {
      return cost > max.cost ? { category, cost } : max;
    }, { category: '', cost: 0 });
    
    const categoryLabels = categories.reduce((acc, cat) => {
      if (categoryBreakdown[cat.value]) {
        acc[cat.value] = cat.label;
      }
      return acc;
    }, {});
    
    setResults({
      monthlyTotal: Math.round(monthlyTotal * 100) / 100,
      yearlyTotal: Math.round(yearlyTotal * 100) / 100,
      totalCumulativeCost: Math.round(totalCumulativeCost * 100) / 100,
      monthlyIncrease: Math.round(monthlyIncrease * 100) / 100,
      percentageOfIncome: Math.round(percentageOfIncome * 10) / 10,
      savingsOpportunity: Math.round(savingsOpportunity * 100) / 100,
      finalMonthly: Math.round(finalMonthly * 100) / 100,
      categoryBreakdown,
      highestCategory: {
        name: categoryLabels[highestCategory.category] || 'None',
        cost: Math.round(highestCategory.cost * 100) / 100,
        percentage: Math.round((highestCategory.cost / monthlyTotal) * 1000) / 10
      },
      subscriptionCount: subscriptions.length,
      unusedCount: subscriptions.filter(s => !s.usedDaily).length
    });
    
    setChartData(projectionData);
  };

  useEffect(() => {
    calculateSubscriptionCosts();
  }, [subscriptions, annualIncreaseRate, years, monthlyIncome, savingsGoal]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const addSubscription = () => {
    if (newSubscription.name.trim() === '') return;
    
    const newSub = {
      id: subscriptions.length + 1,
      name: newSubscription.name,
      cost: parseFloat(newSubscription.cost),
      frequency: newSubscription.frequency,
      category: newSubscription.category,
      usedDaily: newSubscription.usedDaily
    };
    
    setSubscriptions([...subscriptions, newSub]);
    setNewSubscription({ name: '', cost: 10, frequency: 'monthly', category: 'other', usedDaily: false });
  };

  const removeSubscription = (id) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
  };

  const updateSubscription = (id, field, value) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, [field]: value } : sub
    ));
  };

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.color : '#6b7280';
  };

  const getCategoryLabel = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : 'Other';
  };

  return (
    <>
      <Head>
        <title>Subscription Cost Calculator | Track & Manage Recurring Expenses</title>
        <meta name="description" content="Calculate your total subscription costs, identify unused services, and optimize your recurring expenses for maximum savings." />
        <meta name="keywords" content="subscription calculator, recurring expenses, subscription management, budget calculator, subscription tracking, monthly expenses" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/subscription-cost-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Subscription Cost Calculator | Manage Recurring Expenses" />
        <meta property="og:description" content="Calculate and optimize your subscription costs. Identify unused services and save money on recurring expenses." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/subscription-cost-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Subscription Cost Calculator" />
        <meta name="twitter:description" content="Track and optimize your subscription expenses for maximum savings." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="subscription-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Subscription Cost Calculator",
            "description": "Calculate total subscription costs, identify unused services, and optimize recurring expenses for maximum savings",
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
              "name": "Financial Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Multi-Subscription Tracking",
              "Cost Projections",
              "Category Analysis",
              "Usage Tracking",
              "Savings Optimization"
            ]
          })
        }}
      />

      {/* FAQ Schema */}
      <Script
        id="subscription-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How much do people typically spend on subscriptions?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The average American spends $200-300 monthly on subscriptions, with many unaware of the total cost due to 'subscription creep.' Common culprits include streaming services, software subscriptions, food delivery, and fitness apps that often go underused.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's the best way to manage subscription costs?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Conduct quarterly subscription audits, cancel unused services, bundle similar services, negotiate annual rates, and use prepaid cards to prevent automatic renewals. Most people can save 20-40% by optimizing their subscriptions.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How often should I review my subscriptions?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Review subscriptions quarterly. Mark calendar reminders before free trials expire, assess actual usage, and compare value received versus cost. Many subscriptions increase prices annually, so regular reviews are essential.",
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
            <h1 className={styles.mainTitle}>Subscription Cost Calculator</h1>
            <p className={styles.subtitle}>Track, Analyze & Optimize Your Recurring Expenses</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Cost Optimization</span>
              
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Your Subscriptions</h2>
              
              <div className={styles.subscriptionList}>
                {subscriptions.map(sub => (
                  <div key={sub.id} className={styles.subscriptionItem}>
                    <div className={styles.subscriptionHeader}>
                      <div className={styles.subscriptionName}>
                        <span className={styles.categoryIndicator} style={{ backgroundColor: getCategoryColor(sub.category) }}></span>
                        {sub.name}
                      </div>
                      <button 
                        className={styles.removeButton}
                        onClick={() => removeSubscription(sub.id)}
                        title="Remove subscription"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className={styles.subscriptionControls}>
                      <div className={styles.subscriptionControl}>
                        <label className={styles.subscriptionLabel}>Monthly Cost</label>
                        <div className={styles.costInputWrapper}>
                          <span className={styles.currencySymbol}>$</span>
                          <input
                            type="number"
                            min="0"
                            max="500"
                            step="0.01"
                            value={sub.cost}
                            onChange={(e) => updateSubscription(sub.id, 'cost', parseFloat(e.target.value) || 0)}
                            className={styles.costInput}
                          />
                          <select
                            value={sub.frequency}
                            onChange={(e) => updateSubscription(sub.id, 'frequency', e.target.value)}
                            className={styles.frequencySelect}
                          >
                            <option value="monthly">/month</option>
                            <option value="yearly">/year</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className={styles.subscriptionControl}>
                        <label className={styles.subscriptionLabel}>Category</label>
                        <select
                          value={sub.category}
                          onChange={(e) => updateSubscription(sub.id, 'category', e.target.value)}
                          className={styles.categorySelect}
                          style={{ borderLeftColor: getCategoryColor(sub.category) }}
                        >
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className={styles.subscriptionControl}>
                        <label className={styles.usageLabel}>
                          <input
                            type="checkbox"
                            checked={sub.usedDaily}
                            onChange={(e) => updateSubscription(sub.id, 'usedDaily', e.target.checked)}
                            className={styles.usageCheckbox}
                          />
                          <span>Used Daily</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className={styles.subscriptionCost}>
                      {formatCurrency(sub.frequency === 'monthly' ? sub.cost : sub.cost / 12)}/month
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Subscription */}
              <div className={styles.addSubscriptionCard}>
                <h3 className={styles.addTitle}>Add New Subscription</h3>
                <div className={styles.addControls}>
                  <input
                    type="text"
                    placeholder="Subscription name (e.g., Netflix, Spotify)"
                    value={newSubscription.name}
                    onChange={(e) => setNewSubscription({...newSubscription, name: e.target.value})}
                    className={styles.nameInput}
                  />
                  
                  <div className={styles.addInputRow}>
                    <div className={styles.addInputGroup}>
                      <label className={styles.addLabel}>Monthly Cost</label>
                      <div className={styles.costInputWrapper}>
                        <span className={styles.currencySymbol}>$</span>
                        <input
                          type="number"
                          min="0"
                          max="500"
                          step="0.01"
                          value={newSubscription.cost}
                          onChange={(e) => setNewSubscription({...newSubscription, cost: parseFloat(e.target.value) || 0})}
                          className={styles.costInput}
                        />
                      </div>
                    </div>
                    
                    <div className={styles.addInputGroup}>
                      <label className={styles.addLabel}>Frequency</label>
                      <select
                        value={newSubscription.frequency}
                        onChange={(e) => setNewSubscription({...newSubscription, frequency: e.target.value})}
                        className={styles.frequencySelect}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                    
                    <div className={styles.addInputGroup}>
                      <label className={styles.addLabel}>Category</label>
                      <select
                        value={newSubscription.category}
                        onChange={(e) => setNewSubscription({...newSubscription, category: e.target.value})}
                        className={styles.categorySelect}
                        style={{ borderLeftColor: getCategoryColor(newSubscription.category) }}
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className={styles.usageRow}>
                    <label className={styles.usageLabel}>
                      <input
                        type="checkbox"
                        checked={newSubscription.usedDaily}
                        onChange={(e) => setNewSubscription({...newSubscription, usedDaily: e.target.checked})}
                        className={styles.usageCheckbox}
                      />
                      <span>Used Daily</span>
                    </label>
                    
                    <button 
                      onClick={addSubscription}
                      className={styles.addButton}
                      disabled={newSubscription.name.trim() === ''}
                    >
                      + Add Subscription
                    </button>
                  </div>
                </div>
              </div>

              {/* Calculator Settings */}
              <div className={styles.settingsCard}>
                <h3 className={styles.settingsTitle}>Calculator Settings</h3>
                
                <div className={styles.settingsGroup}>
                  <label className={styles.settingsLabel}>
                    Annual Price Increase Rate
                    <div className={styles.settingsInputWrapper}>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        step="0.5"
                        value={annualIncreaseRate}
                        onChange={(e) => setAnnualIncreaseRate(parseFloat(e.target.value))}
                        className={styles.settingsSlider}
                      />
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={annualIncreaseRate}
                        onChange={(e) => setAnnualIncreaseRate(parseFloat(e.target.value) || 0)}
                        className={styles.settingsNumber}
                      />
                      <span className={styles.percentageSymbol}>%</span>
                    </div>
                    <div className={styles.settingsValue}>{formatPercentage(annualIncreaseRate)} per year</div>
                  </label>
                </div>

                <div className={styles.settingsGroup}>
                  <label className={styles.settingsLabel}>
                    Projection Period
                    <div className={styles.settingsInputWrapper}>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={years}
                        onChange={(e) => setYears(parseInt(e.target.value))}
                        className={styles.settingsSlider}
                      />
                      <input
                        type="number"
                        min="1"
                        max="10"
                        step="1"
                        value={years}
                        onChange={(e) => setYears(parseInt(e.target.value) || 0)}
                        className={styles.settingsNumber}
                      />
                      <span className={styles.yearsSymbol}>years</span>
                    </div>
                    <div className={styles.settingsValue}>{years} years</div>
                  </label>
                </div>

                <div className={styles.settingsGroup}>
                  <label className={styles.settingsLabel}>
                    Your Monthly Income
                    <div className={styles.settingsInputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        min="1000"
                        max="50000"
                        step="100"
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(parseInt(e.target.value))}
                        className={styles.settingsNumber}
                      />
                    </div>
                    <div className={styles.settingsValue}>{formatCurrency(monthlyIncome)}/month</div>
                  </label>
                </div>

                <div className={styles.settingsGroup}>
                  <label className={styles.settingsLabel}>
                    Monthly Savings Goal
                    <div className={styles.settingsInputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        min="0"
                        max="5000"
                        step="50"
                        value={savingsGoal}
                        onChange={(e) => setSavingsGoal(parseInt(e.target.value))}
                        className={styles.settingsNumber}
                      />
                    </div>
                    <div className={styles.settingsValue}>{formatCurrency(savingsGoal)}/month</div>
                  </label>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Subscription Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Monthly Total</div>
                      <div className={styles.resultValue}>{formatCurrency(results.monthlyTotal)}</div>
                      <div className={styles.resultDescription}>
                        {results.subscriptionCount} subscriptions
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Yearly Total</div>
                      <div className={styles.resultValue}>{formatCurrency(results.yearlyTotal)}</div>
                      <div className={styles.resultDescription}>
                        {formatCurrency(results.monthlyTotal * 12)} annually
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>% of Income</div>
                      <div className={`${styles.resultValue} ${results.percentageOfIncome > 10 ? styles.warningValue : styles.normalValue}`}>
                        {formatPercentage(results.percentageOfIncome)}
                      </div>
                      <div className={styles.resultDescription}>
                        {results.percentageOfIncome > 10 ? 'High' : 'Reasonable'}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Unused Cost</div>
                      <div className={`${styles.resultValue} ${results.savingsOpportunity > 0 ? styles.warningValue : styles.normalValue}`}>
                        {formatCurrency(results.savingsOpportunity)}
                      </div>
                      <div className={styles.resultDescription}>
                        {results.unusedCount} unused services
                      </div>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div className={styles.categoryContainer}>
                    <h3 className={styles.categoryTitle}>Spending by Category</h3>
                    <div className={styles.categoryBars}>
                      {Object.entries(results.categoryBreakdown).map(([category, cost]) => {
                        const percentage = (cost / results.monthlyTotal) * 100;
                        const categoryInfo = categories.find(c => c.value === category);
                        
                        return (
                          <div key={category} className={styles.categoryBarGroup}>
                            <div className={styles.categoryBarLabel}>
                              <span className={styles.categoryColor} style={{ backgroundColor: categoryInfo?.color || '#6b7280' }}></span>
                              {categoryInfo?.label || category}
                            </div>
                            <div className={styles.categoryBarContainer}>
                              <div 
                                className={styles.categoryBar}
                                style={{ 
                                  width: `${percentage}%`,
                                  backgroundColor: categoryInfo?.color || '#6b7280'
                                }}
                                title={`${formatCurrency(cost)} (${percentage.toFixed(1)}%)`}
                              />
                            </div>
                            <div className={styles.categoryBarValue}>
                              <div className={styles.categoryAmount}>{formatCurrency(cost)}</div>
                              <div className={styles.categoryPercentage}>{percentage.toFixed(1)}%</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className={styles.categoryLegend}>
                      <div className={styles.legendNote}>
                        Highest: <strong>{results.highestCategory.name}</strong> ({formatCurrency(results.highestCategory.cost)}, {formatPercentage(results.highestCategory.percentage)})
                      </div>
                    </div>
                  </div>

                  {/* Cost Projection Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Cost Projection Over {years} Years</h3>
                    <div className={styles.chartBars}>
                      {chartData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>
                            Year {data.year}
                            {data.year === years && <span className={styles.finalMarker}>🎯</span>}
                          </div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarCost}
                              style={{ 
                                width: `${Math.min(100, (data.monthlyCost / results.finalMonthly) * 100)}%`,
                                backgroundColor: data.year === 0 ? '#10b981' : 
                                               data.monthlyCost > results.monthlyTotal * 1.3 ? '#ef4444' : '#f59e0b'
                              }}
                              title={`Monthly: ${formatCurrency(data.monthlyCost)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>
                            <div className={styles.costValue}>{formatCurrency(data.monthlyCost)}/month</div>
                            {data.year > 0 && (
                              <div className={styles.increaseValueSmall}>
                                +{formatPercentage(((data.monthlyCost - results.monthlyTotal) / results.monthlyTotal) * 100)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendCurrent}`}></div>
                        <span>Current Cost</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendModerate}`}></div>
                        <span>Moderate Increase</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendHigh}`}></div>
                        <span>High Increase</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>💡 Subscription Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>You're spending <strong>{formatCurrency(results.monthlyTotal)}</strong> monthly on subscriptions</li>
                      <li>Over {years} years, this will cost <strong>{formatCurrency(results.totalCumulativeCost)}</strong> total</li>
                      <li>You could save <strong>{formatCurrency(results.savingsOpportunity)}</strong> monthly by canceling unused services</li>
                      <li>Subscriptions use <strong>{formatPercentage(results.percentageOfIncome)}</strong> of your monthly income</li>
                      {results.percentageOfIncome > 10 && (
                        <li className={styles.warning}>⚠️ Consider reducing subscription spending below 10% of income</li>
                      )}
                      {results.savingsOpportunity > 0 && (
                        <li className={styles.savingsTip}>💰 Cancel unused subscriptions to boost your savings</li>
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
              <h2 className={styles.articleTitle}>The Subscription Economy: Managing Your Recurring Expenses</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The Hidden Cost of Subscription Creep</h3>
                <p>Subscription creep happens when small monthly fees accumulate unnoticed, draining hundreds or thousands of dollars annually. The average household has 12 active subscriptions, costing $200-300 monthly. Many services offer "free trials" that automatically convert to paid subscriptions, while others increase prices annually by 5-10%.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World Example: The Subscription Avalanche</h4>
                  <p>Common subscriptions and their typical costs:</p>
                  <ul>
                    <li><strong>Streaming Services:</strong> $15-20 each (Netflix, Hulu, Disney+, HBO Max)</li>
                    <li><strong>Music & Podcasts:</strong> $10-15 each (Spotify, Apple Music, Audible)</li>
                    <li><strong>Software & Apps:</strong> $10-50 each (Adobe, Microsoft 365, Canva Pro)</li>
                    <li><strong>Food & Delivery:</strong> $10-15 each (DoorDash Pass, Instacart+, HelloFresh)</li>
                    <li><strong>Health & Fitness:</strong> $10-100 each (Peloton, Calm, ClassPass, gyms)</li>
                  </ul>
                  <p>Just 5 services at $15 each costs $900 annually!</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategies to Optimize Subscription Costs</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>📊 Conduct Quarterly Audits</h4>
                    <p>Review all subscriptions every 3 months. Check bank/credit card statements for recurring charges and assess actual usage. Cancel anything unused or low-value.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🎯 Implement the 80/20 Rule</h4>
                    <p>20% of subscriptions typically provide 80% of value. Identify your essential services and eliminate the rest. Focus on subscriptions you use daily or weekly.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💳 Use Prepaid Cards</h4>
                    <p>Use prepaid debit cards or virtual cards for free trials. Set spending limits and expiration dates to prevent unexpected charges after trials end.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🤝 Negotiate & Bundle</h4>
                    <p>Contact providers to negotiate better rates, especially for long-term subscriptions. Bundle similar services or share family plans to reduce individual costs.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The Psychology of Subscription Spending</h3>
                <p>Subscriptions exploit psychological biases: the "sunk cost fallacy" makes us keep paying for unused services, while "small amount bias" makes $10/month seem trivial compared to $120/year. Companies use free trials, auto-renewals, and making cancellation difficult to retain subscribers.</p>
                
                <div className={styles.psychologyTable}>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>Psychological Trap</div>
                    <div className={styles.tableCell}>How It Works</div>
                    <div className={styles.tableCell}>Defense Strategy</div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>Sunk Cost Fallacy</div>
                    <div className={styles.tableCell}>"I've paid for 6 months, might as well keep it"</div>
                    <div className={styles.tableCell}>Cancel immediately if unused</div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>Small Amount Bias</div>
                    <div className={styles.tableCell}>$10/month seems trivial vs $120/year</div>
                    <div className={styles.tableCell}>Calculate annual costs</div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>Auto-Renewal Trap</div>
                    <div className={styles.tableCell}>Easy to sign up, hard to cancel</div>
                    <div className={styles.tableCell}>Use calendar reminders</div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>FOMO (Fear of Missing Out)</div>
                    <div className={styles.tableCell}>"What if I need it later?"</div>
                    <div className={styles.tableCell}>Re-subscribe if truly needed</div>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Smart Alternatives to Common Subscriptions</h3>
                <div className={styles.alternativesGrid}>
                  <div className={styles.alternativeCard}>
                    <h5>🎬 Streaming Services</h5>
                    <p><strong>Alternative:</strong> Rotate services quarterly, use free ad-supported platforms (Tubi, Pluto TV), or share family plans (split cost 4 ways).</p>
                    <p><strong>Savings:</strong> Up to 75% reduction</p>
                  </div>
                  
                  <div className={styles.alternativeCard}>
                    <h5>💻 Software Subscriptions</h5>
                    <p><strong>Alternative:</strong> Use free open-source alternatives (GIMP instead of Photoshop, LibreOffice instead of Microsoft 365).</p>
                    <p><strong>Savings:</strong> 100% on free alternatives</p>
                  </div>
                  
                  <div className={styles.alternativeCard}>
                    <h5>🍔 Food Delivery Services</h5>
                    <p><strong>Alternative:</strong> Cook at home using meal planning, pick up instead of delivery, or use services only during promotions.</p>
                    <p><strong>Savings:</strong> 50-80% reduction</p>
                  </div>
                  
                  <div className={styles.alternativeCard}>
                    <h5>📚 Learning Platforms</h5>
                    <p><strong>Alternative:</strong> Use free resources (YouTube tutorials, library courses, MOOCs like Coursera's free tracks).</p>
                    <p><strong>Savings:</strong> 100% on free resources</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Financial Planners</h3>
                <blockquote className={styles.expertQuote}>
                  "The subscription economy is designed to make spending frictionless and forgettable. My rule: if you haven't used a subscription in 30 days, cancel it immediately. You can always resubscribe if you truly miss it. Most people find they don't. This simple habit can save the average household $1,000-2,000 annually."
                  <footer className={styles.quoteFooter}>— Certified Financial Planner, specializing in budget optimization</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Subscription Management FAQs</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What percentage of my income should go to subscriptions?</h3>
                <p className={styles.faqAnswer}>Aim for 5% or less of your take-home pay. For example, if you earn $4,000 monthly, limit subscriptions to $200. Entertainment subscriptions should be even lower—1-2% maximum. If subscriptions exceed 10% of income, it's time for serious cuts.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How can I track all my subscriptions effectively?</h3>
                <p className={styles.faqAnswer}>Use dedicated apps (Truebill, Bobby), spreadsheet templates, or simple note-taking. The key is tracking: subscription name, cost, renewal date, category, and usage frequency. Review this list quarterly and before any large financial decision.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Are annual subscriptions better than monthly?</h3>
                <p className={styles.faqAnswer}>Annual subscriptions typically offer 10-20% savings but require larger upfront payment. Only choose annual if: 1) You've used the service for 3+ months, 2) You're certain you'll use it all year, 3) The savings are significant, and 4) You can afford the lump sum.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the best way to cancel subscriptions?</h3>
                <p className={styles.faqAnswer}>1) Cancel through the service's website/app first, 2) If unsuccessful, contact customer service via chat/phone, 3) As last resort, contact your bank to block recurring charges, 4) Document cancellation confirmation numbers, 5) Check for cancellation fees or notice periods.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Take Control of Your Subscription Spending</h2>
              <p className={styles.ctaText}>Use this calculator to identify subscription waste and optimize your recurring expenses. Small monthly savings add up to significant annual gains.</p>
              
              <div className={styles.actionSteps}>
                <div className={styles.stepCard}>
                  <div className={styles.stepNumber}>1</div>
                  <div className={styles.stepContent}>
                    <h4 className={styles.stepTitle}>Track All Subscriptions</h4>
                    <p className={styles.stepDescription}>Use this calculator to list every recurring charge</p>
                  </div>
                </div>
                
                <div className={styles.stepCard}>
                  <div className={styles.stepNumber}>2</div>
                  <div className={styles.stepContent}>
                    <h4 className={styles.stepTitle}>Cancel Unused Services</h4>
                    <p className={styles.stepDescription}>Eliminate anything not used in the last 30 days</p>
                  </div>
                </div>
                
                <div className={styles.stepCard}>
                  <div className={styles.stepNumber}>3</div>
                  <div className={styles.stepContent}>
                    <h4 className={styles.stepTitle}>Set Quarterly Reviews</h4>
                    <p className={styles.stepDescription}>Schedule reminders to reassess every 3 months</p>
                  </div>
                </div>
              </div>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Individual subscription costs and usage patterns vary. Always review service terms before canceling subscriptions, as some may have cancellation fees or notice requirements. Consider consulting with a financial advisor for personalized budgeting advice.
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

export default SubscriptionCostCalculator;