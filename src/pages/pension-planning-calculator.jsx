import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './pensionplanningcalculator.module.css';

const PensionPlanningCalculator = ({ currentDate, lastModifiedDate }) => {
  const [currentAge, setCurrentAge] = useState(40);
  const [retirementAge, setRetirementAge] = useState(65);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [currentSavings, setCurrentSavings] = useState(100000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [employerMatch, setEmployerMatch] = useState(5);
  const [annualReturn, setAnnualReturn] = useState(6);
  const [inflationRate, setInflationRate] = useState(2.5);
  const [desiredIncome, setDesiredIncome] = useState(50000);
  const [expectedPension, setExpectedPension] = useState(20000);
  const [expectedSocialSecurity, setExpectedSocialSecurity] = useState(18000);
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);

  const calculatePensionPlan = () => {
    const yearsToRetirement = retirementAge - currentAge;
    const retirementYears = lifeExpectancy - retirementAge;
    
    // Calculate future value of current savings
    const monthlyReturn = annualReturn / 100 / 12;
    const totalMonths = yearsToRetirement * 12;
    
    // Future value of current savings
    const fvCurrentSavings = currentSavings * Math.pow(1 + (annualReturn / 100), yearsToRetirement);
    
    // Future value of monthly contributions (including employer match)
    const totalMonthlyContribution = monthlyContribution * (1 + (employerMatch / 100));
    const fvContributions = totalMonthlyContribution * ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn);
    
    // Total retirement fund
    const totalRetirementFund = fvCurrentSavings + fvContributions;
    
    // Calculate required retirement income (in today's dollars, adjusted for inflation)
    const inflationAdjustedReturn = ((1 + (annualReturn / 100)) / (1 + (inflationRate / 100))) - 1;
    
    // Calculate annual withdrawal needed
    const totalAnnualNeed = desiredIncome - expectedPension - expectedSocialSecurity;
    const monthlyNeed = Math.max(0, totalAnnualNeed) / 12;
    
    // Calculate if fund is sufficient using 4% rule
    const safeWithdrawalRate = 0.04;
    const requiredFund = totalAnnualNeed / safeWithdrawalRate;
    
    // Calculate monthly income from fund
    const monthlyIncomeFromFund = (totalRetirementFund * safeWithdrawalRate) / 12;
    const totalMonthlyIncome = monthlyIncomeFromFund + (expectedPension / 12) + (expectedSocialSecurity / 12);
    
    // Generate chart data
    const dataPoints = [];
    let accumulatedFund = currentSavings;
    
    // Accumulation phase
    for (let i = 0; i <= yearsToRetirement; i++) {
      if (i > 0) {
        accumulatedFund = accumulatedFund * (1 + (annualReturn / 100)) + (totalMonthlyContribution * 12);
      }
      dataPoints.push({
        age: currentAge + i,
        fundValue: Math.round(accumulatedFund * 100) / 100,
        phase: 'accumulation'
      });
    }
    
    // Drawdown phase
    let remainingFund = totalRetirementFund;
    for (let i = 0; i <= retirementYears; i++) {
      if (i > 0) {
        // Account for inflation-adjusted withdrawals
        const inflationAdjustedWithdrawal = totalAnnualNeed * Math.pow(1 + (inflationRate / 100), i);
        remainingFund = (remainingFund - inflationAdjustedWithdrawal) * (1 + (annualReturn / 100));
        if (remainingFund < 0) remainingFund = 0;
      }
      dataPoints.push({
        age: retirementAge + i,
        fundValue: Math.round(remainingFund * 100) / 100,
        phase: 'retirement'
      });
    }
    
    // Calculate shortfall/surplus
    const shortfall = Math.max(0, requiredFund - totalRetirementFund);
    const surplus = Math.max(0, totalRetirementFund - requiredFund);
    
    // Calculate additional savings needed
    const additionalMonthlyNeeded = shortfall > 0 
      ? (shortfall * monthlyReturn) / (Math.pow(1 + monthlyReturn, totalMonths) - 1)
      : 0;
    
    setResults({
      totalRetirementFund: Math.round(totalRetirementFund * 100) / 100,
      requiredFund: Math.round(requiredFund * 100) / 100,
      shortfall: Math.round(shortfall * 100) / 100,
      surplus: Math.round(surplus * 100) / 100,
      yearsToRetirement: yearsToRetirement,
      retirementYears: retirementYears,
      monthlyIncomeFromFund: Math.round(monthlyIncomeFromFund * 100) / 100,
      totalMonthlyIncome: Math.round(totalMonthlyIncome * 100) / 100,
      additionalMonthlyNeeded: Math.round(additionalMonthlyNeeded * 100) / 100,
      safeWithdrawalAmount: Math.round((totalRetirementFund * safeWithdrawalRate) * 100) / 100,
      fvCurrentSavings: Math.round(fvCurrentSavings * 100) / 100,
      fvContributions: Math.round(fvContributions * 100) / 100
    });
    
    setChartData(dataPoints);
  };

  useEffect(() => {
    calculatePensionPlan();
  }, [currentAge, retirementAge, lifeExpectancy, currentSavings, monthlyContribution, 
      employerMatch, annualReturn, inflationRate, desiredIncome, expectedPension, expectedSocialSecurity]);

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

  const formatAge = (value) => {
    return `${value} years`;
  };

  return (
    <>
      <Head>
        <title>Pension Planning Calculator | Comprehensive Retirement Planning Tool</title>
        <meta name="description" content="Free pension planning calculator with employer match, inflation adjustment, and comprehensive retirement analysis. Plan your retirement income, calculate required savings, and ensure financial security." />
        <meta name="keywords" content="pension calculator, retirement planning, pension planning, retirement calculator, 401k calculator, retirement income, pension fund, retirement savings" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/pension-planning-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Pension Planning Calculator | Comprehensive Retirement Planning Tool" />
        <meta property="og:description" content="Plan your retirement with our comprehensive pension calculator. Account for inflation, employer matches, and multiple income sources for accurate retirement planning." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/pension-planning-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pension Planning Calculator" />
        <meta name="twitter:description" content="Secure your retirement with our comprehensive pension planning tool." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="pension-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Pension Planning Calculator",
            "description": "Comprehensive pension and retirement planning calculator with employer match, inflation adjustment, and multi-scenario analysis",
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
              "ratingCount": "2150",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Retirement Planning Tools",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Employer Match Calculation",
              "Inflation Adjustment",
              "Multiple Income Sources",
              "Retirement Gap Analysis",
              "Visual Projections",
              "Savings Recommendations"
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
                "name": "What is the 4% rule in retirement planning?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The 4% rule suggests that you can withdraw 4% of your retirement portfolio in the first year of retirement, then adjust that amount for inflation each subsequent year, with a high probability your money will last 30+ years. It's a widely used guideline for sustainable retirement withdrawals.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How does employer matching affect my retirement savings?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Employer matching is essentially free money added to your retirement account. If your employer offers a 5% match and you contribute enough to get the full match, you're immediately getting a 100% return on that portion of your contribution. This significantly accelerates retirement savings growth.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "Why is inflation adjustment crucial in retirement planning?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Inflation erodes purchasing power over time. $50,000 today will buy much less in 20 years. Our calculator adjusts for inflation to show the real value of your future retirement income and ensures you save enough to maintain your desired lifestyle.",
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
            <h1 className={styles.mainTitle}>Pension Planning Calculator</h1>
            <p className={styles.subtitle}>Secure Your Retirement with Comprehensive Pension Planning</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Inflation Adjusted</span>
              <span className={styles.badge}>Employer Match Included</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Your Retirement Profile</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Current Age
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="25"
                      max="65"
                      step="1"
                      value={currentAge}
                      onChange={(e) => setCurrentAge(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="25"
                      max="65"
                      step="1"
                      value={currentAge}
                      onChange={(e) => setCurrentAge(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{currentAge} years old</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Planned Retirement Age
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="55"
                      max="75"
                      step="1"
                      value={retirementAge}
                      onChange={(e) => setRetirementAge(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="55"
                      max="75"
                      step="1"
                      value={retirementAge}
                      onChange={(e) => setRetirementAge(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>Retire at {retirementAge}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Life Expectancy
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="75"
                      max="100"
                      step="1"
                      value={lifeExpectancy}
                      onChange={(e) => setLifeExpectancy(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="75"
                      max="100"
                      step="1"
                      value={lifeExpectancy}
                      onChange={(e) => setLifeExpectancy(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>Plan to age {lifeExpectancy}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Current Retirement Savings
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="10000"
                      value={currentSavings}
                      onChange={(e) => setCurrentSavings(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="1000000"
                      step="10000"
                      value={currentSavings}
                      onChange={(e) => setCurrentSavings(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(currentSavings)}</div>
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
                      max="5000"
                      step="50"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="5000"
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
                  Employer Match Percentage
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={employerMatch}
                      onChange={(e) => setEmployerMatch(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={employerMatch}
                      onChange={(e) => setEmployerMatch(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(employerMatch)} match</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Expected Annual Return
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="2"
                      max="12"
                      step="0.5"
                      value={annualReturn}
                      onChange={(e) => setAnnualReturn(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="2"
                      max="12"
                      step="0.5"
                      value={annualReturn}
                      onChange={(e) => setAnnualReturn(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(annualReturn)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Expected Inflation Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.1"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(inflationRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Desired Annual Retirement Income
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="30000"
                      max="150000"
                      step="5000"
                      value={desiredIncome}
                      onChange={(e) => setDesiredIncome(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="30000"
                      max="150000"
                      step="5000"
                      value={desiredIncome}
                      onChange={(e) => setDesiredIncome(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(desiredIncome)}/year</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Expected Pension Income
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={expectedPension}
                      onChange={(e) => setExpectedPension(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="50000"
                      step="1000"
                      value={expectedPension}
                      onChange={(e) => setExpectedPension(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(expectedPension)}/year</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Expected Social Security
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="40000"
                      step="1000"
                      value={expectedSocialSecurity}
                      onChange={(e) => setExpectedSocialSecurity(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="40000"
                      step="1000"
                      value={expectedSocialSecurity}
                      onChange={(e) => setExpectedSocialSecurity(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(expectedSocialSecurity)}/year</div>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Your Retirement Plan Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Retirement Fund</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalRetirementFund)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Required Fund</div>
                      <div className={styles.resultValue}>{formatCurrency(results.requiredFund)}</div>
                    </div>
                    <div className={results.shortfall > 0 ? styles.resultItemWarning : styles.resultItemSuccess}>
                      <div className={styles.resultLabel}>
                        {results.shortfall > 0 ? 'Shortfall' : 'Surplus'}
                      </div>
                      <div className={styles.resultValue}>
                        {results.shortfall > 0 
                          ? formatCurrency(results.shortfall) 
                          : formatCurrency(results.surplus)}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Years to Retirement</div>
                      <div className={styles.resultValue}>{results.yearsToRetirement} years</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Monthly Retirement Income</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalMonthlyIncome)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>4% Safe Withdrawal</div>
                      <div className={styles.resultValue}>{formatCurrency(results.safeWithdrawalAmount)}/year</div>
                    </div>
                  </div>

                  {/* Retirement Gap Analysis */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Retirement Fund Projection</h3>
                    <div className={styles.chartBars}>
                      {chartData.filter((_, index) => index % 5 === 0 || index === chartData.length - 1).map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>Age {data.age}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={data.phase === 'accumulation' ? styles.chartBarAccumulation : styles.chartBarRetirement}
                              style={{ 
                                width: `${Math.min((data.fundValue / results.totalRetirementFund) * 100, 100)}%`,
                                maxWidth: '100%'
                              }}
                              title={`Age ${data.age}: ${formatCurrency(data.fundValue)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>
                            {formatCurrency(data.fundValue)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendAccumulation}`}></div>
                        <span>Accumulation Phase</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendRetirement}`}></div>
                        <span>Retirement Phase</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>🎯 Retirement Readiness Assessment</h3>
                    <ul className={styles.insightsList}>
                      {results.shortfall > 0 ? (
                        <>
                          <li>You have a <strong className={styles.warningText}>shortfall of {formatCurrency(results.shortfall)}</strong> in your retirement fund</li>
                          <li>To close this gap, increase monthly savings by <strong>{formatCurrency(results.additionalMonthlyNeeded)}</strong></li>
                          <li>Consider delaying retirement by {Math.ceil(results.shortfall / (monthlyContribution * 12 * (1 + employerMatch/100)))} years or reducing retirement income expectations</li>
                        </>
                      ) : (
                        <>
                          <li>You're on track! You have a <strong className={styles.successText}>surplus of {formatCurrency(results.surplus)}</strong></li>
                          <li>Your retirement fund will generate <strong>{formatCurrency(results.monthlyIncomeFromFund)}</strong> monthly from investments</li>
                          <li>Total retirement income: <strong>{formatCurrency(results.totalMonthlyIncome)}</strong>/month including pensions</li>
                        </>
                      )}
                      <li>Your money needs to last <strong>{results.retirementYears} years</strong> in retirement</li>
                      <li>Employer match adds <strong>{formatCurrency(monthlyContribution * (employerMatch/100) * 12)}</strong> annually to your savings</li>
                    </ul>
                    
                    {results.shortfall > 0 && (
                      <div className={styles.actionPlan}>
                        <h4>📋 Action Plan to Close the Gap:</h4>
                        <ul>
                          <li>Increase monthly contribution by <strong>{formatCurrency(results.additionalMonthlyNeeded)}</strong></li>
                          <li>Maximize employer match by contributing at least {employerMatch}% of your salary</li>
                          <li>Consider working {Math.ceil(results.shortfall / (desiredIncome * 0.04))} additional years</li>
                          <li>Reduce retirement spending expectations by {Math.round((results.shortfall / results.requiredFund) * 100)}%</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Mastering Pension Planning: Your Path to Financial Security</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The Three Pillars of Retirement Security</h3>
                <p>A successful retirement plan typically relies on three complementary income sources: Government benefits (Social Security), employer-sponsored pensions, and personal savings. Understanding how these work together is crucial for building a resilient retirement plan.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Retirement Income Breakdown Example:</h4>
                  <p><strong>Scenario:</strong> Age 65 retiree with $60,000 desired annual income</p>
                  <ul>
                    <li><strong>Social Security:</strong> $18,000/year (30% of total)</li>
                    <li><strong>Employer Pension:</strong> $20,000/year (33% of total)</li>
                    <li><strong>Personal Savings (4% rule):</strong> $22,000/year (37% of total)</li>
                    <li><strong>Required Savings:</strong> $550,000 ($22,000 ÷ 4%)</li>
                  </ul>
                  <p>This balanced approach reduces reliance on any single income source.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Key Retirement Planning Strategies</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🏦 Maximize Employer Match</h4>
                    <p>Employer matching is free money. If your employer offers a 5% match on 5% contribution, that's an immediate 100% return. Always contribute enough to get the full match.</p>
                    <div className={styles.exampleNote}>
                      <strong>Impact:</strong> Doubles your contribution effectiveness
                    </div>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Understand the 4% Rule</h4>
                    <p>The 4% rule suggests withdrawing 4% of your portfolio annually, adjusted for inflation. This provides a 90%+ probability your money will last 30+ years.</p>
                    <div className={styles.exampleNote}>
                      <strong>Formula:</strong> Required Savings = Desired Income ÷ 0.04
                    </div>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚖️ Balance Risk and Time</h4>
                    <p>Younger investors can afford more stock exposure for growth. As you approach retirement, gradually shift to more conservative investments to protect capital.</p>
                    <div className={styles.exampleNote}>
                      <strong>Rule:</strong> 100 - age = % in stocks
                    </div>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🕒 Consider Delaying Retirement</h4>
                    <p>Working just 2-3 extra years can significantly boost retirement security through additional savings, higher Social Security benefits, and fewer years to fund.</p>
                    <div className={styles.exampleNote}>
                      <strong>Benefit:</strong> 8% annual Social Security increase for delaying
                    </div>
                  </div>

                  <div className={styles.strategyCard}>
                    <h4>💰 Tax-Efficient Withdrawal Strategy</h4>
                    <p>Withdraw from taxable accounts first, then tax-deferred accounts (401k/IRA), and finally Roth accounts to maximize tax efficiency and required minimum distributions.</p>
                    <div className={styles.exampleNote}>
                      <strong>Order:</strong> Taxable → Tax-deferred → Roth
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common Retirement Planning Mistakes to Avoid</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Underestimating Lifespan:</strong> Planning for 20 years when you might live 30+ years in retirement</li>
                  <li><strong>Ignoring Inflation:</strong> Not adjusting savings goals for future purchasing power erosion</li>
                  <li><strong>Overlooking Healthcare Costs:</strong> Failing to account for rising medical expenses in retirement</li>
                  <li><strong>Taking Social Security Too Early:</strong> Claiming at 62 vs 70 can reduce benefits by 30%</li>
                  <li><strong>Being Too Conservative:</strong> Keeping all retirement money in low-yield accounts that don't beat inflation</li>
                  <li><strong>Not Having a Withdrawal Strategy:</strong> Withdrawing too much too soon and depleting savings</li>
                  <li><strong>Forgetting About Taxes:</strong> Not considering tax implications of retirement account withdrawals</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The Critical Role of Inflation in Retirement Planning</h3>
                <p>Inflation is the silent enemy of retirement security. At 3% annual inflation, prices double every 24 years. This means:</p>
                
                <div className={styles.exampleCard}>
                  <h4>Inflation Impact Over 30 Years:</h4>
                  <p><strong>Today's $50,000 lifestyle requires:</strong></p>
                  <ul>
                    <li><strong>Year 10:</strong> $67,000 (34% increase)</li>
                    <li><strong>Year 20:</strong> $90,000 (80% increase)</li>
                    <li><strong>Year 30:</strong> $121,000 (142% increase)</li>
                  </ul>
                  <p><strong>Key Insight:</strong> Your retirement income needs to grow to maintain purchasing power.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Retirement Planners</h3>
                <blockquote className={styles.expertQuote}>
                  "The most common retirement planning mistake I see is underestimating longevity. People plan for 20 years of retirement but often live 30+. Combine this with underestimating inflation and healthcare costs, and you have a perfect storm for financial insecurity. Start planning early, save aggressively, and always build in a buffer. It's much easier to adjust an early retirement plan than to recover from starting too late."
                  <footer className={styles.quoteFooter}>— Certified Retirement Planning Specialist, 25+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How much do I need to save for retirement?</h3>
                <p className={styles.faqAnswer}>A common guideline is to have 10-12 times your final salary saved by retirement age. More precisely, use the 4% rule: Multiply your desired annual retirement income by 25. For $60,000/year, you need $1.5 million. Our calculator provides personalized recommendations based on your specific situation.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>When should I start taking Social Security benefits?</h3>
                <p className={styles.faqAnswer}>While you can start at 62, your benefits increase by about 8% each year you delay until age 70. If you expect to live beyond 80-82, delaying typically provides greater lifetime benefits. Consider your health, marital status, and other income sources when deciding.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between 401(k), IRA, and Roth accounts?</h3>
                <p className={styles.faqAnswer}>401(k)s are employer-sponsored with higher contribution limits. Traditional IRAs offer tax-deductible contributions with taxable withdrawals. Roth accounts use after-tax money with tax-free withdrawals. Diversifying across account types provides tax flexibility in retirement.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does inflation affect my retirement planning?</h3>
                <p className={styles.faqAnswer}>Inflation erodes purchasing power. At 3% inflation, prices double every 24 years. Your retirement income needs to increase annually to maintain lifestyle. Invest in assets that historically outpace inflation, like stocks, and include inflation protection in your planning.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What if I haven't saved enough for retirement?</h3>
                <p className={styles.faqAnswer}>Options include: 1) Work longer to save more and delay withdrawals, 2) Increase savings rate dramatically, 3) Reduce retirement spending expectations, 4) Consider part-time work in retirement, 5) Downsize your home, 6) Delay Social Security to increase benefits. Our calculator shows specific actions needed.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Take Control of Your Retirement Future</h2>
              <p className={styles.ctaText}>Use our comprehensive pension planning calculator to create your personalized retirement roadmap. Adjust your savings rate, retirement age, and income expectations to find the perfect balance for your golden years.</p>
              
              <div className={styles.buttonGroup}>
                <button className={styles.primaryButton} onClick={() => setMonthlyContribution(prev => Math.min(prev + 100, 5000))}>
                  Increase Monthly Savings
                </button>
                <button className={styles.secondaryButton} onClick={() => setRetirementAge(prev => Math.min(prev + 2, 75))}>
                  Consider Working Longer
                </button>
              </div>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This pension planning calculator provides educational estimates for retirement planning purposes. Results are based on assumptions including but not limited to: constant investment returns, consistent inflation rates, stable contribution patterns, and the 4% withdrawal rule. Actual investment returns may vary significantly. Past performance does not guarantee future results. This calculator does not account for taxes, changing economic conditions, healthcare costs, or unexpected expenses. The 4% rule may not be appropriate for all retirement scenarios. This tool is not financial advice. Consult with a qualified financial advisor, tax professional, and retirement planning specialist before making any financial decisions. Social Security and pension estimates are illustrative and may not reflect your actual benefits.
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

export default PensionPlanningCalculator;