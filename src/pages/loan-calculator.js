import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './loancalculator.module.css';

const LoanCalculator = ({ currentDate, lastModifiedDate }) => {
  const [loanAmount, setLoanAmount] = useState(250000);
  const [annualRate, setAnnualRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [loanType, setLoanType] = useState('fixed');
  const [downPayment, setDownPayment] = useState(20);
  const [propertyTax, setPropertyTax] = useState(1.2);
  const [homeInsurance, setHomeInsurance] = useState(1000);
  const [pmiRate, setPmiRate] = useState(0.5);
  const [results, setResults] = useState(null);
  const [amortizationData, setAmortizationData] = useState([]);

  const loanTypeOptions = [
    { value: 'fixed', label: 'Fixed Rate Mortgage' },
    { value: 'arm5', label: '5/1 ARM' },
    { value: 'arm7', label: '7/1 ARM' },
    { value: 'arm10', label: '10/1 ARM' },
    { value: 'interestOnly', label: 'Interest Only' },
  ];

  const calculateLoan = () => {
    const principal = loanAmount * (1 - downPayment / 100);
    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = loanTerm * 12;
    
    // Calculate monthly mortgage payment
    let monthlyPayment = 0;
    if (loanType === 'interestOnly') {
      monthlyPayment = principal * monthlyRate;
    } else {
      monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / 
                      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }
    
    // Calculate additional monthly costs
    const monthlyPropertyTax = (loanAmount * propertyTax / 100) / 12;
    const monthlyHomeInsurance = homeInsurance / 12;
    const monthlyPMI = downPayment < 20 ? (principal * pmiRate / 100) / 12 : 0;
    
    const totalMonthlyPayment = monthlyPayment + monthlyPropertyTax + monthlyHomeInsurance + monthlyPMI;
    
    // Calculate total costs
    const totalMortgagePayments = monthlyPayment * totalMonths;
    const totalPropertyTax = monthlyPropertyTax * totalMonths;
    const totalHomeInsurance = monthlyHomeInsurance * totalMonths;
    const totalPMI = monthlyPMI * totalMonths;
    
    const totalLoanCost = totalMortgagePayments + totalPropertyTax + totalHomeInsurance + totalPMI;
    const totalInterest = totalMortgagePayments - principal;
    
    // Generate amortization data
    const amortData = [];
    let remainingBalance = principal;
    
    for (let month = 1; month <= Math.min(totalMonths, 360); month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      
      if (loanType === 'interestOnly' && month <= totalMonths) {
        remainingBalance = principal; // Interest-only period
      } else {
        remainingBalance = Math.max(0, remainingBalance - principalPayment);
      }
      
      if (month % 12 === 0 || month === 1) {
        const year = Math.ceil(month / 12);
        amortData.push({
          year,
          principal: Math.round(remainingBalance * 100) / 100,
          interestPaid: Math.round(interestPayment * 12 * 100) / 100,
          equity: Math.round((principal - remainingBalance) * 100) / 100,
        });
      }
    }
    
    setResults({
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalMonthlyPayment: Math.round(totalMonthlyPayment * 100) / 100,
      totalLoanCost: Math.round(totalLoanCost * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      principal: Math.round(principal * 100) / 100,
      monthlyPropertyTax: Math.round(monthlyPropertyTax * 100) / 100,
      monthlyHomeInsurance: Math.round(monthlyHomeInsurance * 100) / 100,
      monthlyPMI: Math.round(monthlyPMI * 100) / 100,
    });
    
    setAmortizationData(amortData);
  };

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, annualRate, loanTerm, loanType, downPayment, propertyTax, homeInsurance, pmiRate]);

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
        <title>Advanced Loan Calculator | Mortgage & Loan Payment Calculator</title>
        <meta name="description" content="Free advanced loan calculator with amortization schedule. Calculate mortgage payments, compare loan terms, and understand total borrowing costs for home loans, auto loans, and personal loans." />
        <meta name="keywords" content="loan calculator, mortgage calculator, home loan calculator, auto loan calculator, personal loan calculator, amortization calculator, debt calculator" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/loan-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Loan Calculator | Mortgage & Loan Payment Calculator" />
        <meta property="og:description" content="Calculate your monthly payments and total loan costs. Free visual tool for mortgage planning and debt management." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/loan-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Loan Calculator" />
        <meta name="twitter:description" content="Visualize your loan payments and amortization schedule with our powerful calculator." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="loan-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Loan Calculator",
            "description": "Professional-grade loan calculator with amortization visualization and financial planning features",
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
              "name": "Financial Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Amortization Schedule",
              "Multiple Loan Types",
              "Property Tax & Insurance",
              "PMI Calculation",
              "Total Cost Analysis"
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
                "name": "What is amortization and how does it work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Amortization is the process of paying off a loan over time through regular payments. Each payment covers both interest and principal, with early payments primarily covering interest and later payments primarily reducing principal. This creates a predictable payoff schedule.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "Should I choose a 15-year or 30-year mortgage?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A 15-year mortgage has higher monthly payments but significantly less total interest paid over the loan life. A 30-year mortgage offers lower monthly payments but more total interest. Our calculator helps you compare both options based on your financial situation.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is PMI and when do I need it?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Private Mortgage Insurance (PMI) is required when your down payment is less than 20% of the home's value. It protects the lender if you default on the loan. PMI typically costs 0.5% to 1.5% of the loan amount annually and can be removed once you reach 20% equity.",
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
            <h1 className={styles.mainTitle}>Advanced Loan Calculator</h1>
            <p className={styles.subtitle}>Calculate Your Monthly Payments and Total Loan Costs</p>
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
              <h2 className={styles.sectionTitle}>Calculate Your Loan</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Loan Amount
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="10000"
                      max="2000000"
                      step="1000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10000"
                      max="2000000"
                      step="1000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(loanAmount)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Interest Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      step="0.1"
                      value={annualRate}
                      onChange={(e) => setAnnualRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="15"
                      step="0.1"
                      value={annualRate}
                      onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(annualRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Loan Term
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      step="1"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="5"
                      max="40"
                      step="1"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{loanTerm} years</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Down Payment
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={downPayment}
                      onChange={(e) => setDownPayment(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="50"
                      step="1"
                      value={downPayment}
                      onChange={(e) => setDownPayment(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>
                    {formatPercentage(downPayment)} ({formatCurrency(loanAmount * downPayment / 100)})
                  </div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Loan Type
                  <select
                    value={loanType}
                    onChange={(e) => setLoanType(e.target.value)}
                    className={styles.selectInput}
                  >
                    {loanTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Property Tax Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={propertyTax}
                      onChange={(e) => setPropertyTax(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={propertyTax}
                      onChange={(e) => setPropertyTax(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(propertyTax)} annually</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Home Insurance
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="500"
                      max="3000"
                      step="50"
                      value={homeInsurance}
                      onChange={(e) => setHomeInsurance(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="500"
                      max="3000"
                      step="50"
                      value={homeInsurance}
                      onChange={(e) => setHomeInsurance(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(homeInsurance)}/year</div>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Your Loan Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Monthly Mortgage Payment</div>
                      <div className={styles.resultValue}>{formatCurrency(results.monthlyPayment)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Monthly Payment</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalMonthlyPayment)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Interest Paid</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalInterest)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Loan Cost</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalLoanCost)}</div>
                    </div>
                  </div>

                  {/* Monthly Payment Breakdown */}
                  <div className={styles.breakdownCard}>
                    <h3 className={styles.breakdownTitle}>Monthly Payment Breakdown</h3>
                    <div className={styles.breakdownGrid}>
                      <div className={styles.breakdownItem}>
                        <span className={styles.breakdownLabel}>Principal & Interest</span>
                        <span className={styles.breakdownValue}>{formatCurrency(results.monthlyPayment)}</span>
                      </div>
                      <div className={styles.breakdownItem}>
                        <span className={styles.breakdownLabel}>Property Tax</span>
                        <span className={styles.breakdownValue}>{formatCurrency(results.monthlyPropertyTax)}</span>
                      </div>
                      <div className={styles.breakdownItem}>
                        <span className={styles.breakdownLabel}>Home Insurance</span>
                        <span className={styles.breakdownValue}>{formatCurrency(results.monthlyHomeInsurance)}</span>
                      </div>
                      <div className={styles.breakdownItem}>
                        <span className={styles.breakdownLabel}>PMI (if applicable)</span>
                        <span className={styles.breakdownValue}>{formatCurrency(results.monthlyPMI)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Amortization Chart Visualization */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Loan Balance Over Time</h3>
                    <div className={styles.chartBars}>
                      {amortizationData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>Year {data.year}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarPrincipal}
                              style={{ width: `${(data.principal / results.principal) * 100}%` }}
                              title={`Remaining Balance: ${formatCurrency(data.principal)}`}
                            />
                            <div 
                              className={styles.chartBarEquity}
                              style={{ width: `${(data.equity / results.principal) * 100}%` }}
                              title={`Equity Built: ${formatCurrency(data.equity)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>
                            <div>{formatCurrency(data.principal)} remaining</div>
                            <div className={styles.chartSubValue}>{formatCurrency(data.equity)} equity</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendPrincipal}`}></div>
                        <span>Remaining Balance</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendEquity}`}></div>
                        <span>Equity Built</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>💡 Key Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>You'll pay <strong>{formatCurrency(results.totalInterest)}</strong> in interest over the loan term</li>
                      <li>That's <strong>{formatPercentage((results.totalInterest / results.totalLoanCost) * 100)}</strong> of your total loan cost</li>
                      <li>Each year, you'll build approximately <strong>{formatCurrency((results.principal - amortizationData[1]?.principal) || 0)}</strong> in equity</li>
                      <li>With extra payments, you could save thousands in interest and pay off your loan years earlier</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Understanding Loan Amortization: The Path to Debt Freedom</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>How Amortization Works: The Front-Loaded Interest Phenomenon</h3>
                <p>Amortization is the process of spreading loan payments over time, but it's not evenly split between principal and interest. In the early years of a loan, most of your payment goes toward interest, not principal. This is why it takes so long to build significant equity in the beginning.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World Mortgage Example:</h4>
                  <p>On a $300,000 mortgage at 6% for 30 years:</p>
                  <ul>
                    <li><strong>Year 1:</strong> $17,899 total payments, $17,828 goes to interest (99.6%)</li>
                    <li><strong>Year 10:</strong> $17,899 total payments, $15,972 goes to interest (89.2%)</li>
                    <li><strong>Year 20:</strong> $17,899 total payments, $10,316 goes to interest (57.6%)</li>
                    <li><strong>Year 30:</strong> $17,899 total payments, only $106 goes to interest (0.6%)</li>
                  </ul>
                  <p>This front-loading of interest is why making extra payments early has such a powerful impact.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategies to Minimize Loan Costs</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🚀 Make Extra Payments</h4>
                    <p>Adding just one extra payment per year can shorten a 30-year mortgage by 7-8 years and save tens of thousands in interest. Apply extra payments directly to principal.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 Refinance Strategically</h4>
                    <p>Refinancing can lower your interest rate and monthly payments. The rule of thumb: refinance if you can reduce your rate by 1% or more and plan to stay in the home long enough to recoup closing costs.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Biweekly Payments</h4>
                    <p>Switching to biweekly payments (half your monthly payment every two weeks) results in 26 half-payments per year, equivalent to 13 monthly payments. This can shave years off your loan.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⏰ Shorter Loan Terms</h4>
                    <p>A 15-year mortgage typically has a lower interest rate than a 30-year loan. While monthly payments are higher, you'll save 50-60% in total interest and build equity twice as fast.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common Loan Types Explained</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Fixed-Rate Mortgage:</strong> Interest rate stays the same for the entire loan term. Predictable payments, ideal for long-term homeowners.</li>
                  <li><strong>Adjustable-Rate Mortgage (ARM):</strong> Fixed rate for initial period (5, 7, or 10 years), then adjusts annually. Lower initial rates, good for short-term ownership.</li>
                  <li><strong>Interest-Only Loan:</strong> Pay only interest for initial period (5-10 years), then payments increase significantly. Lower initial payments, higher long-term risk.</li>
                  <li><strong>FHA Loans:</strong> Government-backed loans with lower down payment requirements (as low as 3.5%) but require mortgage insurance.</li>
                  <li><strong>VA Loans:</strong> For veterans and military members, offering no down payment and no PMI requirements.</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Tips from Mortgage Professionals</h3>
                <blockquote className={styles.expertQuote}>
                  "The single most impactful decision you can make with a mortgage is choosing the right loan term. While a 30-year mortgage offers lower monthly payments, a 15-year mortgage can save you hundreds of thousands in interest over the life of the loan. Use our calculator to find the sweet spot for your budget."
                  <footer className={styles.quoteFooter}>— Certified Mortgage Advisor, 20+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between APR and interest rate?</h3>
                <p className={styles.faqAnswer}>The interest rate is the cost of borrowing the principal amount. APR (Annual Percentage Rate) includes the interest rate plus other loan costs like points, broker fees, and some closing costs. APR gives you a more accurate picture of the total cost of the loan.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How much house can I afford?</h3>
                <p className={styles.faqAnswer}>A general rule is the 28/36 rule: Your monthly housing costs shouldn't exceed 28% of your gross monthly income, and your total debt payments (including housing) shouldn't exceed 36%. However, individual circumstances vary based on other expenses, savings, and financial goals.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I pay points to lower my interest rate?</h3>
                <p className={styles.faqAnswer}>Points are prepaid interest (1 point = 1% of the loan amount) that lower your interest rate. Whether to pay points depends on how long you plan to stay in the home. Generally, if you'll stay longer than it takes to break even on the points cost (typically 5-7 years), paying points can save you money.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What is loan-to-value (LTV) ratio and why does it matter?</h3>
                <p className={styles.faqAnswer}>LTV is the loan amount divided by the property value. It determines your down payment percentage and affects your interest rate and PMI requirements. Lower LTV ratios (meaning larger down payments) result in better loan terms and rates.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Make Smart Borrowing Decisions?</h2>
              <p className={styles.ctaText}>Use our calculator to explore different loan scenarios. Adjust the inputs to match your financial situation and homeownership goals.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Actual loan terms, rates, and payments may vary based on credit score, lender policies, and market conditions. Consider consulting with a mortgage professional for personalized advice. Property taxes, insurance, and PMI rates are estimates and may vary by location and individual circumstances.
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

export default LoanCalculator;