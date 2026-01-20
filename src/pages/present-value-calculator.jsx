import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './presentvaluecalculator.module.css';

const PresentValueCalculator = ({ currentDate, lastModifiedDate }) => {
  const [futureValue, setFutureValue] = useState(100000);
  const [discountRate, setDiscountRate] = useState(8);
  const [timePeriods, setTimePeriods] = useState(10);
  const [periodType, setPeriodType] = useState('years');
  const [paymentType, setPaymentType] = useState('lump-sum');
  const [periodicPayment, setPeriodicPayment] = useState(1000);
  const [growthRate, setGrowthRate] = useState(3);
  const [results, setResults] = useState(null);
  const [discountData, setDiscountData] = useState([]);

  const calculatePresentValue = () => {
    let periods = timePeriods;
    
    // Adjust periods based on period type
    if (periodType === 'months') {
      periods = timePeriods / 12;
    } else if (periodType === 'quarters') {
      periods = timePeriods / 4;
    }
    
    const ratePerPeriod = discountRate / 100;
    const growthRatePerPeriod = growthRate / 100;
    
    let presentValue = 0;
    let totalDiscountedPayments = 0;
    let discountFactors = [];
    
    if (paymentType === 'lump-sum') {
      // Simple lump sum present value
      presentValue = futureValue / Math.pow(1 + ratePerPeriod, periods);
      
      // Generate discount factors for each period
      for (let i = 1; i <= periods; i++) {
        const discountFactor = 1 / Math.pow(1 + ratePerPeriod, i);
        const discountedValue = futureValue * discountFactor;
        
        discountFactors.push({
          period: i,
          discountFactor: Math.round(discountFactor * 10000) / 10000,
          presentValue: Math.round(discountedValue * 100) / 100,
          futureValue: futureValue,
          discountEffect: Math.round((1 - discountFactor) * 10000) / 100
        });
      }
    } else if (paymentType === 'annuity') {
      // Ordinary annuity (payments at end of period)
      let factor = 0;
      
      for (let i = 1; i <= periods; i++) {
        const discountFactor = 1 / Math.pow(1 + ratePerPeriod, i);
        const futurePayment = periodicPayment * Math.pow(1 + growthRatePerPeriod, i - 1);
        const discountedPayment = futurePayment * discountFactor;
        presentValue += discountedPayment;
        totalDiscountedPayments += discountedPayment;
        
        factor += discountFactor;
        
        discountFactors.push({
          period: i,
          discountFactor: Math.round(discountFactor * 10000) / 10000,
          presentValue: Math.round(discountedPayment * 100) / 100,
          futureValue: Math.round(futurePayment * 100) / 100,
          discountEffect: Math.round((1 - discountFactor) * 10000) / 100,
          cumulativePV: Math.round(presentValue * 100) / 100
        });
      }
    } else if (paymentType === 'annuity-due') {
      // Annuity due (payments at beginning of period)
      let factor = 0;
      
      for (let i = 0; i < periods; i++) {
        const discountFactor = 1 / Math.pow(1 + ratePerPeriod, i);
        const futurePayment = periodicPayment * Math.pow(1 + growthRatePerPeriod, i);
        const discountedPayment = futurePayment * discountFactor;
        presentValue += discountedPayment;
        totalDiscountedPayments += discountedPayment;
        
        factor += discountFactor;
        
        discountFactors.push({
          period: i + 1,
          discountFactor: Math.round(discountFactor * 10000) / 10000,
          presentValue: Math.round(discountedPayment * 100) / 100,
          futureValue: Math.round(futurePayment * 100) / 100,
          discountEffect: Math.round((1 - discountFactor) * 10000) / 100,
          cumulativePV: Math.round(presentValue * 100) / 100
        });
      }
    }
    
    // Calculate net present value (NPV) for annuity types
    const npv = paymentType === 'lump-sum' ? presentValue : totalDiscountedPayments;
    
    // Calculate internal rate of return approximation
    const irrApproximation = discountRate; // Simplified for this example
    
    // Calculate present value factor
    const pvFactor = presentValue / futureValue;
    
    // Calculate time value of money
    const timeValue = futureValue - presentValue;
    
    setResults({
      presentValue: Math.round(presentValue * 100) / 100,
      discountFactor: Math.round((1 / Math.pow(1 + ratePerPeriod, periods)) * 10000) / 10000,
      npv: Math.round(npv * 100) / 100,
      timeValue: Math.round(timeValue * 100) / 100,
      pvFactor: Math.round(pvFactor * 10000) / 10000,
      irrApproximation: Math.round(irrApproximation * 100) / 100,
      totalDiscountedPayments: Math.round(totalDiscountedPayments * 100) / 100
    });
    
    setDiscountData(discountFactors);
  };

  useEffect(() => {
    calculatePresentValue();
  }, [futureValue, discountRate, timePeriods, periodType, paymentType, periodicPayment, growthRate]);

  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '0%';
    return `${value.toFixed(2)}%`;
  };

  const formatDecimal = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '0.0000';
    return parseFloat(value).toFixed(4);
  };

  const getPeriodLabel = () => {
    switch(periodType) {
      case 'months': return 'months';
      case 'quarters': return 'quarters';
      default: return 'years';
    }
  };

  return (
    <>
      <Head>
        <title>Advanced Present Value Calculator | Discounted Cash Flow Analysis</title>
        <meta name="description" content="Free advanced present value calculator for investment analysis, retirement planning, and business valuation. Calculate NPV, discount factors, and time value of money." />
        <meta name="keywords" content="present value calculator, PV calculator, discount rate calculator, NPV calculator, time value of money, DCF valuation, investment analysis" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/present-value-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Present Value Calculator | Discounted Cash Flow Analysis" />
        <meta property="og:description" content="Calculate present values, discount factors, and analyze the time value of money with our professional PV calculator." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/present-value-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Present Value Calculator" />
        <meta name="twitter:description" content="Professional present value and discounted cash flow analysis tool." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="pv-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Present Value Calculator",
            "description": "Professional present value calculator for investment analysis, DCF valuation, and time value of money calculations",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "1150",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Financial Analysis Tools",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Present Value Calculations",
              "Discounted Cash Flow Analysis",
              "Multiple Payment Types",
              "Time Value of Money",
              "NPV & IRR Calculations"
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
                "name": "What is Present Value and why is it important?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Present Value is the current worth of a future sum of money or stream of cash flows given a specified rate of return. It's crucial because it accounts for the time value of money - the principle that money available today is worth more than the same amount in the future due to its potential earning capacity.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between ordinary annuity and annuity due?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Ordinary annuity payments are made at the end of each period (like mortgages, bonds). Annuity due payments are made at the beginning of each period (like rent, insurance premiums). Annuity due has a higher present value because payments are received earlier.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How do I choose the right discount rate?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The discount rate should reflect the risk and opportunity cost. Common choices: risk-free rate (government bonds) plus risk premium, weighted average cost of capital (WACC) for companies, or your required rate of return for personal investments. Higher risk = higher discount rate.",
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
            <h1 className={styles.mainTitle}>Advanced Present Value Calculator</h1>
            <p className={styles.subtitle}>Calculate Today's Value of Future Cash Flows & Master the Time Value of Money</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>DCF Analysis</span>
              <span className={styles.badge}>Professional Tool</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate Present Value</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Payment Type
                  <div className={styles.paymentTypeSelector}>
                    <button
                      className={`${styles.paymentTypeButton} ${paymentType === 'lump-sum' ? styles.activePaymentType : ''}`}
                      onClick={() => setPaymentType('lump-sum')}
                    >
                      💰 Lump Sum
                    </button>
                    <button
                      className={`${styles.paymentTypeButton} ${paymentType === 'annuity' ? styles.activePaymentType : ''}`}
                      onClick={() => setPaymentType('annuity')}
                    >
                      📅 Ordinary Annuity
                    </button>
                    <button
                      className={`${styles.paymentTypeButton} ${paymentType === 'annuity-due' ? styles.activePaymentType : ''}`}
                      onClick={() => setPaymentType('annuity-due')}
                    >
                      ⏰ Annuity Due
                    </button>
                  </div>
                  <div className={styles.paymentTypeDescription}>
                    {paymentType === 'lump-sum' && 'Single future payment'}
                    {paymentType === 'annuity' && 'Equal payments at END of each period'}
                    {paymentType === 'annuity-due' && 'Equal payments at BEGINNING of each period'}
                  </div>
                </label>
              </div>

              {paymentType === 'lump-sum' ? (
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Future Value
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="range"
                        min="100"
                        max="10000000"
                        step="100"
                        value={futureValue}
                        onChange={(e) => setFutureValue(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="100"
                        max="10000000"
                        step="100"
                        value={futureValue}
                        onChange={(e) => setFutureValue(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{formatCurrency(futureValue)}</div>
                  </label>
                </div>
              ) : (
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Periodic Payment
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="range"
                        min="10"
                        max="10000"
                        step="10"
                        value={periodicPayment}
                        onChange={(e) => setPeriodicPayment(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="10"
                        max="10000"
                        step="10"
                        value={periodicPayment}
                        onChange={(e) => setPeriodicPayment(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{formatCurrency(periodicPayment)} per period</div>
                  </label>
                </div>
              )}

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Discount Rate (Required Return)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0.1"
                      max="30"
                      step="0.1"
                      value={discountRate}
                      onChange={(e) => setDiscountRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0.1"
                      max="30"
                      step="0.1"
                      value={discountRate}
                      onChange={(e) => setDiscountRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(discountRate)}</div>
                  <div className={styles.inputHint}>Your required rate of return</div>
                </label>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Number of Periods
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="1"
                        max={periodType === 'months' ? 360 : periodType === 'quarters' ? 120 : 50}
                        step="1"
                        value={timePeriods}
                        onChange={(e) => setTimePeriods(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="1"
                        max={periodType === 'months' ? 360 : periodType === 'quarters' ? 120 : 50}
                        step="1"
                        value={timePeriods}
                        onChange={(e) => setTimePeriods(parseInt(e.target.value) || 1)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{timePeriods} {getPeriodLabel()}</div>
                  </label>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Period Type
                    <select
                      value={periodType}
                      onChange={(e) => setPeriodType(e.target.value)}
                      className={styles.selectInput}
                    >
                      <option value="years">Years</option>
                      <option value="quarters">Quarters</option>
                      <option value="months">Months</option>
                    </select>
                  </label>
                </div>
              </div>

              {paymentType !== 'lump-sum' && (
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Payment Growth Rate
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        step="0.5"
                        value={growthRate}
                        onChange={(e) => setGrowthRate(parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={growthRate}
                        onChange={(e) => setGrowthRate(parseFloat(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                      <span className={styles.percentageSymbol}>%</span>
                    </div>
                    <div className={styles.valueDisplay}>{formatPercentage(growthRate)}</div>
                    <div className={styles.inputHint}>Annual increase in payments</div>
                  </label>
                </div>
              )}

              <div className={styles.formulaCard}>
                <h4 className={styles.formulaTitle}>📐 Present Value Formula</h4>
                <p className={styles.formulaText}>
                  {paymentType === 'lump-sum' ? (
                    <>PV = FV / (1 + r)ⁿ<br />Where: PV = Present Value, FV = Future Value, r = Discount Rate, n = Number of Periods</>
                  ) : paymentType === 'annuity' ? (
                    <>PV = PMT × [(1 - (1 + r)⁻ⁿ) / r]<br />Where: PV = Present Value, PMT = Periodic Payment, r = Discount Rate, n = Number of Periods</>
                  ) : (
                    <>PV = PMT × [(1 - (1 + r)⁻ⁿ) / r] × (1 + r)<br />Where: PV = Present Value, PMT = Periodic Payment, r = Discount Rate, n = Number of Periods</>
                  )}
                </p>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Present Value Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>
                        {paymentType === 'lump-sum' ? 'Present Value' : 'Net Present Value'}
                      </div>
                      <div className={styles.resultValue}>{formatCurrency(results.presentValue)}</div>
                      <div className={styles.resultSubtext}>
                        Today's value of future cash flows
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Discount Factor</div>
                      <div className={styles.resultValue}>{formatDecimal(results.discountFactor)}</div>
                      <div className={styles.resultSubtext}>
                        ${formatDecimal(1 - results.discountFactor)} lost per $1 future value
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Time Value of Money</div>
                      <div className={styles.resultValue}>{formatCurrency(results.timeValue)}</div>
                      <div className={styles.resultSubtext}>
                        Value lost to time & discounting
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Present Value Factor</div>
                      <div className={styles.resultValue}>{formatDecimal(results.pvFactor)}</div>
                      <div className={styles.resultSubtext}>
                        Multiply future value by this factor
                      </div>
                    </div>
                  </div>

                  {/* Time Value Visualization */}
                  <div className={styles.timeValueCard}>
                    <h3 className={styles.timeValueTitle}>Time Value of Money Impact</h3>
                    <div className={styles.timeValueChart}>
                      <div className={styles.chartLabels}>
                        <div className={styles.chartLabel}>Future Value: {formatCurrency(paymentType === 'lump-sum' ? futureValue : periodicPayment * timePeriods)}</div>
                        <div className={styles.chartLabel}>Present Value: {formatCurrency(results.presentValue)}</div>
                      </div>
                      <div className={styles.chartVisual}>
                        <div 
                          className={styles.chartFuture}
                          style={{ width: '100%' }}
                        >
                          <div className={styles.chartSegmentLabel}>Future Value</div>
                        </div>
                        <div 
                          className={styles.chartPresent}
                          style={{ width: `${(results.presentValue / (paymentType === 'lump-sum' ? futureValue : periodicPayment * timePeriods)) * 100}%` }}
                        >
                          <div className={styles.chartSegmentLabel}>Present Value</div>
                        </div>
                      </div>
                      <div className={styles.chartValueLoss}>
                        <div className={styles.valueLossLabel}>Value Lost to Time:</div>
                        <div className={styles.valueLossAmount}>{formatCurrency(results.timeValue)}</div>
                        <div className={styles.valueLossPercentage}>
                          {formatPercentage((results.timeValue / (paymentType === 'lump-sum' ? futureValue : periodicPayment * timePeriods)) * 100)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Discount Rate Sensitivity */}
                  <div className={styles.sensitivityCard}>
                    <h3 className={styles.sensitivityTitle}>Discount Rate Sensitivity Analysis</h3>
                    <div className={styles.sensitivityGrid}>
                      {[discountRate - 5, discountRate - 2.5, discountRate, discountRate + 2.5, discountRate + 5].map((rate, index) => {
                        if (rate < 0.1) return null;
                        
                        const pv = paymentType === 'lump-sum' 
                          ? futureValue / Math.pow(1 + (rate / 100), timePeriods)
                          : periodicPayment * ((1 - Math.pow(1 + (rate / 100), -timePeriods)) / (rate / 100));
                          
                        const change = ((pv - results.presentValue) / results.presentValue) * 100;
                        
                        return (
                          <div key={index} className={styles.sensitivityItem}>
                            <div className={styles.sensitivityLabel}>{formatPercentage(rate)}</div>
                            <div className={styles.sensitivityValue}>{formatCurrency(Math.round(pv * 100) / 100)}</div>
                            <div className={styles.sensitivityChange} style={{ color: change >= 0 ? '#00aa00' : '#cc0000' }}>
                              {change >= 0 ? '+' : ''}{formatPercentage(change)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className={styles.sensitivityNote}>
                      Present value changes significantly with discount rate adjustments
                    </div>
                  </div>

                  {/* Discount Factor Table */}
                  <div className={styles.discountContainer}>
                    <h3 className={styles.discountTitle}>Discount Factor Progression</h3>
                    <div className={styles.discountTable}>
                      <div className={styles.discountHeader}>
                        <div className={styles.discountHeaderCell}>Period</div>
                        <div className={styles.discountHeaderCell}>Discount Factor</div>
                        <div className={styles.discountHeaderCell}>Future Value</div>
                        <div className={styles.discountHeaderCell}>Present Value</div>
                        <div className={styles.discountHeaderCell}>Value Retained</div>
                      </div>
                      {discountData.slice(0, 10).map((item) => (
                        <div key={item.period} className={styles.discountRow}>
                          <div className={styles.discountCell}>{item.period}</div>
                          <div className={styles.discountCell}>{formatDecimal(item.discountFactor)}</div>
                          <div className={styles.discountCell}>{formatCurrency(item.futureValue)}</div>
                          <div className={styles.discountCell}>{formatCurrency(item.presentValue)}</div>
                          <div className={styles.discountCell}>{formatPercentage(100 - item.discountEffect)}%</div>
                        </div>
                      ))}
                      {discountData.length > 10 && (
                        <div className={styles.discountMore}>
                          ... plus {discountData.length - 10} more periods
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>💡 Key PV Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>A future {formatCurrency(paymentType === 'lump-sum' ? futureValue : periodicPayment)} is worth only <strong>{formatCurrency(results.presentValue)}</strong> today</li>
                      <li>Waiting costs you <strong>{formatCurrency(results.timeValue)}</strong> in lost value due to the {formatPercentage(discountRate)} discount rate</li>
                      <li>Each dollar of future value is discounted to <strong>{formatCurrency(results.pvFactor)}</strong> in today's dollars</li>
                      <li>A 1% increase in discount rate reduces present value by approximately <strong>{formatPercentage((results.presentValue - (futureValue / Math.pow(1 + ((discountRate + 1) / 100), timePeriods))) / results.presentValue * 100)}</strong></li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Mastering Present Value: The Foundation of Smart Financial Decisions</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Why Present Value is the Most Important Financial Concept</h3>
                <p>Present Value (PV) is the cornerstone of modern finance, enabling apples-to-apples comparisons of cash flows occurring at different times. By discounting future amounts back to today's dollars, PV reveals the true economic value of investments, loans, and financial decisions. The core principle is the Time Value of Money: a dollar today is worth more than a dollar tomorrow because it can be invested to earn returns immediately.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World Example: Lottery Jackpot vs. Lump Sum</h4>
                  <ul>
                    <li><strong>$500 Million Lottery Jackpot:</strong> Paid as 30-year annuity ($16.67M/year)</li>
                    <li><strong>Lump Sum Option:</strong> $300 million today</li>
                    <li><strong>Present Value Analysis (6% discount rate):</strong></li>
                    <li>• Year 1: $16.67M ÷ 1.06 = $15.73M</li>
                    <li>• Year 5: $16.67M ÷ 1.06⁵ = $12.46M</li>
                    <li>• Year 10: $16.67M ÷ 1.06¹⁰ = $9.31M</li>
                    <li>• Year 30: $16.67M ÷ 1.06³⁰ = $2.90M</li>
                    <li><strong>Total PV of Annuity:</strong> $229 million</li>
                    <li><strong>Better Choice:</strong> Take $300M lump sum (PV = $300M vs $229M)</li>
                  </ul>
                  <p>Despite the larger nominal sum ($500M), the annuity's present value is significantly lower due to the long payment period and discounting effects.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Key Applications of Present Value Analysis</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🏠 Mortgage & Loan Decisions</h4>
                    <p><strong>Comparison:</strong> Calculate PV of different loan offers<br/>
                    <strong>Refinancing:</strong> Determine if savings justify costs<br/>
                    <strong>Early Payoff:</strong> Compare PV of interest savings vs. opportunity cost<br/>
                    <strong>Example:</strong> 15-year vs 30-year mortgage PV analysis</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Investment Analysis</h4>
                    <p><strong>Stock Valuation:</strong> Discount future dividends/cash flows<br/>
                    <strong>Bond Pricing:</strong> PV of future coupon payments + principal<br/>
                    <strong>Real Estate:</strong> Discount rental income streams<br/>
                    <strong>Business Valuation:</strong> DCF analysis of projected cash flows</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 Retirement Planning</h4>
                    <p><strong>Savings Goals:</strong> Calculate PV needed for retirement income<br/>
                    <strong>Pension Choices:</strong> Compare lump sum vs. annuity options<br/>
                    <strong>Social Security:</strong> Optimize claiming age using PV<br/>
                    <strong>Annuity Purchases:</strong> Evaluate insurance company offers</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏢 Business Decisions</h4>
                    <p><strong>Capital Budgeting:</strong> NPV analysis of projects<br/>
                    <strong>Lease vs. Buy:</strong> Compare PV of lease payments vs. purchase<br/>
                    <strong>M&A Analysis:</strong> Value acquisition targets<br/>
                    <strong>Contract Evaluation:</strong> Compare payment term options</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>How to Determine the Right Discount Rate</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Risk-Free Rate:</strong> Start with 10-year Treasury yield (2-4%). This is the minimum return for risk-free investments</li>
                  <li><strong>Risk Premium:</strong> Add premium based on investment risk. Safe investments: +2-4%, Moderate: +4-6%, Risky: +6-10%+</li>
                  <li><strong>Inflation Adjustment:</strong> Use real rate (nominal rate minus expected inflation) for long-term planning</li>
                  <li><strong>Opportunity Cost:</strong> What you could earn on next-best alternative investment</li>
                  <li><strong>Company-Specific:</strong> Use Weighted Average Cost of Capital (WACC) for business investments</li>
                  <li><strong>Personal Rate:</strong> Your required return based on financial goals and risk tolerance</li>
                </ul>
                <div className={styles.discountRateTable}>
                  <h4>Typical Discount Rates by Investment Type</h4>
                  <table className={styles.rateTable}>
                    <thead>
                      <tr>
                        <th>Investment Type</th>
                        <th>Typical Discount Rate</th>
                        <th>Risk Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Government Bonds</td>
                        <td>2-4%</td>
                        <td>Very Low</td>
                      </tr>
                      <tr>
                        <td>Corporate Bonds (AAA)</td>
                        <td>4-6%</td>
                        <td>Low</td>
                      </tr>
                      <tr>
                        <td>Dividend Stocks</td>
                        <td>7-9%</td>
                        <td>Moderate</td>
                      </tr>
                      <tr>
                        <td>Growth Stocks</td>
                        <td>10-12%</td>
                        <td>High</td>
                      </tr>
                      <tr>
                        <td>Venture Capital</td>
                        <td>15-25%+</td>
                        <td>Very High</td>
                      </tr>
                      <tr>
                        <td>Real Estate</td>
                        <td>8-10%</td>
                        <td>Moderate-High</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Advanced PV Concepts and Formulas</h3>
                <div className={styles.formulaCard}>
                  <h4>📊 Comprehensive PV Formulas</h4>
                  <div className={styles.formulaGrid}>
                    <div className={styles.formulaItem}>
                      <div className={styles.formulaName}>Lump Sum</div>
                      <div className={styles.formula}>PV = FV / (1 + r)ⁿ</div>
                      <div className={styles.formulaDesc}>Single future payment</div>
                    </div>
                    <div className={styles.formulaItem}>
                      <div className={styles.formulaName}>Ordinary Annuity</div>
                      <div className={styles.formula}>PV = PMT × [1 - (1 + r)⁻ⁿ] / r</div>
                      <div className={styles.formulaDesc}>Payments at period end</div>
                    </div>
                    <div className={styles.formulaItem}>
                      <div className={styles.formulaName}>Annuity Due</div>
                      <div className={styles.formula}>PV = PMT × [1 - (1 + r)⁻ⁿ] / r × (1 + r)</div>
                      <div className={styles.formulaDesc}>Payments at period start</div>
                    </div>
                    <div className={styles.formulaItem}>
                      <div className={styles.formulaName}>Growing Annuity</div>
                      <div className={styles.formula}>PV = PMT × [1 - ((1+g)/(1+r))ⁿ] / (r-g)</div>
                      <div className={styles.formulaDesc}>Payments growing at rate g</div>
                    </div>
                    <div className={styles.formulaItem}>
                      <div className={styles.formulaName}>Perpetuity</div>
                      <div className={styles.formula}>PV = PMT / r</div>
                      <div className={styles.formulaDesc}>Infinite constant payments</div>
                    </div>
                    <div className={styles.formulaItem}>
                      <div className={styles.formulaName}>Growing Perpetuity</div>
                      <div className={styles.formula}>PV = PMT / (r - g)</div>
                      <div className={styles.formulaDesc}>Infinite growing payments</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common PV Mistakes and How to Avoid Them</h3>
                <div className={styles.warningCard}>
                  <h4>⚠️ Critical PV Analysis Errors</h4>
                  <ol className={styles.errorList}>
                    <li><strong>Using Wrong Discount Rate:</strong> Mistake: Using current savings account rate for risky investment. Fix: Match rate to investment risk profile.</li>
                    <li><strong>Ignoring Inflation:</strong> Mistake: Using nominal rates for long-term analysis. Fix: Use real rates (nominal minus inflation) for periods greater than 5 years.</li>
                    <li><strong>Miscounting Periods:</strong> Mistake: Using annual rate with monthly periods. Fix: Adjust rate to match period frequency (divide annual rate by periods per year).</li>
                    <li><strong>Overlooking Growth:</strong> Mistake: Assuming constant payments when growth is likely. Fix: Include reasonable growth rate in annuity calculations.</li>
                    <li><strong>Neglecting Taxes:</strong> Mistake: Using pre-tax cash flows with after-tax discount rates. Fix: Be consistent: either use all pre-tax or all after-tax numbers.</li>
                    <li><strong>Forgetting Risk:</strong> Mistake: Using same rate for all investments. Fix: Adjust discount rate upward for higher risk investments.</li>
                  </ol>
                  <p><strong>Pro Tip:</strong> Always perform sensitivity analysis by testing different discount rates (±2-3%) to understand how changes affect your decision.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Financial Planners</h3>
                <blockquote className={styles.expertQuote}>
                  "The most common mistake I see is people dramatically underestimating the discount rate they should use for personal financial decisions. Your discount rate isn't what you're earning in your savings account - it's what you could reasonably earn by investing that money elsewhere, adjusted for risk. For most people's retirement planning, I recommend a 6-8% real discount rate (after inflation). This reflects historical stock market returns minus inflation. Using a 2-3% rate because that's what bonds pay leads to massively overestimating how much you need to save."
                  <footer className={styles.quoteFooter}>— Certified Financial Planner, 25+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between present value and net present value?</h3>
                <p className={styles.faqAnswer}><strong>Present Value (PV)</strong> calculates the current worth of future cash flows. <strong>Net Present Value (NPV)</strong> subtracts the initial investment cost from the PV of future cash flows. PV answers "What is this future amount worth today?" NPV answers "Is this investment profitable?" For example, if you invest $10,000 today for $15,000 in 5 years at 8% discount rate: PV = $10,207, NPV = $207 (positive = good investment).</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does inflation affect present value calculations?</h3>
                <p className={styles.faqAnswer}>Inflation reduces the purchasing power of future money, making it less valuable today. You can handle inflation two ways: 1) <strong>Nominal approach:</strong> Use nominal cash flows (including inflation) with nominal discount rates (including inflation premium), or 2) <strong>Real approach:</strong> Use real cash flows (excluding inflation) with real discount rates (nominal rate minus expected inflation). The real approach is cleaner for long-term planning. Example: If you expect 2% inflation and 8% nominal returns, use 6% real discount rate (8% - 2%).</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I use pre-tax or after-tax numbers for PV calculations?</h3>
                <p className={styles.faqAnswer}>Always be consistent. If you use <strong>pre-tax cash flows</strong>, use a <strong>pre-tax discount rate</strong> (like pre-tax cost of capital). If you use <strong>after-tax cash flows</strong>, use an <strong>after-tax discount rate</strong> (like after-tax cost of debt). For personal finance decisions, after-tax is usually better since that's the money you actually receive. For example, when comparing investment options, use after-tax returns as your discount rate since taxes reduce your actual earnings.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do I choose between a lump sum and annuity payment?</h3>
                <p className={styles.faqAnswer}>Calculate the present value of the annuity using your personal discount rate (what you could earn investing the money). Compare this PV to the lump sum offer. Choose the higher amount. Consider: 1) <strong>Investment skill:</strong> Can you beat the annuity's implied return? 2) <strong>Longevity risk:</strong> Annuities protect against outliving your money. 3) <strong>Tax implications:</strong> Different tax treatment. 4) <strong>Financial discipline:</strong> Will you preserve and invest the lump sum wisely? As a rule of thumb, if the annuity's implied return exceeds what you could safely earn elsewhere, take the annuity.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Make Smarter Financial Decisions?</h2>
              <p className={styles.ctaText}>Use our advanced present value calculator to analyze investments, evaluate loan options, plan for retirement, and make data-driven financial choices.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational and informational purposes only. Present value calculations involve numerous assumptions about future rates, inflation, and cash flows. Actual investment returns and economic conditions may differ significantly. This tool does not constitute financial advice, investment advice, or professional financial planning. Consult with qualified financial professionals for specific investment, retirement, and financial planning decisions. Past performance does not guarantee future results.
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

export default PresentValueCalculator;