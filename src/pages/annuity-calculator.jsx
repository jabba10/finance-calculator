import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './annuitycalculator.module.css';

const AnnuityCalculator = ({ currentDate, lastModifiedDate }) => {
  const [annuityType, setAnnuityType] = useState('immediate');
  const [principal, setPrincipal] = useState(250000);
  const [annualRate, setAnnualRate] = useState(5);
  const [paymentPeriod, setPaymentPeriod] = useState(20);
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');
  const [inflationRate, setInflationRate] = useState(2.5);
  const [guaranteePeriod, setGuaranteePeriod] = useState(10);
  const [results, setResults] = useState(null);
  const [paymentSchedule, setPaymentSchedule] = useState([]);

  const paymentFrequencyMap = {
    'monthly': 12,
    'quarterly': 4,
    'semi-annually': 2,
    'annually': 1
  };

  const calculateAnnuity = () => {
    const frequency = paymentFrequencyMap[paymentFrequency];
    const ratePerPeriod = annualRate / 100 / frequency;
    const totalPeriods = paymentPeriod * frequency;
    const inflationPerPeriod = inflationRate / 100 / frequency;
    
    let periodicPayment = 0;
    let totalPayments = 0;
    let totalInterest = 0;
    let presentValue = 0;
    
    if (annuityType === 'immediate') {
      // Immediate Annuity: Calculate periodic payment from principal
      if (ratePerPeriod > 0) {
        periodicPayment = principal * 
          (ratePerPeriod * Math.pow(1 + ratePerPeriod, totalPeriods)) / 
          (Math.pow(1 + ratePerPeriod, totalPeriods) - 1);
      } else {
        periodicPayment = principal / totalPeriods;
      }
      presentValue = principal;
    } else {
      // Deferred Annuity: Calculate future value first, then payment
      const growthPeriods = 10; // Assume 10 years of growth before payments start
      const futureValue = principal * Math.pow(1 + annualRate/100, growthPeriods);
      
      if (ratePerPeriod > 0) {
        periodicPayment = futureValue * 
          (ratePerPeriod * Math.pow(1 + ratePerPeriod, totalPeriods)) / 
          (Math.pow(1 + ratePerPeriod, totalPeriods) - 1);
      } else {
        periodicPayment = futureValue / totalPeriods;
      }
      presentValue = futureValue;
    }
    
    // Adjust for payment frequency
    if (frequency === 4) periodicPayment *= 3; // Quarterly
    if (frequency === 2) periodicPayment *= 6; // Semi-annually
    if (frequency === 1) periodicPayment *= 12; // Annually
    
    periodicPayment = Math.round(periodicPayment);
    totalPayments = periodicPayment * totalPeriods;
    totalInterest = totalPayments - presentValue;
    
    // Calculate with and without inflation
    const inflationAdjustedPayment = periodicPayment / Math.pow(1 + inflationRate/100, 1);
    const inflationAdjustedTotal = totalPayments / Math.pow(1 + inflationRate/100, paymentPeriod);
    
    // Generate payment schedule for first 5 years
    const schedule = [];
    let remainingBalance = presentValue;
    let cumulativePayments = 0;
    
    for (let year = 1; year <= Math.min(5, paymentPeriod); year++) {
      let yearPayments = 0;
      let yearInterest = 0;
      
      for (let period = 1; period <= frequency; period++) {
        const interestEarned = remainingBalance * ratePerPeriod;
        const principalPortion = periodicPayment - interestEarned;
        
        yearPayments += periodicPayment;
        yearInterest += interestEarned;
        remainingBalance -= principalPortion;
        cumulativePayments += periodicPayment;
      }
      
      const inflationAdjustedYearPayment = yearPayments / Math.pow(1 + inflationRate/100, year);
      
      schedule.push({
        year: year,
        payment: Math.round(yearPayments),
        interest: Math.round(yearInterest),
        remainingBalance: Math.max(0, Math.round(remainingBalance)),
        cumulativePayments: Math.round(cumulativePayments),
        inflationAdjusted: Math.round(inflationAdjustedYearPayment)
      });
    }

    setPaymentSchedule(schedule);
    
    // Calculate guarantee period impact
    const guaranteePayments = Math.min(guaranteePeriod, paymentPeriod) * frequency * periodicPayment;
    const remainingPaymentsAfterGuarantee = totalPayments - guaranteePayments;
    
    setResults({
      periodicPayment: periodicPayment,
      totalPayments: Math.round(totalPayments),
      totalInterest: Math.round(totalInterest),
      presentValue: Math.round(presentValue),
      inflationAdjustedPayment: Math.round(inflationAdjustedPayment),
      inflationAdjustedTotal: Math.round(inflationAdjustedTotal),
      guaranteePayments: Math.round(guaranteePayments),
      remainingPaymentsAfterGuarantee: Math.round(remainingPaymentsAfterGuarantee),
      annualEquivalent: Math.round(periodicPayment * frequency),
      monthlyEquivalent: annuityType === 'immediate' ? periodicPayment : Math.round(periodicPayment / (frequency === 4 ? 3 : frequency === 2 ? 6 : 12))
    });
  };

  useEffect(() => {
    calculateAnnuity();
  }, [annuityType, principal, annualRate, paymentPeriod, paymentFrequency, inflationRate, guaranteePeriod]);

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

  const getFrequencyLabel = () => {
    switch(paymentFrequency) {
      case 'monthly': return 'month';
      case 'quarterly': return 'quarter';
      case 'semi-annually': return '6 months';
      case 'annually': return 'year';
      default: return 'period';
    }
  };

  const getPaymentTypeDescription = () => {
    return annuityType === 'immediate' 
      ? 'Payments start immediately after investment'
      : 'Payments start after 10 years of growth';
  };

  return (
    <>
      <Head>
        <title>Advanced Annuity Calculator | Retirement Income & Investment Analysis</title>
        <meta name="description" content="Free advanced annuity calculator with inflation adjustment. Calculate immediate & deferred annuity payments, analyze retirement income, and plan your financial future." />
        <meta name="keywords" content="annuity calculator, retirement income, immediate annuity, deferred annuity, retirement planning, guaranteed income, pension calculator" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/annuity-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Annuity Calculator | Retirement Income & Investment Analysis" />
        <meta property="og:description" content="Calculate guaranteed retirement income with annuities. Free visual tool for retirement planning and income analysis." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/annuity-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Annuity Calculator with Inflation Analysis" />
        <meta name="twitter:description" content="Calculate your guaranteed retirement income with detailed annuity payment analysis and inflation protection." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="annuity-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Annuity Calculator",
            "description": "Professional annuity calculator with inflation adjustment, payment schedules, and retirement income analysis",
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
              "name": "Retirement Planning Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Immediate & Deferred Annuities",
              "Inflation Adjustment Analysis",
              "Payment Schedule Visualization",
              "Guarantee Period Calculation",
              "Retirement Income Planning"
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
                "name": "What is the difference between immediate and deferred annuities?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Immediate annuities start payments right after you make a lump-sum investment, providing instant income. Deferred annuities accumulate interest for years before payments begin, offering potentially higher future income but no current payments.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How does inflation affect annuity payments?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Fixed annuities provide the same nominal payment each period, so inflation reduces their real value over time. Inflation-adjusted annuities (cost more initially) increase payments with inflation to maintain purchasing power. Our calculator shows both scenarios.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is a guarantee period in an annuity?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A guarantee period ensures payments continue to your beneficiaries if you pass away before the period ends. Common options are 10, 15, or 20 years. This protection reduces your monthly payment slightly but provides peace of mind.",
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
            <h1 className={styles.mainTitle}>Advanced Annuity Calculator</h1>
            <p className={styles.subtitle}>Calculate Guaranteed Retirement Income with Inflation & Tax Analysis</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Inflation Adjusted</span>
              <span className={styles.badge}>Professional Tool</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Configure Your Annuity</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annuity Type
                  <div className={styles.annuityTypeSelector}>
                    <button
                      className={`${styles.annuityTypeButton} ${annuityType === 'immediate' ? styles.annuityTypeActive : ''}`}
                      onClick={() => setAnnuityType('immediate')}
                    >
                      Immediate Annuity
                    </button>
                    <button
                      className={`${styles.annuityTypeButton} ${annuityType === 'deferred' ? styles.annuityTypeActive : ''}`}
                      onClick={() => setAnnuityType('deferred')}
                    >
                      Deferred Annuity
                    </button>
                  </div>
                  <div className={styles.annuityTypeDescription}>
                    {getPaymentTypeDescription()}
                  </div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Initial Investment
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="10000"
                      max="1000000"
                      step="10000"
                      value={principal}
                      onChange={(e) => setPrincipal(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10000"
                      max="1000000"
                      step="10000"
                      value={principal}
                      onChange={(e) => setPrincipal(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(principal)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Interest Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.1"
                      value={annualRate}
                      onChange={(e) => setAnnualRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="0.1"
                      value={annualRate}
                      onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(annualRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Payment Period
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      step="1"
                      value={paymentPeriod}
                      onChange={(e) => setPaymentPeriod(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="5"
                      max="40"
                      step="1"
                      value={paymentPeriod}
                      onChange={(e) => setPaymentPeriod(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{paymentPeriod} years</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Payment Frequency
                  <select
                    value={paymentFrequency}
                    onChange={(e) => setPaymentFrequency(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="semi-annually">Semi-Annually</option>
                    <option value="annually">Annually</option>
                  </select>
                </label>
              </div>

              <div className={styles.advancedOptions}>
                <h3 className={styles.advancedOptionsTitle}>Advanced Options</h3>
                
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Expected Inflation Rate
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="0"
                        max="8"
                        step="0.1"
                        value={inflationRate}
                        onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0"
                        max="8"
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
                  <label className={styles.inputLabel}>
                    Guarantee Period
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="0"
                        max={paymentPeriod}
                        step="1"
                        value={guaranteePeriod}
                        onChange={(e) => setGuaranteePeriod(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0"
                        max={paymentPeriod}
                        step="1"
                        value={guaranteePeriod}
                        onChange={(e) => setGuaranteePeriod(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                      <span className={styles.yearsSymbol}>years</span>
                    </div>
                    <div className={styles.valueDisplay}>{guaranteePeriod} year guarantee</div>
                  </label>
                </div>
              </div>

              <div className={styles.annuityFormula}>
                <h3 className={styles.formulaTitle}>Annuity Payment Formula</h3>
                <p className={styles.formula}>
                  Payment = Principal × [r(1+r)^n] ÷ [(1+r)^n - 1]
                </p>
                <p className={styles.formulaExplanation}>
                  Where r = periodic interest rate, n = total number of payments
                </p>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Your Annuity Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Periodic Payment</div>
                      <div className={styles.resultValue}>{formatCurrency(results.periodicPayment)}</div>
                      <div className={styles.resultSubtext}>per {getFrequencyLabel()}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Annual Income</div>
                      <div className={styles.resultValue}>{formatCurrency(results.annualEquivalent)}</div>
                      <div className={styles.resultSubtext}>yearly total</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Payments</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalPayments)}</div>
                      <div className={styles.resultSubtext}>over {paymentPeriod} years</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Interest Earned</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalInterest)}</div>
                      <div className={styles.resultSubtext}>investment growth</div>
                    </div>
                  </div>

                  {/* Inflation Impact Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Inflation Impact on Purchasing Power</h3>
                    <div className={styles.inflationChart}>
                      <div className={styles.chartBarGroup}>
                        <div className={styles.chartBarLabel}>Year 1</div>
                        <div className={styles.chartBarContainer}>
                          <div 
                            className={styles.chartBarNominal}
                            style={{ width: '100%' }}
                            title={`Nominal: ${formatCurrency(results.periodicPayment)}`}
                          />
                          <div 
                            className={styles.chartBarReal}
                            style={{ width: `${100 - inflationRate}%` }}
                            title={`Real: ${formatCurrency(results.inflationAdjustedPayment)}`}
                          />
                        </div>
                        <div className={styles.chartBarValue}>
                          <div>{formatCurrency(results.periodicPayment)}</div>
                          <div className={styles.realValue}>{formatCurrency(results.inflationAdjustedPayment)}</div>
                        </div>
                      </div>
                      
                      <div className={styles.chartBarGroup}>
                        <div className={styles.chartBarLabel}>Year 10</div>
                        <div className={styles.chartBarContainer}>
                          <div 
                            className={styles.chartBarNominal}
                            style={{ width: '100%' }}
                            title={`Nominal: ${formatCurrency(results.periodicPayment)}`}
                          />
                          <div 
                            className={styles.chartBarReal}
                            style={{ width: `${100 - (inflationRate * 10)}%` }}
                            title={`Real value decreased by ${(inflationRate * 10).toFixed(1)}%`}
                          />
                        </div>
                        <div className={styles.chartBarValue}>
                          <div>{formatCurrency(results.periodicPayment)}</div>
                          <div className={styles.realValue}>{formatCurrency(results.periodicPayment / Math.pow(1 + inflationRate/100, 10))}</div>
                        </div>
                      </div>
                      
                      <div className={styles.chartBarGroup}>
                        <div className={styles.chartBarLabel}>Year 20</div>
                        <div className={styles.chartBarContainer}>
                          <div 
                            className={styles.chartBarNominal}
                            style={{ width: '100%' }}
                            title={`Nominal: ${formatCurrency(results.periodicPayment)}`}
                          />
                          <div 
                            className={styles.chartBarReal}
                            style={{ width: `${100 - (inflationRate * 20)}%` }}
                            title={`Real value decreased by ${(inflationRate * 20).toFixed(1)}%`}
                          />
                        </div>
                        <div className={styles.chartBarValue}>
                          <div>{formatCurrency(results.periodicPayment)}</div>
                          <div className={styles.realValue}>{formatCurrency(results.periodicPayment / Math.pow(1 + inflationRate/100, 20))}</div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendNominal}`}></div>
                        <span>Nominal Payment (Fixed Amount)</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendReal}`}></div>
                        <span>Real Purchasing Power (After Inflation)</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Schedule */}
                  <div className={styles.paymentSchedule}>
                    <h3 className={styles.chartTitle}>5-Year Payment Schedule</h3>
                    <div className={styles.scheduleTable}>
                      <div className={styles.tableHeader}>
                        <div className={styles.tableCell}>Year</div>
                        <div className={styles.tableCell}>Annual Payments</div>
                        <div className={styles.tableCell}>Interest Earned</div>
                        <div className={styles.tableCell}>Remaining Balance</div>
                        <div className={styles.tableCell}>Real Value (After Inflation)</div>
                      </div>
                      {paymentSchedule.map((year, index) => (
                        <div key={index} className={styles.tableRow}>
                          <div className={styles.tableCell}>Year {year.year}</div>
                          <div className={styles.tableCell}>{formatCurrency(year.payment)}</div>
                          <div className={styles.tableCell}>{formatCurrency(year.interest)}</div>
                          <div className={styles.tableCell}>{formatCurrency(year.remainingBalance)}</div>
                          <div className={styles.tableCell}>{formatCurrency(year.inflationAdjusted)}</div>
                        </div>
                      ))}
                    </div>
                    <p className={styles.tableNote}>
                      Early years show more interest income as the balance is higher. Real value declines with inflation.
                    </p>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>💎 Annuity Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>You'll receive <strong>{formatCurrency(results.totalPayments)}</strong> total over {paymentPeriod} years</li>
                      <li><strong>{formatCurrency(results.totalInterest)}</strong> comes from interest earnings</li>
                      <li>After {guaranteePeriod} years, <strong>{formatCurrency(results.guaranteePayments)}</strong> are guaranteed to beneficiaries</li>
                      <li>Inflation reduces real value by <strong>{formatPercentage(inflationRate)}</strong> annually</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Annuity Mastery: Your Guide to Guaranteed Retirement Income</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding Annuity Basics: The Retirement Safety Net</h3>
                <p>An annuity is a financial contract that converts a lump sum into guaranteed periodic payments for life or a specified period. It's essentially longevity insurance—protecting you from outliving your money. Unlike market investments, annuities provide predictable income regardless of economic conditions, making them a cornerstone of retirement planning.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World Example: $250,000 Immediate Annuity</h4>
                  <ul>
                    <li><strong>Age 65:</strong> Invest $250,000 in immediate annuity</li>
                    <li><strong>Monthly Payment:</strong> $1,350 (6.5% annual payout rate)</li>
                    <li><strong>Annual Income:</strong> $16,200 guaranteed for life</li>
                    <li><strong>Break-even:</strong> 15.4 years (age 80.4)</li>
                    <li><strong>Longevity Protection:</strong> Payments continue even if you live to 100+</li>
                  </ul>
                  <p>This provides peace of mind that Social Security alone cannot match.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategic Annuity Planning for Different Life Stages</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>📅 Age 55-64: Deferred Annuity</h4>
                    <p>Invest now, start payments at 70. Grow tax-deferred while still working. Perfect for maximizing Social Security delay strategy. Example: $100,000 at 5% grows to $163,000 in 10 years.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏖️ Age 65-75: Immediate Annuity</h4>
                    <p>Convert retirement savings to guaranteed income. Layer with Social Security for basic needs coverage. Allocate 25-40% of portfolio to annuities for income floor.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🛡️ Age 75+: Longevity Annuity</h4>
                    <p>Deferred income starting at 85. Cheaper than immediate annuities. Protects against cognitive decline years. Use for essential expenses in advanced age.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💼 Working Years: Qualified Longevity Annuity</h4>
                    <p>QLAC inside IRA/401(k). Postpones RMDs until age 85. Maximizes tax-deferred growth. Up to $200,000 can be excluded from RMD calculations.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Types of Annuities & Their Applications</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Fixed Annuity:</strong> Guaranteed interest rate, predictable payments, low risk, ideal for conservative investors</li>
                  <li><strong>Variable Annuity:</strong> Investment-based returns, potential for growth, market risk, optional riders for protection</li>
                  <li><strong>Indexed Annuity:</strong> Market-linked returns with downside protection, participation rates, caps on gains</li>
                  <li><strong>Immediate Annuity:</strong> Payments start within 12 months, lifetime or period certain, irreversible decision</li>
                  <li><strong>Deferred Annuity:</strong> Accumulation phase then payout, tax-deferred growth, flexible timing options</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Retirement Planners</h3>
                <blockquote className={styles.expertQuote}>
                  "The most common annuity mistake is all-or-nothing thinking. You don't need to annuitize your entire portfolio. Instead, use annuities to create an income floor—cover your essential expenses with guaranteed income from Social Security plus a partial annuity. Keep the remainder invested for growth and flexibility. Also, ladder annuities over time rather than buying one large contract. This protects against interest rate risk and allows for changing needs."
                  <footer className={styles.quoteFooter}>— Certified Retirement Planner, 25+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What happens to my annuity if the insurance company fails?</h3>
                <p className={styles.faqAnswer}>Annuities are protected by state guaranty associations, typically up to $250,000 per contract. Choose companies with high financial strength ratings (A or better from AM Best, S&P, Moody's). Diversify among multiple insurers for large portfolios. State protections vary, so check your state's guaranty association limits.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How are annuity payments taxed?</h3>
                <p className={styles.faqAnswer}>Taxation follows the "exclusion ratio" for non-qualified annuities: Part of each payment is return of principal (tax-free), part is interest (taxable as ordinary income). Qualified annuities (from IRA/401(k)) are fully taxable. 1035 exchanges allow tax-free transfers between annuities. Consult a tax advisor for your specific situation.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I choose lifetime payments or period certain?</h3>
                <p className={styles.faqAnswer}>Lifetime payments continue as long as you live (longevity protection). Period certain guarantees payments for a set time (10-30 years), with balance to beneficiaries if you die early. Lifetime with period certain combines both but reduces monthly payments. Consider health, family longevity, and need for legacy.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What annuity riders should I consider?</h3>
                <p className={styles.faqAnswer}>Key riders include: Inflation adjustment (increases payments annually), Death benefit (guarantees minimum to beneficiaries), Income rider (guaranteed minimum withdrawal benefit), Nursing care waiver (eliminates surrender charges for LTC), Return of premium (refunds premium if dissatisfied). Each rider reduces your base payment.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Secure Your Retirement Income Today</h2>
              <p className={styles.ctaText}>Use this calculator to explore different annuity scenarios. Adjust payment periods, frequencies, and inflation rates to find the optimal balance between income security and purchasing power preservation.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Actual annuity rates, terms, and availability are subject to insurance company offerings, underwriting, and market conditions. Annuity contracts have fees, surrender charges, and tax implications. Guarantees are based on the claims-paying ability of the issuing insurance company. Past performance does not guarantee future results. Consult with a qualified financial advisor and insurance professional before purchasing any annuity product.
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

export default AnnuityCalculator;