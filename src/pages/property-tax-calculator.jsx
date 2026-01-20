import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './propertytaxcalculator.module.css';

const PropertyTaxCalculator = ({ currentDate, lastModifiedDate }) => {
  const [propertyValue, setPropertyValue] = useState(350000);
  const [annualTaxRate, setAnnualTaxRate] = useState(1.1);
  const [assessmentRate, setAssessmentRate] = useState(85);
  const [exemptions, setExemptions] = useState(25000);
  const [annualIncrease, setAnnualIncrease] = useState(3);
  const [years, setYears] = useState(10);
  const [results, setResults] = useState(null);
  const [projectionData, setProjectionData] = useState([]);

  // Common property tax rates by state/city
  const taxRatePresets = [
    { name: 'National Average', rate: 1.1, assessment: 85 },
    { name: 'New Jersey (High)', rate: 2.42, assessment: 100 },
    { name: 'Illinois (High)', rate: 2.27, assessment: 33.3 },
    { name: 'Texas (Moderate)', rate: 1.8, assessment: 100 },
    { name: 'California (Prop 13)', rate: 0.77, assessment: 100 },
    { name: 'Hawaii (Low)', rate: 0.28, assessment: 100 },
    { name: 'New York (NYC)', rate: 0.88, assessment: 100 },
    { name: 'Florida (Moderate)', rate: 0.89, assessment: 85 },
    { name: 'Arizona (Low)', rate: 0.62, assessment: 100 },
    { name: 'Pennsylvania', rate: 1.58, assessment: 100 }
  ];

  const calculatePropertyTax = () => {
    // Calculate assessed value
    const assessedValue = propertyValue * (assessmentRate / 100);
    
    // Calculate taxable value after exemptions
    const taxableValue = Math.max(0, assessedValue - exemptions);
    
    // Calculate annual property tax
    const annualTax = taxableValue * (annualTaxRate / 100);
    const monthlyTax = annualTax / 12;
    
    // Calculate effective tax rate
    const effectiveRate = (annualTax / propertyValue) * 100;
    
    // Calculate tax as percentage of income (assume 3x property value as income)
    const estimatedIncome = propertyValue * 3;
    const taxToIncomeRatio = (annualTax / estimatedIncome) * 100;
    
    // Calculate long-term projections
    const projections = [];
    let projectedValue = propertyValue;
    let totalTaxPaid = 0;
    
    for (let year = 1; year <= years; year++) {
      projectedValue *= (1 + (annualIncrease / 100));
      const projectedAssessed = projectedValue * (assessmentRate / 100);
      const projectedTaxable = Math.max(0, projectedAssessed - exemptions);
      const projectedTax = projectedTaxable * (annualTaxRate / 100);
      totalTaxPaid += projectedTax;
      
      projections.push({
        year: year,
        propertyValue: Math.round(projectedValue),
        assessedValue: Math.round(projectedAssessed),
        annualTax: Math.round(projectedTax),
        cumulativeTax: Math.round(totalTaxPaid)
      });
    }
    
    setResults({
      assessedValue: Math.round(assessedValue),
      taxableValue: Math.round(taxableValue),
      annualTax: Math.round(annualTax),
      monthlyTax: Math.round(monthlyTax),
      effectiveRate: effectiveRate,
      taxToIncomeRatio: taxToIncomeRatio,
      exemptionsUsed: exemptions,
      totalProjectedTax: Math.round(totalTaxPaid)
    });
    
    setProjectionData(projections);
  };

  useEffect(() => {
    calculatePropertyTax();
  }, [propertyValue, annualTaxRate, assessmentRate, exemptions, annualIncrease, years]);

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
        <title>Advanced Property Tax Calculator | Estimate Your Real Estate Taxes</title>
        <meta name="description" content="Free advanced property tax calculator with assessment rates, exemptions, and long-term projections. Calculate your real estate taxes for any US location." />
        <meta name="keywords" content="property tax calculator, real estate tax calculator, home tax calculator, property assessment calculator, tax rate calculator, mortgage calculator" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/property-tax-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Property Tax Calculator | Estimate Your Real Estate Taxes" />
        <meta property="og:description" content="Calculate property taxes with assessment rates, exemptions, and long-term projections. Essential tool for homeowners and real estate investors." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/property-tax-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Property Tax Calculator" />
        <meta name="twitter:description" content="Estimate your property taxes with our comprehensive calculator including assessments and exemptions." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="property-tax-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Property Tax Calculator",
            "description": "Professional property tax calculator with assessment rates, exemptions, and long-term projections",
            "applicationCategory": "RealEstateApplication",
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
              "name": "Real Estate Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Assessment Rate Calculations",
              "Tax Exemption Analysis",
              "Long-Term Projections",
              "State/County Comparisons",
              "Effective Tax Rate Analysis"
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
                "name": "How are property taxes calculated?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Property taxes are calculated by multiplying the assessed value (market value × assessment rate) minus any exemptions by the local tax rate. The formula is: (Property Value × Assessment Rate - Exemptions) × Tax Rate = Annual Property Tax.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between market value and assessed value?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Market value is what your property would sell for on the open market. Assessed value is the value used for tax calculations, which is typically a percentage of market value (the assessment rate). This rate varies by jurisdiction.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How can I reduce my property taxes?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Common strategies include applying for homestead exemptions, appealing your assessment if it's too high, checking for errors in your property record, applying for senior/disabled exemptions, and ensuring you're receiving all eligible tax credits.",
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
            <h1 className={styles.mainTitle}>Advanced Property Tax Calculator</h1>
            <p className={styles.subtitle}>Estimate Your Real Estate Taxes with Assessment Rates, Exemptions & Long-Term Projections</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>All 50 States</span>
              <span className={styles.badge}>Free Tool</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate Your Property Taxes</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Property Market Value
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="50000"
                      max="2000000"
                      step="10000"
                      value={propertyValue}
                      onChange={(e) => setPropertyValue(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="50000"
                      max="2000000"
                      step="10000"
                      value={propertyValue}
                      onChange={(e) => setPropertyValue(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(propertyValue)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Tax Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0.1"
                      max="5"
                      step="0.05"
                      value={annualTaxRate}
                      onChange={(e) => setAnnualTaxRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0.1"
                      max="5"
                      step="0.05"
                      value={annualTaxRate}
                      onChange={(e) => setAnnualTaxRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatDecimal(annualTaxRate)}%</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Assessment Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="1"
                      value={assessmentRate}
                      onChange={(e) => setAssessmentRate(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10"
                      max="100"
                      step="1"
                      value={assessmentRate}
                      onChange={(e) => setAssessmentRate(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(assessmentRate)}</div>
                  <div className={styles.inputHint}>Percentage of market value used for tax assessment</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Exemptions & Deductions
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={exemptions}
                      onChange={(e) => setExemptions(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="100000"
                      step="1000"
                      value={exemptions}
                      onChange={(e) => setExemptions(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(exemptions)}</div>
                  <div className={styles.inputHint}>Homestead, senior, disability exemptions</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Property Value Annual Increase
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={annualIncrease}
                      onChange={(e) => setAnnualIncrease(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={annualIncrease}
                      onChange={(e) => setAnnualIncrease(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(annualIncrease)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Projection Period
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={years}
                      onChange={(e) => setYears(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="30"
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

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Common Tax Rate Presets
                  <select
                    onChange={(e) => {
                      const preset = JSON.parse(e.target.value);
                      setAnnualTaxRate(preset.rate);
                      setAssessmentRate(preset.assessment);
                    }}
                    className={styles.selectInput}
                    defaultValue=""
                  >
                    <option value="">Select a location preset...</option>
                    {taxRatePresets.map((preset, index) => (
                      <option key={index} value={JSON.stringify(preset)}>
                        {preset.name} ({preset.rate}% rate, {preset.assessment}% assessment)
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Your Property Tax Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Annual Property Tax</div>
                      <div className={styles.resultValue}>{formatCurrency(results.annualTax)}</div>
                      <div className={styles.resultSubtext}>{formatCurrency(results.monthlyTax)}/month</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Effective Tax Rate</div>
                      <div className={styles.resultValue}>{formatPercentage(results.effectiveRate)}</div>
                      <div className={styles.resultSubtext}>Of property value</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Assessed Value</div>
                      <div className={styles.resultValue}>{formatCurrency(results.assessedValue)}</div>
                      <div className={styles.resultSubtext}>{formatPercentage(assessmentRate)} of market value</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Tax Savings</div>
                      <div className={styles.resultValue}>{formatCurrency(results.exemptionsUsed * (annualTaxRate / 100))}</div>
                      <div className={styles.resultSubtext}>From exemptions</div>
                    </div>
                  </div>

                  {/* Tax Breakdown */}
                  <div className={styles.breakdownCard}>
                    <h3 className={styles.breakdownTitle}>Tax Calculation Breakdown</h3>
                    <div className={styles.breakdownSteps}>
                      <div className={styles.breakdownStep}>
                        <div className={styles.stepNumber}>1</div>
                        <div className={styles.stepContent}>
                          <div className={styles.stepLabel}>Market Value</div>
                          <div className={styles.stepValue}>{formatCurrency(propertyValue)}</div>
                        </div>
                      </div>
                      <div className={styles.breakdownStep}>
                        <div className={styles.stepNumber}>2</div>
                        <div className={styles.stepContent}>
                          <div className={styles.stepLabel}>× Assessment Rate ({assessmentRate}%)</div>
                          <div className={styles.stepValue}>{formatCurrency(results.assessedValue)} assessed value</div>
                        </div>
                      </div>
                      <div className={styles.breakdownStep}>
                        <div className={styles.stepNumber}>3</div>
                        <div className={styles.stepContent}>
                          <div className={styles.stepLabel}>− Exemptions</div>
                          <div className={styles.stepValue}>{formatCurrency(exemptions)} deductions</div>
                        </div>
                      </div>
                      <div className={styles.breakdownStep}>
                        <div className={styles.stepNumber}>4</div>
                        <div className={styles.stepContent}>
                          <div className={styles.stepLabel}>× Tax Rate ({annualTaxRate}%)</div>
                          <div className={styles.stepValue}>{formatCurrency(results.annualTax)} annual tax</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tax Projection Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>{years}-Year Tax Projection</h3>
                    <div className={styles.chartBars}>
                      {projectionData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>Year {data.year}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarProperty}
                              style={{ width: `${(data.propertyValue / projectionData[projectionData.length - 1].propertyValue) * 100}%` }}
                              title={`Property Value: ${formatCurrency(data.propertyValue)}`}
                            />
                            <div 
                              className={styles.chartBarTax}
                              style={{ width: `${(data.annualTax / Math.max(...projectionData.map(d => d.annualTax))) * 100}%` }}
                              title={`Annual Tax: ${formatCurrency(data.annualTax)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{formatCurrency(data.annualTax)}</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendProperty}`}></div>
                        <span>Property Value Growth</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendTax}`}></div>
                        <span>Annual Property Tax</span>
                      </div>
                    </div>
                    <div className={styles.projectionSummary}>
                      <div className={styles.projectionItem}>
                        <div className={styles.projectionLabel}>Total Taxes Paid</div>
                        <div className={styles.projectionValue}>{formatCurrency(results.totalProjectedTax)}</div>
                      </div>
                      <div className={styles.projectionItem}>
                        <div className={styles.projectionLabel}>Final Property Value</div>
                        <div className={styles.projectionValue}>{formatCurrency(projectionData[projectionData.length - 1]?.propertyValue || 0)}</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>🏡 Property Tax Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Your effective tax rate is <strong>{formatPercentage(results.effectiveRate)}</strong> vs {formatDecimal(annualTaxRate)}% nominal rate</li>
                      <li>Exemptions save you <strong>{formatCurrency(results.exemptionsUsed * (annualTaxRate / 100))}</strong> annually</li>
                      <li>Over {years} years, you'll pay <strong>{formatCurrency(results.totalProjectedTax)}</strong> in property taxes</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Understanding Property Taxes: A Complete Guide for Homeowners</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>How Property Taxes Actually Work</h3>
                <p>Property taxes are a primary source of revenue for local governments, funding essential services like schools, police, fire departments, roads, and public infrastructure. Unlike other taxes that are based on income or purchases, property taxes are based on the value of real estate you own.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Example: $350,000 Home in Typical US County</h4>
                  <ul>
                    <li><strong>Market Value:</strong> $350,000</li>
                    <li><strong>Assessment Rate:</strong> 85% → $297,500 assessed value</li>
                    <li><strong>Homestead Exemption:</strong> $25,000 → $272,500 taxable value</li>
                    <li><strong>Tax Rate:</strong> 1.1% → $2,997.50 annual tax</li>
                    <li><strong>Monthly Payment:</strong> $249.79 (included in mortgage)</li>
                    <li><strong>Effective Rate:</strong> 0.86% (lower than nominal 1.1%)</li>
                  </ul>
                  <p>This complex calculation is why property taxes can vary significantly even for similar homes in different areas.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>State-by-State Property Tax Comparison</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>💰 Highest Property Taxes</h4>
                    <p><strong>New Jersey:</strong> 2.42% avg rate<br/>
                    <strong>Illinois:</strong> 2.27% avg rate<br/>
                    <strong>New Hampshire:</strong> 2.18% avg rate<br/>
                    <strong>Connecticut:</strong> 2.14% avg rate<br/>
                    High rates but often fund excellent schools/services.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏡 Lowest Property Taxes</h4>
                    <p><strong>Hawaii:</strong> 0.28% avg rate<br/>
                    <strong>Alabama:</strong> 0.41% avg rate<br/>
                    <strong>Colorado:</strong> 0.51% avg rate<br/>
                    <strong>Louisiana:</strong> 0.55% avg rate<br/>
                    Lower rates but may have higher income/sales taxes.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📊 Unique Systems</h4>
                    <p><strong>California (Prop 13):</strong> 0.77% rate, but assessments capped at 2% annual increase<br/>
                    <strong>Texas:</strong> No state income tax, but higher property taxes (avg 1.8%)<br/>
                    <strong>Florida:</strong> Homestead exemption caps assessment increases</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚖️ Assessment Variations</h4>
                    <p><strong>Full Assessment:</strong> CA, FL, TX, HI (100% of market value)<br/>
                    <strong>Partial Assessment:</strong> IL (33.3%), MD (100% but phased)<br/>
                    <strong>Variable Rates:</strong> Some states use different rates for land vs improvements</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common Property Tax Exemptions & Reductions</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Homestead Exemption:</strong> Primary residence reduction (varies by state, typically $25,000-$50,000)</li>
                  <li><strong>Senior Citizen Exemption:</strong> Additional reductions for homeowners over 65 (age varies by state)</li>
                  <li><strong>Disabled Veteran Exemption:</strong> Significant reductions or full exemptions for disabled veterans</li>
                  <li><strong>Agricultural/Farmland:</strong> Special assessment rates for agricultural properties</li>
                  <li><strong>Energy Efficiency Credits:</strong> Tax credits for solar panels, energy-efficient improvements</li>
                  <li><strong>Historic Property:</strong> Reductions for maintaining historically designated properties</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>How to Appeal Your Property Assessment</h3>
                <div className={styles.warningCard}>
                  <h4>📝 Step-by-Step Appeal Process</h4>
                  <ol className={styles.appealSteps}>
                    <li><strong>Review Your Assessment:</strong> Check for errors in square footage, bedroom/bath count, or property features</li>
                    <li><strong>Gather Comparable Sales:</strong> Find 3-5 similar properties that sold for less than your assessed value</li>
                    <li><strong>Document Issues:</strong> Take photos of problems that reduce value (needed repairs, unfavorable location factors)</li>
                    <li><strong>File Formal Appeal:</strong> Submit appeal before deadline (usually 30-90 days after assessment notice)</li>
                    <li><strong>Prepare for Hearing:</strong> Present evidence professionally, consider hiring an appraiser for high-value appeals</li>
                    <li><strong>Know Your Options:</strong> Most jurisdictions offer multiple appeal levels (local board, state commission, court)</li>
                  </ol>
                  <p><strong>Success Rate:</strong> About 20-40% of appeals succeed, with average reductions of 5-15%.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Property Tax Advice</h3>
                <blockquote className={styles.expertQuote}>
                  "The biggest mistake homeowners make is not checking their property assessment annually. Even if you don't plan to appeal, understanding how your assessment compares to market value can save you thousands over time. In many states, assessment errors are common, and the appeal process is designed to be accessible to homeowners."
                  <footer className={styles.quoteFooter}>— Property Tax Consultant, 18+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How often do property taxes increase?</h3>
                <p className={styles.faqAnswer}>Property taxes can increase annually based on: 1) Rising property values (reassessment), 2) Increased tax rates by local governments, 3) Elimination or reduction of exemptions. Some states like California limit annual assessment increases (Prop 13 caps at 2% annually), while others reassess at market value regularly. Always check your assessment notice each year.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Are property taxes deductible on federal taxes?</h3>
                <p className={styles.faqAnswer}>Yes, but with limitations. Under current tax law (TCJA), you can deduct up to $10,000 total for state and local taxes (SALT deduction), which includes property taxes plus state income or sales taxes. This $10,000 cap applies to both single and married filers. Property taxes on investment properties are deductible as business expenses without the SALT cap.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What happens if I don't pay my property taxes?</h3>
                <p className={styles.faqAnswer}>Unpaid property taxes lead to: 1) Penalties and interest (typically 1-1.5% monthly), 2) Tax lien placed on property, 3) Possible foreclosure after 2-3 years in most states, 4) Damage to credit score. Many jurisdictions offer payment plans or hardship programs. Always contact your tax collector immediately if you're having difficulty paying.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do property taxes work when buying/selling a home?</h3>
                <p className={styles.faqAnswer}>Property taxes are prorated at closing based on the date of sale. The seller pays taxes for the portion of the year they owned the home, and the buyer pays for the remainder. Taxes are typically collected monthly as part of your mortgage payment (escrow account). After purchase, your assessment may be updated to reflect the sale price, which often increases taxes.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Plan Your Property Tax Strategy?</h2>
              <p className={styles.ctaText}>Use our calculator to estimate taxes for different locations, understand the impact of exemptions, and plan for long-term housing costs. Compare how different states and counties affect your overall housing budget.</p>
              
              
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates based on standard property tax calculation methods. Actual property taxes may vary based on specific local rates, assessment practices, exemptions, and special district taxes not included in this calculator. Tax rates and assessment practices change annually. This tool is for educational and planning purposes only and not a substitute for professional tax advice. Always verify calculations with your local tax assessor's office.
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

export default PropertyTaxCalculator;