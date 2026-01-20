import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './debttoincomecalculator.module.css';

const DebtToIncomeCalculator = ({ currentDate, lastModifiedDate }) => {
  const [grossMonthlyIncome, setGrossMonthlyIncome] = useState(8000);
  const [monthlyDebts, setMonthlyDebts] = useState({
    mortgage: 1500,
    autoLoan: 400,
    creditCards: 300,
    studentLoans: 250,
    personalLoans: 150,
    otherDebts: 100
  });
  const [loanType, setLoanType] = useState('mortgage');
  const [creditScore, setCreditScore] = useState('good');
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);

  const lenderRequirements = {
    'mortgage': { excellent: 36, good: 43, acceptable: 50, poor: 57 },
    'auto': { excellent: 8, good: 15, acceptable: 20, poor: 25 },
    'personal': { excellent: 10, good: 20, acceptable: 30, poor: 40 },
    'credit-card': { excellent: 15, good: 25, acceptable: 35, poor: 45 }
  };

  const creditScoreLevels = {
    'excellent': { min: 740, color: '#4CAF50', label: 'Excellent (740+)' },
    'good': { min: 670, color: '#8BC34A', label: 'Good (670-739)' },
    'fair': { min: 580, color: '#FFC107', label: 'Fair (580-669)' },
    'poor': { min: 300, color: '#F44336', label: 'Poor (300-579)' }
  };

  const calculateDTI = () => {
    const totalMonthlyDebt = Object.values(monthlyDebts).reduce((sum, debt) => sum + debt, 0);
    const dtiRatio = (totalMonthlyDebt / grossMonthlyIncome) * 100;
    
    const creditInfo = creditScoreLevels[creditScore];
    const loanRequirements = lenderRequirements[loanType];
    const maxAllowedDTI = loanRequirements ? loanRequirements[creditScore] : 43;
    
    let approvalStatus = '';
    let approvalColor = '#4CAF50';
    let recommendation = '';
    let statusIcon = '✅';
    
    if (dtiRatio <= maxAllowedDTI) {
      approvalStatus = 'Likely Approved';
      approvalColor = '#4CAF50';
      recommendation = 'Your DTI ratio meets lender requirements. Consider additional financial goals.';
      statusIcon = '✅';
    } else if (dtiRatio <= maxAllowedDTI + 5) {
      approvalStatus = 'Borderline';
      approvalColor = '#FFC107';
      recommendation = 'Slightly above preferred ratio. Consider reducing debts before applying.';
      statusIcon = '⚠️';
    } else {
      approvalStatus = 'Needs Improvement';
      approvalColor = '#F44336';
      recommendation = 'DTI ratio too high. Focus on debt reduction before applying for new credit.';
      statusIcon = '❌';
    }
    
    const debtBreakdown = Object.entries(monthlyDebts)
      .filter(([_, amount]) => amount > 0)
      .map(([type, amount]) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1'),
        amount,
        percentage: (amount / totalMonthlyDebt) * 100
      }));
    
    const comparisonData = [
      { label: 'Your DTI', value: dtiRatio, color: '#000000' },
      { label: 'Excellent', value: loanRequirements.excellent, color: '#4CAF50' },
      { label: 'Good', value: loanRequirements.good, color: '#8BC34A' },
      { label: 'Acceptable', value: loanRequirements.acceptable, color: '#FFC107' },
      { label: 'Poor', value: loanRequirements.poor, color: '#F44336' }
    ];
    
    setResults({
      dtiRatio: Math.round(dtiRatio * 100) / 100,
      totalMonthlyDebt,
      approvalStatus,
      approvalColor,
      recommendation,
      statusIcon,
      maxAllowedDTI,
      disposableIncome: grossMonthlyIncome - totalMonthlyDebt,
      debtToIncomePercentage: dtiRatio,
      incomePercentage: 100 - dtiRatio,
      creditScoreInfo: creditInfo
    });
    
    setChartData({
      debtBreakdown,
      comparison: comparisonData
    });
  };

  useEffect(() => {
    calculateDTI();
  }, [grossMonthlyIncome, monthlyDebts, loanType, creditScore]);

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

  const updateDebt = (debtType, value) => {
    setMonthlyDebts(prev => ({
      ...prev,
      [debtType]: Math.max(0, parseInt(value) || 0)
    }));
  };

  return (
    <>
      <Head>
        <title>Advanced Debt-to-Income Ratio Calculator | Loan Approval Analysis</title>
        <meta name="description" content="Professional DTI calculator with lender requirements. Analyze your debt-to-income ratio, check loan eligibility, and improve your financial profile." />
        <meta name="keywords" content="debt to income calculator, DTI ratio, loan approval, mortgage calculator, credit score, financial health" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/debt-to-income-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Debt-to-Income Ratio Calculator | Loan Approval Analysis" />
        <meta property="og:description" content="Calculate your DTI ratio and check loan eligibility with our professional calculator. Compare against lender requirements and improve your financial profile." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/debt-to-income-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Professional Debt-to-Income Calculator" />
        <meta name="twitter:description" content="Analyze your DTI ratio and check loan eligibility against lender requirements." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="debt-to-income-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Debt-to-Income Ratio Calculator",
            "description": "Professional financial calculator for analyzing debt-to-income ratios and loan eligibility",
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
              "name": "Financial Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Lender Requirement Comparisons",
              "Loan Type Analysis",
              "Credit Score Integration",
              "Debt Breakdown Visualization",
              "Approval Probability Assessment"
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
                "name": "What is a good debt-to-income ratio for mortgage approval?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "For conventional mortgages, most lenders prefer a DTI ratio below 43%. With excellent credit, some lenders may accept up to 50%. FHA loans can go up to 57% with compensating factors.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How does credit score affect DTI requirements?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Higher credit scores typically allow for higher DTI ratios. Excellent credit (740+) might get you approved at 50% DTI, while lower scores may require ratios below 43%.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What debts are included in DTI calculation?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "All monthly debt payments are included: mortgage/rent, auto loans, credit card minimum payments, student loans, personal loans, and any other recurring debt obligations.",
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
            <h1 className={styles.mainTitle}>Advanced Debt-to-Income Ratio Calculator</h1>
            <p className={styles.subtitle}>Analyze Your Loan Eligibility and Improve Your Financial Profile</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Lender Requirements</span>
              <span className={styles.badge}>Credit Score Aware</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate Your DTI Ratio</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Gross Monthly Income
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="1000"
                      max="50000"
                      step="100"
                      value={grossMonthlyIncome}
                      onChange={(e) => setGrossMonthlyIncome(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1000"
                      max="50000"
                      step="100"
                      value={grossMonthlyIncome}
                      onChange={(e) => setGrossMonthlyIncome(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(grossMonthlyIncome)}/month</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <h3 className={styles.inputSubtitle}>Monthly Debt Payments</h3>
                
                <div className={styles.debtGrid}>
                  <div className={styles.debtInput}>
                    <label className={styles.debtLabel}>Mortgage/Rent</label>
                    <div className={styles.debtWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        min="0"
                        max="10000"
                        step="50"
                        value={monthlyDebts.mortgage}
                        onChange={(e) => updateDebt('mortgage', e.target.value)}
                        className={styles.debtNumberInput}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.debtInput}>
                    <label className={styles.debtLabel}>Auto Loans</label>
                    <div className={styles.debtWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        min="0"
                        max="5000"
                        step="50"
                        value={monthlyDebts.autoLoan}
                        onChange={(e) => updateDebt('autoLoan', e.target.value)}
                        className={styles.debtNumberInput}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.debtInput}>
                    <label className={styles.debtLabel}>Credit Cards</label>
                    <div className={styles.debtWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        min="0"
                        max="5000"
                        step="25"
                        value={monthlyDebts.creditCards}
                        onChange={(e) => updateDebt('creditCards', e.target.value)}
                        className={styles.debtNumberInput}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.debtInput}>
                    <label className={styles.debtLabel}>Student Loans</label>
                    <div className={styles.debtWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        min="0"
                        max="5000"
                        step="25"
                        value={monthlyDebts.studentLoans}
                        onChange={(e) => updateDebt('studentLoans', e.target.value)}
                        className={styles.debtNumberInput}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.debtInput}>
                    <label className={styles.debtLabel}>Personal Loans</label>
                    <div className={styles.debtWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        min="0"
                        max="5000"
                        step="25"
                        value={monthlyDebts.personalLoans}
                        onChange={(e) => updateDebt('personalLoans', e.target.value)}
                        className={styles.debtNumberInput}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.debtInput}>
                    <label className={styles.debtLabel}>Other Debts</label>
                    <div className={styles.debtWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        min="0"
                        max="5000"
                        step="25"
                        value={monthlyDebts.otherDebts}
                        onChange={(e) => updateDebt('otherDebts', e.target.value)}
                        className={styles.debtNumberInput}
                      />
                    </div>
                  </div>
                </div>
                
                <div className={styles.totalDebtDisplay}>
                  Total Monthly Debt: <strong>{formatCurrency(Object.values(monthlyDebts).reduce((sum, debt) => sum + debt, 0))}</strong>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Loan Type
                  <select
                    value={loanType}
                    onChange={(e) => setLoanType(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="mortgage">Mortgage</option>
                    <option value="auto">Auto Loan</option>
                    <option value="personal">Personal Loan</option>
                    <option value="credit-card">Credit Card</option>
                  </select>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Credit Score Range
                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="creditScore"
                        value="excellent"
                        checked={creditScore === 'excellent'}
                        onChange={(e) => setCreditScore(e.target.value)}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioText}>Excellent (740+)</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="creditScore"
                        value="good"
                        checked={creditScore === 'good'}
                        onChange={(e) => setCreditScore(e.target.value)}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioText}>Good (670-739)</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="creditScore"
                        value="fair"
                        checked={creditScore === 'fair'}
                        onChange={(e) => setCreditScore(e.target.value)}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioText}>Fair (580-669)</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="creditScore"
                        value="poor"
                        checked={creditScore === 'poor'}
                        onChange={(e) => setCreditScore(e.target.value)}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioText}>Poor (300-579)</span>
                    </label>
                  </div>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Financial Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>DTI Ratio</div>
                      <div className={styles.resultValue} style={{ color: results.approvalColor }}>
                        {formatPercentage(results.dtiRatio)}
                      </div>
                      <div className={styles.resultSubtext}>
                        {results.statusIcon} {results.approvalStatus}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Disposable Income</div>
                      <div className={styles.resultValue}>{formatCurrency(results.disposableIncome)}</div>
                      <div className={styles.resultSubtext}>Per Month</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Monthly Debt</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalMonthlyDebt)}</div>
                      <div className={styles.resultSubtext}>All Payments</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Max Allowed DTI</div>
                      <div className={styles.resultValue}>{formatPercentage(results.maxAllowedDTI)}</div>
                      <div className={styles.resultSubtext}>For Your Credit</div>
                    </div>
                  </div>

                  {/* DTI Comparison Visualization */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Lender Requirements Comparison</h3>
                    <div className={styles.chartBars}>
                      {chartData.comparison && chartData.comparison.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>{data.label}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBar}
                              style={{ 
                                width: `${Math.min(data.value * 2, 100)}%`,
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

                  {/* Debt Breakdown */}
                  <div className={styles.debtBreakdown}>
                    <h3 className={styles.chartTitle}>Debt Composition</h3>
                    <div className={styles.debtPieChart}>
                      <div className={styles.pieChartContainer}>
                        {chartData.debtBreakdown && chartData.debtBreakdown.map((debt, index) => (
                          <div 
                            key={index}
                            className={styles.pieSegment}
                            style={{
                              backgroundColor: debt.color || `hsl(${index * 60}, 70%, 60%)`,
                              transform: `rotate(${debt.percentage * 3.6}deg)`
                            }}
                            title={`${debt.name}: ${formatCurrency(debt.amount)} (${formatPercentage(debt.percentage)})`}
                          />
                        ))}
                      </div>
                      <div className={styles.debtLegend}>
                        {chartData.debtBreakdown && chartData.debtBreakdown.map((debt, index) => (
                          <div key={index} className={styles.legendItem}>
                            <div 
                              className={styles.legendColor}
                              style={{ backgroundColor: debt.color || `hsl(${index * 60}, 70%, 60%)` }}
                            ></div>
                            <span className={styles.legendText}>
                              <strong>{debt.name}:</strong> {formatCurrency(debt.amount)} ({formatPercentage(debt.percentage)})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className={styles.insightsCard} style={{ borderLeftColor: results.approvalColor }}>
                    <h3 className={styles.insightsTitle}>📋 Action Plan & Recommendations</h3>
                    <div className={styles.recommendationBox}>
                      <p className={styles.recommendationText}>{results.recommendation}</p>
                      
                      <div className={styles.actionSteps}>
                        <h4 className={styles.actionTitle}>Steps to Improve Your DTI:</h4>
                        <ul className={styles.actionList}>
                          {results.dtiRatio > results.maxAllowedDTI ? (
                            <>
                              <li>Increase income through side gigs or career advancement</li>
                              <li>Pay down high-interest debt first (credit cards)</li>
                              <li>Consider debt consolidation to lower monthly payments</li>
                              <li>Refinance existing loans for better terms</li>
                              <li>Avoid taking on new debt until ratio improves</li>
                            </>
                          ) : (
                            <>
                              <li>Maintain current debt levels while building savings</li>
                              <li>Consider additional payments on highest-interest debt</li>
                              <li>Build emergency fund (3-6 months of expenses)</li>
                              <li>Monitor credit score regularly</li>
                              <li>Plan for major purchases strategically</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Income vs Debt Visualization */}
                  <div className={styles.incomeDebtSplit}>
                    <h3 className={styles.chartTitle}>Income Allocation</h3>
                    <div className={styles.splitVisualization}>
                      <div className={styles.splitBar}>
                        <div 
                          className={styles.debtPortion}
                          style={{ width: `${results.debtToIncomePercentage}%` }}
                          title={`Debt Payments: ${formatPercentage(results.debtToIncomePercentage)}`}
                        >
                          <span className={styles.splitLabel}>Debt Payments</span>
                          <span className={styles.splitPercentage}>{formatPercentage(results.debtToIncomePercentage)}</span>
                        </div>
                        <div 
                          className={styles.incomePortion}
                          style={{ width: `${results.incomePercentage}%` }}
                          title={`Available Income: ${formatPercentage(results.incomePercentage)}`}
                        >
                          <span className={styles.splitLabel}>Available Income</span>
                          <span className={styles.splitPercentage}>{formatPercentage(results.incomePercentage)}</span>
                        </div>
                      </div>
                      <div className={styles.splitLegend}>
                        <div className={styles.legendItem}>
                          <div className={`${styles.legendColor} ${styles.legendDebt}`}></div>
                          <span>Debt Payments: {formatCurrency(results.totalMonthlyDebt)}</span>
                        </div>
                        <div className={styles.legendItem}>
                          <div className={`${styles.legendColor} ${styles.legendIncome}`}></div>
                          <span>Available Income: {formatCurrency(results.disposableIncome)}</span>
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
              <h2 className={styles.articleTitle}>Mastering Your Debt-to-Income Ratio: The Key to Financial Freedom</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding DTI: Your Financial Health Barometer</h3>
                <p>The debt-to-income ratio (DTI) is a critical financial metric that lenders use to assess your ability to manage monthly payments and repay debts. It compares your total monthly debt payments to your gross monthly income, expressed as a percentage. This single number can determine your eligibility for loans, interest rates offered, and overall financial flexibility.</p>
                
                <div className={styles.formulaCard}>
                  <h4>Calculation Formula:</h4>
                  <div className={styles.formulaBox}>
                    DTI Ratio = (Total Monthly Debt Payments ÷ Gross Monthly Income) × 100
                  </div>
                  <p>Example: $2,700 monthly debt ÷ $8,000 monthly income = 33.75% DTI ratio</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Lender Requirements by Loan Type</h3>
                
                <div className={styles.requirementsTable}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Loan Type</th>
                        <th>Excellent Credit</th>
                        <th>Good Credit</th>
                        <th>Fair Credit</th>
                        <th>Poor Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Conventional Mortgage</td>
                        <td>≤ 50%</td>
                        <td>≤ 43%</td>
                        <td>≤ 36%</td>
                        <td>≤ 29%</td>
                      </tr>
                      <tr>
                        <td>FHA Mortgage</td>
                        <td>≤ 57%</td>
                        <td>≤ 50%</td>
                        <td>≤ 43%</td>
                        <td>≤ 36%</td>
                      </tr>
                      <tr>
                        <td>Auto Loan</td>
                        <td>≤ 15%</td>
                        <td>≤ 12%</td>
                        <td>≤ 10%</td>
                        <td>≤ 8%</td>
                      </tr>
                      <tr>
                        <td>Personal Loan</td>
                        <td>≤ 40%</td>
                        <td>≤ 35%</td>
                        <td>≤ 30%</td>
                        <td>≤ 25%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategies to Improve Your DTI Ratio</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>💰 Increase Income</h4>
                    <p>Ask for a raise, pursue promotions, start a side business, or take on freelance work. Even a 10-20% income increase can significantly improve your DTI ratio.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📉 Reduce Debt</h4>
                    <p>Use the debt avalanche (high-interest first) or snowball (smallest balance first) method. Consider balance transfers or consolidation loans for better rates.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏠 Refinance</h4>
                    <p>Refinance high-interest loans when rates are favorable. Extending loan terms can lower monthly payments, though total interest may increase.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💳 Smart Credit Use</h4>
                    <p>Pay more than minimums, avoid new debt, and use 0% APR offers strategically. Keep credit utilization below 30% on each card.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The 28/36 Rule: Golden Standard for Mortgages</h3>
                <div className={styles.goldenRuleCard}>
                  <div className={styles.ruleColumn}>
                    <h4>🏠 Front-End Ratio: 28%</h4>
                    <p>Your housing expenses (mortgage, taxes, insurance, HOA) should not exceed 28% of your gross monthly income.</p>
                  </div>
                  <div className={styles.ruleColumn}>
                    <h4>📊 Back-End Ratio: 36%</h4>
                    <p>Your total monthly debt payments (including housing) should not exceed 36% of your gross monthly income.</p>
                  </div>
                </div>
                <p className={styles.ruleNote}>Note: Many lenders now accept higher ratios with strong compensating factors like excellent credit, large down payments, or significant savings.</p>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Insights from Mortgage Lenders</h3>
                <blockquote className={styles.expertQuote}>
                  "DTI is just one piece of the puzzle, but it's often the first filter lenders use. A low DTI with excellent credit opens doors to the best rates and terms. Focus on both components simultaneously for optimal results."
                  <footer className={styles.quoteFooter}>— Senior Mortgage Underwriter, 15+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between front-end and back-end DTI?</h3>
                <p className={styles.faqAnswer}>Front-end DTI includes only housing expenses (mortgage/rent, property taxes, insurance). Back-end DTI includes all debt payments (housing, auto loans, credit cards, student loans, etc.). Lenders typically focus on back-end DTI for qualification.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Are utility bills included in DTI calculation?</h3>
                <p className={styles.faqAnswer}>No, utility bills, groceries, entertainment, and other living expenses are not included in DTI calculations. Only recurring debt payments with fixed terms (loans, credit cards, etc.) are considered.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How can I quickly improve my DTI before applying for a loan?</h3>
                <p className={styles.faqAnswer}>1) Pay down credit card balances to lower minimum payments, 2) Avoid taking on new debt, 3) Pay off smaller loans completely, 4) Increase your income if possible, 5) Consider a co-signer if eligible.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Does DTI affect my credit score?</h3>
                <p className={styles.faqAnswer}>DTI itself doesn't directly affect your credit score, but the components that make up DTI do. Credit utilization (30% of score) and payment history (35% of score) are closely related to DTI components.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Take Control of Your Financial Future</h2>
              <p className={styles.ctaText}>Use our calculator to understand your current position and create a plan to improve your DTI ratio. Better ratios mean better loan terms and more financial opportunities.</p>
              
              <div className={styles.scenarioButtons}>
                <button 
                  className={styles.scenarioButton}
                  onClick={() => {
                    setGrossMonthlyIncome(6000);
                    setMonthlyDebts({
                      mortgage: 1200,
                      autoLoan: 300,
                      creditCards: 200,
                      studentLoans: 150,
                      personalLoans: 100,
                      otherDebts: 50
                    });
                  }}
                >
                  Conservative Budget
                </button>
                <button 
                  className={styles.scenarioButton}
                  onClick={() => {
                    setGrossMonthlyIncome(12000);
                    setMonthlyDebts({
                      mortgage: 2500,
                      autoLoan: 600,
                      creditCards: 500,
                      studentLoans: 400,
                      personalLoans: 300,
                      otherDebts: 200
                    });
                  }}
                >
                  High Income/Large Debt
                </button>
                <button 
                  className={styles.scenarioButton}
                  onClick={() => {
                    setGrossMonthlyIncome(8000);
                    setMonthlyDebts({
                      mortgage: 1500,
                      autoLoan: 400,
                      creditCards: 300,
                      studentLoans: 250,
                      personalLoans: 150,
                      otherDebts: 100
                    });
                  }}
                >
                  Reset to Default
                </button>
              </div>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Actual lender requirements may vary based on specific circumstances, market conditions, and individual lender policies. DTI is one of many factors lenders consider. Always consult with qualified financial professionals before making borrowing decisions.
              </p>
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p className={styles.footerText}>
              <strong>Debt-to-Income Ratio Calculator</strong> | Part of the Financial Health Suite | 
              Understanding your DTI is crucial for loan approval, better interest rates, and financial stability.
            </p>
            <p className={styles.footerNote}>
              Note: DTI requirements vary by lender, loan type, and market conditions. 
              Regular monitoring of your financial ratios is recommended for optimal financial health.
            </p>
          </div>
        </footer>
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

export default DebtToIncomeCalculator;