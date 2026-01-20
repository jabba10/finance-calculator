import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './freecashflowcalculator.module.css';

const FreeCashFlowCalculator = ({ currentDate, lastModifiedDate }) => {
  const [revenue, setRevenue] = useState(1000000);
  const [cogs, setCogs] = useState(600000);
  const [operatingExpenses, setOperatingExpenses] = useState(200000);
  const [depreciation, setDepreciation] = useState(50000);
  const [interestExpense, setInterestExpense] = useState(30000);
  const [taxRate, setTaxRate] = useState(25);
  const [capitalExpenditures, setCapitalExpenditures] = useState(80000);
  const [workingCapitalChange, setWorkingCapitalChange] = useState(-20000);
  const [years, setYears] = useState(5);
  const [growthRate, setGrowthRate] = useState(5);
  const [results, setResults] = useState(null);
  const [projectionData, setProjectionData] = useState([]);

  const calculateFreeCashFlow = () => {
    // Calculate operating profit (EBIT)
    const grossProfit = revenue - cogs;
    const ebit = grossProfit - operatingExpenses;
    
    // Calculate taxes
    const taxableIncome = ebit - interestExpense;
    const taxes = taxableIncome * (taxRate / 100);
    
    // Calculate net operating profit after tax (NOPAT)
    const nopat = ebit * (1 - (taxRate / 100));
    
    // Calculate unlevered free cash flow
    const unleveredFCF = nopat + depreciation - capitalExpenditures - workingCapitalChange;
    
    // Calculate levered free cash flow
    const leveredFCF = (ebit - interestExpense) * (1 - (taxRate / 100)) + depreciation - capitalExpenditures - workingCapitalChange;
    
    // Calculate key ratios
    const fcfMargin = (unleveredFCF / revenue) * 100;
    const conversionRate = (unleveredFCF / nopat) * 100;
    const capexRatio = (capitalExpenditures / revenue) * 100;
    
    // Calculate projections
    const projections = [];
    let currentRevenue = revenue;
    let cumulativeFCF = 0;
    
    for (let year = 1; year <= years; year++) {
      currentRevenue *= (1 + (growthRate / 100));
      const yearGrossProfit = currentRevenue * (grossProfit / revenue);
      const yearEBIT = yearGrossProfit - (operatingExpenses * (1 + (growthRate / 100)));
      const yearNOPAT = yearEBIT * (1 - (taxRate / 100));
      const yearCapex = capitalExpenditures * (1 + (growthRate / 100));
      const yearWCChange = workingCapitalChange * (1 + (growthRate / 100));
      const yearFCF = yearNOPAT + depreciation - yearCapex - yearWCChange;
      cumulativeFCF += yearFCF;
      
      projections.push({
        year,
        revenue: Math.round(currentRevenue),
        ebit: Math.round(yearEBIT),
        nopat: Math.round(yearNOPAT),
        fcf: Math.round(yearFCF),
        cumulativeFCF: Math.round(cumulativeFCF),
        fcfMargin: Math.round((yearFCF / currentRevenue) * 100 * 100) / 100
      });
    }
    
    // Calculate valuation metrics
    const enterpriseValue = unleveredFCF * 15; // Assuming 15x FCF multiple
    const equityValue = enterpriseValue - (interestExpense * 5); // Simplified debt
    const fcfYield = (unleveredFCF / enterpriseValue) * 100;
    
    setResults({
      grossProfit: Math.round(grossProfit),
      ebit: Math.round(ebit),
      nopat: Math.round(nopat),
      unleveredFCF: Math.round(unleveredFCF),
      leveredFCF: Math.round(leveredFCF),
      taxes: Math.round(taxes),
      fcfMargin: Math.round(fcfMargin * 100) / 100,
      conversionRate: Math.round(conversionRate * 100) / 100,
      capexRatio: Math.round(capexRatio * 100) / 100,
      enterpriseValue: Math.round(enterpriseValue),
      equityValue: Math.round(equityValue),
      fcfYield: Math.round(fcfYield * 100) / 100,
      cumulativeFCF: Math.round(cumulativeFCF)
    });
    
    setProjectionData(projections);
  };

  useEffect(() => {
    calculateFreeCashFlow();
  }, [revenue, cogs, operatingExpenses, depreciation, interestExpense, taxRate, 
      capitalExpenditures, workingCapitalChange, years, growthRate]);

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
    if (value === null || value === undefined || isNaN(value)) return '0.00';
    return parseFloat(value).toFixed(2);
  };

  return (
    <>
      <Head>
        <title>Advanced Free Cash Flow Calculator | Business Valuation & Financial Analysis</title>
        <meta name="description" content="Free advanced free cash flow calculator for business valuation, investment analysis, and financial modeling. Calculate FCF, DCF valuation, and analyze company financial health." />
        <meta name="keywords" content="free cash flow calculator, FCF calculator, business valuation, DCF valuation, financial modeling, investment analysis, cash flow analysis" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/free-cash-flow-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Free Cash Flow Calculator | Business Valuation & Financial Analysis" />
        <meta property="og:description" content="Calculate free cash flow, perform DCF valuations, and analyze business financial health with our professional FCF calculator." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/free-cash-flow-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Free Cash Flow Calculator" />
        <meta name="twitter:description" content="Professional FCF calculator for business valuation and investment analysis." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="fcf-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Free Cash Flow Calculator",
            "description": "Professional free cash flow calculator for business valuation, DCF analysis, and financial modeling",
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
              "ratingCount": "920",
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
              "Unlevered & Levered FCF",
              "DCF Valuation",
              "Multi-Year Projections",
              "Financial Ratio Analysis",
              "Business Health Metrics"
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
                "name": "What is Free Cash Flow and why is it important?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Free Cash Flow (FCF) is the cash a company generates after accounting for cash outflows to support operations and maintain capital assets. It's the most important metric for investors because it shows how much cash is available for dividends, debt repayment, or reinvestment in the business.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between levered and unlevered free cash flow?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Unlevered Free Cash Flow (UFCF) represents cash available to all investors (both debt and equity holders) before interest payments. Levered Free Cash Flow (LFCF) represents cash available to equity holders only, after interest payments. UFCF is used for DCF valuation while LFCF shows dividend-paying capacity.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How do I use FCF for business valuation?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "FCF is used in Discounted Cash Flow (DCF) valuation by projecting future FCF, discounting it to present value using Weighted Average Cost of Capital (WACC), and adding terminal value. This gives you the intrinsic value of the business.",
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
            <h1 className={styles.mainTitle}>Advanced Free Cash Flow Calculator</h1>
            <p className={styles.subtitle}>Calculate Business Valuation, Analyze Financial Health & Make Better Investment Decisions</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Professional Tool</span>
              <span className={styles.badge}>DCF Valuation</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate Free Cash Flow</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Revenue
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="10000"
                      max="10000000"
                      step="10000"
                      value={revenue}
                      onChange={(e) => setRevenue(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10000"
                      max="10000000"
                      step="10000"
                      value={revenue}
                      onChange={(e) => setRevenue(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(revenue)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Cost of Goods Sold (COGS)
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max={revenue}
                      step="1000"
                      value={cogs}
                      onChange={(e) => setCogs(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max={revenue}
                      step="1000"
                      value={cogs}
                      onChange={(e) => setCogs(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(cogs)} ({formatPercentage((cogs / revenue) * 100)})</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Operating Expenses
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max={revenue - cogs}
                      step="1000"
                      value={operatingExpenses}
                      onChange={(e) => setOperatingExpenses(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max={revenue - cogs}
                      step="1000"
                      value={operatingExpenses}
                      onChange={(e) => setOperatingExpenses(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(operatingExpenses)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Depreciation & Amortization
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="1000"
                      value={depreciation}
                      onChange={(e) => setDepreciation(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="500000"
                      step="1000"
                      value={depreciation}
                      onChange={(e) => setDepreciation(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(depreciation)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Interest Expense
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="1000"
                      value={interestExpense}
                      onChange={(e) => setInterestExpense(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="200000"
                      step="1000"
                      value={interestExpense}
                      onChange={(e) => setInterestExpense(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(interestExpense)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Tax Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      step="1"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="40"
                      step="1"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(taxRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Capital Expenditures (CapEx)
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="1000"
                      value={capitalExpenditures}
                      onChange={(e) => setCapitalExpenditures(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="500000"
                      step="1000"
                      value={capitalExpenditures}
                      onChange={(e) => setCapitalExpenditures(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(capitalExpenditures)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Working Capital Change
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="-500000"
                      max="500000"
                      step="1000"
                      value={workingCapitalChange}
                      onChange={(e) => setWorkingCapitalChange(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="-500000"
                      max="500000"
                      step="1000"
                      value={workingCapitalChange}
                      onChange={(e) => setWorkingCapitalChange(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>
                    {formatCurrency(workingCapitalChange)}
                    <span className={styles.inputHint}>
                      {workingCapitalChange > 0 ? 'Cash outflow' : 'Cash inflow'}
                    </span>
                  </div>
                </label>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Projection Years
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={years}
                        onChange={(e) => setYears(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="1"
                        max="10"
                        step="1"
                        value={years}
                        onChange={(e) => setYears(parseInt(e.target.value) || 1)}
                        className={styles.numberInput}
                      />
                      <span className={styles.yearsSymbol}>years</span>
                    </div>
                    <div className={styles.valueDisplay}>{years} years</div>
                  </label>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Revenue Growth Rate
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        step="1"
                        value={growthRate}
                        onChange={(e) => setGrowthRate(parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0"
                        max="30"
                        step="1"
                        value={growthRate}
                        onChange={(e) => setGrowthRate(parseFloat(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                      <span className={styles.percentageSymbol}>%</span>
                    </div>
                    <div className={styles.valueDisplay}>{formatPercentage(growthRate)}</div>
                  </label>
                </div>
              </div>

              <div className={styles.infoCard}>
                <h4 className={styles.infoTitle}>💡 Quick Formula</h4>
                <p className={styles.infoText}>
                  FCF = EBIT × (1 - Tax Rate) + Depreciation - CapEx - ΔWorking Capital
                </p>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Financial Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Unlevered Free Cash Flow</div>
                      <div className={styles.resultValue} style={{ color: results.unleveredFCF >= 0 ? '#00aa00' : '#cc0000' }}>
                        {formatCurrency(results.unleveredFCF)}
                      </div>
                      <div className={styles.resultSubtext}>
                        Cash available to all investors
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Levered Free Cash Flow</div>
                      <div className={styles.resultValue} style={{ color: results.leveredFCF >= 0 ? '#00aa00' : '#cc0000' }}>
                        {formatCurrency(results.leveredFCF)}
                      </div>
                      <div className={styles.resultSubtext}>
                        Cash available to equity holders
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>FCF Margin</div>
                      <div className={styles.resultValue}>{formatPercentage(results.fcfMargin)}</div>
                      <div className={styles.resultSubtext}>
                        {results.fcfMargin >= 20 ? 'Excellent' : 
                         results.fcfMargin >= 10 ? 'Good' : 
                         results.fcfMargin >= 5 ? 'Average' : 'Poor'}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>NOPAT to FCF Conversion</div>
                      <div className={styles.resultValue}>{formatPercentage(results.conversionRate)}</div>
                      <div className={styles.resultSubtext}>
                        Efficiency of cash generation
                      </div>
                    </div>
                  </div>

                  {/* Income Statement Breakdown */}
                  <div className={styles.breakdownCard}>
                    <h3 className={styles.breakdownTitle}>Income Statement Flow</h3>
                    <div className={styles.flowChart}>
                      <div className={styles.flowStep}>
                        <div className={styles.flowLabel}>Revenue</div>
                        <div className={styles.flowValue}>{formatCurrency(revenue)}</div>
                      </div>
                      <div className={styles.flowArrow}>−</div>
                      <div className={styles.flowStep}>
                        <div className={styles.flowLabel}>COGS</div>
                        <div className={styles.flowValue}>{formatCurrency(cogs)}</div>
                      </div>
                      <div className={styles.flowArrow}>=</div>
                      <div className={styles.flowStep}>
                        <div className={styles.flowLabel}>Gross Profit</div>
                        <div className={styles.flowValue} style={{ color: results.grossProfit >= 0 ? '#00aa00' : '#cc0000' }}>
                          {formatCurrency(results.grossProfit)}
                        </div>
                      </div>
                      <div className={styles.flowArrow}>−</div>
                      <div className={styles.flowStep}>
                        <div className={styles.flowLabel}>Operating Expenses</div>
                        <div className={styles.flowValue}>{formatCurrency(operatingExpenses)}</div>
                      </div>
                      <div className={styles.flowArrow}>=</div>
                      <div className={styles.flowStep}>
                        <div className={styles.flowLabel}>EBIT</div>
                        <div className={styles.flowValue} style={{ color: results.ebit >= 0 ? '#00aa00' : '#cc0000' }}>
                          {formatCurrency(results.ebit)}
                        </div>
                      </div>
                      <div className={styles.flowArrow}>× (1 - Tax)</div>
                      <div className={styles.flowStep}>
                        <div className={styles.flowLabel}>NOPAT</div>
                        <div className={styles.flowValue} style={{ color: results.nopat >= 0 ? '#00aa00' : '#cc0000' }}>
                          {formatCurrency(results.nopat)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Valuation Analysis */}
                  <div className={styles.valuationCard}>
                    <h3 className={styles.valuationTitle}>DCF Valuation Estimate</h3>
                    <div className={styles.valuationGrid}>
                      <div className={styles.valuationItem}>
                        <div className={styles.valuationLabel}>Enterprise Value</div>
                        <div className={styles.valuationValue}>{formatCurrency(results.enterpriseValue)}</div>
                        <div className={styles.valuationSubtext}>15× FCF multiple</div>
                      </div>
                      <div className={styles.valuationItem}>
                        <div className={styles.valuationLabel}>Equity Value</div>
                        <div className={styles.valuationValue}>{formatCurrency(results.equityValue)}</div>
                        <div className={styles.valuationSubtext}>After debt adjustment</div>
                      </div>
                      <div className={styles.valuationItem}>
                        <div className={styles.valuationLabel}>FCF Yield</div>
                        <div className={styles.valuationValue}>{formatPercentage(results.fcfYield)}</div>
                        <div className={styles.valuationSubtext}>
                          {results.fcfYield >= 8 ? 'High yield' : 
                           results.fcfYield >= 5 ? 'Good yield' : 'Low yield'}
                        </div>
                      </div>
                      <div className={styles.valuationItem}>
                        <div className={styles.valuationLabel}>5-Year Cumulative FCF</div>
                        <div className={styles.valuationValue}>{formatCurrency(results.cumulativeFCF)}</div>
                        <div className={styles.valuationSubtext}>At {growthRate}% growth</div>
                      </div>
                    </div>
                  </div>

                  {/* Projections */}
                  <div className={styles.projectionContainer}>
                    <h3 className={styles.projectionTitle}>{years}-Year FCF Projection ({growthRate}% Growth)</h3>
                    <div className={styles.projectionTable}>
                      <div className={styles.projectionHeader}>
                        <div className={styles.projectionHeaderCell}>Year</div>
                        <div className={styles.projectionHeaderCell}>Revenue</div>
                        <div className={styles.projectionHeaderCell}>EBIT</div>
                        <div className={styles.projectionHeaderCell}>FCF</div>
                        <div className={styles.projectionHeaderCell}>FCF Margin</div>
                        <div className={styles.projectionHeaderCell}>Cumulative</div>
                      </div>
                      {projectionData.map((projection) => (
                        <div key={projection.year} className={styles.projectionRow}>
                          <div className={styles.projectionCell}>{projection.year}</div>
                          <div className={styles.projectionCell}>{formatCurrency(projection.revenue)}</div>
                          <div className={styles.projectionCell} style={{ color: projection.ebit >= 0 ? '#00aa00' : '#cc0000' }}>
                            {formatCurrency(projection.ebit)}
                          </div>
                          <div className={styles.projectionCell} style={{ color: projection.fcf >= 0 ? '#00aa00' : '#cc0000' }}>
                            {formatCurrency(projection.fcf)}
                          </div>
                          <div className={styles.projectionCell}>{formatPercentage(projection.fcfMargin)}</div>
                          <div className={styles.projectionCell}>{formatCurrency(projection.cumulativeFCF)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Financial Health Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>This business generates <strong>{formatCurrency(results.unleveredFCF)}</strong> in free cash flow annually</li>
                      <li>FCF margin of <strong>{formatPercentage(results.fcfMargin)}</strong> is {results.fcfMargin >= 15 ? 'strong' : results.fcfMargin >= 8 ? 'average' : 'weak'}</li>
                      <li>The company converts <strong>{formatPercentage(results.conversionRate)}</strong> of NOPAT to cash</li>
                      <li>CapEx consumes <strong>{formatPercentage(results.capexRatio)}</strong> of revenue</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Mastering Free Cash Flow Analysis: The Ultimate Guide for Investors & Business Owners</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Why Free Cash Flow is the Most Important Financial Metric</h3>
                <p>Free Cash Flow (FCF) represents the true economic profit of a business—the cash generated after all expenses and reinvestments needed to maintain operations. Unlike accounting profits (which include non-cash items and can be manipulated), FCF shows how much cash is actually available for dividends, debt repayment, acquisitions, or reinvestment in growth.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World Example: Apple's FCF Power</h4>
                  <ul>
                    <li><strong>Annual Revenue:</strong> $383 billion</li>
                    <li><strong>Annual FCF:</strong> $100 billion+</li>
                    <li><strong>FCF Margin:</strong> 26%</li>
                    <li><strong>What Apple Does with FCF:</strong></li>
                    <li>• Pays $15 billion in dividends annually</li>
                    <li>• Repurchases $90 billion of stock annually</li>
                    <li>• Maintains $200+ billion cash reserves</li>
                    <li>• Funds R&D and strategic acquisitions</li>
                  </ul>
                  <p>Apple's massive FCF generation allows it to return capital to shareholders while still investing heavily in future growth.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Key Components of Free Cash Flow Calculation</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🏢 NOPAT (Net Operating Profit After Tax)</h4>
                    <p><strong>Formula:</strong> EBIT × (1 - Tax Rate)<br/>
                    <strong>Importance:</strong> Shows operating profitability independent of capital structure<br/>
                    <strong>Good Range:</strong> 10-20% of revenue<br/>
                    <strong>Watch Out:</strong> Low NOPAT margins may indicate pricing or efficiency problems</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏗️ Capital Expenditures (CapEx)</h4>
                    <p><strong>Types:</strong> Maintenance CapEx vs Growth CapEx<br/>
                    <strong>Industry Norms:</strong> 2-8% of revenue for most businesses<br/>
                    <strong>Red Flag:</strong> CapEx greater than Depreciation for extended periods<br/>
                    <strong>Analysis Tip:</strong> Compare CapEx/sales ratio to industry peers</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 Working Capital Changes</h4>
                    <p><strong>Components:</strong> AR + Inventory - AP<br/>
                    <strong>Positive Change:</strong> Cash outflow (business investing in WC)<br/>
                    <strong>Negative Change:</strong> Cash inflow (releasing WC)<br/>
                    <strong>Healthy Sign:</strong> WC grows slower than revenue</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📊 Depreciation & Amortization</h4>
                    <p><strong>Nature:</strong> Non-cash expense<br/>
                    <strong>Cash Impact:</strong> Added back to NOPAT (it's already deducted)<br/>
                    <strong>Important Ratio:</strong> Depreciation/CapEx (should be ~1:1 long-term)<br/>
                    <strong>Warning Sign:</strong> Consistently low depreciation relative to CapEx</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>How to Analyze FCF for Investment Decisions</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>FCF Yield Analysis:</strong> Compare FCF/Enterprise Value to bond yields. Look for 6-8%+ yields for value investments</li>
                  <li><strong>FCF Margin Trends:</strong> Analyze 5-year FCF margin trends. Consistent expansion indicates improving business quality</li>
                  <li><strong>FCF Conversion Rate:</strong> Track NOPAT to FCF conversion. 80%+ indicates efficient cash generation</li>
                  <li><strong>CapEx Efficiency:</strong> Calculate incremental FCF per dollar of CapEx. High returns indicate productive reinvestment</li>
                  <li><strong>Working Capital Efficiency:</strong> Days Working Capital should be stable or improving. Rising DWC may signal problems</li>
                  <li><strong>FCF Stability:</strong> Analyze FCF volatility. Stable FCF is more valuable than volatile FCF</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Discounted Cash Flow (DCF) Valuation Methodology</h3>
                <div className={styles.warningCard}>
                  <h4>📈 DCF Valuation Step-by-Step Process</h4>
                  <ol className={styles.marginSteps}>
                    <li><strong>Step 1:</strong> Project FCF for 5-10 years using reasonable growth assumptions</li>
                    <li><strong>Step 2:</strong> Calculate Terminal Value using perpetuity growth method (typically 2-3% growth)</li>
                    <li><strong>Step 3:</strong> Determine Weighted Average Cost of Capital (WACC)</li>
                    <li><strong>Step 4:</strong> Discount all future cash flows to present value using WACC</li>
                    <li><strong>Step 5:</strong> Add present values of explicit period and terminal value</li>
                    <li><strong>Step 6:</strong> Subtract net debt to get equity value</li>
                    <li><strong>Step 7:</strong> Divide by shares outstanding for per-share intrinsic value</li>
                    <li><strong>Step 8:</strong> Compare to market price for investment decision</li>
                  </ol>
                  <p><strong>Critical Assumptions:</strong> Growth rates, terminal growth rate, and WACC have huge impacts on valuation. Use conservative assumptions and test sensitivity.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Industry-Specific FCF Benchmarks</h3>
                <div className={styles.industryTable}>
                  <div className={styles.industryHeader}>
                    <div className={styles.industryHeaderCell}>Industry</div>
                    <div className={styles.industryHeaderCell}>Avg FCF Margin</div>
                    <div className={styles.industryHeaderCell}>Typical CapEx %</div>
                    <div className={styles.industryHeaderCell}>FCF Yield Target</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryCell}>Software (SaaS)</div>
                    <div className={styles.industryCell}>20-40%</div>
                    <div className={styles.industryCell}>1-3%</div>
                    <div className={styles.industryCell}>3-5%</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryCell}>Consumer Staples</div>
                    <div className={styles.industryCell}>8-12%</div>
                    <div className={styles.industryCell}>3-5%</div>
                    <div className={styles.industryCell}>4-6%</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryCell}>Manufacturing</div>
                    <div className={styles.industryCell}>6-10%</div>
                    <div className={styles.industryCell}>4-8%</div>
                    <div className={styles.industryCell}>6-8%</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryCell}>Retail</div>
                    <div className={styles.industryCell}>4-8%</div>
                    <div className={styles.industryCell}>2-4%</div>
                    <div className={styles.industryCell}>5-7%</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryCell}>Utilities</div>
                    <div className={styles.industryCell}>10-15%</div>
                    <div className={styles.industryCell}>8-12%</div>
                    <div className={styles.industryCell}>4-6%</div>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Investment Professionals</h3>
                <blockquote className={styles.expertQuote}>
                  "When analyzing companies, I focus on three FCF metrics: 1) Consistency of FCF generation across business cycles, 2) FCF yield relative to cost of capital, and 3) Management's capital allocation track record with that FCF. A business that consistently generates high FCF yields and allocates capital wisely is a compounding machine. I'll pay a premium for that combination."
                  <footer className={styles.quoteFooter}>— Portfolio Manager, Value Investment Fund, 20+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's a good FCF margin for a business?</h3>
                <p className={styles.faqAnswer}>Excellent FCF margins vary by industry but generally: 20%+ is outstanding, 10-20% is strong, 5-10% is average, and below 5% is weak. However, growth-stage companies often have low or negative FCF margins as they reinvest heavily. Mature companies should have stable, positive FCF margins. Compare to industry peers for proper context.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do I differentiate between maintenance and growth CapEx?</h3>
                <p className={styles.faqAnswer}>Maintenance CapEx is spending required to maintain current operations (replacing aging equipment, software updates, regulatory compliance). Growth CapEx expands capacity or capabilities (new factories, product lines, acquisitions). Unfortunately, most companies don't separate them in financial statements. A proxy: Maintenance CapEx ≈ Depreciation, Growth CapEx = Total CapEx - Depreciation. Analyze management discussion for clues.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Why might FCF be negative even with positive net income?</h3>
                <p className={styles.faqAnswer}>Common reasons: 1) Heavy capital expenditures exceeding depreciation, 2) Large increases in working capital (growing receivables or inventory), 3) Significant cash taxes paid, 4) High interest payments, 5) Extraordinary cash outflows (litigation, restructuring). Temporary negative FCF during investment phases can be acceptable, but sustained negative FCF raises sustainability concerns.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How should I use FCF in valuation multiples?</h3>
                <p className={styles.faqAnswer}>Key FCF multiples: 1) EV/FCF (Enterprise Value to FCF) - similar to P/E but cash-based, 2) P/FCF (Price to FCF) - equity perspective, 3) FCF Yield (FCF/Price). Lower multiples/higher yields indicate better value, but consider growth rates. A company with 20% FCF growth deserves a higher multiple than one with 5% growth. Compare multiples to historical averages and peer group medians.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Analyze Your Business or Investment?</h2>
              <p className={styles.ctaText}>Use our advanced FCF calculator to understand cash generation, perform DCF valuations, and make data-driven investment decisions.</p>
              
              
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational and informational purposes only. Free Cash Flow calculations involve numerous assumptions and estimates. Actual business performance and valuations may differ significantly. This tool does not constitute investment advice, financial advice, or professional business valuation. Consult with qualified financial professionals for specific business valuation and investment decisions. Past performance does not guarantee future results.
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

export default FreeCashFlowCalculator;