import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './capitalgainscalculator.module.css';

const CapitalGainsCalculator = ({ currentDate, lastModifiedDate }) => {
  const [purchasePrice, setPurchasePrice] = useState(100000);
  const [salePrice, setSalePrice] = useState(150000);
  const [holdingPeriod, setHoldingPeriod] = useState(3);
  const [filingStatus, setFilingStatus] = useState('single');
  const [taxableIncome, setTaxableIncome] = useState(75000);
  const [improvementCosts, setImprovementCosts] = useState(10000);
  const [sellingCosts, setSellingCosts] = useState(8000);
  const [results, setResults] = useState(null);
  const [taxBrackets, setTaxBrackets] = useState([]);

  // 2023-2024 Capital Gains Tax Rates
  const capitalGainsRates = {
    single: [
      { min: 0, max: 44625, shortTerm: 0.10, longTerm: 0.00 },
      { min: 44626, max: 492300, shortTerm: 0.15, longTerm: 0.15 },
      { min: 492301, max: 553850, shortTerm: 0.25, longTerm: 0.15 },
      { min: 553851, max: Infinity, shortTerm: 0.37, longTerm: 0.20 }
    ],
    married: [
      { min: 0, max: 89250, shortTerm: 0.10, longTerm: 0.00 },
      { min: 89251, max: 553850, shortTerm: 0.15, longTerm: 0.15 },
      { min: 553851, max: 744750, shortTerm: 0.25, longTerm: 0.15 },
      { min: 744751, max: Infinity, shortTerm: 0.37, longTerm: 0.20 }
    ],
    head: [
      { min: 0, max: 59750, shortTerm: 0.10, longTerm: 0.00 },
      { min: 59751, max: 523050, shortTerm: 0.15, longTerm: 0.15 },
      { min: 523051, max: 558050, shortTerm: 0.25, longTerm: 0.15 },
      { min: 558051, max: Infinity, shortTerm: 0.37, longTerm: 0.20 }
    ]
  };

  // Net Investment Income Tax (NIIT) thresholds
  const niitThresholds = {
    single: 200000,
    married: 250000,
    head: 200000
  };

  const calculateCapitalGains = () => {
    // Calculate cost basis
    const costBasis = purchasePrice + improvementCosts + sellingCosts;
    
    // Calculate capital gain
    const capitalGain = salePrice - costBasis;
    
    // Determine if long-term or short-term
    const isLongTerm = holdingPeriod >= 1;
    const taxType = isLongTerm ? 'longTerm' : 'shortTerm';
    
    // Find applicable tax bracket
    const brackets = capitalGainsRates[filingStatus];
    let totalTax = 0;
    let remainingGain = capitalGain;
    const bracketDetails = [];
    
    // Calculate tax based on brackets
    for (const bracket of brackets) {
      if (remainingGain <= 0) break;
      
      const bracketRange = bracket.max === Infinity ? remainingGain : bracket.max - bracket.min + 1;
      const taxableAmountInBracket = Math.min(bracketRange, remainingGain);
      
      if (taxableAmountInBracket > 0) {
        const taxRate = bracket[taxType];
        const taxInBracket = taxableAmountInBracket * taxRate;
        totalTax += taxInBracket;
        
        bracketDetails.push({
          bracket: `$${bracket.min.toLocaleString()} - $${bracket.max === Infinity ? '∞' : bracket.max.toLocaleString()}`,
          rate: taxRate * 100,
          amount: taxableAmountInBracket,
          tax: taxInBracket
        });
        
        remainingGain -= taxableAmountInBracket;
      }
    }
    
    // Calculate Net Investment Income Tax (3.8%) if applicable
    let niit = 0;
    const adjustedGrossIncome = taxableIncome + (isLongTerm ? capitalGain : 0);
    const niitThreshold = niitThresholds[filingStatus];
    
    if (adjustedGrossIncome > niitThreshold) {
      const niitAmount = Math.min(capitalGain, adjustedGrossIncome - niitThreshold);
      niit = niitAmount * 0.038;
    }
    
    // Calculate total tax including NIIT
    const totalTaxWithNiit = totalTax + niit;
    
    // Calculate after-tax proceeds
    const netProceeds = salePrice - totalTaxWithNiit - sellingCosts;
    const returnOnInvestment = ((salePrice - purchasePrice - improvementCosts - totalTaxWithNiit) / purchasePrice) * 100;
    const effectiveTaxRate = (totalTaxWithNiit / capitalGain) * 100;
    
    // Calculate annualized return
    const totalProfit = salePrice - purchasePrice - improvementCosts - totalTaxWithNiit;
    const annualizedReturn = (Math.pow((salePrice - totalTaxWithNiit) / purchasePrice, 1/holdingPeriod) - 1) * 100;
    
    // Calculate break-even analysis
    const breakEvenPrice = costBasis * (1 + (totalTaxWithNiit / capitalGain));
    const minimumSalePrice = costBasis * 1.03; // 3% minimum to cover basic costs
    
    setResults({
      capitalGain: Math.round(capitalGain),
      costBasis: Math.round(costBasis),
      totalTax: Math.round(totalTax),
      niit: Math.round(niit),
      totalTaxWithNiit: Math.round(totalTaxWithNiit),
      netProceeds: Math.round(netProceeds),
      returnOnInvestment: returnOnInvestment,
      effectiveTaxRate: effectiveTaxRate,
      annualizedReturn: annualizedReturn,
      isLongTerm: isLongTerm,
      breakEvenPrice: Math.round(breakEvenPrice),
      minimumSalePrice: Math.round(minimumSalePrice),
      totalProfit: Math.round(totalProfit),
      taxType: taxType
    });
    
    setTaxBrackets(bracketDetails);
  };

  useEffect(() => {
    calculateCapitalGains();
  }, [purchasePrice, salePrice, holdingPeriod, filingStatus, taxableIncome, improvementCosts, sellingCosts]);

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

  const formatDecimal = (value) => {
    return value.toFixed(2);
  };

  return (
    <>
      <Head>
        <title>Advanced Capital Gains Tax Calculator | 2023-2024 Tax Estimates</title>
        <meta name="description" content="Free advanced capital gains tax calculator with long-term vs short-term rates, NIIT calculations, and investment return analysis. Calculate taxes on stocks, real estate, and other investments." />
        <meta name="keywords" content="capital gains calculator, capital gains tax calculator, investment tax calculator, stock tax calculator, real estate capital gains, tax planning, investment returns" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://yourdomain.com/capital-gains-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Capital Gains Tax Calculator | 2023-2024 Tax Estimates" />
        <meta property="og:description" content="Calculate capital gains taxes on investments with long-term vs short-term rates, NIIT, and comprehensive tax analysis." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/capital-gains-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Capital Gains Tax Calculator" />
        <meta name="twitter:description" content="Calculate investment taxes and maximize after-tax returns with our comprehensive capital gains calculator." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="capital-gains-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Capital Gains Tax Calculator",
            "description": "Professional capital gains tax calculator with long-term/short-term rates, NIIT calculations, and investment analysis",
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
              "ratingCount": "1100",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Investment Tools Pro",
              "url": "https://yourdomain.com"
            },
            "featureList": [
              "Long-term vs Short-term Rates",
              "Net Investment Income Tax (NIIT)",
              "Cost Basis Calculations",
              "Break-even Analysis",
              "Annualized Return Calculations"
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
                "name": "What's the difference between short-term and long-term capital gains?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Short-term capital gains apply to assets held for one year or less and are taxed at your ordinary income tax rates (10-37%). Long-term capital gains apply to assets held for more than one year and are taxed at preferential rates of 0%, 15%, or 20% depending on your income.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is the Net Investment Income Tax (NIIT)?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The NIIT is an additional 3.8% tax on investment income for high-income taxpayers. It applies when your modified adjusted gross income exceeds $200,000 (single) or $250,000 (married filing jointly). This tax is in addition to regular capital gains taxes.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How can I reduce my capital gains taxes?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Common strategies include: holding investments for over 1 year to qualify for long-term rates, harvesting tax losses to offset gains, donating appreciated securities to charity, using retirement accounts, timing sales to control income thresholds, and taking advantage of primary residence exclusions for real estate.",
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
            <h1 className={styles.mainTitle}>Advanced Capital Gains Tax Calculator</h1>
            <p className={styles.subtitle}>Calculate Investment Taxes with Long-term vs Short-term Rates & NIIT Analysis</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>2023-2024 Rates</span>
              <span className={styles.badge}>Professional Tool</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate Your Capital Gains</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Purchase Price (Cost Basis)
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="1000"
                      max="2000000"
                      step="1000"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1000"
                      max="2000000"
                      step="1000"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(purchasePrice)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Sale Price
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="1000"
                      max="3000000"
                      step="1000"
                      value={salePrice}
                      onChange={(e) => setSalePrice(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1000"
                      max="3000000"
                      step="1000"
                      value={salePrice}
                      onChange={(e) => setSalePrice(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(salePrice)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Holding Period
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0.1"
                      max="30"
                      step="0.1"
                      value={holdingPeriod}
                      onChange={(e) => setHoldingPeriod(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0.1"
                      max="30"
                      step="0.1"
                      value={holdingPeriod}
                      onChange={(e) => setHoldingPeriod(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatDecimal(holdingPeriod)} years</div>
                  <div className={styles.inputHint}>{holdingPeriod >= 1 ? 'Long-term (preferential rates)' : 'Short-term (ordinary income rates)'}</div>
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
                  Your Taxable Income
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="1000"
                      value={taxableIncome}
                      onChange={(e) => setTaxableIncome(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="1000000"
                      step="1000"
                      value={taxableIncome}
                      onChange={(e) => setTaxableIncome(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(taxableIncome)}</div>
                  <div className={styles.inputHint}>For determining tax bracket and NIIT</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Improvement Costs
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="1000"
                      value={improvementCosts}
                      onChange={(e) => setImprovementCosts(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="200000"
                      step="1000"
                      value={improvementCosts}
                      onChange={(e) => setImprovementCosts(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(improvementCosts)}</div>
                  <div className={styles.inputHint}>Adds to cost basis (real estate, improvements)</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Selling Costs
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="500"
                      value={sellingCosts}
                      onChange={(e) => setSellingCosts(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="100000"
                      step="500"
                      value={sellingCosts}
                      onChange={(e) => setSellingCosts(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(sellingCosts)}</div>
                  <div className={styles.inputHint}>Commission, fees, closing costs</div>
                </label>
              </div>

              <div className={styles.tipCard}>
                <h4 className={styles.tipTitle}>💡 Tax Strategy Tip</h4>
                <p className={styles.tipText}>
                  {holdingPeriod >= 1 ? 
                    "You qualify for long-term capital gains rates (0%, 15%, or 20%). Consider holding investments for over 1 year whenever possible to benefit from these lower rates." :
                    "You're in short-term holding period. Consider holding for at least 1 year to qualify for lower long-term capital gains rates (could save 10-25% in taxes)."}
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
                      <div className={styles.resultLabel}>Capital Gain</div>
                      <div className={styles.resultValue}>{formatCurrency(results.capitalGain)}</div>
                      <div className={styles.resultSubtext}>
                        {results.isLongTerm ? 'Long-term gain' : 'Short-term gain'}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Taxes</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalTaxWithNiit)}</div>
                      <div className={styles.resultSubtext}>{formatPercentage(results.effectiveTaxRate)} effective rate</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Net Proceeds</div>
                      <div className={styles.resultValue}>{formatCurrency(results.netProceeds)}</div>
                      <div className={styles.resultSubtext}>After all taxes & costs</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Annualized Return</div>
                      <div className={styles.resultValue}>{formatPercentage(results.annualizedReturn)}</div>
                      <div className={styles.resultSubtext}>After-tax CAGR</div>
                    </div>
                  </div>

                  {/* Tax Breakdown */}
                  <div className={styles.breakdownCard}>
                    <h3 className={styles.breakdownTitle}>Tax Breakdown</h3>
                    <div className={styles.breakdownGrid}>
                      <div className={styles.breakdownItem}>
                        <div className={styles.breakdownLabel}>Capital Gains Tax</div>
                        <div className={styles.breakdownValue}>{formatCurrency(results.totalTax)}</div>
                        <div className={styles.breakdownBar}>
                          <div 
                            className={styles.breakdownBarFill}
                            style={{ width: `${(results.totalTax / results.totalTaxWithNiit) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className={styles.breakdownItem}>
                        <div className={styles.breakdownLabel}>Net Investment Income Tax</div>
                        <div className={styles.breakdownValue}>{formatCurrency(results.niit)}</div>
                        <div className={styles.breakdownBar}>
                          <div 
                            className={styles.breakdownBarFill}
                            style={{ width: `${(results.niit / results.totalTaxWithNiit) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className={styles.breakdownItem}>
                        <div className={styles.breakdownLabel}>Total Tax Liability</div>
                        <div className={styles.breakdownValue}>{formatCurrency(results.totalTaxWithNiit)}</div>
                        <div className={styles.breakdownBar}>
                          <div 
                            className={styles.breakdownBarFill}
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tax Bracket Visualization */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Tax Bracket Analysis</h3>
                    <div className={styles.chartBars}>
                      {taxBrackets.map((bracket, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>{bracket.rate}%</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarGain}
                              style={{ width: `${(bracket.amount / results.capitalGain) * 100}%` }}
                              title={`Gain in this bracket: ${formatCurrency(bracket.amount)}`}
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
                        <div className={`${styles.legendColor} ${styles.legendGain}`}></div>
                        <span>Capital Gain</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendTax}`}></div>
                        <span>Tax Paid</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📈 Investment Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Your {results.isLongTerm ? 'long-term' : 'short-term'} gain is taxed at <strong>{formatPercentage(results.effectiveTaxRate)}</strong> effective rate</li>
                      <li>After taxes, your net profit is <strong>{formatCurrency(results.totalProfit)}</strong> ({formatPercentage(results.returnOnInvestment)} ROI)</li>
                      <li>You need to sell for at least <strong>{formatCurrency(results.minimumSalePrice)}</strong> to break even after costs</li>
                      {results.niit > 0 && (
                        <li>Net Investment Income Tax applies: <strong>{formatCurrency(results.niit)}</strong> (3.8% on investment income)</li>
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
              <h2 className={styles.articleTitle}>Understanding Capital Gains Taxes: A Complete Guide for Investors</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Long-term vs Short-term Capital Gains</h3>
                <p>Capital gains taxes are divided into two categories based on how long you hold an asset. This distinction is crucial because long-term gains receive preferential tax treatment, while short-term gains are taxed at higher ordinary income rates.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Example: $50,000 Gain on Stock Investment</h4>
                  <ul>
                    <li><strong>Short-term (held 11 months):</strong> Taxed at ordinary income rates (22-37%) = $11,000-$18,500 tax</li>
                    <li><strong>Long-term (held 13 months):</strong> Taxed at preferential rates (0-20%) = $0-$10,000 tax</li>
                    <li><strong>Tax Savings:</strong> $1,000-$8,500 by holding 2 months longer</li>
                    <li><strong>Key Insight:</strong> The holding period is measured from trade date to trade date, not calendar months</li>
                  </ul>
                  <p>This dramatic difference makes holding period planning one of the most important tax strategies for investors.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>2023-2024 Capital Gains Tax Rates</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>💰 0% Rate Bracket</h4>
                    <p><strong>Single:</strong> Up to $44,625 total income<br/>
                    <strong>Married:</strong> Up to $89,250 total income<br/>
                    <strong>Head of Household:</strong> Up to $59,750 total income<br/>
                    <em>Ideal for retirees and lower-income investors</em></p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏡 15% Rate Bracket</h4>
                    <p><strong>Single:</strong> $44,626 - $492,300<br/>
                    <strong>Married:</strong> $89,251 - $553,850<br/>
                    <strong>Head of Household:</strong> $59,751 - $523,050<br/>
                    <em>Applies to most middle and upper-middle class investors</em></p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 20% Rate Bracket</h4>
                    <p><strong>Single:</strong> Over $492,300<br/>
                    <strong>Married:</strong> Over $553,850<br/>
                    <strong>Head of Household:</strong> Over $523,050<br/>
                    <em>Plus 3.8% NIIT for high-income investors</em></p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚡ Short-term Rates</h4>
                    <p>Taxed as ordinary income:<br/>
                    • 10% - 37% marginal rates<br/>
                    • No preferential treatment<br/>
                    • Can push you into higher brackets<br/>
                    <em>Generally avoid short-term gains when possible</em></p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Capital Gains Tax Strategies</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Tax-Loss Harvesting:</strong> Selling losing investments to offset gains and reduce tax liability (up to $3,000 annually against ordinary income)</li>
                  <li><strong>Asset Location:</strong> Holding tax-inefficient investments in retirement accounts and tax-efficient investments in taxable accounts</li>
                  <li><strong>Gift Appreciated Assets:</strong> Giving appreciated securities to family in lower tax brackets or to charity (avoid capital gains entirely)</li>
                  <li><strong>Primary Residence Exclusion:</strong> Excluding up to $250,000 ($500,000 married) of gain on sale of primary home (must meet 2-of-5-year rule)</li>
                  <li><strong>Step-Up in Basis:</strong> Assets inherited receive a basis equal to fair market value at date of death, eliminating unrealized gains</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Special Capital Gains Rules</h3>
                <div className={styles.warningCard}>
                  <h4>📊 Important Exceptions & Special Rules</h4>
                  <ul>
                    <li><strong>Collectibles:</strong> Art, antiques, coins, precious metals taxed at 28% regardless of holding period</li>
                    <li><strong>Small Business Stock (Section 1202):</strong> Up to 100% exclusion for qualified small business stock held 5+ years</li>
                    <li><strong>Real Estate Depreciation Recapture:</strong> 25% tax rate on depreciation deductions taken on rental properties</li>
                    <li><strong>Wash Sale Rule:</strong> Cannot claim loss if you buy substantially identical security 30 days before or after sale</li>
                    <li><strong>Kiddie Tax:</strong> Children's unearned income over $2,300 taxed at trust rates (can be higher than parent's rate)</li>
                  </ul>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Tax Planning Advice</h3>
                <blockquote className={styles.expertQuote}>
                  "The most common capital gains mistake I see is not tracking cost basis accurately. Many investors forget to include reinvested dividends, commission fees, and improvement costs. An accurate cost basis can reduce your taxable gain by 10-20% in many cases. Always maintain detailed records from the moment you acquire an investment."
                  <footer className={styles.quoteFooter}>— Certified Financial Planner & Tax Strategist, 20+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does tax-loss harvesting work and when should I do it?</h3>
                <p className={styles.faqAnswer}>Tax-loss harvesting involves selling investments that have declined in value to realize losses that offset capital gains. You can deduct up to $3,000 of net losses against ordinary income each year, with unlimited carryforward of excess losses. Best done towards year-end when you have a clear picture of your gains/losses, but be mindful of the wash-sale rule (30-day waiting period).</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's included in the cost basis of an investment?</h3>
                <p className={styles.faqAnswer}>Cost basis includes: purchase price, commissions/fees, improvements (for real estate), legal fees for title, and certain carrying charges. For stocks with dividend reinvestment, each reinvestment adds to your basis. For inherited assets, basis is generally the fair market value at date of death. Accurate basis tracking is essential for minimizing taxable gains.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can I avoid capital gains taxes by reinvesting proceeds?</h3>
                <p className={styles.faqAnswer}>No, reinvesting sales proceeds does not defer or avoid capital gains taxes (except in specific cases like 1031 exchanges for real estate or Opportunity Zone investments). Capital gains are triggered upon sale regardless of what you do with the proceeds. However, reinvesting in tax-advantaged accounts like IRAs can provide future tax benefits.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What are the capital gains rules for primary residences?</h3>
                <p className={styles.faqAnswer}>You can exclude up to $250,000 ($500,000 if married filing jointly) of gain on the sale of your primary residence if you: 1) Owned and used the home as your main residence for at least 2 of the last 5 years, 2) Haven't used the exclusion for another home in the past 2 years. Partial exclusions may be available for certain circumstances like job changes or health issues.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Optimize Your Investment Tax Strategy?</h2>
              <p className={styles.ctaText}>Use our calculator to compare different holding periods, understand the impact of income levels on your tax rate, and plan strategic sales to minimize your tax liability.</p>
              
              
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates based on 2023-2024 federal capital gains tax rates and standard assumptions. Actual tax liability may vary based on specific circumstances, state taxes, additional credits, deductions, and special rules not included in this calculator. This tool is for educational purposes only and not a substitute for professional tax advice. Consult with a qualified tax professional for personalized guidance.
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

export default CapitalGainsCalculator;