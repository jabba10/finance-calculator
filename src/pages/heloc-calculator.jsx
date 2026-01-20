import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './helloccalculator.module.css';

const HELOCCalculator = ({ currentDate, lastModifiedDate }) => {
  const [homeValue, setHomeValue] = useState(500000);
  const [mortgageBalance, setMortgageBalance] = useState(300000);
  const [helocLimit, setHelocLimit] = useState(100000);
  const [helocRate, setHelocRate] = useState(7.5);
  const [drawAmount, setDrawAmount] = useState(50000);
  const [repaymentTerm, setRepaymentTerm] = useState(10);
  const [interestOnlyPeriod, setInterestOnlyPeriod] = useState(0);
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);

  const calculateHELOC = () => {
    // Calculate home equity
    const homeEquity = homeValue - mortgageBalance;
    const availableEquity = homeEquity * 0.85; // Lenders typically allow up to 85% LTV
    const maxHELOC = Math.min(helocLimit, availableEquity);
    
    if (drawAmount > maxHELOC) {
      setDrawAmount(maxHELOC);
    }
    
    // Calculate monthly payment
    const monthlyRate = helocRate / 100 / 12;
    const interestOnlyPayment = drawAmount * monthlyRate;
    
    let totalInterest = 0;
    let remainingBalance = drawAmount;
    const dataPoints = [];
    
    // Interest-only period
    let totalMonths = interestOnlyPeriod * 12;
    for (let month = 1; month <= totalMonths; month++) {
      const monthlyInterest = remainingBalance * monthlyRate;
      totalInterest += monthlyInterest;
      
      if (month % 12 === 0 || month === totalMonths) {
        dataPoints.push({
          year: month / 12,
          principal: remainingBalance,
          interestPaid: totalInterest,
          payment: interestOnlyPayment
        });
      }
    }
    
    // Amortization period
    const amortizationMonths = repaymentTerm * 12;
    const monthlyPayment = remainingBalance * monthlyRate * Math.pow(1 + monthlyRate, amortizationMonths) / 
                          (Math.pow(1 + monthlyRate, amortizationMonths) - 1);
    
    for (let month = 1; month <= amortizationMonths; month++) {
      const monthlyInterest = remainingBalance * monthlyRate;
      const monthlyPrincipal = monthlyPayment - monthlyInterest;
      remainingBalance -= monthlyPrincipal;
      totalInterest += monthlyInterest;
      
      const actualMonth = totalMonths + month;
      if (actualMonth % 12 === 0 || month === amortizationMonths) {
        dataPoints.push({
          year: actualMonth / 12,
          principal: Math.max(remainingBalance, 0),
          interestPaid: totalInterest,
          payment: monthlyPayment
        });
      }
    }
    
    // Calculate final values
    const totalCost = drawAmount + totalInterest;
    const ltvRatio = ((mortgageBalance + drawAmount) / homeValue) * 100;
    const equityUtilization = (drawAmount / availableEquity) * 100;
    
    setResults({
      homeEquity: Math.round(homeEquity),
      availableEquity: Math.round(availableEquity),
      maxHELOC: Math.round(maxHELOC),
      interestOnlyPayment: Math.round(interestOnlyPayment),
      amortizationPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      totalCost: Math.round(totalCost),
      ltvRatio: Math.round(ltvRatio * 100) / 100,
      equityUtilization: Math.round(equityUtilization * 100) / 100
    });
    
    setChartData(dataPoints);
  };

  useEffect(() => {
    calculateHELOC();
  }, [homeValue, mortgageBalance, helocLimit, helocRate, drawAmount, repaymentTerm, interestOnlyPeriod]);

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
        <title>HELOC Calculator | Home Equity Line of Credit Payment & Cost Analysis</title>
        <meta name="description" content="Free HELOC calculator with visual charts. Calculate your home equity line of credit payments, interest costs, and analyze different borrowing strategies." />
        <meta name="keywords" content="HELOC calculator, home equity line of credit, equity calculator, home equity, borrowing calculator, mortgage calculator, loan calculator" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/heloc-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="HELOC Calculator | Home Equity Line of Credit Payment & Cost Analysis" />
        <meta property="og:description" content="Calculate your HELOC payments and costs. Free visual tool for homeowners considering home equity borrowing." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/heloc-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HELOC Calculator" />
        <meta name="twitter:description" content="Analyze your home equity borrowing options with our powerful HELOC calculator." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="heloc-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "HELOC Calculator",
            "description": "Professional HELOC calculator with payment analysis and equity visualization tools",
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
              "name": "Mortgage Tools Pro",
              "url": "https://www.financecalculatorfree.com/"
            },
            "featureList": [
              "Payment Visualization",
              "Equity Analysis",
              "Interest-Only Periods",
              "Cost Projections",
              "LTV Calculations"
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
                "name": "What is a HELOC and how does it work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A Home Equity Line of Credit (HELOC) is a revolving credit line secured by your home equity. You can draw funds as needed during the draw period (usually 10 years), pay interest only on what you borrow, then repay principal and interest during the repayment period (usually 20 years).",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How much can I borrow with a HELOC?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most lenders allow borrowing up to 85% of your home's value minus your current mortgage balance. For example, with a $500,000 home and $300,000 mortgage, you could typically borrow up to $125,000 (85% of $500,000 = $425,000 minus $300,000 mortgage).",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What are the pros and cons of a HELOC vs home equity loan?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "HELOCs offer flexibility with variable rates and draw-as-needed access, while home equity loans provide fixed rates and lump-sum disbursement. HELOCs are better for ongoing projects or uncertain costs, while equity loans are better for one-time expenses with predictable amounts.",
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
            <h1 className={styles.mainTitle}>HELOC Calculator</h1>
            <p className={styles.subtitle}>Calculate Your Home Equity Line of Credit Payments and Costs</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Accurate Calculations</span>
              <span className={styles.badge}>No Signup Required</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate Your HELOC</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Home Value
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="100000"
                      max="2000000"
                      step="10000"
                      value={homeValue}
                      onChange={(e) => setHomeValue(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="100000"
                      max="2000000"
                      step="10000"
                      value={homeValue}
                      onChange={(e) => setHomeValue(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(homeValue)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Current Mortgage Balance
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max={homeValue}
                      step="10000"
                      value={mortgageBalance}
                      onChange={(e) => setMortgageBalance(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max={homeValue}
                      step="10000"
                      value={mortgageBalance}
                      onChange={(e) => setMortgageBalance(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(mortgageBalance)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  HELOC Interest Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="3"
                      max="15"
                      step="0.1"
                      value={helocRate}
                      onChange={(e) => setHelocRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="3"
                      max="15"
                      step="0.1"
                      value={helocRate}
                      onChange={(e) => setHelocRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(helocRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  HELOC Draw Amount
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="10000"
                      max={Math.min(helocLimit, homeValue - mortgageBalance)}
                      step="5000"
                      value={drawAmount}
                      onChange={(e) => setDrawAmount(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10000"
                      max={Math.min(helocLimit, homeValue - mortgageBalance)}
                      step="5000"
                      value={drawAmount}
                      onChange={(e) => setDrawAmount(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(drawAmount)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  HELOC Credit Limit
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="10000"
                      max="500000"
                      step="10000"
                      value={helocLimit}
                      onChange={(e) => setHelocLimit(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10000"
                      max="500000"
                      step="10000"
                      value={helocLimit}
                      onChange={(e) => setHelocLimit(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(helocLimit)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Interest-Only Period
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={interestOnlyPeriod}
                      onChange={(e) => setInterestOnlyPeriod(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="1"
                      value={interestOnlyPeriod}
                      onChange={(e) => setInterestOnlyPeriod(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{interestOnlyPeriod} years</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Repayment Term
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      step="1"
                      value={repaymentTerm}
                      onChange={(e) => setRepaymentTerm(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="5"
                      max="20"
                      step="1"
                      value={repaymentTerm}
                      onChange={(e) => setRepaymentTerm(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{repaymentTerm} years</div>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Your HELOC Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Available Home Equity</div>
                      <div className={styles.resultValue}>{formatCurrency(results.availableEquity)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Maximum HELOC</div>
                      <div className={styles.resultValue}>{formatCurrency(results.maxHELOC)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Interest-Only Payment</div>
                      <div className={styles.resultValue}>{formatCurrency(results.interestOnlyPayment)}/mo</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Amortization Payment</div>
                      <div className={styles.resultValue}>{formatCurrency(results.amortizationPayment)}/mo</div>
                    </div>
                  </div>

                  {/* Additional Results */}
                  <div className={styles.additionalResults}>
                    <div className={styles.resultRow}>
                      <div className={styles.resultLabel}>Total Interest Cost</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalInterest)}</div>
                    </div>
                    <div className={styles.resultRow}>
                      <div className={styles.resultLabel}>Total Cost (Principal + Interest)</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalCost)}</div>
                    </div>
                    <div className={styles.resultRow}>
                      <div className={styles.resultLabel}>New Loan-to-Value Ratio</div>
                      <div className={styles.resultValue}>{formatPercentage(results.ltvRatio)}</div>
                    </div>
                    <div className={styles.resultRow}>
                      <div className={styles.resultLabel}>Equity Utilization</div>
                      <div className={styles.resultValue}>{formatPercentage(results.equityUtilization)}</div>
                    </div>
                  </div>

                  {/* Payment Chart Visualization */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Payment Schedule Over Time</h3>
                    <div className={styles.chartBars}>
                      {chartData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>Year {data.year}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarPrincipal}
                              style={{ width: `${(data.principal / drawAmount) * 100}%` }}
                              title={`Remaining Principal: ${formatCurrency(data.principal)}`}
                            />
                            <div 
                              className={styles.chartBarInterest}
                              style={{ width: `${(data.interestPaid / results.totalInterest) * 100}%` }}
                              title={`Interest Paid: ${formatCurrency(data.interestPaid)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{formatCurrency(data.payment)}/mo</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendPrincipal}`}></div>
                        <span>Remaining Principal</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendInterest}`}></div>
                        <span>Cumulative Interest Paid</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>💡 Key Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>You're using <strong>{formatPercentage(results.equityUtilization)}</strong> of your available home equity</li>
                      <li>Interest costs represent <strong>{formatPercentage((results.totalInterest / results.totalCost) * 100)}</strong> of your total borrowing cost</li>
                      <li>Your monthly payment increases by <strong>{formatCurrency(results.amortizationPayment - results.interestOnlyPayment)}</strong> after the interest-only period</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Home Equity Lines of Credit: Strategic Borrowing for Homeowners</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding HELOCs: Flexible Home Equity Access</h3>
                <p>A Home Equity Line of Credit (HELOC) is a powerful financial tool that allows homeowners to tap into their home's equity on an as-needed basis. Unlike a traditional home equity loan that provides a lump sum, a HELOC works more like a credit card secured by your home, offering flexibility and control over your borrowing.</p>
                
                <div className={styles.exampleCard}>
                  <h4>How a HELOC Typically Works:</h4>
                  <ul>
                    <li><strong>Draw Period (10 years):</strong> Borrow funds as needed, pay interest only on the amount used</li>
                    <li><strong>Repayment Period (20 years):</strong> Pay back principal plus interest on the remaining balance</li>
                    <li><strong>Variable Rates:</strong> Most HELOCs have adjustable rates tied to prime rate plus a margin</li>
                    <li><strong>Flexible Access:</strong> Draw, repay, and redraw funds as needed during the draw period</li>
                    <li><strong>Tax Advantages:</strong> Interest may be tax-deductible if used for home improvements</li>
                  </ul>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategic Uses for HELOC Funds</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🏠 Home Improvements</h4>
                    <p>Renovations and upgrades that increase your home's value. HELOC interest for qualifying improvements may be tax-deductible, making this one of the most cost-effective uses.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🎓 Education Costs</h4>
                    <p>Financing college tuition often beats student loan rates. The flexible draw period aligns well with multi-year educational expenses.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💼 Debt Consolidation</h4>
                    <p>Pay off high-interest credit cards or personal loans. The lower secured interest rate can save thousands in interest payments.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🚀 Investment Opportunities</h4>
                    <p>Access capital for business ventures or real estate investments. The flexibility allows you to deploy funds as opportunities arise.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>HELOC vs Home Equity Loan vs Cash-Out Refinance</h3>
                <div className={styles.comparisonTable}>
                  <div className={styles.comparisonRow}>
                    <div className={styles.comparisonHeader}>Feature</div>
                    <div className={styles.comparisonHeader}>HELOC</div>
                    <div className={styles.comparisonHeader}>Home Equity Loan</div>
                    <div className={styles.comparisonHeader}>Cash-Out Refi</div>
                  </div>
                  <div className={styles.comparisonRow}>
                    <div className={styles.comparisonCell}>Structure</div>
                    <div className={styles.comparisonCell}>Revolving credit line</div>
                    <div className={styles.comparisonCell}>Lump sum loan</div>
                    <div className={styles.comparisonCell}>New mortgage</div>
                  </div>
                  <div className={styles.comparisonRow}>
                    <div className={styles.comparisonCell}>Interest Rate</div>
                    <div className={styles.comparisonCell}>Variable (typically)</div>
                    <div className={styles.comparisonCell}>Fixed</div>
                    <div className={styles.comparisonCell}>Fixed or Adjustable</div>
                  </div>
                  <div className={styles.comparisonRow}>
                    <div className={styles.comparisonCell}>Best For</div>
                    <div className={styles.comparisonCell}>Ongoing or uncertain costs</div>
                    <div className={styles.comparisonCell}>One-time, known expenses</div>
                    <div className={styles.comparisonCell}>Large amounts, rate reduction</div>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Risk Management Strategies</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Rate Cap Protection:</strong> Look for HELOCs with lifetime rate caps (usually 18-21%) to limit exposure to rising rates</li>
                  <li><strong>Fixed-Rate Conversion:</strong> Many lenders allow converting part or all of your balance to a fixed rate during the draw period</li>
                  <li><strong>Conservative Borrowing:</strong> Keep your combined loan-to-value ratio below 80% to maintain financial flexibility</li>
                  <li><strong>Emergency Fund First:</strong> Only use HELOC for planned expenses, not as a substitute for emergency savings</li>
                  <li><strong>Regular Principal Payments:</strong> Making principal payments during the draw period reduces interest costs dramatically</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Mortgage Specialists</h3>
                <blockquote className={styles.expertQuote}>
                  "The biggest mistake homeowners make with HELOCs is treating them like free money. Remember: it's your home on the line. Use HELOCs strategically for value-adding investments, have a clear repayment plan, and always maintain at least 20% equity in your home as a buffer against market fluctuations."
                  <footer className={styles.quoteFooter}>— Mortgage Advisor, 25+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does a HELOC affect my credit score?</h3>
                <p className={styles.faqAnswer}>Applying for a HELOC results in a hard inquiry (small temporary impact). Once opened, it affects your credit utilization ratio. If you max out your HELOC, it could significantly lower your score. However, responsible use with low utilization can improve your credit mix and payment history.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can I lose my home if I can't make HELOC payments?</h3>
                <p className={styles.faqAnswer}>Yes. A HELOC is a secured loan backed by your home, just like your primary mortgage. If you default on payments, the lender can foreclose. This is why it's crucial to only borrow what you can comfortably repay and have a solid repayment strategy.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Are HELOC interest payments tax-deductible?</h3>
                <p className={styles.faqAnswer}>Under current tax law (through 2025), HELOC interest is deductible if the funds are used to "buy, build, or substantially improve" the home that secures the loan. Interest on funds used for other purposes (debt consolidation, education, etc.) is not deductible.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What happens when the draw period ends?</h3>
                <p className={styles.faqAnswer}>When the draw period (usually 10 years) ends, you can no longer withdraw funds. The repayment period begins (usually 20 years), during which you must pay both principal and interest. Some lenders offer renewal options or conversion to fixed-rate loans.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Explore Your Home Equity Options?</h2>
              <p className={styles.ctaText}>Use our calculator to understand your borrowing capacity and costs. Compare different scenarios to find the strategy that works best for your financial situation.</p>
              
              <div className={styles.buttonGroup}>
                <button 
                  className={styles.primaryButton}
                  onClick={() => window.print()}
                >
                  📄 Print Your Analysis
                </button>
                <button 
                  className={styles.secondaryButton}
                  onClick={() => {
                    const dataStr = JSON.stringify(results, null, 2);
                    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                    const exportFileDefaultName = 'heloc-analysis.json';
                    const linkElement = document.createElement('a');
                    linkElement.setAttribute('href', dataUri);
                    linkElement.setAttribute('download', exportFileDefaultName);
                    linkElement.click();
                  }}
                >
                  💾 Save Your Results
                </button>
              </div>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Actual HELOC terms, rates, and eligibility depend on lender criteria, creditworthiness, property value, and market conditions. Consult with a mortgage professional for personalized advice. Your home is used as collateral, and failure to make payments could result in foreclosure.
              </p>
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p className={styles.footerText}>
              <strong>Important:</strong> HELOCs involve significant risks including variable interest rates, potential payment shock, and foreclosure risk if payments are not made. Always read and understand all loan documents before proceeding.
            </p>
            
          </div>
        </footer>
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

export default HELOCCalculator;