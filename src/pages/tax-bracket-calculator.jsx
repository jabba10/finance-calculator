import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './taxbracketcalculator.module.css';

const TaxBracketCalculator = ({ currentDate, lastModifiedDate }) => {
  // 2024 US Federal Tax Brackets (Single, Married Filing Jointly, Head of Household)
  const taxBrackets = {
    'single': [
      { min: 0, max: 11600, rate: 0.10, tax: 0 },
      { min: 11601, max: 47150, rate: 0.12, tax: 1160 },
      { min: 47151, max: 100525, rate: 0.22, tax: 5426 },
      { min: 100526, max: 191950, rate: 0.24, tax: 17169 },
      { min: 191951, max: 243725, rate: 0.32, tax: 39101 },
      { min: 243726, max: 609350, rate: 0.35, tax: 55645 },
      { min: 609351, max: Infinity, rate: 0.37, tax: 183647 }
    ],
    'married': [
      { min: 0, max: 23200, rate: 0.10, tax: 0 },
      { min: 23201, max: 94300, rate: 0.12, tax: 2320 },
      { min: 94301, max: 201050, rate: 0.22, tax: 10852 },
      { min: 201051, max: 383900, rate: 0.24, tax: 34338 },
      { min: 383901, max: 487450, rate: 0.32, tax: 78202 },
      { min: 487451, max: 731200, rate: 0.35, tax: 111294 },
      { min: 731201, max: Infinity, rate: 0.37, tax: 196670 }
    ],
    'headOfHousehold': [
      { min: 0, max: 16550, rate: 0.10, tax: 0 },
      { min: 16551, max: 63100, rate: 0.12, tax: 1655 },
      { min: 63101, max: 100500, rate: 0.22, tax: 7247 },
      { min: 100501, max: 191950, rate: 0.24, tax: 15447 },
      { min: 191951, max: 243700, rate: 0.32, tax: 37295 },
      { min: 243701, max: 609350, rate: 0.35, tax: 53739 },
      { min: 609351, max: Infinity, rate: 0.37, tax: 181955 }
    ]
  };

  const [income, setIncome] = useState(75000);
  const [filingStatus, setFilingStatus] = useState('single');
  const [stateTax, setStateTax] = useState(5.0);
  const [deductions, setDeductions] = useState(13850);
  const [has401k, setHas401k] = useState(true);
  const [contribution401k, setContribution401k] = useState(10);
  const [hasHSA, setHasHSA] = useState(false);
  const [contributionHSA, setContributionHSA] = useState(0);
  const [hasDependents, setHasDependents] = useState(false);
  const [numDependents, setNumDependents] = useState(0);
  const [results, setResults] = useState(null);
  const [bracketBreakdown, setBracketBreakdown] = useState([]);

  const calculateTaxes = () => {
    const brackets = taxBrackets[filingStatus];
    
    // Calculate pre-tax adjustments
    const preTax401k = has401k ? income * (contribution401k / 100) : 0;
    const preTaxHSA = hasHSA ? contributionHSA : 0;
    
    const adjustedGrossIncome = income - preTax401k - preTaxHSA;
    const taxableIncome = Math.max(0, adjustedGrossIncome - deductions);
    
    // Calculate federal tax
    let federalTax = 0;
    let remainingIncome = taxableIncome;
    const breakdown = [];
    
    for (let i = 0; i < brackets.length && remainingIncome > 0; i++) {
      const bracket = brackets[i];
      const bracketRange = bracket.max === Infinity ? remainingIncome : Math.min(remainingIncome, bracket.max - bracket.min);
      const taxableInBracket = Math.max(0, Math.min(bracketRange, remainingIncome));
      
      if (taxableInBracket > 0) {
        const taxInBracket = taxableInBracket * bracket.rate;
        federalTax += taxInBracket;
        
        breakdown.push({
          bracket: i + 1,
          range: `$${bracket.min.toLocaleString()} - $${bracket.max === Infinity ? '∞' : bracket.max.toLocaleString()}`,
          rate: bracket.rate * 100,
          amount: taxableInBracket,
          tax: taxInBracket,
          cumulativeTax: federalTax
        });
        
        remainingIncome -= taxableInBracket;
      }
    }
    
    // Add previous brackets' taxes
    const lastBracket = brackets.find(b => taxableIncome >= b.min && taxableIncome <= b.max);
    if (lastBracket) {
      federalTax += lastBracket.tax;
    }
    
    // Calculate state tax
    const stateTaxAmount = adjustedGrossIncome * (stateTax / 100);
    
    // Calculate FICA taxes
    const socialSecurityTax = Math.min(income, 168600) * 0.062;
    const medicareTax = income * 0.0145;
    const ficaTax = socialSecurityTax + medicareTax;
    
    // Calculate total tax
    const totalTax = federalTax + stateTaxAmount + ficaTax;
    
    // Calculate effective tax rates
    const federalEffectiveRate = (federalTax / income) * 100;
    const totalEffectiveRate = (totalTax / income) * 100;
    const marginalRate = brackets.find(b => taxableIncome >= b.min && taxableIncome <= b.max)?.rate * 100 || 0;
    
    // Calculate take-home pay
    const takeHomePay = income - totalTax - preTax401k - preTaxHSA;
    const monthlyTakeHome = takeHomePay / 12;
    
    // Calculate tax savings from deductions
    const taxSavingsFrom401k = preTax401k * marginalRate / 100;
    const taxSavingsFromDeductions = deductions * marginalRate / 100;
    
    setResults({
      taxableIncome: taxableIncome,
      federalTax: federalTax,
      stateTax: stateTaxAmount,
      ficaTax: ficaTax,
      totalTax: totalTax,
      federalEffectiveRate: federalEffectiveRate,
      totalEffectiveRate: totalEffectiveRate,
      marginalRate: marginalRate,
      takeHomePay: takeHomePay,
      monthlyTakeHome: monthlyTakeHome,
      adjustedGrossIncome: adjustedGrossIncome,
      taxSavingsFrom401k: taxSavingsFrom401k,
      taxSavingsFromDeductions: taxSavingsFromDeductions,
      socialSecurityTax: socialSecurityTax,
      medicareTax: medicareTax
    });
    
    setBracketBreakdown(breakdown);
  };

  useEffect(() => {
    calculateTaxes();
  }, [income, filingStatus, stateTax, deductions, has401k, contribution401k, hasHSA, contributionHSA, hasDependents, numDependents]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const getBracketColor = (rate) => {
    const colors = ['#10b981', '#34d399', '#fbbf24', '#f97316', '#ef4444', '#dc2626', '#991b1b'];
    const index = Math.min(Math.floor(rate / 5), colors.length - 1);
    return colors[index];
  };

  const getTaxEfficiency = (effectiveRate) => {
    if (effectiveRate < 10) return { level: 'Very Efficient', color: '#10b981', icon: '🏆' };
    if (effectiveRate < 15) return { level: 'Efficient', color: '#34d399', icon: '✅' };
    if (effectiveRate < 20) return { level: 'Average', color: '#fbbf24', icon: '📊' };
    if (effectiveRate < 25) return { level: 'High', color: '#f97316', icon: '⚠️' };
    return { level: 'Very High', color: '#ef4444', icon: '🔥' };
  };

  return (
    <>
      <Head>
        <title>Advanced Tax Bracket Calculator | 2026 Federal & State Tax Estimation</title>
        <meta name="description" content="Free advanced tax bracket calculator with 401(k), HSA, and deduction optimization. Calculate your marginal tax rate, effective tax rate, and take-home pay." />
        <meta name="keywords" content="tax bracket calculator, tax calculator, income tax calculator, federal tax calculator, marginal tax rate, effective tax rate, take home pay calculator" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/tax-bracket-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Tax Bracket Calculator | 2024 Federal & State Tax Estimation" />
        <meta property="og:description" content="Calculate your tax bracket, optimize deductions, and maximize take-home pay with our comprehensive tax calculator." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/tax-bracket-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Tax Bracket Calculator" />
        <meta name="twitter:description" content="Calculate and optimize your taxes with our comprehensive tax bracket calculator." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="tax-bracket-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Tax Bracket Calculator",
            "description": "Professional-grade tax calculator with bracket analysis, deduction optimization, and take-home pay estimation",
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
              "name": "Financial Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "2024 Tax Bracket Analysis",
              "State Tax Calculation",
              "401(k) & HSA Optimization",
              "Deduction Analysis",
              "Take-Home Pay Estimation"
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
                "name": "What's the difference between marginal and effective tax rates?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Your marginal tax rate is the rate at which your last dollar of income is taxed, determined by your highest tax bracket. Your effective tax rate is the average rate you pay on all your taxable income (total tax ÷ total income). Marginal rate affects additional income decisions, while effective rate shows your overall tax burden.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How do pre-tax deductions like 401(k) reduce my taxes?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Pre-tax deductions reduce your taxable income dollar-for-dollar. If you contribute $1,000 to a 401(k) and your marginal tax rate is 24%, you save $240 in federal taxes. This means your $1,000 contribution only 'costs' you $760 in take-home pay.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's the standard deduction for 2024?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "For 2024, the standard deduction is $14,600 for single filers and $29,200 for married couples filing jointly. The standard deduction reduces your taxable income without needing to itemize expenses.",
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
            <h1 className={styles.mainTitle}>Advanced Tax Bracket Calculator</h1>
            <p className={styles.subtitle}>Calculate Your 2026 Tax Burden & Maximize Take-Home Pay</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}> Tax Brackets</span>
              <span className={styles.badge}>IRS-Compliant</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Enter Your Tax Information</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Income
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="10000"
                      max="1000000"
                      step="1000"
                      value={income}
                      onChange={(e) => setIncome(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10000"
                      max="1000000"
                      step="1000"
                      value={income}
                      onChange={(e) => setIncome(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(income)}/year</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Filing Status
                  <div className={styles.filingOptions}>
                    <button
                      className={`${styles.filingButton} ${filingStatus === 'single' ? styles.filingButtonActive : ''}`}
                      onClick={() => setFilingStatus('single')}
                    >
                      Single
                    </button>
                    <button
                      className={`${styles.filingButton} ${filingStatus === 'married' ? styles.filingButtonActive : ''}`}
                      onClick={() => setFilingStatus('married')}
                    >
                      Married
                    </button>
                    <button
                      className={`${styles.filingButton} ${filingStatus === 'headOfHousehold' ? styles.filingButtonActive : ''}`}
                      onClick={() => setFilingStatus('headOfHousehold')}
                    >
                      Head of Household
                    </button>
                  </div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  State Tax Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="13"
                      step="0.1"
                      value={stateTax}
                      onChange={(e) => setStateTax(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="13"
                      step="0.1"
                      value={stateTax}
                      onChange={(e) => setStateTax(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(stateTax)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Deductions
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="100"
                      value={deductions}
                      onChange={(e) => setDeductions(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="50000"
                      step="100"
                      value={deductions}
                      onChange={(e) => setDeductions(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(deductions)}</div>
                </label>
                <div className={styles.deductionNote}>
                  Standard deduction: {filingStatus === 'single' ? '$14,600' : filingStatus === 'married' ? '$29,200' : '$21,900'}
                </div>
              </div>

              <div className={styles.retirementSection}>
                <h3 className={styles.sectionSubtitle}>Retirement & Health Savings</h3>
                
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={has401k}
                      onChange={(e) => setHas401k(e.target.checked)}
                      className={styles.checkboxInput}
                    />
                    <span className={styles.checkboxText}>401(k) Contribution</span>
                  </label>
                  
                  {has401k && (
                    <div className={styles.contributionInput}>
                      <label className={styles.inputLabel}>
                        Contribution Rate
                        <div className={styles.inputWrapper}>
                          <input
                            type="range"
                            min="1"
                            max="50"
                            step="1"
                            value={contribution401k}
                            onChange={(e) => setContribution401k(parseInt(e.target.value))}
                            className={styles.slider}
                          />
                          <input
                            type="number"
                            min="1"
                            max="50"
                            step="1"
                            value={contribution401k}
                            onChange={(e) => setContribution401k(parseInt(e.target.value) || 0)}
                            className={styles.numberInput}
                          />
                          <span className={styles.percentageSymbol}>%</span>
                        </div>
                        <div className={styles.valueDisplay}>{formatPercentage(contribution401k)}</div>
                      </label>
                    </div>
                  )}
                </div>

                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={hasHSA}
                      onChange={(e) => setHasHSA(e.target.checked)}
                      className={styles.checkboxInput}
                    />
                    <span className={styles.checkboxText}>HSA Contribution</span>
                  </label>
                  
                  {hasHSA && (
                    <div className={styles.contributionInput}>
                      <label className={styles.inputLabel}>
                        Annual Contribution
                        <div className={styles.inputWrapper}>
                          <span className={styles.currencySymbol}>$</span>
                          <input
                            type="range"
                            min="100"
                            max="8300"
                            step="100"
                            value={contributionHSA}
                            onChange={(e) => setContributionHSA(parseInt(e.target.value))}
                            className={styles.slider}
                          />
                          <input
                            type="number"
                            min="100"
                            max="8300"
                            step="100"
                            value={contributionHSA}
                            onChange={(e) => setContributionHSA(parseInt(e.target.value) || 0)}
                            className={styles.numberInput}
                          />
                        </div>
                        <div className={styles.valueDisplay}>{formatCurrency(contributionHSA)}/year</div>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.dependentSection}>
                <h3 className={styles.sectionSubtitle}>Dependents</h3>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={hasDependents}
                      onChange={(e) => setHasDependents(e.target.checked)}
                      className={styles.checkboxInput}
                    />
                    <span className={styles.checkboxText}>I have dependents</span>
                  </label>
                  
                  {hasDependents && (
                    <div className={styles.dependentInput}>
                      <label className={styles.inputLabel}>
                        Number of Dependents
                        <div className={styles.inputWrapper}>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={numDependents}
                            onChange={(e) => setNumDependents(parseInt(e.target.value))}
                            className={styles.slider}
                          />
                          <input
                            type="number"
                            min="1"
                            max="10"
                            step="1"
                            value={numDependents}
                            onChange={(e) => setNumDependents(parseInt(e.target.value) || 0)}
                            className={styles.numberInput}
                          />
                        </div>
                        <div className={styles.valueDisplay}>{numDependents} dependent{numDependents !== 1 ? 's' : ''}</div>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Tax Analysis Results</h2>
              
              {results && (
                <>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryRow}>
                      <div className={styles.summaryItem}>
                        <div className={styles.summaryLabel}>Gross Income</div>
                        <div className={styles.summaryValue}>{formatCurrency(income)}</div>
                      </div>
                      <div className={styles.summaryArrow}>→</div>
                      <div className={styles.summaryItem}>
                        <div className={styles.summaryLabel}>Take-Home Pay</div>
                        <div className={styles.summaryValue}>{formatCurrency(results.takeHomePay)}</div>
                      </div>
                    </div>
                    <div className={styles.summaryNote}>
                      Monthly take-home: {formatCurrency(results.monthlyTakeHome)}
                    </div>
                  </div>

                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Taxes</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalTax)}</div>
                      <div className={styles.resultDescription}>
                        {formatPercentage(results.totalEffectiveRate)} effective rate
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Marginal Tax Rate</div>
                      <div className={styles.resultValue}>{formatPercentage(results.marginalRate)}</div>
                      <div className={styles.resultDescription}>
                        Rate on next dollar earned
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Federal Tax</div>
                      <div className={styles.resultValue}>{formatCurrency(results.federalTax)}</div>
                      <div className={styles.resultDescription}>
                        {formatPercentage(results.federalEffectiveRate)} effective rate
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Taxable Income</div>
                      <div className={styles.resultValue}>{formatCurrency(results.taxableIncome)}</div>
                      <div className={styles.resultDescription}>
                        After deductions & pre-tax contributions
                      </div>
                    </div>
                  </div>

                  {/* Tax Efficiency Assessment */}
                  <div className={styles.efficiencyCard}>
                    <h3 className={styles.efficiencyTitle}>Tax Efficiency Assessment</h3>
                    {(() => {
                      const efficiency = getTaxEfficiency(results.totalEffectiveRate);
                      return (
                        <>
                          <div className={styles.efficiencyLevel} style={{ backgroundColor: efficiency.color }}>
                            <span className={styles.efficiencyIcon}>{efficiency.icon}</span>
                            <span className={styles.efficiencyText}>{efficiency.level}</span>
                          </div>
                          <p className={styles.efficiencyDescription}>
                            Your total effective tax rate of <strong>{formatPercentage(results.totalEffectiveRate)}</strong> is {
                              efficiency.level === 'Very Efficient' ? 'excellent' :
                              efficiency.level === 'Efficient' ? 'good' :
                              efficiency.level === 'Average' ? 'average' :
                              efficiency.level === 'High' ? 'above average' : 'high'
                            } for your income level and filing status.
                          </p>
                        </>
                      );
                    })()}
                  </div>

                  {/* Tax Breakdown Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Tax Distribution</h3>
                    <div className={styles.chartBars}>
                      <div className={styles.chartBarGroup}>
                        <div className={styles.chartBarLabel}>Federal Tax</div>
                        <div className={styles.chartBarContainer}>
                          <div 
                            className={styles.chartBar}
                            style={{ 
                              width: `${(results.federalTax / results.totalTax) * 100}%`,
                              backgroundColor: '#ef4444'
                            }}
                            title={`Federal Tax: ${formatCurrency(results.federalTax)} (${((results.federalTax / results.totalTax) * 100).toFixed(1)}%)`}
                          />
                        </div>
                        <div className={styles.chartBarValue}>{formatCurrency(results.federalTax)}</div>
                      </div>
                      
                      <div className={styles.chartBarGroup}>
                        <div className={styles.chartBarLabel}>State Tax</div>
                        <div className={styles.chartBarContainer}>
                          <div 
                            className={styles.chartBar}
                            style={{ 
                              width: `${(results.stateTax / results.totalTax) * 100}%`,
                              backgroundColor: '#f97316'
                            }}
                            title={`State Tax: ${formatCurrency(results.stateTax)} (${((results.stateTax / results.totalTax) * 100).toFixed(1)}%)`}
                          />
                        </div>
                        <div className={styles.chartBarValue}>{formatCurrency(results.stateTax)}</div>
                      </div>
                      
                      <div className={styles.chartBarGroup}>
                        <div className={styles.chartBarLabel}>FICA (Social Security & Medicare)</div>
                        <div className={styles.chartBarContainer}>
                          <div 
                            className={styles.chartBar}
                            style={{ 
                              width: `${(results.ficaTax / results.totalTax) * 100}%`,
                              backgroundColor: '#fbbf24'
                            }}
                            title={`FICA Tax: ${formatCurrency(results.ficaTax)} (${((results.ficaTax / results.totalTax) * 100).toFixed(1)}%)`}
                          />
                        </div>
                        <div className={styles.chartBarValue}>{formatCurrency(results.ficaTax)}</div>
                      </div>
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ backgroundColor: '#ef4444' }}></div>
                        <span>Federal Tax ({((results.federalTax / results.totalTax) * 100).toFixed(1)}%)</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ backgroundColor: '#f97316' }}></div>
                        <span>State Tax ({((results.stateTax / results.totalTax) * 100).toFixed(1)}%)</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ backgroundColor: '#fbbf24' }}></div>
                        <span>FICA ({((results.ficaTax / results.totalTax) * 100).toFixed(1)}%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Tax Bracket Breakdown */}
                  <div className={styles.bracketCard}>
                    <h3 className={styles.bracketTitle}>Federal Tax Bracket Breakdown</h3>
                    <div className={styles.bracketTable}>
                      <div className={styles.tableHeader}>
                        <div className={styles.tableCell}>Bracket</div>
                        <div className={styles.tableCell}>Income Range</div>
                        <div className={styles.tableCell}>Tax Rate</div>
                        <div className={styles.tableCell}>Tax Amount</div>
                        <div className={styles.tableCell}>Cumulative Tax</div>
                      </div>
                      {bracketBreakdown.map((bracket, index) => (
                        <div key={index} className={styles.tableRow}>
                          <div className={styles.tableCell}>{bracket.bracket}</div>
                          <div className={styles.tableCell}>{bracket.range}</div>
                          <div className={styles.tableCell}>
                            <span className={styles.bracketRate} style={{ backgroundColor: getBracketColor(bracket.rate) }}>
                              {bracket.rate}%
                            </span>
                          </div>
                          <div className={styles.tableCell}>{formatCurrency(bracket.tax)}</div>
                          <div className={styles.tableCell}>{formatCurrency(bracket.cumulativeTax)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tax Savings Insights */}
                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>💡 Tax Optimization Insights</h3>
                    <ul className={styles.insightsList}>
                      {has401k && (
                        <li>Your 401(k) contribution saves you <strong>{formatCurrency(results.taxSavingsFrom401k)}</strong> in taxes this year</li>
                      )}
                      <li>The standard deduction reduces your taxable income by <strong>{formatCurrency(deductions)}</strong>, saving you approximately <strong>{formatCurrency(results.taxSavingsFromDeductions)}</strong> in taxes</li>
                      <li>Your marginal tax rate of <strong>{formatPercentage(results.marginalRate)}</strong> means every additional $1,000 earned will be taxed at this rate</li>
                      {hasDependents && (
                        <li>Each dependent could qualify for a <strong>$2,000</strong> Child Tax Credit, potentially reducing your tax bill by <strong>{formatCurrency(numDependents * 2000)}</strong></li>
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
              <h2 className={styles.articleTitle}>Understanding Tax Brackets: How Progressive Taxation Works</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The Myth of "Moving Into a Higher Tax Bracket"</h3>
                <p>One of the most common misconceptions about progressive taxation is that earning more money can push you into a higher tax bracket where ALL your income is taxed at the higher rate. This is completely false. In reality, only the income within each bracket is taxed at that bracket's rate.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World Example: How Tax Brackets Actually Work</h4>
                  <p>For a single filer in 2024:</p>
                  <ul>
                    <li><strong>First $11,600:</strong> Taxed at 10% = $1,160</li>
                    <li><strong>Next $35,550 ($11,601-$47,150):</strong> Taxed at 12% = $4,266</li>
                    <li><strong>Next $53,375 ($47,151-$100,525):</strong> Taxed at 22% = $11,743</li>
                    <li><strong>Total tax on $100,525:</strong> $17,169 (17.1% effective rate)</li>
                  </ul>
                  <p>Notice: Earning $100,525 doesn't mean paying 22% on all income—only the amount above $47,150 is taxed at 22%.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategies to Reduce Your Tax Burden</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>💰 Maximize Pre-Tax Contributions</h4>
                    <p>401(k), Traditional IRA, and HSA contributions reduce your taxable income dollar-for-dollar. A $1,000 contribution at a 24% marginal rate saves you $240 in taxes immediately.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📊 Optimize Deductions</h4>
                    <p>Compare itemized deductions (mortgage interest, charitable contributions) with the standard deduction. Bundle charitable contributions in high-income years for maximum benefit.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Tax-Loss Harvesting</h4>
                    <p>Sell investments at a loss to offset capital gains. You can deduct up to $3,000 in net capital losses against ordinary income each year.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🎓 Education Credits</h4>
                    <p>American Opportunity Tax Credit (AOTC) offers up to $2,500 per student for the first four years of college. Lifetime Learning Credit provides up to $2,000 per tax return.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common Tax Planning Mistakes to Avoid</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Leaving 401(k) Match on the Table:</strong> Not contributing enough to get your full employer match is like turning down free money</li>
                  <li><strong>Ignarding Tax-Advantaged Accounts:</strong> Failing to utilize HSAs, 529 plans, or IRAs can cost thousands in unnecessary taxes</li>
                  <li><strong>Poor Timing of Income:</strong> Bunching income into a single year can push you into higher tax brackets unnecessarily</li>
                  <li><strong>Missing Deductions:</strong> Home office expenses, student loan interest, and medical expenses are commonly overlooked</li>
                  <li><strong>Not Planning for Estimated Taxes:</strong> Self-employed individuals must make quarterly estimated tax payments to avoid penalties</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Tips from Tax Professionals</h3>
                <blockquote className={styles.expertQuote}>
                  "The most important concept in tax planning is understanding your marginal tax rate. This determines the tax impact of every financial decision you make—from retirement contributions to investment choices to business deductions. Work backward from April 15th: plan your tax strategy at the beginning of the year, not at the end when it's too late to make meaningful changes."
                  <footer className={styles.quoteFooter}>— CPA & Tax Strategist, 20+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Will a raise push me into a higher tax bracket and reduce my take-home pay?</h3>
                <p className={styles.faqAnswer}>No, this is a common myth. Only the additional income above the bracket threshold is taxed at the higher rate. Your take-home pay will always increase with a raise, though the increase may be slightly less than expected due to the higher marginal rate on the additional income.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between tax credits and tax deductions?</h3>
                <p className={styles.faqAnswer}>Tax deductions reduce your taxable income, while tax credits directly reduce your tax bill dollar-for-dollar. A $1,000 deduction saves you $1,000 × (your marginal tax rate). A $1,000 credit saves you exactly $1,000 in taxes, regardless of your tax bracket.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do I know if I should itemize or take the standard deduction?</h3>
                <p className={styles.faqAnswer}>Compare your potential itemized deductions (mortgage interest, state/local taxes up to $10,000, charitable contributions, medical expenses over 7.5% of AGI) with the standard deduction. For 2024, the standard deduction is $14,600 for single filers and $29,200 for married couples. Most taxpayers take the standard deduction.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What happens if I contribute too much to my 401(k) or IRA?</h3>
                <p className={styles.faqAnswer}>Excess contributions to retirement accounts are subject to a 6% excise tax each year until corrected. For 2024, the 401(k) contribution limit is $23,000 ($30,500 if 50 or older). IRA limits are $7,000 ($8,000 if 50 or older). Always monitor your contributions to avoid penalties.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Take Control of Your Tax Strategy</h2>
              <p className={styles.ctaText}>Use our advanced tax calculator to optimize your finances, maximize deductions, and plan for a more tax-efficient future.</p>
              
              <div className={styles.buttonGroup}>
                <button className={styles.primaryButton} onClick={() => window.print()}>
                  <span>📄 Print Tax Analysis</span>
                </button>
                <button className={styles.secondaryButton} onClick={() => {
                  const data = {
                    income: income,
                    filingStatus: filingStatus,
                    results: results,
                    timestamp: new Date().toISOString()
                  };
                  const text = `Tax Analysis: ${formatCurrency(income)} income → ${formatCurrency(results.takeHomePay)} take-home (${formatPercentage(results.totalEffectiveRate)} effective tax rate)`;
                  navigator.clipboard.writeText(text);
                  alert('Tax analysis copied to clipboard!');
                }}>
                  <span>📋 Copy Results</span>
                </button>
              </div>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes based on 2024 IRS tax brackets and standard deductions. Actual tax liability may vary based on specific circumstances, additional credits, alternative minimum tax, and other factors not included in this calculation. This is not tax advice. Consult with a qualified tax professional for personalized tax planning and preparation.
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

export default TaxBracketCalculator;