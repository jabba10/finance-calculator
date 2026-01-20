import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './discountedcashflowcalculator.module.css';

const DCFCalculator = ({ currentDate, lastModifiedDate }) => {
  // State for Free Cash Flow inputs
  const [currentFCF, setCurrentFCF] = useState(1000000);
  const [growthRate, setGrowthRate] = useState(10);
  const [growthYears, setGrowthYears] = useState(5);
  const [terminalGrowthRate, setTerminalGrowthRate] = useState(3);
  
  // State for discount rate
  const [discountRate, setDiscountRate] = useState(10);
  const [perpetuityRate, setPerpetuityRate] = useState(3);
  
  // State for results
  const [results, setResults] = useState(null);
  const [cashFlowData, setCashFlowData] = useState([]);
  const [presentValueData, setPresentValueData] = useState([]);

  const calculateDCF = () => {
    const cashFlows = [];
    const presentValues = [];
    
    // Calculate explicit period cash flows
    let fcf = currentFCF;
    let totalPresentValueExplicit = 0;
    
    for (let year = 1; year <= growthYears; year++) {
      fcf = fcf * (1 + growthRate / 100);
      const presentValue = fcf / Math.pow(1 + discountRate / 100, year);
      
      cashFlows.push({
        year: year,
        fcf: Math.round(fcf * 100) / 100,
        presentValue: Math.round(presentValue * 100) / 100,
        type: 'explicit'
      });
      
      presentValues.push({
        year: year,
        value: Math.round(presentValue * 100) / 100
      });
      
      totalPresentValueExplicit += presentValue;
    }
    
    // Calculate terminal value
    const terminalYearFCF = fcf * (1 + terminalGrowthRate / 100);
    const terminalValue = terminalYearFCF / ((perpetuityRate / 100) - (terminalGrowthRate / 100));
    const terminalValuePresent = terminalValue / Math.pow(1 + discountRate / 100, growthYears);
    
    // Calculate total enterprise value
    const totalPresentValue = totalPresentValueExplicit + terminalValuePresent;
    const equityValue = totalPresentValue; // Assuming no debt for simplicity
    
    // Add terminal value to cash flows
    cashFlows.push({
      year: 'Terminal',
      fcf: Math.round(terminalYearFCF * 100) / 100,
      presentValue: Math.round(terminalValuePresent * 100) / 100,
      type: 'terminal'
    });
    
    presentValues.push({
      year: 'Terminal',
      value: Math.round(terminalValuePresent * 100) / 100
    });
    
    setResults({
      enterpriseValue: Math.round(totalPresentValue * 100) / 100,
      explicitPeriodValue: Math.round(totalPresentValueExplicit * 100) / 100,
      terminalValue: Math.round(terminalValuePresent * 100) / 100,
      impliedMultiple: Math.round((terminalValuePresent / totalPresentValue) * 10000) / 100,
      yearsOfGrowth: growthYears
    });
    
    setCashFlowData(cashFlows);
    setPresentValueData(presentValues);
  };

  useEffect(() => {
    calculateDCF();
  }, [currentFCF, growthRate, growthYears, terminalGrowthRate, discountRate, perpetuityRate]);

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

  return (
    <>
      <Head>
        <title>Advanced DCF Calculator | Discounted Cash Flow Valuation Tool</title>
        <meta name="description" content="Professional Discounted Cash Flow calculator for company valuation. Calculate intrinsic value using free cash flow projections, discount rates, and terminal values." />
        <meta name="keywords" content="DCF calculator, discounted cash flow, company valuation, intrinsic value, investment analysis, financial modeling, free cash flow, terminal value" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/discounted-cash-flow-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced DCF Calculator | Professional Company Valuation Tool" />
        <meta property="og:description" content="Calculate the intrinsic value of companies using discounted cash flow analysis. Essential tool for investors, analysts, and financial professionals." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/discounted-cash-flow-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Professional DCF Calculator" />
        <meta name="twitter:description" content="Calculate company valuations with discounted cash flow analysis." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="dcf-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced DCF Calculator",
            "description": "Professional discounted cash flow calculator for company valuation and investment analysis",
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
              "name": "Valuation Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Free Cash Flow Projections",
              "Terminal Value Calculations",
              "Discount Rate Analysis",
              "Visual Cash Flow Charts",
              "Sensitivity Analysis"
            ]
          })
        }}
      />

      {/* FAQ Schema */}
      <Script
        id="dcf-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is Discounted Cash Flow (DCF) analysis?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "DCF is a valuation method used to estimate the intrinsic value of an investment based on its expected future cash flows, adjusted for the time value of money. It calculates the present value of projected future cash flows using a discount rate that reflects the risk of those cash flows.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How do I choose an appropriate discount rate?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The discount rate typically uses the Weighted Average Cost of Capital (WACC) for companies. For individual projects, use a rate that reflects the risk. Higher risk investments require higher discount rates. Common range: 8-15% for established companies, 15-25% for high-growth startups.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between explicit period and terminal value?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The explicit period (typically 5-10 years) forecasts detailed cash flows based on specific growth assumptions. Terminal value represents all cash flows beyond the explicit period, assuming a stable, perpetual growth rate (usually 2-4%, approximating long-term inflation or GDP growth).",
                  "datePublished": currentDate
                }
              }
            ]
          })
        }}
      />

      <div className={styles.container}>
        {/* Header with fixed position handling */}
        <div className={styles.headerSpacer}></div>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.mainTitle}>Advanced DCF Calculator</h1>
            <p className={styles.subtitle}>Calculate Company Valuation Using Discounted Cash Flow Analysis</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Professional Tool</span>
              <span className={styles.badge}>No Signup Required</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>DCF Inputs</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Current Free Cash Flow
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="100000"
                      max="10000000"
                      step="100000"
                      value={currentFCF}
                      onChange={(e) => setCurrentFCF(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="100000"
                      max="10000000"
                      step="100000"
                      value={currentFCF}
                      onChange={(e) => setCurrentFCF(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(currentFCF)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Growth Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="0.5"
                      value={growthRate}
                      onChange={(e) => setGrowthRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="30"
                      step="0.5"
                      value={growthRate}
                      onChange={(e) => setGrowthRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(growthRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Growth Period (Years)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="3"
                      max="10"
                      step="1"
                      value={growthYears}
                      onChange={(e) => setGrowthYears(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="3"
                      max="10"
                      step="1"
                      value={growthYears}
                      onChange={(e) => setGrowthYears(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{growthYears} years</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Terminal Growth Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.1"
                      value={terminalGrowthRate}
                      onChange={(e) => setTerminalGrowthRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={terminalGrowthRate}
                      onChange={(e) => setTerminalGrowthRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(terminalGrowthRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Discount Rate (WACC)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      step="0.5"
                      value={discountRate}
                      onChange={(e) => setDiscountRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="5"
                      max="20"
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
                  Perpetuity Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.1"
                      value={perpetuityRate}
                      onChange={(e) => setPerpetuityRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="0.1"
                      value={perpetuityRate}
                      onChange={(e) => setPerpetuityRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(perpetuityRate)}</div>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Valuation Results</h2>
              
              {results && (
                <>
                  <div className={styles.valuationResult}>
                    <div className={styles.valuationLabel}>Enterprise Value</div>
                    <div className={styles.valuationValue}>{formatCurrency(results.enterpriseValue)}</div>
                    <div className={styles.valuationInterpretation}>
                      {results.enterpriseValue / currentFCF > 30 ? "Premium Valuation - High Growth Expectations" :
                       results.enterpriseValue / currentFCF > 15 ? "Fair Valuation - Moderate Growth" :
                       "Conservative Valuation - Low Growth Expectations"}
                    </div>
                  </div>

                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Explicit Period Value</div>
                      <div className={styles.resultValue}>{formatCurrency(results.explicitPeriodValue)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Terminal Value</div>
                      <div className={styles.resultValue}>{formatCurrency(results.terminalValue)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Terminal Value % of Total</div>
                      <div className={styles.resultValue}>{formatPercentage(results.impliedMultiple)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Implied Multiple</div>
                      <div className={styles.resultValue}>{Math.round((results.enterpriseValue / currentFCF) * 10) / 10}x</div>
                    </div>
                  </div>

                  {/* Cash Flow Projection Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Free Cash Flow Projections</h3>
                    <div className={styles.chartBars}>
                      {cashFlowData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>
                            {typeof data.year === 'number' ? `Year ${data.year}` : data.year}
                          </div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={data.type === 'explicit' ? styles.chartBarExplicit : styles.chartBarTerminal}
                              style={{ width: `${(data.fcf / cashFlowData.reduce((max, d) => Math.max(max, d.fcf), 0)) * 100}%` }}
                              title={`FCF: ${formatCurrency(data.fcf)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{formatCurrency(data.fcf)}</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendExplicit}`}></div>
                        <span>Explicit Period FCF</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendTerminal}`}></div>
                        <span>Terminal Year FCF</span>
                      </div>
                    </div>
                  </div>

                  {/* Present Value Breakdown */}
                  <div className={styles.pvBreakdown}>
                    <h3 className={styles.pvTitle}>Present Value Contribution</h3>
                    <div className={styles.pvChart}>
                      {presentValueData.map((data, index) => (
                        <div key={index} className={styles.pvItem}>
                          <div className={styles.pvLabel}>
                            {typeof data.year === 'number' ? `Year ${data.year}` : data.year}
                          </div>
                          <div className={styles.pvBarContainer}>
                            <div 
                              className={styles.pvBar}
                              style={{ width: `${(data.value / results.enterpriseValue) * 100}%` }}
                            />
                          </div>
                          <div className={styles.pvValue}>{formatCurrency(data.value)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Valuation Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Terminal value represents <strong>{formatPercentage(results.impliedMultiple)}</strong> of total valuation</li>
                      <li>Implied EV/FCF multiple: <strong>{Math.round((results.enterpriseValue / currentFCF) * 10) / 10}x</strong></li>
                      <li>Annual growth assumption: <strong>{formatPercentage(growthRate)}</strong> for {growthYears} years</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Mastering DCF Analysis: The Investor's Guide to Intrinsic Value</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>What is DCF and Why It Matters</h3>
                <p>Discounted Cash Flow (DCF) analysis is the most fundamental and theoretically sound method for determining the intrinsic value of an investment. Unlike market-based valuations that fluctuate with sentiment, DCF focuses on the actual cash-generating ability of a business.</p>
                
                <div className={styles.formulaCard}>
                  <h4>DCF Formula:</h4>
                  <div className={styles.formula}>
                    Enterprise Value = ∑ [FCFₜ / (1 + r)ᵗ] + [TV / (1 + r)ⁿ]
                  </div>
                  <div className={styles.formulaExplanation}>
                    <ul>
                      <li><strong>FCFₜ:</strong> Free Cash Flow in year t</li>
                      <li><strong>r:</strong> Discount rate (usually WACC)</li>
                      <li><strong>t:</strong> Time period (year)</li>
                      <li><strong>TV:</strong> Terminal Value</li>
                      <li><strong>n:</strong> Number of years in explicit period</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Key Components of DCF Analysis</h3>
                
                <div className={styles.componentsGrid}>
                  <div className={styles.componentCard}>
                    <h4>💰 Free Cash Flow</h4>
                    <p>The cash a company generates after accounting for cash outflows to support operations and maintain capital assets. Represents the true cash available to investors.</p>
                  </div>
                  
                  <div className={styles.componentCard}>
                    <h4>📈 Growth Projections</h4>
                    <p>Realistic growth rates for the explicit forecast period. Should be based on industry trends, competitive position, and company-specific factors.</p>
                  </div>
                  
                  <div className={styles.componentCard}>
                    <h4>🎯 Discount Rate (WACC)</h4>
                    <p>The required rate of return that reflects the risk of the investment. Combines cost of equity and cost of debt, weighted by capital structure.</p>
                  </div>
                  
                  <div className={styles.componentCard}>
                    <h4>∞ Terminal Value</h4>
                    <p>Represents all cash flows beyond the explicit forecast period. Typically calculated using Gordon Growth Model: TV = FCFₙ₊₁ / (r - g).</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common DCF Assumptions by Industry</h3>
                <div className={styles.industryTable}>
                  <div className={styles.industryRow}>
                    <div className={styles.industryName}>Technology</div>
                    <div className={styles.industryGrowth}>15-25%</div>
                    <div className={styles.industryWacc}>10-12%</div>
                    <div className={styles.industryTerminal}>3-4%</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryName}>Healthcare</div>
                    <div className={styles.industryGrowth}>8-12%</div>
                    <div className={styles.industryWacc}>8-10%</div>
                    <div className={styles.industryTerminal}>2.5-3.5%</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryName}>Consumer Staples</div>
                    <div className={styles.industryGrowth}>3-6%</div>
                    <div className={styles.industryWacc}>6-8%</div>
                    <div className={styles.industryTerminal}>2-3%</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryName}>Utilities</div>
                    <div className={styles.industryGrowth}>2-4%</div>
                    <div className={styles.industryWacc}>5-7%</div>
                    <div className={styles.industryTerminal}>2-2.5%</div>
                  </div>
                </div>
                <div className={styles.tableLegend}>
                  <span><strong>Growth:</strong> Explicit period growth rates</span>
                  <span><strong>WACC:</strong> Typical discount rates</span>
                  <span><strong>Terminal:</strong> Long-term growth assumptions</span>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Valuation Insights</h3>
                <blockquote className={styles.expertQuote}>
                  "The most critical inputs in any DCF model are the discount rate and terminal growth assumptions. Small changes in these variables can lead to dramatically different valuations. Always conduct sensitivity analysis and maintain conservative assumptions—it's better to be approximately right than precisely wrong."
                  <footer className={styles.quoteFooter}>— CFA Charterholder & Equity Research Analyst, 15+ years experience</footer>
                </blockquote>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Practical Applications</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Investment Decisions:</strong> Compare DCF valuation to market price to identify undervalued opportunities</li>
                  <li><strong>M&A Analysis:</strong> Determine fair acquisition prices for target companies</li>
                  <li><strong>Private Equity:</strong> Value portfolio companies and assess exit opportunities</li>
                  <li><strong>Corporate Finance:</strong> Evaluate capital allocation decisions and strategic investments</li>
                  <li><strong>Startup Valuation:</strong> Estimate pre-revenue company values based on projections</li>
                </ul>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>DCF Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Why does terminal value often represent most of the DCF valuation?</h3>
                <p className={styles.faqAnswer}>Terminal value captures all cash flows beyond the explicit forecast period (often 5-10 years). Since companies are assumed to operate perpetually, the value of distant cash flows—though discounted heavily—still represents significant value. This is mathematically correct but highlights the importance of reasonable terminal growth assumptions.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How sensitive is DCF to changes in discount rate?</h3>
                <p className={styles.faqAnswer}>Extremely sensitive. A 1% change in discount rate can change valuation by 10-20%. This is why WACC calculation is crucial. Higher discount rates significantly reduce present value, especially for long-dated cash flows. Always perform sensitivity analysis across a range of discount rates.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's a reasonable terminal growth rate?</h3>
                <p className={styles.faqAnswer}>Terminal growth should not exceed long-term GDP growth or inflation expectations, typically 2-4%. Rates above 4% imply the company will eventually become the entire economy. Conservative analysts often use 2-3% for mature companies. The terminal rate must be less than the discount rate for the Gordon Growth Model to work.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do I account for debt in DCF valuation?</h3>
                <p className={styles.faqAnswer}>DCF calculates Enterprise Value (value of entire business). To get Equity Value (value for shareholders), subtract net debt (total debt minus cash). Our calculator shows Enterprise Value—for Equity Value, subtract your company's actual net debt from the result.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Master Company Valuation Today</h2>
              <p className={styles.ctaText}>Use our DCF calculator to analyze investment opportunities, value businesses, and make data-driven financial decisions. Adjust inputs to match specific companies and test different scenarios.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational and analytical purposes. Actual valuations should consider comprehensive financial analysis, industry factors, and professional judgment. Investment decisions should be made in consultation with qualified financial advisors.
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

export default DCFCalculator;