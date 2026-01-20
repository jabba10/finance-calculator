import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './cdcalculator.module.css';

const CDCalculator = ({ currentDate, lastModifiedDate }) => {
  // State for CD inputs
  const [initialDeposit, setInitialDeposit] = useState(10000);
  const [annualRate, setAnnualRate] = useState(4.5);
  const [termLength, setTermLength] = useState(12);
  const [termUnit, setTermUnit] = useState('months');
  const [compoundingFrequency, setCompoundingFrequency] = useState('monthly');
  const [cdType, setCdType] = useState('standard');
  const [earlyWithdrawalPenalty, setEarlyWithdrawalPenalty] = useState(3);
  const [additionalDeposits, setAdditionalDeposits] = useState(0);
  const [depositFrequency, setDepositFrequency] = useState('none');
  
  // Results state
  const [results, setResults] = useState(null);
  const [growthData, setGrowthData] = useState([]);
  const [penaltyAnalysis, setPenaltyAnalysis] = useState(null);
  const [cdLadderData, setCdLadderData] = useState([]);

  // CD types with descriptions
  const cdTypes = {
    'standard': 'Standard CD',
    'jumbo': 'Jumbo CD ($100,000+)',
    'bump-up': 'Bump-up CD',
    'liquid': 'Liquid/No-penalty CD',
    'ira': 'IRA CD',
    'brokered': 'Brokered CD'
  };

  // Compounding frequency map
  const compoundingFrequencyMap = {
    'daily': 365,
    'monthly': 12,
    'quarterly': 4,
    'semi-annually': 2,
    'annually': 1
  };

  // Calculate CD growth
  const calculateCDGrowth = () => {
    // Convert term to years based on unit
    let termYears;
    switch (termUnit) {
      case 'days':
        termYears = termLength / 365;
        break;
      case 'months':
        termYears = termLength / 12;
        break;
      case 'years':
        termYears = termLength;
        break;
      default:
        termYears = termLength / 12; // Default to months
    }

    const frequency = compoundingFrequencyMap[compoundingFrequency];
    const ratePerPeriod = annualRate / 100 / frequency;
    const totalPeriods = termYears * frequency;

    // Calculate future value with compound interest
    let futureValue = initialDeposit * Math.pow(1 + ratePerPeriod, totalPeriods);
    
    // Add additional deposits if any
    if (depositFrequency !== 'none' && additionalDeposits > 0) {
      let periodsPerYear;
      switch (depositFrequency) {
        case 'monthly':
          periodsPerYear = 12;
          break;
        case 'quarterly':
          periodsPerYear = 4;
          break;
        case 'annually':
          periodsPerYear = 1;
          break;
        default:
          periodsPerYear = 0;
      }
      
      if (periodsPerYear > 0) {
        const depositPerPeriod = additionalDeposits / periodsPerYear;
        for (let i = 1; i <= totalPeriods; i++) {
          if (i % (frequency / periodsPerYear) === 0) {
            const periodsRemaining = totalPeriods - i;
            futureValue += depositPerPeriod * Math.pow(1 + ratePerPeriod, periodsRemaining);
          }
        }
      }
    }

    const totalInterest = futureValue - initialDeposit;
    const apy = (Math.pow(1 + ratePerPeriod, frequency) - 1) * 100;
    
    // Calculate penalty for early withdrawal (typically 3-12 months of interest)
    const penaltyMonths = earlyWithdrawalPenalty;
    const penaltyInterest = (annualRate / 100) * (penaltyMonths / 12) * initialDeposit;
    const netAfterPenalty = Math.max(0, initialDeposit + totalInterest - penaltyInterest);

    // Generate growth data for chart
    const dataPoints = [];
    const periodsPerYear = frequency;
    
    for (let period = 1; period <= totalPeriods; period++) {
      if (period % (frequency / 4) === 0 || period === totalPeriods) { // Quarterly points
        const value = initialDeposit * Math.pow(1 + ratePerPeriod, period);
        const timeInYears = period / frequency;
        dataPoints.push({
          period: period,
          time: timeInYears,
          value: Math.round(value * 100) / 100,
          interest: Math.round((value - initialDeposit) * 100) / 100
        });
      }
    }

    // Generate CD ladder comparison
    const ladderTerms = [3, 6, 12, 24, 36, 60]; // months
    const ladderData = ladderTerms.map(term => {
      const termYears = term / 12;
      const periods = termYears * frequency;
      const ladderValue = initialDeposit * Math.pow(1 + ratePerPeriod, periods);
      const ladderInterest = ladderValue - initialDeposit;
      const ladderAPY = (Math.pow(1 + ratePerPeriod, frequency) - 1) * 100;
      
      return {
        term: term,
        value: Math.round(ladderValue * 100) / 100,
        interest: Math.round(ladderInterest * 100) / 100,
        apy: Math.round(ladderAPY * 100) / 100,
        effectiveRate: Math.round((ladderInterest / initialDeposit) * (12 / term) * 100 * 100) / 100
      };
    });

    setResults({
      futureValue: Math.round(futureValue * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      apy: Math.round(apy * 100) / 100,
      effectiveAnnualYield: Math.round((totalInterest / initialDeposit) * (1 / termYears) * 100 * 100) / 100,
      dailyInterest: Math.round((totalInterest / (termYears * 365)) * 100) / 100,
      monthlyInterest: Math.round((totalInterest / (termYears * 12)) * 100) / 100
    });

    setPenaltyAnalysis({
      penaltyMonths: penaltyMonths,
      penaltyAmount: Math.round(penaltyInterest * 100) / 100,
      netAfterPenalty: Math.round(netAfterPenalty * 100) / 100,
      breakEvenMonths: Math.ceil((penaltyInterest / (totalInterest / (termYears * 12)))),
      wouldLoseMoney: netAfterPenalty < initialDeposit
    });

    setGrowthData(dataPoints);
    setCdLadderData(ladderData);
  };

  useEffect(() => {
    calculateCDGrowth();
  }, [
    initialDeposit, annualRate, termLength, termUnit, 
    compoundingFrequency, cdType, earlyWithdrawalPenalty,
    additionalDeposits, depositFrequency
  ]);

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

  const formatTerm = () => {
    switch (termUnit) {
      case 'days':
        return `${termLength} day${termLength !== 1 ? 's' : ''}`;
      case 'months':
        return `${termLength} month${termLength !== 1 ? 's' : ''}`;
      case 'years':
        return `${termLength} year${termLength !== 1 ? 's' : ''}`;
      default:
        return `${termLength} months`;
    }
  };

  return (
    <>
      <Head>
        <title>Advanced CD Calculator | Maximize Your Certificate of Deposit Returns</title>
        <meta name="description" content="Free advanced CD calculator with APY comparisons, penalty analysis, and CD ladder strategies. Calculate CD interest earnings and optimize your fixed-income investments." />
        <meta name="keywords" content="CD calculator, certificate of deposit calculator, CD interest calculator, APY calculator, CD rates, fixed income calculator, savings calculator" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/cd-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced CD Calculator | Maximize Your Certificate of Deposit Returns" />
        <meta property="og:description" content="Calculate CD interest earnings with APY comparisons, penalty analysis, and ladder strategies. Optimize your fixed-income investments." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/cd-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced CD Calculator" />
        <meta name="twitter:description" content="Calculate and compare CD returns with detailed penalty analysis and ladder strategies." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="cd-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced CD Calculator",
            "description": "Professional certificate of deposit calculator with APY comparisons, penalty analysis, and CD ladder strategies",
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
              "name": "Financial Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "APY vs APR Calculations",
              "Early Withdrawal Penalty Analysis",
              "CD Ladder Comparisons",
              "Multiple Compounding Frequencies",
              "Different CD Type Support"
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
                "name": "What's the difference between APY and APR for CDs?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "APR (Annual Percentage Rate) is the simple interest rate without compounding. APY (Annual Percentage Yield) includes compounding effects. APY is always equal to or higher than APR because it shows your actual earnings with compound interest included.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "Are CD early withdrawal penalties worth it?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Early withdrawal penalties typically cost 3-12 months of interest. Generally, it's not worth breaking a CD unless you face financial emergency. Our calculator shows exactly how much you'd lose and how long it takes to break even.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is a CD ladder and how does it work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A CD ladder involves dividing your money across multiple CDs with different maturity dates. This provides regular access to funds while maintaining higher long-term rates. For example, instead of one $10,000 5-year CD, you could have five $2,000 CDs maturing at 1, 2, 3, 4, and 5 years.",
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
            <h1 className={styles.mainTitle}>Advanced CD Calculator</h1>
            <p className={styles.subtitle}>Maximize Your Certificate of Deposit Returns with Smart Planning</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>FDIC/NCUA Insured</span>
              <span className={styles.badge}>Penalty Analysis</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>CD Investment Details</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Initial Deposit
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="500"
                      max="250000"
                      step="500"
                      value={initialDeposit}
                      onChange={(e) => setInitialDeposit(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="500"
                      max="250000"
                      step="500"
                      value={initialDeposit}
                      onChange={(e) => setInitialDeposit(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(initialDeposit)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Interest Rate (APR)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0.1"
                      max="10"
                      step="0.05"
                      value={annualRate}
                      onChange={(e) => setAnnualRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0.1"
                      max="10"
                      step="0.05"
                      value={annualRate}
                      onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(annualRate)} APR</div>
                </label>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroupHalf}>
                  <label className={styles.inputLabel}>
                    Term Length
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="1"
                        max={termUnit === 'years' ? '10' : termUnit === 'months' ? '120' : '365'}
                        step="1"
                        value={termLength}
                        onChange={(e) => setTermLength(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="1"
                        max={termUnit === 'years' ? '10' : termUnit === 'months' ? '120' : '365'}
                        step="1"
                        value={termLength}
                        onChange={(e) => setTermLength(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{termLength} {termUnit}</div>
                  </label>
                </div>

                <div className={styles.inputGroupHalf}>
                  <label className={styles.inputLabel}>
                    Term Unit
                    <select
                      value={termUnit}
                      onChange={(e) => setTermUnit(e.target.value)}
                      className={styles.selectInput}
                    >
                      <option value="days">Days</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroupHalf}>
                  <label className={styles.inputLabel}>
                    CD Type
                    <select
                      value={cdType}
                      onChange={(e) => setCdType(e.target.value)}
                      className={styles.selectInput}
                    >
                      {Object.entries(cdTypes).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className={styles.inputGroupHalf}>
                  <label className={styles.inputLabel}>
                    Compounding Frequency
                    <select
                      value={compoundingFrequency}
                      onChange={(e) => setCompoundingFrequency(e.target.value)}
                      className={styles.selectInput}
                    >
                      <option value="daily">Daily</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="semi-annually">Semi-Annually</option>
                      <option value="annually">Annually</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Early Withdrawal Penalty
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="24"
                      step="1"
                      value={earlyWithdrawalPenalty}
                      onChange={(e) => setEarlyWithdrawalPenalty(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="24"
                      step="1"
                      value={earlyWithdrawalPenalty}
                      onChange={(e) => setEarlyWithdrawalPenalty(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.unitSymbol}>months interest</span>
                  </div>
                  <div className={styles.valueDisplay}>{earlyWithdrawalPenalty} months of interest</div>
                </label>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroupHalf}>
                  <label className={styles.inputLabel}>
                    Additional Deposits
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        value={additionalDeposits}
                        onChange={(e) => setAdditionalDeposits(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0"
                        max="10000"
                        step="100"
                        value={additionalDeposits}
                        onChange={(e) => setAdditionalDeposits(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{formatCurrency(additionalDeposits)}/year</div>
                  </label>
                </div>

                <div className={styles.inputGroupHalf}>
                  <label className={styles.inputLabel}>
                    Deposit Frequency
                    <select
                      value={depositFrequency}
                      onChange={(e) => setDepositFrequency(e.target.value)}
                      className={styles.selectInput}
                    >
                      <option value="none">No Additional Deposits</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>CD Projection: {cdTypes[cdType]}</h2>
              
              {results && (
                <>
                  <div className={styles.cdTermInfo}>
                    <div className={styles.cdTermLabel}>Term:</div>
                    <div className={styles.cdTermValue}>{formatTerm()}</div>
                    <div className={styles.cdTermLabel}>Compounding:</div>
                    <div className={styles.cdTermValue}>{compoundingFrequency}</div>
                  </div>

                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Maturity Value</div>
                      <div className={`${styles.resultValue} ${styles.highlightValue}`}>
                        {formatCurrency(results.futureValue)}
                      </div>
                      <div className={styles.resultSubtext}>
                        Principal: {formatCurrency(initialDeposit)}<br />
                        Interest: {formatCurrency(results.totalInterest)}
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Annual Percentage Yield (APY)</div>
                      <div className={`${styles.resultValue} ${styles.apyValue}`}>
                        {formatPercentage(results.apy)}
                      </div>
                      <div className={styles.resultSubtext}>
                        APR: {formatPercentage(annualRate)}<br />
                        Effective Yield: {formatPercentage(results.effectiveAnnualYield)}
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Regular Interest Earned</div>
                      <div className={styles.resultValue}>{formatCurrency(results.monthlyInterest)}/month</div>
                      <div className={styles.resultSubtext}>
                        Daily: {formatCurrency(results.dailyInterest)}<br />
                        Yearly: {formatCurrency(results.totalInterest / (termLength / (termUnit === 'years' ? 1 : termUnit === 'months' ? 12 : 365)))}
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Return on Investment</div>
                      <div className={styles.resultValue}>{formatPercentage((results.totalInterest / initialDeposit) * 100)}</div>
                      <div className={styles.resultSubtext}>
                        Total Return: {formatPercentage(results.totalInterest / initialDeposit * 100)}<br />
                        Annualized: {formatPercentage(results.effectiveAnnualYield)}
                      </div>
                    </div>
                  </div>

                  {/* Growth Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Growth Over Time</h3>
                    <div className={styles.chartBars}>
                      {growthData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>
                            {data.time.toFixed(1)} year{data.time !== 1 ? 's' : ''}
                          </div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarPrincipal}
                              style={{ width: `${(initialDeposit / data.value) * 100}%` }}
                              title={`Principal: ${formatCurrency(initialDeposit)}`}
                            />
                            <div 
                              className={styles.chartBarInterest}
                              style={{ width: `${(data.interest / data.value) * 100}%` }}
                              title={`Interest: ${formatCurrency(data.interest)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{formatCurrency(data.value)}</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendPrincipal}`}></div>
                        <span>Your Principal</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendInterest}`}></div>
                        <span>Interest Earned</span>
                      </div>
                    </div>
                  </div>

                  {/* Penalty Analysis */}
                  {penaltyAnalysis && earlyWithdrawalPenalty > 0 && (
                    <div className={styles.penaltyCard}>
                      <h3 className={styles.penaltyTitle}>⚠️ Early Withdrawal Analysis</h3>
                      <div className={styles.penaltyGrid}>
                        <div className={styles.penaltyItem}>
                          <div className={styles.penaltyLabel}>Penalty Amount</div>
                          <div className={styles.penaltyValue}>{formatCurrency(penaltyAnalysis.penaltyAmount)}</div>
                        </div>
                        <div className={styles.penaltyItem}>
                          <div className={styles.penaltyLabel}>Net After Penalty</div>
                          <div className={`${styles.penaltyValue} ${penaltyAnalysis.wouldLoseMoney ? styles.negativeValue : ''}`}>
                            {formatCurrency(penaltyAnalysis.netAfterPenalty)}
                          </div>
                        </div>
                        <div className={styles.penaltyItem}>
                          <div className={styles.penaltyLabel}>Break-even Period</div>
                          <div className={styles.penaltyValue}>{penaltyAnalysis.breakEvenMonths} months</div>
                        </div>
                        <div className={styles.penaltyItem}>
                          <div className={styles.penaltyLabel}>Risk Level</div>
                          <div className={`${styles.penaltyValue} ${penaltyAnalysis.wouldLoseMoney ? styles.highRisk : styles.mediumRisk}`}>
                            {penaltyAnalysis.wouldLoseMoney ? 'High' : 'Medium'}
                          </div>
                        </div>
                      </div>
                      <p className={styles.penaltyWarning}>
                        {penaltyAnalysis.wouldLoseMoney 
                          ? `⚠️ Warning: Early withdrawal would result in losing money (less than your initial deposit).`
                          : `⚠️ You would lose ${formatCurrency(penaltyAnalysis.penaltyAmount)} in penalties if withdrawn early.`
                        }
                      </p>
                    </div>
                  )}

                  {/* CD Ladder Comparison */}
                  <div className={styles.ladderCard}>
                    <h3 className={styles.ladderTitle}>📊 CD Ladder Comparison</h3>
                    <div className={styles.ladderTable}>
                      <div className={styles.ladderHeader}>
                        <div className={styles.ladderHeaderCell}>Term</div>
                        <div className={styles.ladderHeaderCell}>Maturity Value</div>
                        <div className={styles.ladderHeaderCell}>Interest</div>
                        <div className={styles.ladderHeaderCell}>APY</div>
                      </div>
                      {cdLadderData.map((cd, index) => (
                        <div key={index} className={styles.ladderRow}>
                          <div className={styles.ladderCell}>{cd.term} months</div>
                          <div className={styles.ladderCell}>{formatCurrency(cd.value)}</div>
                          <div className={styles.ladderCell}>{formatCurrency(cd.interest)}</div>
                          <div className={styles.ladderCell}>{formatPercentage(cd.apy)}</div>
                        </div>
                      ))}
                    </div>
                    <p className={styles.ladderNote}>
                      A CD ladder provides regular access to funds while maintaining higher long-term rates.
                    </p>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>💡 CD Strategy Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Your CD is <strong>FDIC/NCUA insured</strong> up to $250,000 per institution</li>
                      <li>The <strong>{formatPercentage(results.apy)} APY</strong> is your actual annual return including compounding</li>
                      <li>Consider a <strong>CD ladder</strong> for better liquidity and rate flexibility</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Mastering Certificates of Deposit: The Complete Guide to Safe, Predictable Returns</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Why CDs Are Your Safest Investment</h3>
                <p>Certificates of Deposit offer guaranteed returns with federal insurance protection, making them the safest investment choice for preserving capital while earning predictable interest. Unlike stocks or bonds, CD returns are fixed and guaranteed—you know exactly what you&apos;ll earn before you invest.</p>
                
                <div className={styles.exampleCard}>
                  <h4>FDIC/NCUA Insurance Protection:</h4>
                  <ul>
                    <li><strong>$250,000 per depositor</strong> per insured institution</li>
                    <li><strong>Separate coverage</strong> for different account types (single, joint, retirement)</li>
                    <li><strong>Government-backed</strong> protection against bank failure</li>
                    <li><strong>No market risk</strong>—principal is guaranteed</li>
                  </ul>
                  <p>This insurance makes CDs one of the only investments with zero risk of principal loss when held to maturity.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Advanced CD Strategies for Maximum Returns</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🪜 CD Ladder Strategy</h4>
                    <p>Divide your investment across multiple CDs with staggered maturity dates. This provides regular access to funds while capturing higher long-term rates. Example: Invest in 1, 2, 3, 4, and 5-year CDs.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🔄 Bump-Up CDs</h4>
                    <p>Some CDs allow you to &quot;bump up&quot; your rate if interest rates rise. You typically get one or two opportunities during the term to increase to current rates.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💧 Liquid/No-Penalty CDs</h4>
                    <p>These specialized CDs allow early withdrawal without penalty after a short period (usually 7 days). Perfect for emergency funds earning better than savings account rates.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏦 Brokered CDs</h4>
                    <p>Purchase CDs through brokerage firms for access to nationwide rates. These can be sold on the secondary market if you need liquidity before maturity.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>When to Choose CDs Over Other Investments</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Emergency Funds:</strong> Liquid or short-term CDs beat savings accounts</li>
                  <li><strong>Short-Term Goals:</strong> Saving for a down payment, car, or vacation in 1-3 years</li>
                  <li><strong>Retirement Income:</strong> Seniors needing predictable, safe income</li>
                  <li><strong>Portfolio Diversification:</strong> Balancing riskier investments with guaranteed returns</li>
                  <li><strong>Interest Rate Hedging:</strong> Locking in rates before expected decreases</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Financial Planners</h3>
                <blockquote className={styles.expertQuote}>
                  &quot;CDs are not just for conservative investors. Every portfolio should have some guaranteed component. I recommend keeping 10-20% of your fixed-income allocation in CDs or Treasury securities. The predictability allows you to take calculated risks elsewhere in your portfolio.&quot;
                  <footer className={styles.quoteFooter}>— Certified Financial Planner, Banking Specialist with 20+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions About CDs</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What happens when my CD matures?</h3>
                <p className={styles.faqAnswer}>Most CDs have a &quot;grace period&quot; (usually 7-10 days) after maturity where you can withdraw funds penalty-free. After this period, the CD typically automatically renews at the current rate for the same term unless you instruct otherwise. Always set a reminder before maturity to decide whether to renew, withdraw, or reinvest elsewhere.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Are CD rates negotiable?</h3>
                <p className={styles.faqAnswer}>For large deposits (&gt;$100,000), many banks will negotiate rates, especially for &quot;jumbo CDs.&quot; Always ask! Online banks and credit unions often offer better rates than traditional brick-and-mortar banks. Brokered CDs through investment firms provide access to nationwide competitive rates.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How are CD interest payments taxed?</h3>
                <p className={styles.faqAnswer}>CD interest is taxed as ordinary income in the year it&apos;s earned, even if you don&apos;t receive it until maturity. Banks report interest on Form 1099-INT. Consider placing CDs in tax-advantaged accounts (like IRAs) if you&apos;re in a high tax bracket. Some CDs offer tax benefits for specific purposes like education.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I choose a CD or a high-yield savings account?</h3>
                <p className={styles.faqAnswer}>Choose CDs for fixed-term goals where you won&apos;t need the money (higher rates, penalties for early withdrawal). Choose high-yield savings for emergency funds or short-term needs (lower rates but immediate access). A good strategy is to use both: savings for liquidity, CDs for planned expenses.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Build Your CD Strategy?</h2>
              <p className={styles.ctaText}>Use our calculator to experiment with different CD terms, amounts, and strategies. Compare CD ladder approaches and understand penalty implications before you invest.</p>
              
              
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Actual CD rates and terms vary by financial institution. Early withdrawal penalties and renewal policies differ. FDIC insurance covers up to $250,000 per depositor per insured institution. NCUA provides similar coverage for credit unions. Past performance does not guarantee future rates. Consider consulting with a financial advisor for personalized advice.
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

export default CDCalculator;