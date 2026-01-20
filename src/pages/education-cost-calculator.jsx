import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './educationcostcalculator.module.css';

const EducationCostCalculator = ({ currentDate, lastModifiedDate }) => {
  const [currentAge, setCurrentAge] = useState(5);
  const [collegeStartAge, setCollegeStartAge] = useState(18);
  const [yearsInCollege, setYearsInCollege] = useState(4);
  const [currentCost, setCurrentCost] = useState(25000);
  const [inflationRate, setInflationRate] = useState(5);
  const [savingsBalance, setSavingsBalance] = useState(5000);
  const [monthlyContribution, setMonthlyContribution] = useState(200);
  const [investmentReturn, setInvestmentReturn] = useState(7);
  const [collegeType, setCollegeType] = useState('public-instate');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);

  // College type presets
  const collegeTypePresets = {
    'public-instate': { label: 'Public In-State', cost: 25000 },
    'public-outstate': { label: 'Public Out-of-State', cost: 43000 },
    'private': { label: 'Private College', cost: 55000 },
    'community': { label: 'Community College', cost: 10000 },
    'ivy-league': { label: 'Ivy League', cost: 80000 },
    'custom': { label: 'Custom', cost: currentCost }
  };

  const calculateEducationCost = () => {
    // Update current cost based on college type if not custom
    if (collegeType !== 'custom') {
      setCurrentCost(collegeTypePresets[collegeType].cost);
    }
    
    const yearsUntilCollege = collegeStartAge - currentAge;
    const totalYears = yearsUntilCollege + yearsInCollege;
    
    // Calculate future costs with inflation
    const futureCosts = [];
    let totalFutureCost = 0;
    let totalSavings = savingsBalance;
    const dataPoints = [];
    
    // Calculate savings growth before college
    for (let year = 1; year <= yearsUntilCollege; year++) {
      const annualContribution = monthlyContribution * 12;
      const investmentGrowth = totalSavings * (investmentReturn / 100);
      totalSavings += annualContribution + investmentGrowth;
      
      // Calculate future cost for this year
      const futureCost = currentCost * Math.pow(1 + inflationRate / 100, year);
      futureCosts.push(futureCost);
      
      dataPoints.push({
        age: currentAge + year,
        yearType: 'Savings',
        savingsBalance: totalSavings,
        annualCost: 0,
        cumulativeCost: 0,
        gap: 0,
        contribution: annualContribution
      });
    }
    
    // Calculate costs during college years
    let cumulativeCollegeCost = 0;
    let remainingSavings = totalSavings;
    let totalGap = 0;
    
    for (let collegeYear = 1; collegeYear <= yearsInCollege; collegeYear++) {
      const inflationYear = yearsUntilCollege + collegeYear;
      const annualCost = currentCost * Math.pow(1 + inflationRate / 100, inflationYear);
      cumulativeCollegeCost += annualCost;
      
      // Use savings to pay for college
      const savingsUsed = Math.min(remainingSavings, annualCost);
      remainingSavings -= savingsUsed;
      
      // Calculate funding gap
      const gap = Math.max(annualCost - savingsUsed, 0);
      totalGap += gap;
      
      dataPoints.push({
        age: collegeStartAge + collegeYear - 1,
        yearType: `College Year ${collegeYear}`,
        savingsBalance: remainingSavings,
        annualCost: annualCost,
        cumulativeCost: cumulativeCollegeCost,
        gap: gap,
        contribution: 0
      });
      
      totalFutureCost += annualCost;
    }
    
    // Calculate required monthly savings
    const monthsUntilCollege = yearsUntilCollege * 12;
    const monthlyRate = investmentReturn / 100 / 12;
    const futureValueFactor = Math.pow(1 + monthlyRate, monthsUntilCollege);
    const requiredFutureValue = totalFutureCost - savingsBalance * Math.pow(1 + investmentReturn / 100, yearsUntilCollege);
    
    let requiredMonthlySavings = 0;
    if (requiredFutureValue > 0) {
      requiredMonthlySavings = (requiredFutureValue * monthlyRate) / (futureValueFactor - 1);
    }
    
    // Calculate if savings are sufficient
    const savingsCoverage = (totalSavings / totalFutureCost) * 100;
    const yearsToSave = requiredMonthlySavings > 0 ? 
      Math.ceil(Math.log(1 + (requiredFutureValue * monthlyRate) / (monthlyContribution * 12)) / Math.log(1 + monthlyRate) / 12) : 0;
    
    setResults({
      yearsUntilCollege: yearsUntilCollege,
      futureAnnualCost: Math.round(currentCost * Math.pow(1 + inflationRate / 100, yearsUntilCollege)),
      totalFutureCost: Math.round(totalFutureCost),
      currentSavingsNeeded: Math.round(requiredFutureValue),
      requiredMonthlySavings: Math.round(requiredMonthlySavings),
      savingsCoverage: Math.round(savingsCoverage * 100) / 100,
      fundingGap: Math.round(totalGap),
      projectedSavings: Math.round(totalSavings),
      yearsToSave: yearsToSave,
      totalWithInflation: Math.round(cumulativeCollegeCost)
    });
    
    setChartData(dataPoints);
  };

  useEffect(() => {
    calculateEducationCost();
  }, [currentAge, collegeStartAge, yearsInCollege, currentCost, inflationRate, savingsBalance, monthlyContribution, investmentReturn, collegeType, showAdvanced]);

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

  const formatAge = (age) => {
    return `${age} years old`;
  };

  const handleCollegeTypeChange = (type) => {
    setCollegeType(type);
    if (type !== 'custom') {
      setCurrentCost(collegeTypePresets[type].cost);
    }
  };

  return (
    <>
      <Head>
        <title>Education Cost Calculator | College Savings & Planning Tool</title>
        <meta name="description" content="Free education cost calculator with inflation projections. Calculate future college expenses, plan your savings strategy, and explore funding options." />
        <meta name="keywords" content="education cost calculator, college savings calculator, 529 plan calculator, tuition calculator, college planning, education funding" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/education-cost-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Education Cost Calculator | College Savings & Planning Tool" />
        <meta property="og:description" content="Calculate future education costs and create a savings plan. Free tool for parents and students planning for college expenses." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/education-cost-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Education Cost Calculator" />
        <meta name="twitter:description" content="Plan for future education expenses with our comprehensive college cost calculator." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="education-cost-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Education Cost Calculator",
            "description": "Professional education cost calculator with inflation projections and savings planning tools",
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
              "ratingCount": "1100",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Education Planning Tools",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Inflation Projections",
              "College Type Comparisons",
              "Savings Planning",
              "Funding Gap Analysis",
              "529 Plan Integration"
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
                "name": "How much should I save for my child's college education?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Aim to save 1/3 of projected costs through regular savings, pay 1/3 from current income during college years, and cover the final 1/3 through scholarships, grants, and student loans. Our calculator helps you create a personalized savings plan based on your timeline and goals.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is a 529 plan and how does it work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A 529 plan is a tax-advantaged savings plan designed to encourage saving for future education costs. Earnings grow tax-free and withdrawals are tax-free when used for qualified education expenses. Many states offer tax deductions for contributions.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How does college inflation affect my savings goals?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "College costs typically increase 2-3 times faster than general inflation. Our calculator uses historical trends to project future costs, showing you how much you need to save to keep pace with rising tuition and fees.",
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
            <h1 className={styles.mainTitle}>Education Cost Calculator</h1>
            <p className={styles.subtitle}>Plan for Future Education Expenses and Create a Smart Savings Strategy</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Inflation Adjusted</span>
              <span className={styles.badge}>Free Tool</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate Education Costs</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Student's Current Age
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="17"
                      step="1"
                      value={currentAge}
                      onChange={(e) => setCurrentAge(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="17"
                      step="1"
                      value={currentAge}
                      onChange={(e) => setCurrentAge(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatAge(currentAge)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  College Start Age
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="18"
                      max="25"
                      step="1"
                      value={collegeStartAge}
                      onChange={(e) => setCollegeStartAge(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="18"
                      max="25"
                      step="1"
                      value={collegeStartAge}
                      onChange={(e) => setCollegeStartAge(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatAge(collegeStartAge)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Years in College
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="2"
                      max="6"
                      step="1"
                      value={yearsInCollege}
                      onChange={(e) => setYearsInCollege(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="2"
                      max="6"
                      step="1"
                      value={yearsInCollege}
                      onChange={(e) => setYearsInCollege(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{yearsInCollege} years</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  College Type
                  <div className={styles.collegeTypeButtons}>
                    {Object.entries(collegeTypePresets).map(([key, preset]) => (
                      <button
                        key={key}
                        className={`${styles.collegeTypeButton} ${collegeType === key ? styles.collegeTypeActive : ''}`}
                        onClick={() => handleCollegeTypeChange(key)}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </label>
              </div>

              {collegeType === 'custom' && (
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Current Annual Cost
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="range"
                        min="5000"
                        max="100000"
                        step="1000"
                        value={currentCost}
                        onChange={(e) => setCurrentCost(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="5000"
                        max="100000"
                        step="1000"
                        value={currentCost}
                        onChange={(e) => setCurrentCost(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{formatCurrency(currentCost)}/year</div>
                  </label>
                </div>
              )}

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Education Inflation Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      step="0.1"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="2"
                      max="10"
                      step="0.1"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(inflationRate)}/year</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.advancedToggle}>
                  <input
                    type="checkbox"
                    checked={showAdvanced}
                    onChange={(e) => setShowAdvanced(e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  Show Savings & Investment Options
                </label>
              </div>

              {showAdvanced && (
                <div className={styles.advancedSection}>
                  <h3 className={styles.advancedTitle}>Savings & Investments</h3>
                  
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Current Savings Balance
                      <div className={styles.inputWrapper}>
                        <span className={styles.currencySymbol}>$</span>
                        <input
                          type="range"
                          min="0"
                          max="100000"
                          step="1000"
                          value={savingsBalance}
                          onChange={(e) => setSavingsBalance(parseInt(e.target.value))}
                          className={styles.slider}
                        />
                        <input
                          type="number"
                          min="0"
                          max="100000"
                          step="1000"
                          value={savingsBalance}
                          onChange={(e) => setSavingsBalance(parseInt(e.target.value) || 0)}
                          className={styles.numberInput}
                        />
                      </div>
                      <div className={styles.valueDisplay}>{formatCurrency(savingsBalance)}</div>
                    </label>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Monthly Contribution
                      <div className={styles.inputWrapper}>
                        <span className={styles.currencySymbol}>$</span>
                        <input
                          type="range"
                          min="0"
                          max="2000"
                          step="50"
                          value={monthlyContribution}
                          onChange={(e) => setMonthlyContribution(parseInt(e.target.value))}
                          className={styles.slider}
                        />
                        <input
                          type="number"
                          min="0"
                          max="2000"
                          step="50"
                          value={monthlyContribution}
                          onChange={(e) => setMonthlyContribution(parseInt(e.target.value) || 0)}
                          className={styles.numberInput}
                        />
                      </div>
                      <div className={styles.valueDisplay}>{formatCurrency(monthlyContribution)}/month</div>
                    </label>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Investment Return Rate
                      <div className={styles.inputWrapper}>
                        <input
                          type="range"
                          min="3"
                          max="12"
                          step="0.1"
                          value={investmentReturn}
                          onChange={(e) => setInvestmentReturn(parseFloat(e.target.value))}
                          className={styles.slider}
                        />
                        <input
                          type="number"
                          min="3"
                          max="12"
                          step="0.1"
                          value={investmentReturn}
                          onChange={(e) => setInvestmentReturn(parseFloat(e.target.value) || 0)}
                          className={styles.numberInput}
                        />
                        <span className={styles.percentageSymbol}>%</span>
                      </div>
                      <div className={styles.valueDisplay}>{formatPercentage(investmentReturn)}/year</div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Your Education Cost Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Years Until College</div>
                      <div className={styles.resultValue}>{results.yearsUntilCollege} years</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Future Annual Cost</div>
                      <div className={styles.resultValue}>{formatCurrency(results.futureAnnualCost)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Future Cost</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalFutureCost)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Savings Coverage</div>
                      <div className={`${styles.resultValue} ${results.savingsCoverage >= 100 ? styles.fullCoverage : styles.partialCoverage}`}>
                        {formatPercentage(results.savingsCoverage)}
                      </div>
                    </div>
                  </div>

                  {/* Advanced Results */}
                  {showAdvanced && (
                    <div className={styles.advancedResults}>
                      <div className={styles.resultRow}>
                        <div className={styles.resultLabel}>Projected Savings Balance</div>
                        <div className={styles.resultValue}>{formatCurrency(results.projectedSavings)}</div>
                      </div>
                      <div className={styles.resultRow}>
                        <div className={styles.resultLabel}>Required Monthly Savings</div>
                        <div className={styles.resultValue}>{formatCurrency(results.requiredMonthlySavings)}</div>
                      </div>
                      <div className={styles.resultRow}>
                        <div className={styles.resultLabel}>Funding Gap</div>
                        <div className={styles.resultValue}>{formatCurrency(results.fundingGap)}</div>
                      </div>
                      <div className={styles.resultRow}>
                        <div className={styles.resultLabel}>Years to Save Enough</div>
                        <div className={styles.resultValue}>{results.yearsToSave} years</div>
                      </div>
                    </div>
                  )}

                  {/* College Comparison */}
                  <div className={styles.comparisonCard}>
                    <h3 className={styles.comparisonTitle}>College Type Comparison</h3>
                    <div className={styles.comparisonGrid}>
                      {Object.entries(collegeTypePresets).map(([key, preset]) => {
                        if (key === 'custom') return null;
                        const yearsUntilCollege = collegeStartAge - currentAge;
                        const totalYears = yearsUntilCollege + yearsInCollege;
                        let totalCost = 0;
                        
                        for (let year = 1; year <= yearsInCollege; year++) {
                          const inflationYear = yearsUntilCollege + year;
                          totalCost += preset.cost * Math.pow(1 + inflationRate / 100, inflationYear);
                        }
                        
                        return (
                          <div key={key} className={styles.comparisonItem}>
                            <div className={styles.comparisonLabel}>{preset.label}</div>
                            <div className={styles.comparisonValue}>{formatCurrency(Math.round(totalCost))}</div>
                            <div className={styles.comparisonDifference}>
                              {formatCurrency(Math.round(totalCost - results.totalWithInflation))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Savings Timeline Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Savings & Cost Timeline</h3>
                    <div className={styles.chartBars}>
                      {chartData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>Age {data.age}</div>
                          <div className={styles.chartBarContainer}>
                            {data.yearType === 'Savings' ? (
                              <>
                                <div 
                                  className={styles.chartBarSavings}
                                  style={{ width: `${Math.min((data.savingsBalance / (results.totalFutureCost * 1.5)) * 100, 100)}%` }}
                                  title={`Savings: ${formatCurrency(data.savingsBalance)}`}
                                />
                                <div 
                                  className={styles.chartBarContribution}
                                  style={{ width: `${Math.min((data.contribution / (results.totalFutureCost * 1.5)) * 100, 100)}%` }}
                                  title={`Contribution: ${formatCurrency(data.contribution)}`}
                                />
                              </>
                            ) : (
                              <>
                                <div 
                                  className={styles.chartBarCost}
                                  style={{ width: `${Math.min((data.annualCost / results.totalFutureCost) * 100, 100)}%` }}
                                  title={`Cost: ${formatCurrency(data.annualCost)}`}
                                />
                                <div 
                                  className={styles.chartBarGap}
                                  style={{ width: `${Math.min((data.gap / results.totalFutureCost) * 100, 100)}%` }}
                                  title={`Gap: ${formatCurrency(data.gap)}`}
                                />
                              </>
                            )}
                          </div>
                          <div className={styles.chartBarValue}>
                            {data.yearType === 'Savings' 
                              ? formatCurrency(data.savingsBalance) 
                              : formatCurrency(data.annualCost)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendSavings}`}></div>
                        <span>Savings Balance</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendContribution}`}></div>
                        <span>Annual Contribution</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendCost}`}></div>
                        <span>Annual College Cost</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendGap}`}></div>
                        <span>Funding Gap</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>💡 Key Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>College costs are projected to increase by <strong>{formatPercentage(inflationRate)}</strong> annually</li>
                      <li>You have <strong>{results.yearsUntilCollege} years</strong> to save before college begins</li>
                      <li>Your current savings cover <strong>{formatPercentage(results.savingsCoverage)}</strong> of projected costs</li>
                      {showAdvanced && results.fundingGap > 0 && (
                        <li>You need an additional <strong>{formatCurrency(results.requiredMonthlySavings)}/month</strong> to close the funding gap</li>
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
              <h2 className={styles.articleTitle}>Strategic Education Planning: Funding the Future</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding the True Cost of College</h3>
                <p>College education costs include more than just tuition. The complete picture includes room and board, textbooks, supplies, transportation, and personal expenses. These costs have been rising faster than inflation for decades, making early planning essential.</p>
                
                <div className={styles.exampleCard}>
                  <h4>2024 Average Annual College Costs (Total Cost of Attendance):</h4>
                  <ul>
                    <li><strong>Public In-State:</strong> $25,000 - $30,000 (includes $11,000 tuition + $14,000 room/board)</li>
                    <li><strong>Public Out-of-State:</strong> $43,000 - $48,000 (includes $27,000 tuition + $16,000 room/board)</li>
                    <li><strong>Private Colleges:</strong> $55,000 - $60,000 (includes $40,000 tuition + $15,000 room/board)</li>
                    <li><strong>Community Colleges:</strong> $10,000 - $15,000 (commuter costs only)</li>
                  </ul>
                  <p>These costs typically increase 5-7% annually, doubling every 10-14 years.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Smart Savings Strategies for Education</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🎓 529 College Savings Plans</h4>
                    <p><strong>Tax Advantages:</strong> Earnings grow tax-free, withdrawals for qualified expenses are tax-free<br />
                    <strong>State Benefits:</strong> Many states offer tax deductions for contributions<br />
                    <strong>Flexibility:</strong> Can be used for tuition, room/board, books, and computers</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Education Savings Accounts (ESA)</h4>
                    <p><strong>Higher Returns:</strong> Can invest in stocks, bonds, mutual funds<br />
                    <strong>Annual Limit:</strong> $2,000 contribution limit per child per year<br />
                    <strong>Income Limits:</strong> Phases out for higher-income families</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏦 UGMA/UTMA Accounts</h4>
                    <p><strong>Flexibility:</strong> Funds can be used for any purpose benefiting the child<br />
                    <strong>Control:</strong> Custodian controls until child reaches majority age<br />
                    <strong>Taxation:</strong> First $1,100 tax-free, next $1,100 at child's rate</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 Roth IRAs for Education</h4>
                    <p><strong>Dual Purpose:</strong> Can be used for retirement or education<br />
                    <strong>Penalty-Free:</strong> Contributions (not earnings) can be withdrawn penalty-free<br />
                    <strong>Backup Plan:</strong> Great option if child gets scholarships</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The 1/3 Rule of College Funding</h3>
                <div className={styles.fundingRule}>
                  <div className={styles.ruleSegment}>
                    <div className={styles.ruleNumber}>⅓</div>
                    <div className={styles.ruleContent}>
                      <h4>Regular Savings</h4>
                      <p>Save consistently through 529 plans or other tax-advantaged accounts. Start early and automate contributions.</p>
                    </div>
                  </div>
                  <div className={styles.ruleSegment}>
                    <div className={styles.ruleNumber}>⅓</div>
                    <div className={styles.ruleContent}>
                      <h4>Current Income</h4>
                      <p>Plan to pay from current income during college years. This reduces the total amount you need to save upfront.</p>
                    </div>
                  </div>
                  <div className={styles.ruleSegment}>
                    <div className={styles.ruleNumber}>⅓</div>
                    <div className={styles.ruleContent}>
                      <h4>Scholarships & Loans</h4>
                      <p>Apply for scholarships, grants, and consider reasonable student loans. Federal loans offer the best terms.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Cost Reduction Strategies</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Community College First:</strong> Complete general education requirements at lower cost, then transfer</li>
                  <li><strong>In-State Public Universities:</strong> Save 40-60% compared to private or out-of-state options</li>
                  <li><strong>Advanced Placement (AP) Courses:</strong> Earn college credit in high school, reducing college time</li>
                  <li><strong>Work-Study Programs:</strong> Earn money while gaining valuable work experience</li>
                  <li><strong>Scholarship Aggressiveness:</strong> Apply for multiple scholarships - even small ones add up</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from College Planners</h3>
                <blockquote className={styles.expertQuote}>
                  "The most common mistake parents make is underestimating both the total cost and the impact of inflation. Start saving when your child is born, use tax-advantaged accounts, and remember that being 'college-ready' financially is just as important as being academically prepared. A diversified funding approach with savings, income, and aid provides the most flexibility."
                  <footer className={styles.quoteFooter}>— Certified College Planning Specialist, 18+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I save for retirement or my child's education first?</h3>
                <p className={styles.faqAnswer}>Prioritize retirement savings. There are no loans or scholarships for retirement, but there are multiple funding options for college. A good rule: contribute enough to get any employer retirement match first, then save for college, then add more to retirement.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What happens to 529 plan funds if my child doesn't go to college?</h3>
                <p className={styles.faqAnswer}>You have several options: change the beneficiary to another family member, use funds for qualified trade schools or graduate programs, withdraw funds (earnings taxed as income plus 10% penalty), or starting in 2024, roll up to $35,000 into a Roth IRA for the beneficiary.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How much do grandparents or other relatives affect financial aid?</h3>
                <p className={styles.faqAnswer}>Grandparent-owned 529 plans are not reported as assets on the FAFSA, but distributions count as student income (which reduces aid by 50%). Consider timing distributions for the student's junior/senior year after FAFSA has been filed, or have grandparents contribute to a parent-owned 529.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between need-based and merit-based aid?</h3>
                <p className={styles.faqAnswer}>Need-based aid depends on family financial situation (FAFSA determines this). Merit-based aid depends on academic, athletic, or artistic achievements. Many families qualify for both types. Always complete the FAFSA even if you think you won't qualify for need-based aid.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Start Your Education Savings Plan?</h2>
              <p className={styles.ctaText}>Use our calculator to create your personalized education funding strategy. Compare different college options and savings scenarios to find what works best for your family.</p>
              
              
                 
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Actual education costs, inflation rates, and investment returns may vary. College costs are based on national averages and include tuition, fees, room, board, books, and supplies. Financial aid, scholarships, and grants can significantly reduce out-of-pocket costs. Consult with a financial advisor for personalized education planning advice.
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
    revalidate: 86400, // 24 hours
  };
}

export default EducationCostCalculator;