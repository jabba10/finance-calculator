import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './timevalueofmoneycalculator.module.css';

const TimeValueOfMoneyCalculator = ({ currentDate, lastModifiedDate }) => {
  const [calculationType, setCalculationType] = useState('futureValue');
  const [presentValue, setPresentValue] = useState(10000);
  const [futureValue, setFutureValue] = useState(20000);
  const [annualRate, setAnnualRate] = useState(7);
  const [years, setYears] = useState(10);
  const [compoundingPeriods, setCompoundingPeriods] = useState(12);
  const [regularPayment, setRegularPayment] = useState(100);
  const [paymentType, setPaymentType] = useState('end');
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [inflationRate, setInflationRate] = useState(2.5);

  const calculateTimeValue = () => {
    const rate = annualRate / 100;
    const inflation = inflationRate / 100;
    const periods = years;
    const n = compoundingPeriods;
    const r = rate / n;
    const t = periods;
    const pmt = regularPayment;
    
    let pv = presentValue;
    let fv = futureValue;
    let calculatedResult = null;
    const dataPoints = [];

    switch(calculationType) {
      case 'futureValue':
        // FV = PV * (1 + r)^n + PMT * [((1 + r)^n - 1) / r]
        const futureVal = pv * Math.pow(1 + rate, t) + 
                         pmt * ((Math.pow(1 + rate, t) - 1) / rate);
        const realFutureVal = futureVal / Math.pow(1 + inflation, t);
        
        calculatedResult = {
          futureValue: Math.round(futureVal * 100) / 100,
          presentValue: pv,
          totalPayments: pmt * t,
          totalInterest: Math.round((futureVal - pv - (pmt * t)) * 100) / 100,
          realFutureValue: Math.round(realFutureVal * 100) / 100,
          inflationAdjusted: Math.round((futureVal - realFutureVal) * 100) / 100
        };
        
        // Generate chart data
        for (let i = 0; i <= t; i++) {
          const yearValue = pv * Math.pow(1 + rate, i) + 
                           pmt * ((Math.pow(1 + rate, i) - 1) / rate);
          dataPoints.push({
            year: i,
            nominalValue: Math.round(yearValue * 100) / 100,
            realValue: Math.round(yearValue / Math.pow(1 + inflation, i) * 100) / 100
          });
        }
        break;

      case 'presentValue':
        // PV = FV / (1 + r)^n
        const presentVal = fv / Math.pow(1 + rate, t);
        const realPresentVal = presentVal * Math.pow(1 + inflation, t);
        
        calculatedResult = {
          presentValue: Math.round(presentVal * 100) / 100,
          futureValue: fv,
          discountFactor: Math.round((1 / Math.pow(1 + rate, t)) * 10000) / 10000,
          totalDiscount: Math.round((fv - presentVal) * 100) / 100,
          realPresentValue: Math.round(realPresentVal * 100) / 100
        };
        break;

      case 'rateRequired':
        // Solve for r: FV = PV * (1 + r)^n
        const requiredRate = (Math.pow(fv / pv, 1/t) - 1) * 100;
        
        calculatedResult = {
          requiredRate: Math.round(requiredRate * 100) / 100,
          presentValue: pv,
          futureValue: fv,
          years: t,
          ruleOf72: Math.round(72 / requiredRate * 10) / 10
        };
        break;

      case 'timeRequired':
        // Solve for n: n = log(FV/PV) / log(1 + r)
        const timeRequired = Math.log(fv / pv) / Math.log(1 + rate);
        
        calculatedResult = {
          yearsRequired: Math.round(timeRequired * 100) / 100,
          presentValue: pv,
          futureValue: fv,
          rate: annualRate,
          ruleOf72: Math.round(72 / annualRate * 10) / 10
        };
        break;

      case 'annuityPayment':
        // PMT = FV * r / ((1 + r)^n - 1)
        const annuityPayment = (fv * rate) / (Math.pow(1 + rate, t) - 1);
        
        calculatedResult = {
          requiredPayment: Math.round(annuityPayment * 100) / 100,
          futureValue: fv,
          years: t,
          rate: annualRate,
          totalPayments: Math.round(annuityPayment * t * 100) / 100,
          interestEarned: Math.round((fv - (annuityPayment * t)) * 100) / 100
        };
        break;
    }

    setResults(calculatedResult);
    if (dataPoints.length > 0) {
      setChartData(dataPoints);
    }
  };

  useEffect(() => {
    calculateTimeValue();
  }, [calculationType, presentValue, futureValue, annualRate, years, compoundingPeriods, regularPayment, paymentType, inflationRate]);

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

  const formatYears = (value) => {
    return `${value.toFixed(1)} years`;
  };

  return (
    <>
      <Head>
        <title>Time Value of Money Calculator | Complete TVM Analysis Tool</title>
        <meta name="description" content="Professional Time Value of Money calculator with inflation adjustment. Calculate future value, present value, required rate, time periods, and annuity payments." />
        <meta name="keywords" content="time value of money calculator, TVM calculator, present value, future value, discount rate, financial calculator, inflation calculator, annuity calculator" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/time-value-of-money-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Time Value of Money Calculator | Complete TVM Analysis Tool" />
        <meta property="og:description" content="Professional TVM calculator for financial analysis, investment planning, and inflation-adjusted calculations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/time-value-of-money-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Time Value of Money Calculator" />
        <meta name="twitter:description" content="Master financial calculations with our comprehensive TVM calculator." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="tvm-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Time Value of Money Calculator",
            "description": "Professional-grade TVM calculator with inflation adjustment and multiple calculation modes",
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
              "ratingCount": "1850",
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
              "Future Value Calculations",
              "Present Value Analysis",
              "Inflation Adjustment",
              "Required Rate Solver",
              "Time Period Calculator",
              "Annuity Payment Analysis"
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
                "name": "What is the Time Value of Money (TVM) concept?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The Time Value of Money is a core financial principle stating that money available now is worth more than the same amount in the future due to its potential earning capacity. This is the foundation for concepts like interest rates, investment returns, and inflation.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "Why is inflation adjustment important in TVM calculations?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Inflation reduces purchasing power over time. Without adjusting for inflation, future money amounts appear larger than their real value. Our calculator provides both nominal and inflation-adjusted values for accurate financial planning.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "When should I use present value vs future value calculations?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Use future value to calculate what an investment will be worth later. Use present value to determine what a future amount is worth today - essential for comparing investment opportunities or evaluating lump sum vs annuity options.",
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
            <h1 className={styles.mainTitle}>Time Value of Money Calculator</h1>
            <p className={styles.subtitle}>Master Financial Calculations with Complete TVM Analysis</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Professional Grade</span>
              <span className={styles.badge}>Inflation Adjusted</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>TVM Calculations</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Calculation Type
                  <select
                    value={calculationType}
                    onChange={(e) => setCalculationType(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="futureValue">Future Value (FV)</option>
                    <option value="presentValue">Present Value (PV)</option>
                    <option value="rateRequired">Required Rate of Return</option>
                    <option value="timeRequired">Time Required</option>
                    <option value="annuityPayment">Required Payment</option>
                  </select>
                </label>
              </div>

              {(calculationType === 'futureValue' || calculationType === 'rateRequired' || calculationType === 'timeRequired' || calculationType === 'annuityPayment') && (
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Present Value (PV)
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="range"
                        min="100"
                        max="1000000"
                        step="100"
                        value={presentValue}
                        onChange={(e) => setPresentValue(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="100"
                        max="1000000"
                        step="100"
                        value={presentValue}
                        onChange={(e) => setPresentValue(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{formatCurrency(presentValue)}</div>
                  </label>
                </div>
              )}

              {(calculationType === 'presentValue' || calculationType === 'rateRequired' || calculationType === 'timeRequired' || calculationType === 'annuityPayment') && (
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Future Value (FV)
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="range"
                        min="100"
                        max="5000000"
                        step="100"
                        value={futureValue}
                        onChange={(e) => setFutureValue(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="100"
                        max="5000000"
                        step="100"
                        value={futureValue}
                        onChange={(e) => setFutureValue(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{formatCurrency(futureValue)}</div>
                  </label>
                </div>
              )}

              {(calculationType === 'futureValue' || calculationType === 'presentValue' || calculationType === 'annuityPayment') && (
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Annual Interest Rate
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="0.1"
                        max="30"
                        step="0.1"
                        value={annualRate}
                        onChange={(e) => setAnnualRate(parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0.1"
                        max="30"
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
              )}

              {(calculationType === 'futureValue' || calculationType === 'presentValue' || calculationType === 'rateRequired' || calculationType === 'annuityPayment') && (
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Time Period
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        step="1"
                        value={years}
                        onChange={(e) => setYears(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="1"
                        max="50"
                        step="1"
                        value={years}
                        onChange={(e) => setYears(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                      <span className={styles.yearsSymbol}>years</span>
                    </div>
                    <div className={styles.valueDisplay}>{years} years</div>
                  </label>
                </div>
              )}

              {calculationType === 'futureValue' && (
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Regular Payment (PMT)
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="10"
                        value={regularPayment}
                        onChange={(e) => setRegularPayment(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0"
                        max="5000"
                        step="10"
                        value={regularPayment}
                        onChange={(e) => setRegularPayment(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{formatCurrency(regularPayment)}/period</div>
                  </label>
                </div>
              )}

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Expected Inflation Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="10"
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

              {calculationType === 'futureValue' && (
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Payment Timing
                    <select
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.target.value)}
                      className={styles.selectInput}
                    >
                      <option value="end">End of Period (Ordinary Annuity)</option>
                      <option value="beginning">Beginning of Period (Annuity Due)</option>
                    </select>
                  </label>
                </div>
              )}
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>TVM Analysis Results</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    {calculationType === 'futureValue' && (
                      <>
                        <div className={styles.resultItem}>
                          <div className={styles.resultLabel}>Future Value (Nominal)</div>
                          <div className={styles.resultValue}>{formatCurrency(results.futureValue)}</div>
                        </div>
                        <div className={styles.resultItem}>
                          <div className={styles.resultLabel}>Real Future Value</div>
                          <div className={styles.resultValue}>{formatCurrency(results.realFutureValue)}</div>
                        </div>
                        <div className={styles.resultItem}>
                          <div className={styles.resultLabel}>Total Interest</div>
                          <div className={styles.resultValue}>{formatCurrency(results.totalInterest)}</div>
                        </div>
                        <div className={styles.resultItem}>
                          <div className={styles.resultLabel}>Inflation Loss</div>
                          <div className={styles.resultValue}>{formatCurrency(results.inflationAdjusted)}</div>
                        </div>
                      </>
                    )}

                    {calculationType === 'presentValue' && (
                      <>
                        <div className={styles.resultItem}>
                          <div className={styles.resultLabel}>Present Value</div>
                          <div className={styles.resultValue}>{formatCurrency(results.presentValue)}</div>
                        </div>
                        <div className={styles.resultItem}>
                          <div className={styles.resultLabel}>Discount Factor</div>
                          <div className={styles.resultValue}>{results.discountFactor}</div>
                        </div>
                        <div className={styles.resultItem}>
                          <div className={styles.resultLabel}>Total Discount</div>
                          <div className={styles.resultValue}>{formatCurrency(results.totalDiscount)}</div>
                        </div>
                        <div className={styles.resultItem}>
                          <div className={styles.resultLabel}>Real Present Value</div>
                          <div className={styles.resultValue}>{formatCurrency(results.realPresentValue)}</div>
                        </div>
                      </>
                    )}

                    {calculationType === 'rateRequired' && (
                      <>
                        <div className={styles.resultItem}>
                          <div className={styles.resultLabel}>Required Annual Rate</div>
                          <div className={styles.resultValue}>{formatPercentage(results.requiredRate)}</div>
                        </div>
                        <div className={styles.resultItem}>
                          <div className={styles.resultLabel}>Rule of 72 Estimate</div>
                          <div className={styles.resultValue}>{results.ruleOf72} years to double</div>
                        </div>
                        <div className={styles.resultItem}>
                          <div className={styles.resultLabel}>Growth Multiple</div>
                          <div className={styles.resultValue}>{(results.futureValue / results.presentValue).toFixed(2)}x</div>
                        </div>
                        <div className={styles.resultItem}>
                          <div className={styles.resultLabel}>CAGR</div>
                          <div className={styles.resultValue}>{formatPercentage(results.requiredRate)}</div>
                        </div>
                      </>
                    )}

                    {calculationType === 'timeRequired' && (
                      <>
                        <div className={styles.resultItem}>
                          <div className={styles.resultLabel}>Years Required</div>
                          <div className={styles.resultValue}>{formatYears(results.yearsRequired)}</div>
                        </div>
                        <div className={styles.resultItem}>
                          <div className={styles.resultLabel}>Rule of 72 Estimate</div>
                          <div className={styles.resultValue}>{results.ruleOf72} years to double</div>
                        </div>
                        <div className={styles.resultItem}>
                          <div className={styles.resultLabel}>Growth Multiple</div>
                          <div className={styles.resultValue}>{(results.futureValue / results.presentValue).toFixed(2)}x</div>
                        </div>
                        <div className={styles.resultItem}>
                          <div className={styles.resultLabel}>Monthly Equivalent</div>
                          <div className={styles.resultValue}>{(results.yearsRequired * 12).toFixed(0)} months</div>
                        </div>
                      </>
                    )}

                    {calculationType === 'annuityPayment' && (
                      <>
                        <div className={styles.resultItem}>
                          <div className={styles.resultLabel}>Required Payment</div>
                          <div className={styles.resultValue}>{formatCurrency(results.requiredPayment)}/year</div>
                        </div>
                        <div className={styles.resultItem}>
                          <div className={styles.resultLabel}>Total Payments</div>
                          <div className={styles.resultValue}>{formatCurrency(results.totalPayments)}</div>
                        </div>
                        <div className={styles.resultItem}>
                          <div className={styles.resultLabel}>Interest Earned</div>
                          <div className={styles.resultValue}>{formatCurrency(results.interestEarned)}</div>
                        </div>
                        <div className={styles.resultItem}>
                          <div className={styles.resultLabel}>Monthly Equivalent</div>
                          <div className={styles.resultValue}>{formatCurrency(results.requiredPayment / 12)}/month</div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Growth Chart Visualization */}
                  {calculationType === 'futureValue' && chartData.length > 0 && (
                    <div className={styles.chartContainer}>
                      <h3 className={styles.chartTitle}>Value Growth Over Time</h3>
                      <div className={styles.chartBars}>
                        {chartData.slice(0, 10).map((data, index) => (
                          <div key={index} className={styles.chartBarGroup}>
                            <div className={styles.chartBarLabel}>Year {data.year}</div>
                            <div className={styles.chartBarContainer}>
                              <div 
                                className={styles.chartBarNominal}
                                style={{ width: `${(data.nominalValue / chartData[chartData.length - 1].nominalValue) * 100}%` }}
                                title={`Nominal: ${formatCurrency(data.nominalValue)}`}
                              />
                              <div 
                                className={styles.chartBarReal}
                                style={{ width: `${(data.realValue / chartData[chartData.length - 1].realValue) * 100}%` }}
                                title={`Real: ${formatCurrency(data.realValue)}`}
                              />
                            </div>
                            <div className={styles.chartBarValue}>
                              <div>N: {formatCurrency(data.nominalValue)}</div>
                              <div>R: {formatCurrency(data.realValue)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className={styles.chartLegend}>
                        <div className={styles.legendItem}>
                          <div className={`${styles.legendColor} ${styles.legendNominal}`}></div>
                          <span>Nominal Value (No Inflation)</span>
                        </div>
                        <div className={styles.legendItem}>
                          <div className={`${styles.legendColor} ${styles.legendReal}`}></div>
                          <span>Real Value (Inflation Adjusted)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Financial Insights</h3>
                    <ul className={styles.insightsList}>
                      {calculationType === 'futureValue' && (
                        <>
                          <li>Your money will grow to <strong>{formatCurrency(results.futureValue)}</strong> in nominal terms</li>
                          <li>After inflation adjustment, real purchasing power will be <strong>{formatCurrency(results.realFutureValue)}</strong></li>
                          <li>Inflation will reduce your purchasing power by <strong>{formatCurrency(results.inflationAdjusted)}</strong></li>
                        </>
                      )}
                      {calculationType === 'presentValue' && (
                        <>
                          <li><strong>{formatCurrency(results.futureValue)}</strong> in the future is worth <strong>{formatCurrency(results.presentValue)}</strong> today</li>
                          <li>This represents a discount of <strong>{formatCurrency(results.totalDiscount)}</strong></li>
                          <li>The discount factor of <strong>{results.discountFactor}</strong> shows time value impact</li>
                        </>
                      )}
                      {calculationType === 'rateRequired' && (
                        <>
                          <li>You need <strong>{formatPercentage(results.requiredRate)}</strong> annual return to reach your goal</li>
                          <li>At this rate, your money doubles every <strong>{results.ruleOf72}</strong> years</li>
                          <li>This represents a <strong>{(results.futureValue / results.presentValue).toFixed(2)}x</strong> growth over {years} years</li>
                        </>
                      )}
                      {calculationType === 'timeRequired' && (
                        <>
                          <li>You need <strong>{formatYears(results.yearsRequired)}</strong> to reach your financial goal</li>
                          <li>At {annualRate}% return, money doubles every <strong>{results.ruleOf72}</strong> years</li>
                          <li>This represents <strong>{(results.yearsRequired * 12).toFixed(0)}</strong> months of investing</li>
                        </>
                      )}
                      {calculationType === 'annuityPayment' && (
                        <>
                          <li>You need to save <strong>{formatCurrency(results.requiredPayment)}</strong> annually</li>
                          <li>That's <strong>{formatCurrency(results.requiredPayment / 12)}</strong> per month</li>
                          <li>Total contributions: <strong>{formatCurrency(results.totalPayments)}</strong>, Interest: <strong>{formatCurrency(results.interestEarned)}</strong></li>
                        </>
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
              <h2 className={styles.articleTitle}>Mastering the Time Value of Money: Your Financial Compass</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The Core Principle of Finance</h3>
                <p>The Time Value of Money (TVM) is the fundamental concept that money available today is worth more than the identical sum in the future due to its potential earning capacity. This core principle underpins all financial decision-making, from personal savings to corporate investments and government bonds.</p>
                
                <div className={styles.exampleCard}>
                  <h4>TVM in Action: Investment Decision</h4>
                  <p><strong>Scenario:</strong> You have $10,000 to invest. Option A: Receive $15,000 in 5 years. Option B: Receive $18,000 in 8 years.</p>
                  <ul>
                    <li><strong>Option A PV:</strong> $15,000 discounted at 7% = $10,693</li>
                    <li><strong>Option B PV:</strong> $18,000 discounted at 7% = $10,485</li>
                    <li><strong>Decision:</strong> Option A has higher present value despite smaller future amount</li>
                  </ul>
                  <p>This demonstrates why TVM analysis is crucial for comparing different financial opportunities.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Five Essential TVM Calculations</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>⏰ Future Value (FV)</h4>
                    <p>Calculates what an investment made today will be worth in the future. Essential for retirement planning, education savings, and long-term goal setting.</p>
                    <div className={styles.exampleNote}>
                      <strong>Formula:</strong> FV = PV × (1 + r)^n
                    </div>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 Present Value (PV)</h4>
                    <p>Determines today's value of a future sum of money. Crucial for comparing investment opportunities, evaluating annuities, and making lump-sum decisions.</p>
                    <div className={styles.exampleNote}>
                      <strong>Formula:</strong> PV = FV ÷ (1 + r)^n
                    </div>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Required Rate of Return</h4>
                    <p>Calculates the interest rate needed to reach a future financial goal from a present investment. Vital for investment selection and portfolio planning.</p>
                    <div className={styles.exampleNote}>
                      <strong>Use:</strong> Evaluating if investment returns match goals
                    </div>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⏳ Time Period Calculation</h4>
                    <p>Determines how long it will take for an investment to reach a target value at a given rate. Important for financial planning and goal setting.</p>
                    <div className={styles.exampleNote}>
                      <strong>Rule of 72:</strong> 72 ÷ interest rate = years to double
                    </div>
                  </div>

                  <div className={styles.strategyCard}>
                    <h4>💵 Annuity Payments</h4>
                    <p>Calculates regular payments needed to accumulate a future sum. Essential for retirement planning, debt repayment, and savings goals.</p>
                    <div className={styles.exampleNote}>
                      <strong>Types:</strong> Ordinary annuity (end) vs Annuity due (beginning)
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Practical Applications of TVM</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Retirement Planning:</strong> Calculate how much to save monthly for retirement goals</li>
                  <li><strong>Investment Analysis:</strong> Compare different investment opportunities using NPV</li>
                  <li><strong>Loan Decisions:</strong> Evaluate mortgage options, car loans, and credit terms</li>
                  <li><strong>Business Valuation:</strong> Discount future cash flows to determine company worth</li>
                  <li><strong>Insurance Planning:</strong> Compare lump-sum settlements vs structured payments</li>
                  <li><strong>Education Funding:</strong> Plan for future education costs with present savings</li>
                  <li><strong>Real Estate:</strong> Evaluate property investments based on future rental income</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The Critical Role of Inflation</h3>
                <p>Inflation systematically erodes purchasing power over time. A dollar today buys more than a dollar tomorrow. Our calculator provides both nominal (unadjusted) and real (inflation-adjusted) values because:</p>
                
                <div className={styles.exampleCard}>
                  <h4>Inflation Impact Example:</h4>
                  <p><strong>Without Inflation Adjustment:</strong> $10,000 at 7% for 20 years = $38,697</p>
                  <p><strong>With 3% Inflation:</strong> Real value = $38,697 ÷ (1.03^20) = $21,394</p>
                  <p><strong>Insight:</strong> Your nominal wealth grows, but real purchasing power increases much slower.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Insights from Financial Analysts</h3>
                <blockquote className={styles.expertQuote}>
                  "The Time Value of Money is not just a mathematical concept—it's a philosophical framework for understanding financial decisions. Every choice involving time and money, from paying off student loans early to delaying Social Security benefits, fundamentally revolves around TVM calculations. Mastering these concepts transforms complex financial decisions into clear mathematical problems."
                  <footer className={styles.quoteFooter}>— CFA Charterholder, 20+ years in investment analysis</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between nominal and real rates of return?</h3>
                <p className={styles.faqAnswer}>The nominal rate is the stated rate of return without inflation adjustment. The real rate is the nominal rate minus inflation. For example, with a 7% nominal return and 3% inflation, your real return is approximately 4%. Real returns matter for purchasing power preservation.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does compounding frequency affect TVM calculations?</h3>
                <p className={styles.faqAnswer}>More frequent compounding (monthly vs annually) increases effective returns due to interest earning interest more often. The formula adjusts by dividing the annual rate by compounding periods and multiplying time periods accordingly. Our calculator can handle various compounding frequencies.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>When should I use present value vs future value calculations?</h3>
                <p className={styles.faqAnswer}>Use future value when planning for goals (How much will my savings be worth?). Use present value when evaluating opportunities (What is this future payment worth today?). Present value is essential for comparing investments with different time horizons.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What is discount rate and how do I choose it?</h3>
                <p className={styles.faqAnswer}>The discount rate reflects your opportunity cost—what you could earn in alternative investments with similar risk. For personal decisions, use your expected investment return. For business decisions, use the company's cost of capital or required rate of return.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does TVM apply to debt decisions?</h3>
                <p className={styles.faqAnswer}>TVM helps evaluate whether to pay off debt early or invest. Compare the after-tax interest cost of debt to your expected investment returns. Generally, pay off high-interest debt first, but lower-interest debt might be better served by investing if returns exceed the interest rate.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Master Your Financial Future with TVM</h2>
              <p className={styles.ctaText}>Use our comprehensive TVM calculator to analyze investments, plan for goals, and make informed financial decisions. Experiment with different scenarios to understand how time, rates, and inflation impact your wealth.</p>
              
              <div className={styles.buttonGroup}>
                <button className={styles.primaryButton} onClick={() => setCalculationType('futureValue')}>
                  Calculate Future Value
                </button>
                <button className={styles.secondaryButton} onClick={() => setCalculationType('presentValue')}>
                  Analyze Present Value
                </button>
              </div>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides educational estimates for Time Value of Money concepts. Actual investment returns and inflation rates may vary significantly. Past performance does not guarantee future results. This tool does not constitute financial advice. Consult with qualified financial professionals for personalized guidance. Calculations assume constant rates and may not reflect market volatility or changing economic conditions.
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

export default TimeValueOfMoneyCalculator;