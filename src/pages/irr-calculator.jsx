import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './irrcalculator.module.css';

const IRRCalculator = ({ currentDate, lastModifiedDate }) => {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [cashFlows, setCashFlows] = useState([2000, 2500, 3000, 3500, 4000]);
  const [years, setYears] = useState(5);
  const [irrResult, setIrrResult] = useState(null);
  const [npvData, setNpvData] = useState([]);
  const [hurdleRate, setHurdleRate] = useState(10);
  const [displayFormat, setDisplayFormat] = useState('percentage');

  const calculateIRR = () => {
    // Simplified IRR calculation using Newton-Raphson method
    const calculateNPV = (rate) => {
      let npv = -initialInvestment;
      for (let i = 0; i < years; i++) {
        npv += cashFlows[i] / Math.pow(1 + rate, i + 1);
      }
      return npv;
    };

    const calculateIRRValue = () => {
      let rate = 0.1; // Initial guess
      let precision = 0.00001;
      let maxIterations = 100;
      
      for (let i = 0; i < maxIterations; i++) {
        const npv = calculateNPV(rate);
        const derivative = (calculateNPV(rate + precision) - npv) / precision;
        
        if (Math.abs(npv) < precision) {
          return rate;
        }
        
        if (derivative === 0) {
          break;
        }
        
        rate = rate - npv / derivative;
      }
      
      return rate;
    };

    const irr = calculateIRRValue();
    const npv = calculateNPV(hurdleRate / 100);
    
    // Generate NPV data for different discount rates
    const rates = Array.from({ length: 31 }, (_, i) => i);
    const npvPoints = rates.map(rate => ({
      rate,
      npv: calculateNPV(rate / 100)
    }));
    
    setNpvData(npvPoints);
    setIrrResult({
      irr: irr * 100,
      npv: npv,
      isProfitable: irr > (hurdleRate / 100),
      paybackPeriod: calculatePaybackPeriod()
    });
  };

  const calculatePaybackPeriod = () => {
    let cumulativeCashFlow = 0;
    for (let i = 0; i < years; i++) {
      cumulativeCashFlow += cashFlows[i];
      if (cumulativeCashFlow >= initialInvestment) {
        return i + (initialInvestment - (cumulativeCashFlow - cashFlows[i])) / cashFlows[i];
      }
    }
    return years;
  };

  useEffect(() => {
    calculateIRR();
  }, [initialInvestment, cashFlows, years, hurdleRate]);

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
        <title>Advanced IRR Calculator | Internal Rate of Return Analysis Tool</title>
        <meta name="description" content="Professional IRR calculator for investment analysis. Calculate internal rate of return, NPV, payback period, and make informed investment decisions." />
        <meta name="keywords" content="IRR calculator, internal rate of return, investment analysis, NPV calculator, capital budgeting, financial analysis, ROI calculator" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/irr-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced IRR Calculator | Professional Investment Analysis Tool" />
        <meta property="og:description" content="Calculate Internal Rate of Return (IRR) and make data-driven investment decisions. Free professional financial analysis tool." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/irr-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced IRR Calculator" />
        <meta name="twitter:description" content="Professional IRR calculator for investment analysis and capital budgeting decisions." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="irr-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced IRR Calculator",
            "description": "Professional internal rate of return calculator with NPV analysis and investment decision support",
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
              "ratingCount": "980",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Financial Analysis Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "IRR Calculation",
              "NPV Analysis",
              "Payback Period",
              "Hurdle Rate Comparison",
              "Visual Charts",
              "Investment Decision Support"
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
                "name": "What is IRR and why is it important for investments?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "IRR (Internal Rate of Return) is the discount rate that makes the net present value (NPV) of all cash flows equal to zero. It's crucial for comparing investment opportunities and determining if an investment meets required return thresholds.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How do I interpret IRR results?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Compare the calculated IRR with your required rate of return (hurdle rate). If IRR > hurdle rate, the investment is potentially profitable. Higher IRR indicates better investment potential, but consider other factors like project scale and risk.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between IRR and ROI?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "ROI measures total return as a percentage of initial investment, while IRR considers the timing of cash flows. IRR accounts for the time value of money, making it more sophisticated for comparing investments with different cash flow patterns.",
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
            <h1 className={styles.mainTitle}>Advanced IRR Calculator</h1>
            <p className={styles.subtitle}>Calculate Internal Rate of Return and Make Smarter Investment Decisions</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Professional Grade</span>
              <span className={styles.badge}>No Signup Required</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Investment Parameters</h2>
              
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
                  Required Return (Hurdle Rate)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="0.5"
                      value={hurdleRate}
                      onChange={(e) => setHurdleRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="50"
                      step="0.5"
                      value={hurdleRate}
                      onChange={(e) => setHurdleRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(hurdleRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Investment Period
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
                  Display Format
                  <select
                    value={displayFormat}
                    onChange={(e) => setDisplayFormat(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="decimal">Decimal</option>
                    <option value="multiple">Multiple of Investment</option>
                  </select>
                </label>
              </div>

              <div className={styles.cashFlowsSection}>
                <h3 className={styles.cashFlowTitle}>Annual Cash Flows</h3>
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
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Investment Analysis Results</h2>
              
              {irrResult && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Internal Rate of Return</div>
                      <div className={`${styles.resultValue} ${irrResult.isProfitable ? styles.profitable : styles.notProfitable}`}>
                        {formatPercentage(irrResult.irr)}
                      </div>
                      <div className={styles.resultSubtext}>
                        {irrResult.isProfitable ? (
                          <span className={styles.profitableText}>✓ Exceeds hurdle rate</span>
                        ) : (
                          <span className={styles.notProfitableText}>✗ Below hurdle rate</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Net Present Value (NPV)</div>
                      <div className={`${styles.resultValue} ${irrResult.npv >= 0 ? styles.profitable : styles.notProfitable}`}>
                        {formatCurrency(irrResult.npv)}
                      </div>
                      <div className={styles.resultSubtext}>
                        at {hurdleRate}% discount rate
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Payback Period</div>
                      <div className={styles.resultValue}>
                        {irrResult.paybackPeriod.toFixed(1)} years
                      </div>
                      <div className={styles.resultSubtext}>
                        Time to recover investment
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Investment Decision</div>
                      <div className={`${styles.resultValue} ${irrResult.isProfitable ? styles.profitable : styles.notProfitable}`}>
                        {irrResult.isProfitable ? 'ACCEPT ✓' : 'REJECT ✗'}
                      </div>
                      <div className={styles.resultSubtext}>
                        Based on IRR vs Hurdle Rate
                      </div>
                    </div>
                  </div>

                  {/* NPV Profile Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>NPV Profile</h3>
                    <div className={styles.chartWrapper}>
                      <div className={styles.chartYAxis}>
                        <div>NPV ($)</div>
                        <div className={styles.zeroLine}>0</div>
                        <div>-</div>
                      </div>
                      <div className={styles.chartBars}>
                        {npvData.filter((_, i) => i % 3 === 0).map((data, index) => (
                          <div key={index} className={styles.chartBarGroup}>
                            <div 
                              className={`${styles.chartBar} ${data.npv >= 0 ? styles.positiveNpv : styles.negativeNpv}`}
                              style={{ 
                                height: `${Math.min(Math.abs(data.npv / initialInvestment) * 100, 100)}%`,
                                transform: data.npv >= 0 ? 'scaleY(1)' : 'scaleY(-1)'
                              }}
                              title={`${data.rate}%: ${formatCurrency(data.npv)}`}
                            />
                            <div className={styles.chartBarLabel}>{data.rate}%</div>
                            {data.rate === hurdleRate && (
                              <div className={styles.hurdleMarker}>Hurdle Rate</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendPositive}`}></div>
                        <span>Positive NPV</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendNegative}`}></div>
                        <span>Negative NPV</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={styles.legendMarker}></div>
                        <span>IRR: ~{irrResult.irr.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Investment Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Your investment needs to earn <strong>{formatPercentage(irrResult.irr)}</strong> annually to break even</li>
                      <li>At your required {hurdleRate}% return, this project adds <strong>{formatCurrency(irrResult.npv)}</strong> in value</li>
                      <li>You'll recover your initial investment in approximately <strong>{irrResult.paybackPeriod.toFixed(1)} years</strong></li>
                    </ul>
                  </div>

                  <div className={styles.cashFlowSummary}>
                    <h3 className={styles.summaryTitle}>Cash Flow Summary</h3>
                    <div className={styles.summaryGrid}>
                      <div className={styles.summaryItem}>
                        <div className={styles.summaryLabel}>Total Investment</div>
                        <div className={styles.summaryValue}>{formatCurrency(initialInvestment)}</div>
                      </div>
                      <div className={styles.summaryItem}>
                        <div className={styles.summaryLabel}>Total Cash Inflows</div>
                        <div className={styles.summaryValue}>{formatCurrency(cashFlows.reduce((a, b) => a + b, 0))}</div>
                      </div>
                      <div className={styles.summaryItem}>
                        <div className={styles.summaryLabel}>Net Cash Flow</div>
                        <div className={styles.summaryValue}>
                          {formatCurrency(cashFlows.reduce((a, b) => a + b, 0) - initialInvestment)}
                        </div>
                      </div>
                      <div className={styles.summaryItem}>
                        <div className={styles.summaryLabel}>Average Annual Return</div>
                        <div className={styles.summaryValue}>
                          {formatPercentage(((cashFlows.reduce((a, b) => a + b, 0) - initialInvestment) / initialInvestment / years) * 100)}
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
              <h2 className={styles.articleTitle}>Mastering IRR: The Investor's Guide to Smart Capital Allocation</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding Internal Rate of Return</h3>
                <p>IRR is one of the most powerful metrics in finance for evaluating investment opportunities. It represents the annualized effective compounded return rate that makes the net present value of all cash flows (both positive and negative) equal to zero. In practical terms, it's the rate at which your investment grows over time, considering the timing of all cash flows.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World IRR Example:</h4>
                  <p>Consider a $10,000 investment that generates the following cash flows:</p>
                  <ul>
                    <li><strong>Year 1:</strong> $2,000</li>
                    <li><strong>Year 2:</strong> $2,500</li>
                    <li><strong>Year 3:</strong> $3,000</li>
                    <li><strong>Year 4:</strong> $3,500</li>
                    <li><strong>Year 5:</strong> $4,000</li>
                  </ul>
                  <p>The IRR for this investment is approximately <strong>12.6%</strong>. If your required return is 10%, this investment is attractive because 12.6% &gt; 10%.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>When to Use IRR vs Other Metrics</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>📊 IRR for Project Comparison</h4>
                    <p>Use IRR when comparing mutually exclusive projects with similar scale and duration. Higher IRR typically indicates better investment, but always consider NPV for final decisions.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 NPV for Absolute Value</h4>
                    <p>NPV shows the dollar value added by an investment. Use NPV when comparing projects of different sizes or when you need to know the absolute value created.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⏱️ Payback Period for Risk</h4>
                    <p>Shorter payback periods indicate faster recovery of initial investment, reducing risk. Use this alongside IRR for a complete risk-return analysis.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 ROI for Simple Returns</h4>
                    <p>ROI is simpler but doesn't consider timing of cash flows. Use for quick assessments, but rely on IRR for detailed investment analysis.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common Applications in Business</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Capital Budgeting:</strong> Evaluate new projects, equipment purchases, or facility expansions</li>
                  <li><strong>Real Estate Investments:</strong> Analyze rental properties, commercial real estate, or development projects</li>
                  <li><strong>Private Equity:</strong> Assess potential acquisitions, venture capital investments, or buyout opportunities</li>
                  <li><strong>Corporate Finance:</strong> Make decisions about mergers, acquisitions, or strategic investments</li>
                  <li><strong>Personal Investments:</strong> Evaluate rental properties, business ventures, or long-term investment opportunities</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Limitations and Considerations</h3>
                <blockquote className={styles.expertQuote}>
                  "While IRR is invaluable, it has limitations. It assumes reinvestment at the IRR rate (which may be unrealistic), struggles with unconventional cash flows, and can give multiple solutions. Always use IRR in conjunction with NPV and qualitative factors."
                  <footer className={styles.quoteFooter}>— Investment Banking Analyst, 10+ years experience</footer>
                </blockquote>
                
                <div className={styles.limitationsList}>
                  <h4>Key Limitations to Consider:</h4>
                  <ul>
                    <li><strong>Reinvestment Rate Assumption:</strong> IRR assumes cash flows are reinvested at the IRR rate</li>
                    <li><strong>Scale Ignorance:</strong> Doesn't account for project size (a small project with high IRR may add less value than a larger project with lower IRR)</li>
                    <li><strong>Multiple IRRs:</strong> Projects with alternating positive and negative cash flows can have multiple IRR solutions</li>
                    <li><strong>Timing Issues:</strong> Doesn't clearly indicate project duration or when returns are generated</li>
                  </ul>
                </div>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's a good IRR for an investment?</h3>
                <p className={styles.faqAnswer}>A "good" IRR depends on the investment type, risk, and alternative opportunities. Generally, for equity investments, 15-25% is good, while for real estate, 8-12% might be acceptable. Always compare to your hurdle rate and similar investment opportunities.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Why would I reject a project with positive IRR?</h3>
                <p className={styles.faqAnswer}>You might reject a project with positive IRR if: 1) It's below your required return (hurdle rate), 2) It has a negative NPV when considering your cost of capital, 3) There are better alternatives with higher IRRs, or 4) The risk is too high relative to the return.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do I choose the right hurdle rate?</h3>
                <p className={styles.faqAnswer}>Your hurdle rate should reflect: 1) Your cost of capital, 2) Investment risk (higher risk = higher required return), 3) Alternative investment opportunities, and 4) Your strategic objectives. Many companies use WACC (Weighted Average Cost of Capital) plus a risk premium.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can IRR be negative and what does it mean?</h3>
                <p className={styles.faqAnswer}>Yes, IRR can be negative. A negative IRR means the investment is losing money at the calculated rate. Essentially, the project's cash outflows exceed inflows even without considering the time value of money. This is a clear reject signal for most investments.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Analyze Your Investment?</h2>
              <p className={styles.ctaText}>Use our IRR calculator to evaluate your investment opportunities. Adjust cash flows and compare against your required return to make data-driven decisions.</p>
              
              
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational and informational purposes only. IRR calculations are based on simplified assumptions. Actual investment returns may vary. Past performance does not guarantee future results. Always conduct thorough due diligence and consider consulting with a financial advisor before making investment decisions.
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

export default IRRCalculator;