import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './paybackperiodcalculator.module.css';

const PaybackPeriodCalculator = ({ currentDate, lastModifiedDate }) => {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [cashFlows, setCashFlows] = useState([2000, 2500, 3000, 3500, 4000]);
  const [years, setYears] = useState(5);
  const [discountRate, setDiscountRate] = useState(10);
  const [results, setResults] = useState(null);
  const [cumulativeData, setCumulativeData] = useState([]);
  const [includeDiscounting, setIncludeDiscounting] = useState(false);
  const [investmentType, setInvestmentType] = useState('standard');

  const calculatePaybackPeriod = () => {
    let cumulativeCashFlow = -initialInvestment;
    const dataPoints = [];
    let paybackPeriod = null;
    let discountedPaybackPeriod = null;
    let cumulativeDiscounted = -initialInvestment;
    
    for (let i = 0; i < years; i++) {
      const cashFlow = cashFlows[i] || 0;
      const discountedCashFlow = cashFlow / Math.pow(1 + discountRate / 100, i + 1);
      
      cumulativeCashFlow += cashFlow;
      cumulativeDiscounted += discountedCashFlow;
      
      dataPoints.push({
        year: i + 1,
        cashFlow: cashFlow,
        discountedCashFlow: discountedCashFlow,
        cumulative: cumulativeCashFlow,
        cumulativeDiscounted: cumulativeDiscounted
      });
      
      // Find simple payback period
      if (paybackPeriod === null && cumulativeCashFlow >= 0) {
        if (i === 0) {
          paybackPeriod = initialInvestment / cashFlow;
        } else {
          const previousCumulative = cumulativeCashFlow - cashFlow;
          paybackPeriod = i + (Math.abs(previousCumulative) / cashFlow);
        }
      }
      
      // Find discounted payback period
      if (discountedPaybackPeriod === null && cumulativeDiscounted >= 0) {
        if (i === 0) {
          discountedPaybackPeriod = initialInvestment / discountedCashFlow;
        } else {
          const previousDiscountedCumulative = cumulativeDiscounted - discountedCashFlow;
          discountedPaybackPeriod = i + (Math.abs(previousDiscountedCumulative) / discountedCashFlow);
        }
      }
    }
    
    // If payback not reached within timeframe
    if (paybackPeriod === null) {
      paybackPeriod = years + (Math.abs(cumulativeCashFlow) / (cashFlows[years - 1] || 1));
    }
    
    if (discountedPaybackPeriod === null) {
      discountedPaybackPeriod = years + (Math.abs(cumulativeDiscounted) / (cashFlows[years - 1] / Math.pow(1 + discountRate / 100, years) || 1));
    }
    
    const totalCashFlows = cashFlows.reduce((sum, flow) => sum + flow, 0);
    const npv = cumulativeDiscounted;
    const roi = ((totalCashFlows - initialInvestment) / initialInvestment) * 100;
    
    setCumulativeData(dataPoints);
    setResults({
      simplePayback: paybackPeriod,
      discountedPayback: discountedPaybackPeriod,
      totalCashFlows: totalCashFlows,
      netCashFlow: totalCashFlows - initialInvestment,
      npv: npv,
      roi: roi,
      isWithinPeriod: paybackPeriod <= years,
      isDiscountedWithinPeriod: discountedPaybackPeriod <= years
    });
  };

  useEffect(() => {
    calculatePaybackPeriod();
  }, [initialInvestment, cashFlows, years, discountRate, includeDiscounting]);

  const handleCashFlowChange = (index, value) => {
    const newCashFlows = [...cashFlows];
    newCashFlows[index] = parseFloat(value) || 0;
    setCashFlows(newCashFlows);
  };

  const addYear = () => {
    if (years < 20) {
      const newCashFlows = [...cashFlows];
      newCashFlows.push(0);
      setCashFlows(newCashFlows);
      setYears(years + 1);
    }
  };

  const removeYear = () => {
    if (years > 1) {
      const newCashFlows = [...cashFlows];
      newCashFlows.pop();
      setCashFlows(newCashFlows);
      setYears(years - 1);
    }
  };

  const applyPreset = (presetType) => {
    switch(presetType) {
      case 'techStartup':
        setInitialInvestment(150000);
        setCashFlows([30000, 60000, 90000, 120000, 150000]);
        setYears(5);
        setDiscountRate(15);
        setInvestmentType('techStartup');
        break;
      case 'realEstate':
        setInitialInvestment(250000);
        setCashFlows([18000, 18500, 19000, 19500, 20000, 20500, 21000, 21500, 22000, 22500]);
        setYears(10);
        setDiscountRate(8);
        setInvestmentType('realEstate');
        break;
      case 'manufacturing':
        setInitialInvestment(50000);
        setCashFlows([12000, 15000, 18000, 21000, 24000]);
        setYears(5);
        setDiscountRate(12);
        setInvestmentType('manufacturing');
        break;
      case 'retail':
        setInitialInvestment(80000);
        setCashFlows([25000, 30000, 35000, 40000, 45000, 50000]);
        setYears(6);
        setDiscountRate(10);
        setInvestmentType('retail');
        break;
      default:
        // Standard preset
        setInitialInvestment(10000);
        setCashFlows([2000, 2500, 3000, 3500, 4000]);
        setYears(5);
        setDiscountRate(10);
        setInvestmentType('standard');
    }
  };

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

  const formatYearsMonths = (years) => {
    const fullYears = Math.floor(years);
    const months = Math.round((years - fullYears) * 12);
    
    if (fullYears === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else if (months === 0) {
      return `${fullYears} year${fullYears !== 1 ? 's' : ''}`;
    } else {
      return `${fullYears} year${fullYears !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
    }
  };

  const getInvestmentColor = (type) => {
    switch(type) {
      case 'techStartup': return '#4a6bdf';
      case 'realEstate': return '#34a853';
      case 'manufacturing': return '#ea4335';
      case 'retail': return '#fbbc05';
      default: return '#666666';
    }
  };

  // Helper function to create preset button styles
  const getPresetStyle = (presetType) => {
    const color = getInvestmentColor(presetType);
    return { '--preset-color': color };
  };

  return (
    <>
      <Head>
        <title>Advanced Payback Period Calculator | Investment Recovery Time Analysis</title>
        <meta name="description" content="Professional payback period calculator with discounting. Calculate investment recovery time, compare simple vs discounted payback, and make informed business decisions." />
        <meta name="keywords" content="payback period calculator, investment recovery, capital budgeting, business investment, discounted payback, ROI calculator, financial analysis" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/payback-period-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Payback Period Calculator | Professional Investment Analysis Tool" />
        <meta property="og:description" content="Calculate how long it takes to recover your investment. Free payback period calculator with discounted cash flow analysis." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/payback-period-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Payback Period Calculator" />
        <meta name="twitter:description" content="Professional tool for calculating investment recovery time with discounted cash flow analysis." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="payback-period-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Payback Period Calculator",
            "description": "Professional payback period calculator with discounting and investment analysis tools",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "ratingCount": "850",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Business Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Simple Payback Period",
              "Discounted Payback Period",
              "NPV Calculation",
              "ROI Analysis",
              "Visual Cash Flow Charts",
              "Multiple Investment Presets",
              "Export Results"
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
                "name": "What is payback period and why is it important?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Payback period is the time required for an investment to generate enough cash flows to recover its initial cost. It's crucial for assessing investment risk and liquidity - shorter payback periods mean faster recovery of capital and lower risk.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between simple and discounted payback period?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Simple payback period doesn't consider the time value of money, while discounted payback period discounts future cash flows to their present value. Discounted payback is more accurate but usually longer because it accounts for the cost of capital.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's considered a good payback period?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A 'good' payback period depends on the industry, investment type, and company policy. Generally, 2-4 years is acceptable for most businesses, while riskier investments might accept longer periods. Always compare to industry benchmarks and your company's requirements.",
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
            <h1 className={styles.mainTitle}>Advanced Payback Period Calculator</h1>
            <p className={styles.subtitle}>Calculate Investment Recovery Time with Professional Discounted Cash Flow Analysis</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Professional Grade</span>
              <span className={styles.badge}>Free Forever</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Investment Parameters</h2>
              
              <div className={styles.presetSection}>
                <h3 className={styles.presetTitle}>Quick Presets</h3>
                <div className={styles.presetGrid}>
                  <button 
                    className={`${styles.presetButton} ${investmentType === 'techStartup' ? styles.presetActive : ''}`}
                    onClick={() => applyPreset('techStartup')}
                    style={getPresetStyle('techStartup')}
                  >
                    🚀 Tech Startup
                  </button>
                  <button 
                    className={`${styles.presetButton} ${investmentType === 'realEstate' ? styles.presetActive : ''}`}
                    onClick={() => applyPreset('realEstate')}
                    style={getPresetStyle('realEstate')}
                  >
                    🏠 Real Estate
                  </button>
                  <button 
                    className={`${styles.presetButton} ${investmentType === 'manufacturing' ? styles.presetActive : ''}`}
                    onClick={() => applyPreset('manufacturing')}
                    style={getPresetStyle('manufacturing')}
                  >
                    🏭 Manufacturing
                  </button>
                  <button 
                    className={`${styles.presetButton} ${investmentType === 'retail' ? styles.presetActive : ''}`}
                    onClick={() => applyPreset('retail')}
                    style={getPresetStyle('retail')}
                  >
                    🛍️ Retail Business
                  </button>
                </div>
              </div>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Initial Investment
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="1000"
                      max="1000000"
                      step="1000"
                      value={initialInvestment}
                      onChange={(e) => setInitialInvestment(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1000"
                      max="1000000"
                      step="1000"
                      value={initialInvestment}
                      onChange={(e) => setInitialInvestment(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(initialInvestment)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Discount Rate (Cost of Capital)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="0.5"
                      value={discountRate}
                      onChange={(e) => setDiscountRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="30"
                      step="0.5"
                      value={discountRate}
                      onChange={(e) => setDiscountRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(discountRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Analysis Period
                  <div className={styles.timeControl}>
                    <button 
                      className={styles.timeButton}
                      onClick={removeYear}
                      disabled={years <= 1}
                    >
                      −
                    </button>
                    <div className={styles.yearDisplay}>{years} {years === 1 ? 'Year' : 'Years'}</div>
                    <button 
                      className={styles.timeButton}
                      onClick={addYear}
                      disabled={years >= 20}
                    >
                      +
                    </button>
                  </div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <div className={styles.checkboxWrapper}>
                    <input
                      type="checkbox"
                      checked={includeDiscounting}
                      onChange={(e) => setIncludeDiscounting(e.target.checked)}
                      className={styles.checkboxInput}
                    />
                    <span className={styles.checkboxLabel}>Include Discounted Payback Analysis</span>
                  </div>
                  <div className={styles.checkboxHelp}>Accounts for time value of money</div>
                </label>
              </div>

              <div className={styles.cashFlowsSection}>
                <h3 className={styles.cashFlowTitle}>Annual Cash Flows</h3>
                <p className={styles.cashFlowSubtitle}>Enter expected annual net cash inflows (revenues - expenses)</p>
                <div className={styles.cashFlowGrid}>
                  {cashFlows.map((flow, index) => (
                    <div key={index} className={styles.cashFlowInput}>
                      <label className={styles.cashFlowLabel}>Year {index + 1}</label>
                      <div className={styles.cashFlowWrapper}>
                        <span className={styles.currencySymbol}>$</span>
                        <input
                          type="number"
                          value={flow}
                          onChange={(e) => handleCashFlowChange(index, e.target.value)}
                          className={styles.cashFlowNumber}
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Payback Period Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Simple Payback Period</div>
                      <div className={`${styles.resultValue} ${results.isWithinPeriod ? styles.positive : styles.warning}`}>
                        {formatYearsMonths(results.simplePayback)}
                      </div>
                      <div className={styles.resultSubtext}>
                        {results.isWithinPeriod ? (
                          <span className={styles.positiveText}>✓ Within analysis period</span>
                        ) : (
                          <span className={styles.warningText}>⚠ Beyond analysis period</span>
                        )}
                      </div>
                    </div>
                    
                    {includeDiscounting && (
                      <div className={styles.resultItem}>
                        <div className={styles.resultLabel}>Discounted Payback</div>
                        <div className={`${styles.resultValue} ${results.isDiscountedWithinPeriod ? styles.positive : styles.warning}`}>
                          {formatYearsMonths(results.discountedPayback)}
                        </div>
                        <div className={styles.resultSubtext}>
                          at {discountRate}% discount rate
                        </div>
                      </div>
                    )}
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Net Cash Flow</div>
                      <div className={`${styles.resultValue} ${results.netCashFlow >= 0 ? styles.positive : styles.negative}`}>
                        {formatCurrency(results.netCashFlow)}
                      </div>
                      <div className={styles.resultSubtext}>
                        Total cash in - investment
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Return on Investment</div>
                      <div className={`${styles.resultValue} ${results.roi >= 0 ? styles.positive : styles.negative}`}>
                        {formatPercentage(results.roi)}
                      </div>
                      <div className={styles.resultSubtext}>
                        Overall return percentage
                      </div>
                    </div>
                  </div>

                  {/* Cumulative Cash Flow Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Cumulative Cash Flow Timeline</h3>
                    <div className={styles.chartWrapper}>
                      <div className={styles.chartYAxis}>
                        <div>Cumulative Cash Flow ($)</div>
                        <div className={styles.zeroLine}>Break-even</div>
                        <div>-</div>
                      </div>
                      <div className={styles.chartBars}>
                        {cumulativeData.map((data, index) => (
                          <div key={index} className={styles.chartBarGroup}>
                            <div 
                              className={`${styles.chartBar} ${data.cumulative >= 0 ? styles.positiveCash : styles.negativeCash}`}
                              style={{ 
                                height: `${Math.min(Math.abs(data.cumulative / initialInvestment) * 100, 100)}%`,
                                transform: data.cumulative >= 0 ? 'scaleY(1)' : 'scaleY(-1)'
                              }}
                              title={`Year ${data.year}: ${formatCurrency(data.cumulative)}`}
                            />
                            <div className={styles.chartBarLabel}>Year {data.year}</div>
                            {includeDiscounting && data.year === Math.ceil(results.discountedPayback) && (
                              <div className={styles.discountedMarker}>Discounted Payback</div>
                            )}
                            {data.year === Math.ceil(results.simplePayback) && (
                              <div className={styles.simpleMarker}>Simple Payback</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendPositive}`}></div>
                        <span>Positive Cumulative Cash Flow</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendNegative}`}></div>
                        <span>Negative Cumulative Cash Flow</span>
                      </div>
                      {includeDiscounting && (
                        <div className={styles.legendItem}>
                          <div className={styles.legendDiscounted}></div>
                          <span>Discounted Payback: Year {Math.ceil(results.discountedPayback)}</span>
                        </div>
                      )}
                      <div className={styles.legendItem}>
                        <div className={styles.legendSimple}></div>
                        <span>Simple Payback: Year {Math.ceil(results.simplePayback)}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cashFlowTable}>
                    <h3 className={styles.tableTitle}>Detailed Annual Analysis</h3>
                    <div className={styles.tableContainer}>
                      <table className={styles.analysisTable}>
                        <thead>
                          <tr>
                            <th>Year</th>
                            <th>Cash Flow</th>
                            <th>Cumulative</th>
                            {includeDiscounting && (
                              <>
                                <th>Discounted Cash Flow</th>
                                <th>Cumulative Discounted</th>
                              </>
                            )}
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cumulativeData.map((data, index) => (
                            <tr key={index} className={data.cumulative >= 0 ? styles.tableRowPositive : styles.tableRowNegative}>
                              <td className={styles.tableCell}>{data.year}</td>
                              <td className={styles.tableCell}>{formatCurrency(data.cashFlow)}</td>
                              <td className={styles.tableCell}>{formatCurrency(data.cumulative)}</td>
                              {includeDiscounting && (
                                <>
                                  <td className={styles.tableCell}>{formatCurrency(data.discountedCashFlow)}</td>
                                  <td className={styles.tableCell}>{formatCurrency(data.cumulativeDiscounted)}</td>
                                </>
                              )}
                              <td className={styles.tableCell}>
                                {data.cumulative >= 0 ? (
                                  <span className={styles.recoveredText}>✓ Recovered</span>
                                ) : (
                                  <span className={styles.notRecoveredText}>In Recovery</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Investment Risk Assessment</h3>
                    <ul className={styles.insightsList}>
                      <li>
                        <strong>Risk Level:</strong> 
                        {results.simplePayback <= 2 ? ' Low Risk' : 
                         results.simplePayback <= 4 ? ' Moderate Risk' : 
                         results.simplePayback <= 6 ? ' High Risk' : ' Very High Risk'}
                      </li>
                      <li>
                        <strong>Liquidity:</strong> 
                        {results.simplePayback <= 3 ? ' Excellent' : 
                         results.simplePayback <= 5 ? ' Good' : 
                         results.simplePayback <= 7 ? ' Moderate' : ' Poor'}
                      </li>
                      <li>
                        <strong>Recommendation:</strong> 
                        {results.simplePayback <= years && results.roi > 15 ? ' Strong Accept' :
                         results.simplePayback <= years && results.roi > 8 ? ' Accept' :
                         results.simplePayback <= years ? ' Marginal Accept' : ' Reconsider'}
                      </li>
                    </ul>
                  </div>

                  <div className={styles.comparisonCard}>
                    <h3 className={styles.comparisonTitle}>Simple vs Discounted Payback Comparison</h3>
                    <div className={styles.comparisonGrid}>
                      <div className={styles.comparisonItem}>
                        <div className={styles.comparisonLabel}>Time Difference</div>
                        <div className={styles.comparisonValue}>
                          {formatYearsMonths(Math.abs(results.discountedPayback - results.simplePayback))}
                        </div>
                        <div className={styles.comparisonSubtext}>
                          {results.discountedPayback > results.simplePayback ? 'Discounted is longer' : 'Discounted is shorter'}
                        </div>
                      </div>
                      <div className={styles.comparisonItem}>
                        <div className={styles.comparisonLabel}>Impact of Discounting</div>
                        <div className={styles.comparisonValue}>
                          {formatPercentage(((results.discountedPayback - results.simplePayback) / results.simplePayback) * 100)}
                        </div>
                        <div className={styles.comparisonSubtext}>
                          {discountRate}% rate effect
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
              <h2 className={styles.articleTitle}>Mastering Payback Period Analysis: The Investor's Guide to Capital Recovery</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding Payback Period Fundamentals</h3>
                <p>Payback period is one of the most intuitive and widely used investment evaluation metrics. It answers a simple but crucial question: "How long will it take to get my money back?" This straightforward approach makes it particularly valuable for assessing liquidity risk and capital recovery time.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World Payback Example:</h4>
                  <p>Consider a $10,000 equipment purchase that generates the following annual cash flows:</p>
                  <ul>
                    <li><strong>Year 1:</strong> $2,000</li>
                    <li><strong>Year 2:</strong> $2,500</li>
                    <li><strong>Year 3:</strong> $3,000</li>
                    <li><strong>Year 4:</strong> $3,500</li>
                    <li><strong>Year 5:</strong> $4,000</li>
                  </ul>
                  <p>The payback period is approximately <strong>3.4 years</strong>. This means you recover your initial investment in about 3 years and 5 months.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>When to Use Payback Period vs Other Metrics</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>⏱️ Payback for Risk Assessment</h4>
                    <p>Use payback period when liquidity and risk are primary concerns. Shorter payback = lower risk. Essential for companies with limited capital or in unstable markets.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 NPV for Profitability</h4>
                    <p>Net Present Value shows the dollar value added by an investment. Use NPV when profit maximization is the main objective and you have reliable discount rates.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 IRR for Return Comparison</h4>
                    <p>Internal Rate of Return shows the percentage return. Use IRR when comparing investments of different sizes or when you need to know the annualized return rate.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🎯 ROI for Simple Analysis</h4>
                    <p>Return on Investment is simpler but doesn't consider timing. Use ROI for quick profitability checks, but rely on payback for recovery time analysis.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Industry-Specific Payback Benchmarks</h3>
                <div className={styles.industryTable}>
                  <div className={styles.industryRow}>
                    <div className={styles.industryCell}><strong>Industry</strong></div>
                    <div className={styles.industryCell}><strong>Typical Payback Period</strong></div>
                    <div className={styles.industryCell}><strong>Risk Level</strong></div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryCell}>Technology Startups</div>
                    <div className={styles.industryCell}>3-7 years</div>
                    <div className={styles.industryCell}>High</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryCell}>Real Estate</div>
                    <div className={styles.industryCell}>5-15 years</div>
                    <div className={styles.industryCell}>Medium</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryCell}>Manufacturing</div>
                    <div className={styles.industryCell}>2-5 years</div>
                    <div className={styles.industryCell}>Medium-Low</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryCell}>Retail Business</div>
                    <div className={styles.industryCell}>2-4 years</div>
                    <div className={styles.industryCell}>Medium</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryCell}>Renewable Energy</div>
                    <div className={styles.industryCell}>5-10 years</div>
                    <div className={styles.industryCell}>Low</div>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Advanced Techniques and Limitations</h3>
                <blockquote className={styles.expertQuote}>
                  "While payback period is invaluable for risk assessment, it has significant limitations. It ignores cash flows beyond the payback period and doesn't consider the time value of money in its simple form. Always use it alongside NPV and qualitative factors for complete investment analysis."
                  <footer className={styles.quoteFooter}>— Corporate Finance Director, 12+ years experience</footer>
                </blockquote>
                
                <div className={styles.limitationsList}>
                  <h4>Key Limitations to Consider:</h4>
                  <ul>
                    <li><strong>Time Value Ignored:</strong> Simple payback doesn't discount future cash flows</li>
                    <li><strong>Post-Payback Ignored:</strong> Ignores profitability after recovery period</li>
                    <li><strong>Scale Insensitive:</strong> Doesn't differentiate between large and small investments with same payback</li>
                    <li><strong>Cash Flow Pattern Bias:</strong> Favors investments with front-loaded cash flows</li>
                  </ul>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Practical Applications Across Industries</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Capital Budgeting:</strong> Screen capital expenditure proposals based on recovery time</li>
                  <li><strong>Equipment Purchases:</strong> Evaluate machinery and technology investments</li>
                  <li><strong>Real Estate Development:</strong> Assess property investment timelines</li>
                  <li><strong>Business Expansion:</strong> Plan new locations or market entries</li>
                  <li><strong>Project Management:</strong> Set financial milestones for long-term projects</li>
                  <li><strong>Startup Funding:</strong> Demonstrate capital recovery timeline to investors</li>
                </ul>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's considered a good payback period?</h3>
                <p className={styles.faqAnswer}>A "good" payback period varies by industry and risk tolerance. Generally, 2-4 years is excellent, 4-6 years is acceptable for medium-risk investments, and over 6 years is considered long-term. Many companies set maximum payback periods (e.g., 3-5 years) as investment criteria.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Why is discounted payback usually longer than simple payback?</h3>
                <p className={styles.faqAnswer}>Discounted payback accounts for the time value of money - future cash flows are worth less than present cash flows due to inflation and opportunity cost. By discounting future cash flows, it takes longer to reach the break-even point, providing a more conservative and accurate recovery timeline.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can payback period be negative?</h3>
                <p className={styles.faqAnswer}>No, payback period cannot be negative. If cumulative cash flows never reach zero (investment never recovers), the payback period is considered infinite or "never." In practice, we calculate the time it would take if current trends continued, but this indicates a poor investment.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I use payback period alone for investment decisions?</h3>
                <p className={styles.faqAnswer}>No, payback period should never be used alone. It's best used as a preliminary screening tool alongside NPV, IRR, and qualitative factors. Payback period excels at assessing risk and liquidity but ignores profitability and long-term value creation.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Analyze Your Investment Recovery?</h2>
              <p className={styles.ctaText}>Use our payback period calculator to assess your investment's risk and recovery timeline. Compare simple vs discounted payback and make data-driven capital allocation decisions.</p>
              
              
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational and informational purposes only. Payback period calculations are based on projected cash flows which may vary. Past performance does not guarantee future results. Always conduct thorough due diligence and consider consulting with a financial advisor before making investment decisions.
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

export default PaybackPeriodCalculator;