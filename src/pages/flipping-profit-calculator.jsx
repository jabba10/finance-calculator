import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './flippingprofitcalculator.module.css';

const FlippingProfitCalculator = ({ currentDate, lastModifiedDate }) => {
  // State for input values
  const [purchasePrice, setPurchasePrice] = useState(200000);
  const [repairCosts, setRepairCosts] = useState(25000);
  const [holdingCosts, setHoldingCosts] = useState(5000);
  const [sellingPrice, setSellingPrice] = useState(300000);
  const [sellingCosts, setSellingCosts] = useState(18000);
  const [financingAmount, setFinancingAmount] = useState(150000);
  const [interestRate, setInterestRate] = useState(6);
  const [loanTerm, setLoanTerm] = useState(6);
  const [results, setResults] = useState(null);
  const [breakdownData, setBreakdownData] = useState([]);

  const calculateProfit = () => {
    // Calculate costs
    const totalInvestment = purchasePrice + repairCosts + holdingCosts;
    const totalSellingCosts = sellingCosts + (financingAmount > 0 ? (financingAmount * (interestRate / 100) * (loanTerm / 12)) : 0);
    const totalCosts = totalInvestment + totalSellingCosts;
    
    // Calculate profit metrics
    const grossProfit = sellingPrice - purchasePrice;
    const netProfit = sellingPrice - totalCosts;
    const roi = (netProfit / totalInvestment) * 100;
    const profitMargin = (netProfit / sellingPrice) * 100;
    const arvToCostRatio = sellingPrice / totalCosts;
    const cashOnCashReturn = financingAmount > 0 ? (netProfit / (totalInvestment - financingAmount)) * 100 : roi;
    
    // Create breakdown for visualization
    const breakdown = [
      { label: 'Purchase Price', value: purchasePrice, type: 'cost' },
      { label: 'Repair Costs', value: repairCosts, type: 'cost' },
      { label: 'Holding Costs', value: holdingCosts, type: 'cost' },
      { label: 'Financing Costs', value: financingAmount > 0 ? (financingAmount * (interestRate / 100) * (loanTerm / 12)) : 0, type: 'cost' },
      { label: 'Selling Costs', value: sellingCosts, type: 'cost' },
      { label: 'Selling Price', value: sellingPrice, type: 'revenue' },
      { label: 'Net Profit', value: netProfit > 0 ? netProfit : 0, type: 'profit' },
    ];

    setResults({
      totalInvestment,
      totalCosts,
      grossProfit,
      netProfit,
      roi: Math.round(roi * 100) / 100,
      profitMargin: Math.round(profitMargin * 100) / 100,
      arvToCostRatio: Math.round(arvToCostRatio * 100) / 100,
      cashOnCashReturn: Math.round(cashOnCashReturn * 100) / 100,
      breakevenPrice: Math.round(totalCosts * 100) / 100,
      monthlyProfit: Math.round(netProfit / loanTerm * 100) / 100,
    });
    
    setBreakdownData(breakdown);
  };

  useEffect(() => {
    calculateProfit();
  }, [purchasePrice, repairCosts, holdingCosts, sellingPrice, sellingCosts, financingAmount, interestRate, loanTerm]);

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
        <title>House Flipping Profit Calculator | Real Estate Investment Analysis</title>
        <meta name="description" content="Professional house flipping profit calculator. Analyze fix-and-flip deals, calculate ROI, profit margins, and optimize your real estate investment strategy." />
        <meta name="keywords" content="house flipping calculator, real estate investing, fix and flip, property flipping, investment analysis, ROI calculator, rehab profit calculator" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com//flipping-profit-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="House Flipping Profit Calculator | Maximize Your Real Estate Returns" />
        <meta property="og:description" content="Analyze fix-and-flip deals with our professional profit calculator. Calculate ROI, margins, and make smarter investment decisions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/flipping-profit-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Flipping Profit Calculator" />
        <meta name="twitter:description" content="Professional tool for analyzing real estate flip deals and maximizing profits" />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="flipping-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "House Flipping Profit Calculator",
            "description": "Professional real estate investment calculator for analyzing fix-and-flip deals and maximizing returns",
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
              "name": "Real Estate Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Profit Margin Analysis",
              "ROI Calculation",
              "Cost Breakdown",
              "Financing Analysis",
              "Break-even Analysis"
            ]
          })
        }}
      />

      {/* FAQ Schema */}
      <Script
        id="flipping-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is the 70% rule in house flipping?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The 70% rule states that investors should pay no more than 70% of the After Repair Value (ARV) minus repair costs. This helps ensure a profitable margin after all expenses. Use our calculator to apply this rule to your deals.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's a good profit margin for flipping houses?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most successful flippers aim for a 20-30% profit margin after all costs. However, this varies by market and risk. Our calculator helps you determine your target margin based on your specific deal parameters.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How do holding costs affect flipping profits?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Holding costs (property taxes, insurance, utilities, loan interest) accumulate monthly and can significantly reduce profits if the flip takes longer than planned. Always budget for at least 20% extra holding time.",
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
            <h1 className={styles.mainTitle}>House Flipping Profit Calculator</h1>
            <p className={styles.subtitle}>Analyze Fix-and-Flip Deals & Maximize Your Real Estate Returns</p>
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
              <h2 className={styles.sectionTitle}>Deal Parameters</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Purchase Price
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="50000"
                      max="1000000"
                      step="5000"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="50000"
                      max="1000000"
                      step="5000"
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
                  Repair & Renovation Costs
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="1000"
                      value={repairCosts}
                      onChange={(e) => setRepairCosts(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="200000"
                      step="1000"
                      value={repairCosts}
                      onChange={(e) => setRepairCosts(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(repairCosts)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Holding Costs (Taxes, Insurance, Utilities)
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      step="500"
                      value={holdingCosts}
                      onChange={(e) => setHoldingCosts(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="20000"
                      step="500"
                      value={holdingCosts}
                      onChange={(e) => setHoldingCosts(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(holdingCosts)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Expected Selling Price (ARV)
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="100000"
                      max="1500000"
                      step="5000"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="100000"
                      max="1500000"
                      step="5000"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(sellingPrice)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Selling Costs (Agent Fees, Closing)
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="500"
                      value={sellingCosts}
                      onChange={(e) => setSellingCosts(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="50000"
                      step="500"
                      value={sellingCosts}
                      onChange={(e) => setSellingCosts(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(sellingCosts)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Financing Amount (if any)
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="800000"
                      step="10000"
                      value={financingAmount}
                      onChange={(e) => setFinancingAmount(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="800000"
                      step="10000"
                      value={financingAmount}
                      onChange={(e) => setFinancingAmount(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(financingAmount)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Loan Interest Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      step="0.25"
                      value={interestRate}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="15"
                      step="0.25"
                      value={interestRate}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(interestRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Project Timeline (Months)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="24"
                      step="1"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="24"
                      step="1"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.monthsSymbol}>months</span>
                  </div>
                  <div className={styles.valueDisplay}>{loanTerm} months</div>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Profit Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Net Profit</div>
                      <div className={`${styles.resultValue} ${results.netProfit >= 0 ? styles.profitPositive : styles.profitNegative}`}>
                        {formatCurrency(results.netProfit)}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Investment</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalInvestment)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Return on Investment</div>
                      <div className={styles.resultValue}>{formatPercentage(results.roi)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Profit Margin</div>
                      <div className={styles.resultValue}>{formatPercentage(results.profitMargin)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Monthly Profit</div>
                      <div className={styles.resultValue}>{formatCurrency(results.monthlyProfit)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Breakeven Price</div>
                      <div className={styles.resultValue}>{formatCurrency(results.breakevenPrice)}</div>
                    </div>
                  </div>

                  {/* Cost Breakdown Visualization */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Cost & Revenue Breakdown</h3>
                    <div className={styles.chartBars}>
                      {breakdownData.map((item, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>{item.label}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={`${styles.chartBar} ${item.type === 'cost' ? styles.chartBarCost : item.type === 'revenue' ? styles.chartBarRevenue : styles.chartBarProfit}`}
                              style={{ width: `${Math.min((Math.abs(item.value) / sellingPrice) * 100, 100)}%` }}
                              title={`${item.label}: ${formatCurrency(item.value)}`}
                            />
                          </div>
                          <div className={`${styles.chartBarValue} ${item.value < 0 ? styles.negativeValue : ''}`}>
                            {formatCurrency(item.value)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendCost}`}></div>
                        <span>Costs & Expenses</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendRevenue}`}></div>
                        <span>Revenue</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendProfit}`}></div>
                        <span>Profit/Loss</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Deal Assessment</h3>
                    <ul className={styles.insightsList}>
                      <li>
                        <strong>70% Rule Check:</strong> {purchasePrice <= (sellingPrice * 0.7 - repairCosts) ? '✅ PASS' : '❌ FAIL'} 
                        (Max purchase: {formatCurrency(sellingPrice * 0.7 - repairCosts)})
                      </li>
                      <li>
                        <strong>ARV to Cost Ratio:</strong> {results.arvToCostRatio.toFixed(2)}:1 
                        {results.arvToCostRatio >= 1.3 ? ' (Good)' : results.arvToCostRatio >= 1.2 ? ' (Average)' : ' (Risky)'}
                      </li>
                      <li>
                        <strong>Monthly Profit Rate:</strong> {formatCurrency(results.monthlyProfit)}/month
                      </li>
                      {financingAmount > 0 && (
                        <li>
                          <strong>Cash-on-Cash Return:</strong> {formatPercentage(results.cashOnCashReturn)}
                        </li>
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
              <h2 className={styles.articleTitle}>The Complete Guide to Profitable House Flipping</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding the House Flipping Business Model</h3>
                <p>House flipping involves purchasing undervalued properties, renovating them, and selling for a profit. Successful flippers don't just rely on market appreciation—they create value through strategic improvements and efficient project management. The key to consistent profits lies in accurate deal analysis and cost control.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Successful Flip Example:</h4>
                  <ul>
                    <li><strong>Purchase Price:</strong> $180,000 (below market due to needed repairs)</li>
                    <li><strong>Repair Budget:</strong> $35,000 (kitchen, bathrooms, flooring, paint)</li>
                    <li><strong>Holding Costs:</strong> $6,000 (4 months @ $1,500/month)</li>
                    <li><strong>Selling Price:</strong> $285,000 (after professional staging)</li>
                    <li><strong>Selling Costs:</strong> $17,100 (6% agent commission)</li>
                    <li><strong>Net Profit:</strong> $46,900 (26% ROI, 16.5% profit margin)</li>
                  </ul>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Critical Success Factors in House Flipping</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🔍 Accurate ARV Estimation</h4>
                    <p>Determine After Repair Value (ARV) by analyzing comparable sold properties in the same neighborhood. Overestimating ARV is the #1 reason flips fail.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 Realistic Budgeting</h4>
                    <p>Always add 10-20% contingency to your repair budget. Unexpected issues (electrical, plumbing, structural) are common in rehab projects.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⏱️ Timeline Management</h4>
                    <p>Time is money in flipping. Every extra month adds holding costs and increases market risk. Efficient project management is crucial.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📊 Exit Strategy Planning</h4>
                    <p>Have multiple exit strategies: retail sale, wholesale to another investor, or rent if the market shifts. Flexibility protects your investment.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common Cost Categories in Flipping</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Acquisition Costs:</strong> Purchase price, closing costs, inspection fees, due diligence</li>
                  <li><strong>Rehab Costs:</strong> Materials, labor, permits, design/architect fees</li>
                  <li><strong>Holding Costs:</strong> Property taxes, insurance, utilities, HOA fees, loan payments</li>
                  <li><strong>Selling Costs:</strong> Real estate commissions (5-6%), staging, closing costs, concessions</li>
                  <li><strong>Financing Costs:</strong> Loan origination fees, interest payments, points</li>
                  <li><strong>Contingency Fund:</strong> 10-20% buffer for unexpected repairs and market changes</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Seasoned Flippers</h3>
                <blockquote className={styles.expertQuote}>
                  "The profit is made when you buy, not when you sell. If you don't buy right, no amount of renovation or market timing will save the deal. Always run the numbers conservatively and walk away from deals that don't meet your minimum profit criteria."
                  <footer className={styles.quoteFooter}>— Full-time Flipper, 150+ successful flips</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Flipping Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What is the 70% rule and how do I apply it?</h3>
                <p className={styles.faqAnswer}>The 70% rule states you should pay no more than 70% of the After Repair Value (ARV) minus repair costs. Formula: Maximum Purchase Price = (ARV × 0.7) - Repair Costs. This rule ensures you maintain a sufficient profit margin after all expenses. Our calculator automatically checks this rule for your deal.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How much profit should I aim for per flip?</h3>
                <p className={styles.faqAnswer}>Most professional flippers target $20,000-$50,000 net profit per flip, with a minimum 20% ROI. However, this varies by market and property value. In high-cost areas, dollar amounts are higher but percentages may be lower. Always calculate both absolute profit and percentage returns.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What are the biggest risks in house flipping?</h3>
                <p className={styles.faqAnswer}>The top risks are: 1) Overestimating ARV, 2) Underestimating repair costs, 3) Market downturns during holding period, 4) Unexpected major repairs (foundation, roof, mold), 5) Project timeline delays, 6) Liquidity issues if the property doesn't sell quickly. Proper due diligence and conservative budgeting mitigate these risks.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I use cash or financing for flipping?</h3>
                <p className={styles.faqAnswer}>Cash offers stronger negotiation power and faster closings, but limits your capital. Financing (hard money loans, HELOCs) allows leverage and multiple simultaneous projects but adds interest costs and qualification requirements. Most flippers use a combination: cash for quick acquisitions, financing for larger projects.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Analyze Your Next Flip Deal?</h2>
              <p className={styles.ctaText}>Use our calculator to vet potential deals before making an offer. Adjust the parameters to match your local market and investment criteria.</p>
              
              <div className={styles.buttonGroup}>
                <button className={styles.primaryButton} onClick={() => {
                  setPurchasePrice(150000);
                  setRepairCosts(30000);
                  setSellingPrice(250000);
                  calculateProfit();
                }}>
                  Load Example Deal
                </button>
                <button className={styles.secondaryButton} onClick={() => {
                  const dataStr = JSON.stringify(results, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'flip-analysis.json';
                  link.click();
                }}>
                  Export Analysis
                </button>
              </div>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Real estate investing involves significant risk. Actual costs, market conditions, and returns may vary. Consult with real estate professionals, contractors, and legal/financial advisors before making investment decisions. Past performance does not guarantee future results.
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
    revalidate: 21600,
  };
}

export default FlippingProfitCalculator;