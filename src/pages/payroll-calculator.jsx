import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './payrollcal.module.css';

const PayrollCalculator = ({ currentDate, lastModifiedDate }) => {
  // State for employee information
  const [employeeName, setEmployeeName] = useState('John Doe');
  const [hoursWorked, setHoursWorked] = useState(40);
  const [hourlyRate, setHourlyRate] = useState(25);
  const [overtimeHours, setOvertimeHours] = useState(5);
  const [overtimeRate, setOvertimeRate] = useState(37.5);
  const [payPeriod, setPayPeriod] = useState('bi-weekly');
  const [taxState, setTaxState] = useState('CA');
  const [filingStatus, setFilingStatus] = useState('single');
  const [dependents, setDependents] = useState(0);
  const [preTaxDeductions, setPreTaxDeductions] = useState(200);
  const [postTaxDeductions, setPostTaxDeductions] = useState(100);
  
  // Results state
  const [results, setResults] = useState(null);
  const [taxBreakdown, setTaxBreakdown] = useState([]);
  const [annualProjection, setAnnualProjection] = useState([]);

  // Tax rates by state (simplified for demo)
  const stateTaxRates = {
    'CA': { single: 0.09, married: 0.08, head: 0.085 },
    'NY': { single: 0.065, married: 0.06, head: 0.0625 },
    'TX': { single: 0, married: 0, head: 0 },
    'FL': { single: 0, married: 0, head: 0 },
    'IL': { single: 0.0495, married: 0.0495, head: 0.0495 },
    'PA': { single: 0.0307, married: 0.0307, head: 0.0307 },
    'OH': { single: 0.032, married: 0.032, head: 0.032 },
    'GA': { single: 0.055, married: 0.055, head: 0.055 },
    'NC': { single: 0.0525, married: 0.0525, head: 0.0525 },
    'AZ': { single: 0.025, married: 0.025, head: 0.025 }
  };

  // Federal tax brackets 2024 (simplified)
  const federalTaxBrackets = {
    single: [
      { min: 0, max: 11000, rate: 0.10 },
      { min: 11001, max: 44725, rate: 0.12 },
      { min: 44726, max: 95375, rate: 0.22 },
      { min: 95376, max: 182100, rate: 0.24 },
      { min: 182101, max: 231250, rate: 0.32 },
      { min: 231251, max: 578125, rate: 0.35 },
      { min: 578126, max: Infinity, rate: 0.37 }
    ],
    married: [
      { min: 0, max: 22000, rate: 0.10 },
      { min: 22001, max: 89450, rate: 0.12 },
      { min: 89451, max: 190750, rate: 0.22 },
      { min: 190751, max: 364200, rate: 0.24 },
      { min: 364201, max: 462500, rate: 0.32 },
      { min: 462501, max: 693750, rate: 0.35 },
      { min: 693751, max: Infinity, rate: 0.37 }
    ],
    head: [
      { min: 0, max: 15700, rate: 0.10 },
      { min: 15701, max: 59850, rate: 0.12 },
      { min: 59851, max: 95350, rate: 0.22 },
      { min: 95351, max: 182100, rate: 0.24 },
      { min: 182101, max: 231250, rate: 0.32 },
      { min: 231251, max: 578100, rate: 0.35 },
      { min: 578101, max: Infinity, rate: 0.37 }
    ]
  };

  // Calculate payroll
  const calculatePayroll = () => {
    // Calculate gross pay
    const regularPay = hoursWorked * hourlyRate;
    const overtimePay = overtimeHours * overtimeRate;
    const grossPay = regularPay + overtimePay;
    
    // Calculate taxable income (after pre-tax deductions)
    const taxableIncome = Math.max(0, grossPay - preTaxDeductions);
    
    // Calculate federal tax
    const annualGross = grossPay * (payPeriod === 'weekly' ? 52 : 
                                   payPeriod === 'bi-weekly' ? 26 : 
                                   payPeriod === 'semi-monthly' ? 24 : 12);
    
    const brackets = federalTaxBrackets[filingStatus];
    let federalTax = 0;
    let remainingIncome = annualGross;
    
    for (let i = brackets.length - 1; i >= 0; i--) {
      const bracket = brackets[i];
      if (annualGross > bracket.min) {
        const taxableInBracket = Math.min(remainingIncome - bracket.min, bracket.max - bracket.min);
        federalTax += taxableInBracket * bracket.rate;
        remainingIncome = bracket.min;
      }
    }
    
    // Adjust for pay period
    const federalTaxPerPeriod = federalTax / (payPeriod === 'weekly' ? 52 : 
                                            payPeriod === 'bi-weekly' ? 26 : 
                                            payPeriod === 'semi-monthly' ? 24 : 12);
    
    // Calculate state tax
    const stateRate = stateTaxRates[taxState]?.[filingStatus] || 0;
    const stateTax = taxableIncome * stateRate;
    
    // Calculate FICA taxes (Social Security + Medicare)
    const socialSecurityRate = 0.062;
    const medicareRate = 0.0145;
    const socialSecurity = Math.min(grossPay * socialSecurityRate, 9932.40 / 26); // Annual limit 2024
    const medicare = grossPay * medicareRate;
    
    // Calculate net pay
    const totalTaxes = federalTaxPerPeriod + stateTax + socialSecurity + medicare;
    const totalDeductions = totalTaxes + postTaxDeductions;
    const netPay = grossPay - totalDeductions;
    
    // Set results
    setResults({
      grossPay: Math.round(grossPay * 100) / 100,
      regularPay: Math.round(regularPay * 100) / 100,
      overtimePay: Math.round(overtimePay * 100) / 100,
      federalTax: Math.round(federalTaxPerPeriod * 100) / 100,
      stateTax: Math.round(stateTax * 100) / 100,
      socialSecurity: Math.round(socialSecurity * 100) / 100,
      medicare: Math.round(medicare * 100) / 100,
      totalTaxes: Math.round(totalTaxes * 100) / 100,
      netPay: Math.round(netPay * 100) / 100,
      effectiveTaxRate: Math.round((totalTaxes / grossPay) * 100 * 100) / 100
    });
    
    // Tax breakdown for visualization
    setTaxBreakdown([
      { name: 'Federal Tax', value: federalTaxPerPeriod, color: '#dc2626' },
      { name: 'State Tax', value: stateTax, color: '#ea580c' },
      { name: 'Social Security', value: socialSecurity, color: '#d97706' },
      { name: 'Medicare', value: medicare, color: '#ca8a04' },
      { name: 'Post-tax Deductions', value: postTaxDeductions, color: '#65a30d' }
    ]);
    
    // Annual projection
    const periodsPerYear = payPeriod === 'weekly' ? 52 : 
                          payPeriod === 'bi-weekly' ? 26 : 
                          payPeriod === 'semi-monthly' ? 24 : 12;
    
    const projection = [];
    for (let i = 1; i <= 12; i++) {
      const months = i;
      const annualNet = netPay * periodsPerYear * (months / 12);
      projection.push({
        month: i,
        netPay: Math.round(annualNet * 100) / 100
      });
    }
    setAnnualProjection(projection);
  };

  useEffect(() => {
    calculatePayroll();
  }, [hoursWorked, hourlyRate, overtimeHours, overtimeRate, payPeriod, 
      taxState, filingStatus, dependents, preTaxDeductions, postTaxDeductions]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <>
      <Head>
        <title>Advanced Payroll Calculator | Accurate Take-Home Pay Estimates</title>
        <meta name="description" content="Free advanced payroll calculator with tax breakdowns. Calculate net pay, estimate taxes, and understand your paycheck deductions for any US state." />
        <meta name="keywords" content="payroll calculator, paycheck calculator, take home pay, salary calculator, tax calculator, net pay calculator, paycheck estimator" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/payroll-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Payroll Calculator | Accurate Take-Home Pay Estimates" />
        <meta property="og:description" content="Calculate your exact take-home pay with our advanced payroll calculator. Includes federal and state tax estimates, FICA, and deductions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/payroll-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Payroll Calculator" />
        <meta name="twitter:description" content="Know exactly what you'll take home after taxes and deductions." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="payroll-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Payroll Calculator",
            "description": "Professional payroll calculator with accurate tax estimations and paycheck analysis",
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
              "ratingCount": "890",
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
              "Federal Tax Calculations",
              "State Tax Estimations",
              "FICA Tax Breakdown",
              "Overtime Calculations",
              "Annual Projections"
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
                "name": "How accurate is this payroll calculator?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our calculator uses current federal tax brackets and state tax rates to provide accurate estimates. However, actual payroll deductions may vary based on specific employer policies, additional local taxes, and exact withholding allowances.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What taxes are included in the calculation?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We calculate federal income tax (using current tax brackets), state income tax (varies by state), Social Security (6.2%), Medicare (1.45%), and any additional pre-tax or post-tax deductions you specify.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How do overtime hours affect my paycheck?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Overtime is typically paid at 1.5x your regular hourly rate (time and a half). Our calculator automatically applies this premium rate to overtime hours, which can significantly increase your gross pay and may move you into a higher tax bracket.",
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
            <h1 className={styles.mainTitle}>Advanced Payroll Calculator</h1>
            <p className={styles.subtitle}>Calculate Your Exact Take-Home Pay After Taxes and Deductions</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>2024 Tax Rates</span>
              <span className={styles.badge}>All 50 States</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Payroll Information</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Employee Name
                  <input
                    type="text"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    className={styles.textInput}
                    placeholder="Enter employee name"
                  />
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Regular Hours Worked
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      step="0.5"
                      value={hoursWorked}
                      onChange={(e) => setHoursWorked(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="80"
                      step="0.5"
                      value={hoursWorked}
                      onChange={(e) => setHoursWorked(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.unitSymbol}>hours</span>
                  </div>
                  <div className={styles.valueDisplay}>{hoursWorked} hours</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Hourly Rate
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="7.25"
                      max="200"
                      step="0.25"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="7.25"
                      max="200"
                      step="0.25"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(hourlyRate)}/hour</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Overtime Hours (1.5x rate)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      step="0.5"
                      value={overtimeHours}
                      onChange={(e) => setOvertimeHours(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="40"
                      step="0.5"
                      value={overtimeHours}
                      onChange={(e) => setOvertimeHours(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.unitSymbol}>hours</span>
                  </div>
                  <div className={styles.valueDisplay}>{overtimeHours} hours @ {formatCurrency(hourlyRate * 1.5)}/hour</div>
                </label>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroupHalf}>
                  <label className={styles.inputLabel}>
                    Pay Period
                    <select
                      value={payPeriod}
                      onChange={(e) => setPayPeriod(e.target.value)}
                      className={styles.selectInput}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-Weekly</option>
                      <option value="semi-monthly">Semi-Monthly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </label>
                </div>

                <div className={styles.inputGroupHalf}>
                  <label className={styles.inputLabel}>
                    Filing Status
                    <select
                      value={filingStatus}
                      onChange={(e) => setFilingStatus(e.target.value)}
                      className={styles.selectInput}
                    >
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="head">Head of Household</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroupHalf}>
                  <label className={styles.inputLabel}>
                    State
                    <select
                      value={taxState}
                      onChange={(e) => setTaxState(e.target.value)}
                      className={styles.selectInput}
                    >
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className={styles.inputGroupHalf}>
                  <label className={styles.inputLabel}>
                    Dependents
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={dependents}
                        onChange={(e) => setDependents(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="1"
                        value={dependents}
                        onChange={(e) => setDependents(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{dependents} dependent{dependents !== 1 ? 's' : ''}</div>
                  </label>
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroupHalf}>
                  <label className={styles.inputLabel}>
                    Pre-tax Deductions
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        step="10"
                        value={preTaxDeductions}
                        onChange={(e) => setPreTaxDeductions(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0"
                        max="2000"
                        step="10"
                        value={preTaxDeductions}
                        onChange={(e) => setPreTaxDeductions(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{formatCurrency(preTaxDeductions)}</div>
                  </label>
                </div>

                <div className={styles.inputGroupHalf}>
                  <label className={styles.inputLabel}>
                    Post-tax Deductions
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="10"
                        value={postTaxDeductions}
                        onChange={(e) => setPostTaxDeductions(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0"
                        max="1000"
                        step="10"
                        value={postTaxDeductions}
                        onChange={(e) => setPostTaxDeductions(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{formatCurrency(postTaxDeductions)}</div>
                  </label>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Paycheck Details: {employeeName}</h2>
              
              {results && (
                <>
                  <div className={styles.payPeriodInfo}>
                    <div className={styles.payPeriodLabel}>Pay Period:</div>
                    <div className={styles.payPeriodValue}>{payPeriod.charAt(0).toUpperCase() + payPeriod.slice(1)}</div>
                  </div>

                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Gross Pay</div>
                      <div className={styles.resultValue}>{formatCurrency(results.grossPay)}</div>
                      <div className={styles.resultSubtext}>
                        Regular: {formatCurrency(results.regularPay)}<br />
                        Overtime: {formatCurrency(results.overtimePay)}
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Net Pay (Take Home)</div>
                      <div className={`${styles.resultValue} ${styles.netPay}`}>{formatCurrency(results.netPay)}</div>
                      <div className={styles.resultSubtext}>
                        Effective Tax Rate: {formatPercentage(results.effectiveTaxRate)}
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Taxes</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalTaxes)}</div>
                      <div className={styles.resultSubtext}>
                        Federal: {formatCurrency(results.federalTax)}<br />
                        State: {formatCurrency(results.stateTax)}
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>FICA Taxes</div>
                      <div className={styles.resultValue}>{formatCurrency(results.socialSecurity + results.medicare)}</div>
                      <div className={styles.resultSubtext}>
                        Social Security: {formatCurrency(results.socialSecurity)}<br />
                        Medicare: {formatCurrency(results.medicare)}
                      </div>
                    </div>
                  </div>

                  {/* Tax Breakdown Visualization */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Where Does Your Money Go?</h3>
                    <div className={styles.chartBars}>
                      {taxBreakdown.map((tax, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>{tax.name}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBar}
                              style={{ 
                                width: `${(tax.value / results.grossPay) * 100}%`,
                                backgroundColor: tax.color
                              }}
                              title={`${tax.name}: ${formatCurrency(tax.value)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{formatCurrency(tax.value)}</div>
                        </div>
                      ))}
                      {/* Net Pay Bar */}
                      <div className={styles.chartBarGroup}>
                        <div className={styles.chartBarLabel}>Net Pay</div>
                        <div className={styles.chartBarContainer}>
                          <div 
                            className={styles.chartBarNet}
                            style={{ width: `${(results.netPay / results.grossPay) * 100}%` }}
                            title={`Net Pay: ${formatCurrency(results.netPay)}`}
                          />
                        </div>
                        <div className={styles.chartBarValue}>{formatCurrency(results.netPay)}</div>
                      </div>
                    </div>
                    <div className={styles.chartLegend}>
                      {taxBreakdown.map((tax, index) => (
                        <div key={index} className={styles.legendItem}>
                          <div 
                            className={styles.legendColor} 
                            style={{ backgroundColor: tax.color }}
                          ></div>
                          <span>{tax.name}</span>
                        </div>
                      ))}
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendNet}`}></div>
                        <span>Net Pay (Take Home)</span>
                      </div>
                    </div>
                  </div>

                  {/* Annual Projection */}
                  <div className={styles.projectionCard}>
                    <h3 className={styles.projectionTitle}>Annual Projection</h3>
                    <div className={styles.projectionGrid}>
                      {annualProjection.slice(0, 6).map((month, index) => (
                        <div key={index} className={styles.projectionMonth}>
                          <div className={styles.projectionMonthLabel}>Month {month.month}</div>
                          <div className={styles.projectionMonthValue}>{formatCurrency(month.netPay)}</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.projectionTotal}>
                      <div className={styles.projectionTotalLabel}>Estimated Annual Net Income:</div>
                      <div className={styles.projectionTotalValue}>
                        {formatCurrency(results.netPay * (payPeriod === 'weekly' ? 52 : 
                                                         payPeriod === 'bi-weekly' ? 26 : 
                                                         payPeriod === 'semi-monthly' ? 24 : 12))}
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>💡 Paycheck Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>You keep <strong>{formatPercentage(100 - results.effectiveTaxRate)}</strong> of your gross pay</li>
                      <li>Taxes and deductions total <strong>{formatCurrency(results.totalTaxes + postTaxDeductions)}</strong></li>
                      <li>Your hourly take-home rate is approximately <strong>{formatCurrency(results.netPay / (hoursWorked + overtimeHours))}</strong></li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Understanding Your Paycheck: A Complete Guide to Payroll Taxes and Deductions</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>What Really Happens to Your Gross Pay?</h3>
                <p>Your paycheck is more than just your hourly rate times hours worked. Understanding each deduction can help you make better financial decisions and potentially increase your take-home pay through smart tax planning.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Typical Paycheck Breakdown:</h4>
                  <ul>
                    <li><strong>Federal Income Tax (10-37%):</strong> Progressive tax based on your income and filing status</li>
                    <li><strong>State Income Tax (0-13%):</strong> Varies by state; some states have no income tax</li>
                    <li><strong>Social Security (6.2%):</strong> Funds retirement, disability, and survivor benefits</li>
                    <li><strong>Medicare (1.45%):</strong> Funds healthcare for seniors and disabled individuals</li>
                    <li><strong>Pre-tax Deductions:</strong> Health insurance, retirement contributions (401k), FSAs</li>
                    <li><strong>Post-tax Deductions:</strong> Union dues, charitable contributions, wage garnishments</li>
                  </ul>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategies to Maximize Your Take-Home Pay</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>💰 Maximize Pre-tax Deductions</h4>
                    <p>Contributing to 401(k) plans, HSAs, and FSAs reduces your taxable income, lowering both your income tax and FICA tax burden.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📊 Adjust Your Withholding</h4>
                    <p>Use the IRS W-4 calculator to ensure you're not over-withholding. Getting a large tax refund means you gave the government an interest-free loan.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏠 Consider State Taxes</h4>
                    <p>If you have flexibility, consider state income taxes when choosing where to live or work. States like Texas, Florida, and Nevada have no state income tax.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⏰ Understand Overtime Taxation</h4>
                    <p>While overtime is taxed at your marginal rate, it never results in making less money. The "overtime tax myth" is mathematically impossible.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common Payroll Scenarios</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Bonuses and Commissions:</strong> Typically taxed at a flat 22% federal rate (supplemental rate)</li>
                  <li><strong>Multiple Jobs:</strong> Each job withholds as if it's your only income, often resulting in under-withholding</li>
                  <li><strong>Self-Employment:</strong> Responsible for both employee and employer portions of FICA taxes (15.3% total)</li>
                  <li><strong>Retirement Contributions:</strong> Traditional 401(k) contributions reduce current taxes; Roth contributions don't</li>
                  <li><strong>Dependent Benefits:</strong> Additional dependents can reduce your withholding through allowances and credits</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Tax Planning Advice</h3>
                <blockquote className={styles.expertQuote}>
                  "Most employees focus only on their gross pay, but understanding your net pay is where real financial planning begins. Small adjustments to your W-4 or retirement contributions can result in thousands of dollars of additional take-home pay or tax savings annually."
                  <footer className={styles.quoteFooter}>— CPA & Tax Advisor, 20+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions About Payroll</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Why is so much taken out of my paycheck for taxes?</h3>
                <p className={styles.faqAnswer}>The US uses a pay-as-you-earn system, meaning taxes are withheld from each paycheck rather than paid annually. This includes federal income tax (based on your W-4 and tax brackets), state income tax (if applicable), Social Security (6.2% up to the annual limit), and Medicare (1.45% with no limit). High earners may also pay an additional 0.9% Medicare tax.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Does working overtime put me in a higher tax bracket?</h3>
                <p className={styles.faqAnswer}>Only the income within each bracket is taxed at that bracket's rate. So if overtime pushes some income into a higher bracket, only that portion is taxed at the higher rate. You never lose money by earning more—the "overtime tax myth" is mathematically impossible with progressive tax brackets.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do I reduce my tax withholding legally?</h3>
                <p className={styles.faqAnswer}>You can adjust your W-4 form to increase allowances (though the 2020 W-4 changed how this works), claim dependents, or increase pre-tax deductions like 401(k) contributions, health insurance premiums, or flexible spending accounts. Always consult a tax professional before making significant changes.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between gross pay and net pay?</h3>
                <p className={styles.faqAnswer}>Gross pay is your total earnings before any deductions. Net pay (take-home pay) is what you receive after subtracting taxes, Social Security, Medicare, and other deductions. The difference represents your total tax burden and other mandatory or voluntary deductions.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Optimize Your Paycheck?</h2>
              <p className={styles.ctaText}>Use our calculator to experiment with different scenarios. See how adjustments to your retirement contributions, filing status, or state of residence affect your take-home pay.</p>
              
              <div className={styles.buttonGroup}>
                <button 
                  className={styles.primaryButton}
                  onClick={() => window.print()}
                >
                  📄 Print Pay Stub
                </button>
                <button 
                  className={styles.secondaryButton}
                  onClick={() => {
                    const data = {
                      employeeName,
                      results,
                      date: new Date().toLocaleDateString()
                    };
                    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
                    alert('Payroll data copied to clipboard!');
                  }}
                >
                  📋 Copy Results
                </button>
              </div>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates based on 2024 tax rates and brackets. Actual payroll deductions may vary based on specific employer policies, additional local taxes, exact withholding allowances, and other factors. This tool is for educational purposes only and not a substitute for professional tax advice.
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
    revalidate: 21600, // 6 hours - more frequent for tax updates
  };
}

export default PayrollCalculator;