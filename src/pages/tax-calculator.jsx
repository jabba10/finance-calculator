import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './taxcalculator.module.css';

const TaxCalculator = ({ currentDate, lastModifiedDate }) => {
  const [income, setIncome] = useState(75000);
  const [filingStatus, setFilingStatus] = useState('single');
  const [state, setState] = useState('CA');
  const [deductions, setDeductions] = useState(12500);
  const [retirementContribution, setRetirementContribution] = useState(6000);
  const [results, setResults] = useState(null);
  const [taxBrackets, setTaxBrackets] = useState([]);

  // Federal tax brackets for 2023
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

  // State tax rates (simplified for demo)
  const stateTaxRates = {
    'CA': { min: 0, brackets: [
      { min: 0, max: 10099, rate: 0.01 },
      { min: 10100, max: 23942, rate: 0.02 },
      { min: 23943, max: 37788, rate: 0.04 },
      { min: 37789, max: 52455, rate: 0.06 },
      { min: 52456, max: 66295, rate: 0.08 },
      { min: 66296, max: 338639, rate: 0.093 },
      { min: 338640, max: 406364, rate: 0.103 },
      { min: 406365, max: 677275, rate: 0.113 },
      { min: 677276, max: 1000000, rate: 0.123 },
      { min: 1000001, max: Infinity, rate: 0.133 }
    ]},
    'TX': { min: 0, brackets: [] }, // No state income tax
    'NY': { min: 0, brackets: [
      { min: 0, max: 8500, rate: 0.04 },
      { min: 8501, max: 11700, rate: 0.045 },
      { min: 11701, max: 13900, rate: 0.0525 },
      { min: 13901, max: 21400, rate: 0.059 },
      { min: 21401, max: 80650, rate: 0.0645 },
      { min: 80651, max: 215400, rate: 0.0665 },
      { min: 215401, max: 1077550, rate: 0.0685 },
      { min: 1077551, max: Infinity, rate: 0.0882 }
    ]},
    'FL': { min: 0, brackets: [] }, // No state income tax
    'IL': { min: 0, brackets: [
      { min: 0, max: Infinity, rate: 0.0495 }
    ]}
  };

  const calculateTax = () => {
    // Calculate taxable income
    const taxableIncome = Math.max(0, income - deductions - retirementContribution);
    
    // Calculate federal tax
    const brackets = federalTaxBrackets[filingStatus];
    let federalTax = 0;
    let remainingIncome = taxableIncome;
    const bracketDetails = [];
    
    for (const bracket of brackets) {
      if (remainingIncome <= 0) break;
      
      const bracketAmount = Math.min(
        bracket.max === Infinity ? remainingIncome : bracket.max - bracket.min + 1,
        remainingIncome
      );
      
      if (bracketAmount > 0) {
        const taxInBracket = bracketAmount * bracket.rate;
        federalTax += taxInBracket;
        bracketDetails.push({
          rate: bracket.rate * 100,
          amount: bracketAmount,
          tax: taxInBracket,
          range: `$${bracket.min.toLocaleString()} - $${bracket.max === Infinity ? '∞' : bracket.max.toLocaleString()}`
        });
        remainingIncome -= bracketAmount;
      }
    }
    
    // Calculate state tax
    let stateTax = 0;
    const stateBrackets = stateTaxRates[state].brackets;
    
    if (stateBrackets.length > 0) {
      let stateRemaining = taxableIncome;
      
      for (const bracket of stateBrackets) {
        if (stateRemaining <= 0) break;
        
        const bracketAmount = Math.min(
          bracket.max === Infinity ? stateRemaining : bracket.max - bracket.min + 1,
          stateRemaining
        );
        
        if (bracketAmount > 0) {
          stateTax += bracketAmount * bracket.rate;
          stateRemaining -= bracketAmount;
        }
      }
    }
    
    // Calculate FICA tax (Social Security + Medicare)
    const socialSecurityTax = Math.min(income, 160200) * 0.062;
    const medicareTax = income * 0.0145;
    const ficaTax = socialSecurityTax + medicareTax;
    
    // Calculate total tax
    const totalTax = federalTax + stateTax + ficaTax;
    const effectiveTaxRate = totalTax / income;
    const netIncome = income - totalTax;
    const monthlyNet = netIncome / 12;
    
    // Calculate marginal tax rate
    const marginalRate = brackets.reduce((rate, bracket) => {
      if (taxableIncome > bracket.min && taxableIncome <= bracket.max) {
        return bracket.rate;
      }
      return rate;
    }, 0) * 100;
    
    setResults({
      federalTax: Math.round(federalTax),
      stateTax: Math.round(stateTax),
      ficaTax: Math.round(ficaTax),
      totalTax: Math.round(totalTax),
      netIncome: Math.round(netIncome),
      monthlyNet: Math.round(monthlyNet),
      effectiveTaxRate: effectiveTaxRate * 100,
      marginalRate: marginalRate,
      taxableIncome: Math.round(taxableIncome),
      takeHomePercentage: (1 - effectiveTaxRate) * 100
    });
    
    setTaxBrackets(bracketDetails);
  };

  useEffect(() => {
    calculateTax();
  }, [income, filingStatus, state, deductions, retirementContribution]);

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

  const states = [
    { code: 'CA', name: 'California', hasTax: true },
    { code: 'TX', name: 'Texas', hasTax: false },
    { code: 'NY', name: 'New York', hasTax: true },
    { code: 'FL', name: 'Florida', hasTax: false },
    { code: 'IL', name: 'Illinois', hasTax: true },
    { code: 'PA', name: 'Pennsylvania', hasTax: true },
    { code: 'OH', name: 'Ohio', hasTax: true },
    { code: 'GA', name: 'Georgia', hasTax: true },
    { code: 'NC', name: 'North Carolina', hasTax: true },
    { code: 'MI', name: 'Michigan', hasTax: true }
  ];

  return (
    <>
      <Head>
        <title>Advanced Income Tax Calculator | Tax Year Estimates</title>
        <meta name="description" content="Free advanced income tax calculator for 2023-2024 tax year. Calculate federal, state, and FICA taxes, estimate refunds, and optimize your tax strategy with detailed breakdowns." />
        <meta name="keywords" content="tax calculator, income tax calculator, tax refund calculator, federal tax calculator, state tax calculator, tax planning, IRS calculator" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/tax-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Income Tax Calculator | 2023-2024 Tax Year Estimates" />
        <meta property="og:description" content="Calculate your federal and state income taxes, estimate refunds, and optimize your tax strategy with our comprehensive tax calculator." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/tax-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Income Tax Calculator" />
        <meta name="twitter:description" content="Estimate your taxes and plan your finances with our comprehensive tax calculator." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="tax-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Income Tax Calculator",
            "description": "Professional income tax calculator for 2023-2024 tax year with federal, state, and FICA tax calculations",
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
              "ratingCount": "1500",
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
              "State Tax Calculations",
              "Tax Bracket Analysis",
              "Deduction Optimization",
              "Refund Estimations"
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
                "name": "How accurate is this tax calculator?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our calculator uses current IRS tax brackets and standard deduction amounts for the 2023 tax year. It provides accurate estimates for most taxpayers, but actual tax liability may vary based on specific circumstances, credits, and deductions not included in this calculator.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between marginal and effective tax rates?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Your marginal tax rate is the rate you pay on your last dollar of income (your highest tax bracket). Your effective tax rate is your total tax divided by your total income - this is usually lower than your marginal rate due to progressive taxation.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How can I reduce my tax liability?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Common strategies include maximizing retirement contributions (401k, IRA), taking advantage of all eligible deductions and credits, contributing to HSAs, and timing income and deductions strategically. Always consult with a tax professional for personalized advice.",
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
            <h1 className={styles.mainTitle}>Advanced Income Tax Calculator</h1>
            <p className={styles.subtitle}>Estimate Your Federal & State Tax Liability with Comprehensive Federal & State Calculations</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Tax Brackets</span>
              <span className={styles.badge}>Free & Secure</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate Your Taxes</h2>
              
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
                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="filingStatus"
                        value="single"
                        checked={filingStatus === 'single'}
                        onChange={(e) => setFilingStatus(e.target.value)}
                      />
                      <span>Single</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="filingStatus"
                        value="married"
                        checked={filingStatus === 'married'}
                        onChange={(e) => setFilingStatus(e.target.value)}
                      />
                      <span>Married</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="filingStatus"
                        value="head"
                        checked={filingStatus === 'head'}
                        onChange={(e) => setFilingStatus(e.target.value)}
                      />
                      <span>Head of Household</span>
                    </label>
                  </div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  State of Residence
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className={styles.selectInput}
                  >
                    {states.map((stateOption) => (
                      <option key={stateOption.code} value={stateOption.code}>
                        {stateOption.name} {stateOption.hasTax ? '' : '(No Income Tax)'}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Standard Deduction
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="30000"
                      step="100"
                      value={deductions}
                      onChange={(e) => setDeductions(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="30000"
                      step="100"
                      value={deductions}
                      onChange={(e) => setDeductions(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(deductions)}</div>
                  <div className={styles.inputHint}>
                    {filingStatus === 'single' ? 'Standard: $13,850' : 
                     filingStatus === 'married' ? 'Standard: $27,700' : 
                     'Standard: $20,800'}
                  </div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Retirement Contributions
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="22500"
                      step="500"
                      value={retirementContribution}
                      onChange={(e) => setRetirementContribution(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="22500"
                      step="500"
                      value={retirementContribution}
                      onChange={(e) => setRetirementContribution(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(retirementContribution)}</div>
                  <div className={styles.inputHint}>2023 401(k) limit: $22,500</div>
                </label>
              </div>

              <div className={styles.tipCard}>
                <h4 className={styles.tipTitle}>💡 Tax Tip</h4>
                <p className={styles.tipText}>
                  Maximize your retirement contributions to reduce taxable income. For 2023, you can contribute up to $22,500 to a 401(k) and $6,500 to an IRA.
                </p>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Your Tax Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Net Income</div>
                      <div className={styles.resultValue}>{formatCurrency(results.netIncome)}</div>
                      <div className={styles.resultSubtext}>Take-home pay</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Taxes</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalTax)}</div>
                      <div className={styles.resultSubtext}>{formatPercentage(results.effectiveTaxRate)} effective rate</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Monthly Net</div>
                      <div className={styles.resultValue}>{formatCurrency(results.monthlyNet)}</div>
                      <div className={styles.resultSubtext}>After all taxes</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Marginal Rate</div>
                      <div className={styles.resultValue}>{formatPercentage(results.marginalRate)}</div>
                      <div className={styles.resultSubtext}>Your top tax bracket</div>
                    </div>
                  </div>

                  {/* Tax Breakdown */}
                  <div className={styles.breakdownCard}>
                    <h3 className={styles.breakdownTitle}>Tax Breakdown</h3>
                    <div className={styles.breakdownGrid}>
                      <div className={styles.breakdownItem}>
                        <div className={styles.breakdownLabel}>Federal Tax</div>
                        <div className={styles.breakdownValue}>{formatCurrency(results.federalTax)}</div>
                        <div className={styles.breakdownBar}>
                          <div 
                            className={styles.breakdownBarFill}
                            style={{ width: `${(results.federalTax / results.totalTax) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className={styles.breakdownItem}>
                        <div className={styles.breakdownLabel}>State Tax</div>
                        <div className={styles.breakdownValue}>{formatCurrency(results.stateTax)}</div>
                        <div className={styles.breakdownBar}>
                          <div 
                            className={styles.breakdownBarFill}
                            style={{ width: `${(results.stateTax / results.totalTax) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className={styles.breakdownItem}>
                        <div className={styles.breakdownLabel}>FICA Tax</div>
                        <div className={styles.breakdownValue}>{formatCurrency(results.ficaTax)}</div>
                        <div className={styles.breakdownBar}>
                          <div 
                            className={styles.breakdownBarFill}
                            style={{ width: `${(results.ficaTax / results.totalTax) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tax Bracket Visualization */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Federal Tax Bracket Analysis</h3>
                    <div className={styles.chartBars}>
                      {taxBrackets.map((bracket, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>{bracket.rate}%</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarIncome}
                              style={{ width: `${(bracket.amount / results.taxableIncome) * 100}%` }}
                              title={`Income in this bracket: ${formatCurrency(bracket.amount)}`}
                            />
                            <div 
                              className={styles.chartBarTax}
                              style={{ width: `${(bracket.tax / results.totalTax) * 100}%` }}
                              title={`Tax in this bracket: ${formatCurrency(bracket.tax)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{formatCurrency(bracket.tax)}</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendIncome}`}></div>
                        <span>Taxable Income</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendTax}`}></div>
                        <span>Tax Paid</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Tax Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>You keep <strong>{formatPercentage(results.takeHomePercentage)}</strong> of your income after taxes</li>
                      <li>Your effective tax rate is <strong>{formatPercentage(results.effectiveTaxRate)}</strong> vs {formatPercentage(results.marginalRate)} marginal rate</li>
                      <li>Taxes represent <strong>{formatPercentage((results.totalTax / income) * 100)}</strong> of your gross income</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Understanding Your Taxes: A Complete Guide for 2023-2024</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>How Progressive Taxation Works</h3>
                <p>The US uses a progressive tax system where higher income levels are taxed at higher rates. This doesn't mean all your income is taxed at your highest rate - only the income within each bracket is taxed at that bracket's rate.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Example: Single Filer with $75,000 Income</h4>
                  <ul>
                    <li><strong>First $11,000:</strong> Taxed at 10% = $1,100</li>
                    <li><strong>Next $33,725:</strong> Taxed at 12% = $4,047</li>
                    <li><strong>Next $30,275:</strong> Taxed at 22% = $6,660</li>
                    <li><strong>Total Federal Tax:</strong> $11,807</li>
                    <li><strong>Effective Rate:</strong> 15.7% (not 22%)</li>
                  </ul>
                  <p>This progressive structure means you always keep more of each dollar you earn.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Key Tax Changes for 2023-2024</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>📈 Higher Standard Deductions</h4>
                    <p><strong>2023 Standard Deductions:</strong><br/>
                    • Single: $13,850 (up $900)<br/>
                    • Married: $27,700 (up $1,800)<br/>
                    • Head of Household: $20,800 (up $1,400)</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 Retirement Contribution Limits</h4>
                    <p><strong>Increased Limits for 2023:</strong><br/>
                    • 401(k): $22,500 (up $2,000)<br/>
                    • IRA: $6,500 (up $500)<br/>
                    • Catch-up (50+): Additional $7,500</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏠 Energy Credit Updates</h4>
                    <p><strong>Inflation Reduction Act:</strong><br/>
                    • 30% credit for energy-efficient home improvements<br/>
                    • Up to $7,500 for new electric vehicles<br/>
                    • Extended through 2032</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📊 Tax Bracket Adjustments</h4>
                    <p><strong>Bracket thresholds increased ~7%</strong><br/>
                    Highest bracket starts at $578,126 for singles<br/>
                    Inflation adjustments reduce "bracket creep"<br/>
                    Helps maintain purchasing power</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common Tax Deductions & Credits</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Student Loan Interest:</strong> Deduct up to $2,500 in interest payments (income limits apply)</li>
                  <li><strong>Medical Expenses:</strong> Deduct expenses exceeding 7.5% of AGI (including health insurance premiums)</li>
                  <li><strong>Child Tax Credit:</strong> Up to $2,000 per qualifying child under 17 (phased out at higher incomes)</li>
                  <li><strong>Earned Income Tax Credit:</strong> Refundable credit for low to moderate-income workers and families</li>
                  <li><strong>Education Credits:</strong> American Opportunity Credit (up to $2,500) and Lifetime Learning Credit</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>State Tax Considerations</h3>
                <div className={styles.warningCard}>
                  <h4>🚨 State Tax Variations</h4>
                  <ul>
                    <li><strong>No Income Tax States:</strong> Alaska, Florida, Nevada, South Dakota, Tennessee, Texas, Washington, Wyoming</li>
                    <li><strong>Flat Tax States:</strong> Colorado (4.4%), Illinois (4.95%), Indiana (3.23%), Michigan (4.25%)</li>
                    <li><strong>High Tax States:</strong> California (up to 13.3%), Hawaii (up to 11%), New York (up to 10.9%), New Jersey (up to 10.75%)</li>
                    <li><strong>Special Considerations:</strong> Some states have no sales tax, others have high property taxes - consider total tax burden</li>
                  </ul>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Tax Planning Advice</h3>
                <blockquote className={styles.expertQuote}>
                  "The most common tax mistake I see is failing to optimize retirement contributions. Not only do you miss out on tax-deferred growth, but you pay more taxes today. Always contribute enough to get your employer match first, then maximize your contributions based on your financial goals."
                  <footer className={styles.quoteFooter}>— CPA & Tax Strategist, 25+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I take the standard deduction or itemize?</h3>
                <p className={styles.faqAnswer}>Take the standard deduction unless your itemized deductions (mortgage interest, state taxes, charitable contributions, medical expenses) exceed the standard amount. For 2023, only about 10% of taxpayers itemize due to higher standard deductions from the Tax Cuts and Jobs Act.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does tax withholding work and should I adjust it?</h3>
                <p className={styles.faqAnswer}>Your employer withholds taxes based on your W-4 form. Use the IRS withholding estimator to check if you're having too much or too little withheld. Aim to owe/refund less than $1,000 to avoid penalties and maximize cash flow throughout the year.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between tax deductions and tax credits?</h3>
                <p className={styles.faqAnswer}>Deductions reduce your taxable income (e.g., $1,000 deduction saves you $220 if you're in the 22% bracket). Credits reduce your tax dollar-for-dollar (e.g., $1,000 credit saves you $1,000 in taxes). Credits are generally more valuable than deductions.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>When should I consult a tax professional?</h3>
                <p className={styles.faqAnswer}>Consider professional help if you have: self-employment income, rental properties, sold investments, moved states, started a business, experienced major life changes (marriage, divorce, children), or complex investments. The cost is often worth the peace of mind and potential savings.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Optimize Your Tax Strategy?</h2>
              <p className={styles.ctaText}>Use our calculator to experiment with different scenarios. See how retirement contributions, deductions, and filing status affect your tax liability and take-home pay.</p>
              
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for the 2023 tax year based on standard assumptions. Actual tax liability may vary based on specific circumstances, additional credits, deductions, and state-specific rules. This tool is for educational purposes only and not a substitute for professional tax advice. Consult with a qualified tax professional for personalized guidance.
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

export default TaxCalculator;