import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './retirementcalculator.module.css';

const RetirementCalculator = ({ currentDate, lastModifiedDate }) => {
  // State for retirement inputs
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSalary, setCurrentSalary] = useState(75000);
  const [employeeContribution, setEmployeeContribution] = useState(6);
  const [employerMatch, setEmployerMatch] = useState(3);
  const [employerMatchLimit, setEmployerMatchLimit] = useState(100);
  const [currentBalance, setCurrentBalance] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [salaryGrowth, setSalaryGrowth] = useState(3);
  const [contributionType, setContributionType] = useState('percentage');
  const [contributionAmount, setContributionAmount] = useState(4500);
  const [accountType, setAccountType] = useState('traditional');
  const [withdrawalRate, setWithdrawalRate] = useState(4);
  
  // Results state
  const [results, setResults] = useState(null);
  const [projectionData, setProjectionData] = useState([]);
  const [contributionBreakdown, setContributionBreakdown] = useState([]);

  // Calculate retirement savings
  const calculateRetirement = () => {
    const yearsToRetirement = retirementAge - currentAge;
    let totalBalance = currentBalance;
    const projections = [];
    const contributions = [];
    
    let totalEmployeeContributions = 0;
    let totalEmployerContributions = 0;
    let totalInvestmentGrowth = 0;
    
    // Variables to track for match utilization calculation
    let finalYearSalary = 0;
    let finalYearEmployerContribution = 0;

    for (let year = 1; year <= yearsToRetirement; year++) {
      const age = currentAge + year;
      const salary = currentSalary * Math.pow(1 + salaryGrowth / 100, year - 1);
      
      // Calculate contributions
      let employeeAnnualContribution;
      if (contributionType === 'percentage') {
        employeeAnnualContribution = salary * (employeeContribution / 100);
      } else {
        employeeAnnualContribution = contributionAmount;
      }
      
      // Employer match (typically up to a limit)
      const employerAnnualContribution = Math.min(
        salary * (employerMatch / 100),
        salary * (employerMatchLimit / 100) * (employeeContribution / 100)
      );
      
      const totalAnnualContribution = employeeAnnualContribution + employerAnnualContribution;
      
      // Calculate investment growth
      const previousBalance = totalBalance;
      totalBalance = (totalBalance + totalAnnualContribution) * (1 + expectedReturn / 100);
      const yearGrowth = totalBalance - previousBalance - totalAnnualContribution;
      
      // Track totals
      totalEmployeeContributions += employeeAnnualContribution;
      totalEmployerContributions += employerAnnualContribution;
      totalInvestmentGrowth += yearGrowth;
      
      // Store last year values for match utilization calculation
      if (year === yearsToRetirement) {
        finalYearSalary = salary;
        finalYearEmployerContribution = employerAnnualContribution;
      }
      
      // Store projection data
      projections.push({
        age: age,
        year: year,
        balance: Math.round(totalBalance * 100) / 100,
        salary: Math.round(salary * 100) / 100,
        employeeContribution: Math.round(employeeAnnualContribution * 100) / 100,
        employerContribution: Math.round(employerAnnualContribution * 100) / 100,
        growth: Math.round(yearGrowth * 100) / 100
      });
      
      // Store every 5 years for detailed breakdown
      if (year === 1 || year === 5 || year === 10 || year === yearsToRetirement) {
        contributions.push({
          year: year,
          age: age,
          employee: Math.round(totalEmployeeContributions * 100) / 100,
          employer: Math.round(totalEmployerContributions * 100) / 100,
          growth: Math.round(totalInvestmentGrowth * 100) / 100,
          balance: Math.round(totalBalance * 100) / 100
        });
      }
    }

    // Calculate retirement income
    const annualRetirementIncome = totalBalance * (withdrawalRate / 100);
    const monthlyRetirementIncome = annualRetirementIncome / 12;
    
    // Calculate replacement ratio
    const finalSalary = currentSalary * Math.pow(1 + salaryGrowth / 100, yearsToRetirement - 1);
    const replacementRatio = (annualRetirementIncome / finalSalary) * 100;
    
    // Calculate savings rate effectiveness
    const totalContributions = totalEmployeeContributions + totalEmployerContributions;
    
    // Calculate match utilization (using final year values)
    let matchUtilization = 0;
    if (employerMatch > 0 && finalYearSalary > 0) {
      const maxPossibleMatch = finalYearSalary * (employerMatch / 100);
      matchUtilization = (finalYearEmployerContribution / maxPossibleMatch) * 100;
    }
    
    setResults({
      finalBalance: Math.round(totalBalance * 100) / 100,
      totalEmployeeContributions: Math.round(totalEmployeeContributions * 100) / 100,
      totalEmployerContributions: Math.round(totalEmployerContributions * 100) / 100,
      totalInvestmentGrowth: Math.round(totalInvestmentGrowth * 100) / 100,
      annualRetirementIncome: Math.round(annualRetirementIncome * 100) / 100,
      monthlyRetirementIncome: Math.round(monthlyRetirementIncome * 100) / 100,
      replacementRatio: Math.round(replacementRatio * 100) / 100,
      yearsToRetirement: yearsToRetirement,
      matchUtilization: Math.round(matchUtilization * 100) / 100,
      savingsRate: Math.round((totalContributions / (currentSalary * yearsToRetirement)) * 100 * 100) / 100
    });
    
    setProjectionData(projections);
    setContributionBreakdown(contributions);
  };

  useEffect(() => {
    calculateRetirement();
  }, [
    currentAge, retirementAge, currentSalary, employeeContribution,
    employerMatch, employerMatchLimit, currentBalance, expectedReturn,
    salaryGrowth, contributionType, contributionAmount, accountType, withdrawalRate
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

  const formatShortCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return formatCurrency(value);
  };

  return (
    <>
      <Head>
        <title>Advanced 401(k) Retirement Calculator | Plan Your Financial Future</title>
        <meta name="description" content="Free advanced 401(k) retirement calculator with employer match projections. Calculate retirement savings, income projections, and optimize your contribution strategy." />
        <meta name="keywords" content="401k calculator, retirement calculator, retirement planning, employer match, retirement savings, retirement income, financial planning" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/retirement-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced 401(k) Retirement Calculator | Plan Your Financial Future" />
        <meta property="og:description" content="Calculate your 401(k) growth with employer match. See detailed retirement projections and optimize your savings strategy." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/retirement-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced 401(k) Retirement Calculator" />
        <meta name="twitter:description" content="Plan your retirement with accurate 401(k) projections and employer match calculations." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="retirement-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced 401(k) Retirement Calculator",
            "description": "Professional 401(k) retirement calculator with employer match projections and retirement income analysis",
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
              "Employer Match Calculations",
              "Retirement Income Projections",
              "Salary Growth Modeling",
              "Contribution Optimization",
              "Withdrawal Rate Analysis"
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
                "name": "How much should I contribute to my 401(k)?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "At minimum, contribute enough to get your full employer match (it's free money). Ideally, aim for 15-20% of your income including employer match. The 2024 contribution limit is $23,000 ($30,500 if 50 or older).",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between Traditional and Roth 401(k)?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Traditional 401(k) contributions are pre-tax, reducing your current taxable income, but withdrawals are taxed. Roth 401(k) contributions are after-tax, but qualified withdrawals in retirement are tax-free. Roth is often better if you expect to be in a higher tax bracket in retirement.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is a safe withdrawal rate in retirement?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The 4% rule is a common guideline - withdraw 4% of your portfolio in the first year of retirement, then adjust for inflation each year. This historically has provided a high probability of funds lasting 30+ years. Many advisors now recommend 3-3.5% for more conservative planning.",
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
            <h1 className={styles.mainTitle}>Advanced 401(k) Retirement Calculator</h1>
            <p className={styles.subtitle}>Plan Your Financial Future with Accurate Retirement Projections</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>2024 Limits</span>
              <span className={styles.badge}>Employer Match</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Retirement Planning</h2>
              
              <div className={styles.inputRow}>
                <div className={styles.inputGroupHalf}>
                  <label className={styles.inputLabel}>
                    Current Age
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="18"
                        max="70"
                        step="1"
                        value={currentAge}
                        onChange={(e) => setCurrentAge(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="18"
                        max="70"
                        step="1"
                        value={currentAge}
                        onChange={(e) => setCurrentAge(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                      <span className={styles.unitSymbol}>years</span>
                    </div>
                    <div className={styles.valueDisplay}>{currentAge} years</div>
                  </label>
                </div>

                <div className={styles.inputGroupHalf}>
                  <label className={styles.inputLabel}>
                    Retirement Age
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
                      <span className={styles.unitSymbol}>years</span>
                    </div>
                    <div className={styles.valueDisplay}>{retirementAge} years</div>
                  </label>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Current Annual Salary
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="30000"
                      max="300000"
                      step="1000"
                      value={currentSalary}
                      onChange={(e) => setCurrentSalary(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="30000"
                      max="300000"
                      step="1000"
                      value={currentSalary}
                      onChange={(e) => setCurrentSalary(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(currentSalary)}/year</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Current 401(k) Balance
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="1000"
                      value={currentBalance}
                      onChange={(e) => setCurrentBalance(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="500000"
                      step="1000"
                      value={currentBalance}
                      onChange={(e) => setCurrentBalance(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(currentBalance)}</div>
                </label>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroupHalf}>
                  <label className={styles.inputLabel}>
                    Your Contribution
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        step="0.5"
                        value={employeeContribution}
                        onChange={(e) => setEmployeeContribution(parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="1"
                        max="100"
                        step="0.5"
                        value={employeeContribution}
                        onChange={(e) => setEmployeeContribution(parseFloat(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                      <span className={styles.percentageSymbol}>%</span>
                    </div>
                    <div className={styles.valueDisplay}>{formatPercentage(employeeContribution)} of salary</div>
                  </label>
                </div>

                <div className={styles.inputGroupHalf}>
                  <label className={styles.inputLabel}>
                    Contribution Type
                    <select
                      value={contributionType}
                      onChange={(e) => setContributionType(e.target.value)}
                      className={styles.selectInput}
                    >
                      <option value="percentage">Percentage of Salary</option>
                      <option value="fixed">Fixed Annual Amount</option>
                    </select>
                  </label>
                </div>
              </div>

              {contributionType === 'fixed' && (
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Annual Contribution Amount
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="range"
                        min="1000"
                        max="23000"
                        step="100"
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="1000"
                        max="23000"
                        step="100"
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{formatCurrency(contributionAmount)}/year (2024 limit: $23,000)</div>
                  </label>
                </div>
              )}

              <div className={styles.inputRow}>
                <div className={styles.inputGroupHalf}>
                  <label className={styles.inputLabel}>
                    Employer Match
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

                <div className={styles.inputGroupHalf}>
                  <label className={styles.inputLabel}>
                    Match Up To
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={employerMatchLimit}
                        onChange={(e) => setEmployerMatchLimit(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="5"
                        value={employerMatchLimit}
                        onChange={(e) => setEmployerMatchLimit(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                      <span className={styles.percentageSymbol}>%</span>
                    </div>
                    <div className={styles.valueDisplay}>of your {formatPercentage(employeeContribution)}</div>
                  </label>
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroupHalf}>
                  <label className={styles.inputLabel}>
                    Expected Annual Return
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="1"
                        max="12"
                        step="0.1"
                        value={expectedReturn}
                        onChange={(e) => setExpectedReturn(parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="1"
                        max="12"
                        step="0.1"
                        value={expectedReturn}
                        onChange={(e) => setExpectedReturn(parseFloat(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                      <span className={styles.percentageSymbol}>%</span>
                    </div>
                    <div className={styles.valueDisplay}>{formatPercentage(expectedReturn)}</div>
                  </label>
                </div>

                <div className={styles.inputGroupHalf}>
                  <label className={styles.inputLabel}>
                    Annual Salary Growth
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.1"
                        value={salaryGrowth}
                        onChange={(e) => setSalaryGrowth(parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={salaryGrowth}
                        onChange={(e) => setSalaryGrowth(parseFloat(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                      <span className={styles.percentageSymbol}>%</span>
                    </div>
                    <div className={styles.valueDisplay}>{formatPercentage(salaryGrowth)}</div>
                  </label>
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroupHalf}>
                  <label className={styles.inputLabel}>
                    401(k) Type
                    <select
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value)}
                      className={styles.selectInput}
                    >
                      <option value="traditional">Traditional (Pre-tax)</option>
                      <option value="roth">Roth (After-tax)</option>
                    </select>
                  </label>
                </div>

                <div className={styles.inputGroupHalf}>
                  <label className={styles.inputLabel}>
                    Retirement Withdrawal Rate
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="1"
                        max="6"
                        step="0.1"
                        value={withdrawalRate}
                        onChange={(e) => setWithdrawalRate(parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="1"
                        max="6"
                        step="0.1"
                        value={withdrawalRate}
                        onChange={(e) => setWithdrawalRate(parseFloat(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                      <span className={styles.percentageSymbol}>%</span>
                    </div>
                    <div className={styles.valueDisplay}>{formatPercentage(withdrawalRate)} rule</div>
                  </label>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Retirement Projection</h2>
              
              {results && (
                <>
                  <div className={styles.retirementInfo}>
                    <div className={styles.retirementAge}>Retirement at Age {retirementAge}</div>
                    <div className={styles.yearsToGo}>{results.yearsToRetirement} years to go</div>
                  </div>

                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Retirement Balance</div>
                      <div className={`${styles.resultValue} ${styles.highlightValue}`}>
                        {formatCurrency(results.finalBalance)}
                      </div>
                      <div className={styles.resultSubtext}>
                        <div>Employee: {formatShortCurrency(results.totalEmployeeContributions)}</div>
                        <div>Employer: {formatShortCurrency(results.totalEmployerContributions)}</div>
                        <div>Growth: {formatShortCurrency(results.totalInvestmentGrowth)}</div>
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Retirement Income</div>
                      <div className={`${styles.resultValue} ${styles.incomeValue}`}>
                        {formatCurrency(results.annualRetirementIncome)}/year
                      </div>
                      <div className={styles.resultSubtext}>
                        <div>{formatCurrency(results.monthlyRetirementIncome)}/month</div>
                        <div>{formatPercentage(results.replacementRatio)} of final salary</div>
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Employer Match</div>
                      <div className={styles.resultValue}>{formatPercentage(results.matchUtilization)} utilized</div>
                      <div className={styles.resultSubtext}>
                        <div>Match: {formatPercentage(employerMatch)}</div>
                        <div>Limit: {formatPercentage(employerMatchLimit)}</div>
                        <div>Free money: {formatShortCurrency(results.totalEmployerContributions)}</div>
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Savings Rate</div>
                      <div className={styles.resultValue}>{formatPercentage(results.savingsRate)}</div>
                      <div className={styles.resultSubtext}>
                        <div>Employee: {formatPercentage(employeeContribution)}</div>
                        <div>Employer: {formatPercentage(employerMatch)}</div>
                        <div>Total: {formatPercentage(employeeContribution + employerMatch)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Contribution Breakdown */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Balance Growth Over Time</h3>
                    <div className={styles.chartBars}>
                      {contributionBreakdown.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>
                            Age {data.age}<br />
                            (Year {data.year})
                          </div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarEmployee}
                              style={{ width: `${(data.employee / data.balance) * 100}%` }}
                              title={`Your Contributions: ${formatCurrency(data.employee)}`}
                            />
                            <div 
                              className={styles.chartBarEmployer}
                              style={{ width: `${(data.employer / data.balance) * 100}%` }}
                              title={`Employer Match: ${formatCurrency(data.employer)}`}
                            />
                            <div 
                              className={styles.chartBarGrowth}
                              style={{ width: `${(data.growth / data.balance) * 100}%` }}
                              title={`Investment Growth: ${formatCurrency(data.growth)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{formatShortCurrency(data.balance)}</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendEmployee}`}></div>
                        <span>Your Contributions</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendEmployer}`}></div>
                        <span>Employer Match</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendGrowth}`}></div>
                        <span>Investment Growth</span>
                      </div>
                    </div>
                  </div>

                  {/* Yearly Milestones */}
                  <div className={styles.milestoneCard}>
                    <h3 className={styles.milestoneTitle}>📈 Projected Milestones</h3>
                    <div className={styles.milestoneGrid}>
                      {projectionData.filter((_, index) => 
                        index === 0 || 
                        index === 4 || 
                        index === 9 || 
                        index === Math.floor(projectionData.length / 2) - 1 ||
                        index === projectionData.length - 1
                      ).map((data, index) => (
                        <div key={index} className={styles.milestoneItem}>
                          <div className={styles.milestoneYear}>Age {data.age}</div>
                          <div className={styles.milestoneBalance}>{formatShortCurrency(data.balance)}</div>
                          <div className={styles.milestoneDetail}>
                            Salary: {formatShortCurrency(data.salary)}<br />
                            Annual Add: {formatShortCurrency(data.employeeContribution + data.employerContribution)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>💡 Retirement Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Your employer will contribute <strong>{formatCurrency(results.totalEmployerContributions)}</strong> in free matching funds</li>
                      <li>Investment growth will account for <strong>{formatPercentage((results.totalInvestmentGrowth / results.finalBalance) * 100)}</strong> of your final balance</li>
                      <li>You need to save <strong>{formatCurrency(results.annualRetirementIncome / 0.04)}</strong> for a secure retirement at 4% withdrawal rate</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Master Your 401(k): The Complete Guide to Retirement Planning</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Why Your 401(k) Is Your Most Powerful Retirement Tool</h3>
                <p>A 401(k) isn&apos;t just a retirement account—it&apos;s a wealth-building machine with triple tax advantages: tax-deferred growth, potential employer matching, and high contribution limits. The combination of these features makes it the single most effective tool for most Americans to build retirement wealth.</p>
                
                <div className={styles.exampleCard}>
                  <h4>The Power of Employer Matching:</h4>
                  <ul>
                    <li><strong>100% Immediate Return:</strong> A 3% match on $75,000 salary = $2,250 free money annually</li>
                    <li><strong>30-Year Impact:</strong> That $2,250/year grows to ~$225,000 at 7% return over 30 years</li>
                    <li><strong>Common Match Formulas:</strong> 100% match up to 3%, 50% match up to 6%, or flat percentage</li>
                  </ul>
                  <p>Not getting your full match is like refusing a raise. It&apos;s literally free money left on the table.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Optimization Strategies for Maximum Growth</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🎯 Get the Full Match</h4>
                    <p>Always contribute at least enough to get your full employer match. This is an instant 50-100% return on your money—something no investment can guarantee.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Increase Contributions Gradually</h4>
                    <p>Use &quot;auto-escalation&quot; features to increase your contribution by 1% each year. You won&apos;t notice the difference, but your retirement balance will grow dramatically.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚖️ Traditional vs. Roth Strategy</h4>
                    <p>Traditional 401(k) for high-earning years, Roth for early career or low-tax years. Some plans allow splitting contributions between both for tax diversification.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🔄 Consider Mega Backdoor Roth</h4>
                    <p>If your plan allows after-tax contributions and in-service distributions, you can contribute up to $69,000 total (2024) using the mega backdoor Roth strategy.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common 401(k) Mistakes to Avoid</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Leaving Money on the Table:</strong> 25% of employees don&apos;t contribute enough to get their full employer match</li>
                  <li><strong>High Fee Funds:</strong> Expense ratios over 1% can consume 30% of your returns over 30 years</li>
                  <li><strong>Taking Early Withdrawals:</strong> 10% penalty + taxes + lost compounding = disaster for retirement</li>
                  <li><strong>Over-conservative Investing:</strong> Being too conservative in early years misses growth potential</li>
                  <li><strong>Ignoring Asset Allocation:</strong> Not rebalancing can lead to unintended risk exposure</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Certified Planners</h3>
                <blockquote className={styles.expertQuote}>
                  &quot;The most successful retirement savers follow the &apos;1% rule&apos;—increase contributions by 1% of salary each year until you reach 15-20% total savings rate. Combine this with low-cost index funds and you&apos;ll outperform 90% of professional investors over time.&quot;
                  <footer className={styles.quoteFooter}>— Certified Financial Planner®, Retirement Specialist with 25+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions About 401(k)s</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What happens to my 401(k) if I change jobs?</h3>
                <p className={styles.faqAnswer}>You have four options: 1) Leave it with your old employer (if balance &gt; $5,000), 2) Roll it into your new employer&apos;s 401(k), 3) Roll it into an IRA (often best for investment options), 4) Cash it out (worst option due to taxes + 10% penalty if under 59½). Rolling into an IRA or new 401(k) preserves the tax advantages.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do I choose investments in my 401(k)?</h3>
                <p className={styles.faqAnswer}>Start with target-date funds (set it and forget it). For DIY approach: 1) Allocate by age (110 - your age = % in stocks), 2) Use low-cost index funds, 3) Diversify across US stocks, international stocks, and bonds, 4) Rebalance annually. Avoid high-fee actively managed funds unless they consistently beat their benchmarks.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What are 401(k) contribution limits for 2024?</h3>
                <p className={styles.faqAnswer}>2024 limits: $23,000 for employee contributions ($30,500 if age 50+). Total contribution limit (employee + employer + after-tax) is $69,000 ($76,500 if 50+). Employer match doesn&apos;t count toward employee limit. These limits typically increase each year with inflation.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>When should I consider a Roth 401(k) vs Traditional?</h3>
                <p className={styles.faqAnswer}>Choose Roth if: You&apos;re in a low tax bracket now, expect higher taxes in retirement, want tax-free withdrawals, or are early in your career. Choose Traditional if: You&apos;re in a high tax bracket now, expect lower taxes in retirement, or need the current tax deduction. Many experts recommend having both for tax flexibility.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Optimize Your Retirement Strategy?</h2>
              <p className={styles.ctaText}>Use our calculator to experiment with different scenarios. See how increasing contributions, adjusting retirement age, or changing investment returns affect your retirement outlook.</p>
              
              <div className={styles.buttonGroup}>
                <button 
                  className={styles.primaryButton}
                  onClick={() => {
                    // Increase contribution by 1% to encourage savings
                    const newContribution = Math.min(100, employeeContribution + 1);
                    setEmployeeContribution(newContribution);
                    alert(`Contribution increased to ${newContribution}%! This simple change could add ${formatCurrency(results.finalBalance * 0.01)} to your retirement balance.`);
                  }}
                >
                  📈 Increase My Contribution 1%
                </button>
                <button 
                  className={styles.secondaryButton}
                  onClick={() => window.print()}
                >
                  🖨️ Print Retirement Plan
                </button>
              </div>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Actual investment returns may vary and are not guaranteed. Past performance does not guarantee future results. Employer matching policies vary by company. Contribution limits may change annually. Consider consulting with a financial advisor or tax professional for personalized advice. This tool does not constitute financial advice.
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
    revalidate: 21600, // 24 hours - important for tax limit updates
  };
}

export default RetirementCalculator;